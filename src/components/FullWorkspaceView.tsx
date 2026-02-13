"use client";

export function FullWorkspaceView({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-[60] flex transition-all duration-300 ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[5px]" onClick={onClose} />

      {/* Panel */}
      <div
        className={`relative ml-auto flex h-full flex-col bg-bg shadow-[-4px_0_24px_rgba(0,0,0,0.3)] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "calc(100% - 80px)" }}
      >
        {/* Bar */}
        <div className="flex items-center gap-3 border-b border-b1 px-6 py-3">
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg p-1 text-t3 transition-all hover:bg-bg3 hover:text-t1"
            title="Collapse workspace"
          >
            {/* Collapse / shrink icon — 32x32 */}
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
          <div className="flex items-center gap-1.5 text-xs font-medium text-t2">
            <div className="h-1.5 w-1.5 rounded-full bg-g shadow-[0_0_4px_var(--gg)]" />
            Workspace online
          </div>
          <div className="ml-auto text-xs text-t3">
            Working on:{" "}
            <strong className="font-semibold text-t1">
              Check Salesforce pipeline
            </strong>{" "}
            (1:42)
          </div>
        </div>

        {/* Screen */}
        <div className="relative mx-6 my-4 flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-b1 bg-bg3">
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/65 px-[7px] py-0.5 text-[9px] font-semibold text-g backdrop-blur-sm">
            <div className="h-1 w-1 rounded-full bg-g" />
            LIVE
          </div>
          <div className="flex flex-col items-center text-center text-[13px] text-t4">
            <svg className="mb-2 h-5 w-5 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            LinkedIn - Founder Profile
            <br />
            <br />
            <span className="text-[11px] text-t4">
              Your coworker is reviewing the inbound founder&apos;s LinkedIn,
              <br />
              pulling background, experience, and mutual connections.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center gap-[18px] border-t border-b1 px-6 py-2.5">
          <div className="flex items-center gap-[5px] text-[11px] text-t3">
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
          <div className="flex items-center gap-[5px] text-[11px] text-t3">
            <svg
              className="h-3 w-3 text-g"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Private instance
          </div>
          <div className="flex items-center gap-[5px] text-[11px] text-t3">
            <svg
              className="h-3 w-3 text-g"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            All activity logged
          </div>
        </div>
      </div>
    </div>
  );
}
