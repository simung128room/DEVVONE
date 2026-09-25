import React, { useState } from 'react';
import { Gift, Landmark, AlertTriangle, Copy, ShieldCheck, ArrowLeft, Sparkles, CheckCircle2, QrCode } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { UserPlan } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedScroll } from './AnimatedScroll';

interface WalletViewProps {
  userPlan: UserPlan | null;
  setUserPlan: React.Dispatch<React.SetStateAction<UserPlan | null>>;
  onTopupSuccess?: (entry: any) => void;
  userId?: string | null;
}

type TopupView = 'main' | 'truemoney' | 'bank';

export const WalletView: React.FC<WalletViewProps> = ({ userPlan, setUserPlan, onTopupSuccess, userId }) => {
  const [activeView, setActiveView] = useState<TopupView>('main');
  const [truemoneyLink, setTruemoneyLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleTruemoneyTopup = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedLink = truemoneyLink.trim();
    let voucherCode = '';
    
    if (trimmedLink.length >= 10) {
      if (/^[a-zA-Z0-9]+$/.test(trimmedLink)) {
        voucherCode = trimmedLink;
      } else if (trimmedLink.includes('truemoney.com') || trimmedLink.includes('?v=')) {
        voucherCode = trimmedLink;
      }
    }

    if (!voucherCode) {
      Swal.fire({
        title: 'ข้อมูลไม่ถูกต้อง',
        text: 'รูปแบบลิงก์ซองอั่งเปาไม่ถูกต้อง กรุณาใช้ลิงก์ที่ถูกต้องหรือกรอกเฉพาะรหัสอั่งเปา',
        icon: 'error',
        background: '#0c0c12',
        color: '#fff',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    Swal.fire({
      title: 'กำลังตรวจสอบ',
      text: 'ระบบกำลังตรวจสอบซองอั่งเปาของคุณ...',
      icon: 'info',
      background: '#0c0c12',
      color: '#fff',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await axios.post('/api/topup/truemoney', {
        voucherCode,
        uid: userId
      });

      if (response.data.success) {
        const amount = response.data.amount;
        
        if (setUserPlan) {
          setUserPlan((prev: UserPlan | null) => prev ? ({
            ...prev,
            balance: (prev.balance || 0) + amount
          }) : {
            username: 'User',
            isPremium: false,
            premiumExpireDate: null,
            balance: amount
          });
        }
        
        try {
          const topup = response.data.topup;
          const historyEntry = {
            id: topup ? topup.id : Math.random().toString(36).substr(2, 9),
            username: topup?.userId || userPlan?.username || 'Unknown',
            type: 'topup',
            method: 'ซองของขวัญ (Gift Link)',
            amount: topup ? topup.amount : amount,
            status: 'success',
            date: topup ? topup.date : new Date().toISOString(),
            billNumber: topup ? 'T-' + topup.id.split('-')[0].toUpperCase() : 'T-' + Math.floor(Math.random()*1000000).toString().padStart(6, '0'),
            money: topup ? topup.amount : amount,
            title: topup ? topup.title : 'เติมเงินสำเร็จ',
            image: topup ? topup.image : 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&w=800&q=80'
          };
          if (onTopupSuccess) onTopupSuccess(historyEntry);
        } catch(e) {}

        Swal.fire({
          title: 'เติมเงินสำเร็จ',
          text: `คุณได้รับเครดิต ${amount} บาท เรียบร้อยแล้ว`,
          icon: 'success',
          background: '#0c0c12',
          color: '#fff',
          confirmButtonColor: '#2563eb'
        });
        setTruemoneyLink('');
        setActiveView('main');
      } else {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: response.data.error || 'ไม่สามารถรับอั่งเปาได้',
          icon: 'error',
          background: '#0c0c12',
          color: '#fff',
          confirmButtonColor: '#2563eb'
        });
      }
    } catch (err: any) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: err.response?.data?.error || err.message || 'เครือข่ายขัดข้อง',
        icon: 'error',
        background: '#0c0c12',
        color: '#fff',
        confirmButtonColor: '#2563eb'
      });
    }
  };

  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    Swal.fire({
      title: 'กำลังตรวจสอบสลิป',
      text: 'ระบบกำลังวิเคราะห์ภาพและสแกน QR Code ตลอด 24 ชม...',
      icon: 'info',
      background: '#0c0c12',
      color: '#fff',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      const imageBase64 = result.split(',')[1];
      
      try {
        const response = await axios.post('/api/topup/slip', { imageBase64, uid: userId });
        
        if (response.data.success) {
          const amount = response.data.amount;
          if (setUserPlan) {
            setUserPlan((prev: UserPlan | null) => prev ? ({
              ...prev,
              balance: (prev.balance || 0) + amount
            }) : {
              username: 'User',
              isPremium: false,
              premiumExpireDate: null,
              balance: amount
            });
          }
          
          try {
            const topup = response.data.topup;
            const historyEntry = {
              id: topup ? topup.id : Math.random().toString(36).substr(2, 9),
              type: 'topup',
              method: 'สแกนสลิป (SlipOK)',
              amount: topup ? topup.amount : amount,
              username: topup?.userId || userPlan?.username || 'Unknown',
              status: 'success',
              date: topup ? topup.date : new Date().toISOString(),
              billNumber: topup ? 'T-' + topup.id.split('-')[0].toUpperCase() : 'T-' + Math.floor(Math.random()*1000000).toString().padStart(6, '0'),
              money: topup ? topup.amount : amount,
              title: topup ? topup.title : 'เติมเงินสำเร็จ',
              image: topup ? topup.image : 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&w=800&q=80'
            };
            if (onTopupSuccess) onTopupSuccess(historyEntry);
          } catch(e) {}
          
          Swal.fire({
            title: 'เติมเงินสำเร็จ',
            text: `ตรวจสอบสลิปสำเร็จ! คุณได้รับเครดิต ${amount} บาท`,
            icon: 'success',
            background: '#0c0c12',
            color: '#fff',
            confirmButtonColor: '#2563eb'
          });
          setActiveView('main');
        } else {
          Swal.fire({
            title: 'ตรวจสอบสลิปไม่สำเร็จ',
            text: response.data.error || 'สลิปไม่ถูกต้อง หรือถูกใช้งานไปแล้ว',
            icon: 'error',
            background: '#0c0c12',
            color: '#fff',
            confirmButtonColor: '#2563eb'
          });
        }
      } catch (err: any) {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: err.response?.data?.error || err.message || 'เครือข่ายขัดข้อง',
          icon: 'error',
          background: '#0c0c12',
          color: '#fff',
          confirmButtonColor: '#2563eb'
        });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <AnimatedScroll direction="up" hideOnScroll={true}>
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-sans text-white min-h-[85vh]">
        {activeView === 'main' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header section */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Payment Gateway</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  ช่องทางการเติมเงิน
                </h1>
                <p className="text-white/50 text-xs sm:text-sm font-medium mt-1">
                  เลือกช่องทางการเติมเงินที่คุณสะดวกที่สุด ระบบปรับยอดเงินคงเหลืออัตโนมัติ 24 ชม.
                </p>
              </div>

              {/* Current balance chip */}
              <div className="bg-[#141414] border border-[#2A2A2A] px-4 py-2.5 rounded-lg flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">ยอดเงินปัจจุบัน</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  ฿{(userPlan?.balance || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {/* Card 1: TrueMoney Voucher */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#141414] border border-[#2A2A2A] hover:border-[#383838] p-5 sm:p-6 rounded-lg flex flex-col items-center text-center transition-all group relative overflow-hidden cursor-pointer"
                onClick={() => setActiveView('truemoney')}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center rounded-md bg-white text-zinc-950">
                  <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-zinc-950" strokeWidth={2.2} />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                  TrueMoney (ซองของขวัญ)
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm mb-4 leading-relaxed px-2 font-medium">
                  เติมเงินผ่านลิงก์ซองของขวัญ TrueMoney Wallet สะดวก รวดเร็ว ตรวจสอบยอดเงินอัตโนมัติทันที
                </p>
                <div className="mt-auto px-3.5 py-1.5 rounded-md bg-[#171717] border border-[#2A2A2A] text-xs text-zinc-300 font-mono font-bold uppercase tracking-wider group-hover:text-white transition-all">
                  GIFT LINK TOPUP
                </div>
              </motion.div>

              {/* Card 2: Bank Slip Scanner */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#141414] border border-[#2A2A2A] hover:border-[#383838] p-5 sm:p-6 rounded-lg flex flex-col items-center text-center transition-all group relative overflow-hidden cursor-pointer"
                onClick={() => setActiveView('bank')}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center rounded-md bg-white text-zinc-950">
                  <Landmark className="w-7 h-7 sm:w-8 sm:h-8 text-zinc-950" strokeWidth={2.2} />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                  โอนผ่านธนาคาร (สแกนสลิป)
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm mb-4 leading-relaxed px-2 font-medium">
                  โอนเงินเข้าบัญชีธนาคารแล้วอัปโหลดสลิป ระบบตรวจสอบความถูกต้องและเติมเงินให้อัตโนมัติ
                </p>
                <div className="mt-auto px-3.5 py-1.5 rounded-md bg-[#171717] border border-[#2A2A2A] text-xs text-zinc-300 font-mono font-bold uppercase tracking-wider group-hover:text-white transition-all">
                  BANK SLIP SCANNER
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* View 2: TrueMoney Voucher Form */}
        {activeView === 'truemoney' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mx-auto bg-[#141414] border border-[#2A2A2A] p-5 sm:p-7 rounded-lg relative"
          >
            <button 
              onClick={() => setActiveView('main')}
              className="mb-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717] border border-[#2A2A2A] text-zinc-300 hover:text-white hover:bg-[#202020] transition-all font-bold text-xs cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-orange-400" /> ย้อนกลับ
            </button>
            
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-14 h-14 mb-3 flex items-center justify-center rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Gift className="w-7 h-7" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">เติมเงินผ่านซองของขวัญ</h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-0.5 font-medium">คัดลอกลิงก์ซองของขวัญจากแอป TrueMoney Wallet แล้ววางที่นี่</p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#171717] border border-[#2A2A2A] p-3 rounded-md flex items-center gap-2.5 text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-xs font-bold tracking-wider">ระบบตรวจสอบและเติมเครดิตให้อัตโนมัติ 100%</span>
              </div>

              <form onSubmit={handleTruemoneyTopup} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 ml-0.5">
                    ลิงก์ซองอั่งเปา TrueMoney (Gift Link)
                  </label>
                  <input
                    type="text"
                    value={truemoneyLink}
                    onChange={(e) => setTruemoneyLink(e.target.value)}
                    placeholder="https://gift.truemoney.com/campaign/?v=..."
                    className="w-full bg-[#171717] border border-[#2A2A2A] rounded-md p-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/60 transition-all font-sans font-medium"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-[0.98]"
                >
                  ยืนยันการเติมเงิน
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* View 3: Bank Transfer & Slip Scanner */}
        {activeView === 'bank' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mx-auto bg-[#141414] border border-[#2A2A2A] p-5 sm:p-7 rounded-lg relative"
          >
            <button 
              onClick={() => setActiveView('main')}
              className="mb-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717] border border-[#2A2A2A] text-zinc-300 hover:text-white hover:bg-[#202020] transition-all font-bold text-xs cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" /> ย้อนกลับ
            </button>
            
            <div className="space-y-4">
              {/* Bank Account Info Card */}
              <div className="bg-[#171717] border border-[#2A2A2A] p-4 sm:p-5 rounded-md text-center space-y-3">
                <div className="flex bg-[#00A82D]/10 border border-[#00A82D]/30 text-[#00A82D] px-3 py-0.5 gap-1.5 items-center w-fit mx-auto rounded-sm font-bold text-xs select-none">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>ธนาคารกสิกรไทย (K-BANK)</span>
                </div>
                
                <div className="pt-1">
                  <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Account Number / เลขที่บัญชี</p>
                  <div className="flex items-center justify-center gap-2.5">
                    <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-widest select-all">
                      196-3-87032-5
                    </span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('1963870325');
                        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'คัดลอกเลขบัญชีแล้ว', showConfirmButton: false, timer: 1500, background: '#141414', color: '#fff' });
                      }}
                      className="p-1.5 rounded-md bg-[#141414] border border-[#2A2A2A] hover:border-emerald-500/40 text-emerald-400 hover:text-white transition-all active:scale-95 cursor-pointer"
                      title="คัดลอกเลขบัญชี"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2A2A2A] flex flex-col items-center">
                  <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mb-0.5">Account Name / ชื่อบัญชี</p>
                  <p className="text-base sm:text-lg font-bold text-white">นาย กรวิชญ์</p>
                </div>
              </div>

              {/* Sandbox info badge */}
              <div className="bg-[#171717] border border-[#2A2A2A] p-3 rounded-md text-center select-none">
                <p className="text-xs text-emerald-400 font-bold tracking-wide mb-0.5 flex items-center justify-center gap-1.5 uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ระบบตรวจสอบสลิปอัตโนมัติ</span>
                </p>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                  โอนเงินและอัปโหลดสลิป ระบบจะตรวจเช็คยอดเงินและปรับยอดเครดิตให้อัตโนมัติทันที
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="pt-1 flex flex-col items-center w-full">
                <label className="flex flex-col items-center justify-center w-full py-6 sm:py-7 rounded-md bg-[#171717] hover:bg-[#1a1a1a] transition-all border border-dashed border-[#2A2A2A] hover:border-emerald-500/40 cursor-pointer group active:scale-[0.99] relative">
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleSlipUpload} disabled={isUploading} />
                  <div className="w-12 h-12 mb-2.5 group-hover:scale-105 transition-transform flex items-center justify-center rounded-md bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="text-center px-4">
                    <span className="text-sm sm:text-base font-bold text-white block leading-snug">
                      {isUploading ? 'กำลังอัปโหลดและตรวจสอบสลิป...' : 'อัปโหลดสลิปโอนเงินของคุณ'}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium mt-1 block">
                      แตะเพื่อเลือกรูปภาพ หรือลากไฟล์มาวาง (PNG, JPG)
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-1 flex items-center justify-center gap-1.5 select-none opacity-60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Secure Real-Time Automatic Slip Scanning System
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatedScroll>
  );
};
