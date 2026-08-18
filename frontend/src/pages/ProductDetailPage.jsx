import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { Minus, Plus, ChevronRight, Loader2, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { fetchProduct, fetchProducts, imgUrl, formatINR } from "../api";
import { trackViewItem } from "../analytics";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProduct(id)
      .then(async (p) => {
        setProduct(p);
        try { trackViewItem(p); } catch (e) {}
        const all = await fetchProducts({ category: p.category });
        setRelated(all.filter((x) => x.id !== p.id).slice(0, 4));
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="bg-[var(--cream)] min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--copper)]" />
      </main>
    );
  }

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

  const firstImg = product.images?.[0];

  const onAdd = () => { addItem(product, qty); toast.success(`${product.name} added to bag`); };
  const onBuy = () => { addItem(product, qty); navigate("/cart"); };

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
          <div>
            <div className="aspect-[4/5] bg-[var(--sand)] overflow-hidden">
              <img src={imgUrl(firstImg)} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-3">
                {product.images.map((src, i) => (
                  <div key={i} className={`aspect-square overflow-hidden bg-[var(--sand)] cursor-pointer border-2 ${i === 0 ? "border-[var(--copper)]" : "border-transparent"}`}>
                    <img src={imgUrl(src)} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:pt-6">
            {product.tag && (
              <span className="inline-block bg-[var(--espresso)] text-[var(--cream)] text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 mb-6">{product.tag}</span>
            )}
            {product.series && (
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--copper)] mb-3">{product.series}</p>
            )}
            <h1 className="font-serif-display text-5xl lg:text-6xl leading-[1.05] text-[var(--espresso)]">{product.name}</h1>
            <p className="font-serif-display text-3xl mt-6 text-[var(--espresso)]">{formatINR(product.price)}</p>
            <p className="mt-6 text-[var(--espresso)]/70 leading-relaxed">{product.description}</p>

            <div className="mt-8 space-y-3 text-sm">
              {product.material && (
                <div className="flex gap-3"><span className="text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/50 w-28">Material</span><span>{product.material}</span></div>
              )}
              {product.dimensions && (
                <div className="flex gap-3"><span className="text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/50 w-28">Dimensions</span><span>{product.dimensions}</span></div>
              )}
              {product.lead_time && (
                <div className="flex gap-3"><span className="text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/50 w-28">Lead time</span><span>{product.lead_time}</span></div>
              )}
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex items-center border border-[var(--sand)] h-12">
                <button onClick={() => setQty((v) => Math.max(1, v - 1))} className="w-11 h-full flex items-center justify-center hover:bg-[var(--sand)]"><Minus className="w-3 h-3" strokeWidth={1.25} /></button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button onClick={() => setQty((v) => v + 1)} className="w-11 h-full flex items-center justify-center hover:bg-[var(--sand)]"><Plus className="w-3 h-3" strokeWidth={1.25} /></button>
              </div>
              <button onClick={onAdd} className="flex-1 h-12 vc-btn-ghost text-[11px] tracking-[0.28em] uppercase">Add to bag</button>
            </div>
            <button onClick={onBuy} className="mt-3 w-full h-12 vc-btn-copper text-[11px] tracking-[0.28em] uppercase">Buy now</button>

            <div className="mt-8 text-xs text-[var(--espresso)]/60 space-y-1.5">
              <p>Ships across India · Made to order · 14-day returns</p>
              <button onClick={() => setInfoOpen(true)} className="text-[var(--espresso)]/70 hover:text-[var(--copper)] vc-link-underline">Shipping &amp; returns</button>
            </div>
          </div>
        </div>

        {infoOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-6" onClick={() => setInfoOpen(false)}>
            <div className="bg-[var(--cream)] max-w-lg w-full p-10 relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setInfoOpen(false)} className="absolute top-4 right-4 p-2 hover:text-[var(--copper)]"><X className="w-4 h-4" strokeWidth={1.25} /></button>
              <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--espresso)]/60 mb-4">Shipping &amp; Returns</p>
              <div className="space-y-5 text-sm text-[var(--espresso)]/75 leading-[1.9]">
                <div>
                  <p className="font-serif-display text-xl text-[var(--espresso)]">Shipping</p>
                  <p>Every piece is made to order in our Ahmedabad studio and ships anywhere in India within the lead time noted above. Complimentary shipping on orders above ₹2,500. Below that, a flat ₹99 courier charge applies.</p>
                </div>
                <div>
                  <p className="font-serif-display text-xl text-[var(--espresso)]">Returns</p>
                  <p>If a piece arrives with any damage from transit, contact us within 14 days for a replacement or refund. Made-to-order and custom pieces are otherwise non-returnable.</p>
                </div>
                <div>
                  <p className="font-serif-display text-xl text-[var(--espresso)]">Care</p>
                  <p>Dust with a soft dry cloth. Avoid direct sunlight and moisture. Use only warm LED bulbs.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif-display text-3xl lg:text-4xl text-[var(--espresso)] mb-10">You may also love</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {related.map((p) => (<ProductCard key={p.id} product={p} />))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetailPage;
