'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const feedbackForm = document.querySelector('#feedback-form') || document.querySelector('form');
  if (!feedbackForm) return;

  // 1. REVIEWS MODULE (Array & Reusable Rendering)
  const reviewsData = [
    { name: 'Alice Smith', rating: 5, date: '2026-10-15', comment: 'Amazing coffee and cozy atmosphere! Will definitely return.' },
    { name: 'Bob Jones', rating: 4, date: '2026-10-18', comment: 'Great service, but the music was a bit too loud for me.' },
    { name: 'Charlie Davis', rating: 5, date: '2026-10-20', comment: 'The best espresso in Astana. Highly recommended.' },
    { name: 'Diana Prince', rating: 3, date: '2026-10-21', comment: 'Decent coffee, but the wait time was too long during rush hour.' },
    { name: 'Evan Wright', rating: 4, date: '2026-10-22', comment: 'Loved the pastries! The barista was very friendly.' },
    { name: 'Fiona Gallagher', rating: 5, date: '2026-10-22', comment: 'Perfect spot for remote work. Free WiFi and great lattes.' }
  ];

  // Inject Reviews Container dynamically
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
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${review.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)} | ${review.date}</h6>
          <p class="card-text">"${review.comment}"</p>
        </div>
      </div>
    `;
    return col;
  };

  const displayReviews = () => {
    reviewsContainer.innerHTML = '';
    reviewsData.forEach(review => reviewsContainer.appendChild(renderReviewCard(review)));
  };

  displayReviews();

  // 2. FORM AUGMENTATION (Inject fields to meet the 4-rule + comparison brief requirement)
  const submitBtn = feedbackForm.querySelector('button[type="submit"]') || feedbackForm.querySelector('.btn');
  
  // Create Date Field
  const dateWrapper = document.createElement('div');
  dateWrapper.className = 'mb-3';
  dateWrapper.innerHTML = `
    <label for="visit-date" class="form-label">Date of Visit <span class="text-danger">*</span></label>
    <input type="date" id="visit-date" class="form-control">
    <div class="invalid-feedback"></div>
  `;
  feedbackForm.insertBefore(dateWrapper, submitBtn.closest('.mb-3') || submitBtn);

  // Create Confirm Email Field for cross-field comparison
  const confirmEmailWrapper = document.createElement('div');
  confirmEmailWrapper.className = 'mb-3';
  confirmEmailWrapper.innerHTML = `
    <label for="confirm-email" class="form-label">Confirm Email <span class="text-danger">*</span></label>
    <input type="email" id="confirm-email" class="form-control">
    <div class="invalid-feedback"></div>
  `;
  const emailInput = feedbackForm.querySelector('input[type="email"]') || feedbackForm.querySelector('#email');
  if (emailInput) {
    emailInput.closest('.mb-3')?.insertAdjacentElement('afterend', confirmEmailWrapper);
  } else {
    feedbackForm.insertBefore(confirmEmailWrapper, dateWrapper);
  }

  // 3. CHARACTER COUNTER
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

  // 4. INLINE VALIDATION UTILITIES
  const showError = (input, message) => {
    if (!input) return;
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    const feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = message;
    } else {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'invalid-feedback';
      errorDiv.textContent = message;
      input.insertAdjacentElement('afterend', errorDiv);
    }
  };

  const clearError = (input) => {
    if (!input) return;
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  };

  // 5. FORM SUBMIT HANDLER
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset visual states
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

    // DOM Nodes
    const nameEl = feedbackForm.querySelector('#name') || feedbackForm.querySelector('input[type="text"]');
    const emailEl = feedbackForm.querySelector('#email') || feedbackForm.querySelector('input[type="email"]');
    const confirmEmailEl = feedbackForm.querySelector('#confirm-email');
    const dateEl = feedbackForm.querySelector('#visit-date');
    const ratingEl = feedbackForm.querySelector('#rating') || feedbackForm.querySelector('select');

    // Values
    const name = nameEl?.value.trim() ?? '';
    const email = emailEl?.value.trim() ?? '';
    const confirmEmail = confirmEmailEl?.value.trim() ?? '';
    const visitDate = dateEl?.value ?? '';
    const rating = ratingEl?.value ?? '5';
    const message = messageInput?.value.trim() ?? '';

    // Rules
    checkField(name.length >= 2, nameEl, 'Name must be at least 2 characters.');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    checkField(emailRegex.test(email), emailEl, 'Please enter a valid email address.');
    checkField(confirmEmail === email && confirmEmail !== '', confirmEmailEl, 'Emails must match exactly.');

    const today = new Date().toISOString().split('T')[0];
    checkField(visitDate !== '' && visitDate <= today, dateEl, 'Visit date cannot be blank or in the future.');

    checkField(message.length >= 10 && message.length <= 500, messageInput, 'Message must be between 10 and 500 characters.');

    // Break early if invalid, focus first issue
    if (!isValid) {
      firstInvalidInput?.focus();
      return;
    }

    // Success flow: Add new review to array and refresh
    const newReview = {
      name: name,
      rating: parseInt(rating),
      date: today,
      comment: message
    };
    
    reviewsData.unshift(newReview);
    displayReviews();

    // Show summary & demonstration message
    feedbackForm.innerHTML = `
      <div class="alert alert-success">
        <h4 class="alert-heading">Feedback Submitted!</h4>
        <p>This is a front-end demonstration only. No data was sent to a server.</p>
        <hr>
        <p class="mb-1"><strong>Name:</strong> ${name}</p>
        <p class="mb-1"><strong>Email:</strong> ${email}</p>
        <p class="mb-1"><strong>Visit Date:</strong> ${visitDate}</p>
        <p class="mb-1"><strong>Rating:</strong> ${rating} Stars</p>
        <p class="mb-0"><strong>Message:</strong> ${message}</p>
      </div>
      <button class="btn btn-primary mt-3" onclick="location.reload()">Submit Another</button>
    `;
  });
});