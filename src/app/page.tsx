"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { TopBar } from "@/components/TopBar";
import { ChatArea } from "@/components/ChatArea";
import { RightPanel } from "@/components/RightPanel";
import { FullWorkspaceView } from "@/components/FullWorkspaceView";
// ZeroState removed — fresh state now lives inside ChatArea
import { SettingsOverlay, type SettingsSection, type ConnectedServiceInfo } from "@/components/SettingsOverlay";
import { CardGallery } from "@/components/CardGallery";
import { DesignSystem } from "@/components/DesignSystem";
import { MessyChatArea } from "@/components/MessyChatArea";
import { LandingPage } from "@/components/LandingPage";
import { SignupSSO } from "@/components/SignupSSO";
import { SignupPayment } from "@/components/SignupPayment";
import { WaitlistSignup } from "@/components/WaitlistSignup";
import { WaitlistConfirmation } from "@/components/WaitlistConfirmation";
import { OnboardingScreen, type OnboardingProfile } from "@/components/OnboardingScreen";
import { SaiInterstitial } from "@/components/SaiInterstitial";
import type { AuthInputState } from "@/components/AuthInput";
import { SEATS_REMAINING_INIT, TEACH_TASK_NAME, type ViewState, type StarterTask, type TeachPhase } from "@/data/mockData";

const PIP_MIN_WIDTH = 200;
const PIP_MAX_WIDTH = 520;
const PIP_DEFAULT_WIDTH = 320;

type AppScreen = "landing" | "waitlist-signup" | "signup-sso" | "signup-payment" | "onboarding" | "waitlist" | "main-app";

/** Workspace setup step labels — shown as an inline indicator during onboarding */
const SETUP_STEPS = [
  "Setting up your workspace",
  "Installing Chrome and apps",
  "Configuring a secure environment",
  "Preparing your coworker",
];
const SETUP_DURATIONS = [4000, 3500, 4000, 4500]; // ~16s total — slower per Peter's feedback

const VALID_SCREENS = new Set<AppScreen>(["landing", "waitlist-signup", "signup-sso", "signup-payment", "onboarding", "waitlist", "main-app"]);
const VALID_VIEWS = new Set<ViewState>(["zero-state", "task-hover", "result-detail"]);

/** URL-friendly slug → jumpToDemo mode. Used for #demo/slug deep links and ?demo=slug. */
type DemoMode = "fresh" | "active" | "gallery" | "landing" | "landing-cap" | "teach" | "trial" | "system" | "expired" | "onboarding" | "messy";
const DEMO_SLUGS: Record<string, DemoMode> = {
  "landing": "landing",
  "landing-cap": "landing-cap",
  "sold-out": "landing-cap",
  "onboarding": "onboarding",
  "first-run": "fresh",
  "fresh": "fresh",
  "active": "active",
  "active-session": "active",
  "multi-turn": "messy",
  "messy": "messy",
  "teach": "teach",
  "teach-flow": "teach",
  "trial": "trial",
  "trial-expiring": "trial",
  "expired": "expired",
  "gallery": "gallery",
  "card-gallery": "gallery",
  "system": "system",
  "design-system": "system",
};
/** Reverse: mode → preferred slug for URL */
const MODE_TO_SLUG: Record<DemoMode, string> = {
  "landing": "landing",
  "landing-cap": "landing-cap",
  "fresh": "first-run",
  "active": "active-session",
  "gallery": "card-gallery",
  "teach": "teach-flow",
  "trial": "trial-expiring",
  "system": "design-system",
  "expired": "expired",
  "onboarding": "onboarding",
  "messy": "multi-turn",
};

