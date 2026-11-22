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
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 select-none bg-[#0B0B0B]">
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative z-10 flex flex-wrap gap-2 justify-center">
        {project.techStack.slice(0, 5).map((t) => (
          <span
            key={t}
            className="font-mono text-[10px] px-2.5 py-1 rounded border border-white/10 text-[#A1A1AA] tracking-wider uppercase bg-[#121212]"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="relative z-10 font-mono text-[11px] text-[#71717A] tracking-widest uppercase text-center">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0E0E0E] group transition-all duration-500 ease-out hover:-translate-y-1">
        <div className="relative min-h-[260px] lg:min-h-[360px] overflow-hidden bg-[#070707]">
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
          <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-[#0D0D0D]/90 border border-white/10 text-[#F4F4F5] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            {project.status}
          </span>
        </div>

        <div className="flex flex-col gap-5 p-8 lg:p-10">
          <div className="flex items-center gap-2 flex-wrap">
            {project.year && (
              <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-widest">
                {project.year}
              </span>
            )}
            {project.categories.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className="font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-white/[0.08] text-[#71717A] uppercase tracking-wider"
              >
                {cat}
              </span>
            ))}
          </div>

          <h3 className="font-serif text-[2.1rem] leading-tight text-[#F4F4F5]">
            {project.title}
          </h3>
          <p className="font-sans text-sm leading-relaxed text-[#A1A1AA]">
            {project.tagline}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] px-2.5 py-0.5 rounded border border-white/[0.08] bg-[#121212] text-[#A1A1AA] uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-auto pt-4">
            <button
              onClick={() => onInspect(project)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121212] border border-white/15 text-[#F4F4F5] text-sm font-[500] hover:border-white/35 transition-all duration-300"
            >
              <BookOpen size={14} />
              Inspect Case Study
            </button>
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-[#A1A1AA] text-sm hover:border-white/30 hover:text-[#F4F4F5] transition-all duration-300"
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-[#A1A1AA] text-sm hover:border-white/30 hover:text-[#F4F4F5] transition-all duration-300"
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
      <div className="flex flex-col rounded-xl overflow-hidden border border-white/[0.08] bg-[#0E0E0E] group h-full hover:border-white/25 transition-all duration-500 ease-out hover:-translate-y-1">
        <div className="relative h-44 overflow-hidden bg-[#070707]">
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
          <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#0D0D0D]/90 border border-white/10 text-[#F4F4F5] flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#D97706]" />
            {project.status}
          </span>
        </div>

        <div className="flex flex-col gap-3 p-5 flex-1">
          <h3 className="font-serif text-[1.25rem] text-[#F4F4F5] leading-snug">
            {project.title}
          </h3>
          <p className="font-sans text-[13px] text-[#A1A1AA] leading-relaxed line-clamp-2">
            {project.tagline}
          </p>
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {project.techStack.slice(0, 4).map((t) => (
              <span
                key={t}
                className="font-mono text-[9px] px-2 py-0.5 rounded border border-white/[0.08] text-[#71717A] uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>
          <button
            onClick={() => onInspect(project)}
            className="mt-2 self-start flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
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
          <span className="font-serif text-[1.1rem] text-[#F4F4F5] leading-snug truncate">
            {project.title}
          </span>
          {project.year && (
            <span className="font-mono text-[10px] text-[#71717A] flex-shrink-0">
              {project.year}
            </span>
          )}
          <div className="hidden sm:flex gap-2 flex-shrink-0">
            {project.categories.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-white/[0.08] text-[#71717A] uppercase tracking-wider"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        <span className="font-mono text-[10px] uppercase tracking-widest text-[#A1A1AA] flex-shrink-0">
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
              <p className="font-sans text-sm text-[#A1A1AA] leading-relaxed max-w-2xl">
                {project.tagline}
              </p>
              <div className="flex gap-3 flex-wrap mt-1">
                <button
                  onClick={() => onInspect(project)}
                  className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
                >
                  <BookOpen size={12} />
                  Case Study
                </button>
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#71717A] hover:text-[#F4F4F5] transition-colors"
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
      <section id="work" className="relative py-28 px-6 bg-[#070707]">
        <div className="max-w-6xl mx-auto">
          {/* ── Section index ─────────────────────────────────────── */}
          <div className="mb-8">
            <RevealText>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#71717A]">
                02 / Selected Work
              </span>
            </RevealText>
            <div className="mt-4">
              <Hairline />
            </div>
          </div>

          {/* ── Monochrome category filter pills ───────────────────── */}
          <div className="flex flex-wrap gap-2 mb-14">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="relative px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors duration-200 outline-none border border-white/10 hover:border-white/25 bg-[#121212]"
                style={{
                  color: activeFilter === cat ? "#F4F4F5" : "#71717A",
                }}
              >
                {activeFilter === cat && (
                  <motion.div
                    layoutId="project-filter-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/20"
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
