export type ProcessorId =
  | "gg-cloudflare"
  | "google-play-billing"
  | "apple-app-store"
  | "voodoo-tinysauce"
  | "gameanalytics"
  | "adjust"
  | "meta";

export type ProcessorInfo = {
  id: ProcessorId;
  name: string;
  role: string;
  dataProcessed: string;
  policyUrl: string;
  policyLabel: string;
};

export const PROCESSORS: Record<ProcessorId, ProcessorInfo> = {
  "gg-cloudflare": {
    id: "gg-cloudflare",
    name: "Cloudflare (hosting imprfct gg backend)",
    role: "Cloud infrastructure host for our first-party game backend (accounts, cloud saves, multiplayer rooms, purchase verification, analytics, and crash diagnostics)",
    dataProcessed:
      "IP address (network routing, sign-in rate limiting, and country derivation), per-game player ID, hashed device sign-in credential, cloud save, match inputs and replays, purchase verification records, gameplay events, and error reports",
    policyUrl: "https://www.cloudflare.com/privacypolicy/",
    policyLabel: "Cloudflare Privacy Policy",
  },
  "google-play-billing": {
    id: "google-play-billing",
    name: "Google Play Billing (independent store processor)",
    role: "Payment and store transaction processing on Android, plus server-side receipt verification",
    dataProcessed:
      "Product ID, purchase token, order ID, transaction/refund status, and obfuscated player ID reference (obfuscatedAccountId)",
    policyUrl: "https://policies.google.com/privacy",
    policyLabel: "Google Privacy Policy",
  },
  "apple-app-store": {
    id: "apple-app-store",
    name: "Apple App Store (independent store processor)",
    role: "Payment and store transaction processing on iOS, plus server-side receipt verification",
    dataProcessed:
      "Signed transaction data, product ID, transaction/refund status, and player ID reference (appAccountToken)",
    policyUrl: "https://www.apple.com/legal/privacy/",
    policyLabel: "Apple Privacy Policy",
  },
  "voodoo-tinysauce": {
    id: "voodoo-tinysauce",
    name: "Voodoo (TinySauce and Voodoo Analytics)",
    role: "Consent region check and gameplay/performance analytics on Android",
    dataProcessed:
      "Generated analytics user ID, session and gameplay events, device/OS metadata, and IP-derived region for consent checks",
    policyUrl: "https://www.voodoo.io/privacy",
    policyLabel: "Voodoo Privacy Policy",
  },
  gameanalytics: {
    id: "gameanalytics",
    name: "GameAnalytics",
    role: "Gameplay metrics, frame-rate performance, and client error reporting on Android",
    dataProcessed:
      "App Set ID / device identifiers, session and progression metrics, FPS metrics, and error events",
    policyUrl: "https://gameanalytics.com/privacy",
    policyLabel: "GameAnalytics Privacy Policy",
  },
  adjust: {
    id: "adjust",
    name: "Adjust",
    role: "Install attribution and campaign measurement on Android",
    dataProcessed:
      "Advertising ID (AD_ID where permitted), install referrer, app install/open events, and device/OS metadata",
    policyUrl: "https://www.adjust.com/terms/privacy-policy/",
    policyLabel: "Adjust Privacy Policy",
  },
  meta: {
    id: "meta",
    name: "Meta (Facebook SDK)",
    role: "Install attribution and campaign measurement (only if enabled in a release build)",
    dataProcessed:
      "App install/launch events and advertising identifiers where permitted",
    policyUrl: "https://www.facebook.com/privacy/policy/",
    policyLabel: "Meta Privacy Policy",
  },
};
