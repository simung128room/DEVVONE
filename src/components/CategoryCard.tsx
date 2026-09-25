import React from "react";
import { Package, ChevronRight, Sparkles } from "lucide-react";

interface CategoryCardProps {
  title: string;
  label: string;
  itemCountDesc?: string;
  priceRangeStr?: string;
  bgImage?: string;
  index?: number;
  onClick: () => void;
  accentColor?: string;
  glowColor?: string;
  gradientFrom?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  label,
  itemCountDesc,
  priceRangeStr,
  bgImage,
  onClick,
}) => {
  const count = itemCountDesc?.replace(/[^0-9]/g, "") || "0";

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-[26px] border border-[#2A2A2A] hover:border-[#383838] bg-[#141414] hover:bg-[#171717] transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1 p-2.5"
    >
      {/* Banner Showcase with Rounded Inner Corner */}
      <div className="relative aspect-[21/9] sm:aspect-[21/8] w-full overflow-hidden shrink-0 rounded-[20px] bg-[#171717]">
        {bgImage ? (
          <img
            src={bgImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-950/30 to-black flex items-center justify-center">
            <Package className="w-8 h-8 text-white/20" />
          </div>
        )}

        {/* Feathered dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent" />

        {/* Pill badge for label */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-200 bg-[#171717]/90 backdrop-blur-md border border-[#2A2A2A]">
            <Sparkles className="w-2.5 h-2.5 text-blue-400" />
            <span>{label || "Category"}</span>
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 pt-3 flex flex-col justify-between flex-1 relative z-10">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <h3 className="text-base font-bold text-white tracking-tight truncate group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <div className="w-8 h-8 rounded-full bg-[#171717] group-hover:bg-white text-zinc-400 group-hover:text-black flex items-center justify-center transition-all duration-200 shrink-0 border border-[#2A2A2A]">
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Stats Pill Bar */}
        <div className="flex items-center justify-between gap-2 text-xs pt-2.5 border-t border-[#2A2A2A]">
          {/* Item Count Pill */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#171717] text-zinc-300 text-[11px] font-medium border border-[#2A2A2A]">
            <Package className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              พร้อมส่ง <span className="text-emerald-400 font-mono font-bold">{count}</span> รายการ
            </span>
          </span>

          {/* Price Range */}
          {priceRangeStr && (
            <span className="text-xs font-mono font-bold text-amber-400/90 truncate">
              {priceRangeStr}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
