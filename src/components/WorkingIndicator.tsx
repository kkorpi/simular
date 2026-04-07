"use client";

import { useState, useEffect, useRef } from "react";
import { Hand } from "lucide-react";

export function WorkingIndicator({ label, done, authWaiting, guardrail }: { label: string; done?: boolean; authWaiting?: boolean; guardrail?: boolean }) {
  const [displayLabel, setDisplayLabel] = useState(label);
  const [fading, setFading] = useState(false);
  const pendingLabel = useRef(label);

  useEffect(() => {
    if (label === displayLabel) return;
    pendingLabel.current = label;
    setFading(true);
    const timer = setTimeout(() => {
      setDisplayLabel(pendingLabel.current);
      setFading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [label, displayLabel]);

  return (
    <div role="status" aria-live="polite" className="flex items-center">
      {done ? (
        <svg className="mr-1.5 h-3.5 w-3.5 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      ) : authWaiting ? (
        <svg className="mr-1.5 h-3.5 w-3.5 shrink-0 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      ) : guardrail ? (
        <Hand className="mr-1.5 h-3.5 w-3.5 shrink-0 text-am animate-pulse" />
      ) : (
        <div className="mr-2 h-[14px] w-[14px] shrink-0 rounded-full border-2 border-g/30 border-t-g animate-spin" />
      )}
      <span
        className={`text-[13px] font-medium transition-opacity duration-200 ${done ? "text-t2" : guardrail ? "text-am shimmer-text-amber" : "text-t3 shimmer-text"} ${fading ? "opacity-0" : "opacity-100"}`}
      >
        {displayLabel}
      </span>
    </div>
  );
}
