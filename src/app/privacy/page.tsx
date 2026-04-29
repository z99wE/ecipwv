"use client";

import React from "react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="text-4xl md:text-6xl font-black mb-8" style={{ color: "var(--text)" }}>Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-12 uppercase tracking-widest font-bold">Last Updated: April 25, 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-400">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p>
              ElectiQ (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting the privacy and security of Indian citizens using our platform. This Privacy Policy explains how we collect, use, and safeguard your data in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and the <strong>Information Technology Act, 2000</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>EPIC Number / Voter ID:</strong> Collected only when you explicitly search for polling booth details. This data is used for a one-time lookup against ECI-verified datasets.</li>
              <li><strong>Location Data:</strong> Used to provide proximity-based polling station information. This is processed locally and not stored on our servers.</li>
              <li><strong>Voice & Text Queries:</strong> Processed by Voti Assistant to provide electoral information. These queries are anonymized and used to improve model accuracy.</li>
              <li><strong>Device Information:</strong> Technical logs (IP address, browser type) used solely for security and performance monitoring.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Purpose of Processing</h2>
            <p>We process your data exclusively for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Facilitating voter registration and polling booth discovery.</li>
              <li>Providing constitutional and procedural information via Voti Assistant.</li>
              <li>Verifying electoral claims and busting misinformation (Myth Buster).</li>
              <li>Ensuring compliance with the Election Commission of India (ECI) guidelines.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing & Disclosure</h2>
            <p>
              <strong>ElectiQ does NOT sell or share your personally identifiable information with any third-party commercial entities.</strong> Data is only disclosed when mandated by law or when required by the Election Commission of India for electoral integrity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Use of AI & Synthetic Content</h2>
            <p>
              In compliance with ECI advisories, all AI-generated content (including infographics and Voti responses) is clearly labeled. Users are advised to verify critical electoral information against the official ECI website: <strong>https://voters.eci.gov.in/</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Security Measures</h2>
            <p>
              We implement industry-standard encryption (AES-256) and secure API protocols to protect your data. Our infrastructure is air-gapped from commercial advertising networks to ensure zero data leakage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
            <p>Under the DPDP Act, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and review the personal data we hold about you.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Withdraw consent for data processing at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Grievance Redressal</h2>
            <p>
              For any queries or complaints regarding your privacy, please contact our Grievance Officer:<br />
              <strong>Email:</strong> privacy@electiq.in<br />
              <strong>Address:</strong> ElectiQ Digital Integrity Cell, New Delhi, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
