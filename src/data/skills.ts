export interface SkillCategory {
  category: string;
  description?: string;
  skills: string[];
}

export const skillsData: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["C++", "Python", "JavaScript"],
  },
  {
    category: "AI & Machine Learning",
    skills: [
      "Deep Learning fundamentals",
      "Machine Learning",
      "LLM applications",
      "AI Agents",
      "Multimodal workflows",
      "AI API integration",
    ],
  },
  {
    category: "Frontend Development",
    skills: ["React", "Next.js", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    category: "Backend Development",
    skills: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "MongoDB"],
  },
  {
    category: "CS Core Fundamentals",
    skills: [
      "Data Structures & Algorithms (DSA)",
      "Object-Oriented Programming (OOP)",
      "Database Management Systems (DBMS)",
      "Operating Systems (OS)",
      "Computer Networks (CN)",
      "Complexity Analysis",
    ],
  },
  {
    category: "Tools & Workflow",
    skills: ["Git", "GitHub", "VS Code"],
  },
];
