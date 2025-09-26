// Check authentication
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
});

// Load dashboard data
async function loadDashboardData() {
    try {
        // Simulate API calls
        const products = await fetch('../backend/api/products.php').then(res => res.json());
        const orders = await fetch('../backend/api/admin/orders.php').then(res => res.json());
        
        // Update stats
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('pendingOrders').textContent = orders.filter(order => order.status === 'pending').length;
        
        const revenue = orders.reduce((total, order) => total + parseFloat(order.total), 0);
        document.getElementById('totalRevenue').textContent = `$${revenue.toFixed(2)}`;
        
        // Load recent orders
        const recentOrders = orders.slice(0, 5);
        const ordersList = document.getElementById('recentOrdersList');
        ordersList.innerHTML = recentOrders.map(order => `
            <div class="order-item">
                <p>Order #${order.id} - ${order.customer_name} - $${order.total} - ${order.status}</p>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

loadDashboardData();