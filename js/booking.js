'use strict';

/*
 * booking.js: table reservation form on booking.html.
 * The HTML is frozen, so the live summary is created here; the success and
 * error boxes (#bookingResult, #bookingError) already exist and are shown or
 * hidden with the ready-made "hidden" class.
 * Flow: input/change -> renderLiveSummary()
 *       submit -> validateBooking() -> errors next to the fields + focus on
 *       the first wrong field, or a demo request (nothing is sent anywhere).
 * createEl() comes from main.js.
 */

(() => {
    const form = document.querySelector('#bookingForm');
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const phoneInput = document.querySelector('#phone');
    const guestsInput = document.querySelector('#guests');
    const dateInput = document.querySelector('#date');
    const timeSelect = document.querySelector('#time');
    const notesInput = document.querySelector('#notes');
    const clearButton = document.querySelector('#clearButton');
    const resultBox = document.querySelector('#bookingResult');
    const errorBox = document.querySelector('#bookingError');

    // Stop on pages that do not have the booking form.
    if (
        form === null ||
        nameInput === null ||
        emailInput === null ||
        phoneInput === null ||
        guestsInput === null ||
        dateInput === null ||
        timeSelect === null ||
        notesInput === null ||
        clearButton === null ||
        resultBox === null ||
        errorBox === null
    ) {
        return;
    }

    const MAX_GUESTS = 15;
    const MIN_NAME_LENGTH = 2;
    const FULLY_BOOKED_TIMES = ['20:00']; // the page says 20:00 is fully booked
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.noValidate = true;

    // ---------- date helpers ----------

    // Today as "YYYY-MM-DD" in the visitor's own time zone.
    function getTodayString() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${now.getFullYear()}-${month}-${day}`;
    }

    // "18:30" -> 1110 (minutes since midnight)
    function toMinutes(timeText) {
        const [hours, minutes] = timeText.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // The browser itself will not offer past days in the date picker.
    dateInput.min = getTodayString();

    // Mark the fully booked time in the list (matches the text on the page).
    Array.from(timeSelect.options).forEach((option) => {
        if (FULLY_BOOKED_TIMES.includes(option.value)) {
            option.disabled = true;
            option.textContent = `${option.textContent} (fully booked)`;
        }
    });

    // ---------- live summary ----------

    const summaryBox = createEl('div', 'alert alert-secondary mt-3');
    summaryBox.id = 'booking-summary';
    summaryBox.setAttribute('aria-live', 'polite');
    resultBox.before(summaryBox);

    function getSelectedZone() {
        const checked = form.querySelector('input[name="zone"]:checked');

        if (checked === null) {
            return 'No preference';
        }

        const label = form.querySelector(`label[for="${checked.id}"]`);
        return label === null ? checked.value : label.textContent.trim();
    }

    // [label, value] pairs for everything the visitor has filled in so far.
    function collectBookingDetails() {
        return [
            ['Name', nameInput.value.trim()],
            ['Guests', guestsInput.value.trim()],
            ['Date', dateInput.value],
            ['Time', timeSelect.value],
            ['Seating', getSelectedZone()],
            ['Special requests', notesInput.value.trim()]
        ].filter(([, value]) => value !== '');
    }

    function renderLiveSummary() {
        const details = collectBookingDetails();

        summaryBox.replaceChildren(createEl('p', 'fw-semibold mb-1', 'Your request so far'));

        const list = createEl('ul', 'mb-0');
        details.forEach(([label, value]) => {
            list.append(createEl('li', '', `${label}: ${value}`));
        });
        summaryBox.append(list);
    }

    // ---------- errors ----------

    function clearFieldError(field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');

        const message = form.querySelector(`[data-error-for="${field.id}"]`);

        if (message !== null) {
            message.remove();
        }
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');

        const errorMessage = createEl('small', 'text-danger d-block mt-1', message);
        errorMessage.dataset.errorFor = field.id;
        field.after(errorMessage);
    }

    function clearAllErrors() {
        form.querySelectorAll('[data-error-for]').forEach((message) => message.remove());
        form.querySelectorAll('.error').forEach((field) => {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
        });
    }

    // ---------- validation ----------

    // Returns a list of { field, message } in page order; empty list = valid.
    function validateBooking() {
        const errors = [];
        const today = getTodayString();

        if (nameInput.value.trim().length < MIN_NAME_LENGTH) {
            errors.push({ field: nameInput, message: `Enter your name (at least ${MIN_NAME_LENGTH} characters).` });
        }

        if (EMAIL_PATTERN.test(emailInput.value.trim()) === false) {
            errors.push({ field: emailInput, message: 'Enter a valid email address.' });
        }

        // Phone is optional, but if it is filled in it must be a real number.
        const phoneDigits = phoneInput.value.replace(/\D/g, '');

        if (phoneDigits !== '' && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
            errors.push({ field: phoneInput, message: 'Phone must have 10–15 digits, or leave it empty.' });
        }

        const guests = Number(guestsInput.value);

        if (guestsInput.value.trim() === '' || Number.isInteger(guests) === false || guests < 1 || guests > MAX_GUESTS) {
            errors.push({ field: guestsInput, message: `Guests must be a whole number from 1 to ${MAX_GUESTS}.` });
        }

        if (dateInput.value === '') {
            errors.push({ field: dateInput, message: 'Please choose a date.' });
        } else if (dateInput.value < today) {
            errors.push({ field: dateInput, message: 'You cannot book a date in the past.' });
        }

        if (timeSelect.value === '') {
            errors.push({ field: timeSelect, message: 'Please choose a time.' });
        } else if (FULLY_BOOKED_TIMES.includes(timeSelect.value)) {
            errors.push({ field: timeSelect, message: `${timeSelect.value} is fully booked. Please choose another time.` });
        } else if (dateInput.value === today) {
            // Rule that combines two fields: for today the time must still be ahead.
            const now = new Date();
            const nowMinutes = now.getHours() * 60 + now.getMinutes();

            if (toMinutes(timeSelect.value) <= nowMinutes) {
                errors.push({ field: timeSelect, message: 'That time has already passed today.' });
            }
        }

        return errors;
    }

    // ---------- result boxes ----------

    function showFailure(errors) {
        resultBox.classList.add('hidden');
        resultBox.classList.remove('success');
        errorBox.classList.remove('hidden');
        errorBox.classList.add('error');
        errorBox.textContent = `Please correct ${errors.length} highlighted ${errors.length === 1 ? 'field' : 'fields'} and try again.`;
    }

    function showSuccess() {
        const requestNumber = `BK-${Math.floor(Math.random() * 9000) + 1000}`;

        errorBox.classList.add('hidden');
        errorBox.classList.remove('error');

        resultBox.replaceChildren(
            createEl('h3', 'h5', 'Demo booking request'),
            createEl('p', 'fw-semibold mb-2', `Demo request number: ${requestNumber}`)
        );

        const list = createEl('ul', 'mb-2');
        collectBookingDetails().forEach(([label, value]) => {
            list.append(createEl('li', '', `${label}: ${value}`));
        });
        resultBox.append(
            list,
            createEl('p', 'small mb-0', 'This is a demo: your request is not sent anywhere and no table has been reserved.')
        );

        resultBox.classList.remove('hidden');
        resultBox.classList.add('success');
    }

    function hideResultBoxes() {
        resultBox.classList.add('hidden');
        resultBox.classList.remove('success');
        errorBox.classList.add('hidden');
        errorBox.classList.remove('error');
    }

    // ---------- events ----------

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearAllErrors();

        const errors = validateBooking();

        if (errors.length > 0) {
            errors.forEach(({ field, message }) => showFieldError(field, message));
            errors[0].field.focus();
            showFailure(errors);
            return;
        }

        showSuccess();
    });

    form.addEventListener('input', (event) => {
        clearFieldError(event.target);
        renderLiveSummary();
    });

    form.addEventListener('change', (event) => {
        clearFieldError(event.target);
        renderLiveSummary();
    });

    clearButton.addEventListener('click', hideResultBoxes);

    form.addEventListener('reset', () => {
        // The browser clears the fields after the reset event, so wait one tick.
        window.setTimeout(() => {
            clearAllErrors();
            hideResultBoxes();
            renderLiveSummary();
        }, 0);
    });

    renderLiveSummary();
})();