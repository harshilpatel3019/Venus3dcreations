import React from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import AboutSection from "../components/AboutSection";
import Testimonials from "../components/Testimonials";
import CustomCta from "../components/CustomCta";

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <AboutSection />
      <CustomCta />
      <Testimonials />
    </main>
  );
};

export default HomePage;
