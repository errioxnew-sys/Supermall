from .models import Category, Business

def mall_globals(request):
    """Provides common data to all templates."""
    categories = Category.objects.all()
    all_businesses = Business.objects.filter(status='active')
    cities = ['Blantyre', 'Lilongwe', 'Mzuzu', 'Zomba']
    return {
        'all_categories': categories,
        'all_businesses': all_businesses,
        'cities': cities,
        'platform_name': 'SuperMall',
        'country': 'Malawi',
        'currency_code': 'MWK',
    }
