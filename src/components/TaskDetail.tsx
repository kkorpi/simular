"use client";

import { useState } from "react";
import type { Task, ResultArtifact } from "@/data/mockData";

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

function FormatBadge({ format }: { format: ResultArtifact["format"] }) {
  const config = {
    text: { label: "Text", style: "bg-bg3 text-t3" },
    briefing: { label: "Briefing", style: "bg-[rgba(59,130,246,0.15)] text-[#60a5fa]" },
    document: { label: "Doc", style: "bg-[rgba(59,130,246,0.15)] text-[#60a5fa]" },
    spreadsheet: { label: "Sheet", style: "bg-[rgba(34,197,94,0.15)] text-[#4ade80]" },
    code: { label: "Code", style: "bg-[rgba(168,85,247,0.15)] text-[#c084fc]" },
    link: { label: "Link", style: "bg-[rgba(251,191,36,0.15)] text-[#fbbf24]" },
  };
  const c = config[format];
  return (
    <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${c.style}`}>
      {c.label}
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
        <span className="text-base">{artifact.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[12.5px] font-medium text-t1">
              {artifact.title}
            </span>
            <FormatBadge format={artifact.format} />
          </div>
          {artifact.subtitle && (
            <div className="mt-0.5 text-[11px] text-t3">{artifact.subtitle}</div>
          )}
        </div>
        {artifact.url && (
          <button className="shrink-0 rounded-md p-1 text-t4 transition-all hover:bg-bg hover:text-t2">
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
              className="flex w-full items-center justify-center gap-1 border-t border-b1 bg-bg3 py-1.5 text-[11px] font-medium text-t3 transition-all hover:text-t2"
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
          className="flex w-full items-center justify-center gap-1.5 border-t border-b1 bg-bg3 py-2 text-[11.5px] font-medium text-blt transition-all hover:bg-bg"
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

export function TaskDetail({
  task,
  onBack,
  onViewResult,
  onOpenWorkspace,
  onEditSchedule,
  onDisable,
}: {
  task: Task;
  onBack: () => void;
  onViewResult?: () => void;
  onOpenWorkspace?: () => void;
  onEditSchedule?: () => void;
  onDisable?: () => void;
}) {
  const d = task.detail;
  const [showAllRuns, setShowAllRuns] = useState(false);
  const [showFullResult, setShowFullResult] = useState(false);
  const hasRichResult = d?.resultType === "briefing";

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2.5 border-b border-b1 px-4 py-3.5">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-md bg-transparent px-2 py-1 text-xs text-t3 transition-all hover:bg-bg3 hover:text-t1"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Tasks
        </button>
        <div className="min-w-0 flex-1 truncate text-[13px] font-semibold text-t1">
          {task.name}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Status + time */}
        <div className="mb-4 flex items-center gap-2">
          <StatusBadge status={task.status} />
          {d?.duration && (
            <span className="font-mono text-[11px] text-t3">{d.duration}</span>
          )}
          {task.status === "queued" && d?.queuePosition !== undefined && (
            <span className="text-[11px] text-t3">
              Position #{d.queuePosition + 1} in queue
            </span>
          )}
        </div>

        {/* Screen preview — only for running/queued tasks */}
        {task.thumbEmoji && (task.status === "running" || task.status === "queued") && (
          <div
            className={`mb-4 overflow-hidden rounded-md border border-b1 ${onOpenWorkspace ? "cursor-pointer transition-all hover:border-b2" : ""}`}
            onClick={onOpenWorkspace}
          >
            <div className="relative flex aspect-video items-center justify-center bg-bg">
              {task.status === "running" && (
                <div className="absolute top-1.5 right-1.5 flex items-center gap-[3px] rounded-full bg-black/65 px-1.5 py-0.5 text-[8px] font-semibold text-g">
                  <div className="h-[3px] w-[3px] rounded-full bg-g" />
                  LIVE
                </div>
              )}
              {/* Expand icon */}
              {onOpenWorkspace && (
                <div className="absolute bottom-1.5 right-1.5 flex items-center justify-center rounded-md bg-black/50 p-1 backdrop-blur-sm">
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
          <div className="mb-4">
            <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">
              What it does
            </div>
            <div className="text-[13px] leading-[1.6] text-t2">{d.description}</div>
          </div>
        )}

        {/* Integrations & Skills */}
        {(task.integrations?.length || task.skills?.length) && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {task.integrations?.map((name) => (
              <span key={name} className="rounded-full bg-bg3 px-2.5 py-0.5 text-[11px] font-medium text-t2">
                {name}
              </span>
            ))}
            {task.skills?.map((name) => (
              <span key={name} className="rounded-full border border-b1 px-2.5 py-0.5 text-[11px] font-medium text-t3">
                {name}
              </span>
            ))}
          </div>
        )}

        {/* Schedule (recurring) */}
        {d?.schedule && (
          <div className="mb-4">
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
          <div className="mb-4">
            <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">
              Steps
            </div>
            <div className="flex flex-col gap-1">
              {d.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 py-0.5">
                  {step.done ? (
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
                  ) : (
                    <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                      <div className="h-[5px] w-[5px] rounded-full bg-t4" />
                    </div>
                  )}
                  <span className={`text-[12.5px] ${step.done ? "text-t2" : "text-t3"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {(d?.result || d?.artifact) && (
          <div className="mb-4">
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
                  className="flex items-center gap-1.5 text-[12px] font-medium text-blt transition-all hover:underline"
                >
                  <svg className={`h-3 w-3 transition-transform ${showFullResult ? "" : "-rotate-90"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  {showFullResult ? "Show less" : "Show full result"}
                </button>
              </div>
            )}

            {/* Artifact card */}
            {d?.artifact && (
              <ArtifactCard
                artifact={d.artifact}
                onViewResult={hasRichResult ? onViewResult : undefined}
              />
            )}
          </div>
        )}

        {/* Run history (recurring) */}
        {d?.runHistory && d.runHistory.length > 0 && (
          <div className="mb-4">
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
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-md px-2.5 py-2 transition-all hover:bg-bg3"
                  >
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-t4" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-t1">
                          {run.date}
                        </span>
                        <span className="font-mono text-[10px] text-t4">
                          {run.duration}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[12px] leading-[1.5] text-t3">
                        {run.summary}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            {d.runHistory.length > 3 && (
              <button
                onClick={() => setShowAllRuns(!showAllRuns)}
                className="mt-1 w-full rounded-md py-1.5 text-center text-[11.5px] font-medium text-t3 transition-all hover:bg-bg3 hover:text-t2"
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
            <button className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1">
              Pause
            </button>
            <button className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1">
              Cancel
            </button>
          </>
        )}
        {task.status === "queued" && (
          <>
            <button className="rounded-md bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-all hover:brightness-110">
              Run now
            </button>
            <button className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1">
              Remove from queue
            </button>
          </>
        )}
        {task.status === "recurring" && (
          <>
            <button className="rounded-md bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-all hover:brightness-110">
              Run now
            </button>
            <button
              onClick={onEditSchedule}
              className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1"
            >
              Edit schedule
            </button>
            <button
              onClick={onDisable}
              className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1"
            >
              Disable
            </button>
          </>
        )}
        {task.status === "completed" && (
          <>
            {hasRichResult && onViewResult ? (
              <button
                onClick={onViewResult}
                className="rounded-md bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-all hover:brightness-110"
              >
                View full briefing
              </button>
            ) : d?.artifact?.url ? (
              <button className="rounded-md bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-all hover:brightness-110">
                Open in {d.artifact.format === "code" ? "GitHub" : d.artifact.format === "spreadsheet" ? "Sheets" : d.artifact.format === "link" ? "browser" : "Docs"}
              </button>
            ) : (
              <button className="rounded-md bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-all hover:brightness-110">
                View in chat
              </button>
            )}
            <button className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1">
              Run again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
