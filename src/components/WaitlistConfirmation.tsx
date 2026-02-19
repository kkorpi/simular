"use client";

import { SimularLogo } from "./SimularLogo";

const iconCls = "h-4 w-4 text-t3";

const sandboxTeasers = [
  {
    icon: (
      <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: "Research a founder",
    detail: "Pull LinkedIn, X, Crunchbase data and compile a one-pager",
  },
  {
    icon: (
      <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Daily deal sourcing",
    detail: "Scan funding news every morning and deliver a briefing",
  },
  {
    icon: (
      <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    title: "Draft follow-up emails",
    detail: "After meetings, auto-draft personalized thank-you emails",
  },
  {
    icon: (
      <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: "Track LP touchpoints",
    detail: "Monitor relationship cadence and suggest outreach",
  },
];

interface WaitlistConfirmationProps {
  email: string;
  position: number;
}

export function WaitlistConfirmation({ email, position }: WaitlistConfirmationProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg px-8">
      <div className="w-full max-w-[540px]">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <SimularLogo size={40} />
        </div>

        {/* Position number */}
        <div className="animate-fade-in text-center">
          <div className="text-[14px] font-medium text-t3">You&apos;re</div>
          <div className="mt-1 text-[56px] font-bold leading-none tracking-tight text-blt">
            #{position}
          </div>
          <div className="mt-2 text-[18px] font-medium text-t1">on the waitlist</div>
        </div>

        {/* Confirmation */}
        <p className="mt-6 text-center text-[14px] leading-[1.6] text-t3">
          We&apos;ll email <span className="font-medium text-t1">{email}</span> the moment a spot opens. Invites go out in order, first come first served.
        </p>

        {/* Sandbox teaser */}
        <div className="mt-10">
          <div className="mb-4 text-center text-[13px] font-medium text-t3">
            While you wait, see what Simular can do
          </div>

          <div className="flex flex-col gap-2.5">
            {sandboxTeasers.map((teaser, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 rounded-lg border border-b1 bg-bg2/50 px-4 py-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-bg3">
                  {teaser.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-t1">{teaser.title}</div>
                  <div className="text-[11px] text-t4">{teaser.detail}</div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-blt">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Preview
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
