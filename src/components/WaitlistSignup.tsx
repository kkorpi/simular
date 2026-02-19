"use client";

import { useState } from "react";
import { SimularLogo } from "./SimularLogo";

const roles = [
  { id: "vc", label: "VC / Investor" },
  { id: "sales", label: "Sales" },
  { id: "marketing", label: "Marketing" },
  { id: "ops", label: "Operations" },
  { id: "founder", label: "Founder" },
  { id: "other", label: "Other" },
];

const apps = [
  { id: "gmail", label: "Gmail" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "salesforce", label: "Salesforce" },
  { id: "slack", label: "Slack" },
  { id: "hubspot", label: "HubSpot" },
  { id: "notion", label: "Notion" },
  { id: "google-sheets", label: "Google Sheets" },
  { id: "other", label: "Other" },
];

interface WaitlistSignupProps {
  onSubmit: (email: string, role?: string, appsUsed?: string[]) => void;
  onBack: () => void;
}

export function WaitlistSignup({ onSubmit, onBack }: WaitlistSignupProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [appsOpen, setAppsOpen] = useState(false);

  const toggleApp = (id: string) => {
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!email.trim()) return;
    onSubmit(
      email.trim(),
      role || undefined,
      selectedApps.length > 0 ? selectedApps : undefined
    );
  };

  const selectCls =
    "h-12 w-full appearance-none rounded-md border border-b1 bg-bg3 px-4 text-[14px] text-t1 transition-colors focus:border-as focus:outline-none";

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg px-8">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <SimularLogo size={40} />
        </div>

        <h2 className="text-center text-[22px] font-semibold text-t1">
          Get early access
        </h2>
        <p className="mt-2 text-center text-[14px] leading-[1.6] text-t3">
          Join the waitlist and we&apos;ll notify you when a spot opens
        </p>

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="you@company.com"
          className="mt-8 h-12 w-full rounded-md border border-b1 bg-bg3 px-4 text-[15px] text-t1 placeholder:text-t4 transition-colors focus:border-as focus:outline-none"
        />

        {/* Role dropdown */}
        <div className="relative mt-3">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={`${selectCls} ${!role ? "text-t4" : ""}`}
          >
            <option value="" disabled>
              What best describes your role?
            </option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-t4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Apps multi-select dropdown */}
        <div className="relative mt-3">
          <button
            type="button"
            onClick={() => setAppsOpen((o) => !o)}
            className={`${selectCls} flex items-center justify-between text-left ${
              selectedApps.length === 0 ? "text-t4" : ""
            }`}
          >
            <span className="truncate">
              {selectedApps.length === 0
                ? "Which apps or services do you use?"
                : selectedApps
                    .map((id) => apps.find((a) => a.id === id)?.label)
                    .join(", ")}
            </span>
            <svg
              className={`ml-2 h-4 w-4 shrink-0 text-t4 transition-transform ${appsOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {appsOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-10 rounded-md border border-b1 bg-bg2 py-1 shadow-lg">
              {apps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => toggleApp(app.id)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] text-t2 transition-colors hover:bg-bg3"
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      selectedApps.includes(app.id)
                        ? "border-ab bg-ab"
                        : "border-b2 bg-bg3"
                    }`}
                  >
                    {selectedApps.includes(app.id) && (
                      <svg
                        className="h-3 w-3 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {app.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!email.trim()}
          className={`mt-6 flex h-12 w-full items-center justify-center rounded-md text-[15px] font-medium transition-all ${
            email.trim()
              ? "bg-as text-white hover:bg-as2"
              : "bg-bg3 text-t4 cursor-not-allowed"
          }`}
        >
          Join the waitlist
        </button>

        {/* Back link */}
        <button
          onClick={onBack}
          className="mt-4 flex w-full items-center justify-center gap-1.5 text-[13px] text-t3 transition-colors hover:text-t1"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}
