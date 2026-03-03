"use client";

export function WorkingIndicator({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center">
      {done ? (
        <div className="mr-2 h-[7px] w-[7px] shrink-0 rounded-full bg-t4" />
      ) : (
        <div className="mr-2 h-[14px] w-[14px] shrink-0 rounded-full border-2 border-g/30 border-t-g animate-spin" />
      )}
      <span className={`text-[13px] font-medium ${done ? "text-t2" : "text-t3 shimmer-text"}`}>
        {label}
      </span>
    </div>
  );
}
