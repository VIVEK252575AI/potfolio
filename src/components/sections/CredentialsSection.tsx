"use client";

import { ExternalLink } from "lucide-react";
import { credentialsData } from "@/data/credentials";
import { profileData } from "@/data/profile";
import RevealText from "@/components/motion/RevealText";
import Hairline from "@/components/motion/Hairline";

export default function CredentialsSection() {
  const { dsa, links } = profileData;

  return (
    <section id="credentials" className="relative py-28 px-6 bg-[#070707]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <RevealText>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#71717A]">
              04 / Credentials &amp; DSA
            </span>
          </RevealText>
          <div className="mt-4">
            <Hairline />
          </div>
        </div>

        {/* Crisp off-white oversized issuer headline row (No purple, cyan, green, or orange) */}
        <RevealText>
          <div className="mt-14 mb-12 flex flex-wrap gap-x-8 gap-y-3 items-baseline">
            {credentialsData.map((c) => (
              <span
                key={c.id}
                className="font-serif text-[clamp(1.6rem,3.5vw,2.6rem)] leading-tight text-[#F4F4F5]"
              >
                {c.issuer}
                <span className="text-[#71717A] text-[1rem] ml-2 font-sans font-[300]">
                  {c.issueDate.split(" ").pop()}
                </span>
              </span>
            ))}
          </div>
        </RevealText>

        {/* Credential cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {credentialsData.map((c, i) => (
            <RevealText key={c.id} delay={0.07 * i}>
              <div className="flex flex-col gap-4 p-6 rounded-xl border border-white/[0.08] bg-[#0E0E0E] hover:border-white/20 transition-colors duration-300 h-full">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                      {c.issuer}
                    </span>
                    <h3 className="font-serif text-[1.2rem] leading-snug text-[#F4F4F5]">
                      {c.title}
                    </h3>
                  </div>
                  {c.verificationUrl && (
                    <a
                      href={c.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-1 text-[11px] font-mono text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors mt-1"
                    >
                      Verify <ExternalLink size={10} />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-mono text-[#71717A]">
                  <span>{c.type}</span>
                  <span>{c.issueDate}</span>
                  {c.credentialId && (
                    <span className="text-[10px] opacity-60 tracking-wide">
                      ID: {c.credentialId}
                    </span>
                  )}
                </div>

                {c.scope && (
                  <p className="font-sans text-[12px] leading-relaxed text-[#A1A1AA] border-t border-white/[0.06] pt-3">
                    {c.scope}
                  </p>
                )}

                {c.signatory && (
                  <p className="font-sans text-[11px] text-[#71717A]">
                    — {c.signatory}
                  </p>
                )}
              </div>
            </RevealText>
          ))}
        </div>

        {/* DSA & Competitive Programming panel */}
        <RevealText>
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E0E] overflow-hidden">
            <div className="px-7 py-5 border-b border-white/[0.08] flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                DSA &amp; Competitive Programming
              </span>
              <span className="font-mono text-[10px] text-[#71717A]">
                Primary: {dsa.primaryLanguage}
              </span>
            </div>

            <div className="p-7 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                  Problems Solved
                </span>
                {dsa.verifiedProblemCount !== null ? (
                  <span className="font-serif text-[2.5rem] text-[#F4F4F5]">
                    {dsa.verifiedProblemCount}
                  </span>
                ) : (
                  <span className="font-sans text-[13px] text-[#71717A] italic">
                    Updating verified count…
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                  Recognition
                </span>
                <span className="font-sans text-[13px] font-[500] text-[#F4F4F5]">
                  Certificate of Excellence
                </span>
                <span className="font-sans text-[11px] text-[#71717A]">
                  Indian CP Summer Camp · MAANG.in · Sep 2026
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A]">
                  Profiles
                </span>
                <div className="flex flex-col gap-2">
                  <a
                    href={links.codolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[13px] font-sans text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
                  >
                    <ExternalLink size={12} />
                    Codolio Profile ↗
                  </a>
                  {links.leetcode && (
                    <a
                      href={links.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[13px] font-sans text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
                    >
                      <ExternalLink size={12} />
                      LeetCode Profile ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </RevealText>
      </div>
    </section>
  );
}
