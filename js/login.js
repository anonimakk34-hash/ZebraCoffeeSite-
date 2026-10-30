'use strict';

/*
 * Using jQuery 3.7.1.
 * $(function () { ... }) is the short form of $(document).ready(). It ensures the DOM
 * is ready before selecting the login form or attaching event listeners.
 */
$(function () {
    const $loginForm = $('#login-form');
    if ($loginForm.length === 0) return;

    const $emailInput = $loginForm.find('#login-email');
    const $passwordInput = $loginForm.find('#login-password');
    const $rememberCheckbox = $loginForm.find('#login-remember');

    if ($emailInput.length === 0 || $passwordInput.length === 0) return;

    // Create Show/Hide password button with jQuery
    const $toggleButton = $('<button>')
        .attr({
            type: 'button',
            'aria-label': 'Toggle password visibility'
        })
        .addClass('btn btn-sm btn-outline-secondary mt-1 mb-3')
        .text('Show');

    $passwordInput.after($toggleButton);

    $toggleButton.on('click', function () {
        const $btn = $(this);
        const isHidden = $passwordInput.attr('type') === 'password';

        $passwordInput.attr('type', isHidden ? 'text' : 'password');
        $btn.text(isHidden ? 'Hide' : 'Show');
    });

    // Handle login form submission
    $loginForm.on('submit', function (event) {
        // Without event.preventDefault(), the browser would submit the form and reload the page.
        event.preventDefault();
        hideMessage();

        const email = ($emailInput.val() || '').trim();
        const password = $passwordInput.val() || '';
        const rememberMe = $rememberCheckbox.prop('checked');

        if (!email || !password) {
            showMessage('Please enter both email and password.', 'danger');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'danger');
            return;
        }

        const rememberNote = rememberMe ? ' (Remember me checked)' : '';
        showMessage(
            `Login form submitted successfully${rememberNote}! This is a front-end demonstration only. You are not actually authenticated.`,
            'success'
        );
    });
});