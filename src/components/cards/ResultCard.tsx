import type { ReactNode } from "react";
import { CardShell, type CardAccent } from "./CardShell";
import { ScheduleBar, type ScheduleBarProps } from "./ScheduleBar";
import type { CardAction } from "./types";

/* ── Body variant types ── */

export type HighlightItem = {
  text: ReactNode;
  dot?: "amber" | "green" | "red" | "neutral";
};

export type KeyValueRow = {
  label: string;
  value: ReactNode;
};

export type ResultSection = {
  heading: string;
  content: ReactNode;
};

export type ResultBody =
  | { type: "prose"; text: ReactNode }
  | { type: "highlights"; items: HighlightItem[] }
  | { type: "key-value"; rows: KeyValueRow[] }
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "sections"; sections: ResultSection[] };

/* ── Notification props ── */

export type NotificationUrgency = "info" | "attention" | "urgent";

export type NotificationMeta = {
  triggeredBy: string;
  timestamp?: string;
  urgency?: NotificationUrgency;
};

/* ── Props ── */

export interface ResultCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  body: ResultBody;
  actions?: CardAction[];
  schedule?: ScheduleBarProps;
  highlighted?: boolean;
  accent?: CardAccent;
  /** When set, renders as a notification card */
  notification?: NotificationMeta;
}

/* ── Dot color map ── */

const dotColors = {
  amber: "bg-am",
  green: "bg-g",
  red: "bg-r",
  neutral: "bg-t4",
} as const;

const urgencyStyles = {
  info: { dot: "bg-as", text: "text-t3" },
  attention: { dot: "bg-am", text: "text-am" },
  urgent: { dot: "bg-r animate-pulse", text: "text-r" },
} as const;

/* ── Component ── */

export function ResultCard({
  icon,
  title,
  subtitle,
  body,
  actions,
  schedule,
  highlighted,
  accent = "default",
  notification,
}: ResultCardProps) {
  const urgency = notification?.urgency ?? "info";

  return (
    <CardShell
      accent={notification ? (urgency === "urgent" ? "amber" : accent) : accent}
      className={highlighted ? "shadow-[0_0_0_2px_var(--as)]" : undefined}
    >
      {/* Notification context bar */}
      {notification && (
        <div className="flex items-center gap-2 bg-bg3h/50 px-3.5 py-1.5">
          <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${urgencyStyles[urgency].dot}`} />
          <span className={`text-[10px] font-medium ${urgencyStyles[urgency].text}`}>
            {notification.triggeredBy}
          </span>
          {notification.timestamp && (
            <>
              <span className="text-[10px] text-t4">&middot;</span>
              <span className="text-[10px] text-t4">{notification.timestamp}</span>
            </>
          )}
        </div>
      )}

      {/* Header */}
      <div className={`flex items-center gap-2.5 px-3.5 py-2.5 ${notification ? "border-t border-b1" : ""}`}>
        <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-md bg-bg3h">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-t1">{title}</div>
          {subtitle && (
            <div className="text-[11px] text-t3">{subtitle}</div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="border-t border-b1">
        {body.type === "prose" && (
          <div className="px-3.5 py-3 text-[13px] leading-[1.6] text-t2">
            {body.text}
          </div>
        )}

        {body.type === "highlights" && (
          <div className="flex flex-col gap-1.5 px-3.5 py-2.5">
            {body.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-[12px] leading-[1.5] text-t2">
                <div className={`mt-[7px] h-1 w-1 shrink-0 rounded-full ${dotColors[item.dot ?? "neutral"]}`} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {body.type === "key-value" && (
          <div className="flex flex-col gap-1 px-3.5 py-2.5">
            {body.rows.map((row, i) => (
              <div key={i} className="flex gap-2 text-[12px]">
                <span className="w-24 shrink-0 text-t3">{row.label}</span>
                <span className="text-t1">{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {body.type === "table" && (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-b1 bg-bg3h">
                  {body.columns.map((col, i) => (
                    <th key={i} className="px-3 py-2 text-left font-medium text-t3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.rows.map((row, i) => (
                  <tr key={i} className="border-b border-b1 last:border-0">
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2 text-t2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {body.type === "sections" && (
          <div className="divide-y divide-b1">
            {body.sections.map((section, i) => (
              <div key={i} className="px-3.5 py-2.5">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-t3">
                  {section.heading}
                </div>
                <div className="text-[12px] leading-[1.6] text-t2">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex gap-1.5 border-t border-b1 px-3.5 py-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={
                action.style === "primary"
                  ? "rounded-md bg-ab px-2.5 py-1 text-xs font-medium text-abt transition-all hover:brightness-110"
                  : action.style === "outline"
                    ? "rounded-md border border-b1 bg-transparent px-2.5 py-1 text-xs font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1"
                    : "text-[11px] font-medium text-blt transition-all hover:underline"
              }
            >
              {action.icon && <span className="mr-1 inline-flex">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Schedule footer */}
      {schedule && <ScheduleBar {...schedule} />}
    </CardShell>
  );
}
