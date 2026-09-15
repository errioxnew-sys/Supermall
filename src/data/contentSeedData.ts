import {
  AboutContent,
  FaqItem,
  HelpArticle,
  ShippingReturnsPolicy,
} from '../types/index.ts';

export const SEED_ABOUT: AboutContent = {
  id: 'about',
  heroTitle: 'Connecting Malawi, One Business at a Time',
  heroSubtitle:
    "SuperMall is Malawi's digital shopping mall — a single place where customers discover trusted local businesses, and where every vendor gets a professional online storefront.",
  mission:
    "Our mission is to give every Malawian business — from a two-chair barbershop in Mzuzu to a boutique in Blantyre — the tools and visibility usually reserved for big brands. We believe small businesses deserve big reach.",
  story:
    "SuperMall started with a simple frustration: finding a reliable local service in Malawi meant WhatsApp groups, word-of-mouth, and a lot of luck. We built a platform where customers can browse verified businesses, book services, buy products, and pay with confidence — all in one place. Today, SuperMall hosts hundreds of independent businesses across the country, each with their own mini-website, booking system, and shop dashboard.",
  values: [
    {
      title: 'Local First',
      description:
        'We prioritize Malawian businesses, Malawian Kwacha, and Malawian cities. Every design decision is made for our market.',
      icon: 'MapPin',
    },
    {
      title: 'Trust & Transparency',
      description:
        'Every business is reviewed before listing. Reviews are verified. Prices are clear. No surprises.',
      icon: 'ShieldCheck',
    },
    {
      title: 'Empowerment',
      description:
        'We give small businesses the same digital tools as large chains — for free.',
      icon: 'Sparkles',
    },
    {
      title: 'Community',
      description:
        'When a local business grows, their neighborhood grows. We are building more than a marketplace.',
      icon: 'Users',
    },
  ],
  stats: [
    { label: 'Active Businesses', value: '500+' },
    { label: 'Cities Covered', value: '4' },
    { label: 'Happy Customers', value: '10K+' },
    { label: 'Bookings Made', value: '25K+' },
  ],
  contactEmail: 'hello@supermall.mw',
  contactPhone: '+265 999 000 000',
  lastUpdated: 'January 2026',
};

export const SEED_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How do I find a business near me?',
    answer:
      "Head to the Explore page and filter by city (Blantyre, Lilongwe, Mzuzu, or Zomba) and category. You can also search by name or service directly from the search bar at the top of every page.",
    category: 'buying',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'How do I book a service?',
    answer:
      "Open any business's mini-site, pick the service you want, and click Book. Choose your date and time, confirm your details, and the business will get your request instantly. You'll get a notification once they confirm.",
    category: 'buying',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'How do I pay for an order or booking?',
    answer:
      "Right now, payment is arranged directly with the business — most accept mobile money (Airtel Money, TNM Mpamba), cash, or bank transfer. Online payments are coming soon.",
    category: 'payments',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'How do I list my business on SuperMall?',
    answer:
      "Click List Your Business in the top navigation. Fill in your details, upload photos, and pick a storefront style. Your listing goes live immediately in the mall directory — and you can customize it further from your dashboard.",
    category: 'selling',
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'Is it free to list my business?',
    answer:
      "Yes! The Free tier gives you a mini-website, booking system, and product catalog at no cost. Business and Premium tiers unlock advanced features like custom domains, QR codes, and priority placement.",
    category: 'selling',
    order: 5,
  },
  {
    id: 'faq-6',
    question: 'Can I cancel a booking or order?',
    answer:
      "Yes. Contact the business directly through their mini-site as soon as possible. Cancellation policies vary by vendor — most allow free cancellation up to 24 hours before a booking.",
    category: 'buying',
    order: 6,
  },
  {
    id: 'faq-7',
    question: 'How do I reset my account or sign out?',
    answer:
      "Click your name in the top-right corner and choose Sign Out. To manage your Google account, visit your Google Account settings — SuperMall uses Google Sign-In for authentication.",
    category: 'account',
    order: 7,
  },
  {
    id: 'faq-8',
    question: 'How do I leave a review?',
    answer:
      "After using a service or making a purchase, open the business's mini-site and click Write a Review at the bottom of the reviews section. Verified customers get a Verified badge on their review.",
    category: 'general',
    order: 8,
  },
];

