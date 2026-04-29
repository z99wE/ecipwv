"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Shield, Zap, TrendingUp } from "lucide-react";

export function DashboardPreview() {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[500px] mt-24 perspective-1000">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-stripe-indigo/20 blur-[120px] rounded-full animate-pulse" />

      {/* Main Dashboard Window */}
      <motion.div 
        initial={{ rotateY: 15, rotateX: 5, y: 50, opacity: 0 }}
        whileInView={{ rotateY: -10, rotateX: 2, y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-0 left-0 w-[80%] bg-white rounded-2xl shadow-stripe-xl border border-slate-200/50 p-8 z-20 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Election Dashboard 2026</div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="h-4 w-32 bg-slate-100 rounded-full" />
            <div className="h-24 w-full bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
               <TrendingUp className="text-slate-300 h-8 w-8" />
            </div>
            <div className="space-y-3">
              <div className="h-3 w-full bg-slate-100 rounded-full" />
              <div className="h-3 w-4/5 bg-slate-100 rounded-full" />
              <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
            </div>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="text-stripe-indigo h-5 w-5" />
              <div className="text-xs font-bold uppercase tracking-wider">Secure Verification</div>
            </div>
            <div className="text-2xl font-bold mb-4">99.9%</div>
            <div className="text-xs text-slate-400">Authenticity check pass rate across all polling stations.</div>
            <div className="mt-8 flex space-x-2">
              <div className="h-1 w-full bg-stripe-indigo rounded-full" />
              <div className="h-1 w-full bg-slate-700 rounded-full" />
              <div className="h-1 w-full bg-slate-700 rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Tactical Card 1 */}
      <motion.div 
        initial={{ x: 100, y: 100, opacity: 0 }}
        whileInView={{ x: 350, y: 120, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        className="absolute top-0 right-0 w-[45%] bg-white rounded-2xl shadow-stripe-lg border border-slate-200/50 p-6 z-30"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <CheckCircle2 className="text-green-600 h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">ECI SYNC</div>
            <div className="text-sm font-bold text-slate-900">Data Verified</div>
          </div>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1, delay: 1 }}
            className="h-full bg-green-500" 
          />
        </div>
      </motion.div>

      {/* Floating Tactical Card 2 */}
      <motion.div 
        initial={{ x: -100, y: 200, opacity: 0 }}
        whileInView={{ x: -20, y: 280, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
        className="absolute bottom-0 left-0 w-[40%] bg-slate-900 rounded-2xl shadow-stripe-lg border border-white/10 p-6 z-40"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-stripe-indigo p-2 rounded-lg">
            <Zap className="text-white h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">REAL-TIME</div>
            <div className="text-sm font-bold text-white">Voti Intelligence</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-slate-800 rounded-full" />
          <div className="h-1.5 w-4/5 bg-slate-800 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
