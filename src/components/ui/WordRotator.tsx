"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["Intelligence", "Insights", "Integrity", "India"];

export function WordRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-flex relative min-w-[1.2em] justify-center lg:justify-start">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -40, opacity: 0, filter: "blur(10px)" }}
          transition={{ 
            duration: 0.8, 
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          className="text-election-gradient"
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
