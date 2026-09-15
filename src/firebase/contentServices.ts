import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './config.ts'; // adjust if your db import path differs
import {
  AboutContent,
  FaqItem,
  HelpArticle,
  ShippingReturnsPolicy,
  IssueReport,
} from '../types/index.ts';
import {
  SEED_ABOUT,
  SEED_FAQS,
  SEED_HELP_ARTICLES,
  SEED_SHIPPING_RETURNS,
} from '../data/contentSeedData.ts';

// ============ ABOUT ============
export const subscribeAbout = (cb: (data: AboutContent) => void) => {
  const ref = doc(db, 'content', 'about');
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) cb(snap.data() as AboutContent);
      else cb(SEED_ABOUT);
    },
    () => cb(SEED_ABOUT)
  );
};

export const updateAbout = async (data: Partial<AboutContent>) => {
  const ref = doc(db, 'content', 'about');
  await setDoc(ref, { ...data, lastUpdated: new Date().toLocaleDateString() }, { merge: true });
};

// ============ FAQS ============
export const subscribeFaqs = (cb: (items: FaqItem[]) => void) => {
  const ref = collection(db, 'faqs');
  const q = query(ref, orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) cb(SEED_FAQS);
      else cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FaqItem)));
    },
    () => cb(SEED_FAQS)
  );
};

export const addFaq = async (faq: Omit<FaqItem, 'id'>) => {
  const ref = await addDoc(collection(db, 'faqs'), faq);
  return ref.id;
};

export const updateFaq = async (id: string, updates: Partial<FaqItem>) => {
  await updateDoc(doc(db, 'faqs', id), updates);
};

export const deleteFaq = async (id: string) => {
  await deleteDoc(doc(db, 'faqs', id));
};

// ============ HELP ARTICLES ============
export const subscribeHelpArticles = (cb: (items: HelpArticle[]) => void) => {
  const ref = collection(db, 'help_articles');
  const q = query(ref, orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) cb(SEED_HELP_ARTICLES);
      else cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as HelpArticle)));
    },
    () => cb(SEED_HELP_ARTICLES)
  );
};

export const addHelpArticle = async (article: Omit<HelpArticle, 'id'>) => {
  const ref = await addDoc(collection(db, 'help_articles'), article);
  return ref.id;
};

export const updateHelpArticle = async (id: string, updates: Partial<HelpArticle>) => {
  await updateDoc(doc(db, 'help_articles', id), updates);
};

export const deleteHelpArticle = async (id: string) => {
  await deleteDoc(doc(db, 'help_articles', id));
};

// ============ SHIPPING & RETURNS ============
export const subscribeShippingReturns = (cb: (data: ShippingReturnsPolicy) => void) => {
  const ref = doc(db, 'content', 'shipping_returns');
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) cb(snap.data() as ShippingReturnsPolicy);
      else cb(SEED_SHIPPING_RETURNS);
    },
    () => cb(SEED_SHIPPING_RETURNS)
  );
};

export const updateShippingReturns = async (data: Partial<ShippingReturnsPolicy>) => {
  const ref = doc(db, 'content', 'shipping_returns');
  await setDoc(
    ref,
    { ...data, lastUpdated: new Date().toLocaleDateString() },
    { merge: true }
  );
};

// ============ ISSUE REPORTS ============
export const submitIssueReport = async (report: Omit<IssueReport, 'id'>) => {
  const ref = await addDoc(collection(db, 'issue_reports'), report);
  return ref.id;
};

export const subscribeIssueReports = (cb: (items: IssueReport[]) => void) => {
  const ref = collection(db, 'issue_reports');
  return onSnapshot(
    ref,
    (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as IssueReport)));
    },
    () => cb([])
  );
};

export const updateIssueReportStatus = async (
  id: string,
  status: IssueReport['status']
) => {
  await updateDoc(doc(db, 'issue_reports', id), { status });
};
