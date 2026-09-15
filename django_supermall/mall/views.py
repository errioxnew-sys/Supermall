import json
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Avg
from django.utils import timezone
from .models import (
    Category, Business, ProductItem, ServiceItem, Booking,
    Order, OrderItem, Review, OpeningHour, GalleryImage, handle_storage_image
)

def home_view(request):
    categories = Category.objects.all()
    featured_businesses = Business.objects.filter(status='active', featured=True)[:6]
    recent_businesses = Business.objects.filter(status='active').order_by('-created_at')[:8]
    
    context = {
        'categories': categories,
        'featured_businesses': featured_businesses,
        'recent_businesses': recent_businesses,
        'active_nav': 'home',
    }
    return render(request, 'mall/home.html', context)


def explore_view(request):
    categories = Category.objects.all()
    query = request.GET.get('q', '').strip()
    selected_city = request.GET.get('city', '').strip()
    selected_category_slug = request.GET.get('category', '').strip()

    businesses = Business.objects.filter(status='active')

    if query:
        businesses = businesses.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(tagline__icontains=query) |
            Q(location__icontains=query)
        )
    if selected_city:
        businesses = businesses.filter(city__iexact=selected_city)
    if selected_category_slug:
        businesses = businesses.filter(category__slug=selected_category_slug)

    context = {
        'categories': categories,
        'businesses': businesses,
        'query': query,
        'selected_city': selected_city,
        'selected_category_slug': selected_category_slug,
        'active_nav': 'explore',
    }
    return render(request, 'mall/explore.html', context)


def mini_site_view(request, slug):
    business = get_object_or_404(Business, slug=slug)
    products = business.products.all()
    services = business.services.all()
    reviews = business.reviews.all()
    opening_hours = business.opening_hours.all()
    gallery_images = business.gallery.all()

    # Product category filter for storefront
    product_categories = list(set(products.values_list('category', flat=True)))

    context = {
        'business': business,
        'products': products,
        'services': services,
        'reviews': reviews,
        'opening_hours': opening_hours,
        'gallery_images': gallery_images,
        'product_categories': product_categories,
        'active_nav': 'mini_site',
    }
    return render(request, 'mall/mini_site.html', context)


def merchant_dashboard_view(request, slug):
    business = get_object_or_404(Business, slug=slug)
    bookings = business.bookings.all()[:10]
    orders = business.orders.all()[:10]
    products_count = business.products.count()
    
    total_sales = sum(o.total for o in business.orders.exclude(status='cancelled'))

    context = {
        'business': business,
        'bookings': bookings,
        'orders': orders,
        'products_count': products_count,
        'total_sales': total_sales,
        'active_tab': 'overview',
    }
    return render(request, 'mall/dashboard.html', context)


