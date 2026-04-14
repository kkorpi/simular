"use client";

import { useState, useRef, useEffect } from "react";
import { getService, twoFactorField, type ServiceConfig, type AuthField, type OAuthProvider } from "@/data/serviceRegistry";

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
        <div className="absolute right-0 top-full z-20 origin-top mt-1 w-[260px] overflow-hidden rounded-lg border border-b1 bg-bg2 py-1.5 shadow-[var(--sc)]">
          {onOpenSettings && (
            <button
              type="button"
              onClick={() => { setOpen(false); onOpenSettings(); }}
              className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-t2 transition-colors hover:bg-bg3 hover:text-t1"
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
              className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-t2 transition-colors hover:bg-bg3 hover:text-t1"
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

/* ── OAuth provider logos ── */

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
      <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

function GitHubProviderLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const OAUTH_PROVIDER_CONFIG: Record<OAuthProvider, { name: string; Logo: React.FC<{ className?: string }>; className: string }> = {
  google: { name: "Google", Logo: GoogleLogo, className: "bg-oauth-google-bg text-oauth-google-text hover:brightness-95 shadow-sm" },
  apple: { name: "Apple", Logo: AppleLogo, className: "bg-oauth-apple-bg text-oauth-apple-text hover:brightness-110" },
  microsoft: { name: "Microsoft", Logo: MicrosoftLogo, className: "bg-oauth-google-bg text-oauth-google-text hover:brightness-95 shadow-sm" },
  github: { name: "GitHub", Logo: GitHubProviderLogo, className: "bg-brand-github text-white hover:brightness-125" },
  facebook: { name: "Facebook", Logo: FacebookLogo, className: "bg-brand-facebook text-white hover:brightness-110" },
};

function OAuthButton({ provider, onClick }: { provider: OAuthProvider; onClick: () => void }) {
  const config = OAUTH_PROVIDER_CONFIG[provider];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md px-3.5 py-2 text-[12px] font-medium transition-colors ${config.className}`}
    >
      <config.Logo className="h-3.5 w-3.5 shrink-0" />
      Sign in with {config.name}
    </button>
  );
}

/* ── Auth state types ── */

export type AuthInputState = "pending" | "2fa" | "failed" | "captcha";

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
  /** Called when user selects an OAuth provider (e.g., "Continue with Google") */
  onOAuthSelect?: (provider: OAuthProvider) => void;
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
  onOAuthSelect,
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
      <div className="mx-auto max-w-[480px] rounded-lg border border-b1 bg-bgcard transition-colors">
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
              className="w-[140px] rounded-md border border-b1 bg-bgi px-3 py-2 text-center font-mono text-[14px] tracking-[0.15em] text-t1 outline-none transition-colors placeholder:text-t4 focus:border-b2"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-b1 px-4 py-2.5">
          <button
            type="button"
            onClick={onCancel2FA}
            className="rounded-md px-3 py-1.5 text-[12px] font-medium text-t3 transition-colors hover:text-t2"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmitCode}
            disabled={!twoFactorCode.trim()}
            className={`rounded-md px-4 py-1.5 text-[12px] font-medium text-white transition-colors ${
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

  // ── CAPTCHA State ──
  if (state === "captcha") {
    return (
      <div className="mx-auto max-w-[480px] rounded-lg border border-b1 bg-bgcard transition-colors">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <ServiceIcon serviceId={serviceId} service={service} />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium text-t1">Verification needed</div>
          </div>
        </div>

        {/* Body */}
        <div className="border-t border-b1 px-4 py-4">
          <div className="flex items-center gap-2.5">
            <svg className="h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div className="text-[13px] text-t2">
              I&apos;ve run into a verification challenge on this site. You&apos;ll need to solve it in your workspace.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-b1 px-4 py-2.5">
          <button
            type="button"
            onClick={onSkip}
            className="rounded-md px-3 py-1.5 text-[12px] font-medium text-t3 transition-colors hover:text-t2"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={onManualSignIn}
            className="flex items-center gap-1.5 rounded-md bg-as px-4 py-1.5 text-[12px] font-medium text-white transition-colors hover:brightness-110"
          >
            Open workspace
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
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
        {/* Error message */}
        {state === "failed" && errorMessage && (
          <div className="mb-3 flex items-center gap-1.5 rounded-md bg-rd/[0.08] px-2.5 py-2 text-[12px] text-rd">
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errorMessage}
          </div>
        )}

        {/* OAuth buttons */}
        {service.oauthProviders && service.oauthProviders.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {service.oauthProviders.map((provider) => (
                <OAuthButton key={provider} provider={provider} onClick={() => onOAuthSelect?.(provider)} />
              ))}
            </div>
            <div className="relative mb-3">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-b1" /></div>
              <div className="relative flex justify-center"><span className="bg-bgcard px-2 text-[11px] text-t4">or</span></div>
            </div>
          </>
        )}

        {/* Fields */}
        <div className="flex flex-col gap-3">
          {service.fields.map((field, i) => (
            <div key={field.key}>
              <label className="mb-1 flex items-center justify-between text-[12px] font-medium text-t2">{field.label}</label>
              <div className="relative">
                <input
                  ref={i === 0 ? firstInputRef : undefined}
                  type={field.type === "password" && !showPasswords[field.key] ? "password" : field.type === "email" ? "email" : "text"}
                  autoComplete={field.autoComplete}
                  value={values[field.key] ?? ""}
                  onChange={(e) => updateValue(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-md border border-b1 bg-bgi px-3 py-2 text-[13px] text-t1 outline-none transition-colors placeholder:text-t4 focus:border-b2"
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

        {/* Trust signal */}
        <div className="flex items-center gap-1.5 mt-3 text-[11px] text-t3">
          <svg className="h-3 w-3 shrink-0 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Encrypted. Used to sign in on your behalf. Never shared.
        </div>
      </form>

      {/* Actions — just Skip + Connect */}
      <div className="flex items-center justify-between border-t border-b1 px-4 py-2.5">
        <button
          type="button"
          onClick={onSkip}
          className="rounded-md px-3 py-1.5 text-[12px] font-medium text-t3 transition-colors hover:text-t2"
        >
          Skip
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="rounded-md px-4 py-1.5 text-[12px] font-medium text-white transition-colors hover:brightness-110"
          style={{ backgroundColor: service.brandColor }}
        >
          Connect
        </button>
      </div>
    </div>
  );
}
