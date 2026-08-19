import React from "react";
import PolicyLayout, { PolicySection } from "./PolicyLayout";

const PrivacyPolicy = () => (
  <PolicyLayout eyebrow="Policies" title="Privacy" updated="August 2026">
    <p className="text-lg">Venus 3D Creations respects your privacy. This page explains what information we collect, why we collect it, and how we protect it.</p>

    <PolicySection title="Information we collect">
      <p>When you shop with us, we collect only what's needed to fulfil your order:</p>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li><strong>Contact information</strong> — your name, email and phone number</li>
        <li><strong>Shipping address</strong> — for delivery only</li>
        <li><strong>Order history</strong> — the pieces you've ordered from us</li>
        <li><strong>Payment metadata</strong> — Razorpay handles all payments. We never see or store your card, UPI or bank details. We only receive a payment reference from Razorpay confirming success or failure.</li>
        <li><strong>Analytics</strong> — anonymous, aggregated usage data (via Google Analytics) so we can understand which pages are visited and improve the site</li>
      </ul>
    </PolicySection>

    <PolicySection title="How we use your information">
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li>To process and ship your orders</li>
        <li>To email you order confirmations and shipping updates</li>
        <li>To reply to your questions or commission enquiries</li>
        <li>To improve our website and product offering</li>
      </ul>
      <p>We never sell your data. We never share it with third parties for marketing purposes.</p>
    </PolicySection>

    <PolicySection title="Third-party services we use">
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li><strong>Razorpay</strong> — for secure payment processing</li>
        <li><strong>Shiprocket & courier partners</strong> — for delivery. Your shipping address is shared with them for this purpose only.</li>
        <li><strong>Google Analytics</strong> — anonymous website analytics</li>
        <li><strong>Gmail / Google Workspace</strong> — for order emails</li>
      </ul>
      <p>Each of these services has their own privacy policy, which governs how they handle data.</p>
    </PolicySection>

    <PolicySection title="Data retention">
      <p>We keep order records for as long as necessary to service your account and meet legal, tax and accounting requirements. If you'd like your data deleted, email us and we'll do so within 30 days (except where we're required to keep some records by law).</p>
    </PolicySection>

    <PolicySection title="Security">
      <p>Your data is transmitted over secure HTTPS and stored on protected servers. Passwords (if you create an account) are hashed and never stored in plain text. We never see or store payment information — that's all handled by Razorpay's PCI-compliant infrastructure.</p>
    </PolicySection>

    <PolicySection title="Your choices">
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li>You can shop as a guest without creating an account</li>
        <li>You can request a copy of your data by emailing us</li>
        <li>You can request deletion of your account and data at any time</li>
        <li>You can unsubscribe from marketing emails (we currently don't send any — this is future-proofing)</li>
      </ul>
    </PolicySection>

    <PolicySection title="Contact us about privacy">
      <p>Any questions about how we handle your data, please write to <a href="mailto:venus3dcreations@gmail.com" className="text-[var(--copper)] vc-link-underline">venus3dcreations@gmail.com</a>.</p>
    </PolicySection>
  </PolicyLayout>
);

export default PrivacyPolicy;
