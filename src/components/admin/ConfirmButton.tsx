"use client";

import { Button } from "@/components/ui/Button";

/** Submit button that asks for confirmation first — used for destructive or money-related admin actions. */
export function ConfirmButton({ message, children, variant = "light", size = "sm" }: { message: string; children: React.ReactNode; variant?: "dark" | "light" | "outline"; size?: "sm" | "md" }) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </Button>
  );
}
