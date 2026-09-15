import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowLeft } from 'lucide-react';
import { FaqItem, ActiveView } from '../types/index.ts';

interface Props {
  faqs: FaqItem[];
  setCurrentView: (v: ActiveView) => void;
}

const CATEGORY_LABELS: Record<FaqItem['category'], string> = {
  general: 'General',
  buying: 'Buying & Booking',
  selling: 'Selling',
  account: 'Account',
  payments: 'Payments',
};

export const FAQsPage: React.FC<Props> = ({ faqs, setCurrentView }) => {
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = faqs.filter((f) =>
    activeCategory === 'all' ? true : f.category === activeCategory
  );

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-amber-50 via-stone-50 to-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <button
            onClick={() => setCurrentView({ type: 'home' })}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-amber-700 mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-5">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-stone-600">
            Quick answers to the questions we hear most often.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
              activeCategory === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All
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

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filtered.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-stone-200 rounded-2xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                >
                  <span className="font-semibold text-stone-900 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-stone-600 leading-relaxed whitespace-pre-line border-t border-stone-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-sm text-stone-500">
          Still need help?{' '}
          <button
            onClick={() => setCurrentView({ type: 'help' })}
            className="font-semibold text-amber-700 hover:underline"
          >
            Visit our Help Center
          </button>{' '}
          or{' '}
          <button
            onClick={() => setCurrentView({ type: 'report_issue' })}
            className="font-semibold text-amber-700 hover:underline"
          >
            report an issue
          </button>
          .
        </div>
      </section>
    </div>
  );
};
