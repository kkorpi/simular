"use client";

import { useState, useRef, useEffect } from "react";
import type { Task } from "@/data/mockData";
import { AVAILABLE_SKILLS, DURATION_OPTIONS, AUTONOMY_LEVELS } from "@/data/mockData";

const ALL_INTEGRATIONS = ["LinkedIn", "Gmail", "Salesforce", "Crunchbase", "X", "TechCrunch", "Google Docs", "Calendar", "Sheets", "Granola", "Slack", "Notion"];

type Frequency = "daily" | "weekdays" | "weekly" | "monthly" | "custom";

const frequencies: { id: Frequency; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekdays", label: "Weekdays" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "custom", label: "Custom" },
];

const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function schedulePreview(
  freq: Frequency,
  time: string,
  selectedDays: string[],
  weeklyDay: string,
  monthDay: number
): string {
  switch (freq) {
    case "daily":
      return `Runs every day at ${time}`;
    case "weekdays":
      return `Runs Mon–Fri at ${time}`;
    case "weekly":
      return `Runs every ${weeklyDay} at ${time}`;
    case "monthly":
      return `Runs on the ${ordinal(monthDay)} of each month at ${time}`;
    case "custom":
      if (selectedDays.length === 0) return `No days selected`;
      if (selectedDays.length === 7) return `Runs every day at ${time}`;
      return `Runs ${selectedDays.join(", ")} at ${time}`;
  }
}

interface TaskSettingsPanelProps {
  task: Task;
  editable: boolean;
  onBack: () => void;
  onSave?: () => void;
}

