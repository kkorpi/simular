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
  {
    command: "teach",
    label: "Teach",
    description: "Show your coworker how to do a task",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
  },
];

export function TaskInput({ onSlashCommand, onSend, prefillText }: { onSlashCommand?: (command: string) => void; onSend?: (text: string) => void; prefillText?: string }) {
  const [value, setValue] = useState("");
  const [model, setModel] = useState("Claude 4.6 Opus");
  const [modelOpen, setModelOpen] = useState(false);
  const [slashOpen, setSlashOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [attachOpen, setAttachOpen] = useState(false);
  const [driveOpen, setDriveOpen] = useState(false);
  const [driveSearch, setDriveSearch] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLButtonElement>(null);
  const attachRef = useRef<HTMLDivElement>(null);
  const attachBtnRef = useRef<HTMLButtonElement>(null);
  const driveSearchRef = useRef<HTMLInputElement>(null);

  const showMenu = slashOpen || menuOpen;

  // Auto-fill text from parent (e.g. autoplay prefill)
  useEffect(() => {
    if (prefillText !== undefined) setValue(prefillText);
  }, [prefillText]);

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

  // Close menu on outside click (ignore clicks on the Actions button itself)
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (actionsRef.current?.contains(target)) return;
      if (slashRef.current && !slashRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Close attach menu on outside click
  useEffect(() => {
    if (!attachOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (attachBtnRef.current?.contains(target)) return;
      if (attachRef.current && !attachRef.current.contains(target)) {
        setAttachOpen(false);
        setDriveOpen(false);
        setDriveSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [attachOpen]);

  // Auto-focus drive search when drive panel opens
  useEffect(() => {
    if (driveOpen) driveSearchRef.current?.focus();
  }, [driveOpen]);

  const recentDriveFiles = [
    { name: "Q1 2026 Board Deck", type: "slides", modified: "2h ago" },
    { name: "Series B Financial Model", type: "sheets", modified: "5h ago" },
    { name: "Product Roadmap H1", type: "doc", modified: "Yesterday" },
    { name: "Competitive Landscape Analysis", type: "doc", modified: "Yesterday" },
    { name: "LP Update — March 2026", type: "doc", modified: "2 days ago" },
    { name: "Deal Pipeline Tracker", type: "sheets", modified: "2 days ago" },
    { name: "Team Org Chart", type: "slides", modified: "3 days ago" },
    { name: "Due Diligence Checklist — Acme", type: "sheets", modified: "4 days ago" },
  ];

  const driveFileIcon = (type: string) => {
    if (type === "sheets") return (
      <svg className="h-4 w-[12px] shrink-0" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.449 0.229H1.291C0.693 0.229 0.204 0.706 0.204 1.289V14.712C0.204 15.294 0.693 15.771 1.291 15.771H10.709C11.307 15.771 11.796 15.294 11.796 14.712V4.468L7.449 0.229Z" fill="#0F9D58"/>
        <path d="M3.103 7.824V12.946H8.898V7.824H3.103ZM5.638 12.239H3.827V11.356H5.638V12.239ZM5.638 10.826H3.827V9.943H5.638V10.826ZM5.638 9.413H3.827V8.53H5.638V9.413ZM8.174 12.239H6.363V11.356H8.174V12.239ZM8.174 10.826H6.363V9.943H8.174V10.826ZM8.174 9.413H6.363V8.53H8.174V9.413Z" fill="#F1F1F1"/>
        <path d="M7.449 0.229V3.408C7.449 3.994 7.936 4.468 8.536 4.468H11.796L7.449 0.229Z" fill="#87CEAC"/>
      </svg>
    );
    if (type === "slides") return (
      <svg className="h-4 w-[12px] shrink-0" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.396 0H1.109C0.499 0 0 0.484 0 1.076V14.702C0 15.294 0.499 15.778 1.109 15.778H10.724C11.334 15.778 11.833 15.294 11.833 14.702V4.303L7.396 0Z" fill="#F4B400"/>
        <path d="M8.32 7.172H3.513C3.208 7.172 2.958 7.414 2.958 7.71V12.371C2.958 12.667 3.208 12.909 3.513 12.909H8.32C8.625 12.909 8.875 12.667 8.875 12.371V7.71C8.875 7.414 8.625 7.172 8.32 7.172ZM8.135 11.296H3.698V8.786H8.135V11.296Z" fill="#F1F1F1"/>
        <path d="M7.396 0V3.227C7.396 3.822 7.892 4.303 8.505 4.303H11.833L7.396 0Z" fill="#FADA80"/>
      </svg>
    );
    return (
      <svg className="h-4 w-[12px] shrink-0" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 0H1.125C0.506 0 0 0.491 0 1.091V14.909C0 15.509 0.506 16 1.125 16H10.875C11.494 16 12 15.509 12 14.909V4.364L7.5 0Z" fill="#4285F4"/>
        <path d="M3 11.636H9V10.909H3V11.636ZM3 13.091H7.5V12.364H3V13.091ZM3 8V8.727H9V8H3ZM3 10.182H9V9.455H3V10.182Z" fill="#F1F1F1"/>
        <path d="M7.5 0V3.273C7.5 3.875 8.003 4.364 8.625 4.364H12L7.5 0Z" fill="#A1C2FA"/>
      </svg>
    );
  };

  const filteredDriveFiles = driveSearch
    ? recentDriveFiles.filter((f) => f.name.toLowerCase().includes(driveSearch.toLowerCase()))
    : recentDriveFiles;

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
    setMenuOpen(false);
    onSlashCommand?.(command);
  };

  const handleSend = () => {
    if (showMenu) return;
    if (!value.trim()) return;
    onSend?.(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMenu && filteredCommands.length > 0) {
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
        setMenuOpen(false);
        if (slashOpen) setValue("");
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex flex-col rounded-lg border border-b1 bg-bgcard transition-colors focus-within:border-b2">
      {/* Slash command menu */}
      {showMenu && filteredCommands.length > 0 && (
        <div
          ref={slashRef}
          className="absolute bottom-full left-0 right-0 mb-1.5 overflow-hidden rounded-lg border border-b1 bg-bg2 shadow-lg"
        >
          <div className="px-3 pt-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wide text-t4">
            Quick actions
          </div>
          {filteredCommands.map((cmd, i) => (
            <button
              key={cmd.command}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSlashSelect(cmd.command)}
              onMouseEnter={() => setSlashIndex(i)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                i === slashIndex ? "bg-bg3" : ""
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
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
          {slashOpen && (
            <div className="border-t border-b1 px-3 py-1.5 text-[10px] text-t4">
              Type <span className="font-medium text-t3">/</span> for quick actions
            </div>
          )}
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
        {/* Add attachment button + menu */}
        <div className="relative" ref={attachRef}>
          <button
            ref={attachBtnRef}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setAttachOpen((o) => {
                if (o) { setDriveOpen(false); setDriveSearch(""); }
                return !o;
              });
            }}
            className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
              attachOpen ? "bg-bg3h text-t2" : "text-t4 hover:bg-bg3h hover:text-t2"
            }`}
            title="Add attachment"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          {/* Attach popover */}
          {attachOpen && (
            <div className="absolute bottom-full left-0 mb-1.5 w-[260px] overflow-visible rounded-lg border border-b1 bg-bg2 py-1.5 shadow-lg">
              {/* Add files */}
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setAttachOpen(false); }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-bg3"
              >
                <svg className="h-[18px] w-[18px] text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
                <span className="text-[13px] font-medium text-t1">Add files or photos</span>
              </button>

              {/* Add from Google Drive — hover flyout */}
              <div
                className="relative"
                onMouseEnter={() => setDriveOpen(true)}
                onMouseLeave={() => { setDriveOpen(false); setDriveSearch(""); }}
              >
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${driveOpen ? "bg-bg3" : "hover:bg-bg3"}`}
                >
                  {/* Google Drive colored icon */}
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.20962 11.9986L1.91523 13.1922C2.06186 13.4435 2.27262 13.6409 2.52005 13.7845L5.04009 9.5127H0C0 9.7909 0.0733104 10.0691 0.219931 10.3204L1.20962 11.9986Z" fill="#0066DA"/>
                    <path d="M8 4.48713L5.47995 0.215332C5.23253 0.358922 5.02176 0.556358 4.87514 0.80764L0.219931 8.70508C0.076007 8.95094 0.000191627 9.22937 0 9.51277H5.04009L8 4.48713Z" fill="#00AC47"/>
                    <path d="M13.4804 13.7845C13.7278 13.6409 13.9386 13.4435 14.0852 13.1922L14.3784 12.6986L15.7805 10.3204C15.9271 10.0691 16.0004 9.7909 16.0004 9.5127H10.96L12.0325 11.5768L13.4804 13.7845Z" fill="#EA4335"/>
                    <path d="M7.99954 4.48718L10.5196 0.215385C10.2722 0.0717949 9.98808 0 9.69484 0H6.30423C6.01099 0 5.72691 0.0807692 5.47949 0.215385L7.99954 4.48718Z" fill="#00832D"/>
                    <path d="M10.9604 9.5127H5.04055L2.52051 13.7845C2.76793 13.9281 3.05201 13.9999 3.34525 13.9999H12.6557C12.9489 13.9999 13.233 13.9191 13.4804 13.7845L10.9604 9.5127Z" fill="#2684FC"/>
                    <path d="M13.4525 4.75636L11.1249 0.80764C10.9782 0.556358 10.7675 0.358922 10.52 0.215332L8 4.48713L10.9599 9.51277H15.9908C15.9908 9.23456 15.9175 8.95636 15.7709 8.70508L13.4525 4.75636Z" fill="#FFBA00"/>
                  </svg>
                  <span className="flex-1 text-[13px] font-medium text-t1">Add from Google Drive</span>
                  <svg className="h-3.5 w-3.5 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {/* Drive flyout sub-panel */}
                {driveOpen && (
                  <div className="absolute bottom-0 left-full ml-1 w-[300px] overflow-hidden rounded-lg border border-b1 bg-bg2 shadow-lg">
                    {/* Search input */}
                    <div className="border-b border-b1 px-3 py-2.5">
                      <div className="flex items-center gap-2 rounded-md bg-bg3 px-2.5 py-1.5">
                        <svg className="h-3.5 w-3.5 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                          ref={driveSearchRef}
                          type="text"
                          value={driveSearch}
                          onChange={(e) => setDriveSearch(e.target.value)}
                          onMouseDown={(e) => e.stopPropagation()}
                          placeholder="Search documents…"
                          className="w-full bg-transparent text-[12px] text-t1 placeholder:text-t4 outline-none"
                        />
                      </div>
                    </div>

                    {/* Recent / results */}
                    <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-t4">
                      {driveSearch ? "Results" : "Recent"}
                    </div>
                    <div className="max-h-[280px] overflow-y-auto pb-1.5">
                      {filteredDriveFiles.length === 0 ? (
                        <div className="px-3 py-4 text-center text-[12px] text-t4">
                          No files found
                        </div>
                      ) : (
                        filteredDriveFiles.map((file, i) => (
                          <button
                            key={i}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { setAttachOpen(false); setDriveOpen(false); setDriveSearch(""); }}
                            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left transition-colors hover:bg-bg3"
                          >
                            {driveFileIcon(file.type)}
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[12px] text-t1">{file.name}</div>
                            </div>
                            <span className="shrink-0 text-[10px] text-t4">{file.modified}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick actions trigger */}
        <button
          ref={actionsRef}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setMenuOpen((o) => !o);
            setSlashIndex(0);
            setSlashFilter("");
          }}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-t4 transition-colors hover:bg-bg3h hover:text-t2"
          title="Quick actions"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          Actions
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
            <div className="absolute bottom-full left-0 mb-1 w-[180px] rounded-md border border-b1 bg-bg2 py-1 shadow-lg">
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
          onClick={handleSend}
          className={`flex items-center justify-center rounded-full p-1.5 transition-all ${
            value.trim() && !showMenu
              ? "bg-ab text-abt hover:brightness-110"
              : "text-t4 cursor-default"
          }`}
          disabled={!value.trim() || showMenu}
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
