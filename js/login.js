
'use strict';

/*
 * jQuery 3.7.1
 * Wait until the HTML document is ready.
 */
$(function () {

    const $loginForm = $('#login-form');

    if ($loginForm.length === 0) return;

    // Select form fields
    const $emailInput = $('#login-email');
    const $passwordInput = $('#login-password');
    const $rememberCheckbox = $('#login-remember');

    // Result containers
    const $errorBox = $('#login-error');
    const $resultBox = $('#login-result');

    if ($emailInput.length === 0 || $passwordInput.length === 0) {
        return;
    }

    // Display general messages
    const showLoginBox = ($box, message) => {
        $box
            .text(message)
            .removeClass('hidden')
            .hide()
            .fadeIn(300);
    };

    const hideLoginBoxes = () => {
        $errorBox.addClass('hidden').text('');
        $resultBox.addClass('hidden').text('');
    };

    // Find the correct position for an error message
    const getErrorAnchor = ($input) => {
        return $input.closest('.position-relative').length
            ? $input.closest('.position-relative')
            : $input;
    };

    // Show validation error directly below the field
    const showFieldError = ($input, message) => {

        if ($input.length === 0) return;

        clearFieldError($input);

        $input
            .addClass('error')
            .attr('aria-invalid', 'true');

        // Avoid Bootstrap's warning icon overlapping the eye icon
        if ($input.is('#login-password')) {
            $input.addClass('border-danger');
        } else {
            $input.addClass('is-invalid');
        }

        $('<div>')
            .addClass('invalid-feedback d-block field-error mt-1')
            .text(message)
            .insertAfter(getErrorAnchor($input));
    };

    // Remove validation error from a field
    const clearFieldError = ($input) => {

        if ($input.length === 0) return;

        $input
            .removeClass('error is-invalid border-danger')
            .removeAttr('aria-invalid');

        getErrorAnchor($input)
            .next('.field-error')
            .remove();
    };

    // Restore remembered email
    const rememberedEmail =
        localStorage.getItem('zebraRememberedEmail');

    if (rememberedEmail) {
        $emailInput.val(rememberedEmail);
        $rememberCheckbox.prop('checked', true);
    }

    // Create password wrapper
    const $passwordWrapper = $('<div>')
        .addClass('position-relative');

    $passwordInput.wrap($passwordWrapper);

    // Add space for the eye icon
    $passwordInput.addClass('pe-5');

    // Create eye button inside password input
    const $toggleButton = $('<button>')
        .attr({
            type: 'button',
            'aria-label': 'Show password',
            title: 'Show password',
            'aria-pressed': 'false'
        })
        .addClass(
            'btn position-absolute top-50 end-0 translate-middle-y me-2 p-1 text-secondary border-0 bg-transparent'
        )
        .append(
            $('<i>').addClass('fa-solid fa-eye')
        );

    $passwordInput.parent().append($toggleButton);

    // Toggle password visibility
    $toggleButton.on('click', function () {

        const $button = $(this);

        const isHidden =
            $passwordInput.attr('type') === 'password';

        $passwordInput.attr(
            'type',
            isHidden ? 'text' : 'password'
        );

        $button.find('i')
            .toggleClass('fa-eye', !isHidden)
            .toggleClass('fa-eye-slash', isHidden);

        $button.attr({
            'aria-label': isHidden ? 'Hide password' : 'Show password',
            title: isHidden ? 'Hide password' : 'Show password',
            'aria-pressed': String(isHidden)
        });
    });

    // Clear errors as soon as the visitor edits the field
    $loginForm.on('input change', 'input', function () {

        clearFieldError($(this));
        hideLoginBoxes();
    });

    // Handle login form submission
    $loginForm.on('submit', function (event) {

        event.preventDefault();

        hideLoginBoxes();

        // Clear previous field errors
        $loginForm.find('.field-error').remove();

        $emailInput
            .add($passwordInput)
            .removeClass('error is-invalid border-danger')
            .removeAttr('aria-invalid');

        const email = ($emailInput.val() || '').trim();
        const password = $passwordInput.val() || '';
        const rememberMe = $rememberCheckbox.prop('checked');

        // Validate email
        if (!email) {

            showFieldError(
                $emailInput,
                'Please enter your email address.'
            );

            $emailInput.trigger('focus');
            return;
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            showFieldError(
                $emailInput,
                'Please enter a valid email address.'
            );

            $emailInput.trigger('focus');
            return;
        }

        // Validate password
        if (!password) {

            showFieldError(
                $passwordInput,
                'Please enter your password.'
            );

            $passwordInput.trigger('focus');
            return;
        }

        // Get registered demo account
        const savedUserRaw =
            localStorage.getItem('zebraRegisteredUser');

        if (!savedUserRaw) {

            showLoginBox(
                $errorBox,
                'No registered account found. Please register first.'
            );

            return;
        }

        // Read stored account safely
        let savedUser;

        try {
            savedUser = JSON.parse(savedUserRaw);
        } catch (error) {

            showLoginBox(
                $errorBox,
                'Could not read your account. Please register again.'
            );

            return;
        }

        // Verify email and password
        if (
            !savedUser ||
            !savedUser.email ||
            !savedUser.password ||
            savedUser.email.toLowerCase() !== email.toLowerCase() ||
            savedUser.password !== password
        ) {

            showFieldError(
                $passwordInput,
                'Incorrect email or password. Please try again.'
            );

            $passwordInput.trigger('focus');
            return;
        }

        // Remember email if requested
        if (rememberMe) {

            localStorage.setItem(
                'zebraRememberedEmail',
                email
            );

        } else {

            localStorage.removeItem('zebraRememberedEmail');
        }

        // Display successful login
        showLoginBox(
            $resultBox,
            `Welcome back, ${savedUser.name}! You have successfully logged in to Zebra Coffee.`
        );

        // Clear password after successful login
        $passwordInput.val('');

        // Restore hidden password state
        $passwordInput.attr('type', 'password');

        $toggleButton.find('i')
            .removeClass('fa-eye-slash')
            .addClass('fa-eye');

        $toggleButton.attr({
            'aria-label': 'Show password',
            title: 'Show password',
            'aria-pressed': 'false'
        });

    });

});
