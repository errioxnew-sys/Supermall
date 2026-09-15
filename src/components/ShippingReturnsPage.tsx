import React from 'react';
import { Truck, RotateCcw, Wallet, ArrowLeft } from 'lucide-react';
import { ShippingReturnsPolicy, ActiveView } from '../types/index.ts';

interface Props {
  content: ShippingReturnsPolicy;
  setCurrentView: (v: ActiveView) => void;
}

export const ShippingReturnsPage: React.FC<Props> = ({ content, setCurrentView }) => {
  const sections = [
    {
      icon: Truck,
      title: content.shippingTitle,
      body: content.shippingContent,
    },
    {
      icon: RotateCcw,
      title: content.returnsTitle,
      body: content.returnsContent,
    },
    {
      icon: Wallet,
      title: content.refundsTitle,
      body: content.refundsContent,
    },
  ];

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
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Shipping, Returns & Refunds
          </h1>
          <p className="mt-4 text-stone-600">
            Everything you need to know about getting your order — and what to do if something
            isn't right.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {sections.map((s, i) => (
          <div key={i} className="border border-stone-200 rounded-2xl p-8 bg-white">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <s.icon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif font-bold text-stone-900">{s.title}</h2>
            </div>
            <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {s.body}
            </div>
          </div>
        ))}

        <div className="text-center pt-4">
          <p className="text-xs text-stone-400 mb-6">Last updated: {content.lastUpdated}</p>
          <button
            onClick={() => setCurrentView({ type: 'report_issue' })}
            className="px-6 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-lg hover:bg-stone-800"
          >
            Report an Issue
          </button>
        </div>
      </section>
    </div>
  );
};
