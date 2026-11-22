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
      className="group flex flex-col gap-4 p-6 rounded-xl border border-white/[0.08] bg-[#0E0E0E] hover:border-white/25 transition-all duration-300 h-full"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#A1A1AA]">
          {article.platform}
        </span>
        <span className="font-mono text-[10px] text-[#71717A]">
          {article.publishedAt}
        </span>
      </div>

      <h3 className="font-serif text-[1.15rem] leading-snug text-[#F4F4F5] group-hover:text-[#A1A1AA] transition-colors duration-200">
        {article.title}
      </h3>

      <p className="font-sans text-[12px] leading-relaxed text-[#71717A] line-clamp-3 flex-1">
        {article.excerpt}
      </p>

      <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-white/[0.06]">
        <div className="flex gap-1.5 flex-wrap">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-white/[0.08] bg-[#121212] text-[#71717A] uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="font-mono text-[10px] text-[#71717A]">
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
        className="group flex flex-col md:flex-row items-center md:items-start gap-8 p-8 md:p-10 rounded-2xl border border-white/[0.08] bg-[#0E0E0E] hover:border-white/25 transition-all duration-300"
      >
        <div className="flex flex-col gap-4 flex-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#71717A] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            Hashnode · Engineering Notes
          </span>
          <h3 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] leading-snug text-[#F4F4F5] group-hover:opacity-90 transition-opacity duration-300">
            Engineering Notes &amp;{" "}
            <em className="not-italic italic font-normal text-[#F4F4F5]">Case Studies</em> on Hashnode
          </h3>
          <p className="font-sans text-[13px] leading-relaxed text-[#A1A1AA] max-w-lg">
            I write about AI agent architecture, LLM integration patterns,
            full-stack engineering, and CS fundamentals. Articles are published
            on Hashnode and will appear here as they go live.
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#A1A1AA] mt-2 group-hover:text-[#F4F4F5] transition-colors">
            vivekxb.hashnode.dev
            <ExternalLink size={11} />
          </div>
        </div>

        <div
          className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-xl border border-white/[0.08] bg-[#121212] flex items-center justify-center opacity-40 group-hover:opacity-75 transition-opacity duration-500"
          aria-hidden="true"
        >
          <span className="font-mono text-[11px] text-[#71717A] text-center px-4 leading-relaxed">
            {"{"}
            <br />
            &nbsp;&nbsp;articles: 0,
            <br />
            &nbsp;&nbsp;// coming soon
            <br />
            {"}"}
          </span>
        </div>
      </a>
    </RevealText>
  );
}

export default function WritingSection() {
  const isEmpty = writingData.length === 0;

  return (
    <section id="writing" className="relative py-28 px-6 bg-[#070707]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <RevealText>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#71717A]">
              05 / Technical Writing
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
