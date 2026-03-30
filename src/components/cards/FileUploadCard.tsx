"use client";

import { CardShell, type CardAccent } from "./CardShell";

/* ── Types ── */

export type FileUploadStatus = "uploading" | "downloading" | "complete" | "error";

export interface FileUploadCardProps {
  filename: string;
  size: string;
  progress: number;
  status: FileUploadStatus;
  accent?: CardAccent;
  onCancel?: () => void;
}

/* ── Component ── */

export function FileUploadCard({
  filename,
  size,
  progress,
  status,
  accent = "default",
  onCancel,
}: FileUploadCardProps) {
  const isActive = status === "uploading" || status === "downloading";

  return (
    <CardShell accent={accent}>
      <div className="flex items-start gap-2.5 px-3.5 py-3">
        {/* Icon */}
        <div className={`mt-0.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md ${status === "complete" ? "bg-g/10 text-g" : status === "error" ? "bg-rd/10 text-rd" : "bg-as/10 text-as"}`}>
          {status === "complete" ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-t1 truncate">{filename}</div>
          <div className="mt-0.5 text-[11px] text-t3">{size}</div>

          {/* Progress bar */}
          {isActive && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg3h">
              <div
                className="h-full rounded-full bg-as transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}

          {status === "error" && (
            <div className="mt-1 text-[11px] text-rd">Transfer failed</div>
          )}
        </div>
      </div>

      {/* Cancel action */}
      {isActive && onCancel && (
        <div className="flex items-center gap-2 border-t border-b1 px-3.5 py-2">
          <button
            onClick={onCancel}
            className="text-[11px] font-medium text-blt transition-all hover:underline"
          >
            Cancel
          </button>
        </div>
      )}
    </CardShell>
  );
}
