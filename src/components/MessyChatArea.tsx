"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessyTaskDetail } from "./MessyTaskDetail";
import { ResultCard } from "./cards/ResultCard";
import { DraftCard, type DraftField } from "./cards/DraftCard";
import { fireworksScenario } from "@/data/mockData";
import type { RunningStep, PillOption, Intervention, MessyScenario, ResultArtifact } from "@/data/mockData";


const scenario: MessyScenario = fireworksScenario;
const ACK_DELAY = 1200;
const STEP_START_DELAY = 800;

/* ── Layout helpers ── */

function AgentMessage({ children }: { children: React.ReactNode }) {
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

function TaskCompleteDivider() {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="h-px flex-1 bg-b1" />
      <span className="text-[10px] text-t4">task complete</span>
      <div className="h-px flex-1 bg-b1" />
    </div>
  );
}

/* ── Pill Bar ── */

function PillBar({
  pills,
  onSelect,
  disabled,
  selectedValue,
}: {
  pills: PillOption[];
  onSelect: (pill: PillOption) => void;
  disabled: boolean;
  selectedValue: string | null;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {pills.map((pill) => (
        <button
          key={pill.value}
          onClick={() => onSelect(pill)}
          disabled={disabled}
          className={`rounded-md border px-3 py-1.5 text-[13px] font-medium transition-all ${
            pill.value === selectedValue
              ? "border-as/50 bg-as/10 text-blt"
              : disabled
                ? "border-b1 bg-bg3/50 text-t4 cursor-default"
                : pill.isCancel
                  ? "border-b1 bg-bg3 text-t3 hover:border-rd/20 hover:bg-rd/5 hover:text-rd cursor-pointer"
                  : "border-b1 bg-bg3 text-t2 hover:border-b2 hover:bg-bg3h cursor-pointer"
          }`}
        >
          {pill.label}
        </button>
      ))}
    </div>
  );
}

/* ── Inline task input ── */

