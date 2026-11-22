"use client";

import { skillsData } from "@/data/skills";
import RevealText from "@/components/motion/RevealText";
import Hairline from "@/components/motion/Hairline";

const PILLARS = [
  {
    index: "01",
    title: "Fundamentals over frameworks",
    body: "Deep understanding of CS core — OS, DBMS, CN, algorithms — means I can reason about systems, not just configure them.",
  },
  {
    index: "02",
    title: "AI as a capability layer",
    body: "LLMs and agents are engineering tools. I integrate them where they provide real leverage, not for aesthetic novelty.",
  },
  {
    index: "03",
    title: "Ship, measure, improve",
    body: "Working software that solves a concrete problem beats elegant code that never ships. Iteration driven by real feedback.",
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="relative py-28 px-6 bg-transparent scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <RevealText>
            <span className="font-mono text-xs tracking-wider text-[#94A3B8]">
              <span className="text-[#F59E0B]">03.</span> Technical Stack
            </span>
          </RevealText>
          <div className="mt-4">
            <Hairline />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mt-16">
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start flex flex-col gap-10">
            <RevealText>
              <h2 className="font-serif font-semibold text-[clamp(2.1rem,3.5vw,2.8rem)] leading-[1.1] text-[#94A3B8] tracking-tight text-balance">
                Fundamentals first.{" "}
                <span className="text-[#F8FAFC]">
                  Systems that hold up.
                </span>
              </h2>
            </RevealText>

            <RevealText delay={0.1}>
              <p className="font-sans text-[15px] leading-relaxed text-[#CBD5E1]">
                I focus on building a durable technical base across AI systems,
                full-stack development, and CS fundamentals — with C++ as my
                primary language for algorithmic work and Python for ML
                pipelines.
              </p>
            </RevealText>

            <div className="flex flex-col gap-6 mt-2">
              {PILLARS.map((p, i) => (
                <RevealText key={p.index} delay={0.08 * i}>
                  <div className="flex gap-4">
                    <span className="font-mono text-xs font-medium text-[#F59E0B] tabular-nums mt-0.5 flex-shrink-0 w-5">
                      {p.index}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-[14px] font-semibold text-[#F8FAFC]">
                        {p.title}
                      </span>
                      <p className="font-sans text-[13px] leading-relaxed text-[#B4BCC8]">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </RevealText>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5">
            {skillsData.map((cat, i) => (
              <RevealText key={cat.category} delay={0.05 * i}>
                <div className="rounded-xl border border-white/[0.09] bg-[#0B0D12]/86 p-6 hover:border-[#F59E0B]/35 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs tracking-wider text-[#F8FAFC]">
                      {cat.category}
                    </span>
                    <span className="h-px flex-1 bg-white/[0.08]" />
                    <span className="font-mono text-xs text-[#F59E0B] tabular-nums">
                      {cat.skills.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-2 font-mono text-xs text-[#CBD5E1]">
                    {cat.skills.map((skill, idx, arr) => (
                      <span key={skill} className="inline-flex items-center gap-3">
                        <span className="hover:text-[#7DD3FC] transition-colors cursor-default">
                          {skill}
                        </span>
                        {idx < arr.length - 1 && (
                          <span aria-hidden="true" className="text-white/20">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </RevealText>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
