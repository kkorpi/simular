"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Trash2, Pencil, PanelRightClose, PanelRight, Share, Menu } from "lucide-react";

export interface TaskStatus {
  label: string;
  state: "working" | "ready" | "setup";
}

export function ConversationTitleBar({
  title,
  panelOpen,
  taskStatus,
  onDelete,
  onRename,
  onTogglePanel,
  onOpenSidebar,
}: {
  title: string;
  panelOpen: boolean;
  taskStatus?: TaskStatus;
  onDelete: () => void;
  onRename?: (newTitle: string) => void;
  onTogglePanel: () => void;
  onOpenSidebar?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(title);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handle = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", handle);
    return () => document.removeEventListener("pointerdown", handle);
  }, [menuOpen]);

  useEffect(() => {
    if (renaming) {
      setRenameValue(title);
      setTimeout(() => inputRef.current?.select(), 0);
    }
  }, [renaming]);

  const commitRename = () => {
    if (renameValue.trim() && renameValue.trim() !== title) {
      onRename?.(renameValue.trim());
    }
    setRenaming(false);
  };

  return (
    <div className="relative z-20 flex h-[44px] shrink-0 items-center gap-1 px-3 max-md:px-2">
      {/* Hamburger — mobile only */}
      {onOpenSidebar && (
        <button
          onClick={onOpenSidebar}
          className="hidden max-md:flex h-8 w-8 items-center justify-center rounded-md text-t3 transition-colors hover:bg-bg3h hover:text-t1"
        >
          <Menu className="h-4 w-4" />
        </button>
      )}

      {/* Title + dropdown */}
      <div className="relative min-w-0" ref={menuRef}>
        {renaming ? (
          <div className="flex items-center rounded-md bg-bg3 ring-1 ring-as/50 px-2 py-1">
            <input
              ref={inputRef}
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setRenaming(false);
              }}
              onBlur={() => setTimeout(commitRename, 100)}
              className="bg-transparent text-[13px] font-medium text-t1 outline-none caret-as w-[200px] max-md:w-[140px]"
            />
          </div>
        ) : (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-bg3h"
          >
            <span className="truncate text-[13px] font-medium text-t1 max-w-[40vw] max-md:max-w-[30vw]">{title}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-t3" />
          </button>
        )}
        {menuOpen && !renaming && (
          <div className="absolute left-0 top-full z-50 mt-1 w-[160px] overflow-hidden rounded-lg border border-b1 bg-bg2 shadow-[var(--sc)]">
            <div className="p-1">
              <button
                onClick={() => { setMenuOpen(false); setRenaming(true); }}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-t2 transition-colors hover:bg-bg3 hover:text-t1"
              >
                <Pencil className="h-3.5 w-3.5 text-t3" />
                Rename
              </button>
              <button
                onClick={() => { setMenuOpen(false); onDelete(); }}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-red-400 transition-colors hover:bg-bg3"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Task status indicator — hidden when panel is open (panel shows same info) */}
      {taskStatus && !panelOpen && (
        <div className="flex items-center gap-2 ml-1">
          <div
            className={`h-[7px] w-[7px] shrink-0 rounded-full ${
              taskStatus.state === "working"
                ? "bg-g animate-pulse"
                : taskStatus.state === "setup"
                  ? "bg-am"
                  : "bg-g"
            }`}
          />
          <span className="font-mono text-[11px] text-t3 max-md:hidden">{taskStatus.label}</span>
        </div>
      )}

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={onTogglePanel}
          className={`flex h-8 w-8 items-center justify-center rounded-md text-t4 transition-colors hover:bg-bg3h hover:text-t2 ${
            panelOpen ? "cursor-e-resize" : "cursor-w-resize"
          }`}
        >
          {panelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
        </button>
        <button
          className="flex h-8 items-center gap-1.5 rounded-md border border-b1 px-2.5 text-[12px] font-medium text-t3 transition-colors hover:bg-bg3h hover:text-t1 max-md:px-2"
        >
          <Share className="h-3.5 w-3.5" />
          <span className="max-md:hidden">Share</span>
        </button>
      </div>
    </div>
  );
}
