export function RecurringSuggestion() {
  return (
    <div className="mt-2 flex max-w-[520px] items-center gap-2.5 rounded-lg border border-b1 bg-bgcard p-3">
      <svg className="h-4 w-4 shrink-0 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg>
      <div className="flex-1 text-[13px] leading-[1.5] text-t2">
        <strong className="font-medium text-t1">
          I&apos;ll do this again tomorrow morning.
        </strong>{" "}
        Turn off?
      </div>
      <div className="flex gap-1.5">
        <button className="rounded-md border border-transparent bg-gs px-2.5 py-1 text-[11.5px] font-medium text-gt">
          Sounds good
        </button>
        <button className="rounded-md border border-b1 bg-transparent px-2.5 py-1 text-[11.5px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1">
          Turn off
        </button>
      </div>
    </div>
  );
}
