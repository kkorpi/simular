import {
  briefingOverview,
  briefingPeople,
  briefingSources,
  talkingPoints,
} from "@/data/mockData";

export function BriefingDetail({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2.5 border-b border-b1 px-5 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-md bg-transparent px-2 py-1 text-xs text-t3 transition-all hover:bg-bg3 hover:text-t1"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <div className="flex-1 text-[15px] font-semibold text-t1">
          Sequoia Scouts - LP Meeting Prep
        </div>
        <div className="font-mono text-[11px] text-t3">5 sources - 9:30am</div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Company overview */}
        <div className="mb-5">
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
            LP overview
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-1.5 text-[13px]">
            {Object.entries(briefingOverview).map(([key, val]) => (
              <div key={key} className="contents">
                <div className="font-medium capitalize text-t3">{key}</div>
                <div className="text-t1">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key people */}
        <div className="mb-5">
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
            Key people
          </div>
          <div className="flex flex-col gap-2">
            {briefingPeople.map((p) => (
              <div
                key={p.initials}
                className="flex items-center gap-2.5 rounded-lg border border-b1 bg-bg3 px-2.5 py-2"
              >
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-bg3h text-[11px] font-semibold text-t2">
                  {p.initials}
                </div>
                <div className="flex-1">
                  <div className="text-[12.5px] font-medium text-t1">{p.name}</div>
                  <div className="text-[11px] text-t3">{p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Talking points */}
        <div className="mb-5">
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
            Talking points
          </div>
          <div className="text-[13.5px] leading-[1.7] text-t2">
            {talkingPoints.map((tp, i) => (
              <span key={i}>
                <strong className="font-semibold text-t1">{tp.title}</strong> {tp.body}
                {i < talkingPoints.length - 1 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div>
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-t4">
            Sources
          </div>
          <div className="flex flex-col gap-1">
            {briefingSources.map((s, i) => (
              <div
                key={i}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-t2 transition-all hover:bg-bg3"
              >
                <div className="text-[13px]">{s.icon}</div>
                <div>
                  <div>{s.title}</div>
                  <div className="font-mono text-[10.5px] text-t4">{s.url}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-2 border-t border-b1 px-5 py-4">
        <button className="rounded-lg bg-ab px-4 py-[7px] text-[12.5px] font-medium text-abt transition-all hover:brightness-110">
          Copy to clipboard
        </button>
        <button className="rounded-lg border border-b1 bg-transparent px-4 py-[7px] text-[12.5px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1">
          Open in Google Docs
        </button>
        <button className="rounded-lg border border-b1 bg-transparent px-4 py-[7px] text-[12.5px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1">
          Share via email
        </button>
      </div>
    </div>
  );
}
