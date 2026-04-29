"use client";
import { useEffect, useRef } from "react";

export default function ElectionPulseHeatmap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      life: number;
    }

    const particles: Particle[] = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 40 + 20,
        color: Math.random() > 0.5 ? "rgba(255, 153, 51, 0.1)" : "rgba(19, 136, 8, 0.1)",
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 1,
      };
    };

    for (let i = 0; i < 30; i++) particles.push(createParticle());

    let animationFrame: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "screen";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, "transparent");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animationFrame = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="relative w-full h-[300px] rounded-3xl overflow-hidden bg-slate-900/5 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 backdrop-blur-md">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
        <div className="px-4 py-1.5 rounded-full bg-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
          Live Voter Pulse
        </div>
        <h3 className="text-3xl font-black text-election-gradient tracking-tighter mb-2">
          Democratic Momentum
        </h3>
        <p className="text-sm font-medium text-slate-500 max-w-sm">
          Real-time simulation of citizen engagement and electoral energy across the subcontinent.
        </p>
        <div className="mt-6 flex gap-8">
          <div>
            <div className="text-2xl font-black text-[#FF9933]">92%</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enthusiasm</div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#138808]">1.4B+</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Heartbeat</div>
          </div>
        </div>
      </div>
    </div>
  );
}
