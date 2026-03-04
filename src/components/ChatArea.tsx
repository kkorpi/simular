"use client";

import { useState, useEffect, useRef } from "react";
import { MorningBriefing } from "./MorningBriefing";
import { RunningTaskDetail } from "./RunningTaskDetail";
import { TaskInput } from "./TaskInput";
import { ScheduleModal } from "./ScheduleModal";
import { NewTaskCard } from "./NewTaskCard";
import { DraftCard } from "./cards/DraftCard";
import { ResultCard as NewResultCard } from "./cards/ResultCard";
import { PromptCard } from "./cards/PromptCard";
import { ChoiceCard } from "./cards/ChoiceCard";
import { DigestCard } from "./cards/DigestCard";
import { LoginRequestCard } from "./LoginRequestCard";

import { runningTaskSteps, linkedinLoginSteps, linkedinDisambiguatedSteps, disambiguationProfiles, firstRunSequences, followUpSequences, teachRecordedSteps, starterTasks } from "@/data/mockData";
import type { ViewState, LinkedInProfile, StarterTask, TeachPhase, RunningStep, ResultArtifact } from "@/data/mockData";
import { roleOptions, appOptions, type OnboardingProfile } from "./OnboardingScreen";
import { SimularLogo } from "./SimularLogo";

/** Get the "Open in ___" label for an artifact format */
function openInLabel(format: string): string {
  const labels: Record<string, string> = { spreadsheet: "Sheets", email: "Gmail", calendar: "Calendar", code: "GitHub", link: "browser" };
  return labels[format] ?? "Docs";
}

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
    default: // document, text, link
      return <svg className={cls} {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
  }
}

