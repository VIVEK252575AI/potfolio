"use client";

import { useEffect, useRef } from "react";
import {
  CODER_TOKENS,
  computeScrollDynamics,
  evaluateVortexStreamPoint,
  lerp,
  projectWavePoint,
} from "@/utils/coderFieldMath";

interface Star {
  xFrac: number;
  yFrac: number;
  r: number;
  depth: number;
  phase: number;
  isAmber: boolean;
}

interface StreamGlyph {
  stream: number;
  offset: number;
  speed: number;
  token: string;
  size: number;
}

const STAR_COUNT = 95;
const STREAM_COUNT = 6;
const GLYPHS_PER_STREAM = 8;

function createStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, (_, i) => {
    const seed1 = Math.sin(i * 12.9898) * 43758.5453;
    const seed2 = Math.sin(i * 78.233) * 24634.6345;
    const f1 = seed1 - Math.floor(seed1);
    const f2 = seed2 - Math.floor(seed2);
    return {
      xFrac: f1,
      yFrac: f2,
      r: 1.2 + (i % 3) * 0.6,
      depth: 0.25 + (i % 5) * 0.18,
      phase: (i * 0.73) % (Math.PI * 2),
      isAmber: i % 8 === 0,
    };
  });
}

function createStreamGlyphs(): StreamGlyph[] {
  const glyphs: StreamGlyph[] = [];
  for (let s = 0; s < STREAM_COUNT; s++) {
    for (let g = 0; g < GLYPHS_PER_STREAM; g++) {
      const idx = (s * GLYPHS_PER_STREAM + g) % CODER_TOKENS.length;
      glyphs.push({
        stream: s,
        offset: g / GLYPHS_PER_STREAM,
        speed: 0.026 + (s % 3) * 0.009,
        token: CODER_TOKENS[idx],
        size: 10 + ((s + g) % 3),
      });
    }
  }
  return glyphs;
}

