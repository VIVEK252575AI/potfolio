"use client";

import { ExternalLink } from "lucide-react";
import { credentialsData } from "@/data/credentials";
import { profileData } from "@/data/profile";
import RevealText from "@/components/motion/RevealText";
import Hairline from "@/components/motion/Hairline";

export default function CredentialsSection() {
  const { dsa, links } = profileData;

  return (
    <section id="credentials" className="relative py-28 px-6 bg-transparent scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <RevealText>
            <span className="font-mono text-xs tracking-wider text-[#94A3B8]">
              <span className="text-[#F59E0B]">05.</span> Credentials &amp; DSA
            </span>
          </RevealText>
          <div className="mt-4">
            <Hairline />
          </div>
        </div>

        {/* Crisp issuer headline row */}
        <RevealText>
          <div className="mt-14 mb-12 flex flex-wrap gap-x-8 gap-y-3 items-baseline">
            {credentialsData.map((c) => (
              <span
                key={c.id}
                className="font-serif font-semibold text-[clamp(1.5rem,3.2vw,2.4rem)] leading-tight text-[#F8FAFC]"
              >
                {c.issuer}
                <span className="text-[#F59E0B] text-sm ml-2 font-mono font-normal tabular-nums">
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
              <div className="flex flex-col gap-4 p-6 rounded-xl border border-white/[0.09] bg-[#0B0D12]/86 hover:border-[#F59E0B]/35 transition-colors duration-300 h-full">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[11px] tracking-wider text-[#F59E0B]">
                      {c.issuer}
                    </span>
                    <h3 className="font-serif font-semibold text-[1.2rem] leading-snug text-[#F8FAFC]">
                      {c.title}
                    </h3>
                  </div>
                  {c.verificationUrl && (
                    <a
                      href={c.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-1 text-xs font-mono text-[#7DD3FC] hover:text-[#F8FAFC] transition-colors mt-1 whitespace-nowrap"
                    >
                      Verify <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono text-[#94A3B8]">
                  <span>{c.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{c.issueDate}</span>
                  {c.credentialId && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[11px] text-[#CBD5E1]/80 tracking-wide">
                        ID: {c.credentialId}
                      </span>
                    </>
                  )}
                </div>

                {c.scope && (
                  <p className="font-sans text-[13px] leading-relaxed text-[#CBD5E1] border-t border-white/[0.08] pt-3">
                    {c.scope}
                  </p>
                )}

                {c.signatory && (
                  <p className="font-sans text-xs text-[#94A3B8]">
                    — {c.signatory}
                  </p>
                )}
              </div>
            </RevealText>
          ))}
        </div>

        {/* DSA & Competitive Programming panel */}
        <RevealText>
          <div className="rounded-2xl border border-white/[0.09] bg-[#0B0D12]/88 overflow-hidden">
            <div className="px-7 py-5 border-b border-white/[0.08] flex items-center justify-between gap-4">
              <span className="font-mono text-xs tracking-wider text-[#F8FAFC]">
                DSA &amp; Competitive Programming
              </span>
              <span className="font-mono text-xs text-[#7DD3FC]">
                Primary: {dsa.primaryLanguage}
              </span>
            </div>

            <div className="p-7 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] tracking-wider text-[#94A3B8]">
                  Problems Solved
                </span>
                {dsa.verifiedProblemCount !== null ? (
                  <span className="font-serif font-semibold text-[2.5rem] text-[#F8FAFC] tabular-nums">
                    {dsa.verifiedProblemCount}
                  </span>
                ) : (
                  <span className="font-sans text-sm text-[#CBD5E1] italic">
                    Updating verified count…
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] tracking-wider text-[#94A3B8]">
                  Recognition
                </span>
                <span className="font-sans text-[14px] font-semibold text-[#F8FAFC]">
                  Certificate of Excellence
                </span>
                <span className="font-sans text-xs text-[#CBD5E1]">
                  Indian CP Summer Camp · MAANG.in · Sep 2026
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <span className="font-mono text-[11px] tracking-wider text-[#94A3B8]">
                  Profiles
                </span>
                <div className="flex flex-col gap-2">
                  <a
                    href={links.codolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[13px] font-mono text-[#CBD5E1] hover:text-[#F59E0B] transition-colors"
                  >
                    <ExternalLink size={12} />
                    Codolio Profile ↗
                  </a>
                  {links.leetcode && (
                    <a
                      href={links.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[13px] font-mono text-[#CBD5E1] hover:text-[#38BDF8] transition-colors"
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
