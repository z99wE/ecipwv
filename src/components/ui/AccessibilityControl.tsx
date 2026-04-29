"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Accessibility, X, Type, Eye, Contrast,
  MousePointer2, Image as ImageIcon,
  Heading1, MoveHorizontal
} from "lucide-react";

type AccessibilitySettings = {
  fontSize: number;
  contrast: number;
  isGrayscale: boolean;
  isDyslexic: boolean;
  highlightLinks: boolean;
  largeCursor: boolean;
  hideImages: boolean;
  lineSpacing: number;
  letterSpacing: number;
};

type ToggleTool = {
  id: "isDyslexic" | "isGrayscale" | "highlightLinks" | "largeCursor" | "hideImages";
  label: string;
  icon: typeof Heading1;
  toggle?: false;
};

type ContrastTool = {
  id: "contrast";
  label: string;
  icon: typeof Contrast;
  toggle: true;
};

type AccessibilityTool = ToggleTool | ContrastTool;

const ACCESSIBILITY_TOOLS: AccessibilityTool[] = [
  { id: 'isDyslexic', label: 'Dyslexia Font', icon: Heading1 },
  { id: 'isGrayscale', label: 'Grayscale', icon: Eye },
  { id: 'highlightLinks', label: 'Links Mask', icon: MoveHorizontal },
  { id: 'largeCursor', label: 'Big Cursor', icon: MousePointer2 },
  { id: 'hideImages', label: 'Hide Images', icon: ImageIcon },
  { id: 'contrast', label: 'High Contrast', icon: Contrast, toggle: true },
];

export function AccessibilityControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    contrast: 100,
    isGrayscale: false,
    isDyslexic: false,
    highlightLinks: false,
    largeCursor: false,
    hideImages: false,
    lineSpacing: 1.5,
    letterSpacing: 0
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--font-size-adjust", `${settings.fontSize}%`);
    root.style.setProperty("--contrast-adjust", `${settings.contrast}%`);
    root.style.setProperty("--grayscale-filter", settings.isGrayscale ? "100%" : "0%");
    root.style.setProperty("--letter-spacing-adjust", `${settings.letterSpacing}px`);
    root.style.setProperty("--line-height-adjust", `${settings.lineSpacing}`);
    
    if (settings.isDyslexic) root.classList.add("dyslexic-font");
    else root.classList.remove("dyslexic-font");

    if (settings.highlightLinks) root.classList.add("highlight-links");
    else root.classList.remove("highlight-links");

    if (settings.largeCursor) root.classList.add("large-cursor");
    else root.classList.remove("large-cursor");

    if (settings.hideImages) root.classList.add("hide-images");
    else root.classList.remove("hide-images");
  }, [settings]);

  const reset = () => {
    setSettings({
      fontSize: 100,
      contrast: 100,
      isGrayscale: false,
      isDyslexic: false,
      highlightLinks: false,
      largeCursor: false,
      hideImages: false,
      lineSpacing: 1.5,
      letterSpacing: 0
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-6 bottom-8 z-50 p-3 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
        style={{ background: "#000080", color: "white" }}
        aria-label="Accessibility Settings"
      >
        <Accessibility className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-3xl overflow-hidden flex flex-col max-h-[85vh]"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Accessibility className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight" style={{ color: "var(--text)" }}>Accessibility</h2>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" style={{ color: "var(--text-muted)" }} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
                {/* Text Size */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
                      <Type className="h-4 w-4" /> Text Size ({settings.fontSize}%)
                    </label>
                    <button onClick={reset} className="text-[10px] uppercase tracking-widest font-bold text-indigo-500 hover:underline">Reset All</button>
                  </div>
                  <input 
                    type="range" min="80" max="200" step="5"
                    value={settings.fontSize}
                    onChange={(e) => setSettings(s => ({ ...s, fontSize: parseInt(e.target.value) }))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Grid Tools */}
                <div className="grid grid-cols-2 gap-3">
                  {ACCESSIBILITY_TOOLS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.toggle) {
                          setSettings(s => ({ ...s, contrast: s.contrast === 150 ? 100 : 150 }));
                        } else {
                          setSettings(s => ({ ...s, [item.id]: !s[item.id as keyof typeof s] }));
                        }
                      }}
                      className="p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all hover:border-indigo-500 group"
                      style={{ 
                        background: (item.toggle ? settings.contrast === 150 : settings[item.id as keyof typeof settings]) ? "var(--bg-muted)" : "transparent",
                        borderColor: (item.toggle ? settings.contrast === 150 : settings[item.id as keyof typeof settings]) ? "#000080" : "var(--border)"
                      }}
                    >
                      <item.icon className={`h-5 w-5 ${(item.toggle ? settings.contrast === 150 : settings[item.id as keyof typeof settings]) ? "text-indigo-500" : "text-slate-400 group-hover:text-indigo-500"}`} />
                      <span className="text-xs font-bold" style={{ color: "var(--text)" }}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designed for Inclusivity</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
