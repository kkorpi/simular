"use client";

import { useState } from "react";
import { CardShell, type CardAccent } from "./CardShell";
import type { CardAction } from "./types";

/* ── Types ── */

export interface HandoffCardProps {
  title: string;
  reason: string;
  context?: string;
  actions?: CardAction[];
  accent?: CardAccent;
}

/* ── Component ── */

export function HandoffCard({
  title,
  reason,
  context,
  actions,
  accent = "default",
}: HandoffCardProps) {
  const [contextExpanded, setContextExpanded] = useState(false);

  return (
    <CardShell accent={accent}>
      {/* Header */}
      <div className="flex items-start gap-2.5 px-3.5 py-3">
        <div className="mt-0.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-as/10 text-as">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 010 8h-1" />
            <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-t1">{title}</div>
          <div className="mt-1 text-[12px] leading-[1.6] text-t2">{reason}</div>
        </div>
      </div>

      {/* Context (collapsible) */}
      {context && (
        <div className="border-t border-b1 px-3.5 py-2">
          <button
            onClick={() => setContextExpanded(!contextExpanded)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-t3 transition-colors hover:text-t1"
          >
            <svg
              className={`h-3 w-3 transition-transform ${contextExpanded ? "rotate-90" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            Context
          </button>
          {contextExpanded && (
            <div className="mt-2 rounded-md bg-bg3h px-3 py-2 text-[11px] leading-[1.6] text-t3">
              {context}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2 border-t border-b1 px-3.5 py-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={
                action.style === "primary"
                  ? "rounded-md bg-ab px-2.5 py-1 text-xs font-medium text-abt transition-colors hover:brightness-110"
                  : action.style === "outline"
                    ? "rounded-md border border-b1 bg-transparent px-2.5 py-1 text-xs font-medium text-t2 transition-colors hover:bg-bg3h hover:text-t1"
                    : "text-[11px] font-medium text-blt transition-colors hover:underline"
              }
            >
              {action.icon && <span className="mr-1 inline-flex">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </CardShell>
  );
}
