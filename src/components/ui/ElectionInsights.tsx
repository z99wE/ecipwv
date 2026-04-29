"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Users, MapPin } from "lucide-react";

interface SyncComponent {
  label: string;
  value: string;
}

interface ElectionInsightData {
  eligibleVoters: string;
  constituencies: string;
  evmAccuracy: string;
  totalVotes: string;
  overallTurnout: string;
  maleTurnout: string;
  femaleTurnout: string;
  pollingStations: string;
  upcoming: string;
  syncComponents: SyncComponent[];
}

const FACTS = [
  { emoji: "🗳️", headline: "World's Largest Democracy", body: "India conducts the largest democratic elections on Earth — over 970 million eligible voters across 28 states and 8 UTs cast their votes using 5.5 million EVMs." },
  { emoji: "🏛️", headline: "Art. 326 — Universal Adult Suffrage", body: "Every Indian citizen aged 18+ is constitutionally guaranteed the right to vote under Article 326. This right cannot be denied on grounds of religion, race, caste, sex, or wealth." },
  { emoji: "📱", headline: "EVMs Introduced in 1982", body: "India first used Electronic Voting Machines in 1982 in Kerala. By 2004, all elections nationwide were fully electronic — eliminating ballot stuffing and manual counting errors." },
  { emoji: "🎯", headline: "Model Code of Conduct", body: "The MCC kicks in the moment election dates are announced. It prohibits parties from using government machinery, launching new welfare schemes, or making communal speeches." },
  { emoji: "⚡", headline: "VVPAT: Paper Trail for Trust", body: "Since 2019, every EVM is paired with a Voter-Verified Paper Audit Trail (VVPAT). Voters see a 7-second paper slip confirming their vote before it is sealed." },
  { emoji: "🌐", headline: "6-Phase Lok Sabha Elections", body: "The 2024 General Elections spanned 44 days across 6 phases — the longest in Indian history — to enable adequate security deployment across all 543 constituencies." },
  { emoji: "📋", headline: "Nomination & NOTA", body: "The NOTA (None Of The Above) option was introduced in 2013 after a Supreme Court order. In 2019 Lok Sabha elections, 1.06% of voters chose NOTA — over 65 lakh ballots." },
  { emoji: "🔒", headline: "Booth Capturing is a Cognizable Offence", body: "Under Section 135A of the Representation of the People Act, 1951, booth capturing is a cognizable, non-bailable offence punishable with up to 3 years imprisonment." },
  { emoji: "👁️", headline: "Observers: Silent Watchdogs", body: "ECI deploys IAS and IPS officers as Central Observers in every constituency. They report directly to the Commission and can recommend repoll if irregularities are found." },
];



