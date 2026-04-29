"use client";

import React, { useState } from "react";
import { Sparkles, Download, Loader2 } from "lucide-react";

const EXAMPLES = [
  "How to register as a voter in India",
  "Steps at the polling booth on election day",
  "What is VVPAT and how does it work",
  "Model Code of Conduct — what parties cannot do",
  "How is an EVM programmed and sealed",
  "Who is eligible to vote in India",
];

export function InfographicSection() {
  const [query, setQuery] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageQuery, setImageQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (q?: string) => {
    const target = (q ?? query).trim();
    if (!target) return;
    setLoading(true);
    setError(null);
    setImageQuery(target);

    try {
      const res = await fetch("/api/infographic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: target }),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Generation failed");
      }
      
      const data = await res.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        throw new Error("No image data received");
      }
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to generate infographic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `ElectiQ-Visual-${imageQuery.slice(0, 20).replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#FF9933] mb-3 block">Visual AI Engine</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4" style={{ color: "var(--text)" }}>
            Democratic Intelligence Visuals
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Generate high-fidelity, tricolor election guides using state-of-the-art vision models.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder='e.g. "How to register to vote in India"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              className="flex-1 rounded-2xl px-5 py-4 text-sm border outline-none focus:ring-2 focus:ring-[#000080]/30"
              style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--text)" }}
              aria-label="Enter election topic for infographic"
            />
            <button
              onClick={() => generate()}
              disabled={loading || !query.trim()}
              className="px-6 py-4 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
              style={{ background: "#FF9933" }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {/* Example chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => { setQuery(ex); generate(ex); }}
                className="text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all hover:border-[#FF9933] hover:text-[#FF9933]"
                style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {error && (
          <div className="max-w-2xl mx-auto text-center py-8 text-sm px-4 rounded-xl mb-8 bg-red-50 text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {(imageUrl || loading) && (
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-[2.5rem] overflow-hidden border-2 shadow-2xl transition-all"
              style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
            >
              {loading ? (
                <div className="aspect-[16/9] w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50">
                  <Loader2 className="h-10 w-10 animate-spin text-[#000080] dark:text-indigo-400 mb-4" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generating Branded Visual...</p>
                </div>
              ) : (
                <div className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={imageUrl!} 
                    alt={imageQuery}
                    className="w-full object-contain bg-white"
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white text-[10px] font-bold">ELECTIQ ENGINE</span>
                  </div>
                </div>
              )}
              
              <div
                className="px-8 py-6 flex items-center justify-between border-t bg-slate-50 dark:bg-slate-900/80"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <p className="text-[10px] font-black text-[#000080] dark:text-indigo-400 uppercase tracking-widest">ElectiQ Visual Engine · v2.5</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>Tricolor Aligned · https://voters.eci.gov.in/</p>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={!imageUrl}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white cursor-pointer transition-all active:scale-95 shadow-lg hover:shadow-[#000080]/20 disabled:opacity-50"
                  style={{ background: "#000080" }}
                  aria-label="Download high-fidelity infographic"
                >
                  <Download className="h-4 w-4" /> Download SVG
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
