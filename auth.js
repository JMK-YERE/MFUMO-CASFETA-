// js/auth.js
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    const loginBtn = this.querySelector('button');
    loginBtn.textContent = 'Inaingia...';
    loginBtn.disabled = true;
    
    try {
        // Simulate login (in real system, use Supabase Auth)
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // Store user info
        localStorage.setItem('casfeta_user', JSON.stringify({
            email: email,
            role: role,
            loggedIn: true
        }));
        
        // Redirect to dashboard
        window.location.href = 'pages/dashboard.html';
        
    } catch (error) {
        alert('Login failed: ' + error.message);
        loginBtn.textContent = 'Ingia Mfumo';
        loginBtn.disabled = false;
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
