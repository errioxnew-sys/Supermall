import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Store,
  Scissors,
  Shirt,
  Calendar,
  Camera,
  UtensilsCrossed,
  Car,
  Briefcase,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Business, Category, City } from '../types/index.ts';
import { BusinessCard } from './BusinessCard.tsx';

interface ExploreViewProps {
  businesses: Business[];
  categories: Category[];
  initialCategorySlug?: string;
  initialCity?: City;
  initialSearch?: string;
  onVisitShop: (slug: string) => void;
  onQuickBook: (business: Business) => void;
  onBackToHome: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  businesses,
  categories,
  initialCategorySlug,
  initialCity,
  initialSearch,
  onVisitShop,
  onQuickBook,
  onBackToHome,
}) => {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(initialCategorySlug || 'all');
  const [selectedCity, setSelectedCity] = useState<City | 'all'>(initialCity || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'reviews' | 'name'>('recommended');

  const cities: City[] = ['Blantyre', 'Lilongwe', 'Mzuzu', 'Zomba'];

  const selectedCategory = categories.find((c) => c.slug === selectedCategorySlug);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((biz) => {
      // Must be active (or pending if testing)
      if (biz.status === 'suspended') return false;

      // Category filter
      if (selectedCategorySlug !== 'all' && biz.categorySlug !== selectedCategorySlug) {
        return false;
      }

      // City filter
      if (selectedCity !== 'all' && biz.city !== selectedCity) {
        return false;
      }

      // Verified filter
      if (onlyVerified && !biz.verified) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = biz.name.toLowerCase().includes(q);
        const matchCategory = biz.category.toLowerCase().includes(q);
        const matchLocation = biz.location.toLowerCase().includes(q) || biz.city.toLowerCase().includes(q);
        const matchTagline = (biz.tagline || '').toLowerCase().includes(q);
        const matchDescription = (biz.description || '').toLowerCase().includes(q);
        const matchServices = biz.services.some(
          (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
        );

        if (!matchName && !matchCategory && !matchLocation && !matchTagline && !matchDescription && !matchServices) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // Recommended: featured first, then verified, then rating
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }, [businesses, selectedCategorySlug, selectedCity, onlyVerified, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Top Banner / Breadcrumbs */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
            <button
              onClick={onBackToHome}
              className="hover:text-amber-700 flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>SuperMall Home</span>
            </button>
            <span>/</span>
            <span className="text-stone-900 font-medium">Explore Mall Directory</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-amber-700 font-semibold">{selectedCategory.name}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 uppercase tracking-tight">
                {selectedCategory ? selectedCategory.name : 'ALL BUSINESSES & SHOPS'}
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                {selectedCategory
                  ? selectedCategory.description
                  : 'Discover verified independent businesses across Blantyre, Lilongwe, Mzuzu, and Zomba.'}
              </p>
            </div>

            {/* Results counter */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-semibold text-stone-700">
                {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'Business found' : 'Businesses found'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <input
                id="explore-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, service (e.g., haircut, gown, portrait)..."
                className="w-full pl-9 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-3 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* City Selector */}
            <div className="md:col-span-3 relative">
              <div className="flex items-center bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5">
                <MapPin className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                <select
                  id="explore-city-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value as City | 'all')}
                  aria-label="Filter by City"
                  className="w-full bg-transparent text-sm text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Cities in Malawi</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-3">
              <div className="flex items-center bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5">
                <SlidersHorizontal className="w-4 h-4 text-stone-500 mr-2 flex-shrink-0" />
                <select
                  id="explore-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort listings by"
                  className="w-full bg-transparent text-sm text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value="recommended">Featured / Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Pills & Verified Checkbox */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
            {/* Category horizontal scroll/wrap */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedCategorySlug('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategorySlug === 'all'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All Categories
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategorySlug(cat.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedCategorySlug === cat.slug
                      ? 'bg-amber-700 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Toggle Verified only */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Only</span>
              </span>
            </label>
          </div>
        </div>

        {/* Business Grid */}
        <div className="mt-8">
          {filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((biz) => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  onVisitShop={onVisitShop}
                  onQuickBook={onQuickBook}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
              <Store className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-stone-800">No businesses match your criteria</h3>
              <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
                Try clearing your search query or selecting a different city or category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategorySlug('all');
                  setSelectedCity('all');
                  setSearchQuery('');
                  setOnlyVerified(false);
                }}
                className="mt-4 px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
