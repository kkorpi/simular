"use client";

import type { ReactNode } from "react";
import { CardShell, type CardAccent } from "./CardShell";
import type { CardAction } from "./types";

/* ── Types ── */

export type AlertSeverity = "info" | "warning" | "caution";

export interface AlertCardProps {
  severity: AlertSeverity;
  title: string;
  message: string;
  actions?: CardAction[];
  accent?: CardAccent;
}

/* ── Severity icons ── */

const severityIcons: Record<AlertSeverity, ReactNode> = {
  info: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  warning: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  caution: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

const severityColors: Record<AlertSeverity, { bg: string; text: string }> = {
  info: { bg: "bg-as/10", text: "text-as" },
  warning: { bg: "bg-am/10", text: "text-am" },
  caution: { bg: "bg-am/10", text: "text-am" },
};

/* ── Component ── */

export function AlertCard({
  severity,
  title,
  message,
  actions,
  accent = "default",
}: AlertCardProps) {
  const colors = severityColors[severity];

  return (
    <CardShell accent={accent}>
      {/* Header */}
      <div className="flex items-start gap-2.5 px-3.5 py-3">
        <div className={`mt-0.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md ${colors.bg} ${colors.text}`}>
          {severityIcons[severity]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-t1">{title}</div>
          <div className="mt-1 text-[12px] leading-[1.6] text-t2">{message}</div>
        </div>
      </div>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2 border-t border-b1 px-3.5 py-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={
                action.style === "primary"
                  ? "rounded-md bg-ab px-2.5 py-1 text-xs font-medium text-abt transition-all hover:brightness-110"
                  : action.style === "outline"
                    ? "rounded-md border border-b1 bg-transparent px-2.5 py-1 text-xs font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1"
                    : "text-[11px] font-medium text-blt transition-all hover:underline"
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