function parseHash(): { screen: AppScreen; view?: ViewState; overlay?: string; demo?: DemoMode } {
  if (typeof window === "undefined") return { screen: "landing" };
  const raw = window.location.hash.replace(/^#\/?/, "");
  if (!raw) return { screen: "landing" };
  const parts = raw.split("/");

  // #demo/slug deep links
  if (parts[0] === "demo" && parts[1] && DEMO_SLUGS[parts[1]]) {
    return { screen: "landing", demo: DEMO_SLUGS[parts[1]] };
  }
  // Also support bare #slug for convenience (e.g. #onboarding, #first-run)
  if (parts.length === 1 && DEMO_SLUGS[parts[0]]) {
    return { screen: "landing", demo: DEMO_SLUGS[parts[0]] };
  }

  const s = parts[0] as AppScreen;
  if (!VALID_SCREENS.has(s)) return { screen: "landing" };
  const v = parts[1] as ViewState | undefined;
  return {
    screen: s,
    view: v && VALID_VIEWS.has(v) ? v : undefined,
    overlay: parts[1] === "card-gallery" || parts[1] === "design-system" || parts[1] === "workspace" ? parts[1] : undefined,
  };
}

export default function Home() {
  // ── Screen flow (with hash deep-link) ──
  const initial = parseHash();
  const [screen, setScreen] = useState<AppScreen>(initial.screen);
  const [userProfile, setUserProfile] = useState<OnboardingProfile>({});

  // ── Trial / seat state (mock) ──
  const [seatsRemaining, setSeatsRemaining] = useState(SEATS_REMAINING_INIT);
  const [capReached, setCapReached] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistPosition, setWaitlistPosition] = useState(0);

  // ── Main app state ──
  const [activeView, setActiveView] = useState<ViewState>(initial.view ?? "zero-state");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection | undefined>(undefined);
  const [connectedServices, setConnectedServices] = useState<ConnectedServiceInfo[]>([
    { id: "slack", name: "Slack", connectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  ]);
  const [cardGalleryOpen, setCardGalleryOpen] = useState(false);
  const [designSystemOpen, setDesignSystemOpen] = useState(false);
  const [messyMode, setMessyMode] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<"default" | "login" | "captcha" | "teach">("default");
  const [workspaceService, setWorkspaceService] = useState<string>("");
  // Default collapsed on mobile so the drawer doesn't flash open on first render
  const [panelCollapsed, setPanelCollapsed] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth < 768;
    return false;
  });
  const [showNewTaskCard, setShowNewTaskCard] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [workspaceConnecting, setWorkspaceConnecting] = useState(false);

  // ── Auth input takeover state ──
  const [authInputService, setAuthInputService] = useState<string | undefined>();
  const [authInputState, setAuthInputState] = useState<AuthInputState | undefined>();
  const [authInputError, setAuthInputError] = useState<string | undefined>();
  const [authPhase, setAuthPhase] = useState<"waiting" | "signing-in" | null>(null);

  const [firstRunTask, setFirstRunTask] = useState<StarterTask | null>(null);
  const [firstRunDone, setFirstRunDone] = useState(false);
  const [followUpDone, setFollowUpDone] = useState(false);
  const [firstRunRecurring, setFirstRunRecurring] = useState(false);
  const [firstRunDetailOpen, setFirstRunDetailOpen] = useState(false);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [demoPickerOpen, setDemoPickerOpen] = useState(false);
  const [teachPhase, setTeachPhase] = useState<TeachPhase>("idle");
  const [teachTaskName, setTeachTaskName] = useState("");
  const [trialDaysLeft, setTrialDaysLeft] = useState(6);
  const [trialCancelled, setTrialCancelled] = useState(false);
  const [trialDialogOpen, setTrialDialogOpen] = useState(false);

  // ── Sai intro interstitial (shown before in-chat onboarding) ──
  const [saiIntroOpen, setSaiIntroOpen] = useState(false);

  // ── Onboarding-in-chat state ──
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [workspaceSetupStep, setWorkspaceSetupStep] = useState(0);
  const [workspaceSetupDone, setWorkspaceSetupDone] = useState(false);

  // ── ChatArea remount key & auto-play ──
  const [chatKey, setChatKey] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoStep, setAutoStep] = useState(-1);
  const [firstRunStep, setFirstRunStep] = useState(0);

  const [pipWidth, setPipWidth] = useState(PIP_DEFAULT_WIDTH);
  const pipDragging = useRef(false);
  const pipDragStartX = useRef(0);
  const pipDragStartWidth = useRef(PIP_DEFAULT_WIDTH);

  // ── Read URL params: ?ref=CODE and ?demo=MODE, plus #hash deep links ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setInviteCode(ref.toUpperCase());

    // ?demo=slug takes priority
    const demoParam = params.get("demo");
    const demoMode = demoParam ? DEMO_SLUGS[demoParam] : initial.demo;
    if (demoMode) {
      // Use requestAnimationFrame so jumpToDemo runs after initial render
      requestAnimationFrame(() => jumpToDemo(demoMode));
    }
  }, []);

  // Track which demo mode is active (for hash sync)
  const currentDemoRef = useRef<DemoMode | null>(null);

  // ── Hash deep-link: apply overlay on mount ──
  useEffect(() => {
    const h = parseHash();
    if (h.overlay === "card-gallery") setCardGalleryOpen(true);
    else if (h.overlay === "design-system") setDesignSystemOpen(true);
    else if (h.overlay === "workspace") setWorkspaceOpen(true);
    // For main-app, auto-set profile so it renders
    if (h.screen === "main-app") setUserProfile((p) => p.role ? p : { ...p, role: "vc" });
  }, []);

  // Sync hash when screen or view changes — use demo slug when a demo is active
  useEffect(() => {
    if (currentDemoRef.current) {
      const slug = MODE_TO_SLUG[currentDemoRef.current];
      const newHash = `#${slug}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, "", newHash);
      }
    } else {
      const base = screen;
      const sub = screen === "main-app" && activeView !== "zero-state" ? `/${activeView}` : "";
      const newHash = `#${base}${sub}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, "", newHash);
      }
    }
  }, [screen, activeView]);

  // ── Listen for hashchange (browser back/forward) ──
  useEffect(() => {
    const handleHashChange = () => {
      const h = parseHash();
      if (h.demo) {
        jumpToDemo(h.demo);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
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

  const jumpToDemo = (mode: DemoMode) => {
    currentDemoRef.current = mode;
    // Update hash immediately so it's visible in the URL bar
    const slug = MODE_TO_SLUG[mode];
    if (window.location.hash !== `#${slug}`) {
      window.history.replaceState(null, "", `#${slug}`);
    }
    setDemoPickerOpen(false);
    setFirstRunTask(null);
    setFirstRunDone(false);
    setFirstRunRecurring(false);
    setLinkedinConnected(false);
    setWorkspaceConnecting(false);
    setAuthInputService(undefined);
    setAuthInputState(undefined);
    setAuthInputError(undefined);
    setAuthPhase(null);
    setWorkspaceOpen(false);
    setWorkspaceMode("default");
    setWorkspaceService("");
    setSettingsOpen(false);
    setCardGalleryOpen(false);
    setDesignSystemOpen(false);
    setMessyMode(false);
    setTeachPhase("idle");
    setTeachTaskName("");
    setTrialDialogOpen(false);
    setTrialCancelled(false);
    setIsOnboarding(false);
    setIsAutoPlay(false);
    setIsReturningUser(false);
    setShowNewTaskCard(false);
    setSaiIntroOpen(false);
    if (mode === "landing") {
      setCapReached(false);
      setSeatsRemaining(SEATS_REMAINING_INIT);
      setScreen("landing");
      return;
    }
    if (mode === "landing-cap") {
      setCapReached(true);
      setSeatsRemaining(0);
      setScreen("landing");
      return;
    }
    setUserProfile({ role: "vc" });
    setScreen("main-app");
    if (mode === "fresh") {
      setTrialDaysLeft(6);
      setActiveView("zero-state");
      setChatKey((k) => k + 1);
    } else if (mode === "active") {
      setTrialDaysLeft(6);
      setIsAutoPlay(true);
      setActiveView("task-hover");
      setChatKey((k) => k + 1);
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
    } else if (mode === "system") {
      setTrialDaysLeft(6);
      setDesignSystemOpen(true);
    } else if (mode === "expired") {
      setTrialDaysLeft(0);
      setTrialCancelled(true);
      setActiveView("task-hover");
    } else if (mode === "onboarding") {
      setTrialDaysLeft(6);
      setUserProfile({});
      setSaiIntroOpen(true);
      setIsOnboarding(true);
      setWorkspaceSetupStep(0);
      setWorkspaceSetupDone(false);
      setActiveView("zero-state");
      setChatKey((k) => k + 1);
    } else if (mode === "messy") {
      setTrialDaysLeft(6);
      setMessyMode(true);
      setActiveView("zero-state");
      setChatKey((k) => k + 1);
    }
  };

  // ── Cap detection ──
  useEffect(() => {
    if (seatsRemaining <= 0) setCapReached(true);
  }, [seatsRemaining]);

  // ── Workspace setup progress (runs during onboarding-in-chat) ──
  useEffect(() => {
    if (!isOnboarding || workspaceSetupDone) return;
    if (workspaceSetupStep >= SETUP_STEPS.length) {
      setWorkspaceSetupDone(true);
      return;
    }
    const timer = setTimeout(() => {
      setWorkspaceSetupStep((s) => s + 1);
    }, SETUP_DURATIONS[workspaceSetupStep]);
    return () => clearTimeout(timer);
  }, [isOnboarding, workspaceSetupStep, workspaceSetupDone]);

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
    setFirstRunDone(false);
    setFirstRunRecurring(false);
    setWorkspaceConnecting(true);
    setActiveView("task-hover");
    setTimeout(() => setWorkspaceConnecting(false), 3000);
  };

  const handleOpenWorkspaceForLogin = (service: string) => {
    // Open AuthInput takeover instead of FullWorkspaceView
    setAuthInputService(service.toLowerCase());
    setAuthInputState("pending");
    setAuthInputError(undefined);
    setAuthPhase("waiting");
  };

  const handleAuthSubmit = (values: Record<string, string>) => {
    const serviceId = authInputService || "linkedin";
    // Hide the credential form briefly, then show CAPTCHA challenge
    setAuthInputState(undefined);
    setAuthInputService(undefined);
    setAuthPhase("signing-in");
    setTimeout(() => {
      setAuthPhase(null);
      // Re-show AuthInput in CAPTCHA state
      setAuthInputService(serviceId);
      setAuthInputState("captcha");
    }, 2000);
  };

  /** Called when user returns from workspace after solving CAPTCHA (or via FullWorkspaceView login success) */
  const handleCaptchaResolved = () => {
    const serviceId = authInputService || "linkedin";
    setAuthInputService(undefined);
    setAuthInputState(undefined);
    setAuthPhase(null);
    setLinkedinConnected(true);
    setConnectedServices((prev) => {
      if (prev.some((s) => s.id === serviceId)) return prev;
      return [...prev, { id: serviceId, name: serviceId.charAt(0).toUpperCase() + serviceId.slice(1), connectedAt: new Date() }];
    });
  };

  const handleAuthSkip = () => {
    setAuthInputService(undefined);
    setAuthInputState(undefined);
    setAuthInputError(undefined);
    setAuthPhase(null);
  };

  const handleAuthManualSignIn = () => {
    const service = authInputService || "";
    const isCaptcha = authInputState === "captcha";
    setAuthInputService(undefined);
    setAuthInputState(undefined);
    setAuthPhase(null);
    setWorkspaceMode(isCaptcha ? "captcha" : "login");
    const serviceNames: Record<string, string> = { linkedin: "LinkedIn", gmail: "Gmail", salesforce: "Salesforce" };
    setWorkspaceService(serviceNames[service] ?? service.charAt(0).toUpperCase() + service.slice(1));
    setWorkspaceOpen(true);
  };

  const handleAuth2FASubmit = (code: string) => {
    setAuthInputService(undefined);
    setAuthInputState(undefined);
    setAuthPhase("signing-in");
    setTimeout(() => {
      setAuthPhase(null);
      setLinkedinConnected(true);
    }, 1500);
  };

  const handleAuth2FACancel = () => {
    setAuthInputService(undefined);
    setAuthInputState(undefined);
    setAuthPhase(null);
  };

  const handleOAuthSelect = (provider: string) => {
    const serviceId = authInputService || "linkedin";
    // Hide auth form, show signing-in phase, then show CAPTCHA
    setAuthInputState(undefined);
    setAuthInputService(undefined);
    setAuthPhase("signing-in");
    setTimeout(() => {
      setAuthPhase(null);
      setAuthInputService(serviceId);
      setAuthInputState("captcha");
    }, 2000);
  };

  const handleOpenSettingsServices = () => {
    setSettingsSection("services");
    setSettingsOpen(true);
  };

  const handleSlashCommand = (command: string) => {
    switch (command) {
      case "skills":
        setSettingsSection("skills");
        setSettingsOpen(true);
        break;
      case "integrations":
        setSettingsSection("integrations");
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

  const showPip = panelCollapsed && (activeView !== "zero-state" || isOnboarding || firstRunTask || workspaceConnecting);

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

  // ── Demo picker hint (always visible) ──
  const demoHint = !demoPickerOpen && (
    <button
      onClick={() => setDemoPickerOpen(true)}
      className="fixed bottom-3 right-3 z-[60] flex items-center gap-0.5 rounded-md px-1.5 py-1 text-t4/60 transition-colors hover:text-t3"
    >
      {["⌘", "⇧", "D"].map((k) => (
        <kbd key={k} className="flex h-[20px] min-w-[20px] items-center justify-center rounded border border-b1 bg-bg3 px-1 text-[10px] font-medium leading-none">{k}</kbd>
      ))}
    </button>
  );

  // ── Demo picker overlay (Cmd+Shift+D) ──
  const demoPicker = demoPickerOpen && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDemoPickerOpen(false)}>
      <div className="w-[520px] max-md:w-[calc(100vw-2rem)] max-md:max-h-[70dvh] max-md:overflow-y-auto rounded-xl border border-b1 bg-bg2 p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[13px] font-semibold text-t1">Demo Mode</div>
        <div className="mb-4 text-[11px] text-t3">Jump to any state. <span className="font-mono text-t4">Cmd+Shift+D</span></div>
        <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
          {([
            { mode: "landing" as const, label: "Landing page", icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
            { mode: "landing-cap" as const, label: "Landing (sold out)", icon: <><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></> },
            { mode: "onboarding" as const, label: "Onboarding flow", icon: <><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></> },
            { mode: "fresh" as const, label: "First run", icon: <><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></> },
            { mode: "active" as const, label: "Active session", icon: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></> },
            { mode: "messy" as const, label: "Multi-turn agent", icon: <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></> },
            { mode: "teach" as const, label: "Teach flow", icon: <><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></> },
            { mode: "trial" as const, label: "Trial expiring", icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
            { mode: "gallery" as const, label: "Card gallery", icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>, blue: true },
            { mode: "system" as const, label: "Design system", icon: <><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></>, blue: true },
          ] as { mode: Parameters<typeof jumpToDemo>[0]; label: string; icon: React.ReactNode; blue?: boolean }[]).map((opt) => (
            <button
              key={opt.mode}
              onClick={() => jumpToDemo(opt.mode)}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-all hover:border-b2 hover:bg-bg3h ${
                screen === opt.mode
                  ? "border-as bg-as/[0.06]"
                  : "border-b1 bg-bgcard shadow-[var(--card-shadow)]"
              }`}
            >
              <svg className={`h-4 w-4 shrink-0 ${opt.blue ? "text-blt" : "text-t3"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{opt.icon}</svg>
              <span className="text-[13px] font-medium text-t1 whitespace-nowrap">{opt.label}</span>
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
        {demoPicker}{demoHint}
        <LandingPage
          initialCode={inviteCode}
          seatsRemaining={seatsRemaining}
          capReached={capReached}
          onClaimSpot={handleClaimSpot}
          onGoToWaitlist={() => setScreen("waitlist-signup")}
          onGoToLogin={() => { setIsReturningUser(true); setScreen("signup-sso"); }}
        />
        </>
      );

    case "waitlist-signup":
      return (
        <>
        {demoPicker}{demoHint}
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
        {demoPicker}{demoHint}
        <SignupSSO
          onSignIn={() => {
            if (isReturningUser) {
              setUserProfile({ role: "vc" });
              setTrialDaysLeft(6);
              setIsAutoPlay(true);
              setActiveView("task-hover");
              setChatKey((k) => k + 1);
              setScreen("main-app");
            } else {
              setScreen("signup-payment");
            }
          }}
          onBack={() => { setIsReturningUser(false); setScreen("landing"); }}
        />
        </>
      );

    case "signup-payment":
      return (
        <>
        {demoPicker}{demoHint}
        <SignupPayment
          onSubmit={() => {
            setIsOnboarding(true);
            setWorkspaceSetupStep(0);
            setWorkspaceSetupDone(false);
            setActiveView("zero-state");
            setScreen("main-app");
          }}
          onBack={() => setScreen("signup-sso")}
        />
        </>
      );

    case "onboarding":
      return (
        <>
        {demoPicker}{demoHint}
        <OnboardingScreen
          onReady={(profile) => {
            setUserProfile(profile);
            setActiveView("zero-state");
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
        {demoPicker}{demoHint}
        <WaitlistConfirmation
          email={waitlistEmail}
          position={waitlistPosition}
        />
        </>
      );

    case "main-app":
      return (
        <div className="flex h-dvh flex-col">
          {/* Sai intro interstitial — shown as modal before in-chat onboarding */}
          {saiIntroOpen && (
            <div
              className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setSaiIntroOpen(false)}
            >
              <div
                className="w-[640px] max-w-[calc(100vw-2rem)] rounded-2xl border border-b1 bg-bg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Animation */}
                <div className="px-5 pt-5">
                  <SaiInterstitial />
                </div>

                {/* Footer: text left, button right */}
                <div className="flex items-center gap-4 px-6 py-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] text-t1 font-semibold leading-snug">
                      Sai has its own computer.
                    </p>
                    <p className="mt-1 text-[13px] text-t3 leading-relaxed">
                      It browses the web, opens apps, and works through tasks around the clock. Describe what you need. Sai takes it from here.
                    </p>
                  </div>
                  <button
                    onClick={() => setSaiIntroOpen(false)}
                    className="shrink-0 rounded-lg bg-ab px-5 py-2.5 text-[13px] font-medium text-abt transition-all hover:brightness-110"
                  >
                    Get started
                  </button>
                </div>
              </div>
            </div>
          )}
          <TopBar
            isZeroState={activeView === "zero-state" && !isOnboarding}
            onOpenSettings={() => setSettingsOpen(true)}
            onGoHome={() => { setActiveView("zero-state"); setFirstRunTask(null); setTeachPhase("idle"); setTeachTaskName(""); setIsAutoPlay(false); setChatKey((k) => k + 1); }}
            onOpenSubscription={() => { setSettingsSection("subscription"); setSettingsOpen(true); }}
            onOpenCredits={() => { setSettingsSection("credits"); setSettingsOpen(true); }}
            onOpenDemoPicker={() => setDemoPickerOpen(true)}
            onOpenPanel={() => setPanelCollapsed(false)}
            trialDaysLeft={trialDaysLeft}
            workspaceSetupLabel={undefined}
          />
          <div className="flex flex-1 overflow-hidden">
            {messyMode ? (
              <MessyChatArea
                key={chatKey}
                onTaskStart={() => {
                  setActiveView("task-hover");
                  setFirstRunTask({
                    id: "messy-fireworks",
                    title: "Summarize Fireworks AI funding round",
                    description: "Research and share a summary of the latest funding news",
                    trustLevel: "medium",
                    trustLabel: "Supervised",
                    icon: "research",
                    category: "research",
                  });
                }}
                onStepChange={(step) => setFirstRunStep(step)}
                onDone={() => setFirstRunDone(true)}
                onAllTurnsDone={() => {}}
                onViewActivityLog={() => { setWorkspaceMode("default"); setWorkspaceOpen(true); }}
              />
            ) : (
            <ChatArea
              key={chatKey}
              view={activeView}
              onOpenDetail={() => setFirstRunDetailOpen(true)}
              onOpenTaskById={(id) => setOpenTaskId(id)}
              onViewActivityLog={() => { setWorkspaceMode("default"); setWorkspaceOpen(true); }}
              onOpenWorkspaceForLogin={handleOpenWorkspaceForLogin}
              onSlashCommand={handleSlashCommand}
              showNewTaskCard={showNewTaskCard}
              onCloseNewTask={() => setShowNewTaskCard(false)}
              linkedinConnected={linkedinConnected}
              onLinkedinConnect={() => setLinkedinConnected(true)}
              firstRunTask={firstRunTask}
              onFirstRunDone={() => setFirstRunDone(true)}
              onFirstRunComplete={() => setFirstRunTask(null)}
              onFirstRunMakeRecurring={() => { setFirstRunRecurring(true); }}
              onFirstRunRemoveRecurring={() => { setFirstRunRecurring(false); }}
              onFollowUpDone={() => setFollowUpDone(true)}
              teachPhase={teachPhase}
              teachTaskName={teachTaskName}
              onStartTeach={handleStartTeach}
              onStopTeach={handleStopTeach}
              onFinishTeach={handleFinishTeach}
              onOpenWorkspace={() => setWorkspaceOpen(true)}
              workspaceOpen={workspaceOpen}
              isOnboarding={isOnboarding}
              workspaceSetupDone={workspaceSetupDone}
              workspaceSetupStep={workspaceSetupStep}
              userRole={userProfile.role}
              isAutoPlay={isAutoPlay}
              onAutoStepChange={setAutoStep}
              onFirstRunStepChange={setFirstRunStep}
              onStartTask={handleStartTask}
              authInputService={authInputService}
              authInputState={authInputState}
              authInputError={authInputError}
              onAuthSubmit={handleAuthSubmit}
              onAuthSkip={handleAuthSkip}
              onAuthManualSignIn={handleAuthManualSignIn}
              onAuth2FASubmit={handleAuth2FASubmit}
              onAuth2FACancel={handleAuth2FACancel}
              onAuthOAuthSelect={handleOAuthSelect}
              authPhase={authPhase}
              onOpenSettingsServices={handleOpenSettingsServices}
              onOnboardingComplete={(profile, task) => {
                setUserProfile(profile);
                setIsOnboarding(false);
                if (task) {
                  handleStartTask(task);
                } else if (profile.customWorkflow) {
                  handleStartTask({
                    id: "custom",
                    title: profile.customWorkflow,
                    description: "",
                    trustLevel: "medium",
                    trustLabel: "Supervised",
                    icon: "custom",
                    category: "research",
                  });
                } else {
                  setActiveView("zero-state");
                }
              }}
            />
            )}
            <RightPanel
              view={activeView}
              onViewChange={setActiveView}
              onOpenWorkspace={() => setWorkspaceOpen(true)}
              collapsed={panelCollapsed}
              onToggleCollapse={() => setPanelCollapsed((c) => !c)}
              workspaceConnecting={workspaceConnecting}
              firstRunTask={firstRunTask}
              firstRunDone={firstRunDone}
              followUpDone={followUpDone}
              firstRunRecurring={firstRunRecurring}
              onFirstRunRemoveRecurring={() => setFirstRunRecurring(false)}
              openFirstRunDetail={firstRunDetailOpen}
              onCloseFirstRunDetail={() => setFirstRunDetailOpen(false)}
              openTaskId={openTaskId}
              onClearOpenTaskId={() => setOpenTaskId(null)}
              teachPhase={teachPhase}
              teachTaskName={teachTaskName}
              isOnboarding={isOnboarding}
              workspaceSetupStep={workspaceSetupStep}
              workspaceSetupDone={workspaceSetupDone}
              isAutoPlay={isAutoPlay}
              autoStep={autoStep}
              firstRunStep={firstRunStep}
              showCaptcha={authInputState === "captcha"}
            />
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
                <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${workspaceConnecting || (isOnboarding && !workspaceSetupDone) ? "bg-am" : "bg-g animate-pulse"}`} />
                <div className="truncate text-[11px] font-medium text-t1">
                  {workspaceConnecting ? "Connecting to workspace..." : isOnboarding && !workspaceSetupDone ? "Setting up workspace..." : (firstRunTask?.title ?? "Research inbound founder")}
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
              onClick={() => !workspaceConnecting && !(isOnboarding && !workspaceSetupDone) && setWorkspaceOpen(true)}
              className={`relative flex aspect-video items-center justify-center bg-bg3 transition-all ${workspaceConnecting || (isOnboarding && !workspaceSetupDone) ? "" : "cursor-pointer hover:brightness-110"}`}
            >
              {workspaceConnecting || (isOnboarding && !workspaceSetupDone) ? (
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-am animate-bounce [animation-delay:0ms]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-am animate-bounce [animation-delay:150ms]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-am animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-[10px] text-t3">{isOnboarding ? "Setting up..." : "Connecting..."}</span>
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
            onLoginSuccess={() => {
              setLinkedinConnected(true);
              // Also clear any pending auth state (e.g., CAPTCHA was resolved in workspace)
              setAuthInputService(undefined);
              setAuthInputState(undefined);
              setAuthPhase(null);
              const sid = workspaceService.toLowerCase();
              setConnectedServices((prev) => {
                if (prev.some((s) => s.id === sid)) return prev;
                return [...prev, { id: sid, name: workspaceService, connectedAt: new Date() }];
              });
            }}
            mode={workspaceMode}
            service={workspaceService}
            teachTaskName={teachTaskName || undefined}
            onDoneTeach={handleStopTeach}
            instruction={undefined}
          />
          <SettingsOverlay
            open={settingsOpen}
            onClose={() => { setSettingsOpen(false); setSettingsSection(undefined); }}
            initialSection={settingsSection}
            onOpenCardGallery={() => setCardGalleryOpen(true)}
            onOpenDesignSystem={() => setDesignSystemOpen(true)}
            trialDaysLeft={trialDaysLeft}
            trialCancelled={trialCancelled}
            onCancelTrial={() => setTrialCancelled(true)}
            onReactivateTrial={() => setTrialCancelled(false)}
            connectedServices={connectedServices}
            onSignOut={(id) => setConnectedServices((prev) => prev.filter((s) => s.id !== id))}
            onSignOutAll={() => setConnectedServices([])}
          />
          <CardGallery
            open={cardGalleryOpen}
            onClose={() => setCardGalleryOpen(false)}
          />
          <DesignSystem
            open={designSystemOpen}
            onClose={() => setDesignSystemOpen(false)}
          />

          {/* Trial expired lockout */}
          {trialCancelled && trialDaysLeft <= 0 && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-bg/95 backdrop-blur-md py-10">
              <div className="w-full max-w-[640px] px-8 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-bg3">
                  <svg className="h-7 w-7 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <h2 className="text-[20px] font-semibold text-t1">Your trial has ended</h2>
                <p className="mt-2 text-[14px] leading-[1.6] text-t3">
                  Choose a plan to continue using Simular.
                </p>

                {/* Plan comparison */}
                <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                  {/* Plus */}
                  <div className="rounded-xl border border-b1 bg-bg2 p-5">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-t3">Plus</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-[28px] font-bold text-t1">$20</span>
                      <span className="text-[13px] text-t3">/mo</span>
                    </div>
                    <p className="mt-2 text-[12px] leading-[1.5] text-t3">For individuals getting started with AI automation.</p>
                    <div className="mt-4 flex flex-col gap-2">
                      {["5 tasks per day", "Core integrations", "Workspace + recording", "Task scheduling", "Community support"].map((f) => (
                        <div key={f} className="flex items-center gap-2 text-[12px] text-t2">
                          <svg className="h-3 w-3 shrink-0 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          {f}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => { setTrialCancelled(false); setTrialDaysLeft(6); }}
                      className="mt-5 flex h-10 w-full items-center justify-center rounded-md bg-as text-[13px] font-medium text-white transition-all hover:bg-as2"
                    >
                      Subscribe to Plus
                    </button>
                  </div>

                  {/* Pro */}
                  <div className="rounded-xl border border-as/30 bg-bg2 p-5 relative">
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-as px-3 py-0.5 text-[10px] font-semibold text-white">RECOMMENDED</div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-blt">Pro</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-[28px] font-bold text-t1">$500</span>
                      <span className="text-[13px] text-t3">/mo</span>
                    </div>
                    <p className="mt-2 text-[12px] leading-[1.5] text-t3">For teams and power users who need unlimited access.</p>
                    <div className="mt-4 flex flex-col gap-2">
                      {["Unlimited tasks", "All integrations", "Teach mode", "Priority support", "API access"].map((f) => (
                        <div key={f} className="flex items-center gap-2 text-[12px] text-t2">
                          <svg className="h-3 w-3 shrink-0 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          {f}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => { setTrialCancelled(false); setTrialDaysLeft(6); }}
                      className="mt-5 flex h-10 w-full items-center justify-center rounded-md border border-as/30 bg-as/10 text-[13px] font-medium text-blt transition-all hover:bg-as/20"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                </div>

                <a
                  href="https://simular.ai/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1 text-[12px] font-medium text-blt transition-colors hover:text-as2"
                >
                  Full plan details
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
                <p className="mt-2 text-[12px] text-t4">
                  Your data is preserved for 30 days after cancellation.
                </p>
              </div>
            </div>
          )}

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
                    Your free trial of Simular Plus expires tomorrow. Your card ending in <strong className="font-medium text-t1">4242</strong> will be charged <strong className="font-medium text-t1">$20/month</strong> starting February 25th.
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
                      setTrialDaysLeft(0);
                      setTrialCancelled(true);
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
