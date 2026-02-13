"use client";

import { useEffect, useRef } from "react";

interface AvatarMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export function AvatarMenu({ open, onClose, onOpenSettings }: AvatarMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-5 top-[46px] z-50 w-[220px] overflow-hidden rounded-xl border border-b1 bg-bg2 shadow-[var(--sc)]"
    >
      {/* Profile */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <img
          src="/avatar-peter.jpg"
          alt="Peter"
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-t1">Peter Gao</div>
          <div className="text-[11.5px] text-t3">peter@simular.ai</div>
        </div>
      </div>

      <div className="h-px bg-b1" />

      {/* Menu items */}
      <div className="py-1.5">
        <MenuItem
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M7 15h0M2 9.5h20" />
            </svg>
          }
          label="Subscription"
        />
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

      <div className="py-1.5">
        <MenuItem
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          }
          label="Log out"
        />
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  trailing,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-t2 transition-all hover:bg-bg3 hover:text-t1"
    >
      <span className="text-t3">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {trailing && (
        <span className="text-[12px] text-t3">{trailing}</span>
      )}
    </button>
  );
}
