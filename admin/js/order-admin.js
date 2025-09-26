// Check authentication
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
});

// Load orders
async function loadOrders() {
    try {
        const response = await fetch('../backend/api/admin/orders.php');
        const orders = await response.json();
        
        const tbody = document.getElementById('ordersTableBody');
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customer_name}</td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
                <td>$${order.total}</td>
                <td><span class="status-${order.status}">${order.status}</span></td>
                <td>
                    <button class="btn-view" onclick="viewOrder(${order.id})">View</button>
                    <select onchange="updateOrderStatus(${order.id}, this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function viewOrder(id) {
    // Simulate viewing order details
    alert(`Viewing order #${id}`);
}

function updateOrderStatus(id, status) {
    // Simulate status update
    console.log(`Update order ${id} to ${status}`);
}

// Filter orders
document.getElementById('statusFilter').addEventListener('change', function() {
    // In a real app, you'd filter the orders
    loadOrders();
});

// Initial load
loadOrders();