"use client";

import { useState, useEffect } from "react";
import { SimularLogo } from "./SimularLogo";

interface ProofPoint {
  icon: React.ReactNode;
  task: string;
  detail: string;
}

const iconCls = "h-4 w-4 text-t3";

const proofPoints: ProofPoint[] = [
  {
    icon: (
      <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    task: "Daily deal sourcing digest",
    detail: "Every morning at 7am",
  },
  {
    icon: (
      <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    task: "LP meeting prep briefing",
    detail: "48 hrs before each meeting",
  },
  {
    icon: (
      <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    task: "LP touchpoint tracker",
    detail: "Every Monday at 8am",
  },
  {
    icon: (
      <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    task: "Draft follow-up emails",
    detail: "After every meeting",
  },
];

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [agreed, setAgreed] = useState(false);
  const [visiblePoints, setVisiblePoints] = useState(0);

  // Stagger proof points in
  useEffect(() => {
    if (visiblePoints >= proofPoints.length) return;
    const timer = setTimeout(() => setVisiblePoints((v) => v + 1), 600);
    return () => clearTimeout(timer);
  }, [visiblePoints]);

  return (
    <div className="flex h-screen bg-bg1">
      {/* Left: value prop */}
      <div className="hidden flex-1 flex-col items-center justify-center px-16 lg:flex xl:px-24">
        <div className="w-full max-w-[480px]">
          <div className="flex justify-center">
            <SimularLogo size={36} />
          </div>

          <h1 className="mt-6 text-center text-[32px] font-semibold leading-[1.2] tracking-tight text-t1">
            Your AI coworker.<br />
            Always working.
          </h1>

          <p className="mt-4 text-center text-[15px] leading-[1.7] text-t3">
            Simular runs on a real machine, uses real apps, and does
            real work, even while you&apos;re away.
          </p>

          {/* Animated proof points */}
          <div className="mt-10 flex flex-col gap-3">
            {proofPoints.map((point, i) => (
              <div
                key={i}
                className={`flex items-center gap-3.5 rounded-lg border border-b1 bg-bg2/50 px-4 py-3 transition-all duration-500 ${
                  i < visiblePoints
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-bg3">
                  {point.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-t1">{point.task}</div>
                  <div className="text-[11px] text-t4">{point.detail}</div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-g">
                  <div className="h-1.5 w-1.5 rounded-full bg-g animate-pulse" />
                  Active
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-[12px] text-t4">
            You give it tasks. It does them. It keeps doing them.
          </p>
        </div>
      </div>

      {/* Right: sign-in card */}
      <div className="flex flex-1 items-center justify-center px-8 lg:flex-none lg:w-[440px] lg:border-l lg:border-b1 lg:bg-bg2/30">
        <div className="w-full max-w-[340px]">
          {/* Mobile-only logo */}
          <div className="mb-6 lg:hidden">
            <SimularLogo size={36} />
          </div>

          <h2 className="text-[20px] font-semibold text-t1">
            Welcome to Simular
          </h2>
          <p className="mt-1.5 text-[14px] leading-[1.6] text-t3">
            Sign in with your Google account to continue
          </p>

          {/* TOS checkbox */}
          <label className="mt-8 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-b2 bg-bg3 transition-colors checked:border-ab checked:bg-ab"
            />
            <span className="text-[13px] leading-[1.6] text-t3">
              By checking this box, I agree to{" "}
              <span className="font-medium text-t1">Terms of Services</span> and{" "}
              <span className="font-medium text-t1">Privacy Policy</span>
            </span>
          </label>

          {/* Sign in button */}
          <button
            onClick={onLogin}
            disabled={!agreed}
            className={`mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-md text-[15px] font-medium transition-all ${
              agreed
                ? "bg-white text-[#1f1f1f] hover:bg-white/90 shadow-sm"
                : "bg-bg3 text-t4 cursor-not-allowed"
            }`}
          >
            {/* Google "G" icon */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill={agreed ? "#4285F4" : "currentColor"}
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill={agreed ? "#34A853" : "currentColor"}
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill={agreed ? "#FBBC05" : "currentColor"}
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill={agreed ? "#EA4335" : "currentColor"}
              />
            </svg>
            Sign in with Google
          </button>

          {/* Trust signals */}
          <div className="mt-8 flex items-center gap-4 text-[11px] text-t4">
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
      </div>
    </div>
  );
}
