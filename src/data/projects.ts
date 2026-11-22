export type ProjectTier = "hero" | "grid" | "archive";

export interface ProjectCaseStudy {
  problem: string;
  solution: string;
  architectureSummary: string;
  myContribution: string;
  keyFeatures: string[];
  engineeringChallenges?: string[];
  verifiedMetrics?: { label: string; value: string }[];
}

export interface ProjectLinks {
  github?: string;
  live?: string;
  demoVideo?: string;
  paperOrDoc?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  tier: ProjectTier;
  status: string;
  year?: string;
  categories: string[];
  techStack: string[];
  thumbnail?: string;
  screenshots?: string[];
  demoVideoUrl?: string;
  links: ProjectLinks;
  caseStudy: ProjectCaseStudy;
}

export const projectsData: ProjectItem[] = [
  {
    id: "omnisight",
    title: "OmniSight",
    tagline: "Multimodal AI-powered UI self-healing and autonomous QA agent",
    tier: "hero",
    status: "In Progress",
    year: "2026",
    categories: ["AI Agents", "Multimodal AI", "Software Quality Engineering"],
    techStack: ["Python", "Multimodal LLMs", "AI Agents", "Next.js", "TypeScript"],
    links: {
      github: "https://github.com/VIVEK252575AI/omnisight",
      // live: null, // Pending deployment
    },
    caseStudy: {
      problem:
        "Traditional end-to-end UI automation testing scripts are brittle, frequently breaking upon minor DOM structure or visual layout changes, demanding manual maintenance.",
      solution:
        "Autonomous multimodal QA agent capable of inspecting UI viewports, reasoning about broken element selectors, and dynamically self-healing test automation scripts.",
      // Architecture summary to be detailed following full repository code audit
      architectureSummary:
        "Multimodal agent loop analyzing visual DOM state, mapping element intent via vision-language reasoning, and dispatching repair actions.",
      myContribution:
        "Leading core agent loop architecture, vision-driven element grounding, and self-healing test pipeline implementation.",
      keyFeatures: [
        "Multimodal UI DOM inspection and visual grounding",
        "Autonomous test failure diagnosis and reasoning",
        "Dynamic self-healing test scripts",
      ],
      engineeringChallenges: [
        // To be populated after repository code audit: e.g., latency reduction in vision reasoning
      ],
      verifiedMetrics: [
        // Verified metrics to be added only after benchmark evaluation
      ],
    },
  },
  {
    id: "isro-bah-2025",
    title: "ISRO Bharatiya Antariksh Hackathon 2025",
    tagline: "Space exploration technology proposal and architecture submission",
    tier: "archive",
    status: "Idea Submission",
    year: "2025",
    categories: ["Space Tech", "Hackathon Submission"],
    techStack: ["System Architecture", "AI Concepts"],
    links: {
      // Documentation / submission links to be attached if public
    },
    caseStudy: {
      problem:
        "National-level space exploration technology challenge focusing on innovative space systems and operational capabilities.",
      solution:
        "Conceptual solution architecture submitted for the Bharatiya Antariksh Hackathon organized by ISRO.",
      architectureSummary: "Idea submission detailing system workflow and algorithmic approach.",
      myContribution: "Conceptual design, algorithmic formulation, and submission documentation.",
      keyFeatures: [
        "National space hackathon idea submission",
        "Rigorous technical alignment with ISRO problem statements",
      ],
    },
  },
];

/*
=============================================================================
FUTURE PROJECT TEMPLATE: Copy and paste this object into projectsData above
=============================================================================
{
  id: "unique-project-slug",
  title: "Project Title",
  tagline: "One sentence punchy technical summary",
  tier: "grid", // "hero" | "grid" | "archive"
  status: "Completed", // "In Progress" | "Completed" | "Prototype"
  year: "2026",
  categories: ["Machine Learning", "Full Stack"],
  techStack: ["Next.js", "Python", "FastAPI", "PostgreSQL"],
  thumbnail: "/projects/project-slug.png",
  screenshots: ["/projects/project-slug-1.png"],
  demoVideoUrl: undefined,
  links: {
    github: "https://github.com/VIVEK252575AI/...",
    live: "https://...",
  },
  caseStudy: {
    problem: "Clearly articulate the exact engineering or user problem.",
    solution: "How your system solved the problem cleanly.",
    architectureSummary: "Overview of data flow, API boundaries, and models used.",
    myContribution: "Your specific ownership, code, and implementation.",
    keyFeatures: [
      "Feature 1 with technical detail",
      "Feature 2 with technical detail",
    ],
    engineeringChallenges: [
      "Specific technical trade-off or hurdle faced and resolved.",
    ],
    verifiedMetrics: [
      // Only include verified, factual metrics:
      // { label: "Inference Latency", value: "<120ms" }
    ],
  },
},
=============================================================================
*/
