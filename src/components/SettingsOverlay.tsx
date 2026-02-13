"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";

interface SettingsOverlayProps {
  open: boolean;
  onClose: () => void;
}

type SettingsSection =
  | "appearance"
  | "workspace"
  | "commands"
  | "skills"
  | "subscription"
  | "credits";

const sections: { id: SettingsSection; label: string }[] = [
  { id: "appearance", label: "Appearance" },
  { id: "workspace", label: "Workspace" },
  { id: "commands", label: "Commands" },
  { id: "skills", label: "Skills" },
  { id: "subscription", label: "Subscription" },
  { id: "credits", label: "Credits" },
];

export function SettingsOverlay({ open, onClose }: SettingsOverlayProps) {
  const [active, setActive] = useState<SettingsSection>("appearance");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 backdrop-blur-[5px]" onClick={onClose}>
      <div className="flex h-[560px] w-[720px] overflow-hidden rounded-2xl border border-b1 bg-bg shadow-[var(--sc)]" onClick={(e) => e.stopPropagation()}>
        {/* Left nav */}
        <div className="flex w-[200px] shrink-0 flex-col border-r border-b1 bg-bg2 py-4">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`px-5 py-2.5 text-left text-[13.5px] font-medium transition-all ${
                active === s.id
                  ? "text-t1"
                  : "text-t3 hover:text-t2"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Right content */}
        <div className="flex flex-1 flex-col overflow-y-auto">
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
            {active === "commands" && <PlaceholderSection label="Commands" />}
            {active === "skills" && <PlaceholderSection label="Skills" />}
            {active === "subscription" && <PlaceholderSection label="Subscription" />}
            {active === "credits" && <PlaceholderSection label="Credits" />}
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
            className={`rounded-lg border px-4 py-2 text-[13px] font-medium capitalize transition-all ${
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

  return (
    <div className="flex flex-col gap-6">
      {/* Agent settings */}
      <div>
        <div className="text-[14px] font-semibold text-t1">Agent settings</div>
        <div className="mt-4 flex flex-col gap-4">
          <SettingRow label="Thinking strength" hint>
            <select className="rounded-lg border border-b1 bg-bg3 px-3 py-1.5 text-[13px] text-t1 outline-none">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </SettingRow>

          <SettingRow label="Max steps per response" hint>
            <input
              type="number"
              defaultValue={20}
              className="w-[72px] rounded-lg border border-b1 bg-bg3 px-3 py-1.5 text-right text-[13px] text-t1 outline-none"
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
          />
          <IntegrationRow
            name="Calendar"
            description="View and manage events"
          />
          <IntegrationRow
            name="Sheets"
            description="Read and write spreadsheets"
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
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-2 rounded-full bg-t4" />
      <div className="flex-1">
        <span className="text-[13px] font-medium text-t1">{name}</span>
        <span className="ml-2 text-[12px] text-t3">{description}</span>
      </div>
      <button className="rounded-lg border border-b1 px-3 py-1.5 text-[12px] font-medium text-t2 transition-all hover:border-b2 hover:bg-bg3 hover:text-t1">
        Connect
      </button>
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

function PlaceholderSection({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center text-[13px] text-t4">
      {label} settings
    </div>
  );
}
