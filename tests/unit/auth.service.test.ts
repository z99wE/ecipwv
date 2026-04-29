import { authService } from "@/services/auth.service";
import type { User } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";
import * as firebaseFirestore from "firebase/firestore";

jest.mock("@/lib/firebase", () => ({
  auth: {},
  googleProvider: {},
  db: {},
}));

jest.mock("firebase/auth", () => ({
  signInWithPopup: jest.fn(),
  signInAnonymously: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return () => undefined;
  }),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn((db, collectionName, id) => ({ collectionName, id })),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  serverTimestamp: jest.fn(() => "timestamp"),
  Timestamp: {
    now: jest.fn(() => "timestamp"),
  },
}));

const mockUser = {
  uid: "test-user",
  email: "tester@electiq.in",
  displayName: "ElectiQ Tester",
  photoURL: "https://example.com/avatar.png",
} as unknown as User;

const mockUserDoc = { collectionName: "voters", id: "test-user" };

const signInWithPopup = jest.mocked(firebaseAuth.signInWithPopup);
const createUserWithEmailAndPassword = jest.mocked(firebaseAuth.createUserWithEmailAndPassword);
const signInWithEmailAndPassword = jest.mocked(firebaseAuth.signInWithEmailAndPassword);
const setDoc = jest.mocked(firebaseFirestore.setDoc);
const getDoc = jest.mocked(firebaseFirestore.getDoc);
const doc = jest.mocked(firebaseFirestore.doc);

beforeEach(() => {
  jest.resetAllMocks();
  doc.mockReturnValue(mockUserDoc as never);
});

describe("authService", () => {
  test("loginWithGoogle creates a voter profile for a new Google user", async () => {
    signInWithPopup.mockResolvedValue({ user: mockUser });
    getDoc.mockResolvedValue({ exists: () => false, data: () => null });

    const result = await authService.loginWithGoogle();

    expect(signInWithPopup).toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalledWith(
      mockUserDoc,
      expect.objectContaining({
        uid: "test-user",
        email: "tester@electiq.in",
        displayName: "ElectiQ Tester",
      })
    );
    expect(result.profile.uid).toBe("test-user");
    expect(result.isNewUser).toBe(true);
  });

  test("loginWithEmail returns existing profile when user already exists", async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        uid: "test-user",
        email: "tester@electiq.in",
        displayName: "Existing User",
        photoURL: "",
        totalQueries: 5,
      }),
    });

    const result = await authService.loginWithEmail("tester@electiq.in", "password123");

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), "tester@electiq.in", "password123");
    expect(setDoc).toHaveBeenCalledWith(
      mockUserDoc,
      expect.any(Object),
      { merge: true }
    );
    expect(result.isNewUser).toBe(false);
    expect(result.profile.displayName).toBe("Existing User");
  });

  test("registerWithEmail stores a new voter profile", async () => {
    createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    getDoc.mockResolvedValue({ exists: () => false, data: () => null });

    const result = await authService.registerWithEmail("tester@electiq.in", "password123", "New Voter");

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), "tester@electiq.in", "password123");
    expect(setDoc).toHaveBeenCalledWith(
      mockUserDoc,
      expect.objectContaining({
        uid: "test-user",
        displayName: "New Voter",
        email: "tester@electiq.in",
      })
    );
    expect(result.isNewUser).toBe(true);
  });
});
