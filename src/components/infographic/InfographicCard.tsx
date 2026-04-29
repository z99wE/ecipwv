"use client";

import React, { useRef } from "react";
import { Download, Image as ImageIcon } from "lucide-react";

interface InfographicCardProps {
  imageUrl: string;
  query: string;
}

export function InfographicCard({ imageUrl, query }: InfographicCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw main image
      ctx?.drawImage(img, 0, 0);

      // Add "ElectiQ-Voti" watermark
      if (ctx) {
        ctx.font = "bold 24px Inter, sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.textAlign = "right";
        ctx.fillText("ElectiQ-Voti", canvas.width - 20, canvas.height - 20);
      }

      // Download
      const link = document.createElement("a");
      link.download = `ElectiQ-Infographic-${query.replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-stripe hover:shadow-stripe-lg transition-all">
      <div className="aspect-[4/3] relative bg-slate-50 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={`Infographic for ${query}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <ImageIcon className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-sm">Infographic pending...</p>
          </div>
        )}
      </div>

      <div className="p-6 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{query}</h4>
          <p className="text-xs text-slate-500">Stripe-style Tactical Card</p>
        </div>
        <button 
          onClick={handleDownload}
          className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-stripe-indigo transition-colors"
          title="Download with watermark"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>

      {/* Hidden canvas for watermarking */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
