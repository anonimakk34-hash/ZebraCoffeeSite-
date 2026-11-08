'use strict';

/* Endterm: home recommendations are built from the shared DRINKS data.
 * No HTML markup or CSS rules are added to the frozen pages. */
(() => {
    const section = document.querySelector('main section');
    if (!section || typeof DRINKS === 'undefined') return;

    const recommendations = DRINKS.filter(drink => drink.available && drink.sizes.length > 0).slice(0, 3);
    const wrapper = document.createElement('div');
    wrapper.className = 'card shadow-sm mt-4';
    const body = document.createElement('div');
    body.className = 'card-body';
    const heading = document.createElement('h3');
    heading.className = 'h5 mb-3';
    heading.textContent = 'Popular drinks — choose and order';
    const grid = document.createElement('div');
    grid.className = 'row g-3';

    function makeRecommendation(drink) {
        const column = document.createElement('div');
        column.className = 'col-12 col-md-4';
        const link = document.createElement('a');
        link.className = 'btn btn-outline-dark w-100 h-100';
        link.href = `order.html?drink=${encodeURIComponent(drink.id)}`;
        link.textContent = `${drink.name} — from ${formatPrice(getLowestPrice(drink))}`;
        column.append(link);
        return column;
    }

    function renderRecommendations(drinks) {
        grid.replaceChildren();
        if (!drinks.length) {
            const empty = document.createElement('p');
            empty.textContent = 'No drinks are available right now.';
            grid.append(empty);
            return;
        }
        drinks.forEach(drink => grid.append(makeRecommendation(drink)));
    }

    body.append(heading, grid);
    wrapper.append(body);
    section.append(wrapper);
    renderRecommendations(recommendations);
})();