export function TaskSettingsPanel({ task, editable, onBack, onSave }: TaskSettingsPanelProps) {
  // ── Config state ──
  const [skills, setSkills] = useState(task.skills ?? []);
  const [integrations, setIntegrations] = useState(task.integrations ?? []);
  const [maxDuration, setMaxDuration] = useState(task.detail?.maxDuration ?? "15 min");
  const [autonomy, setAutonomy] = useState(task.detail?.autonomousActions ?? "Medium");
  const [addingIntegration, setAddingIntegration] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // ── Schedule state ──
  const [frequency, setFrequency] = useState<Frequency>("weekdays");
  const [time, setTime] = useState("7:00 AM");
  const [weeklyDay, setWeeklyDay] = useState("Monday");
  const [monthDay, setMonthDay] = useState(1);
  const [customDays, setCustomDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  const isRecurring = task.status === "recurring";

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

  const toggleSkill = (skill: string) => {
    if (!editable) return;
    setSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
  };

  const removeIntegration = (name: string) => {
    if (!editable) return;
    setIntegrations((prev) => prev.filter((i) => i !== name));
  };

  const addIntegration = (name: string) => {
    if (!editable) return;
    setIntegrations((prev) => [...prev, name]);
    setAddingIntegration(false);
  };

  const toggleCustomDay = (day: string) => {
    setCustomDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const monthDayOptions = Array.from({ length: 28 }, (_, i) => i + 1);

  const sectionLabel = "mb-2 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-t4";
  const pillActive = "bg-bg3 text-t1";
  const pillInactive = editable
    ? "border border-dashed border-b2 text-t4 hover:border-b2 hover:text-t3"
    : "border border-dashed border-b1 text-t4";
  const segActive = "border-b2 bg-bg3 text-t1";
  const segInactive = editable
    ? "border-b1 text-t3 hover:border-b2 hover:text-t2"
    : "border-b1 text-t4";

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2.5 border-b border-b1 px-4 py-3.5">
        <button
          onClick={onBack}
          className="shrink-0 rounded-md p-1 text-t3 transition-all hover:bg-bg3 hover:text-t1"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="min-w-0 flex-1 truncate text-[14px] font-semibold text-t1">
          Task Settings
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* ── CONFIGURATION ── */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 rounded-lg border border-b1 bg-bg3/30 px-3.5 py-3">
            {/* Skills */}
            <div>
              <div className={sectionLabel}>Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_SKILLS.map((skill) => {
                  const active = skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      disabled={!editable}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${active ? pillActive : pillInactive} ${editable ? "cursor-pointer" : "cursor-default"}`}
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
              <div className={sectionLabel}>Integrations</div>
              <div className="flex flex-wrap items-center gap-1.5">
                {integrations.map((name) => (
                  <span key={name} className="flex items-center gap-1 rounded-full bg-bg3 px-2.5 py-0.5 text-[11px] font-medium text-t2">
                    {name}
                    {editable && (
                      <button type="button" onClick={() => removeIntegration(name)} className="ml-0.5 text-t4 transition-colors hover:text-t2">
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
              <div className={sectionLabel}>Max Duration</div>
              <div className="flex flex-wrap gap-1.5">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => editable && setMaxDuration(opt)}
                    disabled={!editable}
                    className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all ${maxDuration === opt ? segActive : segInactive} ${editable ? "cursor-pointer" : "cursor-default"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Autonomous Actions */}
            <div>
              <div className={sectionLabel}>Autonomous Actions</div>
              <div className="flex flex-wrap gap-1.5">
                {AUTONOMY_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => editable && setAutonomy(level)}
                    disabled={!editable}
                    className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all ${autonomy === level ? segActive : segInactive} ${editable ? "cursor-pointer" : "cursor-default"}`}
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
        </div>

        {/* ── SCHEDULE (recurring only) ── */}
        {isRecurring && (
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <svg className="h-3.5 w-3.5 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 014-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 01-4 4H3" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-t3">Schedule</span>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border border-b1 bg-bg3/30 px-3.5 py-3">
              {/* Frequency */}
              <div>
                <div className={sectionLabel}>Frequency</div>
                <div className="flex flex-wrap gap-1.5">
                  {frequencies.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => editable && setFrequency(f.id)}
                      disabled={!editable}
                      className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all ${frequency === f.id ? segActive : segInactive} ${editable ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekdays display */}
              {frequency === "weekdays" && (
                <div>
                  <div className={sectionLabel}>Days</div>
                  <div className="flex gap-1">
                    {weekdayNames.map((day) => {
                      const isActive = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day);
                      return (
                        <div
                          key={day}
                          className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-medium ${isActive ? "bg-bg3 text-t1" : "text-t4"}`}
                        >
                          {day.charAt(0)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Weekly day selector */}
              {frequency === "weekly" && (
                <div>
                  <div className={sectionLabel}>Day of week</div>
                  <div className="flex gap-1">
                    {weekdayNames.map((day) => {
                      const fullDay = day === "Mon" ? "Monday" : day === "Tue" ? "Tuesday" : day === "Wed" ? "Wednesday" : day === "Thu" ? "Thursday" : day === "Fri" ? "Friday" : day === "Sat" ? "Saturday" : "Sunday";
                      const isActive = weeklyDay === fullDay;
                      return (
                        <button
                          key={day}
                          onClick={() => editable && setWeeklyDay(fullDay)}
                          disabled={!editable}
                          className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-medium transition-all ${isActive ? "bg-ab text-abt" : "bg-bg3 text-t3 hover:text-t2"} ${editable ? "cursor-pointer" : "cursor-default"}`}
                        >
                          {day.charAt(0)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Monthly day grid */}
              {frequency === "monthly" && (
                <div>
                  <div className={sectionLabel}>Day of month</div>
                  <div className="grid grid-cols-7 gap-1">
                    {monthDayOptions.map((d) => (
                      <button
                        key={d}
                        onClick={() => editable && setMonthDay(d)}
                        disabled={!editable}
                        className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-medium transition-all ${monthDay === d ? "bg-ab text-abt" : "bg-bg3 text-t3 hover:text-t2"} ${editable ? "cursor-pointer" : "cursor-default"}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom day picker */}
              {frequency === "custom" && (
                <div>
                  <div className={sectionLabel}>Select days</div>
                  <div className="flex gap-1">
                    {weekdayNames.map((day) => {
                      const isActive = customDays.includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() => editable && toggleCustomDay(day)}
                          disabled={!editable}
                          className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-medium transition-all ${isActive ? "bg-ab text-abt" : "bg-bg3 text-t3 hover:text-t2"} ${editable ? "cursor-pointer" : "cursor-default"}`}
                        >
                          {day.charAt(0)}
                        </button>
                      );
                    })}
                  </div>
                  {customDays.length > 0 && (
                    <div className="mt-1 text-[10.5px] text-t3">{customDays.join(", ")}</div>
                  )}
                </div>
              )}

              {/* Time */}
              <div>
                <div className={sectionLabel}>Time</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-md border border-b1 bg-bg3">
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => editable && setTime(e.target.value)}
                      readOnly={!editable}
                      className="w-[80px] bg-transparent px-2.5 py-1.5 text-[12px] text-t1 outline-none"
                    />
                    <div className="border-l border-b1 px-2 py-1.5">
                      <svg className="h-3 w-3 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[11px] text-t3">local time</span>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-md bg-bg3 px-3 py-2.5">
                <div className="flex items-center gap-2 text-[12px] text-t2">
                  <svg className="h-3 w-3 shrink-0 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 014-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 01-4 4H3" />
                  </svg>
                  {schedulePreview(frequency, time, customDays, weeklyDay, monthDay)}
                </div>
                {task.detail?.nextRun && (
                  <div className="mt-1 pl-[20px] text-[11px] text-t3">
                    Next run: {task.detail.nextRun}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {editable && (
        <div className="flex shrink-0 items-center justify-start gap-2 border-t border-b1 px-4 py-3">
          <button
            onClick={() => { onSave?.(); onBack(); }}
            className="rounded-md bg-ab px-3 py-1.5 text-[12px] font-medium text-abt transition-all hover:brightness-110"
          >
            Save
          </button>
          <button
            onClick={onBack}
            className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
