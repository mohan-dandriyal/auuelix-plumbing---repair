"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Droplets, Pipette, Wrench } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Services as content } from "@/types/template.type";
import { Accent, SectionHeading } from "@/components/common/SectionHeading";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const icons = { FaFaucet: Pipette, FaTools: Wrench, FaWater: Droplets };
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------- Framer variants ---------- */
const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
const card: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};
// info panel rises from under the photo after the image wipe begins
const panel: Variants = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: 0.35 } },
};
// icon pops in last
const iconPop: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: -90 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 220, damping: 14, delay: 0.7 },
  },
};
const headingIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export default function Services() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  /* ---------- GSAP: image wipe + parallax ---------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const frames = root.querySelectorAll<HTMLElement>("[data-frame]");
      const layers = root.querySelectorAll<HTMLElement>("[data-parallax]");
      const wide = window.innerWidth >= 768;

      frames.forEach((frame, i) => {
        gsap.fromTo(
          frame,
          { clipPath: "inset(0% 0% 100% 0% round 4px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 4px)",
            duration: 1.1,
            ease: "power3.inOut",
            delay: wide ? i * 0.15 : 0,
            scrollTrigger: { trigger: frame, start: "top 85%", once: true },
          },
        );
      });

      layers.forEach((layer) => {
        gsap.fromTo(
          layer,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: layer.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  const viewport = { once: true, amount: 0.2 } as const;
  const initial = reduce ? "show" : "hidden";

  return (
    <section id="services" className="shell section-space">
      <motion.div variants={headingIn} initial={initial} whileInView="show" viewport={viewport}>
        <SectionHeading label={content.subtitle} description={content.description} centered>
          {content.title1} <Accent text={content.title2} phrase={content.accent} />
        </SectionHeading>
      </motion.div>

      <motion.div
        ref={rootRef}
        id="gallery"
        variants={grid}
        initial={initial}
        whileInView="show"
        viewport={viewport}
        className="mt-8 grid gap-8 md:grid-cols-3 md:gap-[3vw]"
      >
        {content.services.map(({ id, image, title, description, icon }) => {
          const Icon = icons[icon as keyof typeof icons] ?? Wrench;
          return (
            <motion.article
              key={id}
              variants={card}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="group"
            >
              {/* photo: GSAP clip-wipe on the frame, parallax on the inner layer */}
              <div data-frame className="relative aspect-[1.28] overflow-hidden rounded">
                <div data-parallax className="absolute inset-x-0 -top-[8%] h-[116%] will-change-transform">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(min-width: 768px) 31vw, 90vw"
                    className="framed-photo motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
                  />
                </div>
              </div>

              {/* info panel */}
              <motion.div
                variants={panel}
                className="relative mx-2 -mt-[14%] flex min-h-25 items-center gap-4 rounded-xl bg-white px-4 py-3 shadow-[0_8px_16px_#14252e30] transition-shadow duration-300 group-hover:shadow-[0_16px_28px_#14252e45] motion-reduce:transition-none md:max-xl:flex-col md:max-xl:items-start md:max-xl:gap-3"
              >
                {/* wrapper animates; inner keeps your .service-drop shape untouched */}
                <motion.span variants={iconPop} className="-mt-7 shrink-0">
                  <span className="service-drop grid size-14 place-items-center text-white xl:size-17">
                    <Icon
                      className="size-7 -rotate-45 transition-transform duration-300 group-hover:-rotate-[20deg] motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </span>
                </motion.span>
                <div>
                  <h3 className="text-[clamp(1.05rem,1.35vw,1.2rem)] leading-tight font-bold">{title}</h3>
                  <p className="mt-1 text-[clamp(0.8rem,1vw,1.02rem)] leading-snug text-copy">{description}</p>
                </div>
              </motion.div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
