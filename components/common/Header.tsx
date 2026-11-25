"use client";

import { Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { HeaderType } from "@/types/template.type";
import Brand from "./Brand";

/**
 * Pure Tailwind version (no custom CSS, no config changes).
 *
 * Typography from the screenshot: Inter, nav 600, button 700, ~20px, tracking -0.01em
 * Colors: ink #1b2437 | accent #14b0d2 | button #14b4d3
 *
 * Load Inter in app/layout.tsx:
 *   import { Inter } from "next/font/google";
 *   const inter = Inter({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-inter" });
 *   <body className={inter.variable}>
 */

export default function Header({ content }: { content: HeaderType }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { navLinks, contactButton } = content;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const targets = [...navLinks, contactButton].flatMap(({ url }) => {
      if (!url.startsWith("#")) return [];
      const section = document.getElementById(url.slice(1));
      return section ? [{ url, section }] : [];
    });

    function updateActive() {
      const root = document.documentElement;
      const scrollPadding = Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      const activationLine = Math.max(headerRef.current?.offsetHeight ?? 0, scrollPadding) + 2;
      const scrollableHeight = root.scrollHeight - root.clientHeight;
      const atBottom = scrollableHeight > 0 && window.scrollY >= scrollableHeight - 2;
      let current = "#home";
      let currentTop = -Infinity;

      for (const { url, section } of targets) {
        const top = section.getBoundingClientRect().top;
        if (top >= currentTop && (top <= activationLine || atBottom)) {
          current = url;
          currentTop = top;
        }
      }
      setActive(current);
    }

    let frame = requestAnimationFrame(updateActive);
    function scheduleUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActive);
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [navLinks, contactButton]);

  // Staggered entrance on a wrapper, so hover transitions on the link itself stay instant.
  const enter = (i: number) => ({
    className: `transition-all duration-500 ease-out motion-reduce:transition-none ${mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`,
    style: { transitionDelay: mounted ? `${250 + i * 70}ms` : "0ms" },
  });

  const textSize = "text-[clamp(1.05rem,1vw,1rem)] font-[500] tracking-wider";

  return (
    <header
      ref={headerRef}
      className={`site-header sticky py-1 top-0 z-30 bg-white shadow-[0_2px_16px_#1020300a] backdrop-blur-md transition-all duration-700 ease-out motion-reduce:transition-none ${mounted ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
    >
      <div className="shell flex items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="#home"
          aria-label="Home"
          onClick={() => setOpen(false)}
          className="inline-block shrink-0 rounded-md text-[clamp(1.7rem,3.25vw,3.1rem)] text-[#1b2437] transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14b0d2] motion-reduce:transition-none"
        >
          <Brand logo={content.logo} />
        </a>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-controls="site-navigation"
          aria-expanded={open}
          aria-label={content.menuLabel}
          onClick={() => setOpen(!open)}
          className="relative grid size-11 shrink-0 place-items-center rounded-lg border border-slate-200 text-[#1b2437] transition-colors hover:border-[#14b0d2] hover:text-[#14b0d2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14b0d2] xl:hidden"
        >
          <Menu
            aria-hidden="true"
            className={`absolute transition-all duration-300 motion-reduce:transition-none ${open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
              }`}
          />
          <X
            aria-hidden="true"
            className={`absolute transition-all duration-300 motion-reduce:transition-none ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
              }`}
          />
        </button>

        {/* Navigation */}
        <nav
          id="site-navigation"
          className={`absolute inset-x-0 top-full flex max-h-[calc(100dvh-var(--header-height))] origin-top flex-col gap-1 overflow-y-auto overscroll-contain bg-white p-5 shadow-lg transition-all duration-300 ease-out motion-reduce:transition-none ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
            } xl:visible xl:static xl:ml-2 xl:max-h-none xl:translate-y-0 xl:flex-row xl:items-center xl:gap-[clamp(1rem,2vw,2.6rem)] xl:overflow-visible xl:bg-transparent xl:p-0 xl:opacity-100 xl:shadow-none`}
        >
          {navLinks.map(({ id, label, url }, i) => {
            const e = enter(i);
            return (
              <div key={id} className={e.className} style={e.style}>
                <a
                  href={url}
                  onClick={() => setOpen(false)}
                  aria-current={active === url ? "location" : undefined}
                  className={`group/link relative inline-block whitespace-nowrap py-2 ${textSize} tracking-[-0.01em] text-[#1b2437] transition-colors duration-200 hover:text-[#14b0d2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14b0d2] aria-[current=location]:text-[#14b0d2] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-[#14b0d2] after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=location]:after:scale-x-100 motion-reduce:after:transition-none`}
                >
                  {label}
                </a>
              </div>
            );
          })}

          {(() => {
            const e = enter(navLinks.length);
            return (
              <div className={`${e.className} lg:ml-1 mt-3 lg:mb-0 mb-3`} style={e.style}>
                <a
                  href={contactButton.url}
                  onClick={() => setOpen(false)}
                  aria-current={active === contactButton.url ? "location" : undefined}
                  className={`group relative inline-flex w-fit items-center gap-3 overflow-hidden whitespace-nowrap rounded-md bg-[#14b4d3] px-5 py-2.5 ${textSize} font-bold tracking-[-0.01em] text-white shadow-[0_6px_16px_-6px_#14b4d3] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0fa0bf] aria-[current=location]:bg-[#00788f] hover:shadow-[0_10px_22px_-8px_#0fa0bf] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14b0d2] active:translate-y-0 motion-reduce:transition-none before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700 group-hover:before:translate-x-full motion-reduce:before:transition-none`}
                >
                  <Phone
                    className="relative z-10 size-[1.35em] fill-current transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                  <span className="relative z-10">{contactButton.text}</span>
                </a>
              </div>
            );
          })()}
        </nav>
      </div>
    </header>
  );
}
