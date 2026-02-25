"use client";

import { useState, useCallback } from "react";
import { ResizeHandle } from "./ResizeHandle";
import { TasksTab } from "./TasksTab";
import { BriefingDetail } from "./BriefingDetail";
import { TaskDetail } from "./TaskDetail";
import { ScheduleModal } from "./ScheduleModal";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { ViewState, Task, StarterTask, TeachPhase } from "@/data/mockData";

export function RightPanel({
  view,
  onViewChange,
  onOpenWorkspace,
  collapsed,
  onToggleCollapse,
  workspaceConnecting = false,
  firstRunTask,
  teachPhase = "idle",
  teachTaskName,
}: {
  view: ViewState;
  onViewChange: (v: ViewState) => void;
  onOpenWorkspace: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  workspaceConnecting?: boolean;
  firstRunTask?: StarterTask | null;
  teachPhase?: TeachPhase;
  teachTaskName?: string;
}) {
  const isMobile = useIsMobile();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [panelWidth, setPanelWidth] = useState(470);
  const [isDragging, setIsDragging] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const minWidth = view === "result-detail" ? 440 : 280;
  const maxWidth = 720;

  const handleResize = useCallback(
    (delta: number) => {
      setPanelWidth((w) => Math.max(minWidth, Math.min(maxWidth, w + delta)));
    },
    [minWidth]
  );

  const handleDragStart = useCallback(() => setIsDragging(true), []);
  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  const handleSelectTask = useCallback((task: Task | null) => {
    setSelectedTask(task);
  }, []);

  // Desktop: completely unmount when collapsed (existing behavior)
  if (!isMobile && collapsed) return null;

  // ── Result-detail view (desktop only — mobile doesn't show briefing in sidebar) ──
  if (!isMobile && view === "result-detail") {
    const effectiveWidth = Math.max(panelWidth, 520);
    return (
      <div
        className={`relative flex shrink-0 flex-col border-l border-b1 bg-bg2 ${isDragging ? "" : "transition-[width] duration-200"}`}
        style={{ width: effectiveWidth }}
      >
        <ResizeHandle onResize={handleResize} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
        <BriefingDetail onBack={() => onViewChange("task-hover")} />
      </div>
    );
  }

  // ── Panel content (shared between desktop inline and mobile drawer) ──
  const panelContent = (
    <>
      {/* Panel header: working status + close toggle */}
      <div className="flex shrink-0 items-center px-3 py-2.5">
        <div className="flex flex-1 items-center justify-center gap-2">
          <div className="h-[7px] w-[7px] rounded-full bg-g shadow-[0_0_6px_var(--gg)] animate-pulse-dot" />
          <span className="font-mono text-[11.5px] text-t3">{firstRunTask ? "Working on first task" : "Working \u00B7 3.2 hrs"}</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center rounded-md p-1 text-t4 transition-colors hover:bg-bg3 hover:text-t2"
          title="Close panel"
        >
          {isMobile ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M15 3v18" />
              <path d="m8 9 3 3-3 3" />
            </svg>
          )}
        </button>
      </div>

      {/* Live workspace preview */}
      <div className="shrink-0 p-3">
        <div
          onClick={() => !workspaceConnecting && onOpenWorkspace()}
          className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-b1 bg-bg3 transition-all ${
            workspaceConnecting ? "" : "cursor-pointer hover:border-b2"
          }`}
        >
          {workspaceConnecting ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-am animate-bounce [animation-delay:0ms]" />
                <div className="h-2 w-2 rounded-full bg-am animate-bounce [animation-delay:150ms]" />
                <div className="h-2 w-2 rounded-full bg-am animate-bounce [animation-delay:300ms]" />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[12px] font-medium text-t2">Connecting to workspace</span>
                <span className="text-[10px] text-t4">Setting up your private environment</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-[9px] text-t4">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  Private
                </div>
                <div className="flex items-center gap-1 text-[9px] text-t4">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  Encrypted
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-full bg-bg2/90 px-[7px] py-0.5 text-[9px] font-semibold text-g backdrop-blur-sm">
                <div className="h-1 w-1 rounded-full bg-g" />
                LIVE
              </div>
              <div className="absolute bottom-1.5 right-1.5 flex items-center justify-center rounded-md bg-bg2/80 p-0.5 backdrop-blur-sm">
                <svg className="h-4 w-4 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </div>
              <div className="flex flex-col items-center gap-1 text-center text-[11px] text-t4">
                {firstRunTask ? (
                  <>
                    <svg className="h-4 w-4 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span className="max-w-[140px] leading-tight">Working on task</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                    <span>LinkedIn{"\n"}Founder profile</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto">
        {firstRunTask ? (
          <div className="px-2.5 pt-2.5 pb-2">
            <div className="mb-1.5 flex items-center justify-between px-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-t3">Active</span>
                <span className="rounded-full bg-bg3h px-1.5 py-0 text-[10px] font-medium text-t3">1</span>
              </div>
            </div>
            <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-all bg-bg3">
              <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-md bg-bg3h">
                <div className="h-2 w-2 rounded-full bg-as animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-t1">{firstRunTask.title}</div>
                <div className="mt-0.5 text-[11px] text-t3">Running now</div>
              </div>
            </button>
          </div>
        ) : (
          <TasksTab onSelectTask={handleSelectTask} teachPhase={teachPhase} teachTaskName={teachTaskName} />
        )}
      </div>

      {/* Slide-over layer: task detail */}
      <div
        className={`absolute inset-0 z-10 flex flex-col bg-bg2 transition-transform duration-200 ease-out ${
          selectedTask ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedTask && (
          <>
            <TaskDetail
              task={selectedTask}
              onBack={() => handleSelectTask(null)}
              onViewResult={
                selectedTask.detail?.resultType === "briefing"
                  ? () => {
                      handleSelectTask(null);
                      onViewChange("result-detail");
                    }
                  : undefined
              }
              onOpenWorkspace={onOpenWorkspace}
              onEditSchedule={
                selectedTask.status === "recurring"
                  ? () => setScheduleOpen(true)
                  : undefined
              }
            />
            <ScheduleModal
              open={scheduleOpen}
              onClose={() => setScheduleOpen(false)}
              taskName={selectedTask.name}
              currentSchedule={selectedTask.detail?.schedule}
              nextRun={selectedTask.detail?.nextRun}
            />
          </>
        )}
      </div>
    </>
  );

  // ── Mobile: render as slide-in drawer with backdrop ──
  if (isMobile) {
    return (
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          collapsed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          onClick={onToggleCollapse}
        />
        {/* Drawer */}
        <div
          className={`absolute inset-y-0 right-0 flex w-[85vw] max-w-[380px] flex-col bg-bg2 shadow-2xl transition-transform duration-300 ease-out ${
            collapsed ? "translate-x-full" : "translate-x-0"
          }`}
        >
          {panelContent}
        </div>
      </div>
    );
  }

  // ── Desktop: inline flex sibling (existing behavior) ──
  return (
    <div
      className={`relative flex shrink-0 flex-col overflow-hidden border-l border-b1 bg-bg2 ${isDragging ? "" : "transition-[width] duration-200"}`}
      style={{ width: panelWidth }}
    >
      <ResizeHandle onResize={handleResize} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
      {panelContent}
    </div>
  );
}
