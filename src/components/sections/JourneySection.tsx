"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profileData } from "@/data/profile";
import RevealText from "@/components/motion/RevealText";
import Hairline from "@/components/motion/Hairline";

gsap.registerPlugin(ScrollTrigger);

const MILESTONES = [
  {
    date: "Jul 2025",
    title: "NVIDIA — Fundamentals of Deep Learning",
    type: "Certification",
    detail: "Certificate of Competency · ID: wqg9IBseSPuMrDo7rSt08Q",
  },
  {
    date: "2025",
    title: "ISRO Bharatiya Antariksh Hackathon",
    type: "Hackathon",
    detail: "Certificate of Acknowledgement (Idea Submission) · Code: 2025H2S06BAH25-P11848",
  },
  {
    date: "Sep 2026",
    title: "Indian CP Summer Camp — MAANG.in",
    type: "Competitive Programming",
    detail: "Certificate of Excellence · Instructor: Vivek Gupta",
  },
  {
    date: "Nov 2026",
    title: "Google for Developers — Build with AI Bootcamp",
    type: "Bootcamp · Gurugram",
    detail: "Certificate of Participation · ID: 2026H2S11BWAIBGGR-P00427",
  },
  {
    date: "2027",
    title: "Target: AI / Software Engineering Roles",
    type: "Goal",
    detail: "Graduating B.Tech CSE, RTU · Open to full-time and internship opportunities",
    highlight: true,
  },
];

export default function JourneySection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    const section = sectionRef.current;
    if (!line || !section) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(line, { scaleY: 1 });
      return;
    }

    gsap.set(line, { scaleY: 0, transformOrigin: "top center" });

    const tween = gsap.to(line, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "bottom 60%",
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="journey" className="relative py-28 px-6 bg-transparent scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <RevealText>
            <span className="font-mono text-xs tracking-wider text-[#94A3B8]">
              <span className="text-[#F59E0B]">07.</span> Education &amp; Journey
            </span>
          </RevealText>
          <div className="mt-4">
            <Hairline />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mt-16">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start flex flex-col gap-8">
            <RevealText>
              <h2 className="font-serif font-semibold text-[clamp(2rem,3vw,2.6rem)] leading-[1.1] text-[#94A3B8] tracking-tight text-balance">
                Building the{" "}
                <span className="text-[#F8FAFC]">
                  foundation.
                </span>
              </h2>
            </RevealText>

            <RevealText delay={0.1}>
              <div className="rounded-xl border border-white/[0.09] bg-[#0B0D12]/86 p-6 flex flex-col gap-3">
                <span className="font-mono text-[11px] tracking-wider text-[#F59E0B]">
                  Education
                </span>
                <h3 className="font-sans text-[15px] font-semibold text-[#F8FAFC] leading-snug">
                  {profileData.education.degree}
                </h3>
                <p className="font-sans text-[13px] text-[#CBD5E1]">
                  {profileData.education.university}
                </p>
                <p className="font-mono text-xs text-[#94A3B8]">
                  {profileData.education.graduationYear}
                </p>
              </div>
            </RevealText>

            <RevealText delay={0.15}>
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[11px] tracking-wider text-[#94A3B8]">
                  Core Coursework
                </span>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-xs text-[#CBD5E1]">
                  {profileData.education.coursework.map((course, idx, arr) => (
                    <span key={course} className="inline-flex items-center gap-3">
                      <span>{course.replace(/ \(.*?\)/, "")}</span>
                      {idx < arr.length - 1 && (
                        <span aria-hidden="true" className="text-[#F59E0B]/60">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </RevealText>
          </div>

          <div className="lg:col-span-8">
            <div className="relative flex gap-8">
              <div className="relative flex flex-col items-center flex-shrink-0 pt-2">
                <div className="w-px flex-1 bg-white/[0.1]" />
                <div
                  ref={lineRef}
                  className="absolute top-0 left-0 right-0 w-px h-full origin-top bg-[#F59E0B]/65"
                  style={{ transformOrigin: "top center" }}
                />
              </div>

              <div className="flex flex-col gap-10 pb-4 flex-1">
                {MILESTONES.map((m, i) => (
                  <RevealText key={m.title} delay={0.08 * i}>
                    <div className="relative flex flex-col gap-1.5">
                      <div
                        className="absolute -left-[2.6rem] top-1 w-3 h-3 rounded-full border-2 bg-[#060709] flex-shrink-0"
                        style={{
                          borderColor: m.highlight ? "#F59E0B" : "rgba(248,250,252,0.5)",
                        }}
                      />

                      <div className="flex items-center gap-2.5 flex-wrap font-mono text-xs">
                        <span
                          className="tabular-nums tracking-wider"
                          style={{
                            color: m.highlight ? "#F59E0B" : "#7DD3FC",
                          }}
                        >
                          {m.date}
                        </span>
                        <span aria-hidden="true" className="text-white/25">·</span>
                        <span className="text-[#94A3B8]">
                          {m.type}
                        </span>
                      </div>

                      <h3 className="font-sans text-[15px] font-semibold text-[#F8FAFC] leading-snug">
                        {m.title}
                      </h3>
                      <p className="font-mono text-xs text-[#94A3B8] leading-relaxed">
                        {m.detail}
                      </p>
                    </div>
                  </RevealText>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
