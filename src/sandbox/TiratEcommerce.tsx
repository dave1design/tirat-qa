"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import NorthwindLogin from "./NorthwindLogin";
import BrightpathRegister from "./BrightpathRegister";
import ShopstackProducts from "./ShopstackProducts";

const tabs = [
  { id: "shop", label: "Shop", view: <ShopstackProducts /> },
  { id: "signin", label: "Sign in", view: <NorthwindLogin /> },
  { id: "register", label: "Create account", view: <BrightpathRegister /> },
] as const;

/** One complete practice website: a store shell whose pages are the shop, sign-in and registration screens. */
export default function TiratEcommerce() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("shop");
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 flex h-[57px] items-center justify-between border-b border-slate-200 bg-white px-4">
        <p className="flex items-center gap-2 font-bold tracking-tight text-slate-900">
          <span className="flex size-7 items-center justify-center rounded-lg bg-slate-900 text-white">
            <ShoppingBag className="size-4" aria-hidden />
          </span>
          Tirat E-commerce
        </p>
        <nav aria-label="Store" className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${tab === t.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      {tabs.find((t) => t.id === tab)!.view}
    </div>
  );
}
