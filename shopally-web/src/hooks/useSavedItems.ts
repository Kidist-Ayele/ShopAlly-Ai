// src/hooks/useSavedItems.ts
"use client";

import {
  useCreateAlertMutation,
  useDeleteAlertMutation,
  useUpdatePriceMutation,
} from "@/lib/redux/api/userApiSlice";
import { AlertCreateResponse } from "@/types/SavedItems/AlertCreateResponse";
import type { SavedItem, SavedItemUI } from "@/types/types";
import { useCallback, useEffect, useState, useRef } from "react";

const LOCAL_DB_KEY = "itemsList";
const ORDERS_DB_KEY = "ordersList";

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

// ✅ helper to read deviceId from cookie
function getDeviceIdFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/deviceId=([^;]+)/);
  return match ? match[1] : null;
}

export const useSavedItems = (maxItems = 50) => {
  const [savedItems, setSavedItems] = useState<SavedItemUI[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingPrices, setLoadingPrices] = useState<Set<string>>(new Set());

  const [createAlert] = useCreateAlertMutation();
  const [deleteAlert] = useDeleteAlertMutation();
  const [updatePriceApi] = useUpdatePriceMutation();

  // Ref to track current savedItems to avoid stale closures
  const savedItemsRef = useRef<SavedItemUI[]>([]);

  useEffect(() => {
    const initialItems = loadLocalDb().savedItems;
    setSavedItems(initialItems);
    savedItemsRef.current = initialItems;

    if (typeof window !== "undefined") {
      try {
        const savedOrders = localStorage.getItem(ORDERS_DB_KEY);
        if (savedOrders) setOrders(JSON.parse(savedOrders));
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
        priceAlertOn: prevItem?.priceAlertOn ?? false,
        placeholderText: "IMG",
      };

      let newList = [...prev.filter((i) => i.id !== item.id), uiItem];

      if (newList.length > maxItems) {
        newList = newList.slice(newList.length - maxItems);
      }

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

  const alertChange = useCallback(
    async (itemId: string) => {
      const item = savedItems.find((i) => i.id === itemId);
      if (!item) {
        return;
      }

      const newStatus = !item.priceAlertOn;

      // Optimistic UI update
      setSavedItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, priceAlertOn: newStatus } : i
        )
      );

      try {
        if (newStatus) {
          // TURN ON
          const deviceId = getDeviceIdFromCookie();
          if (!deviceId) {
            return;
          }

          const res: AlertCreateResponse = await createAlert({
            productId: item.id,
            deviceId,
            productTitle: item.title,
            currentPriceETB: item.price.usd,
          }).unwrap();

          const alertId = res.data?.alertId;

          if (alertId) {
            setSavedItems((prev) => {
              const newList = prev.map((i) =>
                i.id === itemId ? { ...i, priceAlertOn: true, alertId } : i
              );
              localStorage.setItem(
                LOCAL_DB_KEY,
                JSON.stringify({ savedItems: newList })
              );
              return newList;
            });
          }
        } else {
          // TURN OFF
          const alertId = item.alertId;

          if (!alertId) {
            return;
          }

          const res = await deleteAlert({ id: alertId }).unwrap();

          setSavedItems((prev) => {
            const newList = prev.map((i) =>
              i.id === itemId
                ? { ...i, priceAlertOn: false, alertId: undefined }
                : i
            );
            localStorage.setItem(
              LOCAL_DB_KEY,
              JSON.stringify({ savedItems: newList })
            );
            return newList;
          });
        }
      } catch (err) {
        // revert UI
        setSavedItems((prev) =>
          prev.map((i) =>
            i.id === itemId ? { ...i, priceAlertOn: item.priceAlertOn } : i
          )
        );
      }
    },
    [savedItems, createAlert, deleteAlert]
  );

  const placeOrder = useCallback(
    (
      productId: string,
      productTitle: string,
      price: { etb: number; usd: number; fxTimestamp: string }
    ) => {
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
    },
    []
  );


  const refreshPrice = useCallback(
    async (itemId: string) => {
      try {
        // Set loading state for this item
        setLoadingPrices(prev => new Set(prev).add(itemId));

        // Call backend to get the EXACT current price
        const res = await updatePriceApi({ productId: itemId }).unwrap();


        if (res?.data) {
          // Update using setSavedItems callback to get the most current state
          setSavedItems((prevItems) => {
            const item = prevItems.find((i: SavedItemUI) => i.id === itemId);
            if (!item) {
              return prevItems; // Item not found, return unchanged
            }

            // Calculate ETB price if backend returns 0
            const backendETB = res.data?.updated_price_etb ?? 0;
            const backendUSD = res.data?.updated_price_usd ?? 0;
            
            // If ETB is 0 but USD is valid, calculate ETB using the same exchange rate as homepage
            let finalETB = backendETB;
            if (backendETB === 0 && backendUSD > 0) {
              // Calculate the exchange rate from the old price to match homepage behavior
              const oldETB = item.price.etb;
              const oldUSD = item.price.usd;
              
              if (oldETB > 0 && oldUSD > 0) {
                // Use the same exchange rate that was used when the item was first saved
                const exchangeRate = oldETB / oldUSD;
                finalETB = backendUSD * exchangeRate;
              } else {
                // Fallback to the default rate if we can't calculate from old price
                const USD_TO_ETB_RATE = 57.5;
                finalETB = backendUSD * USD_TO_ETB_RATE;
              }
            }


            // Update with the calculated price (ETB calculated if needed, USD from backend)
            const newList = prevItems.map((i: SavedItemUI) =>
              i.id === itemId
                ? {
                    ...i,
                    price: {
                      etb: finalETB, // Calculated ETB if backend returned 0
                      usd: backendUSD, // Exact USD from backend
                      fxTimestamp: new Date().toISOString(), // Current timestamp
                    },
                  }
                : i
            );

            // Update localStorage with the new price
            localStorage.setItem(
              LOCAL_DB_KEY,
              JSON.stringify({ savedItems: newList })
            );

            // Update ref with the new list
            savedItemsRef.current = newList;
            
            return newList;
          });
        }
      } catch (err) {
        console.error("Failed to refresh price:", err);
        // You can add user-friendly error handling here if needed
      } finally {
        // Remove loading state for this item
        setLoadingPrices(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }
    },
    [updatePriceApi]
  );

  const clearAll = useCallback(() => {
    setSavedItems([]);
    savedItemsRef.current = [];
    localStorage.removeItem(LOCAL_DB_KEY);
  }, []);

  useEffect(() => {
    savedItemsRef.current = savedItems;
  }, [savedItems]);

  // Helper function to check if an item is currently loading
  const isPriceLoading = useCallback((itemId: string) => {
    return loadingPrices.has(itemId);
  }, [loadingPrices]);

  return {
    savedItems,
    orders,
    saveItem,
    removeItem,
    alertChange,
    updateItemPrice,
    placeOrder,
    refreshPrice,
    clearAll,
    isPriceLoading,
  };
};
