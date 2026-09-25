import React, { useState, useEffect } from 'react';
import { ShoppingCart, Key, CreditCard, Gift, Star, History, ChevronRight, ChevronLeft, Sparkles, Receipt, Calendar } from 'lucide-react';
import { ReceiptModal } from './modals/ReceiptModal';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedScroll } from './AnimatedScroll';
import { Skeleton } from './ui/Skeleton';

interface HistoryViewProps {
  purchaseHistory?: any[];
  topupHistory?: any[];
  usedKeysHistory?: any[];
  defaultTab?: string | null;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ 
  purchaseHistory = [], 
  topupHistory = [], 
  usedKeysHistory = [], 
  defaultTab = null 
}) => {
  const [currentCategory, setCurrentCategory] = useState<string | null>(defaultTab);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentCategory) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 150);
      return () => clearTimeout(timer);
    }
  }, [currentCategory]);

  const categories = [
    {
      id: 'normal_product',
      title: 'ประวัติการซื้อสินค้า',
      subtitle: 'Shop Purchase History',
      icon: ShoppingCart,
      bg: 'bg-blue-500/10 border border-blue-500/20 text-blue-400',
      color: 'text-blue-400'
    },
    {
      id: 'special_product',
      title: 'ประวัติการสุ่มสินค้า',
      subtitle: 'Random Box History',
      icon: Star,
      bg: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
      color: 'text-amber-400'
    },
    {
      id: 'key_usage',
      title: 'ประวัติการใช้คีย์',
      subtitle: 'Key Activation History',
      icon: Key,
      bg: 'bg-purple-500/10 border border-purple-500/20 text-purple-400',
      color: 'text-purple-400'
    },
    {
      id: 'topup_gift',
      title: 'ประวัติการเติมเงิน (อั่งเปา)',
      subtitle: 'TrueMoney Gift Link History',
      icon: Gift,
      bg: 'bg-orange-500/10 border border-orange-500/20 text-orange-400',
      color: 'text-orange-400'
    },
    {
      id: 'topup_slip',
      title: 'ประวัติการเติมเงิน (ธนาคาร)',
      subtitle: 'Bank Slip Scanner History',
      icon: CreditCard,
      bg: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
      color: 'text-emerald-400'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'success':
        return <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 rounded-full flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>สำเร็จ</span>;
      case 'pending':
        return <span className="bg-amber-500/10 text-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20 rounded-full flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>รอดำเนินการ</span>;
      case 'failed':
        return <span className="bg-rose-500/10 text-rose-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-rose-500/20 rounded-full flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div>ล้มเหลว</span>;
      default:
        return <span className="bg-white/[0.04] text-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-white/[0.08] rounded-full flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>{status || 'สำเร็จ'}</span>;
    }
  };

  const getFilteredData = (categoryId: string) => {
    switch(categoryId) {
      case 'normal_product':
        return purchaseHistory.filter(p => !p.is_special).map(p => ({ ...p, type: 'normal_product', title: p.productName || 'ซื้อสินค้า', icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-500/10 border border-blue-500/20', money: -(p.price || 0), date: p.date || p.timestamp }));
      case 'special_product':
        return purchaseHistory.filter(p => p.is_special).map(p => ({ ...p, type: 'special_product', title: p.productName || 'สินค้าพิเศษ', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10 border border-amber-500/20', money: -(p.price || 0), date: p.date || p.timestamp }));
      case 'topup_gift':
        return topupHistory.filter(t => t.method?.toLowerCase().includes('gift') || t.method?.toLowerCase().includes('อั่งเปา')).map(t => ({ ...t, type: 'topup_gift', title: 'TrueMoney Wallet (อั่งเปา)', icon: Gift, color: 'text-orange-400', bg: 'bg-orange-500/10 border border-orange-500/20', money: t.amount, date: t.date || t.timestamp }));
      case 'topup_slip':
        return topupHistory.filter(t => !t.method?.toLowerCase().includes('gift') && !t.method?.toLowerCase().includes('อั่งเปา')).map(t => ({ ...t, type: 'topup_slip', title: 'ธนาคาร เช็คสลิป', icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border border-emerald-500/20', money: t.amount, date: t.date || t.timestamp }));
      case 'key_usage':
        return usedKeysHistory.map(k => ({ ...k, type: 'key_usage', title: 'เปิดใช้งานคีย์', icon: Key, color: 'text-purple-400', bg: 'bg-purple-500/10 border border-purple-500/20', money: 0, date: k.used_at || k.date || new Date().toISOString(), productName: k.key || k.code }));
      default:
        return [];
    }
  };

  const currentCategoryData = categories.find(c => c.id === currentCategory);
  const data = currentCategory ? getFilteredData(currentCategory) : [];

  return (
    <AnimatedScroll direction="up" hideOnScroll={true}>
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-sans text-white min-h-[85vh]">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <History className="w-3.5 h-3.5" />
              <span>Activity Log</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              ประวัติการทำรายการ
            </h1>
            <p className="text-white/50 text-xs sm:text-sm font-medium mt-1">
              ตรวจสอบประวัติการสั่งซื้อ เติมเงิน และเปิดใช้งานคีย์ทั้งหมดของคุณ
            </p>
          </div>
        </div>

        {/* View Selection or Category View */}
        {!currentCategory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentCategory(category.id)}
                  className="bg-[#141414] border border-[#2A2A2A] hover:border-[#383838] p-5 sm:p-6 rounded-[26px] cursor-pointer group relative overflow-hidden transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-[18px] bg-white text-zinc-950 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-zinc-950" strokeWidth={2.2} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#171717] border border-[#2A2A2A] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">
                    {category.subtitle}
                  </p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top Return & Header */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentCategory(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#171717] hover:bg-[#202020] border border-[#2A2A2A] text-zinc-300 hover:text-white transition-all font-bold text-xs cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 text-blue-400" />
                <span>ย้อนกลับไปหมวดหมู่ทั้งหมด</span>
              </button>

              <div className="flex items-center gap-2 px-3 py-1 bg-[#171717] border border-[#2A2A2A] rounded-full text-xs text-zinc-400">
                <span>ทั้งหมด: <strong className="text-white font-mono">{data.length}</strong> รายการ</span>
              </div>
            </div>

            {/* List Table / Card */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-[26px] overflow-hidden p-4 sm:p-6">
              {isLoading ? (
                <div className="space-y-3 py-4">
                  <div className="h-16 bg-[#171717] rounded-[20px] animate-pulse" />
                  <div className="h-16 bg-[#171717] rounded-[20px] animate-pulse" />
                  <div className="h-16 bg-[#171717] rounded-[20px] animate-pulse" />
                </div>
              ) : data.length === 0 ? (
                <div className="text-center py-16">
                  <History className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white mb-1">ยังไม่มีประวัติในหมวดหมู่นี้</h3>
                  <p className="text-xs text-zinc-400">เมื่อคุณทำรายการ ข้อมูลจะแสดงที่นี่โดยอัตโนมัติ</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {data.map((item: any, i: number) => {
                    const dateStr = item.date ? new Date(item.date).toLocaleString('th-TH') : '-';
                    const displayBill = item.billNumber || `#${(item.id || '000000').substring(0, 8).toUpperCase()}`;

                    return (
                      <div 
                        key={item.id || i}
                        className="py-3.5 px-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#171717] border border-[#2A2A2A] hover:border-[#383838] rounded-[20px] transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-[18px] bg-white text-zinc-950 flex items-center justify-center shrink-0">
                            {currentCategoryData ? <currentCategoryData.icon className="w-6 h-6 text-zinc-950" strokeWidth={2.2} /> : <History className="w-6 h-6 text-zinc-950" strokeWidth={2.2} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm sm:text-base font-bold text-white">
                                {item.title || item.productName || 'รายการ'}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-400 bg-[#141414] px-2 py-0.5 rounded border border-[#2A2A2A]">
                                {displayBill}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                              <span>{dateStr}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-auto">
                          {item.money !== undefined && item.money !== 0 && (
                            <span className={`font-mono font-extrabold text-sm sm:text-base ${item.money > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {item.money > 0 ? `+฿${item.money.toLocaleString()}` : `-฿${Math.abs(item.money).toLocaleString()}`}
                            </span>
                          )}

                          {getStatusBadge(item.status || 'success')}

                          <button 
                            onClick={() => setSelectedItem(item)}
                            className="p-2 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08] rounded-xl transition-all active:scale-95 cursor-pointer"
                            title="ดูใบเสร็จ"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Receipt Modal */}
        {selectedItem && (
          <ReceiptModal 
            selectedItem={selectedItem} 
            setSelectedItem={setSelectedItem} 
          />
        )}
      </div>
    </AnimatedScroll>
  );
};