export default function CoderScrollBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const stars = createStars();
    const glyphs = createStreamGlyphs();

    // Resolve font family once so ctx.font never re-parses CSS variables per frame
    const monoVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-mono")
      .trim();
    const monoFamily = monoVar ? `${monoVar}, ui-monospace, monospace` : "ui-monospace, monospace";
    const fontBySize: Record<number, string> = {
      10: `500 10px ${monoFamily}`,
      11: `500 11px ${monoFamily}`,
      12: `500 12px ${monoFamily}`,
    };

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let smoothProgress = 0;
    let smoothVelocity = 0;
    let prevScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let pointerX = -9999;
    let pointerY = -9999;
    let smoothPointerX = -9999;
    let smoothPointerY = -9999;
    let rafId = 0;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const updateSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();

    const syncScrollDataset = (progress: number) => {
      canvas.dataset.scrollProgress = progress.toFixed(3);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (smoothPointerX < -1000) {
        smoothPointerX = pointerX;
        smoothPointerY = pointerY;
      }
    };

    const onPointerLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
    };

    const onScroll = () => {
      const now = performance.now();
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const dyn = computeScrollDynamics(
        window.scrollY,
        maxScroll,
        prevScrollY,
        now - lastScrollTime
      );
      prevScrollY = window.scrollY;
      lastScrollTime = now;
      smoothVelocity = lerp(smoothVelocity, dyn.velocity, 0.35);
      syncScrollDataset(dyn.progress);
    };

    window.addEventListener("resize", updateSize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const renderFrame = (nowMs: number) => {
      const timeSec = nowMs * 0.001;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const targetProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      smoothProgress = lerp(smoothProgress, targetProgress, 0.12);
      smoothVelocity = lerp(smoothVelocity, 0, 0.08);
      syncScrollDataset(smoothProgress);

      if (pointerX > -1000 && pointerY > -1000) {
        smoothPointerX = lerp(smoothPointerX, pointerX, 0.16);
        smoothPointerY = lerp(smoothPointerY, pointerY, 0.16);
      } else {
        smoothPointerX = -9999;
        smoothPointerY = -9999;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Bounded event-horizon radial glow driven by scroll
      const focalX = width * (0.76 - smoothProgress * 0.44);
      const focalY = height * (0.42 + Math.sin(smoothProgress * Math.PI) * 0.16);
      const glowRadius = Math.min(width, height) * 0.55;

      const amberGlow = ctx.createRadialGradient(
        focalX,
        focalY,
        0,
        focalX,
        focalY,
        glowRadius
      );
      const velocityGlow = Math.min(0.16, 0.09 + Math.abs(smoothVelocity) * 0.03);
      amberGlow.addColorStop(0, `rgba(245, 158, 11, ${velocityGlow.toFixed(3)})`);
      amberGlow.addColorStop(0.4, "rgba(217, 119, 6, 0.045)");
      amberGlow.addColorStop(0.75, "rgba(56, 189, 248, 0.015)");
      amberGlow.addColorStop(1, "rgba(6, 7, 9, 0)");
      ctx.fillStyle = amberGlow;
      ctx.fillRect(
        focalX - glowRadius,
        focalY - glowRadius,
        glowRadius * 2,
        glowRadius * 2
      );

      // Interactive pointer warm illumination lens
      if (smoothPointerX > -1000 && smoothPointerY > -1000) {
        const ptrR = 190;
        const ptrGlow = ctx.createRadialGradient(
          smoothPointerX,
          smoothPointerY,
          0,
          smoothPointerX,
          smoothPointerY,
          ptrR
        );
        ptrGlow.addColorStop(0, "rgba(245, 158, 11, 0.09)");
        ptrGlow.addColorStop(0.55, "rgba(56, 189, 248, 0.03)");
        ptrGlow.addColorStop(1, "rgba(6, 7, 9, 0)");
        ctx.fillStyle = ptrGlow;
        ctx.fillRect(
          smoothPointerX - ptrR,
          smoothPointerY - ptrR,
          ptrR * 2,
          ptrR * 2
        );
      }

      // 2. Parallax deep-space starfield
      const streak = Math.min(14, Math.abs(smoothVelocity) * 5.5);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const sx = s.xFrac * width;
        const syRaw =
          (s.yFrac * height - smoothProgress * height * 0.45 * s.depth) % height;
        const sy = syRaw < 0 ? syRaw + height : syRaw;
        const twinkle = 0.45 + 0.55 * Math.sin(timeSec * 1.1 + s.phase);
        const alpha = (0.16 + s.depth * 0.28) * twinkle;

        ctx.fillStyle = s.isAmber
          ? `rgba(245, 158, 11, ${alpha.toFixed(2)})`
          : `rgba(226, 232, 240, ${alpha.toFixed(2)})`;

        ctx.fillRect(
          sx,
          sy - (streak > 1 ? streak * 0.5 * s.depth : 0),
          s.r,
          s.r + (streak > 1 ? streak * s.depth : 0)
        );
      }

      // 3. Undulating 3D dot-matrix topographic horizon
      const isCompact = width < 768;
      const cols = isCompact ? 22 : 34;
      const rows = isCompact ? 12 : 18;
      const points = new Array(cols * rows);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          points[r * cols + c] = projectWavePoint(
            c,
            r,
            cols,
            rows,
            width,
            height,
            prefersReduced ? 0 : timeSec,
            smoothProgress,
            smoothVelocity,
            smoothPointerX,
            smoothPointerY
          );
        }
      }

      // Subtle wireframe topography strands along rows
      ctx.lineWidth = 0.65;
      for (let r = 0; r < rows; r += 2) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const p = points[r * cols + c];
          if (c === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        const rowAlpha = 0.05 + (r / rows) * 0.055;
        ctx.strokeStyle = `rgba(148, 163, 184, ${rowAlpha.toFixed(2)})`;
        ctx.stroke();
      }

      // Render crisp dot-matrix lattice nodes via fillRect for high FPS
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.x < -12 || p.x > width + 12 || p.y < -12 || p.y > height + 12) {
          continue;
        }
        const size = Math.max(1.5, 2.5 * p.scale + p.pointerInfluence * 1.8);

        if (p.amberMix > 0.35) {
          ctx.fillStyle = `rgba(245, 158, 11, ${(p.alpha * 0.92).toFixed(2)})`;
        } else if (p.cyanMix > 0.45 && p.pointerInfluence > 0.1) {
          ctx.fillStyle = `rgba(56, 189, 248, ${(p.alpha * 0.88).toFixed(2)})`;
        } else {
          ctx.fillStyle = `rgba(226, 232, 240, ${(p.alpha * 0.76).toFixed(2)})`;
        }

        ctx.fillRect(p.x - size * 0.5, p.y - size * 0.5, size, size);
      }

      // 4. Curved flowing code-symbol accretion streams
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const scrollDrift = smoothProgress * 0.35;
      let lastFontSize = -1;

      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];
        const rawT =
          (g.offset + (prefersReduced ? 0 : timeSec * g.speed) + scrollDrift) % 1;
        const pt = evaluateVortexStreamPoint(
          g.stream,
          rawT,
          width,
          height,
          prefersReduced ? 0 : timeSec,
          smoothProgress
        );

        if (pt.x < -50 || pt.x > width + 50 || pt.y < -30 || pt.y > height + 30) {
          continue;
        }

        let ptrBoost = 0;
        if (smoothPointerX > -1000 && smoothPointerY > -1000) {
          const dist = Math.hypot(pt.x - smoothPointerX, pt.y - smoothPointerY);
          if (dist < 170) ptrBoost = 1 - dist / 170;
        }

        const baseAlpha =
          (0.12 + pt.intensity * 0.18 + ptrBoost * 0.35) *
          (0.8 + Math.abs(smoothVelocity) * 0.25);
        const alpha = Math.min(0.72, baseAlpha);

        if (g.size !== lastFontSize) {
          ctx.font = fontBySize[g.size] || fontBySize[11];
          lastFontSize = g.size;
        }

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.tangentAngle);

        if (pt.amberMix > 0.52 || ptrBoost > 0.35) {
          ctx.fillStyle = `rgba(251, 191, 36, ${alpha.toFixed(2)})`;
        } else if (g.stream % 3 === 0) {
          ctx.fillStyle = `rgba(125, 211, 252, ${(alpha * 0.92).toFixed(2)})`;
        } else {
          ctx.fillStyle = `rgba(226, 232, 240, ${(alpha * 0.85).toFixed(2)})`;
        }

        ctx.fillText(g.token, 0, 0);
        ctx.restore();
      }
    };

    if (prefersReduced) {
      renderFrame(0);
    } else {
      let lastRender = 0;
      const loop = (now: number) => {
        rafId = requestAnimationFrame(loop);
        if (now - lastRender < 32) return;
        lastRender = now;
        renderFrame(now);
      };
      renderFrame(performance.now());
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="coder-scroll-bg"
      data-scroll-progress="0.000"
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none select-none"
    />
  );
}
