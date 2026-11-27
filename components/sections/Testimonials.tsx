"use client";

import Image from "next/image";
import { MotionConfig, motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import type { TestimonialsType } from "@/types/template.type";
import { Accent, SectionHeading } from "@/components/common/SectionHeading";

type Review = TestimonialsType["testimonials"][number];

/* Match the initial visible cards before Swiper hydrates. */
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------- Framer variants ---------- */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

// Cards react to whether their slide is the active one (so they also crossfade while swiping).
const cardState: Variants = {
  rest: { opacity: 0.35, scale: 0.97, transition: { duration: 0.5, ease } },
  active: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
};

// Stars pop in one by one every time a slide becomes active.
const star: Variants = {
  rest: { opacity: 0, scale: 0.4, rotate: -30 },
  active: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 350, damping: 15, delay: 0.25 + i * 0.07 },
  }),
};

export default function Testimonials({ content }: { content: TestimonialsType }) {
  const reducedMotion = useReducedMotion();
  const isClient = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const swiperRef = useRef<SwiperInstance | null>(null);

  const reviews = content.testimonials;
  const loop = reviews.length >= 3;
  const [active, setActive] = useState(0);

  return (
    <MotionConfig reducedMotion="user">
      <section id="testimonials" className="shell section-space">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionHeading label={content.subtitle} description={content.description} centered>
            <Accent text={content.title1} phrase={content.accent} /> {content.title2}
          </SectionHeading>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mx-auto mt-8 max-w-6xl"
        >
          {isClient ? (
            <Swiper
              id="testimonial-carousel"
              className="testimonial-swiper"
              style={{padding : '8px 0px'}}
              modules={[A11y, Keyboard]}
              a11y={{ containerMessage: content.subtitle }}
              keyboard={{ enabled: true, onlyInViewport: true }}
              onSwiper={(instance) => {
                swiperRef.current = instance;
              }}
              onRealIndexChange={(instance) => setActive(instance.realIndex)}
              speed={reducedMotion ? 0 : 480}
              grabCursor={reviews.length > 1}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{ 768: { slidesPerView: 2 } }}
              watchSlidesProgress
              loop={loop}
              rewind={!loop}
              autoHeight
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id}>
                  {({ isActive, isVisible }) => (
                    <div className=" px-2" aria-hidden={!isActive && !isVisible}>
                      <ReviewCard review={review} active={isActive || isVisible} />
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div id="testimonial-carousel" className={reviews.length > 1 ? "grid gap-5 bg-red-500 py-3 md:grid-cols-2" : "py-3"}>
              {reviews.slice(0, 2).map((review, index) => (
                <div key={review.id} className={index === 1 ? "hidden md:block" : undefined}>
                  <ReviewCard review={review} active />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ---------- Pagination dots ---------- */}
        {reviews.length > 1 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            role="group"
            aria-label="Testimonial slides"
            className={`mt-5 flex items-center justify-center gap-2 ${reviews.length === 2 ? "md:hidden" : ""}`}
          >
            <button type="button" aria-label="Previous testimonial" aria-controls="testimonial-carousel" disabled={!isClient} onClick={() => swiperRef.current?.slidePrev()} className="grid size-11 cursor-pointer place-items-center rounded-full border border-slate-200 text-ink hover:bg-slate-100">
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            {reviews.map((review, index) => {
              const label = `Show testimonial by ${review.name}`;
              const isActive = index === active;
              return (
                <motion.button
                  key={review.id}
                  type="button"
                  aria-label={label}
                  aria-controls="testimonial-carousel"
                  aria-current={isActive ? "true" : undefined}
                  disabled={!isClient}
                  onClick={() => {
                    const swiper = swiperRef.current;
                    if (loop) {
                      swiper?.slideToLoop(index);
                    } else {
                      swiper?.slideTo(index);
                    }
                  }}
                  whileTap={{ scale: 0.85 }}
                  className="grid h-9 min-w-9 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {/* the active dot stretches into a pill */}
                  <motion.span
                    initial={false}
                    animate={{ width: isActive ? 28 : 12 }}
                    transition={{ duration: 0.3, ease }}
                    className={`block h-3 rounded-full motion-safe:transition-colors ${isActive ? "bg-accent" : "bg-slate-300"}`}
                  />
                </motion.button>
              );
            })}
            <button type="button" aria-label="Next testimonial" aria-controls="testimonial-carousel" disabled={!isClient} onClick={() => swiperRef.current?.slideNext()} className="grid size-11 cursor-pointer place-items-center rounded-full border border-slate-200 text-ink hover:bg-slate-100">
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </motion.div>
        )}
      </section>
    </MotionConfig>
  );
}

function ReviewCard({ review, active }: { review: Review; active: boolean }) {
  const { avatar, name, location, quote, rating } = review;
  const stars = Math.max(0, Math.min(5, Math.round(rating))); // "★".repeat() throws on negatives

  return (
    <motion.figure
      variants={cardState}
      initial={false}
      animate={active ? "active" : "rest"}
      whileHover={active ? { y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } } : undefined}
      className="review-card group relative isolate flex flex-col justify-between overflow-hidden rounded-[1.2rem] border border-slate-200 p-6 transition-shadow duration-300 hover:shadow-md shadow-gray-100 motion-reduce:transition-none "
    >
      <blockquote>
        <span
          className="block h-10 origin-bottom-left font-serif text-[5.5rem] leading-[.95] font-bold text-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 motion-reduce:transition-none"
          aria-hidden="true"
        >
          “
        </span>
        <p className="lg:text-lg mt-4 tracking-wider text-copy md:text-base text-sm">{quote}</p>
      </blockquote>

      <figcaption className="mt-6 flex flex-wrap items-center gap-3 xl:gap-5">
        <Image src={avatar} alt="" width={80} height={80} className="size-14 rounded-full object-cover xl:size-15" />
        <div className="border-l-2 border-accent pl-3 xl:pl-5">
          <div className="font-bold text-base lg:text-lg">{name}</div>
          <div className="text-sm text-copy text-sm sm:text-base">{location}</div>
        </div>
        <span
          role="img"
          aria-label={`${stars} out of 5 stars`}
          className="inline-flex text-xl tracking-[.04em] text-[#ee9d0c] sm:ml-auto xl:text-2xl"
        >
          {Array.from({ length: stars }, (_, i) => (
            <motion.span key={i} custom={i} variants={star} aria-hidden="true" className="inline-block">
              ★
            </motion.span>
          ))}
        </span>
      </figcaption>
    </motion.figure>
  );
}
