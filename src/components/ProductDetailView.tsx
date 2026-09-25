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
          className="text-white/50 hover:text-blue-400 transition-colors flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-white/20 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>กลับสู่หน้าหลัก</span>
        </button>
        <ChevronRight className="w-4 h-4 text-white/30" />
        <span className="text-white/90 font-bold truncate max-w-[200px] sm:max-w-md">{product.name}</span>
      </motion.div>

      {/* Main Product Card */}
      <div 
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0e1018]/95 shadow-xl flex flex-col md:flex-row"
      >
        {/* Left Side: Product Image Display */}
        <div className="w-full md:w-5/12 lg:w-1/2 p-6 sm:p-8 flex flex-col items-center justify-center bg-[#090a0f] border-b md:border-b-0 md:border-r border-white/[0.08] relative overflow-hidden">
          <div
            className="w-full aspect-square relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#121218] group shadow-lg"
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
              <div className="absolute top-3 left-3 z-20 bg-rose-600 text-white font-bold px-3 py-1 rounded-full border border-rose-500/40 text-xs shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>-{discount}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Engine */}
        <div className="w-full md:w-7/12 lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative z-10">
          <div>
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 mb-3.5">
              <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 font-bold text-xs border border-blue-500/20 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                <Box className="w-3.5 h-3.5" /> Product
              </span>
              {product.stock > 0 ? (
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> IN STOCK
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 font-bold text-xs border border-rose-500/20 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                  <Box className="w-3.5 h-3.5" /> OUT OF STOCK
                </span>
              )}
            </div>
            
            {/* Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mb-3 tracking-tight">
              {product.name}
            </h1>
            
            {/* Price Row */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 font-mono tracking-tight">
                ฿{(product.price || 0).toLocaleString()}
              </span>
              {product.originalPrice && product.price && product.originalPrice > product.price && (
                <span className="text-base sm:text-lg font-bold text-white/40 line-through font-mono">
                  ฿{(product.originalPrice || 0).toLocaleString()}
                </span>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#121420]/80 border border-white/[0.08] p-3.5 rounded-xl shadow-sm">
                <div className="text-white/50 text-xs font-medium mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                  <Box className="w-3.5 h-3.5 text-blue-400"/> สถานะสต๊อก
                </div>
                <div className={`text-lg sm:text-xl font-bold font-mono ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {product.stock >= 999999 ? '∞ ไม่จำกัด' : `${product.stock.toLocaleString()} ชิ้น`}
                </div>
              </div>
              <div className="bg-[#121420]/80 border border-white/[0.08] p-3.5 rounded-xl shadow-sm">
                <div className="text-white/50 text-xs font-medium mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShoppingCart className="w-3.5 h-3.5 text-blue-400"/> สั่งซื้อไปแล้ว
                </div>
                <div className="text-lg sm:text-xl font-bold font-mono text-white">
                  {(product.soldCount || 0).toLocaleString()} ครั้ง
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
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
                    className="text-[11px] font-bold text-white/60 hover:text-white transition-all flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3.5 py-1.5 rounded-full active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-400" /> แชร์สินค้า
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
                    className="text-[11px] font-bold text-white/60 hover:text-white transition-all flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3.5 py-1.5 rounded-full active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" /> ดาวน์โหลด .TXT
                  </button>
                </div>
              </div>
              <div className="text-white/70 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-white/[0.02] p-4 sm:p-5 border border-white/[0.06] rounded-[24px] min-h-[100px] max-h-[220px] overflow-y-auto font-sans">
                {product.description || "ไม่มีรายละเอียดสินค้าระบุไว้"}
              </div>
            </div>
          </div>

          {/* Action & Checkout Controls */}
          <div className="mt-4 pt-4 border-t border-white/[0.08]">
            {!showConfirmPurchase ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider text-white/60">เลือกจำนวนชิ้น</label>
                  <div className="flex items-center gap-2.5 p-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
                    <button
                      onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                      className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.1] flex items-center justify-center font-black text-lg text-white transition-all active:scale-90 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
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
                      className="w-16 h-9 bg-transparent text-center font-mono font-black text-lg outline-none appearance-none m-0 text-white"
                      disabled={product.stock === 0}
                    />
                    <button
                      onClick={() => setPurchaseQuantity(Math.min(product.stock >= 999999 ? 999 : product.stock, purchaseQuantity + 1))}
                      className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.1] flex items-center justify-center font-black text-lg text-white transition-all active:scale-90 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
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
                        background: '#0c0c12',
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
                  className={`w-full py-4 rounded-full text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    product.stock > 0 
                      ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 active:scale-[0.99]' 
                      : 'bg-white/[0.05] text-white/30 border border-white/[0.05] cursor-not-allowed'
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
                className="bg-blue-600/10 border border-blue-500/30 p-5 rounded-[26px] shadow-lg"
              >
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 shrink-0 border border-blue-500/30">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white mb-1">ยืนยันการสั่งซื้อ</h3>
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                      คุณกำลังสั่งซื้อ <span className="text-white font-bold">{product.name}</span> จำนวน <span className="text-blue-400 font-black">{purchaseQuantity}</span> ชิ้น ในราคารวม <span className="text-emerald-400 font-mono font-black">฿{((product.price || 0) * purchaseQuantity).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full">
                  <button 
                    onClick={() => setShowConfirmPurchase(false)}
                    className="flex-1 py-3 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] text-white font-bold transition-all text-xs rounded-full active:scale-95 cursor-pointer"
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
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black transition-all text-xs rounded-full shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
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
