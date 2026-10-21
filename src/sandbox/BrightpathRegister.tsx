"use client";

import { useState } from "react";

export default function BrightpathRegister() {
  const [done, setDone] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const err: Record<string, string> = {};
    if (!v("name")) err.name = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) err.email = "Enter a valid email address.";
    if (!v("dob")) err.dob = "Date of birth is required.";
    if (String(f.get("password") ?? "").length < 8) err.password = "Password must be at least 8 characters.";
    if (!v("country")) err.country = "Choose your country.";
    setErrors(err);
    if (Object.keys(err).length) return;
    const parts = v("name").split(/\s+/);
    setDone(parts[parts.length - 1]);
  }

  if (done) {
    return (
      <Frame>
        <div className="py-8 text-center">
          <p className="text-4xl">🎉</p>
          <h1 className="mt-3 text-2xl font-bold">Welcome, {done}!</h1>
          <p className="mt-2 text-slate-600">Your BrightPath account has been created. Check your inbox to get started.</p>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-slate-600">Start learning with BrightPath today.</p>
      <form onSubmit={submit} noValidate className="mt-6 grid gap-4">
        <Field label="Full name" name="name" error={errors.name} />
        <Field label="Email" name="email" type="email" error={errors.email} />
        <Field label="Phone (optional)" name="phone" type="text" />
        <Field label="Date of birth" name="dob" type="date" error={errors.dob} />
        <Field label="Password" name="password" type="password" error={errors.password} />
        <Field label="Confirm password" name="confirm" type="password" />
        <label className="grid gap-1.5 text-sm font-medium">
          Country
          <select name="country" defaultValue="" className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal">
            <option value="">Select…</option>
            <option>Ethiopia</option>
            <option>Kenya</option>
            <option>Uganda</option>
            <option>Other</option>
          </select>
          {errors.country && <span className="text-xs text-red-600">{errors.country}</span>}
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="terms" className="mt-0.5 size-4" />
          <span>I agree to the Terms of Use and Privacy Policy.</span>
        </label>
        <button className="rounded-lg bg-emerald-600 py-2.5 font-semibold text-white hover:bg-emerald-700">Create account</button>
      </form>
    </Frame>
  );
}

function Field({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <input name={name} type={type} className="rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-emerald-600" />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-emerald-50/60 p-4">
      <div className="mx-auto mt-6 max-w-md rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm">
        <p className="mb-4 text-sm font-bold tracking-wide text-emerald-700">BRIGHTPATH ACADEMY</p>
        {children}
      </div>
    </div>
  );
}
