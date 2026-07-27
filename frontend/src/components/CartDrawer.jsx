import React from "react";
import { Link } from "react-router-dom";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";
import { imgUrl, formatINR } from "../api";

const CartDrawer = () => {
  const { items, open, setOpen, updateQty, removeItem, subtotal } = useCart();

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setOpen(false)} />
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-[var(--cream)] z-50 shadow-2xl transform transition-transform duration-500 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 h-20 border-b border-[var(--sand)]">
            <h3 className="text-lg tracking-[0.14em] uppercase">Your Bag ({items.length})</h3>
            <button onClick={() => setOpen(false)} className="p-2 hover:text-[var(--copper)]"><X className="w-5 h-5" /></button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--sand)] flex items-center justify-center mb-5"><ShoppingBag className="w-6 h-6 text-[var(--copper)]" /></div>
              <p className="font-serif-display text-2xl mb-2">Your bag is empty</p>
              <p className="text-sm text-[var(--espresso)]/60 mb-6">Let a piece find you.</p>
              <Button onClick={() => setOpen(false)} asChild className="vc-btn-copper rounded-none px-8 h-11">
                <Link to="/shop">Explore the shop</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-28 bg-[var(--sand)] overflow-hidden flex-shrink-0">
                      <img src={imgUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-serif-display text-lg leading-tight">{item.name}</p>
                        <p className="text-sm text-[var(--espresso)]/60 mt-1">{formatINR(item.price)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-[var(--sand)]">
                          <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--sand)]"><Minus className="w-3 h-3" /></button>
                          <span className="w-8 text-center text-sm">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--sand)]"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-xs uppercase tracking-widest text-[var(--espresso)]/50 hover:text-[var(--copper)]">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--sand)] px-6 py-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm tracking-[0.14em] uppercase">Subtotal</span>
                  <span className="font-serif-display text-xl">{formatINR(subtotal)}</span>
                </div>
                <p className="text-xs text-[var(--espresso)]/50">Shipping calculated at checkout.</p>
                <Button asChild className="w-full h-12 vc-btn-copper rounded-none tracking-[0.14em] uppercase text-xs">
                  <Link to="/cart" onClick={() => setOpen(false)}>Proceed to Checkout</Link>
                </Button>
                <button onClick={() => setOpen(false)} className="w-full text-center text-xs tracking-widest uppercase text-[var(--espresso)]/60 hover:text-[var(--copper)]">Continue shopping</button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
