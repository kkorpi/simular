"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SimularLogo } from "@/components/SimularLogo";
import { useIsMobile } from "@/hooks/useIsMobile";

/* ─── Types ─── */
type Screen = "landing" | "imessage" | "verify" | "linked";
type MsgFrom = "user" | "sai" | "typing";

interface Message {
  from: MsgFrom;
  text?: string;
  delay: number;
  preComposed?: boolean;
  isLink?: boolean;
}

/* ─── Conversation Script ─── */
const CONVERSATION: Message[] = [
  { from: "user", text: "Hey Sai, set up my phone", delay: 600, preComposed: true },
  { from: "typing", delay: 1400 },
  { from: "sai", text: "Hi! I'm Sai, your Simular assistant.\n\nI just sent you a verification code. Tap the link below to enter it:", delay: 0 },
  { from: "typing", delay: 800 },
  { from: "sai", text: "sai.co/verify", delay: 0, isLink: true },
];

/* Messages shown after verification */
const LINKED_MESSAGES: Message[] = [
  { from: "typing", delay: 800 },
  { from: "sai", text: "✅ Phone linked! You're all set.", delay: 0 },
  { from: "typing", delay: 1200 },
  { from: "sai", text: "I'm connected to Katie's iPhone. I can browse the web, manage your email, post to social — whatever you need.\n\nTry texting me something like:\n\n\"Check my email\"\n\"Post to LinkedIn: excited about Sai\"\n\"Find flights to SF next Friday\"", delay: 0 },
];

const VERIFY_CODE = "411139";

/* ─────────────────────────────────────────────
   Main Page Component
   ───────────────────────────────────────────── */
