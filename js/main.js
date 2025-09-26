// Cart Management System with TAKA
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('freshcar_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('freshcar_cart', JSON.stringify(this.cart));
    }

    // Update cart count in header
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.classList.add('updated');
            setTimeout(() => element.classList.remove('updated'), 300);
        });
    }

    // Add product to cart
    addToCart(productId, productName, productPrice, quantity, productImage = '') {
        const existingItemIndex = this.cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex > -1) {
            this.cart[existingItemIndex].quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                quantity: quantity,
                image: productImage
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showSuccessMessage(productName, quantity);
    }

    // Format price in Taka
    formatPrice(price) {
        return `৳${parseFloat(price).toLocaleString('en-BD')}`;
    }

    // Remove product from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    // Update product quantity in cart
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
            }
            this.updateCartCount();
        }
    }

    // Get cart total in Taka
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Show success message when item is added
    showSuccessMessage(productName, quantity) {
        let successMessage = document.getElementById('success-message');
        
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.id = 'success-message';
            successMessage.className = 'success-message';
            document.body.appendChild(successMessage);
        }
        
        successMessage.innerHTML = `
            <strong>✓ কার্টে যোগ করা হয়েছে!</strong><br>
            ${quantity} x ${productName}
        `;
        
        successMessage.classList.add('show');
        
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    }

    // Setup event listeners for add to cart buttons
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                this.handleAddToCart(e.target);
            }
            
            if (e.target.classList.contains('quantity-btn')) {
                this.handleQuantityChange(e.target);
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                this.validateQuantityInput(e.target);
            }
        });
    }

    // Handle add to cart button click
    handleAddToCart(button) {
        const productCard = button.closest('.product-card');
        const productId = this.generateProductId(productCard);
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = this.extractPrice(productCard.querySelector('.product-price').textContent);
        const quantity = parseInt(productCard.querySelector('.quantity-input').value);
        const productImage = productCard.querySelector('.product-image img')?.src || '';

        // Add loading state to button
        const originalText = button.textContent;
        button.textContent = 'যোগ করা হচ্ছে...';
        button.disabled = true;

        setTimeout(() => {
            this.addToCart(productId, productName, productPrice, quantity, productImage);
            button.textContent = originalText;
            button.disabled = false;
            productCard.querySelector('.quantity-input').value = 1;
        }, 500);
    }

    // Handle quantity button clicks
    handleQuantityChange(button) {
        const quantityInput = button.closest('.quantity-selector').querySelector('.quantity-input');
        let quantity = parseInt(quantityInput.value);

        if (button.classList.contains('plus')) {
            quantity++;
        } else if (button.classList.contains('minus') && quantity > 1) {
            quantity--;
        }

        quantityInput.value = quantity;
    }

    // Validate quantity input
    validateQuantityInput(input) {
        let value = parseInt(input.value);
        if (isNaN(value) || value < 1) {
            input.value = 1;
        }
    }

    // Generate unique product ID based on product name
    generateProductId(productCard) {
        const productName = productCard.querySelector('.product-name').textContent;
        return productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }

    // Extract price from text (handles currency symbols)
    extractPrice(priceText) {
        // Remove Taka symbol and commas, then parse
        return parseFloat(priceText.replace(/[^\d.]/g, ''));
    }
}

// Product data in TAKA
const productsData = [
    {
        id: 'pine-forest-vent-clip',
        name: 'Pine Forest Vent Clip',
        description: 'Fresh pine scent that lasts up to 60 days',
        price: 1499, // 12.99 USD ≈ 1499 BDT
        image: '🌲'
    },
    {
        id: 'lemon-fresh-spray',
        name: 'Lemon Fresh Spray',
        description: 'Zesty lemon aroma for instant freshness',
        price: 1030, // 8.99 USD ≈ 1030 BDT
        image: '🍋'
    },
    {
        id: 'premium-black-car-astronaut',
        name: 'Premium Black Car Astronaut Bear',
        description: 'Clean oceanic fragrance in gel form',
        price: 200,
        image: '🐻'
    }
];

// Update product prices on the page to show Taka
function updateProductPrices() {
    document.querySelectorAll('.product-price').forEach(priceElement => {
        const productName = priceElement.closest('.product-card').querySelector('.product-name').textContent;
        const product = productsData.find(p => p.name === productName);
        
        if (product) {
            priceElement.textContent = `৳${product.price.toLocaleString('en-BD')}`;
        }
    });
}

// Initialize the cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update all prices to Taka
    updateProductPrices();
    
    // Initialize cart manager
    window.cartManager = new CartManager();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation to product cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    console.log('FreshCar website loaded successfully with Taka currency!');
});

// Add CSS for cart count animation
const style = document.createElement('style');
style.textContent = `
    .cart-count {
        transition: all 0.3s ease;
    }
    
    .cart-count.updated {
        animation: bounce 0.3s ease;
    }
    
    @keyframes bounce {
        0%, 20%, 60%, 100% {
            transform: scale(1);
        }
        40% {
            transform: scale(1.3);
        }
        80% {
            transform: scale(1.1);
        }
    }
    
    .add-to-cart:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    /* Taka symbol styling */
    .taka-symbol {
        font-family: Arial, sans-serif;
        margin-right: 2px;
    }
`;
document.head.appendChild(style);