/** Format badge — colored per type, used in both chat and detail views */
function FormatBadge({ format }: { format: string }) {
  const config: Record<string, { label: string; style: string }> = {
    text: { label: "Text", style: "bg-bg3 text-t3" },
    briefing: { label: "Briefing", style: "bg-[rgba(59,130,246,0.15)] text-[#60a5fa]" },
    document: { label: "Doc", style: "bg-[rgba(59,130,246,0.15)] text-[#60a5fa]" },
    spreadsheet: { label: "Sheet", style: "bg-[rgba(34,197,94,0.15)] text-[#4ade80]" },
    code: { label: "Code", style: "bg-[rgba(168,85,247,0.15)] text-[#c084fc]" },
    link: { label: "Link", style: "bg-[rgba(251,191,36,0.15)] text-[#fbbf24]" },
    email: { label: "Email", style: "bg-[rgba(251,191,36,0.15)] text-[#fbbf24]" },
    calendar: { label: "Calendar", style: "bg-[rgba(34,197,94,0.15)] text-[#4ade80]" },
  };
  const c = config[format] ?? config.text;
  return (
    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${c.style}`}>
      {c.label}
    </span>
  );
}

/** Clickable artifact reference — shows icon, title, subtitle, format badge */
function ArtifactLink({ artifact }: { artifact: ResultArtifact }) {
  return (
    <button className="mt-3 flex w-full items-center gap-2.5 rounded-md border border-b1 bg-bg3h/50 px-3 py-2.5 text-left transition-all hover:bg-bg3h hover:border-b2">
      <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-bg3h"><ArtifactIcon format={artifact.format} /></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[12.5px] font-medium text-t1">{artifact.title}</span>
          <FormatBadge format={artifact.format} />
        </div>
        {artifact.subtitle && (
          <div className="mt-0.5 text-[11px] text-t3">{artifact.subtitle}</div>
        )}
      </div>
      <svg className="h-3.5 w-3.5 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </button>
  );
}

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
    <div className="ml-auto w-fit max-w-[480px] rounded-[14px_14px_4px_14px] bg-as px-4 py-2.5 text-sm text-white">
      {children}
    </div>
  );
}

/** Map task category to a line icon */
const SETUP_STEPS = [
  "Setting up your workspace",
  "Installing Chrome and apps",
  "Configuring a secure environment",
  "Preparing your coworker",
];

/** First-run result: auto-makes the task recurring by default, shown via the card's schedule footer */
function FirstRunResult({
  seq,
  taskTitle,
  onOpenDetail,
  onFirstRunMakeRecurring,
  onFirstRunRemoveRecurring,
  onOpenSchedule,
}: {
  seq: { resultTitle: string; resultSummary: string; artifact: ResultArtifact };
  taskTitle: string;
  onOpenDetail: () => void;
  onFirstRunMakeRecurring?: () => void;
  onFirstRunRemoveRecurring?: () => void;
  onOpenSchedule?: (name: string, schedule?: string, nextRun?: string) => void;
}) {
  const [madeRecurring, setMadeRecurring] = useState(false);

  // Auto-make recurring after the result card appears
  useEffect(() => {
    const timer = setTimeout(() => {
      setMadeRecurring(true);
      onFirstRunMakeRecurring?.();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Non-blocking divider */}
      <div className="flex items-center gap-2 py-1">
        <div className="h-px flex-1 bg-b1" />
        <span className="text-[10px] text-t4">task complete</span>
        <div className="h-px flex-1 bg-b1" />
      </div>

      <AgentMessage>
        <div className="text-sm leading-[1.6] text-t2 mb-3">
          All done — here&apos;s what I found:
        </div>
        <NewResultCard
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
          title={seq.resultTitle}
          body={{ type: "prose", text: (
            <>
              {seq.resultSummary}
              {/* Artifact reference */}
              <ArtifactLink artifact={seq.artifact} />
            </>
          ) }}
          actions={[
            { label: "View details", style: "primary", onClick: onOpenDetail },
            {
              label: `Open in ${openInLabel(seq.artifact.format)}`,
              style: "outline",
              icon: (
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              ),
              onClick: () => {},
            },
          ]}
          accent="green"
          schedule={madeRecurring ? {
            schedule: "Set as recurring task",
            onEdit: () => onOpenSchedule?.(taskTitle, "Every weekday at 8:00am", "Tomorrow 8:00am"),
            onTurnOff: () => {
              setMadeRecurring(false);
              onFirstRunRemoveRecurring?.();
            },
          } : {
            schedule: "Not recurring",
            onTurnOn: () => {
              setMadeRecurring(true);
              onFirstRunMakeRecurring?.();
            },
          }}
        />
      </AgentMessage>
    </>
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
  onFirstRunDone,
  onFirstRunComplete,
  onFirstRunMakeRecurring,
  onFirstRunRemoveRecurring,
  teachPhase = "idle",
  teachTaskName = "",
  onStartTeach,
  onStopTeach,
  onFinishTeach,
  onOpenWorkspace,
  workspaceOpen,
  isOnboarding,
  workspaceSetupDone,
  workspaceSetupStep,
  onOnboardingComplete,
  userRole,
  isAutoPlay,
  onStartTask,
  onLinkedinConnect,
  onAutoStepChange,
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
  onFirstRunDone?: () => void;
  onFirstRunComplete?: () => void;
  onFirstRunMakeRecurring?: () => void;
  onFirstRunRemoveRecurring?: () => void;
  teachPhase?: TeachPhase;
  teachTaskName?: string;
  onStartTeach?: () => void;
  onStopTeach?: () => void;
  onFinishTeach?: () => void;
  onOpenWorkspace?: () => void;
  workspaceOpen?: boolean;
  /** True when the user just signed up and we're collecting profile info */
  isOnboarding?: boolean;
  /** True when the workspace VM is ready */
  workspaceSetupDone?: boolean;
  /** Called when user finishes the onboarding conversation */
  onOnboardingComplete?: (profile: OnboardingProfile, task?: StarterTask) => void;
  /** User's role — for filtering tasks in fresh state */
  userRole?: string;
  /** Auto-play regular chat messages one by one */
  isAutoPlay?: boolean;
  /** Current workspace setup step index (0-3) */
  workspaceSetupStep?: number;
  /** Called when user clicks a starter task in fresh state */
  onStartTask?: (task: StarterTask) => void;
  /** Called to set linkedinConnected in parent (auto-triggered during demo) */
  onLinkedinConnect?: () => void;
  /** Called when autoStep changes so parent can sync right panel */
  onAutoStepChange?: (step: number) => void;
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
  const [showLoginCard, setShowLoginCard] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── Onboarding-in-chat state ──
  // Phase: 0 = greeting+role, 1 = apps, 2 = starter tasks
  const [obPhase, setObPhase] = useState(0);
  const [obRole, setObRole] = useState<string | undefined>();
  const [obRoleOther, setObRoleOther] = useState("");
  const [obApps, setObApps] = useState<string[]>([]);
  const [obAppOther, setObAppOther] = useState("");
  const [obCompleted, setObCompleted] = useState(false);
  const [obExiting, setObExiting] = useState(false);
  const [userText, setUserText] = useState<string | null>(null);

  // Show onboarding messages when actively onboarding OR after completion (messages persist)
  const showOnboarding = isOnboarding || obCompleted;

  // Build role-filtered starter tasks for onboarding phase 2
  // Keep tasks populated during exit animation (obExiting) until obCompleted unmounts
  const obTasks = (() => {
    if ((!isOnboarding && !obExiting) || obPhase < 2) return [];
    const roleFiltered = starterTasks.filter((t) => t.roles?.includes(obRole ?? ""));
    const general = starterTasks.filter((t) => !t.roles);
    return (roleFiltered.length > 0 ? roleFiltered : general).slice(0, 3);
  })();

  // Build role-filtered starter tasks for fresh state (no onboarding)
  const freshTasks = (() => {
    if (showOnboarding || firstRunTask || teachPhase !== "idle") return [];
    const roleFiltered = starterTasks.filter((t) => t.roles?.includes(userRole ?? ""));
    const general = starterTasks.filter((t) => !t.roles);
    return roleFiltered.length > 0 ? roleFiltered : general;
  })();

  const handleObTaskClick = (task: StarterTask) => {
    setObExiting(true);
    setTimeout(() => {
      setObCompleted(true);
      onOnboardingComplete?.(
        { role: obRole, apps: obApps.length > 0 ? obApps : undefined },
        task,
      );
    }, 400);
  };

  const handleChatSend = (text: string) => {
    // Auto-play: user submitting the prefilled message advances to the next user step
    if (isAutoPlay) {
      const userSteps = [3, 5, 9];
      const nextUserStep = userSteps.find((s) => s > autoStep);
      if (nextUserStep !== undefined) {
        setAutoStep(nextUserStep);
        scrollToBottom();
        // Resume SAI cascade from the step after this user step
        cascadeSaiSteps(nextUserStep + 1);
      }
      return;
    }

    if (isOnboarding && obPhase >= 2) {
      setObCompleted(true);
      setUserText(text);
      onOnboardingComplete?.(
        { role: obRole, apps: obApps.length > 0 ? obApps : undefined, customWorkflow: text },
      );
    }
  };

  // Scroll on onboarding phase changes
  useEffect(() => {
    if (!isOnboarding) return;
    const el = scrollContainerRef.current;
    if (el) setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }), 100);
  }, [obPhase, isOnboarding]);

  // ── First-run animated progress ──
  // firstRunStep: how many steps are visible (0 = none shown yet)
  const [firstRunStep, setFirstRunStep] = useState(0);
  const [firstRunDone, setFirstRunDone] = useState(false);
  const [firstRunExiting, setFirstRunExiting] = useState(false);
  const [firstRunShowResult, setFirstRunShowResult] = useState(false);
  const firstRunTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Follow-up task state (triggered by clicking follow-up PromptCard) ──
  const [followUpAccepted, setFollowUpAccepted] = useState(false);
  const [followUpExiting, setFollowUpExiting] = useState(false);
  const [followUpDone, setFollowUpDone] = useState(false);

  // ── Teach flow state ──
  const [teachScheduleResolved, setTeachScheduleResolved] = useState(false);
  const [teachStepCount, setTeachStepCount] = useState(0);
  const teachStepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const seq = firstRunTask ? (firstRunSequences[firstRunTask.category] ?? firstRunSequences.research) : null;

  // Animate steps appearing one by one when firstRunTask is set
  useEffect(() => {
    if (!firstRunTask || !seq) return;
    setFirstRunStep(0);
    setFirstRunDone(false);
    setFirstRunExiting(false);
    setFirstRunShowResult(false);
    setFollowUpAccepted(false);
    setFollowUpExiting(false);
    setFollowUpDone(false);

    let step = 0;
    const totalSteps = seq.steps.length;

    const advance = () => {
      step++;
      setFirstRunStep(step);
      if (step >= totalSteps) {
        // All steps revealed — fade out status messages, then show result
        setTimeout(() => {
          setFirstRunExiting(true); // start fade-out
          setTimeout(() => {
            setFirstRunDone(true);
            onFirstRunDone?.();
            setTimeout(() => setFirstRunShowResult(true), 400);
          }, 500); // allow fade-out to complete
        }, 800);
      } else {
        // Vary timing to feel organic: 1.5–3s per step
        const delay = 1500 + Math.random() * 1500;
        firstRunTimerRef.current = setTimeout(advance, delay);
      }
    };

    // Start first step after 1.5s initial delay
    const startTimer = setTimeout(advance, 1500);

    return () => {
      clearTimeout(startTimer);
      if (firstRunTimerRef.current) clearTimeout(firstRunTimerRef.current);
    };
  }, [firstRunTask, seq]);

  // Scroll to bottom as first-run progresses
  useEffect(() => {
    if (!firstRunTask) return;
    const el = scrollContainerRef.current;
    if (el) {
      setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }), 100);
    }
  }, [firstRunShowResult, firstRunTask]); // removed firstRunStep — no scroll on every step flip

  // Follow-up task animation — fade out working state, then show result
  useEffect(() => {
    if (!followUpAccepted) return;
    setFollowUpDone(false);
    setFollowUpExiting(false);
    const exitTimer = setTimeout(() => {
      setFollowUpExiting(true); // start fade-out
      setTimeout(() => {
        setFollowUpDone(true);
        // Scroll to show the result
        const el = scrollContainerRef.current;
        if (el) setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }), 100);
      }, 500);
    }, 2500);
    return () => clearTimeout(exitTimer);
  }, [followUpAccepted]);

  // Scroll when follow-up accepted (to show the working state)
  useEffect(() => {
    if (!followUpAccepted) return;
    const el = scrollContainerRef.current;
    if (el) setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }), 100);
  }, [followUpAccepted]);

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

  // Show disambiguation after LinkedIn connects
  // LoginRequestCard: 3000ms success card + 700ms fade ≈ 4000ms before showing next step
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

  // ── Auto-play: cascade SAI steps, pause at user steps ──
  const [autoStep, setAutoStep] = useState(-1);
  const AUTO_PLAY_TOTAL = 10;

  // Sync autoStep to parent for right panel task list updates
  useEffect(() => {
    onAutoStepChange?.(autoStep);
  }, [autoStep]);

  // User steps require the user to submit the prefilled message
  const USER_STEPS = new Set([3, 5, 9]);
  const SAI_STEPS = new Set([0, 1, 2, 4, 6, 7, 8]);

  // Delay (ms) before each SAI step fires (relative to previous step)
  const STEP_DELAYS: Record<number, number> = {
    0: 400, 1: 1400, 2: 1400,
    4: 1200, 6: 1200, 7: 3800, 8: 1400,
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  // Cascade SAI steps starting from `fromStep`, stopping before user steps
  const cascadeTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cascadeSaiSteps = (fromStep: number) => {
    // Clear any pending cascade timers
    cascadeTimers.current.forEach(clearTimeout);
    cascadeTimers.current = [];

    let delay = 0;
    let step = fromStep;
    while (step < AUTO_PLAY_TOTAL) {
      if (USER_STEPS.has(step)) break; // Stop — wait for user input
      delay += STEP_DELAYS[step] ?? 1400;
      const s = step;
      const d = delay;
      cascadeTimers.current.push(
        setTimeout(() => { setAutoStep(s); scrollToBottom(); }, d),
      );
      step++;
    }
  };

  // Kick off the initial SAI cascade on auto-play mount
  useEffect(() => {
    if (!isAutoPlay) { setAutoStep(-1); return; }
    cascadeSaiSteps(0);
    return () => cascadeTimers.current.forEach(clearTimeout);
  }, [isAutoPlay]);

  // Helpers for step-gated rendering during auto-play
  const show = (step: number) => !isAutoPlay || autoStep >= step;
  const fadeClass = isAutoPlay ? "animate-fade-in" : "";

  // Show login card after delay when step 9 fires (SAI navigates to LinkedIn, hits sign-in wall)
  useEffect(() => {
    const step9Visible = isAutoPlay ? autoStep >= 9 : show(9);
    if (!step9Visible || linkedinConnected) {
      if (!step9Visible) setShowLoginCard(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowLoginCard(true);
      scrollToBottom();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isAutoPlay, autoStep, linkedinConnected]);

  // Prefill: show the next user message when the cascade has paused
  const autoPlayPrefill = isAutoPlay
    ? autoStep >= 2 && autoStep < 3 ? "Pull the briefing."
    : autoStep >= 4 && autoStep < 5 ? "Also check which LPs are overdue for a touchpoint. I want to make sure I\u2019m staying on top of the P1 relationships."
    : autoStep >= 8 && autoStep < 9 ? "Check who viewed my LinkedIn profile this week and pull their backgrounds."
    : ""
    : undefined;

  const openSchedule = (name: string, schedule?: string, nextRun?: string) => {
    setScheduleTask({ name, schedule: schedule || "", nextRun: nextRun || "" });
    setScheduleOpen(true);
  };

  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-[800px] flex-col gap-8 px-8 max-md:px-4 pt-5 pb-28 max-md:pb-24">

        {/* Spacer — pushes messages to bottom when they don't fill viewport */}
        <div className="flex-1" />

        {/* ══ Fresh state — greeting + starter tasks (replaces ZeroState) ══ */}
        {!showOnboarding && !firstRunTask && teachPhase === "idle" && !isAutoPlay && view === "zero-state" && (
          <>
            <AgentMessage>
              <div className="flex gap-2.5">
                <div className="mt-0.5">
                  <SimularLogo />
                </div>
                <div>
                  <div className="text-sm leading-[1.6] text-t1">
                    Good morning, Katie.
                  </div>
                  <div className="mt-0.5 text-sm leading-[1.6] text-t2">
                    Sai works in your browser, across your apps. Here are a few things to try.
                  </div>
                </div>
              </div>
            </AgentMessage>

            <div className="flex flex-col gap-2">
              {freshTasks.map((task, i) => (
                <button
                  key={task.id}
                  onClick={() => onStartTask?.(task)}
                  className="rounded-lg border border-b1 bg-bgcard px-3.5 py-2.5 text-left transition-all hover:bg-bg2 animate-fade-in"
                  style={{ animationDelay: `${(i + 1) * 150}ms`, animationFillMode: "backwards" }}
                >
                  <div className="text-[13px] font-medium leading-[1.4] text-t1">{task.title}</div>
                  <div className="mt-0.5 text-[11.5px] text-t3">{task.apps?.slice(0, 3).join(" · ")}</div>
                </button>
              ))}
            </div>

            <AgentMessage>
              <div className="text-[13px] leading-[1.6] text-t3 animate-fade-in" style={{ animationDelay: "600ms", animationFillMode: "backwards" }}>
                Or just tell me what you need — type anything below and I&apos;ll get started.
              </div>
            </AgentMessage>
          </>
        )}

        {/* ══ Onboarding conversation ══ */}
        {showOnboarding && (
          <>
            {/* Phase 0: Greeting + Role selection */}
            <AgentMessage>
              <div className="text-sm leading-[1.6] text-t2">
                Hey! I&apos;m Sai, your AI coworker. Let me learn how you work while your workspace gets ready.
              </div>
              <div className="mt-4 rounded-lg border border-b1 bg-bgcard p-4">
                <div className="mb-3 text-[13px] font-medium text-t1">
                  What best describes your role?
                </div>
                <div className="flex flex-wrap gap-2">
                  {roleOptions.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        if (r.id === "other") {
                          setObRole("other");
                        } else {
                          setObRole(r.id);
                          if (obPhase === 0) setTimeout(() => setObPhase(1), 300);
                        }
                      }}
                      className={`rounded-md border px-3 py-1.5 text-[13px] font-medium transition-all ${
                        obRole === r.id
                          ? "border-as/50 bg-as/10 text-blt"
                          : obPhase > 0
                            ? "border-b1 bg-bg3/50 text-t4 hover:border-b2 hover:bg-bg3h cursor-pointer"
                            : "border-b1 bg-bg3 text-t2 hover:border-b2 hover:bg-bg3h"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                {obRole === "other" && !obCompleted && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={obRoleOther}
                      onChange={(e) => setObRoleOther(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && obRoleOther.trim()) {
                          setObRole(obRoleOther.trim());
                          setTimeout(() => setObPhase(1), 300);
                        }
                      }}
                      placeholder="Describe your role..."
                      className="flex-1 rounded-md border border-b1 bg-bg3 px-3 py-1.5 text-[13px] text-t1 placeholder:text-t4 outline-none focus:border-as/50"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        if (obRoleOther.trim()) {
                          setObRole(obRoleOther.trim());
                          setTimeout(() => setObPhase(1), 300);
                        }
                      }}
                      disabled={!obRoleOther.trim()}
                      className="rounded-md bg-as px-3 py-1.5 text-[12px] font-medium text-white transition-all hover:bg-as2 disabled:opacity-40"
                    >
                      Continue
                    </button>
                  </div>
                )}
                {obPhase === 0 && obRole !== "other" && (
                  <button
                    onClick={() => setObPhase(1)}
                    className="mt-3 text-[12px] font-medium text-t4 transition-colors hover:text-t3"
                  >
                    Skip →
                  </button>
                )}
              </div>
            </AgentMessage>

            {/* Phase 1: App multi-select */}
            {obPhase >= 1 && (
              <AgentMessage>
                <div className="text-sm leading-[1.6] text-t2">
                  {obRole ? `Great${obRole === "vc" ? ", investor life" : ""}! ` : ""}Which apps do you use day-to-day? I can work across all of these.
                </div>
                <div className="mt-4 rounded-lg border border-b1 bg-bgcard p-4">
                  <div className="flex flex-wrap gap-2">
                    {appOptions.map((a) => {
                      const selected = obApps.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          onClick={() => {
                            setObApps((prev) =>
                              prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id]
                            );
                          }}
                          className={`rounded-md border px-3 py-1.5 text-[13px] font-medium transition-all ${
                            selected
                              ? "border-as/50 bg-as/10 text-blt"
                              : obPhase > 1
                                ? "border-b1 bg-bg3/50 text-t4 hover:border-b2 hover:bg-bg3h cursor-pointer"
                                : "border-b1 bg-bg3 text-t2 hover:border-b2 hover:bg-bg3h"
                          }`}
                        >
                          {a.label}
                        </button>
                      );
                    })}
                    {/* Other app pill */}
                    <button
                      onClick={() => {
                        if (!obApps.includes("other")) {
                          setObApps((prev) => [...prev, "other"]);
                        } else {
                          setObApps((prev) => prev.filter((x) => x !== "other"));
                          setObAppOther("");
                        }
                      }}
                      className={`rounded-md border px-3 py-1.5 text-[13px] font-medium transition-all ${
                        obApps.includes("other")
                          ? "border-as/50 bg-as/10 text-blt"
                          : obPhase > 1
                            ? "border-b1 bg-bg3/50 text-t4 hover:border-b2 hover:bg-bg3h cursor-pointer"
                            : "border-b1 bg-bg3 text-t2 hover:border-b2 hover:bg-bg3h"
                      }`}
                    >
                      Other
                    </button>
                  </div>
                  {obApps.includes("other") && !obCompleted && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={obAppOther}
                        onChange={(e) => setObAppOther(e.target.value)}
                        placeholder="e.g. Asana, Figma, Airtable..."
                        className="w-full rounded-md border border-b1 bg-bg3 px-3 py-1.5 text-[13px] text-t1 placeholder:text-t4 outline-none focus:border-as/50"
                        autoFocus
                      />
                    </div>
                  )}
                  {obPhase === 1 && (
                    <button
                      onClick={() => setObPhase(2)}
                      className={`mt-3 text-[12px] font-medium transition-colors ${
                        obApps.length > 0 ? "text-blt hover:text-as2" : "text-t4 hover:text-t3"
                      }`}
                    >
                      {obApps.length > 0 ? "Continue →" : "Skip →"}
                    </button>
                  )}
                </div>
              </AgentMessage>
            )}

            {/* Phase 2: Starter tasks inline */}
            {obPhase >= 2 && !obCompleted && (
              <div className={`flex flex-col gap-8 transition-opacity duration-400 ease-out ${obExiting ? "opacity-0" : "opacity-100"}`}>
                <AgentMessage>
                  <div className="text-sm leading-[1.6] text-t2 animate-fade-in">
                    {workspaceSetupDone
                      ? <>Your workspace is ready. Here are a few things I can do:</>
                      : <><span className="shimmer-text">{SETUP_STEPS[Math.min(workspaceSetupStep ?? 0, SETUP_STEPS.length - 1)]}...</span> Here are a few things I can do:</>}
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    {obTasks.map((task, i) => (
                      <button
                        key={task.id}
                        onClick={() => handleObTaskClick(task)}
                        disabled={obExiting}
                        className="rounded-lg border border-b1 bg-bgcard px-3.5 py-2.5 text-left transition-all hover:bg-bg2 disabled:pointer-events-none animate-fade-in"
                        style={{ animationDelay: `${(i + 1) * 150}ms`, animationFillMode: "backwards" }}
                      >
                        <div className="text-[13px] font-medium leading-[1.4] text-t1">{task.title}</div>
                        <div className="mt-0.5 text-[11.5px] text-t3">{task.apps?.slice(0, 3).join(" · ")}</div>
                      </button>
                    ))}
                  </div>
                </AgentMessage>
                <AgentMessage>
                  <div className="text-[13px] leading-[1.6] text-t3 animate-fade-in" style={{ animationDelay: `${(obTasks.length + 1) * 150}ms`, animationFillMode: "backwards" }}>
                    Or just tell me what you need — type anything below and I&apos;ll get started.
                  </div>
                </AgentMessage>
              </div>
            )}
          </>
        )}

        {/* ══ User's typed message (shown before first-run when they typed a custom task) ══ */}
        {userText && (
          <UserMessage>{userText}</UserMessage>
        )}

        {/* ══ First-run experience ══ */}
        {firstRunTask && seq && (
          <div className="flex flex-col gap-8 animate-fade-in">
            <AgentMessage>
              <div className="text-sm leading-[1.6] text-t2">{seq.intro}</div>
              <RunningTaskDetail
                steps={seq.steps.slice(0, firstRunStep).map((s, i): RunningStep => ({
                  ...s,
                  done: firstRunDone ? true : i < firstRunStep - 1,
                }))}
                subtasks={[seq.subtask]}
                onViewActivityLog={onViewActivityLog}
                done={firstRunDone}
              />
            </AgentMessage>

            {/* "I'll let you know" + mobile upsell — opacity fades, then height collapses */}
            <div className="collapsible" data-open={!firstRunDone}>
              <div>
                <div className={`flex flex-col gap-8 transition-opacity duration-500 ease-out ${firstRunExiting ? "opacity-0" : "opacity-100"}`}>
                  <AgentMessage>
                    <div className="text-sm leading-[1.6] text-t2">
                      I&apos;ll let you know when this is ready — you can keep chatting or close this tab.
                    </div>
                  </AgentMessage>

                  <PromptCard
                    variant="compact"
                    icon={
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                        <line x1="12" y1="18" x2="12.01" y2="18" />
                      </svg>
                    }
                    message={<><strong>Get updates on mobile.</strong> I&apos;ll ping you when this task is done.</>}
                    actions={[
                      { label: "Send me the link", style: "primary", onClick: () => {} },
                      { label: "Maybe later", style: "outline", onClick: () => {} },
                    ]}
                  />
                </div>
              </div>
            </div>

            {firstRunShowResult && (
              <div className="flex flex-col gap-8 animate-fade-in">
                <FirstRunResult
                  seq={seq}
                  taskTitle={firstRunTask.title}
                  onOpenDetail={onOpenDetail}
                  onFirstRunMakeRecurring={onFirstRunMakeRecurring}
                  onFirstRunRemoveRecurring={onFirstRunRemoveRecurring}
                  onOpenSchedule={openSchedule}
                />

                {/* Follow-up suggestion — inline text with link action */}
                {!followUpAccepted && (
                  <AgentMessage>
                    <div className="text-sm leading-[1.6] text-t2">
                      {firstRunTask.category === "research"
                        ? "Want me to look up these founders on LinkedIn and pull their recent activity?"
                        : firstRunTask.category === "crm"
                          ? "Should I cross-reference these with PitchBook for funding details?"
                          : "Want me to schedule follow-ups in your calendar based on these drafts?"}
                    </div>
                    <button
                      onClick={() => setFollowUpAccepted(true)}
                      className="relative mt-1 inline-flex items-center py-1 text-[13px] font-medium text-blt transition-all hover:underline"
                    >
                      {firstRunTask.category === "research" ? "Yes, search LinkedIn →" : firstRunTask.category === "crm" ? "Yes, check PitchBook →" : "Yes, schedule them →"}
                    </button>
                  </AgentMessage>
                )}

                {/* Follow-up task execution */}
                {followUpAccepted && (() => {
                  const fuSeq = followUpSequences[firstRunTask.category] ?? followUpSequences.research;
                  return (
                    <>
                      {/* Agent acknowledges — running state fades out on completion */}
                      <AgentMessage>
                        <div className="text-sm leading-[1.6] text-t2">
                          {fuSeq.agentMessage}
                        </div>
                        <div className="collapsible" data-open={!followUpDone}>
                          <div>
                            <div className={`mt-3 transition-opacity duration-500 ease-out ${followUpExiting ? "opacity-0" : "opacity-100"}`}>
                              <RunningTaskDetail
                                steps={[{ timestamp: "0:02", label: fuSeq.subtask + "...", done: false }]}
                                subtasks={[fuSeq.subtask]}
                                done={false}
                              />
                            </div>
                          </div>
                        </div>
                      </AgentMessage>

                      {/* Follow-up result — fades in */}
                      {followUpDone && (
                        <div className="flex flex-col gap-8 animate-fade-in">
                          <div className="flex items-center gap-2 py-1">
                            <div className="h-px flex-1 bg-b1" />
                            <span className="text-[10px] text-t4">task complete</span>
                            <div className="h-px flex-1 bg-b1" />
                          </div>
                          <AgentMessage>
                            <div className="text-sm leading-[1.6] text-t2 mb-3">
                              Done — here&apos;s what I found:
                            </div>
                            <NewResultCard
                              icon={
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              }
                              title={fuSeq.resultTitle}
                              body={{ type: "prose", text: (
                                <>
                                  {fuSeq.resultSummary}
                                  <ArtifactLink artifact={fuSeq.artifact} />
                                </>
                              ) }}
                              actions={[
                                { label: "View details", style: "primary", onClick: onOpenDetail },
                                {
                                  label: `Open in ${openInLabel(fuSeq.artifact.format)}`,
                                  style: "outline",
                                  icon: (
                                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                      <polyline points="15 3 21 3 21 9" />
                                      <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                  ),
                                  onClick: () => {},
                                },
                              ]}
                              accent="green"
                            />
                          </AgentMessage>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ══ Teach flow conversation ══ */}
        {!showOnboarding && teachPhase !== "idle" && !firstRunTask && (
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

        {/* ══ Regular chat (hidden during first run, teach flow, and onboarding) ══ */}
        {!showOnboarding && !firstRunTask && teachPhase === "idle" && (isAutoPlay || view !== "zero-state") && (
          <>
        {/* Step 0: Morning briefing */}
        {show(0) && (
          <div className={fadeClass}>
            <AgentMessage>
              <MorningBriefing />
            </AgentMessage>
          </div>
        )}

        {/* Step 1: Email digest + Deal sourcing digest */}
        {show(1) && (
          <div className={fadeClass}>
            <AgentContinuation>
              <div className="text-sm leading-[1.6] text-t2">
                Here&apos;s what your recurring tasks caught while you were away.
              </div>
              <DigestCard
                icon={
                  <svg className="h-3.5 w-3.5 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 014-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 01-4 4H3" />
                  </svg>
                }
                title="Important email reminder"
                runCount={10}
                statLine="Scanned 300 emails across 10 runs · 42 important · 8 requiring action"
                actionItems={[
                  { text: "AT&T past-due bill — $255.30", runDate: "Feb 28, 3:01 PM", action: { label: "Pay bill", onClick: () => {} } },
                  { text: "Lia Ng (ByteDance) AI research follow-up", runDate: "Mar 2, 3:02 PM", action: { label: "Draft reply", onClick: () => {} } },
                  { text: "Paper accepted — Agentic AI in the Wild (register by Mar 5)", runDate: "Feb 27, 3:01 PM", action: { label: "Register", onClick: () => {} } },
                  { text: "Third Bridge paid consultation request", runDate: "Feb 27, 8:01 AM", action: { label: "Review", onClick: () => {} } },
                ]}
                runs={[
                  { date: "Mar 3, 3:01 PM", summary: "3 important: Belmont Dojo reply, Mercury, university follow-up", hasActionItems: true },
                  { date: "Mar 3, 8:01 AM", summary: "No emails requiring action — 28 marketing/promos filtered", hasActionItems: false },
                  { date: "Mar 2, 3:02 PM", summary: "6 important, 2 requiring action: Lia Ng follow-up, contractor invoice", hasActionItems: true },
                  { date: "Mar 2, 8:01 AM", summary: "4 potentially important, none requiring action", hasActionItems: false },
                  { date: "Mar 1, 3:00 PM", summary: "3 noteworthy: Xfinity bill, AppleCare, standup notes", hasActionItems: false },
                  { date: "Mar 1, 8:02 AM", summary: "3 important: Xfinity bill, AppleCare, meeting reschedule", hasActionItems: true },
                  { date: "Feb 28, 3:01 PM", summary: "7 important, 2 requiring action: AT\u0026T $255.30, AppleCare renewal", hasActionItems: true },
                  { date: "Feb 28, 8:01 AM", summary: "2 FYI-level: Robinhood statement, LinkedIn digest", hasActionItems: false },
                  { date: "Feb 27, 3:01 PM", summary: "5 important, 1 action: paper accepted to workshop", hasActionItems: true },
                  { date: "Feb 27, 8:01 AM", summary: "4 important, 1 action: Third Bridge consultation request", hasActionItems: true },
                ]}
                schedule={{
                  schedule: "Runs twice daily at 8am and 3pm",
                  onEdit: () => openSchedule("Important email reminder", "Every day at 8:00am and 3:00pm", "Tomorrow 8:00am"),
                  onTurnOff: () => {},
                }}
              />
              <div className="mt-3 text-sm leading-[1.6] text-t2">
                Your <strong className="font-semibold text-t1">deal sourcing digest</strong> also ran — three new deals worth reviewing.
              </div>
              <NewResultCard
                icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
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
                accent="green"
                actions={[
                  { label: "View report", style: "primary", onClick: onOpenDetail },
                  {
                    label: "Open in Sheets",
                    style: "outline",
                    icon: (
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    ),
                    onClick: () => {},
                  },
                ]}
                schedule={{
                  schedule: "Runs every morning at 7am",
                  onEdit: () => openSchedule("Daily deal sourcing digest", "Every day at 7:00am", "Tomorrow 7:00am"),
                  onTurnOff: () => {},
                }}
              />
            </AgentContinuation>
          </div>
        )}

        {/* Step 2: Meeting prompt */}
        {show(2) && (
          <div className={fadeClass}>
            <AgentContinuation>
              <div className="text-sm leading-[1.6] text-t2">
                You have an <strong className="font-semibold text-t1">LP meeting with Sequoia Scouts on Thursday</strong>. Want me to pull your prep briefing now?
              </div>
              {isAutoPlay && autoStep >= 2 && autoStep < 3 && (
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={() => { setAutoStep(3); scrollToBottom(); cascadeSaiSteps(4); }}
                    className="rounded-md bg-ab px-2.5 py-1 text-xs font-medium text-abt transition-all hover:brightness-110"
                  >
                    Yes, pull it
                  </button>
                  <button className="rounded-md border border-b1 px-2.5 py-1 text-xs font-medium text-t2 transition-all hover:border-b2 hover:bg-bg3h hover:text-t1">
                    Not now
                  </button>
                </div>
              )}
            </AgentContinuation>
          </div>
        )}

        {/* Step 3: User: "Pull the briefing" */}
        {show(3) && (
          <div className={fadeClass}>
            <UserMessage>Pull the briefing.</UserMessage>
          </div>
        )}

        {/* Step 4: Running task + divider */}
        {show(4) && (view === "task-hover" || isAutoPlay) && (
          <div className={fadeClass}>
            <AgentMessage>
              <div className="text-sm leading-[1.6] text-t2">
                On it, pulling your Sequoia Scouts LP prep now.
              </div>
              <RunningTaskDetail
                steps={runningTaskSteps}
                subtasks={["Researching Sequoia Scouts"]}
                onViewActivityLog={onViewActivityLog}
                done={isAutoPlay && autoStep >= 7}
              />
            </AgentMessage>
          </div>
        )}

        {/* Step 5: User: "Also check LPs..." */}
        {show(5) && (
          <div className={fadeClass}>
            <UserMessage>
              Also check which LPs are overdue for a touchpoint. I want to
              make sure I&apos;m staying on top of the P1 relationships.
            </UserMessage>
          </div>
        )}

        {/* Step 6: Running task 2 + divider */}
        {show(6) && (view === "task-hover" || isAutoPlay) && (
          <div className={fadeClass}>
            <AgentMessage>
              <div className="text-sm leading-[1.6] text-t2">
                On it, I&apos;ll check your LP touchpoints while the briefing runs.
              </div>
              <RunningTaskDetail
                steps={[]}
                subtasks={["Checking Salesforce LP records"]}
                done={isAutoPlay && autoStep >= 8}
              />
            </AgentMessage>
          </div>
        )}

        {/* Step 7: Briefing result ResultCard */}
        {show(7) && (
          <div className={fadeClass}>
            <AgentMessage>
              <div className="text-sm leading-[1.6] text-t2 mb-3">
                Here&apos;s your Sequoia Scouts LP prep.
              </div>
              <NewResultCard
                icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                title="Sequoia Scouts - LP Meeting Prep"
                subtitle="5 sources - just now"
                body={{
                  type: "prose",
                  text: <><strong className="font-semibold text-t1">Sequoia Scouts</strong> ($2.5B AUM). P1 LP since Fund II, last touchpoint 45 days ago.{view !== "result-detail" && <> Key contact: <strong className="font-semibold text-t1">Ravi Gupta</strong>, Managing Director. Considering Fund IV commitment.</>}</>,
                }}
                accent="green"
                highlighted={view === "result-detail"}
                actions={
                  view === "result-detail"
                    ? [{ label: "\u2190 Viewing", style: "primary", onClick: () => {} }]
                    : [
                        { label: "View details", style: "primary", onClick: onOpenDetail },
                        {
                          label: "Open in Docs",
                          style: "outline",
                          icon: (
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          ),
                          onClick: () => {},
                        },
                      ]
                }
              />
            </AgentMessage>
          </div>
        )}

        {/* Step 8: LP touchpoint report + recurring PromptCard */}
        {show(8) && (
          <div className={fadeClass}>
            <AgentMessage>
              <div className="text-sm leading-[1.6] text-t2 mb-3">
                Here&apos;s your LP touchpoint report. A few relationships need attention.
              </div>
              <NewResultCard
                icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
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
                accent="green"
                actions={[
                  { label: "View details", style: "primary", onClick: onOpenDetail },
                  {
                    label: "Open in Sheets",
                    style: "outline",
                    icon: (
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    ),
                    onClick: () => {},
                  },
                ]}
                schedule={{
                  schedule: "Not recurring",
                  onTurnOn: () => openSchedule("LP touchpoint tracker", "Every Monday at 8:00am", "Next Monday 8:00am"),
                }}
              />
            </AgentMessage>
          </div>
        )}

        {/* Step 9: LinkedIn flow — user message + login + disambiguation + draft */}
        {show(9) && (
          <div className={`flex flex-col gap-8 ${fadeClass}`}>
            <UserMessage>
              Check who viewed my LinkedIn profile this week and pull their backgrounds.
            </UserMessage>

            <AgentMessage>
              <div className="text-sm leading-[1.6] text-t2">
                On it — let me check your LinkedIn profile viewers.
              </div>
              <RunningTaskDetail
                steps={selectedProfile ? linkedinDisambiguatedSteps : linkedinLoginSteps}
                subtasks={["Checking LinkedIn profile viewers"]}
                onViewActivityLog={onViewActivityLog}
                done={showDisambig}
              />
            </AgentMessage>

            {/* Login card appears mid-task when SAI hits the sign-in wall */}
            {showLoginCard && (
              <AgentMessage>
                <LoginRequestCard
                  service="LinkedIn"
                  onLogin={() => onOpenWorkspaceForLogin?.("LinkedIn")}
                  connected={linkedinConnected}
                />
              </AgentMessage>
            )}

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
                    onApprove={() => { setAutoStep(10); }}
                    onDeny={() => { setAutoStep(10); }}
                    onOpenWorkspace={onViewActivityLog}
                    resolvedMessage={`Posted comment on ${selectedProfile.name}'s article`}
                  />
                )}
              </AgentMessage>
            )}
          </div>
        )}

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
        <TaskInput onSlashCommand={onSlashCommand} onSend={handleChatSend} prefillText={autoPlayPrefill} />
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
