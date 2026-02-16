"use client";

import { useState, useRef, useEffect } from "react";

interface SlashCommand {
  command: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const slashCommands: SlashCommand[] = [
  {
    command: "skills",
    label: "Skills",
    description: "View and manage agent capabilities",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    command: "integrations",
    label: "Integrations",
    description: "Connected apps and services",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 16v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34" />
        <path d="M3 15a4 4 0 004 4h1" />
        <polyline points="14 9 20 9 20 15" />
        <line x1="20" y1="9" x2="13" y2="16" />
      </svg>
    ),
  },
  {
    command: "schedule",
    label: "Schedule",
    description: "Set up a recurring task",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    command: "settings",
    label: "Settings",
    description: "Open workspace settings",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    command: "history",
    label: "History",
    description: "View completed tasks and results",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 4v6h6" />
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
        <polyline points="12 7 12 12 16 14" />
      </svg>
    ),
  },
];

export function TaskInput({ onSlashCommand }: { onSlashCommand?: (command: string) => void }) {
  const [value, setValue] = useState("");
  const [model, setModel] = useState("Claude 4.6 Opus");
  const [modelOpen, setModelOpen] = useState(false);
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);

  const models = ["Claude 4.6 Opus", "Claude 4.5 Sonnet", "GPT-4o", "Gemini 2.5 Pro"];

  // Filtered slash commands
  const filteredCommands = slashCommands.filter((cmd) =>
    cmd.command.startsWith(slashFilter.toLowerCase()) || cmd.label.toLowerCase().startsWith(slashFilter.toLowerCase())
  );

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }, [value]);

  // Close model dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setModelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Detect slash command input
  useEffect(() => {
    if (value.startsWith("/")) {
      const query = value.slice(1);
      setSlashFilter(query);
      setSlashOpen(true);
      setSlashIndex(0);
    } else {
      setSlashOpen(false);
      setSlashFilter("");
    }
  }, [value]);

  const handleSlashSelect = (command: string) => {
    setValue("");
    setSlashOpen(false);
    onSlashCommand?.(command);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (slashOpen && filteredCommands.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        handleSlashSelect(filteredCommands[slashIndex].command);
      } else if (e.key === "Escape") {
        setSlashOpen(false);
        setValue("");
      }
    }
  };

  return (
    <div className="relative flex flex-col rounded-xl border border-b1 bg-bg3 transition-colors focus-within:border-b2">
      {/* Slash command menu */}
      {slashOpen && filteredCommands.length > 0 && (
        <div
          ref={slashRef}
          className="absolute bottom-full left-0 right-0 mb-1.5 overflow-hidden rounded-xl border border-b1 bg-bg2 shadow-lg"
        >
          <div className="px-3 pt-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wide text-t4">
            Commands
          </div>
          {filteredCommands.map((cmd, i) => (
            <button
              key={cmd.command}
              onClick={() => handleSlashSelect(cmd.command)}
              onMouseEnter={() => setSlashIndex(i)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                i === slashIndex ? "bg-bg3" : ""
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                i === slashIndex ? "bg-bg3h text-t1" : "bg-bg3 text-t3"
              }`}>
                {cmd.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-t1">
                  /{cmd.command}
                </div>
                <div className="text-[11px] text-t3">{cmd.description}</div>
              </div>
              {i === slashIndex && (
                <div className="shrink-0 rounded bg-bg3h px-1.5 py-0.5 text-[10px] text-t4">
                  Enter
                </div>
              )}
            </button>
          ))}
          <div className="border-t border-b1 px-3 py-1.5 text-[10px] text-t4">
            Type <span className="font-medium text-t3">/</span> to see commands
          </div>
        </div>
      )}

      {/* Text input */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe a task..."
        rows={1}
        className="resize-none overflow-hidden bg-transparent px-4 pt-3 pb-1.5 text-[13px] leading-[1.5] text-t1 placeholder:text-t4 outline-none"
      />

      {/* Bottom toolbar */}
      <div className="flex items-center gap-1 px-3 pb-2.5">
        {/* Add attachment button */}
        <button
          className="flex items-center justify-center rounded-md p-1.5 text-t4 transition-colors hover:bg-bg3h hover:text-t2"
          title="Add attachment"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Slash command hint */}
        <button
          onClick={() => {
            setValue("/");
            textareaRef.current?.focus();
          }}
          className="flex items-center justify-center rounded-md px-1.5 py-1 text-[11px] font-mono text-t4 transition-colors hover:bg-bg3h hover:text-t2"
          title="Slash commands"
        >
          /
        </button>

        {/* Model selector */}
        <div className="relative" ref={modelRef}>
          <button
            onClick={() => setModelOpen((o) => !o)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-t3 transition-colors hover:bg-bg3h hover:text-t2"
          >
            {model}
            <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown */}
          {modelOpen && (
            <div className="absolute bottom-full left-0 mb-1 w-[180px] rounded-lg border border-b1 bg-bg2 py-1 shadow-lg">
              {models.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setModel(m);
                    setModelOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] transition-colors hover:bg-bg3 ${
                    m === model ? "text-t1" : "text-t3"
                  }`}
                >
                  {m === model && (
                    <svg className="h-3 w-3 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {m !== model && <span className="w-3" />}
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Send button */}
        <button
          className={`flex items-center justify-center rounded-full p-1.5 transition-all ${
            value.trim() && !slashOpen
              ? "bg-ab text-abt hover:brightness-110"
              : "text-t4 cursor-default"
          }`}
          disabled={!value.trim() || slashOpen}
          title="Send"
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
