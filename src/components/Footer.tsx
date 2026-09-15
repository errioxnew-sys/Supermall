import React from 'react';
import { Building2, Store, ShieldCheck, Heart, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { ActiveView } from '../types/index.ts';

interface FooterProps {
  setCurrentView: (view: ActiveView) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView, onSelectCategory }) => {
  return (
    <footer className="bg-stone-950 text-stone-400 text-xs border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-serif font-bold tracking-tight text-white block leading-none">
                  SUPER<span className="text-amber-500 font-normal">MALL</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block mt-0.5">
                  Malawi's Digital Shopping Mall
                </span>
              </div>
            </div>

            <p className="text-stone-400 leading-relaxed max-w-sm">
              Empowering independent local businesses with standalone mini-websites, online appointment scheduling, and isolated merchant dashboards across Malawi.
            </p>

            <div className="pt-2 flex items-center gap-3 text-stone-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Blantyre • Lilongwe • Mzuzu • Zomba</span>
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider font-serif">
              Popular Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCategory('barber-shops')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Barber Shops & Grooming
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('fashion-clothing')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Fashion Boutiques & Tailoring
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('beauty-wellness')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Beauty Salons & Spas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('events-venues')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Wedding & Event Venues
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('photography')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Photography Studios
                </button>
              </li>
            </ul>
          </div>

          {/* Merchant Ecosystem */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider font-serif">
              Business Admin
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  id="footer-business-admin-btn"
                  onClick={() => setCurrentView({ type: 'business_dashboard' })}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 text-emerald-400 font-semibold text-left"
                >
                  <Store className="w-3.5 h-3.5 shrink-0" />
                  <span>Business Admin Platform</span>
                </button>
              </li>
              <li>
                <span className="text-stone-400 text-xs">Manage inventory, catalog & staff</span>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView({ type: 'business_dashboard' })}
                  className="text-stone-400 hover:text-stone-200 transition-colors"
                >
                  Storefront Settings
                </button>
              </li>
              <li>
                <span className="text-stone-500">Custom Domains & QR Codes</span>
              </li>
            </ul>
          </div>

          {/* SuperMall Platform Admin */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider font-serif">
              Super Admin
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  id="footer-super-admin-btn"
                  onClick={() => setCurrentView({ type: 'admin', subTab: 'dashboard' })}
                  className="hover:text-indigo-300 transition-colors flex items-center gap-1.5 text-indigo-400 font-semibold text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Super Admin Platform</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView({ type: 'admin', subTab: 'businesses' })}
                  className="hover:text-stone-300 transition-colors"
                >
                  Business Verification
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView({ type: 'admin', subTab: 'bookings' })}
                  className="hover:text-stone-300 transition-colors"
                >
                  Mall Bookings Ledger
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView({ type: 'admin', subTab: 'reports' })}
                  className="hover:text-stone-300 transition-colors"
                >
                  Analytics & Reports
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} SuperMall Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built with Next/React, TypeScript & Firebase Firestore</span>
            <span>•</span>
            <span>Security Rules Enforced</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
