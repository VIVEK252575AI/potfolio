export interface CredentialItem {
  id: string;
  issuer: string;
  title: string;
  type: string;
  issueDate: string;
  credentialId?: string;
  verificationUrl?: string;
  signatory?: string;
  scope?: string;
}

export const credentialsData: CredentialItem[] = [
  {
    id: "nvidia-deep-learning",
    issuer: "NVIDIA",
    title: "Fundamentals of Deep Learning",
    type: "Certificate of Competency",
    issueDate: "Jul 23, 2025",
    credentialId: "wqg9IBseSPuMrDo7rSt08Q",
    signatory: "Greg Estes, VP, NVIDIA",
  },
  {
    id: "maang-in-cp-summer-camp",
    issuer: "MAANG.in",
    title: "Indian CP Summer Camp",
    type: "Certificate of Excellence",
    issueDate: "Sep 10, 2026",
    credentialId: "AZ247185512480014",
    verificationUrl: "https://maang.in/courses/certificate?id=AZ247185512480014",
    signatory: "Vivek Gupta, Instructor",
  },
  {
    id: "google-dev-build-with-ai",
    issuer: "Google for Developers",
    title: "Build with AI Bootcamp, Gurugram",
    type: "Certificate of Participation",
    issueDate: "Nov 18, 2026",
    credentialId: "2026H2S11BWAIBGGR-P00427",
    scope:
      "Hands-on practice building AI agents, architecting workflows, and integrating generative AI into production-ready systems",
  },
  {
    id: "isro-antariksh-hackathon-2025",
    issuer: "ISRO",
    title: "Bharatiya Antariksh Hackathon 2025",
    type: "Certificate of Acknowledgement (Idea Submission)",
    issueDate: "2025",
    credentialId: "2025H2S06BAH25-P11848",
  },
];
