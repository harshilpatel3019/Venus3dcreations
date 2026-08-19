import React from "react";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import AboutSection from "../components/AboutSection";
import CustomCta from "../components/CustomCta";

const HomePage = () => {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <AboutSection />
      <CustomCta />
    </main>
  );
};

export default HomePage;
