"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CanvasMode } from "@/components/motion/ParticleCanvas";
import RevealText from "@/components/motion/RevealText";
import Hairline from "@/components/motion/Hairline";
import dynamic from "next/dynamic";

const ParticleCanvas = dynamic(
  () => import("@/components/motion/ParticleCanvas"),
  { ssr: false }
);

const TABS: { label: string; mode: CanvasMode; desc: string }[] = [
  {
    label: "AI Systems",
    mode: "ai",
    desc: "Building production-grade LLM applications, agentic workflows, and multimodal AI systems. Comfortable with the full pipeline from prompt engineering to API integration.",
  },
  {
    label: "Full-Stack",
    mode: "fullstack",
    desc: "Comfortable shipping from database schema to React UI: REST APIs with Node/Express, Next.js App Router, Tailwind layouts, and PostgreSQL/MongoDB data modeling.",
  },
  {
    label: "DSA / C++",
    mode: "dsa",
    desc: "Competitive programming background in C++. Strong in data structures, algorithmic problem-solving, complexity analysis, and CS fundamentals (OS, DBMS, CN, OOP).",
  },
];

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="about" className="relative py-28 px-6 overflow-hidden bg-[#070707]">
      <div className="max-w-6xl mx-auto">
        {/* ── Section index ───────────────────────────────────────── */}
        <div className="mb-8">
          <RevealText>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#71717A]">
              01 / Engineering Philosophy
            </span>
          </RevealText>
          <div className="mt-4">
            <Hairline />
          </div>
        </div>

        {/* ── Two-column split ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mt-16">
          {/* ── Left: Canvas + tab pills (Frameless) ────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Frameless ParticleCanvas without rectangular border box */}
            <div className="relative w-full aspect-square max-w-sm mx-auto lg:mx-0 overflow-hidden">
              <ParticleCanvas mode={TABS[activeTab].mode} className="w-full h-full" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 65%, #070707 98%)",
                }}
              />
            </div>

            {/* Monochrome Framer Motion layoutId pill tabs */}
            <div className="flex gap-2 flex-wrap">
              {TABS.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className="relative px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors duration-200 outline-none border border-white/10 hover:border-white/25 bg-[#121212]"
                  style={{
                    color: activeTab === i ? "#F4F4F5" : "#71717A",
                  }}
                >
                  {activeTab === i && (
                    <motion.div
                      layoutId="about-tab-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/20"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {activeTab === i && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                    )}
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Editorial text ────────────────────────────────── */}
          <div className="flex flex-col gap-8 lg:pt-4">
            {/* Crisp off-white display headline */}
            <RevealText>
              <h2 className="font-serif text-[clamp(2.1rem,4vw,3.2rem)] leading-[1.08] text-[#F4F4F5] tracking-tight">
                Undergraduate building at the{" "}
                <em className="not-italic italic font-normal text-[#F4F4F5]">
                  intersection
                </em>{" "}
                of AI and software engineering.
              </h2>
            </RevealText>

            {/* Animated tab description */}
            <div className="relative min-h-[80px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="font-sans text-[0.9375rem] leading-relaxed text-[#A1A1AA]"
                >
                  {TABS[activeTab].desc}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Honest narrative */}
            <RevealText delay={0.1}>
              <p className="font-sans text-sm leading-relaxed text-[#71717A]">
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

            {/* Coursework chips */}
            <RevealText delay={0.15}>
              <div className="flex flex-wrap gap-2">
                {[
                  "DSA", "OOP", "DBMS", "OS", "CN",
                  "AI / ML", "Software Engineering",
                ].map((c) => (
                  <span
                    key={c}
                    className="font-mono text-[10px] px-3 py-1 rounded-full border border-white/[0.08] bg-[#0E0E0E] text-[#71717A] uppercase tracking-wider"
                  >
                    {c}
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
