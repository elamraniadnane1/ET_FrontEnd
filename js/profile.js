// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        displayUsername(user);
        populateProfileForm(user);
    } else {
        // Redirect to login page if not logged in
        //window.location.href = 'login.html';
    }
});

// Display username in navigation
function displayUsername(user) {
    const usernameDisplay = document.getElementById('usernameDisplay');
    usernameDisplay.textContent = user.username ? `Hello, ${user.username}` : 'Hello, User';
}

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
});

// Populate profile form with user data
function populateProfileForm(user) {
    document.getElementById('firstName').value = user.firstName || '';
    document.getElementById('lastName').value = user.lastName || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('organization').value = user.organization || '';
}

// Handle profile form submission
document.getElementById('profileForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const organization = document.getElementById('organization').value.trim();

    // Update user data
    let user = JSON.parse(localStorage.getItem('loggedInUser'));
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.organization = organization;

    // Save updated user data to localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    alert('Profile information updated successfully.');
});

// Handle password change form submission
document.getElementById('passwordForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let user = JSON.parse(localStorage.getItem('loggedInUser'));

    // Simple password validation (In real applications, validate against backend)
    if (currentPassword !== user.password) {
        alert('Current password is incorrect.');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match.');
        return;
    }

    // Update user password
    user.password = newPassword;
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    alert('Password changed successfully.');

    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
});
