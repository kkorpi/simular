"use client";

import { useState, useEffect, useRef } from "react";

/*
 * Sai Intro Animation
 * ───────────────────
 * Looping animation: typing → browsing → spreadsheet → result → (loop)
 * Parent handles the modal chrome (text + "Get started" button below).
 *
 * Step indicator: single line, crossfades between steps (old scrolls up, new fades in).
 * Chat input: simplified TaskInput (no actions menu).
 * Result: matches CardShell + ResultCard with proper ArtifactLink style.
 * Task complete: horizontal rule divider matching chat's TaskCompleteDivider.
 */

// ─── Config ────────────────────────────────────────────────────────────────────
const TYPING_SPEED = 32;
const PAUSE_AFTER_TYPING = 500;
const SITE_HOLD = 1800;
const SITE_TRANSITION = 350;
const STEP_TRANSITION = 400; // ms for step crossfade
const SPREADSHEET_ROW_DELAY = 200;
const SPREADSHEET_HOLD_AFTER = 1800; // extra hold after rows finish
const RESULT_HOLD = 5000;
const PAUSE_BEFORE_LOOP = 1200;

const USER_PROMPT =
  "Compare pricing for the top 5 project management tools and put it in a spreadsheet.";

const SITES = [
  { name: "asana.com/pricing", title: "Asana", subtitle: "Pricing & Plans", accent: "#F06A6A",
    plans: [{ name: "Personal", price: "$0", sub: "For individuals" }, { name: "Starter", price: "$10.99", sub: "Per user / mo" }, { name: "Advanced", price: "$24.99", sub: "Per user / mo" }, { name: "Enterprise", price: "Custom", sub: "Contact sales" }] },
  { name: "monday.com/pricing", title: "monday.com", subtitle: "Choose Your Plan", accent: "#6C63FF",
    plans: [{ name: "Free", price: "$0", sub: "Up to 2 seats" }, { name: "Basic", price: "$9", sub: "Per seat / mo" }, { name: "Standard", price: "$12", sub: "Per seat / mo" }, { name: "Pro", price: "$16", sub: "Per seat / mo" }] },
  { name: "notion.so/pricing", title: "Notion", subtitle: "Plans & Pricing", accent: "#999999",
    plans: [{ name: "Free", price: "$0", sub: "For personal use" }, { name: "Plus", price: "$8", sub: "Per user / mo" }, { name: "Business", price: "$15", sub: "Per user / mo" }, { name: "Enterprise", price: "Custom", sub: "Contact sales" }] },
  { name: "clickup.com/pricing", title: "ClickUp", subtitle: "See All Plans", accent: "#7B68EE",
    plans: [{ name: "Free Forever", price: "$0", sub: "Best for personal" }, { name: "Unlimited", price: "$7", sub: "Per member / mo" }, { name: "Business", price: "$12", sub: "Per member / mo" }, { name: "Enterprise", price: "Custom", sub: "Contact sales" }] },
  { name: "linear.app/pricing", title: "Linear", subtitle: "Simple Pricing", accent: "#5E6AD2",
    plans: [{ name: "Free", price: "$0", sub: "Up to 250 issues" }, { name: "Standard", price: "$8", sub: "Per user / mo" }, { name: "Plus", price: "$14", sub: "Per user / mo" }, { name: "Enterprise", price: "Custom", sub: "Contact us" }] },
];

const SPREADSHEET_DATA = [
  ["Tool", "Free Tier", "Pro / Std", "Business", "Enterprise"],
  ["Asana", "\u2713  Free", "$10.99/mo", "$24.99/mo", "Custom"],
  ["Monday", "\u2713  Free", "$9/mo", "$12/mo", "$16/mo"],
  ["Notion", "\u2713  Free", "$8/mo", "$15/mo", "Custom"],
  ["ClickUp", "\u2713  Free", "$7/mo", "$12/mo", "Custom"],
  ["Linear", "\u2713  Free", "$8/mo", "$14/mo", "Custom"],
];

const PHASES = ["typing", "browsing", "spreadsheet", "result"] as const;
type Phase = (typeof PHASES)[number];

