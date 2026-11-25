"use client";


import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WhatWeDo as content } from "@/types/template.type";
import { Accent, SectionHeading, Slashes } from "@/components/common/SectionHeading";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------- Framer variants ---------- */
const leftGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};
const listItem: Variants = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};
const slashPop: Variants = {
  hidden: { opacity: 0, scale: 0.4, x: -8 },
  show: { opacity: 1, scale: 1, x: 0, transition: { type: "spring", stiffness: 260, damping: 16 } },
};
const cardsGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const card: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease } },
};

export default function WhyChooseUs() {
  const reduce = useReducedMotion();
  const cardsRef = useRef<HTMLDivElement>(null);

  /* ---------- GSAP: the two columns drift in opposite directions ---------- */
  useEffect(() => {
    const root = cardsRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    // only when cards sit side by side, so stacked cards never overlap
    mm.add("(min-width: 640px) and (prefers-reduced-motion: no-preference)", () => {
      root.querySelectorAll<HTMLElement>("[data-drift]").forEach((el, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        gsap.fromTo(
          el,
          { y: 12 * dir },
          {
            y: -12 * dir,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  const viewport = { once: true, amount: 0.2 } as const;
  const initial = reduce ? "show" : "hidden";

  return (
    <section id="why-choose-us" className="why-section section-space">
      <div className="shell relative grid gap-9 lg:grid-cols-[.94fr_1.06fr]">
        {/* ---------- Left: heading + highlights ---------- */}
        <motion.div variants={leftGroup} initial={initial} whileInView="show" viewport={viewport}>
          <motion.div variants={fadeUp}>
            <SectionHeading label={content.subtitle} description={content.description}>
              {content.title1}
              <br />
              <Accent text={content.title2} phrase={content.accent} />
            </SectionHeading>
          </motion.div>

          <ul className="mt-7 grid gap-3 lg:mt-10">
            {content.highlights.map((item) => (
              <motion.li
                key={item}
                variants={listItem}
                whileHover={{ x: 6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="flex items-center gap-4 font-extrabold md:text-lg xl:text-[1.2rem]"
              >
                <motion.span variants={slashPop} className="inline-flex">
                  <Slashes />
                </motion.span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* ---------- Right: feature cards ---------- */}
        <motion.div
          ref={cardsRef}
          variants={cardsGroup}
          initial={initial}
          whileInView="show"
          viewport={viewport}
          className="grid gap-4 sm:grid-cols-2"
        >
          {content.features.map(({ id, title, description }) => (
            // plain wrapper = GSAP drift; the article = Framer entrance + hover (no transform clash)
            <div key={id} data-drift>
              <motion.article
                variants={card}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="relative h-full rounded-[1.2rem] bg-[#f2f7fa] p-6 transition-shadow duration-300 hover:shadow-[0_18px_34px_-14px_#14252e40] motion-reduce:transition-none xl:px-8 xl:py-10 before:absolute before:inset-x-8 before:top-0 before:h-0.5 before:origin-left before:scale-x-0 before:rounded-full before:bg-[#00b9d8] before:transition-transform before:duration-500 hover:before:scale-x-100 motion-reduce:before:transition-none"
              >
                <h3 className="short-rule leading-tight font-extrabold md:text-lg xl:text-[1.2rem]">{title}</h3>
                <p className="body-copy mt-4">{description}</p>
              </motion.article>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
