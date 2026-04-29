"use client";

import React from "react";
import { FAQ } from "@/components/faq/FAQ";
import { FileText, ShieldCheck, Gavel, UserCheck } from "lucide-react";

export default function ProtocolsPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12 text-center border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#FF9933] mb-3 block">Constitutional Framework</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6" style={{ color: "var(--text)" }}>
          Protocols.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The legal and procedural blueprints of the world&apos;s largest democracy. 
          Understand the rules, your rights, and the safeguards in place.
        </p>
      </div>

      {/* Protocol Quick Links */}
      <div className="py-16 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { title: "Model Code of Conduct", icon: Gavel, desc: "Fair play rules for political parties and candidates." },
            { title: "Voter Rights", icon: UserCheck, desc: "Your fundamental right to vote under Article 326." },
            { title: "EVM Security", icon: ShieldCheck, desc: "The standalone integrity of electronic voting." },
            { title: "Polling Guide", icon: FileText, desc: "Step-by-step procedure inside the booth." },
          ].map((p, i) => (
            <div key={i} className="p-8 rounded-3xl border transition-all hover:shadow-xl group" style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}>
              <p.icon className="h-8 w-8 text-[#FF9933] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2" style={{ color: "var(--text)" }}>{p.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <FAQ />
    </div>
  );
}
