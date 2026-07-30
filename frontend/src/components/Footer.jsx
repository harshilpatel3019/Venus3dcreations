import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import { LOGO_URL } from "../mock";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";

const Footer = () => {
  const onSubscribe = (e) => {
    e.preventDefault();
    const email = new FormData(e.target).get("email");
    if (!email) return;
    toast.success("Welcome to the studio\u2014 look out for our next drop.");
    e.target.reset();
  };

  return (
    <footer className="bg-[var(--espresso)] text-[var(--cream)] mt-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <img src={LOGO_URL} alt="Venus" className="h-14 w-auto bg-[var(--cream)] p-2 rounded-sm" />
            <p className="mt-6 text-[var(--cream)]/70 leading-relaxed max-w-sm">
              A studio for sculptural, 3D-printed objects — designed with imagination, crafted with technology, made to be felt.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/venus3dcreations" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-[var(--cream)]/20 flex items-center justify-center hover:bg-[var(--copper)] hover:border-[var(--copper)] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/venus3dcreations" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-[var(--cream)]/20 flex items-center justify-center hover:bg-[var(--copper)] hover:border-[var(--copper)] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="mailto:venus3dcreations@gmail.com" aria-label="Email" className="w-10 h-10 rounded-full border border-[var(--cream)]/20 flex items-center justify-center hover:bg-[var(--copper)] hover:border-[var(--copper)] transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href="tel:+918849440828" aria-label="Phone" className="w-10 h-10 rounded-full border border-[var(--cream)]/20 flex items-center justify-center hover:bg-[var(--copper)] hover:border-[var(--copper)] transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            </div>
            <div className="mt-6 text-xs text-[var(--cream)]/60 space-y-1">
              <p>Ahmedabad, India</p>
              <p><a href="mailto:venus3dcreations@gmail.com" className="hover:text-[var(--copper-light)]">venus3dcreations@gmail.com</a></p>
              <p><a href="tel:+918849440828" className="hover:text-[var(--copper-light)]">+91 88494 40828</a></p>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs tracking-[0.2em] uppercase text-[var(--copper-light)] mb-5">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop/lamps" className="vc-link-underline">Lamps</Link></li>
              <li><Link to="/shop/handbags" className="vc-link-underline">Handbags</Link></li>
              <li><Link to="/shop/sculptures" className="vc-link-underline">Sculptures</Link></li>
              <li><Link to="/shop/decor" className="vc-link-underline">Home Decor</Link></li>
              <li><Link to="/shop/custom" className="vc-link-underline">Custom</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs tracking-[0.2em] uppercase text-[var(--copper-light)] mb-5">Studio</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="vc-link-underline">About</Link></li>
              <li><Link to="/contact" className="vc-link-underline">Contact</Link></li>
              <li><a href="#" className="vc-link-underline">Care Guide</a></li>
              <li><a href="#" className="vc-link-underline">Shipping</a></li>
              <li><a href="#" className="vc-link-underline">Returns</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs tracking-[0.2em] uppercase text-[var(--copper-light)] mb-5">The Studio Letter</h4>
            <p className="text-sm text-[var(--cream)]/70 mb-4">
              New collections, studio notes, and early access to limited pieces.
            </p>
            <form onSubmit={onSubscribe} className="flex gap-2">
              <Input
                name="email"
                type="email"
                required
                placeholder="Your email"
                className="bg-transparent border-[var(--cream)]/30 text-[var(--cream)] placeholder:text-[var(--cream)]/40 h-11 rounded-none focus-visible:ring-[var(--copper)]"
              />
              <Button type="submit" className="h-11 rounded-none px-5 vc-btn-copper">
                <Mail className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-[var(--cream)]/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--cream)]/50">
          <p>© {new Date().getFullYear()} Venus 3D Creations. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--copper-light)]">Privacy</a>
            <a href="#" className="hover:text-[var(--copper-light)]">Terms</a>
            <a href="#" className="hover:text-[var(--copper-light)]">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
