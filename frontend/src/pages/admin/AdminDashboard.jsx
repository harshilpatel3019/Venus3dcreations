import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminStats, adminListOrders, formatINR } from "../../api";
import { Loader2, Package, Receipt, TrendingUp, ShoppingCart } from "lucide-react";

const StatCard = ({ Icon, label, value, hint }) => (
  <div className="bg-white p-6 border border-[var(--sand)]">
    <div className="flex items-center justify-between">
      <p className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/50">{label}</p>
      <Icon className="w-4 h-4 text-[var(--copper)]" />
    </div>
    <p className="font-serif-display text-4xl mt-4 text-[var(--espresso)]">{value}</p>
    {hint && <p className="text-xs text-[var(--espresso)]/50 mt-2">{hint}</p>}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminStats(), adminListOrders()])
      .then(([s, o]) => { setStats(s); setOrders(o.slice(0, 5)); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--copper)]" /></div>;

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-serif-display text-4xl text-[var(--espresso)]">Dashboard</h1>
      <p className="text-sm text-[var(--espresso)]/60 mt-2">A quick look at what's happening in the studio.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard Icon={Package} label="Products" value={stats.products} />
        <StatCard Icon={ShoppingCart} label="Total orders" value={stats.orders} />
        <StatCard Icon={Receipt} label="Paid orders" value={stats.paid_orders} />
        <StatCard Icon={TrendingUp} label="Revenue" value={formatINR(stats.revenue)} hint="From paid orders" />
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif-display text-2xl text-[var(--espresso)]">Recent orders</h2>
          <Link to="/admin/orders" className="text-xs tracking-[0.14em] uppercase text-[var(--copper)] vc-link-underline">View all</Link>
        </div>
        {orders.length === 0 ? (
          <div className="bg-white p-12 text-center border border-[var(--sand)]">
            <p className="font-serif-display text-2xl">No orders yet.</p>
            <p className="text-sm text-[var(--espresso)]/60 mt-2">When customers start ordering, they'll appear here.</p>
          </div>
        ) : (
          <div className="bg-white border border-[var(--sand)]">
            <table className="w-full">
              <thead>
                <tr className="text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/60 border-b border-[var(--sand)]">
                  <th className="text-left px-6 py-3">Order</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-right px-6 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-[var(--sand)] last:border-0">
                    <td className="px-6 py-4">
                      <p className="font-serif-display text-lg">#{o.id.slice(0,8).toUpperCase()}</p>
                      <p className="text-xs text-[var(--espresso)]/50">{new Date(o.created_at).toLocaleString("en-IN")}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{o.address?.full_name}</p>
                      <p className="text-xs text-[var(--espresso)]/60">{o.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-[10px] tracking-widest uppercase ${o.status === "paid" ? "bg-[var(--copper)] text-white" : "bg-[var(--sand)]"}`}>{o.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-serif-display text-xl">{formatINR(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
