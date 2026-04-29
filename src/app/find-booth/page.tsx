"use client";

import React from "react";
import { LocationWeather } from "@/components/location/LocationWeather";

export default function FindBoothPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12 text-center border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#138808] mb-3 block">Geospatial Intelligence</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6" style={{ color: "var(--text)" }}>
          Find Booth.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Locate your polling station instantly. Check live weather conditions and 
          plan your visit for the smoothest voting experience.
        </p>
      </div>
      
      <div className="py-12">
        <LocationWeather />
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-24">
        <div className="p-12 rounded-[3rem] bg-green-900/10 border-2 border-green-500/20 text-center">
            <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>Official ECI Booth Locator</h3>
            <p className="text-slate-400 mb-8">For final verification and room numbers, always cross-reference with the official ECI portal using your EPIC number.</p>
            <a 
              href="https://electoralsearch.eci.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#138808] text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-green-500/20"
            >
              Search ECI Database
            </a>
        </div>
      </div>
    </div>
  );
}
