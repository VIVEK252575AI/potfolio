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
    <footer id="contact" className="relative z-10 overflow-hidden border-t border-white/[0.08] bg-[#060709]/65 scroll-mt-24">
      {/* ── Subtle amber & slate ambient glow ────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[700px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(245,158,11,0.06) 0%, transparent 70%)",
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
            <span className="font-mono text-xs tracking-wider text-[#94A3B8]">
              <span className="text-[#F59E0B]">08.</span> Contact
            </span>
          </RevealText>
          <div className="mt-4">
            <Hairline />
          </div>
        </div>

        <RevealText>
          <h2 className="font-serif font-semibold text-[clamp(2.5rem,6.5vw,5rem)] leading-[0.98] tracking-tight text-[#94A3B8] max-w-3xl text-balance">
            Something great{" "}
            <span className="text-[#F8FAFC]">
              starts with a hello.
            </span>
          </h2>
        </RevealText>

        <RevealText delay={0.1}>
          <div className="flex flex-wrap gap-4 items-center">
            {emailIsVerified ? (
              <button
                onClick={handleCopyEmail}
                className="relative flex items-center gap-2.5 px-6 py-3 rounded-xl border border-white/15 bg-[#0B0D12]/80 text-[#F8FAFC] font-sans text-sm hover:border-[#F59E0B]/50 transition-all duration-300 overflow-hidden group whitespace-nowrap shrink-0"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {copied ? (
                    <Check size={14} className="text-[#F59E0B]" />
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
              <a
                href={profileData.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 bg-[#0B0D12]/80 text-[#F8FAFC] font-sans text-sm font-medium hover:border-white/35 transition-all duration-300 whitespace-nowrap shrink-0"
              >
                Explore GitHub
                <ExternalLink size={13} />
              </a>
            )}

            <a
              href={profileData.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#F59E0B]/40 bg-[#F59E0B]/15 text-[#F8FAFC] font-sans text-sm font-semibold hover:border-[#F59E0B] hover:bg-[#F59E0B]/25 transition-all duration-300 whitespace-nowrap shrink-0"
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
                className="font-mono text-xs text-[#94A3B8] hover:text-[#F59E0B] transition-colors duration-200 tracking-wider"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </RevealText>

        <Hairline />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-mono text-[11px] text-[#94A3B8]">
            © {CURRENT_YEAR} Vivek Kumar. Built with Next.js, GSAP, Lenis &amp; Framer Motion.
          </span>
          <span className="font-mono text-[11px] text-[#94A3B8]">
            B.Tech CSE · AI &amp; Software Engineering
          </span>
        </div>
      </div>
    </footer>
  );
}
