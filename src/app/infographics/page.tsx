"use client";

import React from "react";
import { InfographicSection } from "@/components/infographic/InfographicSection";

export default function InfographicsPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12 text-center border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#FF9933] mb-3 block">Visual Intelligence</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6" style={{ color: "var(--text)" }}>
          Visual Engine.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Generate high-fidelity, branded infographics on any electoral topic. 
          Complex data, simplified through tricolor-aligned visuals.
        </p>
      </div>
      
      <div className="py-12">
        <InfographicSection />
      </div>
    </div>
  );
}
