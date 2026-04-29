"use client";

import React, { useEffect } from "react";
import { VotiChat } from "@/components/voti/VotiChat";
import { Bot, MessageSquare, Mic, Sparkles, ShieldCheck } from "lucide-react";

export default function VotiPage() {
  useEffect(() => {
    // Auto-open chat on page load after a brief delay
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-voti', { detail: { mode: 'chat' } }));
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen py-24" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#FF9933] mb-3 block">Election Assistant</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6" style={{ color: "var(--text)" }}>
            Meet Voti.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Your high-fidelity conversational guide to the Indian Electoral Ecosystem.
            Voti handles complex queries with constitutional accuracy.
          </p>
        </div>

        {/* Two Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-voti', { detail: { mode: 'chat' } }))}
            className="p-8 rounded-[2.5rem] border-2 group transition-all hover:border-[#FF9933] text-left cursor-pointer"
            style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF9933]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-6 w-6 text-[#FF9933]" />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text)" }}>Interactive Chat</h3>
            <p className="text-sm text-slate-400 mb-6">
              Ask about voter registration, ID requirements, or constitutional rights in a real-time conversation.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-[#FF9933]">
              Open Chat Interface <Sparkles className="h-4 w-4" />
            </div>
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-voti', { detail: { mode: 'voice' } }))}
            className="p-8 rounded-[2.5rem] border-2 group transition-all hover:border-[#138808] text-left cursor-pointer"
            style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#138808]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mic className="h-6 w-6 text-[#138808]" />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text)" }}>Voice Mode</h3>
            <p className="text-sm text-slate-400 mb-6">
              Talk to Voti naturally. Perfect for a hands-free, high-speed information lookup during your day.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-[#138808]">
              Enter Voice Engine <Sparkles className="h-4 w-4" />
            </div>
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="border-t pt-20" style={{ borderColor: "var(--border)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <Bot className="h-8 w-8 mx-auto mb-4 text-[#FF9933]" />
              <h4 className="font-bold mb-2" style={{ color: "var(--text)" }}>Constitutional Logic</h4>
              <p className="text-sm text-slate-400">Scoped exclusively to ECI guidelines and Articles 324-329.</p>
            </div>
            <div>
              <Sparkles className="h-8 w-8 mx-auto mb-4 text-[#FF9933]" />
              <h4 className="font-bold mb-2" style={{ color: "var(--text)" }}>Multilingual Mastery</h4>
              <p className="text-sm text-slate-400">Available in Hindi, English, and regional Indian languages.</p>
            </div>
            <div>
              <ShieldCheck className="h-8 w-8 mx-auto mb-4 text-[#FF9933]" />
              <h4 className="font-bold mb-2" style={{ color: "var(--text)" }}>Private &amp; Secure</h4>
              <p className="text-sm text-slate-400">Conversations are encrypted and never sold to third parties.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Voti widget */}
      <VotiChat />
    </div>
  );
}
