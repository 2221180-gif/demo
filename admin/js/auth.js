class AdminAuth {
    constructor() {
        this.token = localStorage.getItem('admin_token');
        this.admin = JSON.parse(localStorage.getItem('admin_user') || 'null');
    }
    
    isLoggedIn() {
        return !!(this.token && this.admin);
    }
    
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
    
    async logout() {
        try {
            if (this.token) {
                await fetch('api/admin-login.php', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            window.location.href = 'login.html';
        }
    }
    
    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }
}

const adminAuth = new AdminAuth();

// Initialize auth check on admin pages
document.addEventListener('DOMContentLoaded', function() {
    const loadingElement = document.getElementById('loading');
    const adminContainer = document.getElementById('admin-container');
    
    if (adminAuth.requireAuth()) {
        loadingElement.classList.add('hidden');
        adminContainer.classList.remove('hidden');
        
        // Update welcome message
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage && adminAuth.admin) {
            welcomeMessage.textContent = `Welcome back, ${adminAuth.admin.username}!`;
        }
    }
});

// Global logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        adminAuth.logout();
    }
}