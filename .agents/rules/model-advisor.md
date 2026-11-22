---
trigger: always_on
---

# Vivek Kumar Portfolio — Permanent Workspace Rules & Model Routing Advisor

Because you cannot programmatically change the active IDE model selector, you MUST evaluate task complexity before writing code and advise the user when a model switch is optimal.

## Available Models on This Workspace
1. **Gemini 3.8 Flash (Medium)** — Fast execution, CLI scaffolding, editing `src/data/*.ts`, copy updates, documentation, minor Tailwind tweaks, and routine lint/build fixes.
2. **Claude Sonnet 4.6 (Thinking)** — Default for UI components, editorial dark-mode styling, Tailwind layouts, Framer Motion (`layoutId`, `AnimatePresence`), standard GSAP `ScrollTrigger` animations, and responsive polish.
3. **Claude Opus 4.6 (Thinking)** — Reserve ONLY for initial system architecture, `Lenis` + `GSAP` ticker synchronization, complex HTML5 `<canvas>` physics (`ParticleCanvas.tsx`), or debugging issues that fail twice on another model.

## Mandatory Routing Behavior
Before starting any new task or phase, check which tier the request belongs to:
- If the task requires **high-complexity architecture, canvas math/physics, or has already failed 2 consecutive fix attempts**, STOP before editing files and output:
  > **[MODEL CHECK] Recommended: `Claude Opus 4.6 (Thinking)`** — Reason: `<1-line reason>`. Switch in the model dropdown if you aren't on it, then reply "go".
- If the task involves **designing/building React sections, animations, or visual styling** and you suspect a lightweight model is active, output:
  > **[MODEL CHECK] Recommended: `Claude Sonnet 4.6 (Thinking)`** — Reason: `<1-line reason>`. Switch if needed, then reply "go".
- If the task is **scaffolding, installing packages, adding/editing entries in `src/data/*.ts`, or fixing minor lint errors**, output:
  > **[MODEL CHECK] Recommended: `Gemini 3.8 Flash (Medium)`** — Reason: Fast/low-cost task; switch down to save higher-tier quota if you are currently on Claude Opus/Sonnet.

## Design System (Strict)
- Dark editorial aesthetic inspired by minimalist luxury portfolios: deep obsidian `#060608` canvas, `#0D0E12` elevated cards, `1px solid rgba(255,255,255,0.08)` borders, `#F4F4F5` primary text, `#A1A1AA` secondary text, `#71717A` muted metadata, restrained `#818CF8` / `#38BDF8` AI accents.
- Typography: `Instrument Serif` (mix Regular + Italic words in headlines), `Inter` (UI/body), `JetBrains Mono` (indices/tags).
- NO fake skill percentage bars, NO neon/rainbow gradients, NO bouncy animations, NO generic stock AI art.
- Wrap all animations in `prefers-reduced-motion` support and use only GPU-composited properties (`transform`, `opacity`).

## Factual Honesty & Modularity
- NEVER invent internships, work experience, hackathon wins, CGPA, contest ratings, project metrics, or fake users.
- Keep ALL projects, skills, credentials, and articles strictly in `src/data/*.ts` so future additions require zero component edits.
- When starting a major new section after 25+ messages in one thread, recommend summarizing state and opening a fresh conversation to prevent context drift.
