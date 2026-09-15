import React from 'react';
import { Star, MapPin, CheckCircle2, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { Business } from '../types/index.ts';
import { formatMWK } from '../utils/formatters.ts';

interface BusinessCardProps {
  business: Business;
  onVisitShop: (slug: string) => void;
  onQuickBook?: (business: Business) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onVisitShop,
  onQuickBook,
}) => {
  const mode = business.commerceMode || 'both';
  const canBook = (mode === 'booking' || mode === 'both') && business.services && business.services.length > 0;
  
  const startingService = business.services && business.services.length > 0
    ? [...business.services].sort((a, b) => a.price - b.price)[0]
    : null;

  const startingProduct = business.products && business.products.length > 0
    ? [...business.products].sort((a, b) => a.price - b.price)[0]
    : null;

  return (
    <div
      id={`business-card-${business.slug}`}
      className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-amber-600/40 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Cover Image & Badges */}
      <div className="relative h-48 bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onVisitShop(business.slug)}>
        <img
          src={business.coverImage}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-black/30"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-900/80 backdrop-blur-md text-white border border-white/10">
            {business.category}
          </span>

          <div className="flex items-center gap-1.5">
            {business.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/90 backdrop-blur-md text-white shadow-sm">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified</span>
              </span>
            )}
            {business.featured && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/90 backdrop-blur-md text-white shadow-sm">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Bottom Bar inside image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <img
              src={business.logo}
              alt={`${business.name} logo`}
              className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-md bg-white"
            />
            <div>
              <p className="text-xs text-stone-200 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{business.city}, Malawi</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-stone-900/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-semibold text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{business.rating.toFixed(1)}</span>
            <span className="text-[10px] text-stone-300 font-normal">({business.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              onClick={() => onVisitShop(business.slug)}
              className="font-bold text-stone-900 text-lg group-hover:text-amber-700 transition-colors cursor-pointer"
            >
              {business.name}
            </h3>
            {business.tier === 'premium' && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                PRO
              </span>
            )}
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
            {business.tagline || business.description}
          </p>

          <p className="text-xs text-stone-500 flex items-center gap-1 mb-4">
            <span className="font-medium text-stone-700">Location:</span> {business.location}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            {mode === 'cart' && startingProduct ? (
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Products from</span>
                <span className="text-sm font-bold text-stone-900">{formatMWK(startingProduct.price)}</span>
              </div>
            ) : startingService ? (
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                  {mode === 'both' && startingProduct ? 'Services from' : 'Services from'}
                </span>
                <span className="text-sm font-bold text-stone-900">{formatMWK(startingService.price)}</span>
              </div>
            ) : startingProduct ? (
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Products from</span>
                <span className="text-sm font-bold text-stone-900">{formatMWK(startingProduct.price)}</span>
              </div>
            ) : (
              <span className="text-xs text-stone-500 font-medium">
                {mode === 'cart' ? 'Products in store' : 'Services available'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {onQuickBook && canBook && (
              <button
                type="button"
                onClick={() => onQuickBook(business)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                title="Book an appointment"
              >
                <Calendar className="w-3.5 h-3.5 text-stone-600" />
                <span>Book</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onVisitShop(business.slug)}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>Visit Shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
