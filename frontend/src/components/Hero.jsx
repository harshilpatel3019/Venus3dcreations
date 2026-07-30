import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const img = (p) => `${BACKEND}${p}`;

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-20 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 vc-fade-up">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-6">
              — Studio Collection 2025
            </p>
            <h1 className="font-serif-display text-[52px] md:text-[72px] lg:text-[88px] leading-[1] text-[var(--espresso)]">
              Objects <em className="italic text-[var(--copper)]">printed</em><br />
              like they were <em className="italic">sculpted</em>.
            </h1>
            <p className="mt-8 text-lg text-[var(--espresso)]/70 max-w-lg leading-relaxed">
              Venus is a studio where 3D printing becomes a craft. Lamps, sculptures and home objects—designed as heirlooms, made one piece at a time in India.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link to="/shop" className="inline-flex items-center gap-2 vc-btn-copper px-8 h-12 text-xs tracking-[0.2em] uppercase">
                Explore the collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)] vc-link-underline">
                Our craft
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-md">
              {[
                { n: "9", l: "Original designs" },
                { n: "100%", l: "Made in India" },
                { n: "100%", l: "Hand finished" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-serif-display text-3xl text-[var(--espresso)]">{s.n}</p>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-[var(--espresso)]/50 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-6 grid-rows-6 gap-4 h-[560px] lg:h-[680px]">
              <div className="col-span-4 row-span-4 overflow-hidden bg-[var(--sand)]">
                <img src={img("/api/static/products/studio-01.jpg")} alt="The Venus collection" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 row-span-3 overflow-hidden bg-[var(--sand)]">
                <img src={img("/api/static/products/zoro-01.jpg")} alt="Zoro Lamp" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 row-span-3 overflow-hidden bg-[var(--sand)]">
                <img src={img("/api/static/products/spectra-01.jpg")} alt="Spectra Lamp" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-3 row-span-2 overflow-hidden bg-[var(--sand)]">
                <img src={img("/api/static/products/crumpled-01.jpg")} alt="Crumpled Lamp" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-3 row-span-2 overflow-hidden bg-[var(--sand)]">
                <img src={img("/api/static/products/cargo-01.jpg")} alt="Cargo Lamp" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-[var(--sand)] py-6 overflow-hidden bg-[var(--cream)]">
        <div className="vc-marquee-track">
          {Array(2).fill(0).map((_, r) => (
            <div key={r} className="flex items-center gap-16 pr-16">
              {["Sculptural", "Made in India", "Made to Order", "One of One", "Studio Craft", "Since 2025", "Sculptural", "Made in India", "Made to Order", "One of One"].map((w, i) => (
                <span key={i} className="font-serif-display italic text-3xl md:text-4xl text-[var(--espresso)]/40">
                  {w} <span className="text-[var(--copper)]">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
