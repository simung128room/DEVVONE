import React, { useState, useEffect } from "react";
import {
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Wallet,
  ShieldCheck,
  History,
  LogOut,
} from "lucide-react";
import { DevLogo } from "./DevLogo";
import { getAvatarUrl } from "../lib/avatar";

interface HeaderNavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  user: any;
  userPlan: any;
  isAdmin: boolean;
  onLogout: () => void;
  onOpenSearch: () => void;
  onOpenContact: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isDesktopUserMenuOpen?: boolean;
  setIsDesktopUserMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isUserMenuOpen?: boolean;
  setIsUserMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  settingsImport?: () => void;
  historyImport?: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  activeView,
  setActiveView,
  user,
  userPlan,
  isAdmin,
  onLogout,
  onOpenSearch,
  onOpenContact,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Shortcut key '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#user-profile-menu-container")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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

  const navLinks = [
    { id: "home", label: "หน้าแรก", view: "home", isActive: activeView === "home" },
    { id: "categories", label: "ร้านค้า", view: "categories", isActive: isShopActive },
    { id: "wallet", label: "เติมเงิน", view: user ? "wallet" : "login", isActive: activeView === "wallet" },
    { id: "redeem", label: "สุ่มรางวัล", view: user ? "redeem" : "login", isActive: activeView === "redeem" },
    { id: "history", label: "ประวัติการซื้อ", view: user ? "history" : "login", isActive: isHistoryActive },
    { id: "contact", label: "ติดต่อเรา", action: onOpenContact, isActive: false },
  ];

  return (
    <>
      {/* Clean Full-Width Dark Header (quixyshop.com style) */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-[#2A2A2A] flex items-center justify-between px-4 sm:px-6 lg:px-8 select-none">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <button
            onClick={() => {
              setActiveView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            aria-label="Zenone Home"
          >
            <DevLogo className="h-11 sm:h-14 w-auto text-white" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  if (link.action) {
                    link.action();
                  } else if (link.view) {
                    setActiveView(link.view);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  link.isActive
                    ? "bg-white/10 text-white font-bold"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {link.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => {
                  setActiveView("admin");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeView === "admin"
                    ? "bg-amber-400/20 text-amber-300"
                    : "text-amber-400 hover:bg-amber-400/10"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>จัดการระบบ</span>
              </button>
            )}
          </nav>
        </div>

        {/* Right: Search, User Circle, Menu Button (Matching Screenshot Top Right) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Balance for logged-in user on desktop */}
          {user && (
            <button
              onClick={() => {
                setActiveView("wallet");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hidden sm:flex items-center gap-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 font-mono font-bold text-xs px-3 py-1.5 transition-all duration-200 cursor-pointer"
              title="ยอดเงินคงเหลือ คลิกเพื่อเติมเงิน"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>฿{(user.balance ?? 0).toLocaleString()}</span>
            </button>
          )}

          {/* Search Icon Button */}
          <button
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Search"
            title="ค้นหาสินค้า"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User Account Button / Dropdown */}
          <div id="user-profile-menu-container" className="relative">
            {user ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-white/10 overflow-hidden border border-white/10 transition-colors cursor-pointer"
                aria-label="User profile"
              >
                <img
                  src={userPlan?.avatarUrl || getAvatarUrl(user.avatar || user.id)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ) : (
              <button
                onClick={() => setActiveView("login")}
                className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Sign in"
                title="เข้าสู่ระบบ"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            {/* Profile Dropdown */}
            {user && dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#13151b] border border-white/10 rounded-2xl p-2 shadow-2xl z-50">
                <div className="px-3 py-2 mb-1 border-b border-white/[0.06]">
                  <p className="text-[11px] text-zinc-500 font-medium">เข้าสู่ระบบในชื่อ</p>
                  <p className="text-xs font-bold text-white truncate">
                    {userPlan?.username || user.name || user.email}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-zinc-400">ยอดเงิน:</span>
                    <span className="font-mono font-bold text-blue-400">
                      ฿{(user.balance ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveView("profile");
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>ข้อมูลส่วนตัว</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView("wallet");
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5 text-zinc-400" />
                  <span>เติมเงิน</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView("history");
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left cursor-pointer"
                >
                  <History className="w-3.5 h-3.5 text-zinc-400" />
                  <span>ประวัติการสั่งซื้อ</span>
                </button>

                <div className="my-1 border-t border-white/[0.06]" />

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu Icon Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
            title="เมนู"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Top Spacer to prevent content overlap */}
      <div className="h-16 sm:h-20 w-full shrink-0" aria-hidden="true" />
    </>
  );
};

export default HeaderNavbar;
