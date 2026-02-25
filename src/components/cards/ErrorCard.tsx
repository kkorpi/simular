"use client";

import { useState, type ReactNode } from "react";
import { CardShell } from "./CardShell";
import { ResolvedInline } from "./ResolvedInline";
import type { CardAction } from "./types";

/* ── Types ── */

export type ErrorType =
  | "auth_required"
  | "blocked"
  | "rate_limited"
  | "scope_too_large"
  | "site_unavailable"
  | "generic";

export interface ErrorCardProps {
  errorType: ErrorType;
  title: string;
  detail: string;
  context?: string;
  actions: CardAction[];
  resolvedMessage?: string;
}

/* ── Icon per error type ── */

const errorIcons: Record<ErrorType, ReactNode> = {
  auth_required: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  blocked: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  rate_limited: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  scope_too_large: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  site_unavailable: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  generic: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

/* ── Component ── */

export function ErrorCard({
  errorType,
  title,
  detail,
  context,
  actions,
  resolvedMessage,
}: ErrorCardProps) {
  const [contextExpanded, setContextExpanded] = useState(false);
  const [resolved, setResolved] = useState(false);

  const handleAction = (action: CardAction) => {
    action.onClick();
    if (resolvedMessage) setResolved(true);
  };

  if (resolved) {
    return <ResolvedInline icon="check" message={resolvedMessage!} />;
  }

  return (
    <CardShell accent={errorType === "rate_limited" || errorType === "scope_too_large" ? "amber" : "default"}>
      {/* Header */}
      <div className="flex items-start gap-2.5 px-3.5 py-3">
        <div className="mt-0.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-r/10 text-r">
          {errorIcons[errorType]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-t1">{title}</div>
          <div className="mt-1 text-[12px] leading-[1.6] text-t2">{detail}</div>
        </div>
      </div>

      {/* Context (collapsible) */}
      {context && (
        <div className="border-t border-b1 px-3.5 py-2">
          <button
            onClick={() => setContextExpanded(!contextExpanded)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-t3 transition-colors hover:text-t2"
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
            What was attempted
          </button>
          {contextExpanded && (
            <div className="mt-2 rounded-md bg-bg3h px-3 py-2 text-[11px] leading-[1.6] text-t3">
              {context}
            </div>
          )}
        </div>
      )}

      {/* Recovery actions */}
      <div className="flex items-center gap-2 border-t border-b1 px-3.5 py-2">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleAction(action)}
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
    </CardShell>
  );
}
