"use client";

import { useEffect, useRef, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CanvasMode = "ai" | "fullstack" | "dsa";

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  r: number;
  alpha: number;
  phase: number;
  theta: number;
  phi: number;
}

interface Props {
  mode: CanvasMode;
  className?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const N = 520; // Balanced particle density for smooth compositing
const LERP = 0.06; // position lerp speed
const HOVER_RADIUS = 130; // pointer repulsion radius (px)
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // Fibonacci golden angle

// Subtle warm amber palette
const COLOR_AMBER = "rgba(217,165,102,";
const COLOR_AMBER_HOT = "rgba(245,190,120,";

// ─── Geometry Calculators ───────────────────────────────────────────────────

function fibonacciSphere(
  i: number,
  total: number,
  cx: number,
  cy: number,
  radius: number,
  time: number
): { tx: number; ty: number; alpha: number } {
  const y = 1 - (i / (total - 1)) * 2; // -1 to 1
  const r = Math.sqrt(1 - y * y);
  const theta = GOLDEN_ANGLE * i;

  // Slow Y-axis rotation
  const rotAngle = time * 0.0003;
  const cosA = Math.cos(rotAngle);
  const sinA = Math.sin(rotAngle);
  const x3 = Math.cos(theta) * r;
  const z3 = Math.sin(theta) * r;
  const x3r = x3 * cosA - z3 * sinA;
  const z3r = x3 * sinA + z3 * cosA;

  // Depth-based alpha with higher base visibility
  const alpha = 0.25 + ((z3r + 1) / 2) * 0.7;

  return {
    tx: cx + x3r * radius,
    ty: cy + y * radius,
    alpha,
  };
}

function fullstackLayout(
  i: number,
  total: number,
  w: number,
  h: number
): { tx: number; ty: number; alpha: number } {
  const layerCount = 3;
  const layerIndex = Math.floor((i / total) * layerCount);
  const posInLayer = i % Math.ceil(total / layerCount);
  const perLayer = Math.ceil(total / layerCount);

  const layerY = [h * 0.28, h * 0.5, h * 0.72][Math.min(layerIndex, 2)];
  const cols = Math.ceil(Math.sqrt(perLayer * (w / (h * 0.3))));
  const col = posInLayer % cols;
  const row = Math.floor(posInLayer / cols);
  const rows = Math.ceil(perLayer / cols);

  const margin = w * 0.08;
  const usableW = w - margin * 2;
  const usableH = h * 0.14;

  const alpha = 0.35 + (layerIndex / (layerCount - 1)) * 0.55;

  return {
    tx: margin + (col / Math.max(cols - 1, 1)) * usableW,
    ty: layerY - usableH / 2 + (rows > 1 ? (row / (rows - 1)) * usableH : 0),
    alpha,
  };
}

function dsaGraph(
  i: number,
  total: number,
  cx: number,
  cy: number,
  radius: number
): { tx: number; ty: number; alpha: number } {
  const rings = [1, 8, 24, 64, total - 97];
  let ring = 0;
  let cumulative = 0;
  for (let r = 0; r < rings.length; r++) {
    if (i < cumulative + rings[r]) {
      ring = r;
      break;
    }
    cumulative += rings[r];
  }

  if (ring === 0) {
    return { tx: cx, ty: cy, alpha: 0.95 };
  }

  const indexInRing = i - cumulative;
  const countInRing = rings[ring];
  const angle = (indexInRing / countInRing) * Math.PI * 2 - Math.PI / 2;
  const dist = radius * (ring / (rings.length - 1));
  const alpha = 0.3 + ((rings.length - 1 - ring) / (rings.length - 1)) * 0.7;

  return {
    tx: cx + Math.cos(angle) * dist,
    ty: cy + Math.sin(angle) * dist,
    alpha,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ParticleCanvas({ mode, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const modeRef = useRef<CanvasMode>(mode);
  const timeRef = useRef<number>(0);
  const visibleRef = useRef<boolean>(true);

  const seedParticles = useCallback((w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.4;

    particlesRef.current = Array.from({ length: N }, (_, i) => {
      const theta = GOLDEN_ANGLE * i;
      const y01 = 1 - (i / (N - 1)) * 2;
      return {
        x: cx + Math.cos(theta) * radius * Math.sqrt(1 - y01 * y01),
        y: cy + y01 * radius,
        tx: cx,
        ty: cy,
        r: 1.6 + Math.random() * 1.2,
        alpha: 0.45,
        phase: Math.random() * Math.PI * 2,
        theta,
        phi: Math.asin(Math.max(-1, Math.min(1, y01))),
      };
    });
  }, []);

  const updateTargets = useCallback(
    (w: number, h: number, time: number) => {
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.4;
      const m = modeRef.current;

      particlesRef.current.forEach((p, i) => {
        let result: { tx: number; ty: number; alpha: number };
        if (m === "ai") {
          result = fibonacciSphere(i, N, cx, cy, radius, time);
        } else if (m === "fullstack") {
          result = fullstackLayout(i, N, w, h);
        } else {
          result = dsaGraph(i, N, cx, cy, radius);
        }
        p.tx = result.tx;
        p.ty = result.ty;
        p.alpha = result.alpha;
      });
    },
    []
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
      ctx.clearRect(0, 0, w, h);

      const ptr = pointerRef.current;
      const isAI = modeRef.current === "ai";

      particlesRef.current.forEach((p) => {
        p.x += (p.tx - p.x) * LERP;
        p.y += (p.ty - p.y) * LERP;

        const dx = p.x - ptr.x;
        const dy = p.y - ptr.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let hoverStrength = 0;
        if (dist < HOVER_RADIUS) {
          hoverStrength = 1 - dist / HOVER_RADIUS;
          const force = hoverStrength * 7;
          p.x += (dx / (dist || 1)) * force;
          p.y += (dy / (dist || 1)) * force;
        }

        let alpha = p.alpha;
        if (isAI) {
          alpha *= 0.7 + 0.3 * Math.sin(time * 0.0012 + p.phase);
        }
        alpha = Math.min(1, alpha + hoverStrength * 0.5);

        const color = hoverStrength > 0.05
          ? COLOR_AMBER_HOT + (alpha * (0.6 + hoverStrength * 0.4)).toFixed(3) + ")"
          : COLOR_AMBER + (alpha * 0.55).toFixed(3) + ")";

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 + hoverStrength * 0.35), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      // Faint warm connection lines in AI mode
      if (isAI) {
        ctx.lineWidth = 0.45;
        const pts = particlesRef.current;
        for (let i = 0; i < pts.length; i += 4) {
          const pi = pts[i];
          for (let j = i + 1; j < Math.min(i + 10, pts.length); j++) {
            const pj = pts[j];
            const d = Math.hypot(pi.x - pj.x, pi.y - pj.y);
            if (d < 30) {
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.strokeStyle = `${COLOR_AMBER}${((1 - d / 30) * 0.16).toFixed(3)})`;
              ctx.stroke();
            }
          }
        }
      }
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      seedParticles(rect.width, rect.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const onLeave = () => {
      pointerRef.current = { x: -9999, y: -9999 };
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let lastFrame = 0;
    const loop = (ts: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (!visibleRef.current) return;
      if (ts - lastFrame < 32) return;
      lastFrame = ts;

      timeRef.current = ts;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      if (!prefersReduced) {
        updateTargets(w, h, ts);
      }

      draw(ctx, w, h, ts);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [seedParticles, updateTargets, draw]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      aria-hidden="true"
      style={{ touchAction: "none" }}
    />
  );
}
