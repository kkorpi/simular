"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { TopBar } from "@/components/TopBar";
import { ChatArea } from "@/components/ChatArea";
import { RightPanel } from "@/components/RightPanel";
import { FullWorkspaceView } from "@/components/FullWorkspaceView";
import { ZeroState } from "@/components/ZeroState";
import { SettingsOverlay, type SettingsSection } from "@/components/SettingsOverlay";
import { CardGallery } from "@/components/CardGallery";
import { LandingPage } from "@/components/LandingPage";
import { SignupSSO } from "@/components/SignupSSO";
import { SignupPayment } from "@/components/SignupPayment";
import { WaitlistSignup } from "@/components/WaitlistSignup";
import { WaitlistConfirmation } from "@/components/WaitlistConfirmation";
import { OnboardingScreen, type OnboardingProfile } from "@/components/OnboardingScreen";
import { SEATS_REMAINING_INIT, TEACH_TASK_NAME, type ViewState, type StarterTask, type TeachPhase } from "@/data/mockData";

const PIP_MIN_WIDTH = 200;
const PIP_MAX_WIDTH = 520;
const PIP_DEFAULT_WIDTH = 320;

type AppScreen = "landing" | "waitlist-signup" | "signup-sso" | "signup-payment" | "onboarding" | "waitlist" | "main-app";

