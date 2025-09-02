"use client";

import { useState, useCallback } from "react";

type Language = "English" | "Amharic";

// Cache for translations to avoid repeated API calls
const translationCache = new Map<string, string>();

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("English");
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Translate a single text
  const translateText = useCallback(
    async (text: string): Promise<string> => {
      if (currentLanguage === "English") return text;

      const cacheKey = `${text}_${currentLanguage}`;
      if (translationCache.has(cacheKey)) return translationCache.get(cacheKey)!;

      try {
        if (text === "ShopAlly AI Personalization") {
          return currentLanguage === "Amharic" ? "ShopAlly AI የግል ማስተካከያ" : text;
        }

        if (text === "Personalization") {
          return currentLanguage === "Amharic" ? "የግል ማስተካከያ" : text;
        }

        const targetLang = currentLanguage === "Amharic" ? "am" : "en";
        const sourceLang = currentLanguage === "Amharic" ? "en" : "am";

        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
            text
          )}`
        );

        if (!response.ok) return text;

        const data = await response.json();
        const translated = data[0]?.[0]?.[0] || text;
        translationCache.set(cacheKey, translated);
        return translated;
      } catch {
        return text;
      }
    },
    [currentLanguage]
  );

  const switchLanguage = useCallback(() => {
    setCurrentLanguage((prev) => (prev === "English" ? "Amharic" : "English"));
  }, []);

  // Synchronous translation function for UI
  const t = useCallback(
    (key: string) => {
      if (currentLanguage === "English") return key;

      if (translations[key]) return translations[key];

      translateText(key).then((translated) =>
        setTranslations((prev) => ({ ...prev, [key]: translated }))
      );

      return key;
    },
    [currentLanguage, translations, translateText]
  );

  return { currentLanguage, switchLanguage, t, translateText };
}
