"use client";

import { useFirebaseMessaging } from "@/hooks/useFirebaseMessaging";
import { useEffect, useState } from "react";

export default function Notifications() {
  const { token, notification } = useFirebaseMessaging();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <>
      {/* Debug token (optional) */}
      {token && (
        <div className="fixed bottom-2 right-2 text-xs text-gray-400">
          ✅ Token ready
        </div>
      )}

      {/* Notification popup */}
      {notification && visible && (
        <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 w-80 border border-gray-200 dark:border-gray-700 animate-slideIn">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {notification.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {notification.body}
          </p>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
