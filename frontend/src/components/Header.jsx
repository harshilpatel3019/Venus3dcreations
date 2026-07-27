import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, Search, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { LOGO_URL } from "../mock";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/shop/lamps", label: "Lamps" },
  { to: "/shop/handbags", label: "Handbags" },
  { to: "/shop/sculptures", label: "Sculptures" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[var(--espresso)] text-[var(--cream)] text-xs tracking-[0.2em] uppercase py-2.5 text-center">
        Complimentary worldwide shipping on orders above $250
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled ? "bg-[var(--cream)]/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]" : "bg-[var(--cream)]"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Venus 3D Creations" className="h-10 lg:h-12 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `text-[13px] tracking-[0.14em] uppercase vc-link-underline transition-colors ${
                    isActive ? "text-[var(--copper)]" : "text-[var(--espresso)] hover:text-[var(--copper)]"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden md:block p-2 hover:text-[var(--copper)] transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setOpen(true)}
              className="relative p-2 hover:text-[var(--copper)] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[var(--copper)] text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-[var(--cream)] lg:hidden">
            <div className="h-20 flex items-center justify-between px-6">
              <img src={LOGO_URL} alt="Venus" className="h-10" />
              <button onClick={() => setMobileOpen(false)} aria-label="Close">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col px-6 pt-8 gap-6">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  className={({ isActive }) =>
                    `text-2xl font-serif-display ${isActive ? "text-[var(--copper)]" : "text-[var(--espresso)]"}`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
