'use strict';

/*
 * Zebra Coffee FAQ
 * jQuery 3.7.1
 */
$(function () {

    const $faqSection = $('#faq-section');
    const $accordion = $('#faq-list');

    if ($faqSection.length === 0 || $accordion.length === 0) {
        return;
    }

    const $faqItems = $accordion.find('.faq-item');

    // Remove duplicate/static form, old search toolbar and wait-time table
    $('#ask-question-section, .faq-toolbar, #faq-no-results').remove();

    $('#faq-wait-table').closest('.col-12').remove();

    $('#faq-toggle-table-btn').remove();

    // Use the full width for FAQ questions
    $accordion.closest('.col-12')
        .removeClass('col-lg-7')
        .addClass('col-12');

    // Update the answer about waiting time
    $('#faq-answer-wait .faq-answer').text(
        'Preparation time depends on the number of current orders. During busy hours, your order may take a little longer.'
    );

    // ======================================
    // CREATE THE ASK US A QUESTION FORM
    // ======================================

    const $section = $('<section>')
        .attr('id', 'ask-question-section')
        .addClass('mt-5');

    const $heading = $('<h2>')
    .addClass('text-center mb-2')
    .text('Still Have a Question?');

    const $description = $('<p>')
        .addClass('text-center text-muted mb-4')
        .text('Could not find the answer you were looking for? Choose a subject and submit your question below.');
        const $card = $('<div>')
            .addClass('card shadow-sm border-0');

    const $body = $('<div>')
        .addClass('card-body p-4');

    const $form = $('<form>')
        .attr({
            id: 'faq-question-form',
            novalidate: 'novalidate'
        });

    // Helper to create form groups
    const createGroup = (labelText, id, $input) => {

        const $group = $('<div>').addClass('mb-3');

        const $label = $('<label>')
            .attr('for', id)
            .addClass('form-label fw-bold')
            .text(labelText);

        $group.append($label, $input);

        return $group;
    };

    // NAME
    const $nameInput = $('<input>')
        .attr({
            type: 'text',
            id: 'faq-name',
            placeholder: 'Enter your name'
        })
        .addClass('form-control bg-light');

    const $nameGroup = createGroup(
        'Your Name',
        'faq-name',
        $nameInput
    );

    // EMAIL
    const $emailInput = $('<input>')
        .attr({
            type: 'email',
            id: 'faq-email',
            placeholder: 'you@example.com'
        })
        .addClass('form-control bg-light');

    const $emailGroup = createGroup(
        'Email Address',
        'faq-email',
        $emailInput
    );

    // SUBJECT SELECT
    const $subjectInput = $('<select>')
        .attr({
            id: 'faq-subject',
            name: 'faq-subject'
        })
        .addClass('form-select bg-light');

    const subjectOptions = [
        { value: '', text: 'Select a subject' },
        { value: 'menu', text: 'Menu and Drinks' },
        { value: 'orders', text: 'Orders and Payments' },
        { value: 'booking', text: 'Table Booking' },
        { value: 'opening-hours', text: 'Opening Hours' },
        { value: 'wifi', text: 'Wi-Fi and Facilities' },
        { value: 'complaint', text: 'Complaint or Problem' },
        { value: 'other', text: 'Other' }
    ];

    $.each(subjectOptions, function (_, option) {

        $('<option>')
            .val(option.value)
            .text(option.text)
            .appendTo($subjectInput);

    });

    const $subjectGroup = createGroup(
        'Subject',
        'faq-subject',
        $subjectInput
    );

    // QUESTION
    const $questionInput = $('<textarea>')
        .attr({
            id: 'faq-question',
            rows: 4,
            maxlength: 1000,
            placeholder: 'Write your question here...'
        })
        .addClass('form-control bg-light');

    const $questionGroup = createGroup(
        'Your Question',
        'faq-question',
        $questionInput
    );

    // CHARACTER COUNTER
    const $counter = $('<small>')
        .addClass('text-muted d-block mt-1')
        .text('0 / 1000 characters');

    $questionInput.after($counter);

    // SUBMIT BUTTON
    const $submitButton = $('<button>')
        .attr('type', 'submit')
        .addClass('btn btn-dark w-100 py-2')
        .text('Submit Question');

    // RESULT CONTAINERS
    const $errorBox = $('<div>')
        .addClass('alert alert-danger hidden mt-3')
        .attr('role', 'alert');

    const $resultBox = $('<div>')
        .addClass('alert alert-success hidden mt-3')
        .attr({
            role: 'status',
            'aria-live': 'polite'
        });

    // Assemble form
    $form.append(
        $nameGroup,
        $emailGroup,
        $subjectGroup,
        $questionGroup,
        $submitButton
    );

    $body.append(
        $form,
        $errorBox,
        $resultBox
    );

    $card.append($body);

    $section.append(
        $heading,
        $description,
        $card
    );

    $faqSection.append($section);

    // ======================================
    // FIELD VALIDATION
    // ======================================

    const showError = ($input, message) => {

        clearError($input);

        $input
            .addClass('is-invalid')
            .attr('aria-invalid', 'true');

        $('<div>')
            .addClass('invalid-feedback d-block field-error')
            .text(message)
            .insertAfter($input);
    };

    const clearError = ($input) => {

        $input
            .removeClass('is-invalid')
            .removeAttr('aria-invalid');

        $input.next('.field-error').remove();
    };

    // Character counter
    $questionInput.on('input', function () {

        const length = $(this).val().length;

        $counter
            .text(`${length} / 1000 characters`)
            .removeClass('text-muted text-danger')
            .addClass(length > 1000 ? 'text-danger' : 'text-muted');
    });

    // Clear field error when visitor edits it
    $form.on('input change', 'input, select, textarea', function () {

        clearError($(this));

        $errorBox.addClass('hidden').text();
    });

    // ======================================
    // SUBMIT QUESTION
    // ======================================

    $form.on('submit', function (event) {

        event.preventDefault();

        $errorBox.addClass('hidden').text('');
        $resultBox.addClass('hidden').empty();

        $form.find('.field-error').remove();

        let firstInvalid = null;

        const name = ($nameInput.val() || '').trim();
        const email = ($emailInput.val() || '').trim();
        const subject = $subjectInput.val();
        const question = ($questionInput.val() || '').trim();

        // NAME VALIDATION
        if (name.length < 2) {

            showError(
                $nameInput,
                'Name must contain at least 2 characters.'
            );

            firstInvalid = $nameInput;
        }

        // EMAIL VALIDATION
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            showError(
                $emailInput,
                'Please enter a valid email address.'
            );

            if (firstInvalid === null) {
                firstInvalid = $emailInput;
            }
        }

        // SUBJECT VALIDATION
        if (!subject) {

            showError(
                $subjectInput,
                'Please select a subject.'
            );

            if (firstInvalid === null) {
                firstInvalid = $subjectInput;
            }
        }

        // QUESTION VALIDATION
        if (question.length < 10 || question.length > 1000) {

            showError(
                $questionInput,
                'Question must contain between 10 and 1000 characters.'
            );

            if (firstInvalid === null) {
                firstInvalid = $questionInput;
            }
        }

        // STOP IF INVALID
        if (firstInvalid !== null) {

            firstInvalid.trigger('focus');
            return;
        }

        // Get readable subject name
        const subjectName = $subjectInput
            .find('option:selected')
            .text();

        // BUILD SUCCESS MESSAGE
        const $resultTitle = $('<h4>')
            .addClass('alert-heading')
            .text('Question Submitted Successfully!');

        const $resultText = $('<p>')
            .text('Thank you for contacting Zebra Coffee. Here are your submitted details:');

        const $details = $('<div>');

        const addDetail = (label, value) => {

            const $paragraph = $('<p>')
                .addClass('mb-1');

            $('<strong>')
                .text(label + ':')
                .appendTo($paragraph);

            $paragraph.append(
                document.createTextNode(' ' + value)
            );

            $details.append($paragraph);
        };

        addDetail('Name', name);
        addDetail('Email', email);
        addDetail('Subject', subjectName);
        addDetail('Question', question);

        $resultBox
            .removeClass('hidden')
            .empty()
            .append(
                $resultTitle,
                $resultText,
                $('<hr>'),
                $details
            )
            .hide()
            .fadeIn(400);

        // Reset form after successful submission
        $form[0].reset();

        $counter
            .text('0 / 1000 characters')
            .removeClass('text-danger')
            .addClass('text-muted');

    });

    // ======================================
    // FAQ HOVER EFFECT
    // ======================================

    $faqItems.filter(':first, :last')
        .on('mouseenter', function () {

            $(this).addClass('border-dark');

        })
        .on('mouseleave', function () {

            $(this).removeClass('border-dark');

        });

});
