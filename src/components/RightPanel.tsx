"use client";

import { useState, useCallback, useEffect } from "react";
import { ResizeHandle } from "./ResizeHandle";
import { TasksTab } from "./TasksTab";
import { TaskSection } from "./TaskSection";
import { TaskItem } from "./TaskItem";
import { BriefingDetail } from "./BriefingDetail";
import { TaskDetail } from "./TaskDetail";
import { TaskSettingsPanel } from "./TaskSettingsPanel";
import { useIsMobile } from "@/hooks/useIsMobile";
import { firstRunSequences, followUpSequences, activeTasks as defaultActiveTasks, recurringTasks as defaultRecurringTasks, completedTasks as defaultCompletedTasks } from "@/data/mockData";
import type { ViewState, Task, StarterTask, TeachPhase, TaskStep } from "@/data/mockData";

const SETUP_STEPS = [
  "Setting up your workspace",
  "Installing Chrome and apps",
  "Configuring a secure environment",
  "Preparing your coworker",
];

/** Map integration name → fake address bar URL */
const INTEGRATION_URLS: Record<string, string> = {
  LinkedIn: "linkedin.com/in/john-doe",
  Crunchbase: "crunchbase.com/organization/acme",
  Salesforce: "salesforce.com/lightning/opportunities",
  Gmail: "mail.google.com/mail/inbox",
  Calendar: "calendar.google.com",
  Granola: "app.granola.so/notes",
  X: "x.com/search",
};

/** Build a Task object for the first-run task based on its current state */
function buildFirstRunTask(task: StarterTask, done: boolean, recurring: boolean, stepProgress = 0, guardrailLabel?: string): Task {
  const seq = firstRunSequences[task.category] ?? firstRunSequences.research;

  if (recurring) {
    return {
      id: "first-run-recurring",
      name: task.title,
      status: "recurring",
      subtitle: "Every weekday - 8am",
      time: "8:00a",
      integrations: seq.integrations,
      thumbEmoji: "🔍",
      thumbLabel: "Last run - just now",
      thumbStatus: seq.subtask,
      detail: {
        description: task.description,
        schedule: "Every weekday at 8:00am",
        lastRun: "Just now",
        nextRun: "Tomorrow 8:00am",
        result: seq.resultSummary,
        artifact: seq.artifact,
        artifacts: seq.artifacts,
        uploads: seq.uploads,
        runHistory: [
          { date: "Just now", duration: "28s", summary: seq.resultSummary },
        ],
      },
    };
  }

  // When running, only show steps up to stepProgress, with last one not done
  const visibleSteps: TaskStep[] = done
    ? seq.steps.map((s) => ({ label: s.label, done: true }))
    : seq.steps.slice(0, stepProgress).map((s, i) => ({
        label: s.label,
        done: i < stepProgress - 1, // all done except the last visible one
      }));

  // Inject a guardrail step when auth/captcha is blocking
  if (!done && guardrailLabel) {
    visibleSteps.push({ label: guardrailLabel, done: false, guardrail: true });
  }

  return {
    id: "first-run",
    name: task.title,
    status: done ? "completed" : "running",
    subtitle: done ? "Just now" : "Running now",
    time: "",
    integrations: seq.integrations,
    thumbEmoji: "🔍",
    thumbStatus: seq.subtask,
    detail: {
      description: task.description,
      duration: done ? "28s" : undefined,
      steps: visibleSteps,
      ...(done ? { result: seq.resultSummary, artifact: seq.artifact, artifacts: seq.artifacts, uploads: seq.uploads } : {}),
    },
  };
}

