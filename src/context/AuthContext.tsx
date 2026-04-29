"use client";

/**
 * src/context/AuthContext.tsx
 *
 * Firebase Auth context provider — wraps the entire app to provide
 * the authenticated user state to all Client Components.
 *
 * Usage:
 *   const { user, profile, loading, signInWithGoogle, logout } = useAuth();
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { authService, VoterProfile } from "@/services/auth.service";

// ─── Context Interface ───────────────────────────────────────────────────────

interface AuthContextValue {
  /** The Firebase Auth user object, or null if not logged in */
  user: User | null;
  /** The Firestore VoterProfile for the current user */
  profile: VoterProfile | null;
  /** True while the auth state is being determined (show splash/loading) */
  loading: boolean;
  /** Trigger Google OAuth popup */
  signInWithGoogle: () => Promise<void>;
  /** Trigger Anonymous Login */
  signInAnonymously: () => Promise<void>;
  /** Login with Email/Password */
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  /** Register with Email/Password */
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  /** Sign out */
  logout: () => Promise<void>;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

// ─── Context Creation ────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<VoterProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch Firestore profile
        const voterProfile = await authService.getCurrentVoterProfile(
          firebaseUser.uid
        );
        setProfile(voterProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const result = await authService.loginWithGoogle();
    setUser(result.user);
    setProfile(result.profile);
  }, []);

  const signInAnonymously = useCallback(async () => {
    const result = await authService.loginAnonymously();
    setUser(result.user);
    setProfile(result.profile);
  }, []);

  const signInWithEmail = useCallback(async (email: string, pass: string) => {
    const result = await authService.loginWithEmail(email, pass);
    setUser(result.user);
    setProfile(result.profile);
  }, []);

  const registerWithEmail = useCallback(async (email: string, pass: string, name: string) => {
    const result = await authService.registerWithEmail(email, pass, name);
    setUser(result.user);
    setProfile(result.profile);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signInAnonymously,
        signInWithEmail,
        registerWithEmail,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
