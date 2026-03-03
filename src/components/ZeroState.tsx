"use client";

import { SimularLogo } from "./SimularLogo";
import { starterTasks, type StarterTask } from "@/data/mockData";

interface ZeroStateProps {
  onStartTask: (task: StarterTask) => void;
  onCreateOwn: () => void;
  onSlashCommand?: (command: string) => void;
  showNewTaskCard?: boolean;
  onCloseNewTask?: () => void;
  /** User's role from onboarding. Used to filter starter tasks. */
  userRole?: string;
  /** Custom workflow description from onboarding. Pinned as the first task. */
  customWorkflow?: string;
}

const trustBadgeStyles: Record<string, string> = {
  low: "text-blt",
  "needs-auth": "text-gt",
};

/** Map task category to a line icon */
function TaskIcon({ category }: { category: string }) {
  const cls = "h-5 w-5 text-t2";
  switch (category) {
    case "research":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "crm":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "email":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
  }
}

export function ZeroState({ onStartTask, onCreateOwn, userRole, customWorkflow }: ZeroStateProps) {
  // Filter tasks by role: show role-specific tasks if they exist, otherwise show general (no roles defined)
  const relevantTasks = starterTasks.filter((t) => {
    if (!t.roles) return !userRole || !starterTasks.some((st) => st.roles?.includes(userRole));
    return userRole ? t.roles.includes(userRole) : false;
  });
  // Fallback: if no role-specific tasks found, show general tasks
  const tasks = relevantTasks.length > 0 ? relevantTasks : starterTasks.filter((t) => !t.roles);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 max-md:px-4 max-md:overflow-y-auto">
      <div className="w-full max-w-[620px]">
        {/* Greeting */}
        <div className="mb-8 flex gap-2.5">
          <div className="mt-0.5">
            <SimularLogo />
          </div>
          <div>
            <div className="text-sm leading-[1.65] text-t1">
              Good morning, Katie.
            </div>
            <div className="mt-0.5 text-sm leading-[1.65] text-t2">
              Sai works in your browser, across your apps. Here are a few things to try.
            </div>
          </div>
        </div>

        {/* Pinned custom workflow from onboarding */}
        {customWorkflow && (
          <div className="mb-4">
            <button
              onClick={onCreateOwn}
              className="group flex w-full items-center gap-4 rounded-lg border border-as/30 bg-as/[0.04] px-4 py-4 text-left transition-all hover:border-as/50 hover:bg-as/[0.08]"
            >
              <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md bg-as/10">
                <svg className="h-5 w-5 text-blt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-semibold text-blt mb-0.5">Your workflow</div>
                <div className="text-[14px] font-semibold leading-[1.4] text-t1">
                  {customWorkflow}
                </div>
                <div className="mt-0.5 text-[12.5px] text-t3">
                  Sai is ready to try this — click to start.
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Task list — curated, no grouping */}
        <div className="flex flex-col gap-2.5">
          {tasks.map((task) => (
            <StarterTaskCard
              key={task.id}
              task={task}
              onStart={() => onStartTask(task)}
            />
          ))}
        </div>

        {/* Footer — describe your own */}
        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={onCreateOwn}
            className="flex items-center gap-1.5 text-[13px] text-blt transition-colors hover:text-as2"
          >
            or describe your own workflow
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function StarterTaskCard({
  task,
  onStart,
}: {
  task: StarterTask;
  onStart: () => void;
}) {
  return (
    <button
      onClick={onStart}
      className="group flex items-center gap-4 rounded-lg border border-b1 bg-bgcard px-4 py-4 text-left shadow-[var(--card-shadow)] transition-all hover:bg-bg2"
    >
      {/* Icon */}
      <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md bg-bg3h">
        <TaskIcon category={task.category} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold leading-[1.4] text-t1">
          {task.title}
        </div>
        <div className="mt-0.5 text-[12.5px] leading-[1.5] text-t3">
          {task.description}
        </div>
        {task.apps && task.apps.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {task.apps.map((app) => (
              <span key={app} className="rounded bg-bg3 px-1.5 py-px text-[10px] font-medium text-t4">
                {app}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Trust badge */}
      <div
        className={`flex shrink-0 items-center gap-1.5 text-[12px] font-medium ${trustBadgeStyles[task.trustLevel] || "text-t3"}`}
      >
        {task.trustLevel === "needs-auth" && (
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        )}
        <span className="max-md:hidden">{task.trustLabel}</span>
      </div>
    </button>
  );
}
