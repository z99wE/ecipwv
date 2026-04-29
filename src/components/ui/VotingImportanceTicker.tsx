"use client";

import React from "react";
import { motion } from "framer-motion";

const REASONS = [
  "Your vote is your voice. Don't let others speak for you.",
  "Democracy is not a spectator sport. Get in the game.",
  "Every election is determined by the people who show up.",
  "A vote is more than a choice; it's a commitment to the future.",
  "The ballot is stronger than the bullet. Use it wisely.",
  "Not voting is not a protest. It is a surrender of your power.",
  "Someone once fought for your right to vote. Honor them.",
  "Bad officials are elected by good citizens who do not vote.",
  "Your vote can be the one that changes everything.",
  "Decisions are made by those who show up at the booth.",
];

export function VotingImportanceTicker() {
  // Duplicate the reasons to create a seamless loop
  const doubledReasons = [...REASONS, ...REASONS];

  return (
    <div className="w-full bg-orange-500 py-4 mb-6 overflow-hidden relative border-y border-orange-600">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-orange-500 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-orange-500 to-transparent z-10" />
      
      <motion.div
        className="flex whitespace-nowrap gap-12 items-center"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {doubledReasons.map((reason, idx) => (
          <div key={idx} className="flex items-center gap-12">
            <span className="text-white font-black text-sm uppercase tracking-wider">
              {reason}
            </span>
            <span className="text-white/30 text-2xl font-black">★</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
