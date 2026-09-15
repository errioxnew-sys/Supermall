import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import {
  Business,
  Category,
  Booking,
  Review,
  ActiveView,
  City,
  ServiceItem,
  BookingStatus,
  Order,
  OrderStatus,
} from './types/index.ts';
import {
  subscribeBusinesses,
  subscribeCategories,
  subscribeBookings,
  subscribeReviews,
  subscribeOrders,
  addBusinessToFirestore,
  updateBusinessInFirestore,
  deleteBusinessFromFirestore,
  addCategoryToFirestore,
  createBookingInFirestore,
  updateBookingStatusInFirestore,
  addReviewToFirestore,
  addOrderToFirestore,
  updateOrderStatusInFirestore,
  seedInitialSuperMallData,
} from './firebase/services.ts';
import {
  INITIAL_BUSINESSES,
  INITIAL_CATEGORIES,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
} from './data/seedData.ts';

import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { CategorySection } from './components/CategorySection.tsx';
import { FeaturedBusinesses } from './components/FeaturedBusinesses.tsx';
import { ExploreView } from './components/ExploreView.tsx';
import { BusinessMiniSite } from './components/BusinessMiniSite.tsx';
import { BusinessDashboard } from './components/BusinessDashboard.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { RegisterBusinessModal } from './components/RegisterBusinessModal.tsx';
import { PythonAnywhereModal } from './components/PythonAnywhereModal.tsx';
import { Footer } from './components/Footer.tsx';

