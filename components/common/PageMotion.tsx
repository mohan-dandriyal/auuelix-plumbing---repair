"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function animateCounter(element: HTMLElement) {
  const original = element.textContent;
  const match = original.match(/^(\d[\d,]*)(\+|\/\d+)?$/);
  if (!match) return;

  const [, digits, suffix = ""] = match;
  const end = Number(digits.replaceAll(",", ""));
  const number = { value: 0 };
  const formatter = new Intl.NumberFormat("en-US", { useGrouping: digits.includes(",") });

  const tween = gsap.to(number, {
    value: end,
    duration: 1.65,
    ease: "power3.out",
    onUpdate: () => { element.textContent = formatter.format(Math.round(number.value)) + suffix; },
    onComplete: () => { element.textContent = original; },
  });

  return () => {
    tween.kill();
    element.textContent = original;
  };
}

export default function PageMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-picture img", { scale: 1.07, duration: 1.35 })
        .from("[data-hero]", { y: 22, opacity: 0.4, duration: 0.7, stagger: 0.11 }, 0.05)
        .from(".stats-panel", { y: 12, opacity: 0.7, duration: 0.65 }, 0.25);

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 26, opacity: 0.5, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 93%", once: true },
        });
      });

      const cleanup: (() => void)[] = [];
      const counters = gsap.utils.toArray<HTMLElement>("[data-counter]");
      ScrollTrigger.create({
        trigger: "[data-stats]",
        start: "top 88%",
        once: true,
        onEnter: () => {
          counters.forEach((counter) => {
            const restore = animateCounter(counter);
            if (restore) cleanup.push(restore);
          });
        },
      });

      return () => cleanup.forEach((restore) => restore());
    });

    return () => media.revert();
  }, []);

  return null;
}
