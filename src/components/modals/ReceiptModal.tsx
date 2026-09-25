import React, { useState } from 'react';
import { X, Eye, AlertCircle, ShoppingCart, Download, Copy, Check, Sparkles, Receipt } from 'lucide-react';
import { motion } from 'motion/react';

interface ReceiptModalProps {
  selectedItem: any;
  setSelectedItem: (item: any) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ selectedItem, setSelectedItem }) => {
  const [showSecret, setShowSecret] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!selectedItem) return null;
  
  const isPurchase = !selectedItem.type?.includes('topup');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#141414] border border-[#2A2A2A] w-full max-w-[650px] rounded-lg relative overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
      >
        {/* Header */}
        <div className="pt-5 px-6 pb-4 flex items-center justify-between border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {isPurchase ? 'ใบเสร็จการสั่งซื้อ' : 'ใบเสร็จการเติมเงิน'}
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                {selectedItem.billNumber || `#${(selectedItem.id || 'TX000000').substring(0, 10).toUpperCase()}`}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setSelectedItem(null)}
            className="w-8 h-8 bg-[#171717] hover:bg-[#202020] border border-[#2A2A2A] flex items-center justify-center text-zinc-400 hover:text-white transition-all rounded-md cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6 scrollbar-hide flex-1 space-y-4">
          {/* Summary Box */}
          <div className="bg-[#171717] border border-[#2A2A2A] p-4 rounded-md space-y-2.5">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">ข้อมูลการทำรายการ</h4>
            
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-zinc-400">วันที่ทำรายการ</span>
              <span className="text-white font-medium">
                {new Date(selectedItem.date || selectedItem.timestamp || new Date()).toLocaleString('th-TH')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-zinc-400">ช่องทาง / บริการ</span>
              <span className="text-white font-medium">
                {isPurchase ? (selectedItem.productName || 'สินค้าดิจิทัล') : (selectedItem.method || 'เติมเงินเข้าระบบ')}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-[#2A2A2A]">
              <span className="text-white font-bold text-sm">ยอดเงินรวม</span>
              <span className="text-xl font-black text-blue-400 font-mono">
                ฿{(selectedItem.money || selectedItem.amount || selectedItem.price || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Secret / Key Delivery Box if purchase */}
          {isPurchase && selectedItem.secretData && (
            <div className="bg-[#171717] border border-[#2A2A2A] p-4 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">ข้อมูลสินค้า / คีย์ลับ</h4>
                
                {showSecret && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(selectedItem.secretData);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                      <span>{isCopied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                    </button>
                    <button 
                      onClick={() => {
                        const blob = new Blob([selectedItem.secretData], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `key_${(selectedItem.productName || 'product').replace(/[^\wก-๙]/g, '_')}.txt`;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="text-xs font-bold text-zinc-300 hover:text-white bg-[#141414] border border-[#2A2A2A] px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ดาวน์โหลด</span>
                    </button>
                  </div>
                )}
              </div>

              {!showSecret ? (
                <button 
                  onClick={() => setShowSecret(true)}
                  className="w-full py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Eye className="w-4 h-4" />
                  <span>คลิกเพื่อดูข้อมูลสินค้า / รหัสคีย์</span>
                </button>
              ) : (
                <div className="bg-[#0f0f0f] border border-[#2A2A2A] p-3 text-xs sm:text-sm font-mono text-blue-300 whitespace-pre-wrap max-h-48 overflow-y-auto w-full break-all rounded-md select-all">
                  {selectedItem.secretData}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#2A2A2A] bg-[#141414]">
          <button 
            onClick={() => setSelectedItem(null)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all active:scale-[0.98] cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </motion.div>
    </div>
  );
};
