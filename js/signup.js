// Password Validation Patterns
const passwordPatterns = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*]/
};

// Elements
const signupForm = document.getElementById('signupForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const termsCheckbox = document.getElementById('terms');

// Error Message Elements
const fullNameError = document.getElementById('fullNameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const termsError = document.getElementById('termsError');

// Password Requirements Elements
const lengthRequirement = document.getElementById('length');
const uppercaseRequirement = document.getElementById('uppercase');
const lowercaseRequirement = document.getElementById('lowercase');
const numberRequirement = document.getElementById('number');
const specialRequirement = document.getElementById('special');

// Event Listeners
passwordInput.addEventListener('input', validatePasswordRequirements);
signupForm.addEventListener('submit', validateForm);

// Validate Password Requirements
function validatePasswordRequirements() {
    const password = passwordInput.value;

    // Length
    if (passwordPatterns.length.test(password)) {
        lengthRequirement.classList.add('valid');
        lengthRequirement.classList.remove('invalid');
    } else {
        lengthRequirement.classList.add('invalid');
        lengthRequirement.classList.remove('valid');
    }

    // Uppercase
    if (passwordPatterns.uppercase.test(password)) {
        uppercaseRequirement.classList.add('valid');
        uppercaseRequirement.classList.remove('invalid');
    } else {
        uppercaseRequirement.classList.add('invalid');
        uppercaseRequirement.classList.remove('valid');
    }

    // Lowercase
    if (passwordPatterns.lowercase.test(password)) {
        lowercaseRequirement.classList.add('valid');
        lowercaseRequirement.classList.remove('invalid');
    } else {
        lowercaseRequirement.classList.add('invalid');
        lowercaseRequirement.classList.remove('valid');
    }

    // Number
    if (passwordPatterns.number.test(password)) {
        numberRequirement.classList.add('valid');
        numberRequirement.classList.remove('invalid');
    } else {
        numberRequirement.classList.add('invalid');
        numberRequirement.classList.remove('valid');
    }

    // Special Character
    if (passwordPatterns.special.test(password)) {
        specialRequirement.classList.add('valid');
        specialRequirement.classList.remove('invalid');
    } else {
        specialRequirement.classList.add('invalid');
        specialRequirement.classList.remove('valid');
    }
}

// Validate Form on Submit
function validateForm(event) {
    event.preventDefault();
    let isValid = true;

    // Reset Error Messages
    fullNameError.style.display = 'none';
    emailError.style.display = 'none';
    passwordError.style.display = 'none';
    confirmPasswordError.style.display = 'none';
    termsError.style.display = 'none';

    // Full Name Validation
    if (fullNameInput.value.trim() === '') {
        fullNameError.textContent = 'Full name is required.';
        fullNameError.style.display = 'block';
        isValid = false;
    }

    // Email Validation
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Email address is required.';
        emailError.style.display = 'block';
        isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        emailError.style.display = 'block';
        isValid = false;
    }

    // Password Validation
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const passwordValid = Object.values(passwordPatterns).every(pattern => pattern.test(password));

    if (!passwordValid) {
        passwordError.textContent = 'Please meet all password requirements.';
        passwordError.style.display = 'block';
        isValid = false;
    }

    // Confirm Password Validation
    if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match.';
        confirmPasswordError.style.display = 'block';
        isValid = false;
    }

    // Terms and Conditions Validation
    if (!termsCheckbox.checked) {
        termsError.textContent = 'You must agree to the Terms and Conditions.';
        termsError.style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        // Form is valid, proceed with submission
        // Replace the following line with actual submission logic (e.g., AJAX request)
        alert('Signup successful!');
        signupForm.reset();
        resetPasswordRequirements();
    }
}

// Email Validation Function
function validateEmail(email) {
    // Simple email validation regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Reset Password Requirements
function resetPasswordRequirements() {
    lengthRequirement.classList.add('invalid');
    lengthRequirement.classList.remove('valid');
    uppercaseRequirement.classList.add('invalid');
    uppercaseRequirement.classList.remove('valid');
    lowercaseRequirement.classList.add('invalid');
    lowercaseRequirement.classList.remove('valid');
    numberRequirement.classList.add('invalid');
    numberRequirement.classList.remove('valid');
    specialRequirement.classList.add('invalid');
    specialRequirement.classList.remove('valid');
}
