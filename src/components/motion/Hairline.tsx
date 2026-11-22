"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HairlineProps {
  /** Extra Tailwind classes on the line element */
  className?: string;
  /** Delay in seconds (default 0) */
  delay?: number;
}

/**
 * A 1px horizontal rule that draws left-to-right via GSAP ScrollTrigger
 * (`scaleX: 0 → 1`, `transformOrigin: "left center"`).
 * Respects `prefers-reduced-motion` by rendering instantly.
 */
export default function Hairline({ className = "", delay = 0 }: HairlineProps) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set(line, { scaleX: 1 });
      return;
    }

    gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

    const tween = gsap.to(line, {
      scaleX: 1,
      duration: 1.0,
      delay,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: line,
        start: "top 90%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay]);

  return (
    <div
      ref={lineRef}
      className={`h-px w-full bg-white/10 ${className}`}
      aria-hidden="true"
    />
  );
}
