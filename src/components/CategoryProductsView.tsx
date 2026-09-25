import React, { useState } from "react";
import { motion } from "motion/react";
import { Package, ArrowLeft, ShoppingCart, Sparkles } from "lucide-react";
import { Product, Category } from "../types";
import { generateGradient } from "../utils";

interface CategoryProductsViewProps {
  category: string;
  categories: Category[];
  products: Product[];
  onBack: () => void;
  onProductClick: (id: string) => void;
}

export const CategoryProductsView: React.FC<CategoryProductsViewProps> = ({
  category,
  categories = [],
  products = [],
  onBack,
  onProductClick,
}) => {
  const categoryInfo = categories.find(
    (c) => c.name === category || c.title === category || c.id === category,
  );
  const [renderLimit, setRenderLimit] = useState(20);

  const filteredProducts =
    category === "all"
      ? products
      : products.filter(
          (p) =>
            p.category === category ||
            p.category === categoryInfo?.title ||
            p.category === categoryInfo?.name ||
            p.category === categoryInfo?.id,
        );

  const visibleProducts = filteredProducts.slice(0, renderLimit);

  return (
    <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 font-sans text-white min-h-[85vh]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-lg shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-white/80" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              {category === "all" ? "สินค้าทั้งหมด" : categoryInfo?.title || category}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-zinc-400 mt-1">
              {categoryInfo?.subtitle || `พบสินค้าทั้งหมด ${filteredProducts.length} รายการ`}
            </p>
          </div>
        </div>
      </motion.div>

      {!filteredProducts || filteredProducts.length === 0 ? (
        <div className="bg-gradient-to-b from-[#12131d]/90 to-[#0a0a0f]/95 border border-white/[0.08] rounded-[32px] p-16 text-center shadow-xl">
          <div className="mb-4 flex justify-center">
            <Package className="w-14 h-14 text-white/20" />
          </div>
          <h3 className="text-lg font-black text-white">ยังไม่มีสินค้าในหมวดหมู่นี้</h3>
          <p className="text-white/40 text-xs sm:text-sm mt-1 font-medium">
            โปรดรอการอัปเดตสต๊อกสินค้าจากทางร้าน
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {visibleProducts.map((product) => {
              const discount =
                product.originalPrice && product.price < product.originalPrice
                  ? Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )
                  : null;
              const isHot =
                product.price > 100 || (discount !== null && discount >= 20) || product.stock > 0;

              return (
                <div
                  key={product.id}
                  className="group relative bg-[#0e1018]/95 hover:bg-[#121420] border border-white/[0.08] hover:border-blue-500/40 rounded-2xl overflow-hidden flex flex-col shadow-md shadow-black/40 transition-all duration-200 hover:-translate-y-1"
                >
                  {/* Image Frame */}
                  <div className="p-2.5 pb-0">
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#090a0f] border border-white/[0.06]">
                      {product.imageUrl && product.imageUrl.trim() !== "" ? (
                        <img
                          loading="lazy"
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                      <div
                        className="w-full h-full flex flex-col items-center justify-center opacity-85"
                        style={{
                          display:
                            product.imageUrl && product.imageUrl.trim() !== "" ? "none" : "flex",
                          background: generateGradient(product.name || product.id),
                        }}
                      >
                        <span className="text-3xl font-black text-white mix-blend-overlay opacity-70">
                          {(product.name || "P")[0].toUpperCase()}
                        </span>
                        <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest mt-1">
                          {product.category || "ITEM"}
                        </span>
                      </div>

                      {/* Hot pill badge */}
                      {isHot && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Hot</span>
                          </span>
                        </div>
                      )}

                      {/* Discount pill badge */}
                      {discount !== null && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-500/90 text-white text-[9px] font-bold tracking-wider shadow-sm">
                            -{discount}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-3.5 flex flex-col flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-1 mb-2 group-hover:text-blue-300 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {product.originalPrice && product.price < product.originalPrice ? (
                        <span className="text-[10px] sm:text-xs text-rose-400/80 line-through font-mono">
                          ฿{product.originalPrice.toLocaleString()}
                        </span>
                      ) : null}

                      <span className="text-sm sm:text-base font-black text-amber-400 tracking-tight font-mono">
                        ฿{(product.price || 0).toLocaleString()}
                      </span>

                      {product.stock > 0 ? (
                        <span className="ml-auto bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
                          พร้อมจำหน่าย
                        </span>
                      ) : (
                        <span className="ml-auto bg-rose-500/10 text-rose-400 border border-rose-500/25 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
                          สินค้าหมด
                        </span>
                      )}
                    </div>

                    {product.stock <= 0 ? (
                      <button className="w-full bg-rose-500/10 text-rose-400 border border-rose-500/20 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-default mt-auto">
                        <Package className="w-3.5 h-3.5" /> สินค้าหมด
                      </button>
                    ) : (
                      <button
                        onClick={() => onProductClick(product.id)}
                        className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-xs font-bold transition-all duration-150 mt-auto shadow-md hover:shadow-blue-500/25 active:scale-[0.98] cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        สั่งซื้อสินค้า
                      </button>
                    )}

                    <div className="mt-2 py-0.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] text-white/40 font-medium">
                      <Package className="w-3 h-3 text-white/30 shrink-0" />
                      <span className="truncate">
                        คงเหลือ{" "}
                        <span className="text-white/80 font-mono font-bold">
                          {product.stock >= 999999
                            ? "ไม่จำกัด"
                            : product.stock.toLocaleString()}
                        </span>{" "}
                        ชิ้น
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {visibleProducts.length < filteredProducts.length && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setRenderLimit((prev) => prev + 20)}
                className="px-8 py-3 bg-gradient-to-r from-white/[0.08] to-white/[0.04] hover:from-white/[0.12] hover:to-white/[0.08] border border-white/15 text-white font-bold rounded-full transition-all active:scale-95 cursor-pointer text-xs uppercase tracking-wider shadow-lg"
              >
                โหลดเพิ่มเติม ({filteredProducts.length - visibleProducts.length} รายการ)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryProductsView;
