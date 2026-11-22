"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  Zap,
  FileText,
} from "lucide-react";
import type { ProjectItem } from "@/data/projects";

interface ProjectDrawerProps {
  project: ProjectItem | null;
  onClose: () => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#71717A] block mb-3">
      {children}
    </span>
  );
}

export default function ProjectDrawer({ project, onClose }: ProjectDrawerProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            key="drawer-backdrop"
            className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            key="drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} case study`}
            className="fixed top-0 right-0 bottom-0 z-[90] w-full max-w-xl flex flex-col bg-[#0E0E0E] border-l border-white/[0.08] overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-7 py-6 bg-[#0E0E0E] border-b border-white/[0.08]">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#F4F4F5] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                    {project.status}
                  </span>
                  {project.year && (
                    <span className="font-mono text-[10px] text-[#71717A]">
                      · {project.year}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-[1.6rem] leading-snug text-[#F4F4F5] truncate">
                  {project.title}
                </h2>
                <p className="font-sans text-[13px] text-[#A1A1AA] leading-snug">
                  {project.tagline}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 mt-1 p-2 rounded-full border border-white/10 text-[#71717A] hover:text-[#F4F4F5] hover:border-white/25 transition-colors"
                aria-label="Close drawer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-9 px-7 py-8">
              <div>
                <SectionLabel>Problem</SectionLabel>
                <p className="font-sans text-sm leading-relaxed text-[#A1A1AA]">
                  {project.caseStudy.problem}
                </p>
              </div>

              <div>
                <SectionLabel>Solution</SectionLabel>
                <p className="font-sans text-sm leading-relaxed text-[#A1A1AA]">
                  {project.caseStudy.solution}
                </p>
              </div>

              <div>
                <SectionLabel>Architecture</SectionLabel>
                <p className="font-sans text-sm leading-relaxed text-[#A1A1AA]">
                  {project.caseStudy.architectureSummary}
                </p>
              </div>

              <div>
                <SectionLabel>My Contribution</SectionLabel>
                <p className="font-sans text-sm leading-relaxed text-[#A1A1AA]">
                  {project.caseStudy.myContribution}
                </p>
              </div>

              <div>
                <SectionLabel>Key Features</SectionLabel>
                <ul className="flex flex-col gap-2.5">
                  {project.caseStudy.keyFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle2
                        size={14}
                        className="text-[#A1A1AA] flex-shrink-0 mt-0.5"
                      />
                      <span className="font-sans text-sm text-[#A1A1AA] leading-relaxed">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <SectionLabel>Tech Stack</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] px-2.5 py-1 rounded border border-white/[0.08] bg-[#121212] text-[#A1A1AA] uppercase tracking-wider"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {project.caseStudy.engineeringChallenges &&
                project.caseStudy.engineeringChallenges.length > 0 && (
                  <div>
                    <SectionLabel>Engineering Challenges</SectionLabel>
                    <ul className="flex flex-col gap-2.5">
                      {project.caseStudy.engineeringChallenges.map((c) => (
                        <li key={c} className="flex items-start gap-3">
                          <Zap
                            size={14}
                            className="text-[#D97706] flex-shrink-0 mt-0.5"
                          />
                          <span className="font-sans text-sm text-[#A1A1AA] leading-relaxed">
                            {c}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {project.caseStudy.verifiedMetrics &&
                project.caseStudy.verifiedMetrics.length > 0 && (
                  <div>
                    <SectionLabel>Verified Metrics</SectionLabel>
                    <div className="grid grid-cols-2 gap-3">
                      {project.caseStudy.verifiedMetrics.map((m) => (
                        <div
                          key={m.label}
                          className="flex flex-col gap-1 p-4 rounded-xl bg-[#070707] border border-white/[0.08]"
                        >
                          <span className="font-mono text-xs text-[#F4F4F5] font-[500]">
                            {m.value}
                          </span>
                          <span className="font-sans text-[11px] text-[#71717A]">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {project.screenshots && project.screenshots.length > 0 && (
                <div>
                  <SectionLabel>Screenshots</SectionLabel>
                  <div className="flex flex-col gap-3">
                    {project.screenshots.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={src}
                        alt={`${project.title} screenshot ${i + 1}`}
                        className="w-full rounded-xl border border-white/[0.08] object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              {(project.links.github ||
                project.links.live ||
                project.links.paperOrDoc) && (
                <div>
                  <SectionLabel>Links</SectionLabel>
                  <div className="flex flex-wrap gap-3">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-[#A1A1AA] text-sm hover:border-white/30 hover:text-[#F4F4F5] transition-all"
                      >
                        <GitBranch size={14} />
                        GitHub
                      </a>
                    )}
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-[#A1A1AA] text-sm hover:border-white/30 hover:text-[#F4F4F5] transition-all"
                      >
                        <ExternalLink size={14} />
                        Live Demo
                      </a>
                    )}
                    {project.links.paperOrDoc && (
                      <a
                        href={project.links.paperOrDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-[#A1A1AA] text-sm hover:border-white/30 hover:text-[#F4F4F5] transition-all"
                      >
                        <FileText size={14} />
                        Paper / Docs
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
