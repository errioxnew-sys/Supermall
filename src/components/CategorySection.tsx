import React from 'react';
import {
  Scissors,
  Shirt,
  Sparkles,
  Calendar,
  Camera,
  UtensilsCrossed,
  Car,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { Category } from '../types/index.ts';

interface CategorySectionProps {
  categories: Category[];
  onSelectCategory: (categorySlug: string) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Scissors':
      return <Scissors className="w-5 h-5" />;
    case 'Shirt':
      return <Shirt className="w-5 h-5" />;
    case 'Sparkles':
      return <Sparkles className="w-5 h-5" />;
    case 'Calendar':
      return <Calendar className="w-5 h-5" />;
    case 'Camera':
      return <Camera className="w-5 h-5" />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className="w-5 h-5" />;
    case 'Car':
      return <Car className="w-5 h-5" />;
    case 'Briefcase':
    default:
      return <Briefcase className="w-5 h-5" />;
  }
};

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  onSelectCategory,
}) => {
  return (
    <section className="py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
              Directory Breakdown
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Browse by Industry & Service
            </h2>
          </div>
          <p className="text-sm text-stone-500 mt-2 md:mt-0 max-w-md">
            Explore hundreds of verified independent businesses, each with their own standalone mini-site.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.slug)}
              id={`cat-card-${category.slug}`}
              className="group cursor-pointer bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-amber-600/50 hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              {/* Category Image Header */}
              <div className="relative h-36 overflow-hidden bg-stone-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent"></div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                    {getCategoryIcon(category.icon)}
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-900/60 backdrop-blur-sm text-stone-200 border border-white/10">
                    {category.businessCount || 1}+ Shops
                  </span>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-stone-900 text-base group-hover:text-amber-700 transition-colors flex items-center justify-between">
                    <span>{category.name}</span>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
