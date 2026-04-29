"use client";

import React from "react";
import { SunRays } from "@/components/ui/SunRays";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative pt-0 pb-20 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 pointer-events-none">
        <SunRays />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex flex-col items-center text-center gap-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-[#FF9933]" />
            <div className="w-12 h-1 bg-white" />
            <div className="w-12 h-1 bg-[#138808]" />
          </div>
          
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-pulse">
            Every Vote Counts.
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl">
            Democratic Intelligence is here to ensure every citizen is informed, empowered, and engaged. 
            Join the future of Indian democracy.
          </p>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-12 text-slate-500 text-sm font-bold uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact ECI</Link>
          </div>

          <div className="mt-8 flex gap-8 text-slate-700 text-[10px] font-bold uppercase tracking-[0.3em]">
            <span>ECI Verified</span>
            <span>•</span>
            <span>Constitutional Law</span>
            <span>•</span>
            <span>24/7 Security</span>
          </div>

          <p className="mt-20 text-slate-600 text-xs tracking-widest font-medium uppercase">
            © 2026 ELECTIQ. Powered by <span className="hover:text-[#138808] transition-all duration-300 cursor-default hover:drop-shadow-[0_0_10px_rgba(19,136,8,0.5)]">Intelligence India Insights</span>. <br className="md:hidden" /> ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
