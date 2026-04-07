"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { CardShell } from "./CardShell";
import { ResolvedInline } from "./ResolvedInline";

export interface SafetyCheckCardProps {
  /** What action is being attempted */
  actionLabel: string;
  /** Why this action is flagged / what will happen */
  reason: string;
  /** Badge text — defaults to "Safety Check" */
  badge?: string;
  onDeny: () => void;
  onAllow: () => void;
  /** When set, card collapses to ResolvedInline after action */
  resolvedMessage?: string;
}

export function SafetyCheckCard({
  actionLabel,
  reason,
  badge = "Safety Check",
  onDeny,
  onAllow,
  resolvedMessage,
}: SafetyCheckCardProps) {
  const [state, setState] = useState<"idle" | "denied" | "allowed">("idle");

  const handleDeny = () => {
    onDeny();
    setState("denied");
  };

  const handleAllow = () => {
    onAllow();
    setState("allowed");
  };

  if (state === "denied") {
    return <ResolvedInline icon="x" message="Action denied" />;
  }

  if (state === "allowed") {
    return <ResolvedInline icon="check" message={resolvedMessage ?? "Action allowed"} />;
  }

  return (
    <CardShell accent="amber">
      {/* Header: icon + action label + badge */}
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-am/10 text-am">
          <ShieldAlert className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 text-[13px] font-semibold text-t1">{actionLabel}</div>
        <span className="shrink-0 rounded-full bg-am/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-am">
          {badge}
        </span>
      </div>

      {/* Reason / consequence */}
      <div className="border-t border-b1 px-3.5 py-2.5">
        <div className="text-[13px] leading-[1.6] text-t2">
          {reason}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-b1 px-3.5 py-2">
        <button
          onClick={handleDeny}
          className="rounded-md border border-b1 bg-transparent px-2.5 py-1 text-xs font-medium text-t2 transition-colors hover:bg-bg3h hover:text-t1"
        >
          Deny
        </button>
        <button
          onClick={handleAllow}
          className="rounded-md bg-am px-2.5 py-1 text-xs font-medium text-white transition-colors hover:brightness-110"
        >
          Allow Once
        </button>
        <button
          onClick={handleAllow}
          className="rounded-md border border-am/40 bg-am/10 px-2.5 py-1 text-xs font-medium text-am transition-colors hover:bg-am/20"
        >
          Always Allow
        </button>
      </div>
    </CardShell>
  );
}
