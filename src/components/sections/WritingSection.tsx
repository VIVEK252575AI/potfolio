"use client";

import { ExternalLink } from "lucide-react";
import { writingData, type ArticleItem } from "@/data/writing";
import { profileData } from "@/data/profile";
import RevealText from "@/components/motion/RevealText";
import Hairline from "@/components/motion/Hairline";

function ArticleCard({ article }: { article: ArticleItem }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-4 p-6 rounded-xl border border-white/[0.09] bg-[#0B0D12]/86 hover:border-[#F59E0B]/40 transition-all duration-300 h-full"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] tracking-wider text-[#F59E0B]">
          {article.platform}
        </span>
        <span className="font-mono text-[11px] text-[#94A3B8]">
          {article.publishedAt}
        </span>
      </div>

      <h3 className="font-serif font-semibold text-[1.15rem] leading-snug text-[#F8FAFC] group-hover:text-[#F59E0B] transition-colors duration-200">
        {article.title}
      </h3>

      <p className="font-sans text-[13px] leading-relaxed text-[#CBD5E1] line-clamp-3 flex-1">
        {article.excerpt}
      </p>

      <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-white/[0.08]">
        <div className="flex gap-2 flex-wrap font-mono text-[11px] text-[#7DD3FC]">
          {article.tags.slice(0, 3).map((tag, idx) => (
            <span key={tag} className="inline-flex items-center gap-2">
              {idx > 0 && <span aria-hidden="true" className="text-white/20">·</span>}
              <span>{tag}</span>
            </span>
          ))}
        </div>
        <span className="font-mono text-[11px] text-[#94A3B8]">
          {article.readTime}
        </span>
      </div>
    </a>
  );
}

function HashnodeFeatureCard() {
  return (
    <RevealText>
      <a
        href={profileData.links.hashnode}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col md:flex-row items-center md:items-start gap-8 p-8 md:p-10 rounded-2xl border border-white/[0.09] bg-[#0B0D12]/86 hover:border-[#F59E0B]/40 transition-all duration-300"
      >
        <div className="flex flex-col gap-4 flex-1">
          <span className="font-mono text-xs tracking-wider text-[#F59E0B]">
            Hashnode · Engineering Notes
          </span>
          <h3 className="font-serif font-semibold text-[clamp(1.5rem,3vw,2.2rem)] leading-snug text-[#94A3B8] text-balance">
            Engineering Notes &amp;{" "}
            <span className="text-[#F8FAFC]">Case Studies</span> on Hashnode
          </h3>
          <p className="font-sans text-[14px] leading-relaxed text-[#CBD5E1] max-w-lg">
            I write about AI agent architecture, LLM integration patterns,
            full-stack engineering, and CS fundamentals. Articles are published
            on Hashnode and will appear here as they go live.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-[#7DD3FC] mt-2 group-hover:text-[#F8FAFC] transition-colors">
            vivekxb.hashnode.dev
            <ExternalLink size={12} />
          </div>
        </div>

        <div
          className="flex-shrink-0 w-36 h-36 md:w-44 md:h-44 rounded-xl border border-white/[0.09] bg-[#07090D]/90 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:border-[#F59E0B]/35 transition-all duration-300"
          aria-hidden="true"
        >
          <pre className="font-mono text-[11px] text-[#94A3B8] leading-relaxed px-4">
            <span className="text-[#F59E0B]">{"{"}</span>
            {"\n"}
            {"  "}
            <span className="text-[#7DD3FC]">articles</span>: <span className="text-[#F8FAFC]">0</span>,
            {"\n"}
            {"  "}
            <span className="text-[#64748B]">status: &quot;soon&quot;</span>
            {"\n"}
            <span className="text-[#F59E0B]">{"}"}</span>
          </pre>
        </div>
      </a>
    </RevealText>
  );
}

export default function WritingSection() {
  const isEmpty = writingData.length === 0;

  return (
    <section id="writing" className="relative py-28 px-6 bg-transparent scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <RevealText>
            <span className="font-mono text-xs tracking-wider text-[#94A3B8]">
              <span className="text-[#F59E0B]">06.</span> Technical Writing
            </span>
          </RevealText>
          <div className="mt-4">
            <Hairline />
          </div>
        </div>

        <div className="mt-14">
          {isEmpty ? (
            <HashnodeFeatureCard />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {writingData.map((article, i) => (
                <RevealText key={article.id} delay={0.06 * i}>
                  <ArticleCard article={article} />
                </RevealText>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
