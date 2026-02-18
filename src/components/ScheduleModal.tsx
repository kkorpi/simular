"use client";

import { useState } from "react";

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  taskName: string;
  currentSchedule?: string;
  nextRun?: string;
}

type Frequency = "daily" | "weekdays" | "weekly" | "monthly" | "custom";

const frequencies: { id: Frequency; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekdays", label: "Weekdays" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "custom", label: "Custom" },
];

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const monthDayOptions = Array.from({ length: 28 }, (_, i) => i + 1);

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function previewText(
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

/** Lucide-style repeat/refresh icon */
function RepeatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "h-4 w-4"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  );
}

export { RepeatIcon };

export function ScheduleModal({
  open,
  onClose,
  taskName,
  currentSchedule,
  nextRun,
}: ScheduleModalProps) {
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [time, setTime] = useState("7:00 AM");
  const [weeklyDay, setWeeklyDay] = useState("Monday");
  const [monthDay, setMonthDay] = useState(1);
  const [customDays, setCustomDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);

  if (!open) return null;

  const toggleCustomDay = (day: string) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 backdrop-blur-[5px]"
      onClick={onClose}
    >
      <div
        className="w-[420px] overflow-hidden rounded-2xl border border-b1 bg-bg shadow-[var(--sc)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-b1 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-bg3 text-t2">
              <RepeatIcon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-t1">
                Edit schedule
              </div>
              <div className="mt-0.5 text-[12px] text-t3">{taskName}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-t3 transition-all hover:bg-bg3 hover:text-t1"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          {/* Frequency pills */}
          <div className="mb-5">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
              Frequency
            </div>
            <div className="flex flex-wrap gap-1.5">
              {frequencies.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFrequency(f.id)}
                  className={`rounded-md border px-3.5 py-2 text-[13px] font-medium transition-all ${
                    frequency === f.id
                      ? "border-b2 bg-bg3 text-t1"
                      : "border-b1 text-t3 hover:border-b2 hover:text-t2"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Weekdays indicator for "weekdays" frequency */}
          {frequency === "weekdays" && (
            <div className="mb-5">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
                Days
              </div>
              <div className="flex gap-1">
                {weekdays.map((day) => {
                  const isActive = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(
                    day
                  );
                  return (
                    <div
                      key={day}
                      className={`flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-medium ${
                        isActive
                          ? "bg-bg3 text-t1"
                          : "text-t4"
                      }`}
                    >
                      {day.charAt(0)}
                    </div>
                  );
                })}
              </div>
              <div className="mt-1.5 text-[11px] text-t3">
                Monday through Friday
              </div>
            </div>
          )}

          {/* Day selector for "weekly" frequency */}
          {frequency === "weekly" && (
            <div className="mb-5">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
                Day of week
              </div>
              <div className="flex gap-1">
                {weekdays.map((day) => {
                  const fullDay =
                    day === "Mon"
                      ? "Monday"
                      : day === "Tue"
                        ? "Tuesday"
                        : day === "Wed"
                          ? "Wednesday"
                          : day === "Thu"
                            ? "Thursday"
                            : day === "Fri"
                              ? "Friday"
                              : day === "Sat"
                                ? "Saturday"
                                : "Sunday";
                  const isActive = weeklyDay === fullDay;
                  return (
                    <button
                      key={day}
                      onClick={() => setWeeklyDay(fullDay)}
                      className={`flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-medium transition-all ${
                        isActive
                          ? "bg-ab text-abt"
                          : "bg-bg3 text-t3 hover:text-t2"
                      }`}
                    >
                      {day.charAt(0)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day of month calendar grid for "monthly" frequency */}
          {frequency === "monthly" && (
            <div className="mb-5">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
                Day of month
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthDayOptions.map((d) => (
                  <button
                    key={d}
                    onClick={() => setMonthDay(d)}
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-[12px] font-medium transition-all ${
                      monthDay === d
                        ? "bg-ab text-abt"
                        : "bg-bg3 text-t3 hover:text-t2"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom day picker */}
          {frequency === "custom" && (
            <div className="mb-5">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
                Select days
              </div>
              <div className="flex gap-1">
                {weekdays.map((day) => {
                  const isActive = customDays.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => toggleCustomDay(day)}
                      className={`flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-medium transition-all ${
                        isActive
                          ? "bg-ab text-abt"
                          : "bg-bg3 text-t3 hover:text-t2"
                      }`}
                    >
                      {day.charAt(0)}
                    </button>
                  );
                })}
              </div>
              {customDays.length > 0 && (
                <div className="mt-1.5 text-[11px] text-t3">
                  {customDays.join(", ")}
                </div>
              )}
            </div>
          )}

          {/* Time */}
          <div className="mb-5">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
              Time
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-md border border-b1 bg-bg3">
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-[88px] bg-transparent px-3 py-2 text-[13px] text-t1 outline-none"
                />
                <div className="border-l border-b1 px-2.5 py-2">
                  <svg
                    className="h-3.5 w-3.5 text-t3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              </div>
              <span className="text-[12px] text-t3">your local time</span>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-md bg-bg3 px-3.5 py-3">
            <div className="flex items-center gap-2 text-[13px] text-t2">
              <RepeatIcon className="h-3.5 w-3.5 shrink-0 text-t3" />
              {previewText(frequency, time, customDays, weeklyDay, monthDay)}
            </div>
            {nextRun && (
              <div className="mt-1.5 pl-[22px] text-[12px] text-t3">
                Next run: {nextRun}
              </div>
            )}
            {currentSchedule && !nextRun && (
              <div className="mt-1.5 pl-[22px] text-[12px] text-t3">
                Current: {currentSchedule}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-b1 px-5 py-3.5">
          <button
            onClick={onClose}
            className="text-[12px] font-medium text-red-400 transition-all hover:text-red-300"
          >
            Turn off schedule
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-md border border-b1 bg-transparent px-4 py-2 text-[13px] font-medium text-t2 transition-all hover:bg-bg3 hover:text-t1"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="rounded-md bg-ab px-4 py-2 text-[13px] font-medium text-abt transition-all hover:brightness-110"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
