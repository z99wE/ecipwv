"use client";

import React, { useEffect, useState } from "react";

// Branded color cycle for the "Q"
const COLORS = ["#000080", "#FF9933", "#138808", "#FF9933", "#000080"];

export function ElectiQLogo({ className = "", size = 32 }: { className?: string; size?: number }) {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % COLORS.length);
    }, 3000); // Change color every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      width={size * 3.2}
      height={size}
      viewBox="0 0 135 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ElectiQ Logo"
      role="img"
    >
      <style>
        {`
          .electi-text { fill: var(--text, #0f172a); transition: fill 0.3s ease; }
          .q-text { transition: fill 1.5s ease-in-out; }
        `}
      </style>
      {/* "Elect" — tightened spacing */}
      <text
        x="0"
        y="31"
        fontFamily="Inter, Geist Sans, sans-serif"
        fontWeight="800"
        fontSize="32"
        letterSpacing="-1.5"
        className="electi-text"
      >
        Elect
      </text>
      {/* "i" — moved closer (x=73) */}
      <text
        x="73"
        y="31"
        fontFamily="Inter, Geist Sans, sans-serif"
        fontWeight="800"
        fontSize="32"
        letterSpacing="-1.5"
        className="q-text"
        style={{ fill: COLORS[colorIndex] }}
      >
        i
      </text>
      {/* "Q" — moved closer (x=80) */}
      <text
        x="80"
        y="31"
        fontFamily="Inter, Geist Sans, sans-serif"
        fontWeight="800"
        fontSize="32"
        letterSpacing="-1.5"
        className="q-text"
        style={{ fill: COLORS[colorIndex] }}
      >
        Q
      </text>
    </svg>
  );
}

// Small icon version for Favicon/FAB
export function ElectiQIcon({ size = 32 }: { size?: number }) {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % COLORS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="EiQ Icon"
    >
      <rect width="40" height="40" rx="12" fill="#0f172a" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="Inter, Geist Sans, sans-serif"
        fontWeight="800"
        fontSize="18"
        letterSpacing="-1"
      >
        <tspan fill="white">E</tspan>
        <tspan style={{ fill: COLORS[colorIndex], transition: "fill 1.5s ease-in-out" }}>i</tspan>
        <tspan style={{ fill: COLORS[colorIndex], transition: "fill 1.5s ease-in-out" }}>Q</tspan>
      </text>
    </svg>
  );
}
