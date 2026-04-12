"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Plus, MessageCircle, Settings, Search } from "lucide-react";
import type { Conversation } from "@/data/mockData";

interface CommandItem {
  id: string;
  label: string;
  section: string;
  icon: React.ReactNode;
  action: () => void;
}

const settingsSections = [
  { id: "appearance", label: "Appearance" },
  { id: "workspaces", label: "Workspaces" },
  { id: "skills", label: "Skills" },
  { id: "messaging", label: "Messaging" },
  { id: "subscription", label: "Subscription" },
  { id: "credits", label: "Credits" },
  { id: "about", label: "About" },
];

export function CommandPalette({
  open,
  onClose,
  conversations,
  onNewChat,
  onSelectConversation,
  onOpenSettings,
}: {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onOpenSettings: (section?: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset when opening
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Build flat list of all items
  const items = useMemo((): CommandItem[] => {
    const q = query.toLowerCase().trim();
    const result: CommandItem[] = [];

    // Quick actions — always show "New chat"
    result.push({
      id: "new-chat",
      label: "New chat",
      section: "Quick actions",
      icon: <Plus className="h-4 w-4" />,
      action: () => { onNewChat(); onClose(); },
    });

    // Recents — up to 3 conversations, filtered
    const recentConvos = conversations
      .filter((c) => !q || c.title.toLowerCase().includes(q))
      .slice(0, 3);
    for (const conv of recentConvos) {
      result.push({
        id: `conv-${conv.id}`,
        label: conv.title,
        section: "Recents",
        icon: <MessageCircle className="h-4 w-4" />,
        action: () => { onSelectConversation(conv.id); onClose(); },
      });
    }

    // Settings — filtered
    const matchedSettings = settingsSections.filter(
      (s) => !q || s.label.toLowerCase().includes(q)
    );
    for (const s of matchedSettings) {
      result.push({
        id: `settings-${s.id}`,
        label: s.label,
        section: "Settings",
        icon: <Settings className="h-4 w-4" />,
        action: () => { onOpenSettings(s.id); onClose(); },
      });
    }

    return result;
  }, [query, conversations, onNewChat, onSelectConversation, onOpenSettings, onClose]);

  // Clamp selected index
  useEffect(() => {
    if (selectedIndex >= items.length) setSelectedIndex(Math.max(0, items.length - 1));
  }, [items.length, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      items[selectedIndex]?.action();
    } else if (e.key === "Escape") {
      onClose();
    }
  }, [items, selectedIndex, onClose]);

  if (!open) return null;

  // Group items by section for rendering
  const sections: { name: string; items: (CommandItem & { flatIndex: number })[] }[] = [];
  let flatIndex = 0;
  for (const item of items) {
    let section = sections.find((s) => s.name === item.section);
    if (!section) {
      section = { name: item.section, items: [] };
      sections.push(section);
    }
    section.items.push({ ...item, flatIndex });
    flatIndex++;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] bg-overlay backdrop-blur-[5px]"
      onClick={onClose}
    >
      <div
        className="w-[560px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-b1 bg-bg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-b1 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-t3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search or start a chat"
            className="flex-1 bg-transparent text-[14px] text-t1 outline-none placeholder:text-t4"
          />
          <button
            onClick={onClose}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-t4 transition-colors hover:bg-bg3h hover:text-t2"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[360px] overflow-y-auto p-2">
          {sections.map((section) => (
            <div key={section.name}>
              <div className="px-2.5 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-t4">
                {section.name}
              </div>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  data-index={item.flatIndex}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(item.flatIndex)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[13px] transition-colors ${
                    selectedIndex === item.flatIndex
                      ? "bg-bg3 text-t1"
                      : "text-t2 hover:bg-bg3/50"
                  }`}
                >
                  <span className="shrink-0 text-t3">{item.icon}</span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {selectedIndex === item.flatIndex && (
                    <span className="shrink-0 rounded border border-b1 bg-bg3h px-1.5 py-0.5 text-[10px] text-t4">⏎</span>
                  )}
                </button>
              ))}
            </div>
          ))}
          {items.length === 0 && (
            <div className="px-4 py-6 text-center text-[13px] text-t3">
              No results found
            </div>
          )}
        </div>

        {/* Footer — keyboard hints */}
        <div className="flex items-center gap-4 border-t border-b1 px-4 py-2 text-[11px] text-t4">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-b1 bg-bg3 px-1 py-0.5 text-[10px]">↑</kbd>
            <kbd className="rounded border border-b1 bg-bg3 px-1 py-0.5 text-[10px]">↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-b1 bg-bg3 px-1 py-0.5 text-[10px]">⏎</kbd>
            Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-b1 bg-bg3 px-1 py-0.5 text-[10px]">Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
