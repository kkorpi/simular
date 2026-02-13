export function MeetingPrompt() {
  return (
    <div>
      <div className="text-sm leading-[1.65] text-t2">
        You also have a meeting with{" "}
        <strong className="font-semibold text-t1">Acme Corp at 2pm</strong>.
        Want me to pull a briefing?
      </div>

      {/* Action buttons */}
      <div className="mt-2.5 flex flex-wrap gap-2">
        <button className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-ab px-3 py-1.5 text-[12.5px] font-medium text-abt transition-all hover:brightness-110">
          Pull briefing
        </button>
        <button className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-b1 bg-transparent px-3 py-1.5 text-[12.5px] font-medium text-t2 transition-all hover:border-b2 hover:bg-bg3h hover:text-t1">
          Skip
        </button>
      </div>
    </div>
  );
}
