import React, { useState } from 'react';
import {
  Store,
  LayoutDashboard,
  Calendar,
  DollarSign,
  Clock,
  Camera,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Globe,
  Save,
  Check,
  UserCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  RefreshCw,
  Package,
  ShoppingBag,
  CalendarCheck,
  Layers,
  Lock,
} from 'lucide-react';
import {
  Business,
  Booking,
  ServiceItem,
  GalleryItem,
  OpeningHour,
  BookingStatus,
  Order,
  OrderStatus,
  ProductItem,
  CommerceMode,
} from '../types/index.ts';
import { formatMWK, formatDate } from '../utils/formatters.ts';
import { InventoryManager } from './InventoryManager.tsx';
import { OrderManager } from './OrderManager.tsx';
import { StorageImageUpload } from './StorageImageUpload.tsx';

interface BusinessDashboardProps {
  business: Business;
  bookings: Booking[];
  orders?: Order[];
  onUpdateBusiness: (businessId: string, updates: Partial<Business>) => Promise<void>;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => Promise<void>;
  onViewMiniSite: (slug: string) => void;
  onSwitchBusiness?: (bizId: string) => void;
  allBusinesses?: Business[];
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  business,
  bookings,
  orders = [],
  onUpdateBusiness,
  onUpdateBookingStatus,
  onUpdateOrderStatus,
  onViewMiniSite,
  onSwitchBusiness,
  allBusinesses = [],
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'inventory' | 'orders' | 'bookings' | 'services' | 'profile' | 'hours' | 'gallery' | 'domains'
  >('overview');

