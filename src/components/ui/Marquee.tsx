"use client";

import React from "react";
import { motion } from "framer-motion";

interface MarqueeProps {
  items: string[];
  speed?: number;
}

export function Marquee({ items, speed = 20 }: MarqueeProps) {
  return (
    <div className="w-full overflow-hidden bg-slate-900 py-3 text-white">
      <div className="flex whitespace-nowrap" role="region" aria-live="polite" aria-label="Election Quotes">
        <motion.div
          className="flex space-x-32"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Duplicate items for seamless loop */}
          {[...items, ...items].map((item, index) => (
            <span key={index} className="text-xl font-black tracking-[0.1em] uppercase opacity-90">
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
