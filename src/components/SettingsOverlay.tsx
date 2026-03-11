"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { serviceRegistry, getService } from "@/data/serviceRegistry";

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
  onDisconnectService?: (serviceId: string) => void;
  onDisconnectAllServices?: () => void;
  onConnectService?: (serviceId: string, values: Record<string, string>) => void;
}

type SettingsSection =
  | "appearance"
  | "workspace"
  | "services"
  | "commands"
  | "skills"
  | "subscription"
  | "credits"
  | "about";

const sections: { id: SettingsSection; label: string }[] = [
  { id: "appearance", label: "Appearance" },
  { id: "workspace", label: "Workspace" },
  { id: "services", label: "Connected Services" },
  { id: "commands", label: "Commands" },
  { id: "skills", label: "Skills" },
  { id: "subscription", label: "Subscription" },
  { id: "credits", label: "Credits" },
  { id: "about", label: "About" },
];

export { type SettingsSection };

export function SettingsOverlay({ open, onClose, initialSection, onOpenCardGallery, onOpenDesignSystem, trialDaysLeft = 6, trialCancelled, onCancelTrial, onReactivateTrial, connectedServices = [], onDisconnectService, onDisconnectAllServices, onConnectService }: SettingsOverlayProps) {
  const [active, setActive] = useState<SettingsSection>(initialSection || "appearance");

  // Sync when initialSection changes (e.g., from slash command)
  useEffect(() => {
    if (initialSection && open) setActive(initialSection);
  }, [initialSection, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 backdrop-blur-[5px]" onClick={onClose}>
      <div className="flex h-[640px] w-[840px] max-md:h-full max-md:w-full max-md:rounded-none overflow-hidden rounded-2xl border border-b1 max-md:border-0 bg-bg shadow-[var(--sc)] max-md:flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Left nav (desktop) / Top nav (mobile) */}
        <div className="flex w-[200px] shrink-0 flex-col border-r border-b1 bg-bg2 py-4 max-md:w-full max-md:flex-row max-md:items-center max-md:border-r-0 max-md:border-b max-md:py-2 max-md:px-2 max-md:gap-0 max-md:overflow-x-auto">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`px-5 py-2.5 text-left text-[13.5px] font-medium transition-all max-md:px-3 max-md:py-1.5 max-md:text-center max-md:text-[12px] max-md:whitespace-nowrap max-md:rounded-md max-md:shrink-0 ${
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
                  className="flex items-center gap-2 px-5 py-2.5 text-left text-[13.5px] font-medium text-t3 transition-all hover:text-t2"
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
                  className="flex items-center gap-2 px-5 py-2.5 text-left text-[13.5px] font-medium text-t3 transition-all hover:text-t2"
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
              <span className="font-medium text-t1">
                {sections.find((s) => s.id === active)?.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-md text-t3 transition-all hover:bg-bg3 hover:text-t1"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-5">
            {active === "appearance" && <AppearanceSettings />}
            {active === "workspace" && <WorkspaceSettings />}
            {active === "services" && <ConnectedServicesSettings services={connectedServices} onDisconnect={onDisconnectService} onDisconnectAll={onDisconnectAllServices} onConnectService={onConnectService} />}
            {active === "commands" && <PlaceholderSection label="Commands" />}
            {active === "skills" && <SkillsSettings />}
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
            className={`rounded-md border px-4 py-2 text-[13px] font-medium capitalize transition-all ${
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

/* ── Workspace (unified agent settings) ── */
function WorkspaceSettings() {
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
                <div className="absolute right-0 top-[calc(100%+4px)] z-10 w-[120px] rounded-md border border-b1 bg-bg2 py-1 shadow-lg">
                  {thinkingOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setThinkingStrength(opt); setThinkingOpen(false); }}
                      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] transition-colors hover:bg-bg3 ${opt === thinkingStrength ? "text-t1" : "text-t3"}`}
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

      <div className="h-px bg-b1" />

      {/* Integrations */}
      <div>
        <div className="flex items-center gap-2">
          <div className="text-[14px] font-semibold text-t1">Integrations</div>
          <HintIcon />
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <IntegrationRow
            name="Gmail"
            description="Read, draft, and send emails"
            connected
          />
          <IntegrationRow
            name="Calendar"
            description="View and manage events"
            connected
          />
          <IntegrationRow
            name="Google Docs"
            description="Create and edit documents"
            connected
          />
          <IntegrationRow
            name="Sheets"
            description="Read and write spreadsheets"
            connected
          />
          <IntegrationRow
            name="LinkedIn"
            description="Browse profiles and company pages"
            connected
          />
          <IntegrationRow
            name="Salesforce"
            description="Access CRM records and deal pipeline"
            connected
          />
          <IntegrationRow
            name="Crunchbase"
            description="Search funding rounds and company data"
          />
          <IntegrationRow
            name="Granola"
            description="Pull meeting notes and transcripts"
            connected
          />
          <IntegrationRow
            name="Slack"
            description="Send and read messages"
          />
          <IntegrationRow
            name="Notion"
            description="Read and write workspace pages"
          />
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

function IntegrationRow({
  name,
  description,
  connected,
}: {
  name: string;
  description: string;
  connected?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-2 w-2 rounded-full ${connected ? "bg-g" : "bg-t4"}`} />
      <div className="flex-1">
        <span className="text-[13px] font-medium text-t1">{name}</span>
        <span className="ml-2 text-[12px] text-t3">{description}</span>
      </div>
      {connected ? (
        <span className="px-3 py-1.5 text-[12px] font-medium text-t3">Connected</span>
      ) : (
        <button className="rounded-md border border-b1 px-3 py-1.5 text-[12px] font-medium text-t2 transition-all hover:border-b2 hover:bg-bg3 hover:text-t1">
          Connect
        </button>
      )}
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

/* ── Connected Services ── */
function ConnectedServicesSettings({
  services,
  onDisconnect,
  onDisconnectAll,
  onConnectService,
}: {
  services: ConnectedServiceInfo[];
  onDisconnect?: (serviceId: string) => void;
  onDisconnectAll?: () => void;
  onConnectService?: (serviceId: string, values: Record<string, string>) => void;
}) {
  const [addingService, setAddingService] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const connectedIds = new Set(services.map((s) => s.id));
  const availableServices = Object.values(serviceRegistry).filter((s) => !connectedIds.has(s.id));

  const handleSelectService = (serviceId: string) => {
    setAddingService(serviceId);
    setPickerOpen(false);
    setFormValues({});
    setShowPasswords({});
  };

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addingService) {
      onConnectService?.(addingService, formValues);
      setAddingService(null);
      setFormValues({});
    }
  };

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

  const addingConfig = addingService ? getService(addingService) : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-[14px] font-semibold text-t1">Connected Services</div>
        <div className="mt-1 text-[12.5px] text-t3">
          Services Sai can sign into on your behalf.
        </div>
      </div>

      {services.length > 0 ? (
        <div className="flex flex-col gap-3">
          {services.map((svc) => (
            <div key={svc.id} className="flex items-center gap-3 rounded-lg border border-b1 bg-bg3/50 px-4 py-3">
              <div className="h-2 w-2 shrink-0 rounded-full bg-g" />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-t1">{svc.name}</div>
                <div className="mt-0.5 text-[11px] text-t3">
                  Connected &middot; Last used {timeAgo(svc.connectedAt)}
                </div>
              </div>
              <button
                onClick={() => onDisconnect?.(svc.id)}
                className="rounded-md border border-b1 px-3 py-1.5 text-[12px] font-medium text-t3 transition-all hover:border-rd/30 hover:text-rd"
              >
                Disconnect
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-b1 bg-bg3/30 px-4 py-6 text-center">
          <div className="text-[13px] text-t3">No services connected yet.</div>
          <div className="mt-1 text-[12px] text-t4">Connect services below so Sai can sign in when a task requires access.</div>
        </div>
      )}

      {/* Connect a service — picker or inline form */}
      {addingConfig ? (
        <div className="rounded-lg border border-b1 bg-bg3/50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-b1">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-md"
                style={{ backgroundColor: addingConfig.brandColor }}
              >
                <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <span className="text-[13px] font-medium text-t1">Connect {addingConfig.name}</span>
            </div>
            <button
              onClick={() => { setAddingService(null); setFormValues({}); }}
              className="text-t4 transition-colors hover:text-t2"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleConnectSubmit} className="px-4 py-3">
            <div className="flex flex-col gap-3">
              {addingConfig.fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-[12px] font-medium text-t2">{field.label}</label>
                  <div className="relative">
                    <input
                      type={field.type === "password" && !showPasswords[field.key] ? "password" : field.type === "email" ? "email" : "text"}
                      autoComplete={field.autoComplete}
                      value={formValues[field.key] ?? ""}
                      onChange={(e) => setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full rounded-md border border-b1 bg-bgi px-3 py-2 text-[13px] text-t1 outline-none transition-all placeholder:text-t4 focus:border-b2"
                    />
                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPasswords((prev) => ({ ...prev, [field.key]: !prev[field.key] }))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-t4 transition-colors hover:text-t2"
                        tabIndex={-1}
                      >
                        {showPasswords[field.key] ? (
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => { setAddingService(null); setFormValues({}); }}
                className="rounded-md px-3 py-1.5 text-[12px] font-medium text-t3 transition-all hover:text-t2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md px-4 py-1.5 text-[12px] font-medium text-white transition-all hover:brightness-110"
                style={{ backgroundColor: addingConfig.brandColor }}
              >
                Connect
              </button>
            </div>
          </form>
        </div>
      ) : availableServices.length > 0 ? (
        <div className="relative" ref={pickerRef}>
          <button
            onClick={() => setPickerOpen(!pickerOpen)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-b2 px-4 py-3 text-[12px] font-medium text-t3 transition-all hover:border-b2 hover:bg-bg3/50 hover:text-t2"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Connect a service
          </button>

          {pickerOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-10 rounded-lg border border-b1 bg-bg2 py-1 shadow-lg">
              {availableServices.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => handleSelectService(svc.id)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-bg3"
                >
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: svc.brandColor }}
                  >
                    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-t1">{svc.name}</div>
                    <div className="text-[11px] text-t3">{svc.trustDomain}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Trust signal */}
      <div className="flex items-center gap-2 text-[11.5px] text-t3">
        <svg
          className="h-3.5 w-3.5 shrink-0 text-g"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        Credentials are encrypted and stored in your private workspace. They are used only to sign in to services on your behalf.
      </div>

      {services.length > 1 && (
        <>
          <div className="h-px bg-b1" />
          <button
            onClick={onDisconnectAll}
            className="text-[12px] font-medium text-t3 transition-all hover:text-rd"
          >
            Disconnect all services
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
          <div className="text-[13px] font-medium text-am">Trial cancelled</div>
          <div className="mt-1 text-[12px] text-t3">
            Your workspace stays active for {trialDaysLeft} more day{trialDaysLeft !== 1 ? "s" : ""}. After that, you&apos;ll lose access.
          </div>
          <button
            onClick={onReactivateTrial}
            className="mt-3 flex h-8 w-full items-center justify-center rounded-md border border-amber-500/30 text-[12px] font-medium text-am transition-all hover:bg-amber-500/10"
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
                className={`relative rounded-[5px] px-3 py-1 text-[11px] font-semibold transition-all ${
                  selectedPlan === p
                    ? "bg-bg2 text-t1 shadow-sm"
                    : "text-t3 hover:text-t2"
                }`}
              >
                {plans[p].name}
                {p === "plus" && (
                  <span className={`ml-1.5 text-[9px] font-semibold ${trialCancelled ? "text-am" : "text-blt"}`}>{trialCancelled ? "CANCELLED" : "CURRENT"}</span>
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
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${isUrgent ? "bg-amber-500/15 text-am" : "bg-as/15 text-blt"}`}>
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
                <span className={trialCancelled ? "font-medium text-t4" : isUrgent ? "font-medium text-am" : ""}>{trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} left</span>
              </div>
              <div className="h-1.5 rounded-full bg-b1">
                <div className={`h-1.5 rounded-full ${trialCancelled ? "bg-t4" : isUrgent ? "bg-am" : "bg-as"}`} style={{ width: `${trialPct}%` }} />
              </div>
            </div>
          )}

          {/* Upgrade button (Pro only) */}
          {selectedPlan === "pro" && (
            <button className="mt-3 flex h-9 w-full items-center justify-center rounded-md bg-as text-[13px] font-medium text-white transition-all hover:bg-as2">
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
            <button className="mt-3 rounded-md border border-b1 px-3 py-1.5 text-[12px] font-medium text-t2 transition-all hover:border-b2 hover:bg-bg3 hover:text-t1">
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
                  className="rounded-md border border-b1 px-3 py-1.5 text-[12px] font-medium text-t2 transition-all hover:bg-bg3"
                >
                  Keep my trial
                </button>
                <button
                  onClick={() => { setShowCancelConfirm(false); onCancelTrial?.(); }}
                  className="rounded-md bg-rd px-3 py-1.5 text-[12px] font-medium text-white transition-all hover:brightness-110"
                >
                  Cancel trial
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-[12px] font-medium text-t3 transition-all hover:text-rd"
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
        <button className="rounded-md border border-b1 px-3 py-1.5 text-[12px] font-medium text-t2 transition-all hover:bg-bg3">
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
