"use client";

import { useState, useRef, useEffect } from "react";
import type { Task } from "@/data/mockData";
import { AVAILABLE_SKILLS, DURATION_OPTIONS, AUTONOMY_LEVELS } from "@/data/mockData";

interface TaskConfigUpdate {
  skills?: string[];
  integrations?: string[];
  maxDuration?: string;
  autonomousActions?: string;
}

interface TaskConfigSectionProps {
  task: Task;
  editable: boolean;
  onChange?: (updates: TaskConfigUpdate) => void;
}

const ALL_INTEGRATIONS = ["LinkedIn", "Gmail", "Salesforce", "Crunchbase", "X", "TechCrunch", "Google Docs", "Calendar", "Sheets", "Granola", "Slack", "Notion"];

export function TaskConfigSection({ task, editable, onChange }: TaskConfigSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [addingIntegration, setAddingIntegration] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Local editable state initialized from task props
  const [skills, setSkills] = useState(task.skills ?? []);
  const [integrations, setIntegrations] = useState(task.integrations ?? []);
  const [maxDuration, setMaxDurationLocal] = useState(task.detail?.maxDuration ?? "15 min");
  const [autonomy, setAutonomyLocal] = useState(task.detail?.autonomousActions ?? "Medium");

  // Close integration picker on outside click
  useEffect(() => {
    if (!addingIntegration) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setAddingIntegration(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [addingIntegration]);

  const availableIntegrations = ALL_INTEGRATIONS.filter((i) => !integrations.includes(i));

  // Summary line for collapsed state
  const summaryParts: string[] = [];
  if (skills.length) summaryParts.push(`${skills.length} skill${skills.length !== 1 ? "s" : ""}`);
  if (integrations.length) summaryParts.push(`${integrations.length} service${integrations.length !== 1 ? "s" : ""}`);
  if (maxDuration) summaryParts.push(maxDuration);
  const summary = summaryParts.join(" · ");

  const toggleSkill = (skill: string) => {
    if (!editable) return;
    const next = skills.includes(skill) ? skills.filter((s) => s !== skill) : [...skills, skill];
    setSkills(next);
    onChange?.({ skills: next });
  };

  const removeIntegration = (name: string) => {
    if (!editable) return;
    const next = integrations.filter((i) => i !== name);
    setIntegrations(next);
    onChange?.({ integrations: next });
  };

  const addIntegration = (name: string) => {
    if (!editable) return;
    const next = [...integrations, name];
    setIntegrations(next);
    onChange?.({ integrations: next });
    setAddingIntegration(false);
  };

  const handleSetDuration = (val: string) => {
    if (!editable) return;
    setMaxDurationLocal(val);
    onChange?.({ maxDuration: val });
  };

  const handleSetAutonomy = (val: string) => {
    if (!editable) return;
    setAutonomyLocal(val);
    onChange?.({ autonomousActions: val });
  };

  return (
    <div className="mb-4">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 rounded-md px-0 py-1 text-left transition-colors"
      >
        <svg
          className="h-3.5 w-3.5 shrink-0 text-t4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">
          Configuration
        </span>
        {!expanded && summary && (
          <span className="ml-auto text-[11px] text-t4">{summary}</span>
        )}
        <svg
          className={`h-3 w-3 shrink-0 text-t4 transition-transform ${expanded ? "" : "-rotate-90"} ${!expanded && summary ? "" : "ml-auto"}`}
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

      {/* Expanded content */}
      {expanded && (
        <div className="mt-2 flex flex-col gap-4 rounded-lg border border-b1 bg-bg3/30 px-3.5 py-3">
          {/* Skills */}
          <div>
            <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_SKILLS.map((skill) => {
                const active = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    disabled={!editable}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                      active
                        ? "bg-bg3 text-t1"
                        : editable
                          ? "border border-dashed border-b2 text-t4 hover:border-b2 hover:text-t3"
                          : "border border-dashed border-b1 text-t4"
                    } ${editable ? "cursor-pointer" : "cursor-default"}`}
                  >
                    {!active && editable && <span className="mr-0.5">+</span>}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Integrations */}
          <div>
            <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">Integrations</div>
            <div className="flex flex-wrap items-center gap-1.5">
              {integrations.map((name) => (
                <span key={name} className="flex items-center gap-1 rounded-full bg-bg3 px-2.5 py-0.5 text-[11px] font-medium text-t2">
                  {name}
                  {editable && (
                    <button
                      type="button"
                      onClick={() => removeIntegration(name)}
                      className="ml-0.5 text-t4 transition-colors hover:text-t2"
                    >
                      <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </span>
              ))}
              {editable && availableIntegrations.length > 0 && (
                <div className="relative" ref={pickerRef}>
                  <button
                    type="button"
                    onClick={() => setAddingIntegration(!addingIntegration)}
                    className="rounded-full border border-dashed border-b2 px-2.5 py-0.5 text-[11px] font-medium text-t4 transition-all hover:border-b2 hover:text-t3"
                  >
                    + Add
                  </button>
                  {addingIntegration && (
                    <div className="absolute left-0 top-[calc(100%+4px)] z-10 max-h-[200px] w-[180px] overflow-y-auto overflow-hidden rounded-lg border border-b1 bg-bg2 py-1 shadow-[var(--sc)]">
                      {availableIntegrations.map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => addIntegration(name)}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] text-t2 transition-all hover:bg-bg3 hover:text-t1"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Max Duration */}
          <div>
            <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">Max Duration</div>
            <div className="flex flex-wrap gap-1.5">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSetDuration(opt)}
                  disabled={!editable}
                  className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all ${
                    maxDuration === opt
                      ? "border-b2 bg-bg3 text-t1"
                      : editable
                        ? "border-b1 text-t3 hover:border-b2 hover:text-t2"
                        : "border-b1 text-t4"
                  } ${editable ? "cursor-pointer" : "cursor-default"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Autonomous Actions */}
          <div>
            <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4">Autonomous Actions</div>
            <div className="flex flex-wrap gap-1.5">
              {AUTONOMY_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleSetAutonomy(level)}
                  disabled={!editable}
                  className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all ${
                    autonomy === level
                      ? "border-b2 bg-bg3 text-t1"
                      : editable
                        ? "border-b1 text-t3 hover:border-b2 hover:text-t2"
                        : "border-b1 text-t4"
                  } ${editable ? "cursor-pointer" : "cursor-default"}`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="mt-1 text-[10.5px] text-t4">
              {autonomy === "Off" && "Always asks before acting"}
              {autonomy === "Low" && "Asks for most actions"}
              {autonomy === "Medium" && "Acts on routine tasks, asks for new ones"}
              {autonomy === "High" && "Acts autonomously, reports after"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
