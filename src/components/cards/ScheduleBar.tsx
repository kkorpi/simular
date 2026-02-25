export interface ScheduleBarProps {
  schedule: string;
  nextRun?: string;
  onEdit?: () => void;
  onTurnOff?: () => void;
}

export function ScheduleBar({ schedule, onEdit, onTurnOff }: ScheduleBarProps) {
  return (
    <div className="flex items-center gap-2 border-t border-b1 px-3.5 py-2">
      <svg className="h-3 w-3 shrink-0 text-t4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 014-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 01-4 4H3" />
      </svg>
      <span className="flex-1 text-[11.5px] text-t3">{schedule}</span>
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-[11px] font-medium text-blt transition-all hover:underline"
        >
          Change schedule
        </button>
      )}
      {onTurnOff && (
        <button
          onClick={onTurnOff}
          className="text-[11px] font-medium text-t3 transition-all hover:text-t1"
        >
          Turn off
        </button>
      )}
    </div>
  );
}
