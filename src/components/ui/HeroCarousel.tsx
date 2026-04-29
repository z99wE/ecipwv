"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardPreview } from "@/components/ui/DashboardPreview";
import { TaglineRotator } from "@/components/ui/TaglineRotator";
import { useAuth } from "@/context/AuthContext";

const slides = [
  {
    headline: ["Democracy", "Verified."],
    accentLine: 1,
    cta1: { label: "Start Verification", href: "#mythbuster" },
    cta2: { label: "Learn how it works", href: "#features" },
    accent: "#000080",
  },
  {
    headline: ["Truth Has", "No Spin."],
    accentLine: 1,
    cta1: { label: "Bust a Myth", href: "#mythbuster" },
    cta2: { label: "See how it works", href: "#features" },
    accent: "#FF9933",
  },
  {
    headline: ["Complex Laws,", "Made Clear."],
    accentLine: 1,
    cta1: { label: "Generate Infographic", href: "#infographics" },
    cta2: { label: "See examples", href: "#infographics" },
    accent: "#138808",
  },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

function scrollTo(hash: string) {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const prev = useCallback(() => {
    setDir(-1);
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => {
    setDir(1);
    setIndex((i) => (i + 1) % slides.length);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Auto-advance
  useEffect(() => {
    const t = setTimeout(next, 5500);
    return () => clearTimeout(t);
  }, [index, next]);

  const slide = slides[index];

  return (
    <section id="content" className="relative py-16 overflow-hidden">
      {/* Animated background */}
      <div
        className="absolute inset-0 -z-10 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 70% at 30% -10%, ${slide.accent}22 0%, transparent 70%),
                       radial-gradient(ellipse 50% 50% at 80% 90%, ${slide.accent}18 0%, transparent 60%),
                       var(--bg)`,
        }}
      />
      <div className="absolute top-0 left-0 w-full h-[115%] -skew-y-3 origin-top-left bg-white/5 dark:bg-slate-800/10 -z-10" />

      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT — slide content */}
        <div className="max-w-xl min-h-[440px] flex flex-col justify-center">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="h-6 mb-6 overflow-hidden flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={index % 3}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="text-[10px] font-black uppercase tracking-[0.5em] bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"
                  >
                    {["Intelligence", "India", "Insights"][index % 3]}
                  </motion.span>
                </AnimatePresence>
              </div>
              <h1 className="text-[clamp(2.4rem,8vw,4rem)] md:text-[clamp(3.2rem,6vw,6rem)] font-extrabold tracking-tighter mb-8 leading-[0.9] break-words hyphens-auto" style={{ color: "var(--text)" }}>
                {slide.headline.map((line, li) => (
                  <span 
                    key={li} 
                    className={`block ${li === slide.accentLine ? "bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" : ""}`}
                  >
                    {line}
                  </span>
                ))}
              </h1>

              {/* Rotating feature copy lines */}
              <div className="mb-12 h-16 md:h-20 flex items-start">
                <TaglineRotator />
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollTo(slide.cta1.href)}
                  className="inline-flex items-center px-7 py-3.5 rounded-full font-bold text-white transition-all active:scale-95 cursor-pointer group shadow-lg"
                  style={{ background: slide.accent }}
                >
                  <span>{slide.cta1.label}</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollTo(slide.cta2.href)}
                  className="inline-flex items-center px-7 py-3.5 rounded-full font-bold text-white bg-white/10 border border-white/10 hover:bg-white/20 transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  {slide.cta2.label}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel controls — outside AnimatePresence so they never animate away */}
          <div className="mt-16 flex items-center space-x-5">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="p-2.5 rounded-full border border-white/10 hover:border-white/30 bg-slate-800/50 transition-all cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="p-2.5 rounded-full border border-white/10 hover:border-white/30 bg-slate-800/50 transition-all cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>

            <div className="flex space-x-2">
              {slides.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDir(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                  className="relative h-1.5 rounded-full transition-all duration-500 cursor-pointer overflow-hidden"
                  style={{
                    width: i === index ? "2.5rem" : "0.75rem",
                    background: i === index ? s.accent : "#e2e8f0",
                  }}
                >
                  {i === index && (
                    <motion.span
                      key={`fill-${index}`}
                      className="absolute inset-0 rounded-full"
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 5.5, ease: "linear" }}
                      style={{ background: slide.accent, opacity: 0.45 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Live Stats Tiles */}
        <div className="hidden lg:flex items-center justify-center relative min-h-[500px]">
          <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full -z-10 animate-pulse" />
          
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
            <StatsTile 
              label="Recent Turnout" 
              value="68.2%" 
              trend="+0.8%" 
              description="Avg. across 5 regions"
              delay={0.1}
            />
            <StatsTile 
              label="New Voters (30d)" 
              value="1.2M" 
              trend="+12%" 
              description="First-time registrations"
              delay={0.2}
            />
            <StatsTile 
              label="Voter IDs" 
              value="4.5L" 
              trend="Active" 
              description="Issued since March 26"
              delay={0.3}
            />
            <StatsTile 
              label="Phases Done" 
              value="2/5" 
              trend="Live" 
              description="Polling on schedule"
              delay={0.4}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsTile({ label, value, trend, description, delay }: { label: string, value: string, trend: string, description: string, delay: number }) {
  const { user } = useAuth();
  const [liveValue, setLiveValue] = useState(value);
  const [liveTrend, setLiveTrend] = useState(trend);

  // Load cached data on mount
  useEffect(() => {
    const loadCache = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/eci/sync?uid=${user.uid}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.stats) {
          if (label === "Recent Turnout") setLiveValue(data.stats.recentTurnout);
          if (label === "New Voters (30d)") setLiveValue(data.stats.recentVoters);
          if (label === "Voter IDs") setLiveValue(data.stats.voterIdsIssued);
          if (label === "Phases Done") setLiveValue(data.stats.phasesDone);
        }
      } catch (e) {
        console.error("Failed to load cached ECI stats", e);
      }
    };
    loadCache();
  }, [user, label]);

  useEffect(() => {
    const handleSync = async () => {
      try {
        const res = await fetch("/api/eci/sync", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user?.uid })
        });
        const data = await res.json();
        // Map the correct values from the last 30 days logic
        if (label === "Recent Turnout") setLiveValue(data.stats.recentTurnout);
        if (label === "New Voters (30d)") setLiveValue(data.stats.recentVoters);
        if (label === "Voter IDs") setLiveValue(data.stats.voterIdsIssued);
        if (label === "Phases Done") setLiveValue(data.stats.phasesDone);
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("eci-data-synced", handleSync);
    return () => window.removeEventListener("eci-data-synced", handleSync);
  }, [label, user]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="backdrop-blur-xl border rounded-3xl p-6 shadow-2xl transition-all group"
      style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
    >
      <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      <div className="text-3xl font-black tracking-tighter mb-1" style={{ color: "var(--text)" }}>
        {liveValue}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-all duration-300 group-hover:bg-emerald-500/30 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          {liveTrend}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">
          {description}
        </span>
      </div>
    </motion.div>
  );
}
