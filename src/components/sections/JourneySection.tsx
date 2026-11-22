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
    <section ref={sectionRef} id="journey" className="relative py-28 px-6 bg-[#070707]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <RevealText>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#71717A]">
              07 / Education &amp; Journey
            </span>
          </RevealText>
          <div className="mt-4">
            <Hairline />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mt-16">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start flex flex-col gap-8">
            <RevealText>
              <h2 className="font-serif text-[clamp(2rem,3vw,2.6rem)] leading-[1.1] text-[#F4F4F5] tracking-tight">
                Building the{" "}
                <em className="not-italic italic font-normal text-[#F4F4F5]">
                  foundation.
                </em>
              </h2>
            </RevealText>

            <RevealText delay={0.1}>
              <div className="rounded-xl border border-white/[0.08] bg-[#0E0E0E] p-6 flex flex-col gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                  Education
                </span>
                <h3 className="font-sans text-[14px] font-[500] text-[#F4F4F5] leading-snug">
                  {profileData.education.degree}
                </h3>
                <p className="font-sans text-[12px] text-[#A1A1AA]">
                  {profileData.education.university}
                </p>
                <p className="font-mono text-[11px] text-[#71717A]">
                  {profileData.education.graduationYear}
                </p>
              </div>
            </RevealText>

            <RevealText delay={0.15}>
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                  Core Coursework
                </span>
                <div className="flex flex-wrap gap-2">
                  {profileData.education.coursework.map((course) => (
                    <span
                      key={course}
                      className="font-mono text-[9px] px-2.5 py-1 rounded-full border border-white/[0.08] bg-[#0E0E0E] text-[#71717A] uppercase tracking-wider"
                    >
                      {course.replace(/ \(.*?\)/, "")}
                    </span>
                  ))}
                </div>
              </div>
            </RevealText>
          </div>

          <div className="lg:col-span-8">
            <div className="relative flex gap-8">
              <div className="relative flex flex-col items-center flex-shrink-0 pt-2">
                <div className="w-px flex-1 bg-white/[0.08]" />
                <div
                  ref={lineRef}
                  className="absolute top-0 left-0 right-0 w-px h-full origin-top bg-white/25"
                  style={{ transformOrigin: "top center" }}
                />
              </div>

              <div className="flex flex-col gap-10 pb-4 flex-1">
                {MILESTONES.map((m, i) => (
                  <RevealText key={m.title} delay={0.08 * i}>
                    <div className="relative flex flex-col gap-1.5">
                      <div
                        className="absolute -left-[2.6rem] top-1 w-3 h-3 rounded-full border-2 bg-[#070707] flex-shrink-0"
                        style={{
                          borderColor: m.highlight ? "#D97706" : "rgba(255,255,255,0.4)",
                        }}
                      />

                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className="font-mono text-[10px] uppercase tracking-widest"
                          style={{
                            color: m.highlight ? "#D97706" : "#A1A1AA",
                          }}
                        >
                          {m.date}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-white/[0.08] bg-[#121212] text-[#71717A]">
                          {m.type}
                        </span>
                      </div>

                      <h3 className="font-sans text-[14px] font-[500] text-[#F4F4F5] leading-snug">
                        {m.title}
                      </h3>
                      <p className="font-mono text-[10px] text-[#71717A] leading-relaxed">
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
