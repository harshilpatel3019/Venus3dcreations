import React from "react";
import { Link } from "react-router-dom";
import { processSteps } from "../mock";
import { ArrowRight } from "lucide-react";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const values = [
  { t: "Craft with intent", d: "Every form starts with imagination, then blends with technology. We make objects meant to be felt, not just seen." },
  { t: "Design that lasts", d: "No trends, no plastic feel. We design pieces that grow into a home, adding personality and warmth over years, not seasons." },
  { t: "Kinder materials", d: "Eco-friendly PLA, mindful production and energy-efficient printing. Beautiful design shouldn't come at the planet's expense." },
];

const AboutPage = () => {
  return (
    <main className="bg-[var(--cream)]">
      {/* Hero */}
      <section className="bg-[var(--ivory)] py-24 lg:py-36">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-6">— Our Story</p>
          <h1 className="font-serif-display text-6xl lg:text-8xl leading-[1.02] text-[var(--espresso)] max-w-4xl">
            Design you can <em className="italic text-[var(--copper)]">feel</em>.
          </h1>
          <p className="mt-10 text-lg text-[var(--espresso)]/70 leading-relaxed max-w-2xl">
            At Venus 3D Creations, we believe design is more than something you see — it's something you feel. We blend imagination with technology to create pieces that bring warmth, character, and art into everyday spaces.
          </p>
        </div>
      </section>

      {/* Image */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 -mt-10 lg:-mt-16">
        <div className="aspect-[16/9] overflow-hidden bg-[var(--sand)]">
          <img src={`${BACKEND}/api/static/products/studio-01.jpg`} alt="Venus 3D Creations Studio" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Story */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)]">Founded 2025 · Ahmedabad</p>
            <div className="md:col-span-2 space-y-6 text-[var(--espresso)]/80 leading-relaxed text-lg">
              <p>We specialize in 3D printed lamps, sculptures and décor pieces that are as functional as they are beautiful. Every lamp is crafted to do more than light a room — it sets a mood and tells a story. Our sculptures turn simple corners into conversation pieces, adding personality and artistry to any home.</p>
              <p>Beyond our signature collections, we offer DIY kits for those who love to create with their own hands, along with custom-designed pieces tailored to your vision — whether it's a one-of-a-kind gift, a personalized home accent, or a design made just for you.</p>
              <p>Sustainability sits at the heart of everything we make. We choose eco-friendly materials and energy-efficient solutions, because beautiful design shouldn't come at the planet's expense.</p>
              <p className="italic text-[var(--copper)]">Every piece from Venus 3D Creations is made with care, precision, and a little bit of magic — crafted not just to fill a space, but to inspire it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[var(--ivory)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-6">— What we believe</p>
          <h2 className="font-serif-display text-5xl lg:text-6xl leading-[1.05] max-w-2xl">Three principles hold the studio together.</h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((v, i) => (
              <div key={v.t} className="border-t border-[var(--sand)] pt-6">
                <p className="font-serif-display text-2xl text-[var(--copper)]">0{i + 1}</p>
                <h3 className="font-serif-display text-3xl mt-3">{v.t}</h3>
                <p className="mt-4 text-[var(--espresso)]/70 leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-6">— The Process</p>
          <h2 className="font-serif-display text-5xl lg:text-6xl leading-[1.05] max-w-2xl">From sketch to shelf.</h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((s) => (
              <div key={s.n}>
                <p className="font-serif-display text-6xl text-[var(--copper)]/40">{s.n}</p>
                <h4 className="font-serif-display text-2xl mt-4">{s.title}</h4>
                <p className="mt-3 text-sm text-[var(--espresso)]/70 leading-relaxed">{s.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="bg-[var(--espresso)] text-[var(--cream)] px-8 py-16 lg:p-20 text-center">
            <h3 className="font-serif-display text-4xl lg:text-5xl max-w-3xl mx-auto">Ready to bring home a piece of the studio?</h3>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              <Link to="/shop" className="inline-flex items-center gap-2 vc-btn-copper px-8 h-12 text-xs tracking-[0.2em] uppercase">
                Explore the shop <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="text-xs tracking-[0.2em] uppercase text-[var(--cream)] vc-link-underline">Commission a piece</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
