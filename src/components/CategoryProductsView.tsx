import React, { useState } from "react";
import { motion } from "motion/react";
import { Package, ArrowLeft } from "lucide-react";
import { Product, Category } from "../types";
import { ProductCard } from "./ProductCard";

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
            className="w-10 h-10 rounded-lg bg-[#141414] hover:bg-[#171717] border border-[#2A2A2A] flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shrink-0"
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
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-12 text-center">
          <div className="mb-4 flex justify-center">
            <Package className="w-12 h-12 text-zinc-600" />
          </div>
          <h3 className="text-base font-bold text-white">ยังไม่มีสินค้าในหมวดหมู่นี้</h3>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-medium">
            โปรดรอการอัปเดตสต๊อกสินค้าจากทางร้าน
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onProductClick}
              />
            ))}
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
