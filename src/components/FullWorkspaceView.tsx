"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { workspaceSteps, loginSteps, loginSuccessSteps, teachSteps } from "@/data/mockData";

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
  onLoginSuccess,
  mode,
  service,
  instruction,
  teachTaskName,
  onDoneTeach,
}: {
  open: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  mode?: "default" | "login" | "teach";
  service?: string;
  /** Persistent instruction from the agent, shown as a banner below the coaching bar */
  instruction?: string;
  /** Name of the task being taught — shown in the header bar */
  teachTaskName?: string;
  /** Called when user clicks "Done" in teach mode */
  onDoneTeach?: () => void;
}) {
  const [stepsVisible, setStepsVisible] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Reset login success state when workspace closes
  useEffect(() => {
    if (!open) {
      setLoginSuccess(false);
      setCountdown(5);
    }
  }, [open]);

  // Countdown timer after login success
  useEffect(() => {
    if (!loginSuccess) return;
    if (countdown <= 0) {
      onLoginSuccess?.();
      onClose();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [loginSuccess, countdown, onClose, onLoginSuccess]);

  const handleLoginSubmit = () => {
    setLoginSuccess(true);
    setCountdown(5);
  };

  const [corner, setCorner] = useState<Corner>("top-left");

  const activeSteps = mode === "teach"
    ? teachSteps
    : mode === "login"
      ? (loginSuccess ? loginSuccessSteps : loginSteps)
      : workspaceSteps;
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
      className={`fixed inset-0 z-[60] flex flex-col bg-bg transition-[clip-path,opacity] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      style={{
        clipPath: open
          ? "inset(0 0 0 0 round 0px)"
          : "inset(0 0 100% 100% round 12px)",
      }}
    >
      {/* Bar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-b1 px-5 py-2.5">
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded-md p-1 text-t3 transition-all hover:bg-bg3 hover:text-t1"
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
          {mode === "teach" ? (
            <>
              <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-running-glow" />
              <span className="text-violet-500">Learning mode</span>
            </>
          ) : (
            <>
              <div className="h-1.5 w-1.5 rounded-full bg-g animate-running-glow" />
              Workspace online
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="text-xs text-t3">
            {mode === "teach" ? (
              <>
                Recording:{" "}
                <strong className="font-semibold text-t1">
                  {teachTaskName ?? "Send an email in Gmail"}
                </strong>
              </>
            ) : mode === "login" && loginSuccess ? (
              <>
                <strong className="font-semibold text-g">
                  {service} connected
                </strong>
                {" "}· resuming task
              </>
            ) : mode === "login" ? (
              <>
                Waiting for{" "}
                <strong className="font-semibold text-t1">
                  {service} sign in
                </strong>
              </>
            ) : (
              <>
                Working on:{" "}
                <strong className="font-semibold text-t1">
                  Research inbound founder
                </strong>{" "}
                (2:18)
              </>
            )}
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

      {/* Login coaching banner */}
      {mode === "login" && service && (
        <div className={`flex shrink-0 items-center gap-3 border-b border-b1 px-5 py-3 transition-colors ${
          loginSuccess ? "bg-g/[0.06]" : "bg-bg2"
        }`}>
          {/* Status icon */}
          {loginSuccess ? (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-g/20">
              <svg className="h-4 w-4 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          ) : (
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/15">
              {/* Cursor/pointer icon */}
              <svg className="h-4 w-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 2l14.5 11.5-5.5 1.5 3.5 6.5-2.5 1.5-3.5-6.5-4 4z" />
              </svg>
              {/* Subtle pulse ring */}
              <div className="absolute inset-0 rounded-md border border-amber-500/40 animate-[ping_2s_ease-out_infinite] opacity-50" />
            </div>
          )}
          <div className="flex-1">
            {loginSuccess ? (
              <>
                <div className="text-[13px] font-medium text-t1">
                  Connected to {service}. Resuming your task...
                </div>
                <div className="text-[11px] text-t3">
                  Closing in {countdown}s
                </div>
              </>
            ) : (
              <>
                <div className="text-[13px] font-medium text-t1">
                  Sign in to {service} so I can continue
                </div>
                <div className="text-[11px] text-t3">
                  Just sign in like you normally would. I&apos;ll take it from here.
                </div>
              </>
            )}
          </div>
          {loginSuccess && (
            <button
              onClick={() => {
                setLoginSuccess(false);
                setCountdown(5);
              }}
              className="rounded-md border border-b1 px-3 py-1.5 text-[12px] font-medium text-t2 transition-colors hover:bg-bg3"
            >
              Keep open
            </button>
          )}
        </div>
      )}

      {/* Teach mode coaching banner */}
      {mode === "teach" && (
        <div className="flex shrink-0 items-center gap-3 border-b border-violet-500/20 bg-violet-500/[0.04] px-5 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-500/15">
            <svg className="h-4 w-4 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium text-t1">
              Your coworker is watching and learning
            </div>
            <div className="text-[11px] text-t3">
              Perform the task as you normally would. Each step will be recorded so Simular can repeat it later.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-violet-500/15 px-2.5 py-1 text-[11px] font-medium text-violet-500">
              <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse-dot" style={{ "--pulse-glow": "rgba(139, 92, 246, 0.5)" } as React.CSSProperties} />
              Recording
            </div>
            <button
              onClick={() => onDoneTeach?.()}
              className="rounded-md bg-violet-500 px-3 py-1 text-[11px] font-semibold text-white transition-all hover:bg-violet-600"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Agent instruction banner (persists during workspace handoff) */}
      {instruction && (
        <div className="flex shrink-0 items-center gap-3 border-b border-as/20 bg-as/[0.04] px-5 py-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-as/10">
            <svg className="h-3.5 w-3.5 text-as" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div className="flex-1 text-[12px] leading-[1.5] text-t2">{instruction}</div>
        </div>
      )}

      {/* Screen area */}
      <div ref={containerRef} className="relative flex flex-1 items-center justify-center overflow-hidden bg-bg3">
        {/* LIVE badge (teach mode uses the coaching banner instead) */}
        {mode !== "teach" && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-bg2/90 px-2 py-0.5 text-[9px] font-semibold text-g backdrop-blur-sm">
            <div className="h-1 w-1 rounded-full bg-g" />
            LIVE
          </div>
        )}

        {/* Placeholder content */}
        {mode === "teach" ? (
          <div className="flex flex-col items-center text-center">
            {/* Simulated Gmail sign-in page */}
            <div className="w-[360px] rounded-lg border border-b1 bg-bg2 p-8 shadow-xl">
              <svg className="mx-auto mb-4 h-8 w-auto" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="#EA4335" strokeWidth="1.5" />
                <path d="M22 6l-10 7L2 6" stroke="#EA4335" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mb-6 text-[15px] font-medium text-t1">Sign in to Gmail</div>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="mb-1 block text-left text-[12px] text-t3">Email</label>
                  <input
                    type="email"
                    className="h-9 w-full rounded border border-b1 bg-bg3 px-3 text-[13px] text-t1 outline-none transition-colors focus:border-[#EA4335]"
                    placeholder="name@gmail.com"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="mb-1 block text-left text-[12px] text-t3">Password</label>
                  <input
                    type="password"
                    className="h-9 w-full rounded border border-b1 bg-bg3 px-3 text-[13px] text-t1 outline-none transition-colors focus:border-[#EA4335]"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="h-9 w-full rounded-full bg-[#1A73E8] text-[14px] font-semibold text-white transition-all hover:brightness-110"
                >
                  Sign in
                </button>
              </form>
              <div className="mt-4 text-center text-[11px] text-t4">
                accounts.google.com
              </div>
            </div>
          </div>
        ) : mode === "login" && service === "LinkedIn" ? (
          <div className="flex flex-col items-center text-center">
            {/* Simulated LinkedIn login page */}
            <div className="w-[360px] rounded-lg border border-b1 bg-bg2 p-8 shadow-xl">
              <svg className="mx-auto mb-6 h-8 w-auto text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLoginSubmit();
                }}
              >
                <div>
                  <label className="mb-1 block text-left text-[12px] text-t3">Email</label>
                  <input
                    type="email"
                    className="h-9 w-full rounded border border-b1 bg-bg3 px-3 text-[13px] text-t1 outline-none transition-colors focus:border-[#0A66C2]"
                    placeholder="name@example.com"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="mb-1 block text-left text-[12px] text-t3">Password</label>
                  <input
                    type="password"
                    className="h-9 w-full rounded border border-b1 bg-bg3 px-3 text-[13px] text-t1 outline-none transition-colors focus:border-[#0A66C2]"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="h-9 w-full rounded-full bg-[#0A66C2] text-[14px] font-semibold text-white transition-all hover:brightness-110"
                >
                  Sign in
                </button>
              </form>
              <div className="mt-4 text-center text-[11px] text-t4">
                linkedin.com
              </div>
            </div>
          </div>
        ) : (
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
        )}

        {/* Floating steps overlay — draggable, snaps to corners */}
        <div
          ref={panelRef}
          onMouseDown={handleMouseDown}
          style={panelStyle()}
          className={`absolute w-[300px] max-md:w-[240px] rounded-lg bg-bg2/90 backdrop-blur-md shadow-lg select-none ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          } ${
            stepsVisible
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 px-3.5 pt-3 pb-1">
            <span className="text-[10px] font-semibold tracking-wide text-t3 uppercase">{mode === "teach" ? "Steps recorded" : "Steps"}</span>
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
            {activeSteps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 rounded-md px-1.5 py-1.5 ${
                  step.status === "pending" ? "opacity-40" : ""
                }`}
              >
                {step.status === "done" ? (
                  <svg className={`h-3.5 w-3.5 shrink-0 ${mode === "teach" ? "text-violet-500" : "text-g"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : step.status === "active" ? (
                  <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                    <div
                      className={`h-[7px] w-[7px] rounded-full animate-pulse-dot ${mode === "teach" ? "bg-violet-500" : "bg-g"}`}
                      style={mode === "teach" ? { "--pulse-glow": "rgba(139, 92, 246, 0.5)" } as React.CSSProperties : undefined}
                    />
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
      <div className="flex shrink-0 items-center gap-[18px] border-t border-b1 px-5 py-2.5 max-md:flex-wrap max-md:gap-3">
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
