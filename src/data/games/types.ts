import type { ProcessorId } from "../legal/processors";

export type DataCategoryRow = {
  category: string;
  examples: string;
  purpose: string;
  lawfulBasis: string;
  recipients: string;
  retention: string;
};

export type GameProcessorEntry = {
  id: ProcessorId;
  platforms: "Android" | "iOS" | "Android and iOS";
  note?: string;
};

export type GameLegalConfig = {
  slug: string;
  name: string;
  tagline: string;
  effectiveDate: string;
  lastUpdated: string;
  platforms: {
    android?: { packageId: string };
    ios?: { bundleId: string };
  };
  audience: {
    minimumAge: number;
    directedAtChildren: boolean;
    note: string;
  };
  publisherOverride?: {
    legalEntity?: string;
    country?: string;
    privacyEmail?: string;
  };
  consentControls: {
    inAppPath: string;
    description: string;
  };
  dataCategories: DataCategoryRow[];
  processors: GameProcessorEntry[];
  deletion: {
    inAppAvailable: boolean;
    inAppSteps?: string;
    webInstructions: string;
    verificationDetails: string[];
    erasedImmediately: string[];
    retainedItems: {
      item: string;
      reason: string;
      period: string;
    }[];
  };
  terms: {
    hasPurchases: boolean;
    purchaseItems?: string;
    hasMultiplayer: boolean;
    hasUserNames: boolean;
  };
};
