"use client";

import { useState, useEffect } from "react";
import { Search, Sun, Moon, MessageCircleMore, ArrowRight } from "lucide-react";
import CardComponent from "../../components/home-page-component/page";
import { useLanguage } from "@/hooks/useLanguage";

export default function Home() {
  const { t, currentLanguage, switchLanguage } = useLanguage(); // hook for translations
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, input]);
    setInput("");
  };

  // Load messages from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("messages");
    setMessages(stored ? JSON.parse(stored) : []);
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  return (
    <main
      className={`min-h-screen flex flex-col items-center pb-24 ${
        darkMode ? "bg-[#090C11]" : "bg-[#FFFFFF]"
      }`}
    >
      {/* Header */}
      <header
        className={`w-full border-b ${
          darkMode ? "bg-[#262B32] border-gray-600" : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[var(--color-brand-yellow)] rounded flex items-center justify-center">
                        <img
                          src="/WebsiteLogo/Frame.png"
                          alt="ShopAlly Logo"
                          
                          className="object-contain w-4 h-4 lg:w-5 lg:h-5"
                        />
                      </div>
            <span className={`font-bold text-lg ${darkMode ? "text-white" : "text-black"}`}>
              ShopAlly
            </span>
          </div>

          {/* Language & Theme Controls */}
          <div className="flex items-center gap-4">
            {/* Language Dropdown */}
            <select
              value={currentLanguage === "English" ? "EN" : "AM"}
              onChange={switchLanguage}
              className={`border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm ${
                darkMode ? "bg-[#757B81] text-white" : "bg-[#F3F4F6] text-black"
              } focus:outline-none`}
            >
              <option value="EN">EN</option>
              <option value="AM">AM</option>
            </select>

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md border border-gray-300 ${
                darkMode ? "bg-[#757B81]" : "bg-[#F3F4F6]"
              } hover:bg-gray-700`}
            >
              {darkMode ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-black dark:text-black" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className={`max-w-3xl text-center mt-12 mb-4 px-4 ${
          darkMode ? "bg-[#090C11]" : "bg-[#FFFFFF]"
        }`}
      >
        <h1
          className={`text-2xl sm:text-3xl lg:text-4xl mb-4 font-bold ${
            messages.length === 0 ? "block" : "hidden"
          } ${darkMode ? "text-white" : "text-black"}`}
        >
          {t("Your Smart AI Assistant for Alibaba Shopping")}
        </h1>
        <p
          className={`mb-12 ${messages.length === 0 ? "block" : "hidden"} ${
            darkMode ? "text-[#FFF]" : "text-gray-400"
          }`}
        >
          {t(
            "Discover the perfect products on Alibaba with AI-powered recommendations tailored to your needs."
          )}
        </p>

        {/* Search Box */}
        <div
          className={`flex items-center border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm ${
            darkMode
              ? "bg-[#262B32] text-[#999999]"
              : "bg-white text-[#999999]"
          } ${messages.length === 0 ? "hidden sm:flex" : "hidden"}`}
        >
          <input
            type="text"
            placeholder={t("Ask me anything about products you need...")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`flex-1 px-4 py-3 text-sm sm:text-base focus:outline-none ${
              darkMode ? "bg-gray-800 text-white" : "text-black"
            }`}
          />
          <button
            onClick={handleSend}
            className="bg-yellow-400 rounded-xl p-3 mr-1 my-1 flex items-center justify-center"
          >
            <ArrowRight size={20} className="text-black" />
          </button>
        </div>
      </section>

      {/* Message List or Suggestions */}
      {messages.length === 0 ? (
        <section className="mt-10 px-4 max-w-3xl w-full">
          <h2
            className={`text-lg font-semibold mb-4 text-center ${
              darkMode ? "text-gray-600" : "text-gray-700"
            }`}
          >
            {t("Try asking:")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "What do I need to bake bread?",
              "Best kitchen appliances for small apartments",
              "Essential tools for home gardening",
              "What should I buy for a home office setup?",
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => setMessages([...messages, q])}
                className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm transition hover:bg-gray-50 ${
                  darkMode
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
        <div className="w-full max-w-3xl px-4 flex flex-col gap-2 mt-6">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex justify-end">
              <div className="max-w-1/2 break-words px-4 py-2 rounded-xl bg-yellow-400 text-black">
                {msg}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile Search */}
      <section
        className={`max-w-3xl w-full fixed bottom-1 text-center px-4 ${
          messages.length === 0 ? "block sm:hidden" : "block"
        } ${darkMode ? "bg-[#090C11]" : "bg-[#FFFFFF]"}`}
      >
        <div
          className={`flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm ${
            darkMode ? "bg-[#262B32] text-[#999999]" : "bg-white text-[#999999]"
          }`}
        >
          <input
            type="text"
            placeholder={t("Ask me anything about products you need...")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`flex-1 px-4 py-3 text-sm sm:text-base focus:outline-none ${
              darkMode ? "bg-gray-800 text-white" : "text-black"
            }`}
          />
          <button
            onClick={handleSend}
            className="bg-yellow-400 rounded-xl p-3 mr-1 my-1 flex items-center justify-center"
          >
            <ArrowRight size={20} className="text-black" />
          </button>
        </div>
      </section>
    </main>
  );
}
