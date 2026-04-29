"use client";

import React from "react";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { FamousVotes } from "@/components/ui/FamousVotes";
import { VotingImportanceTicker } from "@/components/ui/VotingImportanceTicker";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Premium Hero Section with Live Stats on the Right */}
      <HeroCarousel />
      
      {/* Famous Votes Section - Historical Context */}
      <FamousVotes />
    </main>
  );
}
