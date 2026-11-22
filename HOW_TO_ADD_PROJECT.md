# How to Update Projects, Profile & Content

This portfolio is built on a **strictly modular, data-driven architecture**. Every visual section, card, drawer, and filter is driven by TypeScript data files in `src/data/`. You will never need to touch React components (`.tsx`) to add projects, update credentials, or edit copy.

---

## 1. How to Add a New Project

Open [`src/data/projects.ts`](src/data/projects.ts) and add a new object to the `projectsData` array.

### Step 1: Choose Your Project Tier
The UI automatically adapts based on the `tier` field:
- **`tier: "hero"`**: Full-width flagship showcase card with 2-column split (media on left, detailed overview and action buttons on right). Use for your primary or most impressive current project.
- **`tier: "grid"`**: Clean 2-column responsive technical cards. When you add new `grid` projects, the section automatically expands into a balanced grid.
- **`tier: "archive"`**: Minimalist single-row technical entries featuring an expanding drawer on click (`+` icon rotating 45°). Ideal for hackathon submissions, early prototypes, or concept architectures.

### Step 2: Copy-Paste the Object Template
Copy this object, fill in your details, and paste it into `projectsData`:

```ts
{
  id: "my-project-slug",                  // Unique URL-friendly slug
  title: "Project Name",
  tagline: "One punchy sentence describing the core technical achievement.",
  tier: "grid",                           // "hero" | "grid" | "archive"
  status: "Completed",                    // e.g., "In Progress", "Completed", "Prototype"
  year: "2026",
  categories: ["AI Agents", "Full Stack"],// Categories automatically generate filter pills
  techStack: ["Next.js", "Python", "FastAPI", "PostgreSQL"],
  thumbnail: "/projects/my-project-slug/cover.png", // Optional: see Section 2 below
  screenshots: [                          // Optional: rendered in case study drawer
    "/projects/my-project-slug/shot-1.png",
  ],
  demoVideoUrl: undefined,
  links: {
    github: "https://github.com/VIVEK252575AI/...",
    live: "https://...",                  // Optional live deployment URL
    paperOrDoc: undefined,                // Optional research paper / documentation link
  },
  caseStudy: {
    problem: "Clearly articulate the exact engineering or user challenge.",
    solution: "How your system solved the problem cleanly with technical justification.",
    architectureSummary: "Overview of data flow, API boundaries, and models used.",
    myContribution: "Your specific ownership, code, and implementation.",
    keyFeatures: [
      "Feature 1 with technical detail",
      "Feature 2 with technical detail",
      "Feature 3 with technical detail",
    ],
    // Optional: Only renders if non-empty
    engineeringChallenges: [
      "Specific technical trade-off or latency hurdle faced and resolved.",
    ],
    // Optional: Only renders if non-empty (never fabricate)
    verifiedMetrics: [
      { label: "Inference Latency", value: "<120ms" },
    ],
  },
},
```

> **Tip**: If you omit `thumbnail`, the portfolio automatically generates an elegant dark architectural blueprint with tech badges. You will never see a broken image.

---

## 2. Where to Drop Images and Screenshots

Store all project media in the `public/projects/` directory using your project slug as the folder name:

```
public/
└── projects/
    └── my-project-slug/
        ├── cover.png      <-- Referenced as "/projects/my-project-slug/cover.png"
        ├── shot-1.png     <-- Referenced as "/projects/my-project-slug/shot-1.png"
        └── shot-2.png
```

- **Recommended format**: `.webp` or `.png`
- **Aspect ratio**: 16:9 or 16:10 for cover images
- **Resolution**: 1920×1080 or 1280×720 (optimized under 500KB)

---

## 3. Where to Update Profile, Credentials & Content

| To Update... | File to Edit | Fields to Change |
| :--- | :--- | :--- |
| **College / Institute Name** | [`src/data/profile.ts`](src/data/profile.ts) | Change `college: "VERIFY_COLLEGE_NAME"` to your verified college name. |
| **Public Contact Email** | [`src/data/profile.ts`](src/data/profile.ts) | Change `email: "VERIFY_PUBLIC_EMAIL"` to your actual email (activates the one-click copy button and mailto link). |
| **LeetCode Profile URL** | [`src/data/profile.ts`](src/data/profile.ts) | Set `leetcode: "https://leetcode.com/u/yourhandle"` (automatically reveals the LeetCode button in the DSA section). |
| **Verified DSA Solved Count** | [`src/data/profile.ts`](src/data/profile.ts) | Set `verifiedProblemCount: 350` (or your exact count) to show the numeric stat. |
| **CGPA / Transcript** | [`src/data/profile.ts`](src/data/profile.ts) | Set `cgpa: 8.5` (or leave `null` until officially published). |
| **Technical Skills** | [`src/data/skills.ts`](src/data/skills.ts) | Add or modify skill items in any category array (zero percentage bars required). |
| **Certifications / Awards** | [`src/data/credentials.ts`](src/data/credentials.ts) | Add a new `CredentialItem` object with issuer, title, credential ID, and verification link. |
| **Hashnode Articles** | [`src/data/writing.ts`](src/data/writing.ts) | Add an `ArticleItem` object to `writingData` to replace the fallback feature card with your live article grid. |

---

## 4. Verifying Changes

Before deploying, run:
```bash
npm run lint
npm run build
```
If both exit with `0`, your additions are 100% type-safe and ready for production.
