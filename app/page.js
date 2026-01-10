import CTA from "@/components/homepage/CTA";
import FAQ from "@/components/homepage/Faq";
import Features from "@/components/homepage/Features";
import Footer from "@/components/homepage/Footer";
import Header from "@/components/homepage/Header";
import Hero from "@/components/homepage/Hero";
import HowItWorks from "@/components/homepage/HowItWork";
import Industries from "@/components/homepage/Industries";
import Integrations from "@/components/homepage/Integration";
import Pricing from "@/components/homepage/Pricing";
import Promise from "@/components/homepage/Promise";
import Stats from "@/components/homepage/Stats";
import Testimonials from "@/components/homepage/Testimonial";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      {/* <Stats /> */}
      <Features />
      <HowItWorks />
      <Industries />
      <Pricing />
      <Promise />
      <Testimonials />
      <Integrations />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
