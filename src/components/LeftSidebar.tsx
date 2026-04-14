"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, PanelLeftClose, PanelLeft, Ellipsis, Trash2, Pencil, Settings, Layers, FileText, Upload, Monitor, ChevronDown, Laptop, Search, MessageCircle } from "lucide-react";
import { SimularLogo } from "./SimularLogo";
import type { Conversation, Workspace } from "@/data/mockData";

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    timeoutRef.current = setTimeout(() => setShow(true), 400);
  };
  const handleLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {children}
      <div
        className={`pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#1a1a1e] px-2.5 py-1.5 text-[12px] font-medium text-white shadow-lg transition-opacity duration-150 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

/** Mini wireframe previews for workspace cards */
function LinkedInWireframe() {
  return (
    <div className="flex h-full w-full bg-bg3">
      <div className="w-[16px] shrink-0 border-r border-b1/40 bg-bg2/40 flex flex-col items-center pt-2 gap-1.5">
        <div className="h-[4px] w-[4px] rounded-sm bg-t4/30" />
        <div className="h-[4px] w-[4px] rounded-sm bg-blt/40" />
        <div className="h-[4px] w-[4px] rounded-sm bg-t4/30" />
      </div>
      <div className="flex-1 p-2 flex flex-col gap-1.5">
        <div className="h-[4px] w-[60%] rounded-full bg-t4/20" />
        <div className="h-[4px] w-[80%] rounded-full bg-t4/15" />
        <div className="h-[4px] w-[45%] rounded-full bg-blt/20" />
        <div className="h-[4px] w-[70%] rounded-full bg-t4/15" />
        <div className="h-[4px] w-[55%] rounded-full bg-t4/10" />
      </div>
    </div>
  );
}

function CodeEditorWireframe() {
  return (
    <div className="flex h-full w-full bg-bg3">
      <div className="w-[20px] shrink-0 border-r border-b1/40 bg-bg2/60 flex flex-col items-end pr-1 pt-2 gap-1">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="h-[3px] w-[6px] rounded-full bg-t4/20" />
        ))}
      </div>
      <div className="flex-1 p-2 flex flex-col gap-1">
        <div className="h-[3px] w-[40%] rounded-full bg-purple-400/25" />
        <div className="h-[3px] w-[65%] rounded-full bg-t4/15 ml-2" />
        <div className="h-[3px] w-[50%] rounded-full bg-g/20 ml-2" />
        <div className="h-[3px] w-[70%] rounded-full bg-t4/15 ml-4" />
        <div className="h-[3px] w-[35%] rounded-full bg-am/20 ml-4" />
        <div className="h-[3px] w-[55%] rounded-full bg-t4/15 ml-2" />
      </div>
    </div>
  );
}

function DesktopWireframe() {
  return (
    <div className="flex h-full w-full flex-col bg-bg3">
      <div className="flex-1 p-2 flex flex-col gap-1.5">
        <div className="flex gap-1.5">
          <div className="h-[16px] w-[20px] rounded-sm bg-t4/15 border border-b1/30" />
          <div className="h-[16px] w-[24px] rounded-sm bg-t4/10 border border-b1/30" />
        </div>
        <div className="h-[4px] w-[50%] rounded-full bg-t4/20" />
        <div className="h-[4px] w-[70%] rounded-full bg-t4/15" />
      </div>
      <div className="flex items-center justify-center gap-1 py-1 border-t border-b1/30">
        <div className="h-[4px] w-[4px] rounded-full bg-t4/25" />
        <div className="h-[4px] w-[4px] rounded-full bg-t4/25" />
        <div className="h-[4px] w-[4px] rounded-full bg-blt/30" />
        <div className="h-[4px] w-[4px] rounded-full bg-t4/25" />
      </div>
    </div>
  );
}

function WorkspacePreviewCard({
  ws,
  isSelected,
  isWorking,
  onClick,
}: {
  ws: Workspace;
  isSelected: boolean;
  isWorking: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col overflow-hidden rounded-lg border text-left transition-all hover:border-b2 hover:shadow-md ${
        isSelected ? "border-as/40 ring-1 ring-as/20" : "border-b1"
      }`}
    >
      {/* Mini browser chrome */}
      <div className="flex items-center gap-1 bg-bg2 px-1.5 py-1 border-b border-b1/50">
        <div className="flex gap-0.5">
          <div className="h-[4px] w-[4px] rounded-full bg-t4/30" />
          <div className="h-[4px] w-[4px] rounded-full bg-t4/30" />
          <div className="h-[4px] w-[4px] rounded-full bg-t4/30" />
        </div>
        <div className="flex-1 mx-1 h-[10px] rounded-sm bg-bg3 flex items-center px-1">
          <span className="text-[6px] text-t4 truncate">
            {ws.isDevice ? "desktop" : ws.name === "Dev Environment" ? "github.com" : "linkedin.com"}
          </span>
        </div>
        <div className={`flex items-center gap-0.5 rounded-full px-1 py-px text-[5px] font-semibold ${ws.status === "active" ? "text-g" : "text-t4"}`}>
          {isWorking && isSelected ? (
            <div className="h-[5px] w-[5px] rounded-full border border-g/30 border-t-g animate-spin" />
          ) : (
            <div className={`h-[3px] w-[3px] rounded-full ${ws.status === "active" ? "bg-g" : "bg-t4"}`} />
          )}
          {ws.status === "active" ? "LIVE" : "OFF"}
        </div>
      </div>
      {/* Wireframe content */}
      <div className="aspect-[16/10]">
        {ws.isDevice ? <DesktopWireframe /> : ws.name === "Dev Environment" ? <CodeEditorWireframe /> : <LinkedInWireframe />}
      </div>
      {/* Footer */}
      <div className="flex items-center gap-1.5 border-t border-b1/50 bg-bg2 px-2 py-1.5">
        {ws.isDevice ? <Laptop className="h-3 w-3 shrink-0 text-t3" /> : <Monitor className="h-3 w-3 shrink-0 text-t3" />}
        {isWorking ? (
          <div className="h-[8px] w-[8px] shrink-0 rounded-full border-[1.5px] border-g/30 border-t-g animate-spin" />
        ) : (
          <div className={`h-[5px] w-[5px] shrink-0 rounded-full ${ws.status === "active" ? "bg-g" : ws.status === "setup" ? "bg-am" : "bg-t4"}`} />
        )}
        <span className={`flex-1 truncate text-[10px] ${isSelected ? "text-t1 font-medium" : "text-t2"}`}>{ws.name}</span>
        {isSelected && (
          <svg className="h-3 w-3 shrink-0 text-as" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        )}
      </div>
    </button>
  );
}

