import React, { useState } from 'react';
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Calendar,
  Share2,
  ExternalLink,
  ArrowLeft,
  MessageCircle,
  Sparkles,
  Check,
  Send,
  Camera,
  ShieldCheck,
  ShoppingBag,
  Plus,
  ArrowRight,
  Filter,
  DollarSign,
  Info,
  CheckCheck,
  Search,
  MessageSquareQuote,
  Quote,
  X,
  Palette,
} from 'lucide-react';
import { Business, ServiceItem, Review, ProductItem, CartItem, Order, WebsiteStyle, TestimonialItem } from '../types/index.ts';
import { formatMWK, formatDate } from '../utils/formatters.ts';
import { BusinessFooter } from './BusinessFooter.tsx';
import { CartDrawer } from './CartDrawer.tsx';

interface StyleConfig {
  name: string;
  themeTag: string;
  pageBg: string;
  containerBg: string;
  cardBg: string;
  cardSubBg: string;
  primaryBtn: string;
  secondaryBtn: string;
  accentText: string;
  badge: string;
  heroOverlay: string;
  fontFamily: string;
  borderAccent: string;
  isDark: boolean;
}

const STYLE_CONFIGS: Record<WebsiteStyle, StyleConfig> = {
  warm_earth: {
    name: 'African Warm Earth',
    themeTag: 'Terracotta & Amber',
    pageBg: 'bg-[#FAF7F2] text-stone-900',
    containerBg: 'bg-white border-stone-200/90 shadow-xl text-stone-900',
    cardBg: 'bg-white border-stone-200 shadow-sm text-stone-900',
    cardSubBg: 'bg-stone-50 border-stone-200 text-stone-800',
    primaryBtn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/20',
    secondaryBtn: 'border-stone-300 bg-white hover:bg-stone-50 text-stone-800',
    accentText: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    heroOverlay: 'from-[#24170e] via-[#24170e]/50 to-transparent',
    fontFamily: 'font-serif',
    borderAccent: 'border-amber-600',
    isDark: false,
  },
  modern_minimal: {
    name: 'Modern Minimalist',
    themeTag: 'Monochrome Slate',
    pageBg: 'bg-zinc-50 text-zinc-900',
    containerBg: 'bg-white border-zinc-200 shadow-xl text-zinc-900',
    cardBg: 'bg-white border-zinc-200 shadow-xs text-zinc-900',
    cardSubBg: 'bg-zinc-100/70 border-zinc-200 text-zinc-800',
    primaryBtn: 'bg-zinc-900 hover:bg-black text-white shadow-zinc-900/20',
    secondaryBtn: 'border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800',
    accentText: 'text-zinc-900',
    badge: 'bg-zinc-100 text-zinc-900 border-zinc-300',
    heroOverlay: 'from-zinc-950 via-zinc-950/60 to-transparent',
    fontFamily: 'font-sans tracking-tight',
    borderAccent: 'border-zinc-900',
    isDark: false,
  },
  vibrant_market: {
    name: 'Vibrant Marketplace',
    themeTag: 'Emerald & Gold',
    pageBg: 'bg-emerald-50/30 text-stone-900',
    containerBg: 'bg-white border-emerald-100 shadow-xl text-stone-900',
    cardBg: 'bg-white border-emerald-100/80 shadow-sm text-stone-900',
    cardSubBg: 'bg-emerald-50/50 border-emerald-200/60 text-stone-800',
    primaryBtn: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-900/20',
    secondaryBtn: 'border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-950',
    accentText: 'text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    heroOverlay: 'from-[#052619] via-[#052619]/60 to-transparent',
    fontFamily: 'font-sans font-bold',
    borderAccent: 'border-emerald-600',
    isDark: false,
  },
  luxury_noir: {
    name: 'Luxury Noir',
    themeTag: 'Obsidian & Champagne Gold',
    pageBg: 'bg-[#121214] text-stone-100',
    containerBg: 'bg-[#1a1a1f] border-stone-800 shadow-2xl text-stone-100',
    cardBg: 'bg-[#1e1e24] border-stone-800 shadow-sm text-stone-100',
    cardSubBg: 'bg-[#26262e] border-stone-700/60 text-stone-200',
    primaryBtn: 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold shadow-amber-400/20',
    secondaryBtn: 'border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-200',
    accentText: 'text-amber-300',
    badge: 'bg-stone-800 text-amber-300 border-amber-500/30',
    heroOverlay: 'from-black via-black/80 to-transparent',
    fontFamily: 'font-serif tracking-wide',
    borderAccent: 'border-amber-400',
    isDark: true,
  },
  pastel_boutique: {
    name: 'Pastel Boutique',
    themeTag: 'Rose Blush & Petal',
    pageBg: 'bg-rose-50/30 text-stone-900',
    containerBg: 'bg-white border-rose-100 shadow-xl text-stone-900',
    cardBg: 'bg-white border-rose-100/90 shadow-sm text-stone-900',
    cardSubBg: 'bg-rose-50/50 border-rose-200/60 text-stone-800',
    primaryBtn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20',
    secondaryBtn: 'border-rose-200 bg-white hover:bg-rose-50 text-rose-900',
    accentText: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-900 border-rose-200',
    heroOverlay: 'from-[#381622] via-[#381622]/60 to-transparent',
    fontFamily: 'font-sans font-medium',
    borderAccent: 'border-rose-500',
    isDark: false,
  },
  cyber_tech: {
    name: 'Cyber Modern Tech',
    themeTag: 'Neon Cyan & Indigo',
    pageBg: 'bg-[#0b0f19] text-slate-100',
    containerBg: 'bg-[#111827] border-indigo-900/80 shadow-2xl text-slate-100',
    cardBg: 'bg-[#151e33] border-indigo-900/50 shadow-sm text-slate-100',
    cardSubBg: 'bg-[#1a2540] border-indigo-800/60 text-slate-200',
    primaryBtn: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-cyan-500/25',
    secondaryBtn: 'border-indigo-800 bg-indigo-950/60 hover:bg-indigo-900 text-cyan-200',
    accentText: 'text-cyan-400',
    badge: 'bg-indigo-950 text-cyan-300 border-cyan-500/30',
    heroOverlay: 'from-[#050811] via-[#050811]/85 to-transparent',
    fontFamily: 'font-mono tracking-tight',
    borderAccent: 'border-cyan-400',
    isDark: true,
  },
};

interface BusinessMiniSiteProps {
  business: Business;
  reviews: Review[];
  onBackToMall: () => void;
  onBookService: (service?: ServiceItem) => void;
  onAddReview: (businessId: string, review: { customerName: string; rating: number; comment: string; serviceUsed?: string }) => void;
  onPlaceOrder?: (orderData: Omit<Order, 'id'>) => Promise<string>;
  onOpenDashboard?: () => void;
}

export const BusinessMiniSite: React.FC<BusinessMiniSiteProps> = ({
  business,
  reviews,
  onBackToMall,
  onBookService,
  onAddReview,
  onPlaceOrder,
  onOpenDashboard,
}) => {
  const websiteStyle = business.websiteStyle || 'warm_earth';
  const theme = STYLE_CONFIGS[websiteStyle] || STYLE_CONFIGS.warm_earth;
  const hasQuickSearch = business.hasQuickSearch !== false;

  const commerceMode = business.commerceMode || 'both';
  const products = business.products || [];
  const canShopCart = (commerceMode === 'cart' || commerceMode === 'both') && products.length > 0;
  const canBook = (commerceMode === 'booking' || commerceMode === 'both') && business.services && business.services.length > 0;

  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'services' | 'gallery' | 'about' | 'reviews'>(
    canShopCart && !canBook ? 'products' : 'home'
  );
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Customer Testimonial Form State
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState('Satisfied Customer');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewerService, setReviewerService] = useState(business.services[0]?.name || (products[0]?.name ? products[0].name : 'General Visit'));
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Local testimonials state initialized with business testimonials
  const [localTestimonials, setLocalTestimonials] = useState<TestimonialItem[]>(
    business.testimonials && business.testimonials.length > 0
      ? business.testimonials
      : [
          {
            id: 't-default-1',
            author: 'Chisomo Banda',
            role: 'Regular Client',
            rating: 5,
            comment: `Outstanding quality and hospitality at ${business.name}. The attention to detail is truly world-class!`,
            date: '2 weeks ago',
            serviceUsed: business.services[0]?.name || 'Standard Service',
          },
          {
            id: 't-default-2',
            author: 'Grace Phiri',
            role: 'Blantyre Resident',
            rating: 5,
            comment: 'Super fast, professional, and friendly staff. SuperMall makes booking and ordering so seamless!',
            date: '1 month ago',
          },
        ]
  );

  const businessReviews = reviews.filter((r) => r.businessId === business.id);

  // Combined testimonials list
  const allTestimonials: TestimonialItem[] = [
    ...localTestimonials,
    ...businessReviews.map((r) => ({
      id: r.id,
      author: r.customerName,
      role: 'SuperMall Verified Shopper',
      rating: r.rating,
      comment: r.comment,
      date: r.date,
      serviceUsed: r.serviceUsed,
    })),
  ];

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddToCart = (product: ProductItem) => {
    const chosenSize = selectedSizes[product.id] || (product.sizes ? product.sizes[0] : undefined);
    
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedSize === chosenSize
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + 1,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: 1,
            selectedSize: chosenSize,
            businessId: business.id,
            businessName: business.name,
            businessSlug: business.slug,
          },
        ];
      }
    });

    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1800);
  };

  const handleUpdateQuantity = (productId: string, selectedSize: string | undefined, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, selectedSize);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string, selectedSize: string | undefined) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === selectedSize))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    const newTestimonial: TestimonialItem = {
      id: `t-${Date.now()}`,
      author: reviewerName.trim(),
      role: reviewerRole.trim() || 'Verified Customer',
      rating: reviewerRating,
      comment: reviewerComment.trim(),
      date: 'Just now',
      serviceUsed: reviewerService,
    };

    setLocalTestimonials((prev) => [newTestimonial, ...prev]);

    onAddReview(business.id, {
      customerName: reviewerName.trim(),
      rating: reviewerRating,
      comment: reviewerComment.trim(),
      serviceUsed: reviewerService,
    });

    setReviewSubmitted(true);
    setReviewerName('');
    setReviewerComment('');
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter !== 'all' && p.category.toLowerCase() !== productCategoryFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });

  const filteredServices = business.services.filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });

  const productCategories: string[] = Array.from(new Set(products.map((p) => p.category)));

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartMWK = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className={`min-h-screen ${theme.pageBg} flex flex-col justify-between ${theme.fontFamily} transition-colors duration-200`}>
      <div>
        {/* SuperMall Navigation Header for Mini-Site */}
        <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onBackToMall}
              className="flex items-center gap-1.5 hover:text-white font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to SuperMall Directory</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-stone-400">
                Merchant Mini-Website URL:
              </span>
              <span className="bg-stone-800 px-2 py-0.5 rounded text-amber-300 font-mono text-[11px] border border-stone-700">
                {business.customDomain ? `www.${business.customDomain}` : `supermall.mw/s/${business.slug}`}
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Direct Link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Business Hero Banner (Cover Image + Branding) */}
        <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-stone-800 overflow-hidden">
          <img
            src={business.coverImage}
            alt={business.name}
            className="w-full h-full object-cover object-center"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${theme.heroOverlay}`} />

          {/* Top badges on hero */}
          <div className="absolute top-4 right-4 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>{theme.name}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-200 text-xs font-semibold border border-stone-700/60 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Independent Boutique</span>
            </span>
            {business.verified && (
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* Business Identity Card (Overlapping Hero) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className={`${theme.containerBg} rounded-2xl p-6 sm:p-8 transition-all`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Logo + Titles */}
              <div className="flex items-start gap-4 sm:gap-6">
                <img
                  src={business.logo}
                  alt={business.name}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-white shadow-lg border-2 ${theme.borderAccent} flex-shrink-0`}
                />

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className={`text-2xl sm:text-3xl font-bold ${theme.isDark ? 'text-white' : 'text-stone-900'}`}>
                      {business.name}
                    </h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${theme.badge}`}>
                      {business.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-500/10 text-stone-400">
                      {theme.themeTag}
                    </span>
                  </div>

                  <p className={`text-sm sm:text-base font-medium ${theme.isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    {business.tagline}
                  </p>

                  <div className={`flex flex-wrap items-center gap-4 text-xs ${theme.isDark ? 'text-stone-400' : 'text-stone-500'} pt-1`}>
                    <span className={`flex items-center gap-1 font-semibold ${theme.isDark ? 'text-stone-200' : 'text-stone-700'}`}>
                      <MapPin className={`w-3.5 h-3.5 ${theme.accentText}`} />
                      <span>{business.location}, {business.city}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 opacity-60" />
                      <span>Open Today • 08:30 – 18:00</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {business.whatsapp && (
                  <a
                    href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(business.name)},%20I%20saw%20your%20business%20on%20SuperMall.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}

                <a
                  href={`tel:${business.phone}`}
                  className={`px-4 py-2.5 rounded-xl border ${theme.secondaryBtn} font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors`}
                >
                  <Phone className="w-4 h-4 opacity-70" />
                  <span>Call Store</span>
                </a>

                {/* Cart Button (for businesses with cart enabled) */}
                {canShopCart && (
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className={`px-4 py-2.5 rounded-xl border ${theme.secondaryBtn} font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors relative cursor-pointer`}
                  >
                    <ShoppingBag className={`w-4 h-4 ${theme.accentText}`} />
                    <span>Bag</span>
                    {totalCartCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-xs font-bold">
                        {totalCartCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Appointment booking button (for businesses with booking enabled) */}
                {canBook && (
                  <button
                    id="minisite-book-now-cta"
                    onClick={() => onBookService()}
                    className={`px-5 py-2.5 rounded-xl ${theme.primaryBtn} font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all hover:scale-102 cursor-pointer`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>
                )}
              </div>
            </div>

            {/* Sub-info bar */}
            <div className={`mt-6 pt-6 border-t ${theme.isDark ? 'border-stone-800 text-stone-400' : 'border-stone-100 text-stone-600'} flex flex-wrap items-center justify-between gap-4 text-xs`}>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <Mail className="w-4 h-4 opacity-60" />
                  <span>{business.email}</span>
                </span>
                {canShopCart && (
                  <span className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-md border ${theme.badge}`}>
                    <Sparkles className="w-3 h-3" />
                    <span>Shopping Bag & Local City Delivery Available</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className={`font-bold text-sm ${theme.isDark ? 'text-white' : 'text-stone-900'}`}>{business.rating.toFixed(1)}</span>
                </div>
                <span className="opacity-60">({allTestimonials.length} customer reviews & testimonials)</span>
              </div>
            </div>

            {/* Quick Search Bar (Configurable by Platform Admin via hasQuickSearch) */}
            {hasQuickSearch && (
              <div className={`mt-5 pt-4 border-t ${theme.isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 relative">
                    <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${theme.isDark ? 'text-stone-400' : 'text-stone-400'}`} />
                    <input
                      type="text"
                      placeholder={`Quick Search in ${business.name}: filter services, products, or reviews...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-9 pr-8 py-2 text-xs rounded-xl border focus:outline-none transition-all ${
                        theme.isDark
                          ? 'bg-stone-900 border-stone-700 text-white placeholder-stone-500 focus:border-amber-400'
                          : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-amber-600'
                      }`}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear Search"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {searchQuery && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-stone-400">
                        Matches: <strong>{filteredProducts.length}</strong> products, <strong>{filteredServices.length}</strong> services
                      </span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-[11px] underline text-amber-500 hover:text-amber-400 cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mini-Site Navigation Tabs */}
            <div className={`mt-5 pt-2 border-t ${theme.isDark ? 'border-stone-800' : 'border-stone-200'}`}>
              <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto text-sm font-semibold">
                <button
                  id="minisite-tab-home"
                  onClick={() => setActiveTab('home')}
                  className={`py-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'home'
                      ? `${theme.borderAccent} ${theme.accentText}`
                      : `border-transparent ${theme.isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'}`
                  }`}
                >
                  Home Overview
                </button>

                {/* Products & Collection Tab */}
                {canShopCart && (
                  <button
                    id="minisite-tab-products"
                    onClick={() => setActiveTab('products')}
                    className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'products'
                        ? `${theme.borderAccent} ${theme.accentText}`
                        : `border-transparent ${theme.isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'}`
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 opacity-80" />
                    <span>Products & Shop</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${theme.badge}`}>
                      {filteredProducts.length}
                    </span>
                  </button>
                )}

                {canBook && (
                  <button
                    id="minisite-tab-services"
                    onClick={() => setActiveTab('services')}
                    className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'services'
                        ? `${theme.borderAccent} ${theme.accentText}`
                        : `border-transparent ${theme.isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'}`
                    }`}
                  >
                    <span>Services & Menu</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${theme.badge}`}>
                      {filteredServices.length}
                    </span>
                  </button>
                )}

                <button
                  id="minisite-tab-gallery"
                  onClick={() => setActiveTab('gallery')}
                  className={`py-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'gallery'
                      ? `${theme.borderAccent} ${theme.accentText}`
                      : `border-transparent ${theme.isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'}`
                  }`}
                >
                  Portfolio Gallery
                </button>

                <button
                  id="minisite-tab-about"
                  onClick={() => setActiveTab('about')}
                  className={`py-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'about'
                      ? `${theme.borderAccent} ${theme.accentText}`
                      : `border-transparent ${theme.isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'}`
                  }`}
                >
                  About & Hours
                </button>

                <button
                  id="minisite-tab-reviews"
                  onClick={() => setActiveTab('reviews')}
                  className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'reviews'
                      ? `${theme.borderAccent} ${theme.accentText}`
                      : `border-transparent ${theme.isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'}`
                  }`}
                >
                  <MessageSquareQuote className="w-4 h-4 opacity-80" />
                  <span>Testimonials & Reviews</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${theme.badge}`}>
                    {allTestimonials.length}
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {/* =========================================================
              TAB 1: HOME OVERVIEW
          ========================================================= */}
          {activeTab === 'home' && (
            <div className="space-y-8">
              {/* If business has cart enabled and products, feature them prominently! */}
              {canShopCart && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                        <span>Exclusive Boutique Collection</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                        Featured Products & Inventory
                      </h2>
                      <p className="text-xs text-stone-500">
                        Select items into your shopping bag for quick pickup or city delivery in {business.city}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                    >
                      <span>View Full Catalog ({products.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        className="bg-stone-50/50 rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
                      >
                        <div className="relative h-48 w-full bg-stone-200 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                            {product.category}
                          </span>
                          {product.stock > 0 ? (
                            <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-emerald-950/80 backdrop-blur-xs text-emerald-300 text-[10px] font-semibold">
                              In Stock ({product.stock} available)
                            </span>
                          ) : (
                            <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-rose-900/80 backdrop-blur-xs text-rose-200 text-[10px] font-semibold">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <h3 className="font-serif font-bold text-stone-900 text-base">
                              {product.name}
                            </h3>
                            <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                              {product.description}
                            </p>
                          </div>

                          {/* Sizes / Options */}
                          {product.sizes && product.sizes.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                                Choose Option:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {product.sizes.map((s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() =>
                                      setSelectedSizes((prev) => ({ ...prev, [product.id]: s }))
                                    }
                                    className={`px-2 py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                                      (selectedSizes[product.id] || product.sizes?.[0]) === s
                                        ? 'bg-amber-600 text-white border-amber-600'
                                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                            <div>
                              <span className="text-xs text-stone-400 block">Price</span>
                              <span className="text-base font-bold text-amber-800">
                                {formatMWK(product.price)}
                              </span>
                            </div>

                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock || product.stock <= 0}
                              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                justAddedId === product.id
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-900 hover:bg-amber-700 text-white shadow-sm'
                              }`}
                            >
                              {justAddedId === product.id ? (
                                <>
                                  <CheckCheck className="w-3.5 h-3.5" />
                                  <span>Added!</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add to Bag</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Story / About Teaser */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                <h2 className="text-xl font-serif font-bold text-stone-900 mb-3">
                  Welcome to {business.name}
                </h2>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
                  {business.about || business.description}
                </p>

                {/* Amenities Pills */}
                {business.amenities && business.amenities.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                      Lounge & Service Amenities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {business.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 text-xs font-medium border border-stone-200"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{amenity}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Services & Appointments Grid */}
              {canBook && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-serif font-bold text-stone-900">
                        Featured Services & Appointments
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Schedule an appointment directly with {business.name}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('services')}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800 cursor-pointer"
                    >
                      View All Services →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {business.services.map((service) => (
                      <div
                        key={service.id}
                        className="p-4 rounded-xl border border-stone-200 hover:border-amber-600/40 hover:shadow-md transition-all flex flex-col justify-between bg-stone-50/50"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-stone-900 text-base">
                              {service.name}
                            </h3>
                            <span className="text-base font-bold text-stone-900 whitespace-nowrap">
                              {formatMWK(service.price)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-stone-400" />
                              <span>{service.durationMinutes} mins</span>
                            </span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded bg-stone-200/60 text-stone-700 text-[10px] font-semibold">
                              {service.category}
                            </span>
                            {service.popular && (
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                Most Popular
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-stone-600 leading-relaxed mb-4">
                            {service.description}
                          </p>
                        </div>

                        <button
                          onClick={() => onBookService(service)}
                          className="w-full py-2 bg-stone-900 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book This Service</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Testimonials on Home Tab */}
              <div className={`${theme.cardBg} rounded-2xl p-6 sm:p-8 border ${theme.borderAccent} shadow-sm`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-1 border ${theme.badge}`}>
                      <MessageSquareQuote className="w-3.5 h-3.5" />
                      <span>Client Testimonials</span>
                    </div>
                    <h2 className={`text-xl sm:text-2xl font-bold ${theme.isDark ? 'text-white' : 'text-stone-900'}`}>
                      Customer Testimonials
                    </h2>
                    <p className={`text-xs ${theme.isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      Verified words & experiences from satisfied patrons at {business.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`text-xs font-semibold ${theme.accentText} hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer`}
                  >
                    <span>Add Testimonial ({allTestimonials.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allTestimonials.slice(0, 3).map((test) => (
                    <div
                      key={test.id}
                      className={`p-5 rounded-xl border ${theme.cardSubBg} flex flex-col justify-between relative space-y-3`}
                    >
                      <Quote className="w-6 h-6 text-amber-500/20 absolute top-4 right-4" />
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < test.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                              }`}
                            />
                          ))}
                          <span className="text-[11px] font-bold ml-1 opacity-70">
                            {test.rating}.0
                          </span>
                        </div>
                        <p className={`text-xs italic leading-relaxed ${theme.isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                          "{test.comment}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-500/20 flex items-center justify-between text-[11px]">
                        <div>
                          <span className={`font-bold block ${theme.isDark ? 'text-white' : 'text-stone-900'}`}>
                            {test.author}
                          </span>
                          <span className="text-[10px] opacity-60">
                            {test.role || 'Verified Customer'}
                          </span>
                        </div>
                        {test.serviceUsed && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${theme.badge}`}>
                            {test.serviceUsed}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 2: PRODUCTS & SHOP (Dedicated Catalog)
          ========================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-stone-900">
                      Shop Inventory & Collection
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Choose multiple items, customize sizing, and add to your bag for pickup or local delivery.
                    </p>
                  </div>

                  {/* Category Filter Chips */}
                  {productCategories.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Filter className="w-3 h-3" /> Filter:
                      </span>
                      <button
                        onClick={() => setProductCategoryFilter('all')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          productCategoryFilter === 'all'
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        All ({products.length})
                      </button>
                      {productCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setProductCategoryFilter(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                            productCategoryFilter.toLowerCase() === cat.toLowerCase()
                              ? 'bg-stone-900 text-white'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group"
                    >
                      <div className="relative h-56 w-full bg-stone-100 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                          {product.category}
                        </span>
                        {product.stock > 0 ? (
                          <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded bg-emerald-950/80 backdrop-blur-xs text-emerald-300 text-[10px] font-semibold">
                            In Stock ({product.stock} units)
                          </span>
                        ) : (
                          <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded bg-rose-900/80 backdrop-blur-xs text-rose-200 text-[10px] font-semibold">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-serif font-bold text-stone-900 text-base">
                              {product.name}
                            </h3>
                            {product.sku && (
                              <span className="text-[10px] font-mono text-stone-400">
                                {product.sku}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 line-clamp-3 mt-1.5 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* Sizing options */}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                              Select Size / Variant:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {product.sizes.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() =>
                                    setSelectedSizes((prev) => ({ ...prev, [product.id]: s }))
                                  }
                                  className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                                    (selectedSizes[product.id] || product.sizes?.[0]) === s
                                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                          <div>
                            <span className="text-[10px] text-stone-400 block uppercase font-medium">
                              Price (MWK)
                            </span>
                            <span className="text-lg font-bold text-amber-800">
                              {formatMWK(product.price)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock || product.stock <= 0}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              justAddedId === product.id
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-900 hover:bg-amber-700 text-white shadow-sm'
                            }`}
                          >
                            {justAddedId === product.id ? (
                              <>
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add to Bag</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 3: SERVICES & MENU
          ========================================================= */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  Full Service Menu & Pricing
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Transparent Malawian Kwacha rates with guaranteed appointment booking.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {business.services.map((service) => (
                  <div
                    key={service.id}
                    className="p-5 rounded-xl border border-stone-200 hover:border-amber-600/40 hover:shadow-md transition-all flex flex-col justify-between bg-stone-50/40"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="font-bold text-stone-900 text-base">
                          {service.name}
                        </h3>
                        <span className="text-base font-bold text-amber-800 whitespace-nowrap">
                          {formatMWK(service.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-stone-500 mb-2.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{service.durationMinutes} mins</span>
                        </span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded bg-stone-200/70 text-stone-700 text-[10px] font-semibold">
                          {service.category}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed mb-4">
                        {service.description}
                      </p>
                    </div>

                    <button
                      onClick={() => onBookService(service)}
                      className="w-full py-2.5 bg-stone-900 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Service Slot</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 4: PORTFOLIO GALLERY
          ========================================================= */}
          {activeTab === 'gallery' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  Craftsmanship & Portfolio Gallery
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  High resolution photography of recent work, client transformations, and atelier ambiance.
                </p>
              </div>

              {business.gallery && business.gallery.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {business.gallery.map((item) => (
                    <div
                      key={item.id}
                      className="group rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm flex flex-col"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3.5 bg-white">
                        <h4 className="font-bold text-stone-900 text-sm">{item.title}</h4>
                        {item.caption && (
                          <p className="text-xs text-stone-500 mt-0.5">{item.caption}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-stone-400 text-xs">
                  <Camera className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p>Gallery photos currently being curated by {business.name}.</p>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 5: ABOUT & HOURS
          ========================================================= */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* About Narrative */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-stone-900 mb-3">
                    About {business.name}
                  </h2>
                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                    {business.about || business.description}
                  </p>
                </div>

                {/* Location Card */}
                <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Store Location & Directions</span>
                  </h4>
                  <p className="text-xs text-stone-600">
                    {business.location}, {business.city}, Malawi
                  </p>
                  <p className="text-xs text-stone-500">
                    Easy parking, ground floor accessibility, and secure perimeter.
                  </p>
                </div>

                {/* Amenities */}
                {business.amenities && business.amenities.length > 0 && (
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm mb-3">
                      Amenities & Facilities
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {business.amenities.map((am, i) => (
                        <div key={i} className="flex items-center gap-2 text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{am}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Operating Hours Table */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm self-start space-y-4">
                <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span>Operating Hours</span>
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  {business.openingHours.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between pb-2 border-b border-stone-100 last:border-0"
                    >
                      <span className="font-semibold text-stone-800">{h.day}</span>
                      {h.closed ? (
                        <span className="text-rose-600 font-medium">Closed</span>
                      ) : (
                        <span className="text-stone-600 font-mono">
                          {h.open} – {h.close}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {business.services && business.services.length > 0 && (
                  <div className="pt-4 border-t border-stone-200">
                    <button
                      onClick={() => onBookService()}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Schedule Appointment</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 6: REVIEWS & TESTIMONIALS
          ========================================================= */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Reviews & Testimonials List */}
              <div className="lg:col-span-2 space-y-4">
                <div className={`${theme.cardBg} rounded-2xl p-6 sm:p-8 border ${theme.borderAccent} shadow-sm`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <h2 className={`text-2xl font-bold ${theme.isDark ? 'text-white' : 'text-stone-900'}`}>
                        Customer Testimonials & Reviews
                      </h2>
                      <p className={`text-xs ${theme.isDark ? 'text-stone-400' : 'text-stone-500'} mt-0.5`}>
                        Real experiences and feedback from patrons who booked or shopped at {business.name}
                      </p>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${theme.badge}`}>
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="text-lg font-bold">{business.rating.toFixed(1)}</span>
                      <span className="text-xs opacity-60">/ 5.0</span>
                    </div>
                  </div>

                  {allTestimonials.length > 0 ? (
                    <div className="space-y-4">
                      {allTestimonials.map((t) => (
                        <div
                          key={t.id}
                          className={`p-4 rounded-xl border ${theme.cardSubBg} space-y-2`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className={`font-bold text-sm block ${theme.isDark ? 'text-white' : 'text-stone-900'}`}>
                                {t.author}
                              </span>
                              <div className="flex items-center gap-2 text-[11px] opacity-70">
                                <span>{t.role || 'Verified Customer'}</span>
                                {t.serviceUsed && (
                                  <>
                                    <span>•</span>
                                    <span>Service: <strong>{t.serviceUsed}</strong></span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < t.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-stone-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <p className={`text-xs italic ${theme.isDark ? 'text-stone-200' : 'text-stone-700'}`}>
                            "{t.comment}"
                          </p>
                          <span className="text-[10px] opacity-50 block">{t.date}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500">No testimonials yet. Be the first to leave one!</p>
                  )}
                </div>
              </div>

              {/* Add Testimonial / Review Form */}
              <div className={`${theme.cardBg} rounded-2xl p-6 sm:p-8 border ${theme.borderAccent} shadow-sm self-start`}>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 border ${theme.badge}`}>
                  <Quote className="w-3.5 h-3.5" />
                  <span>Customer Input</span>
                </div>
                <h3 className={`text-lg font-bold mb-1 ${theme.isDark ? 'text-white' : 'text-stone-900'}`}>
                  Leave a Testimonial
                </h3>
                <p className={`text-xs ${theme.isDark ? 'text-stone-400' : 'text-stone-500'} mb-4`}>
                  Share your testimonial or feedback for {business.name} with the community.
                </p>

                {reviewSubmitted ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                    <p className="font-bold">Thank You!</p>
                    <p>Your customer testimonial has been posted successfully.</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className={`block font-semibold mb-1 ${theme.isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kondwani Chirwa"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          theme.isDark
                            ? 'bg-stone-900 border-stone-700 text-white placeholder-stone-500'
                            : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block font-semibold mb-1 ${theme.isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                        Your Role / Customer Type
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Regular Client, Bride, Corporate Guest"
                        value={reviewerRole}
                        onChange={(e) => setReviewerRole(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          theme.isDark
                            ? 'bg-stone-900 border-stone-700 text-white placeholder-stone-500'
                            : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400'
                        }`}
                      />
                    </div>

                    {business.services && business.services.length > 0 && (
                      <div>
                        <label className={`block font-semibold mb-1 ${theme.isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                          Service / Item Received (Optional)
                        </label>
                        <select
                          value={reviewerService}
                          onChange={(e) => setReviewerService(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                            theme.isDark
                              ? 'bg-stone-900 border-stone-700 text-white'
                              : 'bg-stone-50 border-stone-200 text-stone-900'
                          }`}
                        >
                          <option value="">Select a service (or general experience)</option>
                          {business.services.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name} ({formatMWK(s.price)})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className={`block font-semibold mb-1 ${theme.isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                        Rating *
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewerRating(star)}
                            className="p-1 focus:outline-none cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                star <= reviewerRating ? 'fill-amber-400 text-amber-400' : 'text-stone-400'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="font-bold ml-2 opacity-80">{reviewerRating} / 5</span>
                      </div>
                    </div>

                    <div>
                      <label className={`block font-semibold mb-1 ${theme.isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                        Your Testimonial / Story *
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Describe your satisfaction, hospitality, and quality..."
                        value={reviewerComment}
                        onChange={(e) => setReviewerComment(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none resize-none ${
                          theme.isDark
                            ? 'bg-stone-900 border-stone-700 text-white placeholder-stone-500'
                            : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-2.5 ${theme.primaryBtn} font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Testimonial</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Shopping Bag Pill (when cart has items) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 px-5 py-3.5 bg-stone-900 hover:bg-amber-700 text-white rounded-2xl shadow-2xl border-2 border-amber-500/40 transition-all hover:scale-105 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                {totalCartCount}
              </span>
            </div>
            <div className="text-left">
              <span className="text-xs text-stone-300 block">Shopping Bag</span>
              <span className="text-sm font-bold text-white">{formatMWK(totalCartMWK)}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 ml-1" />
          </button>
        </div>
      )}

      {/* Cart Drawer for Multiple Selection of Items */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        business={business}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onPlaceOrder={onPlaceOrder || (async () => '')}
      />

      {/* Dedicated Business Footer for Each Business! */}
      <BusinessFooter
        business={business}
        onOpenDashboard={onOpenDashboard}
        onBackToMall={onBackToMall}
      />
    </div>
  );
};
