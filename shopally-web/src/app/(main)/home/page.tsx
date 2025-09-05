//src/app/(main)/home/page.tsx
"use client";

import CardComponent from "@/app/components/home-page-component/page";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useCompareProductsMutation,
  useSearchProductsMutation,
} from "@/lib/redux/api/userApiSlice";
import { Product } from "@/types/types";
import { ArrowRight, Loader2, MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();

  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);

  const [searchProducts, { isLoading }] = useSearchProductsMutation();
  const [compareProducts, { isLoading: isComparing }] =
    useCompareProductsMutation();

  const handleSend = async () => {
    if (input.trim() === "") return;

    setMessages((prev) => [...prev, input]);

    try {
      const res = await searchProducts({
        query: input,
        priceMaxETB: null,
        minRating: null,
      }).unwrap();

      setProducts(res?.data?.products || []);
    } catch (err) {
      console.error("❌ Search failed:", err);
      setProducts([]);
    }

    setInput("");
  };

  // Local message persistence
  useEffect(() => {
    const stored = localStorage.getItem("messages");
    setMessages(stored ? JSON.parse(stored) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  // Listen for compare list changes
  useEffect(() => {
    const updateCompare = () => {
      const list = localStorage.getItem("compareProduct");
      setCompareList(list ? JSON.parse(list) : []);
    };

    updateCompare();
    window.addEventListener("storage", updateCompare);

    return () => window.removeEventListener("storage", updateCompare);
  }, []);

  // Log whenever compareList changes
  useEffect(() => {
    console.log("Updated compare list:", compareList);
  }, [compareList]);

  const handleCompare = async () => {
    if (compareList.length < 2 || compareList.length > 4) {
      alert("Please select 2 to 4 products for comparison.");
      return;
    }

    try {
      console.log("Sending compare list:", compareList);

      const payload = {
        products: compareList.map((p) => ({
          id: p.id,
          title: p.title,
          imageUrl: p.imageUrl,
          aiMatchPercentage: p.aiMatchPercentage,
          price: p.price, // ✅ full price object
          productRating: p.productRating,
          sellerScore: p.sellerScore,
          deliveryEstimate: p.deliveryEstimate,
          summaryBullets: p.summaryBullets,
          deeplinkUrl: p.deeplinkUrl,
        })),
      };

      const res = await compareProducts(payload).unwrap();
      console.log("Comparison result:", res);
      alert(`Comparison result received! Check console for details.`);
      // ✅ Clear compare list storage after success
      localStorage.removeItem("compareProduct");
      setCompareList([]);

      // ✅ Redirect to compare page
      window.location.href = "/compare";
    } catch (err: any) {
      // ✅ Better error logging
      console.error("❌ Compare API failed:", err);

      if (err?.data) {
        console.error("Error data:", err.data);
        console.error("Error status:", err.status);
        alert(
          `Compare failed: ${
            err.data?.error?.message || "Unknown error"
          } (status ${err.status})`
        );
      } else {
        alert("Compare failed due to an unexpected error. Check console.");
      }
    }
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center pb-24 ${
        isDarkMode ? "bg-[#090C11]" : "bg-[#FFFFFF]"
      }`}
    >
      {/* Compare Products Button - moved above chat section */}
      {compareList.length >= 2 && (
        <div className="w-full max-w-3xl px-4 mt-6">
          <button
            onClick={handleCompare}
            className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold shadow-lg"
            disabled={isComparing}
          >
            {isComparing
              ? "Comparing..."
              : `Compare Products (${compareList.length})`}
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-3xl text-center mt-12 mb-4 px-4">
        <h1
          className={`text-2xl sm:text-3xl lg:text-4xl mb-4 font-bold leading-tight text-center ${
            messages.length === 0 ? "block" : "hidden"
          } ${isDarkMode ? "text-white" : "text-black"}`}
        >
          {t("Your Smart AI Assistant for Alibaba Shopping")}
        </h1>
        <p
          className={`mb-12 text-center leading-relaxed max-w-2xl mx-auto ${
            messages.length === 0 ? "block" : "hidden"
          } ${isDarkMode ? "text-[#FFF]" : "text-gray-400"}`}
        >
          {t(
            "Discover the perfect products on Alibaba with AI-powered recommendations tailored to your needs."
          )}
        </p>

        {/* Desktop Search Box */}
        <div
          className={`flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm max-w-2xl mx-auto w-full ${
            isDarkMode
              ? "bg-[#262B32] text-[#999999]"
              : "bg-white text-[#999999]"
          } ${messages.length === 0 ? "hidden sm:flex" : "hidden"}`}
        >
          <input
            type="text"
            placeholder={t("Ask me anything about products you need...")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className={`flex-1 px-4 py-3 text-sm sm:text-base focus:outline-none min-w-0 placeholder:text-sm ${
              isDarkMode ? "bg-gray-800 text-white" : "text-black"
            }`}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="rounded-xl p-3 mr-1 my-1 flex items-center justify-center transition-colors bg-yellow-400 text-black"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <ArrowRight size={20} />
            )}
          </button>
        </div>
      </section>

      {/* Suggestions or Results */}
      {messages.length === 0 ? (
        <section className="mt-10 px-4 max-w-3xl w-full">
          <h2
            className={`text-lg font-semibold mb-4 text-center ${
              isDarkMode ? "text-gray-600" : "text-gray-700"
            }`}
          >
            {t("Try asking:")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              t("What do I need to bake bread?"),
              t("Best kitchen appliances for small apartments"),
              t("Essential tools for home gardening"),
              t("What should I buy for a home office setup?"),
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(q);
                  handleSend();
                }}
                className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm transition hover:bg-gray-50 ${
                  isDarkMode
                    ? "border-gray-700 hover:bg-gray-700 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <MessageCircleMore className="w-4 h-4 rounded-full text-white bg-black" />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <div className="w-full max-w-3xl px-4 flex flex-col gap-4 mt-6">
          {/* Messages */}
          {messages.map((msg, idx) => (
            <div key={idx} className="flex justify-end">
              <div className="max-w-1/2 break-words px-4 py-2 rounded-xl bg-yellow-400 text-black">
                {msg}
              </div>
            </div>
          ))}

          {/* Product Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {products.map((p, i) => (
              <CardComponent
                key={i}
                mode={isDarkMode ? "dark" : "light"}
                product={p}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Search Box */}
      <section
        className={`fixed bottom-2 sm:bottom-4 left-0 right-0 px-3 sm:px-4 ${
          messages.length === 0 ? "block sm:hidden" : "block"
        } ${isDarkMode ? "bg-[#090C11]" : "bg-[#FFFFFF]"}`}
        style={{ marginLeft: "4rem", marginRight: "1rem" }}
      >
        <div
          className={`flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm w-full ${
            isDarkMode
              ? "bg-[#262B32] text-[#999999]"
              : "bg-white text-[#999999]"
          }`}
        >
          <input
            type="text"
            placeholder={t("Ask me anything about products you need...")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none min-w-0 ${
              isDarkMode ? "bg-gray-800 text-white" : "text-black"
            }`}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-yellow-400 rounded-xl p-2.5 sm:p-3 mr-1 my-1 flex items-center justify-center flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin text-black" />
            ) : (
              <ArrowRight size={18} className="sm:w-5 sm:h-5 text-black" />
            )}
          </button>
        </div>
      </section>
    </main>
  );
}
