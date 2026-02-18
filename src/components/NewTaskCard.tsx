"use client";

import { useState, useRef, useEffect } from "react";

export interface NewTaskData {
  name: string;
  instructions: string;
  frequency: string;
  time: string;
  maxDuration: string;
  integrations: string[];
  skills: string[];
}

interface NewTaskCardProps {
  onClose: () => void;
  onCreate: (task: NewTaskData) => void;
}

const frequencyOptions = ["Daily", "Weekdays", "Weekly", "Monthly"];
const durationOptions = ["5 min", "15 min", "30 min", "1 hour", "No limit"];
const defaultIntegrations = [
  "Gmail",
  "Calendar",
  "Google Docs",
  "Sheets",
  "LinkedIn",
  "Salesforce",
  "Crunchbase",
  "Granola",
  "Slack",
  "Notion",
];
const defaultSkills = [
  "Research",
  "Writing",
  "Data Analysis",
  "Scheduling",
  "Code",
  "Image Analysis",
];

/** Reusable close (×) icon for pills */
function CloseIcon() {
  return (
    <svg
      className="h-2.5 w-2.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/** Reusable plus icon for add buttons */
function PlusIcon() {
  return (
    <svg
      className="h-2.5 w-2.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function NewTaskCard({ onClose, onCreate }: NewTaskCardProps) {
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [time, setTime] = useState("7:00 AM");
  const [maxDuration, setMaxDuration] = useState("30 min");

  // Integrations
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [integrationDropdownOpen, setIntegrationDropdownOpen] = useState(false);
  const [addingNewIntegration, setAddingNewIntegration] = useState(false);
  const [newIntegrationValue, setNewIntegrationValue] = useState("");
  const integrationDropdownRef = useRef<HTMLDivElement>(null);

  // Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [addingNewSkill, setAddingNewSkill] = useState(false);
  const [newSkillValue, setNewSkillValue] = useState("");
  const skillsDropdownRef = useRef<HTMLDivElement>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const newIntegrationInputRef = useRef<HTMLInputElement>(null);
  const newSkillInputRef = useRef<HTMLInputElement>(null);

  // Focus name input on mount
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (integrationDropdownRef.current && !integrationDropdownRef.current.contains(e.target as Node)) {
        setIntegrationDropdownOpen(false);
        setAddingNewIntegration(false);
        setNewIntegrationValue("");
      }
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(e.target as Node)) {
        setSkillsDropdownOpen(false);
        setAddingNewSkill(false);
        setNewSkillValue("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus new input when entering "adding new" mode
  useEffect(() => {
    if (addingNewIntegration) newIntegrationInputRef.current?.focus();
  }, [addingNewIntegration]);
  useEffect(() => {
    if (addingNewSkill) newSkillInputRef.current?.focus();
  }, [addingNewSkill]);

  // Integration helpers
  const availableIntegrations = defaultIntegrations.filter(
    (i) => !selectedIntegrations.includes(i)
  );
  const addIntegration = (val: string) => {
    if (val.trim() && !selectedIntegrations.includes(val.trim())) {
      setSelectedIntegrations((prev) => [...prev, val.trim()]);
    }
    setIntegrationDropdownOpen(false);
    setAddingNewIntegration(false);
    setNewIntegrationValue("");
  };
  const removeIntegration = (val: string) => {
    setSelectedIntegrations((prev) => prev.filter((i) => i !== val));
  };

  // Skills helpers
  const availableSkills = defaultSkills.filter(
    (s) => !selectedSkills.includes(s)
  );
  const addSkill = (val: string) => {
    if (val.trim() && !selectedSkills.includes(val.trim())) {
      setSelectedSkills((prev) => [...prev, val.trim()]);
    }
    setSkillsDropdownOpen(false);
    setAddingNewSkill(false);
    setNewSkillValue("");
  };
  const removeSkill = (val: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== val));
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      instructions: instructions.trim(),
      frequency,
      time,
      maxDuration,
      integrations: selectedIntegrations,
      skills: selectedSkills,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !integrationDropdownOpen && !skillsDropdownOpen) {
      onClose();
    }
  };

  return (
    <div
      className="mb-3 overflow-hidden rounded-lg border border-b1 bg-bg2 shadow-lg"
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-bg3 text-t2">
            <svg
              className="h-3.5 w-3.5"
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
          </div>
          <span className="text-[13px] font-semibold text-t1">
            New recurring task
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md text-t3 transition-all hover:bg-bg3 hover:text-t1"
        >
          <svg
            className="h-3.5 w-3.5"
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
      <div className="px-4 pb-4">
        {/* Task name */}
        <div className="mb-4">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
            Task name
          </div>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Daily deal sourcing digest"
            className="w-full rounded-md border border-b1 bg-bg3 px-3 py-2 text-[13px] text-t1 placeholder:text-t4 outline-none transition-colors focus:border-b2"
          />
        </div>

        {/* Instructions */}
        <div className="mb-4">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
            Instructions
          </div>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Scan Crunchbase for Series A rounds in healthcare AI. Cross-reference with existing portfolio. Flag overlaps."
            rows={3}
            className="w-full resize-y rounded-md border border-b1 bg-bg3 px-3 py-2 text-[13px] leading-[1.5] text-t1 placeholder:text-t4 outline-none transition-colors focus:border-b2"
          />
        </div>

        {/* Schedule row */}
        <div className="mb-4 flex gap-3">
          <div className="flex-1">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
              Schedule
            </div>
            <div className="flex gap-2">
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="rounded-md border border-b1 bg-bg3 px-3 py-2 text-[13px] text-t1 outline-none"
              >
                {frequencyOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-[88px] rounded-md border border-b1 bg-bg3 px-3 py-2 text-[13px] text-t1 outline-none transition-colors focus:border-b2"
              />
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
              Max duration
            </div>
            <select
              value={maxDuration}
              onChange={(e) => setMaxDuration(e.target.value)}
              className="rounded-md border border-b1 bg-bg3 px-3 py-2 text-[13px] text-t1 outline-none"
            >
              {durationOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Integrations */}
        <div className="mb-4">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
            Integrations
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {selectedIntegrations.map((integ) => (
              <span
                key={integ}
                className="flex items-center gap-1 rounded-full bg-bg3 px-2.5 py-1 text-[11px] font-medium text-t2"
              >
                {integ}
                <button
                  onClick={() => removeIntegration(integ)}
                  className="ml-0.5 text-t4 transition-colors hover:text-t1"
                >
                  <CloseIcon />
                </button>
              </span>
            ))}

            {/* Add button with dropdown */}
            <div className="relative" ref={integrationDropdownRef}>
              <button
                onClick={() => {
                  setIntegrationDropdownOpen((o) => !o);
                  setAddingNewIntegration(false);
                  setNewIntegrationValue("");
                }}
                className="flex items-center gap-1 rounded-full border border-dashed border-b2 px-2.5 py-1 text-[11px] font-medium text-t3 transition-all hover:bg-bg3 hover:text-t2"
              >
                <PlusIcon />
                Add
              </button>

              {integrationDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-1 w-[180px] rounded-md border border-b1 bg-bg2 py-1 shadow-lg z-10">
                  {!addingNewIntegration ? (
                    <>
                      {availableIntegrations.map((integ) => (
                        <button
                          key={integ}
                          onClick={() => addIntegration(integ)}
                          className="flex w-full items-center px-3 py-1.5 text-left text-[12px] text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                        >
                          {integ}
                        </button>
                      ))}
                      <div className="border-t border-b1 mt-1 pt-1">
                        <button
                          onClick={() => setAddingNewIntegration(true)}
                          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-left text-[12px] text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                        >
                          <PlusIcon />
                          New integration...
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-2 py-1.5">
                      <input
                        ref={newIntegrationInputRef}
                        type="text"
                        value={newIntegrationValue}
                        onChange={(e) => setNewIntegrationValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newIntegrationValue.trim()) {
                            e.preventDefault();
                            addIntegration(newIntegrationValue);
                          } else if (e.key === "Escape") {
                            e.stopPropagation();
                            setAddingNewIntegration(false);
                            setNewIntegrationValue("");
                          }
                        }}
                        placeholder="Integration name"
                        className="w-full rounded-md border border-b1 bg-bg3 px-2.5 py-1.5 text-[12px] text-t1 placeholder:text-t4 outline-none focus:border-b2"
                      />
                      <div className="mt-1 text-[10px] text-t4">Enter to add · Esc to cancel</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
            Skills
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1 rounded-full border border-b1 px-2.5 py-1 text-[11px] font-medium text-t3"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-0.5 text-t4 transition-colors hover:text-t1"
                >
                  <CloseIcon />
                </button>
              </span>
            ))}

            {/* Add button with dropdown */}
            <div className="relative" ref={skillsDropdownRef}>
              <button
                onClick={() => {
                  setSkillsDropdownOpen((o) => !o);
                  setAddingNewSkill(false);
                  setNewSkillValue("");
                }}
                className="flex items-center gap-1 rounded-full border border-dashed border-b2 px-2.5 py-1 text-[11px] font-medium text-t3 transition-all hover:bg-bg3 hover:text-t2"
              >
                <PlusIcon />
                Add
              </button>

              {skillsDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-1 w-[180px] rounded-md border border-b1 bg-bg2 py-1 shadow-lg z-10">
                  {!addingNewSkill ? (
                    <>
                      {availableSkills.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => addSkill(skill)}
                          className="flex w-full items-center px-3 py-1.5 text-left text-[12px] text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                        >
                          {skill}
                        </button>
                      ))}
                      <div className="border-t border-b1 mt-1 pt-1">
                        <button
                          onClick={() => setAddingNewSkill(true)}
                          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-left text-[12px] text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                        >
                          <PlusIcon />
                          New skill...
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-2 py-1.5">
                      <input
                        ref={newSkillInputRef}
                        type="text"
                        value={newSkillValue}
                        onChange={(e) => setNewSkillValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newSkillValue.trim()) {
                            e.preventDefault();
                            addSkill(newSkillValue);
                          } else if (e.key === "Escape") {
                            e.stopPropagation();
                            setAddingNewSkill(false);
                            setNewSkillValue("");
                          }
                        }}
                        placeholder="Skill name"
                        className="w-full rounded-md border border-b1 bg-bg3 px-2.5 py-1.5 text-[12px] text-t1 placeholder:text-t4 outline-none focus:border-b2"
                      />
                      <div className="mt-1 text-[10px] text-t4">Enter to add · Esc to cancel</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-4 rounded-md bg-bg3 px-3.5 py-2.5">
          <div className="flex items-center gap-2 text-[12px] text-t3">
            <svg
              className="h-3 w-3 shrink-0 text-t4"
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
            {frequency === "Weekdays"
              ? `Runs Mon–Fri at ${time}`
              : frequency === "Weekly"
                ? `Runs every week at ${time}`
                : frequency === "Monthly"
                  ? `Runs monthly at ${time}`
                  : `Runs every day at ${time}`}
            {maxDuration !== "No limit" && (
              <span className="text-t4">· max {maxDuration}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-b1 bg-transparent px-4 py-2 text-[13px] font-medium text-t2 transition-all hover:bg-bg3 hover:text-t1"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className={`rounded-md px-4 py-2 text-[13px] font-medium transition-all ${
              name.trim()
                ? "bg-ab text-abt hover:brightness-110"
                : "bg-bg3 text-t4 cursor-default"
            }`}
          >
            Create task
          </button>
        </div>
      </div>
    </div>
  );
}
