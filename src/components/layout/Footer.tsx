"use client";

import { useState, useCallback } from "react";
import { ExternalLink, Copy, Check } from "lucide-react";
import { profileData } from "@/data/profile";
import Hairline from "@/components/motion/Hairline";
import RevealText from "@/components/motion/RevealText";

const CURRENT_YEAR = 2026;

const FOOTER_LINKS = [
  { label: "LinkedIn", href: profileData.links.linkedin },
  { label: "GitHub", href: profileData.links.github },
  { label: "Codolio", href: profileData.links.codolio },
  { label: "Hashnode", href: profileData.links.hashnode },
];

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = useCallback(async () => {
    const email = profileData.links.email;
    if (!email || email === "VERIFY_PUBLIC_EMAIL") return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked */
    }
  }, []);

  const emailIsVerified =
    profileData.links.email &&
    profileData.links.email !== "VERIFY_PUBLIC_EMAIL";

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-white/[0.08] bg-[#070707]">
      {/* ── Neutral dark ambient pulse ────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[700px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
            filter: "blur(110px)",
            animation: "footer-pulse 12s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes footer-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.06); }
        }
      `}</style>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col gap-16">
        <div>
          <RevealText>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#71717A]">
              08 / Contact
            </span>
          </RevealText>
          <div className="mt-4">
            <Hairline />
          </div>
        </div>

        <RevealText>
          <h2 className="font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] tracking-tight text-[#F4F4F5] max-w-3xl">
            Something great{" "}
            <em className="not-italic italic font-normal text-[#F4F4F5]">
              starts with a hello.
            </em>
          </h2>
        </RevealText>

        <RevealText delay={0.1}>
          <div className="flex flex-wrap gap-4 items-center">
            {emailIsVerified ? (
              <button
                onClick={handleCopyEmail}
                className="relative flex items-center gap-2.5 px-6 py-3 rounded-xl border border-white/15 bg-[#121212] text-[#F4F4F5] font-sans text-sm hover:border-white/35 transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {copied ? (
                    <Check size={14} className="text-[#D97706]" />
                  ) : (
                    <Copy size={14} />
                  )}
                  {copied ? "Copied!" : profileData.links.email}
                </span>
                <span
                  className="absolute inset-0 rounded-xl bg-white/5 transition-opacity duration-300"
                  style={{ opacity: copied ? 1 : 0 }}
                />
              </button>
            ) : (
              <span className="px-6 py-3 rounded-xl border border-white/10 bg-[#121212] font-mono text-[11px] text-[#71717A] opacity-60 cursor-not-allowed">
                Email — verify in profile.ts
              </span>
            )}

            <a
              href={profileData.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 bg-[#121212] text-[#F4F4F5] font-sans text-sm font-[500] hover:border-white/35 hover:bg-[#181818] transition-all duration-300"
            >
              Connect on LinkedIn
              <ExternalLink size={13} />
            </a>
          </div>
        </RevealText>

        <RevealText delay={0.15}>
          <div className="flex flex-wrap gap-6 items-center">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-[#71717A] hover:text-[#F4F4F5] transition-colors duration-200 uppercase tracking-wider"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </RevealText>

        <Hairline />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-mono text-[10px] text-[#71717A]">
            © {CURRENT_YEAR} Vivek Kumar. Built with Next.js, GSAP, Lenis &amp; Framer Motion.
          </span>
          <span className="font-mono text-[10px] text-[#71717A]">
            Luxury monochrome editorial design · zero fake metrics
          </span>
        </div>
      </div>
    </footer>
  );
}
