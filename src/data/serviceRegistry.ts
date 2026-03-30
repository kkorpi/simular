import type { ReactNode } from "react";

export type OAuthProvider = "google" | "apple" | "microsoft" | "github" | "facebook";

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
  /** OAuth sign-in providers available on this site (e.g., "Sign in with Google") */
  oauthProviders?: OAuthProvider[];
}

export const serviceRegistry: Record<string, ServiceConfig> = {
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    accentColor: "blue",
    brandColor: "var(--brand-linkedin)",
    fields: [
      { key: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
      { key: "password", label: "Password", type: "password", placeholder: "", autoComplete: "current-password" },
    ],
    supports2FA: true,
    trustDomain: "linkedin.com",
    oauthProviders: ["google", "apple"],
  },
  gmail: {
    id: "gmail",
    name: "Gmail",
    accentColor: "default",
    brandColor: "var(--brand-gmail)",
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
    brandColor: "var(--brand-salesforce)",
    fields: [
      { key: "username", label: "Username", type: "text", placeholder: "user@company.com", autoComplete: "username" },
      { key: "password", label: "Password", type: "password", placeholder: "", autoComplete: "current-password" },
    ],
    supports2FA: true,
    trustDomain: "salesforce.com",
    oauthProviders: ["google"],
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
      oauthProviders: ["google", "apple", "microsoft"],
    }
  );
}
