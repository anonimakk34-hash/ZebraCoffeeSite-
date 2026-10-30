'use strict';

/*
 * Using jQuery 3.7.1.
 * $(function () { ... }) is the short form of $(document).ready(). It is needed so
 * our code waits until the browser has finished parsing the HTML and building the DOM tree
 * before trying to select or manipulate elements.
 */
$(function () {
    const $feedbackForm = $('#feedback-form');
    if ($feedbackForm.length === 0) return;

    // Sample reviews array
    const reviewsData = [
        {
            name: 'Alice Smith',
            rating: 5,
            date: '2026-10-15',
            comment: 'Amazing coffee and cozy atmosphere! Will definitely return.'
        },
        {
            name: 'Bob Jones',
            rating: 4,
            date: '2026-10-18',
            comment: 'Great service, but the music was a bit too loud for me.'
        },
        {
            name: 'Charlie Davis',
            rating: 5,
            date: '2026-10-20',
            comment: 'The best espresso in Astana. Highly recommended.'
        },
        {
            name: 'Diana Prince',
            rating: 3,
            date: '2026-10-21',
            comment: 'Decent coffee, but the wait time was too long during rush hour.'
        },
        {
            name: 'Evan Wright',
            rating: 4,
            date: '2026-10-22',
            comment: 'Loved the pastries! The barista was very friendly.'
        },
        {
            name: 'Fiona Gallagher',
            rating: 5,
            date: '2026-10-22',
            comment: 'Perfect spot for remote work. Free WiFi and great lattes.'
        }
    ];

    // Select form fields using ID, attribute, and element selectors
    const $nameInput = $feedbackForm.find('#fb-name');
    const $emailInput = $feedbackForm.find('input[name="fb-email"]');
    const $phoneInput = $feedbackForm.find('input[type="tel"]');
    const $dateInput = $feedbackForm.find('#fb-date');
    const $ratingInput = $feedbackForm.find('#fb-rating');
    const $messageInput = $feedbackForm.find('textarea');

    // Set max date attribute on the date picker to today
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    $dateInput.attr('max', todayStr);

    // Pre-check the recommendation checkbox using .prop() (boolean state property)
    $('#fb-recommend').prop('checked', true);

    // Dynamically insert Confirm Email field if not present
    let $confirmEmailInput = $feedbackForm.find('#confirm-email');
    if ($confirmEmailInput.length === 0 && $emailInput.length > 0) {
        const $wrapper = $('<div>').addClass('col-md-6');
        const $label = $('<label>')
            .addClass('form-label fw-bold')
            .attr('for', 'confirm-email')
            .text('Confirm Email');

        $confirmEmailInput = $('<input>')
            .attr({
                type: 'email',
                id: 'confirm-email',
                name: 'confirm-email',
                placeholder: 'Enter your email again',
                required: 'required'
            })
            .addClass('form-control bg-light');

        $wrapper.append($label, $confirmEmailInput);

        // Traversal: use .closest() to find the parent column of the email input
        const $emailCol = $emailInput.closest('.col-md-6');
        if ($emailCol.length > 0) {
            $emailCol.after($wrapper);
        } else {
            $feedbackForm.find('fieldset .row').append($wrapper);
        }
    }

    // Add live comment character counter
    if ($messageInput.length > 0) {
        const $counter = $('<small>')
            .attr('id', 'comment-counter')
            .addClass('text-muted d-block mt-1')
            .text('0 / 500 characters (Min 10)');

        $messageInput.after($counter);

        // Event type 1: input (using $(this) inside the handler)
        $messageInput.on('input', function () {
            const len = $(this).val().length;
            const isOut = len < 10 || len > 500;

            /*
             * Method Chain Explanation (4 links):
             * 1. .text(...) updates the counter's text content safely.
             * 2. .removeClass(...) strips previous muted/danger/success color classes.
             * 3. .addClass(...) applies red (text-danger) or green (text-success) based on length.
             * 4. .attr(...) sets aria-live="polite" so screen readers announce updates.
             */
            $counter
                .text(`${len} / 500 characters (Min 10)`)
                .removeClass('text-muted text-danger text-success')
                .addClass(isOut ? 'text-danger' : 'text-success')
                .attr('aria-live', 'polite');
        });
    }

    // Create the reviews container and filter button bar in code
    let $reviewsContainer = $('#reviews-list');
    if ($reviewsContainer.length === 0) {
        const $headerBar = $('<div>')
            .addClass('d-flex flex-wrap justify-content-between align-items-center mt-5 mb-3');
        const $title = $('<h3>').addClass('mb-0').text('Recent Customer Reviews');
        const $toggleReviewsBtn = $('<button>')
            .attr({ type: 'button', id: 'toggle-reviews-btn' })
            .addClass('btn btn-sm btn-outline-dark')
            .text('Hide Reviews');

        $headerBar.append($title, $toggleReviewsBtn);
        $reviewsContainer = $('<div>').attr('id', 'reviews-list').addClass('row g-4 mt-2');

        $feedbackForm.after($headerBar);
        $headerBar.after($reviewsContainer);

        // Effect 1: .slideToggle() with duration (300ms) and a completion callback
        $toggleReviewsBtn.on('click', function () {
            const $btn = $(this);
            $reviewsContainer.slideToggle(300, function () {
                const isVisible = $(this).is(':visible');
                $btn.text(isVisible ? 'Hide Reviews' : 'Show Reviews');
            });
        });
    }

    // Rewritten Feature 1: Building review cards from an array in code.
    // jQuery's $('<tag>'), .addClass(), .text(), .appendTo(), and $.each() replaced document.createElement,
    // createEl(), replaceChildren(), and Array.forEach(). The result is shorter and clearer because chained
    // creation and .appendTo() eliminate temporary DOM variables and verbose appendChild() calls.
    const renderReviewCard = (review, index) => {
        const $col = $('<div>').addClass('col-md-6 col-lg-4 review-col').attr('data-index', index);
        const $card = $('<div>').addClass('card h-100 shadow-sm review-card');
        const $body = $('<div>').addClass('card-body d-flex flex-column');

        const $headerRow = $('<div>').addClass('d-flex justify-content-between align-items-start');
        const $title = $('<h5>').addClass('card-title mb-1').text(review.name);
        const $helpfulBtn = $('<button>')
            .attr('type', 'button')
            .addClass('btn btn-sm btn-outline-secondary helpful-btn')
            .attr('data-likes', 0)
            .text('👍 0');

        $headerRow.append($title, $helpfulBtn);

        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const $subtitle = $('<h6>')
            .addClass('card-subtitle mb-2 text-muted')
            .text(`${stars} | ${review.date}`);

        const $comment = $('<p>').addClass('card-text mt-2 mb-0').text(`"${review.comment}"`);

        $body.append($headerRow, $subtitle, $comment);
        $card.append($body);
        $col.append($card);

        return $col;
    };

    const displayReviews = () => {
        $reviewsContainer.empty();
        $.each(reviewsData, function (idx, review) {
            renderReviewCard(review, idx).appendTo($reviewsContainer);
        });
        // Filter (:first) to highlight the newest review card
        $reviewsContainer.find('.review-card:first').addClass('selected');
    };

    displayReviews();

    /*
     * Delegated Event Handler: bound to #reviews-list (which already exists) and reacting to .helpful-btn.
     * Why direct binding ($('.helpful-btn').on('click', ...)) would NOT work:
     * Review cards are created dynamically in code and rebuilt whenever a visitor submits a new review.
     * Directly bound handlers only attach to elements that exist at the exact moment .on() is called;
     * delegated events bubble up to the persistent #reviews-list parent, catching future buttons too.
     */
    $reviewsContainer.on('click', '.helpful-btn', function () {
        const $btn = $(this);
        const nextLikes = Number($btn.attr('data-likes') || 0) + 1;

        // Chain of 4 methods on the clicked button + traversal (.closest() and .siblings())
        $btn.attr('data-likes', nextLikes)
            .text(`👍 ${nextLikes}`)
            .removeClass('btn-outline-secondary')
            .addClass('btn-dark');

        const $card = $btn.closest('.review-card');
        $card.addClass('selected');
        $card.closest('.review-col').siblings().find('.review-card').removeClass('selected');
    });

    // Event type 2: mouseenter / mouseleave delegated on review cards
    $reviewsContainer.on('mouseenter', '.review-card', function () {
        $(this).addClass('shadow');
    }).on('mouseleave', '.review-card', function () {
        $(this).removeClass('shadow');
    });

    // Helper functions for field-level validation messages
    const showError = ($input, message) => {
        if ($input.length === 0) return;

        $input.addClass('is-invalid error').removeClass('is-valid');

        // Traversal: use .siblings() to find an existing invalid-feedback div in the same wrapper
        let $feedback = $input.siblings('.invalid-feedback');
        if ($feedback.length > 0) {
            $feedback.text(message);
        } else {
            $feedback = $('<div>').addClass('invalid-feedback d-block').text(message);
            $input.after($feedback);
        }
    };

    const clearError = ($input) => {
        if ($input.length === 0) return;
        $input.removeClass('is-invalid error').addClass('is-valid');
        $input.siblings('.invalid-feedback').remove();
    };

    // Clear the error on a field as soon as the visitor edits or changes it
    $feedbackForm.on('input change', '.form-control, .form-select, .form-check-input', function () {
        const $field = $(this);
        if ($field.attr('type') === 'radio') {
            const $group = $feedbackForm.find('input[name="order-type"]');
            $group.removeClass('is-invalid error');
            $field.closest('.col-12').find('.invalid-feedback').remove();
        } else if ($field.hasClass('is-invalid')) {
            clearError($field);
        }
    });

    /*
     * Rewritten Feature 3 (Main Form Validation in jQuery):
     * Replaced plain-JS querySelectorAll, classList.add/remove, nextElementSibling, and manual DOM summary building
     * with jQuery .val().trim(), .addClass()/.removeClass(), .siblings(), .html(), and .fadeIn().
     * The jQuery version is noticeably shorter and clearer, especially when traversing siblings for error messages
     * and clearing errors across all inputs in one line.
     *
     * Security Note (Browser vs. Server Validation):
     * A check in the browser never replaces a check on the server because client-side JavaScript and HTML attributes
     * (like required) run entirely on the user's device — a visitor can inspect the page, disable JavaScript, modify
     * rules in DevTools, or send raw HTTP POST requests directly to the server, bypassing browser checks completely.
     */
    $feedbackForm.on('submit', function (event) {
        // Without event.preventDefault(), the browser would perform a native HTTP form submission,
        // reloading the page and losing all our dynamic review cards and client-side state.
        event.preventDefault();
        hideMessage();

        // Reset validation classes on all fields using :not() filter to skip buttons
        $feedbackForm.find('input:not([type="submit"]):not([type="reset"]), select, textarea')
            .removeClass('is-invalid is-valid error');
        $feedbackForm.find('.invalid-feedback').remove();

        let isValid = true;
        let $firstInvalid = null;

        const recordInvalid = ($el, msg) => {
            showError($el, msg);
            isValid = false;
            if ($firstInvalid === null) {
                $firstInvalid = $el;
            }
        };

        // Trim all values before checking them
        const name = ($nameInput.val() || '').trim();
        const email = ($emailInput.val() || '').trim();
        const confirmEmail = ($confirmEmailInput.val() || '').trim();
        const phone = ($phoneInput.val() || '').trim();
        const visitDate = ($dateInput.val() || '').trim();
        const rating = Number(($ratingInput.val() || '').trim());
        const comment = ($messageInput.val() || '').trim();
        const $checkedOrderType = $feedbackForm.find('input[name="order-type"]:checked');
        const isRecommended = $('#fb-recommend').prop('checked');

        // 1. Name check
        if (name.length < 2) {
            recordInvalid($nameInput, 'Name must be at least 2 characters.');
        } else {
            clearError($nameInput);
        }

        // 2. Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            recordInvalid($emailInput, 'Please enter a valid email address.');
        } else {
            clearError($emailInput);
        }

        // 3. Confirm Email match check
        if (confirmEmail === '' || confirmEmail !== email) {
            recordInvalid($confirmEmailInput, 'Emails must match exactly.');
        } else {
            clearError($confirmEmailInput);
        }

        // 4. Phone format check (optional field, but if filled must have 10-15 digits and valid characters)
        const phoneFormatRegex = /^[+\d][\d\s\-()]{8,19}$/;
        const phoneDigits = phone.replace(/\D/g, '');
        if (phone !== '' && (!phoneFormatRegex.test(phone) || phoneDigits.length < 10 || phoneDigits.length > 15)) {
            recordInvalid($phoneInput, 'Please enter a valid phone number (10 to 15 digits).');
        } else if (phone !== '') {
            clearError($phoneInput);
        }

        // 5. Visit Date check
        if (visitDate === '' || visitDate > todayStr) {
            recordInvalid($dateInput, 'Visit date cannot be blank or in the future.');
        } else {
            clearError($dateInput);
        }

        // 6. Rating check
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            recordInvalid($ratingInput, 'Rating must be a whole number from 1 to 5.');
        } else {
            clearError($ratingInput);
        }

        // 7. Order Type radio check (using :checked filter)
        if ($checkedOrderType.length === 0) {
            const $radios = $feedbackForm.find('input[name="order-type"]');
            $radios.addClass('is-invalid error');
            const $radioWrapper = $radios.first().closest('.col-12');
            $radioWrapper.append($('<div>').addClass('invalid-feedback d-block').text('Please select an order type (Dine-in or Takeaway).'));
            isValid = false;
            if ($firstInvalid === null) $firstInvalid = $radios.first();
        }

        // 8. Comment length check
        if (comment.length < 10 || comment.length > 500) {
            recordInvalid($messageInput, 'Comment must be between 10 and 500 characters.');
        } else {
            clearError($messageInput);
        }

        if (!isValid) {
            if ($firstInvalid !== null) {
                $firstInvalid.trigger('focus');
            }
            return;
        }

        // Prepend the new review to our array and re-render the list
        reviewsData.unshift({
            name: name,
            rating: rating,
            date: visitDate,
            comment: comment
        });
        displayReviews();

        // Build confirmation message in #feedback-result using .html() for static template structure
        // and .text() for user-supplied values so no XSS is possible.
        const $resultBox = $('#feedback-result');
        $resultBox
            .removeClass('hidden')
            .hide()
            .html(
                '<h4 class="alert-heading">Feedback Submitted!</h4>' +
                '<p class="mb-2">Thank you! Your review has been added to Recent Customer Reviews below. (Front-end demo only)</p>' +
                '<hr>' +
                '<p class="mb-0 small review-summary-line"></p>'
            );

        const recText = isRecommended ? 'Yes, would recommend' : 'No recommendation checked';
        $resultBox.find('.review-summary-line').text(
            `Submitted by ${name} (${email}) for visit on ${visitDate} — Rating: ${rating}/5 (${$checkedOrderType.val()}, ${recText}).`
        );

        // Effect 2: .fadeIn() with duration and callback after form reset
        $resultBox.fadeIn(400, function () {
            $ReviewsScrollIfNeeded();
        });

        // Reset the form and restore character counter
        $feedbackForm[0].reset();
        $('#fb-recommend').prop('checked', true);
        $feedbackForm.find('.is-valid, .is-invalid, .error').removeClass('is-valid is-invalid error');
        $('#comment-counter')
            .text('0 / 500 characters (Min 10)')
            .removeClass('text-danger text-success')
            .addClass('text-muted');
    });

    function $ReviewsScrollIfNeeded() {
        $('#reviews-list').find('.review-card:first').fadeOut(150).fadeIn(300);
    }
});