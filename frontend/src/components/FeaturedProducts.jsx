import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";

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
    <section className="py-28 lg:py-36 bg-[var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--espresso)]/60 mb-6">The Collection</p>
            <h2 className="font-serif-display font-light text-4xl lg:text-5xl leading-[1.1] text-[var(--espresso)] max-w-xl">
              Objects from the studio.
            </h2>
          </div>
          <Link to="/shop" className="text-[11px] tracking-[0.28em] uppercase text-[var(--espresso)] vc-link-underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--copper)]" /></div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {items.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
