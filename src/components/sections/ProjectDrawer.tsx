"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
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

const emptySubscribe = () => () => {};

interface ProjectDrawerProps {
  project: ProjectItem | null;
  onClose: () => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] tracking-wider text-[#F59E0B] block mb-3">
      {children}
    </span>
  );
}

export default function ProjectDrawer({ project, onClose }: ProjectDrawerProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            key="drawer-backdrop"
            className="fixed inset-0 z-[80] bg-black/82"
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
            className="fixed top-0 right-0 bottom-0 z-[90] w-full max-w-xl flex flex-col bg-[#0B0D12] border-l border-white/[0.1] overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-7 py-6 bg-[#0B0D12] border-b border-white/[0.09]">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap font-mono text-[11px] text-[#94A3B8]">
                  <span className="text-[#F59E0B]">
                    {project.status}
                  </span>
                  {project.year && (
                    <span>
                      · {project.year}
                    </span>
                  )}
                </div>
                <h2 className="font-serif font-semibold text-[1.6rem] leading-snug text-[#F8FAFC] truncate">
                  {project.title}
                </h2>
                <p className="font-sans text-[13px] text-[#CBD5E1] leading-snug">
                  {project.tagline}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 mt-1 p-2 rounded-full border border-white/15 text-[#CBD5E1] hover:text-[#F8FAFC] hover:border-[#F59E0B]/50 transition-colors"
                aria-label="Close drawer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-9 px-7 py-8">
              <div>
                <SectionLabel>Problem</SectionLabel>
                <p className="font-sans text-sm leading-relaxed text-[#CBD5E1]">
                  {project.caseStudy.problem}
                </p>
              </div>

              <div>
                <SectionLabel>Solution</SectionLabel>
                <p className="font-sans text-sm leading-relaxed text-[#CBD5E1]">
                  {project.caseStudy.solution}
                </p>
              </div>

              <div>
                <SectionLabel>Architecture</SectionLabel>
                <p className="font-sans text-sm leading-relaxed text-[#CBD5E1]">
                  {project.caseStudy.architectureSummary}
                </p>
              </div>

              <div>
                <SectionLabel>My Contribution</SectionLabel>
                <p className="font-sans text-sm leading-relaxed text-[#CBD5E1]">
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
                        className="text-[#7DD3FC] flex-shrink-0 mt-0.5"
                      />
                      <span className="font-sans text-sm text-[#CBD5E1] leading-relaxed">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <SectionLabel>Tech Stack</SectionLabel>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-xs text-[#7DD3FC]">
                  {project.techStack.map((t, idx, arr) => (
                    <span key={t} className="inline-flex items-center gap-3">
                      <span>{t}</span>
                      {idx < arr.length - 1 && (
                        <span aria-hidden="true" className="text-white/20">/</span>
                      )}
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
                            className="text-[#F59E0B] flex-shrink-0 mt-0.5"
                          />
                          <span className="font-sans text-sm text-[#CBD5E1] leading-relaxed">
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
                          className="flex flex-col gap-1 p-4 rounded-xl bg-[#060709] border border-white/[0.09]"
                        >
                          <span className="font-mono text-xs text-[#F8FAFC] font-medium tabular-nums">
                            {m.value}
                          </span>
                          <span className="font-sans text-xs text-[#94A3B8]">
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
    </AnimatePresence>,
    document.body
  );
}
