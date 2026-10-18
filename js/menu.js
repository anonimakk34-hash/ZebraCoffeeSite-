'use strict';

/*
 * menu.js: "Find your drink" tool for menu.html.
 * The HTML is frozen, so every element of the tool is created here with the
 * DOM and inserted under the lead paragraph.
 * Flow: search / category / sort changes -> updateResults()
 *       -> filterDrinks() -> sortDrinks() -> renderDrinkCards()
 *       -> counter text + empty state.
 */

(() => {
    const section = document.querySelector('main section');

    // Stop on pages that are not the menu.
    if (section === null || document.querySelector('#coffee-card') === null) {
        return;
    }

    const SORT_OPTIONS = [
        { value: 'default', label: 'Menu order' },
        { value: 'price-asc', label: 'Price: low to high' },
        { value: 'price-desc', label: 'Price: high to low' },
        { value: 'name', label: 'Name: A to Z' }
    ];

    const finder = {}; // references to the elements created below

    // Unique categories, taken from the data so the list never gets out of date.
    function getCategories() {
        return [...new Set(DRINKS.map((drink) => drink.category))];
    }

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

    // "250 ml: 990 ₸ · 360 ml: 1040 ₸ · ..."
    function describeSizes(drink) {
        return drink.sizes
            .map((size) => `${size.value} ml: ${formatPrice(size.price)}`)
            .join(' · ');
    }

    // The single function that draws one card.
    function createDrinkCard(drink) {
        const column = createEl('div', 'col');
        const card = createEl('div', 'card h-100 shadow-sm');
        const body = createEl('div', 'card-body d-flex flex-column');

        body.appendChild(createEl('span', 'badge bg-dark align-self-start mb-2', drink.category));
        body.appendChild(createEl('h4', 'h5 card-title', drink.name));
        body.appendChild(createEl('p', 'mb-1 fw-semibold', `from ${formatPrice(getLowestPrice(drink))}`));
        body.appendChild(createEl('p', 'text-muted small', describeSizes(drink)));

        const link = createEl('a', 'btn btn-outline-dark btn-sm mt-auto', 'Order this');
        link.href = `order.html?drink=${encodeURIComponent(drink.id)}`;
        body.appendChild(link);

        card.appendChild(body);
        column.appendChild(card);
        return column;
    }

    // Clears the container and draws a card for every drink in the list.
    function renderDrinkCards(drinks, container) {
        container.textContent = '';

        for (const drink of drinks) {
            container.appendChild(createDrinkCard(drink));
        }
    }

    // A label + a form control inside a Bootstrap column.
    function createControlColumn(columnClass, labelText, controlId, control) {
        const column = createEl('div', columnClass);
        const label = createEl('label', 'form-label', labelText);

        label.htmlFor = controlId;
        control.id = controlId;
        column.append(label, control);
        return column;
    }

    function createOption(value, text) {
        const option = createEl('option', '', text);
        option.value = value;
        return option;
    }

    function buildFinder() {
        const card = createEl('div', 'card shadow-sm mb-4');
        const body = createEl('div', 'card-body');
        body.appendChild(createEl('h3', 'h5 mb-3', 'Find your drink'));

        const controls = createEl('div', 'row g-3 align-items-end mb-3');

        finder.search = createEl('input', 'form-control');
        finder.search.type = 'search';
        finder.search.placeholder = 'e.g. latte';

        finder.category = createEl('select', 'form-select');
        finder.category.appendChild(createOption('all', 'All drinks'));
        getCategories().forEach((category) => {
            finder.category.appendChild(createOption(category, category));
        });

        finder.sort = createEl('select', 'form-select');
        SORT_OPTIONS.forEach((option) => {
            finder.sort.appendChild(createOption(option.value, option.label));
        });

        finder.reset = createEl('button', 'btn btn-outline-dark w-100', 'Reset');
        finder.reset.type = 'button';
        finder.reset.id = 'menu-reset';

        const resetColumn = createEl('div', 'col-12 col-md-2');
        resetColumn.appendChild(finder.reset);

        controls.append(
            createControlColumn('col-12 col-md-4', 'Search by name', 'menu-search', finder.search),
            createControlColumn('col-6 col-md-3', 'Category', 'menu-category', finder.category),
            createControlColumn('col-6 col-md-3', 'Sort by', 'menu-sort', finder.sort),
            resetColumn
        );

        finder.count = createEl('p', 'text-muted small mb-3');
        finder.count.id = 'menu-count';
        finder.count.setAttribute('aria-live', 'polite');

        // Empty state, shown and hidden with the ready-made "hidden" class.
        finder.empty = createEl('div', 'alert alert-secondary hidden', 'Nothing found. Try a different word or press Reset.');
        finder.empty.id = 'menu-empty';

        finder.results = createEl('div', 'row row-cols-1 row-cols-md-3 g-3');
        finder.results.id = 'menu-results';

        body.append(controls, finder.count, finder.empty, finder.results);
        card.appendChild(body);
        return card;
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

    const finderCard = buildFinder();
    const lead = section.querySelector('p.lead');

    if (lead !== null) {
        lead.after(finderCard);
    } else {
        section.prepend(finderCard);
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

    updateResults();
})();