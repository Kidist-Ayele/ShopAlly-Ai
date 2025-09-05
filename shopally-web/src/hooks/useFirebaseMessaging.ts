// src/hooks/useFirebaseMessaging.ts
"use client";

import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";

const VAPID_KEY =
  "BHEl7o9T0-isznApxoHftL7dJ7yrgl91HCm2C287pL-U9UYjH_jCYmy4ElbMUBkP0es5HuQ8poTh7xYagyO8N8Y";

/**
 * Ask user for browser notification permission.
 */
async function requestPermission(): Promise<NotificationPermission> {
  console.log("🔄 Requesting notification permission...");
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("✅ Notification permission granted.");
  } else if (permission === "denied") {
    console.warn("❌ Notification permission denied by user.");
  } else {
    console.log("⚠️ Notification permission dismissed.");
  }

  return permission;
}

/**
 * Custom React hook for Firebase Cloud Messaging
 */
export function useFirebaseMessaging() {
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    if (!messaging) return;

    const initFCM = async () => {
      const permission = await requestPermission();
      if (permission !== "granted") return;

      try {
        const currentToken = await getToken(messaging, {
          vapidKey: VAPID_KEY,
        });

        if (currentToken) {
          console.log("✅ FCM Token:", currentToken);
          setToken(currentToken);

          // TODO: send token to your backend API if required
        } else {
          console.warn(
            "⚠️ No registration token available. Request permission to generate one."
          );
        }
      } catch (err) {
        console.error("❌ Error retrieving FCM token:", err);
      }
    };

    initFCM();

    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 Foreground message received:", payload);
      setNotification(payload.notification);

      // 🔔 Show browser popup as well
      if (payload.notification?.title) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/WebsiteLogo/Frame.png",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return { token, notification };
}
