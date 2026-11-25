"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Hero as content } from "@/types/template.type";
import { Accent, Slashes } from "@/components/common/SectionHeading";

/**
 * Pure Tailwind (no custom CSS / keyframes). Animations are transitions driven by state.
 *
 * Typography from the screenshot:
 *  - Headline: geometric sans, 800, tight tracking (-0.035em). Looks like Plus Jakarta Sans.
 *    Load it in layout.tsx and expose --font-jakarta (falls back to Inter):
 *      import { Plus_Jakarta_Sans } from "next/font/google";
 *      const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["700","800"], variable: "--font-jakarta" });
 *  - Eyebrow: 700, uppercase, very wide tracking (0.22em)
 *  - Body: Inter 400, ~26px desktop, leading-snug
 *  - Colours: ink #1b2437 | cyan #00b9d8 | dark panel #112d3c
 */

const CYAN = "#00b9d8";

/* ---------- helpers ---------- */

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function parse(value: string) {
  const m = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return {
    prefix: m[1],
    raw: m[2],
    suffix: m[3],
    target: parseFloat(m[2].replace(/,/g, "")),
    decimals: m[2].includes(".") ? m[2].split(".")[1].length : 0,
    grouping: m[2].includes(","),
  };
}

/** Counts up once `run` becomes true. Non-numeric values (e.g. "24/7") show as is. */
function Counter({ value, run }: { value: string; run: boolean }) {
  const [display, setDisplay] = useState(() => {
    const p = parse(value);
    return p ? `${p.prefix}0${p.suffix}` : value;
  });

  useEffect(() => {
    const p = parse(value);
    if (!p || !run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1800;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const n = p.target * eased;
      const text = n.toLocaleString("en-US", {
        minimumFractionDigits: p.decimals,
        maximumFractionDigits: p.decimals,
        useGrouping: p.grouping,
      });
      setDisplay(`${p.prefix}${text}${p.suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);

  return <span aria-hidden="true">{display}</span>;
}

/* ---------- component ---------- */

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [statsRef, statsIn] = useInView<HTMLDivElement>();

  useEffect(() => {
    setMounted(true);
  }, []);

  // reveal helper: fade + rise with a delay
  const rise = (delay: number, shown = mounted) => ({
    className: `transition-all duration-700 ease-out motion-reduce:transition-none ${shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`,
    style: { transitionDelay: shown ? `${delay}ms` : "0ms" },
  });

  const titleLine = "block transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none";
  const titleShown = mounted ? "translate-y-0" : "translate-y-[110%]";

  return (
    <section id="home" className="font-[family-name:var(--font-inter),system-ui,sans-serif]">
      <div className="relative isolate flex flex-col-reverse overflow-hidden bg-white lg:block lg:min-h-[clamp(34rem,39vw,46rem)]">
        {/* ---------- Art: cyan stripe + diagonal image ---------- */}
        <div aria-hidden={false}>
          {/* stripe (desktop only) */}
          <div
            style={{ backgroundColor: CYAN, transitionDelay: mounted ? "100ms" : "0ms" }}
            className={`pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] transition-transform duration-1000 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none lg:block [clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)] ${mounted ? "translate-x-0" : "translate-x-full"
              }`}
          />
          {/* image, clip edge is parallel to the stripe */}
          <div
            style={{ borderColor: CYAN, transitionDelay: mounted ? "300ms" : "0ms" }}
            className={`relative aspect-[4/3] overflow-hidden border-t-4 transition-all duration-1000 ease-out motion-reduce:transition-none lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[58%] lg:border-t-0 lg:[clip-path:polygon(17.5%_0,100%_0,100%_100%,3.5%_100%)] ${mounted ? "opacity-100 lg:translate-x-0" : "opacity-0 lg:translate-x-24"
              }`}
          >
            <Image
              src={content.image1}
              alt="Plumber tightening a chrome pipe under a sink"
              fill
              preload
              sizes="(min-width: 1024px) 58vw, 100vw"
              className={`object-cover object-center transition-transform duration-[1800ms] ease-out motion-reduce:transition-none ${mounted ? "scale-100" : "scale-110"
                }`}
            />
          </div>
        </div>

        {/* ---------- Copy ---------- */}
        <div className="shell relative z-10 py-10 lg:flex lg:min-h-[inherit] lg:w-full lg:flex-col lg:justify-center lg:py-0">
          <div className="lg:max-w-[56%]">
            {/* eyebrow */}
            <p className="flex items-center gap-4 text-[clamp(.72rem,1.05vw,1rem)] font-bold uppercase tracking-[.22em] text-[#1b2437]">
              <Slashes className={`transition-all delay-100 duration-500 ease-out motion-reduce:transition-none ${mounted ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}`} />
              <span
                style={{ transitionDelay: mounted ? "250ms" : "0ms" }}
                className={`transition-all duration-700 ease-out motion-reduce:transition-none ${mounted ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                  }`}
              >
                {content.subtitle}
              </span>
              {/* line draws itself */}
              <span
                aria-hidden="true"
                style={{ transitionDelay: mounted ? "550ms" : "0ms" }}
                className={`hidden h-px w-[clamp(6rem,14vw,13rem)] origin-left bg-[#1b2437] transition-transform duration-[900ms] ease-out motion-reduce:transition-none sm:block ${mounted ? "scale-x-100" : "scale-x-0"
                  }`}
              />
            </p>

            {/* title: each line slides up from behind a mask */}
            <h1 className="mt-5 text-[clamp(2.3rem,4.5vw,4.5rem)] font-bold leading-[1.2] tracking-[-0.035em] text-[#1b2437] lg:mt-[3.6vw]">
              <span className="-mb-[.15em] block overflow-hidden pb-[.15em]">
                <span className={`${titleLine} ${titleShown}`} style={{ transitionDelay: mounted ? "250ms" : "0ms" }}>
                  {content.title1}
                </span>
              </span>
              <span className="-mb-[.15em] block overflow-hidden pb-[.15em]">
                <span className={`${titleLine} ${titleShown}`} style={{ transitionDelay: mounted ? "400ms" : "0ms" }}>
                  <Accent text={content.title2} phrase={content.accent} />
                </span>
              </span>
            </h1>

            {/* description */}
            <p
              {...(() => {
                const r = rise(650);
                return { style: r.style };
              })()}
              className={`mt-6 max-w-[32rem] text-[clamp(0.9rem,1.2vw,1.3rem)] leading-snug text-slate-700 lg:mt-[2.4vw] ${rise(650).className}`}
            >
              {content.description}
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Stats panel ---------- */}
      <div
        ref={statsRef}
        className="relative shell mx-auto grid gap-6 bg-[#112d3c]/[.98] p-6 text-white sm:p-10 lg:-mt-16 lg:grid-cols-[.98fr_1.02fr] lg:items-center xl:p-12"
      >
        <div className="lg:border-r lg:border-[#00bdd7]/65 lg:pr-8">
          <div {...rise(0, statsIn)}>
            <h2 className="text-[clamp(1.8rem,2.5vw,2.5rem)] font-bold leading-[1.12]">
              {content.stats.title}
              <br />
              <Accent text={content.stats.subtitle} phrase={content.accent} />
            </h2>
          </div>
          <p
            {...(() => {
              const r = rise(150, statsIn);
              return { style: r.style };
            })()}
            className={`mt-4 text-sm sm:text-base leading-snug tracking-wider font-normal text-slate-200 lg:text-[17px] ${rise(150, statsIn).className}`}
          >
            {content.stats.description}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-6 ">
          {content.stats.items.map(({ value, label }, i) => {
            const r = rise(250 + i * 120, statsIn);
            return (
              <div key={label} className={`flex flex-col ${r.className}`} style={r.style}>
                <dt className="order-last text-sm leading-snug text-slate-100 sm:text-[17px]">{label}</dt>
                <dd className="mb-2 text-[clamp(2rem,3vw,3rem)] font-extrabold leading-none tabular-nums text-[#00c2e0]">
                  <span className="sr-only">{value}</span>
                  <Counter value={value} run={statsIn} />
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
