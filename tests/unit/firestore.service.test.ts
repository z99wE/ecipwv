import { firestoreService } from "@/services/firestore.service";
import * as firebaseFirestore from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

jest.mock("@/lib/firebase", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  increment: jest.fn(),
  serverTimestamp: jest.fn(() => "mock-timestamp"),
  Timestamp: {
    now: jest.fn(() => ({ toMillis: () => Date.now() })),
  },
}));

const getDocs = jest.mocked(firebaseFirestore.getDocs);
const getDoc = jest.mocked(firebaseFirestore.getDoc);
const setDoc = jest.mocked(firebaseFirestore.setDoc);
const addDoc = jest.mocked(firebaseFirestore.addDoc);

describe("firestoreService", () => {
  const mockUid = "test-uid-123";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("getVotiHistory retrieves and reverses messages", async () => {
    const mockDocs = [
      { id: "1", data: () => ({ uid: mockUid, role: "user", content: "hello", createdAt: null }) },
      { id: "2", data: () => ({ uid: mockUid, role: "model", content: "hi", createdAt: null }) },
    ];
    
    getDocs.mockResolvedValue({
      forEach: (callback: (doc: { id: string; data: () => Record<string, unknown> }) => void) => mockDocs.forEach(callback),
    } as unknown as firebaseFirestore.QuerySnapshot<firebaseFirestore.DocumentData>);

    const history = await firestoreService.getVotiHistory(mockUid, 2);

    expect(getDocs).toHaveBeenCalled();
    expect(history).toHaveLength(2);
    // Reversed: oldest first
    expect(history[0].id).toBe("2"); 
    expect(history[1].id).toBe("1");
  });

  test("saveVotiExchange performs multiple writes and counter increment", async () => {
    await firestoreService.saveVotiExchange(mockUid, "User Question", "AI Response", "Election Topic");

    // 2 messages saved + 1 profile update
    expect(addDoc).toHaveBeenCalledTimes(2);
    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        totalQueries: expect.anything(),
        lastQueryTopic: "Election Topic",
      }),
      { merge: true }
    );
  });

  test("saveECISync updates both global cache and user context", async () => {
    const mockPayload = { stats: { total: 100 } };
    await firestoreService.saveECISync(mockPayload, mockUid);

    expect(setDoc).toHaveBeenCalledTimes(2); // One global, one user
  });

  test("getECISync returns data when document exists", async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ source: "ECI", topic: "Rules", content: "..." }),
    } as unknown as firebaseFirestore.DocumentSnapshot);

    const result = await firestoreService.getECISync();
    expect(result).not.toBeNull();
    expect(result?.source).toBe("ECI");
  });
});
