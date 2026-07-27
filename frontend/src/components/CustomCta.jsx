import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CustomCta = () => {
  return (
    <section className="py-24 lg:py-32 bg-[var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="relative overflow-hidden bg-[var(--sand)]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
              <img src="https://images.pexels.com/photos/5793642/pexels-photo-5793642.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Custom commission" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-5">— Custom commissions</p>
              <h3 className="font-serif-display text-4xl lg:text-5xl leading-[1.1] text-[var(--espresso)]">
                Have something in mind we haven’t made yet?
              </h3>
              <p className="mt-6 text-[var(--espresso)]/70 leading-relaxed max-w-md">
                From heirloom busts to bespoke lighting, our studio takes on a limited number of custom commissions each month. Share a reference, a sketch, or an idea and we’ll respond within 48 hours.
              </p>
              <div className="mt-8">
                <Link to="/contact" className="inline-flex items-center gap-2 vc-btn-copper px-8 h-12 text-xs tracking-[0.2em] uppercase">
                  Start a commission <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomCta;
