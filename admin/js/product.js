// products.js
class ProductsManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.filteredProducts = [];
        this.filters = {
            category: 'all',
            price: 'all',
            sort: 'featured',
            search: ''
        };
        this.init();
    }

    init() {
        this.applyFilters();
        this.renderProducts();
        this.setupEventListeners();
    }

    setupEventListeners() {
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

        document.getElementById('productSearch').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(p => {
            let matchCategory = this.filters.category === 'all' || p.category === this.filters.category;

            let matchPrice = true;
            if (this.filters.price === 'low') matchPrice = p.price < 1000;
            if (this.filters.price === 'mid') matchPrice = p.price >= 1000 && p.price <= 1500;
            if (this.filters.price === 'high') matchPrice = p.price > 1500;

            let matchSearch = p.name.toLowerCase().includes(this.filters.search) ||
                              p.description.toLowerCase().includes(this.filters.search);

            return matchCategory && matchPrice && matchSearch;
        });

        // Sorting
        if (this.filters.sort === 'priceLowHigh') {
            this.filteredProducts.sort((a, b) => a.price - b.price);
        } else if (this.filters.sort === 'priceHighLow') {
            this.filteredProducts.sort((a, b) => b.price - a.price);
        } else if (this.filters.sort === 'rating') {
            this.filteredProducts.sort((a, b) => b.rating - a.rating);
        }

        this.renderProducts();
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = '';
        if (this.filteredProducts.length === 0) {
            grid.innerHTML = `<p>No products match your filters.</p>`;
            return;
        }

        this.filteredProducts.forEach(p => {
            grid.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>৳${p.price}</p>
                <button onclick="addToCart('${p.id}')">Add to Cart</button>
            </div>`;
        });
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    window.manager = new ProductsManager();
});

// Cart function
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = manager.products.find(p => p.id == productId);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(product.name + " added to cart!");
}
