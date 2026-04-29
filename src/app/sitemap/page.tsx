"use client";

import React from "react";
import Link from "next/link";
import { Map, Bot, Shield, FileText, Layout, Info } from "lucide-react";

export default function SitemapPage() {
  const sections = [
    {
      title: "Core Features",
      icon: Layout,
      links: [
        { name: "Landing Page", href: "/" },
        { name: "Voti Assistant", href: "/voti" },
        { name: "Myth Buster", href: "/myth-buster" },
        { name: "Find Booth", href: "/find-booth" },
        { name: "Election Protocols", href: "/protocols" },
        { name: "Visual Engine", href: "/infographics" },
      ]
    },
    {
      title: "Voti Services",
      icon: Bot,
      links: [
        { name: "Interactive Chat", href: "/voti" },
        { name: "Voice Assistance", href: "/voti" },
        { name: "Multilingual Support", href: "/voti" },
      ]
    },
    {
      title: "Legal & Transparency",
      icon: Shield,
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "ECI Verified Data", href: "/" },
      ]
    },
    {
      title: "Resources",
      icon: FileText,
      links: [
        { name: "Voter Registration Guide", href: "/protocols" },
        { name: "EVM Security Protocols", href: "/protocols" },
        { name: "Model Code of Conduct", href: "/protocols" },
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-20" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-center gap-4 mb-12">
           <Map className="h-10 w-10 text-[#FF9933]" />
           <h1 className="text-4xl md:text-6xl font-black" style={{ color: "var(--text)" }}>Site Map</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {sections.map((section, i) => (
            <div key={i} className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                <section.icon className="h-5 w-5 text-[#FF9933]" />
                <h2 className="text-lg font-bold uppercase tracking-widest text-white">{section.title}</h2>
              </div>
              <ul className="space-y-4">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      href={link.href} 
                      className="text-slate-400 hover:text-[#FF9933] transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 rounded-[3rem] bg-indigo-900/10 border-2 border-indigo-500/20 text-center">
            <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>Need direct assistance?</h3>
            <p className="text-slate-400 mb-8">Can&apos;t find what you&apos;re looking for? Ask Voti for immediate guidance through the platform.</p>
            <Link href="/voti" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#000080] text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20">
              Talk to Voti Assistant
            </Link>
        </div>
      </div>
    </div>
  );
}
