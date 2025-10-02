"use client";

import { Product } from "@/types/types";
import { Star, X, ExternalLink, Truck, Clock } from "lucide-react";
import React, { useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useSavedItems } from "@/hooks/useSavedItems";
import { SavedItem } from "@/types/types";
import { formatPriceForEthiopia } from "@/utils/priceUtils";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";

interface ProductDetailPopupProps {git add
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailPopup: React.FC<ProductDetailPopupProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { savedItems, saveItem, removeItem, placeOrder } = useSavedItems();
  const { isDarkMode } = useDarkMode();

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      // Prevent body scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // Restore body scroll
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Check if this product is already saved
  const isSaved = savedItems.some((item) => item.id === product.id);

  const handleHeartClick = () => {
    if (isSaved) {
      removeItem(product.id);
    } else {
      const savedItem: SavedItem = {
        id: product.id,
        title: product.title,
        imageUrl: product.imageUrl,
        aiMatchPercentage: product.aiMatchPercentage,
        price: product.price,
        productRating: product.productRating || 0,
        sellerScore: product.sellerScore,
        deliveryEstimate: product.deliveryEstimate,
        summaryBullets: product.summaryBullets,
        deeplinkUrl: product.deeplinkUrl,
      };
      saveItem(savedItem);
    }
  };

  const handleBuyClick = () => {
    placeOrder(product.id, product.title, product.price);
    window.open(product.deeplinkUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        // Close popup when clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popup
      >
        {/* Fixed Header */}
        <div
          className={`flex justify-between items-center p-6 border-b flex-shrink-0 ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Product Details
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode
                ? "hover:bg-gray-700 text-white"
                : "hover:bg-gray-100 text-gray-900"
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Image */}
              <div className="space-y-4">
                <div
                  className={`aspect-square rounded-xl overflow-hidden ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://images.weserv.nl/?url=${encodeURIComponent(
                        product.imageUrl
                      )}`;
                    }}
                  />
                </div>

                {/* AI Match Percentage */}
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: "var(--color-bg-tertiary)",
                    color: "var(--color-text-primary)",
                    border: "1px solid var(--color-border-primary)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">AI Match</span>
                    <span className="text-2xl font-bold">
                      {product.aiMatchPercentage}%
                    </span>
                  </div>
                  <div
                    className="w-full rounded-full h-2 mt-2"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: "var(--color-accent-primary)",
                        width: `${product.aiMatchPercentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1
                    className={`text-2xl font-bold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {product.title}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span
                        className={`ml-1 font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {product.productRating || 0}
                      </span>
                    </div>
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                    >
                      •
                    </span>
                    <span
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Seller Score: {product.sellerScore}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: "var(--color-bg-tertiary)",
                    borderColor: "var(--color-border-primary)",
                    border: "1px solid",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        Price
                      </p>
                      <p
                        className="text-3xl font-bold"
                        style={{ color: "var(--color-accent-primary)" }}
                      >
                        {formatPriceForEthiopia(product.price)}
                      </p>
                    </div>
                    <button
                      onClick={handleHeartClick}
                      className="p-3 rounded-xl hover:opacity-80 transition-colors"
                      style={{
                        backgroundColor: "var(--color-bg-tertiary)",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      <FaHeart
                        className="w-6 h-6 transition-colors"
                        style={{
                          color: isSaved
                            ? "var(--color-accent-primary)"
                            : "var(--color-text-primary)",
                        }}
                      />
                    </button>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <Truck className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">
                      Delivery Estimate
                    </p>
                    <p className="text-green-600">{product.deliveryEstimate}</p>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-3 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Description
                    </h3>
                    <p
                      className={`leading-relaxed ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Summary Bullets */}
                {product.summaryBullets &&
                  product.summaryBullets.length > 0 && (
                    <div>
                      <h3
                        className={`text-lg font-semibold mb-3 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Key Features
                      </h3>
                      <ul className="space-y-2">
                        {product.summaryBullets.map((bullet, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span
                              className={
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }
                            >
                              {bullet}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleBuyClick}
                    className="flex-1 font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: "var(--color-accent-primary)",
                      color: "var(--color-text-button)",
                    }}
                  >
                    <ExternalLink className="w-5 h-5" />
                    Buy from AliExpress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPopup;
