import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import CredentialsSection from "@/components/sections/CredentialsSection";
import WritingSection from "@/components/sections/WritingSection";
import ArchitectureBanner from "@/components/sections/ArchitectureBanner";
import JourneySection from "@/components/sections/JourneySection";
import Hairline from "@/components/motion/Hairline";
import CoderScrollBackground from "@/components/motion/CoderScrollBackground";

export default function Home() {
  return (
    <>
      <CoderScrollBackground />
      <Navbar />
      <main className="relative z-10">
        {/* 01 — Hero */}
        <Hero />

        <div className="px-6 max-w-6xl mx-auto"><Hairline /></div>

        {/* 02 — About */}
        <AboutSection />

        <div className="px-6 max-w-6xl mx-auto"><Hairline /></div>

        {/* 03 — Work */}
        <ProjectsSection />

        <div className="px-6 max-w-6xl mx-auto"><Hairline /></div>

        {/* 04 — Skills */}
        <SkillsSection />

        <div className="px-6 max-w-6xl mx-auto"><Hairline /></div>

        {/* 05 — Architecture Banner (full-bleed — no wrapper) */}
        <ArchitectureBanner />

        {/* 06 — Credentials */}
        <CredentialsSection />

        <div className="px-6 max-w-6xl mx-auto"><Hairline /></div>

        {/* 07 — Writing */}
        <WritingSection />

        <div className="px-6 max-w-6xl mx-auto"><Hairline /></div>

        {/* 08 — Journey */}
        <JourneySection />
      </main>

      {/* 09 — Footer / Contact */}
      <Footer />
    </>
  );
}
