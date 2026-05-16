"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Zap, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { login }    = useAuth();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [show, setShow]           = useState(false);
  const [error, setError]         = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    } else {
      setError(result.message);
    }
  };

  return (
    <>
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="card p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-12 bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center mb-4">
              <Zap size={22} className="text-ink-950 fill-ink-950" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-ink-100">Welcome back</h1>
            <p className="text-xs text-ink-500 mt-1">Sign in to continue to Nexus</p>
          </div>

          {error && (
            <div className="mb-4 px-3 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-8 text-xs text-rose-400">{error}</div>
          )}

          <form onSubmit={handle} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="Email address"
              className="w-full h-10 bg-ink-800 border border-ink-700 focus:border-gold-500/40 rounded-8 px-3 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none transition-colors"
            />
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Password"
                className="w-full h-10 bg-ink-800 border border-ink-700 focus:border-gold-500/40 rounded-8 px-3 pr-10 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none transition-colors"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition-colors">
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-10 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-ink-950 font-bold text-sm rounded-8 transition-colors flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-ink-600 mt-6">
            New to Nexus?{" "}
            <Link href="/signup" className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
