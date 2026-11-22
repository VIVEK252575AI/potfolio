"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, ExternalLink, BookOpen, Plus } from "lucide-react";
import { projectsData, type ProjectItem } from "@/data/projects";
import RevealText from "@/components/motion/RevealText";
import Hairline from "@/components/motion/Hairline";
import ProjectDrawer from "./ProjectDrawer";

// ─── Fallback preview (no thumbnail) ────────────────────────────────────────

function ArchitecturePreview({ project }: { project: ProjectItem }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 select-none bg-[#090B10]/85">
      {/* Subtle blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative z-10 flex flex-wrap gap-x-3 gap-y-1.5 justify-center font-mono text-[11px] text-[#CBD5E1]">
        {project.techStack.slice(0, 5).map((t, idx, arr) => (
          <span key={t} className="inline-flex items-center gap-3">
            <span>{t}</span>
            {idx < arr.length - 1 && <span className="text-[#F59E0B]/60">·</span>}
          </span>
        ))}
      </div>
      <div className="relative z-10 font-mono text-[11px] text-[#94A3B8] tracking-widest uppercase text-center">
        {project.id}
      </div>
    </div>
  );
}

// ─── Hero tier (full-width 2-column) ────────────────────────────────────────

function HeroProjectCard({
  project,
  onInspect,
}: {
  project: ProjectItem;
  onInspect: (p: ProjectItem) => void;
}) {
  return (
    <RevealText>
      <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-white/[0.09] bg-[#0B0D12]/86 group transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#F59E0B]/35">
        <div className="relative min-h-[260px] lg:min-h-[360px] overflow-hidden bg-[#07080B]/70">
          {project.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <ArchitecturePreview project={project} />
          )}
        </div>

        <div className="flex flex-col gap-5 p-8 lg:p-10">
          <div className="flex items-center gap-2.5 flex-wrap font-mono text-xs text-[#94A3B8]">
            <span className="text-[#F59E0B]">{project.status}</span>
            {project.year && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{project.year}</span>
              </>
            )}
            {project.categories.slice(0, 2).map((cat) => (
              <span key={cat} className="inline-flex items-center gap-2.5">
                <span aria-hidden="true">·</span>
                <span className="text-[#CBD5E1]">{cat}</span>
              </span>
            ))}
          </div>

          <h3 className="font-serif font-semibold text-[2rem] leading-tight text-[#F8FAFC]">
            {project.title}
          </h3>
          <p className="font-sans text-[15px] leading-relaxed text-[#CBD5E1]">
            {project.tagline}
          </p>

          <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[11px] text-[#94A3B8]">
            {project.techStack.map((t, idx, arr) => (
              <span key={t} className="inline-flex items-center gap-3">
                <span className="text-[#7DD3FC]">{t}</span>
                {idx < arr.length - 1 && (
                  <span aria-hidden="true" className="text-white/20">/</span>
                )}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-auto pt-4">
            <button
              onClick={() => onInspect(project)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F8FAFC] text-sm font-medium hover:bg-[#F59E0B]/25 hover:border-[#F59E0B] transition-all duration-200 whitespace-nowrap shrink-0"
            >
              <BookOpen size={14} />
              Inspect Case Study
            </button>
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/12 bg-white/[0.03] text-[#CBD5E1] text-sm hover:border-white/30 hover:text-[#F8FAFC] transition-all duration-200 whitespace-nowrap shrink-0"
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/12 bg-white/[0.03] text-[#CBD5E1] text-sm hover:border-[#38BDF8]/50 hover:text-[#F8FAFC] transition-all duration-200 whitespace-nowrap shrink-0"
              >
                <ExternalLink size={14} />
                Live
              </a>
            )}
          </div>
        </div>
      </div>
    </RevealText>
  );
}

// ─── Grid tier card ───────────────────────────────────────────────────────────

function GridProjectCard({
  project,
  onInspect,
}: {
  project: ProjectItem;
  onInspect: (p: ProjectItem) => void;
}) {
  return (
    <RevealText>
      <div className="flex flex-col rounded-xl overflow-hidden border border-white/[0.09] bg-[#0B0D12]/86 group h-full hover:border-[#F59E0B]/35 transition-all duration-300 ease-out hover:-translate-y-1">
        <div className="relative h-44 overflow-hidden bg-[#07080B]/70">
          {project.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <ArchitecturePreview project={project} />
          )}
        </div>

        <div className="flex flex-col gap-3 p-5 flex-1">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#94A3B8]">
            <span className="text-[#F59E0B]">{project.status}</span>
            {project.year && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{project.year}</span>
              </>
            )}
          </div>
          <h3 className="font-serif font-semibold text-[1.25rem] text-[#F8FAFC] leading-snug">
            {project.title}
          </h3>
          <p className="font-sans text-[14px] text-[#CBD5E1] leading-relaxed line-clamp-2">
            {project.tagline}
          </p>
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-auto pt-1 font-mono text-[11px] text-[#7DD3FC]">
            {project.techStack.slice(0, 4).map((t, idx, arr) => (
              <span key={t} className="inline-flex items-center gap-2.5">
                <span>{t}</span>
                {idx < arr.length - 1 && (
                  <span aria-hidden="true" className="text-white/20">/</span>
                )}
              </span>
            ))}
          </div>
          <button
            onClick={() => onInspect(project)}
            className="mt-2 self-start flex items-center gap-1.5 text-xs font-mono tracking-wider text-[#F8FAFC] hover:text-[#F59E0B] transition-colors whitespace-nowrap shrink-0"
          >
            <BookOpen size={12} />
            Case Study
          </button>
        </div>
      </div>
    </RevealText>
  );
}

// ─── Archive tier row ─────────────────────────────────────────────────────────

function ArchiveRow({
  project,
  onInspect,
}: {
  project: ProjectItem;
  onInspect: (p: ProjectItem) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-white/[0.08] last:border-b-0">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 py-5 text-left group"
      >
        <motion.div
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex-shrink-0 w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-[#71717A] group-hover:border-white/30 group-hover:text-[#F4F4F5] transition-colors"
        >
          <Plus size={13} />
        </motion.div>

        <div className="flex flex-1 items-center gap-6 min-w-0">
          <span className="font-serif font-medium text-[1.1rem] text-[#F8FAFC] leading-snug truncate">
            {project.title}
          </span>
          {project.year && (
            <span className="font-mono text-xs text-[#94A3B8] tabular-nums flex-shrink-0">
              {project.year}
            </span>
          )}
          <div className="hidden sm:flex gap-2 flex-shrink-0 font-mono text-[11px] text-[#94A3B8]">
            {project.categories.slice(0, 2).map((cat, idx) => (
              <span key={cat} className="inline-flex items-center gap-2">
                {idx > 0 && <span aria-hidden="true">·</span>}
                <span>{cat}</span>
              </span>
            ))}
          </div>
        </div>

        <span className="font-mono text-xs tracking-wider text-[#F59E0B] flex-shrink-0">
          {project.status}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="archive-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pl-11 flex flex-col gap-3">
              <p className="font-sans text-sm text-[#CBD5E1] leading-relaxed max-w-2xl">
                {project.tagline}
              </p>
              <div className="flex gap-4 flex-wrap mt-1">
                <button
                  onClick={() => onInspect(project)}
                  className="flex items-center gap-1.5 text-xs font-mono tracking-wider text-[#F8FAFC] hover:text-[#F59E0B] transition-colors"
                >
                  <BookOpen size={12} />
                  Case Study
                </button>
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono tracking-wider text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    <GitBranch size={12} />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [drawerProject, setDrawerProject] = useState<ProjectItem | null>(null);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    projectsData.forEach((p) => p.categories.forEach((c) => cats.add(c)));
    return ["All", ...Array.from(cats)];
  }, []);

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? projectsData
        : projectsData.filter((p) => p.categories.includes(activeFilter)),
    [activeFilter]
  );

  const heroProjects = filtered.filter((p) => p.tier === "hero");
  const gridProjects = filtered.filter((p) => p.tier === "grid");
  const archiveProjects = filtered.filter((p) => p.tier === "archive");

  return (
    <>
      <section id="work" className="relative py-28 px-6 bg-transparent scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          {/* ── Section index ─────────────────────────────────────── */}
          <div className="mb-8">
            <RevealText>
              <span className="font-mono text-xs tracking-wider text-[#94A3B8]">
                <span className="text-[#F59E0B]">02.</span> Selected Work
              </span>
            </RevealText>
            <div className="mt-4">
              <Hairline />
            </div>
          </div>

          {/* ── Interactive category filter tabs ───────────────────── */}
          <div className="flex flex-wrap gap-2 mb-14">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="relative px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-colors duration-200 outline-none border border-white/10 hover:border-[#F59E0B]/40 bg-[#0B0D12]/90 whitespace-nowrap shrink-0"
                style={{
                  color: activeFilter === cat ? "#F8FAFC" : "#94A3B8",
                }}
              >
                {activeFilter === cat && (
                  <motion.div
                    layoutId="project-filter-pill"
                    className="absolute inset-0 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/45"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>

          {/* ── Hero tier ─────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {heroProjects.length > 0 && (
              <motion.div
                key="hero-tier"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-8 mb-12"
              >
                {heroProjects.map((p) => (
                  <HeroProjectCard
                    key={p.id}
                    project={p}
                    onInspect={setDrawerProject}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Grid tier ─────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {gridProjects.length > 0 && (
              <motion.div
                key="grid-tier"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
              >
                {gridProjects.map((p) => (
                  <GridProjectCard
                    key={p.id}
                    project={p}
                    onInspect={setDrawerProject}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Archive tier ───────────────────────────────────────── */}
          {archiveProjects.length > 0 && (
            <div className="mt-10">
              <RevealText>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#71717A] mb-6 block">
                  Archive
                </span>
              </RevealText>
              <div className="border-t border-white/[0.08]">
                {archiveProjects.map((p) => (
                  <ArchiveRow
                    key={p.id}
                    project={p}
                    onInspect={setDrawerProject}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <ProjectDrawer
        project={drawerProject}
        onClose={() => setDrawerProject(null)}
      />
    </>
  );
}
