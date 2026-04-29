/**
 * src/lib/firebase.ts
 * 
 * Modular Firebase v10+ SDK initialization.
 * Uses lazy initialization to support SSR / Next.js hybrid rendering.
 * Analytics is browser-only (client-side guard enforced).
 */

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import type { Analytics } from "firebase/analytics";
import type { FirebasePerformance } from "firebase/performance";

// ─── Config - use env vars, with fallback
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// ─── Singleton pattern — safe in Next.js hot-reload environment ─────────────
const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
// Initialize Firestore without specifying database URL (uses default)
const db: Firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Force Google to always show account picker
googleProvider.setCustomParameters({ prompt: "select_account" });

// ─── Firebase Analytics + Performance — browser-only, lazy ───────────────
let analyticsInstance: Analytics | null = null;
let performanceInstance: FirebasePerformance | null = null;

async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analyticsInstance) return analyticsInstance;
  try {
    const supported = await isAnalyticsSupported();
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  } catch {
    // Analytics blocked by browser extension — non-fatal
  }
  return analyticsInstance;
}

async function getPerformanceInstance(): Promise<FirebasePerformance | null> {
  if (typeof window === "undefined") return null;
  if (performanceInstance) return performanceInstance;
  try {
    // Performance doesn't have isSupported() method, so we just try to initialize it
    performanceInstance = getPerformance(app);
  } catch {
    // Performance instrumentation blocked or unsupported
  }
  return performanceInstance;
}

// Initialize analytics + performance eagerly in browser
if (typeof window !== "undefined") {
  getAnalyticsInstance().catch(() => null);
  getPerformanceInstance().catch(() => null);
}

export { app, auth, db, googleProvider, getAnalyticsInstance, getPerformanceInstance };
