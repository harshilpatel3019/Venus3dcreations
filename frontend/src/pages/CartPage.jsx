import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { imgUrl, formatINR } from "../api";

const CartPage = () => {
  const { items, updateQty, removeItem, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal >= 2500 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <main className="bg-[var(--cream)] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-4">— Your Bag</p>
        <h1 className="font-serif-display text-5xl lg:text-6xl leading-[1.05] text-[var(--espresso)]">Review your <em className="italic">selections</em></h1>

        {items.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[var(--sand)] flex items-center justify-center mb-6 mx-auto"><ShoppingBag className="w-6 h-6 text-[var(--copper)]" /></div>
            <p className="font-serif-display text-3xl">Your bag is empty.</p>
            <p className="text-[var(--espresso)]/60 mt-2 mb-8">Every piece begins with a look— let one find you.</p>
            <Link to="/shop" className="inline-flex vc-btn-copper px-8 h-12 items-center text-xs tracking-[0.2em] uppercase">Explore the shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-14">
            <div className="lg:col-span-8">
              <div className="border-t border-[var(--sand)]">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 py-6 border-b border-[var(--sand)] items-center">
                    <div className="col-span-3 sm:col-span-2"><div className="aspect-[4/5] bg-[var(--sand)] overflow-hidden"><img src={imgUrl(item.image)} alt={item.name} className="w-full h-full object-cover" /></div></div>
                    <div className="col-span-9 sm:col-span-5">
                      <p className="font-serif-display text-2xl leading-tight">{item.name}</p>
                      <button onClick={() => removeItem(item.id)} className="mt-2 text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/50 hover:text-[var(--copper)] inline-flex items-center gap-1"><X className="w-3 h-3" /> Remove</button>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <div className="flex items-center border border-[var(--sand)] w-fit">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-[var(--sand)]"><Minus className="w-3 h-3" /></button>
                        <span className="w-9 text-center text-sm">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-[var(--sand)]"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-2 text-right"><span className="font-serif-display text-xl">{formatINR(item.price * item.qty)}</span></div>
                  </div>
                ))}
              </div>
              <button onClick={clearCart} className="mt-6 text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/60 hover:text-[var(--copper)] vc-link-underline">Clear bag</button>
            </div>

            <aside className="lg:col-span-4">
              <div className="bg-[var(--ivory)] p-8 sticky top-28">
                <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--copper)] mb-6">Order summary</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--espresso)]/60">Subtotal</span><span>{formatINR(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--espresso)]/60">Shipping</span><span>{shipping === 0 ? "Complimentary" : formatINR(shipping)}</span></div>
                  {subtotal < 2500 && subtotal > 0 && (<p className="text-xs text-[var(--copper)]">Add {formatINR(2500 - subtotal)} more for free shipping.</p>)}
                  <div className="h-px bg-[var(--sand)] my-4" />
                  <div className="flex justify-between items-end"><span className="text-xs tracking-[0.14em] uppercase">Total</span><span className="font-serif-display text-2xl">{formatINR(total)}</span></div>
                </div>
                <button onClick={() => navigate("/checkout")} className="mt-8 w-full h-12 vc-btn-copper text-xs tracking-[0.2em] uppercase">Proceed to checkout</button>
                <p className="mt-4 text-xs text-[var(--espresso)]/50 text-center">Secure payment by Razorpay · UPI, Cards, Netbanking</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
