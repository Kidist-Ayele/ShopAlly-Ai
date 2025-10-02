"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";

type Testimonial = { name: string; role: string; feedback: string; image: string; };

const testimonials: Testimonial[] = [
  { name: 'Abebe T.', role: 'Addis Ababa', feedback: 'ShopAlly helped me compare prices quickly and saved me money on electronics!', image: '/testimonials/user1.png' },
  { name: 'Hana M.', role: 'Bahir Dar', feedback: 'I love that it supports Amharic. Makes online shopping much easier for my family.', image: '/testimonials/user2.png' },
  { name: 'Samuel K.', role: 'Hawassa', feedback: 'Currency conversion to ETB is a game changer. Finally, I know the real prices before buying.', image: '/testimonials/user3.png' },
  { name: 'Mulugeta Y.', role: 'Adama', feedback: 'I used to waste time checking prices everywhere — now ShopAlly gives me results instantly!', image: '/testimonials/user4.png' },
  { name: 'Sara M.', role: 'Mekelle', feedback: 'The price alerts helped me buy my laptop when it dropped 15%! Love it!', image: '/testimonials/user5.png' },
];

export default function Testimonials() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();

  return (
    <section className={`py-20 px-6 ${isDarkMode ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]" : "bg-[#F7F9FB] text-[#262B32]"}`}>
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-2xl font-bold">{t("What Our Users Say")}</h2>
      </div>
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[var(--color-card-bg)] p-6 rounded-lg shadow-md min-w-[280px] md:min-w-[340px]"
            >
              <div className="flex items-center gap-4 mb-4">
                <Image src={t.image} alt={t.name} width={56} height={56} className="rounded-full" />
                <div>
                  <h4 className="font-bold">{t.name}</h4>
                  <span className="text-xs">{t.role}</span>
                </div>
              </div>
              <p className="text-sm italic">{t.feedback}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
