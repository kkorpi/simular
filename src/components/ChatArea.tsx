"use client";

import { useState, useEffect, useRef } from "react";
import { MorningBriefing } from "./MorningBriefing";
import { RunningTaskDetail } from "./RunningTaskDetail";
import { LoginRequestCard } from "./LoginRequestCard";
import { TaskInput } from "./TaskInput";
import { ScheduleModal } from "./ScheduleModal";
import { NewTaskCard } from "./NewTaskCard";
import { DraftCard } from "./cards/DraftCard";
import { ProgressCard } from "./cards/ProgressCard";
import { ResultCard as NewResultCard } from "./cards/ResultCard";
import { PromptCard } from "./cards/PromptCard";
import { ChoiceCard } from "./cards/ChoiceCard";
import type { ProgressStepStatus } from "./cards/ProgressCard";

import { runningTaskSteps, linkedinLoginSteps, linkedinDisambiguatedSteps, disambiguationProfiles, firstRunSequences, teachRecordedSteps } from "@/data/mockData";
import type { ViewState, LinkedInProfile, StarterTask, TeachPhase } from "@/data/mockData";

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
  firstRunTask,
  onFirstRunComplete,
  teachPhase = "idle",
  teachTaskName = "",
  onStartTeach,
  onStopTeach,
  onFinishTeach,
  onOpenWorkspace,
  workspaceOpen,
}: {
  view: ViewState;
  onOpenDetail: () => void;
  onViewActivityLog?: () => void;
  onOpenWorkspaceForLogin?: (service: string) => void;
  onSlashCommand?: (command: string) => void;
  showNewTaskCard?: boolean;
  onCloseNewTask?: () => void;
  linkedinConnected?: boolean;
  firstRunTask?: StarterTask | null;
  onFirstRunComplete?: () => void;
  teachPhase?: TeachPhase;
  teachTaskName?: string;
  onStartTeach?: () => void;
  onStopTeach?: () => void;
  onFinishTeach?: () => void;
  onOpenWorkspace?: () => void;
  workspaceOpen?: boolean;
}) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleTask, setScheduleTask] = useState({
    name: "",
    schedule: "",
    nextRun: "",
  });
  const [selectedProfile, setSelectedProfile] = useState<LinkedInProfile | null>(null);
  const [showDisambig, setShowDisambig] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── First-run animated progress ──
  const [firstRunStep, setFirstRunStep] = useState(0);
  const [firstRunDone, setFirstRunDone] = useState(false);
  const [firstRunShowResult, setFirstRunShowResult] = useState(false);
  const firstRunTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Teach flow state ──
  const [teachScheduleResolved, setTeachScheduleResolved] = useState(false);
  const [teachStepCount, setTeachStepCount] = useState(0);
  const teachStepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const seq = firstRunTask ? (firstRunSequences[firstRunTask.category] ?? firstRunSequences.research) : null;

  // Animate progress steps when firstRunTask is set
  useEffect(() => {
    if (!firstRunTask || !seq) return;
    setFirstRunStep(0);
    setFirstRunDone(false);
    setFirstRunShowResult(false);

    // Start stepping after 1.5s initial delay
    const startTimer = setTimeout(() => {
      let step = 0;
      firstRunTimerRef.current = setInterval(() => {
        step++;
        if (step >= seq.steps.length) {
          if (firstRunTimerRef.current) clearInterval(firstRunTimerRef.current);
          setFirstRunStep(seq.steps.length);
          setFirstRunDone(true);
          // Show result after a brief pause
          setTimeout(() => setFirstRunShowResult(true), 800);
        } else {
          setFirstRunStep(step);
        }
      }, 1200);
    }, 1500);

    return () => {
      clearTimeout(startTimer);
      if (firstRunTimerRef.current) clearInterval(firstRunTimerRef.current);
    };
  }, [firstRunTask, seq]);

  // Scroll to bottom as first-run progresses
  useEffect(() => {
    if (!firstRunTask) return;
    const el = scrollContainerRef.current;
    if (el) {
      setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }), 100);
    }
  }, [firstRunStep, firstRunShowResult, firstRunTask]);

  // Reset teach state when phase changes
  useEffect(() => {
    if (teachPhase === "idle" || teachPhase === "suggest") {
      setTeachScheduleResolved(false);
      setTeachStepCount(0);
    }
  }, [teachPhase]);

  // Animate teach steps appearing one by one during recording
  useEffect(() => {
    if (teachPhase !== "recording") return;
    setTeachStepCount(0);

    // Reveal steps on a staggered timer (simulating real-time capture)
    let step = 0;
    const reveal = () => {
      step++;
      if (step > teachRecordedSteps.length) {
        // All steps revealed — stop, but don't auto-complete
        return;
      }
      setTeachStepCount(step);
      // Vary timing to feel organic: 2–4s per step
      const delay = 2000 + Math.random() * 2000;
      teachStepTimerRef.current = setTimeout(reveal, delay);
    };
    // First step after a short delay
    teachStepTimerRef.current = setTimeout(reveal, 1800);

    return () => {
      if (teachStepTimerRef.current) clearTimeout(teachStepTimerRef.current);
    };
  }, [teachPhase]);

  // Scroll when teach phase changes or new steps appear
  useEffect(() => {
    if (teachPhase === "idle") return;
    const el = scrollContainerRef.current;
    if (el) {
      setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }), 100);
    }
  }, [teachPhase, teachScheduleResolved, teachStepCount]);

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

  // Show confirmation card after profile disambiguation
  useEffect(() => {
    if (!selectedProfile) {
      setShowConfirmation(false);
      return;
    }
    const timer = setTimeout(() => setShowConfirmation(true), 3000);
    return () => clearTimeout(timer);
  }, [selectedProfile]);

  // Scroll chat to bottom when confirmation card appears
  useEffect(() => {
    if (!showConfirmation) return;
    const timer = setTimeout(() => {
      const el = scrollContainerRef.current;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [showConfirmation]);

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
        <div className="mx-auto flex max-w-[800px] flex-col gap-8 px-8 max-md:px-4 pt-5 pb-28 max-md:pb-24">

        {/* ══ First-run experience ══ */}
        {firstRunTask && seq && (
          <>
            <AgentMessage>
              <div className="text-sm leading-[1.6] text-t2">{seq.intro}</div>
              <div className="mt-3">
                <ProgressCard
                  title={firstRunTask.title}
                  subtitle="Working in browser"
                  steps={seq.steps.map((s, i): { label: string; status: ProgressStepStatus; detail?: string } => ({
                    label: s.label,
                    status: i < firstRunStep ? "done" : i === firstRunStep && !firstRunDone ? "running" : firstRunDone ? "done" : "pending",
                    detail: s.detail,
                  }))}
                  onCancel={() => onFirstRunComplete?.()}
                />
              </div>
            </AgentMessage>

            {firstRunShowResult && (
              <>
                {/* Non-blocking divider */}
                <div className="flex items-center gap-2 py-1">
                  <div className="h-px flex-1 bg-b1" />
                  <span className="text-[10px] text-t4">task complete</span>
                  <div className="h-px flex-1 bg-b1" />
                </div>

                <AgentMessage>
                  <div className="text-sm leading-[1.6] text-t2 mb-3">
                    All done. {seq.resultSummary}
                  </div>
                  <NewResultCard
                    icon={
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    }
                    title={seq.resultTitle}
                    body={{ type: "prose", text: seq.resultSummary }}
                    actions={[
                      { label: "View full results", style: "primary", onClick: onOpenDetail },
                      { label: "Open in workspace", style: "outline", onClick: () => {} },
                    ]}
                    accent="green"
                  />
                </AgentMessage>

                <AgentMessage>
                  <div className="text-sm leading-[1.6] text-t2">
                    Want me to set this up as a recurring task, or is there something else I can help with?
                  </div>
                  <div className="mt-2.5 flex gap-2">
                    <button
                      onClick={() => onFirstRunComplete?.()}
                      className="flex items-center gap-1.5 rounded-md bg-ab px-3 py-1.5 text-[12.5px] font-medium text-abt transition-all hover:brightness-110"
                    >
                      Make it recurring
                    </button>
                    <button
                      onClick={() => onFirstRunComplete?.()}
                      className="flex items-center gap-1.5 rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12.5px] font-medium text-t2 transition-all hover:border-b2 hover:bg-bg3h hover:text-t1"
                    >
                      Try something else
                    </button>
                  </div>
                </AgentMessage>
              </>
            )}
          </>
        )}

        {/* ══ Teach flow conversation ══ */}
        {teachPhase !== "idle" && !firstRunTask && (
          <>
            {/* ── Pre-teach: user message + agent suggestion + prompt card ── */}
            <UserMessage>
              Forward my Asana weekly digest to the #updates Slack channel every Monday morning.
            </UserMessage>

            <AgentMessage>
              <div className="text-sm leading-[1.6] text-t2">
                I haven&apos;t done this specific task before. Asana&apos;s digest layout varies by workspace, and you&apos;ll want to choose which sections to forward. Want to show me how you do it? I&apos;ll watch and learn the steps, then I can repeat it on my own going forward.
              </div>
              <div className="mt-2.5">
                <PromptCard
                  message={<>I can learn this by watching you do it once. I&apos;ll record each step so I can <strong className="font-semibold text-t1">repeat it autonomously</strong> next time.</>}
                  actions={[
                    { label: "Show me how", style: "primary", onClick: () => onStartTeach?.() },
                    { label: "Just describe it", style: "outline", onClick: () => {} },
                  ]}
                  resolvedMessage="Starting teach mode..."
                />
              </div>
            </AgentMessage>

            {/* ── After clicking "Show me how" → transition message ── */}
            {(teachPhase === "recording" || teachPhase === "complete") && (
              <AgentMessage>
                <div className="text-sm leading-[1.6] text-t2">
                  Opening your workspace. Just do the task as you normally would — I&apos;ll record each step.
                </div>
              </AgentMessage>
            )}

            {/* ── Recording in progress — live step log ── */}
            {teachPhase === "recording" && (
              <AgentMessage>
                <div className="rounded-lg border border-violet-500/30 bg-violet-500/[0.03] overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5">
                    <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-violet-500/15">
                      <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse-dot" style={{ "--pulse-glow": "rgba(139, 92, 246, 0.5)" } as React.CSSProperties} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-t1">{teachTaskName || "Recording task"}</div>
                      <div className="text-[11px] text-violet-400">
                        {teachStepCount === 0 ? "Watching..." : `${teachStepCount} step${teachStepCount === 1 ? "" : "s"} recorded`}
                      </div>
                    </div>
                  </div>

                  {/* Step list */}
                  {teachStepCount > 0 && (
                    <div className="border-t border-violet-500/15 px-3.5 py-2.5">
                      <div className="flex flex-col gap-1.5">
                        {teachRecordedSteps.slice(0, teachStepCount).map((step, i) => (
                          <div key={i} className="flex items-start gap-2 text-[12px] leading-[1.5] text-t2 animate-in fade-in duration-300">
                            <svg className="mt-[3px] h-3 w-3 shrink-0 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{step}</span>
                          </div>
                        ))}
                        {/* Active capture dot when not all steps revealed */}
                        {teachStepCount < teachRecordedSteps.length && (
                          <div className="flex items-center gap-2 text-[12px] text-violet-400/60 pl-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse-dot" style={{ "--pulse-glow": "rgba(139, 92, 246, 0.4)" } as React.CSSProperties} />
                            <span className="italic">Watching for next action...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer actions */}
                  <div className="flex items-center gap-2 border-t border-violet-500/15 px-3.5 py-2">
                    {!workspaceOpen && (
                      <button
                        onClick={() => onOpenWorkspace?.()}
                        className="rounded-md border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-400 transition-all hover:bg-violet-500/20"
                      >
                        Open workspace
                      </button>
                    )}
                    <div className="flex-1" />
                    <button
                      onClick={() => onStopTeach?.()}
                      className="rounded-md bg-violet-500 px-3 py-1 text-[11px] font-semibold text-white transition-all hover:bg-violet-600"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </AgentMessage>
            )}

            {/* ── Post-teach summary ── */}
            {teachPhase === "complete" && (
              <>
                <AgentMessage>
                  <div className="text-sm leading-[1.6] text-t2 mb-3">
                    Got it — here&apos;s what I learned:
                  </div>
                  <NewResultCard
                    icon={
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    }
                    title={teachTaskName || "Recorded task"}
                    subtitle={`${teachRecordedSteps.length} steps recorded`}
                    accent="green"
                    body={{
                      type: "highlights",
                      items: teachRecordedSteps.map((step) => ({
                        text: step,
                        dot: "green" as const,
                      })),
                    }}
                    actions={[
                      { label: "Edit steps", style: "outline", onClick: () => {} },
                    ]}
                  />
                </AgentMessage>

                <AgentContinuation>
                  <PromptCard
                    variant="compact"
                    icon={
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="17 1 21 5 17 9" />
                        <path d="M3 11V9a4 4 0 014-4h14" />
                        <polyline points="7 23 3 19 7 15" />
                        <path d="M21 13v2a4 4 0 01-4 4H3" />
                      </svg>
                    }
                    message={<>Want me to do this <strong className="font-semibold text-t1">every Monday at 9am</strong>?</>}
                    actions={[
                      {
                        label: "Yes, every Monday",
                        style: "primary",
                        onClick: () => setTeachScheduleResolved(true),
                      },
                      {
                        label: "Save without schedule",
                        style: "outline",
                        onClick: () => setTeachScheduleResolved(true),
                      },
                    ]}
                    resolvedMessage={`Scheduled: ${teachTaskName || "Task"} → every Monday 9am`}
                  />
                </AgentContinuation>

                {/* Final confirmation after scheduling */}
                {teachScheduleResolved && (
                  <>
                    <AgentMessage>
                      <div className="text-sm leading-[1.6] text-t2">
                        All set. I&apos;ll forward your Asana digest to #updates every Monday at 9am. You&apos;ll find it in your task list.
                      </div>
                    </AgentMessage>

                    {/* Divider at the end of the teach session */}
                    <div className="flex items-center gap-2 py-1">
                      <div className="h-px flex-1 bg-violet-500/20" />
                      <span className="text-[10px] font-medium text-violet-400">teach session complete</span>
                      <div className="h-px flex-1 bg-violet-500/20" />
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* ══ Regular chat (hidden during first run and teach flow) ══ */}
        {!firstRunTask && teachPhase === "idle" && (
          <>
        {/* ── Morning group: greeting + scan result + meeting offer ── */}
        <AgentMessage>
          <MorningBriefing />
        </AgentMessage>

        <AgentContinuation>
          <div className="text-sm leading-[1.65] text-t2">
            Your <strong className="font-semibold text-t1">deal sourcing digest</strong> is ready. Three new deals worth reviewing this morning.
          </div>
          <div className="mt-2 max-w-[520px]">
            <NewResultCard
              icon={<svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
              title="Deal Sourcing Digest - Feb 13"
              subtitle="3 new deals flagged - ran at 7:04am"
              body={{
                type: "highlights",
                items: [
                  { text: <><strong className="font-medium text-t1">Abridge</strong> raised $150M Series C led by Lightspeed, clinical AI documentation</>, dot: "neutral" },
                  { text: <><strong className="font-medium text-t1">NovaTech AI</strong> (YC W25) $4.2M seed, vertical AI for supply chain compliance</>, dot: "neutral" },
                  { text: <><strong className="font-medium text-t1">ClearStack</strong> $3.1M seed, AI procurement, second-time founder (prev. exit to Coupa)</>, dot: "neutral" },
                ],
              }}
              actions={[{ label: "View report", style: "primary", onClick: onOpenDetail }]}
              schedule={{
                schedule: "Runs every morning at 7am",
                onEdit: () => openSchedule("Daily deal sourcing digest", "Every day at 7:00am", "Tomorrow 7:00am"),
                onTurnOff: () => {},
              }}
            />
          </div>
        </AgentContinuation>

        {/* ── Mobile app promo ── */}
        <AgentContinuation>
          <div className="mt-1 flex max-w-[520px] items-center gap-3 rounded-lg border border-b1 bg-bgcard p-4.5">
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
          <PromptCard
            message={<>You have an <strong className="font-semibold text-t1">LP meeting with Sequoia Scouts on Thursday</strong>. Want me to pull your prep briefing now?</>}
            actions={[
              { label: "Pull briefing", style: "primary", onClick: () => {} },
              { label: "Skip", style: "outline", onClick: () => {} },
            ]}
          />
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
          <div className="mt-2 max-w-[520px]">
            <NewResultCard
              icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>}
              title="Sequoia Scouts - LP Meeting Prep"
              subtitle="5 sources - just now"
              body={{
                type: "prose",
                text: <><strong className="font-semibold text-t1">Sequoia Scouts</strong> ($2.5B AUM). P1 LP since Fund II, last touchpoint 45 days ago.{view !== "result-detail" && <> Key contact: <strong className="font-semibold text-t1">Ravi Gupta</strong>, Managing Director. Considering Fund IV commitment.</>}</>,
              }}
              highlighted={view === "result-detail"}
              actions={
                view === "result-detail"
                  ? [{ label: "\u2190 Viewing", style: "primary", onClick: () => {} }]
                  : [
                      { label: "Open full prep", style: "primary", onClick: onOpenDetail },
                      { label: "Copy", style: "outline", onClick: () => {} },
                      { label: "Sources", style: "outline", onClick: () => {} },
                    ]
              }
            />
          </div>
        </AgentMessage>

        {/* ── Salesforce result + recurring offer ── */}
        <AgentMessage>
          <div className="text-sm leading-[1.6] text-t2">
            Here&apos;s your LP touchpoint report. A few relationships need attention.
          </div>
          <div className="mt-2 max-w-[520px]">
            <NewResultCard
              icon={<svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>}
              title="LP Touchpoint Report - Feb 13"
              subtitle="4 LPs overdue - 5 actions suggested"
              body={{
                type: "highlights",
                items: [
                  { text: <><strong className="font-medium text-t1">Wellington</strong> 72 days since last touchpoint. Suggest: share portfolio update deck.</>, dot: "amber" },
                  { text: <><strong className="font-medium text-t1">GIC Singapore</strong> 68 days overdue. Suggest: invite to AI in Healthcare webinar.</>, dot: "amber" },
                  { text: <><strong className="font-medium text-t1">12 other P1 LPs</strong> are within your 60-day touchpoint cadence</>, dot: "green" },
                ],
              }}
              actions={[{ label: "View details", style: "primary", onClick: onOpenDetail }]}
            />
          </div>
          <div className="mt-2.5 max-w-[520px]">
            <PromptCard
              variant="compact"
              icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg>}
              message={<><strong className="font-medium text-t1">Want me to run this every Monday?</strong> I&apos;ll track LP touchpoints and suggest outreach to keep you on cadence.</>}
              actions={[
                { label: "Yes, weekly", style: "primary", onClick: () => openSchedule("LP touchpoint tracker", undefined, "Next Monday 8:00am") },
                { label: "No thanks", style: "outline", onClick: () => {} },
              ]}
              resolvedMessage="LP touchpoint tracker set for every Monday at 8am"
            />
          </div>
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
              <ChoiceCard
                question=""
                layout="cards"
                options={disambiguationProfiles.map((p) => ({
                  id: p.id,
                  title: p.name,
                  subtitle: `${p.title} at ${p.company}`,
                  detail: `${p.mutualConnections} mutual connections`,
                  icon: <span className="text-[11px] font-semibold">{p.initials}</span>,
                }))}
                onSelect={(selected) => {
                  const profile = disambiguationProfiles.find((p) => p.id === selected[0]?.id);
                  if (profile) setSelectedProfile(profile);
                }}
                resolvedMessage={(selected) => `Selected: ${selected[0]?.title}`}
              />
            </AgentMessage>
          </div>
        )}

        {/* ── Disambiguation confirmation ── */}
        {selectedProfile && (
          <AgentMessage>
            <div className="text-sm leading-[1.6] text-t2">
              Got it, using <strong className="font-semibold text-t1">{selectedProfile.name}</strong> at {selectedProfile.company}. I found an article they posted and drafted a comment for you.
            </div>
            {showConfirmation && (
              <DraftCard
                intent="Before I post this, want to review it?"
                fields={[
                  { type: "text", value: `Great insights on the Series A landscape, ${selectedProfile.name.split(" ")[0]}. The point about founder-market fit being more predictive than TAM at early stages really resonates \u2014 we've seen the same pattern across our portfolio. Would love to compare notes sometime.`, editable: true },
                ]}
                approveLabel="Post it"
                denyLabel="Don't post"
                accent="amber"
                onApprove={() => {}}
                onDeny={() => {}}
                onOpenWorkspace={onViewActivityLog}
                resolvedMessage={`Posted comment on ${selectedProfile.name}'s article`}
              />
            )}
          </AgentMessage>
        )}

        {/* Non-blocking divider — after all LinkedIn task sub-steps */}
        <div className="flex items-center gap-2 py-1">
          <div className="h-px flex-1 bg-b1" />
          <span className="text-[10px] text-t4">task running above</span>
          <div className="h-px flex-1 bg-b1" />
        </div>

          </>
        )}

        </div>
      </div>

      {/* New task input */}
      <div className="absolute bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-[800px] px-6 max-md:px-3 pb-4 pt-8 bg-gradient-to-t from-bg from-60% to-transparent">
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
