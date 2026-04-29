"use client";

import React from "react";
import { CheckCircle2, Monitor, Printer, ShieldCheck, UserPlus, MapPin, Search } from "lucide-react";

interface InfographicProps {
  query: string;
}

export function DynamicInfographic({ query }: InfographicProps) {
  const q = query.toLowerCase();

  // ─── TOPIC 1: VVPAT ───────────────────────────────────────────
  if (q.includes("vvpat") || q.includes("paper slip")) {
    return (
      <div className="w-full bg-slate-950/40 backdrop-blur-3xl p-8 md:p-12 font-sans relative overflow-hidden flex flex-col items-center border border-white/10">
        {/* Tricolor Accent */}
        <div className="absolute top-0 left-0 w-full h-2 flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="text-center mb-10">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400 opacity-80 mb-2 block">Protocol Verification</span>
          <h2 className="text-3xl font-black text-white tracking-tighter">How VVPAT Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative z-10">
          <Step 
            icon={<Monitor className="h-8 w-8 text-indigo-400" />}
            number="1"
            title="Cast Your Vote"
            desc="Press the blue button on the Balloting Unit next to your candidate."
          />
          <Step 
            icon={<Printer className="h-8 w-8 text-[#FF9933]" />}
            number="2"
            title="Verify Slip"
            desc="A paper slip appears in the window for 7 seconds showing your choice."
          />
          <Step 
            icon={<CheckCircle2 className="h-8 w-8 text-[#138808]" />}
            number="3"
            title="Auto Deposit"
            desc="The slip automatically cuts and drops into the sealed box below."
          />
        </div>

        <div className="mt-12 flex items-center gap-4 text-[10px] font-bold text-indigo-400 opacity-50">
          <ShieldCheck className="h-4 w-4" />
          ECI STANDARDS · 100% AUDITABLE · VVPAT-8.1.2
        </div>

        {/* Watermark */}
        <div className="absolute bottom-4 right-6 text-[10px] font-black tracking-widest text-indigo-400 opacity-40 rotate-[-5deg]">
          CREATED WITH ELECTIQ
        </div>
      </div>
    );
  }

  // ─── TOPIC 2: REGISTRATION ──────────────────────────────────
  if (q.includes("register") || q.includes("enrol") || q.includes("voter id")) {
    return (
      <div className="w-full bg-slate-950/40 backdrop-blur-3xl p-8 md:p-12 font-sans relative overflow-hidden flex flex-col items-center border border-white/10">
        <div className="absolute top-0 left-0 w-full h-2 flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="text-center mb-10">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400 opacity-80 mb-2 block">Voter Enrollment</span>
          <h2 className="text-3xl font-black text-white tracking-tighter">Registration Guide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full relative z-10">
          <Step icon={<UserPlus className="h-6 w-6 text-[#FF9933]" />} number="1" title="Visit Portal" desc="voters.eci.gov.in" />
          <Step icon={<CheckCircle2 className="h-6 w-6 text-indigo-400" />} number="2" title="Fill Form 6" desc="New Voters" />
          <Step icon={<ShieldCheck className="h-6 w-6 text-[#138808]" />} number="3" title="Verification" desc="By BLO" />
          <Step icon={<Printer className="h-6 w-6 text-indigo-400" />} number="4" title="EPIC Delivery" desc="By Post" />
        </div>

        <div className="absolute bottom-4 right-6 text-[10px] font-black tracking-widest text-[#000080] opacity-20 rotate-[-5deg]">
          CREATED WITH ELECTIQ
        </div>
      </div>
    );
  }

  // ─── TOPIC 3: POLLING BOOTH ────────────────────────────────
  if (q.includes("booth") || q.includes("polling station") || q.includes("election day")) {
    return (
      <div className="w-full bg-slate-950/40 backdrop-blur-3xl p-8 md:p-12 font-sans relative overflow-hidden flex flex-col items-center border border-white/10">
        <div className="absolute top-0 left-0 w-full h-2 flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white tracking-tighter">At the Polling Booth</h2>
        </div>

        <div className="flex flex-col gap-6 w-full relative z-10 max-w-lg">
          <ListItem num="1" text="Verification of identity with EPIC/Alternative ID." />
          <ListItem num="2" text="Application of Indelible Ink on left index finger." />
          <ListItem num="3" text="Signature on register and taking of voter slip." />
          <ListItem num="4" text="Casting vote on EVM behind the screen." />
        </div>

        <div className="absolute bottom-4 right-6 text-[10px] font-black tracking-widest text-indigo-400 opacity-40 rotate-[-5deg]">
          CREATED WITH ELECTIQ
        </div>
      </div>
    );
  }

  // ─── GENERAL FALLBACK ──────────────────────────────────────
  return (
    <div className="w-full bg-[#000080] p-12 text-white font-sans relative overflow-hidden flex flex-col items-center text-center">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <ShieldCheck className="h-64 w-64" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="h-16 w-16 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center">
          <Search className="h-8 w-8 text-[#FF9933]" />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tighter mb-2">Protocol Insight</h2>
          <p className="text-white/60 text-sm max-w-md font-medium uppercase tracking-widest">
            {query}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 w-32 mt-4">
          <div className="h-1 bg-[#FF9933]" />
          <div className="h-1 bg-white" />
          <div className="h-1 bg-[#138808]" />
        </div>
        <p className="mt-8 text-xs font-bold text-white/40">VERIFIED ECI PROTOCOL · ELECTIQ TRUTH ENGINE</p>
      </div>

      <div className="absolute bottom-4 right-6 text-[10px] font-black tracking-widest text-white opacity-20 rotate-[-5deg]">
        CREATED WITH ELECTIQ
      </div>
    </div>
  );
}

function Step({ icon, number, title, desc }: { icon: React.ReactNode; number: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="h-20 w-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
        {icon}
      </div>
      <div className="text-[10px] font-black text-[#FF9933] mb-2 uppercase tracking-widest">Step {number}</div>
      <h3 className="font-black text-white text-lg mb-2">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function ListItem({ num, text }: { num: string; text: string }) {
  return (
    <div className="flex items-center gap-6 p-4 rounded-2xl border border-white/10 hover:border-indigo-500/20 transition-all group bg-white/5">
      <div className="h-10 w-10 shrink-0 rounded-full bg-[#000080] text-white flex items-center justify-center font-black text-sm">
        {num}
      </div>
      <p className="text-sm font-bold text-slate-300">{text}</p>
    </div>
  );
}
