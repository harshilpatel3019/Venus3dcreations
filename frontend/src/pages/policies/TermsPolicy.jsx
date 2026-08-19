import React from "react";
import PolicyLayout, { PolicySection } from "./PolicyLayout";

const TermsPolicy = () => (
  <PolicyLayout eyebrow="Policies" title="Terms & Conditions" updated="August 2026">
    <p className="text-lg">By using venus3dcreations.com or placing an order, you agree to the following terms. Please read them before you check out.</p>

    <PolicySection title="About us">
      <p>Venus 3D Creations is a small design studio based in Ahmedabad, Gujarat, India. We design and produce sculptural, 3D-printed lamps, sculptures, décor pieces and custom commissions.</p>
      <p>Studio contact: <a href="mailto:venus3dcreations@gmail.com" className="text-[var(--copper)] vc-link-underline">venus3dcreations@gmail.com</a> · <a href="tel:+918849440828" className="text-[var(--copper)] vc-link-underline">+91 88494 40828</a></p>
    </PolicySection>

    <PolicySection title="Orders and pricing">
      <p>All prices on the site are in Indian Rupees (INR) and include applicable GST. Prices may change at any time before an order is placed, but the price shown at the moment of checkout is the price you will be charged.</p>
      <p>Placing an order is an offer to purchase — we reserve the right to decline or cancel any order (e.g., stock issues, incorrect pricing, suspected fraud), in which case we will refund you in full.</p>
    </PolicySection>

    <PolicySection title="Payment">
      <p>We accept payments through Razorpay — including cards, UPI, netbanking and popular wallets. Your payment information is handled entirely by Razorpay; we never see or store it.</p>
    </PolicySection>

    <PolicySection title="Made-to-order production">
      <p>Every piece is produced after your payment is received. Small natural variations between pieces (colour, texture, layer lines) are expected and are part of the character of hand-finished 3D-printed objects — they are not defects.</p>
    </PolicySection>

    <PolicySection title="Intellectual property">
      <p>All designs, product images, text and other content on this site are the property of Venus 3D Creations. You may not reproduce, copy or use them commercially without written permission.</p>
      <p>When you buy a piece, you own that physical object. You do not receive rights to the design itself or to reproduce it.</p>
    </PolicySection>

    <PolicySection title="User accounts">
      <p>You are responsible for maintaining the confidentiality of your account credentials. Please notify us immediately if you suspect any unauthorised access. You can request deletion of your account at any time.</p>
    </PolicySection>

    <PolicySection title="Limitation of liability">
      <p>Our maximum liability for any order is limited to the amount you paid for that order. We are not liable for indirect, consequential or incidental damages beyond that amount.</p>
    </PolicySection>

    <PolicySection title="Governing law">
      <p>These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of the courts of Ahmedabad, Gujarat.</p>
    </PolicySection>

    <PolicySection title="Changes to these terms">
      <p>We may update these terms from time to time. The most recent version will always be posted on this page, with the "last updated" date at the top.</p>
    </PolicySection>

    <PolicySection title="Related policies">
      <p>Please also read our <a href="/policies/shipping" className="text-[var(--copper)] vc-link-underline">Shipping & Delivery</a>, <a href="/policies/refunds" className="text-[var(--copper)] vc-link-underline">Refunds & Returns</a>, and <a href="/policies/privacy" className="text-[var(--copper)] vc-link-underline">Privacy</a> policies.</p>
    </PolicySection>
  </PolicyLayout>
);

export default TermsPolicy;
