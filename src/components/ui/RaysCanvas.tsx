"use client";
import { useEffect, useRef } from "react";

/**
 * Stripe-inspired "sunburst rays" animation using plain Canvas 2D.
 * Ultra-lightweight — zero dependencies, <5KB runtime.
 * Matches the Stripe.com data visualization aesthetic.
 */
export function RaysCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    // Palette: indigo → purple (matching ElectiQ brand)
    const colors = [
      "#000080", "#7c71ff", "#a78bfa", "#818cf8",
      "#6d28d9", "#8b5cf6", "#c4b5fd", "#4f46e5",
    ];

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const NUM_RAYS = 90;

    const draw = () => {
      t += 0.004;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      // Warm gradient background (indigo tint at bottom like Stripe)
      const bg = ctx.createRadialGradient(W / 2, H * 0.92, 0, W / 2, H * 0.92, W * 0.85);
      bg.addColorStop(0, "rgba(99,91,255,0.18)");
      bg.addColorStop(0.5, "rgba(168,139,250,0.10)");
      bg.addColorStop(1, "rgba(255,248,240,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Origin: bottom-center like Stripe
      const ox = W / 2;
      const oy = H * 0.98;

      for (let i = 0; i < NUM_RAYS; i++) {
        const angle = (i / NUM_RAYS) * Math.PI; // upper semicircle
        // Slight wave motion: each ray pulses at a different phase
        const phase = i * 0.18 + t;
        const len = (0.55 + 0.3 * Math.sin(phase)) * Math.sqrt(W * W + H * H) * 0.62;

        const ex = ox + Math.cos(angle - Math.PI) * len;
        const ey = oy + Math.sin(angle - Math.PI) * len;

        const color = colors[i % colors.length];
        const alpha = 0.12 + 0.08 * Math.abs(Math.sin(phase * 0.7));

        // Ray line
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Dot at the tip
        ctx.beginPath();
        ctx.arc(ex, ey, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha * 1.6;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      aria-hidden="true"
      style={{ display: "block" }}
    />
  );
}
