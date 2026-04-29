"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic, Bot, Sparkles } from "lucide-react";
import { VotiOrb } from "./VotiOrb";

export function VotiVoiceEntry() {
  const handleOpenVoice = () => {
    window.dispatchEvent(new CustomEvent("open-voti", { detail: { mode: "voice" } }));
  };

  return (
    <section id="voti" className="py-32 relative overflow-hidden border-y" style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}>
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF993310] blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left: Interactive Orb */}
        <div className="relative group cursor-pointer order-2 md:order-1" onClick={handleOpenVoice}>
          {/* Waveform rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-white/10"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ 
                scale: [1, 1.5 + (i * 0.2)], 
                opacity: [0, 0.5, 0] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: i * 0.8,
                ease: "easeOut" 
              }}
            />
          ))}
          
          <VotiOrb size={380} active={true} />
          

        </div>

        {/* Right: Text & Action */}
        <div className="flex-1 text-center md:text-left order-1 md:order-2 max-w-xl group/entry">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white group-hover/entry:text-indigo-400 transition-colors duration-500">
            The Future of <br /> 
            <span className="text-election-gradient group-hover/entry:text-indigo-400 transition-colors duration-500">Election Guidance</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 leading-relaxed opacity-90 text-slate-300">
            Experience the world&apos;s first native voice assistant for the Indian electoral ecosystem. 
            Powered by <span className="font-bold text-election-gradient">Democratic Intelligence</span> for instant, high-fidelity democratic insights.
          </p>

          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <button
              onClick={handleOpenVoice}
              className="px-10 py-5 rounded-full text-white font-black text-xl cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-4 group"
              style={{ background: "linear-gradient(135deg, #000080, #000060)" }}
            >
              Start Chatting <Mic className="h-7 w-7 group-hover:animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
