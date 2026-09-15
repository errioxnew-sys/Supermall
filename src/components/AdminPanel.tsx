import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Calendar,
  Users,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Store,
  Tag,
  Clock,
  MapPin,
  TrendingUp,
  Star,
  RefreshCw,
  ShoppingBag,
  Package,
  CalendarCheck,
  Layers,
  Palette,
} from 'lucide-react';
import {
  Business,
  Category,
  Booking,
  SuperMallUser,
  BusinessStatus,
  BookingStatus,
  Order,
  OrderStatus,
  City,
  CommerceMode,
  WebsiteStyle,
} from '../types/index.ts';
import { useAuth, SUPERUSER_CONFIG } from '../context/AuthContext.tsx';
import { formatMWK, formatDate } from '../utils/formatters.ts';
import { StorageImageUpload } from './StorageImageUpload.tsx';

interface AdminPanelProps {
  businesses: Business[];
  categories: Category[];
  bookings: Booking[];
  orders?: Order[];
  subTab?: 'dashboard' | 'businesses' | 'categories' | 'bookings' | 'orders' | 'users' | 'reports';
  onUpdateBusiness: (businessId: string, updates: Partial<Business>) => Promise<void>;
  onDeleteBusiness: (businessId: string) => Promise<void>;
  onAddBusiness?: (bizData: Omit<Business, 'id'>) => Promise<string>;
  onOpenStaffPanel?: (businessId: string) => void;
  onAddCategory: (categoryData: Omit<Category, 'id'>) => Promise<void>;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => Promise<void>;
  onViewMiniSite: (slug: string) => void;
  onSeedData: () => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  businesses,
  categories,
  bookings,
  orders = [],
  subTab = 'dashboard',
  onUpdateBusiness,
  onDeleteBusiness,
  onAddBusiness,
  onOpenStaffPanel,
  onAddCategory,
  onUpdateBookingStatus,
  onUpdateOrderStatus,
  onViewMiniSite,
  onSeedData,
}) => {
  const { isSuperuser, loginAsSuperuser, user } = useAuth();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'businesses' | 'categories' | 'bookings' | 'orders' | 'users' | 'reports'>(subTab);

  const [businessSearch, setBusinessSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [isSeeding, setIsSeeding] = useState(false);

  // Add Business Backend Modal
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizTagline, setNewBizTagline] = useState('');
  const [newBizCategory, setNewBizCategory] = useState('Fashion & Boutique');
  const [newBizCity, setNewBizCity] = useState<City>('Blantyre');
  const [newBizLocation, setNewBizLocation] = useState('Victoria Avenue, City Centre');
  const [newBizPhone, setNewBizPhone] = useState('+265 888 123 456');
  const [newBizEmail, setNewBizEmail] = useState('');
  const [newBizTier, setNewBizTier] = useState<'free' | 'business' | 'premium'>('business');
  const [newBizCommerceMode, setNewBizCommerceMode] = useState<CommerceMode>('both');
  const [newBizWebsiteStyle, setNewBizWebsiteStyle] = useState<WebsiteStyle>('warm_earth');
  const [newBizHasQuickSearch, setNewBizHasQuickSearch] = useState<boolean>(true);
  const [newBizLogo, setNewBizLogo] = useState('');
  const [newBizCover, setNewBizCover] = useState('');
  const [newBizDescription, setNewBizDescription] = useState('Quality products and professional client care.');
  const [isCreatingBiz, setIsCreatingBiz] = useState(false);

  const websiteStylesList: {
    id: WebsiteStyle;
    name: string;
    themeLabel: string;
    description: string;
    previewColors: string[];
  }[] = [
    {
      id: 'warm_earth',
      name: 'African Warm Earth',
      themeLabel: 'Terracotta & Warm Sand',
      description: 'Warm earth tones, classic serif headings, organic hospitable warmth',
      previewColors: ['bg-amber-700', 'bg-amber-100', 'bg-orange-500'],
    },
    {
      id: 'modern_minimal',
      name: 'Modern Minimalist',
      themeLabel: 'Crisp Slate & Monochrome',
      description: 'Clean architectural lines, high-contrast monochrome, ultra modern font hierarchy',
      previewColors: ['bg-zinc-900', 'bg-zinc-100', 'bg-zinc-600'],
    },
    {
      id: 'vibrant_market',
      name: 'Vibrant Marketplace',
      themeLabel: 'Emerald Green & Gold',
      description: 'Vivid emerald accents, golden status badges, lively and engaging atmosphere',
      previewColors: ['bg-emerald-700', 'bg-amber-400', 'bg-emerald-100'],
    },
    {
      id: 'luxury_noir',
      name: 'Luxury Noir',
      themeLabel: 'Obsidian & Champagne Gold',
      description: 'High-end dark obsidian backdrop, champagne gold accents, VIP prestige feel',
      previewColors: ['bg-stone-950', 'bg-amber-300', 'bg-stone-800'],
    },
    {
      id: 'pastel_boutique',
      name: 'Pastel Boutique',
      themeLabel: 'Blush Rose & Soft Lilac',
      description: 'Soft pastel hues, delicate typography, smooth rounded accents for beauty & wellness',
      previewColors: ['bg-rose-500', 'bg-rose-100', 'bg-purple-200'],
    },
    {
      id: 'cyber_tech',
      name: 'Cyber Modern Tech',
      themeLabel: 'Electric Cyan & Indigo',
      description: 'Deep tech indigo with neon cyan highlights, sleek buttons and digital aesthetic',
      previewColors: ['bg-indigo-900', 'bg-cyan-400', 'bg-blue-600'],
    },
  ];

  // New Category Modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Briefcase');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  // Platform Metrics
  const totalBusinesses = businesses.length;
  const verifiedBusinesses = businesses.filter((b) => b.verified).length;
  const activeBusinesses = businesses.filter((b) => b.status === 'active').length;
  const pendingBusinesses = businesses.filter((b) => b.status === 'pending_verification').length;
  const suspendedBusinesses = businesses.filter((b) => b.status === 'suspended').length;
  const totalBookings = bookings.length;
  const totalGMV = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.price || 0), 0);

  const filteredBusinesses = businesses.filter((b) => {
    if (!businessSearch.trim()) return true;
    const q = businessSearch.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q)
    );
  });

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterStatus === 'all') return true;
    return b.status === bookingFilterStatus;
  });

  const filteredOrders = orders.filter((o) => {
    if (orderFilterStatus === 'all') return true;
    return o.status === orderFilterStatus;
  });

  const totalOrderSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    await onAddCategory({
      name: newCatName.trim(),
      slug: newCatSlug.trim() || newCatName.toLowerCase().replace(/\s+/g, '-'),
      icon: newCatIcon,
      description: newCatDesc.trim(),
      image: newCatImage.trim() || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80',
      businessCount: 0,
    });

    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
    setNewCatImage('');
    setShowCategoryModal(false);
  };

  const handleTriggerSeed = async () => {
    setIsSeeding(true);
    try {
      await onSeedData();
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCreateBusinessBackend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim()) return;
    setIsCreatingBiz(true);
    try {
      const generatedSlug = newBizName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const selectedCat = categories.find((c) => c.name === newBizCategory) || categories[0];
      const newBizData: Omit<Business, 'id'> = {
        name: newBizName.trim(),
        slug: generatedSlug || `biz-${Date.now()}`,
        tagline: newBizTagline.trim() || 'Premium store at SuperMall Malawi',
        description: newBizDescription.trim(),
        about: `${newBizName} is an official retailer and service provider at SuperMall, operating in ${newBizCity}, Malawi. Managed directly via the staff inventory portal.`,
        category: selectedCat?.name || newBizCategory,
        categorySlug: selectedCat?.slug || 'fashion-boutique',
        city: newBizCity,
        location: newBizLocation.trim() || 'City Center, Malawi',
        phone: newBizPhone.trim() || '+265 888 000 000',
        email: newBizEmail.trim() || `${generatedSlug}@supermall.mw`,
        whatsapp: newBizPhone.trim(),
        logo: newBizLogo || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
        coverImage: newBizCover || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        verified: true,
        tier: newBizTier,
        rating: 5.0,
        reviewCount: 1,
        status: 'active',
        commerceMode: newBizCommerceMode,
        services:
          newBizCommerceMode === 'cart'
            ? []
            : [
                {
                  id: `srv-${Date.now()}-1`,
                  name: 'Consultation & Personal Service',
                  price: 5000,
                  durationMinutes: 30,
                  category: selectedCat?.name || newBizCategory,
                  description: 'Dedicated in-store or appointment booking.',
                },
              ],
        products:
          newBizCommerceMode === 'booking'
            ? []
            : [
                {
                  id: `prod-${Date.now()}-1`,
                  name: `${newBizName} Flagship Item`,
                  price: 28000,
                  description: 'High quality in-stock merchandise available for customer cart checkout.',
                  category: selectedCat?.name || newBizCategory,
                  image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',
                  inStock: true,
                  stock: 15,
                  sku: `${(generatedSlug.slice(0, 4) || 'ITEM').toUpperCase()}-001`,
                },
              ],
        gallery: [
          {
            id: `gal-${Date.now()}-1`,
            url: newBizCover || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
            title: 'Store Front',
          },
        ],
        openingHours: [
          { day: 'Monday - Friday', open: '08:00', close: '18:00', closed: false },
          { day: 'Saturday', open: '09:00', close: '17:00', closed: false },
          { day: 'Sunday', open: '10:00', close: '15:00', closed: true },
        ],
        websiteStyle: newBizWebsiteStyle,
        hasQuickSearch: newBizHasQuickSearch,
        testimonials: [
          {
            id: `t-${Date.now()}-1`,
            author: 'Customer of ' + newBizName,
            role: 'Verified Patron',
            rating: 5,
            comment: `Delighted with the service and quality at ${newBizName}!`,
            date: 'Recent',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (onAddBusiness) {
        const createdId = await onAddBusiness(newBizData);
        if (createdId && onOpenStaffPanel) {
          // Open their staff panel directly or confirm
        }
      }
      setShowBusinessModal(false);
      setNewBizName('');
      setNewBizTagline('');
      setNewBizLogo('');
      setNewBizCover('');
      setNewBizCommerceMode('both');
      setNewBizWebsiteStyle('warm_earth');
      setNewBizHasQuickSearch(true);
    } catch (err) {
      console.error('Failed to create business on backend:', err);
    } finally {
      setIsCreatingBiz(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-20">
      {/* SuperMall Admin Header */}
      <div className="bg-stone-900 text-white border-b border-stone-800 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-xl text-white">
                  SuperMall Platform Administration
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                  Super Admin
                </span>
                {isSuperuser ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    <span>Superuser: {SUPERUSER_CONFIG.email}</span>
                  </span>
                ) : (
                  <button
                    onClick={() => loginAsSuperuser()}
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-white transition-colors"
                    title="Click to authorize superuser session immediately"
                  >
                    Authorize Superuser Access
                  </button>
                )}
              </div>
              <p className="text-xs text-stone-400">
                SuperMall Digital Shopping Mall Management Suite • Authorized Admin: {SUPERUSER_CONFIG.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenStaffPanel && (
              <button
                onClick={() => onOpenStaffPanel(businesses[0]?.id || 'biz-urban-cut')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                title="Switch to Business Admin Platform (Merchant & Staff Dashboard)"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Go to Business Admin</span>
              </button>
            )}

            <button
              onClick={handleTriggerSeed}
              disabled={isSeeding}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-stone-700"
              title="Sync Firestore with initial Mall sample businesses"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Syncing...' : 'Sync Demo Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-1 flex space-x-1 overflow-x-auto text-xs sm:text-sm font-semibold text-stone-600 mb-6">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              currentTab === 'dashboard'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Platform Overview</span>
          </button>

          <button
            onClick={() => setCurrentTab('businesses')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              currentTab === 'businesses'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Businesses ({totalBusinesses})</span>
            {pendingBusinesses > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                {pendingBusinesses} pending
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('categories')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              currentTab === 'categories'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setCurrentTab('bookings')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              currentTab === 'bookings'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>All Bookings ({totalBookings})</span>
          </button>

          <button
            onClick={() => setCurrentTab('orders')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              currentTab === 'orders'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setCurrentTab('reports')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              currentTab === 'reports'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Reports & Analytics</span>
          </button>
        </div>

        {/* =========================================================
            TAB 1: DASHBOARD OVERVIEW
        ========================================================= */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                  Total Mall Businesses
                </span>
                <p className="text-3xl font-bold font-serif text-stone-900 mt-1">
                  {totalBusinesses}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-emerald-600 font-medium">
                    {activeBusinesses} active
                  </span>
                  <span>•</span>
                  <span className="text-amber-600 font-medium">
                    {pendingBusinesses} pending
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                  Verified Merchants
                </span>
                <p className="text-3xl font-bold font-serif text-emerald-600 mt-1">
                  {verifiedBusinesses}
                </p>
                <span className="text-xs text-stone-500 mt-2 block">
                  Passed manual verification audit
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                  Total Mall Bookings
                </span>
                <p className="text-3xl font-bold font-serif text-stone-900 mt-1">
                  {totalBookings}
                </p>
                <span className="text-xs text-stone-500 mt-2 block">
                  Appointments booked through SuperMall
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                  Mall Gross Volume
                </span>
                <p className="text-2xl font-bold font-serif text-amber-800 mt-1">
                  {formatMWK(totalGMV)}
                </p>
                <span className="text-xs text-stone-500 mt-2 block">
                  Estimated value of customer bookings
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Recent Platform Bookings
                  </h3>
                  <button
                    onClick={() => setCurrentTab('bookings')}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                  >
                    View All →
                  </button>
                </div>

                <div className="divide-y divide-stone-100 text-xs">
                  {bookings.slice(0, 5).map((bk) => (
                    <div key={bk.id} className="p-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{bk.customerName}</span>
                          <span className="text-stone-400">booked at</span>
                          <span className="font-semibold text-amber-800">{bk.businessName}</span>
                        </div>
                        <p className="text-stone-500 mt-0.5">
                          {bk.serviceName} ({formatMWK(bk.price)}) • {bk.date} at {bk.timeSlot}
                        </p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          bk.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : bk.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {bk.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Quick Controls */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 space-y-4 text-xs">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Mall Platform Controls
                </h3>

                <div className="p-3 bg-stone-50 rounded-lg space-y-2 border border-stone-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-800">Categories</span>
                    <span className="font-bold text-stone-900">{categories.length} Active</span>
                  </div>
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="w-full py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Category</span>
                  </button>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg space-y-2 border border-amber-200 text-amber-900">
                  <p className="font-bold">Malawi Coverage Cities</p>
                  <div className="flex flex-wrap gap-1">
                    {['Blantyre', 'Lilongwe', 'Mzuzu', 'Zomba'].map((city) => (
                      <span key={city} className="px-2 py-0.5 rounded bg-white font-medium text-[11px]">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="font-semibold text-stone-700 block mb-1">Architecture Info</span>
                  <p className="text-stone-500 leading-relaxed text-[11px]">
                    Isolated multitenancy with Firebase Firestore. Merchant data strictly bounded by <code>ownerId</code> and <code>businessId</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: BUSINESSES DIRECTORY
        ========================================================= */}
        {currentTab === 'businesses' && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden space-y-4">
            <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Businesses Directory & Moderation
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Approve new merchants, toggle verification badges, feature shops on homepage.
                </p>
              </div>

              {/* Search input & Add Business Button */}
              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Filter businesses..."
                    value={businessSearch}
                    onChange={(e) => setBusinessSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  onClick={() => setShowBusinessModal(true)}
                  className="px-3 py-2 bg-stone-900 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Business (Backend)</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-3">Business</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">City / Location</th>
                    <th className="px-6 py-3">Capability Mode</th>
                    <th className="px-6 py-3">Mini-Site Theme</th>
                    <th className="px-6 py-3">Quick Search</th>
                    <th className="px-6 py-3">Tier</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Verification</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBusinesses.map((biz) => (
                    <tr key={biz.id} className="hover:bg-stone-50/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={biz.logo}
                            alt={biz.name}
                            className="w-9 h-9 rounded-lg object-cover bg-stone-100 border border-stone-200"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block">{biz.name}</span>
                            <span className="text-[11px] font-mono text-stone-400">/s/{biz.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-stone-700">
                        {biz.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-stone-900 block">{biz.city}</span>
                        <span className="text-stone-500 text-[11px]">{biz.location}</span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={biz.commerceMode || 'both'}
                          onChange={(e) => onUpdateBusiness(biz.id, { commerceMode: e.target.value as CommerceMode })}
                          aria-label="Store Capability Mode"
                          className={`px-2 py-1 border rounded text-[11px] font-bold cursor-pointer transition-colors ${
                            (biz.commerceMode || 'both') === 'booking'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : (biz.commerceMode || 'both') === 'cart'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : 'bg-indigo-50 text-indigo-900 border-indigo-300'
                          }`}
                        >
                          <option value="both">Both (Booking & Cart)</option>
                          <option value="booking">Booking Only</option>
                          <option value="cart">Cart Only</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={biz.websiteStyle || 'warm_earth'}
                          onChange={(e) => onUpdateBusiness(biz.id, { websiteStyle: e.target.value as WebsiteStyle })}
                          aria-label="Mini-Site Style"
                          className="px-2 py-1 bg-white border border-stone-200 rounded text-[11px] font-semibold text-stone-800 cursor-pointer shadow-2xs"
                        >
                          <option value="warm_earth">African Warm Earth</option>
                          <option value="modern_minimal">Modern Minimalist</option>
                          <option value="vibrant_market">Vibrant Market</option>
                          <option value="luxury_noir">Luxury Noir</option>
                          <option value="pastel_boutique">Pastel Boutique</option>
                          <option value="cyber_tech">Cyber Tech</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => onUpdateBusiness(biz.id, { hasQuickSearch: biz.hasQuickSearch === false ? true : false })}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                            biz.hasQuickSearch !== false
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-stone-100 text-stone-500 border border-stone-200'
                          }`}
                        >
                          {biz.hasQuickSearch !== false ? 'Quick Search: ON' : 'Quick Search: OFF'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          {biz.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={biz.status}
                          onChange={(e) => onUpdateBusiness(biz.id, { status: e.target.value as BusinessStatus })}
                          aria-label="Update business status"
                          className="px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-semibold cursor-pointer"
                        >
                          <option value="active">Active</option>
                          <option value="pending_verification">Pending</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onUpdateBusiness(biz.id, { verified: !biz.verified })}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1 ${
                            biz.verified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{biz.verified ? 'Verified' : 'Unverified'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => onUpdateBusiness(biz.id, { featured: !biz.featured })}
                          className={`px-2 py-1 rounded text-[11px] font-medium ${
                            biz.featured
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                          title="Toggle Featured on Mall Home"
                        >
                          {biz.featured ? '★ Featured' : 'Feature'}
                        </button>
                        <button
                          onClick={() => onOpenStaffPanel?.(biz.id)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded font-semibold text-[11px] inline-flex items-center gap-1 border border-amber-200"
                          title="Open Store Staff / Inventory Admin Panel"
                        >
                          <Store className="w-3.5 h-3.5 text-amber-700" />
                          <span>Staff Panel</span>
                        </button>
                        <button
                          onClick={() => onViewMiniSite(biz.slug)}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-medium text-[11px] inline-flex items-center gap-1"
                          title="View Mini-Site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Mini-Site</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${biz.name}?`)) {
                              onDeleteBusiness(biz.id);
                            }
                          }}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded font-medium"
                          title="Delete Business"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: CATEGORIES
        ========================================================= */}
        {currentTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  SuperMall Directory Categories
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Manage categories shown on the homepage and filter bars.
                </p>
              </div>

              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm flex flex-col">
                  <div className="h-28 overflow-hidden relative">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-stone-900/40"></div>
                    <span className="absolute bottom-2 left-2 text-white font-serif font-bold text-sm">
                      {cat.name}
                    </span>
                  </div>
                  <div className="p-3 text-xs flex-1 flex flex-col justify-between">
                    <p className="text-stone-500 line-clamp-2">{cat.description}</p>
                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-stone-400">
                      <span>Icon: {cat.icon}</span>
                      <span className="font-mono text-[10px]">slug: {cat.slug}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Modal */}
            {showCategoryModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xl max-w-md w-full text-xs space-y-4">
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Add SuperMall Category
                  </h3>

                  <form onSubmit={handleCreateCategory} className="space-y-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Category Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Barber Shops"
                        value={newCatName}
                        onChange={(e) => {
                          setNewCatName(e.target.value);
                          setNewCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                        }}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Slug</label>
                      <input
                        type="text"
                        required
                        value={newCatSlug}
                        onChange={(e) => setNewCatSlug(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Lucide Icon</label>
                      <select
                        value={newCatIcon}
                        onChange={(e) => setNewCatIcon(e.target.value)}
                        aria-label="Lucide Icon"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                      >
                        <option value="Scissors">Scissors (Barbers/Hair)</option>
                        <option value="Shirt">Shirt (Fashion/Tailoring)</option>
                        <option value="Sparkles">Sparkles (Beauty/Spa)</option>
                        <option value="Calendar">Calendar (Events/Venues)</option>
                        <option value="Camera">Camera (Photography)</option>
                        <option value="UtensilsCrossed">UtensilsCrossed (Food)</option>
                        <option value="Car">Car (Automotive)</option>
                        <option value="Briefcase">Briefcase (Professional)</option>
                      </select>
                    </div>

                    <StorageImageUpload
                      label="Category Cover Photo"
                      value={newCatImage}
                      onChange={setNewCatImage}
                      aspectRatio="video"
                      helperText="Select cover photo for this category from device storage"
                    />

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={newCatDesc}
                        onChange={(e) => setNewCatDesc(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowCategoryModal(false)}
                        className="px-4 py-2 bg-stone-100 rounded-lg font-medium text-stone-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium"
                      >
                        Create Category
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 4: ALL BOOKINGS
        ========================================================= */}
        {currentTab === 'bookings' && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Platform-Wide Customer Bookings
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Master transaction ledger of all appointments booked across all mall merchants.
                </p>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 font-medium">Filter Status:</span>
                <select
                  value={bookingFilterStatus}
                  onChange={(e) => setBookingFilterStatus(e.target.value)}
                  aria-label="Filter bookings by status"
                  className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg font-semibold text-stone-900"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-3">Booking Ref</th>
                    <th className="px-6 py-3">Merchant</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Service & Price</th>
                    <th className="px-6 py-3">Schedule</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/60">
                      <td className="px-6 py-4 font-mono font-bold text-stone-900">
                        {b.bookingRef}
                      </td>
                      <td className="px-6 py-4 font-semibold text-amber-800">
                        {b.businessName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-stone-900 block">{b.customerName}</span>
                        <span className="text-stone-500 block">{b.customerPhone}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-stone-900 block">{b.serviceName}</span>
                        <span className="font-bold text-amber-800">{formatMWK(b.price)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-stone-800 block">{b.date}</span>
                        <span className="text-stone-500">{b.timeSlot}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : b.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <select
                          value={b.status}
                          onChange={(e) => onUpdateBookingStatus(b.id, e.target.value as BookingStatus)}
                          aria-label="Change booking status"
                          className="px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs cursor-pointer font-medium"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB: CUSTOMER CART ORDERS
        ========================================================= */}
        {currentTab === 'orders' && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Platform Customer Cart Orders
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Master registry of all physical products purchased from fashion, clothing, and beauty merchants. Total volume: <strong className="text-stone-800">{formatMWK(totalOrderSales)}</strong>
                </p>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 font-medium">Filter Status:</span>
                <select
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                  aria-label="Filter orders by status"
                  className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg font-semibold text-stone-900"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                    <tr>
                      <th className="px-6 py-3">Order ID / Date</th>
                      <th className="px-6 py-3">Merchant Store</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Items Purchased</th>
                      <th className="px-6 py-3">Amount & Payment</th>
                      <th className="px-6 py-3">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50/60">
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-stone-900 block">{o.id}</span>
                          <span className="text-stone-400 text-[11px] block">{formatDate(o.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-amber-900">
                          {o.businessName}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-stone-900 block">{o.customerName}</span>
                          <span className="text-stone-500 block">{o.customerPhone}</span>
                          <span className="text-stone-400 text-[11px]">{o.deliveryAddress}, {o.city}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1 max-w-xs">
                            {o.items.map((it, idx) => (
                              <div key={idx} className="text-[11px] text-stone-700">
                                <span className="font-semibold text-stone-900">{it.quantity}x</span> {it.productName}{' '}
                                {it.selectedSize && <span className="text-stone-400">({it.selectedSize})</span>}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-stone-900 block">{formatMWK(o.total)}</span>
                          <span className="text-[10px] uppercase font-bold text-stone-500 px-1.5 py-0.5 rounded bg-stone-100 inline-block mt-0.5">
                            {o.paymentMethod.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {onUpdateOrderStatus ? (
                            <select
                              value={o.status}
                              onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                              aria-label="Change order status"
                              className="px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs cursor-pointer font-semibold"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="dispatched">Dispatched</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                              {o.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="font-serif font-bold text-stone-700">No Orders in this filter</p>
                <p className="text-xs text-stone-400 mt-1">
                  Customer cart purchases from clothes and beauty shops will appear here in real-time.
                </p>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 5: REPORTS & ANALYTICS
        ========================================================= */}
        {currentTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Mall Analytics & Performance Reports
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Data insights covering category demand, geographic distribution across Malawi, and booking volume.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category distribution */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <h3 className="font-serif font-bold text-base text-stone-900 mb-4">
                  Businesses by Industry Category
                </h3>
                <div className="space-y-3 text-xs">
                  {categories.map((cat) => {
                    const count = businesses.filter((b) => b.categorySlug === cat.slug).length;
                    const percent = totalBusinesses > 0 ? (count / totalBusinesses) * 100 : 0;
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex justify-between font-medium">
                          <span className="text-stone-700">{cat.name}</span>
                          <span className="text-stone-900 font-bold">
                            {count} shops ({percent.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                          <div
                            className="h-full bg-amber-600 rounded-full"
                            style={{ width: `${Math.max(percent, 4)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* City distribution */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <h3 className="font-serif font-bold text-base text-stone-900 mb-4">
                  Geographic Footprint (Malawi Cities)
                </h3>
                <div className="space-y-3 text-xs">
                  {(['Blantyre', 'Lilongwe', 'Mzuzu', 'Zomba'] as const).map((city) => {
                    const count = businesses.filter((b) => b.city === city).length;
                    const percent = totalBusinesses > 0 ? (count / totalBusinesses) * 100 : 0;
                    return (
                      <div key={city} className="space-y-1">
                        <div className="flex justify-between font-medium">
                          <span className="text-stone-700">{city}</span>
                          <span className="text-stone-900 font-bold">
                            {count} merchants ({percent.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${Math.max(percent, 4)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* =========================================================
            MODAL: ADD BUSINESS (BACKEND ONLY)
        ========================================================= */}
        {showBusinessModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      Add Business (Platform Backend)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Merchant will receive their isolated admin & inventory management portal immediately.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBusinessModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBusinessBackend} className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mzuzu Threads & Attire"
                      value={newBizName}
                      onChange={(e) => setNewBizName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={newBizCategory}
                      onChange={(e) => setNewBizCategory(e.target.value)}
                      aria-label="Select Business Category"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      City (Malawi) *
                    </label>
                    <select
                      value={newBizCity}
                      onChange={(e) => setNewBizCity(e.target.value as City)}
                      aria-label="Select City"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="Blantyre">Blantyre</option>
                      <option value="Lilongwe">Lilongwe</option>
                      <option value="Mzuzu">Mzuzu</option>
                      <option value="Zomba">Zomba</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Street / Mall Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chichiri Shopping Mall, Shop 14"
                      value={newBizLocation}
                      onChange={(e) => setNewBizLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Store Contact Phone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+265 888 123 456"
                      value={newBizPhone}
                      onChange={(e) => setNewBizPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Store Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="shop@supermall.mw"
                      value={newBizEmail}
                      onChange={(e) => setNewBizEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Store Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Trendy Urban Wear & Authentic Fabrics"
                    value={newBizTagline}
                    onChange={(e) => setNewBizTagline(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Capability Selector */}
                <div className="space-y-1.5 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <label className="block font-bold text-stone-800 text-xs">
                    Business Capability Mode <span className="text-amber-600">*</span>
                  </label>
                  <p className="text-[11px] text-stone-500 mb-2">
                    Specify whether this merchant should have only booking, only cart, or both features enabled.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewBizCommerceMode('booking')}
                      className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                        newBizCommerceMode === 'booking'
                          ? 'bg-amber-50 border-amber-600 ring-1 ring-amber-600 text-stone-900'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <CalendarCheck className={`w-3.5 h-3.5 ${newBizCommerceMode === 'booking' ? 'text-amber-600' : 'text-stone-400'}`} />
                        <span className={`w-2 h-2 rounded-full ${newBizCommerceMode === 'booking' ? 'bg-amber-600' : 'bg-stone-300'}`} />
                      </div>
                      <div>
                        <span className="font-bold text-xs block">Only Booking</span>
                        <span className="text-[10px] text-stone-500 block leading-tight">Appointments only</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewBizCommerceMode('cart')}
                      className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                        newBizCommerceMode === 'cart'
                          ? 'bg-amber-50 border-amber-600 ring-1 ring-amber-600 text-stone-900'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <ShoppingBag className={`w-3.5 h-3.5 ${newBizCommerceMode === 'cart' ? 'text-amber-600' : 'text-stone-400'}`} />
                        <span className={`w-2 h-2 rounded-full ${newBizCommerceMode === 'cart' ? 'bg-amber-600' : 'bg-stone-300'}`} />
                      </div>
                      <div>
                        <span className="font-bold text-xs block">Only Cart</span>
                        <span className="text-[10px] text-stone-500 block leading-tight">Shopping cart only</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewBizCommerceMode('both')}
                      className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                        newBizCommerceMode === 'both'
                          ? 'bg-amber-50 border-amber-600 ring-1 ring-amber-600 text-stone-900'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Layers className={`w-3.5 h-3.5 ${newBizCommerceMode === 'both' ? 'text-amber-600' : 'text-stone-400'}`} />
                        <span className={`w-2 h-2 rounded-full ${newBizCommerceMode === 'both' ? 'bg-amber-600' : 'bg-stone-300'}`} />
                      </div>
                      <div>
                        <span className="font-bold text-xs block">Both (Full Mall)</span>
                        <span className="text-[10px] text-stone-500 block leading-tight">Booking & online cart</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 6 Mini Website Styles Selector */}
                <div className="space-y-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-stone-800 text-xs flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-amber-600" />
                      <span>Mini Website Theme Style (Choose from 6 Styles) *</span>
                    </label>
                    <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      Platform Exclusive
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mb-2">
                    Select one of the 6 curated visual identities and typography palettes for this merchant's dedicated mini-website.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {websiteStylesList.map((st) => {
                      const isSelected = newBizWebsiteStyle === st.id;
                      return (
                        <div
                          key={st.id}
                          onClick={() => setNewBizWebsiteStyle(st.id)}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-50/90 border-amber-600 ring-1 ring-amber-600 text-stone-900 shadow-xs'
                              : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="font-bold text-xs truncate">{st.name}</span>
                            <div className="flex items-center gap-0.5 shrink-0">
                              {st.previewColors.map((col, idx) => (
                                <span key={idx} className={`w-2.5 h-2.5 rounded-full ${col} border border-black/10`} />
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] text-stone-500 block line-clamp-2 leading-tight">
                            {st.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Storefront Quick Search Button Toggle */}
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center justify-between gap-4">
                  <div>
                    <label className="block font-bold text-stone-800 text-xs flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-amber-600" />
                      <span>Storefront Quick Search Button</span>
                    </label>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Enable an interactive live search bar on the merchant's mini website to filter catalog items and services in real-time.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewBizHasQuickSearch(!newBizHasQuickSearch)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      newBizHasQuickSearch
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                    }`}
                  >
                    {newBizHasQuickSearch ? 'Quick Search: Enabled' : 'Quick Search: Disabled'}
                  </button>
                </div>

                {/* Photos from Internal Storage */}
                <div className="pt-2 border-t border-stone-200 space-y-3">
                  <h4 className="font-semibold text-stone-800 text-xs">
                    Branding & Photos (Select from Device Storage)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <StorageImageUpload
                      label="Store Logo Photo"
                      value={newBizLogo}
                      onChange={setNewBizLogo}
                      aspectRatio="square"
                      helperText="Pick logo file from device"
                    />
                    <StorageImageUpload
                      label="Store Cover Banner"
                      value={newBizCover}
                      onChange={setNewBizCover}
                      aspectRatio="banner"
                      helperText="Pick storefront banner from device"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">Tier:</span>
                    <select
                      value={newBizTier}
                      onChange={(e) => setNewBizTier(e.target.value as 'free' | 'business' | 'premium')}
                      aria-label="Select Plan Tier"
                      className="px-2 py-1 bg-stone-50 border border-stone-200 rounded font-semibold text-stone-900"
                    >
                      <option value="business">Business Tier (Recommended)</option>
                      <option value="premium">Premium Mall Partner</option>
                      <option value="free">Starter Free Tier</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBusinessModal(false)}
                      className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingBiz}
                      className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      {isCreatingBiz ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Creating Store...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-amber-400" />
                          <span>Create Business Store</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
