'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const accordionContainer = document.querySelector('.accordion') || document.querySelector('#faqAccordion');
    if (!accordionContainer) return;

    const faqItems = accordionContainer.querySelectorAll('.accordion-item, .faq-item');
    if (faqItems.length === 0) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'faq-toolbar mb-4 p-3 bg-light border rounded d-flex flex-wrap gap-3 align-items-center';

    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'flex-grow-1';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'form-control';
    searchInput.placeholder = 'Search FAQ...';
    searchWrapper.appendChild(searchInput);

    const countDisplay = document.createElement('span');
    countDisplay.className = 'fw-bold text-muted';
    countDisplay.textContent = `Showing ${faqItems.length} of ${faqItems.length} FAQs`;

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn btn-outline-secondary';
    resetBtn.textContent = 'Reset';

    toolbar.appendChild(searchWrapper);
    toolbar.appendChild(countDisplay);
    toolbar.appendChild(resetBtn);

    accordionContainer.parentNode.insertBefore(toolbar, accordionContainer);

    const noResults = document.createElement('div');
    noResults.className = 'alert alert-warning d-none';
    noResults.textContent = 'No FAQs match your search criteria.';
    accordionContainer.parentNode.insertBefore(noResults, accordionContainer);

    const filterFAQs = () => {
        const term = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        faqItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(term)) {
                item.classList.remove('d-none');
                visibleCount++;
            } else {
                item.classList.add('d-none');
            }
        });

        countDisplay.textContent = `Showing ${visibleCount} of ${faqItems.length} FAQs`;

        if (visibleCount === 0) {
            noResults.classList.replace('d-none', 'd-block');
            accordionContainer.classList.add('d-none');
        } else {
            noResults.classList.replace('d-block', 'd-none');
            accordionContainer.classList.remove('d-none');
        }
    };

    searchInput.addEventListener('input', filterFAQs);
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterFAQs();
    });

    const accordionButtons = document.querySelectorAll('.accordion-button, .faq-question');
    accordionButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            const targetId = btn.getAttribute('data-bs-target') || btn.getAttribute('aria-controls');
            const targetContent = targetId ? document.querySelector(targetId) : btn.nextElementSibling;
            if (!targetContent) return;
            if (!btn.classList.contains('accordion-button')) {
                e.preventDefault();
                targetContent.classList.toggle('show');
                btn.setAttribute('aria-expanded', String(!isExpanded));
            }
        });
    });
});
