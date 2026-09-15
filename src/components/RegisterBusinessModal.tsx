import React, { useState } from 'react';
import {
  X,
  Store,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  CheckCircle2,
  Building2,
  CalendarCheck,
  ShoppingBag,
  Layers,
  Palette,
  Search,
} from 'lucide-react';
import { Business, Category, City, CommerceMode, WebsiteStyle } from '../types/index.ts';
import { slugify } from '../utils/formatters.ts';
import { StorageImageUpload } from './StorageImageUpload.tsx';

interface RegisterBusinessModalProps {
  isOpen: boolean;
  categories: Category[];
  onClose: () => void;
  onRegister: (businessData: Omit<Business, 'id'>) => Promise<string>;
}

export const RegisterBusinessModal: React.FC<RegisterBusinessModalProps> = ({
  isOpen,
  categories,
  onClose,
  onRegister,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || 'barber-shops');
  const [city, setCity] = useState<City>('Blantyre');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('+265 ');
  const [email, setEmail] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [commerceMode, setCommerceMode] = useState<CommerceMode>('both');
  const [websiteStyle, setWebsiteStyle] = useState<WebsiteStyle>('warm_earth');
  const [hasQuickSearch, setHasQuickSearch] = useState<boolean>(true);
  const [logo, setLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

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

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedCategory = categories.find((c) => c.slug === categorySlug) || categories[0];

      const newBiz: Omit<Business, 'id'> = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        category: selectedCategory.name,
        categorySlug: selectedCategory.slug,
        tagline: tagline.trim() || 'Premier services in ' + city,
        description: description.trim() || `Welcome to ${name.trim()}, your trusted local merchant in ${city}.`,
        about: `Established to offer the highest quality service in ${city}. We welcome you to experience our hospitality and dedicated craftsmanship.`,
        logo: logo || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&q=80',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80',
        city,
        location: location.trim(),
        phone: phone.trim(),
        email: email.trim() || `${slugify(name)}@supermall.mw`,
        whatsapp: phone.trim(),
        rating: 5.0,
        reviewCount: 1,
        verified: true,
        featured: false,
        status: 'active',
        commerceMode,
        websiteStyle,
        hasQuickSearch,
        tier: 'free',
        amenities: ['Customer Waiting Area', 'Mobile Money Payments', 'Clean Environment'],
        testimonials: [
          {
            id: `test-${Date.now()}-1`,
            author: 'Chifundo Banda',
            role: 'First Verified Customer',
            rating: 5,
            comment: `Outstanding experience with ${name.trim()}! Fast service and top notch quality.`,
            date: 'Just now',
            serviceUsed: 'Initial Consultation',
          },
        ],
        openingHours: [
          { day: 'Monday', open: '08:00', close: '18:00', closed: false },
          { day: 'Tuesday', open: '08:00', close: '18:00', closed: false },
          { day: 'Wednesday', open: '08:00', close: '18:00', closed: false },
          { day: 'Thursday', open: '08:00', close: '18:00', closed: false },
          { day: 'Friday', open: '08:00', close: '18:00', closed: false },
          { day: 'Saturday', open: '08:30', close: '18:00', closed: false },
          { day: 'Sunday', open: '10:00', close: '16:00', closed: false },
        ],
        services:
          commerceMode === 'cart'
            ? []
            : [
                {
                  id: `svc-${Date.now()}-1`,
                  name: 'Standard Consultation / Service',
                  price: 5000,
                  currency: 'MWK',
                  durationMinutes: 30,
                  category: selectedCategory.name,
                  description: 'Comprehensive initial service session.',
                  popular: true,
                },
                {
                  id: `svc-${Date.now()}-2`,
                  name: 'Premium Deluxe Package',
                  price: 12000,
                  currency: 'MWK',
                  durationMinutes: 60,
                  category: selectedCategory.name,
                  description: 'Full-service luxury experience with customized care.',
                  popular: false,
                },
              ],
        products:
          commerceMode === 'booking'
            ? []
            : [
                {
                  id: `prod-${Date.now()}-1`,
                  name: `${name.trim()} Signature Item`,
                  description: 'Premium quality merchandise with customer cart checkout.',
                  price: 18500,
                  currency: 'MWK',
                  category: selectedCategory.name,
                  image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
                  stock: 12,
                  inStock: true,
                  featured: true,
                },
              ],
        gallery: [
          {
            id: `img-${Date.now()}-1`,
            url: coverImage || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
            title: 'Store Front',
            caption: 'Our welcoming reception & lounge',
          },
        ],
      };

      const newId = await onRegister(newBiz);
      setSuccessId(newId);
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-xl w-full overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base">
                List Your Business on SuperMall
              </h3>
              <p className="text-[11px] text-stone-300">
                Independent mini-website with isolated merchant controls
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-serif font-bold text-stone-900">
              Welcome to SuperMall!
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
              Your business <strong>{name}</strong> is registered. Your mini-website route is <code>/s/{slug}</code> and your isolated dashboard is ready.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl"
            >
              Open Business Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
            {/* Capability / Commerce Mode Selector */}
            <div className="space-y-1.5 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <label className="block font-bold text-stone-900 text-xs">
                Select Store Capability <span className="text-amber-600">*</span>
              </label>
              <p className="text-[11px] text-stone-500 mb-2">
                Choose whether your store offers appointment booking only, product cart checkout only, or both.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCommerceMode('booking')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    commerceMode === 'booking'
                      ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-600/20'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CalendarCheck className={`w-4 h-4 ${commerceMode === 'booking' ? 'text-amber-600' : 'text-stone-500'}`} />
                    <span className={`w-2 h-2 rounded-full ${commerceMode === 'booking' ? 'bg-amber-600' : 'bg-stone-300'}`} />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-xs">Only Booking</span>
                    <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">
                      Appointments & consultations (e.g. Barbers, Salons)
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCommerceMode('cart')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    commerceMode === 'cart'
                      ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-600/20'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <ShoppingBag className={`w-4 h-4 ${commerceMode === 'cart' ? 'text-amber-600' : 'text-stone-500'}`} />
                    <span className={`w-2 h-2 rounded-full ${commerceMode === 'cart' ? 'bg-amber-600' : 'bg-stone-300'}`} />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-xs">Only Cart</span>
                    <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">
                      Shopping bag & item purchases (e.g. Boutiques, Stores)
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCommerceMode('both')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    commerceMode === 'both'
                      ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-600/20'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Layers className={`w-4 h-4 ${commerceMode === 'both' ? 'text-amber-600' : 'text-stone-500'}`} />
                    <span className={`w-2 h-2 rounded-full ${commerceMode === 'both' ? 'bg-amber-600' : 'bg-stone-300'}`} />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-xs">Both (Full Mall)</span>
                    <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">
                      Both appointments and online shopping enabled
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* 6 Mini-Website Styles Selection */}
            <div className="space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-600" />
                  <label className="block font-bold text-stone-800 text-xs">
                    Choose Mini-Website Design Theme (6 Distinct Styles)
                  </label>
                </div>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  Tailored Aesthetic
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Select the visual archetype for this business’s public mini-website storefront.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {websiteStylesList.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setWebsiteStyle(style.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                      websiteStyle === style.id
                        ? 'bg-white border-amber-600 ring-2 ring-amber-600/25 shadow-xs'
                        : 'bg-white/80 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1">
                          {style.previewColors.map((colorClass, idx) => (
                            <span
                              key={idx}
                              className={`w-3.5 h-3.5 rounded-full border border-white shadow-xs ${colorClass}`}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-stone-900 text-xs">{style.name}</span>
                      </div>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          websiteStyle === style.id ? 'bg-amber-600' : 'bg-stone-300'
                        }`}
                      />
                    </div>
                    <p className="text-[10px] text-stone-500 leading-snug">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Search Button Selection */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 text-xs">Enable Quick Search Filter Button</h4>
                  <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                    Adds an instant search bar on the public mini-site header so customers can quickly find services or products.
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-white border border-stone-200 rounded-lg p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setHasQuickSearch(true)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                    hasQuickSearch
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Enabled
                </button>
                <button
                  type="button"
                  onClick={() => setHasQuickSearch(false)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                    !hasQuickSearch
                      ? 'bg-stone-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Disabled
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Business Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Glow Beauty Salon"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Custom Mall URL Route</label>
              <div className="flex items-center bg-stone-100 border border-stone-200 rounded-lg px-3 py-2 text-stone-500 font-mono text-xs">
                <span>supermall.mw/s/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className="bg-transparent text-stone-900 font-bold focus:outline-none flex-1 ml-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Category</label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  aria-label="Category"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as City)}
                  aria-label="City"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 cursor-pointer"
                >
                  <option value="Blantyre">Blantyre</option>
                  <option value="Lilongwe">Lilongwe</option>
                  <option value="Mzuzu">Mzuzu</option>
                  <option value="Zomba">Zomba</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Physical Location / Shop Address</label>
              <input
                type="text"
                required
                placeholder="e.g. Unit 12, Victoria Avenue, Blantyre"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+265 99 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="contact@business.mw"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">One-line Tagline</label>
              <input
                type="text"
                placeholder="e.g. Modern haircuts, beard care, and luxury treatments"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
              />
            </div>

            {/* Photos from Internal Storage */}
            <div className="pt-2 border-t border-stone-200 space-y-3">
              <h4 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wider">
                Store Photos (Select from Device Storage)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <StorageImageUpload
                  label="Store Logo Photo"
                  value={logo}
                  onChange={setLogo}
                  aspectRatio="square"
                  helperText="Choose brand logo from device files"
                />

                <StorageImageUpload
                  label="Store Cover Banner Photo"
                  value={coverImage}
                  onChange={setCoverImage}
                  aspectRatio="banner"
                  helperText="Choose storefront banner from device files"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Launch Mini-Website'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
