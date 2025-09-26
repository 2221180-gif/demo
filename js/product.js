// Products Management System
class ProductsManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 9;
        this.filters = {
            category: 'all',
            price: 'all',
            sort: 'featured',
            search: ''
        };
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.setupFiltersFromURL();
        this.updateCartCount();
    }

    // Sample products data
    loadProducts() {
        this.products = [
            {
                id: 1,
                name: "Pine Forest Vent Clip",
                description: "Fresh pine scent that lasts up to 60 days. Perfect for nature lovers who want their car to smell like a fresh forest walk.",
                price: 1499,
                originalPrice: 1799,
                category: "vent-clip",
                image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400",
                rating: 4.8,
                reviews: 124,
                inStock: true,
                stock: 25,
                featured: true,
                badge: "new"
            },
            {
                id: 2,
                name: "Lemon Fresh Spray",
                description: "Zesty lemon aroma for instant freshness. Quick spray formula eliminates odors instantly and leaves a refreshing citrus scent.",
                price: 1030,
                originalPrice: 1200,
                category: "spray",
                image: "https://images.unsplash.com/photo-1584305574647-0cc949270e14?w=400",
                rating: 4.5,
                reviews: 89,
                inStock: true,
                stock: 42,
                featured: true,
                badge: "sale"
            },
            {
                id: 3,
                name: "Ocean Breeze Hanging Card",
                description: "Refreshing ocean scent with long-lasting formula. Brings the fresh smell of the sea to your car interior.",
                price: 799,
                originalPrice: 999,
                category: "hanging",
                image: "https://images.unsplash.com/photo-1566228015668-4c45dbc6e2f7?w=400",
                rating: 4.7,
                reviews: 67,
                inStock: true,
                stock: 18,
                featured: false,
                badge: null
            },
            {
                id: 4,
                name: "Vanilla Bean Gel Can",
                description: "Sweet vanilla aroma in a convenient gel can. Provides continuous fragrance for up to 45 days.",
                price: 1250,
                originalPrice: 1500,
                category: "gel",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
                rating: 4.9,
                reviews: 203,
                inStock: true,
                stock: 35,
                featured: true,
                badge: "popular"
            },
            {
                id: 5,
                name: "Black Ice Air Freshener",
                description: "Bold, masculine scent with citrus and sandalwood notes. Premium fragrance for luxury vehicles.",
                price: 1699,
                originalPrice: 1999,
                category: "premium",
                image: "https://images.unsplash.com/photo-1566479179817-c097e6e82d17?w=400",
                rating: 4.6,
                reviews: 156,
                inStock: true,
                stock: 12,
                featured: true,
                badge: "premium"
            },
            {
                id: 6,
                name: "Fresh Linen Spray",
                description: "Clean linen scent that reminds you of fresh laundry. Perfect for family vehicles and daily drivers.",
                price: 899,
                originalPrice: 1099,
                category: "spray",
                image: "https://images.unsplash.com/photo-1584305574647-0cc949270e14?w=400",
                rating: 4.4,
                reviews: 78,
                inStock: true,
                stock: 30,
                featured: false,
                badge: null
            },
            {
                id: 7,
                name: "Tropical Paradise Vent Clip",
                description: "Exotic tropical fruits and flowers blend. Creates a vacation-like atmosphere in your car.",
                price: 1399,
                originalPrice: 1599,
                category: "vent-clip",
                image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400",
                rating: 4.7,
                reviews: 91,
                inStock: true,
                stock: 22,
                featured: true,
                badge: "new"
            },
            {
                id: 8,
                name: "Premium Black Car Astronaut Bear",
                description: "Premium aromatherapy car air outlet clip with unique astronaut bear design.",
                price: 200,
                originalPrice: 300,
                category: "vent-clip",
                image: "https://s.alicdn.com/@sc04/kf/Ha5ec8eff1c774ff3890c5e95842a78f3v.jpg",
                rating: 4.8,
                reviews: 234,
                inStock: true,
                stock: 50,
                featured: true,
                badge: "bestseller"
            },
            {
                id: 9,
                name: "Sandalwood Elegance Gel",
                description: "Rich sandalwood fragrance with subtle spice notes. Sophisticated scent for executive cars.",
                price: 1599,
                originalPrice: 1899,
                category: "gel",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
                rating: 4.9,
                reviews: 167,
                inStock: true,
                stock: 15,
                featured: true,
                badge: "luxury"
            }
        ];

        this.applyFilters();
        this.renderProducts();
    }

    setupEventListeners() {
        // Filter event listeners
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.applyFilters();
        });

        document.getElementById('priceFilter').addEventListener('change', (e) => {
            this.filters.price = e.target.value;
            this.applyFilters();
        });

        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.applyFilters();
        });

 function setupEventListeners() {
    document.getElementById('sortBy').addEventListener('change', (e) => {
        this.filters.sort = e.target.value;
        this.applyFilters();
    });

    document.getElementById('productSearch').addEventListener('input', (e) => {
        this.filters.search = e.target.value;
        this.applyFilters();
    });
}
