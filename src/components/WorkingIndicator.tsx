"use client";

import { useState, useEffect, useRef } from "react";

export function WorkingIndicator({ label, done }: { label: string; done?: boolean }) {
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
    <div className="flex items-center">
      {done ? (
        <svg className="mr-1.5 h-3.5 w-3.5 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      ) : (
        <div className="mr-2 h-[14px] w-[14px] shrink-0 rounded-full border-2 border-g/30 border-t-g animate-spin" />
      )}
      <span
        className={`text-[13px] font-medium transition-opacity duration-200 ${done ? "text-t2" : "text-t3 shimmer-text"} ${fading ? "opacity-0" : "opacity-100"}`}
      >
        {displayLabel}
      </span>
    </div>
  );
}
