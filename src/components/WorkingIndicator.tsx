"use client";

export function WorkingIndicator({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center">
      <div className={`mr-2 h-[7px] w-[7px] shrink-0 rounded-full ${done ? "bg-g" : "bg-g animate-pulse-dot"}`} />
      <span className={`text-[13px] font-medium ${done ? "text-t1" : "shimmer-text text-t3"}`}>
        {label}
      </span>
      {!done && <span className="blink-cursor text-[13px] font-medium text-g ml-0.5">_</span>}
    </div>
  );
}
