import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { Product, SiteStats, Category } from "../types";
import { ProductCard } from "./ProductCard";
import {
  Users,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingCart,
  Package,
} from "lucide-react";
import { generateGradient } from "../utils";

interface HomeViewProps {
  products: Product[];
  categories: Category[];
  stats: SiteStats;
  user?: any;
  siteSettings?: any;
  purchaseHistory?: any[];
  setActiveView: (view: any) => void;
  onProductClick: (id: string) => void;
  onSelectCategory?: (categoryId: string) => void;
}

// Brand Logo Squircle Helper for popular digital services
const renderServiceIcon = (name: string, imageUrl?: string) => {
  if (imageUrl && imageUrl.trim() !== "") {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-11 h-11 rounded-lg object-cover shrink-0 border border-white/[0.08]"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }

  const lower = name.toLowerCase();

  // Nord VPN
  if (lower.includes("nord") || lower.includes("vpn")) {
    return (
      <div className="w-11 h-11 rounded-lg bg-[#4460ef] flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
          <path d="M12 3L2 19h20L12 3zm0 4.5l6.5 10.5H5.5L12 7.5z" />
        </svg>
      </div>
    );
  }

  // Claude Pro / Anthropic
  if (lower.includes("claude") || lower.includes("anthropic")) {
    return (
      <div className="w-11 h-11 rounded-lg bg-[#d97746] flex items-center justify-center shrink-0 text-white font-black text-lg">
        ✶
      </div>
    );
  }

  // Netflix
  if (lower.includes("netflix")) {
    return (
      <div className="w-11 h-11 rounded-lg bg-[#000000] border border-white/10 flex items-center justify-center shrink-0">
        <span className="text-[#e50914] font-black text-xl font-sans tracking-tighter">
          N
        </span>
      </div>
    );
  }

  // WeTV
  if (lower.includes("wetv")) {
    return (
      <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center shrink-0">
        <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[12px] border-l-[#00b074] ml-1" />
      </div>
    );
  }

  // Bilibili
  if (lower.includes("bilibili") || lower.includes("bili")) {
    return (
      <div className="w-11 h-11 rounded-lg bg-[#23ade5] flex items-center justify-center shrink-0 text-white font-bold text-base">
        📺
      </div>
    );
  }

  // iQIYI
  if (lower.includes("iqiyi")) {
    return (
      <div className="w-11 h-11 rounded-lg bg-[#00c250] flex items-center justify-center shrink-0 text-white font-bold text-xs tracking-tighter">
        iQIYI
      </div>
    );
  }

  // Discord / Nitro
  if (lower.includes("nitro") || lower.includes("discord")) {
    return (
      <div className="w-11 h-11 rounded-lg bg-[#5865F2] flex items-center justify-center shrink-0 text-white font-bold text-xs">
        Nitro
      </div>
    );
  }

  // YouTube / Premium
  if (lower.includes("youtube") || lower.includes("yt")) {
    return (
      <div className="w-11 h-11 rounded-lg bg-[#ff0000] flex items-center justify-center shrink-0">
        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[9px] border-l-white ml-0.5" />
      </div>
    );
  }

  // Spotify
  if (lower.includes("spotify")) {
    return (
      <div className="w-11 h-11 rounded-lg bg-[#1db954] flex items-center justify-center shrink-0 text-black font-black text-sm">
        ●●●
      </div>
    );
  }

  // Fallback: Elegant colored monogram squircle
  return (
    <div
      className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-base"
      style={{ background: generateGradient(name) }}
    >
      {(name[0] || "P").toUpperCase()}
    </div>
  );
};

export interface RecentPurchaseItem {
  id: string;
  dbId?: string;
  productName: string;
  username: string;
  price: number;
  date: string;
  imageUrl?: string;
  productId?: string;
}

const DEFAULT_RECENT_PURCHASES: RecentPurchaseItem[] = [
  {
    id: "p-def-1",
    productName: "YouTube Premium 30 วัน",
    username: "cha***",
    price: 39,
    date: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "p-def-2",
    productName: "Netflix Premium 4K (30 วัน)",
    username: "tan***",
    price: 119,
    date: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
  },
  {
    id: "p-def-3",
    productName: "Discord Nitro 1 Month",
    username: "non***",
    price: 139,
    date: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  },
  {
    id: "p-def-4",
    productName: "Spotify Premium Family 30 วัน",
    username: "nat***",
    price: 45,
    date: new Date(Date.now() - 26 * 60 * 1000).toISOString(),
  },
  {
    id: "p-def-5",
    productName: "Canva Pro 1 ปี",
    username: "wor***",
    price: 89,
    date: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
  },
  {
    id: "p-def-6",
    productName: "CapCut Pro 30 วัน",
    username: "art***",
    price: 59,
    date: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
  },
  {
    id: "p-def-7",
    productName: "NordVPN 30 วัน",
    username: "sar***",
    price: 49,
    date: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
  },
];

const formatTimeAgo = (dateStr: string) => {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    if (isNaN(diffMs) || diffMs < 0) return "เมื่อสักครู่";
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "เมื่อสักครู่";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} ชั่วโมงที่แล้ว`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay} วันที่แล้ว`;
  } catch {
    return "เมื่อสักครู่";
  }
};

