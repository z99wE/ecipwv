"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

interface ScreenReaderContextType {
  isReading: boolean;
  startReading: () => void;
  stopReading: () => void;
  readElement: (text: string) => void;
}

const ScreenReaderContext = createContext<ScreenReaderContextType | undefined>(undefined);

export function ScreenReaderProvider({ children }: { children: React.ReactNode }) {
  const [isReading, setIsReading] = useState(false);
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopReading = useCallback(() => {
    if (synth) {
      synth.cancel();
      setIsReading(false);
    }
  }, [synth]);

  const startReading = useCallback(() => {
    if (!synth) return;
    
    stopReading();
    setIsReading(true);

    // Collect all text from main sections
    const content = document.querySelector("main")?.innerText || "";
    const utterance = new SpeechSynthesisUtterance(content.slice(0, 5000)); // Limit for performance
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    
    utteranceRef.current = utterance;
    synth.speak(utterance);
  }, [synth, stopReading]);

  const readElement = useCallback((text: string) => {
    if (!synth) return;
    stopReading();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    synth.speak(utterance);
  }, [synth, stopReading]);

  return (
    <ScreenReaderContext.Provider value={{ isReading, startReading, stopReading, readElement }}>
      {children}
    </ScreenReaderContext.Provider>
  );
}

export function useScreenReader() {
  const context = useContext(ScreenReaderContext);
  if (context === undefined) {
    throw new Error("useScreenReader must be used within a ScreenReaderProvider");
  }
  return context;
}
