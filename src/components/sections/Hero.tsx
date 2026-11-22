"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profileData } from "@/data/profile";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const portraitWrap = portraitWrapRef.current;
    const portraitImg = portraitImgRef.current;
    const nameWords = nameRef.current?.querySelectorAll<HTMLElement>(
      "[data-hero-word]"
    );
    if (!hero || !portraitWrap || !portraitImg || !nameWords?.length) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set([portraitImg, contentRef.current, ...nameWords], {
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
        portraitImg,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.2 }
      )
      .fromTo(
        contentRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.7"
      )
      .fromTo(
        nameWords,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power4.out",
          clearProps: "transform",
        },
        "-=0.75"
      );

    // ── Scroll-scrubbed parallax & fade (tied to Hero scroll progress) ────
    const scrollTween = gsap.to(portraitWrap, {
      yPercent: -18,
      scale: 0.94,
      opacity: 0.15,
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
      className="relative min-h-screen flex flex-col justify-between px-6 pt-28 pb-12 overflow-hidden bg-[#070707]"
    >
      {/* ── Left margin vertical micro-label on desktop ──────────────────────── */}
      <div
        aria-hidden="true"
        className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-5 text-[#71717A] font-mono text-[10px] tracking-widest [writing-mode:vertical-lr] rotate-180 select-none opacity-60"
      >
        <span>01 / PRESENCE</span>
        <span className="text-[#D97706]">+</span>
        <span>AI SYSTEMS / FULL-STACK / ALGORITHMS</span>
      </div>

      {/* ── Top micro-metadata row ───────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between text-[11px] font-mono uppercase text-[#71717A] tracking-wider pt-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D97706] shadow-[0_0_8px_rgba(217,119,6,0.7)]" />
          <span>Aspiring AI &amp; Software Engineer</span>
        </div>
        <div>
          <span>B.Tech CSE &rsquo;27 · India</span>
        </div>
      </div>

      {/* ── Main Composition: Portrait + Overlapping Name ─────────────────────── */}
      <div className="relative z-10 max-w-4xl w-full mx-auto flex flex-col items-center my-auto pt-6 pb-4">
        {/* Center Portrait with radial/bottom vignette mask & GSAP parallax */}
        <div
          ref={portraitWrapRef}
          className="relative w-[280px] sm:w-[340px] md:w-[390px] aspect-[4/5] will-change-transform"
        >
          <div
            ref={portraitImgRef}
            className="w-full h-full relative opacity-0 [mask-image:radial-gradient(ellipse_72%_78%_at_50%_40%,black_45%,transparent_98%)]"
          >
            {profileData.portraitUrl ? (
              <Image
                src={profileData.portraitUrl}
                alt={profileData.name}
                fill
                priority
                sizes="(max-width: 768px) 340px, 390px"
                className="object-cover object-top grayscale contrast-110 select-none pointer-events-none"
              />
            ) : (
              <div className="w-full h-full bg-[#0E0E0E] rounded-full border border-white/5" />
            )}
          </div>
        </div>

        {/* Content container (Name, headline, buttons) */}
        <div
          ref={contentRef}
          className="relative z-10 flex flex-col items-center text-center -mt-14 md:-mt-20 w-full"
        >
          {/* Overlapping Oversized Display Name */}
          <h1
            ref={nameRef}
            className="font-serif text-[clamp(4.2rem,11vw,9.2rem)] leading-[0.92] tracking-[-0.03em] text-[#F4F4F5] select-none"
          >
            <span className="inline-block overflow-hidden align-bottom pb-[0.06em]">
              <span data-hero-word className="inline-block">
                Vivek
              </span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom pb-[0.06em]">
              <em
                data-hero-word
                className="inline-block not-italic italic font-normal text-[#F4F4F5]"
              >
                Kumar
              </em>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-lg font-sans text-sm md:text-base leading-relaxed text-[#A1A1AA]">
            {profileData.headline}
          </p>

          {/* Monochrome Action Row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#work"
              className="flex items-center gap-2 rounded-full border border-white/15 bg-[#111111] px-6 py-3 text-sm font-sans font-[500] text-[#F4F4F5] hover:border-white/35 hover:bg-[#171717] transition-all duration-300"
            >
              Explore my work ↓
            </a>
            <div className="flex items-center gap-5 px-2">
              <a
                href={profileData.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
              >
                GitHub ↗
              </a>
              <span className="text-[#71717A] text-xs">/</span>
              <a
                href={profileData.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* A low contrast ticker adds a moving editorial detail without competing with the portrait. */}
      <div className="hero-marquee" aria-hidden="true">
        <div className="hero-marquee-track">
          <span>
            AI systems <i>·</i> full-stack software <i>·</i> thoughtful
            engineering <i>·</i> algorithms <i>·</i>&nbsp;
          </span>
          <span>
            AI systems <i>·</i> full-stack software <i>·</i> thoughtful
            engineering <i>·</i> algorithms <i>·</i>&nbsp;
          </span>
        </div>
      </div>

      {/* ── Bottom borderless 3-column monospace status bar ───────────────────── */}
      <div className="relative z-10 max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left pt-6 border-t border-white/[0.06] text-[11px] font-mono uppercase tracking-wider text-[#71717A]">
        <div>
          <span>Scroll to discover ↓</span>
        </div>
        <div className="md:text-center text-[#A1A1AA]">
          <span>NVIDIA Deep Learning · Build with AI</span>
        </div>
        <div className="md:text-right">
          <span>Open to 2027 SWE &amp; AI Roles</span>
        </div>
      </div>
    </section>
  );
}
