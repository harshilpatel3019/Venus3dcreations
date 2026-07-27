import React from "react";
import { Link } from "react-router-dom";
import { categories } from "../mock";
import { ArrowUpRight } from "lucide-react";

const Categories = () => {
  return (
    <section className="py-24 lg:py-32 bg-[var(--ivory)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-4">— The Collections</p>
            <h2 className="font-serif-display text-5xl lg:text-6xl leading-[1.05] max-w-2xl">
              Five worlds, one <em className="italic text-[var(--copper)]">studio</em>.
            </h2>
          </div>
          <Link to="/shop" className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)] vc-link-underline inline-flex items-center gap-2">
            View all <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/shop/${cat.id}`}
              className={`group relative overflow-hidden bg-[var(--sand)] ${idx === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
            >
              <div className={`aspect-[4/5] ${idx === 0 ? "lg:aspect-[16/13]" : ""} overflow-hidden`}>
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                <p className="text-[11px] tracking-[0.25em] uppercase text-white/80 mb-2">{cat.tagline}</p>
                <div className="flex items-end justify-between gap-4">
                  <h3 className="font-serif-display text-3xl lg:text-4xl">{cat.name}</h3>
                  <div className="w-11 h-11 border border-white/50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--copper)] group-hover:border-[var(--copper)] transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
