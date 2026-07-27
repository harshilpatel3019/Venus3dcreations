import React, { useState } from "react";
import { testimonials } from "../mock";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const Testimonials = () => {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const prev = () => setI((v) => (v - 1 + testimonials.length) % testimonials.length);
  const next = () => setI((v) => (v + 1) % testimonials.length);

  return (
    <section className="py-24 lg:py-32 bg-[var(--ivory)]">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-6">— In good company</p>
        <Quote className="w-10 h-10 text-[var(--copper)] mx-auto mb-8" />
        <p className="font-serif-display text-3xl md:text-4xl lg:text-5xl leading-[1.25] text-[var(--espresso)]">
          “{t.text}”
        </p>
        <div className="mt-10">
          <p className="font-serif-display text-xl text-[var(--copper)]">{t.name}</p>
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/50 mt-1">{t.role}</p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button onClick={prev} className="w-11 h-11 border border-[var(--sand)] rounded-full flex items-center justify-center hover:bg-[var(--copper)] hover:text-white hover:border-[var(--copper)] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-1 transition-all ${idx === i ? "w-8 bg-[var(--copper)]" : "w-4 bg-[var(--sand)]"}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-11 h-11 border border-[var(--sand)] rounded-full flex items-center justify-center hover:bg-[var(--copper)] hover:text-white hover:border-[var(--copper)] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
