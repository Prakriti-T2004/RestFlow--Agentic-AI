import React from "react";
import PremiumHeroSection from "@/components/LandingPage/HeroComponents";
import { FeaturesSection } from "@/components/LandingPage/FeaturesSection";
import { Testimonials } from "@/components/LandingPage/Testimonials";
import { FAQ } from "@/components/LandingPage/FAQ";
import { Footer } from "@/components/LandingPage/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-500 ease-in-out">
      <PremiumHeroSection />
      <FeaturesSection />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}