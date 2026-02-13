export function SalesforceResult({
  onEditSchedule,
}: {
  onEditSchedule?: () => void;
}) {
  return (
    <div>
      <div className="text-sm leading-[1.6] text-t2">
        Here&apos;s your LP touchpoint report. A few relationships need attention.
      </div>

      {/* Result card */}
      <div className="mt-2 max-w-[520px] overflow-hidden rounded-xl border border-b1 bg-bg3">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5">
          <div className="flex h-[28px] w-[28px] items-center justify-center rounded-md bg-bg3h">
            <svg className="h-3.5 w-3.5 text-t1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-t1">
              LP Touchpoint Report - Feb 13
            </div>
            <div className="text-[11px] text-t3">
              4 LPs overdue · 5 actions suggested
            </div>
          </div>
          <button className="rounded-md bg-ab px-2.5 py-1 text-xs font-medium text-abt transition-all hover:brightness-110">
            View details
          </button>
        </div>

        {/* Highlights */}
        <div className="border-t border-b1 px-3.5 py-2.5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-2 text-[12px] leading-[1.5] text-t2">
              <div className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-am" />
              <span>
                <strong className="font-medium text-t1">Wellington</strong>{" "}
                72 days since last touchpoint. Suggest: share portfolio update deck.
              </span>
            </div>
            <div className="flex items-start gap-2 text-[12px] leading-[1.5] text-t2">
              <div className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-am" />
              <span>
                <strong className="font-medium text-t1">GIC Singapore</strong>{" "}
                68 days overdue. Suggest: invite to AI in Healthcare webinar.
              </span>
            </div>
            <div className="flex items-start gap-2 text-[12px] leading-[1.5] text-t2">
              <div className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-g" />
              <span>
                <strong className="font-medium text-t1">12 other P1 LPs</strong>{" "}
                are within your 60-day touchpoint cadence
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recurring offer */}
      <div className="mt-2.5 flex max-w-[520px] items-center gap-2.5 rounded-xl border border-b1 bg-bg3 p-3">
        <svg className="h-4 w-4 shrink-0 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg>
        <div className="flex-1 text-[13px] leading-[1.5] text-t2">
          <strong className="font-medium text-t1">
            Want me to run this every Monday?
          </strong>{" "}
          I&apos;ll track LP touchpoints and suggest outreach to keep you on cadence.
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={onEditSchedule}
            className="rounded-md border border-transparent bg-gs px-2.5 py-1 text-[11.5px] font-medium text-gt"
          >
            Yes, weekly
          </button>
          <button className="rounded-md border border-b1 bg-transparent px-2.5 py-1 text-[11.5px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1">
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
