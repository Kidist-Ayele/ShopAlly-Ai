"use client";

import React, { createContext, useContext } from "react";
import { useSavedItems } from "@/hooks/useSavedItems";

interface SavedItemsContextType {
  savedItems: any[];
  orders: any[];
  saveItem: (item: any) => void;
  removeItem: (itemId: string) => void;
  alertChange: (itemId: string) => Promise<void>;
  updateItemPrice: (itemId: string, price: any) => void;
  placeOrder: (productId: string, productTitle: string, price: any) => void;
  refreshPrice: (itemId: string) => Promise<void>;
  clearAll: () => void;
  isPriceLoading: (itemId: string) => boolean;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(
  undefined
);

export const SavedItemsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const savedItemsHook = useSavedItems();

  return (
    <SavedItemsContext.Provider value={savedItemsHook}>
      {children}
    </SavedItemsContext.Provider>
  );
};

export const useSavedItemsContext = (): SavedItemsContextType => {
  const context = useContext(SavedItemsContext);
  if (context === undefined) {
    throw new Error(
      "useSavedItemsContext must be used within a SavedItemsProvider"
    );
  }
  return context;
};
