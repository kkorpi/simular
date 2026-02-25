"use client";

import { useState, type ReactNode } from "react";
import { CardShell } from "./CardShell";
import type { CardAction } from "./types";

export type BatchItem = {
  id: string;
  summary: ReactNode;
  expandedContent?: ReactNode;
  actions: CardAction[];
};

export type BatchResult = {
  id: string;
  action: string;
};

export interface BatchReviewCardProps {
  title: string;
  items: BatchItem[];
  onComplete: (results: BatchResult[]) => void;
}

export function BatchReviewCard({
  title,
  items,
  onComplete,
}: BatchReviewCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [completed, setCompleted] = useState(false);

  const handleAction = (item: BatchItem, action: CardAction) => {
    const newResult = { id: item.id, action: action.label };
    const updatedResults = [...results, newResult];
    setResults(updatedResults);

    action.onClick();

    if (currentIndex >= items.length - 1) {
      setCompleted(true);
      onComplete(updatedResults);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleSkipRemaining = () => {
    const skipped: BatchResult[] = items
      .slice(currentIndex)
      .map((item) => ({ id: item.id, action: "Skipped" }));
    const updatedResults = [...results, ...skipped];
    setResults(updatedResults);
    setCompleted(true);
    onComplete(updatedResults);
  };

  if (completed) {
    return (
      <CardShell accent="green">
        <div className="px-3.5 py-3">
          <div className="flex items-center gap-2 text-[13px] font-medium text-t1">
            <svg className="h-4 w-4 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {results.filter((r) => r.action !== "Skipped").length} of {items.length} items reviewed
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-t3">
                {r.action === "Skipped" ? (
                  <div className="h-1 w-1 rounded-full bg-t4" />
                ) : (
                  <svg className="h-3 w-3 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                <span>{items[i]?.summary}</span>
                <span className="text-t4">{r.action}</span>
              </div>
            ))}
          </div>
        </div>
      </CardShell>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <CardShell>
      {/* Header with counter */}
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="text-[13px] font-semibold text-t1">{title}</div>
        <div className="rounded-full bg-bg3h px-2.5 py-0.5 text-[11px] font-medium text-t3">
          {currentIndex + 1} of {items.length}
        </div>
      </div>

      {/* Previous completed items */}
      {results.length > 0 && (
        <div className="border-t border-b1 px-3.5 py-2">
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-t3">
              <svg className="h-3 w-3 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="flex-1 truncate">{items[i]?.summary}</span>
              <span className="text-t4">{r.action}</span>
            </div>
          ))}
        </div>
      )}

      {/* Current item */}
      {currentItem && (
        <div className="border-t border-b1">
          <div className="px-3.5 py-2.5">
            <div className="text-[13px] font-medium text-t1">{currentItem.summary}</div>
            {currentItem.expandedContent && (
              <div className="mt-2 rounded-md border border-b1 bg-bg3h px-3 py-2.5 text-[12px] leading-[1.6] text-t2">
                {currentItem.expandedContent}
              </div>
            )}
          </div>

          {/* Per-item actions */}
          <div className="flex items-center gap-2 border-t border-b1 px-3.5 py-2">
            {currentItem.actions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleAction(currentItem, action)}
                className={
                  action.style === "primary"
                    ? "rounded-md bg-ab px-2.5 py-1 text-xs font-medium text-abt transition-all hover:brightness-110"
                    : action.style === "outline"
                      ? "rounded-md border border-b1 bg-transparent px-2.5 py-1 text-xs font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1"
                      : "text-[11px] font-medium text-blt transition-all hover:underline"
                }
              >
                {action.label}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={handleSkipRemaining}
              className="text-[11px] font-medium text-t4 transition-colors hover:text-t2"
            >
              Skip remaining
            </button>
          </div>
        </div>
      )}

      {/* Pending items preview */}
      {currentIndex + 1 < items.length && (
        <div className="border-t border-b1 px-3.5 py-2">
          <div className="text-[10px] font-medium uppercase text-t4">
            Up next
          </div>
          {items.slice(currentIndex + 1, currentIndex + 3).map((item, i) => (
            <div key={i} className="mt-1 text-[11px] text-t3 truncate">
              {item.summary}
            </div>
          ))}
          {items.length - currentIndex - 1 > 2 && (
            <div className="mt-1 text-[10px] text-t4">
              +{items.length - currentIndex - 3} more
            </div>
          )}
        </div>
      )}
    </CardShell>
  );
}
