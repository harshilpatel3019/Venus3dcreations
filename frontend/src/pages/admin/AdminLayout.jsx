import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Package, Receipt, LogOut, Loader2, ExternalLink } from "lucide-react";
import { LOGO_URL } from "../../mock";

const AdminLayout = () => {
  const { user, loading, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login", { state: { from: "/admin" } });
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading || !user || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--espresso)]"><Loader2 className="w-6 h-6 animate-spin text-[var(--copper)]" /></div>;
  }

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-sm tracking-[0.05em] transition-colors ${
      isActive ? "bg-[var(--copper)] text-white" : "text-[var(--cream)]/70 hover:text-[var(--cream)] hover:bg-white/5"
    }`;

  return (
    <div className="min-h-screen bg-[var(--ivory)] flex">
      <aside className="w-64 bg-[var(--espresso)] text-[var(--cream)] flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="block">
            <img src={LOGO_URL} alt="Venus" className="h-10 w-auto bg-[var(--cream)] p-1.5 rounded-sm" />
          </Link>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--copper-light)] mt-3">Studio Admin</p>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          <NavLink to="/admin" end className={linkCls}><LayoutDashboard className="w-4 h-4" /> Dashboard</NavLink>
          <NavLink to="/admin/products" className={linkCls}><Package className="w-4 h-4" /> Products</NavLink>
          <NavLink to="/admin/orders" className={linkCls}><Receipt className="w-4 h-4" /> Orders</NavLink>
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" className="flex items-center gap-2 text-xs text-[var(--cream)]/60 hover:text-[var(--copper-light)]"><ExternalLink className="w-3 h-3" /> View site</Link>
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 text-xs text-[var(--cream)]/60 hover:text-[var(--copper-light)]"><LogOut className="w-3 h-3" /> Sign out</button>
          <p className="text-[10px] text-[var(--cream)]/40 pt-2">Signed in as<br/><span className="text-[var(--cream)]/70">{user.email}</span></p>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
