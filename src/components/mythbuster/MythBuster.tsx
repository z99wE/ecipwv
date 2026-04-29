"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ShieldX, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCcw,
  Volume2,
  Search,
  VolumeX
} from "lucide-react";
import { useScreenReader } from "@/context/ScreenReaderContext";

interface Myth {
  id: number;
  claim: string;
  verdict: "TRUE" | "FALSE" | "MISLEADING";
  explanation: string;
  source: string;
  article?: string;
}

const MYTHS: Myth[] = [
  {
    id: 1,
    claim: "EVMs can be hacked via Bluetooth or WiFi remotely.",
    verdict: "FALSE",
    explanation: "EVMs are standalone, airgapped devices with no wireless circuitry — no Bluetooth, WiFi, internet, or external port. The Supreme Court of India (2017) and multiple independent technical audits have confirmed this.",
    source: "Supreme Court of India, 2017",
  },
  {
    id: 2,
    claim: "You need a Voter ID card to vote — no other ID works.",
    verdict: "FALSE",
    explanation: "The ECI accepts 12 alternative photo ID documents including Aadhaar, Passport, Driving Licence, and PAN Card. Your name must be in the electoral roll.",
    source: "ECI Instruction No. 51/8/7/2019-EMS",
  },
  {
    id: 3,
    claim: "NOTA votes count — if NOTA wins, there is a re-election.",
    verdict: "FALSE",
    explanation: "Currently, NOTA has no electoral value. Even if NOTA receives the highest number of votes, the candidate with the second-highest votes wins.",
    source: "EC v. Union of India, Supreme Court 2013",
  },
  {
    id: 4,
    claim: "The voting age in India was always 18.",
    verdict: "FALSE",
    explanation: "The original Constitution set it at 21. The 61st Amendment (1988) lowered it to 18.",
    source: "61st Constitutional Amendment Act, 1988",
  },
  {
    id: 5,
    claim: "NRIs cannot vote in Indian elections.",
    verdict: "FALSE",
    explanation: "NRIs can vote, but they must be physically present at their designated polling station in India. Overseas/Postal voting is not available for NRIs yet.",
    source: "Representation of the People Act, 2010",
  },
  {
    id: 6,
    claim: "Convicted criminals cannot vote.",
    verdict: "MISLEADING",
    explanation: "Only persons serving an active prison sentence are disqualified. Persons on bail or under-trial detainees retain their voting rights.",
    source: "Section 62(5), RPA 1951",
  },
  {
    id: 7,
    claim: "Voters can take selfies inside the polling booth.",
    verdict: "FALSE",
    explanation: "ECI prohibits mobile phones inside the voting compartment to maintain the secrecy of the ballot under Section 128 of the RPA.",
    source: "ECI Circular 2019",
  },
  {
    id: 8,
    claim: "EVMs store individual voter names.",
    verdict: "FALSE",
    explanation: "EVMs only record the count of votes per candidate. They do not store any voter identity data to ensure total anonymity.",
    source: "ECI Technical Manual",
  },
  {
    id: 9,
    claim: "Booth capturing is common in the digital era.",
    verdict: "FALSE",
    explanation: "Enhanced security, EVM sealing protocols, and VVPAT have made traditional booth capturing virtually impossible and easily detectable.",
    source: "ECI Security Protocol 2024",
  }
];

const VERDICT_CONFIG = {
  TRUE: { bg: "#FF9933", text: "#ffffff", border: "#FF9933", icon: ShieldCheck, label: "CONFIRMED TRUE" },
  FALSE: { bg: "#FF9933", text: "#ffffff", border: "#FF9933", icon: ShieldX, label: "BUSTED FALSE" },
  MISLEADING: { bg: "#FF9933", text: "#ffffff", border: "#FF9933", icon: HelpCircle, label: "MISLEADING" },
};

