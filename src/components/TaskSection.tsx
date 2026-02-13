"use client";

import { useState, type ReactNode } from "react";

export function TaskSection({
  label,
  count,
  children,
  defaultOpen = true,
}: {
  label: string;
  count: number;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 px-2 pt-2 pb-1 select-none"
      >
        <svg
          className={`h-3.5 w-3.5 shrink-0 text-t4 transition-transform ${open ? "" : "-rotate-90"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">
          {label}
        </span>
        <span className="rounded-full bg-as px-1.5 py-px font-mono text-[10px] font-medium text-t4">
          {count}
        </span>
      </button>
      <div className="collapsible" data-open={open}>
        <div>
          <div className="flex flex-col gap-px">{children}</div>
        </div>
      </div>
    </div>
  );
}
