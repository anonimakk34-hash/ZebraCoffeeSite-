'use strict';

/*
 * main.js: shared data and helpers. It is loaded (defer) BEFORE every page
 * script, so everything declared here at the top level is visible to
 * the page scripts. jQuery helpers live in jquery-common.js.
 * This file contains data, pure JavaScript helpers and site-wide navigation.
 */

 // Universal Form Feedback Helpers
 
const getMessageTarget = (target) => {
  if (target instanceof HTMLElement) return target;
  if (typeof target === 'string') return document.querySelector(target);
  return (
    document.querySelector('#form-message') ||
    document.querySelector('#message') ||
    document.querySelector('.alert-message') ||
    document.querySelector('form .alert')
  );
};

const showMessage = (text, type = 'danger', target = null) => {
  const container = getMessageTarget(target);
  if (!container) return;

  const alertClass = type === 'error' ? 'danger' : type;

  container.textContent = text;
  container.className = `alert alert-${alertClass} mt-3 d-block`;
  container.setAttribute('aria-hidden', 'false');
};

const hideMessage = (target = null) => {
  const container = getMessageTarget(target);
  if (!container) return;

  container.textContent = '';
  container.className = 'alert d-none';
  container.setAttribute('aria-hidden', 'true');
};

window.showMessage = showMessage;
window.hideMessage = hideMessage;

/**
 * Site-Wide Features (Navbar Active Link & Footer Year)
 */
const initSiteWideFeatures = () => {
  // Footer copyright dynamic year
  const yearEl = document.querySelector('#current-year') || document.querySelector('.footer-year') || document.querySelector('footer p:first-child');
  if (yearEl) {
    if (yearEl.id === 'current-year' || yearEl.classList.contains('footer-year')) {
      yearEl.textContent = new Date().getFullYear();
    } else {
      yearEl.textContent = `© ${new Date().getFullYear()} Zebra Coffee`;
    }
  }

  // Active navigation highlight
  const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const navLinks = document.querySelectorAll('.nav-link, .navbar-nav a');
  
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.split(/[?#]/)[0].toLowerCase() === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
};

document.addEventListener('DOMContentLoaded', initSiteWideFeatures);

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

