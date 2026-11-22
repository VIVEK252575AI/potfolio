"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profileData } from "@/data/profile";

gsap.registerPlugin(ScrollTrigger);

const HeroPortrait3D = dynamic(
  () => import("@/components/three/HeroPortrait3D"),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full h-full flex items-center justify-center"
        aria-hidden="true"
      />
    ),
  }
);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const portraitInnerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const portraitWrap = portraitWrapRef.current;
    const portraitInner = portraitInnerRef.current;
    const nameWords = nameRef.current?.querySelectorAll<HTMLElement>(
      "[data-hero-word]"
    );
    if (!hero || !portraitWrap || !portraitInner || !nameWords?.length) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set([portraitInner, contentRef.current, ...nameWords], {
        opacity: 1,
        scale: 1,
        yPercent: 0,
      });
      return;
    }

    // ── Mount entrance timeline ───────────────────────────────────────────
    const mountTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    mountTl
      .fromTo(
        portraitInner,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 1.05 }
      )
      .fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.85 },
        "-=0.7"
      )
      .fromTo(
        nameWords,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power4.out",
          clearProps: "transform",
        },
        "-=0.75"
      );

    // ── Scroll-scrubbed parallax & fade ───────────────────────────────────
    const scrollTween = gsap.to(portraitWrap, {
      yPercent: -12,
      scale: 0.96,
      opacity: 0.35,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      mountTl.kill();
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between px-6 pt-20 sm:pt-24 pb-6 overflow-hidden bg-transparent"
    >
      {/* ── Left margin vertical micro-label on desktop ──────────────────────── */}
      <div
        aria-hidden="true"
        className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-5 text-[#94A3B8] font-mono text-[10px] tracking-widest [writing-mode:vertical-lr] rotate-180 select-none opacity-75"
      >
        <span>01. PRESENCE</span>
        <span className="text-[#F59E0B]">+</span>
        <span>AI SYSTEMS · FULL-STACK · 3D INTERACTION</span>
      </div>

      {/* ── Top micro-metadata row ───────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between text-[11px] font-mono text-[#94A3B8] tracking-wider pt-1">
        <div className="flex items-center gap-2">
          <span className="text-[#F59E0B]">&gt;_</span>
          <span className="text-[#CBD5E1]">Aspiring AI &amp; Software Engineer</span>
        </div>
        <div>
          <span>B.Tech CSE &rsquo;27 · India</span>
        </div>
      </div>

      {/* ── Main Composition: Interactive 3D Portrait Sculpture + Name ──────── */}
      <div className="relative z-10 max-w-5xl w-full mx-auto flex flex-col items-center my-auto pt-2 pb-2">
        <div
          ref={portraitWrapRef}
          className="relative w-full max-w-[660px] h-[300px] sm:h-[390px] md:h-[430px] will-change-transform"
        >
          <div ref={portraitInnerRef} className="w-full h-full opacity-0">
            <HeroPortrait3D
              src={profileData.portraitUrl || "/images/portrait-nobg.png"}
              alt={profileData.name}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Content container (Name, headline, buttons) */}
        <div
          ref={contentRef}
          className="relative z-10 flex flex-col items-center text-center -mt-16 sm:-mt-20 md:-mt-24 w-full"
        >
          {/* Oversized Coder Display Name */}
          <h1
            ref={nameRef}
            className="font-serif font-semibold text-[clamp(3.2rem,8.5vw,7.4rem)] leading-[0.94] tracking-[-0.035em] select-none"
          >
            <span className="inline-block overflow-hidden align-bottom pb-[0.06em]">
              <span data-hero-word className="inline-block text-[#94A3B8]">
                Vivek
              </span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom pb-[0.06em]">
              <span data-hero-word className="inline-block text-[#F8FAFC]">
                Kumar
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-xl font-sans text-sm md:text-[15px] leading-relaxed text-[#CBD5E1]">
            {profileData.headline}
          </p>

          {/* Action Row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#work"
              className="flex items-center gap-2 rounded-xl border border-[#F59E0B]/45 bg-[#0B0D12]/90 px-6 py-2.5 text-sm font-sans font-semibold text-[#F8FAFC] hover:border-[#F59E0B] hover:bg-[#F59E0B]/15 transition-all duration-300 whitespace-nowrap shrink-0"
            >
              Explore my work ↓
            </a>
            <div className="flex items-center gap-5 px-2">
              <a
                href={profileData.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[#CBD5E1] hover:text-[#F59E0B] transition-colors whitespace-nowrap shrink-0"
              >
                GitHub ↗
              </a>
              <span className="text-[#64748B] text-xs">/</span>
              <a
                href={profileData.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[#CBD5E1] hover:text-[#38BDF8] transition-colors whitespace-nowrap shrink-0"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Non-overlapping editorial ticker cleanly separated above bottom bar */}
      <div className="w-full flex flex-col gap-3">
        <div className="hero-marquee" aria-hidden="true">
          <div className="hero-marquee-track">
            <span>
              AI systems <i>·</i> full-stack software <i>·</i> interactive 3D
              engineering <i>·</i> algorithms <i>·</i>&nbsp;
            </span>
            <span>
              AI systems <i>·</i> full-stack software <i>·</i> interactive 3D
              engineering <i>·</i> algorithms <i>·</i>&nbsp;
            </span>
          </div>
        </div>

        {/* Bottom borderless 3-column monospace status bar */}
        <div className="relative z-10 max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-center md:text-left pt-4 border-t border-white/[0.08] text-[11px] font-mono tracking-wider text-[#94A3B8]">
          <div>
            <span>Move cursor &amp; scroll to explore 3D field ↓</span>
          </div>
          <div className="md:text-center text-[#CBD5E1]">
            <span>NVIDIA Deep Learning · Build with AI</span>
          </div>
          <div className="md:text-right text-[#F59E0B]">
            <span>Open to 2027 SWE &amp; AI Roles</span>
          </div>
        </div>
      </div>
    </section>
  );
}
