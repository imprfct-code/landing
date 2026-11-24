import type { GameLegalConfig } from "./types";

export const capDuel: GameLegalConfig = {
  slug: "cap-duel",
  name: "Cap Duel",
  tagline: "PvP bluff duel over 24-card topic walls for mobile.",
  effectiveDate: "2026-11-24",
  lastUpdated: "2026-11-24",
  platforms: {
    android: { packageId: "com.imprfct.capduel" },
    ios: { bundleId: "com.imprfct.capduel" },
  },
  audience: {
    minimumAge: 13,
    directedAtChildren: false,
    note: "Cap Duel is intended for a general audience aged 13 and older. Where consent is the legal basis for processing, players under the local digital consent age (16 in Belarus and in parts of the EEA) need permission from a parent or legal representative. We do not knowingly collect personal data from children under the applicable age.",
  },
  consentControls: {
    inAppPath: "Home > Settings > Privacy (Android) and Home > Settings > Analytics & Diagnostics (iOS)",
    description:
      "Optional gameplay analytics and crash diagnostics are off by default until you enable them, including if a region consent check fails or times out. On Android, install measurement (Adjust) is a separate choice that starts only with attribution consent and disables tracking and third-party sharing when turned off. You can change or withdraw your choices at any time in Settings without affecting core gameplay, cloud saves, multiplayer, or purchases.",
  },
  dataCategories: [
    {
      category: "Essential sign-in, security, and abuse prevention",
      examples:
        "Server-assigned player ID (UUID), hashed device sign-in credential (Android derives it from the device identifier and app ID; iOS stores a generated credential in Keychain, and these credentials can survive reinstall), session JWTs, and network IP address received by Cloudflare (used to rate-limit new guest accounts from the same network and to derive a country code).",
      purpose:
        "Authenticate your guest profile, protect the backend against automated abuse and spam accounts, and route traffic reliably.",
      lawfulBasis:
        "Performance of a contract (delivering online access); legitimate interest in preventing abuse and keeping the service secure.",
      recipients: "Cloudflare (hosting our imprfct gg backend).",
      retention:
        "Session tokens expire after 30 days. Sign-in credentials and account directory links stay active until account deletion. After deletion, old tokens are rejected for telemetry and account requests. Rate-limit counters are short-lived in memory; operational logs follow Cloudflare's managed retention.",
    },
    {
      category: "Guest profile and cloud save",
      examples:
        "Chosen display name, avatar customization (parts, skin color, dyes), trophies, match and win counts, unlocked topics and XP, coins, hints, daily streaks, quests, owned items, applied grants, and inbox gifts.",
      purpose:
        "Sync your progress across sessions, deliver rewards and purchases to your inbox, and keep your profile intact across devices or reinstalls.",
      lawfulBasis: "Performance of a contract (delivering the game you requested).",
      recipients: "Cloudflare (hosting our imprfct gg backend).",
      retention:
        "Kept while your profile is active and erased from private player storage when you delete your account.",
    },
    {
      category: "Multiplayer and friends",
      examples:
        "Display name, avatar look, trophies, level, language, continent-level matchmaking placement hint, match inputs (bids, card taps, hints, actions), friend codes, friend list connections, and private table challenges.",
      purpose:
        "Match you with opponents, run live duels, display your chosen name and avatar to rivals and friends, and investigate cheating or broken matches.",
      lawfulBasis:
        "Performance of a contract; legitimate interest in fair play and match integrity.",
      recipients:
        "Cloudflare (hosting our imprfct gg backend); display name and avatar are visible to opponents and friends in-game.",
      retention:
        "Live room state is deleted right after match settlement. Archived match replays expire automatically after 30 days. Friend challenges expire after 5 minutes. Personal match history, ratings, and friend connections are deleted on account deletion.",
    },
    {
      category: "In-app purchases",
      examples:
        "Store product ID (coin and hint packs), Google Play purchase token / order ID or Apple signed transaction, transaction and refund status, price, currency, and player ID reference (obfuscatedAccountId / appAccountToken).",
      purpose:
        "Verify purchases with Google Play or Apple, credit purchased items exactly once, process refunds or chargebacks, and keep financial records.",
      lawfulBasis:
        "Performance of a contract; legitimate interest in fraud prevention and dispute resolution; compliance with applicable accounting and tax rules.",
      recipients:
        "Cloudflare (hosting our imprfct gg backend), Google Play Billing (Android), and Apple App Store (iOS).",
      retention:
        "Purchase transaction ledger records are retained after account deletion for accounting, tax, refund handling, and fraud prevention.",
    },
    {
      category: "Gameplay analytics and experiments (optional)",
      examples:
        "Player ID, session UUID, timestamps, session duration, gameplay events (tutorial steps, duel results, daily runs, topic picks, currency earned/spent, store opens), A/B experiment assignments, app version, device model, OS version, and IP-derived country code.",
      purpose:
        "Understand progression, balance topics and economy, measure client performance (such as FPS), and evaluate remote config experiments.",
      lawfulBasis:
        "Consent (off by default on both Android and iOS; withdrawing consent stops collection immediately and clears unsent local queues).",
      recipients:
        "Cloudflare (hosting our imprfct gg backend); on Android, also Voodoo Analytics (TinySauce) and GameAnalytics when analytics consent is enabled.",
      retention:
        "Live player snapshots are purged on account deletion. Aggregated daily rollups contain no player IDs. Analytics table snapshots are configured to expire after 7 days (minimum 5 snapshots); historical raw warehouse rows in gg currently have no automatic row-level age purge. Partner analytics follow each partner's retention policy.",
    },
    {
      category: "Diagnostics and crash reports (optional)",
      examples:
        "Error type, message, stack trace, active scene, recent event names, app version, device model, OS version, platform, and IP-derived country code. Email-like strings and runs of nine or more digits are masked in error messages and stack traces.",
      purpose: "Detect, diagnose, and fix crashes, exceptions, and performance defects.",
      lawfulBasis:
        "Consent (gated together with optional telemetry; off by default until enabled and stopped immediately on withdrawal).",
      recipients:
        "Cloudflare (hosting our imprfct gg backend); on Android, GameAnalytics error reporting when analytics consent is enabled.",
      retention:
        "Live diagnostic snapshots are size-bounded and purged on account deletion. Historical error warehouse rows in gg currently have no automatic row-level age purge.",
    },
    {
      category: "Install measurement and attribution (Android, optional)",
      examples:
        "Android Advertising ID (AD_ID where permitted), Google Play install referrer, install and session timestamps, device and OS metadata.",
      purpose: "Measure install sources and campaign performance on Android.",
      lawfulBasis:
        "Consent (separate opt-in choice on Android; off by default; withdrawing disables Adjust tracking and third-party sharing).",
      recipients: "Adjust (Android builds only, when attribution consent is enabled).",
      retention: "Retained according to Adjust's configured retention settings and privacy policy.",
    },
  ],
  processors: [
    {
      id: "gg-cloudflare",
      platforms: "Android and iOS",
      note: "Cloudflare hosts our first-party backend globally across Workers, D1, Durable Objects, R2, and Pipelines without pinning storage to a single country. Support and administration are accessed from Belarus.",
    },
    {
      id: "google-play-billing",
      platforms: "Android",
      note: "Google processes payment details independently as the store operator; our backend receives only verification tokens, product IDs, and transaction status.",
    },
    {
      id: "apple-app-store",
      platforms: "iOS",
      note: "Apple processes payment details independently as the store operator; our backend receives only signed transaction records and status.",
    },
    {
      id: "voodoo-tinysauce",
      platforms: "Android",
      note: "Present on Android builds only (disabled on iOS). Optional analytics stays off until consent is granted and stops on withdrawal.",
    },
    {
      id: "gameanalytics",
      platforms: "Android",
      note: "Present on Android builds only (disabled on iOS). Starts only with analytics consent and stops event submission on withdrawal.",
    },
    {
      id: "adjust",
      platforms: "Android",
      note: "Present on Android builds only (disabled on iOS). Starts only with attribution consent and disables tracking and third-party sharing on withdrawal.",
    },
  ],
  deletion: {
    inAppAvailable: true,
    inAppSteps:
      "Open Cap Duel and go to Home > Settings > Delete Account (available on both Android and iOS). Confirm that you want to permanently erase your account, progress, and unused virtual currency. The game pauses cloud sync, deletes your server profile, removes local save files (player.json), and resets to a fresh session.",
    webInstructions:
      "If you have already uninstalled Cap Duel, email hello@imprfct.dev with 'Cap Duel account deletion'. Include your platform (Android or iOS) and a Player ID, Friend Code, or store order reference if you have one. We may ask for additional information to verify ownership and will confirm when deletion is complete.",
    verificationDetails: [
      "Player ID, Friend Code, or a Google Play / App Store order ID help us locate the profile (they are lookup clues, not standalone proof of ownership).",
      "Do not send passwords, payment card details, or raw device secret files by email.",
      "Because Cap Duel uses a server guest profile without an email login, if you have uninstalled the app and have no purchase record or linked provider, we may ask for additional verification or explain if the profile cannot be matched safely.",
    ],
    erasedImmediately: [
      "Cloud save progress (trophies, coins, hints, deck progress, avatar look, chosen display name, inbox gifts) and local device save files when deleted in-app.",
      "Private player storage (ratings, personal match history, pending grants, active entitlements).",
      "Device and provider login links, plus friend profiles, requests, and friendships in both directions.",
      "Live analytics activity snapshots and sampled error entries for your account (blocked from delayed restoration by a deletion marker).",
    ],
    retainedItems: [
      {
        item: "Deletion tombstone (player ID, game slug, deletion timestamp)",
        reason:
          "Rejects old cached sessions (including late telemetry batches) and prevents late grants or delayed writes from recreating deleted state.",
        period: "Kept as a minimal technical safeguard.",
      },
      {
        item: "In-app purchase ledger (transaction/order IDs, product, price, currency, refund status)",
        reason:
          "Needed for accounting, tax recordkeeping, refund handling, and fraud prevention.",
        period: "Kept for the period required by applicable accounting and tax rules.",
      },
      {
        item: "Historical raw analytics events and error reports",
        reason:
          "Historical warehouse rows still carry the historical player ID and are not retroactively deleted row-by-row when a profile is erased; new telemetry for deleted accounts is rejected.",
        period:
          "Catalog snapshots expire after 7 days (minimum 5 snapshots); historical raw rows currently have no automatic row-level age purge. Aggregated daily metrics contain no player IDs.",
      },
      {
        item: "Shared match replays",
        reason: "Used for match integrity and debugging of finished multiplayer duels.",
        period: "Automatically expire after 30 days.",
      },
      {
        item: "Infrastructure backups and operational logs",
        reason: "Platform disaster recovery and service reliability on Cloudflare.",
        period: "Subject to Cloudflare's managed backup and log retention windows.",
      },
    ],
  },
  terms: {
    hasPurchases: true,
    purchaseItems: "virtual currency (coin packs) and in-game consumables (hint packs)",
    hasMultiplayer: true,
    hasUserNames: true,
  },
};
