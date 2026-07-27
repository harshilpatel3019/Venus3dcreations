import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { myOrdersApi, formatINR } from "../api";
import { Loader2, LogOut, Package, ShieldCheck } from "lucide-react";

const AccountPage = () => {
  const { user, loading, logout, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [oLoading, setOLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login", { state: { from: "/account" } });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    myOrdersApi()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setOLoading(false));
  }, [user]);

  if (loading || !user) {
    return <main className="bg-[var(--cream)] min-h-[60vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--copper)]" /></main>;
  }

  return (
    <main className="bg-[var(--cream)] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-16">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-4">— My account</p>
        <h1 className="font-serif-display text-5xl lg:text-6xl leading-[1.05] text-[var(--espresso)]">Hello, <em className="italic">{user.name.split(" ")[0]}</em>.</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-14">
          <aside className="lg:col-span-4">
            <div className="bg-[var(--ivory)] p-8">
              <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--copper)] mb-4">Profile</h3>
              <p className="font-serif-display text-2xl">{user.name}</p>
              <p className="text-sm text-[var(--espresso)]/70 mt-1">{user.email}</p>
              {user.phone && <p className="text-sm text-[var(--espresso)]/70">{user.phone}</p>}
              <div className="mt-8 space-y-3">
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[var(--copper)] vc-link-underline"><ShieldCheck className="w-4 h-4" /> Admin Studio</Link>
                )}
                <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/60 hover:text-[var(--copper)]"><LogOut className="w-4 h-4" /> Sign out</button>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <h2 className="font-serif-display text-3xl text-[var(--espresso)] mb-6">Your orders</h2>
            {oLoading ? (
              <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--copper)]" /></div>
            ) : orders.length === 0 ? (
              <div className="bg-[var(--ivory)] p-12 text-center">
                <Package className="w-8 h-8 text-[var(--copper)] mx-auto mb-4" />
                <p className="font-serif-display text-2xl">No orders yet.</p>
                <p className="text-sm text-[var(--espresso)]/60 mt-2 mb-6">When your first piece is on its way, it will appear here.</p>
                <Link to="/shop" className="inline-flex vc-btn-copper px-8 h-11 items-center text-xs tracking-[0.2em] uppercase">Explore the shop</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <Link to={`/order/${o.id}`} key={o.id} className="block bg-[var(--ivory)] p-6 hover:bg-[var(--sand)]/50 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/50">Order #{o.id.slice(0, 8).toUpperCase()}</p>
                        <p className="font-serif-display text-xl mt-1">{o.items.length} {o.items.length === 1 ? "piece" : "pieces"}</p>
                        <p className="text-xs text-[var(--espresso)]/60 mt-1">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 text-[10px] tracking-widest uppercase ${o.status === "paid" ? "bg-[var(--copper)] text-white" : "bg-[var(--sand)]"}`}>{o.status}</span>
                        <p className="font-serif-display text-2xl mt-2">{formatINR(o.total)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountPage;
