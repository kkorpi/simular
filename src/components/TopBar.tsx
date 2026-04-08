"use client";

import { SimularLogo } from "./SimularLogo";
import { AvatarMenu } from "./AvatarMenu";
import { useState } from "react";

export function TopBar({
  isZeroState,
  onOpenSettings,
  onGoHome,
  onOpenSubscription,
  onOpenCredits,
  onOpenDemoPicker,
  onOpenPanel,
  trialDaysLeft = 6,
  workspaceSetupLabel,
}: {
  isZeroState?: boolean;
  onOpenSettings?: () => void;
  onGoHome?: () => void;
  onOpenSubscription?: () => void;
  onOpenCredits?: () => void;
  onOpenDemoPicker?: () => void;
  onOpenPanel?: () => void;
  trialDaysLeft?: number;
  /** Shown during onboarding while workspace is setting up */
  workspaceSetupLabel?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div role="banner" className="relative z-30 flex h-[50px] shrink-0 items-center border-b border-b1 px-5">
      {/* Left: logo + name (clickable → zero state) */}
      <button
        onClick={onGoHome}
        className="relative z-10 flex items-center gap-3 transition-opacity hover:opacity-80"
      >
        <SimularLogo size={28} />
        <span className="text-sm font-semibold text-t1 max-md:hidden">Simular</span>
      </button>

      {/* Center: workspace setup progress OR trial info */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {workspaceSetupLabel ? (
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-b1 bg-bg2 px-3 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-g animate-pulse" />
            <span className="text-[11px] text-t3">{workspaceSetupLabel}</span>
          </div>
        ) : (
          <button
            onClick={onOpenSubscription}
            className={`pointer-events-auto flex items-center gap-1.5 rounded-full border px-3 py-1 transition-colors ${
              trialDaysLeft <= 1
                ? "border-amber-500/40 bg-amber-500/10 hover:border-amber-500/60 hover:bg-amber-500/15"
                : "border-b1 bg-bg2 hover:border-b2 hover:bg-bg3h"
            }`}
          >
            <div className={`h-1.5 w-1.5 rounded-full ${trialDaysLeft <= 1 ? "bg-am" : "bg-as"}`} />
            <span className={`font-mono text-[11px] max-md:text-[10px] ${trialDaysLeft <= 1 ? "text-amt" : "text-t3"}`}>
              <span className="max-md:hidden">Pro trial &ndash; {trialDaysLeft}d left</span>
              <span className="hidden max-md:inline">{trialDaysLeft}d left</span>
            </span>
          </button>
        )}
      </div>

      {/* Right: task toggle (mobile only) + avatar */}
      <div className="relative z-10 ml-auto flex items-center gap-2">
        {/* Mobile task panel toggle */}
        {onOpenPanel && (
          <button
            onClick={onOpenPanel}
            className="hidden max-md:flex items-center justify-center rounded-md p-1.5 text-t3 transition-colors hover:bg-bg3h hover:text-t1"
            title="Open tasks"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M15 3v18" />
              <path d="m10 15-3-3 3-3" />
            </svg>
          </button>
        )}
        <div className="relative">
          <img
            src="/avatar-katie.jpg"
            alt="Katie"
            aria-label="User menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-9 w-9 cursor-pointer rounded-full object-cover transition-shadow hover:ring-2 hover:ring-b2"
          />
          <AvatarMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            onOpenSettings={() => onOpenSettings?.()}
            onOpenCredits={() => onOpenCredits?.()}
            onOpenDemoPicker={() => onOpenDemoPicker?.()}
          />
        </div>
      </div>
    </div>
  );
}
