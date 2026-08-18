import React from "react";
import PolicyLayout, { PolicySection } from "./PolicyLayout";

const RefundPolicy = () => (
  <PolicyLayout eyebrow="Policies" title="Refunds & Returns" updated="August 2026">
    <p className="text-lg">Because every Venus piece is made to order for you, our refund policy is written with that in mind — we ask that you read it carefully before purchase.</p>

    <PolicySection title="Damaged in transit">
      <p>If your piece arrives damaged, please <strong>email us within 48 hours of delivery</strong> at <a href="mailto:venus3dcreations@gmail.com" className="text-[var(--copper)] vc-link-underline">venus3dcreations@gmail.com</a> with clear photographs of the damage and the outer packaging.</p>
      <p>We will arrange a replacement at no extra cost, or issue a full refund to the original payment method — whichever you prefer. Please keep the original packaging until the case is resolved.</p>
    </PolicySection>

    <PolicySection title="Defective or incorrect product">
      <p>If you receive a piece that is defective (technical fault) or different from what you ordered, write to us within <strong>7 days of delivery</strong> with photos. We will replace it or refund it in full, and cover the return shipping.</p>
    </PolicySection>

    <PolicySection title="Change of mind">
      <p>Because our pieces are made to order, we generally do not offer refunds for change of mind. However, if you email us within <strong>24 hours of placing the order</strong> and we have not yet started production, we will cancel and refund your order in full.</p>
      <p>Once production has started, we can no longer cancel — the piece is already being made for you.</p>
    </PolicySection>

    <PolicySection title="Custom commissions">
      <p>Custom-designed pieces and DIY kits are non-refundable once production begins. We invest significant hours in the design and printing process, and each piece is unique to your brief.</p>
      <p>If you have concerns during design consultations (before production), we're happy to iterate until you're happy — that stage is fully collaborative.</p>
    </PolicySection>

    <PolicySection title="How refunds are issued">
      <p>Approved refunds are processed to the original payment method — the same card, UPI, or netbanking account you paid with. Refunds appear in your account within <strong>5–7 business days</strong> after we initiate them. Razorpay handles the actual transfer.</p>
      <p>Shipping charges are non-refundable unless the return is due to our error.</p>
    </PolicySection>

    <PolicySection title="How to start a return">
      <ol className="list-decimal list-inside space-y-1 pl-2">
        <li>Email <a href="mailto:venus3dcreations@gmail.com" className="text-[var(--copper)] vc-link-underline">venus3dcreations@gmail.com</a> with your order number and a brief description of the issue.</li>
        <li>Attach photos where relevant (damage, defect, wrong item).</li>
        <li>We will respond within 24 hours with next steps — either a return pickup, a replacement, or a refund.</li>
      </ol>
    </PolicySection>

    <PolicySection title="Questions">
      <p>We're a small studio and every piece matters to us. If something isn't right, please write to us — we will make it right. <a href="mailto:venus3dcreations@gmail.com" className="text-[var(--copper)] vc-link-underline">venus3dcreations@gmail.com</a> or <a href="tel:+918849440828" className="text-[var(--copper)] vc-link-underline">+91 88494 40828</a>.</p>
    </PolicySection>
  </PolicyLayout>
);

export default RefundPolicy;
