import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import { LOGO_URL } from "../mock";

const Footer = () => {
  return (
    <footer className="bg-[var(--espresso)] text-[var(--cream)] mt-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <img src={LOGO_URL} alt="Venus" className="h-10 w-auto bg-[var(--cream)] p-1.5 rounded-sm" />
            <div className="mt-6 text-sm text-[var(--cream)]/55 leading-[1.9] space-y-1 tracking-wide">
              <p>Ahmedabad, India</p>
              <p><a href="mailto:venus3dcreations@gmail.com" className="hover:text-[var(--cream)]">venus3dcreations@gmail.com</a></p>
              <p><a href="tel:+918849440828" className="hover:text-[var(--cream)]">+91 88494 40828</a></p>
            </div>
          </div>

          <div className="md:col-span-3">
            <ul className="space-y-3 text-sm text-[var(--cream)]/70">
              <li><Link to="/shop" className="vc-link-underline">Shop</Link></li>
              <li><Link to="/about" className="vc-link-underline">About</Link></li>
              <li><Link to="/contact" className="vc-link-underline">Contact</Link></li>
              <li><Link to="/policies/shipping" className="vc-link-underline">Shipping</Link></li>
              <li><Link to="/policies/refunds" className="vc-link-underline">Refunds</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="flex gap-3">
              <a href="https://www.instagram.com/venus3dcreations" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-[var(--cream)]/15 flex items-center justify-center hover:border-[var(--cream)]/40 transition-colors">
                <Instagram className="w-4 h-4" strokeWidth={1.25} />
              </a>
              <a href="https://www.facebook.com/venus3dcreations" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-[var(--cream)]/15 flex items-center justify-center hover:border-[var(--cream)]/40 transition-colors">
                <Facebook className="w-4 h-4" strokeWidth={1.25} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--cream)]/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-[var(--cream)]/40">
          <p>© {new Date().getFullYear()} Venus 3D Creations</p>
          <div className="flex gap-6">
            <Link to="/policies/privacy" className="hover:text-[var(--cream)]/70">Privacy</Link>
            <Link to="/policies/terms" className="hover:text-[var(--cream)]/70">Terms</Link>
            <Link to="/policies/refunds" className="hover:text-[var(--cream)]/70">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
