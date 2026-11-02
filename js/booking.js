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

    // "18:30" -> 1110 (minutes since midnight)
    function toMinutes(timeText) {
        const parts = timeText.split(':').map(Number);
        return parts[0] * 60 + parts[1];
    }

    // The browser itself will not offer past days in the date picker.
    $date.attr('min', getTodayString());

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

        // Phone is optional, but if it is filled in it must look like a real number.
        phone: function () {
            const value = $phone.val().trim();
            const digits = value.replace(/\D/g, '');

            if (value === '') {
                return '';
            }

            if (!PHONE_PATTERN.test(value) || digits.length < 10 || digits.length > 15) {
                return 'Phone must have 10–15 digits, for example +7 747 029 0093, or leave it empty.';
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

            return value < getTodayString() ? 'You cannot book a date in the past.' : '';
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
