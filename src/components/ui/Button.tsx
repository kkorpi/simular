"use client";

import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "link" | "danger";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

const base = "inline-flex cursor-pointer items-center gap-1.5 font-medium transition-[transform,background-color,color,filter] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary:
    "rounded-md bg-ab text-abt hover:brightness-110",
  outline:
    "rounded-md border border-b1 bg-transparent text-t2 hover:border-b2 hover:bg-bg3h hover:text-t1",
  ghost:
    "rounded-md text-t3 hover:text-t1 hover:bg-bg3h",
  link:
    "text-blt hover:underline",
  danger:
    "rounded-md bg-rd/10 text-rd hover:bg-rd/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-2.5 py-1 text-[11px] min-h-[36px]",
  md: "px-3 py-1.5 text-[12.5px] min-h-[44px]",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const isLink = variant === "link";
  return (
    <button
      className={`${base} ${variants[variant]} ${isLink ? "" : sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </button>
  );
}
