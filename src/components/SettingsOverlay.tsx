"use client";

import { useState, useEffect, useRef } from "react";
import { Monitor, Laptop } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { RenameModal } from "./RenameModal";
import type { Workspace } from "@/data/mockData";

export interface ConnectedServiceInfo {
  id: string;
  name: string;
  connectedAt: Date;
}

interface SettingsOverlayProps {
  open: boolean;
  onClose: () => void;
  initialSection?: SettingsSection;
  onOpenCardGallery?: () => void;
  onOpenDesignSystem?: () => void;
  trialDaysLeft?: number;
  trialCancelled?: boolean;
  onCancelTrial?: () => void;
  onReactivateTrial?: () => void;
  connectedServices?: ConnectedServiceInfo[];
  onSignOut?: (serviceId: string) => void;
  onSignOutAll?: () => void;
  workspaces?: Workspace[];
  onRenameWorkspace?: (id: string, newName: string) => void;
  onCreateWorkspace?: (ws: { name: string; isDevice: boolean }) => void;
}

type SettingsSection =
  | "appearance"
  | "workspaces"
  | "skills"
  | "messaging"
  | "subscription"
  | "credits"
  | "about";

type WorkspaceSubSection = "integrations" | "accounts" | "agent" | "info";

const sections: { id: SettingsSection; label: string }[] = [
  { id: "appearance", label: "Appearance" },
  { id: "workspaces", label: "Workspaces" },
  { id: "skills", label: "Skills" },
  { id: "messaging", label: "Messaging" },
  { id: "subscription", label: "Subscription" },
  { id: "credits", label: "Credits" },
  { id: "about", label: "About" },
];

export { type SettingsSection };

