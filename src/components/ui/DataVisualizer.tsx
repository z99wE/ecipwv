"use client";

import React from "react";
import { motion } from "framer-motion";

export function DataVisualizer() {
  return (
    <section className="bg-slate-900 py-32 overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="max-w-2xl mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Scale with confidence.
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            Handle millions of election queries per second with consistent speed and reliability, 
            even during peak voting hours. Our infrastructure is battle-tested.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 text-white border-t border-white/10 pt-16">
          <div>
            <div className="text-5xl font-bold mb-4">500M+</div>
            <div className="text-slate-400 font-medium">Vertex AI queries handled</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-4">10K+</div>
            <div className="text-slate-400 font-medium">Fact checks per second</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-4">150K+</div>
            <div className="text-slate-400 font-medium">Voters synced per minute</div>
          </div>
        </div>
      </div>

      {/* Stripe-style Wavy Lines SVG */}
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none opacity-40">
        <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <motion.path
            d="M-100 400C200 300 400 500 700 400C1000 300 1200 500 1500 400"
            stroke="url(#paint0_linear)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.path
            d="M-100 420C200 320 400 520 700 420C1000 320 1200 520 1500 420"
            stroke="url(#paint1_linear)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3.5, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.path
            d="M-100 440C200 340 400 540 700 440C1000 340 1200 540 1500 440"
            stroke="url(#paint2_linear)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
          />
          <defs>
            <linearGradient id="paint0_linear" x1="-100" y1="400" x2="1500" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#000080" />
              <stop offset="1" stopColor="#FF9933" />
            </linearGradient>
            <linearGradient id="paint1_linear" x1="-100" y1="420" x2="1500" y2="420" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f97316" />
              <stop offset="1" stopColor="#000080" />
            </linearGradient>
            <linearGradient id="paint2_linear" x1="-100" y1="440" x2="1500" y2="440" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9933" />
              <stop offset="1" stopColor="#f97316" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
