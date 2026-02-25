"use client";

import { useState } from "react";
import { SimularLogo } from "./SimularLogo";

interface SignupSSOProps {
  onSignIn: () => void;
  onBack: () => void;
}

export function SignupSSO({ onSignIn, onBack }: SignupSSOProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg px-8">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <SimularLogo size={40} />
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i === 0 ? "bg-as" : i === 1 ? "bg-blt animate-pulse" : "bg-bg3"
              }`}
            />
          ))}
        </div>

        <h2 className="text-center text-[22px] font-semibold text-t1">
          Create your account
        </h2>
        <p className="mt-2 text-center text-[14px] leading-[1.6] text-t3">
          Sign in with Google to continue
        </p>

        {/* TOS checkbox */}
        <button type="button" onClick={() => setAgreed((a) => !a)} className="mt-8 flex cursor-pointer items-start gap-2.5 text-left">
          {agreed ? (
            <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <div className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-[3px] border border-b2" />
          )}
          <span className="text-[13px] leading-[1.6] text-t3">
            By checking this box, I agree to{" "}
            <a href="https://simular.ai/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-t1 underline decoration-b2 underline-offset-2 hover:decoration-t3">Terms of Service</a> and{" "}
            <a href="https://simular.ai/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-t1 underline decoration-b2 underline-offset-2 hover:decoration-t3">Privacy Policy</a>
          </span>
        </button>

        {/* Google sign-in button */}
        <button
          onClick={onSignIn}
          disabled={!agreed}
          className={`mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-md text-[15px] font-medium transition-all ${
            agreed
              ? "bg-white text-[#1f1f1f] hover:bg-white/90 shadow-sm"
              : "bg-bg3 text-t4 cursor-not-allowed"
          }`}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill={agreed ? "#4285F4" : "currentColor"} />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill={agreed ? "#34A853" : "currentColor"} />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill={agreed ? "#FBBC05" : "currentColor"} />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill={agreed ? "#EA4335" : "currentColor"} />
          </svg>
          Sign in with Google
        </button>

        {/* Trust signals */}
        <div className="mt-8 flex items-center justify-center gap-4 text-[11px] text-t4">
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

        {/* Back link */}
        <button
          onClick={onBack}
          className="mt-6 flex w-full items-center justify-center gap-1.5 text-[13px] text-t3 transition-colors hover:text-t1"
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
