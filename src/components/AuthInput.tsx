"use client";

import { useState, useRef, useEffect } from "react";
import { getService, twoFactorField, type ServiceConfig, type AuthField } from "@/data/serviceRegistry";

/* ── Service logo SVGs ── */

function LinkedInLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GmailLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function SalesforceLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.006 5.17a4.015 4.015 0 012.975-1.32 4.06 4.06 0 013.752 2.512 3.315 3.315 0 011.307-.264 3.372 3.372 0 013.373 3.372 3.37 3.37 0 01-.144.984 2.87 2.87 0 011.731 2.639 2.872 2.872 0 01-2.872 2.872 2.855 2.855 0 01-.594-.062 3.534 3.534 0 01-3.159 1.967 3.524 3.524 0 01-1.7-.437 3.82 3.82 0 01-3.376 2.032 3.82 3.82 0 01-3.48-2.25 3.118 3.118 0 01-.66.072 3.128 3.128 0 01-2.815-4.473A3.268 3.268 0 013 10.02a3.268 3.268 0 013.096-3.262 4.015 4.015 0 013.91-1.588z" />
    </svg>
  );
}

/** Known service IDs that have brand logos */
const KNOWN_SERVICES = new Set(["linkedin", "gmail", "salesforce"]);

function ServiceLogo({ serviceId, className }: { serviceId: string; className?: string }) {
  switch (serviceId) {
    case "linkedin":
      return <LinkedInLogo className={className} />;
    case "gmail":
      return <GmailLogo className={className} />;
    case "salesforce":
      return <SalesforceLogo className={className} />;
    default:
      return null;
  }
}

