async function loadDashboardData() {
    try {
        // Load products count
        const productsResponse = await fetch('../backend/api/products.php');
        const productsData = await productsResponse.json();
        document.getElementById('total-products').textContent = productsData.products ? productsData.products.length : 0;
        
        // Load orders data (you'll need to implement this API)
        const ordersResponse = await fetch('api/admin-orders.php');
        const ordersData = await ordersResponse.json();
        
        if (ordersData.success) {
            const orders = ordersData.orders || [];
            document.getElementById('total-orders').textContent = orders.length;
            
            // Calculate revenue and pending orders
            let totalRevenue = 0;
            let pendingOrders = 0;
            
            orders.forEach(order => {
                totalRevenue += parseFloat(order.total_amount) || 0;
                if (order.status === 'pending') {
                    pendingOrders++;
                }
            });
            
            document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
            document.getElementById('pending-orders').textContent = pendingOrders;
            
            // Load recent orders
            loadRecentOrders(orders.slice(0, 5));
        }
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function loadRecentOrders(orders) {
    const tbody = document.getElementById('recent-orders-body');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No orders found</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.order_id}</td>
            <td>${order.customer_name}</td>
            <td>$${parseFloat(order.total_amount).toFixed(2)}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('total-orders')) {
        loadDashboardData();
    }
});