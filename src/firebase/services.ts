import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from './config.ts';
import { Business, Category, Booking, Review, BookingStatus, BusinessStatus, Order, OrderStatus } from '../types/index.ts';
import { INITIAL_BUSINESSES, INITIAL_CATEGORIES, INITIAL_BOOKINGS, INITIAL_REVIEWS, INITIAL_ORDERS } from '../data/seedData.ts';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
}

// -------------------------------------------------------------
// Businesses Services
// -------------------------------------------------------------
export const subscribeBusinesses = (
  callback: (businesses: Business[]) => void,
  onError?: (err: any) => void
) => {
  const path = 'businesses';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_BUSINESSES);
        return;
      }
      const items: Business[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Business, 'id'>) });
      });
      callback(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
      // Fallback gracefully so UI is always responsive
      callback(INITIAL_BUSINESSES);
    }
  );
};

export const addBusinessToFirestore = async (businessData: Omit<Business, 'id'>): Promise<string> => {
  const path = 'businesses';
  try {
    const newDocRef = doc(collection(db, path));
    const now = new Date().toISOString();
    const cleanBiz: Business = {
      ...businessData,
      id: newDocRef.id,
      createdAt: businessData.createdAt || now,
      updatedAt: now,
    };
    await setDoc(newDocRef, cleanBiz);
    return newDocRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

export const updateBusinessInFirestore = async (businessId: string, updates: Partial<Business>): Promise<void> => {
  const path = `businesses/${businessId}`;
  try {
    const docRef = doc(db, 'businesses', businessId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteBusinessFromFirestore = async (businessId: string): Promise<void> => {
  const path = `businesses/${businessId}`;
  try {
    await deleteDoc(doc(db, 'businesses', businessId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// -------------------------------------------------------------
// Categories Services
// -------------------------------------------------------------
export const subscribeCategories = (
  callback: (categories: Category[]) => void,
  onError?: (err: any) => void
) => {
  const path = 'categories';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_CATEGORIES);
        return;
      }
      const items: Category[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Category, 'id'>) });
      });
      callback(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
      callback(INITIAL_CATEGORIES);
    }
  );
};

export const addCategoryToFirestore = async (categoryData: Omit<Category, 'id'>): Promise<string> => {
  const path = 'categories';
  try {
    const newDocRef = doc(collection(db, path));
    const cleanCat: Category = {
      ...categoryData,
      id: newDocRef.id,
    };
    await setDoc(newDocRef, cleanCat);
    return newDocRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

export const updateCategoryInFirestore = async (categoryId: string, updates: Partial<Category>): Promise<void> => {
  const path = `categories/${categoryId}`;
  try {
    const docRef = doc(db, 'categories', categoryId);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// -------------------------------------------------------------
// Bookings Services
// -------------------------------------------------------------
export const subscribeBookings = (
  callback: (bookings: Booking[]) => void,
  onError?: (err: any) => void
) => {
  const path = 'bookings';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_BOOKINGS);
        return;
      }
      const items: Booking[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Booking, 'id'>) });
      });
      // Sort latest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
      callback(INITIAL_BOOKINGS);
    }
  );
};

export const createBookingInFirestore = async (bookingData: Omit<Booking, 'id' | 'bookingRef' | 'createdAt'>): Promise<Booking> => {
  const path = 'bookings';
  try {
    const newDocRef = doc(collection(db, path));
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `SM-${randomSuffix}`;
    const now = new Date().toISOString();

    const fullBooking: Booking = {
      ...bookingData,
      id: newDocRef.id,
      bookingRef,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(newDocRef, fullBooking);
    return fullBooking;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    // Return a mock object so user gets immediate visual feedback even if offline
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return {
      ...bookingData,
      id: `local-${Date.now()}`,
      bookingRef: `SM-${randomSuffix}`,
      createdAt: new Date().toISOString(),
    };
  }
};

export const updateBookingStatusInFirestore = async (
  bookingId: string,
  status: BookingStatus
): Promise<void> => {
  const path = `bookings/${bookingId}`;
  try {
    const docRef = doc(db, 'bookings', bookingId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// -------------------------------------------------------------
// Reviews Services
// -------------------------------------------------------------
export const subscribeReviews = (
  callback: (reviews: Review[]) => void,
  onError?: (err: any) => void
) => {
  const path = 'reviews';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_REVIEWS);
        return;
      }
      const items: Review[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Review, 'id'>) });
      });
      callback(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
      callback(INITIAL_REVIEWS);
    }
  );
};

export const addReviewToFirestore = async (reviewData: Omit<Review, 'id'>): Promise<string> => {
  const path = 'reviews';
  try {
    const newDocRef = doc(collection(db, path));
    const cleanReview: Review = {
      ...reviewData,
      id: newDocRef.id,
    };
    await setDoc(newDocRef, cleanReview);
    return newDocRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

// -------------------------------------------------------------
// Orders Services (Cart & Products)
// -------------------------------------------------------------
export const subscribeOrders = (
  callback: (orders: Order[]) => void,
  onError?: (err: any) => void
) => {
  const path = 'orders';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_ORDERS);
        return;
      }
      const items: Order[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
      });
      callback(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
      callback(INITIAL_ORDERS);
    }
  );
};

export const addOrderToFirestore = async (orderData: Omit<Order, 'id'>): Promise<string> => {
  const path = 'orders';
  try {
    const newDocRef = doc(collection(db, path));
    const now = new Date().toISOString();
    const cleanOrder: Order = {
      ...orderData,
      id: newDocRef.id,
      createdAt: orderData.createdAt || now,
      updatedAt: now,
    };
    await setDoc(newDocRef, cleanOrder);
    return newDocRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

export const updateOrderStatusInFirestore = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  const path = `orders/${orderId}`;
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// -------------------------------------------------------------
// Database Seed Helper
// -------------------------------------------------------------
export const seedInitialSuperMallData = async (): Promise<{ businessesAdded: number; categoriesAdded: number; bookingsAdded: number }> => {
  let businessesAdded = 0;
  let categoriesAdded = 0;
  let bookingsAdded = 0;

  try {
    const bizSnap = await getDocs(collection(db, 'businesses'));
    if (bizSnap.empty) {
      for (const biz of INITIAL_BUSINESSES) {
        const docRef = doc(db, 'businesses', biz.id);
        await setDoc(docRef, biz);
        businessesAdded++;
      }
    }

    const catSnap = await getDocs(collection(db, 'categories'));
    if (catSnap.empty) {
      for (const cat of INITIAL_CATEGORIES) {
        const docRef = doc(db, 'categories', cat.id);
        await setDoc(docRef, cat);
        categoriesAdded++;
      }
    }

    const bookSnap = await getDocs(collection(db, 'bookings'));
    if (bookSnap.empty) {
      for (const bk of INITIAL_BOOKINGS) {
        const docRef = doc(db, 'bookings', bk.id);
        await setDoc(docRef, bk);
        bookingsAdded++;
      }
    }

    const revSnap = await getDocs(collection(db, 'reviews'));
    if (revSnap.empty) {
      for (const rv of INITIAL_REVIEWS) {
        const docRef = doc(db, 'reviews', rv.id);
        await setDoc(docRef, rv);
      }
    }

    const ordSnap = await getDocs(collection(db, 'orders'));
    if (ordSnap.empty) {
      for (const ord of INITIAL_ORDERS) {
        const docRef = doc(db, 'orders', ord.id);
        await setDoc(docRef, ord);
      }
    }
  } catch (err) {
    console.warn('SuperMall seed notice:', err);
  }

  return { businessesAdded, categoriesAdded, bookingsAdded };
};
