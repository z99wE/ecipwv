"use client";

import React, { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ur", label: "Urdu", native: "اردو" },
];

function setGoogleTranslateCookie(value: string) {
  window.document.cookie = value;
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("en");
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Inject Google Translate script & trigger language change
  const activateGoogleTranslate = (langCode: string) => {
    setSelected(langCode);
    setOpen(false);

    if (langCode === "en") {
      // Reset to English
      const el = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (el) { el.value = "en"; el.dispatchEvent(new Event("change")); }
      // Try the cookie-based reset
      setGoogleTranslateCookie("googtrans=/en/en; path=/");
      window.location.reload();
      return;
    }

    // Try the Google Translate combo element first
    const el = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (el) {
      el.value = langCode;
      el.dispatchEvent(new Event("change"));
    } else {
      // Fall back to cookie approach
      setGoogleTranslateCookie(`googtrans=/en/${langCode}; path=/`);
      window.location.reload();
    }
  };

  const current = LANGUAGES.find((l) => l.code === selected) || LANGUAGES[0];

  return (
    <>
      {/* Hidden Google Translate element — styled away */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      <div ref={dropRef} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all cursor-pointer hover:border-[#000080]"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--card-bg)" }}
          aria-label="Select language"
          aria-expanded={open}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>{current.native}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div
            className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-xl z-50 overflow-hidden py-1 border"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => activateGoogleTranslate(lang.code)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all cursor-pointer hover:bg-[#00008010] text-left"
                style={{
                  color: selected === lang.code ? "#000080" : "var(--text)",
                  fontWeight: selected === lang.code ? 700 : 400,
                }}
              >
                <span>{lang.native}</span>
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>{lang.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Inject Google Translate script (call once in layout)
export function GoogleTranslateInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("gt-script")) return;

    // Google Translate initialization callback
    (window as unknown as Record<string, unknown>).googleTranslateElementInit = function () {
      const GT = (window as unknown as { google?: { translate?: { TranslateElement?: new (config: Record<string, unknown>, id: string) => void } } }).google?.translate?.TranslateElement;
      if (!GT) return;
      new GT(
        { pageLanguage: "en", includedLanguages: "hi,bn,te,mr,ta,gu,kn,ml,pa,ur,en", layout: 0 },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "gt-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);

    // Hide the Google Translate toolbar (it's ugly)
    const style = document.createElement("style");
    style.textContent = `.goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame { display: none !important; } body { top: 0 !important; }`;
    document.head.appendChild(style);
  }, []);

  return null;
}
