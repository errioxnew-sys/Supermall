# SuperMall Malawi - Django, HTML, & JavaScript Edition

This is the Python Django implementation of the **SuperMall** digital mall platform, replicating the exact design system, color palette (`stone-900`, `amber-600`, `stone-50`), typography (`Playfair Display` + `Plus Jakarta Sans`), and layout structures.

---

## 🌟 Key Features

1. **Mall Directory & Search (`/` and `/explore/`)**
   - Curated flagship Malawian stores across Blantyre, Lilongwe, Mzuzu, and Zomba.
   - Dynamic search by keyword and city filters.
   - Categorized departments (Fashion & Clothing, Food & Dining, Beauty & Wellness, etc.).

2. **Independent Merchant Storefronts (`/s/<slug>/`)**
   - Independent digital mini-sites with vanity URL headers (`https://<slug>.supermall.mw`).
   - Merchandise catalogue with apparel sizing (`S, M, L, XL`), pricing in Malawi Kwacha (`MWK`), and real-time stock indicators.
   - Bookable services with duration, pricing, and modal reservation scheduling.
   - Dedicated business footer with physical operating hours, WhatsApp hotline, and merchant portal entry.

3. **Interactive Shopping Bag & Checkout Drawer (`static/js/cart.js`)**
   - LocalStorage bag state with multi-item aggregation and quantity controls.
   - Real-time computation of Subtotal, Delivery Fee (MWK 3,500 for local delivery, MWK 0 for store pickup), and Total.
   - Seamless checkout supporting **Airtel Money**, **TNM Mpamba**, and **Cash on Handover**.
   - Automatic stock level decrement upon order creation.

4. **Merchant Staff & Inventory Management (`/dashboard/<slug>/`)**
   - Product inventory manager: add new apparel/goods, toggle in-stock status, and manage prices in MWK.
   - Order fulfillment manager: advance status (`pending` &rarr; `confirmed` &rarr; `dispatched` &rarr; `completed`), customer contact details, and one-click WhatsApp dispatch messaging.

5. **Platform Admin Console (`/super-admin/`)**
   - Backend-only store onboarding (provisioning new merchants with tiers, categories, and opening hours).
   - Mall-wide order oversight and instant Malawi seed database runner.

---

## 🚀 Getting Started

### 1. Create & Activate Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Migrations & Seed Database

```bash
python manage.py makemigrations mall
python manage.py migrate
python manage.py seed_mall
```

### 4. Create Superuser (Optional for `/admin/`)

```bash
python manage.py createsuperuser
```

### 5. Launch the Development Server

```bash
python manage.py runserver 8000
```

Visit **`http://127.0.0.1:8000/`** in your browser.

---

## 📂 Project Architecture

```
django_supermall/
├── manage.py                          # Django CLI entrypoint
├── requirements.txt                   # Python package dependencies
├── supermall/                         # Core project configuration
│   ├── settings.py                    # Database, templates, static config
│   ├── urls.py                        # Root URL routing
│   ├── wsgi.py                        # WSGI server entry
│   └── asgi.py                        # ASGI server entry
└── mall/                              # Mall application
    ├── models.py                      # Category, Business, ProductItem, ServiceItem, Order, Booking
    ├── views.py                       # Storefront, Explore, Dashboard, and JSON APIs
    ├── urls.py                        # Application URLs
    ├── admin.py                       # Django Admin configuration
    ├── context_processors.py          # Platform global variables
    ├── management/commands/
    │   └── seed_mall.py               # Database seeder with Malawian businesses & inventory
    ├── templates/mall/                # HTML5 templates styled with Tailwind CSS
    │   ├── base.html                  # Main layout with typography & meta tags
    │   ├── home.html                  # Mall homepage
    │   ├── explore.html               # Search & city directory
    │   ├── mini_site.html             # Merchant mini-website & dedicated footer
    │   ├── dashboard.html             # Merchant overview & stats
    │   ├── dashboard_inventory.html   # Stock & catalogue editor
    │   ├── dashboard_orders.html      # Order fulfillment manager
    │   ├── admin_panel.html           # SuperMall central admin console
    │   └── includes/                  # Reusable components
    │       ├── header.html            # Navigation header
    │       ├── footer.html            # Mall platform footer
    │       ├── cart_drawer.html       # Shopping bag drawer & receipt modal
    │       └── booking_modal.html     # Appointment reservation modal
    └── static/
        ├── css/styles.css             # Typography & theme styling
        └── js/
            ├── cart.js                # Shopping bag state & checkout AJAX
            └── booking.js             # Booking modal handler
```
