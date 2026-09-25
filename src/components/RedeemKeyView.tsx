import React, { useState } from 'react';
import { Crown, Check, ShoppingCart, Key as KeyIcon, ArrowLeft, Zap, Shield, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface RedeemKeyViewProps {
  redeemKey: (key: string, email: string) => void;
  userEmail?: string;
  isLoggedIn: boolean;
  onBack: () => void;
  onGoToStore: () => void;
  onLoginClick: () => void;
}

export const RedeemKeyView: React.FC<RedeemKeyViewProps> = ({ 
  redeemKey, 
  userEmail, 
  isLoggedIn, 
  onBack, 
  onGoToStore, 
  onLoginClick 
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput && isLoggedIn) {
      redeemKey(keyInput.trim(), userEmail || 'ผู้ใช้งานทั่วไป');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-white">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl w-full"
      >
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-all font-bold px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-full text-xs sm:text-sm active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>กลับหน้าหลัก</span>
          </button>
          
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Key Activation</span>
          </div>
        </div>

        {/* Main Glassmorphic Container */}
        <div className="relative overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#141414]">
          <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
            {/* Left Column: Info & Upgrade */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#2A2A2A] bg-[#171717] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white text-zinc-950 rounded-md flex items-center justify-center mb-5">
                  <KeyIcon className="w-6 h-6 text-zinc-950" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  เปิดใช้งาน <span className="text-blue-400">License Key</span>
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
                  กรอกรหัสสินค้าหรือ License Key ที่ได้รับจากการสั่งซื้อ เพื่อเติมเครดิต หรือเปิดใช้งานผลิตภัณฑ์ทันที
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ตรวจสอบสถานะคีย์แบบเรียลไทม์</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>รับสิทธิ์และอัปเดตสถานะทันทีหลัง Redeem</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#2A2A2A]">
                <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5 text-blue-400" /> ยังไม่มีรหัสคีย์?
                </p>
                <button 
                  onClick={onGoToStore}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#141414] hover:bg-[#1a1a1a] border border-[#2A2A2A] hover:border-[#383838] text-white transition-all rounded-md active:scale-[0.98] group cursor-pointer"
                >
                  <span className="text-xs font-bold flex items-center gap-2">
                    เลือกดูสินค้าในร้านค้า
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>

            {/* Right Column: Key Input Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-[#141414]">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#171717] border border-[#2A2A2A] text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                    <Zap className="w-3 h-3 text-yellow-400" /> Instant Activation
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1">Redeem Code</h3>
                  <p className="text-zinc-400 text-xs font-medium">วางรหัส License Key 16 หลักของคุณลงในช่องด้านล่าง</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <div className={`relative transition-all duration-300 rounded-md border ${
                      isFocused || keyInput 
                        ? 'border-blue-500 bg-[#171717]' 
                        : 'border-[#2A2A2A] bg-[#171717] hover:border-[#383838]'
                    } ${!isLoggedIn ? 'opacity-50 select-none' : ''}`}>
                      <div className="flex items-center gap-3 px-4">
                        <KeyIcon className={`w-4 h-4 transition-colors duration-300 ${isFocused || keyInput ? 'text-blue-400' : 'text-zinc-500'}`} />
                        <input 
                          required
                          disabled={!isLoggedIn}
                          value={keyInput}
                          onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          type="text" 
                          className="w-full bg-transparent py-3 text-white font-mono text-sm sm:text-base focus:outline-none placeholder:text-zinc-600 tracking-wider disabled:bg-transparent" 
                          placeholder="XXXX-XXXX-XXXX-XXXX" 
                        />
                      </div>
                    </div>

                    {!isLoggedIn && (
                      <div className="mt-4 p-3.5 rounded-md bg-[#171717] border border-[#2A2A2A] text-center">
                        <p className="text-xs font-bold text-zinc-300 mb-2">กรุณาเข้าสู่ระบบก่อนทำการ Redeem คีย์</p>
                        <button 
                          type="button" 
                          onClick={onLoginClick} 
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md active:scale-95 cursor-pointer"
                        >
                          เข้าสู่ระบบ / สมัครสมาชิก
                        </button>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={!keyInput || !isLoggedIn}
                    className="w-full py-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-blue-600/20"
                  >
                    <span>เปิดใช้งานทันที</span>
                    <Zap className="w-4 h-4 fill-white flex-shrink-0" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
