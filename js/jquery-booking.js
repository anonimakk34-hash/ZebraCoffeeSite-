'use strict';

/*
 * booking.js: table reservation form on booking.html, written with jQuery.
 * The old plain-JavaScript version is saved in js/old-js-version.js.
 * Needs jQuery and main.js (showBlock, hideBlock) to be loaded first.
 *
 * The HTML is frozen, so the live summary is created here; the success and
 * error boxes (#bookingResult, #bookingError) already exist and are faded in
 * and out with showBlock() / hideBlock().
 * Flow: input / change -> fix or keep the error of that field + live summary
 *       submit -> trim every field -> validateBooking() -> errors next to the
 *       fields and focus on the first wrong one, or a demo request and the
 *       form is cleared (nothing is sent anywhere).
 */

$(function () {
    const $form = $('#bookingForm');
    const $name = $('#name');
    const $email = $('#email');
    const $phone = $('#phone');
    const $guests = $('#guests');
    const $date = $('#date');
    const $time = $('#time');
    const $notes = $('#notes');
    const $clearButton = $('#clearButton');
    const $resultBox = $('#bookingResult');
    const $errorBox = $('#bookingError');

    // Stop on pages that do not have the booking form.
    if ($form.length === 0 || $name.length === 0 || $email.length === 0 || $phone.length === 0 ||
        $guests.length === 0 || $date.length === 0 || $time.length === 0 || $notes.length === 0 ||
        $clearButton.length === 0 || $resultBox.length === 0 || $errorBox.length === 0) {
        return;
    }

    // Remove the entire repetitive information panel and center the actual form.
    // This is done in jQuery; booking.html and the CSS files stay untouched.
    const $bookingSection = $form.closest('section');
    const $bookingRow = $form.closest('.row');
    $bookingRow.children().not($form.closest('.col-12')).remove();
    $form.closest('.col-12').removeClass('col-lg-7').addClass('col-lg-9 mx-auto');
    $bookingSection.children('h2, p.lead').addClass('text-center');
    // The old footnotes referred to the removed information panel.
    $bookingSection.children('p.small').remove();

    // Decorative introduction and form polish, without editing booking.html.
    const $design = $('<style>').text(`
      .zc-booking-hero {position:relative;isolation:isolate;overflow:hidden;border-radius:22px;padding:52px 24px;margin-bottom:30px;text-align:center;color:white;background:#30251e}
      .zc-booking-hero:before {content:'';position:absolute;inset:0;z-index:-2;background:url('images/zc-new-interior.jpg') center/cover}
      .zc-booking-hero:after {content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(110deg,#1d1714e8,#251d17a6)}
      .zc-booking-hero h2 {color:white;font-weight:800;margin-bottom:12px}
      .zc-booking-hero p {color:#f5e9db!important;max-width:580px;margin:0 auto!important}
      .zc-booking-card {border:1px solid #e9dccb!important;border-radius:20px!important;box-shadow:0 18px 42px #3928171b!important;overflow:hidden}
      .zc-booking-card .card-body {padding:clamp(20px,4vw,45px)}
      .zc-booking-card input,.zc-booking-card select,.zc-booking-card textarea {border-radius:10px;transition:border-color .2s,box-shadow .2s}
      .zc-booking-card input:focus,.zc-booking-card select:focus,.zc-booking-card textarea:focus {border-color:#a47b52;box-shadow:0 0 0 .2rem #b58b5833}
      .zc-booking-card {border-top:5px solid #9e7655!important;background:#fffdf9}
      .zc-booking-card .form-label {font-weight:650;color:#4a382b}
      .zc-booking-card fieldset {border:1px solid #e9dccd!important;border-radius:14px!important;background:#fffaf4;padding:22px!important}
      .zc-booking-card legend {font-size:1.2rem;font-weight:750;color:#4a3326;border-bottom:1px solid #eadccc;padding-bottom:10px;margin-bottom:22px}
      .zc-booking-card .form-check {display:inline-flex;align-items:center;gap:8px;margin:0 12px 10px 0;padding:11px 16px 11px 36px;border:1px solid #e3d3bf;border-radius:12px;background:white;transition:background .2s,border-color .2s}
      .zc-booking-card .form-check:has(input:checked) {background:#f4e8d8;border-color:#a57c57}
      .zc-booking-card .form-check-input {min-height:initial;width:1.05em;height:1.05em;margin-top:0}
      .zc-booking-card .form-check-label {cursor:pointer;font-weight:650;color:#4b3829}
      .zc-booking-card .form-check:hover {border-color:#b18a65;background:#fbf3e9}
      .zc-booking-card .btn[type=submit] {font-weight:750;letter-spacing:.01em;padding:12px 20px}
      .zc-booking-card .form-text {color:#766354}
      .zc-booking-card #booking-summary {border-radius:12px;background:#f8f0e5;border-color:#e8d8c5}

      .zc-booking-card input,.zc-booking-card select,.zc-booking-card textarea {min-height:43px;border-color:#d9cbb9}
      .zc-booking-card button {border-radius:11px;transition:transform .2s,box-shadow .2s}
      .zc-booking-card button:hover {box-shadow:0 7px 17px #39281722}
      .zc-booking-card button:hover {transform:translateY(-2px)}
      .zc-booking-gallery {display:block;margin:0 auto 26px;max-width:960px}
      .zc-booking-gallery img {display:block;width:100%;height:145px;object-fit:cover;object-position:center 55%;border-radius:16px;box-shadow:0 8px 24px #30200e22}
      @media(max-width:600px){.zc-booking-gallery img{height:95px}}
      .zc-booking-steps {display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin:0 auto 28px}
      .zc-booking-steps span {background:#f8f0e5;border:1px solid #e7d6bf;border-radius:30px;padding:9px 17px;color:#55402f;font-weight:600;font-size:.9rem}
      @media(prefers-reduced-motion:reduce){.zc-booking-card button{transition:none}}
    `);
    $('head').append($design);
    const $intro = $bookingSection.children('h2, p.lead');
    $intro.filter('p.lead').text('Choose your date, time and favourite spot in just a few steps.');
    $intro.wrapAll('<div class="zc-booking-hero"></div>');
    $form.closest('.card').addClass('zc-booking-card');
    // One tasteful image band instead of three repeated photos.
    const $gallery = $('<div>', {'class':'zc-booking-gallery','aria-label':'Our café'});
    $gallery.append($('<img>',{src:'images/zc-new-latte.jpg',alt:'Fresh latte in our café',loading:'lazy'}));
    $gallery.insertBefore($bookingRow);

    const MAX_GUESTS = 15;
    const MIN_NAME_LENGTH = 2;
    const MAX_NOTES_LENGTH = 300;
    const FULLY_BOOKED_TIMES = ['20:00']; // the page says 20:00 is fully booked

    const NAME_PATTERN = /^[\p{L}][\p{L} .'-]*$/u;      // letters, spaces, dot, apostrophe, hyphen
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const PHONE_PATTERN = /^\+?[0-9\s().-]+$/;          // digits and the usual separators

    // Fields that are checked, in page order (jQuery returns them in DOM order).
    const CHECKED_FIELDS = '#name, #email, #phone, #guests, #date, #time, #notes';

    let resetAfterSuccess = false; // true while the script itself clears the form

    $form.prop('noValidate', true);

    // ---------- date helpers ----------

    // Today as "YYYY-MM-DD" in the visitor's own time zone.
    function getTodayString() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${now.getFullYear()}-${month}-${day}`;
    }

    // Last available booking date: 15 calendar days after today (local time).
    function getMaxBookingDateString() {
        const date = new Date();
        date.setHours(12, 0, 0, 0);
        date.setDate(date.getDate() + 15);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    }

    function updateBookingDateLimits() {
        $date.attr({ min: getTodayString(), max: getMaxBookingDateString() });
    }

    // "18:30" -> 1110 (minutes since midnight)
    function toMinutes(timeText) {
        const parts = timeText.split(':').map(Number);
        return parts[0] * 60 + parts[1];
    }

    // The browser itself will not offer past days in the date picker.
    updateBookingDateLimits();

    // Mark the fully booked time in the list (matches the text on the page).
    $time.find('option').each(function () {
        const $option = $(this);

        if (FULLY_BOOKED_TIMES.includes($option.val())) {
            $option.prop('disabled', true).text(`${$option.text()} (fully booked)`);
        }
    });

    // ---------- live summary ----------

    const $summaryBox = $('<div>', { id: 'booking-summary', 'class': 'alert alert-secondary mt-3', 'aria-live': 'polite' });
    $summaryBox.insertBefore($resultBox);

    function getSelectedZone() {
        const $checked = $form.find('input[name="zone"]:checked');

        if ($checked.length === 0) {
            return 'No preference';
        }

        const $label = $form.find(`label[for="${$checked.attr('id')}"]`);
        return $label.length === 0 ? $checked.val() : $label.text().trim();
    }

    // [label, value] pairs for everything the visitor has filled in so far.
    function collectBookingDetails() {
        return [
            ['Name', $name.val().trim()],
            ['Guests', $guests.val().trim()],
            ['Date', $date.val()],
            ['Time', $time.val()],
            ['Seating', getSelectedZone()],
            ['Special requests', $notes.val().trim()]
        ].filter((pair) => pair[1] !== '');
    }

    function renderLiveSummary() {
        const $list = $('<ul>', { 'class': 'mb-0' });

        $.each(collectBookingDetails(), function (index, pair) {
            $('<li>', { text: `${pair[0]}: ${pair[1]}` }).appendTo($list);
        });

        $summaryBox.empty().append($('<p>', { 'class': 'fw-semibold mb-1', text: 'Your request so far' }), $list);
    }

    // ---------- trimming ----------

    // Removes extra spaces at both ends of every text field and writes the
    // clean value back into the input.
    function trimTextFields() {
        $form.find('input:not([type="radio"]):not([type="checkbox"]), textarea').each(function () {
            const $field = $(this);
            $field.val($field.val().trim());
        });
    }

    // ---------- validators: one per field, each returns '' or an error text ----------

    const validators = {
        name: function () {
            const value = $name.val().trim();

            if (value.length < MIN_NAME_LENGTH) {
                return `Enter your name (at least ${MIN_NAME_LENGTH} characters).`;
            }

            if (!NAME_PATTERN.test(value)) {
                return 'The name can contain only letters, spaces, dots, apostrophes and hyphens.';
            }

            return '';
        },

        email: function () {
            const value = $email.val().trim();

            if (value === '') {
                return 'Enter your email address.';
            }

            return EMAIL_PATTERN.test(value) ? '' : 'Enter a valid email address, for example you@example.com.';
        },

        // Kazakhstan mobile numbers: +7 7XX XXX XX XX, 8 7XX XXX XX XX,
        // or 7XX XXX XX XX. Reject random digit strings and repeated digits.
        phone: function () {
            const value = $phone.val().trim();
            if (value === '') return ''; // optional field

            const digits = value.replace(/\D/g, '');
            const allowedCharacters = /^\+?[\d\s().-]+$/.test(value);
            const normalized = digits.length === 11 && /^[78]7/.test(digits)
                ? digits.slice(1) : digits;
            const validMobile = /^7\d{9}$/.test(normalized);
            const plausible = !/(\d)\1{6,}/.test(normalized);
            if (!allowedCharacters || !validMobile || !plausible ||
                (value.includes('+') && !value.startsWith('+7'))) {
                return 'Enter a Kazakhstan mobile number, e.g. +7 747 029 0093.';
            }
            return '';
        },

        guests: function () {
            const raw = $guests.val().trim();
            const guests = Number(raw);

            if (raw === '' || !Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
                return `Guests must be a whole number from 1 to ${MAX_GUESTS}.`;
            }

            return '';
        },

        date: function () {
            const value = $date.val();

            if (value === '') {
                return 'Please choose a date.';
            }

            updateBookingDateLimits();
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                return 'Please enter a valid date.';
            }
            if (value < getTodayString()) {
                return 'You cannot book a date in the past.';
            }
            if (value > getMaxBookingDateString()) {
                return 'You can book a table up to 15 days in advance.';
            }
            return '';
        },

        time: function () {
            const value = $time.val();

            if (value === '') {
                return 'Please choose a time.';
            }

            if (FULLY_BOOKED_TIMES.includes(value)) {
                return `${value} is fully booked. Please choose another time.`;
            }

            // Rule that combines two fields: for today the time must still be ahead.
            if ($date.val() === getTodayString()) {
                const now = new Date();

                if (toMinutes(value) <= now.getHours() * 60 + now.getMinutes()) {
                    return 'That time has already passed today.';
                }
            }

            return '';
        },

        // Optional, but not endless.
        notes: function () {
            return $notes.val().trim().length > MAX_NOTES_LENGTH
                ? `Special requests can be at most ${MAX_NOTES_LENGTH} characters.`
                : '';
        }
    };

    // Runs the validator of one field and returns its message ('' = valid).
    function validateField($field) {
        const check = validators[$field.attr('id')];
        return check === undefined ? '' : check();
    }

    // Returns a list of { $field, message } in page order; empty list = valid.
    function validateBooking() {
        const errors = [];

        $form.find(CHECKED_FIELDS).each(function () {
            const $field = $(this);
            const message = validateField($field);

            if (message !== '') {
                errors.push({ $field: $field, message: message });
            }
        });

        return errors;
    }

    // ---------- errors next to the fields ----------

    function clearFieldError($field) {
        $field.removeClass('error').removeAttr('aria-invalid');
        $field.parent().find(`[data-error-for="${$field.attr('id')}"]`).remove();
    }

    function showFieldError($field, message) {
        clearFieldError($field);
        $field.addClass('error').attr('aria-invalid', 'true');

        $('<small>', { 'class': 'text-danger d-block mt-1', text: message })
            .attr('data-error-for', $field.attr('id'))
            .hide()
            .insertAfter($field)
            .slideDown(150);
    }

    function clearAllErrors() {
        $form.find('[data-error-for]').remove();
        $form.find('.error').removeClass('error').removeAttr('aria-invalid');
    }

    // Called while the visitor types: a field that shows an error is checked
    // again, and the error disappears as soon as the value is correct.
    function refreshFieldError($field) {
        if (!$field.hasClass('error')) {
            return;
        }

        const message = validateField($field);

        if (message === '') {
            clearFieldError($field);
        } else {
            $field.siblings('[data-error-for]').text(message);
        }
    }

    // ---------- result boxes (show / hide with effects) ----------

    function showFailure(errors) {
        const word = errors.length === 1 ? 'field' : 'fields';

        hideBlock($resultBox, 200);
        $resultBox.removeClass('success');
        $errorBox.addClass('error').text(`Please correct ${errors.length} highlighted ${word} and try again.`);
        showBlock($errorBox, 300);
    }

    function showSuccess() {
        const requestNumber = `BK-${Math.floor(Math.random() * 9000) + 1000}`;
        const $list = $('<ul>', { 'class': 'mb-2' });
        const $submit = $form.find("[type='submit']");

        $.each(collectBookingDetails(), function (index, pair) {
            $('<li>', { text: `${pair[0]}: ${pair[1]}` }).appendTo($list);
        });

        hideBlock($errorBox, 200);
        $errorBox.removeClass('error');

        $resultBox.empty().append(
            $('<h3>', { 'class': 'h5', text: 'Demo booking request' }),
            $('<p>', { 'class': 'fw-semibold mb-2' }).html(`Demo request number: <strong>${requestNumber}</strong>`),
            $list,
            $('<p>', { 'class': 'small mb-0', text: 'This is a demo: your request is not sent anywhere and no table has been reserved.' })
        ).addClass('success');
        showBlock($resultBox, 400);

        // The request is shown above, so the form can be cleared now.
        resetAfterSuccess = true;
        $form[0].reset();

        // The button confirms the booking for two seconds.
        const label = $submit.text().trim();
        $submit.prop('disabled', true).text('Request sent ✓');
        window.setTimeout(function () {
            $submit.prop('disabled', false).text(label);
        }, 2000);
    }

    function hideResultBoxes() {
        hideBlock($resultBox, 200, function () {
            $(this).removeClass('success');
        });
        hideBlock($errorBox, 200, function () {
            $(this).removeClass('error');
        });
    }

    // ---------- events ----------

    $form.on('submit', function (event) {
        event.preventDefault();
        clearAllErrors();
        trimTextFields();

        const errors = validateBooking();

        if (errors.length > 0) {
            $.each(errors, function (index, item) {
                showFieldError(item.$field, item.message);
            });
            $form.find('.error:first').trigger('focus');
            showFailure(errors);
            return;
        }

        showSuccess();
    });

    // EVENT DELEGATION: one handler on the form for every field inside it.
    $form.on('input change', 'input, select, textarea', function () {
        const $field = $(this);

        refreshFieldError($field);

        // The date decides if the chosen time has already passed.
        if ($field.is('#date')) {
            refreshFieldError($time);
        }

        renderLiveSummary();
    });

    // Remove the extra spaces as soon as the visitor leaves a text field.
    $form.on('focusout', 'input[type="text"], input[type="email"], input[type="tel"], textarea', function () {
        const $field = $(this);
        $field.val($field.val().trim());
        renderLiveSummary();
    });

    $clearButton.on('click', hideResultBoxes);

    $form.on('reset', function () {
        const keepResult = resetAfterSuccess;
        resetAfterSuccess = false;

        // The browser clears the fields after the reset event, so wait one tick.
        window.setTimeout(function () {
            clearAllErrors();

            if (!keepResult) {
                hideResultBoxes();
            }

            renderLiveSummary();
        }, 0);
    });

    renderLiveSummary();
});
