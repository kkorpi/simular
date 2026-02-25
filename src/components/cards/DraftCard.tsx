"use client";

import { useState, useRef, useEffect } from "react";
import { CardShell, type CardAccent } from "./CardShell";
import { ResolvedInline } from "./ResolvedInline";

/* ── Field types ── */

export type DraftField =
  | { type: "text"; label?: string; value: string; editable?: boolean }
  | { type: "header"; label: string; value: string; editable?: boolean }
  | { type: "readonly"; label: string; value: string }
  | { type: "chips"; label: string; values: string[] };

export interface DraftCardProps {
  intent: string;
  fields: DraftField[];
  approveLabel?: string;
  denyLabel?: string;
  accent?: CardAccent;
  onApprove: (fields: DraftField[]) => void;
  onDeny: () => void;
  onOpenWorkspace?: () => void;
  resolvedMessage?: string;
}

export function DraftCard({
  intent,
  fields: initialFields,
  approveLabel = "Send",
  denyLabel = "Cancel",
  accent = "amber",
  onApprove,
  onDeny,
  onOpenWorkspace,
  resolvedMessage,
}: DraftCardProps) {
  const [mode, setMode] = useState<"review" | "editing" | "approved" | "denied">("review");
  const [fields, setFields] = useState<DraftField[]>(initialFields);
  const [collapsing, setCollapsing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus first editable text field when entering edit mode
  useEffect(() => {
    if (mode === "editing" && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [mode]);

  const handleResolve = (type: "approved" | "denied") => {
    setCollapsing(true);
    setTimeout(() => {
      setMode(type);
      if (type === "approved") onApprove(fields);
      else onDeny();
    }, 400);
  };

  const updateField = (index: number, value: string) => {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, value } : f))
    );
  };

  // ── Resolved states ──
  if (mode === "approved") {
    return <ResolvedInline icon="check" message={resolvedMessage ?? "Done"} />;
  }
  if (mode === "denied") {
    return <ResolvedInline icon="x" message="Action skipped" />;
  }

  // ── Editing state ──
  if (mode === "editing") {
    return (
      <CardShell accent="default">
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-b1 px-4 py-3">
          <svg className="h-3.5 w-3.5 shrink-0 text-blt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span className="text-[13px] font-medium text-t1">Edit draft</span>
        </div>

        {/* Editable fields */}
        <div className="space-y-2 px-4 py-3">
          {fields.map((field, i) => {
            if (field.type === "readonly" || field.type === "chips") {
              return (
                <div key={i} className="flex gap-2 text-[12px]">
                  <span className="w-16 shrink-0 text-t3">{field.type === "chips" ? field.label : field.label}</span>
                  <span className="text-t2">
                    {field.type === "chips" ? field.values.join(", ") : field.value}
                  </span>
                </div>
              );
            }
            if (field.type === "header") {
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-16 shrink-0 text-[12px] text-t3">{field.label}</span>
                  {field.editable !== false ? (
                    <input
                      value={field.value}
                      onChange={(e) => updateField(i, e.target.value)}
                      className="flex-1 rounded-md border border-b1 bg-bg3 px-3 py-1.5 text-[13px] text-t1 transition-colors focus:border-as focus:outline-none"
                    />
                  ) : (
                    <span className="text-[13px] text-t1">{field.value}</span>
                  )}
                </div>
              );
            }
            // text field
            return (
              <div key={i}>
                {field.label && (
                  <div className="mb-1 text-[12px] text-t3">{field.label}</div>
                )}
                {field.editable !== false ? (
                  <textarea
                    ref={i === fields.findIndex((f) => f.type === "text" && f.editable !== false) ? textareaRef : undefined}
                    value={field.value}
                    onChange={(e) => {
                      updateField(i, e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    className="w-full resize-none rounded-md border border-b1 bg-bg3 px-4 py-3 text-[13px] leading-[1.7] text-t1 transition-colors focus:border-as focus:outline-none"
                    rows={3}
                  />
                ) : (
                  <div className="rounded-md border border-b1 bg-bg3 px-4 py-3 text-[13px] leading-[1.7] text-t2">
                    {field.value}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-b1 px-4 py-3">
          <button
            onClick={() => {
              setFields(initialFields);
              setMode("review");
            }}
            className="rounded-md border border-b1 bg-bg2 px-3.5 py-1.5 text-[13px] font-medium text-t2 transition-colors hover:bg-bg3"
          >
            Cancel
          </button>
          {onOpenWorkspace && (
            <button
              onClick={onOpenWorkspace}
              className="flex items-center gap-1.5 rounded-md border border-b1 bg-bg2 px-3.5 py-1.5 text-[13px] font-medium text-t2 transition-colors hover:bg-bg3"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              Edit in workspace
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={() => handleResolve("approved")}
            className="rounded-md bg-g px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:brightness-110"
          >
            {approveLabel}
          </button>
        </div>
      </CardShell>
    );
  }

  // ── Review state ──
  return (
    <div
      className={`transition-all duration-400 ${
        collapsing ? "max-h-0 opacity-0 overflow-hidden" : "max-h-[800px] opacity-100"
      }`}
    >
      <CardShell accent={accent}>
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-am/20 px-4 py-3">
          <div className="h-2 w-2 shrink-0 rounded-full bg-am" />
          <span className="text-[13px] font-medium text-t1">{intent}</span>
        </div>

        {/* Fields preview */}
        <div className="space-y-1 px-4 py-3">
          {fields.map((field, i) => {
            if (field.type === "chips") {
              return (
                <div key={i} className="flex items-start gap-2 text-[12px]">
                  <span className="w-16 shrink-0 text-t3">{field.label}</span>
                  <div className="flex flex-wrap gap-1">
                    {field.values.map((v, j) => (
                      <span key={j} className="rounded-full bg-bg3h px-2 py-0.5 text-[11px] text-t2">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }
            if (field.type === "header" || field.type === "readonly") {
              return (
                <div key={i} className="flex gap-2 text-[12px]">
                  <span className="w-16 shrink-0 text-t3">{field.label}</span>
                  <span className="text-t1">{field.value}</span>
                </div>
              );
            }
            // text field
            return (
              <div key={i} className="rounded-md border border-b1 bg-bg3 px-4 py-3">
                {field.label && (
                  <div className="mb-1 text-[11px] text-t3">{field.label}</div>
                )}
                <p className="text-[13px] leading-[1.7] text-t2 whitespace-pre-wrap">
                  {field.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-am/20 px-4 py-3">
          <button
            onClick={() => setMode("editing")}
            className="rounded-md border border-b1 bg-bg2 px-3.5 py-1.5 text-[13px] font-medium text-t2 transition-colors hover:bg-bg3"
          >
            Edit first
          </button>
          <button
            onClick={() => handleResolve("denied")}
            className="rounded-md border border-b1 bg-bg2 px-3.5 py-1.5 text-[13px] font-medium text-t2 transition-colors hover:bg-bg3"
          >
            {denyLabel}
          </button>
          <button
            onClick={() => handleResolve("approved")}
            className="rounded-md bg-g px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:brightness-110"
          >
            {approveLabel}
          </button>
        </div>
      </CardShell>
    </div>
  );
}
