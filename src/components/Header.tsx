import React, { useState } from 'react';
import {
  Store,
  Search,
  Building2,
  LogOut,
  LogIn,
  Menu,
  X,
  Compass,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import { useAuth, SUPERUSER_CONFIG } from '../context/AuthContext.tsx';
import { ActiveView, Business, City } from '../types/index.ts';

interface HeaderProps {
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  businesses: Business[];
  onSearch: (query: string, city?: City) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  businesses,
  onSearch,
}) => {
  const {
    user,
    isAdmin,
    isSuperuser,
    signInWithGoogle,
    signOutUser,
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const navLinks = [
    {
      id: 'nav-home',
      label: 'Home',
      view: { type: 'home' } as ActiveView,
      isActive: currentView.type === 'home',
      icon: null as any,
    },
    {
      id: 'nav-explore',
      label: 'Explore Mall',
      icon: Compass,
      view: { type: 'explore' } as ActiveView,
      isActive: currentView.type === 'explore',
    },
    {
      id: 'nav-categories',
      label: 'Categories',
      icon: LayoutGrid,
      view: { type: 'explore' } as ActiveView,
      isActive: false,
    },
    {
      id: 'nav-stores',
      label: 'Stores',
      icon: Store,
      view: { type: 'explore' } as ActiveView,
      isActive: false,
    },
  ];

  const handleNavClick = (view: ActiveView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <button
            id="supermall-brand-logo"
            onClick={() => setCurrentView({ type: 'home' })}
            className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center shadow-md shadow-amber-900/10 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900 font-serif block leading-none">
                SUPER<span className="text-amber-700 font-normal">MALL</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-stone-500 font-semibold block mt-0.5">
                Digital Shopping Mall
              </span>
            </div>
          </button>

          {/* Quick Search in Navbar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-sm lg:max-w-md items-center relative"
          >
            <input
              id="navbar-search-input"
              type="text"
              placeholder="Search shops, services, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-sm bg-stone-100 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:bg-white transition-all text-stone-900 placeholder-stone-400"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <button
              id="navbar-search-submit"
              type="submit"
              className="absolute right-1 px-3 py-1 bg-stone-900 text-white text-xs font-medium rounded-full hover:bg-stone-800 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-stone-700">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={link.id}
                onClick={() => handleNavClick(link.view)}
                className={`flex items-center gap-1.5 hover:text-amber-700 transition-colors ${
                  link.isActive ? 'text-amber-700 font-semibold' : ''
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4 text-amber-600" />}
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* User Account Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {user || isSuperuser ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden md:block">
                  <span className="block text-xs font-semibold text-stone-800 leading-tight">
                    {isSuperuser
                      ? SUPERUSER_CONFIG.email
                      : user?.displayName || user?.email?.split('@')[0]}
                  </span>
                  <span className="block text-[10px] text-stone-500 capitalize flex items-center justify-end gap-1">
                    {isSuperuser ? (
                      <span className="text-amber-700 font-bold flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> Superuser
                      </span>
                    ) : isAdmin ? (
                      'Mall Admin'
                    ) : (
                      'Customer Account'
                    )}
                  </span>
                </div>
                <button
                  id="user-signout-btn"
                  onClick={signOutUser}
                  title="Sign Out"
                  className="p-2 text-stone-500 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-signin-btn"
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative mb-3">
            <input
              type="text"
              placeholder="Search shops, services, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-sm bg-stone-100 border border-stone-200 rounded-lg text-stone-900"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1 bg-stone-900 text-white text-xs font-medium rounded-md"
            >
              Search
            </button>
          </form>

          <div className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.view)}
                className={`text-left px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${
                  link.isActive
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'hover:bg-stone-100 text-stone-800'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4 text-amber-600" />}
                <span>{link.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-200">
            {user || isSuperuser ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-stone-800">
                    {isSuperuser ? SUPERUSER_CONFIG.email : user?.displayName || user?.email}
                  </p>
                  <p className="text-[10px] text-stone-500">
                    {isSuperuser ? 'Super Administrator' : isAdmin ? 'Admin' : 'Customer'}
                  </p>
                </div>
                <button
                  onClick={signOutUser}
                  className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  signInWithGoogle();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-semibold text-white bg-stone-900 rounded-lg"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
