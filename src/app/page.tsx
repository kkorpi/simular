"use client";

import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { ChatArea } from "@/components/ChatArea";
import { RightPanel } from "@/components/RightPanel";
import { FullWorkspaceView } from "@/components/FullWorkspaceView";
import { ZeroState } from "@/components/ZeroState";
import { SettingsOverlay } from "@/components/SettingsOverlay";
import type { ViewState } from "@/data/mockData";

export default function Home() {
  const [activeView, setActiveView] = useState<ViewState>("zero-state");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  const handleStartTask = () => {
    setActiveView("task-hover");
  };

  const showPip = panelCollapsed && activeView !== "zero-state";

  return (
    <div className="flex h-screen flex-col">
      <TopBar
        isZeroState={activeView === "zero-state"}
        onOpenSettings={() => setSettingsOpen(true)}
        onGoHome={() => setActiveView("zero-state")}
      />
      <div className="flex flex-1 overflow-hidden">
        {activeView === "zero-state" ? (
          <ZeroState onStartTask={handleStartTask} />
        ) : (
          <>
            <ChatArea
              view={activeView}
              onOpenDetail={() => setActiveView("result-detail")}
              onViewActivityLog={() => setWorkspaceOpen(true)}
            />
            <RightPanel
              view={activeView}
              onViewChange={setActiveView}
              onOpenWorkspace={() => setWorkspaceOpen(true)}
              collapsed={panelCollapsed}
              onToggleCollapse={() => setPanelCollapsed((c) => !c)}
            />
          </>
        )}
      </div>

      {/* Floating PiP workspace when sidebar is collapsed */}
      <div
        className={`fixed top-[54px] right-4 z-40 w-[280px] overflow-hidden rounded-xl border border-b1 bg-bg2 shadow-2xl transition-all duration-300 ease-out ${
          showPip ? "translate-y-0 opacity-100" : "-translate-y-2 pointer-events-none opacity-0"
        }`}
      >
        {/* Header: task info + expand */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-g animate-running-glow" />
            <div className="truncate text-[11px] font-medium text-t1">Research inbound founder</div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPanelCollapsed(false);
            }}
            className="flex items-center justify-center rounded-md p-1 text-t4 transition-colors hover:bg-bg3 hover:text-t2"
            title="Expand panel"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M15 3v18" />
              <path d="m10 15-3-3 3-3" />
            </svg>
          </button>
        </div>
        {/* Screen preview */}
        <div
          onClick={() => setWorkspaceOpen(true)}
          className="relative flex aspect-video cursor-pointer items-center justify-center bg-bg3 transition-all hover:brightness-110"
        >
          <div className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-full bg-black/65 px-[7px] py-0.5 text-[9px] font-semibold text-g backdrop-blur-sm">
            <div className="h-1 w-1 rounded-full bg-g" />
            LIVE
          </div>
          <div className="flex flex-col items-center gap-1 text-center text-[11px] text-t4">
            <svg className="h-4 w-4 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            <span>LinkedIn{"\n"}Founder profile</span>
          </div>
        </div>
      </div>

      <FullWorkspaceView
        open={workspaceOpen}
        onClose={() => setWorkspaceOpen(false)}
      />
      <SettingsOverlay
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
