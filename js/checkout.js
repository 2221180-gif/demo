// Checkout Page Management
class CheckoutPage {
    constructor() {
        this.cart = this.loadCart();
        this.orderData = {};
        this.init();
    }

    init() {
        this.renderCheckoutItems();
        this.updateCheckoutSummary();
        this.setupFormSubmit();
    }

    loadCart() {
        const savedCart = localStorage.getItem('freshcar_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    formatPrice(price) {
        return `৳${parseFloat(price).toLocaleString('en-BD')}`;
    }

    renderCheckoutItems() {
        const checkoutItems = document.getElementById('checkoutItems');

        if (this.cart.length === 0) {
            checkoutItems.innerHTML = '<p class="empty-message">No items in cart</p>';
            return;
        }

        checkoutItems.innerHTML = this.cart.map(item => `
            <div class="order-item">
                <img src="${item.image || 'https://via.placeholder.com/50?text=🌲'}" 
                     alt="${item.name}" 
                     class="order-item-image"
                     onerror="this.src='https://via.placeholder.com/50?text=🌲'">
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">${this.formatPrice(item.price)} × ${item.quantity}</div>
                </div>
            </div>
        `).join('');
    }

    updateCheckoutSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 5000 ? 0 : 100;
        const tax = subtotal * 0.05;
        const total = subtotal + shipping + tax;

        document.getElementById('checkoutSubtotal').textContent = this.formatPrice(subtotal);
        document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'FREE' : this.formatPrice(shipping);
        document.getElementById('checkoutTax').textContent = this.formatPrice(tax);
        document.getElementById('checkoutTotal').textContent = this.formatPrice(total);

        // Update button text
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.innerHTML = `Place Order (${this.formatPrice(total)}) <i class="fas fa-check"></i>`;
    }

    setupFormSubmit() {
        const form = document.getElementById('checkoutForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const phone = form.phone.value.trim();
            const address = form.address.value.trim();

            if (!name || !email || !phone || !address) {
                alert("⚠️ Please fill out all fields");
                return;
            }

            this.orderData = {
                name,
                email,
                phone,
                address,
                items: this.cart,
                createdAt: new Date().toISOString()
            };

            // Save to localStorage (admin can later view it)
            let allOrders = JSON.parse(localStorage.getItem('freshcar_orders')) || [];
            allOrders.push(this.orderData);
            localStorage.setItem('freshcar_orders', JSON.stringify(allOrders));

            // Clear cart
            localStorage.removeItem('freshcar_cart');

            // Redirect to thank you page
            window.location.href = "thankyou.html";
        });
    }
}

// Initialize checkout page
document.addEventListener("DOMContentLoaded", () => new CheckoutPage());
