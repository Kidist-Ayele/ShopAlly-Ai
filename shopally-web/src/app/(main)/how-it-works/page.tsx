"use client";

import Sidebar from "@/app/components/Sidebar";
import HowItWorks from "@/app/components/HowItWorks/HowItWorks";
import Demo from "@/app/components/HowItWorks/Demo";

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar activePage="how-it-works" />

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 bg-[var(--color-bg-primary)]">
        <HowItWorks />
        <Demo />
      </main>
    </div>
  );
}
