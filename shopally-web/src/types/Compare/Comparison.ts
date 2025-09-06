// src/types/Compare/Comparisons.ts

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

export interface Product {
  id: string;
  title: string;
  imageUrl: string;
  aiMatchPercentage: number;
  price: Price;
  productRating: number;
  deliveryEstimate: string;
  description: string;
  productSmallImageUrls: string[] | null;
  numberSold: number;
  summaryBullets: string[];
  deeplinkUrl: string;
  taxRate: number;
  discount: number;
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
  features: Record<string, string>; // flexible key-value
}

export interface OverallComparison {
  bestValueProduct: string;
  bestValueLink: string;
  bestValuePrice: Price;
  keyHighlights: string[];
  summary: string;
}