// ─── Inline SVG icons ──────────────────────────────────────────────────────────
function IconLock({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>);
}
function IconChevronLeft({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);
}
function IconChevronRight({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>);
}
function IconShare({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>);
}
function IconPlus({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
}
function IconFileSpreadsheet({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M8 13h2" /><path d="M8 17h2" /><path d="M14 13h2" /><path d="M14 17h2" /></svg>);
}

// ─── Animated pointer cursor ────────────────────────────────────────────────────
function AnimatedCursor({ siteIndex }: { siteIndex: number }) {
  // Cursor drifts across pricing cards — resets on each site change via key
  return (
    <div
      key={siteIndex}
      className="pointer-events-none absolute z-10"
      style={{ animation: "sai-cursor 1.6s ease-in-out infinite alternate" }}
    >
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M1 1L1 14.5L4.5 11L8.5 18L11 17L7 10L12 10L1 1Z" fill="white" stroke="black" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── Animated step line — crossfade between steps ──────────────────────────────
function StepLine({ label, done, prevLabel, stepKey }: { label: string; done: boolean; prevLabel: string; stepKey: number }) {
  // stepKey forces CSS animation replay on each transition
  const showPrev = prevLabel && prevLabel !== label;

  return (
    <div className="relative h-[22px] overflow-hidden">
      {/* Outgoing step — scrolls up and fades */}
      {showPrev && (
        <div
          key={`out-${stepKey}`}
          className="absolute inset-0 flex items-center"
          style={{ animation: `sai-stepOut ${STEP_TRANSITION}ms ease-out forwards` }}
        >
          <svg className="mr-1.5 h-[14px] w-[14px] shrink-0 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          <span className="text-[13px] font-medium text-t2">{prevLabel}</span>
        </div>
      )}
      {/* Current step — fades up and in */}
      <div
        key={`in-${stepKey}`}
        className="absolute inset-0 flex items-center"
        style={showPrev ? { animation: `sai-stepIn ${STEP_TRANSITION}ms ease-out forwards` } : undefined}
      >
        {done ? (
          <svg className="mr-1.5 h-[14px] w-[14px] shrink-0 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        ) : (
          <div className="mr-1.5 h-[14px] w-[14px] shrink-0 rounded-full border-2 border-g/30 border-t-g animate-spin" />
        )}
        <span
          className={`text-[13px] font-medium ${done ? "text-t1" : "text-t2 shimmer-text"}`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── Task complete divider (matches chat's TaskCompleteDivider exactly) ────────
function TaskCompleteDivider() {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="h-px flex-1 bg-b1" />
      <span className="text-[10px] text-t4">task complete</span>
      <div className="h-px flex-1 bg-b1" />
    </div>
  );
}

// ─── Completed working indicator summary (matches RunningTaskDetail done state) ─
function CompletedWorkingSummary() {
  return (
    <div className="flex flex-col gap-0.5">
      {/* Completed step label — checkmark + label */}
      <div className="flex items-center">
        <svg className="mr-1.5 h-[14px] w-[14px] shrink-0 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        <span className="text-[13px] font-medium text-t2">Researching pricing pages</span>
      </div>
      {/* Summary toggle — matches RunningTaskDetail */}
      <div className="flex items-center gap-1.5 pl-0.5 pt-0.5">
        <svg
          className="h-3 w-3 text-t4 -rotate-90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span className="text-[11.5px] font-medium text-t4">Show details</span>
        <span className="text-[11px] text-t4">Complete · 8 steps · 28s</span>
      </div>
    </div>
  );
}

// ─── Browser chrome ────────────────────────────────────────────────────────────
function BrowserChrome({ url, icon }: { url: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center h-[34px] px-3 bg-bg3 border-b border-b1">
      <div className="flex gap-[6px] shrink-0">
        <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
        <div className="w-[10px] h-[10px] rounded-full bg-[#ffbd2e]" />
        <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
      </div>
      <div className="flex items-center gap-1 ml-3 text-t4">
        <IconChevronLeft className="w-3.5 h-3.5 opacity-30" />
        <IconChevronRight className="w-3.5 h-3.5 opacity-30" />
      </div>
      <div className="flex-1 flex justify-center mx-2">
        <div className="flex items-center gap-1.5 h-[22px] w-full max-w-[340px] rounded-md bg-bg px-2.5 border border-b1">
          {icon || <IconLock className="w-2.5 h-2.5 text-t4 shrink-0" />}
          <span className="text-[10px] text-t3 font-mono truncate">{url}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-t4 shrink-0">
        <IconShare className="w-3 h-3 opacity-30" />
        <IconPlus className="w-3 h-3 opacity-30" />
      </div>
    </div>
  );
}

// ─── Pricing card ──────────────────────────────────────────────────────────────
function PricingCard({ plan, accent, highlighted, delay }: {
  plan: { name: string; price: string; sub: string }; accent: string; highlighted: boolean; delay: number;
}) {
  return (
    <div
      className="rounded-md p-2.5 border animate-[sai-cardIn_0.3s_ease_both]"
      style={{ borderColor: highlighted ? accent + "44" : "var(--b1)", background: highlighted ? accent + "0a" : "var(--bg3)", animationDelay: `${delay}ms` }}
    >
      <div className="text-[9px] text-t4 uppercase tracking-wider">{plan.name}</div>
      <div className="text-lg font-bold text-t1 leading-tight">{plan.price}</div>
      <div className="text-[9px] text-t4">{plan.sub}</div>
      <div className="mt-2 flex flex-col gap-[3px]">
        {[0.9, 0.6, 0.75].map((w, i) => (
          <div key={i} className="h-[2px] rounded-sm bg-b1/40" style={{ width: `${w * 100}%` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Simplified chat input (no Actions menu) ─────────────────────────────────
function FakeChatInput({ typedLen }: { typedLen: number }) {
  const showCursor = typedLen < USER_PROMPT.length;
  return (
    <div className="flex flex-col rounded-lg border border-b1 bg-bgcard">
      <div className="px-4 pt-3 pb-1.5 text-[13px] leading-[1.5] text-t1 min-h-[28px]">
        {typedLen === 0 ? (
          <span className="text-t4">Describe a task...</span>
        ) : (
          <>
            {USER_PROMPT.slice(0, typedLen)}
            {showCursor && <span className="inline-block w-[2px] h-[1.1em] bg-as ml-[1px] align-text-bottom blink-cursor" />}
          </>
        )}
      </div>
      <div className="flex items-center gap-1 px-3 pb-2.5">
        <div className="flex items-center justify-center rounded-md p-1.5 text-t4">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <div className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-t3">
          Claude 4.6 Opus
          <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <div className="flex-1" />
        <div className={`flex items-center justify-center rounded-full p-1.5 transition-colors ${
          typedLen >= USER_PROMPT.length ? "bg-ab text-abt" : "text-t4"
        }`}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Schedule bar (matches ScheduleBar component) ────────────────────────────
function FakeScheduleBar() {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2 border-t border-b1">
      <svg className="h-3 w-3 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="text-[11px] text-blt font-medium">Set as recurring task</span>
      <span className="text-[10px] text-t4">&middot;</span>
      <span className="text-[11px] text-blt font-medium">Change schedule</span>
      <span className="text-[10px] text-t4">&middot;</span>
      <span className="text-[11px] text-blt font-medium">Turn off</span>
    </div>
  );
}

// ─── Result card (matches CardShell + ResultCard + ArtifactLink) ─────────────
function AnimResultCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-g/40 bg-bgcard shadow-[var(--card-shadow)] transition-colors duration-1000" style={{ maxWidth: 520 }}>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-bg3h">
          <svg className="h-4 w-4 text-t1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-t1">PM tool pricing comparison</div>
          <div className="text-[11px] text-t3">5 tools compared across 4 tiers</div>
        </div>
      </div>
      {/* Body */}
      <div className="border-t border-b1 px-3.5 py-3 text-[13px] leading-[1.6] text-t2">
        I compared pricing across Asana, Monday, Notion, ClickUp, and Linear. All offer free tiers. ClickUp is the most affordable at $7/mo for their paid plan.
        {/* Artifact link — matches ArtifactLink: full-width, border-b1, bg-bg3h/50, icon+title+chevron */}
        <button className="mt-3 flex w-full items-center gap-2.5 rounded-md border border-b1 bg-bg3h/50 px-3 py-2.5 text-left transition-colors hover:bg-bg3h hover:border-b2">
          <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-bg3h">
            <IconFileSpreadsheet className="w-4 h-4 text-t1" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-medium text-t1">PM_Tool_Comparison.xlsx</div>
            <div className="mt-0.5 text-[11px] text-t3">5 tools &middot; 4 pricing tiers</div>
          </div>
          <svg className="h-3.5 w-3.5 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export function SaiInterstitial() {
  const [, forceRender] = useState(0);
  const tick = () => forceRender(n => n + 1);

  // All animation state lives in a ref — immune to Strict Mode double-fire
  const s = useRef({
    phase: "typing" as Phase,
    typedLen: 0,
    activeSite: 0,
    siteVisible: true,
    spreadsheetRows: -1,
    stepLabel: "",
    stepDone: true,
    prevStepLabel: "", // for crossfade animation
    stepKey: 0, // increments on each step change to force CSS animation replay
  });

  // Single mount effect — schedules the entire animation loop
  useEffect(() => {
    let dead = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let typingInterval: ReturnType<typeof setInterval> | null = null;

    const sched = (fn: () => void, ms: number) => {
      timers.push(setTimeout(() => { if (!dead) fn(); }, ms));
    };

    const set = (patch: Partial<typeof s.current>) => {
      // Track previous step label for crossfade — increment stepKey
      if (patch.stepLabel !== undefined && patch.stepLabel !== s.current.stepLabel) {
        patch.prevStepLabel = s.current.stepLabel;
        patch.stepKey = (s.current.stepKey || 0) + 1;
      }
      Object.assign(s.current, patch);
      tick();
    };

    function runCycle() {
      set({ phase: "typing", typedLen: 0, activeSite: 0, siteVisible: true, spreadsheetRows: -1, stepLabel: "", stepDone: true, prevStepLabel: "", stepKey: 0 });
      let charIdx = 0;
      typingInterval = setInterval(() => {
        if (dead) { if (typingInterval) clearInterval(typingInterval); return; }
        charIdx++;
        set({ typedLen: charIdx });
        if (charIdx >= USER_PROMPT.length) {
          if (typingInterval) clearInterval(typingInterval);
          typingInterval = null;
          sched(startBrowsing, PAUSE_AFTER_TYPING);
        }
      }, TYPING_SPEED);
    }

    function startBrowsing() {
      if (dead) return;
      set({ phase: "browsing", activeSite: 0, siteVisible: true, stepLabel: `Reading ${SITES[0].name}`, stepDone: false, prevStepLabel: "" });

      let elapsed = 0;
      for (let si = 0; si < SITES.length; si++) {
        if (si > 0) {
          const prevIdx = si - 1;
          const showAt = elapsed + SITE_TRANSITION;
          const capturedSi = si;
          // First: mark old step done and hide site
          sched(() => {
            set({ stepLabel: `Reading ${SITES[prevIdx].name}`, stepDone: true, siteVisible: false });
          }, elapsed);
          // Then: show new site + new step (after SITE_TRANSITION gap)
          sched(() => {
            set({ activeSite: capturedSi, siteVisible: true, stepLabel: `Reading ${SITES[capturedSi].name}`, stepDone: false });
          }, showAt);
          elapsed = showAt;
        }
        elapsed += SITE_HOLD;
      }
      // Mark last site done
      sched(() => {
        set({ stepLabel: `Reading ${SITES[SITES.length - 1].name}`, stepDone: true });
      }, elapsed);
      sched(() => startSpreadsheet(), elapsed + 500);
    }

    function startSpreadsheet() {
      if (dead) return;
      set({ phase: "spreadsheet", spreadsheetRows: -1, stepLabel: "Building spreadsheet...", stepDone: false });
      SPREADSHEET_DATA.forEach((_, i) => {
        sched(() => set({ spreadsheetRows: i }), i * SPREADSHEET_ROW_DELAY + 150);
      });
      const rowsDoneAt = SPREADSHEET_DATA.length * SPREADSHEET_ROW_DELAY + 300;
      sched(() => {
        set({ stepLabel: "Spreadsheet complete", stepDone: true });
      }, rowsDoneAt);
      // Hold spreadsheet visible longer before transitioning
      sched(() => startResult(), rowsDoneAt + SPREADSHEET_HOLD_AFTER);
    }

    function startResult() {
      if (dead) return;
      set({ phase: "result", stepLabel: "", stepDone: true, prevStepLabel: "" });
      sched(() => runCycle(), RESULT_HOLD + PAUSE_BEFORE_LOOP);
    }

    runCycle();

    return () => {
      dead = true;
      timers.forEach(clearTimeout);
      if (typingInterval) clearInterval(typingInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { phase, typedLen, activeSite, siteVisible, spreadsheetRows, stepLabel, stepDone, prevStepLabel, stepKey } = s.current;

  return (
    <div className="w-full rounded-xl bg-bg2 overflow-hidden">
      {/* Animation container — fixed height, no border/outline */}
      <div className="relative w-full" style={{ height: 298 }}>
        {/* ── Typing ── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-8 transition-opacity duration-500"
          style={{ opacity: phase === "typing" ? 1 : 0, pointerEvents: phase === "typing" ? "auto" : "none" }}
        >
          <div className="w-full max-w-[480px]">
            <FakeChatInput typedLen={typedLen} />
          </div>
        </div>

        {/* ── Browsing ── */}
        <div
          className="absolute inset-0 flex flex-col px-3 pt-3 pb-3 transition-opacity duration-500"
          style={{ opacity: phase === "browsing" ? 1 : 0, pointerEvents: phase === "browsing" ? "auto" : "none" }}
        >
          <div
            className="shrink-0 rounded-lg overflow-hidden border border-b1 bg-bg shadow-sm transition-opacity duration-300"
            style={{ opacity: siteVisible ? 1 : 0, height: 248 }}
          >
            <BrowserChrome url={`https://${SITES[activeSite]?.name || ""}`} />
            <div className="relative p-3.5">
              <div className="mb-3">
                <div className="text-[16px] font-bold text-t1">{SITES[activeSite]?.title}</div>
                <div className="text-[11px] text-t3">{SITES[activeSite]?.subtitle}</div>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {SITES[activeSite]?.plans.map((plan, i) => (
                  <PricingCard key={plan.name} plan={plan} accent={SITES[activeSite].accent} highlighted={i === 1 || i === 2} delay={i * 60} />
                ))}
              </div>
              <AnimatedCursor siteIndex={activeSite} />
            </div>
          </div>
          <div className="mt-2 px-3">
            <StepLine label={stepLabel} done={stepDone} prevLabel={prevStepLabel} stepKey={stepKey} />
          </div>
        </div>

        {/* ── Spreadsheet ── */}
        <div
          className="absolute inset-0 flex flex-col px-3 pt-3 pb-3 transition-opacity duration-500"
          style={{ opacity: phase === "spreadsheet" ? 1 : 0, pointerEvents: phase === "spreadsheet" ? "auto" : "none" }}
        >
          <div className="shrink-0 rounded-lg overflow-hidden border border-b1 bg-bg shadow-sm" style={{ height: 248 }}>
            <BrowserChrome
              url="PM_Tool_Comparison.xlsx"
              icon={<IconFileSpreadsheet className="w-2.5 h-2.5 text-g shrink-0" />}
            />
            <div className="bg-bg">
              <table className="w-full border-collapse">
                <tbody>
                  {SPREADSHEET_DATA.map((row, ri) => (
                    <tr
                      key={ri}
                      style={{
                        opacity: ri <= spreadsheetRows ? 1 : 0,
                        transform: ri <= spreadsheetRows ? "translateX(0)" : "translateX(8px)",
                        transition: `opacity 0.3s ease ${ri * 0.05}s, transform 0.3s ease ${ri * 0.05}s`,
                      }}
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`px-3 py-1.5 border-b border-b1/40 whitespace-nowrap ${
                            ri === 0
                              ? "text-[9px] font-bold text-t3 uppercase tracking-wider bg-as/[0.05]"
                              : ci === 0
                                ? "text-[11px] font-semibold text-t1 bg-bg2/40"
                                : "text-[11px] text-t2 font-mono"
                          }`}
                          style={{ color: ri > 0 && cell.startsWith("\u2713") ? "var(--g)" : undefined }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-2 px-3">
            <StepLine label={stepLabel} done={stepDone} prevLabel={prevStepLabel} stepKey={stepKey} />
          </div>
        </div>

        {/* ── Result ── */}
        <div
          className="absolute inset-0 flex flex-col px-6 pt-3 pb-2 overflow-y-auto transition-opacity duration-500"
          style={{ opacity: phase === "result" ? 1 : 0, pointerEvents: phase === "result" ? "auto" : "none" }}
        >
          <div className="w-full max-w-[520px] mx-auto animate-fade-in">
            {/* Task complete divider */}
            <TaskCompleteDivider />

            {/* Agent message — "All done" text */}
            <div className="mt-2 text-[13px] leading-[1.6] text-t2">
              All done — here&apos;s what I found:
            </div>

            {/* Result card */}
            <div className="mt-2">
              <AnimResultCard />
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes sai-cardIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sai-stepOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-12px); }
        }
        @keyframes sai-stepIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sai-cursor {
          0%   { top: 55%; left: 18%; opacity: 0; }
          8%   { opacity: 1; }
          25%  { top: 50%; left: 30%; }
          50%  { top: 60%; left: 55%; }
          75%  { top: 48%; left: 72%; }
          92%  { opacity: 1; }
          100% { top: 55%; left: 85%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
