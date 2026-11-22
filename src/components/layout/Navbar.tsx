"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { X, Menu } from "lucide-react";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Credentials", href: "#credentials" },
  { label: "Writing", href: "#writing" },
];

function RollingNavItem({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block overflow-hidden h-[1.15em] leading-[1.15em] text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 whitespace-nowrap shrink-0"
    >
      <span
        className="block"
        style={{
          transform: hovered ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.42s cubic-bezier(0.76, 0, 0.24, 1)",
          willChange: "transform",
        }}
      >
        {label}
      </span>
      <span
        className="block absolute inset-0 text-[#F8FAFC]"
        style={{
          transform: hovered ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.42s cubic-bezier(0.76, 0, 0.24, 1)",
          willChange: "transform",
        }}
        aria-hidden="true"
      >
        {label}
      </span>
    </a>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);
  const { scrollYProgress } = useScroll();

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed left-0 top-0 z-[100] h-[2px] w-full origin-left bg-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.4)]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ── Fixed top-6 centered wide container ────────────────────────────── */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl h-14 rounded-2xl bg-[#0B0D12]/94 border border-white/[0.09] px-6 hidden md:flex items-center justify-between gap-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        {/* Left side: Vivek Kumar */}
        <a
          href="#"
          className="font-serif font-semibold text-lg text-[#F8FAFC] tracking-tight hover:text-[#F59E0B] transition-colors whitespace-nowrap shrink-0"
        >
          Vivek Kumar
        </a>

        {/* Right side: horizontal nav links + outlined dark CTA button */}
        <div className="flex items-center gap-7">
          <nav className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <RollingNavItem key={link.label} href={link.href} label={link.label} />
            ))}
          </nav>

          {/* Outlined dark CTA button */}
          <a
            href="#contact"
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-[#F8FAFC] hover:border-[#F59E0B]/50 hover:bg-[#F59E0B]/10 transition-all duration-300 whitespace-nowrap shrink-0"
          >
            <span className="relative block overflow-hidden h-[1.15em] leading-[1.15em]">
              <span
                className="block"
                style={{
                  transform: ctaHovered ? "translateY(-100%)" : "translateY(0)",
                  transition: "transform 0.42s cubic-bezier(0.76, 0, 0.24, 1)",
                }}
              >
                Let&rsquo;s talk
              </span>
              <span
                className="block absolute inset-0 text-white"
                style={{
                  transform: ctaHovered ? "translateY(0)" : "translateY(100%)",
                  transition: "transform 0.42s cubic-bezier(0.76, 0, 0.24, 1)",
                }}
                aria-hidden="true"
              >
                Let&rsquo;s talk
              </span>
            </span>
            <span
              className="inline-block text-xs text-[#A1A1AA]"
              style={{
                transform: ctaHovered ? "translate(2px, -2px)" : "translate(0, 0)",
                transition: "transform 0.3s ease",
              }}
            >
              ↗
            </span>
          </a>
        </div>
      </header>

      {/* ── Mobile header ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#060709]/95">
        <a href="#" className="font-serif font-semibold text-lg text-[#F8FAFC]">
          Vivek Kumar
        </a>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-[#CBD5E1] p-1 hover:text-[#F8FAFC]"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* ── Mobile drawer ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[60] bg-black/82"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.nav
              key="drawer"
              className="fixed top-0 right-0 bottom-0 z-[70] w-72 bg-[#0B0D12] border-l border-white/[0.09] flex flex-col p-8 gap-8"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
            >
              <div className="flex justify-between items-center">
                <span className="font-serif font-semibold text-lg text-[#F8FAFC]">
                  Vivek Kumar
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-6 mt-4">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-2xl font-serif font-medium text-[#CBD5E1] hover:text-[#F59E0B] transition-colors"
                    >
                      {link.label}
                    </a>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto">
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/15 bg-white/[0.04] text-[#F8FAFC] font-sans text-sm font-medium hover:border-[#F59E0B]/50 transition-colors"
                >
                  Let&rsquo;s talk <span className="text-xs">↗</span>
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
