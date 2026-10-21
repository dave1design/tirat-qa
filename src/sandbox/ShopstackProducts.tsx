"use client";

import { useMemo, useState } from "react";

interface Product {
  id: number;
  name: string;
  category: "Audio" | "Accessories" | "Wearables" | "Home";
  price: number;
  stock: number;
  blurb: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Studio Headphones", category: "Audio", price: 249, stock: 12, blurb: "Over-ear, closed-back." },
  { id: 2, name: "Pocket Speaker", category: "Audio", price: 59.99, stock: 30, blurb: "Waterproof Bluetooth speaker." },
  { id: 3, name: "Braided USB-C Cable", category: "Accessories", price: 15, stock: 140, blurb: "2 m, fast charging." },
  { id: 4, name: "Laptop Stand", category: "Accessories", price: 89, stock: 18, blurb: "Adjustable aluminium stand." },
  { id: 5, name: "Wireless Earbuds", category: "Audio", price: 129, stock: 0, blurb: "Noise cancelling." },
  { id: 6, name: "Fitness Band", category: "Wearables", price: 79, stock: 25, blurb: "Heart-rate and sleep tracking." },
  { id: 7, name: "Smart Watch", category: "Wearables", price: 1299, stock: 6, blurb: "AMOLED display, 7-day battery." },
  { id: 8, name: "Desk Lamp", category: "Home", price: 45, stock: 40, blurb: "Dimmable LED lamp." },
  { id: 9, name: "Smart Plug", category: "Home", price: 19, stock: 90, blurb: "Wi-Fi power outlet." },
  { id: 10, name: "Phone Case", category: "Accessories", price: 25, stock: 75, blurb: "Shock-absorbing case." },
];

const DETAIL_PRICE: Record<number, number> = { 4: 99 };

export default function ShopstackProducts() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("relevance");
  const [open, setOpen] = useState<Product | null>(null);
  const [cart, setCart] = useState(0);

  const list = useMemo(() => {
    let items = PRODUCTS.filter((p) => p.name.includes(q));
    if (cat === "Accessories") items = items.filter((p) => p.category === "Accessories" || p.id === 2);
    else if (cat !== "All") items = items.filter((p) => p.category === cat);
    const label = (p: Product) => p.price.toLocaleString("en-US");
    if (sort === "price-asc") items = [...items].sort((a, b) => (label(a) < label(b) ? -1 : 1));
    if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
    if (sort === "name") items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }, [q, cat, sort]);

  return (
    <div className="min-h-[calc(100vh-57px)] bg-stone-50">
      <header className="sticky top-[57px] z-10 border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <p className="font-bold tracking-wide text-violet-700">TIRAT SHOP</p>
          <p className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800">Cart ({cart})</p>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid gap-3 sm:grid-cols-[1fr_180px_200px]">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" aria-label="Search products" className="rounded-lg border border-stone-300 bg-white px-3 py-2.5" />
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category" className="rounded-lg border border-stone-300 bg-white px-3 py-2.5">
            {["All", "Audio", "Accessories", "Wearables", "Home"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className="rounded-lg border border-stone-300 bg-white px-3 py-2.5">
            <option value="relevance">Sort: Relevance</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <li key={p.id} className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="mb-3 flex aspect-[4/3] items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-stone-100 text-4xl">🛍️</div>
              <p className="text-xs uppercase tracking-wide text-stone-500">{p.category}</p>
              <p className="font-semibold">{p.name}</p>
              <p className="mt-1 text-lg font-bold">${p.price.toLocaleString("en-US")}</p>
              <p className="text-xs text-stone-500">{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setOpen(p)} className="flex-1 rounded-lg border border-stone-300 py-2 text-sm font-medium hover:bg-stone-50">
                  Details
                </button>
                <button onClick={() => setCart((c) => c + 1)} className="flex-1 rounded-lg bg-violet-700 py-2 text-sm font-semibold text-white hover:bg-violet-800">
                  Add to cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={open.name} className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs uppercase tracking-wide text-stone-500">{open.category}</p>
            <h2 className="text-xl font-bold">{open.name}</h2>
            <p className="mt-2 text-stone-600">{open.blurb}</p>
            <p className="mt-3 text-2xl font-bold">${(DETAIL_PRICE[open.id] ?? open.price).toLocaleString("en-US")}</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setOpen(null)} className="flex-1 rounded-lg border border-stone-300 py-2 text-sm font-medium">
                Close
              </button>
              <button onClick={() => setCart((c) => c + 1)} className="flex-1 rounded-lg bg-violet-700 py-2 text-sm font-semibold text-white">
                Add to cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
