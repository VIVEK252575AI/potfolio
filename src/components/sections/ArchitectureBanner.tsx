"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
      { yPercent: -8 },
      {
        yPercent: 8,
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
      className="relative py-28 px-6 overflow-hidden bg-[#0A0A0A] border-y border-white/[0.08]"
    >
      {/* Neutral dark ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[800px] h-[400px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, transparent 65%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div ref={innerRef} className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-12">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#71717A]">
            06 / System Architecture
          </span>
          <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.5vw,2.7rem)] leading-tight text-[#F4F4F5] tracking-tight">
            OmniSight{" "}
            <em className="not-italic italic font-normal text-[#F4F4F5]">
              Autonomous QA Pipeline
            </em>
          </h2>
          <p className="mt-3 font-sans text-sm text-[#71717A] max-w-xl">
            Conceptual pipeline — to be updated after full repository audit.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row items-stretch gap-0">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.id} className="flex flex-col md:flex-row items-stretch flex-1">
              <div className="flex-1 flex flex-col gap-3 p-6 rounded-xl border border-white/[0.08] bg-[#0E0E0E] backdrop-blur-sm hover:border-white/20 transition-colors duration-300">
                <span className="font-mono text-[10px] text-[#D97706] uppercase tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-sans text-[13px] font-[500] text-[#F4F4F5] leading-snug">
                  {step.label}
                </h3>
                <p className="font-sans text-[11px] text-[#71717A] leading-relaxed">
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
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                    />
                    <polyline
                      points="12,3 18,8 12,13"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              )}

              {i < PIPELINE_STEPS.length - 1 && (
                <div className="md:hidden flex justify-center py-2">
                  <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
                    <line x1="8" y1="0" x2="8" y2="18" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <polyline points="3,12 8,18 13,12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
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
