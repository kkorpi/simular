"use client";

import { useState, type ReactNode } from "react";
import { CardShell, type CardAccent } from "./CardShell";
import { ResolvedInline } from "./ResolvedInline";

/* ── Field types ── */

export type FormFieldBase = {
  key: string;
  label: string;
  required?: boolean;
  helpText?: string;
};

export type FormField =
  | (FormFieldBase & { type: "text"; placeholder?: string; defaultValue?: string })
  | (FormFieldBase & { type: "textarea"; placeholder?: string; defaultValue?: string; rows?: number })
  | (FormFieldBase & { type: "number"; placeholder?: string; defaultValue?: number; min?: number; max?: number; unit?: string })
  | (FormFieldBase & { type: "select"; options: { value: string; label: string }[]; defaultValue?: string })
  | (FormFieldBase & { type: "toggle"; defaultValue?: boolean })
  | (FormFieldBase & { type: "date"; defaultValue?: string })
  | (FormFieldBase & { type: "date-range"; defaultStart?: string; defaultEnd?: string })
  | (FormFieldBase & { type: "chips-input"; defaultValues?: string[]; placeholder?: string });

export type FormValues = Record<string, string | number | boolean | string[]>;

export interface FormCardProps {
  title: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
  accent?: CardAccent;
  onSubmit: (values: FormValues) => void;
  onCancel?: () => void;
  resolvedMessage?: string;
}

/* ── Component ── */

