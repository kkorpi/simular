"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { workspaceSteps } from "@/data/mockData";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const PADDING = 16;

function getCornerPosition(corner: Corner, container: DOMRect, panel: DOMRect) {
  switch (corner) {
    case "top-left":
      return { x: PADDING, y: PADDING };
    case "top-right":
      return { x: container.width - panel.width - PADDING, y: PADDING };
    case "bottom-left":
      return { x: PADDING, y: container.height - panel.height - PADDING };
    case "bottom-right":
      return { x: container.width - panel.width - PADDING, y: container.height - panel.height - PADDING };
  }
}

function nearestCorner(x: number, y: number, container: DOMRect, panel: DOMRect): Corner {
  const cx = x + panel.width / 2;
  const cy = y + panel.height / 2;
  const midX = container.width / 2;
  const midY = container.height / 2;
  if (cx < midX) {
    return cy < midY ? "top-left" : "bottom-left";
  }
  return cy < midY ? "top-right" : "bottom-right";
}

export function FullWorkspaceView({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [stepsVisible, setStepsVisible] = useState(true);
  const [corner, setCorner] = useState<Corner>("bottom-left");
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ mouseX: number; mouseY: number; panelX: number; panelY: number } | null>(null);

  // Compute snapped position for current corner
  const getSnappedPos = useCallback(() => {
    if (!containerRef.current || !panelRef.current) return { x: PADDING, y: 0 };
    return getCornerPosition(corner, containerRef.current.getBoundingClientRect(), panelRef.current.getBoundingClientRect());
  }, [corner]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !panelRef.current) return;
    e.preventDefault();
    const containerRect = containerRef.current.getBoundingClientRect();
    const panelRect = panelRef.current.getBoundingClientRect();
    const panelX = panelRect.left - containerRect.left;
    const panelY = panelRect.top - containerRect.top;
    dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, panelX, panelY };
    setDragPos({ x: panelX, y: panelY });
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart.current || !containerRef.current || !panelRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const panelRect = panelRef.current.getBoundingClientRect();
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;
      const newX = Math.max(PADDING, Math.min(containerRect.width - panelRect.width - PADDING, dragStart.current.panelX + dx));
      const newY = Math.max(PADDING, Math.min(containerRect.height - panelRect.height - PADDING, dragStart.current.panelY + dy));
      setDragPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (dragPos && containerRef.current && panelRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const panelRect = panelRef.current.getBoundingClientRect();
        const snappedCorner = nearestCorner(dragPos.x, dragPos.y, containerRect, panelRect);
        setCorner(snappedCorner);
      }
      setDragging(false);
      setDragPos(null);
      dragStart.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragPos]);

  // Build style for the steps panel
  const panelStyle = (): React.CSSProperties => {
    if (dragging && dragPos) {
      return { left: dragPos.x, top: dragPos.y, transition: "none" };
    }
    // Snapped corner position — use CSS classes instead for cleaner transitions
    // But we need dynamic positioning, so compute it
    const pos = getSnappedPos();
    return { left: pos.x, top: pos.y, transition: "left 0.3s ease-out, top 0.3s ease-out, opacity 0.2s, transform 0.2s" };
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col bg-bg transition-all duration-300 ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      {/* Bar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-b1 px-5 py-2.5">
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded-lg p-1 text-t3 transition-all hover:bg-bg3 hover:text-t1"
          title="Close workspace"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
        <div className="flex items-center gap-1.5 text-xs font-medium text-t2">
          <div className="h-1.5 w-1.5 rounded-full bg-g animate-running-glow" />
          Workspace online
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="text-xs text-t3">
            Working on:{" "}
            <strong className="font-semibold text-t1">
              Research inbound founder
            </strong>{" "}
            (2:18)
          </div>
          {/* Steps toggle */}
          <button
            onClick={() => setStepsVisible((v) => !v)}
            className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
              stepsVisible
                ? "bg-bg3 text-t2"
                : "text-t4 hover:bg-bg3 hover:text-t2"
            }`}
            title={stepsVisible ? "Hide steps" : "Show steps"}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Steps
          </button>
        </div>
      </div>

      {/* Screen area */}
      <div ref={containerRef} className="relative flex flex-1 items-center justify-center overflow-hidden bg-bg3">
        {/* LIVE badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[9px] font-semibold text-g backdrop-blur-sm">
          <div className="h-1 w-1 rounded-full bg-g" />
          LIVE
        </div>

        {/* Placeholder content */}
        <div className="flex flex-col items-center text-center text-[13px] text-t4">
          <svg className="mb-2 h-6 w-6 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
          LinkedIn - Founder Profile
          <br />
          <br />
          <span className="text-[11px] text-t4">
            Your coworker is reviewing the inbound founder&apos;s LinkedIn,
            <br />
            pulling background, experience, and mutual connections.
          </span>
        </div>

        {/* Floating steps overlay — draggable, snaps to corners */}
        <div
          ref={panelRef}
          onMouseDown={handleMouseDown}
          style={panelStyle()}
          className={`absolute w-[300px] rounded-xl bg-black/70 backdrop-blur-md select-none ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          } ${
            stepsVisible
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 px-3.5 pt-3 pb-1">
            <span className="text-[10px] font-semibold tracking-wide text-t3 uppercase">Steps</span>
            {/* Drag hint */}
            <svg className="h-3 w-3 text-t4/50" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="5" r="1.5" />
              <circle cx="15" cy="5" r="1.5" />
              <circle cx="9" cy="12" r="1.5" />
              <circle cx="15" cy="12" r="1.5" />
              <circle cx="9" cy="19" r="1.5" />
              <circle cx="15" cy="19" r="1.5" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5 px-3.5 pb-3">
            {workspaceSteps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 rounded-md px-1.5 py-1.5 ${
                  step.status === "pending" ? "opacity-40" : ""
                }`}
              >
                {step.status === "done" ? (
                  <svg className="h-3.5 w-3.5 shrink-0 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : step.status === "active" ? (
                  <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                    <div className="h-[7px] w-[7px] rounded-full bg-g shadow-[0_0_6px_var(--gg)] animate-pulse-dot" />
                  </div>
                ) : (
                  <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                    <div className="h-[5px] w-[5px] rounded-full bg-t4" />
                  </div>
                )}
                <span
                  className={`text-[11.5px] leading-snug ${
                    step.status === "done"
                      ? "text-t3"
                      : step.status === "active"
                        ? "text-t1 font-medium"
                        : "text-t4"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center gap-[18px] border-t border-b1 px-5 py-2.5">
        <div className="flex items-center gap-[5px] text-[11px] text-t3">
          <svg
            className="h-3 w-3 text-g"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Credentials stay in your workspace
        </div>
        <div className="flex items-center gap-[5px] text-[11px] text-t3">
          <svg
            className="h-3 w-3 text-g"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Private instance
        </div>
        <div className="flex items-center gap-[5px] text-[11px] text-t3">
          <svg
            className="h-3 w-3 text-g"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          All activity logged
        </div>
      </div>
    </div>
  );
}
