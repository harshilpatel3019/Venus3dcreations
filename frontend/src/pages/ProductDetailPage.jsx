import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "../mock";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { Minus, Plus, Truck, ShieldCheck, RefreshCcw, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const { addItem, setOpen } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <main className="bg-[var(--cream)] min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif-display text-4xl">Piece not found</p>
          <Link to="/shop" className="mt-4 inline-block text-xs tracking-[0.2em] uppercase text-[var(--copper)] vc-link-underline">Back to shop</Link>
        </div>
      </main>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const onAdd = () => {
    addItem(product, qty);
    toast.success(`${product.name} added to bag`);
  };
  const onBuy = () => {
    addItem(product, qty);
    navigate("/cart");
  };

  return (
    <main className="bg-[var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-8 lg:pt-12">
        <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/50">
          <Link to="/" className="hover:text-[var(--copper)]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-[var(--copper)]">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/shop/${product.category}`} className="hover:text-[var(--copper)] capitalize">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--copper)]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Gallery */}
          <div>
            <div className="aspect-[4/5] bg-[var(--sand)] overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {[product.image, product.image, product.image, product.image].map((src, i) => (
                <div key={i} className={`aspect-square overflow-hidden bg-[var(--sand)] cursor-pointer border-2 ${i === 0 ? "border-[var(--copper)]" : "border-transparent"}`}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:pt-6">
            {product.tag && (
              <span className="inline-block bg-[var(--espresso)] text-[var(--cream)] text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 mb-6">
                {product.tag}
              </span>
            )}
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--copper)] mb-3 capitalize">{product.category}</p>
            <h1 className="font-serif-display text-5xl lg:text-6xl leading-[1.05] text-[var(--espresso)]">{product.name}</h1>
            <p className="font-serif-display text-3xl mt-6 text-[var(--espresso)]">${product.price.toFixed(2)}</p>
            <p className="mt-6 text-[var(--espresso)]/70 leading-relaxed">{product.description}</p>

            <div className="mt-8 space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/50 w-28">Material</span>
                <span>{product.material}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/50 w-28">Dimensions</span>
                <span>{product.dimensions}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/50 w-28">Lead time</span>
                <span>{product.leadTime}</span>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex items-center border border-[var(--sand)] h-12">
                <button onClick={() => setQty((v) => Math.max(1, v - 1))} className="w-11 h-full flex items-center justify-center hover:bg-[var(--sand)]">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button onClick={() => setQty((v) => v + 1)} className="w-11 h-full flex items-center justify-center hover:bg-[var(--sand)]">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button onClick={onAdd} className="flex-1 h-12 vc-btn-copper text-xs tracking-[0.2em] uppercase">
                Add to bag
              </button>
            </div>
            <button onClick={onBuy} className="mt-3 w-full h-12 border border-[var(--espresso)] text-[var(--espresso)] text-xs tracking-[0.2em] uppercase hover:bg-[var(--espresso)] hover:text-[var(--cream)] transition-colors">
              Buy now
            </button>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[var(--sand)] pt-8">
              {[
                { Icon: Truck, t: "Worldwide shipping" },
                { Icon: ShieldCheck, t: "Studio warranty" },
                { Icon: RefreshCcw, t: "14-day returns" },
              ].map(({ Icon, t }, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <Icon className="w-5 h-5 text-[var(--copper)]" />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--espresso)]/60">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif-display text-3xl lg:text-4xl text-[var(--espresso)] mb-10">You may also love</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetailPage;
