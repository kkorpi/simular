"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

/** Generic rename modal. Rendered via portal to document.body so it's always a single instance.
 * Enter commits, Escape / Cancel / overlay-click dismisses. Input pre-selected on mount. */
export function RenameModal({
  title = "Rename",
  description,
  label,
  initialValue,
  commitLabel = "Rename",
  onCommit,
  onCancel,
}: {
  title?: string;
  description?: string;
  label?: string;
  initialValue: string;
  commitLabel?: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleCommit = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== initialValue) onCommit(trimmed);
    else onCancel();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-overlay backdrop-blur-[4px]"
      onPointerDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="w-[360px] rounded-xl border border-b1 bg-bg2 p-4 shadow-[var(--sc)]"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="text-[13px] font-semibold text-t1 mb-1">{title}</div>
        {description && <div className="text-[12px] text-t3 mb-3">{description}</div>}
        {label && <div className="text-[12px] font-medium text-t3 mb-1.5">{label}</div>}
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); handleCommit(); }
            if (e.key === "Escape") { e.preventDefault(); onCancel(); }
          }}
          className="w-full rounded-md border border-b1 bg-bg3 px-3 py-2 text-[13px] text-t1 outline-none ring-1 ring-transparent focus:ring-as/50 caret-as"
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-[12.5px] text-t2 transition-colors hover:bg-bg3 hover:text-t1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCommit}
            className="rounded-md bg-as px-3 py-1.5 text-[12.5px] font-medium text-white transition-opacity hover:opacity-90"
          >
            {commitLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