const SuperMallAppContent: React.FC = () => {
  const { currentBusinessId, setCurrentBusinessId, setCurrentRole } = useAuth();

  // Firestore Real-Time Subscriptions with initial seed fallbacks
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Active Navigation View
  const [currentView, setCurrentView] = useState<ActiveView>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const match = path.match(/^\/s\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return { type: 'business_site', slug: match[1] };
      }
      const params = new URLSearchParams(window.location.search);
      const sParam = params.get('s') || params.get('business');
      if (sParam) {
        return { type: 'business_site', slug: sParam };
      }
      if (params.get('admin') === 'true' || path === '/admin') {
        return { type: 'admin', subTab: 'dashboard' };
      }
      const dashParam = params.get('dashboard') || params.get('business_admin');
      if (dashParam || path.startsWith('/dashboard')) {
        const bizId = typeof dashParam === 'string' && dashParam !== 'true' ? dashParam : undefined;
        return { type: 'business_dashboard', businessId: bizId };
      }
      if (params.get('view') === 'explore' || path === '/explore') {
        return { type: 'explore' };
      }
    }
    return { type: 'home' };
  });

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | undefined>(undefined);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | undefined>(undefined);

  // Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeBookingBusiness, setActiveBookingBusiness] = useState<Business | null>(null);
  const [activeBookingService, setActiveBookingService] = useState<ServiceItem | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPythonAnywhereModalOpen, setIsPythonAnywhereModalOpen] = useState(false);

  // Subscribe to real-time collections
  useEffect(() => {
    const unsubBiz = subscribeBusinesses(setBusinesses);
    const unsubCat = subscribeCategories(setCategories);
    const unsubBookings = subscribeBookings(setBookings);
    const unsubReviews = subscribeReviews(setReviews);
    const unsubOrders = subscribeOrders(setOrders);

    // Trigger non-blocking seed in case DB is fresh
    seedInitialSuperMallData().catch((e) => console.warn('Seed notice:', e));

    return () => {
      unsubBiz();
      unsubCat();
      unsubBookings();
      unsubReviews();
      unsubOrders();
    };
  }, []);

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const match = path.match(/^\/s\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        setCurrentView({ type: 'business_site', slug: match[1] });
      } else {
        const params = new URLSearchParams(window.location.search);
        const sParam = params.get('s');
        if (sParam) {
          setCurrentView({ type: 'business_site', slug: sParam });
        } else if (params.get('admin') === 'true' || path === '/admin') {
          setCurrentView({ type: 'admin', subTab: 'dashboard' });
        } else if (params.get('dashboard') || params.get('business_admin') || path.startsWith('/dashboard')) {
          const dashParam = params.get('dashboard') || params.get('business_admin');
          const bizId = typeof dashParam === 'string' && dashParam !== 'true' ? dashParam : undefined;
          setCurrentView({ type: 'business_dashboard', businessId: bizId });
        } else if (params.get('view') === 'explore' || path === '/explore') {
          setCurrentView({ type: 'explore' });
        } else {
          setCurrentView({ type: 'home' });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync route changes to browser history
  const navigateTo = useCallback((view: ActiveView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view.type === 'business_site') {
      window.history.pushState({}, '', `/s/${view.slug}`);
    } else if (view.type === 'home') {
      window.history.pushState({}, '', '/');
    } else if (view.type === 'explore') {
      window.history.pushState({}, '', '/?view=explore');
    } else if (view.type === 'admin') {
      window.history.pushState({}, '', '/?admin=true');
    } else if (view.type === 'business_dashboard') {
      const q = view.businessId ? `/?dashboard=${view.businessId}` : '/?dashboard=true';
      window.history.pushState({}, '', q);
    }
  }, []);

  const handleVisitShop = useCallback((slug: string) => {
    navigateTo({ type: 'business_site', slug });
  }, [navigateTo]);

  const handleOpenBooking = useCallback((business: Business, service?: ServiceItem) => {
    setActiveBookingBusiness(business);
    setActiveBookingService(service || null);
    setIsBookingModalOpen(true);
  }, []);

  const handleSearchFromHero = useCallback((query: string, city?: City) => {
    setSearchQuery(query);
    setSelectedCity(city);
    navigateTo({ type: 'explore', initialSearch: query, initialCity: city });
  }, [navigateTo]);

  const handleSelectCategoryFromHero = useCallback((categorySlug: string) => {
    setSelectedCategorySlug(categorySlug);
    navigateTo({ type: 'explore', categorySlug });
  }, [navigateTo]);

  // Business CRUD
  const handleUpdateBusiness = async (businessId: string, updates: Partial<Business>) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === businessId ? { ...b, ...updates } : b))
    );
    await updateBusinessInFirestore(businessId, updates);
  };

  const handleDeleteBusiness = async (businessId: string) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== businessId));
    await deleteBusinessFromFirestore(businessId);
  };

  const handleRegisterBusiness = async (bizData: Omit<Business, 'id'>): Promise<string> => {
    const newId = await addBusinessToFirestore(bizData);
    const idToUse = newId || `biz-${Date.now()}`;
    const newBiz: Business = { ...bizData, id: idToUse };

    setBusinesses((prev) => [newBiz, ...prev]);
    setCurrentBusinessId(idToUse);
    setCurrentRole('business_owner');
    navigateTo({ type: 'business_dashboard', businessId: idToUse });
    return idToUse;
  };

  // Booking CRUD
  const handleCreateBooking = async (bookingData: any): Promise<Booking | null> => {
    const created = await createBookingInFirestore(bookingData);
    setBookings((prev) => [created, ...prev]);
    return created;
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    await updateBookingStatusInFirestore(bookingId, status);
  };

  // Category CRUD
  const handleAddCategory = async (catData: Omit<Category, 'id'>) => {
    const newId = await addCategoryToFirestore(catData);
    setCategories((prev) => [...prev, { ...catData, id: newId || `cat-${Date.now()}` }]);
  };

  // Review CRUD
  const handleAddReview = async (businessId: string, reviewInput: { customerName: string; rating: number; comment: string; serviceUsed?: string }) => {
    const newReview: Omit<Review, 'id'> = {
      businessId,
      customerName: reviewInput.customerName,
      rating: reviewInput.rating,
      comment: reviewInput.comment,
      date: 'Just now',
      verified: true,
      serviceUsed: reviewInput.serviceUsed,
    };

    const reviewId = await addReviewToFirestore(newReview);
    const fullReview: Review = { ...newReview, id: reviewId || `rev-${Date.now()}` };
    setReviews((prev) => [fullReview, ...prev]);

    // Recalculate business rating
    const currentBiz = businesses.find((b) => b.id === businessId);
    if (currentBiz) {
      const allBizReviews = [...reviews.filter((r) => r.businessId === businessId), fullReview];
      const avgRating = allBizReviews.reduce((sum, r) => sum + r.rating, 0) / allBizReviews.length;
      handleUpdateBusiness(businessId, {
        rating: Number(avgRating.toFixed(1)),
        reviewCount: allBizReviews.length,
      });
    }
  };

  // Order CRUD (Shopping Cart Purchases)
  const handlePlaceOrder = async (orderData: Omit<Order, 'id'>): Promise<string> => {
    const orderId = await addOrderToFirestore(orderData);
    const finalId = orderId || `ord-${Date.now()}`;
    const newOrder: Order = { ...orderData, id: finalId };
    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock from the business inventory if available
    const targetBiz = businesses.find((b) => b.id === orderData.businessId);
    if (targetBiz && targetBiz.products) {
      const updatedProducts = targetBiz.products.map((prod) => {
        const itemInOrder = orderData.items.find((it) => it.productId === prod.id);
        if (itemInOrder) {
          const newStock = Math.max(0, prod.stock - itemInOrder.quantity);
          return {
            ...prod,
            stock: newStock,
            inStock: newStock > 0,
          };
        }
        return prod;
      });
      await handleUpdateBusiness(targetBiz.id, { products: updatedProducts });
    }

    return finalId;
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    await updateOrderStatusInFirestore(orderId, status);
  };

  // Determine active business for mini-site
  let activeMiniSiteBusiness: Business | undefined;
  if (currentView.type === 'business_site') {
    activeMiniSiteBusiness = businesses.find((b) => b.slug === currentView.slug);
    if (!activeMiniSiteBusiness) {
      activeMiniSiteBusiness = businesses[0];
    }
  }

  // Determine active business for dashboard
  const activeDashboardBusiness =
    businesses.find((b) => b.id === currentBusinessId) ||
    businesses[0] ||
    INITIAL_BUSINESSES[0];

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 font-sans antialiased selection:bg-amber-200 selection:text-amber-900">
      {/* Header */}
      <Header
        currentView={currentView}
        setCurrentView={navigateTo}
        businesses={businesses}
        onSearch={(q, c) => handleSearchFromHero(q, c)}
      />

      <main className="flex-1">
        {/* VIEW 1: HOME */}
        {currentView.type === 'home' && (
          <>
            <Hero
              categories={categories}
              onSearch={handleSearchFromHero}
              onSelectCategory={handleSelectCategoryFromHero}
            />
            <CategorySection
              categories={categories}
              onSelectCategory={handleSelectCategoryFromHero}
            />
            <FeaturedBusinesses
              businesses={businesses}
              onVisitShop={handleVisitShop}
              onViewAll={() => navigateTo({ type: 'explore' })}
              onQuickBook={(biz) => handleOpenBooking(biz)}
            />
          </>
        )}

        {/* VIEW 2: EXPLORE */}
        {currentView.type === 'explore' && (
          <ExploreView
            businesses={businesses}
            categories={categories}
            initialCategorySlug={currentView.categorySlug || selectedCategorySlug}
            initialCity={currentView.initialCity || selectedCity}
            initialSearch={currentView.initialSearch || searchQuery}
            onVisitShop={handleVisitShop}
            onQuickBook={(biz) => handleOpenBooking(biz)}
            onBackToHome={() => navigateTo({ type: 'home' })}
          />
        )}

        {/* VIEW 3: BUSINESS MINI-SITE (/s/:slug) */}
        {currentView.type === 'business_site' && activeMiniSiteBusiness && (
          <BusinessMiniSite
            business={activeMiniSiteBusiness}
            reviews={reviews}
            onBackToMall={() => navigateTo({ type: 'explore' })}
            onBookService={(svc) => handleOpenBooking(activeMiniSiteBusiness!, svc)}
            onAddReview={handleAddReview}
            onPlaceOrder={handlePlaceOrder}
            onOpenDashboard={() => {
              setCurrentBusinessId(activeMiniSiteBusiness!.id);
              setCurrentRole('business_owner');
              navigateTo({ type: 'business_dashboard', businessId: activeMiniSiteBusiness!.id });
            }}
          />
        )}

        {/* VIEW 4: BUSINESS OWNER DASHBOARD */}
        {currentView.type === 'business_dashboard' && activeDashboardBusiness && (
          <BusinessDashboard
            business={activeDashboardBusiness}
            bookings={bookings}
            orders={orders}
            onUpdateBusiness={handleUpdateBusiness}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onViewMiniSite={handleVisitShop}
            onSwitchBusiness={(bizId) => setCurrentBusinessId(bizId)}
            allBusinesses={businesses}
          />
        )}

        {/* VIEW 5: PLATFORM ADMIN PANEL */}
        {currentView.type === 'admin' && (
          <AdminPanel
            businesses={businesses}
            categories={categories}
            bookings={bookings}
            orders={orders}
            subTab={currentView.subTab}
            onUpdateBusiness={handleUpdateBusiness}
            onDeleteBusiness={handleDeleteBusiness}
            onAddBusiness={handleRegisterBusiness}
            onOpenStaffPanel={(bizId) => {
              setCurrentBusinessId(bizId);
              setCurrentRole('business_owner');
              navigateTo({ type: 'business_dashboard', businessId: bizId });
            }}
            onAddCategory={handleAddCategory}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onViewMiniSite={handleVisitShop}
            onSeedData={seedInitialSuperMallData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentView={navigateTo}
        onSelectCategory={handleSelectCategoryFromHero}
      />

      {/* Booking Appointment Modal */}
      {isBookingModalOpen && activeBookingBusiness && (
        <BookingModal
          business={activeBookingBusiness}
          selectedService={activeBookingService}
          existingBookings={bookings}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSubmitBooking={handleCreateBooking}
        />
      )}

      {/* Register Business Modal */}
      {(isRegisterModalOpen || currentView.type === 'register_business') && (
        <RegisterBusinessModal
          isOpen={true}
          categories={categories}
          onClose={() => {
            setIsRegisterModalOpen(false);
            if (currentView.type === 'register_business') {
              navigateTo({ type: 'home' });
            }
          }}
          onRegister={handleRegisterBusiness}
        />
      )}

      {/* PythonAnywhere & Django ZIP Download Modal */}
      <PythonAnywhereModal
        isOpen={isPythonAnywhereModalOpen}
        onClose={() => setIsPythonAnywhereModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SuperMallAppContent />
    </AuthProvider>
  );
};

export default App;
