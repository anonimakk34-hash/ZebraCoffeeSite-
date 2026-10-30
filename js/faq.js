'use strict';

/*
 * Using jQuery 3.7.1.
 * $(function () { ... }) is the short form of $(document).ready(). It is needed so
 * the code runs only after the DOM is fully loaded and ready to be manipulated.
 */
$(function () {
    const $accordionContainer = $('#faq-list');
    if ($accordionContainer.length === 0) return;

    const $faqItems = $accordionContainer.find('.faq-item');
    if ($faqItems.length === 0) return;

    // Build the search & filter toolbar in code using jQuery
    const $toolbar = $('<div>')
        .addClass('faq-toolbar mb-4 p-3 bg-light border rounded d-flex flex-wrap gap-3 align-items-center');

    const $searchWrapper = $('<div>').addClass('flex-grow-1');
    const $searchInput = $('<input>')
        .attr({
            type: 'text',
            id: 'faq-search-input',
            placeholder: 'Search FAQ (press Esc to reset)...'
        })
        .addClass('form-control');
    $searchWrapper.append($searchInput);

    const $countDisplay = $('<span>')
        .attr('id', 'faq-count')
        .addClass('fw-bold text-muted')
        .text(`Showing ${$faqItems.length} of ${$faqItems.length} FAQs`);

    const $resetBtn = $('<button>')
        .attr({ type: 'button', id: 'faq-reset-btn' })
        .addClass('btn btn-outline-secondary')
        .text('Reset');

    const $toggleTableBtn = $('<button>')
        .attr({ type: 'button', id: 'faq-toggle-table-btn' })
        .addClass('btn btn-dark')
        .text('Hide Wait Times');

    $toolbar.append($searchWrapper, $countDisplay, $resetBtn, $toggleTableBtn);

    // Traversal: use .parent() to insert the toolbar and no-results box before #faq-list
    $accordionContainer.parent().prepend($toolbar);

    const $noResults = $('<div>')
        .attr('id', 'faq-no-results')
        .addClass('alert alert-warning')
        .text('No FAQs match your search criteria.')
        .hide();
    $toolbar.after($noResults);

    /*
     * Rewritten Feature 2: Live FAQ Search Filter & Show/Hide Block.
     * Replaced plain-JS querySelectorAll, forEach(), textContent.toLowerCase(), and classList.add/remove('d-none')
     * with jQuery .each(), $(this).text(), .addClass()/.removeClass(), .fadeIn(), and .fadeOut().
     * The jQuery version is shorter and clearer, and lets us smoothly animate the "No FAQs match" alert with .fadeIn(250).
     */
    const filterFAQs = () => {
        const term = ($searchInput.val() || '').toLowerCase().trim();
        let visibleCount = 0;

        $faqItems.each(function () {
            const $item = $(this);
            const text = $item.text().toLowerCase();

            if (text.includes(term)) {
                $item.removeClass('d-none');
                visibleCount++;
            } else {
                $item.addClass('d-none');
            }
        });

        // Chain of 3 methods updating the counter badge
        $countDisplay
            .text(`Showing ${visibleCount} of ${$faqItems.length} FAQs`)
            .toggleClass('text-danger', visibleCount === 0)
            .toggleClass('text-muted', visibleCount > 0);

        // Effects: .fadeIn() and .fadeOut() with duration and callback
        if (visibleCount === 0) {
            $accordionContainer.addClass('d-none');
            $noResults.fadeIn(250);
        } else {
            $noResults.fadeOut(200, function () {
                $accordionContainer.removeClass('d-none');
            });
        }
    };

    // Event types attached with .on(): input, keyup, click
    $searchInput.on('input', filterFAQs);

    $searchInput.on('keyup', function (event) {
        if (event.key === 'Escape') {
            $(this).val('');
            filterFAQs();
        }
    });

    $resetBtn.on('click', function () {
        $searchInput.val('').trigger('focus');
        filterFAQs();
    });

    // Effect: .slideToggle() on the Expected Wait Times table card with a completion callback
    $toggleTableBtn.on('click', function () {
        const $btn = $(this);
        const $waitTableArticle = $('#faq-wait-table').closest('article');

        $waitTableArticle.slideToggle(300, function () {
            const isHidden = $(this).is(':hidden');
            $btn.text(isHidden ? 'Show Wait Times' : 'Hide Wait Times');
        });
    });

    // Highlight first and last FAQ items subtly using :first and :last filters on hover
    $faqItems.filter(':first, :last').on('mouseenter', function () {
        $(this).addClass('border-dark');
    }).on('mouseleave', function () {
        $(this).removeClass('border-dark');
    });
});