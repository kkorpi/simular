"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SimularLogo } from "./SimularLogo";

/**
 * Setup steps shown during workspace provisioning.
 * Framed as a coworker getting set up. Never mention VMs or containers.
 */
const setupSteps = [
  { label: "Setting up your workspace" },
  { label: "Installing Chrome and apps" },
  { label: "Configuring a secure environment" },
  { label: "Preparing your coworker" },
];

/** Role options for dropdown */
const roleOptions = [
  { id: "vc", label: "VC / Investor" },
  { id: "sales", label: "Sales" },
  { id: "marketing", label: "Marketing" },
  { id: "ops", label: "Operations" },
  { id: "founder", label: "Founder" },
  { id: "engineer", label: "Engineer" },
  { id: "researcher", label: "Researcher" },
  { id: "student", label: "Student" },
  { id: "other", label: "Other" },
];

/** Onboarding questions shown alongside setup progress */
const onboardingQuestions = [
  {
    question: "What best describes your role?",
    type: "role-dropdown" as const,
    options: roleOptions,
  },
  {
    question: "Which apps do you use most?",
    multi: true,
    options: [
      { id: "gmail", label: "Gmail" },
      { id: "linkedin", label: "LinkedIn" },
      { id: "salesforce", label: "Salesforce" },
      { id: "slack", label: "Slack" },
      { id: "hubspot", label: "HubSpot" },
      { id: "notion", label: "Notion" },
      { id: "sheets", label: "Google Sheets" },
      { id: "jira", label: "Jira" },
    ],
  },
  {
    question: "What would you love to hand off?",
    options: [
      { id: "research", label: "Research" },
      { id: "email", label: "Email triage" },
      { id: "crm", label: "CRM updates" },
      { id: "meeting-prep", label: "Meeting prep" },
      { id: "monitoring", label: "Monitoring" },
      { id: "scheduling", label: "Scheduling" },
      { id: "data-entry", label: "Data entry" },
      { id: "reporting", label: "Reporting" },
    ],
  },
];

export interface OnboardingProfile {
  role?: string;
  apps?: string[];
  handoff?: string;
}

