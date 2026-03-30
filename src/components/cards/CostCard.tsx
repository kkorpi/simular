"use client";

import { CardShell, type CardAccent } from "./CardShell";

/* ── Types ── */

export interface CostCardProps {
  action: string;
  cost: string;
  balance: string;
  accent?: CardAccent;
}

/* ── Component ── */

export function CostCard({
  action,
  cost,
  balance,
  accent = "default",
}: CostCardProps) {
  return (
    <CardShell accent={accent}>
      <div className="flex items-start gap-2.5 px-3.5 py-3">
        {/* Coin icon */}
        <div className="mt-0.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-am/10 text-am">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-t1">{action}</div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="rounded-md bg-am/10 px-2 py-0.5 text-[11px] font-medium text-am">
              {cost}
            </span>
            <span className="text-[11px] text-t3">{balance}</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