export const SEED_HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'help-1',
    title: 'Getting Started with SuperMall',
    summary: 'New here? Learn how to browse, book, and buy in 5 minutes.',
    content:
      "Welcome to SuperMall! Here's the quickest way to get comfortable:\n\n1. Use the search bar to find shops, services, or products.\n2. Browse by category on the home page — Barber Shops, Fashion, Beauty, Events, and more.\n3. Filter by city to see only businesses near you.\n4. Click any business to open their mini-site, where you can view their full catalog, book services, or place orders.\n5. Sign in with Google to save favorites and track your bookings.",
    category: 'getting-started',
    order: 1,
  },
  {
    id: 'help-2',
    title: 'How to Book a Service',
    summary: 'A step-by-step walkthrough of the booking flow.',
    content:
      "1. Find a business offering the service you want.\n2. Scroll to the Services section on their mini-site.\n3. Click Book next to the service, or click the service card itself.\n4. Choose your preferred date and time from the available slots.\n5. Add your name, phone number, and any special requests.\n6. Confirm — the business will receive your request instantly.\n7. You'll see the booking in your account and get a confirmation when the business accepts.",
    category: 'buying',
    order: 2,
  },
  {
    id: 'help-3',
    title: 'How to Buy Products',
    summary: 'How the shopping cart and orders work.',
    content:
      "1. Open any business's mini-site that sells products.\n2. Add items to your cart using the Add to Cart button.\n3. Open the cart drawer and review your items.\n4. Click Checkout and fill in your delivery details.\n5. Confirm your order — the business is notified immediately.\n6. The business will contact you to arrange payment and delivery.",
    category: 'buying',
    order: 3,
  },
  {
    id: 'help-4',
    title: 'Setting Up Your Business Dashboard',
    summary: 'Everything a new seller needs to know.',
    content:
      "Your Business Dashboard is your control center. From here you can:\n\n• Update your storefront — logo, cover photo, description, and website style.\n• Manage your catalog — add products, services, prices, and stock.\n• View and respond to bookings and orders.\n• Track revenue and analytics.\n• Configure your business hours and location.\n\nAccess your dashboard via the link in your welcome email, or the dashboard URL you were given.",
    category: 'selling',
    order: 4,
  },
  {
    id: 'help-5',
    title: 'Troubleshooting Sign-In Issues',
    summary: 'What to do if you can’t sign in.',
    content:
      "SuperMall uses Google Sign-In. If you're having trouble:\n\n• Make sure you're using a valid Google account.\n• Try clearing your browser cache or using an incognito window.\n• Check that you're not blocking third-party cookies.\n• If you're still stuck, email support@supermall.mw with a screenshot.",
    category: 'troubleshooting',
    order: 5,
  },
  {
    id: 'help-6',
    title: 'Managing Your Account',
    summary: 'Update your profile, email, and preferences.',
    content:
      "Your SuperMall account is tied to your Google account. To update your name or photo, edit your Google profile — changes sync automatically. For notifications and communication preferences, contact support.",
    category: 'account',
    order: 6,
  },
];

export const SEED_SHIPPING_RETURNS: ShippingReturnsPolicy = {
  id: 'shipping_returns',
  shippingTitle: 'Shipping & Delivery',
  shippingContent:
    "Shipping is handled directly by each business on SuperMall. This means delivery times, fees, and coverage areas vary by vendor — and you'll see their specific policy on their mini-site.\n\nGeneral guidelines:\n\n• Local pickup: Many businesses offer free pickup at their physical location. You'll be notified when your order is ready.\n• Within-city delivery: Common in Blantyre, Lilongwe, Mzuzu, and Zomba. Typically 1–3 business days.\n• Inter-city delivery: Available from most vendors via courier or bus services. Usually 2–5 business days.\n• Shipping fees: Set by the business and shown at checkout or communicated after order confirmation.\n\nIf you have questions about a specific order, contact the business directly through their mini-site.",
  returnsTitle: 'Returns Policy',
  returnsContent:
    "Because each business on SuperMall is independent, return policies are set by the vendor. However, every business on the platform agrees to the following baseline:\n\n• Physical products: Returns accepted within 7 days of delivery if the item is unused, in original packaging, and accompanied by proof of purchase.\n• Services & bookings: Cancellations accepted up to 24 hours before the appointment. Late cancellations may incur a fee, at the business's discretion.\n• Custom or personalized items: Non-returnable unless defective.\n• Digital products: Non-refundable once delivered.\n\nTo start a return, contact the business directly. If you can't reach them, use our Report an Issue page and we'll step in.",
  refundsTitle: 'Refunds',
  refundsContent:
    "Refunds are processed by the business. Once a return is approved:\n\n• Mobile money refunds: 1–3 business days.\n• Bank transfer refunds: 3–7 business days.\n• Cash refunds: Arranged in person at the business location.\n\nIf a business fails to process a valid refund within 14 days, report it to SuperMall and we will mediate. Repeat offenders may be removed from the platform.",
  lastUpdated: 'January 2026',
};
