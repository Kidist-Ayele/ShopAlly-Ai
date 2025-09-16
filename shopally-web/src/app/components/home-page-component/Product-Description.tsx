"use client";

import { useEffect } from "react";
import { X, Star, Heart } from "lucide-react";
import { Product } from "@/types/types"; // ✅ make sure path is correct
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useSavedItems } from "@/hooks/useSavedItems";

type SidebarProductDescriptionProps = {
  product: Product | null;
  onClose: () => void;
};

export default function SidebarProductDescription({
  product,
  onClose,
}: SidebarProductDescriptionProps) {
  const { isDarkMode } = useDarkMode();
  const {currentLanguage, t} = useLanguage();
  const { saveItem } = useSavedItems();

  //handle saveitem
  const handleSaveItem = () => {
    saveItem(product);
    alert("Item saved!");
  };

  // Prevent background scrolling when sidebar is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [product]);

  if (!product) return null;
  console.log(currentLanguage)
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 shadow-2xl z-50 
          transition-transform duration-300 ease-in-out transform translate-x-0
          ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}
          rounded-l-2xl flex flex-col`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between gap-3 p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2 className="font-semibold text-lg line-clamp-2">{product.title}</h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 space-y-6 overflow-y-auto">
          {/* Product Image */}
          <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center shadow-md">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="object-contain max-h-full max-w-full hover:scale-105 transition"
            />
          </div>

          {/* Price + Rating */}
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold text-yellow-400">
              {currentLanguage === "English" ? `$${product.price.usd.toFixed(1)}` : `${product.price.etb.toFixed(1)} ETB`}
            </p>
            {product.productRating !== undefined ? (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star className="w-4 h-4 text-yellow-400" />
                {product.productRating.toFixed(1)}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No rating</p>
            )}
          </div>

          {/* AI Match */}
          <p className="text-sm text-green-500 font-medium">
            AI Match: {product.aiMatchPercentage}%
          </p>

          {/* Delivery Estimate */}
          <p className="text-sm text-blue-500">
            {t("Estimated Delivery")}: {product.deliveryEstimate || t("UnEstimated")}
          </p>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-md font-semibold mb-1">{t("Description")}</h3>
              <p className="text-sm leading-relaxed text-gray-300 dark:text-gray-300">
                {t(product.description)}
              </p>
            </div>
          )}

          {/* Summary Bullets */}
          {product.summaryBullets && product.summaryBullets.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">{t("Key Features")}</h3>
              <ul className="space-y-2 text-sm leading-relaxed">
                {product.summaryBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-400">✔</span>
                    <span>{t(b)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div
          className={`p-4 border-t ${
            isDarkMode
              ? "border-gray-700 bg-gray-900"
              : "border-gray-100 bg-white"
          }`}
        >
          <div className="flex gap-3">
            <a
              href={product.deeplinkUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-yellow-400 text-black text-center py-2 rounded-md font-semibold shadow hover:opacity-90 transition"
            >
              {t("Buy Now")}
            </a>
            <button
              onClick={handleSaveItem}
              className="p-3 border-2 border-yellow-400 text-yellow-400 rounded-md hover:bg-yellow-50 dark:hover:bg-gray-800 transition"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
