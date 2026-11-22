export interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  url: string;
  platform: "Hashnode" | "Medium" | "Substack" | "Personal";
  tags: string[];
}

/**
 * Verified publications.
 * Initialized empty until verified Hashnode articles are added.
 */
export const writingData: ArticleItem[] = [];

/*
=============================================================================
FUTURE ARTICLE TEMPLATE: Copy and paste this object into writingData above
=============================================================================
{
  id: "article-slug",
  title: "Deep Dive into Multimodal Agent Architecture",
  excerpt: "A technical breakdown of visual grounding, memory, and tool routing.",
  publishedAt: "2026-11-20",
  readTime: "6 min read",
  url: "https://vivekxb.hashnode.dev/deep-dive-multimodal-agent",
  platform: "Hashnode",
  tags: ["AI", "LLMs", "Agents", "Architecture"],
},
=============================================================================
*/