const PARTICLE_DATA = [
  { size: 6, left: "10%", top: "20%", duration: 4 },
  { size: 8, left: "30%", top: "50%", duration: 5 },
  { size: 4, left: "70%", top: "10%", duration: 6 },
  { size: 10, left: "85%", top: "80%", duration: 4.5 },
  { size: 5, left: "45%", top: "75%", duration: 5.5 },
  { size: 7, left: "15%", top: "40%", duration: 6.5 },
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {PARTICLE_DATA.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-400"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function BrandElement() {
  return (
    <div className="flex flex-col gap-1 w-12 p-2 rounded-xl border bg-slate-800 shadow-sm" style={{ borderColor: "var(--border)" }}>
      <div className="flex gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
        <div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
        <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
      </div>
      <div className="h-1 w-full bg-slate-700 rounded-full" />
      <div className="h-1 w-2/3 bg-slate-700 rounded-full" />
    </div>
  );
}

export function MythBuster() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { readElement, stopReading, isReading } = useScreenReader();
  
  const filteredMyths = MYTHS;

  const handleNext = () => {
    setIsFlipped(false);
    setActiveIndex((prev) => (prev + 1) % filteredMyths.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setActiveIndex((prev) => (prev - 1 + filteredMyths.length) % filteredMyths.length);
  };

  const getCardStyle = (index: number) => {
    const total = filteredMyths.length;
    if (total === 0) return {};
    const diff = (index - activeIndex + total) % total;
    
    // Normalize diff to -1, 0, 1
    let normalizedDiff = diff;
    if (diff > total / 2) normalizedDiff = diff - total;
    
    const isActive = normalizedDiff === 0;
    const isPrev = normalizedDiff === -1;
    const isNext = normalizedDiff === 1;
    const isHidden = !isActive && !isPrev && !isNext;

    return {
      zIndex: isActive ? 30 : (isPrev || isNext ? 20 : 10),
      opacity: isActive ? 1 : (isPrev || isNext ? 0.4 : 0),
      scale: isActive ? 1 : (isPrev || isNext ? 0.8 : 0.6),
      x: isActive ? 0 : (isPrev ? -250 : (isNext ? 250 : 0)),
      rotateY: isActive ? 0 : (isPrev ? 45 : (isNext ? -45 : 0)),
      filter: isActive ? "blur(0px)" : "blur(4px)",
      pointerEvents: isActive ? ("auto" as const) : ("none" as const),
    };
  };

  return (
    <section id="mythbuster" className="py-24 relative overflow-hidden" style={{ background: "var(--bg-subtle)" }}>
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-election-gradient">
            Bust the Noise.
          </h2>
          <p className="text-lg max-w-2xl mx-auto font-medium text-slate-400">
            Flip through real-time election myths verified by the Constitution.
          </p>
        </div>



        {/* 3D Carousel Container */}
        <div className="relative h-[600px] flex items-center justify-center perspective-[2000px]">
          {filteredMyths.map((myth, index) => {
            const style = getCardStyle(index);
            const isCurrent = index === activeIndex;
            
            return (
              <motion.div
                key={myth.id}
                initial={false}
                animate={style}
                transition={{ type: "spring", stiffness: 150, damping: 25 }}
                className="absolute w-full max-w-[420px] h-[550px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="w-full h-full relative cursor-pointer"
                  animate={{ rotateY: (isCurrent && isFlipped) ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                  onClick={() => isCurrent && setIsFlipped(!isFlipped)}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front of Card */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-[3.5rem] p-10 flex flex-col shadow-2xl backface-hidden overflow-hidden border border-white/20 dark:border-slate-800"
                    style={{ background: "var(--card-bg)" }}
                  >
                    <div className="absolute top-0 left-0 w-full h-2 flex">
                      <div className="flex-1 bg-[#FF9933]" />
                      <div className="flex-1 bg-white/20" />
                      <div className="flex-1 bg-[#138808]" />
                    </div>
                    
                    <div className="relative z-10 flex justify-between items-center mb-10">
                      <BrandElement />
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); isReading ? stopReading() : readElement(myth.claim); }}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:scale-110 transition-transform"
                        >
                          {isReading ? <VolumeX className="h-4 w-4 text-indigo-500" /> : <Volume2 className="h-4 w-4 text-slate-400" />}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-3xl font-black leading-[1.1] mb-8 text-election-gradient">
                      {myth.claim}
                    </h3>

                    <div className="mt-auto">
                      <div className="text-[10px] font-black text-indigo-500 mb-3 tracking-[0.3em] uppercase">Status</div>
                      <div 
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black shadow-xl"
                        style={{ 
                          background: "linear-gradient(135deg, #FF9933 0%, #E67E22 100%)", 
                          color: "#fff"
                        }}
                      >
                        {myth.verdict}
                      </div>
                    </div>

                    <div className="mt-8 text-center text-xs font-black text-slate-400 tracking-widest animate-bounce">
                      TAP TO UNCOVER TRUTH
                    </div>
                  </div>

                  {/* Back of Card */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-[3.5rem] p-10 flex flex-col shadow-2xl border border-slate-100 bg-white"
                    style={{ 
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden"
                    }}
                  >
                    <div className="flex justify-between items-center mb-10">
                      <div className="p-4 rounded-[2rem] bg-indigo-50 shadow-xl">
                        <ShieldCheck className="h-6 w-6 text-[#FF9933]" />
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); isReading ? stopReading() : readElement(myth.explanation); }}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50"
                      >
                        {isReading ? <VolumeX className="h-4 w-4 text-indigo-500" /> : <Volume2 className="h-4 w-4 text-slate-400" />}
                      </button>
                    </div>

                    <div className="mb-4">
                      <span className="text-xs font-black tracking-[0.4em] uppercase text-[#FF9933]">The Reality Check</span>
                    </div>

                    <p className="text-lg leading-relaxed mb-8 flex-1 overflow-y-auto font-medium text-slate-700">
                      {myth.explanation}
                    </p>

                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800 mt-auto">
                      <div className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest opacity-60">Official Source</div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">{myth.source}</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-10 mt-10">
          <button 
            onClick={handlePrev}
            className="p-6 rounded-full bg-slate-950 border border-slate-800 shadow-2xl hover:scale-110 active:scale-95 transition-all group"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>
          
          <div className="flex flex-col items-center gap-1">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mt-2">Spin for Truth</div>
          </div>

          <button 
            onClick={handleNext}
            className="p-6 rounded-full bg-slate-950 border border-slate-800 shadow-2xl hover:scale-110 active:scale-95 transition-all group"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[600px] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none" />
    </section>
  );
}