def merchant_inventory_view(request, slug):
    business = get_object_or_404(Business, slug=slug)
    
    if request.method == 'POST':
        # Add new product
        name = request.POST.get('name')
        price = request.POST.get('price', 0)
        category = request.POST.get('category', 'General')
        description = request.POST.get('description', '')
        image_input = request.FILES.get('image_file') or request.FILES.get('image') or request.POST.get('imageData') or request.POST.get('image', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80')
        stock = request.POST.get('stock', 10)
        sizes = request.POST.get('sizes', '')
        sku = request.POST.get('sku', '')

        if name and price:
            prod = ProductItem(
                business=business,
                name=name,
                price=int(price),
                category=category,
                description=description,
                stock=int(stock),
                sizes=sizes,
                sku=sku or f"{slug[:4].upper()}-{ProductItem.objects.count() + 1}",
                in_stock=int(stock) > 0
            )
            handle_storage_image(prod, 'image_file', 'image', image_input, prefix=f"prod_{slug}")
            prod.save()
            return redirect('mall:merchant_inventory', slug=slug)

    products = business.products.all()
    context = {
        'business': business,
        'products': products,
        'active_tab': 'inventory',
    }
    return render(request, 'mall/dashboard_inventory.html', context)


def merchant_orders_view(request, slug):
    business = get_object_or_404(Business, slug=slug)
    status_filter = request.GET.get('status', 'all')

    orders = business.orders.all()
    if status_filter != 'all':
        orders = orders.filter(status=status_filter)

    context = {
        'business': business,
        'orders': orders,
        'status_filter': status_filter,
        'active_tab': 'orders',
    }
    return render(request, 'mall/dashboard_orders.html', context)


def admin_panel_view(request):
    businesses = Business.objects.all()
    categories = Category.objects.all()
    bookings = Booking.objects.all()[:30]
    orders = Order.objects.all()[:30]
    
    context = {
        'businesses': businesses,
        'categories': categories,
        'bookings': bookings,
        'orders': orders,
        'active_nav': 'admin',
    }
    return render(request, 'mall/admin_panel.html', context)


# -------------------------------------------------------------
# JSON APIs for Interactive Cart, Bookings & Orders
# -------------------------------------------------------------

@csrf_exempt
def api_create_order(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    
    try:
        data = json.loads(request.body)
        business_id = data.get('businessId') or data.get('business_id')
        business = get_object_or_404(Business, id=business_id)

        items_data = data.get('items', [])
        if not items_data:
            return JsonResponse({'error': 'No items in cart'}, status=400)

        subtotal = int(data.get('subtotal', 0))
        delivery_fee = int(data.get('deliveryFee', 0))
        total = int(data.get('total', subtotal + delivery_fee))

        order = Order.objects.create(
            business=business,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            total=total,
            currency='MWK',
            customer_name=data.get('customerName', 'Guest Buyer'),
            customer_phone=data.get('customerPhone', ''),
            customer_email=data.get('customerEmail', ''),
            delivery_option=data.get('deliveryOption', 'delivery'),
            delivery_address=data.get('deliveryAddress', ''),
            payment_method=data.get('paymentMethod', 'airtel_money'),
            notes=data.get('notes', ''),
            status='pending',
        )

        for item in items_data:
            prod_id = item.get('productId') or item.get('product_id')
            product = None
            if prod_id:
                try:
                    product = ProductItem.objects.get(id=prod_id)
                    # Deduct stock
                    qty = int(item.get('quantity', 1))
                    product.stock = max(0, product.stock - qty)
                    product.in_stock = product.stock > 0
                    product.save()
                except ProductItem.DoesNotExist:
                    pass

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=item.get('productName') or (product.name if product else 'Item'),
                price=int(item.get('price', 0)),
                quantity=int(item.get('quantity', 1)),
                selected_size=item.get('selectedSize', ''),
                image=item.get('image', ''),
            )

        return JsonResponse({
            'success': True,
            'orderRef': order.order_ref,
            'orderId': order.id,
            'total': order.total,
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def api_update_order_status(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        data = json.loads(request.body)
        order_id = data.get('orderId')
        new_status = data.get('status')
        order = get_object_or_404(Order, id=order_id)
        order.status = new_status
        order.save()
        return JsonResponse({'success': True, 'status': order.status})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def api_create_booking(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        data = json.loads(request.body)
        business_id = data.get('businessId')
        business = get_object_or_404(Business, id=business_id)

        booking = Booking.objects.create(
            business=business,
            service_name=data.get('serviceName', 'General Appointment'),
            price=int(data.get('price', 0)),
            customer_name=data.get('customerName', ''),
            customer_phone=data.get('customerPhone', ''),
            customer_email=data.get('customerEmail', ''),
            date=data.get('date'),
            time_slot=data.get('timeSlot', '10:00 AM'),
            notes=data.get('notes', ''),
            status='pending',
        )
        return JsonResponse({
            'success': True,
            'bookingRef': booking.booking_ref,
            'bookingId': booking.id,
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def api_update_booking_status(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        data = json.loads(request.body)
        booking_id = data.get('bookingId')
        new_status = data.get('status')
        booking = get_object_or_404(Booking, id=booking_id)
        booking.status = new_status
        booking.save()
        return JsonResponse({'success': True, 'status': booking.status})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def api_create_review(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        data = json.loads(request.body)
        business_id = data.get('businessId')
        business = get_object_or_404(Business, id=business_id)

        rating = int(data.get('rating', 5))
        review = Review.objects.create(
            business=business,
            customer_name=data.get('customerName', 'Anonymous Buyer'),
            rating=rating,
            comment=data.get('comment', ''),
            service_used=data.get('serviceUsed', ''),
            verified=True,
        )

        # Recalculate average rating
        all_reviews = business.reviews.all()
        avg_rating = all_reviews.aggregate(Avg('rating'))['rating__avg'] or 5.0
        business.rating = round(avg_rating, 1)
        business.review_count = all_reviews.count()
        business.save()

        return JsonResponse({'success': True, 'reviewId': review.id, 'newRating': float(business.rating)})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def api_create_merchant(request):
    """Backend Admin-only provisioning of new stores"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        data = json.loads(request.body)
        cat_slug = data.get('categorySlug')
        category = Category.objects.filter(slug=cat_slug).first() or Category.objects.first()

        name = data.get('name')
        slug = data.get('slug')
        commerce_mode = data.get('commerceMode') or data.get('commerce_mode') or 'both'
        
        business = Business(
            name=name,
            slug=slug,
            category=category,
            tagline=data.get('tagline', ''),
            description=data.get('description', ''),
            location=data.get('location', 'Victoria Avenue'),
            city=data.get('city', 'Blantyre'),
            phone=data.get('phone', '+265 999 123 456'),
            email=data.get('email', f"{slug}@supermall.mw"),
            whatsapp=data.get('whatsapp', '+265 999 123 456'),
            website=data.get('website', ''),
            tier=data.get('tier', 'business'),
            commerce_mode=commerce_mode,
            verified=True,
            status='active',
        )
        
        # Save logo and cover_image from internal storage file/data or fallback URL
        logo_data = data.get('logo') or 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80'
        cover_data = data.get('coverImage') or data.get('cover_image') or 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80'
        handle_storage_image(business, 'logo_file', 'logo', logo_data, prefix=f"logo_{slug}")
        handle_storage_image(business, 'cover_file', 'cover_image', cover_data, prefix=f"cover_{slug}")
        business.save()

        # Setup standard opening hours
        days = ['Monday - Friday', 'Saturday', 'Sunday']
        for idx, d in enumerate(days):
            OpeningHour.objects.create(
                business=business,
                day=d,
                open_time='08:30' if idx < 2 else '10:00',
                close_time='18:00' if idx < 2 else '14:00',
                is_closed=(idx == 2)
            )

        # Flagship product if cart or both
        if commerce_mode in ['cart', 'both']:
            flagship = ProductItem(
                business=business,
                name=f"{name} Flagship Offering",
                price=25000,
                category=category.name,
                description='Authentic high-grade merchandise available for direct cart purchase.',
                stock=20,
                sizes='S, M, L, XL',
                in_stock=True,
                featured=True,
            )
            handle_storage_image(flagship, 'image_file', 'image', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80', prefix=f"flagship_{slug}")
            flagship.save()

        # Standard Service if booking or both
        if commerce_mode in ['booking', 'both']:
            ServiceItem.objects.create(
                business=business,
                name=f"{name} Signature Service",
                price=15000,
                duration_minutes=45,
                category=category.name,
                description='Professional consultation or direct appointment session.',
                popular=True
            )

        return JsonResponse({
            'success': True,
            'businessSlug': business.slug,
            'businessId': business.id,
            'commerceMode': business.commerce_mode
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def api_add_gallery_photo(request, slug):
    """Adds a photo from local device internal storage to business portfolio"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        business = get_object_or_404(Business, slug=slug)
        title = request.POST.get('title', '')
        caption = request.POST.get('caption', '')
        image_input = request.FILES.get('image_file') or request.FILES.get('image') or request.POST.get('imageData') or request.POST.get('image')

        gallery_item = GalleryImage(business=business, title=title, caption=caption)
        handle_storage_image(gallery_item, 'image_file', 'image', image_input, prefix=f"gallery_{slug}")
        gallery_item.save()

        return JsonResponse({
            'success': True,
            'id': gallery_item.id,
            'title': gallery_item.title,
            'imageUrl': gallery_item.get_image_url(),
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def api_update_business_mode(request, slug):
    """Allows admins or business owners to toggle booking / cart / both mode"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        business = get_object_or_404(Business, slug=slug)
        data = json.loads(request.body)
        new_mode = data.get('commerceMode') or data.get('commerce_mode')
        if new_mode in ['booking', 'cart', 'both']:
            business.commerce_mode = new_mode
            business.save()
            return JsonResponse({'success': True, 'commerceMode': business.commerce_mode})
        return JsonResponse({'error': 'Invalid commerce mode. Must be booking, cart, or both.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def api_seed_database(request):
    from django.core.management import call_command
    try:
        call_command('seed_mall')
        return JsonResponse({'success': True, 'message': 'SuperMall database seeded successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
