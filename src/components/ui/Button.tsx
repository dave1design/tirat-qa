import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "dark" | "light" | "brand" | "outline" | "ghost" | "white";
type Size = "md" | "sm";

const variants: Record<Variant, string> = {
  dark: "bg-brand text-white hover:bg-brand-dark",
  light: "bg-chip text-ink hover:bg-[#e5e5e5]",
  brand: "bg-brand text-white hover:bg-brand-dark",
  outline: "bg-white text-ink border border-line hover:bg-card",
  ghost: "bg-transparent text-ink hover:bg-chip",
  white: "bg-white text-ink hover:bg-card shadow-soft",
};
const sizes: Record<Size, string> = {
  md: "px-[22px] py-[14px] text-base",
  sm: "px-4 py-2.5 text-[15px]",
};

interface Common {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

export function buttonClass(variant: Variant = "dark", size: Size = "md", className?: string) {
  return cn(
    "group inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background,transform,opacity] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

type LinkProps = Common & { href: string } & { external?: boolean };
type BtnProps = Common & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: LinkProps | BtnProps) {
  const { variant = "dark", size = "md", arrow, className, children } = props;
  const inner = (
    <>
      {children}
      {arrow && <ChevronRight className="-mr-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />}
    </>
  );
  if (props.href !== undefined) {
    const { href, external } = props as LinkProps;
    return external ? (
      <a href={href} className={buttonClass(variant, size, className)} target="_blank" rel="noreferrer">
        {inner}
      </a>
    ) : (
      <Link href={href} className={buttonClass(variant, size, className)}>
        {inner}
      </Link>
    );
  }
  const { variant: _v, size: _s, arrow: _a, className: _c, children: _ch, ...rest } = props as BtnProps;
  void _v; void _s; void _a; void _c; void _ch;
  return (
    <button type="button" {...rest} className={buttonClass(variant, size, className)}>
      {inner}
    </button>
  );
}
