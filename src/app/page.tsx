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

  const handleStartTask = () => {
    setActiveView("task-hover");
  };

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
            />
          </>
        )}
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
