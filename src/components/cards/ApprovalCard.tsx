"use client";

import { CardShell, type CardAccent } from "./CardShell";
import type { CardAction } from "./types";

/* ── Types ── */

export interface Approver {
  name: string;
  status: "pending" | "approved" | "rejected";
}

export interface ApprovalCardProps {
  title: string;
  description: string;
  approvers: Approver[];
  accent?: CardAccent;
  onApprove: () => void;
  onReject: () => void;
}

/* ── Status dot colors ── */

const statusDot: Record<Approver["status"], string> = {
  pending: "bg-t3",
  approved: "bg-g",
  rejected: "bg-rd",
};

const statusLabel: Record<Approver["status"], string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

/* ── Component ── */

export function ApprovalCard({
  title,
  description,
  approvers,
  accent = "default",
  onApprove,
  onReject,
}: ApprovalCardProps) {
  return (
    <CardShell accent={accent}>
      {/* Header */}
      <div className="flex items-start gap-2.5 px-3.5 py-3">
        <div className="mt-0.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-as/10 text-as">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-t1">{title}</div>
          <div className="mt-1 text-[12px] leading-[1.6] text-t2">{description}</div>
        </div>
      </div>

      {/* Approver list */}
      <div className="border-t border-b1 px-3.5 py-2">
        <div className="space-y-1.5">
          {approvers.map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px]">
              <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot[a.status]}`} />
              <span className="text-t2">{a.name}</span>
              <span className="ml-auto text-[11px] text-t3">{statusLabel[a.status]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-b1 px-3.5 py-2">
        <button
          onClick={onApprove}
          className="rounded-md bg-ab px-2.5 py-1 text-xs font-medium text-abt transition-colors hover:brightness-110"
        >
          Approve
        </button>
        <button
          onClick={onReject}
          className="rounded-md border border-b1 bg-transparent px-2.5 py-1 text-xs font-medium text-t2 transition-colors hover:bg-bg3h hover:text-t1"
        >
          Reject
        </button>
      </div>
    </CardShell>
  );
}
