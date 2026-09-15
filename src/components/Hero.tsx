import React, { useState } from 'react';
import { Search, MapPin, Sparkles, ShieldCheck, CalendarCheck, Store } from 'lucide-react';
import { City, Category } from '../types/index.ts';

interface HeroProps {
  categories: Category[];
  onSearch: (query: string, city?: City) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  categories,
  onSearch,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim(), selectedCity ? (selectedCity as City) : undefined);
  };

  const cities: City[] = ['Blantyre', 'Lilongwe', 'Mzuzu', 'Zomba'];

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white pt-12 pb-20 sm:pt-16 sm:pb-24">
      {/* Subtle architectural background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Malawi’s Premier Multi-Merchant Digital Shopping Mall</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight mb-5">
            Discover independent businesses.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">
              Book instantly.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed">
            From precision barbering at <span className="text-amber-300 font-semibold">Urban Cut</span> to bespoke bridal fashion, luxury garden venues, and professional services. Each merchant with their own dedicated mini-website and direct booking system.
          </p>
        </div>

        {/* Big Interactive Search Console */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-2 sm:p-3 shadow-2xl border border-stone-200/20 text-stone-900">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
            {/* Query input */}
            <div className="flex-1 flex items-center px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200">
              <Search className="w-5 h-5 text-stone-400 mr-3 flex-shrink-0" />
              <input
                id="hero-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by business (e.g. Urban Cut, Barber, Tailor...)"
                className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:outline-none"
              />
            </div>

            {/* City Selector */}
            <div className="flex items-center px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 md:w-56">
              <MapPin className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" />
              <select
                id="hero-city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as City | '')}
                aria-label="Filter by City"
                className="w-full bg-transparent text-sm text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="">All Cities (Malawi)</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit button */}
            <button
              id="hero-search-submit"
              type="submit"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-amber-900/20 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore Mall</span>
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="pt-3 px-2 flex items-center gap-2 flex-wrap text-xs text-stone-600">
            <span className="font-semibold text-stone-700">Popular:</span>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-amber-100 hover:text-amber-900 transition-colors font-medium text-stone-700"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mall Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12 pt-8 border-t border-stone-800 text-stone-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Verified Merchants</p>
              <p className="text-xs text-stone-400">Manually vetted shops and studios</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Instant Booking</p>
              <p className="text-xs text-stone-400">No advance online payment required</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Independent Mini-Sites</p>
              <p className="text-xs text-stone-400">Isolated data & custom routes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
