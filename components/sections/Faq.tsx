"use client";

import { MotionConfig, motion, useReducedMotion, type Variants } from "framer-motion";
import { Minus } from "lucide-react";
import { useId, useState } from "react";
import { Faq as content } from "@/types/template.type";
import { SectionHeading } from "@/components/common/SectionHeading";

type FaqId = (typeof content.faqs)[number]["id"];

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------- variants ---------- */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};
const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

export default function Faq() {
  const reduce = useReducedMotion();
  const baseId = useId();
  const [openId, setOpenId] = useState<FaqId | null>(content.faqs[0]?.id ?? null);

  const viewport = { once: true, amount: 0.2 } as const;
  const d = reduce ? 0 : 0.4; // height/opacity aren't covered by reducedMotion="user", so handle it here

  // answer panel: height auto <-> 0. Stays mounted; hidden from tab order/AT while closed.
  const panel: Variants = {
    open: { height: "auto", opacity: 1, visibility: "visible", transition: { duration: d, ease } },
    closed: {
      height: 0,
      opacity: 0,
      transition: { duration: d, ease },
      transitionEnd: { visibility: "hidden" },
    },
  };
  // text settles in slightly after the panel starts opening
  const answer: Variants = {
    open: { y: 0, transition: { duration: reduce ? 0 : 0.45, ease, delay: reduce ? 0 : 0.08 } },
    closed: { y: -8, transition: { duration: reduce ? 0 : 0.25 } },
  };

  return (
    <MotionConfig reducedMotion="user">
      <section id="faq" className="shell section-space grid gap-8 lg:grid-cols-[.41fr_.59fr] lg:gap-10">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
          <SectionHeading label={content.subtitle} description={content.description}>
            {content.title1}
            <br />
            <span className="text-accent">{content.title2}</span>
          </SectionHeading>
        </motion.div>

        <motion.div
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid content-start gap-3"
        >
          {content.faqs.map(({ id, question, answer: answerText }) => {
            const isOpen = openId === id;
            const buttonId = `${baseId}-q-${id}`;
            const panelId = `${baseId}-a-${id}`;

            return (
              <motion.div
                key={id}
                variants={fadeUp}
                className={`rounded-lg border bg-white transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none ${
                  isOpen
                    ? "border-[#14b4d3]/60 shadow-[0_14px_30px_-18px_#14252e40]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <h3 className="text-base font-bold lg:text-[1.1rem]">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : id)}
                    className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 rounded-lg px-5 py-3 text-left transition-colors [font:inherit] hover:bg-slate-50/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14b4d3] motion-reduce:transition-none xl:px-7"
                  >
                    <span className={`transition-colors duration-300 ${isOpen ? "text-accent" : ""}`}>{question}</span>

                    {/* plus morphs into minus: two bars, one rotates away */}
                    <span
                      aria-hidden="true"
                      className={`grid h-8 w-10 shrink-0 place-items-center border-l-2 border-accent pl-3 transition-colors duration-300 ${
                        isOpen ? "text-accent" : ""
                      }`}
                    >
                      <span className="relative size-5">
                        <Minus className="absolute inset-0 size-5" />
                        <motion.span
                          initial={false}
                          animate={{ rotate: isOpen ? 0 : 90 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                          className="absolute inset-0"
                        >
                          <Minus className="size-5" />
                        </motion.span>
                      </span>
                    </span>
                  </button>
                </h3>

                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  variants={panel}
                  initial={false}
                  animate={isOpen ? "open" : "closed"}
                  className="overflow-hidden"
                >
                  <motion.p variants={answer} className="text-[#344353] text-sm sm:text-base lg:text-[17px] px-5 pt-1 pb-5 xl:px-7">
                    {answerText}
                  </motion.p>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </MotionConfig>
  );
}