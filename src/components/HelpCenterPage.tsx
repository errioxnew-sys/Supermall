import React, { useState } from 'react';
import { Search, BookOpen, ArrowLeft, ChevronRight } from 'lucide-react';
import { HelpArticle, ActiveView } from '../types/index.ts';

interface Props {
  articles: HelpArticle[];
  setCurrentView: (v: ActiveView) => void;
}

const CATEGORY_LABELS: Record<HelpArticle['category'], string> = {
  'getting-started': 'Getting Started',
  buying: 'Buying & Booking',
  selling: 'Selling on SuperMall',
  account: 'Account & Profile',
  troubleshooting: 'Troubleshooting',
};

export const HelpCenterPage: React.FC<Props> = ({ articles, setCurrentView }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [openArticle, setOpenArticle] = useState<HelpArticle | null>(null);

  const filtered = articles
    .filter((a) => (activeCategory === 'all' ? true : a.category === activeCategory))
    .filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.summary.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-stone-50 to-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <button
            id="help-back-home-btn"
            onClick={() => setCurrentView({ type: 'home' })}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-amber-700 mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Help Center
          </h1>
          <p className="mt-4 text-stone-600">
            Guides, tutorials, and answers to get you the most out of SuperMall.
          </p>
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/30"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
              activeCategory === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Articles
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                activeCategory === key
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Article grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-stone-500">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-stone-300" />
            <p>No articles matched your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((a) => (
              <button
                key={a.id}
                onClick={() => setOpenArticle(a)}
                className="text-left bg-white border border-stone-200 rounded-2xl p-6 hover:shadow-md hover:border-amber-300 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-700">
                      {CATEGORY_LABELS[a.category]}
                    </span>
                    <h3 className="mt-2 font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-sm text-stone-600 leading-relaxed">{a.summary}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-amber-600 shrink-0 mt-6" />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Article modal */}
      {openArticle && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/60 flex items-center justify-center p-4"
          onClick={() => setOpenArticle(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-700">
              {CATEGORY_LABELS[openArticle.category]}
            </span>
            <h2 className="mt-2 text-2xl font-serif font-bold text-stone-900">
              {openArticle.title}
            </h2>
            <div className="mt-6 text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {openArticle.content}
            </div>
            <button
              onClick={() => setOpenArticle(null)}
              className="mt-8 px-5 py-2 bg-stone-900 text-white text-sm font-semibold rounded-lg hover:bg-stone-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
