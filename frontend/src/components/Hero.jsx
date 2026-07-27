import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-20 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="lg:col-span-6 vc-fade-up">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-6">
              — Studio Collection 2025
            </p>
            <h1 className="font-serif-display text-[52px] md:text-[72px] lg:text-[88px] leading-[1] text-[var(--espresso)]">
              Objects <em className="italic text-[var(--copper)]">printed</em><br />
              like they were <em className="italic">sculpted</em>.
            </h1>
            <p className="mt-8 text-lg text-[var(--espresso)]/70 max-w-lg leading-relaxed">
              Venus is a studio where 3D printing becomes a craft. Lamps, sculptures, handbags and home objects—designed as heirlooms, made one piece at a time.
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
                { n: "120+", l: "Original designs" },
                { n: "38", l: "Countries shipped" },
                { n: "100%", l: "Hand finished" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-serif-display text-3xl text-[var(--espresso)]">{s.n}</p>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-[var(--espresso)]/50 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image collage */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-6 grid-rows-6 gap-4 h-[560px] lg:h-[680px]">
              <div className="col-span-4 row-span-4 overflow-hidden bg-[var(--sand)]">
                <img src="https://images.unsplash.com/photo-1678111731954-edb244cd5880?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwyfHxzY3VscHR1cmFsJTIwbGFtcHxlbnwwfHx8fDE3ODUxNTc2MDR8MA&ixlib=rb-4.1.0&q=85" alt="Sculptural lamp" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 row-span-3 overflow-hidden bg-[var(--sand)]">
                <img src="https://images.unsplash.com/photo-1672343385650-8d5bb804580a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY3VscHR1cmV8ZW58MHx8fHwxNzg1MTU3NjA0fDA&ixlib=rb-4.1.0&q=85" alt="Sculpture" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 row-span-3 overflow-hidden bg-[var(--sand)]">
                <img src="https://images.unsplash.com/photo-1589363358751-ab05797e5629?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnfGVufDB8fHx8MTc4NTE1NzU5OHww&ixlib=rb-4.1.0&q=85" alt="Handbag" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-3 row-span-2 overflow-hidden bg-[var(--sand)]">
                <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw0fHxtaW5pbWFsaXN0JTIwZGVjb3J8ZW58MHx8fHwxNzg1MTU3NTk4fDA&ixlib=rb-4.1.0&q=85" alt="Vessel" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-3 row-span-2 overflow-hidden bg-[var(--sand)]">
                <img src="https://images.unsplash.com/photo-1667312939978-64cf31718a6e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxtaW5pbWFsaXN0JTIwZGVjb3J8ZW58MHx8fHwxNzg1MTU3NTk4fDA&ixlib=rb-4.1.0&q=85" alt="Decor" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="border-y border-[var(--sand)] py-6 overflow-hidden bg-[var(--cream)]">
        <div className="vc-marquee-track">
          {Array(2).fill(0).map((_, r) => (
            <div key={r} className="flex items-center gap-16 pr-16">
              {["Sculptural", "Sustainable", "Hand\u2011finished", "Made to Order", "One of One", "Studio Craft", "Since 2021", "Sculptural", "Sustainable", "Hand\u2011finished"].map((w, i) => (
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
