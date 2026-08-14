import React from "react";
import { Link } from "react-router-dom";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const img = (p) => `${BACKEND}${p}`;

const Hero = () => {
  return (
    <section className="bg-[var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-24 lg:pt-36 pb-24 lg:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-6 vc-fade-up">
            <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--espresso)]/60 mb-8">
              Studio Collection 2025
            </p>
            <h1 className="font-serif-display font-light text-[48px] md:text-[64px] lg:text-[76px] leading-[1.05] text-[var(--espresso)]">
              Objects printed like they were <em className="italic text-[var(--copper)]">sculpted</em>.
            </h1>
            <p className="mt-10 text-base md:text-lg text-[var(--espresso)]/60 max-w-md leading-[1.9] tracking-wide">
              A studio for lamps and objects that blend imagination with technology — designed to bring warmth, character and quiet art into everyday spaces.
            </p>
            <div className="mt-12">
              <Link to="/shop" className="vc-btn-ghost inline-flex items-center h-12 px-10 text-[11px] tracking-[0.28em] uppercase">
                Explore
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] overflow-hidden bg-[var(--sand)]">
              <img src={img("/api/static/products/nova-01.jpg")} alt="Nova Lamp" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
