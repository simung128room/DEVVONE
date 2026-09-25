import React from "react";
import { Package, ShoppingCart, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { Product } from "../types";
import { generateGradient } from "../utils";

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  className = "",
}) => {
  const discount =
    product.originalPrice && product.price < product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const isHot =
    product.price > 100 || (discount !== null && discount >= 20) || product.stock > 10;

  const isAvailable = product.stock > 0;

  return (
    <div
      onClick={() => onClick(product.id)}
      className={`group relative bg-[#131316] hover:bg-[#18181d] border border-white/[0.08] hover:border-blue-500/40 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer select-none ${className}`}
    >
      {/* Subtle Top Edge Highlight Glow on Hover */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/70 transition-all duration-500 z-20 pointer-events-none" />

      {/* Image Showcase Frame */}
      <div className="p-2.5 sm:p-3 pb-0 relative">
        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#1a1a20] border border-white/[0.06] flex items-center justify-center">
          {product.imageUrl && product.imageUrl.trim() !== "" ? (
            <img
              loading="lazy"
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              referrerPolicy="no-referrer"
            />
          ) : null}

          {/* Fallback Graphic */}
          <div
            className="w-full h-full flex flex-col items-center justify-center p-4 transition-transform duration-500 group-hover:scale-105"
            style={{
              display: product.imageUrl && product.imageUrl.trim() !== "" ? "none" : "flex",
              background: generateGradient(product.name || product.id),
            }}
          >
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-inner">
              <span className="text-xl font-black text-white mix-blend-overlay">
                {(product.name || "P")[0].toUpperCase()}
              </span>
            </div>
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider mt-2 px-2 py-0.5 rounded bg-black/20 backdrop-blur-sm">
              {product.category || "ITEM"}
            </span>
          </div>

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10 gap-1.5">
            {/* Discount Badge */}
            {discount !== null ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gradient-to-r from-rose-600 to-rose-500 text-white text-[10px] font-extrabold tracking-wide shadow-md shadow-rose-950/60 border border-rose-400/30">
                -{discount}%
              </span>
            ) : (
              <span />
            )}

            {/* Hot / Popular Badge */}
            {isHot && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[10px] font-bold tracking-wider uppercase shadow-md shadow-amber-950/50 backdrop-blur-md border border-amber-300/30">
                <Sparkles className="w-2.5 h-2.5" />
                <span>HOT</span>
              </span>
            )}
          </div>

          {/* Category Tag bottom corner of image */}
          {product.category && (
            <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
              <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-semibold text-zinc-300 uppercase tracking-wider">
                {product.category}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Pricing & Availability Bar */}
          <div className="mt-2.5 flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-white tracking-tight font-mono">
                ฿{(product.price || 0).toLocaleString()}
              </span>
              {product.originalPrice && product.price < product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-zinc-500 line-through font-mono">
                  ฿{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock State Pill */}
            {isAvailable ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>พร้อมส่ง</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded">
                <XCircle className="w-2.5 h-2.5" />
                <span>หมด</span>
              </span>
            )}
          </div>
        </div>

        {/* Stock Count Indicator */}
        <div className="py-1 px-2 rounded-md bg-[#18181f] border border-white/[0.05] flex items-center justify-between text-[10px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Package className="w-3 h-3 text-zinc-400 shrink-0" />
            <span>คงเหลือ</span>
          </div>
          <span className="font-mono font-bold text-zinc-200">
            {product.stock >= 999999 ? "ไม่จำกัด" : `${product.stock.toLocaleString()} ชิ้น`}
          </span>
        </div>

        {/* CTA Button */}
        {isAvailable ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick(product.id);
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2 sm:py-2.5 px-3 rounded-lg text-xs transition-all duration-200 shadow-md shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-[0.98] cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>สั่งซื้อสินค้า</span>
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-2 bg-zinc-800/80 text-zinc-400 border border-white/[0.05] py-2 sm:py-2.5 px-3 rounded-lg text-xs font-semibold cursor-not-allowed"
          >
            <Package className="w-3.5 h-3.5" />
            <span>สินค้าหมดชั่วคราว</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
