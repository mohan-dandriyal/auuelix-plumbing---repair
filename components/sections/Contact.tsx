"use client";

import { MotionConfig, motion, type Variants } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import type { FormEvent } from "react";
import { Contact as content, Services } from "@/types/template.type";
import { SectionHeading } from "@/components/common/SectionHeading";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------- variants ---------- */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};
const methodList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const methodItem: Variants = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
  hover: { y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } },
};
const formCard: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease, delay: 0.15, staggerChildren: 0.07, delayChildren: 0.4 },
  },
};
const fieldIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

// each icon gets its own hover motion
const phoneRing: Variants = { hover: { rotate: [0, -14, 12, -8, 6, 0], transition: { duration: 0.7 } } };
const mailLift: Variants = { hover: { y: [0, -5, 0], scale: 1.08, transition: { duration: 0.5 } } };
const pinHop: Variants = { hover: { y: [0, -8, 0, -3, 0], transition: { duration: 0.6 } } };

// soft cyan glow when a field is focused
const focusGlow = { boxShadow: "0 0 0 4px #14b4d31f", borderColor: "#14b4d3" };

export default function Contact() {
  const { contactInfo, form } = content;
  const methods = [
    { icon: Phone, title: contactInfo.phoneTitle, text: contactInfo.phone, href: `tel:${contactInfo.phone.replaceAll(" ", "")}`, hover: phoneRing },
    { icon: Mail, title: contactInfo.emailTitle, text: contactInfo.email, href: `mailto:${contactInfo.email}`, hover: mailLift },
    { icon: MapPin, title: contactInfo.addressTitle, text: contactInfo.address, href: undefined as string | undefined, hover: pinHop },
  ];

  const viewport = { once: true, amount: 0.2 } as const;

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Service inquiry: ${fields.get("service")}`);
    const body = encodeURIComponent([
      `Name: ${fields.get("name")}`,
      `Phone: ${fields.get("phone")}`,
      `Email: ${fields.get("email")}`,
      `Service: ${fields.get("service")}`,
      "",
      String(fields.get("message")),
    ].join("\r\n"));
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
  }

  return (
    <MotionConfig reducedMotion="user">
      <section id="contact" className="shell section-space">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
          <SectionHeading label={content.subtitle} description={content.description} centered>
            {content.title1} <span className="text-accent">{content.title2}</span>
          </SectionHeading>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-8 grid gap-6 lg:grid-cols-[.38fr_.62fr] lg:items-center"
        >
          {/* ---------- contact methods ---------- */}
          <motion.ul variants={methodList} className="grid gap-3">
            {methods.map(({ icon: Icon, title, text, href, hover }) => (
              <motion.li
                key={title}
                variants={methodItem}
                whileHover="hover"
                className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-[#f7f9fa] p-4 transition-shadow duration-300 hover:shadow-[0_14px_28px_-16px_#14252e45] motion-reduce:transition-none xl:gap-6 xl:p-5"
              >
                <motion.span
                  variants={hover}
                  className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#e5f4f6] transition-colors duration-300 group-hover:bg-[#14b4d3] group-hover:text-white motion-reduce:transition-none xl:size-15"
                >
                  <Icon className="size-6" strokeWidth={1.65} aria-hidden="true" />
                </motion.span>
                <div className="min-w-0 border-l-2 border-accent pl-4 xl:pl-6">
                  <h3 className="font-extrabold xl:text-xl">{title}</h3>
                  {href ? (
                    <a href={href} className="break-words text-copy hover:text-accent">
                      {text}
                    </a>
                  ) : (
                    <p className="text-copy">{text}</p>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>

          {/* ---------- form ---------- */}
          <motion.form onSubmit={submitInquiry} variants={formCard} className="rounded-2xl border border-slate-200 bg-white p-5 xl:p-6">
            <motion.h3
              variants={fieldIn}
              className="short-rule text-2xl leading-tight font-extrabold xl:text-[1.8rem]"
            >
              {form.title}
            </motion.h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:gap-4">
              <motion.input variants={fieldIn} whileFocus={focusGlow} name="name" type="text" autoComplete="name" aria-label={form.name} placeholder={`${form.name} *`} required />
              <motion.input variants={fieldIn} whileFocus={focusGlow} name="phone" type="tel" autoComplete="tel" aria-label={form.phone} placeholder={`${form.phone} *`} required />
              <motion.input variants={fieldIn} whileFocus={focusGlow} name="email" type="email" autoComplete="email" aria-label={form.email} placeholder={`${form.email} *`} required />
              <motion.select variants={fieldIn} whileFocus={focusGlow} name="service" defaultValue="" aria-label={form.service} required>
                <option value="" disabled>
                  {form.service} *
                </option>
                {Services.services.map(({ id, title }) => (
                  <option key={id} value={title}>
                    {title}
                  </option>
                ))}
              </motion.select>
              <motion.textarea
                name="message"
                variants={fieldIn}
                whileFocus={focusGlow}
                className="min-h-28 sm:col-span-2"
                aria-label={form.message}
                placeholder={`${form.message} *`}
                required
              />
            </div>
            <motion.div variants={fieldIn} className="mt-4 flex flex-wrap items-center gap-3">
              <button type="submit" aria-describedby="contact-submit-help" className="cursor-pointer rounded-lg bg-[#00788f] px-5 py-3 font-semibold text-white hover:bg-[#006579]">
                Submit inquiry
              </button>
              <p id="contact-submit-help" className="text-sm text-copy">Opens a draft in your email app.</p>
            </motion.div>
          </motion.form>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
