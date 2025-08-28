// --- Currency & FX ---
export type Currency = "ETB" | "USD";

export interface FXRate {
  from: Currency;
  to: Currency;
  rate: number;
  source: string; 
  updatedAt: string; 
}

// --- User ---
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  language: "am" | "en";
  createdAt: string;
  updatedAt: string;
}

// --- Product ---
export interface Product {
  id: string;
  title: string;
  img: string;
  priceUSD: number;
  priceETB: number;
  fxTime: string; 
  rating?: number;
  sellerScore?: number;
  specs?: Record<string, string | number>;
  shipping?: {
    minDays?: number;
    maxDays?: number;
    shipFrom?: string;
  };
  category?: string;
  deeplinkUrl: string;
  lastChecked: string;
  restricted?: boolean;
}

// --- Review Summary ---
export interface ReviewSummary {
  bullets: string[];
  topReviewSnippets?: string[];
}

// --- Cart ---
export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalETB: number;
  currency: Currency;
}

// --- Delivery Estimate ---
export interface DeliveryEstimate {
  productId: string;
  estimatedDays: number;
  provider: string;
  note?: string;
}

// --- Intent Parsing ---
export interface IntentParseResult {
  intent: "search" | "add_to_cart" | "checkout" | "other";
  category?: string;
  constraints?: {
    priceMaxETB?: number;
    brand?: string[];
    features?: string[];
  };
  query?: string;
  productId?: string;
}

// --- Deeplink ---
export interface Deeplink {
  type: "product" | "cart" | "checkout";
  url: string;
}

// --- Saved Items & Searches ---

export type SavedItem = {
  title: string;
  rating: number;
  ratingCount: number;
  price: string;
  oldPrice: string;
  seller: string;
  checked: string;
  priceAlertOn: boolean;
  placeholderText: string;
};


export interface SavedSearch {
  query: string;
  constraints?: IntentParseResult["constraints"];
  alertOn: boolean;
  createdAt: string;
}

// --- User Preferences ---
export interface UserPrefs {
  language: "am" | "en";
  fxSource: string;
  lastFxUpdate: string;
}

// --- Compare View ---
export interface CompareItem {
  product: Product;
  pros?: string[];
  cons?: string[];
  isBestValue?: boolean;
}