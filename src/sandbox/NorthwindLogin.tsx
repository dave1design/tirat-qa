"use client";

import { useEffect, useState } from "react";

const USERS: Record<string, string> = { "demo@tirat.test": "Passw0rd!" };
const KEY = "nw_session";

export default function NorthwindLogin() {
  const [view, setView] = useState<"login" | "account" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) setView("account");
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email) return setError("Enter your email address.");
    if (email !== email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email address.");
    const known = USERS[email.toLowerCase()];
    if (known === undefined) return setError("No account found with this email address.");
    if (password && password !== known) return setError("Incorrect password.");
    sessionStorage.setItem(KEY, email);
    setView("account");
  }

  if (view === "account") {
    return (
      <Shell>
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">{sessionStorage.getItem(KEY) ?? "demo@tirat.test"}</p>
        <div className="mt-6 grid gap-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Checking •••• 4821</p>
            <p className="mt-1 text-2xl font-semibold">$12,480.55</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Savings •••• 9903</p>
            <p className="mt-1 text-2xl font-semibold">$3,210.00</p>
          </div>
        </div>
        <button onClick={() => setView("login")} className="mt-6 w-full rounded-lg border border-slate-300 py-2.5 text-sm font-medium hover:bg-slate-50">
          Log out
        </button>
      </Shell>
    );
  }

  if (view === "forgot") {
    return (
      <Shell>
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">We couldn’t find the page you’re looking for.</p>
        <button onClick={() => setView("login")} className="mt-6 text-sm font-medium text-sky-700 underline">
          Back to sign in
        </button>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-xl font-semibold">Sign in to your account</h1>
      <p className="mt-1 text-sm text-slate-500">Track orders and manage your details.</p>
      <form onSubmit={submit} noValidate className="mt-6 grid gap-4">
        <label className="grid gap-1.5 text-sm font-medium">
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" autoComplete="off" className="rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-sky-600" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Password
          <span className="relative">
            <input value={password} onChange={(e) => setPassword(e.target.value)} type={reveal ? "text" : "password"} autoComplete="off" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-16 font-normal outline-none focus:border-sky-600" />
            <button type="button" onClick={() => setReveal(true)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-sky-700">
              Show
            </button>
          </span>
        </label>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button className="rounded-lg bg-sky-700 py-2.5 text-sm font-semibold text-white hover:bg-sky-800">Sign in</button>
        <button type="button" onClick={() => setView("forgot")} className="text-center text-sm text-sky-700 underline">
          Forgot password?
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-gradient-to-b from-sky-50 to-white p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="mb-5 text-sm font-bold tracking-wide text-sky-800">TIRAT E-COMMERCE</p>
        {children}
      </div>
    </div>
  );
}
