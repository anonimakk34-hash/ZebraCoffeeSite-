'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form')
        || document.querySelector('form');

    if (!loginForm) {
        console.error('Login form not found.');
        return;
    }

    // Select the correct fields from login.html
    const emailInput = loginForm.querySelector('#login-email');
    const passwordInput = loginForm.querySelector('#login-password');

    if (!emailInput || !passwordInput) {
        console.error('Email or password field not found.');
        return;
    }

    // Show or hide the password
    const toggleButton = document.createElement('button');

    toggleButton.type = 'button';
    toggleButton.textContent = 'Show';
    toggleButton.className =
        'btn btn-sm btn-outline-secondary mt-1 mb-3';
    toggleButton.setAttribute(
        'aria-label',
        'Toggle password visibility'
    );

    toggleButton.addEventListener('click', () => {
        const isHidden = passwordInput.type === 'password';

        passwordInput.type = isHidden ? 'text' : 'password';
        toggleButton.textContent = isHidden ? 'Hide' : 'Show';
    });

    passwordInput.insertAdjacentElement(
        'afterend',
        toggleButton
    );

    // Handle login form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        hideMessage();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Check that both fields are filled
        if (!email || !password) {
            showMessage(
                'Please enter both email and password.',
                'danger'
            );
            return;
        }

        // Check the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            showMessage(
                'Please enter a valid email address.',
                'danger'
            );
            return;
        }

        // Demonstration only, no real authentication
        showMessage(
            'Login form submitted successfully! This is a front-end demonstration only. You are not actually authenticated.',
            'success'
        );
    });
});
