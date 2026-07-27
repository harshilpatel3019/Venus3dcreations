import React from "react";
import { Link } from "react-router-dom";
import { processSteps } from "../mock";
import { ArrowRight } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-[var(--espresso)] text-[var(--cream)] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1691957713140-a9a042252202?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBzY3VscHR1cmV8ZW58MHx8fHwxNzg1MTU3NjA0fDA&ixlib=rb-4.1.0&q=85" alt="Studio" className="w-full h-full object-cover" />
              <div className="absolute -bottom-6 -right-6 hidden lg:block bg-[var(--copper)] text-white px-8 py-6">
                <p className="font-serif-display text-4xl leading-none">04</p>
                <p className="text-[10px] tracking-[0.25em] uppercase mt-1">Years of craft</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper-light)] mb-6">— The Studio</p>
            <h2 className="font-serif-display text-4xl lg:text-6xl leading-[1.05]">
              We treat every print as a <em className="italic text-[var(--copper-light)]">first draft</em>— then finish it by hand.
            </h2>
            <p className="mt-8 text-[var(--cream)]/70 leading-relaxed max-w-xl">
              Venus was founded on a simple belief—that additive manufacturing deserves the same reverence given to ceramics, glass and metal. Our studio is a hybrid of algorithm and atelier.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-8">
              {processSteps.map((s) => (
                <div key={s.n} className="border-t border-[var(--cream)]/15 pt-5">
                  <p className="text-xs tracking-[0.2em] text-[var(--copper-light)]">{s.n}</p>
                  <h4 className="font-serif-display text-2xl mt-2">{s.title}</h4>
                  <p className="text-sm text-[var(--cream)]/60 mt-2 leading-relaxed">{s.copy}</p>
                </div>
              ))}
            </div>

            <Link to="/about" className="mt-12 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[var(--copper-light)] vc-link-underline">
              Read the studio story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