export function FormCard({
  title,
  description,
  fields,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  accent = "default",
  onSubmit,
  onCancel,
  resolvedMessage,
}: FormCardProps) {
  const [values, setValues] = useState<FormValues>(() => {
    const init: FormValues = {};
    for (const field of fields) {
      switch (field.type) {
        case "text":
        case "textarea":
          init[field.key] = field.defaultValue ?? "";
          break;
        case "number":
          init[field.key] = field.defaultValue ?? 0;
          break;
        case "select":
          init[field.key] = field.defaultValue ?? (field.options[0]?.value ?? "");
          break;
        case "toggle":
          init[field.key] = field.defaultValue ?? false;
          break;
        case "date":
          init[field.key] = field.defaultValue ?? "";
          break;
        case "date-range":
          init[field.key + "_start"] = field.defaultStart ?? "";
          init[field.key + "_end"] = field.defaultEnd ?? "";
          break;
        case "chips-input":
          init[field.key] = field.defaultValues ?? [];
          break;
      }
    }
    return init;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resolved, setResolved] = useState(false);
  const [chipInput, setChipInput] = useState<Record<string, string>>({});

  const updateValue = (key: string, value: string | number | boolean | string[]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required) {
        if (field.type === "date-range") {
          if (!values[field.key + "_start"]) newErrors[field.key + "_start"] = "Required";
          if (!values[field.key + "_end"]) newErrors[field.key + "_end"] = "Required";
        } else if (field.type === "chips-input") {
          if ((values[field.key] as string[]).length === 0) newErrors[field.key] = "Add at least one";
        } else {
          const v = values[field.key];
          if (v === "" || v === undefined) newErrors[field.key] = "Required";
        }
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setResolved(true);
    onSubmit(values);
  };

  const addChip = (key: string) => {
    const text = (chipInput[key] ?? "").trim();
    if (!text) return;
    const current = (values[key] as string[]) ?? [];
    if (!current.includes(text)) {
      updateValue(key, [...current, text]);
    }
    setChipInput((prev) => ({ ...prev, [key]: "" }));
  };

  const removeChip = (key: string, chip: string) => {
    const current = (values[key] as string[]) ?? [];
    updateValue(key, current.filter((c) => c !== chip));
  };

  if (resolved) {
    return <ResolvedInline icon="check" message={resolvedMessage ?? `${title} submitted`} />;
  }

  return (
    <CardShell accent={accent}>
      {/* Header */}
      <div className="px-3.5 py-2.5">
        <div className="text-[13px] font-semibold text-t1">{title}</div>
        {description && (
          <div className="mt-0.5 text-[11px] text-t3">{description}</div>
        )}
      </div>

      {/* Fields */}
      <div className="border-t border-b1 px-3.5 py-3 flex flex-col gap-3">
        {fields.map((field) => (
          <div key={field.key}>
            <div className="flex items-center gap-1 mb-1">
              <label className="text-[12px] font-medium text-t2">{field.label}</label>
              {field.required && <span className="text-[10px] text-r">*</span>}
            </div>

            {field.type === "text" && (
              <input
                type="text"
                value={values[field.key] as string}
                placeholder={field.placeholder}
                onChange={(e) => updateValue(field.key, e.target.value)}
                className={`w-full rounded-md border bg-bg3 px-3 py-1.5 text-[12px] text-t1 outline-none placeholder:text-t4 transition-all focus:border-as ${
                  errors[field.key] ? "border-r" : "border-b1"
                }`}
              />
            )}

            {field.type === "textarea" && (
              <textarea
                value={values[field.key] as string}
                placeholder={field.placeholder}
                rows={field.rows ?? 3}
                onChange={(e) => updateValue(field.key, e.target.value)}
                className={`w-full resize-none rounded-md border bg-bg3 px-3 py-1.5 text-[12px] leading-[1.6] text-t1 outline-none placeholder:text-t4 transition-all focus:border-as ${
                  errors[field.key] ? "border-r" : "border-b1"
                }`}
              />
            )}

            {field.type === "number" && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={values[field.key] as number}
                  min={field.min}
                  max={field.max}
                  onChange={(e) => updateValue(field.key, Number(e.target.value))}
                  className={`w-[100px] rounded-md border bg-bg3 px-3 py-1.5 text-right text-[12px] text-t1 outline-none transition-all focus:border-as ${
                    errors[field.key] ? "border-r" : "border-b1"
                  }`}
                />
                {field.unit && <span className="text-[11px] text-t3">{field.unit}</span>}
              </div>
            )}

            {field.type === "select" && (
              <div className="relative">
                <select
                  value={values[field.key] as string}
                  onChange={(e) => updateValue(field.key, e.target.value)}
                  className={`w-full appearance-none rounded-md border bg-bg3 px-3 py-1.5 pr-8 text-[12px] text-t1 outline-none transition-all focus:border-as ${
                    errors[field.key] ? "border-r" : "border-b1"
                  }`}
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            )}

            {field.type === "toggle" && (
              <button
                onClick={() => updateValue(field.key, !(values[field.key] as boolean))}
                className={`relative h-[24px] w-[44px] rounded-full transition-all ${
                  values[field.key] ? "bg-t1" : "bg-b2"
                }`}
              >
                <div
                  className={`absolute top-[2px] h-[20px] w-[20px] rounded-full bg-bg transition-all ${
                    values[field.key] ? "left-[22px]" : "left-[2px]"
                  }`}
                />
              </button>
            )}

            {field.type === "date" && (
              <input
                type="date"
                value={values[field.key] as string}
                onChange={(e) => updateValue(field.key, e.target.value)}
                className={`rounded-md border bg-bg3 px-3 py-1.5 text-[12px] text-t1 outline-none transition-all focus:border-as ${
                  errors[field.key] ? "border-r" : "border-b1"
                }`}
              />
            )}

            {field.type === "date-range" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={values[field.key + "_start"] as string}
                  onChange={(e) => updateValue(field.key + "_start", e.target.value)}
                  className={`rounded-md border bg-bg3 px-3 py-1.5 text-[12px] text-t1 outline-none transition-all focus:border-as ${
                    errors[field.key + "_start"] ? "border-r" : "border-b1"
                  }`}
                />
                <span className="text-[11px] text-t4">to</span>
                <input
                  type="date"
                  value={values[field.key + "_end"] as string}
                  onChange={(e) => updateValue(field.key + "_end", e.target.value)}
                  className={`rounded-md border bg-bg3 px-3 py-1.5 text-[12px] text-t1 outline-none transition-all focus:border-as ${
                    errors[field.key + "_end"] ? "border-r" : "border-b1"
                  }`}
                />
              </div>
            )}

            {field.type === "chips-input" && (
              <div>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {((values[field.key] as string[]) ?? []).map((chip) => (
                    <span key={chip} className="inline-flex items-center gap-1 rounded-full bg-bg3h px-2.5 py-0.5 text-[11px] font-medium text-t2">
                      {chip}
                      <button onClick={() => removeChip(field.key, chip)} className="text-t4 hover:text-t1 transition-colors">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={chipInput[field.key] ?? ""}
                    placeholder={field.placeholder ?? "Type and press Enter"}
                    onChange={(e) => setChipInput((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChip(field.key); } }}
                    className={`flex-1 rounded-md border bg-bg3 px-3 py-1.5 text-[12px] text-t1 outline-none placeholder:text-t4 transition-all focus:border-as ${
                      errors[field.key] ? "border-r" : "border-b1"
                    }`}
                  />
                  <button
                    onClick={() => addChip(field.key)}
                    className="rounded-md border border-b1 bg-transparent px-2.5 py-1 text-[11px] font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Error message */}
            {errors[field.key] && (
              <div className="mt-0.5 text-[10px] text-r">{errors[field.key]}</div>
            )}
            {errors[field.key + "_start"] && (
              <div className="mt-0.5 text-[10px] text-r">{errors[field.key + "_start"]}</div>
            )}
            {errors[field.key + "_end"] && (
              <div className="mt-0.5 text-[10px] text-r">{errors[field.key + "_end"]}</div>
            )}
            {/* Help text */}
            {field.helpText && !errors[field.key] && (
              <div className="mt-0.5 text-[10px] text-t4">{field.helpText}</div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-b1 px-3.5 py-2">
        <button
          onClick={handleSubmit}
          className="rounded-md bg-ab px-3 py-1.5 text-xs font-medium text-abt transition-all hover:brightness-110"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="rounded-md border border-b1 bg-transparent px-3 py-1.5 text-xs font-medium text-t2 transition-all hover:bg-bg3h hover:text-t1"
          >
            {cancelLabel}
          </button>
        )}
      </div>
    </CardShell>
  );
}
