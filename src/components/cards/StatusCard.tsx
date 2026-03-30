"use client";

import { CardShell, type CardAccent } from "./CardShell";

/* ── Types ── */

export type ConnectionStatus = "connected" | "expired" | "disconnected" | "error";

export interface StatusCardProps {
  service: string;
  status: ConnectionStatus;
  lastSync: string;
  accent?: CardAccent;
  onReconnect?: () => void;
}

/* ── Status styling ── */

const statusDot: Record<ConnectionStatus, string> = {
  connected: "bg-g",
  expired: "bg-am",
  disconnected: "bg-t3",
  error: "bg-rd",
};

const statusLabel: Record<ConnectionStatus, string> = {
  connected: "Connected",
  expired: "Expired",
  disconnected: "Disconnected",
  error: "Error",
};

/* ── Component ── */

export function StatusCard({
  service,
  status,
  lastSync,
  accent = "default",
  onReconnect,
}: StatusCardProps) {
  const showReconnect = status !== "connected" && onReconnect;

  return (
    <CardShell accent={accent}>
      <div className="flex items-start gap-2.5 px-3.5 py-3">
        {/* Status dot */}
        <div className="mt-0.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-bg3h">
          <span className={`h-2.5 w-2.5 rounded-full ${statusDot[status]}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-t1">{service}</div>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-[12px] text-t2">{statusLabel[status]}</span>
            <span className="text-[11px] text-t3">{lastSync}</span>
          </div>
        </div>
      </div>

      {/* Reconnect action */}
      {showReconnect && (
        <div className="flex items-center gap-2 border-t border-b1 px-3.5 py-2">
          <button
            onClick={onReconnect}
            className="rounded-md bg-ab px-2.5 py-1 text-xs font-medium text-abt transition-colors hover:brightness-110"
          >
            Reconnect
          </button>
        </div>
      )}
    </CardShell>
  );
}
