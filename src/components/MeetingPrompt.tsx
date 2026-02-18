export function MeetingPrompt() {
  return (
    <div>
      <div className="text-sm leading-[1.65] text-t2">
        You have an{" "}
        <strong className="font-semibold text-t1">LP meeting with Sequoia Scouts on Thursday</strong>.
        Want me to pull your prep briefing now?
      </div>

      {/* Action buttons */}
      <div className="mt-2.5 flex flex-wrap gap-2">
        <button className="flex cursor-pointer items-center gap-1.5 rounded-md bg-ab px-3 py-1.5 text-[12.5px] font-medium text-abt transition-all hover:brightness-110">
          Pull briefing
        </button>
        <button className="flex cursor-pointer items-center gap-1.5 rounded-md border border-b1 bg-transparent px-3 py-1.5 text-[12.5px] font-medium text-t2 transition-all hover:border-b2 hover:bg-bg3h hover:text-t1">
          Skip
        </button>
      </div>
    </div>
  );
}
