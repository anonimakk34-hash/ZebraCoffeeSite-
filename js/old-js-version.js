'use strict';

function oldBookingValidation() {
    const form = document.querySelector('#bookingForm');
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const phoneInput = document.querySelector('#phone');
    const guestsInput = document.querySelector('#guests');
    const dateInput = document.querySelector('#date');
    const timeSelect = document.querySelector('#time');

    const MAX_GUESTS = 15;
    const MIN_NAME_LENGTH = 2;
    const FULLY_BOOKED_TIMES = ['20:00'];
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function getTodayString() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${now.getFullYear()}-${month}-${day}`;
    }

    function toMinutes(timeText) {
        const [hours, minutes] = timeText.split(':').map(Number);
        return hours * 60 + minutes;
    }


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

    // ---------- events (validation part) ----------

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
}

// =====================================================================
// 2. MENU SEARCH / FILTER (old js/menu.js)
// =====================================================================
function oldMenuSearch() {
    const finder = {}; // references to the elements created in buildFinder()

    // Keeps drinks whose name contains the query AND that match the category.
    function filterDrinks(drinks, query, category) {
        const needle = query.trim().toLowerCase();

        return drinks.filter((drink) => {
            const matchesCategory = category === 'all' || drink.category === category;
            const matchesQuery = drink.name.toLowerCase().includes(needle);
            return matchesCategory && matchesQuery;
        });
    }

    // Returns a NEW sorted array; the original DRINKS array is never changed.
    function sortDrinks(drinks, mode) {
        const sorted = [...drinks];

        switch (mode) {
            case 'price-asc':
                sorted.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
                break;
            case 'price-desc':
                sorted.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        return sorted;
    }

    // Re-reads all three controls and redraws everything that depends on them.
    function updateResults() {
        const filtered = filterDrinks(DRINKS, finder.search.value, finder.category.value);
        const sorted = sortDrinks(filtered, finder.sort.value);

        renderDrinkCards(sorted, finder.results);
        finder.count.textContent = `Showing ${sorted.length} of ${DRINKS.length} drinks`;
        finder.empty.classList.toggle('hidden', sorted.length > 0);
    }

    function resetFilters() {
        finder.search.value = '';
        finder.category.value = 'all';
        finder.sort.value = 'default';
        updateResults();
        finder.search.focus();
    }

    // Event types used here: input, change, click, keydown.
    finder.search.addEventListener('input', updateResults);
    finder.category.addEventListener('change', updateResults);
    finder.sort.addEventListener('change', updateResults);
    finder.reset.addEventListener('click', resetFilters);
    finder.search.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            resetFilters();
        }
    });
}

// =====================================================================
// 3. SHOW / HIDE OF BLOCKS (old js/booking.js: success and error boxes)
// =====================================================================
function oldShowHideBoxes() {
    const resultBox = document.querySelector('#bookingResult');
    const errorBox = document.querySelector('#bookingError');

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

    clearButton.addEventListener('click', hideResultBoxes);

    form.addEventListener('reset', () => {
        // The browser clears the fields after the reset event, so wait one tick.
        window.setTimeout(() => {
            clearAllErrors();
            hideResultBoxes();
            renderLiveSummary();
        }, 0);
    });
}

// =====================================================================
// EXTRA: navbar highlight and footer year (old js/main.js)
// =====================================================================
function oldNavbarAndFooter() {
// "/site/Order.html" -> "order.html"; "/site/" -> "index.html"
function getCurrentPage() {
    const lastPart = window.location.pathname.split('/').pop().toLowerCase();
    return lastPart === '' ? 'index.html' : lastPart;
}

// The HTML marks several links as "active", so the script fixes it:
// only the link that points to the current page keeps the class.
function highlightCurrentPage() {
    const currentPage = getCurrentPage();

    document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
        const isCurrent = link.getAttribute('href').toLowerCase() === currentPage;

        link.classList.toggle('active', isCurrent);

        if (isCurrent) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function updateFooterYear() {
    const footerText = document.querySelector('footer p');

    if (footerText !== null) {
        footerText.textContent = `© ${new Date().getFullYear()} Zebra Coffee`;
    }
}
}
