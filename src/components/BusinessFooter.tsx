import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  ArrowUpRight,
  Store,
  Sparkles,
} from 'lucide-react';
import { Business } from '../types/index.ts';

interface BusinessFooterProps {
  business: Business;
  onOpenDashboard?: () => void;
  onBackToMall?: () => void;
}

export const BusinessFooter: React.FC<BusinessFooterProps> = ({
  business,
  onOpenDashboard,
  onBackToMall,
}) => {
  const currentYear = new Date().getFullYear();
  const isFashionOrBeauty =
    business.categorySlug === 'fashion-clothing' ||
    business.categorySlug === 'beauty-wellness' ||
    (business.products && business.products.length > 0);

  return (
    <footer className="mt-16 bg-stone-900 text-stone-300 border-t-2 border-amber-600/30">
      {/* Top Banner with Merchant Branding */}
      <div className="bg-stone-950/70 border-b border-stone-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <img
              src={business.logo}
              alt={business.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500/40 bg-white"
            />
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-serif font-bold text-xl text-white">
                  {business.name}
                </span>
                {business.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Verified Merchant</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {business.tagline || `${business.category} in ${business.city}, Malawi`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(business.name)},%20I%20saw%20your%20shop%20on%20SuperMall.`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Business</span>
              </a>
            )}

            <a
              href={`tel:${business.phone}`}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{business.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Business Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Store Bio */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wider">
              About {business.name}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              {business.description.length > 180
                ? `${business.description.slice(0, 180)}...`
                : business.description}
            </p>
            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 bg-stone-800/80 rounded border border-stone-700/60 text-[11px] text-amber-300 font-mono">
                Store ID: {business.id} • {business.city}, Malawi
              </span>
            </div>
          </div>

          {/* Column 2: Physical Location & Shop Directions */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Physical Location</span>
            </h4>
            <div className="text-xs text-stone-300 space-y-1">
              <p className="font-semibold text-white">{business.location}</p>
              <p className="text-stone-400">{business.city}, Malawi</p>
            </div>
            <div className="text-xs text-stone-400 space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <a href={`mailto:${business.email}`} className="hover:text-amber-300 transition-colors">
                  {business.email}
                </a>
              </div>
              {business.customDomain && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                  <span className="text-stone-300">www.{business.customDomain}</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Hours & Offerings */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Opening Hours</span>
            </h4>
            <div className="text-xs text-stone-400 space-y-1">
              {business.openingHours && business.openingHours.length > 0 ? (
                business.openingHours.slice(0, 5).map((oh, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-300">{oh.day}</span>
                    <span className={oh.closed ? 'text-rose-400' : 'text-stone-400 font-mono'}>
                      {oh.closed ? 'Closed' : `${oh.open} - ${oh.close}`}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400">Monday - Saturday: 08:30 - 18:00</p>
              )}
            </div>
            {isFashionOrBeauty && (
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Online Cart & Local Delivery Available</span>
                </span>
              </div>
            )}
          </div>

          {/* Column 4: Store Staff & Merchant Access */}
          <div className="space-y-3 bg-stone-950/40 p-4 rounded-xl border border-stone-800">
            <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-4 h-4 text-amber-400" />
              <span>Merchant & Staff Portal</span>
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Store owner or authorized staff? Access inventory management, post new products, and track customer orders.
            </p>
            {onOpenDashboard && (
              <button
                onClick={onOpenDashboard}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Staff & Admin Panel</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onBackToMall && (
              <button
                onClick={onBackToMall}
                className="w-full text-center text-[11px] text-stone-400 hover:text-white transition-colors"
              >
                ← Back to SuperMall Directory
              </button>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright Specific to Business */}
        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>
            © {currentYear} <strong className="text-stone-300 font-semibold">{business.name}</strong>. All rights reserved. Registered Merchant on SuperMall Malawi.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy & Store Policy</span>
            <span>•</span>
            <span>Customer Care</span>
            <span>•</span>
            <span className="text-amber-500/80 font-mono">Malawi Kwacha (MWK)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
