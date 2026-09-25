import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductCard } from './ProductCard';

interface SearchViewProps {
  products: any[];
  onBack: () => void;
  onProductClick: (id: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ products, onBack, onProductClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
    (p.details && p.details.toLowerCase().includes(debouncedQuery.toLowerCase()))
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 font-sans text-white min-h-[85vh]"
    >
      {/* Search Header Bar */}
      <div className="flex items-center gap-3 sm:gap-4 mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-[#141414] hover:bg-[#171717] border border-[#2A2A2A] rounded-md flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-blue-400" />
        </button>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-blue-400" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="พิมพ์ชื่อสินค้า หรือคีย์เวิร์ดที่ต้องการค้นหา..."
            className="w-full bg-[#141414] border border-[#2A2A2A] py-2.5 pl-10 pr-4 outline-none focus:border-blue-500 rounded-md transition-all text-white placeholder:text-zinc-600 text-sm font-medium"
            autoFocus
          />
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>ผลการค้นหา {searchQuery && <span className="text-white/40 font-normal">สำหรับ "{searchQuery}"</span>}</span>
        </h2>
        <span className="text-xs text-white/40 font-mono">
          พบ {filteredProducts.length} รายการ
        </span>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        {searchQuery && filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#141414] border border-[#2A2A2A] rounded-lg p-8">
            <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-black text-white mb-1">ไม่พบสินค้าที่คุณค้นหา</h3>
            <p className="text-xs sm:text-sm text-white/40">ลองเปลี่ยนคำค้นหา หรือค้นหาด้วยชื่อหมวดหมู่อื่นๆ</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onProductClick}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
