from django.core.management.base import BaseCommand
from mall.models import Category, Business, OpeningHour, ServiceItem, ProductItem, Review, GalleryImage

class Command(BaseCommand):
    help = 'Seeds initial Malawi businesses, categories, and inventory for SuperMall'

    def handle(self, *args, **options):
        self.stdout.write('Seeding SuperMall categories...')

        categories_data = [
            {
                'name': 'Fashion & Clothing',
                'slug': 'fashion-clothing',
                'icon': 'Shirt',
                'description': 'Boutiques, Chitenge fashion, modern urban apparel, and bespoke tailoring.',
                'image': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
            },
            {
                'name': 'Food & Dining',
                'slug': 'food-dining',
                'icon': 'Utensils',
                'description': 'Artisanal cafes, local Malawian grills, and fine dining restaurants.',
                'image': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
            },
            {
                'name': 'Beauty & Wellness',
                'slug': 'beauty-wellness',
                'icon': 'Sparkles',
                'description': 'Hair salons, barbers, spas, skincare specialists, and cosmetics.',
                'image': 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80',
            },
            {
                'name': 'Electronics & Tech',
                'slug': 'electronics-tech',
                'icon': 'Laptop',
                'description': 'Smartphones, laptop computers, solar energy kits, and repair services.',
                'image': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
            },
            {
                'name': 'Health & Medical',
                'slug': 'health-medical',
                'icon': 'HeartPulse',
                'description': 'Pharmacies, dental clinics, optical centers, and wellness practitioners.',
                'image': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
            },
            {
                'name': 'Home & Furniture',
                'slug': 'home-furniture',
                'icon': 'Home',
                'description': 'Hardwood furniture, interior decor, kitchenware, and textiles.',
                'image': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
            },
            {
                'name': 'Professional Services',
                'slug': 'professional-services',
                'icon': 'Briefcase',
                'description': 'Legal advisors, audit firms, architects, printing, and branding.',
                'image': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
            },
            {
                'name': 'Auto & Transport',
                'slug': 'auto-transport',
                'icon': 'Car',
                'description': 'Mechanics, car rental agencies, spare parts dealers, and detailing.',
                'image': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
            },
        ]

        cat_objs = {}
        for cdata in categories_data:
            cat, _ = Category.objects.update_or_create(slug=cdata['slug'], defaults=cdata)
            cat_objs[cdata['slug']] = cat

        self.stdout.write('Seeding flagship Malawian businesses...')

        # Business 1: Zikomo African Prints
        biz1, _ = Business.objects.update_or_create(
            slug='zikomo-african-prints',
            defaults={
                'name': 'Zikomo African Prints & Boutique',
                'category': cat_objs['fashion-clothing'],
                'tagline': 'Contemporary African Wear & Bespoke Tailoring in Blantyre',
                'description': 'Zikomo African Prints is a premier Malawian fashion boutique specializing in bespoke tailored suits, vibrant Chitenge dresses, and modern accessories. We blend traditional heritage fabrics with contemporary urban silhouettes.',
                'location': 'Victoria Avenue, City Centre',
                'city': 'Blantyre',
                'phone': '+265 888 123 456',
                'email': 'orders@zikomo-prints.mw',
                'whatsapp': '+265 888 123 456',
                'logo': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
                'cover_image': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80',
                'rating': 4.9,
                'review_count': 38,
                'verified': True,
                'featured': True,
                'tier': 'premium',
                'commerce_mode': 'both',
                'custom_domain': 'zikomoprints.mw',
            }
        )

        # Products for Zikomo
        products_zikomo = [
            {
                'name': 'Handcrafted Chitenge Maxi Dress',
                'description': 'Stunning Ankara wax print maxi gown with ruffled sleeves and fitted waistline.',
                'price': 45000,
                'category': 'Dresses',
                'image': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
                'stock': 14,
                'sizes': 'S, M, L, XL',
                'in_stock': True,
                'featured': True,
            },
            {
                'name': 'Tailored African Blazer Jacket',
                'description': 'Men tailored premium single-breasted blazer with contrast Chitenge lapel.',
                'price': 65000,
                'category': 'Blazers & Suits',
                'image': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
                'stock': 9,
                'sizes': '38R, 40R, 42R, 44R',
                'in_stock': True,
                'featured': True,
            },
            {
                'name': 'Handwoven Beaded Tote Bag',
                'description': 'Local Malawian handcrafted woven reed tote bag with leather strap handles.',
                'price': 22000,
                'category': 'Accessories',
                'image': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
                'stock': 25,
                'sizes': 'One Size',
                'in_stock': True,
                'featured': False,
            },
            {
                'name': 'Chitenge Silk Blend Scarf',
                'description': 'Soft luxurious scarf patterned with indigenous Malawian sunset motifs.',
                'price': 15000,
                'category': 'Accessories',
                'image': 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
                'stock': 30,
                'sizes': 'One Size',
                'in_stock': True,
                'featured': False,
            },
        ]

        for p in products_zikomo:
            ProductItem.objects.update_or_create(business=biz1, name=p['name'], defaults=p)

        # Services for Zikomo
        ServiceItem.objects.update_or_create(
            business=biz1,
            name='Custom Fitting & Bespoke Tailoring Consultation',
            defaults={
                'description': 'One-on-one session with our master tailor for measurements and fabric selection.',
                'price': 10000,
                'duration_minutes': 45,
                'category': 'Tailoring',
                'popular': True,
            }
        )

        # Business 2: Nyika Coffee & Eatery
        biz2, _ = Business.objects.update_or_create(
            slug='nyika-coffee-roasters',
            defaults={
                'name': 'Nyika Specialty Coffee Roasters & Cafe',
                'category': cat_objs['food-dining'],
                'tagline': 'Highland Arabica Coffee & Artisan Bakery in Lilongwe',
                'description': 'Savor single-origin coffees sourced directly from northern Malawi highland smallholders. Fresh pastries, breakfast bowls, and light lunches roasted daily.',
                'location': 'Area 10, Presidential Drive',
                'city': 'Lilongwe',
                'phone': '+265 999 456 789',
                'email': 'hello@nyikacoffee.mw',
                'whatsapp': '+265 999 456 789',
                'logo': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
                'cover_image': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
                'rating': 4.8,
                'review_count': 62,
                'verified': True,
                'featured': True,
                'tier': 'premium',
                'commerce_mode': 'cart',
            }
        )

        ProductItem.objects.update_or_create(
            business=biz2,
            name='Nyika Highland Reserve Whole Bean (500g)',
            defaults={
                'description': 'Award-winning medium roast Arabica with dark chocolate and citrus notes.',
                'price': 16500,
                'category': 'Coffee Beans',
                'image': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
                'stock': 40,
                'in_stock': True,
                'featured': True,
            }
        )

        # Business 3: Flamingo Spa
        biz3, _ = Business.objects.update_or_create(
            slug='flamingo-hair-beauty-spa',
            defaults={
                'name': 'Flamingo Hair & Organic Day Spa',
                'category': cat_objs['beauty-wellness'],
                'tagline': 'Luxury Hair Styling, Facial Therapies & Body Wellness',
                'description': 'Full-service wellness sanctuary offering rejuvenating massages, natural hair braiding, revitalizing facials, and luxury nail care in Blantyre.',
                'location': 'Robins Road, Sunnyside',
                'city': 'Blantyre',
                'phone': '+265 884 987 654',
                'email': 'spa@flamingomalawi.com',
                'whatsapp': '+265 884 987 654',
                'logo': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
                'cover_image': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
                'rating': 4.9,
                'review_count': 45,
                'verified': True,
                'featured': True,
                'tier': 'business',
                'commerce_mode': 'booking',
            }
        )

        # Services for Flamingo
        ServiceItem.objects.update_or_create(
            business=biz3,
            name='Malawi Baobab Oil Deep Tissue Massage',
            defaults={
                'description': '60-minute full body relaxation massage utilizing organic cold-pressed baobab oils.',
                'price': 35000,
                'duration_minutes': 60,
                'category': 'Massage',
                'popular': True,
            }
        )
        ServiceItem.objects.update_or_create(
            business=biz3,
            name='Luxury Knotless Braids & Scalp Treatment',
            defaults={
                'description': 'Pain-free knotless protective styling with deep conditioning tea tree treatment.',
                'price': 28000,
                'duration_minutes': 120,
                'category': 'Hair Care',
                'popular': True,
            }
        )

        # Add default hours
        for b in [biz1, biz2, biz3]:
            OpeningHour.objects.update_or_create(business=b, day='Monday - Friday', defaults={'open_time': '08:30', 'close_time': '18:00', 'is_closed': False})
            OpeningHour.objects.update_or_create(business=b, day='Saturday', defaults={'open_time': '09:00', 'close_time': '17:00', 'is_closed': False})
            OpeningHour.objects.update_or_create(business=b, day='Sunday', defaults={'open_time': '10:00', 'close_time': '15:00', 'is_closed': True})

            Review.objects.update_or_create(
                business=b,
                customer_name='Chifundo Banda',
                defaults={
                    'rating': 5,
                    'comment': f'Outstanding customer service and highest quality in Malawi! Highly recommended.',
                    'service_used': 'Store Purchase',
                    'verified': True,
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded SuperMall database!'))
