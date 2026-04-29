"use client";

import { useEffect, useState } from "react";
import { Users, Vote, MapPin, BarChart3, RefreshCw } from "lucide-react";

interface EciStats {
  totalSeats: number;
  assemblySeats: number;
  eligibleVoters: string;
  turnout2019: string;
  lastUpdated: string;
}

export function HeroStats() {
  const [stats, setStats] = useState<EciStats>({
    totalSeats: 543,
    assemblySeats: 4120,
    eligibleVoters: "968M",
    turnout2019: "67.4%",
    lastUpdated: new Date().toISOString(),
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchStats = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/eci/sync");
      const data = await res.json();
      const nextStats = data.stats ?? data;
      if (nextStats) {
        setStats((current) => ({
          totalSeats: Number(nextStats.totalSeats ?? current.totalSeats),
          assemblySeats: Number(nextStats.assemblySeats ?? current.assemblySeats),
          eligibleVoters: nextStats.eligibleVoters ?? current.eligibleVoters,
          turnout2019: nextStats.turnout2019 ?? nextStats.overallTurnout ?? current.turnout2019,
          lastUpdated: nextStats.lastUpdated ?? new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error("Failed to sync stats:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchStats();
    }, 0);

    // Listen for global sync events
    const handleSync = () => {
      void fetchStats();
    };
    window.addEventListener("eci-data-synced", handleSync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("eci-data-synced", handleSync);
    };
  }, []);

  const items = [
    {
      label: "Lok Sabha Seats",
      value: stats.totalSeats,
      icon: MapPin,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Assembly Seats",
      value: stats.assemblySeats.toLocaleString(),
      icon: BarChart3,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Eligible Voters",
      value: stats.eligibleVoters,
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "2019 Turnout",
      value: stats.turnout2019,
      icon: Vote,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 -mt-16 z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-6 bg-white/10 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] [perspective:1000px]">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col items-center justify-center p-12 transition-all duration-700 hover:bg-white/10 dark:hover:bg-white/5 rounded-[2rem] cursor-pointer [transform-style:preserve-3d] hover:[transform:translateZ(50px)_rotateX(15deg)_rotateY(-15deg)] shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          >
            {/* Glossy Shine Effect */}
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute -inset-[100%] bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            </div>

            <div className={`p-5 rounded-2xl ${item.bg} ${item.color} mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 [transform:translateZ(20px)]`}>
              <item.icon size={36} />
            </div>
            
            <div className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] via-slate-300 to-[#138808] dark:via-white mb-2 transition-all duration-500 group-hover:scale-110 [transform:translateZ(40px)]">
              {item.value}
            </div>
            
            <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-black text-slate-500 dark:text-slate-400 mt-2 [transform:translateZ(10px)]">
              {item.label}
            </div>
            
            {/* Hover Decor - 3D Accent */}
            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-0 h-2 ${item.color.replace('text', 'bg')} rounded-full group-hover:w-3/4 transition-all duration-700 opacity-90 blur-[1px] [transform:translateZ(5px)]`} />
          </div>
        ))}
      </div>
      
      {/* Sync Indicator */}
      <div className="absolute -bottom-8 right-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        <RefreshCw size={10} className={isSyncing ? "animate-spin" : ""} />
        Data Live from ECI Cloud • Updated {new Date(stats.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
