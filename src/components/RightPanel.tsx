"use client";

import { useState, useCallback } from "react";
import { ResizeHandle } from "./ResizeHandle";
import { TasksTab } from "./TasksTab";
import { BriefingDetail } from "./BriefingDetail";
import { TaskDetail } from "./TaskDetail";
import { ScheduleModal } from "./ScheduleModal";
import type { ViewState, Task } from "@/data/mockData";

export function RightPanel({
  view,
  onViewChange,
  onOpenWorkspace,
  collapsed,
  onToggleCollapse,
}: {
  view: ViewState;
  onViewChange: (v: ViewState) => void;
  onOpenWorkspace: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
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

  if (collapsed) return null;

  if (view === "result-detail") {
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

  return (
    <div
      className={`relative flex shrink-0 flex-col overflow-hidden border-l border-b1 bg-bg2 ${isDragging ? "" : "transition-[width] duration-200"}`}
      style={{ width: panelWidth }}
    >
      <ResizeHandle onResize={handleResize} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />

      {/* Panel header: working status + collapse toggle */}
      <div className="flex shrink-0 items-center border-b border-b1 px-3 py-2.5">
        <div className="flex flex-1 items-center justify-center gap-2">
          <div className="h-[7px] w-[7px] rounded-full bg-g shadow-[0_0_6px_var(--gg)] animate-pulse-dot" />
          <span className="font-mono text-[11.5px] text-t3">Working &middot; 3.2 hrs</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center rounded-md p-1 text-t4 transition-colors hover:bg-bg3 hover:text-t2"
          title="Collapse panel"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M15 3v18" />
            <path d="m8 9 3 3-3 3" />
          </svg>
        </button>
      </div>

      {/* Live workspace preview */}
      <div className="shrink-0 border-b border-b1 p-3">
        <div
          onClick={onOpenWorkspace}
          className="relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-b1 bg-bg3 transition-all hover:border-b2"
        >
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
            <svg className="h-4 w-4 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            <span>LinkedIn{"\n"}Founder profile</span>
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto">
        <TasksTab onSelectTask={handleSelectTask} />
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
    </div>
  );
}
