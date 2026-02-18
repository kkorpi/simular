"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { TopBar } from "@/components/TopBar";
import { ChatArea } from "@/components/ChatArea";
import { RightPanel } from "@/components/RightPanel";
import { FullWorkspaceView } from "@/components/FullWorkspaceView";
import { ZeroState } from "@/components/ZeroState";
import { SettingsOverlay, type SettingsSection } from "@/components/SettingsOverlay";
import { LoginScreen } from "@/components/LoginScreen";
import { OnboardingScreen, type OnboardingProfile } from "@/components/OnboardingScreen";
import type { ViewState } from "@/data/mockData";

const PIP_MIN_WIDTH = 200;
const PIP_MAX_WIDTH = 520;
const PIP_DEFAULT_WIDTH = 320;

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userProfile, setUserProfile] = useState<OnboardingProfile>({});
  const [activeView, setActiveView] = useState<ViewState>("zero-state");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection | undefined>(undefined);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<"default" | "login" | "teach">("default");
  const [workspaceService, setWorkspaceService] = useState<string>("");
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [showNewTaskCard, setShowNewTaskCard] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [pipWidth, setPipWidth] = useState(PIP_DEFAULT_WIDTH);
  const pipDragging = useRef(false);
  const pipDragStartX = useRef(0);
  const pipDragStartWidth = useRef(PIP_DEFAULT_WIDTH);


  const handleStartTask = () => {
    setActiveView("task-hover");
  };

  const handleOpenWorkspaceForLogin = (service: string) => {
    setWorkspaceMode("login");
    setWorkspaceService(service);
    setWorkspaceOpen(true);
  };

  const handleSlashCommand = (command: string) => {
    switch (command) {
      case "skills":
        setSettingsSection("skills");
        setSettingsOpen(true);
        break;
      case "integrations":
        setSettingsSection("workspace");
        setSettingsOpen(true);
        break;
      case "settings":
        setSettingsSection("appearance");
        setSettingsOpen(true);
        break;
      case "history":
        // Could navigate to completed tasks view
        break;
      case "schedule":
        setShowNewTaskCard(true);
        break;
      case "teach":
        setWorkspaceMode("teach");
        setWorkspaceOpen(true);
        break;
    }
  };

  const showPip = panelCollapsed && activeView !== "zero-state";

  const handlePipResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    pipDragging.current = true;
    pipDragStartX.current = e.clientX;
    pipDragStartWidth.current = pipWidth;
    document.body.style.cursor = "nesw-resize";
    document.body.style.userSelect = "none";
  }, [pipWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!pipDragging.current) return;
      const deltaX = pipDragStartX.current - e.clientX;
      const newWidth = Math.max(PIP_MIN_WIDTH, Math.min(PIP_MAX_WIDTH, pipDragStartWidth.current + deltaX));
      setPipWidth(newWidth);
    };
    const handleMouseUp = () => {
      if (!pipDragging.current) return;
      pipDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  if (!isOnboarded) {
    return <OnboardingScreen onReady={(profile) => { setUserProfile(profile); setIsOnboarded(true); }} />;
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar
        isZeroState={activeView === "zero-state"}
        onOpenSettings={() => setSettingsOpen(true)}
        onGoHome={() => setActiveView("zero-state")}
      />
      <div className="flex flex-1 overflow-hidden">
        {activeView === "zero-state" ? (
          <ZeroState
            onStartTask={handleStartTask}
            onCreateOwn={() => setActiveView("task-hover")}
            userRole={userProfile.role}
          />
        ) : (
          <>
            <ChatArea
              view={activeView}
              onOpenDetail={() => setActiveView("result-detail")}
              onViewActivityLog={() => { setWorkspaceMode("default"); setWorkspaceOpen(true); }}
              onOpenWorkspaceForLogin={handleOpenWorkspaceForLogin}
              onSlashCommand={handleSlashCommand}
              showNewTaskCard={showNewTaskCard}
              onCloseNewTask={() => setShowNewTaskCard(false)}
              linkedinConnected={linkedinConnected}
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
        className={`group fixed top-[54px] right-4 z-40 overflow-hidden rounded-lg border border-b1 bg-bg2 shadow-2xl transition-[opacity,transform] duration-300 ease-out ${
          showPip ? "translate-y-0 opacity-100" : "-translate-y-2 pointer-events-none opacity-0"
        }`}
        style={{ width: pipWidth }}
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
          <div className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-full bg-bg2/90 px-[7px] py-0.5 text-[9px] font-semibold text-g backdrop-blur-sm">
            <div className="h-1 w-1 rounded-full bg-g" />
            LIVE
          </div>
          <div className="absolute bottom-1.5 right-1.5 flex items-center justify-center rounded-md bg-bg2/80 p-0.5 backdrop-blur-sm">
            <svg className="h-4 w-4 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-1 text-center text-[11px] text-t4">
            <svg className="h-4 w-4 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            <span>LinkedIn{"\n"}Founder profile</span>
          </div>
        </div>
        {/* Bottom-left corner resize handle */}
        <div
          onMouseDown={handlePipResizeStart}
          className="absolute bottom-0 left-0 z-10 h-5 w-5 cursor-nesw-resize p-1"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" className="text-t4 opacity-0 transition-opacity group-hover:opacity-100">
            <path d="M0 0L8 8M0 4L4 8" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
      </div>

      <FullWorkspaceView
        open={workspaceOpen}
        onClose={() => { setWorkspaceOpen(false); setWorkspaceMode("default"); }}
        onLoginSuccess={() => setLinkedinConnected(true)}
        mode={workspaceMode}
        service={workspaceService}
      />
      <SettingsOverlay
        open={settingsOpen}
        onClose={() => { setSettingsOpen(false); setSettingsSection(undefined); }}
        initialSection={settingsSection}
      />
    </div>
  );
}
