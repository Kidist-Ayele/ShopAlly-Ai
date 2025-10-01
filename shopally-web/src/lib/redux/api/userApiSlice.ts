//src/lib/redux/api/userApiSlice.ts
import { ComparisonResponse, ComparePayload } from "@/types/Compare/Comparison";
import {
  ImageSearchRequest,
  ImageSearchResponse,
} from "@/types/ImageSearch/ImageSearchResponse";
import { AlertCreateResponse } from "@/types/SavedItems/AlertCreateResponse";
import { AlertDeleteResponse } from "@/types/SavedItems/AlertDeleteResponse";
import {
  CreateAlert,
  UpdateProductResponse,
} from "@/types/SavedItems/SavedItems";
import { Product, ProductResponse } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getLanguage } from "../languageBridge";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    prepareHeaders: async (headers) => {
      const langCode = getLanguage();
      if (langCode) {
        headers.set("Accept-Language", langCode);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    createAlert: builder.mutation<AlertCreateResponse, CreateAlert>({
      query: (data) => ({
        url: "alerts",
        method: "POST",
        body: data,
      }),
    }),
    deleteAlert: builder.mutation<AlertDeleteResponse, { id: string }>({
      query: (data) => ({
        url: `alerts/${data.id}`,
        method: "DELETE",
      }),
    }),
    searchProducts: builder.mutation<
      ProductResponse,
      {
        query: string;
        priceMaxETB?: number | null;
        minRating?: number | null;
        language?: string;
      }
    >({
      query: ({ query, priceMaxETB, minRating, language }) => {
        const params = new URLSearchParams({ q: query });
        if (priceMaxETB) params.append("priceMaxETB", String(priceMaxETB));
        if (minRating) params.append("minRating", String(minRating));
        if (language) params.append("language", language);

        return {
          url: `/search?${params.toString()}`, // ✅ use query params
          method: "GET",
        };
      },
    }),

    compareProducts: builder.mutation<
      ComparisonResponse,
      ComparePayload
    >({
      query: ({ q, products }) => {
        const params = new URLSearchParams();
        if (q) params.append("q", q);
        
        const url = params.toString() ? `compare?${params.toString()}` : "compare";
        
        return {
          url,
          method: "POST",
          body: { products },
        };
      },
    }),

    updatePrice: builder.mutation<UpdateProductResponse, { productId: string }>(
      {
        query: ({ productId }) => ({
          url: `product/${productId}/price`,
          method: "GET",
        }),
      }
    ),

    imageSearch: builder.mutation<ImageSearchResponse, ImageSearchRequest>({
      query: ({ image, priceMaxETB, minRating, confidenceThreshold }) => {
        const formData = new FormData();
        formData.append("image", image);
        if (priceMaxETB) formData.append("priceMaxETB", String(priceMaxETB));
        if (minRating) formData.append("minRating", String(minRating));
        if (confidenceThreshold)
          formData.append("confidenceThreshold", String(confidenceThreshold));

        return {
          url: "image/search",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useCreateAlertMutation,
  useDeleteAlertMutation,
  useSearchProductsMutation,
  useCompareProductsMutation,
  useUpdatePriceMutation,
  useImageSearchMutation,
} = userApi;
