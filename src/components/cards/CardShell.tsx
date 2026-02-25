import type { ReactNode } from "react";

const accentStyles = {
  default: "border-b1",
  amber: "border-am/40",
  green: "border-g/40",
  blue: "border-as/40",
  violet: "border-violet-500/40",
} as const;

export type CardAccent = keyof typeof accentStyles;

export function CardShell({
  accent = "default",
  maxWidth = 520,
  className,
  children,
}: {
  accent?: CardAccent;
  maxWidth?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`mt-2 overflow-hidden rounded-lg border bg-bgcard shadow-[var(--card-shadow)] ${accentStyles[accent]} ${className ?? ""}`}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
}
