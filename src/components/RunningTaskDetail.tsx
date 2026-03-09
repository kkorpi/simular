"use client";

import { useState, useRef, useEffect } from "react";
import { WorkingIndicator } from "./WorkingIndicator";
import type { RunningStep } from "@/data/mockData";

interface RunningTaskDetailProps {
  steps: RunningStep[];
  /** Primary subtask labels shown as parallel WorkingIndicators */
  subtasks: string[];
  onViewActivityLog?: () => void;
  /** Start with details expanded */
  initialExpanded?: boolean;
  /** Mark the task as complete (subtask shows as static text) */
  done?: boolean;
}

function parseTimestamp(ts: string): number {
  const parts = ts.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

/** Fixed window shows this many step rows */
const VISIBLE_COUNT = 3;
/** Approximate height per step row (6+6 py-1.5 padding + 18px line) */
const ROW_H = 30;
const WINDOW_H = VISIBLE_COUNT * ROW_H;

export function RunningTaskDetail({
  steps,
  subtasks,
  onViewActivityLog,
  initialExpanded = false,
  done = false,
}: RunningTaskDetailProps) {
  const [expanded, setExpanded] = useState(done ? initialExpanded : false);
  const [showAll, setShowAll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const completedCount = steps.filter((s) => s.done).length;
  const lastTimestamp = steps[steps.length - 1]?.timestamp || "0:00";
  const elapsedSeconds = parseTimestamp(lastTimestamp);
  const elapsedLabel = `${elapsedSeconds}s`;

  const hasOverflow = steps.length > VISIBLE_COUNT;

  // Smooth-scroll to bottom so newest steps slide into view
  useEffect(() => {
    if (expanded && !showAll && scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [steps.length, expanded, showAll]);

  return (
    <div className="mt-2 overflow-hidden">
      {/* Subtask indicators — show current step label when running */}
      <div className="flex flex-col gap-3.5 pb-2">
        {subtasks.map((fallbackLabel, i) => {
          const currentStep = !done ? steps.find((s) => !s.done) : undefined;
          const label = currentStep ? currentStep.label.replace(/\.{2,}$/, "") : fallbackLabel;
          return <WorkingIndicator key={i} label={label} done={done} />;
        })}
      </div>

      {/* Summary + Toggle */}
      <div className="flex items-center gap-2 pb-2">
        <button
          onClick={() => { setExpanded(!expanded); setShowAll(false); }}
          className="flex items-center gap-1.5 rounded-md px-1 py-0.5 text-[11.5px] font-medium text-t4 transition-all hover:text-t3"
        >
          <svg
            className={`h-3 w-3 transition-transform duration-200 ${expanded ? "" : "-rotate-90"}`}
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
        <span className={`text-[11px] text-t4 transition-opacity duration-200 ${expanded ? "opacity-0" : "opacity-100"}`}>
          {done
            ? `${completedCount} steps · ${elapsedLabel}`
            : `Working · ${elapsedLabel}`}
        </span>
      </div>

      {/* Step log + footer — animated via collapsible grid */}
      <div className="collapsible" data-open={expanded}>
        <div>
          <div className="relative pl-[22px]">
            {/* Top gradient — fades in/out smoothly */}
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-[var(--bg)] to-transparent transition-opacity duration-200 ${
                hasOverflow && !showAll ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Step window — fixed min-height reserves 3 rows; max-height animates for "View all" */}
            <div
              ref={scrollRef}
              className="overflow-hidden transition-[max-height] duration-300 ease-out"
              style={{
                minHeight: `${WINDOW_H}px`,
                maxHeight: showAll ? `${steps.length * ROW_H + 20}px` : `${WINDOW_H}px`,
              }}
            >
              {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 py-1.5 ${
                      step.done ? "" : "opacity-50"
                    }`}
                  >
                    <div className="mt-[5px] shrink-0">
                      {step.done ? (
                        <div className="h-[7px] w-[7px] rounded-full bg-g" />
                      ) : (
                        <div className="h-[7px] w-[7px] rounded-full bg-t4 animate-pulse-dot" />
                      )}
                    </div>
                    <span className="mt-[1px] w-[32px] shrink-0 font-mono text-[10.5px] text-t4">
                      {step.timestamp}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] leading-[1.5] text-t2">
                        <span className={step.done ? "" : "text-t3"}>
                          {step.label}
                        </span>
                        {step.userAction && (
                          <span className="ml-1.5 inline-flex items-center rounded border border-b1 bg-bg3 px-1 py-px text-[9px] font-medium text-t3">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            {/* View all / show less — always rendered, fades in/out */}
            <div
              className={`transition-all duration-300 ease-out overflow-hidden ${
                hasOverflow
                  ? "max-h-8 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="py-1 text-[11px] font-medium text-t4 transition-colors hover:text-t3"
              >
                {showAll ? "Show less" : `View all ${steps.length} steps`}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-1.5 py-1.5 mt-0.5 pl-[22px] text-[11px] text-t3">
            <span>{completedCount} steps &middot; {elapsedLabel}</span>
            {onViewActivityLog && (
              <>
                <span>&middot;</span>
                <button
                  onClick={onViewActivityLog}
                  className="font-medium text-blt transition-all hover:underline"
                >
                  View full activity log
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
