"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AboutUs as content } from "@/types/template.type";
import { Accent, Slashes } from "@/components/common/SectionHeading";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const CYAN = "#00b9d8";
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------- Framer variants ---------- */
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};
const maskUp: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 0.9, ease } },
};
const drawX: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, ease } },
};
const drawY: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.8, ease } },
};
const slashIn: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
};


export default function About() {
  const reduce = useReducedMotion();

  const visualRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const smallRef = useRef<HTMLDivElement>(null);

  /* ---------- GSAP: clip reveal + parallax ---------- */
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1) main image wipes in from the top, once
      gsap.fromTo(
        frameRef.current,
        { clipPath: "inset(0% 0% 100% 0% round 6%)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 6%)",
          duration: 1.3,
          ease: "power3.inOut",
          scrollTrigger: { trigger: visualRef.current, start: "top 80%", once: true },
        },
      );

      // 2) photo drifts inside its frame while scrolling
      gsap.fromTo(
        parallaxRef.current,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: frameRef.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      // 3) small photo moves faster = depth
      gsap.to(smallRef.current, {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: visualRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  const viewport = { once: true, amount: 0.25 } as const;
  const initial = reduce ? "show" : "hidden";

  return (
    <section
      id="about"
      className="shell section-space grid items-start gap-10 font-[family-name:var(--font-inter),system-ui,sans-serif] lg:grid-cols-[.96fr_1.04fr] lg:gap-[3.3vw]"
    >
      {/* ---------- Visual ---------- */}
      <div ref={visualRef} className="relative isolate pb-[4%] pl-[4%] pr-[7%] pt-[3%]">
        {/* cyan corner accents (peek out from behind the photos) */}
        <motion.span
          aria-hidden="true"
          style={{ backgroundColor: CYAN, originX: 0, originY: 0 }}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="absolute left-0 top-0 -z-10 h-[30%] w-[34%] rounded-tl-[1.8rem]"
        />
        <motion.span
          aria-hidden="true"
          style={{ backgroundColor: CYAN, originX: 1, originY: 1 }}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.8, ease, delay: 0.5 }}
          className="absolute bottom-0 right-0 -z-10 h-[20%] w-[18%] rounded-br-[1.8rem]"
        />

        {/* main photo (GSAP clip + parallax) */}
        <div
          ref={frameRef}
          className="relative aspect-[1.12] overflow-hidden rounded-[6%] border-4 border-white shadow-[0_14px_34px_-14px_#10203040]"
        >
          <div ref={parallaxRef} className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
            <Image
              src={content.imageMain}
              alt="Smiling plumber giving a thumbs-up beside a sink"
              fill
              sizes="(min-width: 1024px) 43vw, 95vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* small photo: GSAP wrapper (scroll depth) > Framer entrance > Framer idle float */}
        <div ref={smallRef} className="absolute bottom-[2%] right-[2.5%] z-10 aspect-[1.34] w-[38%]">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 40, scale: 0.9, rotate: 3 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            viewport={viewport}
            transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.55 }}
            className="h-full w-full"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
              whileHover={{ scale: 1.04 }}
              className="relative h-full w-full overflow-hidden rounded-[14%] border-[5px] border-white shadow-[0_12px_28px_-10px_#10203050]"
            >
              <Image
                src={content.imageSmall}
                alt="Running chrome faucet"
                fill
                sizes="(min-width: 1024px) 16vw, 35vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ---------- Copy (Framer Motion) ---------- */}
      <motion.div variants={group} initial={initial} whileInView="show" viewport={viewport} className="lg:pt-[2vw]">
        {/* eyebrow */}
        <motion.p
          variants={fadeUp}
          className="flex items-center gap-4 text-[clamp(.75rem,1.05vw,1rem)] font-bold uppercase tracking-[.22em] text-[#1b2437]"
        >
          <motion.span variants={slashIn} className="flex">
            <Slashes />
          </motion.span>
          {content.subtitle}
          <motion.span
            aria-hidden="true"
            variants={drawX}
            className="hidden h-px w-[clamp(6rem,14vw,13rem)] origin-left bg-[#1b2437]/70 sm:block"
          />
        </motion.p>

        {/* title: lines slide up from behind a mask */}
        <h2 className="mt-5 text-[clamp(1.4rem,3vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#1b2437]">
          <span className="-mb-[.15em] block overflow-hidden pb-[.15em]">
            <motion.span variants={maskUp} className="block">
              {content.title1}
            </motion.span>
          </span>
          <span className="-mb-[.15em] block overflow-hidden pb-[.15em]">
            <motion.span variants={maskUp} className="block">
              <Accent text={content.title2} phrase={content.accent} />
            </motion.span>
          </span>
        </h2>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-[40rem] text-[clamp(0.9rem, 1.2vw, 1.2rem)] leading-[1.65] text-slate-700"
        >
          {content.description1}
        </motion.p>

        {/* features */}
        <motion.ul variants={group} className="mt-8 grid gap-6 sm:grid-cols-3 lg:mt-12 lg:gap-0">
          {content.features.map(({ id, title, description }, i, all) => (
            <motion.li
              key={id}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative lg:px-6 lg:first:pl-0 lg:last:pr-0"
            >
              <h3 className="flex items-center gap-3 text-[clamp(1.05rem,1.45vw,1.2rem)] font-bold tracking-[-0.01em] text-[#1b2437] transition-colors duration-200 group-hover:text-[#0097b3]">
                <Slashes className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                {title}
              </h3>
              <p className="mt-2 pl-[1.65rem] text-[clamp(0.8rem,1vw,1.02rem)] leading-snug text-slate-600">
                {description}
              </p>

              {/* divider draws top-to-bottom */}
              {i < all.length - 1 && (
                <motion.span
                  aria-hidden="true"
                  variants={drawY}
                  className="absolute right-0 top-0 hidden h-full w-px origin-top bg-slate-300 lg:block"
                />
              )}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
