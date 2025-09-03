// shopally-web/src/hooks/useSavedItems.ts
"use client";

import type { SavedItem, SavedItemUI } from "@/types/types";
import { useCallback, useEffect, useState } from "react";

const LOCAL_DB_KEY = "itemsList";
const ORDERS_DB_KEY = "ordersList";

interface LocalDb {
  savedItems: SavedItem[];
}

interface Order {
  id: string;
  productId: string;
  productTitle: string;
  price: { etb: number; usd: number; fxTimestamp: string };
  orderDate: string;
}

const loadLocalDb = (): { savedItems: SavedItemUI[] } => {
  if (typeof window === "undefined") return { savedItems: [] };
  try {
    return JSON.parse(
      localStorage.getItem(LOCAL_DB_KEY) || '{"savedItems":[] }'
    );
  } catch {
    return { savedItems: [] };
  }
};

export const useSavedItems = (maxItems = 50) => {
  const [savedItems, setSavedItems] = useState<SavedItemUI[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setSavedItems(loadLocalDb().savedItems);
    // Load orders from localStorage
    if (typeof window !== "undefined") {
      try {
        const savedOrders = localStorage.getItem(ORDERS_DB_KEY);
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      } catch {
        setOrders([]);
      }
    }
  }, []);

  const saveItem = useCallback((item: SavedItem) => {
    setSavedItems((prev) => {
      const prevItem = prev.find((i) => i.id === item.id);
      const uiItem: SavedItemUI = {
        ...item,
        rating: item.productRating,
        ratingCount: prevItem?.ratingCount || 0,
        oldPrice: prevItem?.oldPrice,
        seller: prevItem?.seller || "Unknown",
        checked: prevItem?.checked || "N/A",
        priceAlertOn: prevItem?.priceAlertOn ?? false, // make sure boolean
        placeholderText: "IMG",
      };

      let newList = prev.filter((i) => i.id !== item.id);
      newList.push(uiItem);

      localStorage.setItem(
        LOCAL_DB_KEY,
        JSON.stringify({ savedItems: newList })
      );
      return newList;
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setSavedItems((prev) => {
      const newList = prev.filter((item) => item.id !== itemId);
      localStorage.setItem(
        LOCAL_DB_KEY,
        JSON.stringify({ savedItems: newList })
      );
      return newList;
    });
  }, []);

  const updateItemPrice = useCallback(
    (
      itemId: string,
      newPrice: { etb: number; usd: number; fxTimestamp: string }
    ) => {
      setSavedItems((prev) => {
        const newList = prev.map((item) =>
          item.id === itemId ? { ...item, price: { ...newPrice } } : item
        );
        localStorage.setItem(
          LOCAL_DB_KEY,
          JSON.stringify({ savedItems: newList })
        );
        return newList;
      });
    },
    []
  );

  const alertChange = useCallback((itemId: string) => {
    setSavedItems((prev) => {
      const newList = prev.map((item) =>
        item.id === itemId
          ? { ...item, priceAlertOn: !item.priceAlertOn }
          : item
      );
      localStorage.setItem(
        LOCAL_DB_KEY,
        JSON.stringify({ savedItems: newList })
      );
      return newList;
    });
  }, []);

  const placeOrder = useCallback((productId: string, productTitle: string, price: { etb: number; usd: number; fxTimestamp: string }) => {
    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId,
      productTitle,
      price,
      orderDate: new Date().toISOString(),
    };

    setOrders((prev) => {
      const newOrders = [...prev, newOrder];
      localStorage.setItem(ORDERS_DB_KEY, JSON.stringify(newOrders));
      return newOrders;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSavedItems([]);
    localStorage.removeItem(LOCAL_DB_KEY);
  }, []);

  return {
    savedItems,
    orders,
    saveItem,
    removeItem,
    alertChange,
    updateItemPrice,
    placeOrder,
    clearAll,
  };
};
