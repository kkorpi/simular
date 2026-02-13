export function CompetitorScanResult({
  onEditSchedule,
}: {
  onEditSchedule?: () => void;
}) {
  return (
    <div>
      <div className="text-sm leading-[1.65] text-t2">
        Your{" "}
        <strong className="font-semibold text-t1">daily competitor scan</strong>{" "}
        finished. Two new companies raised funding overnight.
      </div>

      {/* Compact result card */}
      <div className="mt-2 max-w-[520px] overflow-hidden rounded-xl border border-b1 bg-bg3">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5">
          <div className="flex h-[28px] w-[28px] items-center justify-center rounded-md bg-bg3h">
            <svg className="h-3.5 w-3.5 text-t1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-t1">
              Competitor Intel - Feb 13
            </div>
            <div className="text-[11px] text-t3">
              2 new funded competitors · ran at 7:02am
            </div>
          </div>
          <button className="rounded-md bg-ab px-2.5 py-1 text-xs font-medium text-abt transition-all hover:brightness-110">
            View report
          </button>
        </div>

        {/* Quick highlights */}
        <div className="border-t border-b1 px-3.5 py-2.5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-2 text-[12px] leading-[1.5] text-t2">
              <div className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-t4" />
              <span>
                <strong className="font-medium text-t1">Vanta</strong> raised
                $40M Series C led by Sequoia, AI compliance automation
              </span>
            </div>
            <div className="flex items-start gap-2 text-[12px] leading-[1.5] text-t2">
              <div className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-t4" />
              <span>
                <strong className="font-medium text-t1">Drata</strong> acquired
                ComplianceBot for SOC2 evidence collection
              </span>
            </div>
          </div>
        </div>

        {/* Recurring schedule footer */}
        <div className="flex items-center gap-2 border-t border-b1 px-3.5 py-2">
          <svg className="h-3 w-3 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg>
          <span className="flex-1 text-[11.5px] text-t3">
            Runs every morning at 7am
          </span>
          <button
            onClick={onEditSchedule}
            className="text-[11px] font-medium text-blt transition-all hover:underline"
          >
            Change schedule
          </button>
          <button className="text-[11px] font-medium text-t3 transition-all hover:text-t1">
            Turn off
          </button>
        </div>
      </div>
    </div>
  );
}
