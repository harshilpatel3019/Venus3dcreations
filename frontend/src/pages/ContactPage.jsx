import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "General inquiry", message: "" });
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email and message.");
      return;
    }
    toast.success("Thank you\u2014 the studio will reply within 48 hours.");
    setForm({ name: "", email: "", subject: "General inquiry", message: "" });
  };

  return (
    <main className="bg-[var(--cream)]">
      <section className="bg-[var(--ivory)] py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--copper)] mb-6">— Get in touch</p>
          <h1 className="font-serif-display text-5xl lg:text-7xl leading-[1.05] text-[var(--espresso)]">Talk to the <em className="italic text-[var(--copper)]">studio</em>.</h1>
          <p className="mt-6 text-lg text-[var(--espresso)]/70 max-w-2xl">
            Commissions, press, wholesale, or just to say hello. We answer every message personally within 48 hours.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            {[
              { Icon: MapPin, t: "Studio", v: "Ahmedabad, India—by appointment only" },
              { Icon: Mail, t: "Email", v: "venus3dcreations@gmail.com" },
              { Icon: Phone, t: "Phone", v: "+91 88494 40828" },
              { Icon: Clock, t: "Hours", v: "Mon–Sat  10:00–19:00 IST" },
            ].map(({ Icon, t, v }, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-11 h-11 rounded-full bg-[var(--sand)] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[var(--copper)]" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[var(--copper)]">{t}</p>
                  <p className="text-[var(--espresso)]/80 mt-1">{v}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="lg:col-span-8 bg-[var(--ivory)] p-8 lg:p-12 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Name</label>
                <Input value={form.name} onChange={upd("name")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
              </div>
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Email</label>
                <Input type="email" value={form.email} onChange={upd("email")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
              </div>
            </div>
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Subject</label>
              <div className="flex flex-wrap gap-2">
                {["General inquiry", "Custom commission", "Wholesale", "Press"].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setForm({ ...form, subject: s })}
                    className={`px-4 h-10 text-xs tracking-[0.14em] uppercase border transition-colors ${
                      form.subject === s
                        ? "bg-[var(--espresso)] text-white border-[var(--espresso)]"
                        : "border-[var(--sand)] hover:border-[var(--copper)]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Message</label>
              <Textarea value={form.message} onChange={upd("message")} rows={6} className="rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
            </div>
            <Button type="submit" className="h-12 rounded-none px-10 vc-btn-copper text-xs tracking-[0.2em] uppercase">
              Send message
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
