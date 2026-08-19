import React from "react";
import PolicyLayout, { PolicySection } from "./PolicyLayout";

const ShippingPolicy = () => (
  <PolicyLayout eyebrow="Policies" title="Shipping & Delivery" updated="August 2026">
    <p className="text-lg">Every piece we make is crafted to order in our Ahmedabad studio. Because of that, please read our timelines carefully before you place an order.</p>

    <PolicySection title="Where we ship">
      <p>We currently ship anywhere within India. For international shipping, please write to us at <a href="mailto:venus3dcreations@gmail.com" className="text-[var(--copper)] vc-link-underline">venus3dcreations@gmail.com</a> before ordering and we'll share a custom quote.</p>
    </PolicySection>

    <PolicySection title="Processing time (before your order ships)">
      <p>Most lamps and small pieces are shipped within <strong>3–5 business days</strong> from the day payment is received. Larger or custom pieces may take up to <strong>10 business days</strong>. The lead time is listed on each product page.</p>
      <p>You'll receive an email as soon as your order is on its way, with the courier name and a tracking link.</p>
    </PolicySection>

    <PolicySection title="Delivery time (after your order ships)">
      <p>Once dispatched, delivery typically takes:</p>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li>Metro cities: 2–4 business days</li>
        <li>Rest of India: 4–7 business days</li>
        <li>Remote pin codes: up to 10 business days</li>
      </ul>
      <p>All shipments are handled by our logistics partners (Shiprocket, Delhivery, BlueDart and similar). You will receive a tracking link once your AWB is generated.</p>
    </PolicySection>

    <PolicySection title="Shipping charges">
      <p>Shipping is <strong>complimentary on orders above ₹2,500</strong>. A flat <strong>₹99</strong> courier charge applies to orders below this. Any duties or taxes for international shipments (where offered) are the customer's responsibility.</p>
    </PolicySection>

    <PolicySection title="Packaging">
      <p>Every Venus piece is packed with care — cushioned padding, secure inserts and eco-friendly outer packaging. We do our best to keep waste minimal without compromising on the piece arriving in perfect condition.</p>
    </PolicySection>

    <PolicySection title="Failed or delayed deliveries">
      <p>If a shipment is delayed by more than 3 business days beyond the estimate, or if it's marked "undelivered" by the courier, please email us and we'll investigate immediately. In most cases we can arrange a re-attempt within 24 hours.</p>
    </PolicySection>

    <PolicySection title="Address changes">
      <p>If you need to change the delivery address, please write to us within <strong>4 hours</strong> of placing the order — after that, the piece may already be en route to shipping. Address changes after dispatch are not always possible.</p>
    </PolicySection>

    <PolicySection title="Questions">
      <p>Reach us any time at <a href="mailto:venus3dcreations@gmail.com" className="text-[var(--copper)] vc-link-underline">venus3dcreations@gmail.com</a> or <a href="tel:+918849440828" className="text-[var(--copper)] vc-link-underline">+91 88494 40828</a>. We reply within 24 hours.</p>
    </PolicySection>
  </PolicyLayout>
);

export default ShippingPolicy;
