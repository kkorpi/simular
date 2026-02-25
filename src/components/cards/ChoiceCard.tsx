"use client";

import { useState, type ReactNode } from "react";
import { CardShell } from "./CardShell";
import { ResolvedInline } from "./ResolvedInline";

export type ComparisonAttribute = {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: "best" | "worst" | "none";
};

export type ChoiceOption = {
  id: string;
  title: string;
  subtitle?: string;
  detail?: string;
  icon?: ReactNode;
  badge?: { label: string; color: "amber" | "green" | "blue" | "neutral" };
  /** Used only in comparison layout */
  attributes?: ComparisonAttribute[];
};

export interface ChoiceCardProps {
  question: string;
  options: ChoiceOption[];
  layout?: "cards" | "list" | "pills" | "comparison";
  multi?: boolean;
  onSelect: (selected: ChoiceOption[]) => void;
  resolvedMessage?: (selected: ChoiceOption[]) => string;
  /** Label for comparison header (e.g., "Compare flights") */
  compareLabel?: string;
}

const badgeColors = {
  amber: "bg-ams text-am",
  green: "bg-gs text-gt",
  blue: "bg-ab text-abt",
  neutral: "bg-bg3h text-t3",
} as const;

export function ChoiceCard({
  question,
  options,
  layout = "cards",
  multi = false,
  onSelect,
  resolvedMessage,
  compareLabel,
}: ChoiceCardProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [resolved, setResolved] = useState(false);

  const handleSelect = (opt: ChoiceOption) => {
    if (multi) {
      setSelected((prev) =>
        prev.includes(opt.id)
          ? prev.filter((id) => id !== opt.id)
          : [...prev, opt.id]
      );
    } else {
      setSelected([opt.id]);
      // Auto-resolve for single-select after brief delay
      setTimeout(() => {
        setResolved(true);
        onSelect([opt]);
      }, 600);
    }
  };

  const handleConfirmMulti = () => {
    const selectedOpts = options.filter((o) => selected.includes(o.id));
    setResolved(true);
    onSelect(selectedOpts);
  };

  const selectedOpts = options.filter((o) => selected.includes(o.id));

  if (resolved && resolvedMessage) {
    return <ResolvedInline icon="check" message={resolvedMessage(selectedOpts)} />;
  }

  if (resolved) {
    return (
      <ResolvedInline
        icon="check"
        message={selectedOpts.map((o) => o.title).join(", ")}
      />
    );
  }

  return (
    <div className="mt-2">
      {/* ── Cards layout ── */}
      {layout === "cards" && (
        <div className="flex gap-2">
          {options.map((opt) => {
            const isSelected = selected.includes(opt.id);
            const hasSelection = selected.length > 0;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className={`flex w-[160px] flex-col rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? "border-as bg-as/[0.04] shadow-[0_0_0_1px_var(--as)]"
                    : hasSelection
                      ? "border-b1 bg-bg3 opacity-40"
                      : "border-b1 bg-bg3 hover:border-b2 hover:bg-bg3h"
                }`}
              >
                {opt.icon && (
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-bg3h text-t1">
                    {opt.icon}
                  </div>
                )}
                <div className="text-[13px] font-semibold text-t1">{opt.title}</div>
                {opt.subtitle && (
                  <div className="mt-0.5 text-[11px] text-t3">{opt.subtitle}</div>
                )}
                {opt.detail && (
                  <div className="mt-0.5 text-[11px] text-t4">{opt.detail}</div>
                )}
                {opt.badge && (
                  <div className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeColors[opt.badge.color]}`}>
                    {opt.badge.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── List layout ── */}
      {layout === "list" && (
        <CardShell>
          <div className="divide-y divide-b1">
            {options.map((opt) => {
              const isSelected = selected.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                  className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-all ${
                    isSelected ? "bg-as/[0.04]" : "hover:bg-bg3h"
                  }`}
                >
                  {multi && (
                    <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      isSelected ? "border-as bg-as" : "border-b2 bg-bg3"
                    }`}>
                      {isSelected && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  )}
                  {opt.icon && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg3h text-t2">
                      {opt.icon}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-t1">{opt.title}</div>
                    {opt.subtitle && (
                      <div className="text-[11px] text-t3">{opt.subtitle}</div>
                    )}
                  </div>
                  {opt.badge && (
                    <div className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeColors[opt.badge.color]}`}>
                      {opt.badge.label}
                    </div>
                  )}
                  {!multi && (
                    <svg className={`h-4 w-4 shrink-0 transition-colors ${isSelected ? "text-as" : "text-t4"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          {multi && (
            <div className="border-t border-b1 px-3.5 py-2">
              <button
                onClick={handleConfirmMulti}
                className={`text-[13px] font-medium transition-colors ${
                  selected.length > 0 ? "text-blt hover:text-as2" : "text-t4"
                }`}
              >
                {selected.length > 0 ? `Continue with ${selected.length} selected \u2192` : "Skip \u2192"}
              </button>
            </div>
          )}
        </CardShell>
      )}

      {/* ── Pills layout ── */}
      {layout === "pills" && (
        <div>
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => {
              const isSelected = selected.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                  className={`rounded-md border px-3.5 py-2 text-[13px] font-medium transition-all ${
                    isSelected
                      ? "border-as/50 bg-as/10 text-blt"
                      : "border-b1 bg-bg3 text-t2 hover:border-b2 hover:bg-bg3h"
                  }`}
                >
                  {opt.title}
                </button>
              );
            })}
          </div>
          {multi && (
            <button
              onClick={handleConfirmMulti}
              className={`mt-3 text-[13px] font-medium transition-colors ${
                selected.length > 0 ? "text-blt hover:text-as2" : "text-t4"
              }`}
            >
              {selected.length > 0 ? "Continue \u2192" : "Skip \u2192"}
            </button>
          )}
        </div>
      )}

      {/* ── Comparison layout ── */}
      {layout === "comparison" && (
        <CardShell>
          {/* Header */}
          {compareLabel && (
            <div className="px-3.5 py-2.5">
              <div className="text-[13px] font-semibold text-t1">{compareLabel}</div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              {/* Column headers: option titles */}
              <thead>
                <tr className="border-y border-b1 bg-bg3h">
                  <th className="px-3 py-2 text-left font-medium text-t4 w-[100px]" />
                  {options.map((opt) => {
                    const isSelected = selected.includes(opt.id);
                    return (
                      <th key={opt.id} className="px-3 py-2 text-left min-w-[120px]">
                        <div className={`font-semibold ${isSelected ? "text-blt" : "text-t1"}`}>{opt.title}</div>
                        {opt.subtitle && <div className="mt-0.5 font-normal text-t3">{opt.subtitle}</div>}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              {/* Attribute rows */}
              <tbody>
                {(options[0]?.attributes ?? []).map((_, attrIndex) => (
                  <tr key={attrIndex} className="border-b border-b1 last:border-0">
                    <td className="px-3 py-2 text-t3 font-medium">
                      {options[0]?.attributes?.[attrIndex]?.label}
                    </td>
                    {options.map((opt) => {
                      const attr = opt.attributes?.[attrIndex];
                      if (!attr) return <td key={opt.id} className="px-3 py-2" />;
                      return (
                        <td key={opt.id} className="px-3 py-2">
                          <span className={
                            attr.highlight === "best"
                              ? "font-semibold text-g"
                              : attr.highlight === "worst"
                                ? "text-am"
                                : "text-t2"
                          }>
                            {attr.value}{attr.unit ? ` ${attr.unit}` : ""}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Select buttons row */}
          <div className="flex border-t border-b1">
            <div className="w-[100px] shrink-0" />
            {options.map((opt) => {
              const isSelected = selected.includes(opt.id);
              return (
                <div key={opt.id} className="flex-1 min-w-[120px] px-3 py-2">
                  <button
                    onClick={() => handleSelect(opt)}
                    className={`w-full rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                      isSelected
                        ? "border-as bg-as/10 text-blt"
                        : "border-b1 text-t2 hover:border-b2 hover:bg-bg3h hover:text-t1"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>
                </div>
              );
            })}
          </div>
        </CardShell>
      )}
    </div>
  );
}
