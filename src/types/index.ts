export type City = 'Blantyre' | 'Lilongwe' | 'Mzuzu' | 'Zomba';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  durationMinutes: number;
  category: string;
  popular?: boolean;
  image?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  category: string;
  image: string;
  stock: number;
  sku?: string;
  sizes?: string[];
  inStock: boolean;
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  caption?: string;
}

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export type BusinessStatus = 'active' | 'pending_verification' | 'suspended';
export type BusinessTier = 'free' | 'business' | 'premium';
export type CommerceMode = 'booking' | 'cart' | 'both';
export type WebsiteStyle = 
  | 'warm_earth'      // African Warm Earth: Terracotta, Amber, Artisanal serif feel
  | 'modern_minimal'  // Modern Minimalist: Monochrome Slate & Stark Clean Sans
  | 'vibrant_market'  // Vibrant Market: Emerald Green & Gold, high-energy badges
  | 'luxury_noir'     // Luxury Noir: Deep Obsidian Black, Champagne Gold accents
  | 'pastel_boutique' // Pastel Boutique: Soft Rose Blush & Gentle Curvature
  | 'cyber_tech';     // Cyber Tech: Cool Slate/Indigo with Electric Neon Accents

export interface TestimonialItem {
  id: string;
  author: string;
  role?: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  serviceUsed?: string;
}

export interface Business {
  id: string;
  ownerId?: string;
  ownerEmail?: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  tagline: string;
  description: string;
  location: string;
  city: City;
  phone: string;
  email: string;
  whatsapp?: string;
  website?: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
  status: BusinessStatus;
  commerceMode?: CommerceMode;
  websiteStyle?: WebsiteStyle;
  hasQuickSearch?: boolean;
  openingHours: OpeningHour[];
  services: ServiceItem[];
  products?: ProductItem[];
  gallery?: GalleryItem[];
  testimonials?: TestimonialItem[];
  about?: string;
  amenities?: string[];
  tier: BusinessTier;
  customDomain?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  image: string;
  businessCount?: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';

export interface Booking {
  id: string;
  bookingRef: string;
  businessId: string;
  businessName: string;
  businessSlug?: string;
  serviceId: string;
  serviceName: string;
  price: number;
  servicePrice?: number;
  currency?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  customerMessage?: string;
  date: string;
  bookingDate?: string;
  timeSlot: string;
  bookingTime?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  selectedSize?: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled';
export type PaymentMethod = 'airtel_money' | 'tnm_mpamba' | 'cash_on_delivery';

export interface Order {
  id: string;
  orderRef: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    selectedSize?: string;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryOption: 'pickup' | 'delivery';
  deliveryAddress?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  businessId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  serviceUsed?: string;
  verified?: boolean;
}

export interface SuperMallUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  phone?: string;
  role: 'admin' | 'business_owner' | 'customer';
  businessId?: string;
  createdAt?: string;
}

export type ActiveView = 
  | { type: 'home' }
  | { type: 'explore'; categorySlug?: string; initialCategorySlug?: string; initialCity?: City; city?: City; initialSearch?: string; search?: string }
  | { type: 'business_site'; slug: string; subTab?: string }
  | { type: 'minisite'; slug: string; subTab?: string }
  | { type: 'business_dashboard'; businessId?: string; subTab?: string }
  | { type: 'admin'; subTab?: 'dashboard' | 'businesses' | 'categories' | 'bookings' | 'users' | 'reports' };
  | { type: 'about' }
  | { type: 'help' }
  | { type: 'faqs' }
  | { type: 'shipping_returns' }
  | { type: 'report_issue' }
