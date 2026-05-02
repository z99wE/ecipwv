/**
 * src/services/auth.service.ts
 *
 * Google OAuth 2.0 — exclusive authentication provider for ElectiQ.
 * Creates/updates voter profiles in Firestore on first login.
 *
 * IAM Requirements:
 *   - Firebase Authentication: Google Sign-In provider enabled in Console
 *   - Firestore: Security Rules must allow authenticated users to read/write
 *     their own document (voters/{uid})
 */

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// ─── TypeScript Interfaces ───────────────────────────────────────────────────

export interface VoterProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastLogin: Timestamp | null;
  createdAt: Timestamp | null;
  /** Total number of Voti queries this voter has made */
  totalQueries?: number;
  /** The last election topic this voter asked about */
  lastQueryTopic?: string;
  /** The last cached ECI sync context for this voter */
  lastECIContext?: Record<string, unknown> | null;
  /** Last time this voter synced ECI data */
  lastECISync?: Timestamp | null;
}

export interface AuthResult {
  user: User;
  isNewUser: boolean;
  profile: VoterProfile;
}

// ─── Auth Service ────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Exclusive Google OAuth implementation.
   * Opens Google account picker popup, then upserts a VoterProfile in Firestore.
   * 
   * @returns AuthResult containing user info and profile
   */
  loginWithGoogle: async (): Promise<AuthResult> => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "voters", user.uid);
    const userSnap = await getDoc(userRef);
    const isNewUser = !userSnap.exists();

    const profileData: Partial<VoterProfile> = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp() as unknown as Timestamp,
    };

    if (isNewUser) {
      profileData.createdAt = serverTimestamp() as unknown as Timestamp;
      profileData.totalQueries = 0;
      await setDoc(userRef, profileData);
    } else {
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }

    const profile: VoterProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: null,
      createdAt: null,
      ...((isNewUser ? {} : userSnap.data()) as Partial<VoterProfile>),
    };

    return { user, isNewUser, profile };
  },

  /**
   * Anonymous login.
   * Useful for users who want to try the app without sharing details immediately.
   */
  loginAnonymously: async (): Promise<AuthResult> => {
    const result = await signInAnonymously(auth);
    const user = result.user;

    const userRef = doc(db, "voters", user.uid);
    const userSnap = await getDoc(userRef);
    const isNewUser = !userSnap.exists();

    const profile: VoterProfile = {
      uid: user.uid,
      email: null,
      displayName: "Anonymous Voter",
      photoURL: null,
      lastLogin: serverTimestamp() as unknown as Timestamp,
      createdAt: isNewUser ? (serverTimestamp() as unknown as Timestamp) : null,
      totalQueries: isNewUser ? 0 : (userSnap.data()?.totalQueries || 0),
    };

    if (isNewUser) {
      await setDoc(userRef, profile);
    } else {
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }

    return { user, isNewUser, profile };
  },

  /**
   * Login with Email and Password.
   * 
   * @param email - User email
   * @param pass - User password
   * @returns AuthResult
   */
  loginWithEmail: async (email: string, pass: string): Promise<AuthResult> => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const user = result.user;

    const userRef = doc(db, "voters", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const profile: VoterProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split("@")[0],
        photoURL: user.photoURL,
        lastLogin: serverTimestamp() as unknown as Timestamp,
        createdAt: serverTimestamp() as unknown as Timestamp,
        totalQueries: 0,
      };
      await setDoc(userRef, profile, { merge: true });
      return { user, isNewUser: true, profile };
    }

    const profile = userSnap.data() as VoterProfile;
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });

    return { user, isNewUser: false, profile };
  },

  /**
   * Register with Email and Password.
   * 
   * @param email - User email
   * @param pass - User password
   * @param name - Display name
   * @returns AuthResult
   */
  registerWithEmail: async (email: string, pass: string, name: string): Promise<AuthResult> => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;

    const userRef = doc(db, "voters", user.uid);
    const profile: VoterProfile = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: null,
      lastLogin: serverTimestamp() as unknown as Timestamp,
      createdAt: serverTimestamp() as unknown as Timestamp,
      totalQueries: 0,
    };

    await setDoc(userRef, profile);

    return { user, isNewUser: true, profile };
  },

  /** Sign out the current user from Firebase Auth */
  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  /**
   * Subscribe to auth state changes.
   * Returns an unsubscribe function — call it on component unmount.
   */
  onAuthChange: (callback: (user: User | null) => void): (() => void) => {
    return onAuthStateChanged(auth, callback);
  },

  /** 
   * Fetch a voter's Firestore profile by UID.
   * 
   * @param uid - The unique identifier of the voter
   * @returns The VoterProfile or null if not found
   */
  getCurrentVoterProfile: async (uid: string): Promise<VoterProfile | null> => {
    const userRef = doc(db, "voters", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data() as VoterProfile;
    }
    return null;
  },
};