export default function SmsOnboardingPage() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [transitioning, setTransitioning] = useState(false);
  const isMobile = useIsMobile();

  const goTo = useCallback((next: Screen) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(next);
      setTransitioning(false);
    }, 280);
  }, []);

  return (
    <div className="flex h-dvh w-full items-center justify-center bg-bg">
      <div
        className={`relative flex h-full w-full max-w-[430px] flex-col overflow-hidden transition-[transform,opacity] duration-[280ms] ${
          transitioning ? "scale-[0.97] opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {screen === "landing" && <LandingScreen onContinue={() => goTo("imessage")} isMobile={isMobile} />}
        {screen === "imessage" && <IMessageScreen onLinkTap={() => goTo("verify")} />}
        {screen === "verify" && <VerifyScreen onVerified={() => goTo("linked")} />}
        {screen === "linked" && <LinkedScreen onRestart={() => goTo("landing")} />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Screen 1: Landing
   ───────────────────────────────────────────── */
function LandingScreen({ onContinue, isMobile }: { onContinue: () => void; isMobile: boolean }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex h-full flex-col items-center justify-center px-8 transition-[transform,opacity] duration-200 ${
        entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      {/* Badge */}
      <div className="mb-6 flex items-center gap-2 rounded-full border border-b1 bg-bg2 px-3.5 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-t3">SMS Access</span>
      </div>

      {/* Logo + Title */}
      <div className="mb-4 flex items-center gap-3">
        <SimularLogo size={40} />
        <span className="text-[28px] font-semibold text-t1">Sai</span>
      </div>

      {/* Value Prop */}
      <p className="mb-10 max-w-[300px] text-center text-[15px] leading-[1.6] text-t2">
        Browse the web, post to social media, and manage your email from a text message. No app needed, works with iMessage, and takes 20 seconds to set up.
      </p>

      {/* CTA */}
      <button
        onClick={onContinue}
        className="mb-6 flex h-[52px] w-full max-w-[300px] items-center justify-center gap-2 rounded-2xl bg-ab text-[15px] font-semibold text-abt transition-transform active:scale-[0.97]"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Sign up my phone
      </button>

      {/* QR Code (desktop only) */}
      {!isMobile && (
        <button onClick={onContinue} className="mt-2 flex flex-col items-center gap-2 group">
          <div className="text-[11px] text-t4">or scan from your phone</div>
          <QRCodeVisual />
        </button>
      )}

      {/* URL hint */}
      <div className="absolute bottom-6 flex items-center gap-1.5 text-[11px] text-t4">
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        sai.co/sms
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Screen 2: iMessage Simulation
   ───────────────────────────────────────────── */
function IMessageScreen({ onLinkTap }: { onLinkTap: () => void }) {
  const [msgIndex, setMsgIndex] = useState(-1);
  const [showCompose, setShowCompose] = useState(true);
  const [linkReady, setLinkReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [msgIndex]);

  useEffect(() => {
    if (msgIndex < 0) return;
    const nextIdx = msgIndex + 1;
    if (nextIdx >= CONVERSATION.length) {
      setTimeout(() => setLinkReady(true), 400);
      return;
    }
    const nextMsg = CONVERSATION[nextIdx];
    timeoutRef.current = setTimeout(() => setMsgIndex(nextIdx), nextMsg.delay || 400);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [msgIndex]);

  const handleSend = () => {
    setMsgIndex(0);
    setShowCompose(false);
  };

  const visibleMessages = msgIndex >= 0 ? CONVERSATION.slice(0, msgIndex + 1) : [];

  return (
    <div className="flex h-full flex-col" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}>
      <IOSStatusBar />
      <IMessageNavBar />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3" style={{ background: "#ffffff" }}>
        <div className="mb-3 text-center">
          <span className="text-[11px] font-medium" style={{ color: "#8e8e93" }}>Today 10:42 AM</span>
        </div>

        {visibleMessages.map((msg, i) => {
          if (msg.from === "typing") {
            if (i === msgIndex) return <TypingIndicator key={i} />;
            return null;
          }
          if (msg.from === "user") return <UserBubble key={i} text={msg.text!} />;
          if (msg.isLink) {
            return (
              <SaiBubble key={i}>
                <button
                  onClick={linkReady ? onLinkTap : undefined}
                  className={`text-[16px] leading-[1.35] underline ${linkReady ? "cursor-pointer" : "cursor-default"}`}
                  style={{ color: "#007AFF" }}
                >
                  {msg.text}
                </button>
              </SaiBubble>
            );
          }
          return <SaiBubble key={i}><span className="text-[16px] leading-[1.35] whitespace-pre-wrap" style={{ color: "#000" }}>{msg.text}</span></SaiBubble>;
        })}
      </div>

      <ComposeBar
        preComposedText={showCompose ? CONVERSATION[0].text! : undefined}
        onSend={handleSend}
        disabled={msgIndex >= 0}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Screen 3: Verify (Web App with iOS Autofill)
   ───────────────────────────────────────────── */
function VerifyScreen({ onVerified }: { onVerified: () => void }) {
  const [entered, setEntered] = useState(false);
  const [phase, setPhase] = useState<"waiting" | "filling" | "filled" | "verifying" | "done">("waiting");
  const [filledChars, setFilledChars] = useState(0);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleAutofillTap = useCallback(() => {
    if (phase !== "waiting") return;
    setPhase("filling");

    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < VERIFY_CODE.length; i++) {
      timers.push(setTimeout(() => setFilledChars(i + 1), i * 80));
    }
    timers.push(setTimeout(() => setPhase("filled"), VERIFY_CODE.length * 80 + 100));
    timers.push(setTimeout(() => setPhase("verifying"), VERIFY_CODE.length * 80 + 400));
    timers.push(setTimeout(() => setPhase("done"), VERIFY_CODE.length * 80 + 1800));
    timers.push(setTimeout(() => onVerified(), VERIFY_CODE.length * 80 + 2600));

    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  const codeChars = VERIFY_CODE.split("");

  return (
    <div
      className={`flex h-full flex-col transition-[transform,opacity] duration-200 ${
        entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      {/* Main content */}
      <div className="flex flex-1 flex-col items-center px-6 pt-14 bg-bg overflow-y-auto">
        <div className="mb-3">
          <SimularLogo size={52} />
        </div>
        <h1 className="mt-4 mb-2 text-[26px] font-bold text-t1">Verify your phone</h1>
        <p className="mb-8 text-center text-[14px] leading-[1.5] text-t3">
          Enter the code from Sai&apos;s text message.
        </p>

        {/* Code input boxes */}
        <div className="mb-4 rounded-2xl border border-b1 bg-bg2 px-5 py-6 w-full max-w-[340px]">
          <div className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-t4">Your code</div>
          <div className="flex justify-center gap-2 mb-4">
            {codeChars.map((char, i) => {
              const isFilled = i < filledChars;
              const isActive = i === filledChars && phase === "waiting";
              return (
                <div
                  key={i}
                  className={`flex h-[52px] w-[42px] items-center justify-center rounded-lg border text-[24px] font-semibold transition-colors duration-100 ${
                    isFilled
                      ? "border-as bg-as/10 text-t1"
                      : isActive
                        ? "border-as bg-bg3 text-t1"
                        : "border-b1 bg-bg3 text-t4"
                  }`}
                  style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
                >
                  {isFilled ? char : isActive ? <span className="blink-cursor text-as">|</span> : ""}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2 text-[12px]">
            {phase === "verifying" ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-t2 border-t-as" />
                <span className="text-t3">Verifying…</span>
              </>
            ) : phase === "done" ? (
              <>
                <svg className="h-4 w-4 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-g font-medium">Verified!</span>
              </>
            ) : null}
          </div>
        </div>

        <button
          onClick={handleResend}
          className="mb-3 text-[13px] text-as underline decoration-as/30 underline-offset-2 transition-colors hover:text-as2"
        >
          {resent ? "Code resent!" : "Resend code"}
        </button>

        <button className="text-[13px] text-t4 underline decoration-t4/30 underline-offset-2">
          Use a different number
        </button>

        <div className="mt-auto mb-4 flex items-center gap-2 rounded-xl bg-bg2 border border-b1 px-4 py-3 w-full max-w-[340px]">
          <svg className="h-5 w-5 shrink-0 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="text-[12px] text-t3">Check your phone for a message from Sai</span>
        </div>
      </div>

      <IOSNumberPad code={VERIFY_CODE} phase={phase} onAutofillTap={handleAutofillTap} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Screen 3b: Linked (back to iMessage with welcome)
   ───────────────────────────────────────────── */
function LinkedScreen({ onRestart }: { onRestart: () => void }) {
  const [msgIndex, setMsgIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start advancing immediately
  useEffect(() => {
    const t = setTimeout(() => setMsgIndex(0), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [msgIndex]);

  useEffect(() => {
    if (msgIndex < 0) return;
    const nextIdx = msgIndex + 1;
    if (nextIdx >= LINKED_MESSAGES.length) return;
    const nextMsg = LINKED_MESSAGES[nextIdx];
    timeoutRef.current = setTimeout(() => setMsgIndex(nextIdx), nextMsg.delay || 400);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [msgIndex]);

  const visibleMessages = msgIndex >= 0 ? LINKED_MESSAGES.slice(0, msgIndex + 1) : [];

  // All prior messages from the first conversation (non-typing)
  const priorMessages = CONVERSATION.filter(m => m.from !== "typing");

  return (
    <div className="flex h-full flex-col" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}>
      <IOSStatusBar />
      <IMessageNavBar />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3" style={{ background: "#ffffff" }}>
        <div className="mb-3 text-center">
          <span className="text-[11px] font-medium" style={{ color: "#8e8e93" }}>Today 10:42 AM</span>
        </div>

        {/* Prior conversation */}
        {priorMessages.map((msg, i) => {
          if (msg.from === "user") return <UserBubble key={`p-${i}`} text={msg.text!} />;
          if (msg.isLink) {
            return (
              <SaiBubble key={`p-${i}`}>
                <span className="text-[16px] leading-[1.35]" style={{ color: "#007AFF" }}>{msg.text}</span>
              </SaiBubble>
            );
          }
          return <SaiBubble key={`p-${i}`}><span className="text-[16px] leading-[1.35] whitespace-pre-wrap" style={{ color: "#000" }}>{msg.text}</span></SaiBubble>;
        })}

        {/* New linked messages */}
        {visibleMessages.map((msg, i) => {
          if (msg.from === "typing") {
            if (i === msgIndex) return <TypingIndicator key={`l-${i}`} />;
            return null;
          }
          return <SaiBubble key={`l-${i}`}><span className="text-[16px] leading-[1.35] whitespace-pre-wrap" style={{ color: "#000" }}>{msg.text}</span></SaiBubble>;
        })}

      </div>

      <div className="flex items-center justify-between border-t px-3 pb-8 pt-2" style={{ borderColor: "#c8c8cd", background: "#f6f6f6" }}>
        <PlusButton />
        <div className="flex min-h-[36px] flex-1 items-center rounded-full border px-4 py-2 mx-2" style={{ borderColor: "#c8c8cd", background: "#fff" }}>
          <span className="text-[16px]" style={{ color: "#8e8e93" }}>Text Message</span>
        </div>
      </div>

      {/* Restart demo link */}
      <div className="flex justify-center pb-4 pt-1" style={{ background: "#f6f6f6" }}>
        <button
          onClick={onRestart}
          className="text-[11px] underline underline-offset-2"
          style={{ color: "#8e8e93" }}
        >
          Restart demo
        </button>
      </div>
    </div>
  );
}

/* ─── iOS Number Pad with Autofill Bar ─── */
function IOSNumberPad({ code, phase, onAutofillTap }: { code: string; phase: string; onAutofillTap: () => void }) {
  const tapped = phase !== "waiting";
  const numKeys = [
    { num: "1", letters: "" },
    { num: "2", letters: "ABC" },
    { num: "3", letters: "DEF" },
    { num: "4", letters: "GHI" },
    { num: "5", letters: "JKL" },
    { num: "6", letters: "MNO" },
    { num: "7", letters: "PQRS" },
    { num: "8", letters: "TUV" },
    { num: "9", letters: "WXYZ" },
  ];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}>
      {/* Autofill suggestion bar */}
      <button
        onClick={onAutofillTap}
        className={`flex w-full items-center justify-center border-t py-2 transition-opacity ${
          tapped ? "opacity-40 pointer-events-none" : "opacity-100 cursor-pointer active:opacity-70"
        }`}
        style={{ background: "#d1d3d9", borderColor: "#b8bac0" }}
      >
        <div className="flex flex-col items-center">
          <div className="text-[11px]" style={{ color: "#666" }}>From Messages</div>
          <div className="text-[17px] font-medium" style={{ color: "#000" }}>{code}</div>
        </div>
      </button>

      {/* Number pad */}
      <div className="px-2 pb-7 pt-1.5" style={{ background: "#d1d3d9" }}>
        <div className="grid grid-cols-3 gap-[6px] mb-[6px]">
          {numKeys.map(({ num, letters }) => (
            <div
              key={num}
              className="flex h-[46px] flex-col items-center justify-center rounded-[5px]"
              style={{ background: "#fff", boxShadow: "0 1px 0 #898a8d" }}
            >
              <span className="text-[22px] leading-none" style={{ color: "#000" }}>{num}</span>
              {letters && (
                <span className="mt-[-1px] text-[9px] font-medium" style={{ color: "#000", letterSpacing: "0.5px" }}>
                  {letters}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-[6px]">
          <div />
          <div
            className="flex h-[46px] flex-col items-center justify-center rounded-[5px]"
            style={{ background: "#fff", boxShadow: "0 1px 0 #898a8d" }}
          >
            <span className="text-[22px] leading-none" style={{ color: "#000" }}>0</span>
          </div>
          <div className="flex h-[46px] items-center justify-center">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
              <line x1="18" y1="9" x2="12" y2="15" />
              <line x1="12" y1="9" x2="18" y2="15" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── iMessage Sub-Components ─── */

function IOSStatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pb-1 pt-3" style={{ background: "#f9f9f9" }}>
      <span className="text-[15px] font-semibold" style={{ color: "#000" }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg className="h-3 w-3" viewBox="0 0 16 16">
          <rect x="0" y="10" width="3" height="6" rx="0.5" fill="#000" />
          <rect x="4.5" y="7" width="3" height="9" rx="0.5" fill="#000" />
          <rect x="9" y="4" width="3" height="12" rx="0.5" fill="#000" />
          <rect x="13.5" y="1" width="2.5" height="15" rx="0.5" fill="#000" />
        </svg>
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="#000">
          <path d="M12 20l-1.4-1.4C7.8 15.8 6 14 6 11.5 6 7.4 8.7 4 12 2s6 5.4 6 9.5c0 2.5-1.8 4.3-4.6 7.1L12 20z" opacity="0.3" />
          <circle cx="12" cy="18" r="2" fill="#000" />
        </svg>
        <div className="flex items-center gap-0.5">
          <div className="flex h-[11px] w-[22px] items-center rounded-[3px] border border-black/30 p-[1.5px]">
            <div className="h-full w-[80%] rounded-[1.5px]" style={{ background: "#34c759" }} />
          </div>
          <div className="h-[4px] w-[1.5px] rounded-r-sm" style={{ background: "rgba(0,0,0,0.3)" }} />
        </div>
      </div>
    </div>
  );
}

function IMessageNavBar() {
  return (
    <div className="flex items-center justify-between border-b px-4 pb-2 pt-1" style={{ borderColor: "#c8c8cd", background: "#f9f9f9" }}>
      <div className="flex items-center gap-1">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </div>
      <div className="flex flex-col items-center">
        <svg className="shrink-0 rounded-full" width={36} height={36} viewBox="0 0 90 90" fill="none">
          <path d="M11.9894 0.0816665C13.419 -0.0639753 15.2678 0.0291222 16.7363 0.0313686L24.7691 0.0384666L50.4233 0.0370431L69.5517 0.0329611C73.0025 0.0313158 76.6905 -0.106236 80.0995 0.234987C83.2632 0.551636 86.1686 2.68847 87.962 5.21487C89.2663 7.05235 89.765 9.29356 89.8416 11.5213C89.9616 16.2751 89.9053 21.0496 89.9036 25.8085L89.9026 52.4153L89.9071 69.7762C89.9075 73.0897 90.0315 76.7555 89.6789 80.0189C89.441 82.2203 88.4913 84.2356 87.0047 85.8587C84.2202 88.8988 81.9836 89.6324 78.0098 89.8616C73.4372 90.0413 67.875 89.8962 63.2379 89.8962L35.0921 89.8958L19.2952 89.8974C12.674 89.9005 6.79347 90.9421 2.35788 85.1433C-0.488314 81.4225 0.0342723 77.0628 0.0431105 72.6757L0.045716 64.2766L0.043912 37.3765L0.0381538 19.9589C0.0368355 16.7224 -0.0911612 13.118 0.254576 9.92869C0.495909 7.70256 1.47817 5.67788 2.97824 4.03088C5.6968 1.04624 8.06521 0.299312 11.9894 0.0816665Z" fill="#000" />
          <path d="M46.8811 39.9023C52.0446 39.9111 55.9579 41.1993 59.6867 44.835C65.8177 50.813 65.7738 61.0332 59.758 67.0771C54.952 71.9053 50.502 71.958 44.1174 71.9531L35.8488 71.9512C34.1834 71.9612 32.5511 71.9811 30.8898 71.8486C29.0445 69.7504 27.3865 64.4789 25.8479 62.0576L41.6047 62.0664C43.9119 62.068 46.2222 62.079 48.5275 62.0342C51.3212 62.0388 54.468 59.0716 54.384 56.2031C54.244 51.4282 51.0181 50.0477 46.8723 50.0059L46.8811 39.9023ZM42.3781 18.0117C44.824 17.897 48.1085 17.9839 50.6154 17.9863L64.1867 18.0098C63.2843 20.06 62.3385 22.0911 61.3508 24.1016C60.8509 25.1418 59.995 26.8015 59.6379 27.8437C55.5791 27.9546 51.5154 27.8219 47.4572 27.8779C44.9163 28.0486 40.7938 27.3678 38.6066 28.8779C33.7709 32.217 35.164 38.7457 40.9455 39.9023C41.7567 39.9445 42.279 39.9446 43.09 39.9023L43.0773 50.0371C38.152 50.1004 34.9951 49.0198 31.1398 45.8584C24.6286 40.5187 23.9569 30.0406 29.4738 23.748C33.1794 19.5214 36.8061 18.294 42.3781 18.0117Z" fill="#fff" />
        </svg>
        <span className="mt-0.5 text-[11px] font-medium" style={{ color: "#000" }}>Sai</span>
      </div>
      <div className="w-5" />
    </div>
  );
}

function PlusButton() {
  return (
    <div className="mb-0.5 flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-full" style={{ background: "#e5e5ea" }}>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#3c3c43" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="mb-1.5 flex justify-end animate-msg-send">
      <div className="max-w-[75%] rounded-[18px_18px_4px_18px] px-3.5 py-2" style={{ background: "#007AFF" }}>
        <span className="text-[16px] leading-[1.35] text-white whitespace-pre-wrap">{text}</span>
      </div>
    </div>
  );
}

function SaiBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 flex justify-start animate-msg-send">
      <div className="max-w-[75%] rounded-[18px_18px_18px_4px] px-3.5 py-2" style={{ background: "#E9E9EB" }}>
        {children}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="mb-1.5 flex justify-start animate-msg-send">
      <div className="flex items-center gap-[5px] rounded-[18px_18px_18px_4px] px-4 py-3" style={{ background: "#E9E9EB" }}>
        <div className="h-[8px] w-[8px] rounded-full animate-imsg-dot-1" style={{ background: "#a0a0a0" }} />
        <div className="h-[8px] w-[8px] rounded-full animate-imsg-dot-2" style={{ background: "#a0a0a0" }} />
        <div className="h-[8px] w-[8px] rounded-full animate-imsg-dot-3" style={{ background: "#a0a0a0" }} />
      </div>
    </div>
  );
}

function ComposeBar({ preComposedText, onSend, disabled }: { preComposedText?: string; onSend: () => void; disabled: boolean }) {
  return (
    <div className="flex items-center gap-2 border-t px-3 pb-8 pt-2" style={{ borderColor: "#c8c8cd", background: "#f6f6f6" }}>
      <PlusButton />

      <div className="flex min-h-[36px] flex-1 items-center rounded-full border px-4 py-2" style={{ borderColor: "#c8c8cd", background: "#fff" }}>
        {preComposedText ? (
          <span className="text-[16px]" style={{ color: "#000" }}>{preComposedText}</span>
        ) : (
          <span className="text-[16px]" style={{ color: "#8e8e93" }}>Text Message</span>
        )}
      </div>

      {preComposedText && !disabled && (
        <button onClick={onSend} className="shrink-0 animate-msg-send">
          <div className="flex h-[33px] w-[33px] items-center justify-center rounded-full" style={{ background: "#007AFF" }}>
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}

/* ─── QR Code Visual (decorative) ─── */
function QRCodeVisual() {
  const pattern = [
    [1,1,1,0,1,0,1,1,1],
    [1,0,1,0,0,1,1,0,1],
    [1,1,1,0,1,0,1,1,1],
    [0,0,0,0,1,0,0,0,0],
    [1,0,1,1,0,1,1,0,1],
    [0,0,0,0,1,0,0,0,0],
    [1,1,1,0,0,1,1,1,1],
    [1,0,1,0,1,0,1,0,1],
    [1,1,1,0,1,0,1,1,1],
  ];

  return (
    <div className="relative rounded-xl border border-b1 bg-bg2 p-4">
      <div className="grid grid-cols-9 gap-[3px]">
        {pattern.flat().map((filled, i) => (
          <div
            key={i}
            className={`h-[6px] w-[6px] rounded-[1px] ${filled ? "bg-t1" : "bg-transparent"}`}
          />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-md bg-bg2 p-0.5">
          <SimularLogo size={16} />
        </div>
      </div>
    </div>
  );
}
