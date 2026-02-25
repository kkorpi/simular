"use client";

import { useState, type ReactNode } from "react";
import type { CardAction } from "./types";
import { CardShell } from "./CardShell";
import { ResolvedInline } from "./ResolvedInline";

export type PromptSeverity = "info" | "warning" | "destructive";

export interface PromptCardProps {
  message: ReactNode;
  actions: CardAction[];
  icon?: ReactNode;
  variant?: "standard" | "compact";
  /** Severity level — controls visual treatment */
  severity?: PromptSeverity;
  /** Shown below message for warning/destructive */
  consequence?: string;
  /** Requires user to type this text before the primary action enables */
  confirmText?: string;
  /** Collapsed resolved text after action taken */
  resolvedMessage?: string;
}

const severityAccent = {
  info: "default" as const,
  warning: "amber" as const,
  destructive: "default" as const,
};

export function PromptCard({
  message,
  actions,
  icon,
  variant = "standard",
  severity,
  consequence,
  confirmText,
  resolvedMessage,
}: PromptCardProps) {
  const [typedConfirm, setTypedConfirm] = useState("");
  const [resolved, setResolved] = useState(false);

  const isConfirmed = !confirmText || typedConfirm.trim().toLowerCase() === confirmText.trim().toLowerCase();

  const handleAction = (action: CardAction) => {
    action.onClick();
    if (resolvedMessage) setResolved(true);
  };

  if (resolved) {
    return <ResolvedInline icon="check" message={resolvedMessage!} />;
  }

  // Compact variant (unchanged from original, no severity support)
  if (variant === "compact") {
    return (
      <div className="mt-2.5 flex max-w-[520px] items-center gap-2.5 rounded-lg border border-b1 bg-bgcard p-3">
        {icon && (
          <div className="flex h-4 w-4 shrink-0 items-center justify-center text-t3">
            {icon}
          </div>
        )}
        <div className="flex-1 text-[13px] leading-[1.5] text-t2">
          {message}
        </div>
        <div className="flex gap-1.5">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleAction(action)}
              className={
                action.style === "primary"
                  ? "rounded-md border border-transparent bg-gs px-2.5 py-1 text-[11.5px] font-medium text-gt"
                  : "rounded-md border border-b1 bg-transparent px-2.5 py-1 text-[11.5px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1"
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Standard with severity
  if (severity) {
    const isDestructive = severity === "destructive";
    return (
      <CardShell accent={severityAccent[severity]}>
        {/* Icon + message */}
        <div className="flex items-start gap-2.5 px-3.5 py-3">
          <div className={`mt-0.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md ${
            isDestructive ? "bg-r/10 text-r" : severity === "warning" ? "bg-am/10 text-am" : "bg-bg3h text-t3"
          }`}>
            {icon ?? (
              isDestructive ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              ) : severity === "warning" ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              ) : null
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm leading-[1.65] text-t2">{message}</div>
            {consequence && (
              <div className={`mt-2 rounded-md px-3 py-2 text-[12px] leading-[1.5] ${
                isDestructive
                  ? "bg-r/[0.06] text-r/80 border border-r/10"
                  : "bg-am/[0.06] text-am border border-am/10"
              }`}>
                {consequence}
              </div>
            )}
          </div>
        </div>

        {/* Confirm text input */}
        {confirmText && (
          <div className="border-t border-b1 px-3.5 py-2.5">
            <div className="text-[11px] text-t3 mb-1.5">
              Type <span className="font-semibold text-t1">{confirmText}</span> to confirm
            </div>
            <input
              type="text"
              value={typedConfirm}
              onChange={(e) => setTypedConfirm(e.target.value)}
              placeholder={confirmText}
              className="w-full rounded-md border border-b1 bg-bg3 px-3 py-1.5 text-[12px] text-t1 outline-none placeholder:text-t4 transition-all focus:border-as"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-b1 px-3.5 py-2">
          {actions.map((action, i) => {
            const isPrimary = action.style === "primary";
            const disabled = isPrimary && !isConfirmed;
            return (
              <button
                key={i}
                onClick={() => !disabled && handleAction(action)}
                disabled={disabled}
                className={
                  isPrimary
                    ? isDestructive
                      ? `rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                          disabled ? "bg-r/20 text-r/40 cursor-not-allowed" : "bg-r text-white hover:brightness-110"
                        }`
                      : `rounded-md bg-ab px-2.5 py-1 text-xs font-medium text-abt transition-all ${
                          disabled ? "opacity-40 cursor-not-allowed" : "hover:brightness-110"
                        }`
                    : action.style === "outline"
                      ? "rounded-md border border-b1 bg-transparent px-2.5 py-1 text-xs font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1"
                      : "text-[11px] font-medium text-blt transition-all hover:underline"
                }
              >
                {action.icon && <span className="mr-1 inline-flex">{action.icon}</span>}
                {action.label}
              </button>
            );
          })}
        </div>
      </CardShell>
    );
  }

  // Standard variant (no severity — original behavior)
  return (
    <div>
      <div className="text-sm leading-[1.65] text-t2">{message}</div>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleAction(action)}
            className={
              action.style === "primary"
                ? "flex cursor-pointer items-center gap-1.5 rounded-md bg-ab px-3 py-1.5 text-[12.5px] font-medium text-abt transition-all hover:brightness-110"
                : action.style === "outline"
                  ? "flex cursor-pointer items-center gap-1.5 rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12.5px] font-medium text-t2 transition-all hover:border-b2 hover:bg-bg3h hover:text-t1"
                  : "text-[12.5px] font-medium text-blt transition-all hover:underline"
            }
          >
            {action.icon && <span className="inline-flex">{action.icon}</span>}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
