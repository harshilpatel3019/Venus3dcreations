import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Shared layout for all policy pages. Elegant, minimal, on-brand.
 * Keeps the content column narrow and readable.
 */
const PolicyLayout = ({ eyebrow, title, updated, children }) => {
  const { pathname } = useLocation();
  const tabs = [
    { to: "/policies/shipping", label: "Shipping" },
    { to: "/policies/refunds", label: "Refunds" },
    { to: "/policies/privacy", label: "Privacy" },
    { to: "/policies/terms", label: "Terms" },
  ];

  return (
    <main className="bg-[var(--cream)] min-h-screen">
      <section className="bg-[var(--ivory)] py-20 lg:py-28 border-b border-[var(--sand)]">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10">
          <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--copper)] mb-5">{eyebrow}</p>
          <h1 className="font-serif-display font-light text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-[var(--espresso)]">
            {title}
          </h1>
          {updated && (
            <p className="mt-6 text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/50">
              Last updated {updated}
            </p>
          )}
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-6 lg:px-10 pt-10">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={`px-5 h-9 inline-flex items-center text-[11px] tracking-[0.2em] uppercase border transition-colors ${
                pathname === t.to
                  ? "bg-[var(--espresso)] text-white border-[var(--espresso)]"
                  : "border-[var(--sand)] hover:border-[var(--copper)]"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      <article className="max-w-[900px] mx-auto px-6 lg:px-10 py-14 lg:py-20 text-[var(--espresso)]/80 leading-[1.9] tracking-wide space-y-8">
        {children}
      </article>
    </main>
  );
};

export const PolicySection = ({ title, children }) => (
  <section>
    <h2 className="font-serif-display font-light text-2xl lg:text-3xl text-[var(--espresso)] mb-4">{title}</h2>
    <div className="space-y-4 text-[15px]">{children}</div>
  </section>
);

export default PolicyLayout;
