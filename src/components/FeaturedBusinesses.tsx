import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Business } from '../types/index.ts';
import { BusinessCard } from './BusinessCard.tsx';

interface FeaturedBusinessesProps {
  businesses: Business[];
  onVisitShop: (slug: string) => void;
  onViewAll: () => void;
  onQuickBook: (business: Business) => void;
}

export const FeaturedBusinesses: React.FC<FeaturedBusinessesProps> = ({
  businesses,
  onVisitShop,
  onViewAll,
  onQuickBook,
}) => {
  const featured = businesses.filter((b) => b.featured && b.status === 'active');
  const displayList = featured.length > 0 ? featured : businesses.slice(0, 6);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Mall Spotlight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Featured Verified Businesses
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="mt-3 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            <span>Explore All {businesses.length} Businesses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((biz) => (
            <BusinessCard
              key={biz.id}
              business={biz}
              onVisitShop={onVisitShop}
              onQuickBook={onQuickBook}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
