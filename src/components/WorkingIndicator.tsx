export function WorkingIndicator({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] text-t3">{label}</span>
      <div className="h-[3px] w-[220px] overflow-hidden rounded-full bg-b1">
        <div className="shimmer-bar h-full w-full rounded-full" />
      </div>
    </div>
  );
}
