"use client";

import { useState } from "react";
import { Hand } from "lucide-react";
import type { Task, ResultArtifact, Upload } from "@/data/mockData";

/** Lucide icon for artifact format */
function ArtifactIcon({ format }: { format: string }) {
  const cls = "h-4 w-4 text-t3";
  const props = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (format) {
    case "spreadsheet":
      return <svg className={cls} {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>;
    case "email":
      return <svg className={cls} {...props}><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,7 12,13 2,7" /></svg>;
    case "calendar":
      return <svg className={cls} {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
    case "briefing":
      return <svg className={cls} {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>;
    case "code":
      return <svg className={cls} {...props}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
    default:
      return <svg className={cls} {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
  }
}

function StatusBadge({ status }: { status: Task["status"] }) {
  const styles = {
    running: "bg-gs text-gt",
    queued: "bg-ams text-am",
    recurring: "bg-ams text-am",
    completed: "bg-bg3h text-t3",
  };
  const labels = {
    running: "Running",
    queued: "Queued",
    recurring: "Recurring",
    completed: "Completed",
  };
  return (
    <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function ArtifactCard({
  artifact,
  onViewResult,
}: {
  artifact: ResultArtifact;
  onViewResult?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-md border border-b1">
      {/* Header row */}
      <div className="flex items-center gap-2.5 bg-bg3 px-3 py-2.5">
        <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-bg3h">
          <ArtifactIcon format={artifact.format} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-medium text-t1">
            {artifact.title}
          </div>
          {artifact.subtitle && (
            <div className="mt-0.5 text-[11px] text-t3">{artifact.subtitle}</div>
          )}
        </div>
        {artifact.url && (
          <button className="shrink-0 rounded-md p-1 text-t4 transition-colors hover:bg-bg3h hover:text-t1">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        )}
      </div>

      {/* Preview content - format specific */}
      {artifact.preview && (
        <div className="border-t border-b1">
          {artifact.format === "code" ? (
            <div className={`overflow-x-auto bg-bg px-3 py-2.5 ${expanded ? "" : "max-h-[140px]"}`}>
              <pre className="font-mono text-[11px] leading-[1.7] text-t2">
                <code>{expanded ? (artifact.fullContent || artifact.preview) : artifact.preview}</code>
              </pre>
            </div>
          ) : artifact.format === "spreadsheet" ? (
            <div className={`overflow-x-auto bg-bg ${expanded ? "" : "max-h-[140px]"}`}>
              <div className="min-w-0 px-3 py-2.5">
                {(expanded ? (artifact.fullContent || artifact.preview) : artifact.preview).split("\n").map((row, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 border-b border-b1 py-1 font-mono text-[10.5px] last:border-0 ${i === 0 ? "font-medium text-t2" : "text-t3"}`}
                  >
                    {row.split("|").map((cell, j) => (
                      <span key={j} className="min-w-[60px] truncate">
                        {cell.trim()}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`relative bg-bg px-3 py-2.5 text-[12px] leading-[1.6] text-t3 ${expanded ? "" : "max-h-[100px] overflow-hidden"}`}>
              <div className="whitespace-pre-line">{expanded ? (artifact.fullContent || artifact.preview) : artifact.preview}</div>
              {!expanded && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[var(--bg)] to-transparent" />
              )}
            </div>
          )}
          {(artifact.preview.split("\n").length > 4 || (artifact.preview.length > 200)) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex w-full items-center justify-center gap-1 border-t border-b1 bg-bg3 py-1.5 text-[11px] font-medium text-t3 transition-colors hover:text-t1"
            >
              <svg className={`h-3 w-3 transition-transform ${expanded ? "" : "-rotate-90"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {/* Action row for briefing type */}
      {artifact.format === "briefing" && onViewResult && (
        <button
          onClick={onViewResult}
          className="flex w-full items-center justify-center gap-1.5 border-t border-b1 bg-bg3 py-2 text-[11.5px] font-medium text-blt transition-colors hover:bg-bg3h"
        >
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          View full briefing
        </button>
      )}
    </div>
  );
}

function FileTypeIcon({ type }: { type: string }) {
  const cls = "h-3.5 w-3.5 text-t3";
  const props = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (type === "png" || type === "jpg" || type === "jpeg" || type === "svg") {
    return <svg className={cls} {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
  }
  if (type === "xlsx" || type === "csv") {
    return <svg className={cls} {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>;
  }
  return <svg className={cls} {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
}

function UploadRow({ upload }: { upload: Upload }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-bg3h">
        <FileTypeIcon type={upload.type} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-medium text-t1">{upload.name}</div>
        <div className="text-[10px] text-t4">{upload.size}</div>
      </div>
      <button className="shrink-0 rounded-md p-1.5 text-t4 transition-colors hover:bg-bg3h hover:text-t1">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
    </div>
  );
}

export function TaskDetail({
  task,
  onBack,
  onViewResult,
  onOpenWorkspace,
  onOpenSettings,
  onDisable,
  onMakeRecurring,
}: {
  task: Task;
  onBack: () => void;
  onViewResult?: () => void;
  onOpenWorkspace?: () => void;
  onOpenSettings?: () => void;
  onDisable?: () => void;
  onMakeRecurring?: () => void;
}) {
  const d = task.detail;
  const [showAllRuns, setShowAllRuns] = useState(false);
  const [expandedRun, setExpandedRun] = useState<number | null>(null);
  const [showFullResult, setShowFullResult] = useState(false);
  const hasRichResult = d?.resultType === "briefing";

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2.5 border-b border-b1 px-4 py-3.5">
        <button
          onClick={onBack}
          className="shrink-0 rounded-md p-1 text-t3 transition-colors hover:bg-bg3h hover:text-t1"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="min-w-0 flex-1 truncate text-[14px] font-semibold text-t1">
          {task.name}
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Duration / queue info */}
        {(d?.duration || (task.status === "queued" && d?.queuePosition !== undefined)) && (
          <div className="mb-5 flex items-center gap-2">
            {d?.duration && (
              <span className="font-mono text-[11px] text-t3">{d.duration}</span>
            )}
            {task.status === "queued" && d?.queuePosition !== undefined && (
              <span className="text-[11px] text-t3">
                Position #{d.queuePosition + 1} in queue
              </span>
            )}
          </div>
        )}

        {/* Screen preview — only for running/queued tasks */}
        {task.thumbEmoji && (task.status === "running" || task.status === "queued") && (
          <div
            className={`mb-5 overflow-hidden rounded-md border border-b1 ${onOpenWorkspace ? "cursor-pointer transition-colors hover:border-b2" : ""}`}
            onClick={onOpenWorkspace}
          >
            <div className="relative flex aspect-video items-center justify-center bg-bg">
              {task.status === "running" && (
                <div className="absolute top-1.5 right-1.5 flex items-center gap-[3px] rounded-full bg-bg2/80 px-1.5 py-0.5 text-[8px] font-semibold text-g">
                  <div className="h-[3px] w-[3px] rounded-full bg-g" />
                  LIVE
                </div>
              )}
              {/* Expand icon */}
              {onOpenWorkspace && (
                <div className="absolute bottom-1.5 right-1.5 flex items-center justify-center rounded-md bg-bg2/80 p-1 backdrop-blur-sm">
                  <svg
                    className="h-4 w-4 text-t3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                </div>
              )}
              <div className="whitespace-pre-line text-center text-[11px] text-t4">
                {task.thumbEmoji} {task.thumbStatus}
              </div>
            </div>
            {task.thumbSite && (
              <div className="border-t border-b1 bg-bg3 px-2.5 py-1.5 font-mono text-[10px] text-t4">
                {task.thumbSite}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {d?.description && (
          <div className="mb-5">
            <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">
              What it does
            </div>
            <div className="text-[13px] leading-[1.6] text-t2">{d.description}</div>
          </div>
        )}

        {/* Config summary line */}
        {(() => {
          const parts: string[] = [];
          if (task.skills?.length) parts.push(`${task.skills.length} skill${task.skills.length !== 1 ? "s" : ""}`);
          if (task.integrations?.length) parts.push(`${task.integrations.length} service${task.integrations.length !== 1 ? "s" : ""}`);
          if (d?.maxDuration) parts.push(d.maxDuration);
          return parts.length > 0 ? (
            <div className="mb-5 text-[12px] text-t3">{parts.join(" · ")}</div>
          ) : null;
        })()}

        {/* Schedule (recurring) */}
        {d?.schedule && (
          <div className="mb-5">
            <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">
              Schedule
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[12.5px]">
              <div className="text-t3">Runs</div>
              <div className="text-t1">{d.schedule}</div>
              {d.lastRun && (
                <>
                  <div className="text-t3">Last run</div>
                  <div className="text-t1">{d.lastRun}</div>
                </>
              )}
              {d.nextRun && (
                <>
                  <div className="text-t3">Next run</div>
                  <div className="text-t1">{d.nextRun}</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Steps (running/completed) */}
        {d?.steps && d.steps.length > 0 && (
          <div className="mb-5">
            <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">
              Steps
            </div>
            <div className="flex flex-col gap-1">
              {d.steps.map((step, i) => {
                const isActive = !step.done && task.status === "running" && d.steps!.findIndex((s) => !s.done) === i;
                const isGuardrail = step.guardrail && !step.done;
                return (
                <div key={i} className="flex items-center gap-2 py-0.5">
                  {isGuardrail ? (
                    <Hand className="h-3.5 w-3.5 shrink-0 text-am animate-pulse" />
                  ) : step.done ? (
                    <svg
                      className="h-3.5 w-3.5 shrink-0 text-g"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : isActive ? (
                    <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                      <div className="h-[5px] w-[5px] rounded-full bg-g animate-pulse" />
                    </div>
                  ) : (
                    <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                      <div className="h-[5px] w-[5px] rounded-full bg-t4" />
                    </div>
                  )}
                  <span className={`text-[12.5px] ${isGuardrail ? "text-am font-medium" : step.done ? "text-t2" : isActive ? "text-t1 font-medium" : "text-t3"}`}>
                    {step.label}
                  </span>
                </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Result */}
        {(d?.result || d?.artifact) && (
          <div className="mb-5">
            <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">
              {task.status === "completed"
                ? "Result"
                : task.status === "recurring"
                  ? "Latest result"
                  : "Last result"}
            </div>

            {/* Summary text */}
            {d?.result && (
              <div className="mb-2.5 rounded-md border border-b1 bg-bg3 p-3 text-[13px] leading-[1.6] text-t2">
                {showFullResult && d.fullResult ? (
                  <div className="whitespace-pre-line">{d.fullResult}</div>
                ) : (
                  d.result
                )}
              </div>
            )}

            {/* Expand/collapse for text-only results without artifact */}
            {d?.fullResult && !d?.artifact && (
              <div className="mb-2.5">
                <button
                  onClick={() => setShowFullResult(!showFullResult)}
                  className="flex items-center gap-1.5 text-[12px] font-medium text-blt transition-colors hover:underline"
                >
                  <svg className={`h-3 w-3 transition-transform ${showFullResult ? "" : "-rotate-90"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  {showFullResult ? "Show less" : "Show full result"}
                </button>
              </div>
            )}

            {/* Artifact card (legacy single) */}
            {d?.artifact && !d?.artifacts && (
              <ArtifactCard
                artifact={d.artifact}
                onViewResult={hasRichResult ? onViewResult : undefined}
              />
            )}
          </div>
        )}

        {/* Artifacts (multiple) */}
        {d?.artifacts && d.artifacts.length > 0 && (
          <div className="mb-5">
            <div className="mb-1.5 flex items-center gap-2">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">
                Artifacts
              </div>
              <span className="rounded-full bg-bg3h px-1.5 py-0.5 text-[10px] font-medium text-t3">
                {d.artifacts.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {d.artifacts.map((artifact, i) => (
                <ArtifactCard key={i} artifact={artifact} onViewResult={i === 0 && hasRichResult ? onViewResult : undefined} />
              ))}
            </div>
          </div>
        )}

        {/* Uploads */}
        {d?.uploads && d.uploads.length > 0 && (
          <div className="mb-5">
            <div className="mb-1.5 flex items-center gap-2">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">
                Uploads
              </div>
              <span className="rounded-full bg-bg3h px-1.5 py-0.5 text-[10px] font-medium text-t3">
                {d.uploads.length}
              </span>
            </div>
            <div className="divide-y divide-b1 overflow-hidden rounded-md border border-b1">
              {d.uploads.map((upload, i) => (
                <UploadRow key={i} upload={upload} />
              ))}
            </div>
          </div>
        )}

        {/* Run history (recurring) */}
        {d?.runHistory && d.runHistory.length > 0 && (
          <div className="mb-5">
            <div className="mb-1.5 flex items-center justify-between">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">
                Run history
              </div>
              <span className="font-mono text-[10px] text-t4">
                {d.runHistory.length} runs
              </span>
            </div>
            <div className="flex flex-col gap-px">
              {(showAllRuns ? d.runHistory : d.runHistory.slice(0, 3)).map(
                (run, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => run.fullResult ? setExpandedRun(expandedRun === i ? null : i) : undefined}
                    className={`flex flex-col rounded-md px-2.5 py-2 text-left transition-colors hover:bg-bg3h ${run.fullResult ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${run.hasActionItems ? "bg-am" : "bg-g"}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-medium text-t1">
                            {run.date}
                          </span>
                          <span className="font-mono text-[10px] text-t4">
                            {run.duration}
                          </span>
                          {run.fullResult && (
                            <svg className={`h-2.5 w-2.5 text-t4 transition-transform ${expandedRun === i ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          )}
                        </div>
                        <div className="mt-0.5 text-[12px] leading-[1.5] text-t3">
                          {run.summary}
                        </div>
                      </div>
                    </div>
                    {expandedRun === i && run.fullResult && (
                      <div className="ml-[18px] mt-1.5 whitespace-pre-wrap rounded-md bg-bg3/50 px-3 py-2 text-[11.5px] leading-[1.6] text-t2">
                        {run.fullResult}
                      </div>
                    )}
                  </button>
                )
              )}
            </div>
            {d.runHistory.length > 3 && (
              <button
                onClick={() => setShowAllRuns(!showAllRuns)}
                className="mt-1 w-full rounded-md py-1.5 text-center text-[11.5px] font-medium text-t3 transition-colors hover:bg-bg3h hover:text-t1"
              >
                {showAllRuns
                  ? "Show less"
                  : `View all ${d.runHistory.length} runs`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 flex-wrap gap-2 border-t border-b1 px-4 py-3">
        {task.status === "running" && (
          <>
            <button className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12px] font-medium text-t2 transition-colors hover:bg-bg3h hover:text-t1">
              Pause
            </button>
            <button className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12px] font-medium text-t2 transition-colors hover:bg-bg3h hover:text-t1">
              Cancel
            </button>
          </>
        )}
        {task.status === "queued" && (
          <>
            <button className="rounded-md bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-colors hover:brightness-110">
              Run now
            </button>
            <button className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12px] font-medium text-t2 transition-colors hover:bg-bg3h hover:text-t1">
              Remove from queue
            </button>
          </>
        )}
        {task.status === "recurring" && (
          <>
            <button className="rounded-md bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-colors hover:brightness-110">
              Run now
            </button>
            <button
              onClick={onDisable}
              className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12px] font-medium text-t2 transition-colors hover:bg-bg3h hover:text-t1"
            >
              Disable
            </button>
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="ml-auto flex h-[30px] w-[30px] items-center justify-center rounded-md border border-b1 bg-transparent text-t3 transition-colors hover:bg-bg3h hover:text-t1"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
              </button>
            )}
          </>
        )}
        {task.status === "completed" && (
          <>
            {hasRichResult && onViewResult ? (
              <button
                onClick={onViewResult}
                className="rounded-md bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-colors hover:brightness-110"
              >
                View full briefing
              </button>
            ) : d?.artifact?.url ? (
              <button className="rounded-md bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-colors hover:brightness-110">
                Open in {({ code: "GitHub", spreadsheet: "Sheets", link: "browser", email: "Gmail", calendar: "Calendar" } as Record<string, string>)[d.artifact.format] ?? "Docs"}
              </button>
            ) : (
              <button className="rounded-md bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-colors hover:brightness-110">
                View in chat
              </button>
            )}
            <button className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12px] font-medium text-t2 transition-colors hover:bg-bg3h hover:text-t1">
              Run again
            </button>
            {onMakeRecurring && (
              <button
                onClick={onMakeRecurring}
                className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12px] font-medium text-t2 transition-colors hover:bg-bg3h hover:text-t1"
              >
                Make recurring
              </button>
            )}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="ml-auto flex h-[30px] w-[30px] items-center justify-center rounded-md border border-b1 bg-transparent text-t3 transition-colors hover:bg-bg3h hover:text-t1"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
