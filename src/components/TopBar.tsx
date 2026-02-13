"use client";

import { SimularLogo } from "./SimularLogo";
import { AvatarMenu } from "./AvatarMenu";
import { useState } from "react";

export function TopBar({
  isZeroState,
  onOpenSettings,
  onGoHome,
}: {
  isZeroState?: boolean;
  onOpenSettings?: () => void;
  onGoHome?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex h-[50px] shrink-0 items-center border-b border-b1 px-5">
      {/* Left: logo + name (clickable → zero state) */}
      <button
        onClick={onGoHome}
        className="flex items-center gap-3 transition-opacity hover:opacity-80"
      >
        <SimularLogo size={28} />
        <span className="text-sm font-semibold text-t1">Simular</span>
      </button>

      {/* Center: trial info (zero state only) */}
      {isZeroState && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-xs text-t3">
            Free trial &ndash; 6d left
          </span>
        </div>
      )}

      {/* Right: avatar */}
      <div className="ml-auto">
        <img
          src="/avatar-peter.jpg"
          alt="Peter"
          onClick={() => setMenuOpen(!menuOpen)}
          className="h-7 w-7 cursor-pointer rounded-full object-cover transition-all hover:ring-2 hover:ring-b2"
        />
        <AvatarMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onOpenSettings={() => onOpenSettings?.()}
        />
      </div>
    </div>
  );
}
