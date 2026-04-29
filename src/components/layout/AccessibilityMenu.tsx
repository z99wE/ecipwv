"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Accessibility, 
  X, 
  Type, 
  Space, 
  TypeOutline, 
  Contrast, 
  Link as LinkIcon, 
  MousePointer2, 
  ImageOff
} from "lucide-react";

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    biggerText: false,
    textSpacing: false,
    dyslexiaFriendly: false,
    invertColors: false,
    highlightLinks: false,
    bigCursor: false,
    hideImages: false,
  });

  // Apply classes to document.documentElement based on settings
  useEffect(() => {
    const html = document.documentElement;
    const classMap: Record<keyof typeof settings, string> = {
      biggerText: "a11y-bigger-text",
      textSpacing: "a11y-text-spacing",
      dyslexiaFriendly: "a11y-dyslexia",
      invertColors: "a11y-invert",
      highlightLinks: "a11y-highlight-links",
      bigCursor: "a11y-big-cursor",
      hideImages: "a11y-hide-images",
    };

    Object.entries(settings).forEach(([key, isActive]) => {
      if (isActive) {
        html.classList.add(classMap[key as keyof typeof settings]);
      } else {
        html.classList.remove(classMap[key as keyof typeof settings]);
      }
    });

  }, [settings]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tools = [
    { key: "biggerText" as const, icon: Type, label: "Bigger Text" },
    { key: "textSpacing" as const, icon: Space, label: "Text Spacing" },
    { key: "dyslexiaFriendly" as const, icon: TypeOutline, label: "Dyslexia Friendly" },
    { key: "invertColors" as const, icon: Contrast, label: "Invert Colors" },
    { key: "highlightLinks" as const, icon: LinkIcon, label: "Highlight Links" },
    { key: "bigCursor" as const, icon: MousePointer2, label: "Big Cursor" },
    { key: "hideImages" as const, icon: ImageOff, label: "Hide Images" },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl transition-transform hover:scale-105"
        style={{ background: "#0f172a", color: "#ffffff", border: "2px solid #ffffff20" }}
        aria-label="Open Accessibility Tools"
      >
        <Accessibility className="h-6 w-6" />
        <span className="font-bold text-sm">Accessibility Tools</span>
      </button>

      {/* Overlay & Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-24 left-6 w-full max-w-md z-[101] rounded-[2rem] shadow-2xl border overflow-hidden flex flex-col"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)", maxHeight: "calc(100vh - 120px)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b" style={{ background: "#0f172a", borderColor: "var(--border)" }}>
                <h2 className="text-xl font-bold text-white">Accessibility Tools</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Grid of Tools */}
              <div className="p-6 overflow-y-auto" style={{ background: "var(--bg-subtle)" }}>
                <div className="grid grid-cols-2 gap-4">
                  {tools.map(({ key, icon: Icon, label }) => {
                    const isActive = settings[key];
                    return (
                      <button
                        key={key}
                        onClick={() => toggleSetting(key)}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all"
                        style={{
                          background: isActive ? "var(--bg)" : "var(--card-bg)",
                          borderColor: isActive ? "#FF9933" : "var(--border)",
                          boxShadow: isActive ? "0 0 0 1px #FF9933" : "none"
                        }}
                      >
                        <Icon 
                          className="h-8 w-8 mb-4 transition-colors" 
                          style={{ color: isActive ? "#FF9933" : "var(--text)" }} 
                        />
                        <span 
                          className="text-sm font-bold text-center"
                          style={{ color: isActive ? "#FF9933" : "var(--text)" }}
                        >
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
