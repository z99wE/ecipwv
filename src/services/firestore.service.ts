/**
 * src/services/firestore.service.ts
 *
 * Firestore service layer for ElectiQ using your specific collection IDs:
 *   - voters/D8JuRP53Tkf9wEedaHJ0        — Voter profiles (created on Google OAuth)
 *   - voti_history/gqn2cnPbv3sR8NLZB2M7  — Voti chat messages
 *   - election_data/hK02ktdqH4DJ8UjGUT1u — Cached ECI election facts
 *
 * Database: electiqfirestore
 */

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp,
  DocumentReference,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { VoterProfile } from "./auth.service";

// ─── TypeScript Interfaces ───────────────────────────────────────────────────

export interface ChatMessage {
  id?: string;
  uid: string;
  role: "user" | "model";
  content: string;
  topic?: string;
  createdAt?: Timestamp | null;
}

export interface ElectionDataRecord {
  id?: string;
  source: string;
  topic: string;
  content: string;
  fetchedAt: Timestamp | null;
}

export interface ECISyncPayload {
  stats?: Record<string, unknown>;
  [key: string]: unknown;
}

// ─── Firestore Service ───────────────────────────────────────────────────────

export const firestoreService = {
  // ── Voti Chat History ──────────────────────────────────────────────────────

  /**
   * Fetch the N most recent Voti chat messages for a voter.
   * Messages are ordered descending by time and then reversed for correct chat display.
   * 
   * @param uid - The unique identifier of the voter
   * @param limitCount - Max number of messages to retrieve (default 10)
   * @returns Array of ChatMessage objects
   */
  getVotiHistory: async (
    uid: string,
    limitCount: number = 10
  ): Promise<ChatMessage[]> => {
    const historyRef = collection(db, "voti_history");
    const q = query(
      historyRef,
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const messages: ChatMessage[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      messages.push({
        id: docSnap.id,
        uid: data.uid,
        role: data.role,
        content: data.content,
        topic: data.topic,
        createdAt: data.createdAt ?? null,
      });
    });

    // Reverse to get chronological order (oldest first)
    return messages.reverse();
  },

  /**
   * Persist a single chat turn to Firestore.
   * Returns the Firestore DocumentReference for the new message.
   */
  saveVotiMessage: async (
    message: Omit<ChatMessage, "id" | "createdAt">
  ): Promise<DocumentReference> => {
    const historyRef = collection(db, "voti_history");
    return addDoc(historyRef, {
      ...message,
      createdAt: serverTimestamp(),
    });
  },

  /**
   * Save both the user query and model response in one call (2 writes).
   * Also updates the voter's totalQueries counter and lastQueryTopic.
   */
  saveVotiExchange: async (
    uid: string,
    userQuery: string,
    modelResponse: string,
    topic?: string
  ): Promise<void> => {
    const historyRef = collection(db, "voti_history");

    // Save user message
    await addDoc(historyRef, {
      uid,
      role: "user",
      content: userQuery,
      topic: topic ?? null,
      createdAt: serverTimestamp(),
    });

    // Save model message
    await addDoc(historyRef, {
      uid,
      role: "model",
      content: modelResponse,
      topic: topic ?? null,
      createdAt: serverTimestamp(),
    });

    // Update voter profile counters
    const voterRef = doc(db, "voters", uid);
    await setDoc(
      voterRef,
      {
        totalQueries: increment(1),
        lastQueryTopic: topic ?? userQuery.slice(0, 80),
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );
  },

  // ── Voter Profiles ─────────────────────────────────────────────────────────

  /** Get the last N topics a voter asked about — for Voti's Memory UI */
  getVoterQueryTopics: async (
    uid: string,
    limitCount: number = 5
  ): Promise<string[]> => {
    const historyRef = collection(db, "voti_history");
    const q = query(
      historyRef,
      where("uid", "==", uid),
      where("role", "==", "user"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const topics: string[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const topic = data.topic || data.content?.slice(0, 60);
      if (topic) topics.push(topic);
    });

    return topics;
  },

  /**
   * Update a voter's profile with specific key-value pairs.
   * Merges with existing data.
   * 
   * @param uid - The unique identifier of the voter
   * @param updates - Partial object containing fields to update
   */
  updateVoterProfile: async (
    uid: string,
    updates: Partial<VoterProfile>
  ): Promise<void> => {
    const voterRef = doc(db, "voters", uid);
    await updateDoc(voterRef, updates);
  },

  // ── Election Data ──────────────────────────────────────────────────────────

  /**
   * Save ECI sync result to a global cache and optionally update user context.
   * The latest sync is stored at `election_data/latest_sync`.
   * 
   * @param data - The ECI sync payload including stats
   * @param uid - Optional voter UID to record who performed the sync
   */
  saveECISync: async (data: ECISyncPayload, uid?: string): Promise<void> => {
    // Global cache for the dashboard
    const globalRef = doc(db, "election_data", "latest_sync");
    await setDoc(globalRef, {
      ...data,
      fetchedAt: serverTimestamp(),
    });

    // If a user is logged in, record that they performed a sync
    if (uid) {
      const userRef = doc(db, "voters", uid);
      await setDoc(
        userRef,
        {
          lastECISync: serverTimestamp(),
          lastECIContext: data.stats, // Store some stats as context
        },
        { merge: true }
      );
    }
  },

  /**
   * Retrieve the most recent global ECI sync data.
   * 
   * @returns The latest ElectionDataRecord or null if not found
   */
  getECISync: async (): Promise<ElectionDataRecord | null> => {
    const docRef = doc(db, "election_data", "latest_sync");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as ElectionDataRecord;
    }
    return null;
  },

  /**
   * Read the voter's specific cached ECI context from their profile.
   * 
   * @param uid - The unique identifier of the voter
   * @returns Context object or null
   */
  getUserECIContext: async (uid: string): Promise<Record<string, unknown> | null> => {
    const voterRef = doc(db, "voters", uid);
    const snap = await getDoc(voterRef);
    if (!snap.exists()) return null;
    const context = snap.data()?.lastECIContext;
    return context && typeof context === "object" ? (context as Record<string, unknown>) : null;
  },

  /**
   * Get the last N topics a voter asked about — for Voti's Memory UI */
};
