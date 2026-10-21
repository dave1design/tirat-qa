import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import NorthwindLogin from "@/sandbox/NorthwindLogin";
import BrightpathRegister from "@/sandbox/BrightpathRegister";
import ShopstackProducts from "@/sandbox/ShopstackProducts";
import TiratEcommerce from "@/sandbox/TiratEcommerce";

const apps: Record<string, ComponentType> = {
  "tirat-ecommerce": TiratEcommerce,
  "northwind-login": NorthwindLogin,
  "brightpath-register": BrightpathRegister,
  "shopstack-products": ShopstackProducts,
};

export default async function SandboxPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const App = apps[slug];
  if (!App) notFound();
  return <App />;
}
