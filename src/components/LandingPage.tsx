"use client";

import { useState, useEffect } from "react";
import { SimularLogo } from "./SimularLogo";
import { VALID_INVITE_CODES, SEATS_TOTAL } from "@/data/mockData";

interface LandingPageProps {
  initialCode: string;
  seatsRemaining: number;
  capReached: boolean;
  onClaimSpot: (code: string) => void;
  onGoToWaitlist: () => void;
}

export function LandingPage({
  initialCode,
  seatsRemaining,
  capReached,
  onClaimSpot,
  onGoToWaitlist,
}: LandingPageProps) {
  const [code, setCode] = useState(initialCode);
  const [codeStatus, setCodeStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [shake, setShake] = useState(false);
  const [copied, setCopied] = useState(false);

  const demoCode = VALID_INVITE_CODES[0];

  const handleCopyDemo = () => {
    navigator.clipboard.writeText(demoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Auto-validate pre-filled code
  useEffect(() => {
    if (initialCode) {
      const valid = VALID_INVITE_CODES.includes(initialCode.toUpperCase());
      setCodeStatus(valid ? "valid" : "idle");
    }
  }, [initialCode]);

  const handleCodeChange = (value: string) => {
    setCode(value);
    setCodeStatus("idle");
    setShake(false);
  };

  const handleClaimSpot = () => {
    const valid = VALID_INVITE_CODES.includes(code.toUpperCase());
    if (valid) {
      setCodeStatus("valid");
      setTimeout(() => onClaimSpot(code.toUpperCase()), 800);
    } else {
      setCodeStatus("invalid");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg px-8">
      <div className="w-full max-w-[480px]">
        {/* Logo */}
        <div className="flex justify-center">
          <SimularLogo size={36} />
        </div>

        {/* Hero */}
        <h1 className="mt-6 text-center text-[32px] font-semibold leading-[1.2] tracking-tight text-t1">
          Your AI coworker.<br />
          Always working.
        </h1>
        <p className="mt-4 text-center text-[15px] leading-[1.7] text-t3">
          Simular runs on a real machine, uses real apps, and does
          real work, even while you&apos;re away.
        </p>

        {/* Card */}
        <div className="mt-8 rounded-lg border border-b1 bg-bg2 px-6 py-6">
          {!capReached ? (
            <>
              {/* Seat counter */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-as/25 bg-as/[0.06] px-3 py-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blt animate-pulse" />
                  <span className="text-[12px] font-medium text-blt">
                    {seatsRemaining} of {SEATS_TOTAL} spots left
                  </span>
                </div>
              </div>

              {/* Code input */}
              <div className="mt-5">
                <label className="mb-1.5 block text-[13px] font-medium text-t1">
                  Invite code
                </label>
                <div className={`transition-transform ${shake ? "animate-[shake_0.3s_ease-in-out]" : ""}`}>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleClaimSpot()}
                    placeholder="e.g. SIMULAR2026"
                    className={`h-12 w-full rounded-md border px-4 text-[15px] font-mono tracking-wider bg-bg3 text-t1 placeholder:text-t4 transition-colors focus:outline-none ${
                      codeStatus === "valid"
                        ? "border-g focus:border-g"
                        : codeStatus === "invalid"
                          ? "border-red-400 focus:border-red-400"
                          : "border-b1 focus:border-as"
                    }`}
                  />
                </div>
                {/* Validation feedback */}
                <div className="mt-2 h-4">
                  {codeStatus === "valid" && (
                    <div className="flex items-center gap-1.5 text-[12px] text-g animate-fade-in">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Code accepted
                    </div>
                  )}
                  {codeStatus === "invalid" && (
                    <div className="text-[12px] text-red-400 animate-fade-in">
                      Invalid code. Check your invite and try again.
                    </div>
                  )}
                </div>
              </div>

              {/* Claim button */}
              <button
                onClick={handleClaimSpot}
                disabled={!code.trim()}
                className={`mt-4 flex h-12 w-full items-center justify-center rounded-md text-[15px] font-medium transition-all ${
                  code.trim()
                    ? "bg-as text-white hover:bg-as2"
                    : "bg-bg3 text-t4 cursor-not-allowed"
                }`}
              >
                Claim my spot
              </button>

              {/* Waitlist link */}
              <button
                onClick={onGoToWaitlist}
                className="mt-5 flex w-full items-center justify-center gap-1.5 text-[13px] text-t3 transition-colors hover:text-t1"
              >
                No code? Get early access
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </>
          ) : (
            <>
              {/* Cap reached */}
              <div className="flex items-center gap-3 rounded-lg border border-b1 bg-bg3 px-4 py-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-am/10">
                  <svg className="h-4 w-4 text-am" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <div className="text-[14px] font-medium text-t1">All {SEATS_TOTAL} spots claimed</div>
                  <div className="text-[12px] text-t3">Join the waitlist to get notified when seats open</div>
                </div>
              </div>

              {/* Waitlist button */}
              <button
                onClick={onGoToWaitlist}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-md bg-as text-[15px] font-medium text-white transition-all hover:bg-as2"
              >
                Join the waitlist
              </button>
            </>
          )}
        </div>

        {/* Trust signals */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-t4">
          <div className="flex items-center gap-1.5">
            <svg className="h-3 w-3 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Private workspace
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-3 w-3 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            All activity logged
          </div>
        </div>
      </div>

      {/* Demo invite code pill */}
      <button
        onClick={handleCopyDemo}
        className="fixed bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-b1 bg-bg2 px-3 py-1.5 text-[11px] transition-colors hover:bg-bg3"
      >
        {copied ? (
          <span className="text-g">Copied!</span>
        ) : (
          <>
            <span className="text-t4">Try:</span>
            <span className="font-mono font-medium text-t2">{demoCode}</span>
          </>
        )}
      </button>
    </div>
  );
}
