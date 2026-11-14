'use strict';

/*
 * menu.js: "Find your drink" block on menu.html, written with jQuery.
 * The old plain-JavaScript version is saved in js/old-js-version.js.
 * Needs jQuery and main.js (DRINKS, getLowestPrice, formatPrice, findDrink,
 * showBlock, hideBlock) to be loaded first.
 *
 * Flow: input / change -> updateResults() -> cards are built from the DRINKS
 *       array and added with appendTo(). The cards are created by the script,
 *       so their events use delegation: one .on() on the container.
 */

$(function () {
    const $section = $('main section').first();

    // Stop on pages that are not the menu.
    if ($section.length === 0 || $('#coffee-card').length === 0) {
        return;
    }

    // Keep the existing HTML unchanged: the interactive finder replaces the
    // long static menu display (tables, quick jumps and repeated explanations).
    $section.children().not('h2, p.lead').hide();

    // Card photos and overlay styles are applied by JavaScript only.
    const $photoStyles = $('<style>', { text: `
        .drink-card { position:relative; overflow:hidden; isolation:isolate;
            background-color:#30251e; background-position:center; background-size:cover;
            color:#fff; border-color:rgba(255,255,255,.2); }
        .drink-card::before { content:''; position:absolute; inset:0; z-index:-1;
            background:linear-gradient(90deg,rgba(17,13,11,.85),rgba(17,13,11,.60)); }
        .drink-card .card-title,.drink-card .fw-semibold,.drink-card .drink-sizes { color:#fff!important;text-shadow:0 2px 6px #000c; }
        .drink-card .toggle-sizes { color:#f7e5cd!important; }
        .drink-card .btn-outline-dark { color:#fff; border-color:#fff; }
        .drink-card .btn-outline-dark:hover,.drink-card .btn-outline-dark:focus {
            background:#fff; color:#1c1713; }
        .drink-card .badge { background:rgba(0,0,0,.75)!important; }
        .drink-card.selected { outline:2px solid #c7a47c; }
    ` });
    $photoStyles.text($photoStyles.text() + `
      .zc-menu-hero {position:relative;isolation:isolate;border-radius:20px;overflow:hidden;
        padding:35px 32px;margin-bottom:24px;color:#fff;background:#30251e}
      .zc-menu-hero:before {content:'';position:absolute;inset:0;z-index:-2;
        background:url('images/zc-new-latte.jpg') center 53%/cover}
      .zc-menu-hero:after {content:'';position:absolute;inset:0;z-index:-1;
        background:linear-gradient(95deg,rgba(29,22,17,.9),rgba(29,22,17,.45))}
      .zc-menu-hero h2,.zc-menu-hero p {color:#fff!important}
      .zc-menu-hero p {margin-bottom:0!important;max-width:620px}
      .zc-menu-finder {border:1px solid #e5d8c9;border-radius:20px;overflow:hidden;
        box-shadow:0 15px 35px #38281914!important;background:#fffdf9}
      .zc-menu-finder>.card-body {padding:clamp(18px,3vw,30px)}
      .zc-menu-finder input,.zc-menu-finder select {border-radius:10px;min-height:44px}
      .zc-menu-finder input:focus,.zc-menu-finder select:focus {border-color:#a57e58;box-shadow:0 0 0 .2rem #a57e5833}
      .drink-card {min-height:285px;transition:transform .22s,box-shadow .22s;
        border-radius:14px; background-position:center!important;box-shadow:inset 0 0 0 1px #ffffff22}
      .drink-card:hover {transform:translateY(-4px);box-shadow:0 13px 28px #241a1740!important}
      .drink-card::before {background:linear-gradient(90deg,rgba(18,13,10,.58),rgba(18,13,10,.06))}
      .drink-card .btn-outline-dark {background:#251b15d9;backdrop-filter:blur(3px);font-weight:700}
      .drink-card .toggle-sizes {font-weight:750;text-shadow:0 2px 5px #000}
      .drink-card .card-body {display:flex;flex-direction:column;justify-content:space-between}
      .drink-card:hover {background-size:cover}
      .zc-menu-finder .form-label {font-weight:700;color:#493729}
      .zc-menu-finder .btn {border-radius:10px}
      @media(prefers-reduced-motion:reduce){.drink-card{transition:none}}
    `);
    $('head').append($photoStyles);
    // Each drink has its own local photo; all assets work offline.
    const PHOTO_BY_DRINK = new Set([
        'latte','cappuccino','americano','raf','mocaccino','flat-white','espresso',
        'frappe','ice-latte','ice-cappuccino','bumble','espresso-tonic',
        'nitro-tea','green-matcha','sakura-matcha','blue-matcha'
    ]);

    const SORT_OPTIONS = [
        { value: 'default', label: 'Menu order' },
        { value: 'price-asc', label: 'Price: low to high' },
        { value: 'price-desc', label: 'Price: high to low' },
        { value: 'name', label: 'Name: A to Z' }
    ];

    const finder = {}; // jQuery objects of the elements created below

    // ---------- data (plain JavaScript, no DOM) ----------

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

    // ---------- building the page with jQuery ----------

    // One drink card. The details (sizes) start hidden and slide open on click.
    function createDrinkCard(drink) {
        const $column = $('<div>', { 'class': 'col' });
        const $card = $('<div>', { 'class': 'card h-100 shadow-sm drink-card' })
            .css('background-image', `url("${PHOTO_BY_DRINK.has(drink.id) ? `images/drinks/${drink.id}.jpg` : 'images/coffee.jpg'}")`)
            .attr('data-id', drink.id)
            .appendTo($column);
        const $body = $('<div>', { 'class': 'card-body d-flex flex-column' }).appendTo($card);

        $body.append(
            $('<span>', { 'class': 'badge bg-dark align-self-start mb-2', text: drink.category }),
            $('<h4>', { 'class': 'h5 card-title', text: drink.name }),
            $('<p>', { 'class': 'mb-1 fw-semibold', text: `from ${formatPrice(getLowestPrice(drink))}` }),
            $('<button>', { type: 'button', 'class': 'btn btn-link btn-sm p-0 mb-2 align-self-start toggle-sizes', text: 'Show sizes' }),
            $('<p>', { 'class': 'text-muted small drink-sizes', text: describeSizes(drink) }).hide()
        );

        $('<a>', { 'class': 'btn btn-outline-dark btn-sm mt-auto', text: 'Order this' })
            .attr('href', `order.html?drink=${encodeURIComponent(drink.id)}`)
            .appendTo($body);

        return $column;
    }

    // Clears the container and adds a card for every drink in the array.
    function renderDrinkCards(drinks) {
        finder.$results.empty();

        $.each(drinks, function (index, drink) {
            createDrinkCard(drink).appendTo(finder.$results);
        });
    }

    // A label + a form control inside a Bootstrap column.
    function createControlColumn(columnClass, labelText, controlId, $control) {
        const $label = $('<label>', { 'class': 'form-label', 'for': controlId, text: labelText });

        $control.attr('id', controlId);
        return $('<div>', { 'class': columnClass }).append($label, $control);
    }

    function createOption(value, text) {
        return $('<option>', { value: value, text: text });
    }

    function buildFinder() {
        const $card = $('<div>', { 'class': 'card shadow-sm mb-4 zc-menu-finder' });
        const $body = $('<div>', { 'class': 'card-body' }).appendTo($card);
        const $controls = $('<div>', { 'class': 'row g-3 align-items-end mb-3' });

        $('<h3>', { 'class': 'h5 mb-3', text: 'Find your drink' }).appendTo($body);

        finder.$search = $('<input>', { type: 'search', 'class': 'form-control', placeholder: 'e.g. latte' });

        finder.$category = $('<select>', { 'class': 'form-select' }).append(createOption('all', 'All drinks'));
        $.each(getCategories(), function (index, category) {
            finder.$category.append(createOption(category, category));
        });

        finder.$sort = $('<select>', { 'class': 'form-select' });
        $.each(SORT_OPTIONS, function (index, option) {
            finder.$sort.append(createOption(option.value, option.label));
        });

        finder.$reset = $('<button>', { type: 'button', id: 'menu-reset', 'class': 'btn btn-outline-dark w-100', text: 'Reset' });

        $controls.append(
            createControlColumn('col-12 col-md-4', 'Search by name', 'menu-search', finder.$search),
            createControlColumn('col-6 col-md-3', 'Category', 'menu-category', finder.$category),
            createControlColumn('col-6 col-md-3', 'Sort by', 'menu-sort', finder.$sort),
            $('<div>', { 'class': 'col-12 col-md-2' }).append(finder.$reset)
        );

        finder.$count = $('<p>', { id: 'menu-count', 'class': 'text-muted small mb-3', 'aria-live': 'polite' });

        // Empty state: hidden with the ready-made "hidden" class, faded in by showBlock().
        finder.$empty = $('<div>', {
            id: 'menu-empty',
            'class': 'alert alert-secondary hidden',
            text: 'Nothing found. Try a different word or press Reset.'
        });

        finder.$results = $('<div>', { id: 'menu-results', 'class': 'row row-cols-1 row-cols-md-3 g-3' });

        $body.append($controls, finder.$count, finder.$empty, finder.$results);
        return $card;
    }

    // ---------- updating the page ----------

    function filtersAreDefault() {
        return finder.$search.val().trim() === '' &&
            finder.$category.val() === 'all' &&
            finder.$sort.val() === 'default';
    }

    // Re-reads all three controls and redraws everything that depends on them.
    function updateResults() {
        const filtered = filterDrinks(DRINKS, finder.$search.val(), finder.$category.val());
        const sorted = sortDrinks(filtered, finder.$sort.val());

        renderDrinkCards(sorted);
        finder.$count.empty().append('Showing ', $('<strong>').text(sorted.length), ` of ${DRINKS.length} drinks`);
        finder.$reset.prop('disabled', filtersAreDefault());

        if (sorted.length === 0) {
            showBlock(finder.$empty, 200);
        } else {
            hideBlock(finder.$empty, 200);
        }
    }

    function resetFilters() {
        finder.$search.val('');
        finder.$category.val('all');
        finder.$sort.val('default');
        updateResults();
        finder.$search.trigger('focus');
    }

    // ---------- start ----------

    const $finderCard = buildFinder();
    const $lead = $section.find('p.lead').first();
    $section.children('h2, p.lead').wrapAll('<div class="zc-menu-hero"></div>');
    $section.find('.zc-menu-hero h2').text('Find your perfect drink');
    $section.find('.zc-menu-hero p').text('From classic espresso to colourful matcha — explore all 16 drinks and find your favourite.');

    if ($lead.length > 0) {
        $section.find('.zc-menu-hero').after($finderCard);
    } else {
        $section.prepend($finderCard);
    }

    // Event types used here: input, change, click, keydown, mouseenter, mouseleave.
    finder.$search
        .on('input', updateResults)
        .on('keydown', function (event) {
            if (event.key === 'Escape') {
                resetFilters();
            }
        });
    finder.$category.on('change', updateResults);
    finder.$sort.on('change', updateResults);
    finder.$reset.on('click', resetFilters);

    // EVENT DELEGATION: the cards are created and thrown away by the script,
    // so the handlers are attached once to the container that always exists.
    finder.$results
        .on('click', '.toggle-sizes', function () {
            const $button = $(this);

            // slideToggle with a duration (250 ms) and a callback.
            $button.siblings('.drink-sizes').slideToggle(250, function () {
                $button.text($(this).css('display') === 'none' ? 'Show sizes' : 'Hide sizes');
            });
        })
        .on('click', '.drink-card', function (event) {
            // Clicks on the button or the "Order this" link have their own job.
            if ($(event.target).closest('a, button').length > 0) {
                return;
            }

            const $card = $(this);

            // Only one card can be selected: clear the cards in the other columns.
            $card.closest('.col').siblings().find('.drink-card.selected').each(function () {
                $(this).removeClass('selected').find('.card-title').text(findDrink($(this).attr('data-id')).name);
            });

            $card.toggleClass('selected');

            const name = findDrink($card.attr('data-id')).name;
            $card.find('.card-title').text($card.hasClass('selected') ? `${name} ✓` : name);
        })
        .on('mouseenter', '.drink-card', function () {
            $(this).addClass('shadow-lg');
        })
        .on('mouseleave', '.drink-card', function () {
            $(this).removeClass('shadow-lg');
        });

    updateResults();
});