export default function Home() {
  // ── Screen flow ──
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [userProfile, setUserProfile] = useState<OnboardingProfile>({});

  // ── Trial / seat state (mock) ──
  const [seatsRemaining, setSeatsRemaining] = useState(SEATS_REMAINING_INIT);
  const [capReached, setCapReached] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistPosition, setWaitlistPosition] = useState(0);

  // ── Main app state ──
  const [activeView, setActiveView] = useState<ViewState>("zero-state");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection | undefined>(undefined);
  const [cardGalleryOpen, setCardGalleryOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<"default" | "login" | "teach">("default");
  const [workspaceService, setWorkspaceService] = useState<string>("");
  // Default collapsed on mobile so the drawer doesn't flash open on first render
  const [panelCollapsed, setPanelCollapsed] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth < 768;
    return false;
  });
  const [showNewTaskCard, setShowNewTaskCard] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [workspaceConnecting, setWorkspaceConnecting] = useState(false);
  const [firstRunTask, setFirstRunTask] = useState<StarterTask | null>(null);
  const [demoPickerOpen, setDemoPickerOpen] = useState(false);
  const [teachPhase, setTeachPhase] = useState<TeachPhase>("idle");
  const [teachTaskName, setTeachTaskName] = useState("");
  const [trialDaysLeft, setTrialDaysLeft] = useState(6);
  const [trialDialogOpen, setTrialDialogOpen] = useState(false);
  const [pipWidth, setPipWidth] = useState(PIP_DEFAULT_WIDTH);
  const pipDragging = useRef(false);
  const pipDragStartX = useRef(0);
  const pipDragStartWidth = useRef(PIP_DEFAULT_WIDTH);

  // ── Read URL params: ?ref=CODE and ?demo=MODE ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setInviteCode(ref.toUpperCase());

    const demo = params.get("demo");
    if (demo === "fresh") {
      setUserProfile({ role: "vc" });
      setScreen("main-app");
      setActiveView("zero-state");
    } else if (demo === "active") {
      setUserProfile({ role: "vc" });
      setScreen("main-app");
      setActiveView("task-hover");
    } else if (demo === "gallery") {
      setUserProfile({ role: "vc" });
      setScreen("main-app");
      setCardGalleryOpen(true);
    }
  }, []);

  // ── Cmd+Shift+D → demo mode picker ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setDemoPickerOpen((v) => !v);
      }
      if (e.key === "Escape" && demoPickerOpen) {
        setDemoPickerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [demoPickerOpen]);

  const jumpToDemo = (mode: "fresh" | "active" | "gallery" | "landing" | "teach" | "trial") => {
    setDemoPickerOpen(false);
    setFirstRunTask(null);
    setWorkspaceOpen(false);
    setSettingsOpen(false);
    setCardGalleryOpen(false);
    setTeachPhase("idle");
    setTeachTaskName("");
    setTrialDialogOpen(false);
    if (mode === "landing") {
      setScreen("landing");
      return;
    }
    setUserProfile({ role: "vc" });
    setScreen("main-app");
    if (mode === "fresh") {
      setTrialDaysLeft(6);
      setActiveView("zero-state");
    } else if (mode === "active") {
      setTrialDaysLeft(6);
      setActiveView("task-hover");
    } else if (mode === "gallery") {
      setTrialDaysLeft(6);
      setCardGalleryOpen(true);
    } else if (mode === "teach") {
      setTrialDaysLeft(6);
      setActiveView("task-hover");
      setTeachPhase("suggest");
      setTeachTaskName(TEACH_TASK_NAME);
    } else if (mode === "trial") {
      setTrialDaysLeft(1);
      setActiveView("task-hover");
      setTimeout(() => setTrialDialogOpen(true), 400);
    }
  };

  // ── Cap detection ──
  useEffect(() => {
    if (seatsRemaining <= 0) setCapReached(true);
  }, [seatsRemaining]);

  // ── Flow handlers ──
  const handleClaimSpot = (code: string) => {
    setInviteCode(code);
    setSeatsRemaining((s) => s - 1);
    setScreen("signup-sso");
  };

  const handleJoinWaitlist = (email: string) => {
    setWaitlistEmail(email);
    setWaitlistPosition(312 + Math.floor(Math.random() * 50));
    setScreen("waitlist");
  };

  // ── Main app handlers ──
  const handleStartTask = (task: StarterTask) => {
    setFirstRunTask(task);
    setWorkspaceConnecting(true);
    setActiveView("task-hover");
    setTimeout(() => setWorkspaceConnecting(false), 3000);
  };

  const handleOpenWorkspaceForLogin = (service: string) => {
    setWorkspaceMode("login");
    setWorkspaceService(service);
    setWorkspaceOpen(true);
  };

  const handleSlashCommand = (command: string) => {
    switch (command) {
      case "skills":
        setSettingsSection("skills");
        setSettingsOpen(true);
        break;
      case "integrations":
        setSettingsSection("workspace");
        setSettingsOpen(true);
        break;
      case "settings":
        setSettingsSection("appearance");
        setSettingsOpen(true);
        break;
      case "history":
        break;
      case "schedule":
        setShowNewTaskCard(true);
        break;
      case "teach":
        setTeachTaskName("Custom task");
        handleStartTeach();
        break;
    }
  };

  // ── Teach flow handlers ──
  const handleStartTeach = () => {
    setTeachPhase("recording");
    setWorkspaceMode("teach");
    setWorkspaceOpen(true);
  };

  const handleStopTeach = () => {
    setWorkspaceOpen(false);
    setWorkspaceMode("default");
    setTeachPhase("complete");
  };

  const handleFinishTeach = () => {
    setTeachPhase("idle");
    setTeachTaskName("");
  };

  const showPip = panelCollapsed && activeView !== "zero-state";

  const handlePipResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    pipDragging.current = true;
    pipDragStartX.current = e.clientX;
    pipDragStartWidth.current = pipWidth;
    document.body.style.cursor = "nesw-resize";
    document.body.style.userSelect = "none";
  }, [pipWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!pipDragging.current) return;
      const deltaX = pipDragStartX.current - e.clientX;
      const newWidth = Math.max(PIP_MIN_WIDTH, Math.min(PIP_MAX_WIDTH, pipDragStartWidth.current + deltaX));
      setPipWidth(newWidth);
    };
    const handleMouseUp = () => {
      if (!pipDragging.current) return;
      pipDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // ── Demo picker overlay (Cmd+Shift+D) ──
  const demoPicker = demoPickerOpen && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDemoPickerOpen(false)}>
      <div className="w-[340px] max-md:w-[calc(100vw-2rem)] rounded-xl border border-b1 bg-bg2 p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[13px] font-semibold text-t1">Demo Mode</div>
        <div className="mb-4 text-[11px] text-t3">Jump to any state. <span className="font-mono text-t4">Cmd+Shift+D</span></div>
        <div className="flex flex-col gap-2">
          {([
            { mode: "fresh" as const, label: "First run", desc: "ZeroState — pick a starter task", icon: "🌱" },
            { mode: "active" as const, label: "Active session", desc: "Full chat + tasks + workspace", icon: "💬" },
            { mode: "gallery" as const, label: "Card gallery", desc: "Browse all 11 card components", icon: "🎴" },
            { mode: "teach" as const, label: "Teach flow", desc: "Agent suggests showing it a custom task", icon: "📖" },
            { mode: "trial" as const, label: "Trial expiring", desc: "1 day left — charge warning dialog", icon: "⚠️" },
            { mode: "landing" as const, label: "Landing page", desc: "Back to the gated signup flow", icon: "🏠" },
          ]).map((opt) => (
            <button
              key={opt.mode}
              onClick={() => jumpToDemo(opt.mode)}
              className="flex items-center gap-3 rounded-lg border border-b1 bg-bgcard px-3.5 py-3 text-left shadow-[var(--card-shadow)] transition-all hover:border-b2 hover:bg-bg3h"
            >
              <span className="text-[18px]">{opt.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-t1">{opt.label}</div>
                <div className="text-[11px] text-t3">{opt.desc}</div>
              </div>
              <svg className="h-4 w-4 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Screen routing ──
  switch (screen) {
    case "landing":
      return (
        <>
        {demoPicker}
        <LandingPage
          initialCode={inviteCode}
          seatsRemaining={seatsRemaining}
          capReached={capReached}
          onClaimSpot={handleClaimSpot}
          onGoToWaitlist={() => setScreen("waitlist-signup")}
        />
        </>
      );

    case "waitlist-signup":
      return (
        <>
        {demoPicker}
        <WaitlistSignup
          onSubmit={(email) => {
            handleJoinWaitlist(email);
          }}
          onBack={() => setScreen("landing")}
        />
        </>
      );

    case "signup-sso":
      return (
        <>
        {demoPicker}
        <SignupSSO
          onSignIn={() => setScreen("signup-payment")}
          onBack={() => setScreen("landing")}
        />
        </>
      );

    case "signup-payment":
      return (
        <>
        {demoPicker}
        <SignupPayment
          onSubmit={() => setScreen("onboarding")}
          onBack={() => setScreen("signup-sso")}
        />
        </>
      );

    case "onboarding":
      return (
        <>
        {demoPicker}
        <OnboardingScreen
          onReady={(profile) => {
            setUserProfile(profile);
            setWorkspaceConnecting(true);
            setScreen("main-app");
            // Auto-clear connecting state after 3s
            setTimeout(() => setWorkspaceConnecting(false), 3000);
          }}
        />
        </>
      );

    case "waitlist":
      return (
        <>
        {demoPicker}
        <WaitlistConfirmation
          email={waitlistEmail}
          position={waitlistPosition}
        />
        </>
      );

    case "main-app":
      return (
        <div className="flex h-screen flex-col">
          <TopBar
            isZeroState={activeView === "zero-state"}
            onOpenSettings={() => setSettingsOpen(true)}
            onGoHome={() => { setActiveView("zero-state"); setFirstRunTask(null); setTeachPhase("idle"); setTeachTaskName(""); }}
            onOpenSubscription={() => { setSettingsSection("subscription"); setSettingsOpen(true); }}
            onOpenCredits={() => { setSettingsSection("credits"); setSettingsOpen(true); }}
            onOpenPanel={() => setPanelCollapsed(false)}
            trialDaysLeft={trialDaysLeft}
          />
          <div className="flex flex-1 overflow-hidden">
            {activeView === "zero-state" ? (
              <ZeroState
                onStartTask={handleStartTask}
                onCreateOwn={() => setActiveView("task-hover")}
                userRole={userProfile.role}
              />
            ) : (
              <>
                <ChatArea
                  view={activeView}
                  onOpenDetail={() => setActiveView("result-detail")}
                  onViewActivityLog={() => { setWorkspaceMode("default"); setWorkspaceOpen(true); }}
                  onOpenWorkspaceForLogin={handleOpenWorkspaceForLogin}
                  onSlashCommand={handleSlashCommand}
                  showNewTaskCard={showNewTaskCard}
                  onCloseNewTask={() => setShowNewTaskCard(false)}
                  linkedinConnected={linkedinConnected}
                  firstRunTask={firstRunTask}
                  onFirstRunComplete={() => setFirstRunTask(null)}
                  teachPhase={teachPhase}
                  teachTaskName={teachTaskName}
                  onStartTeach={handleStartTeach}
                  onStopTeach={handleStopTeach}
                  onFinishTeach={handleFinishTeach}
                  onOpenWorkspace={() => setWorkspaceOpen(true)}
                  workspaceOpen={workspaceOpen}
                />
                <RightPanel
                  view={activeView}
                  onViewChange={setActiveView}
                  onOpenWorkspace={() => setWorkspaceOpen(true)}
                  collapsed={panelCollapsed}
                  onToggleCollapse={() => setPanelCollapsed((c) => !c)}
                  workspaceConnecting={workspaceConnecting}
                  firstRunTask={firstRunTask}
                  teachPhase={teachPhase}
                  teachTaskName={teachTaskName}
                />
              </>
            )}
          </div>

          {/* Floating PiP workspace when sidebar is collapsed (desktop only) */}
          <div
            className={`group fixed top-[54px] right-4 z-40 overflow-hidden rounded-lg border border-b1 bg-bg2 shadow-2xl transition-[opacity,transform] duration-300 ease-out max-md:hidden ${
              showPip ? "translate-y-0 opacity-100" : "-translate-y-2 pointer-events-none opacity-0"
            }`}
            style={{ width: pipWidth }}
          >
            {/* Header: task info + expand */}
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${workspaceConnecting ? "bg-am animate-pulse" : "bg-g animate-running-glow"}`} />
                <div className="truncate text-[11px] font-medium text-t1">
                  {workspaceConnecting ? "Connecting to workspace..." : (firstRunTask?.title ?? "Research inbound founder")}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPanelCollapsed(false);
                }}
                className="flex items-center justify-center rounded-md p-1 text-t4 transition-colors hover:bg-bg3 hover:text-t2"
                title="Expand panel"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M15 3v18" />
                  <path d="m10 15-3-3 3-3" />
                </svg>
              </button>
            </div>
            {/* Screen preview */}
            <div
              onClick={() => !workspaceConnecting && setWorkspaceOpen(true)}
              className={`relative flex aspect-video items-center justify-center bg-bg3 transition-all ${workspaceConnecting ? "" : "cursor-pointer hover:brightness-110"}`}
            >
              {workspaceConnecting ? (
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-am animate-bounce [animation-delay:0ms]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-am animate-bounce [animation-delay:150ms]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-am animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-[10px] text-t3">Connecting...</span>
                </div>
              ) : (
                <>
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-full bg-bg2/90 px-[7px] py-0.5 text-[9px] font-semibold text-g backdrop-blur-sm">
                    <div className="h-1 w-1 rounded-full bg-g" />
                    LIVE
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 flex items-center justify-center rounded-md bg-bg2/80 p-0.5 backdrop-blur-sm">
                    <svg className="h-4 w-4 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center text-[11px] text-t4">
                    <svg className="h-4 w-4 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                    <span>LinkedIn{"\n"}Founder profile</span>
                  </div>
                </>
              )}
            </div>
            {/* Bottom-left corner resize handle */}
            <div
              onMouseDown={handlePipResizeStart}
              className="absolute bottom-0 left-0 z-10 h-5 w-5 cursor-nesw-resize p-1"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" className="text-t4 opacity-0 transition-opacity group-hover:opacity-100">
                <path d="M0 0L8 8M0 4L4 8" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
          </div>

          <FullWorkspaceView
            open={workspaceOpen}
            onClose={() => {
              setWorkspaceOpen(false);
              if (teachPhase !== "recording") {
                setWorkspaceMode("default");
              }
            }}
            onLoginSuccess={() => setLinkedinConnected(true)}
            mode={workspaceMode}
            service={workspaceService}
            teachTaskName={teachTaskName || undefined}
            onDoneTeach={handleStopTeach}
            instruction={workspaceMode === "login" ? `Sign in to ${workspaceService} so your coworker can continue the task. Your credentials stay private in your workspace.` : undefined}
          />
          <SettingsOverlay
            open={settingsOpen}
            onClose={() => { setSettingsOpen(false); setSettingsSection(undefined); }}
            initialSection={settingsSection}
            onOpenCardGallery={() => setCardGalleryOpen(true)}
            trialDaysLeft={trialDaysLeft}
          />
          <CardGallery
            open={cardGalleryOpen}
            onClose={() => setCardGalleryOpen(false)}
          />

          {/* Trial expiring dialog */}
          {trialDialogOpen && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setTrialDialogOpen(false)}>
              <div className="w-[420px] max-md:w-[calc(100vw-2rem)] max-md:max-h-[90vh] max-md:overflow-y-auto overflow-hidden rounded-2xl border border-b1 bg-bg2 shadow-[var(--sc)]" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15">
                      <svg className="h-5 w-5 text-am" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-t1">Your trial ends tomorrow</div>
                      <div className="text-[12px] text-t3">Day 13 of 14</div>
                    </div>
                  </div>
                  <p className="text-[13px] leading-[1.6] text-t2">
                    Your free trial of Simular Pro expires tomorrow. Your card ending in <strong className="font-medium text-t1">4242</strong> will be charged <strong className="font-medium text-t1">$49/month</strong> starting February 25th.
                  </p>
                </div>

                {/* Usage summary */}
                <div className="mx-6 mb-4 rounded-lg border border-b1 bg-bg3/50 px-4 py-3">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-t3 mb-2">Your trial so far</div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-t2">Tasks completed</span>
                    <span className="font-medium text-t1">47</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] mt-1">
                    <span className="text-t2">Hours saved</span>
                    <span className="font-medium text-t1">~12.5 hrs</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] mt-1">
                    <span className="text-t2">Recurring tasks active</span>
                    <span className="font-medium text-t1">3</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-b1 px-6 py-4">
                  <button
                    onClick={() => {
                      setTrialDialogOpen(false);
                      setSettingsSection("subscription");
                      setSettingsOpen(true);
                    }}
                    className="text-[13px] font-medium text-t3 transition-colors hover:text-t1"
                  >
                    Cancel trial
                  </button>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => {
                        setTrialDialogOpen(false);
                        setSettingsSection("subscription");
                        setSettingsOpen(true);
                      }}
                      className="rounded-md border border-b1 bg-transparent px-4 py-2 text-[13px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1"
                    >
                      Manage plan
                    </button>
                    <button
                      onClick={() => setTrialDialogOpen(false)}
                      className="rounded-md bg-ab px-4 py-2 text-[13px] font-semibold text-abt transition-all hover:opacity-90"
                    >
                      Got it, keep my plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {demoPicker}
        </div>
      );
  }
}
