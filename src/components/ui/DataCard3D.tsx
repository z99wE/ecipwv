"use client";

import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

interface DataCardStat {
  value: string;
  label: string;
}

function RollingNumber({ value }: { value: string }) {
  // Extract number and suffix (e.g., "5.50" and " Million")
  const numMatch = value.match(/[\d.]+/);
  const suffix = value.replace(/[\d.]+/, '');
  const target = numMatch ? parseFloat(numMatch[0]) : 0;
  
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    spring.set(target);
  }, [target, spring]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      setDisplay(latest.toLocaleString(undefined, { 
        minimumFractionDigits: value.includes('.') ? 2 : 0,
        maximumFractionDigits: 2 
      }));
    });
  }, [spring, value]);

  return <span className="inline-block">{display}{suffix}</span>;
}

export function DataCard3D({ comp, delay }: { comp: DataCardStat; delay: number }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setRotateX((y - centerY) / 15);
    setRotateY((centerX - x) / 15);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotateY: 90, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        scale: 1, 
        rotateY: 0, 
        y: 0,
        transition: {
          type: "spring",
          stiffness: 70,
          damping: 15,
          delay: delay * 0.1,
          duration: 1
        }
      }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-[2000px] group relative h-full w-full"
    >
      <motion.div
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="p-8 md:p-12 rounded-[3.5rem] border bg-white shadow-[0_40px_80px_-20px_rgba(0,0,128,0.1)] flex flex-col justify-center items-center overflow-hidden min-h-[340px] h-full text-center relative group/card"
        style={{ 
          borderColor: "rgba(0,0,128,0.05)",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Tricolor Accent - Top Flush */}
        <div className="absolute top-0 left-0 w-full h-2 flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center" style={{ transform: "translateZ(60px)" }}>
          {/* The Number - Responsive Clamping */}
          <div 
            className="text-[clamp(1.2rem,8vw,3.2rem)] md:text-[clamp(2rem,5vw,4.4rem)] font-black tracking-tighter leading-[0.9] text-slate-900 group-hover/card:text-[#000080] transition-all duration-300 w-full px-2 break-words text-center flex items-center justify-center min-h-[1.2em]"
            style={{ transform: "translateZ(40px)" }}
          >
            <RollingNumber value={comp.value} />
          </div>

          {/* The Byline - Elegant & Small */}
          <div 
            className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover/card:text-[#000080]/60 transition-all duration-300 max-w-[220px] leading-relaxed mx-auto mt-2"
            style={{ transform: "translateZ(20px)" }}
          >
            {comp.label}
          </div>
        </div>

        {/* Subtle Indigo Glow on Hover */}
        <div className="absolute -inset-20 bg-gradient-to-tr from-[#00008005] via-transparent to-[#00008005] blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}
