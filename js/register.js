'use strict';

/*
 * Using jQuery 3.7.1.
 * $(function () { ... }) is the short form of $(document).ready(). It ensures the DOM
 * has finished loading before we query or attach event handlers to registration elements.
 */
$(function () {
    const $registerForm = $('#register-form');
    if ($registerForm.length === 0) return;

    const $nameInput = $registerForm.find('#register-name');
    const $emailInput = $registerForm.find('#register-email');
    const $phoneInput = $registerForm.find('#register-phone');
    const $passwordInput = $registerForm.find('#register-password');
    const $confirmInput = $registerForm.find('#register-password-confirm');
    const $termsCheckbox = $registerForm.find('#register-terms');

    /*
     * Rewritten Feature 3: Password Visibility Toggle & Live Regex Checklist.
     * Replaced plain-JS document.createElement, setAttribute, insertAdjacentElement, and classList.replace
     * with jQuery $('<button>'), .attr(), .after(), .on(), and chained .removeClass()/.addClass().
     * The jQuery code is much more compact because we can build and insert the toggle buttons and
     * checklist items with method chaining instead of 6-7 separate statements per element.
     */
    const createToggleBtn = ($inputEl) => {
        if ($inputEl.length === 0) return;

        const $btn = $('<button>')
            .attr({
                type: 'button',
                'aria-label': 'Toggle password visibility'
            })
            .addClass('btn btn-sm btn-outline-secondary mt-1 mb-2 toggle-pw-btn')
            .text('Show');

        $inputEl.after($btn);
    };

    createToggleBtn($passwordInput);
    createToggleBtn($confirmInput);

    // Delegated click handler on the form for both password visibility toggle buttons
    $registerForm.on('click', '.toggle-pw-btn', function () {
        const $btn = $(this);
        // Traversal: reach the preceding password input using .prevAll('input:first')
        const $input = $btn.prevAll('input:first');
        const isPassword = $input.attr('type') === 'password';

        $input.attr('type', isPassword ? 'text' : 'password');
        $btn.text(isPassword ? 'Hide' : 'Show');
    });

    // Build the password requirements checklist from an array using .appendTo()
    const $checklistContainer = $('<div>')
        .addClass('password-checklist small mt-2 mb-3 p-3 bg-light border rounded');

    $('<p>')
        .addClass('mb-2 fw-bold')
        .text('Password must contain:')
        .appendTo($checklistContainer);

    const $ul = $('<ul>').addClass('list-unstyled mb-0').appendTo($checklistContainer);

    const reqs = [
        { id: 'req-length', text: '✗ At least 8 characters' },
        { id: 'req-upper', text: '✗ At least one uppercase letter' },
        { id: 'req-lower', text: '✗ At least one lowercase letter' },
        { id: 'req-number', text: '✗ At least one digit' },
        { id: 'req-special', text: '✗ At least one special character' }
    ];

    $.each(reqs, function (_, req) {
        $('<li>')
            .attr('id', req.id)
            .addClass('text-danger')
            .text(req.text)
            .appendTo($ul);
    });

    if ($passwordInput.length > 0) {
        $passwordInput.siblings('.toggle-pw-btn').after($checklistContainer);
    }

    const requirements = {
        length: /.{8,}/,
        upper: /[A-Z]/,
        lower: /[a-z]/,
        number: /[0-9]/,
        special: /[^A-Za-z0-9]/
    };

    // Live checklist update on input
    $passwordInput.on('input', function () {
        const val = $(this).val() || '';

        $.each(requirements, function (key, regex) {
            const $item = $(`#req-${key}`);
            const passed = regex.test(val);
            const currentText = $item.text();

            $item
                .removeClass('text-danger text-success')
                .addClass(passed ? 'text-success' : 'text-danger')
                .text(passed ? currentText.replace('✗', '✓') : currentText.replace('✓', '✗'));
        });
    });

    $registerForm.on('submit', function (event) {
        // Without event.preventDefault(), the form would reload the page on submit.
        event.preventDefault();
        hideMessage();

        const name = ($nameInput.val() || '').trim();
        const email = ($emailInput.val() || '').trim();
        const phone = ($phoneInput.val() || '').trim();
        const password = $passwordInput.val() || '';
        const confirmPassword = $confirmInput.val() || '';
        const agreedTerms = $termsCheckbox.prop('checked');

        if (name.length < 2) {
            showMessage('Please enter your full name (at least 2 characters).', 'danger');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'danger');
            return;
        }

        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 10 || phoneDigits.length > 15) {
            showMessage('Please enter a valid phone number (10 to 15 digits).', 'danger');
            return;
        }

        const isPasswordValid = Object.values(requirements).every((regex) => regex.test(password));
        if (!isPasswordValid) {
            showMessage('Please ensure your password meets all checklist requirements.', 'danger');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Passwords do not match. Please try again.', 'danger');
            return;
        }

        if (!agreedTerms) {
            showMessage('You must agree to the Terms & Conditions.', 'danger');
            return;
        }

        showMessage(
            'Front-end demonstration only. No real account was created, and no data was saved or sent to any server.',
            'success'
        );

        $registerForm[0].reset();
        $passwordInput.trigger('input');
    });
});