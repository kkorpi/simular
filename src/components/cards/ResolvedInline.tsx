import type { ReactNode } from "react";

const iconMap = {
  check: (
    <svg className="h-4 w-4 shrink-0 text-g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  x: (
    <svg className="h-4 w-4 shrink-0 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  edit: (
    <svg className="h-4 w-4 shrink-0 text-blt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  clock: (
    <svg className="h-4 w-4 shrink-0 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

export type ResolvedIcon = keyof typeof iconMap;

export function ResolvedInline({
  icon,
  message,
  customIcon,
}: {
  icon?: ResolvedIcon;
  message: string;
  customIcon?: ReactNode;
}) {
  return (
    <div className="mt-3 flex items-center gap-2 text-sm text-t2 animate-fade-in">
      {customIcon ?? (icon ? iconMap[icon] : null)}
      <span className={icon === "x" || icon === "clock" ? "text-t3" : ""}>
        {message}
      </span>
    </div>
  );
}