function MessyTaskInput({
  onSend,
  placeholder,
  disabled,
}: {
  onSend?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }, [value]);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend?.(value.trim());
    setValue("");
  };

  return (
    <div className="relative flex flex-col rounded-lg border border-b1 bg-bgcard transition-colors focus-within:border-b2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder={placeholder || "Describe a task..."}
        rows={1}
        disabled={disabled}
        className="resize-none overflow-hidden bg-transparent px-4 pt-3 pb-1.5 text-[13px] leading-[1.5] text-t1 placeholder:text-t4 outline-none disabled:opacity-50"
      />
      <div className="flex items-center gap-1 px-3 pb-2.5">
        <span className="text-[11px] text-t3">Claude 4.6 Opus</span>
        <div className="flex-1" />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={`flex items-center justify-center rounded-full p-1.5 transition-all ${
            value.trim() && !disabled
              ? "bg-ab text-abt hover:brightness-110"
              : "text-t4 cursor-default"
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Artifact helpers (same as ChatArea) ── */

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
    default:
      return <svg className={cls} {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
  }
}

function ArtifactLink({ artifact }: { artifact: ResultArtifact }) {
  return (
    <button className="mt-3 flex w-full items-center gap-2.5 rounded-md border border-b1 bg-bg3h/50 px-3 py-2.5 text-left transition-all hover:bg-bg3h hover:border-b2">
      <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-bg3h"><ArtifactIcon format={artifact.format} /></div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12.5px] font-medium text-t1">{artifact.title}</div>
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

/* ── Transcript types ── */

type TranscriptEntry =
  | { type: "user-task"; text: string }
  | { type: "agent-opener"; text: string }
  | { type: "step-log" }
  | { type: "agent-ask"; interventionId: string; message: string; pills: PillOption[] }
  | { type: "user-response"; text: string }
  | { type: "agent-ack"; text: string }
  | { type: "result-card" }
  | { type: "draft-card" };

/* ── Phase machine ── */

type Phase =
  | "idle"
  | "started"
  | "pre-asking"
  | "running"
  | "mid-asking"
  | "post-asking"
  | "ack"
  | "done";

/* ── Props ── */

interface MessyChatAreaProps {
  /** Called when the user starts the task (clicks the starter button) */
  onTaskStart?: () => void;
  /** Called each time a new step becomes visible */
  onStepChange?: (step: number) => void;
  /** Called when all steps finish running */
  onDone?: () => void;
  /** Called when all interventions (including post-task) are resolved */
  onAllTurnsDone?: () => void;
  /** Called when user clicks "View full activity log" */
  onViewActivityLog?: () => void;
}

/* ── Main component ── */

export function MessyChatArea({ onTaskStart, onStepChange, onDone, onAllTurnsDone, onViewActivityLog }: MessyChatAreaProps = {}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [visibleSteps, setVisibleSteps] = useState<RunningStep[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [allTurnsDone, setAllTurnsDone] = useState(false);

  // Track which interventions have been responded to (interventionId → selected pill value)
  const [responses, setResponses] = useState<Record<string, string>>({});

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepIdxRef = useRef(0);
  const interventionIdxRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Track previous phase for ack routing
  const prevPhaseRef = useRef<Phase>("idle");

  const pushTranscript = useCallback((entry: TranscriptEntry) => {
    setTranscript((prev) => [...prev, entry]);
  }, []);

  // Notify parent when all turns are done
  useEffect(() => {
    if (allTurnsDone) onAllTurnsDone?.();
  }, [allTurnsDone]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [transcript.length, visibleSteps.length, phase, showResult, allTurnsDone]);

  // Get current intervention
  const getCurrentIntervention = useCallback((): Intervention | undefined => {
    return scenario.interventions[interventionIdxRef.current];
  }, []);

  // Compute timestamp for injected user step
  const computeUserTimestamp = useCallback(() => {
    const lastTs = visibleSteps[visibleSteps.length - 1]?.timestamp || "0:00";
    const parts = lastTs.split(":");
    const secs = parseInt(parts[0]) * 60 + parseInt(parts[1]) + 2;
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  }, [visibleSteps]);

  // Start the task
  const handleStartTask = () => {
    if (phase !== "idle") return;
    setPhase("started");
    onTaskStart?.();

    // Push user message + agent opener
    pushTranscript({ type: "user-task", text: scenario.userMessage });
    pushTranscript({ type: "agent-opener", text: scenario.agentOpener });

    // Check for pre-interventions
    setTimeout(() => {
      const first = scenario.interventions[0];
      if (first?.timing === "pre") {
        pushTranscript({ type: "agent-ask", interventionId: first.id, message: first.agentMessage, pills: first.pills });
        setPhase("pre-asking");
      } else {
        // No pre-intervention — go straight to running
        pushTranscript({ type: "step-log" });
        setPhase("running");
        stepIdxRef.current = 0;
        setTimeout(() => advanceStep(), STEP_START_DELAY);
      }
    }, STEP_START_DELAY);
  };

  // Step cascade
  const advanceStep = () => {
    const idx = stepIdxRef.current;

    // All steps exhausted — show result, then check for post (follow-up) interventions
    if (idx >= scenario.steps.length) {
      onDone?.();
      setTimeout(() => {
        // Show result card first
        setPhase("done");
        pushTranscript({ type: "result-card" });
        setTimeout(() => {
          setShowResult(true);
          // After result appears, check for post interventions (follow-up questions)
          const nextIntervention = getCurrentIntervention();
          if (nextIntervention?.timing === "post") {
            setTimeout(() => {
              pushTranscript({ type: "agent-ask", interventionId: nextIntervention.id, message: nextIntervention.agentMessage, pills: nextIntervention.pills });
              setPhase("post-asking");
            }, 1000);
          }
        }, 500);
      }, 800);
      return;
    }

    // Check for mid-intervention pause BEFORE adding the step
    const nextIntervention = getCurrentIntervention();
    if (
      nextIntervention?.timing === "mid" &&
      nextIntervention.pauseAfterStep !== undefined &&
      idx >= nextIntervention.pauseAfterStep
    ) {
      setTimeout(() => {
        pushTranscript({ type: "agent-ask", interventionId: nextIntervention.id, message: nextIntervention.agentMessage, pills: nextIntervention.pills });
        setPhase("mid-asking");
      }, 800);
      return;
    }

    // Add next step
    const step = scenario.steps[idx];
    setVisibleSteps((prev) => [...prev, step]);
    stepIdxRef.current = idx + 1;
    onStepChange?.(idx + 1);

    // Variable timing
    let delay = 800 + Math.random() * 800;
    if (step.status === "failed") delay = 500 + Math.random() * 500;
    if (step.type === "thinking") delay = 1000 + Math.random() * 500;

    timerRef.current = setTimeout(advanceStep, delay);
  };

  // Get ack text for a given intervention + pill value
  const getAckText = (intervention: Intervention, pillValue: string): string | undefined => {
    if (!intervention.agentAck) return undefined;
    if (typeof intervention.agentAck === "string") return intervention.agentAck;
    return intervention.agentAck[pillValue];
  };

  // Advance after showing acknowledgment
  const advanceAfterAck = (fromPhase: Phase) => {
    interventionIdxRef.current += 1;

    if (fromPhase === "pre-asking") {
      // Check for another pre-intervention
      const next = getCurrentIntervention();
      if (next?.timing === "pre") {
        pushTranscript({ type: "agent-ask", interventionId: next.id, message: next.agentMessage, pills: next.pills });
        setPhase("pre-asking");
      } else {
        // Start running — push step log and begin cascade
        pushTranscript({ type: "step-log" });
        setPhase("running");
        stepIdxRef.current = 0;
        setTimeout(() => advanceStep(), STEP_START_DELAY);
      }
    } else if (fromPhase === "mid-asking") {
      // Resume cascade
      setPhase("running");
      setTimeout(() => advanceStep(), 600);
    } else if (fromPhase === "post-asking") {
      // Result is already shown — mark all turns done
      setPhase("done");
      setAllTurnsDone(true);
    }
  };

  // Handle pill click
  const handlePillSelect = (interventionId: string, pill: PillOption) => {
    const intervention = getCurrentIntervention();
    if (!intervention || intervention.id !== interventionId) return;

    // Record response
    setResponses((prev) => ({ ...prev, [interventionId]: pill.value }));

    // Push user response to transcript
    const userText = pill.resultText || pill.label;
    pushTranscript({ type: "user-response", text: userText });

    // Inject user step into visible steps (mid-task only)
    if (phase === "mid-asking") {
      const ts = computeUserTimestamp();
      const userStep: RunningStep = {
        timestamp: ts,
        label: userText,
        type: "user",
        userAction: true,
        done: true,
      };
      setVisibleSteps((prev) => [...prev, userStep]);
    }

    if (pill.isCancel) {
      setPhase("done");
      pushTranscript({ type: "result-card" });
      setTimeout(() => setShowResult(true), 500);
      return;
    }

    // Special handling: "Send via email" shows a DraftCard for approval
    if (pill.value === "email" && phase === "post-asking") {
      pushTranscript({ type: "agent-ack", text: "I'll draft an email for you to review." });
      setTimeout(() => {
        pushTranscript({ type: "draft-card" });
        setPhase("done");
      }, ACK_DELAY);
      return;
    }

    // Show ack
    const ackText = getAckText(intervention, pill.value);
    const currentPhase = phase;
    prevPhaseRef.current = currentPhase;

    if (ackText) {
      pushTranscript({ type: "agent-ack", text: ackText });
      setPhase("ack");
      setTimeout(() => advanceAfterAck(currentPhase), ACK_DELAY);
    } else {
      advanceAfterAck(currentPhase);
    }
  };

  // Handle free text input
  const handleFreeText = (text: string) => {
    const intervention = getCurrentIntervention();
    if (!intervention) return;

    // Create a synthetic pill from the free text
    const syntheticPill: PillOption = {
      label: text,
      value: "__free_text__",
      resultText: text,
    };
    handlePillSelect(intervention.id, syntheticPill);
  };

  // Restart demo
  const handleRestart = () => {
    setPhase("idle");
    setTranscript([]);
    setVisibleSteps([]);
    setResponses({});
    setShowResult(false);
    setAllTurnsDone(false);
    stepIdxRef.current = 0;
    interventionIdxRef.current = 0;
    prevPhaseRef.current = "idle";
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Derived state
  const isAsking = phase === "pre-asking" || phase === "mid-asking" || phase === "post-asking";
  const isDone = phase === "done";
  const isRunning = phase === "running" || phase === "ack" || phase === "started";
  const currentIntervention = getCurrentIntervention();
  const isStruggling = phase === "mid-asking" && currentIntervention?.isStruggling;

  // Determine input placeholder
  const getInputPlaceholder = () => {
    if (phase === "idle") return "Describe a task...";
    if (isAsking && currentIntervention?.inputPlaceholder) return currentIntervention.inputPlaceholder;
    if (isAsking) return "Type a suggestion...";
    if (isDone) return "Send another task...";
    return "Sai is working...";
  };

  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      {/* Scrollable chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto flex min-h-full max-w-[680px] flex-col gap-5">
          {/* Spacer — pushes messages to bottom when they don't fill viewport */}
          <div className="flex-1" />
          {/* Idle — show prompt */}
          {phase === "idle" && (
            <div className="animate-fade-in">
              <AgentMessage>
                <div className="text-sm leading-[1.6] text-t2">
                  Try sending a task. I&apos;ll show you what a realistic multi-turn agent workflow looks like.
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handleStartTask}
                    className="rounded-md border border-b1 bg-bg3 px-3 py-1.5 text-[13px] font-medium text-t2 transition-all hover:border-b2 hover:bg-bg3h"
                  >
                    {scenario.taskLabel}
                  </button>
                </div>
              </AgentMessage>
            </div>
          )}

          {/* Render transcript entries */}
          {transcript.map((entry, i) => {
            switch (entry.type) {
              case "user-task":
                return (
                  <div key={i} className="animate-fade-in">
                    <UserMessage>{entry.text}</UserMessage>
                  </div>
                );

              case "agent-opener":
                return (
                  <div key={i} className="animate-fade-in">
                    <AgentMessage>
                      <div className="text-sm leading-[1.6] text-t2">{entry.text}</div>
                    </AgentMessage>
                  </div>
                );

              case "step-log":
                return (
                  <div key={i} className="animate-fade-in">
                    <AgentMessage>
                      <MessyTaskDetail
                        steps={visibleSteps}
                        subtask={scenario.subtaskLabel}
                        done={isDone || phase === "post-asking"}
                        isStruggling={isStruggling}
                        onViewActivityLog={onViewActivityLog}
                      />
                    </AgentMessage>
                  </div>
                );

              case "agent-ask": {
                const responded = entry.interventionId in responses;
                const selectedValue = responses[entry.interventionId] ?? null;
                return (
                  <div key={i} className="animate-fade-in">
                    <AgentMessage>
                      <div className="text-sm leading-[1.6] text-t2">{entry.message}</div>
                      <PillBar
                        pills={entry.pills}
                        onSelect={(pill) => handlePillSelect(entry.interventionId, pill)}
                        disabled={responded}
                        selectedValue={selectedValue}
                      />
                    </AgentMessage>
                  </div>
                );
              }

              case "user-response":
                return (
                  <div key={i} className="animate-fade-in">
                    <UserMessage>{entry.text}</UserMessage>
                  </div>
                );

              case "agent-ack":
                return (
                  <div key={i} className="animate-fade-in">
                    <AgentMessage>
                      <div className="text-sm leading-[1.6] text-t2">{entry.text}</div>
                    </AgentMessage>
                  </div>
                );

              case "result-card":
                if (!showResult) return null;
                return (
                  <div key={i}>
                    <TaskCompleteDivider />
                    <div className="mt-5 animate-fade-in">
                      <AgentMessage>
                        <ResultCard
                          icon={
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          }
                          title={scenario.result.title}
                          body={{ type: "prose", text: (
                            <>
                              {scenario.result.summary}
                              <ArtifactLink artifact={scenario.result.artifact} />
                            </>
                          ) }}
                          actions={[
                            { label: "View details", style: "primary", onClick: () => {} },
                            {
                              label: "Open document",
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
                  </div>
                );

              case "draft-card":
                return (
                  <div key={i} className="animate-fade-in">
                    <AgentMessage>
                      <DraftCard
                        intent="Send funding summary to team"
                        fields={[
                          { type: "header", label: "To", value: "product-team@company.com" },
                          { type: "header", label: "Subject", value: "Fireworks AI — Series B Funding Summary", editable: true },
                          { type: "text", value: "Hi team,\n\nHere's a quick summary of the Fireworks AI funding news:\n\nFireworks AI raised $150M in Series B funding led by Benchmark, valuing the company at $1.5B. The round will fund expansion of their inference optimization platform and continued development of their compound AI system offerings.\n\nKey details:\n• Round size: $150M Series B\n• Lead investor: Benchmark\n• Valuation: $1.5B\n• Focus: Inference optimization + compound AI\n\nFull summary doc is attached. Let me know if you have questions.\n\nBest,\nKevin", editable: true },
                        ]}
                        approveLabel="Send email"
                        denyLabel="Don't send"
                        onApprove={() => setAllTurnsDone(true)}
                        onDeny={() => setAllTurnsDone(true)}
                        resolvedMessage="Email sent to product-team@company.com"
                      />
                    </AgentMessage>
                  </div>
                );

              default:
                return null;
            }
          })}

          {/* Replay demo — only after all turns are fully resolved */}
          {allTurnsDone && (
            <div className="mt-5 flex justify-center animate-fade-in">
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 rounded-md border border-b1 px-3 py-1.5 text-[12px] font-medium text-t3 transition-all hover:bg-bg3 hover:text-t2"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                </svg>
                Replay demo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="shrink-0 px-6 pb-6">
        <div className="mx-auto max-w-[680px]">
          <MessyTaskInput
            onSend={
              phase === "idle"
                ? () => handleStartTask()
                : isAsking
                  ? handleFreeText
                  : undefined
            }
            placeholder={getInputPlaceholder()}
            disabled={isRunning}
          />
        </div>
      </div>
    </div>
  );
}
