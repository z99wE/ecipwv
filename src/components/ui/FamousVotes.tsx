"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const FAMOUS_VOTES = [
  {
    year: "1999",
    event: "Atal Bihari Vajpayee Government",
    impact: "Lost confidence motion by exactly 1 vote.",
    description: "The government fell, leading to mid-term elections. A single vote changed the course of Indian history.",
    color: "from-orange-500 to-red-600",
  },
  {
    year: "2004",
    event: "Santhemarahalli Constituency",
    impact: "A.R. Krishnamurthy lost by 1 vote.",
    description: "Krishnamurthy (JD-S) got 40,751 votes while R. Dhruvanarayana (INC) got 40,752. Even his driver forgot to vote.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    year: "2008",
    event: "Nathdwara Constituency",
    impact: "C.P. Joshi lost by 1 vote.",
    description: "The Rajasthan Congress Chief lost the election (and the CM post) by a single vote. His own wife and daughter missed voting.",
    color: "from-emerald-500 to-teal-600",
  },
];

export function FamousVotes() {
  return (
    <section className="pt-16 pb-0 px-4 overflow-hidden" style={{ background: "var(--bg-subtle)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4" style={{ color: "var(--text)" }}>
              The Power of <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] via-white to-[#138808] transition-all duration-500 hover:drop-shadow-[0_0_20px_rgba(19,136,8,0.2)]">One.</span>
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
              History isn&apos;t just made by millions. It&apos;s decided by the person who showed up.
              Discover the famous moments where a single vote changed everything.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="p-4 rounded-2xl border shadow-xl rotate-3" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              <Quote className="text-orange-500 mb-2" size={32} />
              <p className="text-sm font-bold max-w-[200px]" style={{ color: "var(--text)" }}>
                &ldquo;A vote is like a rifle; its usefulness depends upon the character of the user.&rdquo;
              </p>
              <p className="text-[10px] mt-2" style={{ color: "var(--text-faint)" }}>— Theodore Roosevelt</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FAMOUS_VOTES.map((vote, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl p-8 border shadow-xl hover:shadow-2xl transition-all duration-500"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${vote.color} opacity-5 blur-3xl rounded-full group-hover:opacity-20 transition-opacity`} />
              
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <div className="text-sm font-black text-orange-500 uppercase tracking-widest">
                    Year {vote.year}
                  </div>
                  <h3 className="text-xl font-bold leading-tight" style={{ color: "var(--text)" }}>
                    {vote.event}
                  </h3>
                </div>
              </div>

              <div className="text-2xl font-black mb-4 tracking-tight leading-none" style={{ color: "var(--text)" }}>
                {vote.impact}
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
                {vote.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
