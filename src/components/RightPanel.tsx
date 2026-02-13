"use client";

import { useState, useCallback } from "react";
import { ResizeHandle } from "./ResizeHandle";
import { TasksTab } from "./TasksTab";
import { WorkspaceTab } from "./WorkspaceTab";
import { BriefingDetail } from "./BriefingDetail";
import { TaskDetail } from "./TaskDetail";
import { ScheduleModal } from "./ScheduleModal";
import type { ViewState, Task } from "@/data/mockData";

type PanelTab = "tasks" | "workspace";

export function RightPanel({
  view,
  onViewChange,
  onOpenWorkspace,
}: {
  view: ViewState;
  onViewChange: (v: ViewState) => void;
  onOpenWorkspace: () => void;
}) {
  const [activeTab, setActiveTab] = useState<PanelTab>("tasks");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [panelWidth, setPanelWidth] = useState(340);
  const [isDragging, setIsDragging] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const minWidth = view === "result-detail" ? 440 : 240;
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

      {/* Panel header: working status */}
      <div className="flex shrink-0 items-center justify-center gap-2 border-b border-b1 px-4 py-2.5">
        <div className="h-[7px] w-[7px] rounded-full bg-g shadow-[0_0_6px_var(--gg)] animate-pulse-dot" />
        <span className="font-mono text-[11.5px] text-t3">Working &middot; 3.2 hrs</span>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 border-b border-b1">
        {(["tasks", "workspace"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 py-2.5 text-center text-xs font-medium transition-all ${
              activeTab === tab ? "text-t1" : "text-t3 hover:text-t2"
            }`}
          >
            {tab === "tasks" ? "Tasks" : "Workspace"}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-t1" />
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === "tasks" ? (
          <TasksTab onSelectTask={handleSelectTask} />
        ) : (
          <WorkspaceTab onFullView={onOpenWorkspace} />
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
    </div>
  );
}
