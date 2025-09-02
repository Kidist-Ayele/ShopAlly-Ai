"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

type Language = "English" | "Amharic";

interface LanguageContextType {
  currentLanguage: Language;
  switchLanguage: () => void;
  t: (key: string) => string;
  translateText: (text: string) => Promise<string>;
}

// Export this so the hook can use it
export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("English");
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const translationCache = new Map<string, string>();

  const translateText = useCallback(
    async (text: string) => {
      if (currentLanguage === "English") return text;

      const cacheKey = `${text}_${currentLanguage}`;
      if (translationCache.has(cacheKey)) return translationCache.get(cacheKey)!;

      try {
        const targetLang = currentLanguage === "Amharic" ? "am" : "en";
        const sourceLang = currentLanguage === "Amharic" ? "en" : "am";

        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
            text
          )}`
        );

        if (!response.ok) return text;

        const data = await response.json();
        const translatedText = data[0]?.[0]?.[0] || text;
        translationCache.set(cacheKey, translatedText);

        return translatedText;
      } catch {
        return text;
      }
    },
    [currentLanguage]
  );

  useEffect(() => {
    if (currentLanguage === "English") setTranslations({});
  }, [currentLanguage]);

  const switchLanguage = () => {
    setCurrentLanguage((prev) => (prev === "English" ? "Amharic" : "English"));
  };

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

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, switchLanguage, t, translateText }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
