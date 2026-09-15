from django.urls import path
from . import views

app_name = 'mall'

urlpatterns = [
    # Customer Views
    path('', views.home_view, name='home'),
    path('explore/', views.explore_view, name='explore'),
    path('s/<slug:slug>/', views.mini_site_view, name='mini_site'),

    # Merchant & Staff Portal
    path('dashboard/<slug:slug>/', views.merchant_dashboard_view, name='merchant_dashboard'),
    path('dashboard/<slug:slug>/inventory/', views.merchant_inventory_view, name='merchant_inventory'),
    path('dashboard/<slug:slug>/orders/', views.merchant_orders_view, name='merchant_orders'),

    # SuperMall Platform Admin
    path('super-admin/', views.admin_panel_view, name='admin_panel'),

    # Interactive AJAX APIs (JSON)
    path('api/orders/create/', views.api_create_order, name='api_create_order'),
    path('api/orders/update-status/', views.api_update_order_status, name='api_update_order_status'),
    path('api/bookings/create/', views.api_create_booking, name='api_create_booking'),
    path('api/bookings/update-status/', views.api_update_booking_status, name='api_update_booking_status'),
    path('api/reviews/create/', views.api_create_review, name='api_create_review'),
    path('api/merchants/create/', views.api_create_merchant, name='api_create_merchant'),
    path('api/business/<slug:slug>/mode/', views.api_update_business_mode, name='api_update_business_mode'),
    path('api/business/<slug:slug>/gallery/', views.api_add_gallery_photo, name='api_add_gallery_photo'),
    path('api/seed/', views.api_seed_database, name='api_seed_database'),
]
