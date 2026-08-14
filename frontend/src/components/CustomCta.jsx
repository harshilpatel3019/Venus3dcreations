import React from "react";
import { Link } from "react-router-dom";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const CustomCta = () => {
  return (
    <section className="py-28 lg:py-40 bg-[var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[540px]">
            <img src={`${BACKEND}/api/static/products/studio-03.jpg`} alt="Custom commission" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="px-2 py-14 lg:p-20 flex flex-col justify-center">
            <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--espresso)]/60 mb-8">Custom Commissions</p>
            <h3 className="font-serif-display font-light text-3xl lg:text-4xl leading-[1.2] text-[var(--espresso)] max-w-md">
              Have something in mind we haven’t made yet?
            </h3>
            <p className="mt-8 text-[var(--espresso)]/60 leading-[1.9] max-w-md tracking-wide">
              From heirloom sculptures to bespoke lighting, our studio takes on a limited number of commissions each month. Share a reference or an idea — we’ll respond within 48 hours.
            </p>
            <div className="mt-10">
              <Link to="/contact" className="vc-btn-ghost inline-flex items-center h-12 px-10 text-[11px] tracking-[0.28em] uppercase">
                Start a commission
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomCta;
