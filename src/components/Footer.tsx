import React from 'react';
import {
  Building2,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react';
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
              Discover and shop from Malawi's best local businesses. From barbershops and boutiques
              to photographers and event venues, we connect you with trusted vendors across the country.
            </p>

            <div className="pt-2 flex items-center gap-3 text-stone-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Blantyre • Lilongwe • Mzuzu • Zomba</span>
              </span>
            </div>

            {/* Socials */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop by Category */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider font-serif">
              Shop by Category
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCategory('barber-shops')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Barber Shops & Grooming
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('fashion-clothing')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Fashion & Tailoring
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('beauty-wellness')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Beauty Salons & Spas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('events-venues')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Wedding & Event Venues
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('photography')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Photography Studios
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider font-serif">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Press & Media
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView({ type: 'register_business' })}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Sell on SuperMall
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider font-serif">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} SuperMall Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-stone-300 transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-stone-300 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-stone-300 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
