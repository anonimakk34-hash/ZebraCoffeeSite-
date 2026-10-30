'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.querySelector('#feedback-form');
    if (!feedbackForm) return;

    // Sample reviews
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

    // Get existing form fields
    const nameInput = feedbackForm.querySelector('#fb-name');
    const emailInput = feedbackForm.querySelector('#fb-email');
    const dateInput = feedbackForm.querySelector('#fb-date');
    const ratingInput = feedbackForm.querySelector('#fb-rating');
    const messageInput = feedbackForm.querySelector('#fb-comments');

    // Add email confirmation field
    let confirmEmailInput =
        feedbackForm.querySelector('#confirm-email');

    if (!confirmEmailInput && emailInput) {
        const wrapper = createEl('div', 'col-md-6');

        const label = createEl(
            'label',
            'form-label fw-bold',
            'Confirm Email'
        );

        label.htmlFor = 'confirm-email';

        confirmEmailInput = document.createElement('input');
        confirmEmailInput.type = 'email';
        confirmEmailInput.id = 'confirm-email';
        confirmEmailInput.className = 'form-control bg-light';
        confirmEmailInput.placeholder = 'Enter your email again';
        confirmEmailInput.required = true;

        wrapper.append(label, confirmEmailInput);

        const emailColumn = emailInput.closest('.col-md-6');

        if (emailColumn) {
            emailColumn.insertAdjacentElement('afterend', wrapper);
        } else {
            feedbackForm
                .querySelector('fieldset .row')
                ?.appendChild(wrapper);
        }
    }

    // Add comment character counter
    if (messageInput) {
        const counter = createEl(
            'small',
            'text-muted d-block mt-1',
            '0 / 500 characters (Min 10)'
        );

        counter.id = 'comment-counter';
        messageInput.insertAdjacentElement('afterend', counter);

        messageInput.addEventListener('input', () => {
            const length = messageInput.value.length;

            counter.textContent =
                `${length} / 500 characters (Min 10)`;

            counter.className =
                length < 10 || length > 500
                    ? 'text-danger d-block mt-1'
                    : 'text-success d-block mt-1';
        });
    }

    // Create the reviews section if it does not exist
    let reviewsContainer =
        document.querySelector('#reviews-list');

    if (!reviewsContainer) {
        const title = createEl(
            'h3',
            'mt-5 mb-3',
            'Recent Customer Reviews'
        );

        reviewsContainer = createEl('div', 'row g-4 mt-2');
        reviewsContainer.id = 'reviews-list';

        feedbackForm.insertAdjacentElement('afterend', title);
        title.insertAdjacentElement('afterend', reviewsContainer);
    }

    // Create one review card
    const renderReviewCard = (review) => {
        const column = createEl(
            'div',
            'col-md-6 col-lg-4'
        );

        const card = createEl(
            'div',
            'card h-100 shadow-sm'
        );

        const body = createEl('div', 'card-body');

        const title = createEl(
            'h5',
            'card-title',
            review.name
        );

        const stars =
            '★'.repeat(review.rating) +
            '☆'.repeat(5 - review.rating);

        const subtitle = createEl(
            'h6',
            'card-subtitle mb-2 text-muted',
            `${stars} | ${review.date}`
        );

        const comment = createEl(
            'p',
            'card-text',
            `"${review.comment}"`
        );

        body.append(title, subtitle, comment);
        card.appendChild(body);
        column.appendChild(card);

        return column;
    };

    // Display all reviews
    const displayReviews = () => {
        reviewsContainer.replaceChildren();

        reviewsData.forEach((review) => {
            reviewsContainer.appendChild(
                renderReviewCard(review)
            );
        });
    };

    // Display existing reviews when the page loads
    displayReviews();

    // Display an error beside an input
    const showError = (input, message) => {
        if (!input) return;

        input.classList.add('is-invalid');
        input.classList.remove('is-valid');

        let feedback = input.nextElementSibling;

        if (
            feedback &&
            feedback.classList.contains('invalid-feedback')
        ) {
            feedback.textContent = message;
        } else {
            feedback = createEl(
                'div',
                'invalid-feedback',
                message
            );

            input.insertAdjacentElement('afterend', feedback);
        }
    };

    // Mark a field as valid
    const clearError = (input) => {
        if (!input) return;

        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    };

    // Handle form submission
    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();
        hideMessage();

        feedbackForm
            .querySelectorAll('.form-control, .form-select')
            .forEach((input) => {
                input.classList.remove('is-invalid', 'is-valid');
            });

        let isValid = true;
        let firstInvalidInput = null;

        const checkField = (condition, input, errorMessage) => {
            if (!input) {
                isValid = false;
                return;
            }

            if (!condition) {
                showError(input, errorMessage);
                isValid = false;

                if (!firstInvalidInput) {
                    firstInvalidInput = input;
                }
            } else {
                clearError(input);
            }
        };

        // Read values from the correct HTML elements
        const name = nameInput?.value.trim() ?? '';
        const email = emailInput?.value.trim() ?? '';
        const confirmEmail =
            confirmEmailInput?.value.trim() ?? '';

        const visitDate = dateInput?.value ?? '';
        const rating = Number(ratingInput?.value ?? '');
        const comment = messageInput?.value.trim() ?? '';

        // Validate name
        checkField(
            name.length >= 2,
            nameInput,
            'Name must be at least 2 characters.'
        );

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        checkField(
            emailRegex.test(email),
            emailInput,
            'Please enter a valid email address.'
        );

        // Confirm both emails match
        checkField(
            confirmEmail !== '' && confirmEmail === email,
            confirmEmailInput,
            'Emails must match exactly.'
        );

        // Validate visit date
        const now = new Date();

        const today =
            `${now.getFullYear()}-` +
            `${String(now.getMonth() + 1).padStart(2, '0')}-` +
            `${String(now.getDate()).padStart(2, '0')}`;

        checkField(
            visitDate !== '' && visitDate <= today,
            dateInput,
            'Visit date cannot be blank or in the future.'
        );

        // Validate rating
        checkField(
            Number.isInteger(rating) &&
            rating >= 1 &&
            rating <= 5,
            ratingInput,
            'Rating must be a whole number from 1 to 5.'
        );

        // Validate comment
        checkField(
            comment.length >= 10 && comment.length <= 500,
            messageInput,
            'Comment must be between 10 and 500 characters.'
        );

        // Stop if validation fails
        if (!isValid) {
            firstInvalidInput?.focus();
            return;
        }

        // Add the new review to the beginning of the array
        reviewsData.unshift({
            name: name,
            rating: rating,
            date: visitDate,
            comment: comment
        });

        // Refresh the review cards
        displayReviews();

        // Show confirmation
        feedbackForm.replaceChildren();

        const summary = createEl(
            'div',
            'alert alert-success'
        );

        summary.append(
            createEl(
                'h4',
                'alert-heading',
                'Feedback Submitted!'
            ),
            createEl(
                'p',
                '',
                'Your review is now shown in Recent Customer Reviews. ' +
                'This is a front-end demonstration only; ' +
                'it is not saved after you reload the page.'
            )
        );

        summary.appendChild(document.createElement('hr'));

        const addDetail = (label, value) => {
            const paragraph = createEl('p', 'mb-1');

            paragraph.append(
                createEl('strong', '', `${label}:`),
                document.createTextNode(` ${value}`)
            );

            summary.appendChild(paragraph);
        };

        addDetail('Name', name);
        addDetail('Email', email);
        addDetail('Visit Date', visitDate);
        addDetail('Rating', `${rating} stars`);
        addDetail('Comment', comment);

        const submitAnother = createEl(
            'button',
            'btn btn-primary mt-3',
            'Submit Another'
        );

        submitAnother.type = 'button';

        submitAnother.addEventListener('click', () => {
            window.location.reload();
        });

        feedbackForm.append(summary, submitAnother);
    });
});