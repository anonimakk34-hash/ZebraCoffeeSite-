'use strict';

/*
 * main.js: shared data and helpers. It is loaded (defer) BEFORE every page
 * script, so everything declared here at the top level is visible to
 * menu.js, order.js and booking.js.
 * It also runs the two site-wide features: highlighting the current page in
 * the navbar and writing the current year in the footer.
 */

// Prices come from menu.html. sizes: [{ value: millilitres, price: tenge }]
const DRINKS = [
    { id: 'latte', name: 'Latte', category: 'Coffee', available: true,
    sizes: [{ value: '250', price: 990 }, { value: '360', price: 1040 }, { value: '480', price: 1090 }] },

    { id: 'cappuccino', name: 'Cappuccino', category: 'Coffee', available: true,
    sizes: [{ value: '250', price: 990 }, { value: '360', price: 1040 }, { value: '480', price: 1090 }] },

    { id: 'americano', name: 'Americano', category: 'Coffee', available: true,
    sizes: [{ value: '250', price: 790 }, { value: '360', price: 890 }, { value: '480', price: 990 }] },

    { id: 'raf', name: 'Raf', category: 'Coffee', available: true,
    sizes: [{ value: '250', price: 1190 }, { value: '360', price: 1290 }, { value: '480', price: 1390 }] },

    { id: 'mocaccino', name: 'Mocaccino', category: 'Coffee', available: true,
    sizes: [{ value: '250', price: 1090 }, { value: '360', price: 1190 }, { value: '480', price: 1290 }] },

    { id: 'flat-white', name: 'Flat White', category: 'Coffee', available: true,
    sizes: [{ value: '250', price: 1090 }] },

    { id: 'espresso', name: 'Espresso', category: 'Coffee', available: true,
    sizes: [{ value: '30', price: 600 }, { value: '60', price: 700 }] },

    { id: 'frappe', name: 'Frappe', category: 'Cold drink', available: true,
    sizes: [{ value: '350', price: 1290 }] },

    { id: 'ice-latte', name: 'Ice Latte', category: 'Cold drink', available: true,
    sizes: [{ value: '450', price: 1290 }] },

    { id: 'ice-cappuccino', name: 'Ice Cappuccino', category: 'Cold drink', available: true,
    sizes: [{ value: '450', price: 1290 }] },

    { id: 'bumble', name: 'Bumble Coffee', category: 'Cold drink', available: true,
    sizes: [{ value: '350', price: 1290 }] },

    { id: 'espresso-tonic', name: 'Espresso Tonic', category: 'Cold drink', available: true,
    sizes: [{ value: '350', price: 1290 }] },

    { id: 'nitro-tea', name: 'Nitro Tea', category: 'Tea', available: true,
    sizes: [{ value: '350', price: 1290 }] },

    { id: 'green-matcha', name: 'Green Matcha', category: 'Matcha', available: true,
    sizes: [{ value: '360', price: 1090 }, { value: '450', price: 1290 }] },

    { id: 'sakura-matcha', name: 'Sakura Matcha', category: 'Matcha', available: true,
    sizes: [{ value: '360', price: 1090 }, { value: '450', price: 1290 }] },

    { id: 'blue-matcha', name: 'Blue Matcha', category: 'Matcha', available: true,
    sizes: [{ value: '360', price: 1090 }, { value: '450', price: 1290 }] }
];

// Returns the available drink with this id, or undefined.
function findDrink(drinkId) {
    return DRINKS.find((drink) => drink.id === drinkId && drink.available === true);
}

// Smallest price among all sizes of a drink.
function getLowestPrice(drink) {
    return Math.min(...drink.sizes.map((size) => size.price));
}

// 1290 -> "1290 ₸" (same style as the prices in menu.html)
function formatPrice(amount) {
    return `${amount} ₸`;
}

// Creates an element with optional classes and text.
// Text always goes through textContent, never innerHTML.
function createEl(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

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

highlightCurrentPage();
updateFooterYear();