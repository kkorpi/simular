"use client";

import { useState, useEffect } from "react";

export function LoginRequestCard({
  service,
  onLogin,
  connected,
}: {
  service: string;
  onLogin: () => void;
  connected?: boolean;
}) {
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    if (!connected) {
      setFaded(false);
      return;
    }
    const timer = setTimeout(() => setFaded(true), 3000);
    return () => clearTimeout(timer);
  }, [connected]);

  if (connected) {
    return (
      <div className="mt-2">
        {/* Full green card — fades out */}
        <div
          className={`transition-all duration-700 ease-in-out ${
            faded
              ? "pointer-events-none max-h-0 opacity-0"
              : "max-h-[200px] opacity-100"
          }`}
        >
          <div className="max-w-[480px] overflow-hidden rounded-lg border border-g/30 bg-g/[0.04]">
            <div className="flex items-center gap-3.5 px-4 py-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-g/15">
                <svg className="h-5 w-5 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-t1">
                  Connected to {service}
                </div>
                <div className="mt-0.5 text-[12px] text-t3">
                  Signed in successfully. Continuing with your task.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsed inline confirmation — fades in */}
        <div
          className={`transition-all duration-700 ease-in-out ${
            faded
              ? "max-h-8 opacity-70"
              : "pointer-events-none max-h-0 opacity-0"
          }`}
        >
          <div className="flex items-center gap-1.5 text-[12px] text-t3">
            <svg className="h-3.5 w-3.5 shrink-0 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Connected to {service}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 max-w-[480px] overflow-hidden rounded-lg border border-b1 bg-bgcard">
      <div className="flex items-center gap-3.5 px-4 py-3.5">
        {/* LinkedIn logo */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#0A66C2]">
          <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium text-t1">
            I need access to your {service}
          </div>
          <div className="mt-0.5 text-[12px] text-t3">
            Sign in on your workspace and I&apos;ll take it from here.
          </div>
        </div>
      </div>

      {/* Footer with trust signal + CTA */}
      <div className="flex items-center justify-between border-t border-b1 px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-[11px] text-t3">
          <svg
            className="h-3 w-3 text-g"
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
          Credentials stay in your workspace
        </div>
        <button
          onClick={onLogin}
          className="rounded-md bg-[#0A66C2] px-3.5 py-1.5 text-[12px] font-medium text-white transition-all hover:brightness-110"
        >
          Sign in to {service}
        </button>
      </div>
    </div>
  );
}
