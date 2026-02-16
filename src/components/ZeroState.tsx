"use client";

import { SimularLogo } from "./SimularLogo";
import { TaskInput } from "./TaskInput";
import { starterTasks, type StarterTask } from "@/data/mockData";

interface ZeroStateProps {
  onStartTask: (task: StarterTask) => void;
}

const trustBadgeStyles: Record<string, string> = {
  low: "text-gt",
  "needs-auth": "text-blt",
};

export function ZeroState({ onStartTask }: ZeroStateProps) {
  const noLogin = starterTasks.filter((t) => t.trustLevel === "low");
  const requiresLogin = starterTasks.filter((t) => t.trustLevel === "needs-auth");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8">
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
              Here&apos;s what I can get started on for you.
            </div>
          </div>
        </div>

        {/* No login required section */}
        <div className="mb-3 text-[11px] font-semibold tracking-[0.08em] text-t3 uppercase">
          No login required
        </div>
        <div className="flex flex-col gap-2.5">
          {noLogin.map((task) => (
            <StarterTaskCard
              key={task.id}
              task={task}
              onStart={() => onStartTask(task)}
            />
          ))}
        </div>

        {/* Requires login section */}
        {requiresLogin.length > 0 && (
          <>
            <div className="mb-3 mt-8 text-[11px] font-semibold tracking-[0.08em] text-t3 uppercase">
              Requires login
            </div>
            <div className="flex flex-col gap-2.5">
              {requiresLogin.map((task) => (
                <StarterTaskCard
                  key={task.id}
                  task={task}
                  onStart={() => onStartTask(task)}
                />
              ))}
            </div>
          </>
        )}

        {/* Describe your own task */}
        <div className="mt-8 w-full max-w-[520px] mx-auto">
          <div className="mb-2 text-center text-[13px] text-t4">or describe your own</div>
          <TaskInput />
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
      className="group flex items-center gap-4 rounded-xl border border-b1 bg-bg3 px-4 py-4 text-left transition-all hover:border-b2 hover:bg-bg3h"
    >
      {/* Icon */}
      <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-bg3h text-[20px]">
        {task.icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold leading-[1.4] text-t1">
          {task.title}
        </div>
        <div className="mt-0.5 text-[12.5px] leading-[1.5] text-t3">
          {task.description}
        </div>
      </div>

      {/* Trust badge */}
      <div
        className={`shrink-0 text-[12px] font-medium ${trustBadgeStyles[task.trustLevel] || "text-t3"}`}
      >
        {task.trustLabel}
      </div>
    </button>
  );
}
