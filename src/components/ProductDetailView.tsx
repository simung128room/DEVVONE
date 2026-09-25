import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { ArrowLeft, Box, CheckCircle2, ChevronRight, FileText, ShoppingCart, AlertCircle, Download, Share2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import Swal from 'sweetalert2';
import { useToastStore } from '../lib/toastStore';

interface ProductDetailViewProps {
  product: Product;
  user: any;
  onBack: () => void;
  handlePurchase: (product: Product, quantity: number) => Promise<void>;
  setActiveView: (view: any) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, user, onBack, handlePurchase, setActiveView }) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [showConfirmPurchase, setShowConfirmPurchase] = useState(false);
  const { addToast } = useToastStore();

  const calculateDiscount = (originalPrice?: number, price?: number) => {
    if (!originalPrice || !price || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const discount = calculateDiscount(product.originalPrice, product.price);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-sans text-white">
      {/* Breadcrumb Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6 text-xs sm:text-sm"
      >
        <button 
          onClick={onBack} 
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-md bg-[#141414] border border-[#2A2A2A] hover:border-[#383838] active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>กลับสู่หน้าหลัก</span>
        </button>
        <ChevronRight className="w-4 h-4 text-zinc-600" />
        <span className="text-zinc-200 font-bold truncate max-w-[200px] sm:max-w-md">{product.name}</span>
      </motion.div>

      {/* Main Product Card */}
      <div 
        className="relative overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#141414] flex flex-col md:flex-row"
      >
        {/* Left Side: Product Image Display */}
        <div className="w-full md:w-5/12 lg:w-1/2 p-4 sm:p-6 flex flex-col items-center justify-center bg-[#171717] border-b md:border-b-0 md:border-r border-[#2A2A2A] relative overflow-hidden">
          <div
            className="w-full aspect-square relative overflow-hidden rounded-md border border-[#2A2A2A] bg-[#141414] group"
          >
            <img 
              loading="lazy" 
              src={product.imageUrl || undefined} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-300 group-hover:scale-105 opacity-95 group-hover:opacity-100"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80";
              }}
              referrerPolicy="no-referrer"
            />
            {discount !== null && (
              <div className="absolute top-2 left-2 z-20 bg-rose-600 text-white font-bold px-2 py-0.5 rounded-sm text-xs shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>-{discount}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Engine */}
        <div className="w-full md:w-7/12 lg:w-1/2 p-5 sm:p-6 lg:p-8 flex flex-col justify-between relative z-10">
          <div>
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-[#171717] text-blue-400 font-bold text-xs border border-[#2A2A2A] rounded-sm flex items-center gap-1.5 uppercase tracking-wider">
                <Box className="w-3.5 h-3.5" /> Product
              </span>
              {product.stock > 0 ? (
                <span className="px-2 py-0.5 bg-[#171717] text-emerald-400 font-bold text-xs border border-[#2A2A2A] rounded-sm flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> IN STOCK
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-[#171717] text-rose-400 font-bold text-xs border border-[#2A2A2A] rounded-sm flex items-center gap-1.5 uppercase tracking-wider">
                  <Box className="w-3.5 h-3.5" /> OUT OF STOCK
                </span>
              )}
            </div>
            
            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-3 tracking-tight">
              {product.name}
            </h1>
            
            {/* Price Row */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                ฿{(product.price || 0).toLocaleString()}
              </span>
              {product.originalPrice && product.price && product.originalPrice > product.price && (
                <span className="text-sm sm:text-base font-bold text-zinc-500 line-through font-mono">
                  ฿{(product.originalPrice || 0).toLocaleString()}
                </span>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="bg-[#171717] border border-[#2A2A2A] p-3 rounded-md">
                <div className="text-zinc-400 text-xs font-medium mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                  <Box className="w-3.5 h-3.5 text-blue-400"/> สถานะสต๊อก
                </div>
                <div className={`text-base sm:text-lg font-bold font-mono ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {product.stock >= 999999 ? '∞ ไม่จำกัด' : `${product.stock.toLocaleString()} ชิ้น`}
                </div>
              </div>
              <div className="bg-[#171717] border border-[#2A2A2A] p-3 rounded-md">
                <div className="text-zinc-400 text-xs font-medium mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShoppingCart className="w-3.5 h-3.5 text-blue-400"/> สั่งซื้อไปแล้ว
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-white">
                  {(product.soldCount || 0).toLocaleString()} ครั้ง
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-400" />
                  รายละเอียดสินค้า
                </h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/?product=${product.id}`;
                      navigator.clipboard.writeText(shareUrl).then(() => {
                        addToast({ title: "คัดลอกลิงก์แล้ว", message: "แชร์ลิงก์ให้เพื่อนได้เลย!", type: "success" });
                      });
                    }}
                    className="text-[11px] font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1 bg-[#171717] hover:bg-[#202020] border border-[#2A2A2A] px-2 py-0.5 rounded-sm active:scale-95 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-400" /> แชร์
                  </button>
                  <button 
                    onClick={() => {
                      const content = `[PRODUCT INFORMATION]\nProduct Name: ${product.name}\nPrice: ฿${product.price}\nStock: ${product.stock >= 999999 ? 'Unlimited' : product.stock}\n\n[DESCRIPTION]\n${product.description || 'No description available.'}`;
                      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${product.name.replace(/[^\wก-๙]/g, '_')}_details.txt`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="text-[11px] font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1 bg-[#171717] hover:bg-[#202020] border border-[#2A2A2A] px-2 py-0.5 rounded-sm active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" /> .TXT
                  </button>
                </div>
              </div>
              <div className="text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-[#171717] p-3 sm:p-3.5 border border-[#2A2A2A] rounded-md min-h-[90px] max-h-[180px] overflow-y-auto font-sans">
                {product.description || "ไม่มีรายละเอียดสินค้าระบุไว้"}
              </div>
            </div>
          </div>

          {/* Action & Checkout Controls */}
          <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
            {!showConfirmPurchase ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <label className="font-bold text-xs uppercase tracking-wider text-zinc-400">เลือกจำนวนชิ้น</label>
                  <div className="flex items-center gap-2 p-1 rounded-md bg-[#171717] border border-[#2A2A2A]">
                    <button
                      onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                      className="w-7 h-7 rounded-sm bg-[#141414] hover:bg-[#202020] border border-[#2A2A2A] flex items-center justify-center font-black text-base text-white transition-all active:scale-90 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={purchaseQuantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock >= 999999 ? 999 : product.stock}
                      value={purchaseQuantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setPurchaseQuantity(Math.min(product.stock >= 999999 ? 999 : product.stock, Math.max(1, val)));
                      }}
                      className="w-14 h-7 bg-transparent text-center font-mono font-bold text-base outline-none appearance-none m-0 text-white"
                      disabled={product.stock === 0}
                    />
                    <button
                      onClick={() => setPurchaseQuantity(Math.min(product.stock >= 999999 ? 999 : product.stock, purchaseQuantity + 1))}
                      className="w-7 h-7 rounded-sm bg-[#141414] hover:bg-[#202020] border border-[#2A2A2A] flex items-center justify-center font-black text-base text-white transition-all active:scale-90 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={product.stock === 0 || purchaseQuantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!user) {
                      Swal.fire({ 
                        title: 'กรุณาเข้าสู่ระบบ', 
                        text: 'คุณต้องเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า', 
                        icon: 'warning', 
                        confirmButtonText: 'เข้าสู่ระบบ',
                        showCancelButton: true,
                        cancelButtonText: 'ปิด',
                        background: '#141414',
                        color: '#fff',
                        confirmButtonColor: '#2563eb'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          setActiveView('login');
                        }
                      });
                      return;
                    }
                    if (product.stock <= 0) return;
                    setShowConfirmPurchase(true);
                  }}
                  disabled={product.stock <= 0}
                  className={`w-full py-3 rounded-md text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    product.stock > 0 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.99]' 
                      : 'bg-[#171717] text-zinc-500 border border-[#2A2A2A] cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{product.stock > 0 ? `สั่งซื้อเลย (฿${((product.price || 0) * purchaseQuantity).toLocaleString()})` : 'สินค้าหมดชั่วคราว'}</span>
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#171717] border border-[#2A2A2A] p-4 rounded-md"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-sm bg-blue-600/20 text-blue-400 shrink-0 border border-blue-500/30">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white mb-0.5">ยืนยันการสั่งซื้อ</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      คุณกำลังสั่งซื้อ <span className="text-white font-bold">{product.name}</span> จำนวน <span className="text-blue-400 font-bold">{purchaseQuantity}</span> ชิ้น ในราคารวม <span className="text-white font-mono font-bold">฿{((product.price || 0) * purchaseQuantity).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 w-full">
                  <button 
                    onClick={() => setShowConfirmPurchase(false)}
                    className="flex-1 py-2.5 bg-[#141414] border border-[#2A2A2A] hover:bg-[#202020] text-zinc-300 font-bold transition-all text-xs rounded-md active:scale-95 cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button 
                    disabled={showConfirmPurchase === ('loading' as any)}
                    onClick={async () => {
                      setShowConfirmPurchase('loading' as any);
                      try {
                        await handlePurchase(product, purchaseQuantity);
                      } finally {
                        setShowConfirmPurchase(false);
                      }
                    }}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all text-xs rounded-md disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    {showConfirmPurchase === ('loading' as any) ? (
                      <><div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> กำลังทำรายการ...</>
                    ) : 'ยืนยันการชำระเงิน'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
