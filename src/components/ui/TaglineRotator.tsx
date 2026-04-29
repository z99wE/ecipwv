"use client";
import { useEffect, useRef, useState } from "react";

const FEATURES = [
  "Verify election claims instantly with Google Fact Check — trusted sources, real verdicts.",
  "Ask Voti anything about the Constitution of India — powered by Vertex AI.",
  "Find your nearest polling booth in seconds using live ECI data and Google Maps.",
  "Generate stunning infographic summaries of complex voting laws with one click.",
  "Check live weather at your polling location before you head out.",
  "Bust election myths with AI-verified publisher ratings — Red for false, Green for true.",
  "Sync the latest ECI data directly to your dashboard with a single button tap.",
  "Understand voter ID requirements in under 60 seconds — clear, simple, accurate.",
  "Translate election content into any Indian language with Cloud Translation AI.",
  "Get real-time election intelligence — built on Google Cloud, trusted by millions.",
];

export function TaglineRotator() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % FEATURES.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 flex items-center">
      <p
        className="text-base md:text-lg text-slate-500 dark:text-white/90 leading-snug transition-opacity duration-400"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        {FEATURES[current]}
      </p>
    </div>
  );
}
