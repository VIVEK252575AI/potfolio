"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  children: React.ReactNode;
  /** Skip ScrollTrigger and animate on mount immediately (e.g. Hero) */
  immediate?: boolean;
  /** Extra classes on the outer mask wrapper */
  className?: string;
  /** Delay in seconds (default 0) */
  delay?: number;
}

/**
 * Wraps children in an `overflow-hidden` mask and translates the inner
 * element from yPercent 105 → 0 as it enters the viewport.
 * Respects `prefers-reduced-motion` by skipping the GSAP tween.
 */
export default function RevealText({
  children,
  immediate = false,
  className = "",
  delay = 0,
}: RevealTextProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return; // native render, no animation

    // Set initial hidden state
    gsap.set(inner, { yPercent: 105, opacity: 0 });

    if (immediate) {
      // Hero: animate immediately on mount
      gsap.to(inner, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        delay,
        ease: "power4.out",
      });
      return;
    }

    // Scroll-driven reveal
    const tween = gsap.to(inner, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      delay,
      ease: "power4.out",
      scrollTrigger: {
        trigger: wrapper,
        start: "top 84%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [immediate, delay]);

  return (
    <div ref={wrapperRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
