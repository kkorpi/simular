"use client";

import { useState } from "react";
import { MorningBriefing } from "./MorningBriefing";
import { CompetitorScanResult } from "./CompetitorScanResult";
import { MeetingPrompt } from "./MeetingPrompt";
import { RunningTaskDetail } from "./RunningTaskDetail";
import { ResultCard } from "./ResultCard";
import { SalesforceResult } from "./SalesforceResult";
import { TaskInput } from "./TaskInput";
import { ScheduleModal } from "./ScheduleModal";
import { NewTaskCard } from "./NewTaskCard";

import { runningTaskSteps } from "@/data/mockData";
import type { ViewState } from "@/data/mockData";

/** Agent message block */
function AgentMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[620px]">
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Continuation message — same layout, used for follow-up blocks */
function AgentContinuation({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[620px]">
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-auto max-w-[480px] rounded-[14px_14px_4px_14px] bg-as px-4 py-2.5 text-sm text-white">
      {children}
    </div>
  );
}

export function ChatArea({
  view,
  onOpenDetail,
  onViewActivityLog,
  onSlashCommand,
  showNewTaskCard,
  onCloseNewTask,
}: {
  view: ViewState;
  onOpenDetail: () => void;
  onViewActivityLog?: () => void;
  onSlashCommand?: (command: string) => void;
  showNewTaskCard?: boolean;
  onCloseNewTask?: () => void;
}) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleTask, setScheduleTask] = useState({
    name: "",
    schedule: "",
    nextRun: "",
  });

  const openSchedule = (name: string, schedule?: string, nextRun?: string) => {
    setScheduleTask({ name, schedule: schedule || "", nextRun: nextRun || "" });
    setScheduleOpen(true);
  };

  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[800px] flex-col gap-8 px-8 pt-5 pb-28">
        {/* ── Morning group: greeting + scan result + meeting offer ── */}
        <AgentMessage>
          <MorningBriefing />
        </AgentMessage>

        <AgentContinuation>
          <CompetitorScanResult
            onEditSchedule={() =>
              openSchedule(
                "Daily deal sourcing digest",
                "Every day at 7:00am",
                "Tomorrow 7:00am"
              )
            }
          />
        </AgentContinuation>

        <AgentContinuation>
          <MeetingPrompt />
        </AgentContinuation>

        {/* ── User clicks "Pull briefing" ── */}
        <UserMessage>Pull the briefing.</UserMessage>

        {/* ── Simular starts the briefing task ── */}
        {view === "task-hover" && (
          <>
            <AgentMessage>
              <div className="text-sm leading-[1.6] text-t2">
                On it, pulling your Sequoia Scouts LP prep now.
              </div>
              <RunningTaskDetail
                steps={runningTaskSteps}
                subtasks={["Researching Sequoia Scouts"]}
                integrations={["Salesforce", "Google Docs", "Calendar"]}
                onViewActivityLog={onViewActivityLog}
              />
            </AgentMessage>

            {/* Non-blocking divider */}
            <div className="flex items-center gap-2 py-1">
              <div className="h-px flex-1 bg-b1" />
              <span className="text-[10px] text-t4">task running above</span>
              <div className="h-px flex-1 bg-b1" />
            </div>
          </>
        )}

        {/* ── User adds a follow-up request ── */}
        <UserMessage>
          Also check which LPs are overdue for a touchpoint. I want to
          make sure I&apos;m staying on top of the P1 relationships.
        </UserMessage>

        {/* ── Simular picks up the second task in parallel ── */}
        {view === "task-hover" && (
          <>
            <AgentMessage>
              <div className="text-sm leading-[1.6] text-t2">
                On it, I&apos;ll check your LP touchpoints while the briefing runs.
              </div>
              <RunningTaskDetail
                steps={[]}
                subtasks={["Checking Salesforce LP records"]}
                integrations={["Salesforce", "Calendar", "Gmail"]}
              />
            </AgentMessage>

            {/* Non-blocking divider */}
            <div className="flex items-center gap-2 py-1">
              <div className="h-px flex-1 bg-b1" />
              <span className="text-[10px] text-t4">task running above</span>
              <div className="h-px flex-1 bg-b1" />
            </div>
          </>
        )}

        {/* ── Briefing result ── */}
        <AgentMessage>
          <div className="text-sm leading-[1.6] text-t2">
            Here&apos;s your Sequoia Scouts LP prep.
          </div>
          <ResultCard
            highlighted={view === "result-detail"}
            onOpenDetail={onOpenDetail}
          />
        </AgentMessage>

        {/* ── Salesforce result + recurring offer ── */}
        <AgentMessage>
          <SalesforceResult
            onEditSchedule={() =>
              openSchedule(
                "LP touchpoint tracker",
                undefined,
                "Next Monday 8:00am"
              )
            }
          />
        </AgentMessage>

        {/* ── Mobile app promo ── */}
        <AgentContinuation>
          <div className="mt-1 flex max-w-[520px] items-center gap-3 rounded-xl border border-b1 bg-bg3 p-4.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg3h">
              <svg className="h-[18px] w-[18px] text-t1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium text-t1">
                Monitor tasks on the go
              </div>
              <div className="mt-0.5 text-[12px] leading-[1.5] text-t3">
                Get the Simular mobile app to track progress, get alerts, and review results from your phone.
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              {/* QR code */}
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-lg border border-b1 bg-bg p-1">
                <svg viewBox="0 0 21 21" className="h-full w-full" shapeRendering="crispEdges">
                  {/* QR code pattern */}
                  <rect width="21" height="21" fill="white" />
                  {/* Top-left finder */}
                  <rect x="0" y="0" width="7" height="7" fill="#111" />
                  <rect x="1" y="1" width="5" height="5" fill="white" />
                  <rect x="2" y="2" width="3" height="3" fill="#111" />
                  {/* Top-right finder */}
                  <rect x="14" y="0" width="7" height="7" fill="#111" />
                  <rect x="15" y="1" width="5" height="5" fill="white" />
                  <rect x="16" y="2" width="3" height="3" fill="#111" />
                  {/* Bottom-left finder */}
                  <rect x="0" y="14" width="7" height="7" fill="#111" />
                  <rect x="1" y="15" width="5" height="5" fill="white" />
                  <rect x="2" y="16" width="3" height="3" fill="#111" />
                  {/* Timing patterns */}
                  <rect x="8" y="0" width="1" height="1" fill="#111" />
                  <rect x="10" y="0" width="1" height="1" fill="#111" />
                  <rect x="12" y="0" width="1" height="1" fill="#111" />
                  <rect x="0" y="8" width="1" height="1" fill="#111" />
                  <rect x="0" y="10" width="1" height="1" fill="#111" />
                  <rect x="0" y="12" width="1" height="1" fill="#111" />
                  {/* Data modules */}
                  <rect x="8" y="2" width="1" height="1" fill="#111" />
                  <rect x="9" y="3" width="1" height="1" fill="#111" />
                  <rect x="10" y="2" width="1" height="1" fill="#111" />
                  <rect x="11" y="4" width="1" height="1" fill="#111" />
                  <rect x="12" y="3" width="1" height="1" fill="#111" />
                  <rect x="8" y="5" width="1" height="1" fill="#111" />
                  <rect x="10" y="5" width="1" height="1" fill="#111" />
                  <rect x="12" y="5" width="1" height="1" fill="#111" />
                  <rect x="8" y="8" width="1" height="1" fill="#111" />
                  <rect x="9" y="9" width="1" height="1" fill="#111" />
                  <rect x="10" y="8" width="1" height="1" fill="#111" />
                  <rect x="11" y="9" width="1" height="1" fill="#111" />
                  <rect x="12" y="8" width="1" height="1" fill="#111" />
                  <rect x="8" y="10" width="1" height="1" fill="#111" />
                  <rect x="10" y="10" width="1" height="1" fill="#111" />
                  <rect x="12" y="10" width="1" height="1" fill="#111" />
                  <rect x="8" y="12" width="1" height="1" fill="#111" />
                  <rect x="9" y="11" width="1" height="1" fill="#111" />
                  <rect x="11" y="11" width="1" height="1" fill="#111" />
                  <rect x="12" y="12" width="1" height="1" fill="#111" />
                  <rect x="14" y="8" width="1" height="1" fill="#111" />
                  <rect x="15" y="9" width="1" height="1" fill="#111" />
                  <rect x="16" y="8" width="1" height="1" fill="#111" />
                  <rect x="17" y="9" width="1" height="1" fill="#111" />
                  <rect x="18" y="8" width="1" height="1" fill="#111" />
                  <rect x="14" y="10" width="1" height="1" fill="#111" />
                  <rect x="16" y="10" width="1" height="1" fill="#111" />
                  <rect x="18" y="10" width="1" height="1" fill="#111" />
                  <rect x="20" y="10" width="1" height="1" fill="#111" />
                  <rect x="14" y="12" width="1" height="1" fill="#111" />
                  <rect x="15" y="11" width="1" height="1" fill="#111" />
                  <rect x="17" y="11" width="1" height="1" fill="#111" />
                  <rect x="19" y="12" width="1" height="1" fill="#111" />
                  <rect x="20" y="11" width="1" height="1" fill="#111" />
                  <rect x="8" y="14" width="1" height="1" fill="#111" />
                  <rect x="9" y="15" width="1" height="1" fill="#111" />
                  <rect x="10" y="14" width="1" height="1" fill="#111" />
                  <rect x="11" y="15" width="1" height="1" fill="#111" />
                  <rect x="8" y="16" width="1" height="1" fill="#111" />
                  <rect x="10" y="16" width="1" height="1" fill="#111" />
                  <rect x="12" y="16" width="1" height="1" fill="#111" />
                  <rect x="9" y="17" width="1" height="1" fill="#111" />
                  <rect x="11" y="17" width="1" height="1" fill="#111" />
                  <rect x="8" y="18" width="1" height="1" fill="#111" />
                  <rect x="10" y="18" width="1" height="1" fill="#111" />
                  <rect x="14" y="14" width="1" height="1" fill="#111" />
                  <rect x="16" y="14" width="1" height="1" fill="#111" />
                  <rect x="18" y="14" width="1" height="1" fill="#111" />
                  <rect x="20" y="14" width="1" height="1" fill="#111" />
                  <rect x="15" y="15" width="1" height="1" fill="#111" />
                  <rect x="17" y="15" width="1" height="1" fill="#111" />
                  <rect x="19" y="15" width="1" height="1" fill="#111" />
                  <rect x="14" y="16" width="1" height="1" fill="#111" />
                  <rect x="16" y="16" width="1" height="1" fill="#111" />
                  <rect x="18" y="16" width="1" height="1" fill="#111" />
                  <rect x="20" y="16" width="1" height="1" fill="#111" />
                  <rect x="15" y="17" width="1" height="1" fill="#111" />
                  <rect x="19" y="17" width="1" height="1" fill="#111" />
                  <rect x="14" y="18" width="1" height="1" fill="#111" />
                  <rect x="16" y="18" width="1" height="1" fill="#111" />
                  <rect x="20" y="18" width="1" height="1" fill="#111" />
                  <rect x="15" y="19" width="1" height="1" fill="#111" />
                  <rect x="17" y="19" width="1" height="1" fill="#111" />
                  <rect x="19" y="19" width="1" height="1" fill="#111" />
                  <rect x="14" y="20" width="1" height="1" fill="#111" />
                  <rect x="16" y="20" width="1" height="1" fill="#111" />
                  <rect x="18" y="20" width="1" height="1" fill="#111" />
                  <rect x="20" y="20" width="1" height="1" fill="#111" />
                </svg>
              </div>
              <button className="shrink-0 rounded-lg bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-all hover:brightness-110">
                Get app
              </button>
            </div>
          </div>
        </AgentContinuation>
        </div>
      </div>

      {/* New task input */}
      <div className="absolute bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-[800px] px-6 pb-4 pt-8 bg-gradient-to-t from-bg from-60% to-transparent">
        {showNewTaskCard && (
          <NewTaskCard
            onClose={() => onCloseNewTask?.()}
            onCreate={() => onCloseNewTask?.()}
          />
        )}
        <TaskInput onSlashCommand={onSlashCommand} />
      </div>

      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        taskName={scheduleTask.name}
        currentSchedule={scheduleTask.schedule || undefined}
        nextRun={scheduleTask.nextRun || undefined}
      />
    </div>
  );
}
