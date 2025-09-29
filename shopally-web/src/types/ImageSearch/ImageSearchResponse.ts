// src/types/ImageSearch/ImageSearchResponse.ts

import { Product } from "../types";

export interface ImageSearchRequest {
  image: File;
  priceMaxETB?: number;
  minRating?: number;
  confidenceThreshold?: number;
}

export interface ImageSearchProduct {
  id: string;
  title: string;
  imageUrl: string;
  aiMatchPercentage: number;
  price: {
    etb: number;
    usd: number;
    fxTimestamp: string;
  };
  productRating: number;
  sellerScore: number;
  deliveryEstimate: string;
  summaryBullets: string[];
  deeplinkUrl: string;
}

export interface ImageSearchMatch {
  product: ImageSearchProduct;
  confidence: number;
  boundingBox: [number, number, number, number];
}

export interface ImageSearchResponse {
  data:
    | {
        products: Product[];
        processingTime: number;
      }
    | string
    | null;
  error: {
    code: string;
    message: string;
  } | null;
}
