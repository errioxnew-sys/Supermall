import React from 'react';
import { MapPin, ShieldCheck, Sparkles, Users, Mail, Phone, ArrowLeft } from 'lucide-react';
import { AboutContent, ActiveView } from '../types/index.ts';

const ICON_MAP: Record<string, any> = { MapPin, ShieldCheck, Sparkles, Users };

interface Props {
  content: AboutContent;
  setCurrentView: (v: ActiveView) => void;
}

export const AboutPage: React.FC<Props> = ({ content, setCurrentView }) => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-stone-50 to-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <button
            id="about-back-home-btn"
            onClick={() => setCurrentView({ type: 'home' })}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-amber-700 mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 leading-tight">
            {content.heroTitle}
          </h1>
          <p className="mt-6 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            {content.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-700">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-stone-500 font-semibold">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission + Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">Our Mission</h2>
          <p className="text-stone-600 leading-relaxed whitespace-pre-line">{content.mission}</p>
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">Our Story</h2>
          <p className="text-stone-600 leading-relaxed whitespace-pre-line">{content.story}</p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-stone-50 border-y border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-10 text-center">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.values.map((v, i) => {
              const Icon = ICON_MAP[v.icon] || Sparkles;
              return (
                <div
                  key={i}
                  className="bg-white border border-stone-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-stone-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">Get in Touch</h2>
        <p className="text-stone-600 mb-8">
          Have a question, partnership idea, or feedback? We'd love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`mailto:${content.contactEmail}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-lg hover:bg-stone-800"
          >
            <Mail className="w-4 h-4" /> {content.contactEmail}
          </a>
          <a
            href={`tel:${content.contactPhone}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-300 text-stone-800 text-sm font-semibold rounded-lg hover:bg-stone-50"
          >
            <Phone className="w-4 h-4" /> {content.contactPhone}
          </a>
        </div>
        <p className="mt-8 text-xs text-stone-400">Last updated: {content.lastUpdated}</p>
      </section>
    </div>
  );
};
