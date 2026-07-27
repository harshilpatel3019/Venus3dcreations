import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products, categories } from "../mock";
import ProductCard from "../components/ProductCard";
import { ChevronDown } from "lucide-react";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "priceAsc", label: "Price: Low to High" },
  { id: "priceDesc", label: "Price: High to Low" },
  { id: "nameAsc", label: "Name A–Z" },
];

const ShopPage = () => {
  const { category } = useParams();
  const [sort, setSort] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = category ? products.filter((p) => p.category === category) : products;
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "nameAsc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [category, sort]);

  const activeCat = categories.find((c) => c.id === category);

  return (
    <main className="bg-[var(--cream)] min-h-screen">
      {/* Page header */}
      <div className="bg-[var(--ivory)] border-b border-[var(--sand)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/50 mb-6">
            <Link to="/" className="hover:text-[var(--copper)]">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-[var(--copper)]">Shop</Link>
            {activeCat && (<><span>/</span><span className="text-[var(--copper)]">{activeCat.name}</span></>)}
          </div>
          <h1 className="font-serif-display text-5xl lg:text-7xl leading-[1.05] text-[var(--espresso)]">
            {activeCat ? <>{activeCat.name.split(" ")[0]} <em className="italic text-[var(--copper)]">{activeCat.name.split(" ").slice(1).join(" ") || ""}</em></> : <>The full <em className="italic text-[var(--copper)]">collection</em></>}
          </h1>
          <p className="mt-4 text-[var(--espresso)]/60 max-w-xl">
            {activeCat ? activeCat.tagline : "Browse every object from the studio—lamps, sculptures, handbags and home pieces."}
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        {/* Category pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            <Link
              to="/shop"
              className={`px-5 h-10 inline-flex items-center text-xs tracking-[0.14em] uppercase border transition-colors ${
                !category ? "bg-[var(--espresso)] text-white border-[var(--espresso)]" : "border-[var(--sand)] hover:border-[var(--copper)]"
              }`}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/shop/${c.id}`}
                className={`px-5 h-10 inline-flex items-center text-xs tracking-[0.14em] uppercase border transition-colors ${
                  category === c.id ? "bg-[var(--espresso)] text-white border-[var(--espresso)]" : "border-[var(--sand)] hover:border-[var(--copper)]"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-5 h-10 border border-[var(--sand)] text-xs tracking-[0.14em] uppercase hover:border-[var(--copper)]"
            >
              Sort: {SORTS.find((s) => s.id === sort).label}
              <ChevronDown className="w-3 h-3" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-12 bg-[var(--cream)] border border-[var(--sand)] shadow-lg z-10 min-w-[220px]">
                {SORTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSort(s.id); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-xs tracking-[0.1em] uppercase hover:bg-[var(--sand)] ${sort === s.id ? "text-[var(--copper)]" : ""}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/50 mb-8">
          Showing {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-serif-display text-3xl">Nothing here yet.</p>
            <p className="text-[var(--espresso)]/60 mt-2">This corner of the studio is being made. Check back soon.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ShopPage;
