"use client";

import React, { useEffect, useState } from "react";
import { ElectiQLogo } from "@/components/ui/ElectiQLogo";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { RefreshCw, Volume2, VolumeX, LogOut, User, Loader2 } from "lucide-react";
import { useScreenReader } from "@/context/ScreenReaderContext";
import { AudioVisualizer } from "@/components/ui/AudioVisualizer";
import { useAuth } from "@/context/AuthContext";
import { getPerformanceInstance } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function ScreenReaderToggle() {
  const { isReading, startReading, stopReading } = useScreenReader();
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white dark:bg-slate-900 shadow-sm" style={{ borderColor: "var(--border)" }}>
      <AudioVisualizer active={isReading} />
      <button
        onClick={isReading ? stopReading : startReading}
        className="flex items-center gap-2 text-xs font-bold transition-all hover:text-[#000080] cursor-pointer"
        style={{ color: "var(--text-muted)" }}
      >
        {isReading ? (
          <>
            <VolumeX className="h-3 w-3" /> Stop Reading
          </>
        ) : (
          <>
            <Volume2 className="h-3 w-3" /> Listen
          </>
        )}
      </button>
    </div>
  );
}

import { AuthModal } from "@/components/ui/AuthModal";

function AuthButton() {
  const { user, logout, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  if (loading) {
    return (
      <div className="w-8 h-8 flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--text-faint)" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <motion.button
          id="header-auth-trigger"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal"))}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black transition-all cursor-pointer bg-white text-[#000080] border-2 border-[#000080] shadow-sm hover:shadow-md"
        >
          Sign In / Up
        </motion.button>
      </>
    );
  }

  return (
    <div className="relative">
      <button
        id="header-user-menu"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all hover:opacity-80"
        style={{ background: "rgba(0,0,128,0.08)", border: "1px solid rgba(0,0,128,0.2)" }}
        aria-label="User menu"
        aria-expanded={showDropdown}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName || "User"} className="w-6 h-6 rounded-full" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#000080] flex items-center justify-center">
            <User className="h-3 w-3 text-white" />
          </div>
        )}
        <span className="text-xs font-bold max-w-[100px] truncate" style={{ color: "#000080" }}>
          {user.isAnonymous ? "Anonymous" : (user.displayName?.split(" ")[0] || "Voter")}
        </span>
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-xl overflow-hidden z-50"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
              <p className="text-xs font-bold truncate" style={{ color: "var(--text)" }}>{user.isAnonymous ? "Anonymous Voter" : user.displayName}</p>
              {!user.isAnonymous && <p className="text-[10px] truncate" style={{ color: "var(--text-faint)" }}>{user.email}</p>}
            </div>
            <button
              onClick={async () => { setShowDropdown(false); await logout(); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold cursor-pointer transition-all hover:opacity-70"
              style={{ color: "var(--text-muted)" }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
      )}
    </div>
  );
}

export function Header() {
  const [isSyncing, setIsSyncing] = useState(false);
  const pathname = usePathname();

  const { user } = useAuth();

  useEffect(() => {
    getPerformanceInstance().catch(() => null);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/eci/sync", { 
        method: "POST",
        body: JSON.stringify({ uid: user?.uid || null }),
        headers: { "Content-Type": "application/json" }
      });
      await res.json();
      window.dispatchEvent(new CustomEvent('eci-data-synced'));
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsSyncing(false), 1000);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-3xl border-b border-white/5" style={{ background: "rgba(var(--bg-rgb), 0.4)" }}>
      <nav className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between" aria-label="Main navigation">
        <Link href="/" className="flex items-center">
          <ElectiQLogo size={32} />
        </Link>

        <div className="hidden md:flex space-x-10 items-center" role="menubar">
          {[
            { label: "Voti", href: "/voti" },
            { label: "Myth-Buster", href: "/myth-buster" },
            { label: "Find Booth", href: "/find-booth" },
            { label: "Protocols", href: "/protocols" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              className={`text-lg font-bold transition-all hover:text-[#FF9933] ${pathname === link.href ? 'text-[#FF9933]' : 'text-slate-400'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <ScreenReaderToggle />
          <LanguageSelector />
          <AuthButton />
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-6 py-2.5 rounded-full text-sm font-black transition-all active:scale-95 cursor-pointer shadow-lg hover:shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50 bg-[#000080] text-white"
            aria-label="Sync ECI election data"
          >
            {isSyncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
            {isSyncing ? "Syncing..." : "Sync ECI"}
          </button>
        </div>
      </nav>
    </header>
  );
}
