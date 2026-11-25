
import data from "@/data/template.json";

export const Header = data.categories.Aquelix.sections.Header.variants.AquelixHeader2;
export const Hero = data.categories.Aquelix.sections.Hero.variants.AquelixHero2;
export const AboutUs = data.categories.Aquelix.sections.AboutUs.variants.AquelixAboutUs2;
export const Services = data.categories.Aquelix.sections.Services.variants.AquelixServices2;
export const WhatWeDo = data.categories.Aquelix.sections.WhatWeDo.variants.AquelixWhatWeDo2;
export const Testimonials = data.categories.Aquelix.sections.Testimonials.variants.AquelixTestimonials2;
export const Faq = data.categories.Aquelix.sections.Faq.variants.AquelixFaq2;
export const Contact = data.categories.Aquelix.sections.Contact.variants.AquelixContact2;

export const Footer = data.common.Footer;


export type HeaderType = typeof Header;
export type FooterType = typeof Footer;

export type HeroType = typeof Hero;
export type AboutUsType = typeof AboutUs;
export type ServicesType = typeof Services;
export type WhatWeDoType = typeof WhatWeDo;
export type TestimonialsType = typeof Testimonials;
export type FaqType = typeof Faq;
export type ContactType = typeof Contact;
