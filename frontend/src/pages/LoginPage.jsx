import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { LOGO_URL } from "../mock";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/account";

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name}`);
      navigate(u.role === "admin" ? "/admin" : from);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[var(--cream)] min-h-[80vh] flex items-center py-16">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="text-center mb-10">
          <Link to="/"><img src={LOGO_URL} alt="Venus" className="h-14 w-auto mx-auto" /></Link>
          <h1 className="font-serif-display text-4xl mt-6 text-[var(--espresso)]">Welcome back</h1>
          <p className="text-sm text-[var(--espresso)]/60 mt-2">Sign in to view your orders and continue your journey.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 bg-[var(--ivory)] p-8">
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Email</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
          </div>
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-[var(--espresso)]/60 mb-2 block">Password</label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-none bg-transparent border-[var(--sand)] focus-visible:ring-[var(--copper)]" />
          </div>
          <button type="submit" disabled={loading} className="w-full h-12 vc-btn-copper text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--espresso)]/70">
          New to Venus? <Link to="/register" className="text-[var(--copper)] vc-link-underline">Create an account</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
