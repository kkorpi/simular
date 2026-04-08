"use client";

import { useState, useRef, useEffect } from "react";
import { MessyWorkingIndicator } from "./MessyWorkingIndicator";
import type { RunningStep } from "@/data/mockData";

interface MessyTaskDetailProps {
  steps: RunningStep[];
  subtask: string;
  done?: boolean;
  /** Whether the agent is currently struggling (amber spinner) */
  isStruggling?: boolean;
  onViewActivityLog?: () => void;
}

function parseTimestamp(ts: string): number {
  const parts = ts.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

const VISIBLE_COUNT = 3;
const ROW_H = 30;
const ERROR_ROW_H = 46; // error rows are taller (label + error detail)
const WINDOW_H = VISIBLE_COUNT * ROW_H;

function StepDot({ step }: { step: RunningStep }) {
  const isFailed = step.status === "failed" || step.type === "error";
  const isGuardrail = step.type === "guardrail" || step.status === "guardrail";
  const isUser = step.type === "user";
  const isThinking = step.type === "thinking";

  if (isThinking) return null; // no dot for thinking steps

  if (isGuardrail) {
    return <div className="h-[7px] w-[7px] rounded-full bg-am animate-pulse" />;
  }

  if (isUser) {
    return <div className="h-[7px] w-[7px] rounded-full bg-blt" />;
  }

  if (isFailed) {
    return <div className="h-[7px] w-[7px] rounded-full bg-rd" />;
  }

  if (step.done) {
    return <div className="h-[7px] w-[7px] rounded-full bg-g" />;
  }

  return <div className="h-[7px] w-[7px] rounded-full bg-g animate-pulse" />;
}

function StepRow({ step }: { step: RunningStep }) {
  const isFailed = step.status === "failed" || step.type === "error";
  const isGuardrail = step.type === "guardrail" || step.status === "guardrail";
  const isUser = step.type === "user";
  const isThinking = step.type === "thinking";

  if (isThinking) {
    return (
      <div className="flex items-start gap-2.5 py-1.5 pl-4">
        <span className="mt-[1px] w-[32px] shrink-0 font-mono text-[10.5px] text-t4">
          {step.timestamp}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] italic leading-[1.5] text-t4">
            {step.label}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-2.5 py-1.5 ${
        isFailed ? "animate-error-flash" : ""
      }`}
    >
      <div className="mt-[5px] shrink-0">
        <StepDot step={step} />
      </div>
      <span className="mt-[1px] w-[32px] shrink-0 font-mono text-[10.5px] text-t4">
        {step.timestamp}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] leading-[1.5] text-t2">
          <span className={isFailed ? "text-t3" : isGuardrail ? "text-amt font-medium" : isUser ? "text-blt" : ""}>
            {step.label}
          </span>
          {(step.userAction || isUser) && (
            <span className="ml-1.5 inline-flex items-center rounded border border-bls bg-bls/30 px-1 py-px text-[9px] font-medium text-blt">
              You
            </span>
          )}
        </div>
        {isFailed && step.errorDetail && (
          <div className="mt-0.5 text-[11px] leading-[1.4] text-rd/70">
            {step.errorDetail}
          </div>
        )}
      </div>
    </div>
  );
}

export function MessyTaskDetail({
  steps,
  subtask,
  done = false,
  isStruggling,
  onViewActivityLog,
}: MessyTaskDetailProps) {
  const [expanded, setExpanded] = useState(done ? false : false);
  const [showAll, setShowAll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displaySteps = steps;

  const totalActions = steps.filter((s) => s.type !== "thinking").length;
  const lastTimestamp = steps[steps.length - 1]?.timestamp || "0:00";
  const elapsedSeconds = parseTimestamp(lastTimestamp);
  const elapsedLabel = elapsedSeconds >= 60
    ? `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`
    : `${elapsedSeconds}s`;

  const completedCount = steps.filter((s) => s.done && s.type !== "thinking").length;
  const hasOverflow = displaySteps.length > VISIBLE_COUNT;
  const currentStep = !done ? steps.find((s) => !s.done) : undefined;
  const indicatorLabel = isStruggling
    ? "Struggling — may need help"
    : currentStep
      ? currentStep.label.replace(/\.{2,}$/, "")
      : subtask;

  // Auto-expand details when struggling so user can see the issue
  useEffect(() => {
    if (isStruggling && !expanded) {
      setExpanded(true);
    }
  }, [isStruggling]); // eslint-disable-line react-hooks/exhaustive-deps

  // Smooth-scroll to bottom when new steps appear
  useEffect(() => {
    if (expanded && !showAll && scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [displaySteps.length, expanded, showAll]);

  return (
    <div className="mt-2 overflow-hidden">
      {/* Working indicator */}
      <div className="pb-2">
        <MessyWorkingIndicator
          label={indicatorLabel}
          done={done}
          guardrail={!done && !isStruggling && !!currentStep && (currentStep.type === "guardrail" || currentStep.status === "guardrail")}
          struggling={isStruggling}
        />
      </div>

      {/* Summary + Toggle */}
      <div className="flex items-center gap-2 pb-2">
        <button
          onClick={() => { setExpanded(!expanded); setShowAll(false); }}
          className="flex items-center gap-1.5 rounded-md px-1 py-0.5 text-[11.5px] font-medium text-t4 transition-colors hover:text-t3"
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
        <span
          className={`text-[11px] transition-opacity duration-200 ${
            isStruggling ? "text-amt" : "text-t4"
          } ${expanded ? "opacity-0" : "opacity-100"}`}
        >
          {done
            ? `${completedCount} steps · ${elapsedLabel}`
            : isStruggling
              ? `Retrying · ${elapsedLabel}`
              : `Working · ${totalActions} actions · ${elapsedLabel}`}
        </span>
      </div>

      {/* Step log — collapsible */}
      <div className="collapsible" data-open={expanded}>
        <div>
          <div className="relative pl-[22px]">
            {/* Top gradient */}
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-[var(--bg)] to-transparent transition-opacity duration-200 ${
                hasOverflow && !showAll ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Step window */}
            <div
              ref={scrollRef}
              className="overflow-hidden transition-[max-height] duration-300 ease-out"
              style={{
                minHeight: `${WINDOW_H}px`,
                maxHeight: showAll ? `${displaySteps.length * ERROR_ROW_H + 20}px` : `${WINDOW_H}px`,
              }}
            >
              {displaySteps.map((step, idx) => (
                <StepRow key={idx} step={step} />
              ))}
            </div>

            {/* View all / show less */}
            <div
              className={`transition-all duration-300 ease-out overflow-hidden ${
                hasOverflow ? "max-h-8 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="py-1 text-[11px] font-medium text-t4 transition-colors hover:text-t3"
              >
                {showAll ? "Show less" : `View all ${displaySteps.length} steps`}
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
                  className="font-medium text-blt transition-colors hover:underline"
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
