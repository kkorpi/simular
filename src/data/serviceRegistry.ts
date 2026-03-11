import type { ReactNode } from "react";

export interface AuthField {
  key: string;
  label: string;
  type: "email" | "password" | "text" | "code";
  placeholder?: string;
  autoComplete?: string;
}

export interface ServiceConfig {
  id: string;
  name: string;
  /** Accent color key for the auth UI */
  accentColor: string;
  /** Brand color for buttons and icons (CSS color value) */
  brandColor: string;
  /** Default credential fields */
  fields: AuthField[];
  /** Whether this service commonly requires 2FA */
  supports2FA: boolean;
  /** Domain used for trust signal display */
  trustDomain: string;
}

export const serviceRegistry: Record<string, ServiceConfig> = {
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    accentColor: "blue",
    brandColor: "#0A66C2",
    fields: [
      { key: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
      { key: "password", label: "Password", type: "password", placeholder: "", autoComplete: "current-password" },
    ],
    supports2FA: true,
    trustDomain: "linkedin.com",
  },
  gmail: {
    id: "gmail",
    name: "Gmail",
    accentColor: "default",
    brandColor: "#EA4335",
    fields: [
      { key: "email", label: "Email", type: "email", placeholder: "you@gmail.com", autoComplete: "email" },
      { key: "password", label: "Password", type: "password", placeholder: "", autoComplete: "current-password" },
    ],
    supports2FA: true,
    trustDomain: "google.com",
  },
  salesforce: {
    id: "salesforce",
    name: "Salesforce",
    accentColor: "blue",
    brandColor: "#00A1E0",
    fields: [
      { key: "username", label: "Username", type: "text", placeholder: "user@company.com", autoComplete: "username" },
      { key: "password", label: "Password", type: "password", placeholder: "", autoComplete: "current-password" },
    ],
    supports2FA: true,
    trustDomain: "salesforce.com",
  },
};

/** 2FA field used when the service requires verification */
export const twoFactorField: AuthField = {
  key: "code",
  label: "Code",
  type: "code",
  placeholder: "000000",
};

/** Get a service config by ID, falling back to a generic config */
export function getService(id: string): ServiceConfig {
  return (
    serviceRegistry[id.toLowerCase()] ?? {
      id: id.toLowerCase(),
      name: id,
      accentColor: "default",
      brandColor: "var(--as)",
      fields: [
        { key: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
        { key: "password", label: "Password", type: "password", placeholder: "", autoComplete: "current-password" },
      ],
      supports2FA: false,
      trustDomain: id.toLowerCase() + ".com",
    }
  );
}
