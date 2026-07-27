import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderApi, imgUrl, formatINR } from "../api";
import { CheckCircle2, Loader2 } from "lucide-react";

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderApi(id).then(setOrder).catch(() => setOrder(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <main className="bg-[var(--cream)] min-h-[60vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--copper)]" /></main>;
  }
  if (!order) {
    return (
      <main className="bg-[var(--cream)] min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif-display text-3xl">Order not found</p>
          <Link to="/shop" className="mt-4 inline-block text-xs tracking-[0.2em] uppercase text-[var(--copper)] vc-link-underline">Back to shop</Link>
        </div>
      </main>
    );
  }

  const isPaid = order.status === "paid";

  return (
    <main className="bg-[var(--cream)] min-h-screen">
      <div className="max-w-[900px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--copper)]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[var(--copper)]" />
          </div>
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-4">{isPaid ? "— Payment received" : "— Order placed"}</p>
          <h1 className="font-serif-display text-5xl lg:text-6xl leading-[1.05] text-[var(--espresso)]">Thank you.</h1>
          <p className="mt-6 text-[var(--espresso)]/70 max-w-xl mx-auto leading-relaxed">
            Your order <span className="text-[var(--copper)] font-medium">#{order.id.slice(0, 8).toUpperCase()}</span> has been received. Every piece is made-to-order and hand-finished in our studio before it ships. You'll receive an email confirmation shortly.
          </p>
        </div>

        <div className="mt-16 bg-[var(--ivory)] p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--copper)] mb-4">Shipping to</h3>
              <p className="leading-relaxed">
                {order.address.full_name}<br/>
                {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br/>
                {order.address.city}, {order.address.state} {order.address.pincode}<br/>
                {order.address.country}<br/>
                <span className="text-[var(--espresso)]/60 text-sm">{order.address.phone}</span>
              </p>
            </div>
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--copper)] mb-4">Order details</h3>
              <p className="text-sm leading-relaxed">
                Order ID: <span className="text-[var(--espresso)] font-medium">{order.id.slice(0, 8).toUpperCase()}</span><br/>
                Status: <span className={`inline-block px-2 py-0.5 text-[10px] tracking-widest uppercase ml-1 ${isPaid ? "bg-[var(--copper)] text-white" : "bg-[var(--sand)]"}`}>{order.status}</span><br/>
                Email: {order.email}<br/>
                Total: <span className="font-serif-display text-lg text-[var(--espresso)]">{formatINR(order.total)}</span>
              </p>
            </div>
          </div>

          <div className="h-px bg-[var(--sand)] my-8" />
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-16 h-20 bg-[var(--sand)] overflow-hidden flex-shrink-0">
                  {item.image && <img src={imgUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="font-serif-display text-lg">{item.name}</p>
                  <p className="text-xs text-[var(--espresso)]/60">Qty {item.qty} · {formatINR(item.price)}</p>
                </div>
                <span className="text-sm">{formatINR(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-[var(--sand)] my-6" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[var(--espresso)]/60">Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--espresso)]/60">Shipping</span><span>{order.shipping === 0 ? "Complimentary" : formatINR(order.shipping)}</span></div>
            <div className="flex justify-between items-end pt-2"><span className="text-xs tracking-[0.14em] uppercase">Total paid</span><span className="font-serif-display text-2xl">{formatINR(order.total)}</span></div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/shop" className="inline-flex vc-btn-copper px-8 h-12 items-center text-xs tracking-[0.2em] uppercase">Continue shopping</Link>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccessPage;
