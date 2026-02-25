"use client";

import { useState } from "react";
import { SimularLogo } from "./SimularLogo";

interface SignupPaymentProps {
  onSubmit: () => void;
  onBack: () => void;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + " / " + digits.slice(2);
  return digits;
}

export function SignupPayment({ onSubmit, onBack }: SignupPaymentProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");
  const [processing, setProcessing] = useState(false);

  const trialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const allFilled = cardNumber.replace(/\s/g, "").length >= 12 && expiry.replace(/\D/g, "").length === 4 && cvc.length >= 3 && zip.length >= 3;

  const handleSubmit = () => {
    if (!allFilled || processing) return;
    setProcessing(true);
    setTimeout(() => onSubmit(), 1500);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg px-8">
      <div className="w-full max-w-[460px]">
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
                i < 2 ? "bg-as" : "bg-blt animate-pulse"
              }`}
            />
          ))}
        </div>

        <h2 className="text-center text-[22px] font-semibold text-t1">
          Start your free trial
        </h2>

        {/* Trial badge */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-as/25 bg-as/[0.06] px-4 py-2">
            <svg className="h-4 w-4 text-blt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[13px] font-medium text-blt">
              7-day free trial
            </span>
          </div>
        </div>

        {/* Trust framing */}
        <p className="mt-8 text-center text-[13px] leading-[1.7] text-t2">
          We ask for a card to keep out bots and ensure real people get these limited spots. You won&apos;t be charged for 7 days. Cancel anytime.
        </p>

        {/* Mock card form */}
        <div className="mt-6 overflow-hidden rounded-lg border border-b1 bg-bg3">
          {/* Card number row */}
          <div className="flex items-center border-b border-b1 px-4">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="Card number"
              className="h-12 flex-1 bg-transparent font-mono text-[15px] text-t1 placeholder:text-t4 focus:outline-none"
              disabled={processing}
            />
            <svg className="h-5 w-7 text-t4" viewBox="0 0 34 24" fill="none">
              <rect x="0.5" y="0.5" width="33" height="23" rx="3.5" stroke="currentColor" />
              <rect x="3" y="5" width="8" height="6" rx="1" fill="currentColor" opacity="0.4" />
              <line x1="3" y1="15" x2="16" y2="15" stroke="currentColor" opacity="0.3" strokeWidth="2" />
              <line x1="3" y1="19" x2="10" y2="19" stroke="currentColor" opacity="0.2" strokeWidth="2" />
            </svg>
          </div>
          {/* Bottom row: expiry, CVC, zip */}
          <div className="flex">
            <div className="flex-1 border-r border-b1 px-4">
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM / YY"
                className="h-12 w-full bg-transparent font-mono text-[15px] text-t1 placeholder:text-t4 focus:outline-none"
                disabled={processing}
              />
            </div>
            <div className="flex-1 border-r border-b1 px-4">
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="CVC"
                className="h-12 w-full bg-transparent font-mono text-[15px] text-t1 placeholder:text-t4 focus:outline-none"
                disabled={processing}
              />
            </div>
            <div className="flex-1 px-4">
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                placeholder="ZIP"
                className="h-12 w-full bg-transparent font-mono text-[15px] text-t1 placeholder:text-t4 focus:outline-none"
                disabled={processing}
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!allFilled || processing}
          className={`mt-6 flex h-12 w-full items-center justify-center rounded-md text-[15px] font-medium transition-all ${
            allFilled && !processing
              ? "bg-as text-white hover:bg-as2"
              : "bg-bg3 text-t4 cursor-not-allowed"
          }`}
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Processing
            </div>
          ) : (
            "Start free trial"
          )}
        </button>

        {/* Fine print */}
        <p className="mt-3 text-center text-[12px] text-t4">
          You won&apos;t be charged until {trialEndDate}
        </p>

        {/* Back link */}
        <button
          onClick={onBack}
          disabled={processing}
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