function ConversationMenu({
  open,
  onClose,
  onDelete,
  onRename,
}: {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  onRename: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("pointerdown", handle);
    return () => document.removeEventListener("pointerdown", handle);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-1 w-[160px] overflow-hidden rounded-lg border border-b1 bg-bg2 shadow-[var(--sc)]"
    >
      <div className="p-1">
        <button
          onClick={(e) => { e.stopPropagation(); onRename(); onClose(); }}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-t2 transition-colors hover:bg-bg3 hover:text-t1"
        >
          <Pencil className="h-3.5 w-3.5 text-t3" />
          Rename
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); onClose(); }}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-red-400 transition-colors hover:bg-bg3"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

export function LeftSidebar({
  conversations,
  selectedId,
  collapsed,
  onSelect,
  onNewConversation,
  onToggleCollapse,
  onDeleteConversation,
  onRenameConversation,
  onGoHome,
  onOpenSettings,
  onOpenCredits,
  onOpenDemoPicker,
  onOpenCommandPalette,
  onOpenArtifacts,
  onOpenUploads,
  activeView = "chat",
  isWorkspaceWorking = false,
  trialDaysLeft = 6,
  mobileOpen = false,
  onCloseMobile,
  workspaces = [],
  selectedWorkspaceId,
  onSelectWorkspace,
}: {
  conversations: Conversation[];
  selectedId: string;
  collapsed: boolean;
  onSelect: (id: string) => void;
  onNewConversation: () => void;
  onToggleCollapse: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation?: (id: string, newTitle: string) => void;
  onGoHome: () => void;
  onOpenSettings?: () => void;
  onOpenCredits?: () => void;
  onOpenDemoPicker?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenArtifacts?: () => void;
  onOpenUploads?: () => void;
  activeView?: "chat" | "artifacts" | "uploads";
  isWorkspaceWorking?: boolean;
  trialDaysLeft?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  workspaces?: Workspace[];
  selectedWorkspaceId?: string;
  onSelectWorkspace?: (id: string) => void;
}) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);
  const [wsMenuOpenId, setWsMenuOpenId] = useState<string | null>(null);
  const [convFlyoutOpen, setConvFlyoutOpen] = useState(false);
  const convFlyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!convFlyoutOpen) return;
    const handle = (e: PointerEvent) => {
      if (convFlyoutRef.current && !convFlyoutRef.current.contains(e.target as Node)) setConvFlyoutOpen(false);
    };
    document.addEventListener("pointerdown", handle);
    return () => document.removeEventListener("pointerdown", handle);
  }, [convFlyoutOpen]);
  const wsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wsDropdownOpen) return;
    const handle = (e: PointerEvent) => {
      if (wsDropdownRef.current && !wsDropdownRef.current.contains(e.target as Node)) setWsDropdownOpen(false);
    };
    document.addEventListener("pointerdown", handle);
    return () => document.removeEventListener("pointerdown", handle);
  }, [wsDropdownOpen]);

  const selectedWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId) ?? workspaces[0];

  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!avatarMenuOpen) return;
    const handle = (e: PointerEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) setAvatarMenuOpen(false);
    };
    document.addEventListener("pointerdown", handle);
    return () => document.removeEventListener("pointerdown", handle);
  }, [avatarMenuOpen]);

  const handleMobileSelect = (id: string) => {
    onSelect(id);
    onCloseMobile?.();
  };

  const handleMobileNewConversation = () => {
    onNewConversation();
    onCloseMobile?.();
  };

  // Shared sidebar content for mobile drawer (always expanded)
  const sidebarContent = (isMobile: boolean) => (
    <>
      {/* Header */}
      <div className="flex items-center shrink-0 h-[50px] px-3">
        <button onClick={onGoHome} className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <SimularLogo size={24} />
          <span className="text-sm font-semibold text-t1">Sai</span>
        </button>
        {isMobile && (
          <div className="ml-auto">
            <button onClick={onCloseMobile} className="flex h-8 w-8 items-center justify-center rounded-md text-t4 transition-colors hover:bg-bg3h hover:text-t2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {/* Workspace selector */}
      {selectedWorkspace && (
        <div className="shrink-0 px-3 pb-2 border-b border-b1 mb-1" ref={wsDropdownRef}>
          <div className="relative">
            <button
              onClick={() => { setWsDropdownOpen(!wsDropdownOpen); setWsMenuOpenId(null); }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-t3 transition-colors hover:bg-bg3h hover:text-t1"
            >
              {selectedWorkspace.isDevice ? <Laptop className="h-3.5 w-3.5 shrink-0" /> : <Monitor className="h-3.5 w-3.5 shrink-0" />}
              {isWorkspaceWorking ? (
                <div className="h-[10px] w-[10px] shrink-0 rounded-full border-[1.5px] border-g/30 border-t-g animate-spin" />
              ) : (
                <div className={`h-[6px] w-[6px] shrink-0 rounded-full ${selectedWorkspace.status === "active" ? "bg-g" : selectedWorkspace.status === "setup" ? "bg-am" : "bg-t4"}`} />
              )}
              <span className="flex-1 truncate text-left text-[12px]">{selectedWorkspace.name}</span>
              <ChevronDown className="h-3 w-3 shrink-0 text-t4" />
            </button>
            {wsDropdownOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-b1 bg-bg2 shadow-[var(--sc)]">
                <div className="grid grid-cols-2 gap-2 p-2">
                  {workspaces.map((ws) => (
                    <WorkspacePreviewCard
                      key={ws.id}
                      ws={ws}
                      isSelected={ws.id === selectedWorkspaceId}
                      isWorking={isWorkspaceWorking && ws.id === selectedWorkspaceId}
                      onClick={() => { onSelectWorkspace?.(ws.id); setWsDropdownOpen(false); }}
                    />
                  ))}
                </div>
                <div className="border-t border-b1 p-1">
                  <button
                    onClick={() => { setWsDropdownOpen(false); onOpenSettings?.(); }}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[12px] text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Manage workspaces
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* New chat + Search */}
      <div className="shrink-0 px-3 pb-1">
        <button
          onClick={isMobile ? handleMobileNewConversation : onNewConversation}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-t2 transition-colors hover:bg-bg3h hover:text-t1"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-b1"><Plus className="h-3.5 w-3.5" /></span>
          <span className="text-[13px] font-medium">New chat</span>
        </button>
        <button onClick={onOpenCommandPalette} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-t3 transition-colors hover:bg-bg3h hover:text-t1">
          <Search className="h-4 w-4 shrink-0" />
          <span className="text-[13px]">Search</span>
        </button>
      </div>
      {/* Artifacts & Uploads */}
      <div className="shrink-0 px-3 pt-2 pb-2">
        <button onClick={() => { onOpenArtifacts?.(); onCloseMobile?.(); }} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-bg3h hover:text-t1 ${activeView === "artifacts" ? "text-t1 bg-bg3" : "text-t3"}`}>
          <FileText className="h-4 w-4 shrink-0" />
          <span className="text-[13px]">Artifacts</span>
        </button>
        <button onClick={() => { onOpenUploads?.(); onCloseMobile?.(); }} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-bg3h hover:text-t1 ${activeView === "uploads" ? "text-t1 bg-bg3" : "text-t3"}`}>
          <Upload className="h-4 w-4 shrink-0" />
          <span className="text-[13px]">Uploads</span>
        </button>
      </div>
      {/* Conversations */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-1">
        <div className="px-2.5 pt-1.5 pb-1 text-[11px] font-medium uppercase tracking-wider text-t4">Recents</div>
        {conversations.map((conv) => {
          const isActive = conv.id === selectedId;
          const isRenaming = renamingId === conv.id;
          return (
            <div key={conv.id} className="relative">
              {isRenaming ? (
                <div className="relative z-10 flex h-9 items-center rounded-lg bg-bg3 ring-1 ring-inset ring-as/50 px-2.5">
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { onRenameConversation?.(conv.id, renameValue); setRenamingId(null); }
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    onBlur={() => { setTimeout(() => { onRenameConversation?.(conv.id, renameValue); setRenamingId(null); }, 100); }}
                    className="w-full bg-transparent text-[13px] font-medium text-t1 outline-none caret-as"
                  />
                </div>
              ) : (
                <button
                  onClick={() => isMobile ? handleMobileSelect(conv.id) : onSelect(conv.id)}
                  className={`group flex h-9 w-full items-center rounded-lg px-2.5 text-left transition-colors ${isActive ? "bg-bg3" : "hover:bg-bg3h"}`}
                >
                  <span className={`flex-1 truncate text-[13px] ${isActive ? "font-medium text-t1" : "text-t2"}`}>{conv.title}</span>
                  <span
                    onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === `m-${conv.id}` ? null : `m-${conv.id}`); }}
                    className={`shrink-0 ml-1 flex h-6 w-6 items-center justify-center rounded-md text-t4 transition-all ${menuOpenId === `m-${conv.id}` ? "opacity-100 bg-bg3h" : "opacity-0 group-hover:opacity-100 hover:bg-bg3h hover:text-t2"}`}
                  >
                    <Ellipsis className="h-4 w-4" />
                  </span>
                </button>
              )}
              <ConversationMenu
                open={menuOpenId === `m-${conv.id}`}
                onClose={() => setMenuOpenId(null)}
                onDelete={() => onDeleteConversation(conv.id)}
                onRename={() => { setRenamingId(conv.id); setRenameValue(conv.title); }}
              />
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <>
    {/* Mobile drawer */}
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      <div className="absolute inset-0 bg-overlay-light backdrop-blur-[2px]" onClick={onCloseMobile} />
      <div className={`absolute inset-y-0 left-0 flex w-[280px] flex-col bg-bg2 shadow-2xl transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebarContent(true)}
        {/* Footer */}
        <div ref={avatarMenuRef} className="relative shrink-0 border-t border-b1 px-3 py-2.5">
          <button onClick={() => setAvatarMenuOpen(!avatarMenuOpen)} className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-bg3h">
            <img src="/avatar-katie.jpg" alt="Katie" className="h-8 w-8 shrink-0 rounded-full object-cover" />
            <div className="min-w-0 flex-1 text-left">
              <div className="truncate text-[13px] font-medium text-t1">Katie Chen</div>
            </div>
            <span className="shrink-0 rounded-full border border-b1 bg-bg3 px-2 py-0.5 text-[10px] font-mono text-t3">{trialDaysLeft}d left</span>
          </button>
        </div>
      </div>
    </div>

    {/* Desktop sidebar */}
    <div
      className={`relative flex h-full shrink-0 flex-col border-r border-b1 bg-bg2 transition-[width] duration-200 ease-out max-md:hidden ${
        collapsed ? "w-[56px]" : "w-[260px]"
      }`}
    >
      {/* Header: Logo + Sai + collapse toggle */}
      <div className={`flex items-center shrink-0 h-[50px] ${collapsed ? "justify-center px-2" : "px-3"}`}>
        {collapsed ? (
          <Tooltip text="Expand sidebar">
            <button
              onClick={onToggleCollapse}
              className="group flex h-9 w-9 cursor-e-resize items-center justify-center rounded-lg transition-colors hover:bg-bg3h"
            >
              <span className="group-hover:hidden"><SimularLogo size={24} /></span>
              <PanelLeft className="hidden h-4 w-4 text-t2 group-hover:block" />
            </button>
          </Tooltip>
        ) : (
          <>
            <button
              onClick={onGoHome}
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <SimularLogo size={24} />
              <span className="text-sm font-semibold text-t1">Sai</span>
            </button>
            <div className="ml-auto">
              <button
                onClick={onToggleCollapse}
                className="flex h-8 w-8 cursor-w-resize items-center justify-center rounded-md text-t4 transition-colors hover:bg-bg3h hover:text-t2"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Workspace selector (collapsed = icon, expanded = full) */}
      {selectedWorkspace && collapsed && (
        <div className="shrink-0 px-2 pb-2 flex justify-center border-b border-b1 mb-1" ref={wsDropdownRef}>
          <div className="relative">
            <Tooltip text={selectedWorkspace.name}>
              <button
                onClick={() => { setWsDropdownOpen(!wsDropdownOpen); setWsMenuOpenId(null); }}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-t3 transition-colors hover:bg-bg3h hover:text-t1"
              >
                {selectedWorkspace.isDevice ? <Laptop className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                <span className="absolute bottom-1 right-1">
                  {isWorkspaceWorking ? (
                    <span className="block h-[8px] w-[8px] rounded-full border-[1.5px] border-g/30 border-t-g animate-spin" />
                  ) : (
                    <span className={`block h-[6px] w-[6px] rounded-full ${selectedWorkspace.status === "active" ? "bg-g" : selectedWorkspace.status === "setup" ? "bg-am" : "bg-t4"}`} />
                  )}
                </span>
              </button>
            </Tooltip>
            {wsDropdownOpen && (
              <div className="absolute left-full top-0 z-50 ml-2 w-[380px] overflow-hidden rounded-lg border border-b1 bg-bg2 shadow-[var(--sc)]">
                <div className="grid grid-cols-2 gap-2 p-2">
                  {workspaces.map((ws) => (
                    <WorkspacePreviewCard
                      key={ws.id}
                      ws={ws}
                      isSelected={ws.id === selectedWorkspaceId}
                      isWorking={isWorkspaceWorking && ws.id === selectedWorkspaceId}
                      onClick={() => { onSelectWorkspace?.(ws.id); setWsDropdownOpen(false); }}
                    />
                  ))}
                </div>
                <div className="border-t border-b1 p-1">
                  <button
                    onClick={() => { setWsDropdownOpen(false); onOpenSettings?.(); }}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[12px] text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Manage workspaces
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {selectedWorkspace && !collapsed && (
        <div className="shrink-0 px-3 pb-2 border-b border-b1 mb-1" ref={wsDropdownRef}>
          <div className="relative">
            <button
              onClick={() => { setWsDropdownOpen(!wsDropdownOpen); setWsMenuOpenId(null); }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-t3 transition-colors hover:bg-bg3h hover:text-t1"
            >
              {selectedWorkspace.isDevice ? <Laptop className="h-3.5 w-3.5 shrink-0" /> : <Monitor className="h-3.5 w-3.5 shrink-0" />}
              {isWorkspaceWorking ? (
                <div className="h-[10px] w-[10px] shrink-0 rounded-full border-[1.5px] border-g/30 border-t-g animate-spin" />
              ) : (
                <div className={`h-[6px] w-[6px] shrink-0 rounded-full ${selectedWorkspace.status === "active" ? "bg-g" : selectedWorkspace.status === "setup" ? "bg-am" : "bg-t4"}`} />
              )}
              <span className="flex-1 truncate text-left text-[12px]">{selectedWorkspace.name}</span>
              <ChevronDown className="h-3 w-3 shrink-0 text-t4" />
            </button>
            {wsDropdownOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-b1 bg-bg2 shadow-[var(--sc)]">
                <div className="grid grid-cols-2 gap-2 p-2">
                  {workspaces.map((ws) => (
                    <WorkspacePreviewCard
                      key={ws.id}
                      ws={ws}
                      isSelected={ws.id === selectedWorkspaceId}
                      isWorking={isWorkspaceWorking && ws.id === selectedWorkspaceId}
                      onClick={() => { onSelectWorkspace?.(ws.id); setWsDropdownOpen(false); }}
                    />
                  ))}
                </div>
                <div className="border-t border-b1 p-1">
                  <button
                    onClick={() => { setWsDropdownOpen(false); onOpenSettings?.(); }}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[12px] text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Manage workspaces
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New chat + Search */}
      <div className={`shrink-0 px-2 pb-1 ${collapsed ? "flex flex-col items-center" : "px-3"}`}>
        {collapsed ? (
          <>
            <Tooltip text="New chat">
              <button
                onClick={onNewConversation}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-t2 transition-colors hover:bg-bg3h hover:text-t1"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded bg-b1"><Plus className="h-3.5 w-3.5" /></span>
              </button>
            </Tooltip>
            <Tooltip text="Search">
              <button onClick={onOpenCommandPalette} className="flex h-9 w-9 items-center justify-center rounded-lg text-t3 transition-colors hover:bg-bg3h hover:text-t1">
                <Search className="h-4 w-4" />
              </button>
            </Tooltip>
          </>
        ) : (
          <>
            <button
              onClick={onNewConversation}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-t2 transition-colors hover:bg-bg3h hover:text-t1"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-b1"><Plus className="h-3.5 w-3.5" /></span>
              <span className="text-[13px] font-medium">New chat</span>
            </button>
            <button onClick={onOpenCommandPalette} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-t3 transition-colors hover:bg-bg3h hover:text-t1">
              <Search className="h-4 w-4 shrink-0" />
              <span className="text-[13px]">Search</span>
            </button>
          </>
        )}
      </div>

      {/* Artifacts & Uploads */}
      <div className={`shrink-0 px-2 pt-2 pb-2 ${collapsed ? "flex flex-col items-center" : "px-3"}`}>
        {collapsed ? (
          <>
            <Tooltip text="Artifacts">
              <button onClick={onOpenArtifacts} className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-bg3h hover:text-t1 ${activeView === "artifacts" ? "text-t1 bg-bg3" : "text-t3"}`}>
                <FileText className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip text="Uploads">
              <button onClick={onOpenUploads} className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-bg3h hover:text-t1 ${activeView === "uploads" ? "text-t1 bg-bg3" : "text-t3"}`}>
                <Upload className="h-4 w-4" />
              </button>
            </Tooltip>
          </>
        ) : (
          <>
            <button onClick={onOpenArtifacts} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-bg3h hover:text-t1 ${activeView === "artifacts" ? "text-t1 bg-bg3" : "text-t3"}`}>
              <FileText className="h-4 w-4 shrink-0" />
              <span className="text-[13px]">Artifacts</span>
            </button>
            <button onClick={onOpenUploads} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-bg3h hover:text-t1 ${activeView === "uploads" ? "text-t1 bg-bg3" : "text-t3"}`}>
              <Upload className="h-4 w-4 shrink-0" />
              <span className="text-[13px]">Uploads</span>
            </button>
          </>
        )}
      </div>

      {/* Conversations flyout — collapsed only */}
      {collapsed && (
        <div className="shrink-0 px-2 pt-1 flex justify-center" ref={convFlyoutRef}>
          <div className="relative">
            <Tooltip text="Recents">
              <button
                onClick={() => setConvFlyoutOpen(!convFlyoutOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-t3 transition-colors hover:bg-bg3h hover:text-t1"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            </Tooltip>
            {convFlyoutOpen && (
              <div className="absolute left-full top-0 z-50 ml-2 w-[220px] overflow-hidden rounded-lg border border-b1 bg-bg2 shadow-[var(--sc)]">
                <div className="px-3 pt-2.5 pb-1 text-[11px] font-medium uppercase tracking-wider text-t4">Recents</div>
                <div className="p-1 max-h-[300px] overflow-y-auto">
                  {conversations.map((conv) => {
                    const isActive = conv.id === selectedId;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => { onSelect(conv.id); setConvFlyoutOpen(false); }}
                        className={`flex w-full items-center rounded-md px-2.5 py-2 text-left text-[12px] transition-colors hover:bg-bg3 ${isActive ? "text-t1 bg-bg3/50" : "text-t2"}`}
                      >
                        <span className="flex-1 truncate">{conv.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conversation list — hidden when collapsed */}
      {!collapsed && (
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-1">
        <div className="px-2.5 pt-1.5 pb-1 text-[11px] font-medium uppercase tracking-wider text-t4">
          Recents
        </div>
        {conversations.map((conv) => {
          const isActive = conv.id === selectedId;
          const isRenaming = renamingId === conv.id;

          return (
            <div key={conv.id} className="relative">
              {isRenaming ? (
                <div className="relative z-10 flex h-9 items-center rounded-lg bg-bg3 ring-1 ring-inset ring-as/50 px-2.5">
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { onRenameConversation?.(conv.id, renameValue); setRenamingId(null); }
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    onBlur={() => { setTimeout(() => { onRenameConversation?.(conv.id, renameValue); setRenamingId(null); }, 100); }}
                    className="w-full bg-transparent text-[13px] font-medium text-t1 outline-none caret-as"
                  />
                </div>
              ) : (
                <button
                  onClick={() => onSelect(conv.id)}
                  className={`group flex h-9 w-full items-center rounded-lg px-2.5 text-left transition-colors ${
                    isActive ? "bg-bg3" : "hover:bg-bg3h"
                  }`}
                >
                  <span className={`flex-1 truncate text-[13px] ${isActive ? "font-medium text-t1" : "text-t2"}`}>
                    {conv.title}
                  </span>
                  <span
                    onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === conv.id ? null : conv.id); }}
                    className={`shrink-0 ml-1 flex h-6 w-6 items-center justify-center rounded-md text-t4 transition-all ${
                      menuOpenId === conv.id
                        ? "opacity-100 bg-bg3h"
                        : "opacity-0 group-hover:opacity-100 hover:bg-bg3h hover:text-t2"
                    }`}
                  >
                    <Ellipsis className="h-4 w-4" />
                  </span>
                </button>
              )}
              <ConversationMenu
                open={menuOpenId === conv.id}
                onClose={() => setMenuOpenId(null)}
                onDelete={() => onDeleteConversation(conv.id)}
                onRename={() => { setRenamingId(conv.id); setRenameValue(conv.title); }}
              />
            </div>
          );
        })}
      </div>
      )}

      {/* Spacer when collapsed to push footer down */}
      {collapsed && <div className="flex-1" />}

      {/* Footer: avatar + settings */}
      <div ref={avatarMenuRef} className={`relative shrink-0 border-t border-b1 ${collapsed ? "px-2 py-2 flex justify-center" : "px-3 py-2.5"}`}>
        {collapsed ? (
          <button
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            className="cursor-pointer"
          >
            <img
              src="/avatar-katie.jpg"
              alt="Katie"
              className="h-8 w-8 rounded-full object-cover transition-shadow hover:ring-2 hover:ring-b2"
            />
          </button>
        ) : (
          <button
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-bg3h"
          >
            <img
              src="/avatar-katie.jpg"
              alt="Katie"
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1 text-left">
              <div className="truncate text-[13px] font-medium text-t1">Katie Chen</div>
            </div>
            <span className="shrink-0 rounded-full border border-b1 bg-bg3 px-2 py-0.5 text-[10px] font-mono text-t3">
              {trialDaysLeft}d left
            </span>
          </button>
        )}

        {/* Avatar dropdown menu — works in both collapsed and expanded */}
        {avatarMenuOpen && (
          <div className="absolute bottom-full left-4 z-50 mb-1 w-[200px] overflow-hidden rounded-lg border border-b1 bg-bg2 shadow-[var(--sc)]">
            <div className="p-1">
              <button
                onClick={() => { setAvatarMenuOpen(false); onOpenCredits?.(); }}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-t2 transition-colors hover:bg-bg3 hover:text-t1"
              >
                <Layers className="h-4 w-4 text-t3" />
                <span className="flex-1 text-left">Credits</span>
                <span className="text-[11px] text-t3">$8.88</span>
              </button>
              <button
                onClick={() => { setAvatarMenuOpen(false); onOpenSettings?.(); }}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-t2 transition-colors hover:bg-bg3 hover:text-t1"
              >
                <Settings className="h-4 w-4 text-t3" />
                Settings
              </button>
            </div>
            <div className="h-px bg-b1" />
            <div className="p-1">
              <button
                onClick={() => { setAvatarMenuOpen(false); onOpenDemoPicker?.(); }}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-t2 transition-colors hover:bg-bg3 hover:text-t1"
              >
                <svg className="h-4 w-4 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span className="flex-1 text-left">Demo picker</span>
                <span className="rounded border border-b1 bg-bg3 px-1.5 py-0.5 text-[11px] text-t3">⌘⇧D</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
