// src/hooks/useSavedItems.ts
"use client";

import {
  useCreateAlertMutation,
  useDeleteAlertMutation,
  useUpdatePriceMutation,
} from "@/lib/redux/api/userApiSlice";
import { AlertCreateResponse } from "@/types/SavedItems/AlertCreateResponse";
import type { SavedItem, SavedItemUI } from "@/types/types";
import { useCallback, useEffect, useState } from "react";

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

// Global state to sync all instances
let globalSavedItems: SavedItemUI[] = [];
let globalSetters: React.Dispatch<React.SetStateAction<SavedItemUI[]>>[] = [];
let updateTimeout: NodeJS.Timeout | null = null;

export const useSavedItems = (maxItems = 50) => {
  const [savedItems, setSavedItems] = useState<SavedItemUI[]>(globalSavedItems);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingPrices, setLoadingPrices] = useState<Set<string>>(new Set());

  const [createAlert] = useCreateAlertMutation();
  const [deleteAlert] = useDeleteAlertMutation();

  // Register this setter globally
  useEffect(() => {
    globalSetters.push(setSavedItems);
    return () => {
      globalSetters = globalSetters.filter(setter => setter !== setSavedItems);
    };
  }, []);

  useEffect(() => {
    const loadedItems = loadLocalDb().savedItems;
    setSavedItems(loadedItems);
    
    // Update global state with loaded items
    globalSavedItems = loadedItems;

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
    const updateAllInstances = (newList: SavedItemUI[]) => {
      globalSavedItems = newList;
      
      // Clear any pending timeout to avoid conflicts
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      
      // Defer state updates to avoid render phase conflicts
      updateTimeout = setTimeout(() => {
        globalSetters.forEach(setter => setter(newList));
        updateTimeout = null;
      }, 0);
    };

    // Use global state as the source of truth for the current list
    const currentList = globalSavedItems.length > 0 ? globalSavedItems : savedItems;
    
    setSavedItems((prev) => {
      // Use the most current state available
      const baseList = globalSavedItems.length > 0 ? globalSavedItems : prev;
      
      const prevItem = baseList.find((i) => i.id === item.id);
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

      let newList = [...baseList.filter((i) => i.id !== item.id), uiItem];

      if (newList.length > maxItems) {
        newList = newList.slice(newList.length - maxItems);
      }

      localStorage.setItem(
        LOCAL_DB_KEY,
        JSON.stringify({ savedItems: newList })
      );
      
      // Update all instances
      updateAllInstances(newList);
      return newList;
    });
  }, [maxItems, savedItems]);

  const removeItem = useCallback((itemId: string) => {
    const updateAllInstances = (newList: SavedItemUI[]) => {
      globalSavedItems = newList;
      
      // Clear any pending timeout to avoid conflicts
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      
      // Defer state updates to avoid render phase conflicts
      updateTimeout = setTimeout(() => {
        globalSetters.forEach(setter => setter(newList));
        updateTimeout = null;
      }, 0);
    };

    setSavedItems((prev) => {
      // Use the most current state available
      const baseList = globalSavedItems.length > 0 ? globalSavedItems : prev;
      const newList = baseList.filter((item) => item.id !== itemId);
      
      localStorage.setItem(
        LOCAL_DB_KEY,
        JSON.stringify({ savedItems: newList })
      );
      
      // Update all instances
      updateAllInstances(newList);
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
      console.log("🚀 alertChange called for itemId:", itemId);

      const item = savedItems.find((i) => i.id === itemId);
      if (!item) {
        console.log("⚠️ Item not found in state");
        return;
      }

      console.log("Current item state:", item);

      const newStatus = !item.priceAlertOn;
      console.log("New toggle status will be:", newStatus);

      // Optimistic UI update
      setSavedItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, priceAlertOn: newStatus } : i
        )
      );
      console.log("✅ Optimistic UI update done");

      try {
        if (newStatus) {
          // TURN ON
          console.log("Turning ON alert...");

          const deviceId = getDeviceIdFromCookie();
          if (!deviceId) {
            console.warn("Device ID not ready yet, cannot create alert");
            return;
          }

          console.log("Using deviceId:", deviceId);
          console.log(item.title, item.price.usd);

          const res: AlertCreateResponse = await createAlert({
            productId: item.id,
            deviceId,
            productTitle: item.title,
            currentPriceETB: item.price.usd,
          }).unwrap();

          const alertId = res.data?.data?.alertId; // ✅ fixed nesting
          console.log("Alert created successfully:", res);
          console.log("alertId from response:", alertId);

          if (alertId) {
            setSavedItems((prev) => {
              const newList = prev.map((i) =>
                i.id === itemId ? { ...i, priceAlertOn: true, alertId } : i
              );
              localStorage.setItem(
                LOCAL_DB_KEY,
                JSON.stringify({ savedItems: newList })
              );
              console.log(
                "LocalStorage updated after creating alert:",
                newList
              );
              return newList;
            });
          } else {
            console.warn("⚠️ No alertId returned from createAlert API");
          }
        } else {
          // TURN OFF
          console.log("Turning OFF alert...");
          const alertId = item.alertId;
          console.log("Current alertId:", alertId);

          if (!alertId) {
            console.log("⚠️ No alertId found, skipping DELETE request");
            return;
          }

          const res = await deleteAlert({ id: alertId }).unwrap();
          console.log("Alert deleted successfully:", res);

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
            console.log("LocalStorage updated after deleting alert:", newList);
            return newList;
          });
        }
      } catch (err) {
        console.error("Alert API failed:", err);
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

  //update price
  const [updatePriceApi] = useUpdatePriceMutation();

  const refreshPrice = useCallback(
    async (itemId: string) => {
      try {
        // Set loading state for this item
        setLoadingPrices(prev => new Set(prev).add(itemId));

        // find the product in savedItems
        const item = savedItems.find((i) => i.id === itemId);
        if (!item) {
          console.warn("Product not found in savedItems");
          return;
        }

        // call backend
        console.log("🚀 CALLING BACKEND API for productId:", item.id);
        console.log("📡 API URL: /api/v1/product/" + item.id + "/price");
        
        const res = await updatePriceApi({ productId: item.id }).unwrap();
        
        console.log("🌐 RAW API RESPONSE:", res);
        console.log("📊 Response data:", res?.data);
        console.log("💵 Backend ETB:", res?.data?.updated_price_etb);
        console.log("💵 Backend USD:", res?.data?.updated_price_usd);
        console.log("⏰ Response timestamp:", new Date().toISOString());

        if (res?.data) {
          // Calculate ETB price if backend returns 0
          const backendETB = res.data?.updated_price_etb ?? 0;
          const backendUSD = res.data?.updated_price_usd ?? 0;
          
          console.log("🔍 Price calculation:");
          console.log("💰 Backend ETB:", backendETB);
          console.log("💰 Backend USD:", backendUSD);
          console.log("💰 Old ETB:", item.price.etb);
          console.log("💰 Old USD:", item.price.usd);
          
          // Always use the same exchange rate as homepage to maintain consistency
          let finalETB = backendETB;
          const oldETB = item.price.etb;
          const oldUSD = item.price.usd;
          
          if (oldETB > 0 && oldUSD > 0) {
            // Use the same exchange rate that was used when the item was first saved (homepage calculation)
            const exchangeRate = oldETB / oldUSD;
            finalETB = backendUSD * exchangeRate;
            console.log("🔄 Using HOMEPAGE exchange rate:", exchangeRate, "→ Final ETB:", finalETB);
            console.log("📊 Price consistency check:");
            console.log("   Old: USD", oldUSD, "→ ETB", oldETB, "(rate:", exchangeRate, ")");
            console.log("   New: USD", backendUSD, "→ ETB", finalETB, "(same rate:", exchangeRate, ")");
          } else if (backendETB > 0) {
            // If we can't calculate from old price, use backend ETB
            finalETB = backendETB;
            console.log("🔄 Using backend ETB:", finalETB);
          } else {
            // Fallback to the default rate if we can't calculate from old price
            const USD_TO_ETB_RATE = 57.5;
            finalETB = backendUSD * USD_TO_ETB_RATE;
            console.log("🔄 Using default exchange rate:", USD_TO_ETB_RATE, "→ Final ETB:", finalETB);
          }
          
          console.log("✅ Final calculated prices:");
          console.log("💰 Final ETB:", finalETB);
          console.log("💰 Final USD:", backendUSD);

          // ✅ only update etb and usd, keep fxTimestamp fresh
          setSavedItems((prev) => {
            const newList = prev.map((i) =>
              i.id === itemId
                ? {
                    ...i,
                    price: {
                      ...i.price, // keep old fxTimestamp or other keys
                      etb: finalETB, // Calculated ETB if backend returned 0
                      usd: backendUSD, // Exact USD from backend
                      fxTimestamp: new Date().toISOString(),
                    },
                  }
                : i
            );

            // log immediately inside updater
            console.log("📦 savedItems inside refreshPrice updater:", newList);

            localStorage.setItem(
              LOCAL_DB_KEY,
              JSON.stringify({ savedItems: newList })
            );
            console.log("📦 savedItems inside refreshPrice updater:", newList);
            return newList;
          });

          // log after state update (next tick)
          setTimeout(() => {
            console.log("📦 savedItems after state update:", savedItems);
          }, 0);

          console.log("✅ Price updated in localStorage & state:", {
            etb: finalETB,
            usd: backendUSD,
          });
        }
      } catch (err) {
        console.error("❌ Failed to refresh price:", err);
        console.error("❌ Error details:", {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          itemId: itemId
        });
      } finally {
        // Remove loading state for this item
        setLoadingPrices(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }
    },
    [savedItems, updatePriceApi]
  );

  const clearAll = useCallback(() => {
    setSavedItems([]);
    localStorage.removeItem(LOCAL_DB_KEY);
  }, []);

  // Helper function to check if price is loading for an item
  const isPriceLoading = useCallback((itemId: string) => {
    return loadingPrices.has(itemId);
  }, [loadingPrices]);

  useEffect(() => {
    console.log("📝 savedItems changed:", savedItems);
  }, [savedItems]);

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