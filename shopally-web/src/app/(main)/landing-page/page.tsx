"use client";

import Header from "@/app/components/LandingPageComponents/Header";
import Hero from "@/app/components/LandingPageComponents/Hero";
import Features from "@/app/components/LandingPageComponents/Features";
import Testimonials from "@/app/components/LandingPageComponents/Testimonials";
import Demo from "@/app/components/LandingPageComponents/Demo";
import Download from "@/app/components/LandingPageComponents/Download";
import Footer from "@/app/components/LandingPageComponents/Footer";
import HowItWorks from "@/app/components/LandingPageComponents/HowItWorks";

export default function LandingPage() {
  return (
    <main className="scroll-smooth">
       <Header />
      <Hero />
      <Features />
      <HowItWorks /> 
      <Demo />
      <Testimonials />
      <Download />
      <Footer />
    </main>
  );
}
