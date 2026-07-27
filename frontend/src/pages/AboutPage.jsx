import React from "react";
import { Link } from "react-router-dom";
import { processSteps } from "../mock";
import { ArrowRight } from "lucide-react";

const values = [
  { t: "Craft over speed", d: "We’d rather print 12 pieces beautifully than 1200 quickly. Every object leaves the studio hand-inspected." },
  { t: "Design forever", d: "We build for permanence. No trends, no plastic feel—just objects that age gracefully in real homes." },
  { t: "Kinder materials", d: "Plant-based PLA, recycled composites and reusable packaging. Additive by nature, mindful by choice." },
];

const AboutPage = () => {
  return (
    <main className="bg-[var(--cream)]">
      {/* Hero */}
      <section className="bg-[var(--ivory)] py-24 lg:py-36">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-6">— Our Story</p>
          <h1 className="font-serif-display text-6xl lg:text-8xl leading-[1.02] text-[var(--espresso)] max-w-4xl">
            A studio for <em className="italic text-[var(--copper)]">sculptural</em> objects.
          </h1>
          <p className="mt-10 text-lg text-[var(--espresso)]/70 leading-relaxed max-w-2xl">
            Venus 3D Creations began as a quiet experiment—a designer, a machine and a single lamp printed overnight. Four years on, it has become a studio of makers who see additive manufacturing as a modern craft.
          </p>
        </div>
      </section>

      {/* Image */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 -mt-10 lg:-mt-16">
        <div className="aspect-[16/9] overflow-hidden bg-[var(--sand)]">
          <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw0fHxtaW5pbWFsaXN0JTIwZGVjb3J8ZW58MHx8fHwxNzg1MTU3NTk4fDA&ixlib=rb-4.1.0&q=85" alt="Studio" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Story */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)]">Founded 2021</p>
            <div className="md:col-span-2 space-y-6 text-[var(--espresso)]/80 leading-relaxed text-lg">
              <p>We work between algorithm and atelier. A form begins as a parametric sketch, then goes through weeks of iteration on paper, on-screen and in resin before it is ever printed at scale.</p>
              <p>Every finished piece is sanded, sealed and hand-polished in our workshop. Some of our objects carry small studio marks—they are not flaws, they are proof of a hand.</p>
              <p>We believe 3D printing deserves the reverence given to ceramics, glass or metal. So we don’t make products. We make objects—sculptural, personal, made to last a long time in a real home.</p>
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
              <div key={i} className="border-t border-[var(--sand)] pt-6">
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
