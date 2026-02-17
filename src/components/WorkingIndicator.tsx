"use client";

export function WorkingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center">
      <div className="mr-2 h-[7px] w-[7px] shrink-0 rounded-full bg-g animate-pulse-dot" />
      <span className="shimmer-text text-[13px] font-medium text-t3">
        {label}
      </span>
      <span className="blink-cursor text-[13px] font-medium text-g ml-0.5">_</span>
    </div>
  );
}
