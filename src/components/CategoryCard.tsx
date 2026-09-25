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
      className="group relative overflow-hidden rounded-xl border border-white/[0.08] hover:border-blue-500/40 bg-[#12131a] hover:bg-[#171922] transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-blue-500/5 select-none"
    >
      {/* Subtle top edge glow */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/70 transition-all duration-500 z-20 pointer-events-none" />

      {/* Banner Showcase */}
      <div className="relative aspect-[21/9] sm:aspect-[21/8] w-full overflow-hidden shrink-0 bg-[#181a24]">
        {bgImage ? (
          <img
            src={bgImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out opacity-85 group-hover:opacity-100"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-950/40 via-indigo-950/20 to-black flex items-center justify-center">
            <Package className="w-9 h-9 text-white/30" />
          </div>
        )}

        {/* Soft Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12131a] via-[#12131a]/40 to-transparent" />

        {/* Category Badge Label */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider text-zinc-200 bg-black/60 backdrop-blur-md border border-white/10 shadow-sm">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>{label || "Category"}</span>
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 relative z-10 gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate group-hover:text-blue-400 transition-colors duration-200">
            {title}
          </h3>
          <div className="w-7 h-7 rounded-lg bg-white/[0.05] group-hover:bg-blue-600 text-zinc-400 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0 border border-white/10 shadow-sm">
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between gap-2 text-xs pt-2.5 border-t border-white/[0.06]">
          {/* Item Count */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300 text-[11px] font-medium border border-white/[0.06]">
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
