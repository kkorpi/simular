"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Task } from "@/data/mockData";

function StatusDot({ status }: { status: Task["status"] }) {
  if (status === "running")
    return <div className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-g animate-running-glow" />;
  if (status === "queued")
    return <div className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-g opacity-40" />;
  if (status === "recurring")
    return <div className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-am" />;
  return <div className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-t4" />;
}

function HoverThumbnail({ task, anchorRef }: { task: Task; anchorRef: React.RefObject<HTMLDivElement | null> }) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({
      top: rect.top + rect.height / 2 - 90,
      right: window.innerWidth - rect.left + 12,
    });
  }, [anchorRef]);

  if (!pos) return null;

  const isRunning = task.status === "running";
  const isCompleted = task.status === "completed";
  const isRecurring = task.status === "recurring";
  const dotColor = isRunning ? "bg-g" : isCompleted ? "bg-t4" : "bg-am";
  const statusLabel = isRunning
    ? "Active - using screen now"
    : isCompleted
      ? "Completed - final state"
      : isRecurring
        ? task.thumbLabel || "Last run"
        : task.thumbLabel || "Queued - will start next";

  return createPortal(
    <div
      className="pointer-events-none fixed z-[100] w-[220px] animate-hover-thumb-enter"
      style={{ top: pos.top, right: pos.right }}
    >
      <div className="overflow-hidden rounded-[10px] border border-b2 bg-bg3 shadow-[var(--thumb-shadow)]">
        <div className="relative flex aspect-video items-center justify-center border-b border-b1 bg-bg">
          {isRunning && (
            <div className="absolute top-1 right-1 flex items-center gap-[3px] rounded-full bg-black/65 px-1.5 py-px text-[8px] font-semibold text-g">
              <div className="h-[3px] w-[3px] rounded-full bg-g" />
              LIVE
            </div>
          )}
          {isRecurring && (
            <div className="absolute top-1 right-1 flex items-center gap-[3px] rounded-full bg-black/65 px-1.5 py-px text-[8px] font-semibold text-am">
              LAST RUN
            </div>
          )}
          {isCompleted && (
            <div className="absolute top-1 right-1 flex items-center gap-[3px] rounded-full bg-black/65 px-1.5 py-px text-[8px] font-semibold text-t3">
              DONE
            </div>
          )}
          <div className="whitespace-pre-line text-center text-[10px] text-t4">
            {task.thumbEmoji} {task.thumbStatus}
          </div>
        </div>
        <div className="flex items-center gap-[5px] px-2.5 py-1.5 text-[10.5px] text-t2">
          <div className={`h-1 w-1 shrink-0 rounded-full ${dotColor}`} />
          <span>{statusLabel}</span>
        </div>
        {task.thumbSite && (
          <div className="px-2.5 pb-1.5 font-mono text-[9px] text-t4">{task.thumbSite}</div>
        )}
      </div>
    </div>,
    document.body
  );
}

export function TaskItem({ task, onClick }: { task: Task; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="group relative flex cursor-pointer items-start gap-2 rounded-lg px-2.5 py-2 transition-all hover:bg-bg3"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <StatusDot status={task.status} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium text-t1">{task.name}</div>
        <div className="text-[10.5px] text-t3">{task.subtitle}</div>
        {task.status !== "recurring" && task.integrations && task.integrations.length > 0 && (
          <div className="mt-0.5 truncate text-[10px] text-t4">
            {task.integrations.join(" · ")}
          </div>
        )}
      </div>
      <div className="mt-px shrink-0 font-mono text-[10.5px] text-t4">{task.time}</div>
      {hovered && task.thumbEmoji && <HoverThumbnail task={task} anchorRef={ref} />}
    </div>
  );
}
