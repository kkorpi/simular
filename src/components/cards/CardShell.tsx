"use client";

import { useState, useEffect, type ReactNode, type HTMLAttributes } from "react";

const accentStyles = {
  default: "border-b1",
  amber: "border-am/40",
  green: "border-g/40",
  blue: "border-as/40",
  violet: "border-teach/40",
} as const;

export type CardAccent = keyof typeof accentStyles;

export function CardShell({
  accent = "default",
  fadeAccent = false,
  maxWidth = 520,
  className,
  children,
  ...rest
}: {
  accent?: CardAccent;
  /** When true, border starts with the accent color then fades to default after mount */
  fadeAccent?: boolean;
  maxWidth?: number;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "style" | "children">) {
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    if (!fadeAccent || accent === "default") return;
    const timer = setTimeout(() => setFaded(true), 2000);
    return () => clearTimeout(timer);
  }, [fadeAccent, accent]);

  const borderClass = faded ? accentStyles.default : accentStyles[accent];

  return (
    <div
      {...rest}
      className={`mt-2 overflow-hidden rounded-lg border bg-bgcard shadow-[var(--card-shadow)] transition-colors duration-1000 ${borderClass} ${className ?? ""}`}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
}
