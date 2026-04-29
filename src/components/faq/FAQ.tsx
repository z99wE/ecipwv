"use client";

import React from "react";
import { HelpCircle, Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How is the randomness of EVM allocation ensured?",
    answer: "Through a two-stage randomization process using proprietary software in the presence of political party representatives."
  },
  {
    question: "What happens during a VVPAT power failure?",
    answer: "The Control Unit immediately locks the session. The entire set (CU, BU, VVPAT) is replaced by the Sector Officer from reserve stocks."
  },
  {
    question: "Can an EVM be reused across constituencies?",
    answer: "No. Once assigned to a constituency, the memory is sealed until the statutory period for election petitions (45 days) expires."
  },
  {
    question: "How are binary codes for EVMs protected?",
    answer: "Code is fused into a One-Time Programmable (OTP) chip at the manufacturing level (BEL/ECIL). It cannot be overwritten."
  },
  {
    question: "Is the EVM software open source?",
    answer: "No. To prevent reverse-engineering exploits, the source code is held under high-security escrow by the Election Commission."
  },
  {
    question: "What is the \"Mock Poll\" protocol?",
    answer: "A mandatory test of at least 50 votes cast in the presence of polling agents before actual voting begins on election day."
  },
  {
    question: "How is voter identity verified for Transgender citizens?",
    answer: "ECI provides 'Other' category in electoral rolls. Verification follows the same photo-ID protocols (Aadhaar, Passport, etc.) as per Article 326."
  },
  {
    question: "What is the 'Challenged Vote' procedure?",
    answer: "If a polling agent challenges a voter's identity, the Presiding Officer conducts an inquiry on the spot after a small deposit is paid by the challenger."
  },
  {
    question: "How are postal ballots for essential services handled?",
    answer: "Employees in essential services like Railways, Health, and Police can vote via postal ballot after submitting Form 12D to their RO."
  },
  {
    question: "What is the rule for 'Tendered Votes'?",
    answer: "If a voter finds someone has already voted in their name, they are allowed to cast a 'Tendered Vote' on a ballot paper, which is kept in a separate cover."
  },
  {
    question: "Can an NRI be a polling agent?",
    answer: "No. Under the current rules, only an elector of the same constituency can be appointed as a polling agent for a candidate."
  }
];

export function FAQ() {
  return (
    <section id="faq" className="pt-16 pb-0 relative overflow-hidden" style={{ background: "var(--bg-subtle)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#FF9933] mb-4 block">Voter Guidelines</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] via-white to-[#138808] transition-all duration-500 hover:drop-shadow-[0_0_20px_rgba(19,136,8,0.2)]">
            Frequently Asked Questions
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Technical answers to complex operational questions for authorized observers and democratic personnel.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Support Card */}
          <div className="rounded-[3rem] p-10 border flex flex-col justify-between relative overflow-hidden group h-full shadow-2xl transition-all hover:-translate-y-2" 
            style={{ 
              background: "linear-gradient(135deg, #000080 0%, #000040 100%)", 
              borderColor: "rgba(255,255,255,0.1)" 
            }}>
            {/* Mesh Gradient Overlay */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
              <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-[#FF9933] blur-[100px] rounded-full" />
              <div className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-[#138808] blur-[100px] rounded-full" />
            </div>

            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <HelpCircle className="h-32 w-32 text-white" />
            </div>
            
            <div className="relative z-10">
              <div className="h-16 w-16 rounded-[1.5rem] bg-white/10 backdrop-blur-2xl flex items-center justify-center mb-10 border border-white/20 shadow-xl group-hover:rotate-12 transition-transform">
                <Phone className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-4xl font-black text-white mb-6 leading-tight tracking-tight">Need Immediate Assistance?</h3>
              <p className="text-white/70 text-lg leading-relaxed mb-10 font-medium">
                Direct line for voters to the Election Commission of India intelligence and support desk.
              </p>
            </div>
            <a 
              href="tel:1950" 
              className="relative z-10 mt-auto inline-flex items-center justify-center gap-4 px-10 py-5 rounded-[2rem] bg-white text-[#000080] font-black text-base hover:bg-[#FF9933] hover:text-white transition-all shadow-2xl active:scale-95 group"
            >
              Call ECI Helpline (1950)
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>

          {/* FAQ Items */}
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-[3rem] p-10 border hover:-translate-y-2 transition-all flex flex-col group h-full relative overflow-hidden"
              style={{ 
                borderColor: "var(--card-border)",
                background: "var(--card-bg)"
              }}
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 w-full h-2 flex opacity-100 transition-opacity">
                <div className="flex-1 bg-[#FF9933]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#138808]" />
              </div>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="h-2 w-8 rounded-full bg-gradient-to-r from-[#FF9933] to-[#138808] group-hover:w-16 transition-all duration-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Guideline {index + 1}</span>
              </div>
              
              <h4 className="font-black text-2xl mb-6 leading-tight group-hover:text-[#FF9933] transition-colors" style={{ color: "var(--text)" }}>
                {faq.question.replace(/protocol/gi, "").trim()}
              </h4>
              
              <div className="flex-1">
                <p className="text-base leading-relaxed font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                  {faq.answer.replace(/protocol/gi, "").trim()}
                </p>
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF993310] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#13880805] blur-[150px] rounded-full pointer-events-none" />
    </section>
  );
}
