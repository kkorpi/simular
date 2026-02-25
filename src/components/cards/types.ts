import type { ReactNode } from "react";

export type CardAction = {
  label: string;
  style: "primary" | "outline" | "text";
  onClick: () => void;
  icon?: ReactNode;
};
