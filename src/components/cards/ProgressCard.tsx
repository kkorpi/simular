"use client";

import { CardShell, type CardAccent } from "./CardShell";
import type { CardAction } from "./types";

/* ── Types ── */

export type ProgressStepStatus = "pending" | "running" | "done" | "error";

export type ProgressStep = {
  label: string;
  status: ProgressStepStatus;
  detail?: string;
};

export interface ProgressCardProps {
  title: string;
  subtitle?: string;
  steps: ProgressStep[];
  /** 0-1 for determinate, undefined for indeterminate (derived from steps) */
  progress?: number;
  accent?: CardAccent;
  onCancel?: () => void;
  onRetry?: (stepIndex: number) => void;
  actions?: CardAction[];
}

/* ── Status visuals ── */

const statusIcon: Record<ProgressStepStatus, React.ReactNode> = {
  pending: (
    <div className="h-1.5 w-1.5 rounded-full bg-t4" />
  ),
  running: (
    <div className="h-2 w-2 rounded-full bg-as animate-pulse" />
  ),
  done: (
    <svg className="h-3.5 w-3.5 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg className="h-3.5 w-3.5 text-r" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

const statusText: Record<ProgressStepStatus, string> = {
  pending: "text-t4",
  running: "text-t1 font-medium",
  done: "text-t3",
  error: "text-r",
};

/* ── Component ── */

export function ProgressCard({
  title,
  subtitle,
  steps,
  progress,
  accent = "default",
  onCancel,
  onRetry,
  actions,
}: ProgressCardProps) {
  const doneCount = steps.filter((s) => s.status === "done").length;
  const errorCount = steps.filter((s) => s.status === "error").length;
  const total = steps.length;
  const allDone = doneCount === total;
  const hasError = errorCount > 0;

  return (
    <CardShell accent={hasError ? "amber" : allDone ? "green" : accent}>
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {!allDone && !hasError && (
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-as animate-pulse" />
            )}
            {allDone && (
              <svg className="h-3.5 w-3.5 shrink-0 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {hasError && !allDone && (
              <svg className="h-3.5 w-3.5 shrink-0 text-am" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            )}
            <div className="text-[13px] font-semibold text-t1">{title}</div>
          </div>
          {subtitle && (
            <div className="mt-0.5 text-[11px] text-t3">{subtitle}</div>
          )}
        </div>
        {allDone && (
          <div className="rounded-full bg-bg3h px-2.5 py-0.5 text-[11px] font-medium text-t3">
            Done
          </div>
        )}
      </div>

      {/* Shimmer bar (indeterminate) / solid bar when done or error */}
      <div
        className={`h-1 w-full ${
          allDone
            ? "bg-g"
            : hasError
              ? "bg-am"
              : "shimmer-bar bg-as/20"
        }`}
      />

      {/* Steps */}
      <div className="divide-y divide-b1">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-2.5 px-3.5 py-2">
            <div className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center">
              {statusIcon[step.status]}
            </div>
            <div className="min-w-0 flex-1">
              <div className={`text-[12px] leading-[1.5] ${statusText[step.status]}`}>
                {step.label}
              </div>
              {step.detail && (
                <div className={`mt-0.5 text-[11px] ${step.status === "error" ? "text-r/70" : "text-t4"}`}>
                  {step.detail}
                </div>
              )}
            </div>
            {step.status === "error" && onRetry && (
              <button
                onClick={() => onRetry(i)}
                className="shrink-0 text-[11px] font-medium text-blt transition-all hover:underline"
              >
                Retry
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Actions / Cancel */}
      {(onCancel || (actions && actions.length > 0)) && (
        <div className="flex items-center gap-2 border-t border-b1 px-3.5 py-2">
          {actions?.map((action, i) => (
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
              {action.label}
            </button>
          ))}
          {onCancel && !allDone && (
            <>
              <div className="flex-1" />
              <button
                onClick={onCancel}
                className="text-[11px] font-medium text-t4 transition-colors hover:text-t2"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    </CardShell>
  );
}
