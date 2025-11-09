// js/auth.js - SIMPLE VERSION
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    // Simple test login (without Supabase Auth)
    const testUsers = {
        'mwenyekiti@casfeta.cive': { password: 'casfeta2024', role: 'mwenyekiti', name: 'Admin Mwenyekiti' },
        'katibu@casfeta.cive': { password: 'casfeta2024', role: 'katibu', name: 'John Katibu' },
        'mhazina@casfeta.cive': { password: 'casfeta2024', role: 'mhazina', name: 'Sarah Mhazina' },
        'bakada@casfeta.cive': { password: 'casfeta2024', role: 'bakada', name: 'David Bakada' },
        'makada@casfeta.cive': { password: 'casfeta2024', role: 'makada', name: 'Grace Makada' }
    };
    
    if (testUsers[email] && testUsers[email].password === password) {
        // Store user info
        localStorage.setItem('casfeta_user', JSON.stringify({
            email: email,
            role: role,
            name: testUsers[email].name,
            loggedIn: true
        }));
        
        // Redirect to dashboard
        window.location.href = 'pages/dashboard.html';
    } else {
        alert('⚠️ Barua pepe au nywila si sahihi! Tumia: mwenyekiti@casfeta.cive / casfeta2024');
    }
});

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('casfeta_user');
    if (!user || !JSON.parse(user).loggedIn) {
        window.location.href = '../index.html';
    }
    return JSON.parse(user);
}

// Logout function
function logout() {
    localStorage.removeItem('casfeta_user');
    window.location.href = '../index.html';
}
