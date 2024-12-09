// Mock user data (In real application, validate against backend)
const users = [
    {
        username: 'Adnane',
        email: 'Adnane@example.com',
        password: '123'
    },
    {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password456'
    }
];

// Remove the automatic redirect to dashboard.html on page load
// This allows the user to log in again, even if they are already logged in

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const usernameOrEmail = document.getElementById('usernameOrEmail').value.trim();
    const password = document.getElementById('password').value;

    // Simple authentication check
    const user = users.find(u =>
        (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );

    if (user) {
        // Store user info in localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        // Redirect to dashboard after successful login
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid username/email or password.');
    }
});

// Function to show welcome message after login
// Note: This function is kept for compatibility but will not be used since we redirect to dashboard
function showWelcomeMessage(user) {
    document.getElementById('loginForm').style.display = 'none';
    document.querySelector('.additional-options').style.display = 'none';
    const welcomeMessage = document.getElementById('welcomeMessage');
    document.getElementById('displayUsername').textContent = user.username;
    welcomeMessage.style.display = 'block';
}

// Handle logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    location.reload();
});

// Handle "Create Account" button click
document.getElementById('createAccountBtn').addEventListener('click', () => {
    window.location.href = 'signup.html';
});

// Handle "Forgot Password" button click
document.getElementById('forgotPasswordBtn').addEventListener('click', () => {
    window.location.href = 'forgot-password.html';
});
