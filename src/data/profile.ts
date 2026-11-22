export interface ProfileData {
  name: string;
  role: string;
  headline: string;
  portraitUrl?: string;
  education: {
    degree: string;
    university: string;
    college: string | null;
    graduationYear: string;
    country: string;
    cgpa: number | null;
    coursework: string[];
  };
  links: {
    linkedin: string;
    github: string;
    codolio: string;
    hashnode: string;
    leetcode: string | null;
    email: string | null;
  };
  dsa: {
    verifiedProblemCount: number | null;
    primaryLanguage: string;
  };
}

export const profileData: ProfileData = {
  name: "Vivek Kumar",
  role: "Aspiring AI Engineer | Software Engineer",
  headline:
    "Building intelligent applications through AI, machine learning, and strong software engineering fundamentals.",
  portraitUrl: "/images/portrait.png",
  education: {
    degree: "B.Tech Computer Science and Engineering",
    university: "Rajasthan Technical University (RTU)",
    // Note: Replace with verified college/institute name once confirmed
    college: "VERIFY_COLLEGE_NAME",
    graduationYear: "Expected 2027",
    country: "India",
    cgpa: null, // Note: Set verified CGPA when official transcript is finalized
    coursework: [
      "Data Structures & Algorithms (DSA)",
      "Object-Oriented Programming (OOP)",
      "Database Management Systems (DBMS)",
      "Operating Systems (OS)",
      "Computer Networks (CN)",
      "Software Engineering",
      "Artificial Intelligence (AI)",
      "Machine Learning (ML)",
    ],
  },
  links: {
    linkedin: "https://www.linkedin.com/in/vivek-kumar-ai",
    github: "https://github.com/VIVEK252575AI",
    codolio: "https://codolio.com/profile/VIVEK252575AI",
    hashnode: "https://vivekxb.hashnode.dev",
    leetcode: null, // Unverified / Pending profile handle verification
    email: "VERIFY_PUBLIC_EMAIL", // Note: Set verified public contact email
  },
  dsa: {
    verifiedProblemCount: null, // Unverified - set after verifying Codolio / LeetCode solved count
    primaryLanguage: "C++",
  },
};
