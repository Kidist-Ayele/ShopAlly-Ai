// src/types/Compare/Comparisons.ts
import { Product } from "../types"; // ✅ reuse main Product

export interface ComparisonResponse {
  data: {
    products: ComparisonItem[];
    overallComparison: OverallComparison;
  };
  error?: string | null;
}

export interface ComparisonItem {
  product: Product;
  synthesis: Synthesis;
}

export interface Price {
  etb: number;
  usd: number;
  fxTimestamp: string; // ISO date string
}

export interface Synthesis {
  pros: string[];
  cons: string[];
  isBestValue: boolean;
  features: Record<string, string>;
}

export interface OverallComparison {
  bestValueProduct: string;
  bestValueLink: string;
  bestValuePrice: Price;
  keyHighlights: string[];
  summary: string;
}

export interface ComparePayload {
  products: Array<
    Pick<
      Product,
      | "id"
      | "title"
      | "imageUrl"
      | "aiMatchPercentage"
      | "price"
      | "productRating"
      | "sellerScore"
      | "deliveryEstimate"
      | "summaryBullets"
      | "deeplinkUrl"
    >
  >;
}
