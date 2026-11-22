"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ArchitectureRing3D = dynamic(
  () => import("@/components/three/ArchitectureRing3D"),
  { ssr: false }
);

const PIPELINE_STEPS = [
  { id: "ui-snap", label: "UI Snapshot & DOM", sub: "Screenshot + accessibility tree capture" },
  { id: "ai-reason", label: "Multimodal AI Reasoner", sub: "Vision-language model interprets broken UI state" },
  { id: "heal", label: "Self-Healing Selector Engine", sub: "Generates robust replacement selectors" },
  { id: "qa-run", label: "Autonomous QA Runner", sub: "Executes repaired test suite end-to-end" },
];

export default function ArchitectureBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const inner = innerRef.current;
    if (!banner || !inner) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const tween = gsap.fromTo(
      inner,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: banner,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={bannerRef}
      id="architecture"
      className="relative py-32 px-6 overflow-hidden bg-[#080A0F]/75 border-y border-white/[0.08] scroll-mt-24"
    >
      {/* Large scroll-reactive 3D Orbital Accelerator behind pipeline */}
      <ArchitectureRing3D className="absolute inset-0 z-0 opacity-90" />

      <div ref={innerRef} className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-12">
          <span className="font-mono text-xs tracking-wider text-[#94A3B8]">
            <span className="text-[#F59E0B]">04.</span> System Architecture
          </span>
          <h2 className="mt-4 font-serif font-semibold text-[clamp(1.8rem,3.5vw,2.7rem)] leading-tight text-[#94A3B8] tracking-tight text-balance">
            OmniSight{" "}
            <span className="text-[#F8FAFC]">
              Autonomous QA Pipeline
            </span>
          </h2>
          <p className="mt-3 font-sans text-sm text-[#CBD5E1] max-w-xl">
            Conceptual pipeline — to be updated after full repository audit.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row items-stretch gap-0">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.id} className="flex flex-col md:flex-row items-stretch flex-1">
              <div className="flex-1 flex flex-col gap-3 p-6 rounded-xl border border-white/[0.09] bg-[#0B0D12]/88 hover:border-[#F59E0B]/40 transition-colors duration-300">
                <span className="font-mono text-[11px] font-medium text-[#F59E0B] tabular-nums tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-sans text-[14px] font-semibold text-[#F8FAFC] leading-snug">
                  {step.label}
                </h3>
                <p className="font-sans text-[13px] text-[#B4BCC8] leading-relaxed">
                  {step.sub}
                </p>
              </div>

              {i < PIPELINE_STEPS.length - 1 && (
                <div className="hidden md:flex items-center px-2 flex-shrink-0">
                  <svg
                    width="24"
                    height="16"
                    viewBox="0 0 24 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <line
                      x1="0"
                      y1="8"
                      x2="18"
                      y2="8"
                      stroke="rgba(245,158,11,0.35)"
                      strokeWidth="1"
                    />
                    <polyline
                      points="12,3 18,8 12,13"
                      fill="none"
                      stroke="rgba(245,158,11,0.45)"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              )}

              {i < PIPELINE_STEPS.length - 1 && (
                <div className="md:hidden flex justify-center py-2">
                  <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
                    <line x1="8" y1="0" x2="8" y2="18" stroke="rgba(245,158,11,0.35)" strokeWidth="1" />
                    <polyline points="3,12 8,18 13,12" fill="none" stroke="rgba(245,158,11,0.45)" strokeWidth="1" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