export const HomeView: React.FC<HomeViewProps> = ({
  products = [],
  categories = [],
  stats,
  user,
  siteSettings,
  purchaseHistory = [],
  setActiveView,
  onProductClick,
  onSelectCategory: _onSelectCategory,
}) => {
  const [currentBanner, setCurrentBanner] = useState<number>(0);
  const [livePurchases, setLivePurchases] = useState<RecentPurchaseItem[]>([]);
  const bannerTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLatestPurchases = async () => {
      try {
        const res = await axios.get("/api/latest-purchases");
        if (res.data && Array.isArray(res.data) && res.data.length > 0 && isMounted) {
          setLivePurchases(res.data);
        }
      } catch (e) {
        // Fallback gracefully
      }
    };
    fetchLatestPurchases();
    const interval = setInterval(fetchLatestPurchases, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const safeProducts = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products]
  );

  const safeCategories = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories]
  );

  const banners = useMemo(() => {
    if (
      siteSettings?.banners &&
      Array.isArray(siteSettings.banners) &&
      siteSettings.banners.length > 0
    ) {
      return siteSettings.banners.filter((b: any) => typeof b === "string" && b.trim() !== "");
    }
    return [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80",
    ];
  }, [siteSettings]);

  useEffect(() => {
    if (banners.length <= 1) return;
    bannerTimerRef.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => {
      if (bannerTimerRef.current) clearInterval(bannerTimerRef.current);
    };
  }, [banners.length]);

  const handlePrevBanner = () => {
    if (bannerTimerRef.current) clearInterval(bannerTimerRef.current);
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNextBanner = () => {
    if (bannerTimerRef.current) clearInterval(bannerTimerRef.current);
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const totalSales =
    siteSettings?.stats_sales_override != null
      ? Number(siteSettings.stats_sales_override)
      : stats?.sales ?? 12144;

  const totalMembers =
    siteSettings?.stats_users_override != null
      ? Number(siteSettings.stats_users_override)
      : stats?.users ?? 12606;

  const demoItems: Product[] = useMemo(() => [
    {
      id: "demo-wetv",
      name: "WETV VIP 30 วัน",
      price: 49,
      stock: 0,
      category: "Social",
      description: "VIP WeTV 30 วัน ดูได้ทุกเรื่อง ไม่มีโฆษณาคั่น",
      imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=600&q=80",
      content: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-nitro",
      name: "Nitro Promo 3 เดือน",
      price: 89,
      stock: 7,
      category: "Social",
      description: "Discord Nitro Promo 3 เดือน สิทธิพิเศษครบครัน",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      content: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-nordvpn",
      name: "Nord VPN 3 เดือน ส่วนตัว",
      price: 129,
      stock: 15,
      category: "Thailand",
      description: "Nord VPN บัญชีส่วนตัว ความเร็วสูง ปลอดภัย 100%",
      imageUrl: "",
      content: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-claude",
      name: "Claude Pro 30 วัน",
      price: 450,
      stock: 5,
      category: "Thailand",
      description: "Claude Pro บัญชีส่วนตัว 30 วัน ใช้ได้ไม่จำกัด",
      imageUrl: "",
      content: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-netflix",
      name: "Netflix 4K 7 วัน ส่วนตัว",
      price: 69,
      stock: 8,
      category: "Thailand",
      description: "Netflix 4K UHD 7 วัน จอส่วนตัว ไม่ชนใคร",
      imageUrl: "",
      content: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-bilibili",
      name: "Bilibili Premium 30 วัน",
      price: 59,
      stock: 12,
      category: "Thailand",
      description: "Bilibili Premium 30 วัน อนิเมะคมชัด 1080p+",
      imageUrl: "",
      content: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-iqiyi",
      name: "iQIYI VIP 30 วัน",
      price: 49,
      stock: 10,
      category: "Thailand",
      description: "iQIYI VIP 30 วัน ดูซีรีส์เอเชียแบบไม่มีโฆษณา",
      imageUrl: "",
      content: "",
      created_at: new Date().toISOString(),
    },
  ], []);

  // Merged items list ensuring vibrant content
  const displayProducts = useMemo(() => {
    if (safeProducts.length >= 6) return safeProducts;
    // Append demo items if database has few items
    const existingIds = new Set(safeProducts.map((p) => p.name.toLowerCase()));
    const missingDemos = demoItems.filter(
      (d) => !existingIds.has(d.name.toLowerCase())
    );
    return [...safeProducts, ...missingDemos];
  }, [safeProducts, demoItems]);

  // Popular products (First 4 items)
  const popularProducts = useMemo(() => {
    return displayProducts.slice(0, 4);
  }, [displayProducts]);

  // Recent Purchases Feed (Real DB orders + Props + Demo fallback)
  const recentPurchases = useMemo(() => {
    const combined: RecentPurchaseItem[] = [];

    // 1. Live purchases fetched from server /api/latest-purchases
    if (Array.isArray(livePurchases) && livePurchases.length > 0) {
      livePurchases.forEach((lp) => {
        if (!combined.some((c) => c.id === lp.id || (lp.dbId && c.dbId === lp.dbId))) {
          combined.push(lp);
        }
      });
    }

    // 2. Real purchases from purchaseHistory prop (newest first)
    if (Array.isArray(purchaseHistory) && purchaseHistory.length > 0) {
      purchaseHistory.slice(0, 10).forEach((item: any, idx: number) => {
        const rawUser = item.username || (item.userEmail ? item.userEmail.split("@")[0] : "user");
        const masked = rawUser.length > 3 ? rawUser.substring(0, 3) + "***" : rawUser + "***";
        const itemId = item.id || item.dbId || `prop-${idx}`;
        if (!combined.some((c) => c.id === itemId)) {
          combined.push({
            id: itemId,
            productName: item.productName || item.product_name || "สินค้าดิจิทัล",
            username: masked,
            price: Number(item.price) || 0,
            date: item.date || item.created_at || new Date().toISOString(),
            imageUrl: item.imageUrl,
            productId: item.productId,
          });
        }
      });
    }

    // 3. Fallback items if database has fewer than 7 records
    if (combined.length < 7) {
      const remainingNeeded = 7 - combined.length;
      combined.push(...DEFAULT_RECENT_PURCHASES.slice(0, remainingNeeded));
    }

    return combined.slice(0, 8);
  }, [purchaseHistory, livePurchases]);

  return (
    <div className="w-full min-h-screen text-white font-sans antialiased selection:bg-blue-600 selection:text-white pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-6 sm:space-y-8">

        {/* ── 1. Hero Banner Carousel ── */}
        <section className="relative w-full">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-lg overflow-hidden border border-[#2A2A2A] bg-[#141414] group">
            {banners.map((bannerUrl, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={bannerUrl}
                  alt={`Banner ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}

            {banners.length > 1 && (
              <>
                <button
                  onClick={handlePrevBanner}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-black/60 hover:bg-black/90 text-white/90 transition-all flex items-center justify-center z-20 cursor-pointer opacity-0 group-hover:opacity-100 border border-[#2A2A2A]"
                  aria-label="Previous Banner"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextBanner}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-black/60 hover:bg-black/90 text-white/90 transition-all flex items-center justify-center z-20 cursor-pointer opacity-0 group-hover:opacity-100 border border-[#2A2A2A]"
                  aria-label="Next Banner"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator Beneath Banner */}
          {banners.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {banners.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => {
                    if (bannerTimerRef.current) clearInterval(bannerTimerRef.current);
                    setCurrentBanner(dotIdx);
                  }}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    dotIdx === currentBanner
                      ? "w-6 h-1.5 bg-blue-500"
                      : "w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-500"
                  }`}
                  aria-label={`Slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── 2. สถิติการใช้งาน (Usage Statistics Card) ── */}
        <section className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                สถิติการใช้งาน
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">ข้อมูลจริงจากระบบ</p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-[#171717] border border-[#2A2A2A] text-[11px] font-medium text-zinc-300">
              อัปเดตเรียลไทม์
            </span>
          </div>

          {/* 2 Stat Rows (Inner Cards) */}
          <div className="space-y-2.5">
            {/* Stat 1: สมาชิกทั้งหมด */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-md bg-[#171717] border border-[#2A2A2A] hover:border-[#383838] transition-colors">
              <div className="flex items-center gap-3 sm:gap-3.5">
                <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center text-zinc-950 shrink-0">
                  <Users className="w-4 h-4 text-zinc-950" strokeWidth={2.2} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                    สมาชิกทั้งหมด
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">ผู้ใช้งาน</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                  {totalMembers.toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-400 font-normal text-right mt-1">คน</div>
              </div>
            </div>

            {/* Stat 2: คำสั่งซื้อสะสม */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-md bg-[#171717] border border-[#2A2A2A] hover:border-[#383838] transition-colors">
              <div className="flex items-center gap-3 sm:gap-3.5">
                <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center text-zinc-950 shrink-0">
                  <ShoppingBag className="w-4 h-4 text-zinc-950" strokeWidth={2.2} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                    คำสั่งซื้อสะสม
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">ทั้งหมด</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                  {totalSales.toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-400 font-normal text-right mt-1">รายการ</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. สินค้ายอดนิยม (Popular Products) ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                สินค้ายอดนิยม
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">สินค้าขายดีที่ได้รับความนิยมสูงสุด</p>
            </div>
            <button
              onClick={() => {
                setActiveView("categories");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-3 py-1.5 rounded-md bg-[#171717] border border-[#2A2A2A] text-xs font-medium text-zinc-300 hover:text-white hover:border-[#383838] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>ดูทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onProductClick}
              />
            ))}
          </div>
        </section>

        {/* ── 4. รายการซื้อสินค้าล่าสุด (Latest Purchases Feed) ── */}
        <section className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  รายการซื้อสินค้าล่าสุด
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">อัปเดตคำสั่งซื้อล่าสุดแบบเรียลไทม์</p>
              </div>
            </div>
            {user ? (
              <button
                onClick={() => {
                  setActiveView("order_history");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-2.5 py-1 rounded-md bg-[#171717] border border-[#2A2A2A] text-xs font-medium text-zinc-300 hover:text-white hover:border-[#383838] transition-colors cursor-pointer"
              >
                ประวัติของฉัน
              </button>
            ) : (
              <span className="px-2.5 py-1 rounded-md bg-[#171717] border border-[#2A2A2A] text-[11px] font-medium text-zinc-300">
                อัปเดตเรียลไทม์
              </span>
            )}
          </div>

          {/* List of recent purchases */}
          <div className="space-y-2">
            {recentPurchases.map((purchase) => {
              const hasProductLink = Boolean(purchase.productId);
              return (
                <div
                  key={purchase.id}
                  onClick={() => {
                    if (purchase.productId) {
                      onProductClick(purchase.productId);
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-md bg-[#171717] border border-[#2A2A2A] hover:border-[#383838] transition-colors ${
                    hasProductLink ? "cursor-pointer group" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Brand Logo */}
                    {renderServiceIcon(purchase.productName, purchase.imageUrl)}

                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {purchase.productName}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-zinc-400">
                        <span className="text-zinc-300 font-medium">
                          คุณ {purchase.username}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-zinc-500" />
                          {formatTimeAgo(purchase.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 ml-2 text-right">
                    <div>
                      <div className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-none">
                        {purchase.price.toLocaleString()}{" "}
                        <span className="text-blue-500 font-bold">฿</span>
                      </div>
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[9px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        สำเร็จ
                      </div>
                    </div>
                    {hasProductLink && (
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Quick Button */}
        <div className="pt-2 pb-4 flex justify-center">
          <button
            onClick={() => {
              setActiveView("categories");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-[#141414] hover:bg-[#171717] border border-[#2A2A2A] hover:border-[#383838] text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>ดูสินค้าและหมวดหมู่ทั้งหมดในร้าน</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomeView;
