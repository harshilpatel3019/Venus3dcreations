import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, imgUrl, formatINR } from "../api";
import ProductCard from "./ProductCard";
import { ArrowRight, Loader2 } from "lucide-react";

const FeaturedProducts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ featured: true })
      .then((data) => setItems(data.slice(0, 8)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-[var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-4">— New Arrivals</p>
            <h2 className="font-serif-display text-5xl lg:text-6xl leading-[1.05] max-w-2xl">Freshly out of the <em className="italic">workshop</em>.</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[var(--copper)] vc-link-underline">
            Shop all pieces <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--copper)]" /></div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {items.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
