import React from "react";
import { Link } from "react-router-dom";
import { processSteps } from "../mock";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const AboutSection = () => {
  return (
    <section className="py-28 lg:py-40 bg-[var(--espresso)] text-[var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-24 items-center">
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={`${BACKEND}/api/static/products/studio-01.jpg`} alt="Studio" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--cream)]/50 mb-8">The Studio</p>
            <h2 className="font-serif-display font-light text-4xl lg:text-5xl leading-[1.15]">
              Design is more than something you see. It's something you <em className="italic text-[var(--copper-light)]">feel</em>.
            </h2>
            <p className="mt-10 text-[var(--cream)]/60 leading-[1.9] max-w-xl tracking-wide">
              At Venus 3D Creations, we blend imagination with technology to make pieces that bring warmth, character and art into everyday spaces. Every lamp does more than light a room — it sets a mood and tells a story.
            </p>

            <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10">
              {processSteps.map((s) => (
                <div key={s.n}>
                  <p className="text-[10px] tracking-[0.35em] text-[var(--cream)]/40">{s.n}</p>
                  <h4 className="font-serif-display font-light text-xl mt-3">{s.title}</h4>
                  <p className="text-sm text-[var(--cream)]/55 mt-3 leading-[1.9]">{s.copy}</p>
                </div>
              ))}
            </div>

            <Link to="/about" className="mt-14 inline-block text-[11px] tracking-[0.28em] uppercase text-[var(--cream)]/80 vc-link-underline">
              Read the studio story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
