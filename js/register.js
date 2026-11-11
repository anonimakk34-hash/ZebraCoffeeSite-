
'use strict';

/*
 * jQuery 3.7.1
 * $(function () {}) waits until the HTML document is ready.
 */
$(function () {

    const $registerForm = $('#register-form');

    if ($registerForm.length === 0) return;

    // Select form fields
    const $nameInput = $('#register-name');
    const $emailInput = $('#register-email');
    const $phoneInput = $('#register-phone');
    const $passwordInput = $('#register-password');
    const $confirmInput = $('#register-password-confirm');
    const $termsCheckbox = $('#register-terms');

    // Result containers
    const $errorBox = $('#register-error');
    const $resultBox = $('#register-result');

    // Show general messages
    const showAuthBox = ($box, message) => {
        $box
            .text(message)
            .removeClass('hidden')
            .hide()
            .fadeIn(300);
    };

    const hideAuthBoxes = () => {
        $errorBox.addClass('hidden').text('');
        $resultBox.addClass('hidden').text('');
    };

    // Find the correct position for an error message
    const getErrorAnchor = ($input) => {

        let $anchor = $input.closest('.position-relative');

        if ($anchor.length === 0) {
            $anchor = $input.closest('.form-check');
        }

        if ($anchor.length === 0) {
            $anchor = $input;
        }

        return $anchor;
    };

    // Display error below the corresponding field
    const showFieldError = ($input, message) => {

        if ($input.length === 0) return;

        clearFieldError($input);

        const isPasswordField = $input.is(
            '#register-password, #register-password-confirm'
        );

        $input
            .addClass('error')
            .attr('aria-invalid', 'true');

        if (isPasswordField) {
            // Use red border without Bootstrap's warning icon.
            $input.addClass('border-danger');
        } else {
            // Normal Bootstrap validation for other inputs.
            $input.addClass('is-invalid');
        }

        const $error = $('<div>')
            .addClass('invalid-feedback d-block field-error mt-1')
            .text(message);

        getErrorAnchor($input).after($error);
    };

    // Remove error when the visitor corrects the field
    const clearFieldError = ($input) => {

        if ($input.length === 0) return;

        $input
            .removeClass('error is-invalid border-danger')
            .removeAttr('aria-invalid');

        getErrorAnchor($input)
            .next('.field-error')
            .remove();
    };

    // Create an eye icon inside a password input
    const createToggleBtn = ($input) => {

        const $wrapper = $('<div>')
            .addClass('position-relative');

        $input.wrap($wrapper);

        // Leave room for the eye icon
        $input.addClass('pe-5');

        const $button = $('<button>')
            .attr({
                type: 'button',
                'aria-label': 'Show password',
                title: 'Show password',
                'aria-pressed': 'false'
            })
            .addClass(
                'btn position-absolute top-50 end-0 translate-middle-y me-2 p-1 text-secondary border-0 bg-transparent toggle-pw-btn'
            )
            .append(
                $('<i>').addClass('fa-solid fa-eye')
            );

        $input.parent().append($button);

        return $input.parent();
    };

    // Add eye buttons to both password fields
    const $passwordWrapper = createToggleBtn($passwordInput);

    createToggleBtn($confirmInput);

    // Toggle password visibility
    $registerForm.on('click', '.toggle-pw-btn', function () {

        const $button = $(this);
        const $input = $button.siblings('input');

        const isHidden = $input.attr('type') === 'password';

        $input.attr(
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

    // Reset both eye buttons to their original state
    const resetEyeButtons = () => {

        $registerForm.find('.toggle-pw-btn').each(function () {

            const $button = $(this);
            const $input = $button.siblings('input');

            $input.attr('type', 'password');

            $button.find('i')
                .removeClass('fa-eye-slash')
                .addClass('fa-eye');

            $button.attr({
                'aria-label': 'Show password',
                title: 'Show password',
                'aria-pressed': 'false'
            });
        });
    };

    // Password requirements
    const requirements = {
        length: /.{8,}/,
        upper: /[A-Z]/,
        lower: /[a-z]/,
        number: /[0-9]/,
        special: /[^A-Za-z0-9]/
    };

    const reqs = [
        {
            id: 'req-length',
            key: 'length',
            text: 'At least 8 characters'
        },
        {
            id: 'req-upper',
            key: 'upper',
            text: 'At least one uppercase letter'
        },
        {
            id: 'req-lower',
            key: 'lower',
            text: 'At least one lowercase letter'
        },
        {
            id: 'req-number',
            key: 'number',
            text: 'At least one digit'
        },
        {
            id: 'req-special',
            key: 'special',
            text: 'At least one special character'
        }
    ];

    // Build password checklist dynamically using jQuery
    const $checklist = $('<div>')
        .addClass(
            'password-checklist small mt-2 mb-3 p-3 bg-light border rounded'
        );

    $('<p>')
        .addClass('mb-2 fw-bold')
        .text('Password must contain:')
        .appendTo($checklist);

    const $list = $('<ul>')
        .addClass('list-unstyled mb-0')
        .appendTo($checklist);

    $.each(reqs, function (_, req) {

        $('<li>')
            .attr('id', req.id)
            .addClass('text-danger')
            .text('✗ ' + req.text)
            .appendTo($list);

    });

    // Place checklist below the password field
    $passwordWrapper.after($checklist);

    // Update checklist while typing
    const updatePasswordChecklist = () => {

        const password = $passwordInput.val() || '';

        $.each(reqs, function (_, req) {

            const passed = requirements[req.key].test(password);

            const $item = $('#' + req.id);

            $item
                .removeClass('text-danger text-success')
                .addClass(passed ? 'text-success' : 'text-danger')
                .text((passed ? '✓ ' : '✗ ') + req.text);

        });
    };

    $passwordInput.on('input', updatePasswordChecklist);

    // Check one field and return its error message
    const getFieldError = ($input) => {

        const id = $input.attr('id');
        const value = ($input.val() || '').trim();

        switch (id) {

            case 'register-name':

                if (value.length < 2) {
                    return 'Name must be at least 2 characters.';
                }

                break;

            case 'register-email': {

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(value)) {
                    return 'Please enter a valid email address.';
                }

                break;
            }

            case 'register-phone': {

                const digits = value.replace(/\D/g, '');

                if (digits.length < 10 || digits.length > 15) {
                    return 'Phone must contain 10 to 15 digits.';
                }

                break;
            }

            case 'register-password': {

                const password = $passwordInput.val() || '';

                const valid = Object.values(requirements)
                    .every(regex => regex.test(password));

                if (!valid) {
                    return 'Password does not meet all checklist requirements.';
                }

                break;
            }

            case 'register-password-confirm': {

                const password = $passwordInput.val() || '';
                const confirm = $confirmInput.val() || '';

                if (password !== confirm) {
                    return 'Passwords do not match.';
                }

                break;
            }

            case 'register-terms':

                if (!$termsCheckbox.prop('checked')) {
                    return 'You must agree to the Terms & Conditions.';
                }

                break;
        }

        return '';
    };

    // Revalidate a field when the visitor edits it
    $registerForm.on('input change', 'input', function () {

        const $field = $(this);

        hideAuthBoxes();

        if ($field.hasClass('is-invalid')) {

            const message = getFieldError($field);

            if (message === '') {
                clearFieldError($field);
            } else {
                showFieldError($field, message);
            }
        }

        // Also recheck password confirmation if the password changes
        if (
            $field.is($passwordInput) &&
            $confirmInput.hasClass('is-invalid')
        ) {
            const confirmError = getFieldError($confirmInput);

            if (confirmError === '') {
                clearFieldError($confirmInput);
            } else {
                showFieldError($confirmInput, confirmError);
            }
        }
    });

    // Handle registration submission
    $registerForm.on('submit', function (event) {

        event.preventDefault();

        hideAuthBoxes();

        // Clear previous field errors
        $registerForm.find('.field-error').remove();

        $registerForm.find('.is-invalid, .error')
            .removeClass('is-invalid error')
            .removeAttr('aria-invalid');

        // Trim text fields
        $nameInput.val(($nameInput.val() || '').trim());
        $emailInput.val(($emailInput.val() || '').trim());
        $phoneInput.val(($phoneInput.val() || '').trim());

        // Validate every field
        const fields = [
            $nameInput,
            $emailInput,
            $phoneInput,
            $passwordInput,
            $confirmInput,
            $termsCheckbox
        ];

        let firstInvalid = null;

        $.each(fields, function (_, $field) {

            const message = getFieldError($field);

            if (message !== '') {

                showFieldError($field, message);

                if (firstInvalid === null) {
                    firstInvalid = $field;
                }
            }

        });

        // Stop if any field is invalid
        if (firstInvalid !== null) {

            firstInvalid.trigger('focus');

            return;
        }

        // Prepare demonstration account
        const user = {
            name: $nameInput.val(),
            email: $emailInput.val(),
            phone: $phoneInput.val(),
            password: $passwordInput.val()
        };

        // Store demo account for Login page
        // This is not secure production authentication.
        try {

            localStorage.setItem(
                'zebraRegisteredUser',
                JSON.stringify(user)
            );

        } catch (error) {

            showAuthBox(
                $errorBox,
                'Could not save the demo account in this browser.'
            );

            return;
        }

        // Display successful registration result
        showAuthBox(
            $resultBox,
            `Registration successful! Welcome to Zebra Coffee, ${user.name}. Your demo account has been created. You can now log in.`
        );

        // Reset form
        $registerForm[0].reset();

        // Restore password visibility and checklist
        resetEyeButtons();
        updatePasswordChecklist();

    });

});
