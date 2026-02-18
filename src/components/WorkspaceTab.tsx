export function WorkspaceTab({ onFullView }: { onFullView: () => void }) {
  return (
    <div className="flex flex-col gap-2.5 p-3.5">
      {/* Live screen preview */}
      <div
        onClick={onFullView}
        className="relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-b1 bg-bg3 transition-all hover:border-b2"
      >
        <div className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-full bg-black/65 px-[7px] py-0.5 text-[9px] font-semibold text-g backdrop-blur-sm">
          <div className="h-1 w-1 rounded-full bg-g" />
          LIVE
        </div>
        {/* Expand icon */}
        <div className="absolute bottom-1.5 right-1.5 flex items-center justify-center rounded-md bg-black/50 p-0.5 backdrop-blur-sm">
          <svg
            className="h-4 w-4 text-t3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-1 text-center text-[11px] text-t4">
          <svg className="h-4 w-4 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
          <span>LinkedIn{"\n"}Founder profile</span>
        </div>
      </div>

      {/* Current task */}
      <div className="flex items-center gap-2 rounded-md border border-b1 bg-bg3 px-3 py-2">
        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-g shadow-[0_0_4px_var(--gg)]" />
        <div className="flex-1">
          <div className="text-[11.5px] font-medium text-t1">Research inbound founder</div>
          <div className="text-[10px] text-t3">Using screen now - 2:18 elapsed</div>
        </div>
      </div>

      {/* Queue */}
      <div className="flex items-center gap-1.5 rounded-md bg-bg3h px-3 py-1.5 text-[10.5px] text-t3">
        <div className="h-1 w-1 shrink-0 rounded-full bg-am" />
        Up next: Draft LP follow-up emails
      </div>

      {/* Status row */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-[5px] text-[11.5px] text-t2">
          <div className="h-[5px] w-[5px] rounded-full bg-g" />
          Workspace online
        </div>
        <button
          onClick={onFullView}
          className="rounded-md bg-transparent px-[7px] py-[3px] text-[11px] text-t3 transition-all hover:bg-bg3 hover:text-t2"
        >
          Full view
        </button>
      </div>

      {/* Trust info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2 rounded-md bg-bg3 px-2.5 py-2 text-[11px] leading-[1.45] text-t3">
          <svg
            className="mt-0.5 h-[13px] w-[13px] shrink-0 text-g"
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
          <span>Your workspace is private. Only you can see it. All activity is logged.</span>
        </div>
        <div className="flex items-start gap-2 rounded-md bg-bg3 px-2.5 py-2 text-[11px] leading-[1.45] text-t3">
          <svg
            className="mt-0.5 h-[13px] w-[13px] shrink-0 text-g"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>For login tasks, your coworker uses a secure full-screen browser. Credentials never leave your workspace.</span>
        </div>
      </div>
    </div>
  );
}
