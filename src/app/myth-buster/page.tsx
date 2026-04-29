"use client";

import React from "react";
import { MythBuster } from "@/components/mythbuster/MythBuster";

export default function MythBusterPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12 text-center border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#FF9933] mb-3 block">Information Integrity</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6" style={{ color: "var(--text)" }}>
          Myth Buster.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          In an era of deepfakes and misinformation, we verify every claim against 
          official ECI records. No bias. Just the facts.
        </p>
      </div>
      
      <div className="py-12">
        <MythBuster />
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-24">
        <div className="p-12 rounded-[3rem] bg-indigo-900/10 border-2 border-indigo-500/20 text-center">
            <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>See something suspicious?</h3>
            <p className="text-slate-400 mb-8">If you have encountered an election-related claim that needs verification, use Voti to check our database or report it for review.</p>
            <a href="/voti" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#000080] text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20">
              Verify with Voti Assistant
            </a>
        </div>
      </div>
    </div>
  );
}
