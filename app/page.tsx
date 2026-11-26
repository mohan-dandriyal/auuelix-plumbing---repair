import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PageMotion from "@/components/common/PageMotion";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Faq from "@/components/sections/Faq";
import { Header as headerContent, Testimonials as testimonialContent } from "@/types/template.type";
import { Suspense } from "react";

function HomePageSections() {
  return (
    <>
      <Header content={headerContent} />
      <main className="overflow-x-clip">
        <Hero />

        <div className="flex flex-col sm:gap-10 gap-8 sm:mt-10 nt-8">

          <About />

          <Services />

          <WhyChooseUs />

          <Testimonials content={testimonialContent} />

          <Faq />

          <Contact />
        </div>
      </main>

      <Footer />

      <PageMotion />
    </>
  );
}



export default function HomePage() {
  return (
    <Suspense>
      <HomePageSections />
    </Suspense>
  )
}
