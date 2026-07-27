import React, { useEffect, useState } from "react";
import { adminListOrders, adminUpdateOrder, imgUrl, formatINR } from "../../api";
import { Loader2, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["created", "paid", "shipped", "delivered", "cancelled", "failed"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminListOrders();
      setOrders(data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = async (id, status) => {
    try {
      const updated = await adminUpdateOrder(id, { status });
      toast.success(`Order marked ${status}`);
      setOrders((prev) => prev.map((o) => o.id === id ? updated : o));
      if (selected?.id === id) setSelected(updated);
    } catch (err) { toast.error("Update failed"); }
  };

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-serif-display text-4xl text-[var(--espresso)]">Orders</h1>
      <p className="text-sm text-[var(--espresso)]/60 mt-2">{orders.length} total orders</p>

      <div className="flex flex-wrap gap-2 mt-8">
        <button onClick={() => setFilter("all")} className={`px-4 h-10 text-xs tracking-[0.14em] uppercase border transition-colors ${filter === "all" ? "bg-[var(--espresso)] text-white border-[var(--espresso)]" : "border-[var(--sand)] hover:border-[var(--copper)]"}`}>All</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 h-10 text-xs tracking-[0.14em] uppercase border transition-colors capitalize ${filter === s ? "bg-[var(--espresso)] text-white border-[var(--espresso)]" : "border-[var(--sand)] hover:border-[var(--copper)]"}`}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--copper)]" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 text-center border border-[var(--sand)] mt-6">
          <p className="font-serif-display text-2xl">No orders in this view.</p>
        </div>
      ) : (
        <div className="mt-6 bg-white border border-[var(--sand)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/60 border-b border-[var(--sand)]">
                <th className="text-left px-6 py-3">Order</th>
                <th className="text-left px-6 py-3">Customer</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-right px-6 py-3">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} onClick={() => setSelected(o)} className="border-b border-[var(--sand)] last:border-0 hover:bg-[var(--ivory)]/50 cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="font-serif-display text-lg">#{o.id.slice(0,8).toUpperCase()}</p>
                    <p className="text-xs text-[var(--espresso)]/50">{new Date(o.created_at).toLocaleString("en-IN")}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{o.address?.full_name}</p>
                    <p className="text-xs text-[var(--espresso)]/60">{o.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-[10px] tracking-widest uppercase ${o.status === "paid" ? "bg-[var(--copper)] text-white" : o.status === "failed" ? "bg-red-100 text-red-800" : "bg-[var(--sand)]"}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-serif-display text-xl">{formatINR(o.total)}</td>
                  <td className="px-6 py-4 text-right"><ChevronRight className="w-4 h-4 text-[var(--espresso)]/40 inline" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end" onClick={() => setSelected(null)}>
          <div className="w-full max-w-xl bg-[var(--cream)] h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[var(--cream)] border-b border-[var(--sand)] px-8 py-5 flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[var(--copper)]">Order</p>
                <h2 className="font-serif-display text-2xl">#{selected.id.slice(0,8).toUpperCase()}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:text-[var(--copper)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)} className={`px-3 h-9 text-xs tracking-[0.14em] uppercase border capitalize transition-colors ${selected.status === s ? "bg-[var(--copper)] text-white border-[var(--copper)]" : "border-[var(--sand)] hover:border-[var(--copper)]"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2">Customer</p>
                <p>{selected.address.full_name}<br/><span className="text-sm text-[var(--espresso)]/60">{selected.email} · {selected.address.phone}</span></p>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2">Shipping</p>
                <p className="leading-relaxed">{selected.address.line1}{selected.address.line2 ? `, ${selected.address.line2}` : ""}<br/>{selected.address.city}, {selected.address.state} {selected.address.pincode}<br/>{selected.address.country}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-3">Items</p>
                <div className="space-y-3">
                  {selected.items.map((it, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-14 h-16 bg-[var(--sand)] overflow-hidden flex-shrink-0">{it.image && <img src={imgUrl(it.image)} alt="" className="w-full h-full object-cover" />}</div>
                      <div className="flex-1">
                        <p className="font-serif-display text-lg">{it.name}</p>
                        <p className="text-xs text-[var(--espresso)]/60">Qty {it.qty} · {formatINR(it.price)}</p>
                      </div>
                      <span>{formatINR(it.price * it.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[var(--sand)] pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[var(--espresso)]/60">Subtotal</span><span>{formatINR(selected.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--espresso)]/60">Shipping</span><span>{formatINR(selected.shipping)}</span></div>
                <div className="flex justify-between pt-2"><span className="text-xs tracking-widest uppercase">Total</span><span className="font-serif-display text-2xl">{formatINR(selected.total)}</span></div>
              </div>
              {selected.razorpay_payment_id && (
                <div className="bg-[var(--ivory)] p-4 text-xs">
                  <p className="tracking-widest uppercase text-[var(--copper)] mb-1">Razorpay</p>
                  <p className="text-[var(--espresso)]/70 break-all">Order: {selected.razorpay_order_id}<br/>Payment: {selected.razorpay_payment_id}</p>
                </div>
              )}
              {selected.notes && (
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2">Notes</p>
                  <p className="italic text-[var(--espresso)]/80">{selected.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
