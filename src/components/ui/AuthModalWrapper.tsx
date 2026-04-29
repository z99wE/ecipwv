"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/ui/AuthModal";

export function AuthModalWrapper() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Listen for custom event to open modal
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-auth-modal", handler);
    return () => window.removeEventListener("open-auth-modal", handler);
  }, []);

  // Close modal
  const handleClose = () => setIsOpen(false);

  // Show modal if user is not logged in AND not loading
  if (loading) return null;
  
  return <AuthModal isOpen={isOpen} onClose={handleClose} />;
}
