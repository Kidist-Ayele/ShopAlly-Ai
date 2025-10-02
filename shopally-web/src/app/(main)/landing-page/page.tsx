"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Header from "@/app/components/LandingPageComponents/Header";
import Hero from "@/app/components/LandingPageComponents/Hero";
import Features from "@/app/components/LandingPageComponents/Features";
import Testimonials from "@/app/components/LandingPageComponents/Testimonials";
import Demo from "@/app/components/LandingPageComponents/Demo";
import Download from "@/app/components/LandingPageComponents/Download";
import Footer from "@/app/components/LandingPageComponents/Footer";
import HowItWorks from "@/app/components/LandingPageComponents/HowItWorks";
import GetStarted from "@/app/components/LandingPageComponents/GetStarted";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home"); // redirect signed-in users
    }
  }, [status, router]);

  if (status === "loading") return null; // wait for session check

  // Render landing page only if not signed in
  return (
    <main className="scroll-smooth">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Demo />
      <Testimonials />
      <GetStarted />
      <Footer />
    </main>
  );
}