function FirstRunTaskList({
  firstRunTask,
  firstRunDone,
  followUpDone = false,
  firstRunRecurring,
  firstRunStep,
  onSelectTask,
  guardrailLabel,
}: {
  firstRunTask: StarterTask;
  firstRunDone: boolean;
  followUpDone?: boolean;
  firstRunRecurring: boolean;
  firstRunStep: number;
  onSelectTask: (task: Task) => void;
  guardrailLabel?: string;
}) {
  const task = buildFirstRunTask(firstRunTask, firstRunDone, firstRunRecurring, firstRunStep, guardrailLabel);
  const seq = firstRunSequences[firstRunTask.category] ?? firstRunSequences.research;
  const fuSeq = followUpSequences[firstRunTask.category] ?? followUpSequences.research;

  // When follow-up is done, show that as the completed task instead of the first-run task
  const completedTask: Task = followUpDone
    ? {
        id: "follow-up-completed",
        name: fuSeq.resultTitle,
        status: "completed",
        subtitle: "Just now",
        time: "",
        integrations: fuSeq.integrations,
        detail: {
          description: fuSeq.resultSummary,
          duration: "15s",
          steps: fuSeq.steps.map((s) => ({ label: s.label, done: true })),
          result: fuSeq.resultSummary,
          artifact: fuSeq.artifact,
          artifacts: fuSeq.artifacts,
          uploads: fuSeq.uploads,
        },
      }
    : {
        id: "first-run-completed",
        name: firstRunTask.title,
        status: "completed",
        subtitle: "Just now",
        time: "",
        integrations: seq.integrations,
        detail: {
          description: firstRunTask.description,
          duration: "28s",
          steps: seq.steps.map((s) => ({ label: s.label, done: true })),
          result: seq.resultSummary,
          artifact: seq.artifact,
          artifacts: seq.artifacts,
          uploads: seq.uploads,
        },
      };

  // Still running
  if (!firstRunDone) {
    return (
      <div className="px-2.5 pt-2.5 pb-2">
        <TaskSection label="Active" count={1}>
          <TaskItem task={task} onClick={() => onSelectTask(task)} />
        </TaskSection>
      </div>
    );
  }

  // Done + recurring
  if (firstRunRecurring) {
    return (
      <div className="px-2.5 pt-2.5 pb-2">
        <TaskSection label="Recurring" count={1}>
          <TaskItem task={task} onClick={() => onSelectTask(task)} />
        </TaskSection>
        <TaskSection label="Completed today" count={1} defaultOpen={false}>
          <TaskItem task={completedTask} onClick={() => onSelectTask(completedTask)} />
        </TaskSection>
      </div>
    );
  }

  // Done, not recurring
  return (
    <div className="px-2.5 pt-2.5 pb-2">
      <TaskSection label="Completed today" count={1}>
        <TaskItem task={completedTask} onClick={() => onSelectTask(completedTask)} />
      </TaskSection>
    </div>
  );
}