/** Service icon: branded square for known services, letter initial for unknown */
function ServiceIcon({ serviceId, service }: { serviceId: string; service: ServiceConfig }) {
  if (KNOWN_SERVICES.has(serviceId)) {
    return (
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: service.brandColor }}
      >
        <ServiceLogo serviceId={serviceId} className="h-4 w-4 text-white" />
      </div>
    );
  }
  // Unknown service — show first letter in a neutral square
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-bg3">
      <span className="text-[13px] font-semibold text-t2">
        {service.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

/* ── Overflow menu ── */

function OverflowMenu({ onOpenSettings, onManualSignIn }: {
  onOpenSettings?: () => void;
  onManualSignIn?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!onOpenSettings && !onManualSignIn) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-t4 transition-colors hover:bg-bg3 hover:text-t2"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-[260px] overflow-hidden rounded-lg border border-b1 bg-bg2 py-1.5 shadow-[var(--sc)]">
          {onOpenSettings && (
            <button
              type="button"
              onClick={() => { setOpen(false); onOpenSettings(); }}
              className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-t2 transition-all hover:bg-bg3 hover:text-t1"
            >
              <span className="text-t3">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
              </span>
              Manage services
            </button>
          )}
          {onManualSignIn && (
            <button
              type="button"
              onClick={() => { setOpen(false); onManualSignIn(); }}
              className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-t2 transition-all hover:bg-bg3 hover:text-t1"
            >
              <span className="text-t3">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </span>
              Sign in manually in workspace
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Auth state types ── */

export type AuthInputState = "pending" | "2fa" | "failed";

export interface AuthInputProps {
  /** Service identifier (e.g., "linkedin", "gmail") */
  serviceId: string;
  /** Current auth state */
  state: AuthInputState;
  /** Error message to display (for failed state) */
  errorMessage?: string;
  /** Called when user submits credentials */
  onSubmit: (values: Record<string, string>) => void;
  /** Called when user clicks Skip */
  onSkip?: () => void;
  /** Called when user clicks "sign in manually" escape hatch */
  onManualSignIn?: () => void;
  /** Called when user submits 2FA code */
  onSubmit2FA?: (code: string) => void;
  /** Called when user cancels 2FA */
  onCancel2FA?: () => void;
  /** Opens Settings > Connected Services */
  onOpenSettings?: () => void;
}

/* ── Component ── */

export function AuthInput({
  serviceId,
  state,
  errorMessage,
  onSubmit,
  onSkip,
  onManualSignIn,
  onSubmit2FA,
  onCancel2FA,
  onOpenSettings,
}: AuthInputProps) {
  const service = getService(serviceId);
  const [values, setValues] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus first input on mount or state change
  useEffect(() => {
    if (state === "2fa") {
      setTimeout(() => codeInputRef.current?.focus(), 100);
    } else {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [state]);

  const updateValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.trim()) {
      onSubmit2FA?.(twoFactorCode.trim());
    }
  };

  // ── 2FA State ──
  if (state === "2fa") {
    return (
      <div className="rounded-lg border border-b1 bg-bgcard transition-colors">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <ServiceIcon serviceId={serviceId} service={service} />
          <div className="text-[13px] font-medium text-t1">Verification needed</div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmitCode} className="border-t border-b1 px-4 py-3">
          <div className="text-[12px] text-t3 mb-3">
            Enter the code sent to your device
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-medium text-t2">
              Code
            </label>
            <input
              ref={codeInputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="000000"
              maxLength={8}
              className="w-[140px] rounded-md border border-b1 bg-bgi px-3 py-2 text-center font-mono text-[14px] tracking-[0.15em] text-t1 outline-none transition-all placeholder:text-t4 focus:border-b2"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-b1 px-4 py-2.5">
          <button
            type="button"
            onClick={onCancel2FA}
            className="rounded-md px-3 py-1.5 text-[12px] font-medium text-t3 transition-all hover:text-t2"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmitCode}
            disabled={!twoFactorCode.trim()}
            className={`rounded-md px-4 py-1.5 text-[12px] font-medium text-white transition-all ${
              twoFactorCode.trim()
                ? "hover:brightness-110"
                : "opacity-50 cursor-default"
            }`}
            style={{ backgroundColor: service.brandColor }}
          >
            Verify
          </button>
        </div>
      </div>
    );
  }

  // ── Pending / Failed State ──
  return (
    <div className="rounded-lg border border-b1 bg-bgcard transition-colors">
      {/* Header with service logo + overflow menu */}
      <div className="flex items-center gap-3 px-4 py-3">
        <ServiceIcon serviceId={serviceId} service={service} />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium text-t1">
            Connect Sai to {service.name}
          </div>
        </div>
        <OverflowMenu onOpenSettings={onOpenSettings} onManualSignIn={onManualSignIn} />
      </div>

      {/* Trust signal + form */}
      <form onSubmit={handleSubmit} className="border-t border-b1 px-4 py-3">
        {/* Trust signal */}
        <div className="flex items-center gap-1.5 mb-3 text-[11px] text-t3">
          <svg
            className="h-3 w-3 shrink-0 text-g"
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
          Encrypted. Used to sign in on your behalf. Never shared.
        </div>

        {/* Error message */}
        {state === "failed" && errorMessage && (
          <div className="mb-3 flex items-center gap-1.5 rounded-md bg-rd/[0.08] px-2.5 py-2 text-[12px] text-rd">
            <svg
              className="h-3.5 w-3.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errorMessage}
          </div>
        )}

        {/* Fields */}
        <div className="flex flex-col gap-3">
          {service.fields.map((field, i) => (
            <div key={field.key}>
              <label className="mb-1 flex items-center justify-between text-[12px] font-medium text-t2">
                {field.label}
              </label>
              <div className="relative">
                <input
                  ref={i === 0 ? firstInputRef : undefined}
                  type={
                    field.type === "password" && !showPasswords[field.key]
                      ? "password"
                      : field.type === "email"
                        ? "email"
                        : "text"
                  }
                  autoComplete={field.autoComplete}
                  value={values[field.key] ?? ""}
                  onChange={(e) => updateValue(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-md border border-b1 bg-bgi px-3 py-2 text-[13px] text-t1 outline-none transition-all placeholder:text-t4 focus:border-b2"
                />
                {field.type === "password" && (
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field.key)}
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
      </form>

      {/* Actions — just Skip + Connect */}
      <div className="flex items-center justify-between border-t border-b1 px-4 py-2.5">
        <button
          type="button"
          onClick={onSkip}
          className="rounded-md px-3 py-1.5 text-[12px] font-medium text-t3 transition-all hover:text-t2"
        >
          Skip
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="rounded-md px-4 py-1.5 text-[12px] font-medium text-white transition-all hover:brightness-110"
          style={{ backgroundColor: service.brandColor }}
        >
          Connect
        </button>
      </div>
    </div>
  );
}
