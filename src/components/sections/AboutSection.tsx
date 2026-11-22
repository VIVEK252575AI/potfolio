"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CanvasMode } from "@/components/motion/ParticleCanvas";
import RevealText from "@/components/motion/RevealText";
import Hairline from "@/components/motion/Hairline";
import dynamic from "next/dynamic";

const AboutModel3D = dynamic(
  () => import("@/components/three/AboutModel3D"),
  { ssr: false }
);

const TABS: { label: string; modelTitle: string; mode: CanvasMode; desc: string }[] = [
  {
    label: "AI Systems",
    modelTitle: "3D Model: Neural Tensor Core",
    mode: "ai",
    desc: "Building production-grade LLM applications, agentic workflows, and multimodal AI systems. Comfortable with the full pipeline from prompt engineering to API integration.",
  },
  {
    label: "Full-Stack",
    modelTitle: "3D Model: Layered Compute Stack",
    mode: "fullstack",
    desc: "Comfortable shipping from database schema to React UI: REST APIs with Node/Express, Next.js App Router, Tailwind layouts, and PostgreSQL/MongoDB data modeling.",
  },
  {
    label: "DSA / C++",
    modelTitle: "3D Model: Geodesic Graph Matrix",
    mode: "dsa",
    desc: "Competitive programming background in C++. Strong in data structures, algorithmic problem-solving, complexity analysis, and CS fundamentals (OS, DBMS, CN, OOP).",
  },
];

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section
      id="about"
      className="relative py-28 px-6 overflow-hidden bg-transparent scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Section index ───────────────────────────────────────── */}
        <div className="mb-8">
          <RevealText>
            <span className="font-mono text-xs tracking-wider text-[#94A3B8]">
              <span className="text-[#F59E0B]">01.</span> Engineering Philosophy
            </span>
          </RevealText>
          <div className="mt-4">
            <Hairline />
          </div>
        </div>

        {/* ── Two-column split ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mt-14">
          {/* ── Left: LARGE interactive Three.js 3D Model Showcase ───── */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="relative w-full h-[420px] sm:h-[490px] lg:h-[530px] overflow-hidden rounded-2xl bg-[#090B10]/85 border border-white/[0.08]">
              <AboutModel3D
                mode={TABS[activeTab].mode}
                className="w-full h-full"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#94A3B8] px-1">
              <span className="text-[#CBD5E1]">{TABS[activeTab].modelTitle}</span>
              <span>Move cursor to spotlight · drag or scroll to orbit</span>
            </div>

            {/* Segmented mode selector tabs */}
            <div className="flex gap-2 flex-wrap">
              {TABS.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className="relative px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-colors duration-200 outline-none border border-white/10 hover:border-[#F59E0B]/40 bg-[#0B0D12]/90 whitespace-nowrap shrink-0"
                  style={{
                    color: activeTab === i ? "#F8FAFC" : "#94A3B8",
                  }}
                >
                  {activeTab === i && (
                    <motion.div
                      layoutId="about-tab-pill"
                      className="absolute inset-0 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/45"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Editorial coder prose ─────────────────────────── */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            <RevealText>
              <h2 className="font-serif font-semibold text-[clamp(2.1rem,4vw,3.1rem)] leading-[1.08] text-[#94A3B8] tracking-tight text-balance">
                Undergraduate building at the{" "}
                <span className="text-[#F8FAFC]">intersection</span> of{" "}
                <span className="text-[#F59E0B]">AI</span> and{" "}
                <span className="text-[#F8FAFC]">software engineering.</span>
              </h2>
            </RevealText>

            {/* Animated tab description */}
            <div className="relative min-h-[84px] p-5 rounded-xl bg-[#0B0D12]/88 border border-white/[0.08]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="font-sans text-[0.95rem] leading-relaxed text-[#CBD5E1]"
                >
                  {TABS[activeTab].desc}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Narrative */}
            <RevealText delay={0.1}>
              <p className="font-sans text-[15px] leading-relaxed text-[#B4BCC8]">
                I&rsquo;m a B.Tech CSE student at Rajasthan Technical University
                (Expected 2027), currently focused on building LLM-powered
                applications, multimodal AI agents, and clean full-stack
                systems. My academic foundation covers DSA, OS, DBMS, CN,
                and ML — complemented by certifications from NVIDIA and
                practical exposure through the Google for Developers Build
                with AI Bootcamp. I approach engineering problems from first
                principles and prioritize shipping reliable, maintainable code
                over impressive-sounding abstractions.
              </p>
            </RevealText>

            {/* Coursework metadata */}
            <RevealText delay={0.15}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-[#94A3B8]">
                {[
                  "DSA",
                  "OOP",
                  "DBMS",
                  "OS",
                  "CN",
                  "AI / ML",
                  "Software Engineering",
                ].map((c, idx, arr) => (
                  <span key={c} className="inline-flex items-center gap-3">
                    <span className="text-[#CBD5E1]">{c}</span>
                    {idx < arr.length - 1 && (
                      <span aria-hidden="true" className="text-[#F59E0B]/60">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </RevealText>
          </div>
        </div>
      </div>
    </section>
  );
}
