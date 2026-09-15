from django.db import models
from django.utils import timezone
from django.core.files.base import ContentFile
import uuid
import base64

def handle_storage_image(instance, file_field_name, url_field_name, data_or_file, prefix='upload'):
    """Helper to save either an uploaded file (request.FILES), base64 Data URL, or web URL."""
    if not data_or_file:
        return
    # If it's a Django UploadedFile object from request.FILES
    if hasattr(data_or_file, 'read'):
        field = getattr(instance, file_field_name)
        field.save(data_or_file.name, data_or_file, save=False)
    # If it's a base64 Data URL from local storage file picker
    elif isinstance(data_or_file, str) and data_or_file.startswith('data:image'):
        try:
            header, base64_data = data_or_file.split(';base64,')
            ext = header.split('/')[-1]
            if '+' in ext:
                ext = ext.split('+')[0]
            if ext == 'jpeg':
                ext = 'jpg'
            file_name = f"{prefix}_{uuid.uuid4().hex[:8]}.{ext}"
            content_file = ContentFile(base64.b64decode(base64_data), name=file_name)
            field = getattr(instance, file_field_name)
            field.save(file_name, content_file, save=False)
        except Exception:
            pass
    # If it's a standard URL string
    elif isinstance(data_or_file, str) and (data_or_file.startswith('http://') or data_or_file.startswith('https://') or data_or_file.startswith('/media/')):
        setattr(instance, url_field_name, data_or_file)


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, default='ShoppingBag', help_text='Lucide icon name')
    description = models.TextField(blank=True)
    image = models.URLField(max_length=500, blank=True)
    image_file = models.ImageField(upload_to='categories/', blank=True, null=True, help_text='Internal storage photo')

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_image_url(self):
        if self.image_file:
            return self.image_file.url
        return self.image or 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80'


class Business(models.Model):
    CITY_CHOICES = [
        ('Blantyre', 'Blantyre'),
        ('Lilongwe', 'Lilongwe'),
        ('Mzuzu', 'Mzuzu'),
        ('Zomba', 'Zomba'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('pending_verification', 'Pending Verification'),
        ('suspended', 'Suspended'),
    ]

    TIER_CHOICES = [
        ('free', 'Free Basic'),
        ('business', 'Business Store'),
        ('premium', 'Premium Brand'),
    ]

    COMMERCE_MODE_CHOICES = [
        ('booking', 'Booking Only'),
        ('cart', 'Cart Only'),
        ('both', 'Booking and Cart'),
    ]

    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='businesses')
    tagline = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    location = models.CharField(max_length=255)
    city = models.CharField(max_length=50, choices=CITY_CHOICES, default='Blantyre')
    phone = models.CharField(max_length=50)
    email = models.EmailField()
    whatsapp = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    logo = models.URLField(max_length=500, blank=True)
    logo_file = models.ImageField(upload_to='businesses/logos/', blank=True, null=True, help_text='Internal storage logo')
    cover_image = models.URLField(max_length=500, blank=True)
    cover_file = models.ImageField(upload_to='businesses/covers/', blank=True, null=True, help_text='Internal storage cover')
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    review_count = models.PositiveIntegerField(default=0)
    verified = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='active')
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='business')
    commerce_mode = models.CharField(
        max_length=20,
        choices=COMMERCE_MODE_CHOICES,
        default='both',
        help_text='Capability mode: Booking Only, Cart Only, or Both'
    )
    custom_domain = models.CharField(max_length=150, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Businesses'
        ordering = ['-featured', '-rating', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_commerce_mode_display()})"

    def get_logo_url(self):
        if self.logo_file:
            return self.logo_file.url
        return self.logo or 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80'

    def get_cover_url(self):
        if self.cover_file:
            return self.cover_file.url
        return self.cover_image or 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80'

    @property
    def has_booking(self):
        return self.commerce_mode in ['booking', 'both']

    @property
    def has_cart(self):
        return self.commerce_mode in ['cart', 'both']

    @property
    def is_fashion_or_beauty(self):
        return self.category.slug in ['fashion-clothing', 'beauty-wellness'] or self.products.exists()


