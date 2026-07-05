"use client";

import React, { useEffect } from "react";
import { Navbar } from "../components/sections/Navbar";
import { HeroSection } from "../components/sections/HeroSection";
import { BentoGrid } from "../components/sections/BentoGrid";
import { InteractiveSandbox } from "../components/sections/InteractiveSandbox";
import { UseCases } from "../components/sections/UseCases";
import { ApiPreview } from "../components/sections/ApiPreview";
import { CtaSection } from "../components/sections/CtaSection";
import { Footer } from "../components/sections/Footer";

export default function HomePage() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".framer-animate");
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="antialiased font-body-md min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <div className="space-y-16">
          <BentoGrid />
          <InteractiveSandbox />
          <UseCases />
          <ApiPreview />
          <CtaSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