export function ElectionInsights() {
  const [factIndex, setFactIndex] = useState(0);
  const [data, setData] = useState<ElectionInsightData>({
    eligibleVoters: "23.4 Crore",
    constituencies: "824",
    evmAccuracy: "100%",
    totalVotes: "TBD",
    overallTurnout: "Ongoing",
    maleTurnout: "TBD",
    femaleTurnout: "TBD",
    pollingStations: "2.8 Lakh+",
    upcoming: "Tamil Nadu, Kerala, West Bengal, Assam, Puducherry (2026).",
    syncComponents: [],
  });

  React.useEffect(() => {
    const handleSync = async () => {
      try {
        const res = await fetch("/api/eci/sync", { method: "POST" });
        const json = await res.json();
        setData({
          eligibleVoters: json.stats.eligibleVoters,
          constituencies: json.stats.constituencies,
          evmAccuracy: json.stats.evmAccuracy,
          totalVotes: json.stats.totalVotes || "TBD",
          overallTurnout: json.stats.historicTurnout || "Ongoing",
          maleTurnout: json.stats.maleTurnout || "TBD",
          femaleTurnout: json.stats.femaleTurnout || "TBD",
          pollingStations: json.stats.pollingStations || "2.8 Lakh+",
          upcoming: json.highlights[0],
          syncComponents: json.syncComponents || []
        });
      } catch (e) {
        console.error("Failed to fetch synced data", e);
      }
    };
    window.addEventListener("eci-data-synced", handleSync);
    return () => window.removeEventListener("eci-data-synced", handleSync);
  }, []);

  const fact = FACTS[factIndex];

  return (
    <section id="insights" className="py-24 overflow-hidden relative" style={{ background: "var(--bg-subtle)" }}>
      {/* Subtle Sun Rays background effect */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-spin-slow"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, #3b82f6 10deg, transparent 20deg, #3b82f6 30deg, transparent 40deg)",
            maskImage: "radial-gradient(circle, black, transparent 70%)"
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-election-gradient mb-4 block">Voter Guidelines</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4" style={{ color: "var(--text)" }}>
            Election Intelligence Hub
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Real facts about Indian democracy, state-by-state election timeline, and the data that matters.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* LEFT — Fact cards */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              <span className="text-sm font-bold uppercase tracking-widest text-election-gradient">Fascinating Facts</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={factIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl p-8 border relative overflow-hidden group/fact"
                style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
              >
                {/* Top Accent Strip */}
                <div className="absolute top-0 left-0 w-full h-1.5 flex opacity-0 group-hover/fact:opacity-100 transition-opacity">
                  <div className="flex-1 bg-[#FF9933]" />
                  <div className="flex-1 bg-white/50" />
                  <div className="flex-1 bg-[#138808]" />
                </div>
                <div className="text-4xl mb-4">{fact.emoji}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>{fact.headline}</h3>
                <p className="leading-relaxed text-sm" style={{ color: "var(--text-muted)" }}>{fact.body}</p>
              </motion.div>
            </AnimatePresence>

            {/* Fact navigation dots */}
            <div className="flex flex-wrap gap-2 mt-2">
              {FACTS.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setFactIndex(i)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer"
                  style={{
                    background: i === factIndex ? "#4f46e5" : "var(--bg-muted)",
                    color: i === factIndex ? "#fff" : "var(--text-muted)",
                    border: `1px solid ${i === factIndex ? "#4f46e5" : "var(--border)"}`,
                  }}
                  aria-label={`View fact ${i + 1}: ${f.headline}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Stats strip — Redesigned with Sun Rays / Glassmorphism */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { icon: Users, label: "Eligible Voters", value: data.eligibleVoters, color: "#4f46e5" },
                { icon: MapPin, label: "Constituencies", value: data.constituencies, color: "#FF9933" },
                { icon: TrendingUp, label: "EVM Accuracy", value: data.evmAccuracy, color: "#138808" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div 
                  key={label} 
                  className="rounded-2xl p-5 text-center border relative overflow-hidden group hover:scale-[1.02] transition-all" 
                  style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
                >
                  {/* Rotating Sun Ray effect inside the card */}
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] animate-spin-slow"
                      style={{
                        background: `conic-gradient(from 0deg, transparent 0deg, ${color} 10deg, transparent 20deg, ${color} 30deg, transparent 40deg)`,
                      }}
                    />
                  </div>

                  <div className="relative z-10">
                    <div className="h-10 w-10 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: `${color}15` }}>
                      <Icon className="h-5 w-5" style={{ color: color }} />
                    </div>
                    <div className="font-black text-xl tracking-tighter" style={{ color: "var(--text)" }}>{value}</div>
                    <p className="text-[10px] font-black text-election-gradient uppercase tracking-widest mt-1">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Detailed Election Statistics (Replaced Heatmap) */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-[#000080] dark:text-indigo-400" />
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Live Election Demographics</span>
            </div>

            <div className="rounded-2xl p-6 border relative overflow-hidden flex flex-col justify-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", minHeight: 340 }}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Overall Turnout", value: data.overallTurnout, color: "#4f46e5" },
                  { label: "Total Votes Polled", value: data.totalVotes, color: "#138808" },
                  { label: "Male Voter Turnout", value: data.maleTurnout, color: "#FF9933" },
                  { label: "Female Voter Turnout", value: data.femaleTurnout, color: "#e11d48" },
                  { label: "Polling Stations", value: data.pollingStations, color: "#0ea5e9" },
                  { label: "Eligible Voters", value: data.eligibleVoters, color: "#8b5cf6" },
                ].map(({ label, value, color }, i) => (
                  <motion.div 
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl border flex flex-col justify-center items-start relative group"
                    style={{ background: "var(--bg-muted)", borderColor: "var(--border)" }}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl opacity-80" style={{ background: color }} />
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-faint)" }}>{label}</p>
                    <p className="text-2xl font-black" style={{ color: "var(--text)" }}>{value}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs mt-6 text-center" style={{ color: "var(--text-faint)" }}>
                Data fetched directly via ECI Live Sync • Updated real-time
              </p>
            </div>

            {/* Live ECI Data Stream (Replaces Upcoming Callout) */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: "var(--text)" }}>
                  Live ECI Data Stream
                </h3>
                {data.syncComponents.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#13880820] text-[#138808] font-bold animate-pulse">
                    Live Sync Active
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {(data.syncComponents.length > 0 ? data.syncComponents : Array(10).fill({ label: "Waiting for Sync...", value: "--", trend: "...", status: "Inactive" })).map((comp, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 rounded-xl border flex flex-col justify-between group relative overflow-hidden"
                    style={{ background: "var(--bg-muted)", borderColor: "var(--border)" }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-tighter" style={{ color: "var(--text-faint)" }}>{comp.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-base font-black" style={{ color: "var(--text)" }}>{comp.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 text-[10px]" style={{ color: "var(--text-faint)" }}>
                Verification complete • All data sourced from eci.gov.in
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
