from django.contrib import admin
from .models import (
    Category, Business, OpeningHour, ServiceItem, ProductItem,
    GalleryImage, Booking, Order, OrderItem, Review
)

class OpeningHourInline(admin.TabularInline):
    model = OpeningHour
    extra = 1

class ServiceItemInline(admin.StackedInline):
    model = ServiceItem
    extra = 1

class ProductItemInline(admin.StackedInline):
    model = ProductItem
    extra = 1

class GalleryImageInline(admin.TabularInline):
    model = GalleryImage
    extra = 1

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'price', 'quantity', 'selected_size')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ('name', 'commerce_mode', 'city', 'category', 'tier', 'status', 'verified', 'featured', 'rating', 'review_count')
    list_filter = ('commerce_mode', 'city', 'category', 'status', 'tier', 'verified', 'featured')
    search_fields = ('name', 'description', 'location', 'phone', 'email')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [OpeningHourInline, ServiceItemInline, ProductItemInline, GalleryImageInline]

@admin.register(ProductItem)
class ProductItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'business', 'price', 'category', 'stock', 'in_stock', 'featured')
    list_filter = ('business', 'in_stock', 'featured', 'category')
    search_fields = ('name', 'description', 'sku')

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'business', 'created_at')
    list_filter = ('business',)
    search_fields = ('title', 'caption')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_ref', 'business', 'customer_name', 'customer_phone', 'date', 'time_slot', 'status')
    list_filter = ('status', 'business', 'date')
    search_fields = ('booking_ref', 'customer_name', 'customer_phone', 'customer_email')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_ref', 'business', 'customer_name', 'customer_phone', 'total', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'delivery_option', 'business')
    search_fields = ('order_ref', 'customer_name', 'customer_phone', 'delivery_address')
    inlines = [OrderItemInline]

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('business', 'customer_name', 'rating', 'created_at', 'verified')
    list_filter = ('rating', 'verified', 'business')
