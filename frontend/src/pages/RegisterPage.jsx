import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { LOGO_URL } from "../mock";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success("Welcome to Venus");
      navigate("/account");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[var(--cream)] min-h-[80vh] flex items-center py-16">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="text-center mb-10">
          <Link to="/"><img src={LOGO_URL} alt="Venus" className="h-14 w-auto mx-auto" /></Link>
          <h1 className="font-serif-display text-4xl mt-6 text-[var(--espresso)]">Create your account</h1>
          <p className="text-sm text-[var(--espresso)]/60 mt-2">Save your address, track orders, and get early access to new pieces.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 bg-[var(--ivory)] p-8">
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Full name</label>
            <Input required value={form.name} onChange={upd("name")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
          </div>
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Email</label>
            <Input type="email" required value={form.email} onChange={upd("email")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
          </div>
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Phone (optional)</label>
            <Input value={form.phone} onChange={upd("phone")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
          </div>
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Password</label>
            <Input type="password" required minLength={6} value={form.password} onChange={upd("password")} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
          </div>
          <button type="submit" disabled={loading} className="w-full h-12 vc-btn-copper text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--espresso)]/70">
          Already have an account? <Link to="/login" className="text-[var(--copper)] vc-link-underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
