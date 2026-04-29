"use client";

import React from "react";
import Link from "next/link";
import { Phone, MapPin, Mail, ExternalLink, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const contacts = [
    {
      icon: Phone,
      label: "Toll-Free Helpline",
      value: "1950",
      sub: "Available during election periods · Voter helpline",
      color: "#FF9933",
      href: "tel:1950",
      cta: "Call Now",
    },
    {
      icon: MapPin,
      label: "Postal Address",
      value: "Election Commission Of India",
      sub: "Nirvachan Sadan, Ashoka Road, New Delhi — 110001",
      color: "#138808",
      href: "https://maps.google.com/?q=Election+Commission+of+India,+Nirvachan+Sadan,+Ashoka+Road,+New+Delhi",
      cta: "View on Maps",
    },
    {
      icon: Mail,
      label: "Email",
      value: "complaints@eci.gov.in",
      sub: "For electoral complaints and grievance redressal",
      color: "#3b82f6",
      href: "mailto:complaints@eci.gov.in",
      cta: "Send Email",
    },
  ];

  return (
    <div className="min-h-screen pt-20" style={{ background: "var(--bg)" }}>

      {/* Hero */}
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-16 text-center border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#FF9933] mb-3 block">
          Official ECI Contact
        </span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6" style={{ color: "var(--text)" }}>
          Contact ECI.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Reach the Election Commission of India directly for complaints,
          voter grievances, or official correspondence.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contacts.map((item) => (
            <div
              key={item.label}
              className="group p-10 rounded-[2.5rem] border-2 flex flex-col gap-6 transition-all hover:shadow-2xl hover:scale-[1.02]"
              style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                style={{ background: `${item.color}18` }}
              >
                <item.icon className="h-7 w-7" style={{ color: item.color }} />
              </div>

              {/* Text */}
              <div className="flex-grow">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-2">
                  {item.label}
                </p>
                <p className="text-xl md:text-2xl font-black mb-2 break-all" style={{ color: "var(--text)" }}>
                  {item.value}
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.sub}
                </p>
              </div>

              {/* CTA */}
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 w-fit"
                style={{ background: item.color, color: "#fff" }}
              >
                {item.cta}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Disclaimer Banner */}
        <div className="mt-20 p-10 rounded-[2.5rem] border-2 border-[#FF9933]/30 bg-[#FF9933]/5 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FF9933]/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6 text-[#FF9933]" />
          </div>
          <div>
            <p className="font-bold text-white mb-1">Official Government Contact Information</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              The contact details above are sourced directly from the official Election Commission of India website.
              ElectiQ is an independent educational platform and is not affiliated with or endorsed by the ECI.
              For critical election matters, always verify at{" "}
              <a
                href="https://eci.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF9933] underline underline-offset-2 font-bold"
              >
                eci.gov.in
              </a>.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 flex gap-6 flex-wrap justify-center">
          <Link href="/privacy" className="text-sm font-bold text-slate-400 hover:text-[#FF9933] transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-700">·</span>
          <Link href="/terms" className="text-sm font-bold text-slate-400 hover:text-[#FF9933] transition-colors">
            Terms of Service
          </Link>
          <span className="text-slate-700">·</span>
          <Link href="/" className="text-sm font-bold text-slate-400 hover:text-[#FF9933] transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
