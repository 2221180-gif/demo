document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('loginMessage');
    
    // Simple validation
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        messageDiv.innerHTML = '<div class="message success">Login successful! Redirecting...</div>';
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        messageDiv.innerHTML = '<div class="message error">Invalid username or password!</div>';
    }
});

// Check if already logged in
if (localStorage.getItem('adminLoggedIn') === 'true' && 
    window.location.pathname.includes('login.html')) {
    window.location.href = 'dashboard.html';
}