export function SettingsOverlay({ open, onClose, initialSection, onOpenCardGallery, onOpenDesignSystem, trialDaysLeft = 6, trialCancelled, onCancelTrial, onReactivateTrial, connectedServices = [], onSignOut, onSignOutAll, workspaces, onRenameWorkspace, onCreateWorkspace }: SettingsOverlayProps) {
  const [active, setActive] = useState<SettingsSection>(initialSection || "appearance");
  const [selectedWsId, setSelectedWsId] = useState<string | null>(null);
  const [wsSubSection, setWsSubSection] = useState<WorkspaceSubSection>("integrations");
  const [wsCreating, setWsCreating] = useState(false);

  // Sync when initialSection changes (e.g., from slash command)
  useEffect(() => {
    if (initialSection && open) {
      setActive(initialSection);
      setSelectedWsId(null);
      setWsCreating(false);
    }
  }, [initialSection, open]);

  // Leaving the workspaces section clears nested views.
  useEffect(() => {
    if (active !== "workspaces") {
      setSelectedWsId(null);
      setWsCreating(false);
    }
  }, [active]);

  const isWorkspaceDetail = active === "workspaces" && selectedWsId !== null;
  const isWorkspaceCreate = active === "workspaces" && wsCreating;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay backdrop-blur-[5px]" onClick={onClose}>
      <div role="dialog" aria-label="Settings" className="flex h-[640px] w-[840px] max-md:h-full max-md:w-full max-md:rounded-none overflow-hidden rounded-2xl border border-b1 max-md:border-0 bg-bg shadow-[var(--sc)] max-md:flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Left nav (desktop) / Top nav (mobile) */}
        <div role="tablist" className="flex w-[200px] shrink-0 flex-col border-r border-b1 bg-bg2 py-4 max-md:w-full max-md:flex-row max-md:items-center max-md:border-r-0 max-md:border-b max-md:py-2 max-md:px-2 max-md:gap-0 max-md:overflow-x-auto">
          {sections.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={active === s.id}
              onClick={() => setActive(s.id)}
              className={`px-5 py-2.5 text-left text-[13.5px] font-medium transition-colors max-md:px-3 max-md:py-1.5 max-md:text-center max-md:text-[12px] max-md:whitespace-nowrap max-md:rounded-md max-md:shrink-0 ${
                active === s.id
                  ? "text-t1 max-md:bg-bg3"
                  : "text-t3 hover:text-t2"
              }`}
            >
              {s.label}
            </button>
          ))}

          {(onOpenCardGallery || onOpenDesignSystem) && (
            <div className="max-md:hidden">
              <div className="mx-5 my-2 h-px bg-b1" />
              {onOpenCardGallery && (
                <button
                  onClick={() => { onOpenCardGallery(); onClose(); }}
                  className="flex items-center gap-2 px-5 py-2.5 text-left text-[13.5px] font-medium text-t3 transition-colors hover:text-t2"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                  Card gallery
                </button>
              )}
              {onOpenDesignSystem && (
                <button
                  onClick={() => { onOpenDesignSystem(); onClose(); }}
                  className="flex items-center gap-2 px-5 py-2.5 text-left text-[13.5px] font-medium text-t3 transition-colors hover:text-t2"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="21.17" y1="8" x2="12" y2="8" />
                    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
                  </svg>
                  Design system
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right content (desktop) / Bottom content (mobile) */}
        <div className="flex flex-1 flex-col overflow-y-auto min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-b1 px-6 py-4">
            <div className="flex items-center gap-2 text-[13px] text-t3">
              <span>Settings</span>
              <span className="text-t4">/</span>
              {isWorkspaceDetail ? (
                <>
                  <button onClick={() => setSelectedWsId(null)} className="transition-colors hover:text-t1">Workspaces</button>
                  <span className="text-t4">/</span>
                  <span className="font-medium text-t1">{workspaces?.find((w) => w.id === selectedWsId)?.name ?? selectedWsId}</span>
                </>
              ) : isWorkspaceCreate ? (
                <>
                  <button onClick={() => setWsCreating(false)} className="transition-colors hover:text-t1">Workspaces</button>
                  <span className="text-t4">/</span>
                  <span className="font-medium text-t1">New</span>
                </>
              ) : (
                <span className="font-medium text-t1">
                  {sections.find((s) => s.id === active)?.label}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-md text-t3 transition-colors hover:bg-bg3 hover:text-t1"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div role="tabpanel" className="flex-1 px-6 py-5">
            {active === "appearance" && <AppearanceSettings />}

            {active === "workspaces" && !isWorkspaceDetail && !isWorkspaceCreate && (
              <WorkspacesListView
                workspaces={workspaces}
                onSelectWorkspace={(id) => { setSelectedWsId(id); setWsSubSection("integrations"); }}
                onStartCreate={() => setWsCreating(true)}
              />
            )}
            {isWorkspaceCreate && (
              <WorkspaceCreateView
                existingNames={(workspaces ?? []).map((w) => w.name)}
                onCancel={() => setWsCreating(false)}
                onCreate={(ws) => { onCreateWorkspace?.(ws); setWsCreating(false); }}
              />
            )}
            {isWorkspaceDetail && (
              <WorkspaceDetailView
                workspaceId={selectedWsId!}
                subSection={wsSubSection}
                onSubSectionChange={setWsSubSection}
                onBack={() => setSelectedWsId(null)}
                connectedServices={connectedServices}
                onSignOut={onSignOut}
                onSignOutAll={onSignOutAll}
                workspaces={workspaces}
                onRenameWorkspace={onRenameWorkspace}
              />
            )}

            {active === "skills" && <SkillsSettings />}
            {active === "messaging" && <MessagingSettings />}
            {active === "subscription" && <SubscriptionSettings trialDaysLeft={trialDaysLeft} trialCancelled={trialCancelled} onCancelTrial={onCancelTrial} onReactivateTrial={onReactivateTrial} />}
            {active === "credits" && <CreditsSettings />}
            {active === "about" && <AboutSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Appearance ── */
function AppearanceSettings() {
  const { preference, setPreference } = useTheme();

  return (
    <div>
      <div className="text-[14px] font-semibold text-t1">Theme</div>
      <div className="mt-3 flex gap-2">
        {(["dark", "light", "system"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setPreference(t)}
            className={`rounded-md border px-4 py-2 text-[13px] font-medium capitalize transition-colors ${
              preference === t
                ? "border-b2 bg-bg3 text-t1"
                : "border-b1 text-t3 hover:border-b2 hover:text-t2"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Workspaces List ── */
function WorkspacesListView({ workspaces, onSelectWorkspace, onStartCreate }: { workspaces?: Workspace[]; onSelectWorkspace: (id: string) => void; onStartCreate: () => void }) {
  const fallback: Workspace[] = [
    { id: "Cloud Workspace", name: "Cloud Workspace", status: "active", isDevice: false },
    { id: "Dev Environment", name: "Dev Environment", status: "active", isDevice: false },
    { id: "Kevin's MacBook", name: "Kevin's MacBook", status: "active", isDevice: true },
  ];
  const list = workspaces && workspaces.length > 0 ? workspaces : fallback;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[14px] font-semibold text-t1">Workspaces</div>
          <div className="mt-1 text-[12.5px] text-t3">Your cloud workspaces and connected devices.</div>
        </div>
        <button
          onClick={onStartCreate}
          className="flex items-center gap-2 rounded-md border border-b1 px-3 py-2 text-[12px] font-medium text-t2 transition-colors hover:border-b2 hover:bg-bg3 hover:text-t1"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Create workspace
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {list.map((ws) => (
          <button
            key={ws.id}
            onClick={() => onSelectWorkspace(ws.id)}
            className="flex items-center gap-3 rounded-lg border border-b1 bg-bg3/50 px-4 py-3 text-left transition-colors hover:border-b2 hover:bg-bg3"
          >
            <svg className="h-5 w-5 shrink-0 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {ws.isDevice ? (
                <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="2" y1="20" x2="22" y2="20" /><line x1="12" y1="17" x2="12" y2="20" /></>
              ) : (
                <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>
              )}
            </svg>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium text-t1">{ws.name}</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-t3">
                <div className={`h-1.5 w-1.5 rounded-full ${ws.status === "active" ? "bg-g" : "bg-t4"}`} />
                {ws.status === "active" ? "Active" : "Offline"}
                <span className="text-t4">·</span>
                {ws.isDevice ? "macOS" : "Windows"}
              </div>
            </div>
            <svg className="h-4 w-4 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Workspace Create (inline — lives inside the Settings panel, not a nested modal) ── */
function WorkspaceCreateView({ existingNames, onCancel, onCreate }: { existingNames: string[]; onCancel: () => void; onCreate: (ws: { name: string; isDevice: boolean }) => void }) {
  const [mode, setMode] = useState<"cloud" | "device">("cloud");

  // Pick a friendly default that doesn't clash with existing workspaces.
  const defaultNameFor = (m: "cloud" | "device") => {
    const base = m === "cloud" ? "Sai's computer" : "My device";
    if (!existingNames.includes(base)) return base;
    let n = 2;
    while (existingNames.includes(`${base} ${n}`)) n++;
    return `${base} ${n}`;
  };

  const [name, setName] = useState(() => defaultNameFor("cloud"));
  const [touched, setTouched] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const nameValid = name.trim().length >= 1 && name.trim().length <= 40;
  const usernameValid = username.length >= 1 && username.length <= 20 && /^[A-Za-z0-9._-]+$/.test(username);
  const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,123}$/.test(password);
  const canSubmit = mode === "cloud" ? nameValid && usernameValid && passwordValid : nameValid;

  const handleModeChange = (m: "cloud" | "device") => {
    setMode(m);
    if (!touched) setName(defaultNameFor(m));
  };

  const handleCreate = () => {
    if (!canSubmit) return;
    onCreate({ name: name.trim(), isDevice: mode === "device" });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Intro */}
      <div>
        <div className="text-[15px] font-semibold text-t1">Create workspace</div>
        <div className="mt-1 text-[12.5px] text-t3">A workspace is the computer Sai runs on.</div>
      </div>

      {/* Mode cards — two large radio-cards, richer than a toggle */}
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <ModeCard
          Icon={Monitor}
          title="Sai's own computer"
          description="A fresh machine, ready in seconds."
          selected={mode === "cloud"}
          onClick={() => handleModeChange("cloud")}
        />
        <ModeCard
          Icon={Laptop}
          title="Share my device"
          description="Let Sai work on this computer with you."
          selected={mode === "device"}
          onClick={() => handleModeChange("device")}
        />
      </div>

      {/* Form — single compact block, no redundant helper text */}
      <div className="mt-5 flex flex-col gap-3.5">
        <Field label="Workspace name">
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setTouched(true); }}
            onFocus={(e) => e.currentTarget.select()}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
            className="w-full rounded-md border border-b1 bg-bg3 px-3 py-2 text-[13px] text-t1 outline-none ring-1 ring-transparent focus:ring-as/50 caret-as"
            autoFocus
          />
        </Field>

        {mode === "cloud" && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Username" hint="1–20 characters">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
                placeholder="kevin"
                className="w-full rounded-md border border-b1 bg-bg3 px-3 py-2 text-[13px] text-t1 outline-none ring-1 ring-transparent focus:ring-as/50 caret-as"
              />
            </Field>
            <Field label="Password" hint="8+ chars, mixed case, digit, symbol">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
                placeholder="••••••••"
                className="w-full rounded-md border border-b1 bg-bg3 px-3 py-2 text-[13px] text-t1 outline-none ring-1 ring-transparent focus:ring-as/50 caret-as"
              />
            </Field>
          </div>
        )}
      </div>

      {/* Actions pinned to the bottom of the scroll area so the form sits compactly up top */}
      <div className="mt-auto flex items-center justify-end gap-2 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-2 text-[13px] text-t2 transition-colors hover:bg-bg3 hover:text-t1"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={!canSubmit}
          className="rounded-md bg-as px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Create workspace
        </button>
      </div>
    </div>
  );
}

/** Large radio-card for mode selection. */
function ModeCard({
  Icon,
  title,
  description,
  selected,
  onClick,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-colors ${
        selected
          ? "border-as/50 bg-as/5 ring-1 ring-as/30"
          : "border-b1 bg-bg2 hover:border-b2 hover:bg-bg3"
      }`}
    >
      <div className={`flex h-7 w-7 items-center justify-center rounded-md ${selected ? "bg-as/15 text-as" : "bg-bg3 text-t3"}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className={`text-[13px] font-medium ${selected ? "text-t1" : "text-t2"}`}>{title}</div>
      <div className="text-[11.5px] leading-snug text-t4">{description}</div>
    </button>
  );
}

/** Label + optional right-aligned hint + control. */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-[12.5px] font-medium text-t2">{label}</label>
        {hint && <span className="text-[11px] text-t4">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/* ── Workspace Detail ── */
function WorkspaceDetailView({
  workspaceId,
  subSection,
  onSubSectionChange,
  onBack,
  connectedServices,
  onSignOut,
  onSignOutAll,
  workspaces,
  onRenameWorkspace,
}: {
  workspaceId: string;
  subSection: WorkspaceSubSection;
  onSubSectionChange: (s: WorkspaceSubSection) => void;
  onBack: () => void;
  connectedServices: ConnectedServiceInfo[];
  onSignOut?: (id: string) => void;
  onSignOutAll?: () => void;
  workspaces?: Workspace[];
  onRenameWorkspace?: (id: string, newName: string) => void;
}) {
  const subSections: { id: WorkspaceSubSection; label: string }[] = [
    { id: "integrations", label: "Integrations" },
    { id: "accounts", label: "Accounts" },
    { id: "agent", label: "Agent" },
    { id: "info", label: "Info" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Back + sub-nav */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-1 text-[12px] text-t3 transition-colors hover:text-t1">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Back
        </button>
        <div className="h-4 w-px bg-b1" />
        <div className="flex gap-1">
          {subSections.map((s) => (
            <button
              key={s.id}
              onClick={() => onSubSectionChange(s.id)}
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                subSection === s.id ? "bg-bg3 text-t1" : "text-t3 hover:text-t2 hover:bg-bg3/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-section content */}
      {subSection === "integrations" && <IntegrationsSettings />}
      {subSection === "accounts" && <SignedInAccountsSettings services={connectedServices} onSignOut={onSignOut} onSignOutAll={onSignOutAll} />}
      {subSection === "agent" && <AgentSettings />}
      {subSection === "info" && <WorkspaceInfoSettings workspaceId={workspaceId} workspaces={workspaces} onRenameWorkspace={onRenameWorkspace} />}
    </div>
  );
}

/* ── Workspace Info ── */
function WorkspaceInfoSettings({ workspaceId, workspaces, onRenameWorkspace }: { workspaceId: string; workspaces?: Workspace[]; onRenameWorkspace?: (id: string, newName: string) => void }) {
  const ws = workspaces?.find((w) => w.id === workspaceId);
  const displayName = ws?.name ?? workspaceId;
  const isDevice = ws?.isDevice ?? workspaceId === "Kevin's MacBook";
  const [renameOpen, setRenameOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-[14px] font-semibold text-t1">Workspace Details</div>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-t3">Name</span>
            <div className="flex items-center gap-2">
              <span className="text-t1">{displayName}</span>
              {ws && onRenameWorkspace && (
                <button
                  onClick={() => setRenameOpen(true)}
                  className="rounded-md border border-b1 px-2 py-0.5 text-[11px] font-medium text-t3 transition-colors hover:border-b2 hover:bg-bg3 hover:text-t1"
                >
                  Rename
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-between text-[13px]"><span className="text-t3">Platform</span><span className="text-t1">{isDevice ? "macOS" : "Windows"}</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-t3">Type</span><span className="text-t1">{isDevice ? "Your Device" : "Cloud VM"}</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-t3">Status</span><span className="flex items-center gap-1.5 text-t1"><div className="h-1.5 w-1.5 rounded-full bg-g" />Active</span></div>
        </div>
      </div>
      {renameOpen && ws && onRenameWorkspace && (
        <RenameModal
          title="Rename workspace"
          description="Choose a new name for this workspace."
          initialValue={ws.name}
          onCommit={(newName) => { onRenameWorkspace(ws.id, newName); setRenameOpen(false); }}
          onCancel={() => setRenameOpen(false)}
        />
      )}
      <div className="h-px bg-b1" />
      <div>
        <div className="text-[14px] font-semibold text-t1">Danger Zone</div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-[13px] text-t2">Delete this workspace</div>
            <div className="mt-0.5 text-[12px] text-t4">Permanently remove this workspace and all its data.</div>
          </div>
          <button className="flex items-center gap-2 rounded-md border border-rd/30 px-3 py-1.5 text-[12px] font-medium text-rd transition-colors hover:bg-rd/10">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Agent Settings (per-workspace) ── */
function AgentSettings() {
  const [guardrails, setGuardrails] = useState(true);
  const [devMode, setDevMode] = useState(true);
  const [thinkingStrength, setThinkingStrength] = useState("Medium");
  const [thinkingOpen, setThinkingOpen] = useState(false);
  const thinkingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (thinkingRef.current && !thinkingRef.current.contains(e.target as Node)) {
        setThinkingOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const thinkingOptions = ["Low", "Medium", "High"];

  return (
    <div className="flex flex-col gap-6">
      {/* Agent settings */}
      <div>
        <div className="text-[14px] font-semibold text-t1">Agent settings</div>
        <div className="mt-4 flex flex-col gap-4">
          <SettingRow label="Thinking strength" hint>
            <div className="relative" ref={thinkingRef}>
              <button
                type="button"
                onClick={() => setThinkingOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-md border border-b1 bg-bg3 px-3 py-1.5 text-[13px] text-t1 outline-none transition-colors hover:border-b2"
              >
                {thinkingStrength}
                <svg className={`h-3 w-3 text-t4 transition-transform ${thinkingOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {thinkingOpen && (
                <div className="absolute right-0 top-[calc(100%+4px)] z-10 origin-top-right w-[120px] rounded-md border border-b1 bg-bg2 p-1 shadow-lg">
                  {thinkingOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setThinkingStrength(opt); setThinkingOpen(false); }}
                      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] transition-colors hover:bg-bg3 ${opt === thinkingStrength ? "text-t1" : "text-t3"}`}
                    >
                      {opt === thinkingStrength && (
                        <svg className="h-3 w-3 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {opt !== thinkingStrength && <span className="w-3" />}
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </SettingRow>

          <SettingRow label="Max steps per response" hint>
            <input
              type="number"
              defaultValue={20}
              className="w-[72px] rounded-md border border-b1 bg-bg3 px-3 py-1.5 text-right text-[13px] text-t1 outline-none"
            />
          </SettingRow>

          <SettingRow label="Guardrail checks" hint>
            <button
              onClick={() => setGuardrails(!guardrails)}
              className={`relative h-[24px] w-[44px] rounded-full transition-all ${
                guardrails ? "bg-t1" : "bg-b2"
              }`}
            >
              <div
                className={`absolute top-[2px] h-[20px] w-[20px] rounded-full bg-bg transition-all ${
                  guardrails ? "left-[22px]" : "left-[2px]"
                }`}
              />
            </button>
          </SettingRow>
        </div>
      </div>

      <div className="h-px bg-b1" />

      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-t3">Advanced</div>
        <div className="mt-3 flex flex-col gap-4">
          <SettingRow label="Dev mode" hint>
            <button
              onClick={() => setDevMode(!devMode)}
              className={`relative h-[24px] w-[44px] rounded-full transition-all ${
                devMode ? "bg-t1" : "bg-b2"
              }`}
            >
              <div
                className={`absolute top-[2px] h-[20px] w-[20px] rounded-full bg-bg transition-all ${
                  devMode ? "left-[22px]" : "left-[2px]"
                }`}
              />
            </button>
          </SettingRow>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] text-t2">{label}</span>
        {hint && <HintIcon />}
      </div>
      {children}
    </div>
  );
}


function HintIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-t4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

/* ── Integrations (OAuth API connections) ── */

const integrationsList = [
  { id: "slack", name: "Slack", description: "Send messages and notifications" },
  { id: "notion", name: "Notion", description: "Create and update documents" },
  { id: "jira", name: "Jira", description: "Create and manage issues" },
  { id: "github", name: "GitHub", description: "Manage repos and pull requests" },
  { id: "google-calendar", name: "Google Calendar", description: "View and create events" },
  { id: "hubspot", name: "HubSpot", description: "Manage contacts and deals" },
];

function IntegrationsSettings() {
  const [connected, setConnected] = useState<Set<string>>(new Set());

  const toggleConnect = (id: string) => {
    setConnected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-[14px] font-semibold text-t1">Integrations</div>
        <div className="mt-1 text-[12.5px] text-t3">
          Connect apps and services Sai can use to take actions on your behalf.
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {integrationsList.map((integration) => {
          const isConnected = connected.has(integration.id);
          return (
            <div key={integration.id} className="flex items-center gap-3 rounded-lg border border-b1 bg-bg3/50 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-t1">{integration.name}</div>
                <div className="text-[11.5px] text-t3">{integration.description}</div>
              </div>
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-[12px] font-medium text-g">
                    <div className="h-1.5 w-1.5 rounded-full bg-g" />
                    Connected
                  </span>
                  <button
                    onClick={() => toggleConnect(integration.id)}
                    className="text-[11px] text-t4 transition-colors hover:text-rd"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => toggleConnect(integration.id)}
                  className="rounded-md border border-b1 px-3 py-1.5 text-[12px] font-medium text-t2 transition-colors hover:border-b2 hover:bg-bg3 hover:text-t1"
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 text-[11.5px] text-t3">
        <svg className="mt-px h-3.5 w-3.5 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        Integrations use OAuth to securely connect without sharing your password. You can revoke access at any time.
      </div>
    </div>
  );
}

/* ── Signed-in Accounts ── */
function SignedInAccountsSettings({
  services,
  onSignOut,
  onSignOutAll,
}: {
  services: ConnectedServiceInfo[];
  onSignOut?: (serviceId: string) => void;
  onSignOutAll?: () => void;
}) {
  function timeAgo(date: Date): string {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-[14px] font-semibold text-t1">Signed-in Accounts</div>
        <div className="mt-1 text-[12.5px] text-t3">
          Websites and services you&apos;re signed into in your workspace browser.
        </div>
      </div>

      {services.length > 0 ? (
        <div className="flex flex-col gap-3">
          {services.map((svc) => (
            <div key={svc.id} className="flex items-start gap-3 rounded-lg border border-b1 bg-bg3/50 px-4 py-3">
              <div className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-g" />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-t1">{svc.name}</div>
                <div className="mt-0.5 text-[11px] text-t3">
                  Signed in &middot; Last active {timeAgo(svc.connectedAt)}
                </div>
              </div>
              <button
                onClick={() => onSignOut?.(svc.id)}
                className="rounded-md border border-b1 px-3 py-1.5 text-[12px] font-medium text-t3 transition-colors hover:border-rd/30 hover:text-rd"
              >
                Sign out
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-b1 bg-bg3/30 px-4 py-6 text-center">
          <div className="text-[13px] text-t3">No accounts signed in yet.</div>
          <div className="mt-1 text-[12px] text-t4">Sign into websites in your workspace and they&apos;ll appear here.</div>
        </div>
      )}

      {services.length > 1 && (
        <>
          <div className="h-px bg-b1" />
          <button
            onClick={onSignOutAll}
            className="text-[12px] font-medium text-t3 transition-colors hover:text-rd"
          >
            Sign out of all
          </button>
        </>
      )}
    </div>
  );
}

/* ── Skills ── */
function SkillsSettings() {
  const skills = [
    { name: "Research", description: "Web browsing, data gathering, and source cross-referencing", enabled: true },
    { name: "Writing", description: "Emails, documents, reports, and summaries", enabled: true },
    { name: "Data Analysis", description: "Spreadsheets, comparisons, and trend analysis", enabled: true },
    { name: "Scheduling", description: "Calendar management, reminders, and recurring tasks", enabled: true },
    { name: "Code", description: "Read, write, and debug code across languages", enabled: false },
    { name: "Image Analysis", description: "Analyze screenshots, charts, and visual content", enabled: false },
  ];

  const [enabledSkills, setEnabledSkills] = useState<Record<string, boolean>>(
    Object.fromEntries(skills.map((s) => [s.name, s.enabled]))
  );

  return (
    <div>
      <div className="text-[14px] font-semibold text-t1">Agent Skills</div>
      <div className="mt-1 text-[12.5px] text-t3">
        Capabilities your agent can use when completing tasks.
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {skills.map((skill) => (
          <div key={skill.name} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-[13px] font-medium text-t1">{skill.name}</div>
              <div className="mt-0.5 text-[12px] text-t3">{skill.description}</div>
            </div>
            <button
              onClick={() =>
                setEnabledSkills((prev) => ({ ...prev, [skill.name]: !prev[skill.name] }))
              }
              className={`relative h-[24px] w-[44px] shrink-0 rounded-full transition-all ${
                enabledSkills[skill.name] ? "bg-t1" : "bg-b2"
              }`}
            >
              <div
                className={`absolute top-[2px] h-[20px] w-[20px] rounded-full bg-bg transition-all ${
                  enabledSkills[skill.name] ? "left-[22px]" : "left-[2px]"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Messaging ── */
function MessagingSettings() {
  const [notifType, setNotifType] = useState("Final answer only");
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-[14px] font-semibold text-t1">Messaging</div>
        <div className="mt-1 text-[12.5px] text-t3">How Sai keeps you in the loop.</div>
      </div>

      <SettingRow label="What to send" hint>
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-md border border-b1 bg-bg3 px-3 py-1.5 text-[13px] text-t1 outline-none transition-colors hover:border-b2"
          >
            {notifType}
            <svg className={`h-3 w-3 text-t4 transition-transform ${notifOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-[calc(100%+4px)] z-10 w-[180px] rounded-md border border-b1 bg-bg2 p-1 shadow-lg">
              {["Final answer only", "All updates", "Errors only"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setNotifType(opt); setNotifOpen(false); }}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] transition-colors hover:bg-bg3 ${opt === notifType ? "text-t1" : "text-t3"}`}
                >
                  {opt === notifType && (
                    <svg className="h-3 w-3 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                  {opt !== notifType && <span className="w-3" />}
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </SettingRow>

      <div className="h-px bg-b1" />

      {/* Text Message */}
      <div>
        <div className="text-[14px] font-semibold text-t1">Text Message</div>
        <div className="mt-1 text-[12.5px] text-t3">Chat with your agent via text message.</div>
        <div className="mt-3 rounded-lg border border-b1 bg-bg3/30 px-4 py-3">
          <div className="flex items-center gap-2 text-[12.5px] text-t3">
            <svg className="h-4 w-4 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            Link your phone number to chat with Sai via Text Message. You can also approve or deny requests by replying to text messages.
          </div>
        </div>
        <div className="mt-3">
          <label className="text-[12px] text-t3">Phone number</label>
          <input
            type="tel"
            placeholder="(555) 123-4567"
            className="mt-1 w-full rounded-md border border-b1 bg-bg3 px-3 py-2 text-[13px] text-t1 outline-none placeholder:text-t4"
          />
        </div>
        <button className="mt-3 w-full rounded-md bg-bg3 py-2.5 text-[13px] font-medium text-t2 transition-colors hover:bg-bg3h hover:text-t1">
          Link Phone Number
        </button>
      </div>

      <div className="h-px bg-b1" />

      {/* Telegram */}
      <div>
        <div className="text-[14px] font-semibold text-t1">Telegram</div>
        <div className="mt-1 text-[12.5px] text-t3">Chat with your agent via Telegram.</div>
        <div className="mt-3 rounded-lg border border-b1 bg-bg3/30 px-4 py-3">
          <div className="flex items-center gap-2 text-[12.5px] text-t3">
            <svg className="h-4 w-4 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Link your Telegram account to chat with Sai. You can also approve or deny requests by replying in Telegram.
          </div>
        </div>
        <button className="mt-3 w-full rounded-md bg-bg3 py-2.5 text-[13px] font-medium text-t2 transition-colors hover:bg-bg3h hover:text-t1">
          Link Telegram
        </button>
      </div>
    </div>
  );
}

/* ── Subscription ── */
function SubscriptionSettings({ trialDaysLeft = 6, trialCancelled, onCancelTrial, onReactivateTrial }: { trialDaysLeft?: number; trialCancelled?: boolean; onCancelTrial?: () => void; onReactivateTrial?: () => void }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"plus" | "pro">("plus");
  const trialDay = 14 - trialDaysLeft;
  const trialPct = Math.round((trialDay / 14) * 100);
  const isUrgent = trialDaysLeft <= 1;

  const plans = {
    plus: {
      name: "Plus",
      price: "$20",
      period: "/mo",
      features: [
        "5 tasks per day",
        "Core integrations (Gmail, LinkedIn, Slack)",
        "Full workspace access with screen recording",
        "Recurring task scheduling",
        "Community support",
      ],
    },
    pro: {
      name: "Pro",
      price: "$500",
      period: "/mo",
      features: [
        "Unlimited tasks",
        "All integrations (Gmail, Salesforce, LinkedIn, HubSpot, etc.)",
        "Full workspace access with screen recording",
        "Recurring task scheduling",
        "Teach mode — show your agent custom workflows",
        "Priority support &amp; dedicated onboarding",
        "Custom workflows &amp; API access",
      ],
    },
  };

  const plan = plans[selectedPlan];

  return (
    <div className="flex flex-col gap-6">
      {/* Cancelled banner */}
      {trialCancelled && trialDaysLeft > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.04] px-4 py-3.5">
          <div className="text-[13px] font-medium text-amt">Trial cancelled</div>
          <div className="mt-1 text-[12px] text-t3">
            Your workspace stays active for {trialDaysLeft} more day{trialDaysLeft !== 1 ? "s" : ""}. After that, you&apos;ll lose access.
          </div>
          <button
            onClick={onReactivateTrial}
            className="mt-3 flex h-8 w-full items-center justify-center rounded-md border border-amber-500/30 text-[12px] font-medium text-amt transition-colors hover:bg-amber-500/10"
          >
            Reactivate trial
          </button>
        </div>
      )}

      {/* Current plan + switcher */}
      <div>
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-semibold text-t1">Current plan</div>
          {/* Plan switcher */}
          <div className="flex items-center rounded-md border border-b1 bg-bg3 p-0.5">
            {(["plus", "pro"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlan(p)}
                className={`relative rounded-[5px] px-3 py-1 text-[11px] font-semibold transition-colors ${
                  selectedPlan === p
                    ? "bg-bg2 text-t1 shadow-sm"
                    : "text-t3 hover:text-t2"
                }`}
              >
                {plans[p].name}
                {p === "plus" && (
                  <span className={`ml-1.5 text-[9px] font-semibold ${trialCancelled ? "text-amt" : "text-blt"}`}>{trialCancelled ? "CANCELLED" : "CURRENT"}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-3 rounded-lg border p-4 ${trialCancelled ? "border-b1 bg-bg3/30" : isUrgent ? "border-amber-500/30 bg-amber-500/[0.04]" : "border-b1 bg-bg3/50"}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[14px] font-semibold ${trialCancelled && selectedPlan === "plus" ? "text-t3" : "text-t1"}`}>{plan.name}{selectedPlan === "plus" ? " Trial" : ""}</span>
                {selectedPlan === "plus" ? (
                  trialCancelled ? (
                    <span className="rounded-full bg-bg3 px-2 py-0.5 text-[10px] font-semibold text-t4 line-through">
                      CANCELLED
                    </span>
                  ) : (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${isUrgent ? "bg-amber-500/15 text-amt" : "bg-as/15 text-blt"}`}>
                      {isUrgent ? "EXPIRES TOMORROW" : "TRIAL"}
                    </span>
                  )
                ) : (
                  <span className="rounded-full bg-bg3 px-2 py-0.5 text-[10px] font-semibold text-t3">
                    UPGRADE
                  </span>
                )}
              </div>
              {selectedPlan === "plus" ? (
                trialCancelled ? (
                  <div className="mt-1 text-[12px] text-t3">Access ends in {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""}</div>
                ) : (
                  <div className="mt-1 text-[12px] text-t3">Started Feb 18, 2026 &middot; {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} remaining</div>
                )
              ) : (
                <div className="mt-1 text-[12px] text-t3">For teams and power users</div>
              )}
            </div>
            <div className="text-right">
              {selectedPlan === "plus" ? (
                trialCancelled ? (
                  <div className="text-[11px] text-t4">No charge</div>
                ) : (
                  <>
                    <div className="text-[14px] font-semibold text-t1">$0</div>
                    <div className="text-[11px] text-t3">then {plan.price}/mo</div>
                  </>
                )
              ) : (
                <>
                  <div className="text-[14px] font-semibold text-t1">{plan.price}</div>
                  <div className="text-[11px] text-t3">per month</div>
                </>
              )}
            </div>
          </div>

          {/* Trial progress bar (Plus only) */}
          {selectedPlan === "plus" && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-t3 mb-1">
                <span>Day {trialDay} of 14</span>
                <span className={trialCancelled ? "font-medium text-t4" : isUrgent ? "font-medium text-amt" : ""}>{trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} left</span>
              </div>
              <div className="h-1.5 rounded-full bg-b1">
                <div className={`h-1.5 rounded-full ${trialCancelled ? "bg-t4" : isUrgent ? "bg-am" : "bg-as"}`} style={{ width: `${trialPct}%` }} />
              </div>
            </div>
          )}

          {/* Upgrade button (Pro only) */}
          {selectedPlan === "pro" && (
            <button className="mt-3 flex h-9 w-full items-center justify-center rounded-md bg-as text-[13px] font-medium text-white transition-colors hover:bg-as2">
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      {/* What's included */}
      <div>
        <div className="text-[14px] font-semibold text-t1">What&apos;s included in {plan.name}</div>
        <div className="mt-3 flex flex-col gap-2">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-[12.5px] text-t2">
              <svg className="h-3.5 w-3.5 shrink-0 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span dangerouslySetInnerHTML={{ __html: feature }} />
            </div>
          ))}
          <a
            href="https://simular.ai/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-blt transition-colors hover:text-as2"
          >
            Compare plans
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      <div className="h-px bg-b1" />

      {/* Payment method */}
      {!trialCancelled && (
        <div>
          <div className="text-[14px] font-semibold text-t1">Payment method</div>
          <div className="mt-3 rounded-lg border border-b1 bg-bg3/50 p-4">
            <div className="text-[13px] text-t2">No payment method on file</div>
            <div className="mt-1 text-[11px] text-t3">Add a card before your trial ends to keep access.</div>
            <button className="mt-3 rounded-md border border-b1 px-3 py-1.5 text-[12px] font-medium text-t2 transition-colors hover:border-b2 hover:bg-bg3 hover:text-t1">
              Add payment method
            </button>
          </div>
        </div>
      )}

      {!trialCancelled && <div className="h-px bg-b1" />}

      {/* Cancel */}
      {!trialCancelled && (
        <div>
          {showCancelConfirm ? (
            <div className="rounded-lg border border-rd/30 bg-rd/[0.04] p-4">
              <div className="text-[13px] font-medium text-t1">Are you sure you want to cancel?</div>
              <div className="mt-1 text-[12px] text-t3">
                Your workspace stays active until your trial ends, then you&apos;ll lose access to all tasks, integrations, and recorded workflows.
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="rounded-md border border-b1 px-3 py-1.5 text-[12px] font-medium text-t2 transition-colors hover:bg-bg3"
                >
                  Keep my trial
                </button>
                <button
                  onClick={() => { setShowCancelConfirm(false); onCancelTrial?.(); }}
                  className="rounded-md bg-rd px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:brightness-110"
                >
                  Cancel trial
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-[12px] font-medium text-t3 transition-colors hover:text-rd"
            >
              Cancel trial
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Credits ── */
function CreditsSettings() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-[14px] font-semibold text-t1">Credit usage</div>
        <div className="mt-3 rounded-lg border border-b1 bg-bg3/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[24px] font-semibold text-t1">847</div>
              <div className="text-[12px] text-t3">credits remaining this month</div>
            </div>
            <div className="text-right">
              <div className="text-[13px] text-t2">1,000 / month</div>
              <div className="text-[11px] text-t3">Resets Mar 4</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-1.5 rounded-full bg-b1">
              <div className="h-1.5 rounded-full bg-as" style={{ width: "85%" }} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-[14px] font-semibold text-t1">Usage breakdown</div>
        <div className="mt-3 flex flex-col gap-2.5">
          {[
            { label: "Research tasks", credits: 72, icon: "🔍" },
            { label: "Writing tasks", credits: 45, icon: "✍️" },
            { label: "Workspace sessions", credits: 28, icon: "🖥️" },
            { label: "Recurring tasks", credits: 8, icon: "🔁" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-[14px]">{item.icon}</span>
              <span className="flex-1 text-[13px] text-t2">{item.label}</span>
              <span className="text-[13px] font-medium text-t1">{item.credits} credits</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-b1" />

      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] text-t2">Need more credits?</div>
          <div className="text-[11px] text-t3">Add-on packs available for high-usage months</div>
        </div>
        <button className="rounded-md border border-b1 px-3 py-1.5 text-[12px] font-medium text-t2 transition-colors hover:bg-bg3">
          Buy credits
        </button>
      </div>
    </div>
  );
}

/* ── About ── */
function AboutSettings() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-[14px] font-semibold text-t1">Simular</div>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-t3">Version</span>
            <span className="text-[13px] font-medium text-t1">0.9.1-beta</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-t3">Build</span>
            <span className="font-mono text-[12px] text-t3">2026.03.04</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-b1" />

      <div>
        <div className="text-[14px] font-semibold text-t1">Legal</div>
        <div className="mt-3 flex flex-col gap-2.5">
          <a
            href="https://simular.ai/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-[13px] text-t2 transition-colors hover:text-t1"
          >
            Privacy Policy
            <svg className="h-3.5 w-3.5 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
          <a
            href="https://simular.ai/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-[13px] text-t2 transition-colors hover:text-t1"
          >
            Terms of Service
            <svg className="h-3.5 w-3.5 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      <div className="h-px bg-b1" />

      <div>
        <div className="text-[14px] font-semibold text-t1">Support</div>
        <div className="mt-3 flex flex-col gap-2.5">
          <a
            href="mailto:support@simular.ai"
            className="flex items-center justify-between text-[13px] text-t2 transition-colors hover:text-t1"
          >
            support@simular.ai
            <svg className="h-3.5 w-3.5 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </a>
          <a
            href="https://simular.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-[13px] text-t2 transition-colors hover:text-t1"
          >
            simular.ai
            <svg className="h-3.5 w-3.5 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-t4">
        &copy; 2026 Simular, Inc. All rights reserved.
      </div>
    </div>
  );
}

function PlaceholderSection({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center text-[13px] text-t4">
      {label} settings
    </div>
  );
}