export function RightPanel({
  view,
  onViewChange,
  onOpenWorkspace,
  collapsed,
  onToggleCollapse,
  workspaceConnecting = false,
  firstRunTask,
  firstRunDone = false,
  followUpDone = false,
  firstRunRecurring = false,
  onFirstRunRemoveRecurring,
  openFirstRunDetail = false,
  onCloseFirstRunDetail,
  openTaskId = null,
  onClearOpenTaskId,
  teachPhase = "idle",
  teachTaskName,
  isOnboarding = false,
  workspaceSetupStep = 0,
  workspaceSetupDone = false,
  isAutoPlay = false,
  autoStep = -1,
  firstRunStep = 0,
  showCaptcha = false,
  guardrailLabel,
}: {
  view: ViewState;
  onViewChange: (v: ViewState) => void;
  onOpenWorkspace: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  workspaceConnecting?: boolean;
  firstRunTask?: StarterTask | null;
  firstRunDone?: boolean;
  /** True when the follow-up task has finished */
  followUpDone?: boolean;
  firstRunRecurring?: boolean;
  onFirstRunRemoveRecurring?: () => void;
  /** When true, auto-select the first-run task in the TaskDetail slide-over */
  openFirstRunDetail?: boolean;
  onCloseFirstRunDetail?: () => void;
  /** When set, auto-select a task by ID in the TaskDetail slide-over */
  openTaskId?: string | null;
  onClearOpenTaskId?: () => void;
  teachPhase?: TeachPhase;
  teachTaskName?: string;
  /** True during onboarding — show workspace setup progress */
  isOnboarding?: boolean;
  /** Current setup step index (0–3) */
  workspaceSetupStep?: number;
  /** True when all setup steps are complete */
  workspaceSetupDone?: boolean;
  /** Auto-play demo mode — show working state like a first-run task */
  isAutoPlay?: boolean;
  /** Current auto-play step — used to derive dynamic task list */
  autoStep?: number;
  /** Current first-run step from ChatArea — syncs step progress in task detail */
  firstRunStep?: number;
  /** True when CAPTCHA challenge is active — shows CAPTCHA visual in workspace preview */
  showCaptcha?: boolean;
  /** Guardrail label for user intervention — shown as amber step in task detail */
  guardrailLabel?: string;
}) {
  const isMobile = useIsMobile();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [panelWidth, setPanelWidth] = useState(350);
  const [isDragging, setIsDragging] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Track tasks toggled between recurring ↔ completed
  const [disabledRecurringIds, setDisabledRecurringIds] = useState<Set<string>>(new Set());
  const [madeRecurringIds, setMadeRecurringIds] = useState<Set<string>>(new Set());

  // Auto-select first-run task when "View details" clicked in chat
  useEffect(() => {
    if (openFirstRunDetail && firstRunTask) {
      const task = buildFirstRunTask(firstRunTask, firstRunDone, firstRunRecurring, firstRunStep, guardrailLabel);
      setSelectedTask(task);
    }
  }, [openFirstRunDetail, firstRunTask, firstRunDone, firstRunRecurring, firstRunStep, guardrailLabel]);

  // Keep selectedTask in sync when it's the first-run task and step/done state changes
  useEffect(() => {
    if (!selectedTask || !firstRunTask) return;
    if (selectedTask.id !== "first-run" && selectedTask.id !== "first-run-recurring") return;
    const updated = buildFirstRunTask(firstRunTask, firstRunDone, firstRunRecurring, firstRunStep, guardrailLabel);
    setSelectedTask(updated);
  }, [firstRunStep, firstRunDone, firstRunRecurring, firstRunTask, guardrailLabel]);

  // Auto-select a task by ID (e.g. from digest card "View report")
  useEffect(() => {
    if (!openTaskId) return;
    if (openTaskId === "follow-up" && firstRunTask) {
      const fuSeq = followUpSequences[firstRunTask.category] ?? followUpSequences.research;
      setSelectedTask({
        id: "follow-up",
        name: fuSeq.resultTitle,
        status: "completed",
        subtitle: "Completed",
        time: "Just now",
        integrations: fuSeq.integrations,
        detail: {
          description: fuSeq.agentMessage,
          duration: "18s",
          result: fuSeq.resultSummary,
          artifact: fuSeq.artifact,
          artifacts: fuSeq.artifacts,
          uploads: fuSeq.uploads,
          steps: fuSeq.steps.map(s => ({ label: s.label, done: true })),
        },
      });
    } else {
      const allTasks = [...defaultRecurringTasks, ...defaultActiveTasks, ...defaultCompletedTasks];
      const found = allTasks.find((t) => t.id === openTaskId);
      if (found) setSelectedTask(found);
    }
    onClearOpenTaskId?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTaskId, onClearOpenTaskId]);

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

  // Whether any task is actively running (for the spinner / elapsed timer)
  const hasActiveTask = isAutoPlay
    ? (autoStep ?? 0) >= 4 && (autoStep ?? 0) < 10
    : !isOnboarding && !workspaceConnecting && (firstRunTask != null && !firstRunDone);

  // Elapsed timer for running tasks (must be above early returns to keep hook order stable)
  useEffect(() => {
    if (!hasActiveTask) { setElapsed(0); return; }
    setElapsed(0);
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasActiveTask]);

  // Desktop: animate in/out via width + opacity transition
  if (!isMobile && collapsed) {
    return (
      <div
        className="flex flex-none flex-col overflow-hidden transition-[width,opacity] duration-200 ease-out"
        style={{ width: 0, opacity: 0 }}
      />
    );
  }

  // ── Result-detail view (desktop only — mobile doesn't show briefing in sidebar) ──
  if (!isMobile && view === "result-detail") {
    const effectiveWidth = Math.max(panelWidth, 280);
    return (
      <div
        className="flex flex-none flex-col p-4 transition-[width,opacity] duration-200 ease-out"
        style={{ width: effectiveWidth, opacity: 1 }}
      >
        <div className={`relative flex flex-1 flex-col overflow-hidden rounded-lg border border-b1 bg-bg2 ${isDragging ? "" : "transition-[width] duration-200"}`}>
          <ResizeHandle onResize={handleResize} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
          <BriefingDetail onBack={() => onViewChange("task-hover")} />
        </div>
      </div>
    );
  }

  // Fresh state: zero-state with no task running and not onboarding (e.g. demo selector → fresh)
  const isFreshState = view === "zero-state" && !isOnboarding && !firstRunTask && !isAutoPlay;

  // ── Derive task lists for auto-play based on chat progress ──
  // Steps: 0-2 SAI greeting, 3 user pulls briefing, 4 running briefing task,
  //   5 user asks LP touchpoint, 6 running LP task, 7 briefing result, 8 LP result,
  //   9 LinkedIn flow
  const autoPlayTasks = (() => {
    if (!isAutoPlay) return null;
    const active: Task[] = [];
    const recurring = [...defaultRecurringTasks];
    const completed = [...defaultCompletedTasks];
    const demoDone = autoStep >= 10; // All tasks resolved

    // "Research inbound founder" — running until demo done
    if (!demoDone) {
      active.push(defaultActiveTasks[0]);
    } else {
      completed.unshift({
        ...defaultActiveTasks[0],
        status: "completed",
        subtitle: "Completed",
        time: "just now",
      });
    }

    // Steps 4-6: LP meeting prep briefing is running
    if (autoStep >= 4 && autoStep < 7) {
      active.push({
        id: "auto-briefing",
        name: "Sequoia Scouts LP meeting prep",
        status: "running",
        subtitle: "Running now",
        time: "now",
      });
    }

    // Step 7+: LP meeting prep done → move to completed
    if (autoStep >= 7) {
      completed.unshift({
        id: "auto-briefing-done",
        name: "Sequoia Scouts LP meeting prep",
        status: "completed",
        subtitle: "Completed",
        time: "just now",
      });
    }

    // Steps 7-8: LP touchpoint tracker is running (starts after Sequoia completes)
    if (autoStep >= 7 && autoStep < 8) {
      active.push({
        id: "auto-touchpoint",
        name: "LP touchpoint tracker",
        status: "running",
        subtitle: "Running now",
        time: "now",
      });
    }

    // Step 8+: LP touchpoint done → move to completed
    if (autoStep >= 8) {
      completed.unshift({
        id: "auto-touchpoint-done",
        name: "LP touchpoint report",
        status: "completed",
        subtitle: "Completed",
        time: "just now",
      });
    }

    // Step 9 only: LinkedIn profile viewers running
    if (autoStep >= 9 && !demoDone) {
      active.push({
        id: "auto-linkedin",
        name: "Check LinkedIn profile viewers",
        status: "running",
        subtitle: "Running now",
        time: "now",
      });
    }

    // Step 10+: LinkedIn done → move to completed
    if (demoDone) {
      completed.unshift({
        id: "auto-linkedin-done",
        name: "Check LinkedIn profile viewers",
        status: "completed",
        subtitle: "Completed",
        time: "just now",
      });
    }

    // "Compile meeting debrief" stays queued unless demo done
    if (!demoDone) {
      active.push(defaultActiveTasks[1]);
    } else {
      active.push({
        ...defaultActiveTasks[1],
        status: "running",
        subtitle: "Running now",
        time: "now",
      });
    }

    return { active, recurring, completed };
  })();

  // Apply schedule toggles (disabled recurring → completed, made recurring → recurring)
  const applyScheduleToggles = (lists: { active: Task[]; recurring: Task[]; completed: Task[] }) => {
    let { active, recurring, completed } = lists;

    // Move disabled recurring tasks to completed
    const disabledTasks = recurring.filter((t) => disabledRecurringIds.has(t.id));
    recurring = recurring.filter((t) => !disabledRecurringIds.has(t.id));
    completed = [
      ...disabledTasks.map((t) => ({ ...t, status: "completed" as const, subtitle: "Schedule disabled" })),
      ...completed,
    ];

    // Move made-recurring completed tasks to recurring
    const newRecurring = completed.filter((t) => madeRecurringIds.has(t.id));
    completed = completed.filter((t) => !madeRecurringIds.has(t.id));
    recurring = [
      ...newRecurring.map((t) => ({
        ...t,
        status: "recurring" as const,
        subtitle: "Every weekday at 7:00 AM",
        detail: { ...t.detail, description: t.detail?.description ?? "", schedule: "Every weekday at 7:00 AM", nextRun: "Tomorrow at 7:00 AM" },
      } as Task)),
      ...recurring,
    ];

    return { active, recurring, completed };
  };

  const toggledTasks = applyScheduleToggles(
    autoPlayTasks ?? { active: defaultActiveTasks, recurring: defaultRecurringTasks, completed: defaultCompletedTasks }
  );

  const elapsedStr = elapsed > 0 ? `${elapsed}s` : "";

  // Derive current step label for running tasks
  const currentStepLabel = (() => {
    if (!hasActiveTask) return "";
    if (firstRunTask && !firstRunDone) {
      if (guardrailLabel) {
        return guardrailLabel;
      }
      const seq = firstRunSequences[firstRunTask.category] ?? firstRunSequences.research;
      const stepIdx = Math.min(firstRunStep - 1, seq.steps.length - 1);
      if (stepIdx >= 0) {
        return `Step ${stepIdx + 1} of ${seq.steps.length} — ${seq.steps[stepIdx].label}`;
      }
    }
    return "";
  })();

  // ── Panel content (shared between desktop inline and mobile drawer) ──
  const panelContent = (
    <>
      {/* Panel header: working status + close toggle */}
      <div className="flex shrink-0 items-center px-3 py-2.5">
        <div className="flex flex-1 items-center justify-center gap-2">
          {hasActiveTask ? (
            <div className="h-[14px] w-[14px] shrink-0 rounded-full border-2 border-g/30 border-t-g animate-spin" />
          ) : (
            <div className={`h-[7px] w-[7px] rounded-full ${showCaptcha ? "bg-am animate-pulse" : isOnboarding && !workspaceSetupDone ? "bg-am" : workspaceConnecting ? "bg-am" : "bg-g"}`} />
          )}
          <span className={`font-mono text-[11.5px] ${showCaptcha ? "text-amt" : "text-t3"}`}>{
            showCaptcha ? "Action needed"
            : isFreshState ? "Ready"
            : isOnboarding ? (workspaceSetupDone ? "Workspace ready" : "Setting up workspace")
            : workspaceConnecting ? "Setting up workspace"
            : hasActiveTask ? (firstRunTask ? `${firstRunTask.title}${elapsedStr ? ` · ${elapsedStr}` : ""}` : `Working${elapsedStr ? ` · ${elapsedStr}` : ""}`)
            : "Ready"
          }</span>
        </div>
        {isMobile && (
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center rounded-md p-1 text-t4 transition-colors hover:bg-bg3 hover:text-t2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Live workspace preview */}
      <div className="shrink-0 p-3">
        <div
          onClick={() => !workspaceConnecting && !isOnboarding && onOpenWorkspace()}
          className={`relative flex aspect-[16/11] flex-col overflow-hidden rounded-lg border border-b1 bg-bg3 transition-colors ${
            workspaceConnecting || isOnboarding ? "" : "cursor-pointer hover:border-b2"
          }`}
        >
          {(() => {
            // Determine address bar URL based on state
            const taskIsRunning = !isFreshState && !isOnboarding && !workspaceConnecting && ((isAutoPlay && autoStep < 10) || (firstRunTask && !firstRunDone));
            const seq = firstRunTask ? (firstRunSequences[firstRunTask.category] ?? firstRunSequences.research) : null;
            const currentIntegration = seq?.integrations?.[0] || "";
            const addressUrl = showCaptcha
              ? "linkedin.com/checkpoint/challenge"
              : taskIsRunning
                ? (isAutoPlay ? "linkedin.com/in/john-doe" : (INTEGRATION_URLS[currentIntegration] || "app.simular.ai"))
                : isOnboarding || workspaceConnecting
                  ? "workspace.simular.ai"
                  : "linkedin.com/in/john-doe";

            return (
              <>
                {/* Browser chrome header — only when workspace is active (not during setup/connecting/fresh) */}
                {(showCaptcha || (!isFreshState && !workspaceConnecting && !(isOnboarding && !workspaceSetupDone))) && (
                  <div className="flex items-center gap-1.5 bg-bg2 px-2.5 py-1.5 border-b border-b1">
                    <div className="flex gap-1">
                      <div className="h-[6px] w-[6px] rounded-full bg-t4/30" />
                      <div className="h-[6px] w-[6px] rounded-full bg-t4/30" />
                      <div className="h-[6px] w-[6px] rounded-full bg-t4/30" />
                    </div>
                    <div className="flex-1 mx-2 h-[14px] rounded-sm bg-bg3 flex items-center px-2">
                      <span className="text-[8px] text-t4 truncate">{addressUrl}</span>
                    </div>
                    <div className={`flex items-center gap-1 rounded-full px-1.5 py-px text-[7px] font-semibold ${showCaptcha ? "bg-am/10 text-amt" : "bg-g/10 text-g"}`}>
                      <div className={`h-1 w-1 rounded-full ${showCaptcha ? "bg-am animate-pulse" : "bg-g"}`} />
                      {showCaptcha ? "PAUSED" : "LIVE"}
                    </div>
                  </div>
                )}

                {/* Workspace content area — fills remaining space */}
                <div className="relative flex-1 bg-bg3/50 overflow-hidden">
                  {isOnboarding ? (
                    workspaceSetupDone ? (
                      <div className="flex h-full flex-col items-center justify-center gap-2 animate-fade-in">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-g/15">
                          <svg className="h-4 w-4 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span className="text-[11px] font-medium text-g">Ready</span>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg width="36" height="36" viewBox="0 0 90 90" fill="none">
                          {/* S outline — always visible */}
                          <path d="M46.8811 39.9023C52.0446 39.9111 55.9579 41.1993 59.6867 44.835C65.8177 50.813 65.7738 61.0332 59.758 67.0771C54.952 71.9053 50.502 71.958 44.1174 71.9531L35.8488 71.9512C34.1834 71.9612 32.5511 71.9811 30.8898 71.8486C29.0445 69.7504 27.3865 64.4789 25.8479 62.0576L41.6047 62.0664C43.9119 62.068 46.2222 62.079 48.5275 62.0342C51.3212 62.0388 54.468 59.0716 54.384 56.2031C54.244 51.4282 51.0181 50.0477 46.8723 50.0059L46.8811 39.9023ZM42.3781 18.0117C44.824 17.897 48.1085 17.9839 50.6154 17.9863L64.1867 18.0098C63.2843 20.06 62.3385 22.0911 61.3508 24.1016C60.8509 25.1418 59.995 26.8015 59.6379 27.8437C55.5791 27.9546 51.5154 27.8219 47.4572 27.8779C44.9163 28.0486 40.7938 27.3678 38.6066 28.8779C33.7709 32.217 35.164 38.7457 40.9455 39.9023C41.7567 39.9445 42.279 39.9446 43.09 39.9023L43.0773 50.0371C38.152 50.1004 34.9951 49.0198 31.1398 45.8584C24.6286 40.5187 23.9569 30.0406 29.4738 23.748C33.1794 19.5214 36.8061 18.294 42.3781 18.0117Z" fill="none" stroke="var(--t4)" strokeWidth="1.5" className="opacity-30" />
                          {/* S filled — clips from bottom to top */}
                          <path d="M46.8811 39.9023C52.0446 39.9111 55.9579 41.1993 59.6867 44.835C65.8177 50.813 65.7738 61.0332 59.758 67.0771C54.952 71.9053 50.502 71.958 44.1174 71.9531L35.8488 71.9512C34.1834 71.9612 32.5511 71.9811 30.8898 71.8486C29.0445 69.7504 27.3865 64.4789 25.8479 62.0576L41.6047 62.0664C43.9119 62.068 46.2222 62.079 48.5275 62.0342C51.3212 62.0388 54.468 59.0716 54.384 56.2031C54.244 51.4282 51.0181 50.0477 46.8723 50.0059L46.8811 39.9023ZM42.3781 18.0117C44.824 17.897 48.1085 17.9839 50.6154 17.9863L64.1867 18.0098C63.2843 20.06 62.3385 22.0911 61.3508 24.1016C60.8509 25.1418 59.995 26.8015 59.6379 27.8437C55.5791 27.9546 51.5154 27.8219 47.4572 27.8779C44.9163 28.0486 40.7938 27.3678 38.6066 28.8779C33.7709 32.217 35.164 38.7457 40.9455 39.9023C41.7567 39.9445 42.279 39.9446 43.09 39.9023L43.0773 50.0371C38.152 50.1004 34.9951 49.0198 31.1398 45.8584C24.6286 40.5187 23.9569 30.0406 29.4738 23.748C33.1794 19.5214 36.8061 18.294 42.3781 18.0117Z" fill="var(--t3)" className="animate-logo-fill" />
                        </svg>
                      </div>
                    )
                  ) : showCaptcha ? (
                    /* ── CAPTCHA challenge in workspace ── */
                    <div className="flex h-full flex-col items-center justify-center gap-2 animate-fade-in px-3">
                      {/* Mini CAPTCHA widget */}
                      <div className="w-full max-w-[160px] rounded-md border border-b1 bg-bg2 p-2.5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-[14px] w-[14px] rounded-[3px] border-2 border-am bg-am/10" />
                          <span className="text-[8px] text-t2 leading-tight">I&apos;m not a robot</span>
                          <div className="ml-auto flex flex-col items-center gap-0.5">
                            <svg className="h-[10px] w-[10px] text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <span className="text-[5px] text-t4">reCAPTCHA</span>
                          </div>
                        </div>
                        {/* Image grid hint */}
                        <div className="grid grid-cols-3 gap-[2px] rounded overflow-hidden">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className={`aspect-square ${i === 1 || i === 4 || i === 7 ? "bg-am/20" : "bg-t4/10"}`} />
                          ))}
                        </div>
                        <div className="mt-1.5 text-[6px] text-t3 text-center">Select all squares with traffic lights</div>
                      </div>
                      {/* Amber pulsing label */}
                      <div className="flex items-center gap-1.5 text-[9px] text-amt font-medium">
                        <div className="h-1 w-1 rounded-full bg-am animate-pulse" />
                        Waiting for you
                      </div>
                    </div>
                  ) : workspaceConnecting ? (
                    <div className="flex h-full items-center justify-center">
                      <svg width="36" height="36" viewBox="0 0 90 90" fill="none">
                        <path d="M46.8811 39.9023C52.0446 39.9111 55.9579 41.1993 59.6867 44.835C65.8177 50.813 65.7738 61.0332 59.758 67.0771C54.952 71.9053 50.502 71.958 44.1174 71.9531L35.8488 71.9512C34.1834 71.9612 32.5511 71.9811 30.8898 71.8486C29.0445 69.7504 27.3865 64.4789 25.8479 62.0576L41.6047 62.0664C43.9119 62.068 46.2222 62.079 48.5275 62.0342C51.3212 62.0388 54.468 59.0716 54.384 56.2031C54.244 51.4282 51.0181 50.0477 46.8723 50.0059L46.8811 39.9023ZM42.3781 18.0117C44.824 17.897 48.1085 17.9839 50.6154 17.9863L64.1867 18.0098C63.2843 20.06 62.3385 22.0911 61.3508 24.1016C60.8509 25.1418 59.995 26.8015 59.6379 27.8437C55.5791 27.9546 51.5154 27.8219 47.4572 27.8779C44.9163 28.0486 40.7938 27.3678 38.6066 28.8779C33.7709 32.217 35.164 38.7457 40.9455 39.9023C41.7567 39.9445 42.279 39.9446 43.09 39.9023L43.0773 50.0371C38.152 50.1004 34.9951 49.0198 31.1398 45.8584C24.6286 40.5187 23.9569 30.0406 29.4738 23.748C33.1794 19.5214 36.8061 18.294 42.3781 18.0117Z" fill="none" stroke="var(--t4)" strokeWidth="1.5" className="opacity-30" />
                        <path d="M46.8811 39.9023C52.0446 39.9111 55.9579 41.1993 59.6867 44.835C65.8177 50.813 65.7738 61.0332 59.758 67.0771C54.952 71.9053 50.502 71.958 44.1174 71.9531L35.8488 71.9512C34.1834 71.9612 32.5511 71.9811 30.8898 71.8486C29.0445 69.7504 27.3865 64.4789 25.8479 62.0576L41.6047 62.0664C43.9119 62.068 46.2222 62.079 48.5275 62.0342C51.3212 62.0388 54.468 59.0716 54.384 56.2031C54.244 51.4282 51.0181 50.0477 46.8723 50.0059L46.8811 39.9023ZM42.3781 18.0117C44.824 17.897 48.1085 17.9839 50.6154 17.9863L64.1867 18.0098C63.2843 20.06 62.3385 22.0911 61.3508 24.1016C60.8509 25.1418 59.995 26.8015 59.6379 27.8437C55.5791 27.9546 51.5154 27.8219 47.4572 27.8779C44.9163 28.0486 40.7938 27.3678 38.6066 28.8779C33.7709 32.217 35.164 38.7457 40.9455 39.9023C41.7567 39.9445 42.279 39.9446 43.09 39.9023L43.0773 50.0371C38.152 50.1004 34.9951 49.0198 31.1398 45.8584C24.6286 40.5187 23.9569 30.0406 29.4738 23.748C33.1794 19.5214 36.8061 18.294 42.3781 18.0117Z" fill="var(--t3)" className="animate-logo-fill" />
                      </svg>
                    </div>
                  ) : taskIsRunning ? (
                    /* ── Fake browser page while task is running ── */
                    <div className="flex w-full h-full animate-fade-in">
                      {/* Mini sidebar */}
                      <div className="w-[28px] shrink-0 border-r border-b1/40 bg-bg2/40 flex flex-col items-center pt-2 gap-2.5">
                        <div className="h-[6px] w-[6px] rounded-[2px] bg-t4/25" />
                        <div className="h-[6px] w-[6px] rounded-[2px] bg-blt/30" />
                        <div className="h-[6px] w-[6px] rounded-[2px] bg-t4/15" />
                        <div className="h-[6px] w-[6px] rounded-[2px] bg-t4/15" />
                      </div>
                      {/* Main content */}
                      <div className="flex-1 flex flex-col p-2.5 gap-1.5 relative">
                        {/* Page header */}
                        <div className="flex items-center gap-2 pb-1.5 mb-1 border-b border-b1/30">
                          <div className="h-[5px] w-[35%] rounded-full bg-t4/25" />
                          <div className="flex-1" />
                          <div className="h-[10px] w-[28px] rounded-[3px] bg-blt/20" />
                        </div>
                        {/* Data rows */}
                        {[
                          { w1: 65, w2: 18, highlight: false },
                          { w1: 50, w2: 22, highlight: true },
                          { w1: 72, w2: 15, highlight: false },
                          { w1: 40, w2: 20, highlight: false },
                          { w1: 58, w2: 17, highlight: false },
                        ].map((row, i) => (
                          <div key={i} className={`flex items-center gap-2 rounded-[3px] px-1 py-[3px] ${row.highlight ? "bg-blt/5 ring-1 ring-blt/15" : ""}`}>
                            <div className="h-[4px] rounded-full bg-t4/15" style={{ width: `${row.w1}%` }} />
                            <div className="flex-1" />
                            <div className="h-[4px] rounded-full bg-t4/10" style={{ width: `${row.w2}%` }} />
                          </div>
                        ))}
                        {/* Animated cursor */}
                        <div className="absolute bottom-2 right-3">
                          <svg className="h-3 w-3 text-g/70 animate-pulse" viewBox="0 0 24 24" fill="currentColor"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86h8.08c.45 0 .67-.54.35-.85L5.85 2.85a.5.5 0 00-.35.36z" /></svg>
                        </div>
                      </div>
                    </div>
                  ) : isFreshState ? (
                    /* ── Fresh state — workspace ready ── */
                    <div className="flex h-full flex-col items-center justify-center gap-2 animate-fade-in">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-g/15">
                        <svg className="h-4 w-4 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-medium text-g">Ready</span>
                    </div>
                  ) : (
                    /* ── Idle state ── */
                    <>
                      <div className="flex h-full flex-col items-center justify-center gap-1 text-center text-[11px] text-t4">
                        <svg className="h-4 w-4 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                        <span>LinkedIn{"\n"}Founder profile</span>
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 flex items-center justify-center rounded-md bg-bg2/80 p-0.5 backdrop-blur-sm">
                        <svg className="h-4 w-4 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 3 21 3 21 9" />
                          <polyline points="9 21 3 21 3 15" />
                          <line x1="21" y1="3" x2="14" y2="10" />
                          <line x1="3" y1="21" x2="10" y2="14" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              </>
            );
          })()}
        </div>
        {/* Current step indicator below preview */}
        {currentStepLabel && (
          <div className={`mt-1.5 flex items-center gap-1.5 px-1 text-[10px] truncate ${guardrailLabel ? "text-amt" : "text-t3"}`}>
            <div className={`h-1 w-1 shrink-0 rounded-full animate-pulse ${guardrailLabel ? "bg-am" : "bg-g"}`} />
            {currentStepLabel}
          </div>
        )}
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto">
        {isFreshState ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <div className="text-[11px] text-t4">Pick a task to get started</div>
          </div>
        ) : isOnboarding ? (
          <div className="px-4 py-4">
            <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-t4">Setup progress</div>
            <div className="flex flex-col gap-0">
              {SETUP_STEPS.map((step, i) => {
                const isDone = workspaceSetupDone || i < workspaceSetupStep;
                const isCurrent = !workspaceSetupDone && i === workspaceSetupStep;
                return (
                  <div key={i} className="flex items-center gap-2.5 py-1.5">
                    {isDone ? (
                      <div className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full bg-g/15">
                        <svg className="h-2.5 w-2.5 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    ) : isCurrent ? (
                      <div className="flex h-[16px] w-[16px] shrink-0 items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-am" />
                      </div>
                    ) : (
                      <div className="flex h-[16px] w-[16px] shrink-0 items-center justify-center">
                        <div className="h-1 w-1 rounded-full bg-t4/30" />
                      </div>
                    )}
                    <span className={`text-[11px] leading-tight ${isDone ? "text-t2" : isCurrent ? "text-t2 font-medium" : "text-t4"}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : firstRunTask ? (
          <FirstRunTaskList
            firstRunTask={firstRunTask}
            firstRunDone={firstRunDone}
            followUpDone={followUpDone}
            firstRunRecurring={firstRunRecurring}
            firstRunStep={firstRunStep}
            onSelectTask={handleSelectTask}
            guardrailLabel={guardrailLabel}
          />
        ) : (
          <TasksTab
            onSelectTask={handleSelectTask}
            teachPhase={teachPhase}
            teachTaskName={teachTaskName}
            activeTasksOverride={toggledTasks.active}
            recurringTasksOverride={toggledTasks.recurring}
            completedTasksOverride={toggledTasks.completed}
          />
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
              onBack={() => { handleSelectTask(null); setSettingsOpen(false); onCloseFirstRunDetail?.(); }}
              onViewResult={
                selectedTask.detail?.resultType === "briefing"
                  ? () => {
                      handleSelectTask(null);
                      onViewChange("result-detail");
                    }
                  : undefined
              }
              onOpenWorkspace={onOpenWorkspace}
              onOpenSettings={
                selectedTask.status === "recurring" || selectedTask.status === "completed"
                  ? () => setSettingsOpen(true)
                  : undefined
              }
              onDisable={
                selectedTask.status === "recurring"
                  ? () => {
                      if (selectedTask.id === "first-run-recurring") {
                        onFirstRunRemoveRecurring?.();
                      } else {
                        setDisabledRecurringIds((prev) => new Set(prev).add(selectedTask.id));
                      }
                      handleSelectTask(null);
                    }
                  : undefined
              }
              onMakeRecurring={
                selectedTask.status === "completed"
                  ? () => {
                      setMadeRecurringIds((prev) => new Set(prev).add(selectedTask.id));
                      handleSelectTask(null);
                    }
                  : undefined
              }
            />
            {/* Drill-in: task settings */}
            <div
              className={`absolute inset-0 z-20 flex flex-col bg-bg2 transition-transform duration-200 ease-out ${
                settingsOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {settingsOpen && (
                <TaskSettingsPanel
                  task={selectedTask}
                  editable={selectedTask.status === "recurring" || selectedTask.status === "completed"}
                  onBack={() => setSettingsOpen(false)}
                  onMakeRecurring={
                    selectedTask.status === "completed"
                      ? () => {
                          setMadeRecurringIds((prev) => new Set(prev).add(selectedTask.id));
                          setSettingsOpen(false);
                          handleSelectTask(null);
                        }
                      : undefined
                  }
                  onDisableSchedule={
                    selectedTask.status === "recurring"
                      ? () => {
                          if (selectedTask.id === "first-run-recurring") {
                            onFirstRunRemoveRecurring?.();
                          } else {
                            setDisabledRecurringIds((prev) => new Set(prev).add(selectedTask.id));
                          }
                          setSettingsOpen(false);
                          handleSelectTask(null);
                        }
                      : undefined
                  }
                />
              )}
            </div>
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
          className="absolute inset-0 bg-overlay-light backdrop-blur-[2px]"
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
      role="complementary"
      aria-label="Tasks panel"
      className="flex flex-none flex-col p-4 transition-[width,opacity] duration-200 ease-out"
      style={{ width: panelWidth, opacity: 1 }}
    >
      <div className={`relative flex flex-1 flex-col overflow-hidden rounded-lg border border-b1 bg-bg2 ${isDragging ? "" : "transition-[width] duration-200"}`}>
        <ResizeHandle onResize={handleResize} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
        {panelContent}
      </div>
    </div>
  );
}
