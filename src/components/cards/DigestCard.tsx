"use client";

import { useState, type ReactNode } from "react";
import { CardShell } from "./CardShell";
import { ScheduleBar, type ScheduleBarProps } from "./ScheduleBar";

export interface DigestRun {
  date: string;
  summary: string;
  hasActionItems?: boolean;
}

export interface DigestActionItem {
  text: string;
  runDate: string;
  action?: { label: string; onClick: () => void };
}

export interface DigestCardProps {
  icon: ReactNode;
  title: string;
  runCount: number;
  statLine: string;
  actionItems?: DigestActionItem[];
  runs: DigestRun[];
  schedule?: ScheduleBarProps;
  onViewTask?: () => void;
}

export function DigestCard({
  icon,
  title,
  runCount,
  statLine,
  actionItems,
  runs,
  schedule,
  onViewTask,
}: DigestCardProps) {
  const [showRuns, setShowRuns] = useState(false);

  return (
    <CardShell accent="default">
      {/* Header */}
      <div className="px-3.5 pt-3 pb-2.5">
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-bg3 text-[14px]">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold text-t1">{title}</div>
            <div className="mt-0.5 text-[12px] text-t3">
              {runCount} run{runCount !== 1 ? "s" : ""} since you were last here
            </div>
          </div>
        </div>

        {/* Stats line */}
        <div className="mt-2.5 text-[12.5px] text-t2">{statLine}</div>
      </div>

      {/* Action items */}
      {actionItems && actionItems.length > 0 && (
        <div className="border-t border-b1 px-3.5 py-2.5">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-am">
            Needs attention ({actionItems.length})
          </div>
          <div className="flex flex-col gap-2.5">
            {actionItems.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-am" />
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] leading-[1.5] text-t1">
                    {item.text}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-[11px] text-t4">{item.runDate}</span>
                    {item.action && (
                      <button
                        onClick={item.action.onClick}
                        className="flex items-center gap-0.5 text-[11.5px] font-medium text-blt transition-colors hover:underline"
                      >
                        {item.action.label}
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible run list */}
      <div className="border-t border-b1 px-3.5 py-2">
        <button
          onClick={() => setShowRuns(!showRuns)}
          className="flex w-full items-center gap-1.5 text-[12px] font-medium text-t3 transition-colors hover:text-t1"
        >
          <svg
            className={`h-3 w-3 transition-transform ${showRuns ? "rotate-90" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          {showRuns ? "Hide runs" : `View all ${runCount} runs`}
        </button>

        <div
          className="grid transition-[grid-template-rows] duration-200 ease-out"
          style={{ gridTemplateRows: showRuns ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="pt-2 flex flex-col gap-1">
              {runs.map((run, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-bg3"
                >
                  <div
                    className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${
                      run.hasActionItems ? "bg-am" : "bg-g"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11.5px] font-medium text-t2">{run.date}</div>
                    <div className="mt-0.5 text-[11.5px] leading-[1.5] text-t3">
                      {run.summary}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* View task detail link */}
      {onViewTask && (
        <div className="border-t border-b1 px-3.5 py-2">
          <button
            onClick={onViewTask}
            className="flex items-center gap-1.5 text-[12px] font-medium text-blt transition-colors hover:underline"
          >
            View report
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}

      {/* Schedule footer */}
      {schedule && <ScheduleBar {...schedule} />}
    </CardShell>
  );
}