  // Business profile form state
  const [name, setName] = useState(business.name);
  const [tagline, setTagline] = useState(business.tagline);
  const [description, setDescription] = useState(business.description);
  const [about, setAbout] = useState(business.about || '');
  const [location, setLocation] = useState(business.location);
  const [city, setCity] = useState(business.city);
  const [phone, setPhone] = useState(business.phone);
  const [email, setEmail] = useState(business.email);
  const [whatsapp, setWhatsapp] = useState(business.whatsapp || '');
  const [logo, setLogo] = useState(business.logo);
  const [coverImage, setCoverImage] = useState(business.coverImage);
  const [commerceMode, setCommerceMode] = useState<CommerceMode>(business.commerceMode || 'both');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Service modal / form state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(5000);
  const [newServiceDuration, setNewServiceDuration] = useState<number>(30);
  const [newServiceCategory, setNewServiceCategory] = useState(business.category);
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [newServiceImage, setNewServiceImage] = useState('');
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);

  // Edit Service State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editServiceName, setEditServiceName] = useState('');
  const [editServicePrice, setEditServicePrice] = useState<number>(5000);
  const [editServiceDuration, setEditServiceDuration] = useState<number>(30);
  const [editServiceCategory, setEditServiceCategory] = useState('');
  const [editServiceDescription, setEditServiceDescription] = useState('');
  const [editServiceImage, setEditServiceImage] = useState('');

  // Gallery form state
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [showAddImageForm, setShowAddImageForm] = useState(false);

  // Filter bookings strictly by THIS business ID
  const businessBookings = bookings.filter((b) => b.businessId === business.id);

  const pendingBookings = businessBookings.filter((b) => b.status === 'pending');
  const confirmedBookings = businessBookings.filter((b) => b.status === 'confirmed');
  const completedBookings = businessBookings.filter((b) => b.status === 'completed');

  // Estimated gross revenue from completed/confirmed bookings
  const estimatedRevenue = businessBookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, b) => acc + (b.price || 0), 0);

  // Filter orders strictly by THIS business ID
  const businessOrders = orders.filter((o) => o.businessId === business.id);
  const pendingOrders = businessOrders.filter((o) => o.status === 'pending');
  const productsList = business.products || [];
  const productsCount = productsList.length;
  const inStockProductsCount = productsList.filter((p) => p.inStock && p.stock > 0).length;
  const totalOrderSales = businessOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + (o.total || 0), 0);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      // NOTE: commerceMode is strictly omitted here because only Platform Admin can edit capability mode
      await onUpdateBusiness(business.id, {
        name,
        tagline,
        description,
        about,
        location,
        city,
        phone,
        email,
        whatsapp,
        logo,
        coverImage,
      });
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Save profile error:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || newServicePrice <= 0) return;

    const newService: ServiceItem = {
      id: `svc-${Date.now()}`,
      name: newServiceName.trim(),
      price: Number(newServicePrice),
      currency: 'MWK',
      durationMinutes: Number(newServiceDuration),
      category: newServiceCategory,
      description: newServiceDescription.trim() || 'Professional service at our studio.',
      image: newServiceImage.trim() || undefined,
      popular: false,
    };

    const updatedServices = [...business.services, newService];
    await onUpdateBusiness(business.id, { services: updatedServices });

    setNewServiceName('');
    setNewServicePrice(5000);
    setNewServiceDuration(30);
    setNewServiceDescription('');
    setNewServiceImage('');
    setShowAddServiceForm(false);
  };

  const handleStartEditService = (service: ServiceItem) => {
    setEditingService(service);
    setEditServiceName(service.name);
    setEditServicePrice(service.price);
    setEditServiceDuration(service.durationMinutes);
    setEditServiceCategory(service.category);
    setEditServiceDescription(service.description);
    setEditServiceImage(service.image || '');
  };

  const handleSaveEditedService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editServiceName.trim() || editServicePrice <= 0) return;

    const updatedServices = business.services.map((s) => {
      if (s.id === editingService.id) {
        return {
          ...s,
          name: editServiceName.trim(),
          price: Number(editServicePrice),
          durationMinutes: Number(editServiceDuration),
          category: editServiceCategory.trim() || business.category,
          description: editServiceDescription.trim(),
          image: editServiceImage.trim() || undefined,
        };
      }
      return s;
    });

    await onUpdateBusiness(business.id, { services: updatedServices });
    setEditingService(null);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to remove this service?')) return;
    const updated = business.services.filter((s) => s.id !== serviceId);
    await onUpdateBusiness(business.id, { services: updated });
  };

  const handleTogglePopular = async (serviceId: string) => {
    const updated = business.services.map((s) =>
      s.id === serviceId ? { ...s, popular: !s.popular } : s
    );
    await onUpdateBusiness(business.id, { services: updated });
  };

  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    const newItem: GalleryItem = {
      id: `img-${Date.now()}`,
      url: newImageUrl.trim(),
      title: newImageTitle.trim() || 'Portfolio Item',
      caption: newImageCaption.trim(),
    };

    const updatedGallery = [...(business.gallery || []), newItem];
    await onUpdateBusiness(business.id, { gallery: updatedGallery });

    setNewImageUrl('');
    setNewImageTitle('');
    setNewImageCaption('');
    setShowAddImageForm(false);
  };

  const handleDeleteGalleryImage = async (imageId: string) => {
    const updated = (business.gallery || []).filter((g) => g.id !== imageId);
    await onUpdateBusiness(business.id, { gallery: updated });
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Business Dashboard Header */}
      <div className="bg-stone-900 text-white border-b border-stone-800 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={business.logo}
              alt={business.name}
              className="w-10 h-10 rounded-xl object-cover border-2 border-white/20 bg-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg text-white">
                  {business.name}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {business.status}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  (business.commerceMode || 'both') === 'booking'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : (business.commerceMode || 'both') === 'cart'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}>
                  {(business.commerceMode || 'both') === 'booking' ? 'Booking Only' : (business.commerceMode || 'both') === 'cart' ? 'Cart Only' : 'Booking & Cart'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                  ID: {business.id}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Isolated Business Dashboard • {business.city}, Malawi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Switcher between seeded businesses for testing */}
            {allBusinesses.length > 1 && onSwitchBusiness && (
              <div className="flex items-center gap-1.5 bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-700 text-xs">
                <span className="text-stone-400 hidden sm:inline">Switch Store:</span>
                <select
                  value={business.id}
                  onChange={(e) => onSwitchBusiness(e.target.value)}
                  aria-label="Switch Business Store"
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
                >
                  {allBusinesses.map((b) => (
                    <option key={b.id} value={b.id} className="bg-stone-900 text-white">
                      {b.name} ({b.category})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => onViewMiniSite(business.slug)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Mini-Site</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout (Navigation Tabs + Content) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm mb-6 p-1 flex space-x-1 overflow-x-auto text-xs sm:text-sm font-semibold text-stone-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* Inventory Tab */}
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4 text-amber-500" />
            <span>Inventory ({productsCount})</span>
            {inStockProductsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px]">
                {inStockProductsCount}
              </span>
            )}
          </button>

          {/* Customer Orders Tab */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
            <span>Orders ({businessOrders.length})</span>
            {pendingOrders.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings</span>
            {pendingBookings.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                {pendingBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Services & Prices ({business.services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Shop Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Gallery</span>
          </button>

          <button
            onClick={() => setActiveTab('domains')}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'domains'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Domain & Tiers</span>
          </button>
        </div>

        {/* =========================================================
            TAB 1: OVERVIEW
        ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                  Total Bookings
                </span>
                <p className="text-3xl font-bold font-serif text-stone-900 mt-2">
                  {businessBookings.length}
                </p>
                <span className="text-xs text-stone-500 mt-1 block">
                  Strictly isolated to {business.name}
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
                  Pending Approval
                </span>
                <p className="text-3xl font-bold font-serif text-amber-600 mt-2">
                  {pendingBookings.length}
                </p>
                <span className="text-xs text-stone-500 mt-1 block">
                  Awaiting your confirmation
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                  Confirmed / Completed
                </span>
                <p className="text-3xl font-bold font-serif text-emerald-600 mt-2">
                  {confirmedBookings.length + completedBookings.length}
                </p>
                <span className="text-xs text-stone-500 mt-1 block">
                  Active customer appointments
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                  Estimated Gross Volume
                </span>
                <p className="text-2xl font-bold font-serif text-stone-900 mt-2">
                  {formatMWK(estimatedRevenue)}
                </p>
                <span className="text-xs text-emerald-600 font-medium mt-1 block">
                  0% SuperMall Commission Fee
                </span>
              </div>
            </div>

            {/* Quick Staff Actions & Inventory Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm">Shop Inventory</h4>
                    <p className="text-xs text-stone-600">
                      {productsCount} products • {inStockProductsCount} available for cart purchase
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Manage Inventory →
                </button>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm">Customer Bag Orders</h4>
                    <p className="text-xs text-stone-600">
                      {businessOrders.length} orders received • {formatMWK(totalOrderSales)} volume
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Fulfill Orders →
                </button>
              </div>
            </div>

            {/* Recent Bookings Queue */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Latest Appointments Queue
                  </h3>
                  <p className="text-xs text-stone-500">
                    Real-time bookings from customers for {business.name}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                >
                  Manage All Bookings →
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {businessBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{booking.customerName}</span>
                        <span className="font-mono text-stone-400">({booking.bookingRef})</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            booking.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : booking.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : booking.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-stone-600 mt-0.5">
                        <strong>{booking.serviceName}</strong> ({formatMWK(booking.price)}) •{' '}
                        <span>{booking.date} at {booking.timeSlot}</span>
                      </p>
                      <p className="text-stone-400 mt-0.5">
                        Phone: <span className="text-stone-700">{booking.customerPhone}</span>
                        {booking.notes && <span className="ml-2 italic">"{booking.notes}"</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onUpdateBookingStatus(booking.id, 'confirmed')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>
                          <button
                            onClick={() => onUpdateBookingStatus(booking.id, 'rejected')}
                            className="px-3 py-1.5 bg-stone-200 hover:bg-rose-100 hover:text-rose-700 text-stone-700 font-semibold rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => onUpdateBookingStatus(booking.id, 'completed')}
                          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB: INVENTORY & STOCK MANAGEMENT
        ========================================================= */}
        {activeTab === 'inventory' && (
          <InventoryManager
            businessId={business.id}
            businessName={business.name}
            businessCategory={business.category}
            products={business.products || []}
            onSaveProducts={async (updatedProducts) => {
              await onUpdateBusiness(business.id, { products: updatedProducts });
            }}
          />
        )}

        {/* =========================================================
            TAB: CUSTOMER CART ORDERS
        ========================================================= */}
        {activeTab === 'orders' && (
          <OrderManager
            businessId={business.id}
            businessName={business.name}
            orders={orders}
            onUpdateOrderStatus={onUpdateOrderStatus || (async () => {})}
          />
        )}

        {/* =========================================================
            TAB: BOOKINGS MANAGEMENT
        ========================================================= */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-200">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Customer Appointments & Bookings
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Data Isolation Enforced: Only viewing bookings belonging to Business ID:{' '}
                <strong className="text-stone-800 font-mono">{business.id}</strong>
              </p>
            </div>

            {businessBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                    <tr>
                      <th className="px-6 py-3">Ref / Created</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Service & Price</th>
                      <th className="px-6 py-3">Date & Time</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {businessBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/60">
                        <td className="px-6 py-4 font-mono font-bold text-stone-800">
                          {b.bookingRef}
                          <span className="block text-[10px] text-stone-400 font-normal">
                            {formatDate(b.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-stone-900 block">{b.customerName}</span>
                          <span className="text-stone-500 block">{b.customerPhone}</span>
                          {b.notes && (
                            <span className="text-[10px] text-amber-700 italic block mt-0.5">
                              Note: {b.notes}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-stone-900 block">{b.serviceName}</span>
                          <span className="text-amber-800 font-bold">{formatMWK(b.price)}</span>
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
                        <td className="px-6 py-4 text-right space-x-2">
                          {b.status === 'pending' && (
                            <>
                              <button
                                onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => onUpdateBookingStatus(b.id, 'rejected')}
                                className="px-2.5 py-1 bg-stone-200 hover:bg-rose-100 hover:text-rose-700 text-stone-700 rounded font-medium"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'completed')}
                              className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium"
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-stone-500 text-xs">
                No bookings logged yet for this business. Test by booking on your mini-site!
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 3: SERVICES & PRICES
        ========================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Services & Price Menu
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Add, edit, or adjust pricing for all treatments and services offered by {business.name}.
                </p>
              </div>

              <button
                onClick={() => setShowAddServiceForm(!showAddServiceForm)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddServiceForm ? 'Close Form' : 'Add New Service'}</span>
              </button>
            </div>

            {/* Add Service Modal/Form */}
            {showAddServiceForm && (
              <form onSubmit={handleAddService} className="bg-white p-6 rounded-xl border border-amber-300 shadow-md space-y-4 text-xs">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  New Service Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Service Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hot Towel Beard Trim"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Price (MWK)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      required
                      min={5}
                      step={5}
                      value={newServiceDuration}
                      onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Category Tag</label>
                    <input
                      type="text"
                      required
                      value={newServiceCategory}
                      onChange={(e) => setNewServiceCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <StorageImageUpload
                    label="Service Photo (Select from Device Storage)"
                    value={newServiceImage}
                    onChange={setNewServiceImage}
                    aspectRatio="square"
                    helperText="Optional photo showing this service"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short description of what the service includes..."
                    value={newServiceDescription}
                    onChange={(e) => setNewServiceDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddServiceForm(false)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            )}

            {/* Edit Service Modal */}
            {editingService && (
              <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4 my-8">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-stone-900">
                        Edit Service & Pricing
                      </h3>
                      <p className="text-xs text-stone-500">
                        Modify name, pricing, duration, description, and photo.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditedService} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Service Name</label>
                        <input
                          type="text"
                          required
                          value={editServiceName}
                          onChange={(e) => setEditServiceName(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Price (MWK)</label>
                        <input
                          type="number"
                          required
                          min={0}
                          step={500}
                          value={editServicePrice}
                          onChange={(e) => setEditServicePrice(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Duration (Minutes)</label>
                        <input
                          type="number"
                          required
                          min={5}
                          step={5}
                          value={editServiceDuration}
                          onChange={(e) => setEditServiceDuration(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Category Tag</label>
                        <input
                          type="text"
                          required
                          value={editServiceCategory}
                          onChange={(e) => setEditServiceCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <StorageImageUpload
                        label="Service Photo (Select from Device Storage)"
                        value={editServiceImage}
                        onChange={setEditServiceImage}
                        aspectRatio="square"
                        helperText="Upload or change the photo for this service"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={editServiceDescription}
                        onChange={(e) => setEditServiceDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setEditingService(null)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>Update Service</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* List of current services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-amber-200 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-16 h-16 rounded-lg object-cover border border-stone-200 bg-stone-100 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 text-stone-400">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-stone-900 text-base truncate">{service.name}</h4>
                        <span className="text-base font-bold text-amber-800 shrink-0">{formatMWK(service.price)}</span>
                      </div>

                      <p className="text-xs text-stone-500 mb-1.5">
                        Duration: <strong>{service.durationMinutes} mins</strong> • Category: {service.category}
                      </p>
                      <p className="text-xs text-stone-600 line-clamp-2">{service.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleTogglePopular(service.id)}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                        service.popular
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {service.popular ? '★ Popular Service' : 'Mark as Popular'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEditService(service)}
                        className="px-2.5 py-1 text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                        title="Edit Service Name, Price, and Photo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: SHOP PROFILE
        ========================================================= */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-sm space-y-6 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Business Information & Branding
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update your public brand identity displayed on {business.slug}.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile'}</span>
              </button>
            </div>

            {profileSaveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Business profile updated successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tagline / Slogan</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as any)}
                  aria-label="City"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                >
                  <option value="Blantyre">Blantyre</option>
                  <option value="Lilongwe">Lilongwe</option>
                  <option value="Mzuzu">Mzuzu</option>
                  <option value="Zomba">Zomba</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Physical Address / Mall Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>
            </div>

            {/* Store Capability Mode - Platform Admin Restricted */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <label className="block font-bold text-stone-800 text-xs">
                    Business Capability Mode (Platform Admin Managed)
                  </label>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Read-Only For Business Admin
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                To guarantee correct customer checkout routing and merchant compliance across SuperMall, capability mode is exclusively provisioned by the SuperMall Platform Admin.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div
                  className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    (business.commerceMode || 'both') === 'booking'
                      ? 'bg-amber-50/80 border-amber-600 ring-1 ring-amber-600 text-stone-900'
                      : 'bg-white/70 border-stone-200 text-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CalendarCheck className={`w-4 h-4 ${(business.commerceMode || 'both') === 'booking' ? 'text-amber-600' : 'text-stone-300'}`} />
                    {(business.commerceMode || 'both') === 'booking' ? (
                      <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded">Active</span>
                    ) : (
                      <Lock className="w-3 h-3 text-stone-300" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs block">Only Booking</span>
                    <span className="text-[10px] text-stone-500 block leading-tight">Appointment scheduling only</span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    (business.commerceMode || 'both') === 'cart'
                      ? 'bg-amber-50/80 border-amber-600 ring-1 ring-amber-600 text-stone-900'
                      : 'bg-white/70 border-stone-200 text-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <ShoppingBag className={`w-4 h-4 ${(business.commerceMode || 'both') === 'cart' ? 'text-amber-600' : 'text-stone-300'}`} />
                    {(business.commerceMode || 'both') === 'cart' ? (
                      <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded">Active</span>
                    ) : (
                      <Lock className="w-3 h-3 text-stone-300" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs block">Only Cart</span>
                    <span className="text-[10px] text-stone-500 block leading-tight">Shopping cart checkouts only</span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    (business.commerceMode || 'both') === 'both'
                      ? 'bg-amber-50/80 border-amber-600 ring-1 ring-amber-600 text-stone-900'
                      : 'bg-white/70 border-stone-200 text-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Layers className={`w-4 h-4 ${(business.commerceMode || 'both') === 'both' ? 'text-amber-600' : 'text-stone-300'}`} />
                    {(business.commerceMode || 'both') === 'both' ? (
                      <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded">Active</span>
                    ) : (
                      <Lock className="w-3 h-3 text-stone-300" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs block">Both Booking & Cart</span>
                    <span className="text-[10px] text-stone-500 block leading-tight">Complete SuperMall experience</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Photos from Internal Device Storage (Dynamic Logo & Cover) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dynamic Store Branding (Logo & Cover Photo)</span>
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Upload new photos directly from your device storage to dynamically update your storefront in real time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await onUpdateBusiness(business.id, { logo, coverImage });
                    setProfileSaveSuccess(true);
                    setTimeout(() => setProfileSaveSuccess(false), 3000);
                  }}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Photos Now</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StorageImageUpload
                  label="Store Logo Photo (Dynamic)"
                  value={logo}
                  onChange={setLogo}
                  aspectRatio="square"
                  helperText="Choose brand logo from device internal storage"
                />
                <StorageImageUpload
                  label="Store Cover Banner (Dynamic)"
                  value={coverImage}
                  onChange={setCoverImage}
                  aspectRatio="banner"
                  helperText="Choose storefront cover banner from device internal storage"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">About & Story</label>
              <textarea
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
              />
            </div>
          </form>
        )}

        {/* =========================================================
            TAB 5: GALLERY
        ========================================================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Shop Photo Gallery
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Upload and arrange photos of your team, haircuts, designs, and venue.
                </p>
              </div>

              <button
                onClick={() => setShowAddImageForm(!showAddImageForm)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddImageForm ? 'Close' : 'Add Photo'}</span>
              </button>
            </div>

            {showAddImageForm && (
              <form onSubmit={handleAddGalleryImage} className="bg-white p-6 rounded-xl border border-amber-300 shadow-sm space-y-4 text-xs">
                <h3 className="font-serif font-bold text-base text-stone-900">Add Gallery Photo from Device</h3>
                <StorageImageUpload
                  label="Gallery Photo"
                  value={newImageUrl}
                  onChange={setNewImageUrl}
                  aspectRatio="video"
                  required
                  helperText="Choose gallery image from internal device storage (PNG, JPG, WEBP)"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Precision Fade"
                      value={newImageTitle}
                      onChange={(e) => setNewImageTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Caption</label>
                    <input
                      type="text"
                      placeholder="e.g. Master Barber station"
                      value={newImageCaption}
                      onChange={(e) => setNewImageCaption(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddImageForm(false)}
                    className="px-4 py-2 bg-stone-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg"
                  >
                    Add to Gallery
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(business.gallery || []).map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-stone-900">{item.title}</p>
                      {item.caption && <p className="text-stone-500 text-[11px]">{item.caption}</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteGalleryImage(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 6: DOMAINS & TIERS
        ========================================================= */}
        {activeTab === 'domains' && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                SuperMall Domains & Merchant Tiers
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Configure your digital identity across SuperMall's routing architecture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Tier */}
              <div className={`p-5 rounded-xl border ${business.tier === 'free' ? 'border-amber-600 bg-amber-50/20' : 'border-stone-200 bg-stone-50'} space-y-3 text-xs`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900">FREE PLAN</span>
                  {business.tier === 'free' && (
                    <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px]">CURRENT</span>
                  )}
                </div>
                <p className="text-stone-600">Standard subroute inside SuperMall directory.</p>
                <div className="p-2 bg-stone-200/60 rounded font-mono text-stone-800 text-[11px]">
                  supermall.mw/s/{business.slug}
                </div>
                <ul className="space-y-1 text-stone-600 text-[11px]">
                  <li>✓ Full standalone mini-site</li>
                  <li>✓ Unlimited appointment bookings</li>
                  <li>✓ Standard directory listing</li>
                </ul>
              </div>

              {/* Business Tier */}
              <div className={`p-5 rounded-xl border ${business.tier === 'business' ? 'border-amber-600 bg-amber-50/20' : 'border-stone-200 bg-stone-50'} space-y-3 text-xs`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900">BUSINESS PLAN</span>
                  {business.tier === 'business' && (
                    <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px]">CURRENT</span>
                  )}
                </div>
                <p className="text-stone-600">Subdomain brand presence.</p>
                <div className="p-2 bg-stone-200/60 rounded font-mono text-stone-800 text-[11px]">
                  {business.slug}.supermall.mw
                </div>
                <ul className="space-y-1 text-stone-600 text-[11px]">
                  <li>✓ Subdomain routing</li>
                  <li>✓ Priority mall search ranking</li>
                  <li>✓ Verified merchant badge</li>
                </ul>
              </div>

              {/* Premium Tier */}
              <div className={`p-5 rounded-xl border ${business.tier === 'premium' ? 'border-amber-600 bg-amber-50/20' : 'border-stone-200 bg-stone-50'} space-y-3 text-xs`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900">CUSTOM DOMAIN PRO</span>
                  {business.tier === 'premium' && (
                    <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px]">CURRENT</span>
                  )}
                </div>
                <p className="text-stone-600">Fully branded independent domain.</p>
                <div className="p-2 bg-stone-200/60 rounded font-mono text-stone-800 text-[11px]">
                  {business.customDomain || `www.${business.slug}.mw`}
                </div>
                <ul className="space-y-1 text-stone-600 text-[11px]">
                  <li>✓ Connect your own .mw or .com</li>
                  <li>✓ Featured homepage placement</li>
                  <li>✓ Direct SMS notification hooks</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
