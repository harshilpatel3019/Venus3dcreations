import React from "react";
import { Link } from "react-router-dom";
import { products } from "../mock";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = () => {
  const featured = products.slice(0, 8);
  return (
    <section className="py-24 lg:py-32 bg-[var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-4">— New Arrivals</p>
            <h2 className="font-serif-display text-5xl lg:text-6xl leading-[1.05] max-w-2xl">
              Freshly out of the <em className="italic">workshop</em>.
            </h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[var(--copper)] vc-link-underline">
            Shop all pieces <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
