import React, { useState } from "react";
import { X, Mail, Lock, User, Loader2, Ghost, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle, signInAnonymously, signInWithEmail, registerWithEmail } = useAuth();
  const [mode, setMode] = useState("choice");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const resetState = () => {
    setMode("choice");
    setError(null);
    setEmail("");
    setPassword("");
    setName("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      handleClose();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymously();
      handleClose();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Anonymous sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name);
      }
      handleClose();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.6)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={handleClose}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10001,
          width: '100%',
          maxWidth: '28rem',
          overflow: 'hidden',
          borderRadius: '1.5rem',
          backgroundColor: 'white',
          border: '1px solid var(--card-border)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          margin: '0 1rem',
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '1rem',
            padding: '0.5rem',
            borderRadius: '9999px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <X style={{ height: '1.25rem', width: '1.25rem', color: '#64748b' }} />
        </button>

        <div style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#000080',
              marginBottom: '0.5rem',
            }}>
              {mode === "choice" ? "Welcome to ElectiQ" : mode === "login" ? "Sign In" : "Create Account"}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {mode === "choice" ? "Choose how you'd like to join the democracy" : "Enter your details to continue"}
            </p>
          </div>

          {mode === "choice" ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={handleGoogle}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '1rem',
                  backgroundColor: 'white',
                  border: '2px solid #f1f5f9',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  color: '#334155',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? (
                  <Loader2 style={{ height: '1.25rem', width: '1.25rem', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <LogIn style={{ height: '1.25rem', width: '1.25rem', color: '#4285F4' }} />
                )}
                Continue with Google
              </button>

              <button
                onClick={() => setMode("login")}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '1rem',
                  backgroundColor: '#000080',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 128, 0.2)',
                  opacity: loading ? 0.5 : 1,
                  border: 'none',
                }}
              >
                <Mail style={{ height: '1.25rem', width: '1.25rem' }} />
                Email & Password
              </button>

              <div style={{ position: 'relative', margin: '1.5rem 0' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100%', borderTop: '1px solid #f1f5f9' }}></div>
                </div>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <span style={{ backgroundColor: 'white', padding: '0 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8' }}>or</span>
                </div>
              </div>

              <button
                onClick={handleAnonymous}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '1rem',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  opacity: loading ? 0.5 : 1,
                  border: 'none',
                }}
              >
                <Ghost style={{ height: '1.25rem', width: '1.25rem' }} />
                Continue Anonymously
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mode === "signup" && (
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', height: '1.25rem', width: '1.25rem', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '3rem',
                      paddingRight: '1rem',
                      paddingTop: '0.875rem',
                      paddingBottom: '0.875rem',
                      borderRadius: '1rem',
                      border: '2px solid #f1f5f9',
                      backgroundColor: 'transparent',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}

              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', height: '1.25rem', width: '1.25rem', color: '#94a3b8' }} />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                    paddingTop: '0.875rem',
                    paddingBottom: '0.875rem',
                    borderRadius: '1rem',
                    border: '2px solid #f1f5f9',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', height: '1.25rem', width: '1.25rem', color: '#94a3b8' }} />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                    paddingTop: '0.875rem',
                    paddingBottom: '0.875rem',
                    borderRadius: '1rem',
                    border: '2px solid #f1f5f9',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {error && (
                <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 'bold', padding: '0 0.5rem' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '1rem',
                  backgroundColor: '#000080',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 128, 0.2)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  border: 'none',
                }}
              >
                {loading ? <Loader2 style={{ height: '1.25rem', width: '1.25rem', animation: 'spin 1s linear infinite', margin: '0 auto' }} /> : (mode === "login" ? "Sign In" : "Create Account")}
              </button>

              <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: '#000080',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMode("choice")}
                style={{
                  width: '100%',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#94a3b8',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  paddingTop: '0.5rem',
                }}
              >
                ← Back to options
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
