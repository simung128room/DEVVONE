import React, { useEffect, useRef } from "react";
import {
  X,
  Home,
  ShoppingCart,
  Wallet,
  Gift,
  History,
  Phone,
  ShieldCheck,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DevLogo } from "./DevLogo";
import { getAvatarUrl } from "../lib/avatar";

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  user: any;
  userPlan: any;
  isAdmin: boolean;
  onLogout: () => void;
  onOpenContact: () => void;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  settingsImport?: () => void;
  historyImport?: () => void;
  onOpenSearch?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  user,
  userPlan,
  isAdmin,
  onLogout,
  onOpenContact,
  historyImport,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const username =
    userPlan?.username || user?.name || user?.email?.split("@")[0] || "ผู้ใช้งาน";
  const avatarUrl =
    userPlan?.avatarUrl ||
    getAvatarUrl(
      userPlan?.username || user?.name || user?.email?.split("@")[0] || user?.id || "guest"
    );
  const balance = userPlan?.balance
    ? Math.floor(userPlan.balance)
    : user?.balance
    ? Math.floor(user.balance)
    : 0;

  const isShopActive =
    activeView === "categories" ||
    activeView === "category_products" ||
    activeView === "product_detail";

  const isHistoryActive =
    activeView === "log_categories" ||
    activeView === "vip_logs" ||
    activeView === "free_logs" ||
    activeView === "logs" ||
    activeView === "history" ||
    activeView === "order_history" ||
    activeView === "random_history" ||
    activeView === "wallet_history";

  const navItems = [
    {
      id: "home",
      label: "หน้าแรก",
      icon: Home,
      isActive: activeView === "home",
      onClick: () => {
        setActiveView("home");
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClose();
      },
    },
    {
      id: "categories",
      label: "ร้านค้า",
      icon: ShoppingCart,
      isActive: isShopActive,
      onClick: () => {
        setActiveView("categories");
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClose();
      },
    },
    {
      id: "wallet",
      label: "เติมเงิน",
      icon: Wallet,
      isActive: activeView === "wallet",
      badge: user ? `฿${balance.toLocaleString()}` : undefined,
      onClick: () => {
        setActiveView(user ? "wallet" : "login");
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClose();
      },
    },
    {
      id: "redeem",
      label: "สุ่มรางวัล",
      icon: Gift,
      isActive: activeView === "redeem",
      onClick: () => {
        setActiveView(user ? "redeem" : "login");
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClose();
      },
    },
    {
      id: "history",
      label: "ประวัติการซื้อ",
      icon: History,
      isActive: isHistoryActive,
      onClick: () => {
        historyImport?.();
        setActiveView(user ? "history" : "login");
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClose();
      },
    },
    {
      id: "contact",
      label: "ติดต่อเรา",
      icon: Phone,
      isActive: false,
      onClick: () => {
        onOpenContact();
        onClose();
      },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[68] cursor-pointer"
            aria-hidden="true"
          />

          {/* Minimalist Side Drawer: Clean dark theme with subtle curves */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 32,
              stiffness: 350,
              mass: 0.75,
            }}
            className="fixed top-2 bottom-2 right-2 w-[86vw] max-w-[320px] z-[70] bg-[#141414] border border-[#2A2A2A] rounded-lg shadow-2xl flex flex-col justify-between select-none overflow-hidden"
          >
            {/* Top Bar inside Drawer: Logo & Close Button */}
            <div className="p-4 flex items-center justify-between shrink-0 border-b border-[#2A2A2A]">
              <div
                onClick={() => {
                  setActiveView("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  onClose();
                }}
                className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
              >
                <DevLogo className="h-9 w-auto text-white" />
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-400 hover:text-white bg-[#171717] border border-[#2A2A2A] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Middle: Clean Menu Links */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-1.5 custom-scrollbar">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      item.isActive
                        ? "bg-white text-black font-bold shadow-md"
                        : "text-zinc-300 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          item.isActive ? "text-black" : "text-zinc-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-sm ${
                          item.isActive
                            ? "bg-black/15 text-black"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight
                        className={`w-3.5 h-3.5 opacity-40 ${
                          item.isActive ? "text-black" : "text-white"
                        }`}
                      />
                    )}
                  </button>
                );
              })}

              {/* Admin Button */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveView("admin");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    onClose();
                  }}
                  className={`flex items-center justify-between w-full px-4 py-2.5 rounded-md text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer mt-2 ${
                    activeView === "admin"
                      ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                      : "text-amber-400 hover:bg-amber-400/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span>จัดการระบบ</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              )}
            </div>

            {/* Bottom: User Profile or Login */}
            <div className="p-3 pt-2 shrink-0 border-t border-[#2A2A2A]">
              {user ? (
                <div className="space-y-2">
                  <div
                    onClick={() => {
                      setActiveView("profile");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 px-3 rounded-md bg-[#171717] hover:bg-[#202020] border border-[#2A2A2A] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={avatarUrl}
                        alt={username}
                        className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white truncate">
                          {username}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold truncate">
                          ฿{balance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <User className="w-4 h-4 text-zinc-400" />
                  </div>

                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveView("login");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      onClose();
                    }}
                    className="flex-1 py-2.5 rounded-md text-xs font-bold text-zinc-300 hover:text-white bg-[#171717] hover:bg-[#202020] border border-[#2A2A2A] transition-colors cursor-pointer text-center"
                  >
                    เข้าสู่ระบบ
                  </button>
                  <button
                    onClick={() => {
                      setActiveView("signup");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      onClose();
                    }}
                    className="flex-1 py-2.5 rounded-md text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer text-center shadow-md shadow-blue-600/20"
                  >
                    สมัครสมาชิก
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
