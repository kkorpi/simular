"use client";

import { useState, useEffect, useRef } from "react";
import { MorningBriefing } from "./MorningBriefing";
import { CompetitorScanResult } from "./CompetitorScanResult";
import { MeetingPrompt } from "./MeetingPrompt";
import { RunningTaskDetail } from "./RunningTaskDetail";
import { ResultCard } from "./ResultCard";
import { SalesforceResult } from "./SalesforceResult";
import { LoginRequestCard } from "./LoginRequestCard";
import { ProfileDisambiguation } from "./ProfileDisambiguation";
import { TaskInput } from "./TaskInput";
import { ScheduleModal } from "./ScheduleModal";
import { NewTaskCard } from "./NewTaskCard";

import { runningTaskSteps, linkedinLoginSteps, linkedinDisambiguatedSteps, disambiguationProfiles } from "@/data/mockData";
import type { ViewState, LinkedInProfile } from "@/data/mockData";

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
  onOpenWorkspaceForLogin,
  onSlashCommand,
  showNewTaskCard,
  onCloseNewTask,
  linkedinConnected,
}: {
  view: ViewState;
  onOpenDetail: () => void;
  onViewActivityLog?: () => void;
  onOpenWorkspaceForLogin?: (service: string) => void;
  onSlashCommand?: (command: string) => void;
  showNewTaskCard?: boolean;
  onCloseNewTask?: () => void;
  linkedinConnected?: boolean;
}) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleTask, setScheduleTask] = useState({
    name: "",
    schedule: "",
    nextRun: "",
  });
  const [selectedProfile, setSelectedProfile] = useState<LinkedInProfile | null>(null);
  const [showDisambig, setShowDisambig] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Show disambiguation after login card finishes its full transition
  // LoginRequestCard: 3000ms show + 700ms fade = ~3700ms, round up to 4000ms
  useEffect(() => {
    if (!linkedinConnected) {
      setShowDisambig(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowDisambig(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [linkedinConnected]);

  // Scroll chat to bottom when disambiguation appears
  useEffect(() => {
    if (!showDisambig) return;
    const timer = setTimeout(() => {
      const el = scrollContainerRef.current;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [showDisambig]);

  const openSchedule = (name: string, schedule?: string, nextRun?: string) => {
    setScheduleTask({ name, schedule: schedule || "", nextRun: nextRun || "" });
    setScheduleOpen(true);
  };

  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
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

        {/* ── Mobile app promo ── */}
        <AgentContinuation>
          <div className="mt-1 flex max-w-[520px] items-center gap-3 rounded-lg border border-b1 bg-bg3 p-4.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-bg3h">
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
            <button className="shrink-0 rounded-md bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-all hover:brightness-110">
              Get app
            </button>
          </div>
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

        {/* ── LinkedIn login flow ── */}
        <UserMessage>
          Check who viewed my LinkedIn profile this week and pull their backgrounds.
        </UserMessage>

        {/* ── Login success + task continuing ── */}
        <AgentMessage>
          <div className="flex items-center gap-2 text-sm text-t2">
            <svg className="h-4 w-4 shrink-0 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Connected to LinkedIn. Continuing with your task.
          </div>
          <RunningTaskDetail
            steps={selectedProfile ? linkedinDisambiguatedSteps : linkedinLoginSteps}
            subtasks={["Checking LinkedIn profile viewers"]}
            integrations={["LinkedIn"]}
            onViewActivityLog={onViewActivityLog}
            initialExpanded
          />
        </AgentMessage>

        <AgentMessage>
          <div className="text-sm leading-[1.6] text-t2">
            {linkedinConnected
              ? "Thanks for signing in. I'm pulling your LinkedIn profile viewers now."
              : "I'll check your LinkedIn profile views. I need you to sign in first so I can access your account."}
          </div>
          <LoginRequestCard
            service="LinkedIn"
            onLogin={() => onOpenWorkspaceForLogin?.("LinkedIn")}
            connected={linkedinConnected}
          />
        </AgentMessage>

        {/* ── Profile disambiguation ── */}
        {showDisambig && (
          <div className="transition-all duration-500 opacity-100 translate-y-0 animate-in">
            <AgentMessage>
              <div className="text-sm leading-[1.6] text-t2">
                I found 3 profiles matching &quot;Daniel Park.&quot; Which one are you looking for?
              </div>
              <ProfileDisambiguation
                profiles={disambiguationProfiles}
                selectedId={selectedProfile?.id ?? null}
                onSelect={setSelectedProfile}
              />
            </AgentMessage>
          </div>
        )}

        {/* ── Disambiguation confirmation ── */}
        {selectedProfile && (
          <AgentMessage>
            <div className="text-sm leading-[1.6] text-t2">
              Got it, using <strong className="font-semibold text-t1">{selectedProfile.name}</strong> at {selectedProfile.company}. Continuing with the task.
            </div>
          </AgentMessage>
        )}

        {/* Non-blocking divider — after all LinkedIn task sub-steps */}
        <div className="flex items-center gap-2 py-1">
          <div className="h-px flex-1 bg-b1" />
          <span className="text-[10px] text-t4">task running above</span>
          <div className="h-px flex-1 bg-b1" />
        </div>

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
