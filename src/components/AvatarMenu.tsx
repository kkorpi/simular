"use client";

import { useEffect, useRef } from "react";

interface AvatarMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenCredits?: () => void;
  onOpenDemoPicker?: () => void;
}

export function AvatarMenu({ open, onClose, onOpenSettings, onOpenCredits, onOpenDemoPicker }: AvatarMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("pointerdown", handle);
    return () => document.removeEventListener("pointerdown", handle);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      role="menu"
      className="absolute right-5 top-[46px] z-50 w-[220px] overflow-hidden rounded-lg border border-b1 bg-bg2 shadow-[var(--sc)]"
    >
      {/* Profile */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <img
          src="/avatar-katie.jpg"
          alt="Katie"
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-t1">Katie Chen</div>
          <div className="text-[11.5px] text-t3">katie@simular.ai</div>
        </div>
      </div>

      <div className="h-px bg-b1" />

      {/* Menu items */}
      <div className="py-1.5">
        <MenuItem
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          }
          label="Credits"
          trailing="$8.88"
          onClick={() => {
            onClose();
            onOpenCredits?.();
          }}
        />
        <MenuItem
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          }
          label="Settings"
          onClick={() => {
            onClose();
            onOpenSettings();
          }}
        />
      </div>

      <div className="h-px bg-b1" />

      {/* Demo picker */}
      <div className="py-1.5">
        <MenuItem
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          }
          label="Demo picker"
          trailing="⌘⇧D"
          trailingBadge
          onClick={() => {
            onClose();
            onOpenDemoPicker?.();
          }}
        />
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  trailing,
  trailingBadge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: string;
  trailingBadge?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-t2 transition-colors hover:bg-bg3 hover:text-t1"
    >
      <span className="text-t3">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {trailing && (
        trailingBadge ? (
          <span className="rounded border border-b1 bg-bg3 px-1.5 py-0.5 text-[11px] text-t3">{trailing}</span>
        ) : (
          <span className="text-[11px] text-t3">{trailing}</span>
        )
      )}
    </button>
  );
}
