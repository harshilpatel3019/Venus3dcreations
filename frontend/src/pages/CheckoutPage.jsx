import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrderApi, verifyPaymentApi, imgUrl, formatINR } from "../api";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const shipping = subtotal >= 2500 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    email: user?.email || "",
    full_name: user?.name || "",
    phone: user?.phone || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    notes: "",
  });
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (items.length === 0) navigate("/cart");
  }, [items.length, navigate]);

  const validate = () => {
    for (const k of ["email", "full_name", "phone", "line1", "city", "state", "pincode"]) {
      if (!form[k]) {
        toast.error("Please complete all required fields.");
        return false;
      }
    }
    if (!/^[0-9]{6}$/.test(form.pincode)) {
      toast.error("Please enter a valid 6-digit pincode.");
      return false;
    }
    return true;
  };

  const onPay = async () => {
    if (!validate()) return;
    setProcessing(true);

    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Could not load Razorpay. Please check your connection.");

      const payload = {
        email: form.email,
        notes: form.notes,
        address: {
          full_name: form.full_name,
          phone: form.phone,
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: form.country,
        },
        items: items.map((i) => ({
          product_id: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
          image: i.image,
        })),
      };
      const order = await createOrderApi(payload);

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Venus 3D Creations",
        description: `Order #${order.order_id.slice(0, 8).toUpperCase()}`,
        order_id: order.razorpay_order_id,
        prefill: {
          name: form.full_name,
          email: form.email,
          contact: form.phone,
        },
        notes: { order_id: order.order_id },
        theme: { color: "#A87456" },
        handler: async (response) => {
          try {
            await verifyPaymentApi({
              order_id: order.order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful");
            clearCart();
            navigate(`/order/${order.order_id}`);
          } catch (err) {
            toast.error("Payment verification failed. Please contact the studio.");
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err?.response?.data?.detail || err.message || "Something went wrong");
      setProcessing(false);
    }
  };

  return (
    <main className="bg-[var(--cream)] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-4">— Checkout</p>
        <h1 className="font-serif-display text-5xl lg:text-6xl leading-[1.05] text-[var(--espresso)]">Almost <em className="italic">home</em>.</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-14">
          {/* Form */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-xs tracking-[0.2em] uppercase text-[var(--copper)] mb-5">Contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Email address*" value={form.email} onChange={upd("email")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
                <Input placeholder="Phone*" value={form.phone} onChange={upd("phone")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
              </div>
            </div>

            <div>
              <h2 className="text-xs tracking-[0.2em] uppercase text-[var(--copper)] mb-5">Shipping address</h2>
              <div className="space-y-4">
                <Input placeholder="Full name*" value={form.full_name} onChange={upd("full_name")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
                <Input placeholder="Address line 1*" value={form.line1} onChange={upd("line1")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
                <Input placeholder="Apartment, floor, landmark (optional)" value={form.line2} onChange={upd("line2")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input placeholder="City*" value={form.city} onChange={upd("city")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
                  <Input placeholder="State*" value={form.state} onChange={upd("state")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
                  <Input placeholder="Pincode*" value={form.pincode} onChange={upd("pincode")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
                </div>
                <Input value={form.country} disabled className="h-12 rounded-none bg-transparent border-[var(--sand)] opacity-70" />
              </div>
            </div>

            <div>
              <h2 className="text-xs tracking-[0.2em] uppercase text-[var(--copper)] mb-5">Order notes (optional)</h2>
              <Textarea rows={3} value={form.notes} onChange={upd("notes")} className="rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" placeholder="Delivery instructions, gift note, etc." />
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-5">
            <div className="bg-[var(--ivory)] p-8 sticky top-28">
              <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--copper)] mb-6">Your order</h3>
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-20 bg-[var(--sand)] overflow-hidden flex-shrink-0">
                      <img src={imgUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-serif-display text-base leading-tight">{item.name}</p>
                      <p className="text-xs text-[var(--espresso)]/60 mt-0.5">Qty {item.qty}</p>
                    </div>
                    <span className="text-sm">{formatINR(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-[var(--sand)] my-6" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[var(--espresso)]/60">Subtotal</span><span>{formatINR(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--espresso)]/60">Shipping</span><span>{shipping === 0 ? "Complimentary" : formatINR(shipping)}</span></div>
              </div>
              <div className="h-px bg-[var(--sand)] my-4" />
              <div className="flex justify-between items-end"><span className="text-xs tracking-[0.14em] uppercase">Total</span><span className="font-serif-display text-3xl">{formatINR(total)}</span></div>

              <button onClick={onPay} disabled={processing || items.length === 0} className="mt-8 w-full h-12 vc-btn-copper text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing</> : <><Lock className="w-3 h-3" /> Pay {formatINR(total)}</>}
              </button>
              <p className="mt-4 text-xs text-[var(--espresso)]/50 text-center">Secure payment powered by Razorpay</p>
              <p className="mt-3 text-[10px] text-[var(--espresso)]/40 text-center tracking-widest uppercase">UPI · Cards · Netbanking · Wallets</p>
              {!user && (
                <p className="mt-6 text-xs text-center text-[var(--espresso)]/60">Have an account? <Link to="/login" className="text-[var(--copper)] vc-link-underline">Sign in</Link> for a faster checkout.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
