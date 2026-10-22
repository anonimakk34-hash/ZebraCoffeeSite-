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
        reviewsContainer = document.createElement('div');
        reviewsContainer.id = 'reviews-list';
        reviewsContainer.className = 'row g-4 mt-5';

        const reviewsTitle = document.createElement('h3');
        reviewsTitle.className = 'mt-5 mb-3';
        reviewsTitle.textContent = 'Recent Customer Reviews';

        feedbackForm.insertAdjacentElement('afterend', reviewsContainer);
        feedbackForm.insertAdjacentElement('afterend', reviewsTitle);
    }

    const renderReviewCard = (review) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        
        const card = document.createElement('div');
        card.className = 'card h-100 shadow-sm';
        
        const body = document.createElement('div');
        body.className = 'card-body';
        
        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = review.name;
        
        const sub = document.createElement('h6');
        sub.className = 'card-subtitle mb-2 text-muted';
        sub.textContent = `${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)} | ${review.date}`;
        
        const p = document.createElement('p');
        p.className = 'card-text';
        p.textContent = `"${review.comment}"`;
        
        body.appendChild(title);
        body.appendChild(sub);
        body.appendChild(p);
        card.appendChild(body);
        col.appendChild(card);
        
        return col;
    };

    const displayReviews = () => {
        reviewsContainer.innerHTML = '';
        reviewsData.forEach(review => reviewsContainer.appendChild(renderReviewCard(review)));
    };

    displayReviews();

    const submitBtn = feedbackForm.querySelector('button[type="submit"]') || feedbackForm.querySelector('.btn');

    const dateWrapper = document.createElement('div');
    dateWrapper.className = 'mb-3';
    
    const dateLabel = document.createElement('label');
    dateLabel.className = 'form-label';
    dateLabel.textContent = 'Date of Visit ';
    const dateAsterisk = document.createElement('span');
    dateAsterisk.className = 'text-danger';
    dateAsterisk.textContent = '*';
    dateLabel.appendChild(dateAsterisk);
    
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'visit-date';
    dateInput.className = 'form-control';
    
    const dateFeedback = document.createElement('div');
    dateFeedback.className = 'invalid-feedback';
    
    dateWrapper.appendChild(dateLabel);
    dateWrapper.appendChild(dateInput);
    dateWrapper.appendChild(dateFeedback);
    
    feedbackForm.insertBefore(dateWrapper, submitBtn.closest('.mb-3') || submitBtn);

    const confirmEmailWrapper = document.createElement('div');
    confirmEmailWrapper.className = 'mb-3';
    
    const cEmailLabel = document.createElement('label');
    cEmailLabel.className = 'form-label';
    cEmailLabel.textContent = 'Confirm Email ';
    const cEmailAsterisk = document.createElement('span');
    cEmailAsterisk.className = 'text-danger';
    cEmailAsterisk.textContent = '*';
    cEmailLabel.appendChild(cEmailAsterisk);
    
    const cEmailInput = document.createElement('input');
    cEmailInput.type = 'email';
    cEmailInput.id = 'confirm-email';
    cEmailInput.className = 'form-control';
    
    const cEmailFeedback = document.createElement('div');
    cEmailFeedback.className = 'invalid-feedback';
    
    confirmEmailWrapper.appendChild(cEmailLabel);
    confirmEmailWrapper.appendChild(cEmailInput);
    confirmEmailWrapper.appendChild(cEmailFeedback);

    const emailInput = feedbackForm.querySelector('input[type="email"]') || feedbackForm.querySelector('#email');
    if (emailInput) {
        emailInput.closest('.mb-3')?.insertAdjacentElement('afterend', confirmEmailWrapper);
    } else {
        feedbackForm.insertBefore(confirmEmailWrapper, dateWrapper);
    }

    const messageInput = feedbackForm.querySelector('textarea');
    if (messageInput) {
        const charCounter = document.createElement('small');
        charCounter.className = 'text-muted d-block mt-1';
        charCounter.textContent = '0 / 500 characters (Min 10)';
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
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = message;
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
        if (window.hideMessage) window.hideMessage();

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
        const emailEl = feedbackForm.querySelector('#email') || feedbackForm.querySelector('input[type="email"]');
        const confirmEmailEl = document.querySelector('#confirm-email');
        const dateEl = document.querySelector('#visit-date');
        const ratingEl = feedbackForm.querySelector('#rating') || feedbackForm.querySelector('select');

        const name = nameEl?.value.trim() ?? '';
        const email = emailEl?.value.trim() ?? '';
        const confirmEmail = confirmEmailEl?.value.trim() ?? '';
        const visitDate = dateEl?.value ?? '';
        const rating = ratingEl?.value ?? '5';
        const message = messageInput?.value.trim() ?? '';

        checkField(name.length >= 2, nameEl, 'Name must be at least 2 characters.');
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        checkField(emailRegex.test(email), emailEl, 'Please enter a valid email address.');
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

        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'alert alert-success';
        
        const summaryHeading = document.createElement('h4');
        summaryHeading.className = 'alert-heading';
        summaryHeading.textContent = 'Feedback Submitted!';
        
        const summaryMsg = document.createElement('p');
        summaryMsg.textContent = 'This is a front-end demonstration only. No data was sent to a server.';
        
        const hr = document.createElement('hr');
        
        const nameP = document.createElement('p');
        nameP.className = 'mb-1';
        nameP.innerHTML = '<strong>Name:</strong> ';
        nameP.appendChild(document.createTextNode(name));

        const emailP = document.createElement('p');
        emailP.className = 'mb-1';
        emailP.innerHTML = '<strong>Email:</strong> ';
        emailP.appendChild(document.createTextNode(email));

        const dateP = document.createElement('p');
        dateP.className = 'mb-1';
        dateP.innerHTML = '<strong>Visit Date:</strong> ';
        dateP.appendChild(document.createTextNode(visitDate));

        const ratingP = document.createElement('p');
        ratingP.className = 'mb-1';
        ratingP.innerHTML = '<strong>Rating:</strong> ';
        ratingP.appendChild(document.createTextNode(rating + ' Stars'));

        const msgP = document.createElement('p');
        msgP.className = 'mb-0';
        msgP.innerHTML = '<strong>Message:</strong> ';
        msgP.appendChild(document.createTextNode(message));

        summaryDiv.appendChild(summaryHeading);
        summaryDiv.appendChild(summaryMsg);
        summaryDiv.appendChild(hr);
        summaryDiv.appendChild(nameP);
        summaryDiv.appendChild(emailP);
        summaryDiv.appendChild(dateP);
        summaryDiv.appendChild(ratingP);
        summaryDiv.appendChild(msgP);

        const reloadBtn = document.createElement('button');
        reloadBtn.className = 'btn btn-primary mt-3';
        reloadBtn.textContent = 'Submit Another';
        reloadBtn.addEventListener('click', () => location.reload());

        feedbackForm.innerHTML = '';
        feedbackForm.appendChild(summaryDiv);
        feedbackForm.appendChild(reloadBtn);
    });
});
