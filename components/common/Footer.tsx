"use client";

/**
 * Needs: npm i framer-motion react-icons
 * (react-icons because your data keys - FaInstagram, FaYoutube, FaFacebookF - are its Font Awesome names)
 */

import { MotionConfig, motion, type Variants } from "framer-motion";
import { ChevronRight, Globe, Mail, MapPin, Phone } from "lucide-react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Footer as content } from "@/types/template.type";
import Brand from "./Brand";
import { Accent } from "./SectionHeading";

/* Each network gets its own brand colour for the hover fill.
   (Full class names on purpose, so Tailwind can detect them.) */
const socials: Record<string, { icon: IconType; fill: string; text: string }> = {
  FaFacebookF: { icon: FaFacebookF, fill: "bg-[#1877f2]", text: "group-hover:text-white group-focus-visible:text-white" },
  FaInstagram: {
    icon: FaInstagram,
    fill: "bg-[linear-gradient(45deg,#f9a03c,#e1306c_55%,#833ab4)]",
    text: "group-hover:text-white group-focus-visible:text-white",
  },
  FaYoutube: { icon: FaYoutube, fill: "bg-[#ff0033]", text: "group-hover:text-white group-focus-visible:text-white" },
  FaXTwitter: { icon: FaXTwitter, fill: "bg-white", text: "group-hover:text-[#0e1a22] group-focus-visible:text-[#0e1a22]" },
  FaTwitter: { icon: FaTwitter, fill: "bg-[#1da1f2]", text: "group-hover:text-white group-focus-visible:text-white" },
  FaLinkedinIn: { icon: FaLinkedinIn, fill: "bg-[#0a66c2]", text: "group-hover:text-white group-focus-visible:text-white" },
  FaWhatsapp: { icon: FaWhatsapp, fill: "bg-[#25d366]", text: "group-hover:text-white group-focus-visible:text-white" },
};
const fallbackSocial = {
  icon: Globe as unknown as IconType,
  fill: "bg-accent",
  text: "group-hover:text-[#0e1a22] group-focus-visible:text-[#0e1a22]",
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------- variants ---------- */
const footerGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};
const listGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
};
const slideIn: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
};
const pop: Variants = {
  hidden: { opacity: 0, scale: 0.3, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 16 } },
};
const drawX: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.2, ease } },
};

export default function Footer() {
  const { contactInfo } = content;

  return (
    <MotionConfig reducedMotion="user">
      <motion.footer
        variants={footerGroup}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="relative bg-[#0e1a22] text-white pt-14  sm:mt-10 mt-10"
      >
        {/* thin cyan line that draws across the top edge */}
        <motion.span
          aria-hidden="true"
          variants={drawX}
          className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-[#14b4d3] to-transparent"
        />

        <div className="shell pt-(--section-padding) pb-7 lg:pb-[3vw]">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.65fr_.8fr_1.1fr_.7fr] lg:gap-[3vw]">
            {/* ---------- brand ---------- */}
            <motion.div variants={rise} className="lg:border-r lg:border-white/30 lg:pr-6">
              <a href="#home" className="inline-block text-[clamp(1.8rem,3.65vw,3.75rem)] transition-transform duration-300 hover:scale-[1.03] motion-reduce:transition-none">
                <Brand logo={{ src: content.logoImage, logoAlt: content.logoAlt }} />
              </a>
              <p className="mt-5 text-[clamp(1.2rem,1.8vw,2rem)] leading-tight font-medium">
                <Accent text={content.description} phrase={content.accent} />
              </p>
            </motion.div>

            {/* ---------- quick links ---------- */}
            <motion.div variants={rise}>
              <h2 className="footer-title short-rule">{content.quickLinksTitle}</h2>
              <motion.ul variants={listGroup} className="mt-4 grid gap-1.5">
                {content.quickLinks.map(({ id, url, label }) => (
                  <motion.li key={id} variants={slideIn}>
                    <a
                      className="group inline-flex items-center gap-2 transition-[transform,color] duration-300 hover:translate-x-1 hover:text-accent motion-reduce:transition-none"
                      href={url}
                    >
                      <ChevronRight
                        className="size-4 text-accent transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                      {label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* ---------- address ---------- */}
            <motion.div variants={rise}>
              <h2 className="footer-title short-rule">{content.addressTitle}</h2>
              <motion.address variants={listGroup} className="mt-4 grid gap-3 not-italic">
                <motion.p variants={slideIn} className="flex gap-3">
                  <MapPin className="size-5 shrink-0 text-accent" aria-hidden="true" />
                  {contactInfo.address}
                </motion.p>
                <motion.a
                  variants={slideIn}
                  className="group flex gap-3 transition-colors hover:text-accent"
                  href={`tel:${contactInfo.phone.replace(/[^\d+]/g, "")}`}
                >
                  <Phone
                    className="size-5 shrink-0 text-accent transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                  {contactInfo.phone}
                </motion.a>
                <motion.a
                  variants={slideIn}
                  className="group flex min-w-0 gap-3 break-all transition-colors hover:text-accent"
                  href={`mailto:${contactInfo.email}`}
                >
                  <Mail
                    className="size-5 shrink-0 text-accent transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                  {contactInfo.email}
                </motion.a>
              </motion.address>
            </motion.div>

            {/* ---------- social ---------- */}
            <motion.div variants={rise}>
              <h2 className="footer-title short-rule">{content.socialTitle}</h2>
              <motion.ul variants={listGroup} className="mt-4 flex flex-wrap gap-3">
                {content.socialLinks.map(({ id, icon, label, url }) => {
                  const { icon: Icon, fill, text } = socials[icon] ?? fallbackSocial;
                  return (
                    <motion.li key={id} variants={pop}>
                      <motion.a
                        href={url}
                        aria-label={label}
                        whileHover={{ y: -5, scale: 1.1, rotate: -6 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 350, damping: 18 }}
                        className="group relative grid size-10 place-items-center rounded-full border border-white/40 transition-[border-color,box-shadow] duration-300 hover:border-transparent hover:shadow-[0_12px_22px_-8px_#000000b3] focus-visible:border-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14b4d3] motion-reduce:transition-none"
                      >
                        {/* brand colour rises from the bottom like water filling the circle */}
                        <span aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-full">
                          <span
                            className={`absolute inset-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none ${fill}`}
                          />
                        </span>
                        <Icon
                          aria-hidden="true"
                          className={`relative size-[1.05rem] transition-colors duration-300 motion-reduce:transition-none ${text}`}
                        />
                        {/* name tooltip */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-bold text-[#0e1a22] opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
                        >
                          {label}
                        </span>
                      </motion.a>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </motion.div>
          </div>

          <motion.p
            variants={rise}
            className="mt-8 border-t border-white/50 pt-5 text-center text-white/90 lg:mt-12"
          >
            {content.copyrightText}
          </motion.p>
        </div>
      </motion.footer>
    </MotionConfig>
  );
}
