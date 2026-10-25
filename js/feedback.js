'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.querySelector('#feedback-form') || document.querySelector('form');
    if (!feedbackForm) return;

    const reviewsData = [
        { name: 'Alice Smith', rating: 5, date: '2026-10-15', comment: 'Amazing coffee and cozy atmosphere! Will definitely return.' },
        { name: 'Bob Jones', rating: 4, date: '2026-10-18', comment: 'Great service, but the music was a bit too loud for me.' },
        { name: 'Charlie Davis', rating: 5, date: '2026-10-20', comment: 'The best espresso in Astana. Highly recommended.' },
        { name: 'Diana Prince', rating: 3, date: '2026-10-21', comment: 'Decent coffee, but the wait time was too long during rush hour.' },
        { name: 'Evan Wright', rating: 4, date: '2026-10-22', comment: 'Loved the pastries! The barista was very friendly.' },
        { name: 'Fiona Gallagher', rating: 5, date: '2026-10-22', comment: 'Perfect spot for remote work. Free WiFi and great lattes.' }
    ];

    let reviewsContainer = document.querySelector('#reviews-list');
    if (!reviewsContainer) {
        reviewsContainer = createEl('div', 'row g-4 mt-5');
        reviewsContainer.id = 'reviews-list';

        const reviewsTitle = createEl('h3', 'mt-5 mb-3', 'Recent Customer Reviews');

        feedbackForm.insertAdjacentElement('afterend', reviewsContainer);
        feedbackForm.insertAdjacentElement('afterend', reviewsTitle);
    }

    const renderReviewCard = (review) => {
        const col = createEl('div', 'col-md-6 col-lg-4');
        const card = createEl('div', 'card h-100 shadow-sm');
        const body = createEl('div', 'card-body');
        
        const title = createEl('h5', 'card-title', review.name);
        const sub = createEl('h6', 'card-subtitle mb-2 text-muted', `${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)} | ${review.date}`);
        const p = createEl('p', 'card-text', `"${review.comment}"`);
        
        body.append(title, sub, p);
        card.appendChild(body);
        col.appendChild(card);
        
        return col;
    };

    const displayReviews = () => {
        reviewsContainer.replaceChildren();
        reviewsData.forEach(review => reviewsContainer.appendChild(renderReviewCard(review)));
    };

    displayReviews();

    const submitBtn = feedbackForm.querySelector('button[type="submit"]') || feedbackForm.querySelector('.btn');

    // 1. Visit Date Field
    const dateWrapper = createEl('div', 'mb-3');
    const dateLabel = createEl('label', 'form-label', 'Date of Visit ');
    const dateAsterisk = createEl('span', 'text-danger', '*');
    dateLabel.appendChild(dateAsterisk);
    
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'visit-date';
    dateInput.className = 'form-control';
    
    const dateFeedback = createEl('div', 'invalid-feedback');
    dateWrapper.append(dateLabel, dateInput, dateFeedback);
    
    feedbackForm.insertBefore(dateWrapper, submitBtn.closest('.mb-3') || submitBtn);

    // 2. Confirm Email Field
    const confirmEmailWrapper = createEl('div', 'mb-3');
    const cEmailLabel = createEl('label', 'form-label', 'Confirm Email ');
    const cEmailAsterisk = createEl('span', 'text-danger', '*');
    cEmailLabel.appendChild(cEmailAsterisk);
    
    const cEmailInput = document.createElement('input');
    cEmailInput.type = 'email';
    cEmailInput.id = 'confirm-email';
    cEmailInput.className = 'form-control';
    
    const cEmailFeedback = createEl('div', 'invalid-feedback');
    confirmEmailWrapper.append(cEmailLabel, cEmailInput, cEmailFeedback);

    const emailInput = feedbackForm.querySelector('input[type="email"]') || feedbackForm.querySelector('#email');
    if (emailInput) {
        emailInput.closest('.mb-3')?.insertAdjacentElement('afterend', confirmEmailWrapper);
    } else {
        feedbackForm.insertBefore(confirmEmailWrapper, dateWrapper);
    }

    // 3. Character Counter
    const messageInput = feedbackForm.querySelector('textarea');
    if (messageInput) {
        const charCounter = createEl('small', 'text-muted d-block mt-1', '0 / 500 characters (Min 10)');
        messageInput.insertAdjacentElement('afterend', charCounter);

        messageInput.addEventListener('input', () => {
            const len = messageInput.value.length;
            charCounter.textContent = `${len} / 500 characters (Min 10)`;
            charCounter.className = len < 10 || len > 500 ? 'text-danger d-block mt-1' : 'text-success d-block mt-1';
        });
    }

    const showError = (input, message) => {
        if (!input) return;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        let feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message;
        } else {
            feedback = createEl('div', 'invalid-feedback', message);
            input.insertAdjacentElement('afterend', feedback);
        }
    };

    const clearError = (input) => {
        if (!input) return;
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    };

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideMessage();

        const inputs = feedbackForm.querySelectorAll('.form-control, .form-select');
        inputs.forEach(input => input.classList.remove('is-invalid', 'is-valid'));

        let isValid = true;
        let firstInvalidInput = null;

        const checkField = (condition, input, errorMsg) => {
            if (!input) return;
            if (!condition) {
                showError(input, errorMsg);
                isValid = false;
                if (!firstInvalidInput) firstInvalidInput = input;
            } else {
                clearError(input);
            }
        };

        const nameEl = feedbackForm.querySelector('#name') || feedbackForm.querySelector('input[type="text"]');
        const confirmEmailEl = document.querySelector('#confirm-email');
        const dateEl = document.querySelector('#visit-date');
        const ratingEl = feedbackForm.querySelector('#rating') || feedbackForm.querySelector('select');

        const name = nameEl?.value.trim() ?? '';
        const email = emailInput?.value.trim() ?? '';
        const confirmEmail = confirmEmailEl?.value.trim() ?? '';
        const visitDate = dateEl?.value ?? '';
        const rating = ratingEl?.value ?? '5';
        const message = messageInput?.value.trim() ?? '';

        checkField(name.length >= 2, nameEl, 'Name must be at least 2 characters.');
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        checkField(emailRegex.test(email), emailInput, 'Please enter a valid email address.');
        checkField(confirmEmail === email && confirmEmail !== '', confirmEmailEl, 'Emails must match exactly.');

        const today = new Date().toISOString().split('T')[0];
        checkField(visitDate !== '' && visitDate <= today, dateEl, 'Visit date cannot be blank or in the future.');

        checkField(message.length >= 10 && message.length <= 500, messageInput, 'Message must be between 10 and 500 characters.');

        if (!isValid) {
            firstInvalidInput?.focus();
            return;
        }

        const newReview = {
            name: name,
            rating: parseInt(rating),
            date: today,
            comment: message
        };
        
        reviewsData.unshift(newReview);
        displayReviews();

        // Build Success Summary Safely without innerHTML
        feedbackForm.replaceChildren(); // Safely clear form DOM
        const summaryDiv = createEl('div', 'alert alert-success');
        const summaryHeading = createEl('h4', 'alert-heading', 'Feedback Submitted!');
        const summaryMsg = createEl('p', '', 'This is a front-end demonstration only. No data was sent to a server.');
        const hr = document.createElement('hr');

        summaryDiv.append(summaryHeading, summaryMsg, hr);

        const appendDetail = (labelTxt, valTxt) => {
            const p = createEl('p', 'mb-1');
            const strong = createEl('strong', '', labelTxt);
            p.appendChild(strong);
            p.appendChild(document.createTextNode(' ' + valTxt));
            summaryDiv.appendChild(p);
        };

        appendDetail('Name:', name);
        appendDetail('Email:', email);
        appendDetail('Visit Date:', visitDate);
        appendDetail('Rating:', rating + ' Stars');
        
        const msgP = createEl('p', 'mb-0');
        const strongMsg = createEl('strong', '', 'Message:');
        msgP.appendChild(strongMsg);
        msgP.appendChild(document.createTextNode(' ' + message));
        summaryDiv.appendChild(msgP);

        const reloadBtn = createEl('button', 'btn btn-primary mt-3', 'Submit Another');
        reloadBtn.addEventListener('click', () => location.reload());

        feedbackForm.append(summaryDiv, reloadBtn);
    });
});
