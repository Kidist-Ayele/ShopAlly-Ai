// src/app/components/home-page-component/page.tsx
import { Product } from "@/types/types";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CardComponentProps {
  mode: "dark" | "light";
  product: Product;
}

const CardComponent: React.FC<CardComponentProps> = ({ mode, product }) => {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [added, setAdded] = useState(false);

  function addToCompare() {
    setCompareList((prev) => {
      const updated = [...prev, product];
      localStorage.setItem("compareProduct", JSON.stringify(updated));

      // 🔔 Notify other components
      window.dispatchEvent(new Event("storage"));

      return updated;
    });
    setAdded(true);
  }

  function removeFromCompare() {
    setCompareList((prev) => {
      const updated = prev.filter((p) => p.id !== product.id);
      localStorage.setItem("compareProduct", JSON.stringify(updated));

      // 🔔 Notify other components
      window.dispatchEvent(new Event("storage"));

      return updated;
    });
    setAdded(false);
  }

  useEffect(() => {
    const list = localStorage.getItem("compareProduct");
    if (list) {
      const stored: Product[] = JSON.parse(list);
      const exists = stored.some((p) => p.id === product.id);
      setAdded(exists);
      setCompareList(stored);
    }
  }, [product.id]);

  return (
    <div
      className={`w-full h-fit break-words border-[2px] rounded-[12px] ${
        mode === "dark"
          ? "border-[#262B32] bg-[#262B32]"
          : "border-[#E5E7EB] bg-[#FFFFFF]"
      }`}
    >
      <div className="h-fit grid place-items-center rounded-tl-[11px] rounded-tr-[11px] bg-amber-300 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="h-[60%] p-4">
        <h6
          className={`text-[14px] ${
            mode === "light" ? "text-[#262B32]" : "text-[#FFFFFF]"
          } font-semibold`}
        >
          {product.title}
        </h6>
        <div className="justify-between flex items-center mt-3 mb-4">
          <h6 className="text-[#FFD300] text-[18px]">${product.price.usd}</h6>
          <div className="flex items-center gap-1">
            <span
              className={`${
                mode === "dark" ? "text-white" : "text-[#262B32]"
              } text-[12px]`}
            >
              {product.productRating}
            </span>
            <Star className="w-3 h-3 text-yellow-400" />
          </div>
        </div>
        <button
          onClick={added ? removeFromCompare : addToCompare}
          className={`${
            mode === "dark" ? "bg-[#757B81]" : "bg-[#F3F4F6]"
          } w-full rounded-[5px] mb-2 h-[32px]`}
        >
          {!added ? "Add To Compare" : "Remove From Compare"}
        </button>
        <button className="border-[2px] w-full rounded-[5px] h-[36px] text-[#FFD300] border-[#FFD300]">
          <a href={product.deeplinkUrl} target="_blank" rel="noreferrer">
            Buy On Alibaba
          </a>
        </button>
      </div>
    </div>
  );
};

export default CardComponent;
