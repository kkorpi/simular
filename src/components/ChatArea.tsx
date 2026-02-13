"use client";

import { useState } from "react";
import { SimularLogo } from "./SimularLogo";
import { MorningBriefing } from "./MorningBriefing";
import { CompetitorScanResult } from "./CompetitorScanResult";
import { MeetingPrompt } from "./MeetingPrompt";
import { RunningTaskDetail } from "./RunningTaskDetail";
import { ResultCard } from "./ResultCard";
import { SalesforceResult } from "./SalesforceResult";
import { ScheduleModal } from "./ScheduleModal";

import { runningTaskSteps } from "@/data/mockData";
import type { ViewState } from "@/data/mockData";

/** Agent message with avatar — use for the first message in a group */
function AgentMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-[620px] gap-2.5">
      <div className="mt-0.5 shrink-0">
        <SimularLogo size={24} />
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** Continuation message — no avatar, just indented to align with text above */
function AgentContinuation({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[620px] pl-[34px]">
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-auto max-w-[480px] rounded-[14px_14px_4px_14px] border border-b1 bg-as px-4 py-2.5 text-sm text-t1">
      {children}
    </div>
  );
}

export function ChatArea({
  view,
  onOpenDetail,
  onViewActivityLog,
}: {
  view: ViewState;
  onOpenDetail: () => void;
  onViewActivityLog?: () => void;
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
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-8 py-5">
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
                subtasks={["Researching Sequoia Scouts..."]}
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
                subtasks={["Checking Salesforce LP records..."]}
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
          <div className="mt-1 flex max-w-[520px] items-center gap-3 rounded-xl border border-b1 bg-bg3 p-3.5">
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
            <button className="shrink-0 rounded-lg bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-all hover:brightness-110">
              Get app
            </button>
          </div>
        </AgentContinuation>
      </div>

      {/* New task input */}
      <div className="shrink-0 px-8 pb-4">
        <button className="flex w-full cursor-pointer items-center gap-2 rounded-[10px] border border-b1 bg-transparent px-4 py-2.5 text-[13px] font-medium text-t3 transition-all hover:border-b2 hover:bg-bg3 hover:text-t2">
          <span className="text-base font-normal leading-none">+</span>
          New task
          <span className="ml-auto rounded bg-bg3 px-1.5 py-0.5 font-mono text-[10.5px] text-t4">
            {"\u2318"}K
          </span>
        </button>
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
