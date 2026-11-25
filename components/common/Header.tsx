"use client";

import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
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
  const { navLinks, contactButton } = content;

  useEffect(() => {
    setMounted(true);
  }, []);

  function select(url: string) {
    setActive(url);
    setOpen(false);
  }

  // Staggered entrance on a wrapper, so hover transitions on the link itself stay instant.
  const enter = (i: number) => ({
    className: `transition-all duration-500 ease-out motion-reduce:transition-none ${mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`,
    style: { transitionDelay: mounted ? `${250 + i * 70}ms` : "0ms" },
  });

  const textSize = "text-[clamp(0.8rem,1vw,1rem)] font-[500] tracking-wider";

  return (
    <header
      className={`site-header sticky py-1 top-0 z-30 bg-white shadow-[0_2px_16px_#1020300a] backdrop-blur-md transition-all duration-700 ease-out motion-reduce:transition-none ${mounted ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
    >
      <div className="shell flex items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="#home"
          aria-label="Home"
          onClick={() => select("#home")}
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
          className="relative grid size-11 place-items-center rounded-lg border border-slate-200 text-[#1b2437] transition-colors hover:border-[#14b0d2] hover:text-[#14b0d2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14b0d2] lg:hidden"
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
          className={`absolute inset-x-0 top-full flex origin-top flex-col gap-1  bg-white p-5 shadow-lg transition-all duration-300 ease-out motion-reduce:transition-none ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
            } lg:visible lg:static lg:ml-2 lg:flex lg:translate-y-0 lg:flex-row lg:items-center lg:gap-[clamp(1.1rem,2.6vw,2.6rem)] lg:bg-transparent lg:py-0 lg:pr-0 lg:pl-[clamp(1.5rem,2.4vw,2.6rem)] lg:opacity-100 lg:shadow-none`}
        >
          {navLinks.map(({ id, label, url }, i) => {
            const e = enter(i);
            return (
              <div key={id} className={e.className} style={e.style}>
                <a
                  href={url}
                  onClick={() => select(url)}
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
              <div className={`${e.className} lg:ml-1`} style={e.style}>
                <a
                  href={contactButton.url}
                  onClick={() => select(contactButton.url)}
                  className={`group relative inline-flex w-fit items-center gap-3 overflow-hidden whitespace-nowrap rounded-md bg-[#14b4d3] px-5 py-2.5 ${textSize} font-bold tracking-[-0.01em] text-white shadow-[0_6px_16px_-6px_#14b4d3] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0fa0bf] hover:shadow-[0_10px_22px_-8px_#0fa0bf] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14b0d2] active:translate-y-0 motion-reduce:transition-none before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700 group-hover:before:translate-x-full motion-reduce:before:transition-none`}
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