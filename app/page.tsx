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

export default function Home() {
  return (
    <>
      <Header content={headerContent} />
      <main>
        <Hero />

        <div className="flex flex-col sm:gap-10 gap-8 sm:mt-10 nt-8">

          <About />

          <Services />

          <WhyChooseUs />

          <Testimonials content={testimonialContent} />

          <Contact />

          <Faq />
        </div>
      </main>

      <Footer />

      <PageMotion />
    </>
  );
}