class OpeningHour(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='opening_hours')
    day = models.CharField(max_length=50)
    open_time = models.CharField(max_length=20, default='08:30')
    close_time = models.CharField(max_length=20, default='18:00')
    is_closed = models.BooleanField(default=False)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.business.name} - {self.day}"


class ServiceItem(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    price = models.PositiveIntegerField(help_text='Price in MWK')
    duration_minutes = models.PositiveIntegerField(default=45)
    category = models.CharField(max_length=100, blank=True)
    popular = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.business.name})"


class ProductItem(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    price = models.PositiveIntegerField(help_text='Price in MWK')
    category = models.CharField(max_length=100, default='General')
    image = models.URLField(max_length=500, blank=True)
    image_file = models.ImageField(upload_to='products/', blank=True, null=True, help_text='Internal storage product image')
    stock = models.PositiveIntegerField(default=10)
    sku = models.CharField(max_length=50, blank=True)
    sizes = models.CharField(max_length=100, blank=True, help_text='Comma separated, e.g. S, M, L, XL')
    in_stock = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-featured', 'name']

    def __str__(self):
        return f"{self.name} - MWK {self.price:,}"

    def size_list(self):
        if not self.sizes:
            return []
        return [s.strip() for s in self.sizes.split(',') if s.strip()]

    def get_image_url(self):
        if self.image_file:
            return self.image_file.url
        return self.image or 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80'


class GalleryImage(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='gallery')
    title = models.CharField(max_length=150, blank=True)
    caption = models.CharField(max_length=255, blank=True)
    image = models.URLField(max_length=500, blank=True)
    image_file = models.ImageField(upload_to='businesses/gallery/', blank=True, null=True, help_text='Internal storage gallery photo')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title or 'Gallery Photo'} ({self.business.name})"

    def get_image_url(self):
        if self.image_file:
            return self.image_file.url
        return self.image or 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]

    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='bookings')
    booking_ref = models.CharField(max_length=20, unique=True, blank=True)
    service_name = models.CharField(max_length=150)
    price = models.PositiveIntegerField(default=0)
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=50)
    customer_email = models.EmailField(blank=True)
    date = models.DateField()
    time_slot = models.CharField(max_length=50)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.booking_ref:
            self.booking_ref = f"BK-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_ref} - {self.customer_name} ({self.business.name})"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('dispatched', 'Dispatched / In Transit'),
        ('completed', 'Completed / Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    DELIVERY_CHOICES = [
        ('pickup', 'Store Pickup'),
        ('delivery', 'Local Delivery'),
    ]

    PAYMENT_CHOICES = [
        ('airtel_money', 'Airtel Money'),
        ('tnm_mpamba', 'TNM Mpamba'),
        ('cash_on_delivery', 'Cash on Handover'),
    ]

    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='orders')
    order_ref = models.CharField(max_length=30, unique=True, blank=True)
    subtotal = models.PositiveIntegerField()
    delivery_fee = models.PositiveIntegerField(default=0)
    total = models.PositiveIntegerField()
    currency = models.CharField(max_length=10, default='MWK')
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=50)
    customer_email = models.EmailField(blank=True)
    delivery_option = models.CharField(max_length=20, choices=DELIVERY_CHOICES, default='delivery')
    delivery_address = models.CharField(max_length=255, blank=True)
    payment_method = models.CharField(max_length=30, choices=PAYMENT_CHOICES, default='airtel_money')
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_ref:
            self.order_ref = f"SM-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order_ref} - {self.customer_name} (MWK {self.total:,})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(ProductItem, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=150)
    price = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField(default=1)
    selected_size = models.CharField(max_length=50, blank=True)
    image = models.URLField(max_length=500, blank=True)

    def __str__(self):
        return f"{self.quantity}x {self.product_name}"


class Review(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='reviews')
    customer_name = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField(default=5)
    comment = models.TextField()
    service_used = models.CharField(max_length=100, blank=True)
    verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.customer_name} - {self.business.name} ({self.rating} stars)"
