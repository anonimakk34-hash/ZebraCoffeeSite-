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
    const $errorBox = $('#login-error');
    const $resultBox = $('#login-result');

    if ($emailInput.length === 0 || $passwordInput.length === 0) return;

    // Pre-fill remembered email if saved in localStorage
    const rememberedEmail = localStorage.getItem('zebraRememberedEmail');
    if (rememberedEmail) {
        $emailInput.val(rememberedEmail);
        $rememberCheckbox.prop('checked', true);
    }

    const showLoginBox = ($box, message) => {
        $box.text(message).removeClass('hidden').hide().fadeIn(250);
    };

    const hideLoginBoxes = () => {
        $errorBox.addClass('hidden').text('');
        $resultBox.addClass('hidden').text('');
    };

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

    $loginForm.on('input change', 'input', function () {
        $(this).removeClass('error is-invalid');
        hideLoginBoxes();
    });

    // Handle login form submission
    $loginForm.on('submit', function (event) {
        event.preventDefault();
        hideLoginBoxes();

        const email = ($emailInput.val() || '').trim();
        const password = $passwordInput.val() || '';
        const rememberMe = $rememberCheckbox.prop('checked');

        if (!email) {
            $emailInput.addClass('error is-invalid').trigger('focus');
            showLoginBox($errorBox, 'Please enter your email address.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $emailInput.addClass('error is-invalid').trigger('focus');
            showLoginBox($errorBox, 'Please enter a valid email address.');
            return;
        }

        if (!password) {
            $passwordInput.addClass('error is-invalid').trigger('focus');
            showLoginBox($errorBox, 'Please enter your password.');
            return;
        }

        if (rememberMe) {
            localStorage.setItem('zebraRememberedEmail', email);
        } else {
            localStorage.removeItem('zebraRememberedEmail');
        }

        // Endterm extension: compare against the user registered on register.html if one exists
        const savedUserRaw = localStorage.getItem('zebraRegisteredUser');
        if (savedUserRaw) {
            const savedUser = JSON.parse(savedUserRaw);
            if (savedUser.email.toLowerCase() !== email.toLowerCase() || savedUser.password !== password) {
                $passwordInput.addClass('error is-invalid').trigger('focus');
                showLoginBox($errorBox, 'Incorrect email or password for the registered demo account.');
                return;
            }
            showLoginBox(
                $resultBox,
                `Welcome back, ${savedUser.name}! Login verified against your browser demo account.`
            );
            $passwordInput.val('');
            return;
        }

        const rememberNote = rememberMe ? ' (Email remembered for next visit)' : '';
        showLoginBox(
            $resultBox,
            `Login form validated${rememberNote}! Tip: register an account on the Register page first to test credential matching.`
        );
        $passwordInput.val('');
    });
});