export function OnboardingScreen({ onReady }: { onReady: (profile: OnboardingProfile) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stepsFinished, setStepsFinished] = useState(false);
  const [done, setDone] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true);

  // Profile answers
  const [role, setRole] = useState<string | undefined>();
  const [apps, setApps] = useState<string[]>([]);
  const [handoff, setHandoff] = useState<string | undefined>();
  const [roleOpen, setRoleOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const allQuestionsAnswered = questionIndex >= onboardingQuestions.length;

  // Close role dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setRoleOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Show completion only when BOTH steps finished AND questions answered
  useEffect(() => {
    if (stepsFinished && allQuestionsAnswered && !done) {
      const timer = setTimeout(() => setDone(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [stepsFinished, allQuestionsAnswered, done]);

  // Advance through steps with varying durations
  useEffect(() => {
    if (stepsFinished || currentStep >= setupSteps.length) return;

    const durations = [3000, 2400, 3000, 3500];
    const duration = durations[currentStep] || 2400;

    const startProgress = (currentStep / setupSteps.length) * 100;
    const endProgress = ((currentStep + 1) / setupSteps.length) * 100;
    const interval = 50;
    const increment = ((endProgress - startProgress) / duration) * interval;

    const progressTimer = setInterval(() => {
      setProgress((p) => {
        const next = p + increment;
        return next >= endProgress ? endProgress : next;
      });
    }, interval);

    const stepTimer = setTimeout(() => {
      clearInterval(progressTimer);
      setProgress(endProgress);

      if (currentStep === setupSteps.length - 1) {
        setStepsFinished(true);
      } else {
        setCurrentStep((s) => s + 1);
      }
    }, duration);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
    };
  }, [currentStep, stepsFinished]);

  const advanceQuestion = useCallback(() => {
    setShowQuestion(false);
    setTimeout(() => {
      setQuestionIndex((i) => i + 1);
      setShowQuestion(true);
    }, 300);
  }, []);

  const handleToggleApp = (id: string) => {
    setApps((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSelectHandoff = (id: string) => {
    setHandoff(id);
    advanceQuestion();
  };

  const handleContinue = useCallback(() => {
    onReady({ role, apps: apps.length > 0 ? apps : undefined, handoff });
  }, [onReady, role, apps, handoff]);

  const currentQ = onboardingQuestions[questionIndex];

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg px-8">
      <div className="w-full max-w-[540px]">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <SimularLogo size={40} />
        </div>

        {/* Trial badge */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-as/25 bg-as/[0.06] px-4 py-2">
            <svg className="h-4 w-4 text-blt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[13px] font-medium text-blt">
              7-day free trial started
            </span>
            <span className="text-[12px] text-blt/60">
              · cancel anytime
            </span>
          </div>
        </div>

        {done ? (
          /* ── Completion state ── */
          <div className="animate-fade-in text-center">
            {/* Checkmark circle */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-as/10">
              <svg className="h-8 w-8 text-blt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 className="text-[22px] font-semibold text-t1">
              Your workspace is ready{role ? `, Katie` : ""}
            </h2>
            <p className="mt-2 text-[15px] leading-[1.6] text-t3">
              Let&apos;s meet your new coworker.
            </p>

            <button
              onClick={handleContinue}
              className="mt-8 inline-flex h-11 items-center gap-2.5 rounded-md bg-as px-8 text-[14px] font-medium text-white transition-all hover:bg-as2"
            >
              Get started
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        ) : (
          /* ── Progress + questions state ── */
          <>
            {/* Current step label */}
            <div className="mb-6 text-center">
              <h2 className="text-[18px] font-semibold text-t1">
                {stepsFinished ? "Almost there" : setupSteps[currentStep]?.label}
              </h2>
            </div>

            {/* Progress bar */}
            <div className="mb-6 h-1 overflow-hidden rounded-full bg-bg3">
              <div
                className="h-full rounded-full bg-as transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step indicators */}
            <div className="mb-8 flex justify-center gap-2">
              {setupSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    stepsFinished || i < currentStep
                      ? "bg-as"
                      : i === currentStep
                        ? "bg-blt animate-pulse"
                        : "bg-bg3"
                  }`}
                />
              ))}
            </div>

            {/* Question area */}
            {!allQuestionsAnswered && currentQ ? (
              <div
                key={questionIndex}
                className={`rounded-lg border border-b1 bg-bg2 px-5 py-5 transition-all duration-300 ${
                  showQuestion ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                }`}
              >
                <p className="mb-4 text-center text-[14px] font-medium text-t1">
                  {currentQ.question}
                </p>

                {"type" in currentQ && currentQ.type === "role-dropdown" ? (
                  /* ── Role dropdown ── */
                  <>
                    <div className="relative" ref={roleDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setRoleOpen((o) => !o)}
                        className={`flex h-12 w-full items-center justify-between rounded-md border border-b1 bg-bg3 px-4 text-left text-[14px] transition-colors focus:border-as focus:outline-none ${!role ? "text-t4" : "text-t1"}`}
                      >
                        <span>{role ? roleOptions.find((r) => r.id === role)?.label : "Select your role"}</span>
                        <svg
                          className={`h-4 w-4 shrink-0 text-t4 transition-transform ${roleOpen ? "rotate-180" : ""}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {roleOpen && (
                        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-10 rounded-md border border-b1 bg-bg2 py-1 shadow-lg">
                          {roleOptions.map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => {
                                setRole(r.id);
                                setRoleOpen(false);
                              }}
                              className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] transition-colors hover:bg-bg3 ${
                                role === r.id ? "text-t1" : "text-t2"
                              }`}
                            >
                              {role === r.id ? (
                                <svg className="h-3.5 w-3.5 shrink-0 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : (
                                <span className="w-3.5 shrink-0" />
                              )}
                              {r.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={advanceQuestion}
                      className={`mt-4 w-full text-center text-[13px] font-medium transition-colors ${
                        role ? "text-blt hover:text-as2" : "text-t4"
                      }`}
                    >
                      {role ? "Next \u2192" : "Skip \u2192"}
                    </button>
                  </>
                ) : currentQ.multi ? (
                  /* ── Multi-select pills (apps) ── */
                  <>
                    <div className="flex flex-wrap justify-center gap-2">
                      {currentQ.options.map((opt) => {
                        const selected = apps.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleToggleApp(opt.id)}
                            className={`rounded-md border px-3.5 py-2 text-[13px] font-medium transition-all ${
                              selected
                                ? "border-as/50 bg-as/10 text-blt"
                                : "border-b1 bg-bg3 text-t2 hover:border-b2 hover:bg-bg3h"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={advanceQuestion}
                      className={`mt-4 w-full text-center text-[13px] font-medium transition-colors ${
                        apps.length > 0 ? "text-blt hover:text-as2" : "text-t4"
                      }`}
                    >
                      {apps.length > 0 ? "Continue \u2192" : "Skip \u2192"}
                    </button>
                  </>
                ) : (
                  /* ── Single-select pills (handoff) ── */
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectHandoff(opt.id)}
                        className={`rounded-md border px-3.5 py-2 text-[13px] font-medium transition-all ${
                          handoff === opt.id
                            ? "border-as/50 bg-as/10 text-blt"
                            : "border-b1 bg-bg3 text-t2 hover:border-b2 hover:bg-bg3h"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </>
        )}

        {/* Trust signals */}
        <div className="mt-8 flex items-center justify-center gap-4 text-[11px] text-t4">
          <div className="flex items-center gap-1.5">
            <svg className="h-3 w-3 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Private workspace
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-3 w-3 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            All activity logged
          </div>
        </div>
      </div>
    </div>
  );
}
