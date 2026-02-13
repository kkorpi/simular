export function ResultCard({
  highlighted,
  onOpenDetail,
}: {
  highlighted?: boolean;
  onOpenDetail?: () => void;
}) {
  return (
    <div
      className={`mt-2 max-w-[520px] overflow-hidden rounded-xl border bg-bg3 ${
        highlighted ? "border-b2 shadow-[0_0_0_2px_var(--as)]" : "border-b1"
      }`}
    >
      <div className="flex items-center gap-2.5 border-b border-b1 px-3.5 py-3">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-md bg-bg3h">
          <svg className="h-4 w-4 text-t1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-t1">Acme Corp - Meeting Briefing</div>
          <div className="text-[11px] text-t3">8 sources - just now</div>
        </div>
      </div>
      <div className="px-3.5 py-3 text-[13px] leading-[1.6] text-t2">
        <strong className="font-semibold text-t1">Acme Corp</strong> (Series B, $42M raised) builds
        supply chain optimization for mid-market retailers.
        {!highlighted && (
          <>
            {" "}
            CEO <strong className="font-semibold text-t1">Sarah Chen</strong> previously led ops at
            Shopify.
          </>
        )}
      </div>
      <div className="flex gap-1.5 border-t border-b1 px-3.5 py-2">
        {highlighted ? (
          <button className="rounded-md bg-ab px-2.5 py-1 text-xs font-medium text-abt">
            {"\u2190"} Viewing
          </button>
        ) : (
          <button
            onClick={onOpenDetail}
            className="rounded-md bg-ab px-2.5 py-1 text-xs font-medium text-abt transition-all hover:brightness-110"
          >
            Open full briefing
          </button>
        )}
        <button className="rounded-md border border-b1 bg-transparent px-2.5 py-1 text-xs font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1">
          Copy
        </button>
        {!highlighted && (
          <button className="rounded-md border border-b1 bg-transparent px-2.5 py-1 text-xs font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1">
            Sources
          </button>
        )}
      </div>
    </div>
  );
}
