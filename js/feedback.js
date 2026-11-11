
'use strict';

/*
 * Zebra Coffee Feedback
 * jQuery 3.7.1
 */
$(function () {

    const $feedbackForm = $('#feedback-form');

    if ($feedbackForm.length === 0) return;

    // Use custom jQuery validation instead of browser-native validation
    $feedbackForm.attr('novalidate', 'novalidate');

    // ======================================
    // SAMPLE REVIEWS
    // ======================================

    const reviewsData = [
        {
            name: 'Alice Smith',
            rating: 5,
            date: '2026-10-15',
            favoriteDrink: 'Latte',
            comment: 'Amazing coffee and cozy atmosphere! Will definitely return.'
        },
        {
            name: 'Bob Jones',
            rating: 4,
            date: '2026-10-18',
            favoriteDrink: 'Cappuccino',
            comment: 'Great service, but the music was a bit too loud for me.'
        },
        {
            name: 'Charlie Davis',
            rating: 5,
            date: '2026-10-20',
            favoriteDrink: 'Americano',
            comment: 'The best espresso in Astana. Highly recommended.'
        },
        {
            name: 'Diana Prince',
            rating: 3,
            date: '2026-10-21',
            favoriteDrink: 'Raf',
            comment: 'Decent coffee, but the wait time was too long during rush hour.'
        },
        {
            name: 'Evan Wright',
            rating: 4,
            date: '2026-10-22',
            favoriteDrink: 'Latte',
            comment: 'Loved the pastries! The barista was very friendly.'
        },
        {
            name: 'Fiona Gallagher',
            rating: 5,
            date: '2026-10-22',
            favoriteDrink: 'Cappuccino',
            comment: 'Perfect spot for remote work. Free WiFi and great lattes.'
        }
    ];

    // ======================================
    // SELECT FORM FIELDS
    // ======================================

    const $nameInput = $feedbackForm.find('#fb-name');
    const $emailInput = $feedbackForm.find('#fb-email');
    const $phoneInput = $feedbackForm.find('#fb-phone');
    const $dateInput = $feedbackForm.find('#fb-date');
    const $ratingInput = $feedbackForm.find('#fb-rating');
    const $drinkInput = $feedbackForm.find('#fb-drink');
    const $messageInput = $feedbackForm.find('#fb-comments');

    const $recommendCheckbox = $('#fb-recommend');

    // Set maximum visit date to today
    const now = new Date();

    const todayStr =
        `${now.getFullYear()}-` +
        `${String(now.getMonth() + 1).padStart(2, '0')}-` +
        `${String(now.getDate()).padStart(2, '0')}`;

    $dateInput.attr('max', todayStr);

    // Default recommendation checkbox
    $recommendCheckbox.prop('checked', true);

    // ======================================
    // CREATE CONFIRM EMAIL FIELD
    // ======================================

    let $confirmEmailInput = $feedbackForm.find('#confirm-email');

    if ($confirmEmailInput.length === 0 && $emailInput.length > 0) {

        const $wrapper = $('<div>')
            .addClass('col-md-6');

        const $label = $('<label>')
            .attr('for', 'confirm-email')
            .addClass('form-label fw-bold')
            .text('Confirm Email');

        $confirmEmailInput = $('<input>')
            .attr({
                type: 'email',
                id: 'confirm-email',
                name: 'confirm-email',
                placeholder: 'Enter your email again'
            })
            .addClass('form-control bg-light');

        $wrapper.append($label, $confirmEmailInput);

        // Insert after the original email field
        const $emailColumn = $emailInput.closest('.col-md-6');

        if ($emailColumn.length > 0) {
            $emailColumn.after($wrapper);
        } else {
            $feedbackForm.find('fieldset .row').append($wrapper);
        }
    }

    // ======================================
    // COMMENT CHARACTER COUNTER
    // ======================================

    const $counter = $('<small>')
        .attr('id', 'comment-counter')
        .addClass('text-muted d-block mt-1')
        .text('0 / 500 characters (Min 10)');

    $messageInput.after($counter);

    $messageInput.on('input', function () {

        const length = $(this).val().length;

        const invalid = length < 10 || length > 500;

        $counter
            .text(`${length} / 500 characters (Min 10)`)
            .removeClass('text-muted text-danger text-success')
            .addClass(invalid ? 'text-danger' : 'text-success')
            .attr('aria-live', 'polite');
    });

    // ======================================
    // CREATE REVIEWS SECTION
    // ======================================

    let $reviewsContainer = $('#reviews-list');

    if ($reviewsContainer.length === 0) {

        const $headerBar = $('<div>')
            .addClass(
                'd-flex flex-wrap justify-content-between align-items-center mt-5 mb-3'
            );

        const $title = $('<h3>')
            .addClass('mb-0')
            .text('Recent Customer Reviews');

        const $toggleReviewsBtn = $('<button>')
            .attr({
                type: 'button',
                id: 'toggle-reviews-btn'
            })
            .addClass('btn btn-sm btn-outline-dark')
            .text('Hide Reviews');

        $headerBar.append($title, $toggleReviewsBtn);

        $reviewsContainer = $('<div>')
            .attr('id', 'reviews-list')
            .addClass('row g-4 mt-2');

        $feedbackForm.after($headerBar);
        $headerBar.after($reviewsContainer);

        // Show or hide reviews
        $toggleReviewsBtn.on('click', function () {

            const $button = $(this);

            $reviewsContainer.slideToggle(300, function () {

                const visible = $(this).is(':visible');

                $button.text(
                    visible ? 'Hide Reviews' : 'Show Reviews'
                );

            });

        });
    }

    // ======================================
    // CREATE REVIEW CARD
    // ======================================

    const renderReviewCard = (review, index) => {

        const $column = $('<div>')
            .addClass('col-md-6 col-lg-4 review-col')
            .attr('data-index', index);

        const $card = $('<div>')
            .addClass('card h-100 shadow-sm review-card');

        const $body = $('<div>')
            .addClass('card-body d-flex flex-column');

        const $header = $('<div>')
            .addClass(
                'd-flex justify-content-between align-items-start'
            );

        const $name = $('<h5>')
            .addClass('card-title mb-1')
            .text(review.name);

        const $helpfulButton = $('<button>')
            .attr({
                type: 'button',
                'data-likes': 0
            })
            .addClass(
                'btn btn-sm btn-outline-secondary helpful-btn'
            )
            .text('👍 0');

        $header.append($name, $helpfulButton);

        const stars =
            '★'.repeat(review.rating) +
            '☆'.repeat(5 - review.rating);

        const $rating = $('<h6>')
            .addClass('card-subtitle mb-2 text-muted')
            .text(`${stars} | ${review.date}`);

        $body.append($header, $rating);

        // Display favorite drink if available
        if (review.favoriteDrink) {

            const $drink = $('<small>')
                .addClass('text-muted mb-2')
                .text(`Favorite drink: ${review.favoriteDrink}`);

            $body.append($drink);
        }

        const $comment = $('<p>')
            .addClass('card-text mt-2 mb-0')
            .text(`"${review.comment}"`);

        $body.append($comment);

        $card.append($body);
        $column.append($card);

        return $column;
    };

    // Render all reviews
    const displayReviews = () => {

        $reviewsContainer.empty();

        $.each(reviewsData, function (index, review) {

            renderReviewCard(review, index)
                .appendTo($reviewsContainer);

        });

        // Highlight newest review
        $reviewsContainer
            .find('.review-card:first')
            .addClass('selected');
    };

    // Initial rendering
    displayReviews();

    // ======================================
    // DELEGATED HELPFUL BUTTON EVENT
    // ======================================

    $reviewsContainer.on('click', '.helpful-btn', function () {

        const $button = $(this);

        const likes =
            Number($button.attr('data-likes') || 0) + 1;

        // Update button using method chaining
        $button
            .attr('data-likes', likes)
            .text(`👍 ${likes}`)
            .removeClass('btn-outline-secondary')
            .addClass('btn-dark');

        // Highlight clicked review
        const $card = $button.closest('.review-card');

        $card.addClass('selected');

        $card
            .closest('.review-col')
            .siblings()
            .find('.review-card')
            .removeClass('selected');

    });

    // ======================================
    // REVIEW HOVER EVENTS
    // ======================================

    $reviewsContainer
        .on('mouseenter', '.review-card', function () {

            $(this).addClass('shadow');

        })
        .on('mouseleave', '.review-card', function () {

            $(this).removeClass('shadow');

        });

    // ======================================
    // FIELD VALIDATION HELPERS
    // ======================================

    const showError = ($input, message) => {

        if ($input.length === 0) return;

        clearError($input);

        $input
            .addClass('is-invalid error')
            .attr('aria-invalid', 'true');

        $('<div>')
            .addClass('invalid-feedback d-block field-error')
            .text(message)
            .insertAfter($input);
    };

    const clearError = ($input) => {

        if ($input.length === 0) return;

        $input
            .removeClass('is-invalid is-valid error')
            .removeAttr('aria-invalid');

        $input.next('.field-error').remove();
    };

    // ======================================
    // CLEAR ERRORS WHEN FIELDS CHANGE
    // ======================================

    $feedbackForm.on(
        'input change',
        '.form-control, .form-select',
        function () {

            const $field = $(this);

            clearError($field);

            $('#feedback-error')
                .addClass('hidden')
                .text('');

        }
    );

    // Handle radio button errors
    $feedbackForm.on(
        'change',
        'input[name="order-type"]',
        function () {

            const $radioGroup =
                $feedbackForm.find('input[name="order-type"]');

            $radioGroup.removeClass('is-invalid error');

            $feedbackForm
                .find('.radio-error')
                .remove();

        }
    );

    // ======================================
    // FEEDBACK FORM VALIDATION
    // ======================================

    $feedbackForm.on('submit', function (event) {

        event.preventDefault();

        $('#feedback-error')
            .addClass('hidden')
            .text('');

        $('#feedback-result')
            .addClass('hidden')
            .empty();

        // Remove old field errors
        $feedbackForm.find('.field-error, .radio-error').remove();

        $feedbackForm
            .find('.is-invalid, .is-valid, .error')
            .removeClass('is-invalid is-valid error')
            .removeAttr('aria-invalid');

        let isValid = true;
        let $firstInvalid = null;

        // Read all entered values
        const name = ($nameInput.val() || '').trim();
        const email = ($emailInput.val() || '').trim();
        const confirmEmail = ($confirmEmailInput.val() || '').trim();
        const phone = ($phoneInput.val() || '').trim();
        const visitDate = ($dateInput.val() || '').trim();
        const rating = Number(($ratingInput.val() || '').trim());
        const favoriteDrink = ($drinkInput.val() || '');
        const comment = ($messageInput.val() || '').trim();

        const $checkedOrderType =
            $feedbackForm.find('input[name="order-type"]:checked');

        const orderType = $checkedOrderType.val() || '';

        const isRecommended =
            $recommendCheckbox.prop('checked');

        // Helper to register invalid fields
        const recordInvalid = ($field, message) => {

            showError($field, message);

            isValid = false;

            if ($firstInvalid === null) {
                $firstInvalid = $field;
            }
        };

        // 1. Name
        if (name.length < 2) {

            recordInvalid(
                $nameInput,
                'Name must be at least 2 characters.'
            );
        }

        // 2. Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            recordInvalid(
                $emailInput,
                'Please enter a valid email address.'
            );
        }

        // 3. Confirm Email
        if (confirmEmail === '' || confirmEmail !== email) {

            recordInvalid(
                $confirmEmailInput,
                'Emails must match exactly.'
            );
        }

        // 4. Phone (optional)
        if (phone !== '') {

            const phoneRegex = /^[+\d][\d\s\-()]{8,19}$/;
            const phoneDigits = phone.replace(/\D/g, '');

            if (
                !phoneRegex.test(phone) ||
                phoneDigits.length < 10 ||
                phoneDigits.length > 15
            ) {

                recordInvalid(
                    $phoneInput,
                    'Please enter a valid phone number (10 to 15 digits).'
                );
            }
        }

        // 5. Visit date
        if (visitDate === '' || visitDate > todayStr) {

            recordInvalid(
                $dateInput,
                'Visit date cannot be blank or in the future.'
            );
        }

        // 6. Rating
        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {

            recordInvalid(
                $ratingInput,
                'Rating must be a whole number from 1 to 5.'
            );
        }

        // 7. Order type
        if ($checkedOrderType.length === 0) {

            const $radios =
                $feedbackForm.find('input[name="order-type"]');

            $radios.addClass('is-invalid error');

            const $radioWrapper =
                $radios.first().closest('.col-12');

            $('<div>')
                .addClass('invalid-feedback d-block radio-error')
                .text('Please select an order type.')
                .appendTo($radioWrapper);

            isValid = false;

            if ($firstInvalid === null) {
                $firstInvalid = $radios.first();
            }
        }

        // 8. Comment
        if (comment.length < 10 || comment.length > 500) {

            recordInvalid(
                $messageInput,
                'Comment must contain between 10 and 500 characters.'
            );
        }

        // Stop if validation fails
        if (!isValid) {

            if ($firstInvalid !== null) {
                $firstInvalid.trigger('focus');
            }

            return;
        }

        // ======================================
        // SUCCESSFUL SUBMISSION
        // ======================================

        const drinkName = favoriteDrink
            ? $drinkInput.find('option:selected').text()
            : 'Not specified';

        const phoneDisplay = phone || 'Not provided';

        const recommendation = isRecommended
            ? 'Yes'
            : 'No';

        // Create new review object
        const newReview = {
            name: name,
            rating: rating,
            date: visitDate,
            favoriteDrink: drinkName,
            comment: comment
        };

        // Add newest review to the beginning
        reviewsData.unshift(newReview);

        // Refresh review cards
        displayReviews();

        // ======================================
        // DISPLAY SUBMISSION RESULT
        // ======================================

        const $resultBox = $('#feedback-result');

        // Static HTML structure only
        $resultBox
            .removeClass('hidden')
            .hide()
            .html(
                '<h4 class="alert-heading">Feedback Submitted Successfully!</h4>' +
                '<p class="mb-2">Thank you for sharing your experience with Zebra Coffee. Your review has been added below.</p>' +
                '<hr>' +
                '<div class="review-summary"></div>' +
                '<p class="small text-muted mb-0 mt-3">Front-end demonstration: this submission is not stored on a server.</p>'
            );

        // Display user information safely using .text()
        const $summary = $resultBox.find('.review-summary');

        const addDetail = (label, value) => {

            const $paragraph = $('<p>')
                .addClass('mb-1');

            $('<strong>')
                .text(label + ':')
                .appendTo($paragraph);

            $paragraph.append(
                document.createTextNode(' ' + value)
            );

            $summary.append($paragraph);
        };

        addDetail('Name', name);
        addDetail('Email', email);
        addDetail('Phone', phoneDisplay);
        addDetail('Visit Date', visitDate);
        addDetail('Rating', `${rating}/5 stars`);
        addDetail('Favorite Drink', drinkName);
        addDetail('Order Type', orderType);
        addDetail('Would Recommend', recommendation);
        addDetail('Comment', comment);

        // Effect: fade in result
        $resultBox.fadeIn(400, function () {

            // Briefly highlight the newest review card
            $reviewsContainer
                .find('.review-card:first')
                .fadeOut(150)
                .fadeIn(300);

        });

        // ======================================
        // RESET FORM
        // ======================================

        $feedbackForm[0].reset();

        // Restore default recommendation checkbox
        $recommendCheckbox.prop('checked', true);

        // Reset character counter
        $counter
            .text('0 / 500 characters (Min 10)')
            .removeClass('text-danger text-success')
            .addClass('text-muted');

    });

    // ======================================
    // CLEAR FORM HANDLING
    // ======================================

    $feedbackForm.on('reset', function () {

        $feedbackForm.find('.field-error, .radio-error').remove();

        $feedbackForm
            .find('.is-invalid, .is-valid, .error')
            .removeClass('is-invalid is-valid error')
            .removeAttr('aria-invalid');

        setTimeout(function () {

            $counter
                .text('0 / 500 characters (Min 10)')
                .removeClass('text-danger text-success')
                .addClass('text-muted');

            $recommendCheckbox.prop('checked', true);

        }, 0);

    });

});
