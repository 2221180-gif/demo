// Cart Page Management with TAKA
class CartPage {
    constructor() {
        this.cart = this.loadCart();
        this.relatedProducts = this.getRelatedProducts();
        this.init();
    }

    init() {
        this.renderCart();
        this.setupEventListeners();
        this.updateCartStats();
        this.renderRelatedProducts();
    }

    loadCart() {
        const savedCart = localStorage.getItem('freshcar_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('freshcar_cart', JSON.stringify(this.cart));
    }

    // Format price in Taka with comma separation
    formatPrice(price) {
        return `৳${parseFloat(price).toLocaleString('en-BD')}`;
    }

    renderCart() {
        const emptyCart = document.getElementById('emptyCart');
        const cartItems = document.getElementById('cartItems');
        const cartItemsList = document.getElementById('cartItemsList');

        if (this.cart.length === 0) {
            emptyCart.style.display = 'block';
            cartItems.style.display = 'none';
            return;
        }

        emptyCart.style.display = 'none';
        cartItems.style.display = 'block';

        cartItemsList.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-product">
                    <img src="${item.image || 'https://via.placeholder.com/80'}" 
                         alt="${item.name}" 
                         class="cart-item-image"
                         onerror="this.src='https://via.placeholder.com/80?text=🌲'">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-description">${this.getProductDescription(item.id)}</div>
                    </div>
                </div>
                <div class="cart-item-price">${this.formatPrice(item.price)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-control minus" data-product-id="${item.id}">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-control plus" data-product-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">${this.formatPrice(item.price * item.quantity)}</div>
                <button class="cart-item-remove" data-product-id="${item.id}" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    getProductDescription(productId) {
        const descriptions = {
            'pine-forest-vent-clip': 'তাজা পাইন সুগন্ধ যা ৬০ দিন পর্যন্ত স্থায়ী হয়',
            'lemon-fresh-spray': 'তাত্ক্ষণিক সতেজতার জন্য জেস্টি লেবুর সুগন্ধ',
            'premium-black-car-astronaut': 'প্রিমিয়াম অ্যারোমাথেরাপি গাড়ি এয়ার ফ্রেশনার'
        };
        return descriptions[productId] || 'প্রিমিয়াম গাড়ি এয়ার ফ্রেশনার';
    }

    updateCartStats() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 5000 ? 0 : 100; // Free shipping over 5000 Taka
        const tax = subtotal * 0.05; // 5% VAT
        const total = subtotal + shipping + tax;

        // Update counts
        document.getElementById('itemsCount').textContent = 
            `${totalItems} ${totalItems === 1 ? 'আইটেম' : 'আইটেম'}`;
        document.getElementById('summaryItemsCount').textContent = totalItems;

        // Update amounts with Taka symbol
        document.getElementById('subtotalAmount').textContent = 
            this.formatPrice(subtotal);
        document.getElementById('shippingAmount').textContent = 
            shipping === 0 ? 'ফ্রি' : this.formatPrice(shipping);
        document.getElementById('taxAmount').textContent = 
            this.formatPrice(tax);
        document.getElementById('totalAmount').textContent = 
            this.formatPrice(total);

        // Update checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.disabled = this.cart.length === 0;
        
        if (this.cart.length === 0) {
            checkoutBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> কার্ট খালি';
        } else {
            checkoutBtn.innerHTML = 
                `<i class="fas fa-lock"></i> চেকআউট করুন - ${this.formatPrice(total)}`;
        }

        // Update header cart count
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    setupEventListeners() {
        // Quantity controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-control')) {
                this.handleQuantityChange(e.target);
            }
            
            if (e.target.classList.contains('cart-item-remove') || 
                e.target.closest('.cart-item-remove')) {
                const button = e.target.classList.contains('cart-item-remove') ? 
                    e.target : e.target.closest('.cart-item-remove');
                this.handleRemoveItem(button);
            }
        });

        // Checkout button
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.handleCheckout();
        });

        // Modal close
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('successModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    handleQuantityChange(button) {
        const productId = button.getAttribute('data-product-id');
        const item = this.cart.find(item => item.id === productId);
        
        if (!item) return;

        if (button.classList.contains('plus')) {
            item.quantity++;
        } else if (button.classList.contains('minus') && item.quantity > 1) {
            item.quantity--;
        }

        this.saveCart();
        this.renderCart();
        this.updateCartStats();
        this.showSuccessModal('পরিমাণ সফলভাবে আপডেট করা হয়েছে!');
    }

    handleRemoveItem(button) {
        const productId = button.getAttribute('data-product-id');
        const item = this.cart.find(item => item.id === productId);
        
        if (item && confirm(`আপনি কি নিশ্চিত যে আপনি "${item.name}" কে আপনার কার্ট থেকে সরাতে চান?`)) {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveCart();
            this.renderCart();
            this.updateCartStats();
            this.showSuccessModal('আইটেম কার্ট থেকে সরানো হয়েছে!');
        }
    }

    handleCheckout() {
        if (this.cart.length === 0) {
            alert('আপনার কার্ট খালি!');
            return;
        }

        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.classList.add('loading');
        checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> প্রসেস করা হচ্ছে...';

        setTimeout(() => {
            // Simulate checkout process
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`চেকআউট সফল! মোট金额: ${this.formatPrice(total)}\n\nঅর্ডার নম্বর: #${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
            checkoutBtn.classList.remove('loading');
            checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> চেকআউট করুন';
        }, 2000);
    }

    showSuccessModal(message) {
        const modal = document.getElementById('successModal');
        const modalBody = modal.querySelector('.modal-body p');
        
        modalBody.textContent = message;
        modal.style.display = 'block';

        setTimeout(() => {
            this.closeModal();
        }, 2000);
    }

    closeModal() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'none';
    }

    getRelatedProducts() {
        return [
            {
                id: 'ocean-breeze',
                name: 'Ocean Breeze Gel',
                price: 1150, // Approximately 10 USD
                image: '🌊'
            },
            {
                id: 'vanilla-dream',
                name: 'Vanilla Dream Spray',
                price: 920, // Approximately 8 USD
                image: '🍦'
            },
            {
                id: 'fresh-linen',
                name: 'Fresh Linen Clip',
                price: 1380, // Approximately 12 USD
                image: '🏠'
            }
        ];
    }

    renderRelatedProducts() {
        const relatedProductsContainer = document.getElementById('relatedProducts');
        
        relatedProductsContainer.innerHTML = this.relatedProducts.map(product => `
            <div class="related-product">
                <div class="related-product-image">${product.image}</div>
                <div class="related-product-name">${product.name}</div>
                <div class="related-product-price">${this.formatPrice(product.price)}</div>
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    কার্টে যোগ করুন
                </button>
            </div>
        `).join('');

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = button.getAttribute('data-product-id');
                const product = this.relatedProducts.find(p => p.id === productId);
                
                if (product) {
                    this.addRelatedProductToCart(product);
                }
            });
        });
    }

    addRelatedProductToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                ...product,
                quantity: 1,
                image: product.image
            });
        }

        this.saveCart();
        this.renderCart();
        this.updateCartStats();
        this.showSuccessModal(`${product.name} কার্টে যোগ করা হয়েছে!`);
    }
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cartPage = new CartPage();
    
    // Update all prices on the page to Taka
    document.querySelectorAll('.product-price').forEach(priceElement => {
        const priceText = priceElement.textContent;
        if (priceText.includes('$')) {
            const dollarAmount = parseFloat(priceText.replace(/[^\d.]/g, ''));
            const takaAmount = Math.round(dollarAmount * 115); // Approx conversion rate
            priceElement.textContent = `৳${takaAmount.toLocaleString('en-BD')}`;
        }
    });
    
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

    document.querySelectorAll('.cart-item, .related-product').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
   document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (window.cartPage.cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  // Ensure latest cart is saved
  localStorage.setItem("freshcar_cart", JSON.stringify(window.cartPage.cart));
  window.location.href = "checkout.html";
});



    console.log('LuxAir Cart Page Loaded Successfully with Taka Currency');
});