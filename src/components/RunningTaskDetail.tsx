"use client";

import { useState } from "react";
import { WorkingIndicator } from "./WorkingIndicator";
import type { RunningStep } from "@/data/mockData";

interface RunningTaskDetailProps {
  steps: RunningStep[];
  /** Primary subtask labels shown as parallel WorkingIndicators */
  subtasks: string[];
  onViewActivityLog?: () => void;
}

function parseTimestamp(ts: string): number {
  const parts = ts.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

export function RunningTaskDetail({
  steps,
  subtasks,
  onViewActivityLog,
}: RunningTaskDetailProps) {
  const [expanded, setExpanded] = useState(false);

  const completedCount = steps.filter((s) => s.done).length;
  const lastTimestamp = steps[steps.length - 1]?.timestamp || "0:00";
  const elapsedSeconds = parseTimestamp(lastTimestamp);
  const elapsedLabel = `${elapsedSeconds}s elapsed`;

  return (
    <div className="mt-2">
      {/* Parallel subtask indicators */}
      <div className="flex flex-col gap-3.5">
        {subtasks.map((label, i) => (
          <WorkingIndicator key={i} label={label} />
        ))}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium text-t3 transition-all hover:bg-bg3 hover:text-t2"
      >
        <svg
          className={`h-3 w-3 transition-transform ${expanded ? "" : "-rotate-90"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        {expanded ? "Hide details" : "Show details"}
      </button>

      {/* Expandable step log */}
      <div className="collapsible mt-1.5" data-open={expanded}>
        <div>
          <div className="overflow-hidden rounded-lg border border-b1 bg-bg3">
            <div className="flex flex-col">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 px-3 py-2 ${
                    i < steps.length - 1 ? "border-b border-b1" : ""
                  } ${step.done ? "" : "opacity-50"}`}
                >
                  {/* Status dot */}
                  <div className="mt-[5px] shrink-0">
                    {step.done ? (
                      <div className="h-[7px] w-[7px] rounded-full bg-g" />
                    ) : (
                      <div className="h-[7px] w-[7px] rounded-full bg-t4 animate-pulse-dot" />
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="mt-[1px] w-[32px] shrink-0 font-mono text-[10.5px] text-t4">
                    {step.timestamp}
                  </span>

                  {/* Label + trust signal */}
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] leading-[1.5] text-t2">
                      {step.site ? (
                        <StepLabelWithSite label={step.label} site={step.site} />
                      ) : (
                        <span className={step.done ? "" : "text-t3"}>
                          {step.label}
                        </span>
                      )}
                    </div>
                    {step.trustSignal && (
                      <div className="mt-0.5 flex items-center gap-1 text-[10.5px] text-gt">
                        <svg
                          className="h-2.5 w-2.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        {step.trustSignal}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-b1 px-3 py-2">
              <span className="text-[11px] text-t3">
                {completedCount} steps &middot; {elapsedLabel}
              </span>
              {onViewActivityLog && (
                <button
                  onClick={onViewActivityLog}
                  className="text-[11px] font-medium text-blt transition-all hover:underline"
                >
                  View full activity log
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepLabelWithSite({ label, site }: { label: string; site: string }) {
  const parts = label.split(site);
  if (parts.length < 2) {
    return <span>{label}</span>;
  }
  return (
    <span>
      {parts[0]}
      <strong className="font-semibold text-t1">{site}</strong>
      {parts[1]}
    </span>
  );
}
