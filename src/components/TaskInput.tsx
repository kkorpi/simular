"use client";

import { useState, useRef, useEffect } from "react";

export function TaskInput() {
  const [value, setValue] = useState("");
  const [model, setModel] = useState("Claude 4.6 Opus");
  const [modelOpen, setModelOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  const models = ["Claude 4.6 Opus", "Claude 4.5 Sonnet", "GPT-4o", "Gemini 2.5 Pro"];

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }, [value]);

  // Close model dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setModelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col rounded-xl border border-b1 bg-bg3 transition-colors focus-within:border-b2">
      {/* Text input */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Describe a task..."
        rows={1}
        className="resize-none overflow-hidden bg-transparent px-4 pt-3 pb-1.5 text-[13px] leading-[1.5] text-t1 placeholder:text-t4 outline-none"
      />

      {/* Bottom toolbar */}
      <div className="flex items-center gap-1 px-3 pb-2.5">
        {/* Add attachment button */}
        <button
          className="flex items-center justify-center rounded-md p-1.5 text-t4 transition-colors hover:bg-bg3h hover:text-t2"
          title="Add attachment"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Model selector */}
        <div className="relative" ref={modelRef}>
          <button
            onClick={() => setModelOpen((o) => !o)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-t3 transition-colors hover:bg-bg3h hover:text-t2"
          >
            {model}
            <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown */}
          {modelOpen && (
            <div className="absolute bottom-full left-0 mb-1 w-[180px] rounded-lg border border-b1 bg-bg2 py-1 shadow-lg">
              {models.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setModel(m);
                    setModelOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] transition-colors hover:bg-bg3 ${
                    m === model ? "text-t1" : "text-t3"
                  }`}
                >
                  {m === model && (
                    <svg className="h-3 w-3 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {m !== model && <span className="w-3" />}
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Send button */}
        <button
          className={`flex items-center justify-center rounded-full p-1.5 transition-all ${
            value.trim()
              ? "bg-ab text-abt hover:brightness-110"
              : "text-t4 cursor-default"
          }`}
          disabled={!value.trim()}
          title="Send"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
