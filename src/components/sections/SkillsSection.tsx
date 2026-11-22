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
    <section id="skills" className="relative py-28 px-6 bg-[#070707]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <RevealText>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#71717A]">
              03 / Technical Stack
            </span>
          </RevealText>
          <div className="mt-4">
            <Hairline />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mt-16">
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start flex flex-col gap-10">
            <RevealText>
              <h2 className="font-serif text-[clamp(2.1rem,3.5vw,2.8rem)] leading-[1.1] text-[#F4F4F5] tracking-tight">
                Fundamentals first.{" "}
                <em className="not-italic italic font-normal text-[#F4F4F5]">
                  Systems that hold up.
                </em>
              </h2>
            </RevealText>

            <RevealText delay={0.1}>
              <p className="font-sans text-sm leading-relaxed text-[#A1A1AA]">
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
                    <span className="font-mono text-[10px] text-[#D97706] mt-1 flex-shrink-0 w-5">
                      {p.index}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-[13px] font-[500] text-[#F4F4F5]">
                        {p.title}
                      </span>
                      <p className="font-sans text-[12px] leading-relaxed text-[#71717A]">
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
                <div className="rounded-xl border border-white/[0.08] bg-[#0E0E0E] p-6 hover:border-white/20 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A1A1AA]">
                      {cat.category}
                    </span>
                    <span className="h-px flex-1 bg-white/[0.06]" />
                    <span className="font-mono text-[10px] text-[#71717A]">
                      {cat.skills.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="font-sans text-[12px] px-3 py-1.5 rounded-lg border border-white/[0.08] bg-[#121212] text-[#A1A1AA] hover:border-white/25 hover:text-[#F4F4F5] transition-colors duration-200 cursor-default"
                      >
                        {skill}
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
