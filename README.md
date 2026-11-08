# Zebra Coffee Site — Endterm Project

This repository contains the complete front-end code for the **Zebra Coffee** website in Astana, built with HTML5, CSS3, Bootstrap 5.3.3, Plain JavaScript, and jQuery 3.7.1.

## 1. Feature Breakdown: Plain JavaScript vs. jQuery & Team Responsibilities

| Page / File | Technology | Visitor Goal & Feature Description | What Was Added / Extended for Endterm (Since Previous Defenses) | Responsible Student |
|---|---|---|---|---|
| **Shared Data & Nav** (`js/main.js`) | **Plain JavaScript** | Stores the shared `DRINKS` array of objects, price/lookup functions (`findDrink`, `getLowestPrice`, `formatPrice`), active navbar link highlighting, and dynamic footer year. | Cleaned up duplicate initialization calls, normalized URL matching across all pages, and separated pure JS helpers from jQuery helpers. | Nurzhan & Yelzhan Baurzhanov |
| **Home** (`js/home.js`) | **Plain JavaScript** | Renders "Popular drinks — choose and order" cards dynamically from `DRINKS` with lowest-price calculations and deep links (`order.html?drink=...`). | Newly built for Endterm so visitors landing on the home page can jump straight into ordering a recommended drink. | Nurzhan |
| **Order** (`js/order.js`) | **Plain JavaScript** | Multi-item drink cart (`+ Add this drink to order`), live cup/subtotal/grand-total calculation with milk & flavour surcharges, cascading address selects (City → District → Street → Building → Apartment), cross-field validation, and order summary generation. | Extended from single-drink calculator into a full multi-drink shopping cart with item removal (`data-remove-index`), live draft preview, and complete takeaway/pickup validation. | Nurzhan |
| **Shared jQuery Effects** (`js/jquery-common.js`) | **jQuery 3.7.1** | Provides `showBlock` and `hideBlock` fade animations that work cleanly with the `.hidden` CSS class, plus tooltips for disabled buttons. | Newly added for Endterm to standardize fade effects across hidden containers. | Nurzhan |
| **Menu** (`js/jquery-menu.js`) | **jQuery 3.7.1** | "Find your drink" live search, category filter, price/name sorting, expandable size details (`.slideToggle`), and selectable drink cards. | Rewritten in jQuery and extended with delegated `.toggle-sizes` slide animations, interactive card selection (`.selected`), and disabled state management on the Reset button. | Nurzhan |
| **Booking** (`js/jquery-booking.js`) | **jQuery 3.7.1** | Table reservation form with live request summary, past-date/time prevention, fully-booked slot disabling (`20:00`), field-by-field validation, and animated confirmation. | Rewritten in jQuery and extended with automatic text trimming on `focusout`, live same-day time comparison, animated inline errors (`.slideDown`), and 2-second submit button feedback. | Nurzhan |
| **Feedback** (`js/feedback.js`) | **jQuery 3.7.1** | Customer review form with 8-field validation (name, email, confirm email, phone regex, date, rating 1–5, order type radio, comment counter) and dynamic review cards list. | Rewritten in jQuery and extended with a delegated 👍 helpful-vote counter (`.helpful-btn`) on review cards, `.slideToggle()` review list collapsible bar, and `.fadeIn()` summary confirmation. | Yelzhan Baurzhanov |
| **FAQ** (`js/faq.js`) | **jQuery 3.7.1** | Live FAQ keyword search, match counter badge, `Escape` key reset, animated empty state, and collapsible Expected Wait Times table. | Rewritten in jQuery and extended with a "Hide/Show Wait Times" `.slideToggle(300)` button, `.fadeIn()`/`.fadeOut()` empty-search alert, and keyboard `Escape` clearing. | Yelzhan Baurzhanov |
| **Register** (`js/register.js`) | **jQuery 3.7.1** | Account registration with live 5-rule regex password checklist, delegated Show/Hide password buttons, full field validation, and demo account saving. | Rewritten in jQuery and extended to validate all registration inputs into `#register-error` / `#register-result` and save the registered demo user to `localStorage`. | Yelzhan Baurzhanov |
| **Login** (`js/login.js`) | **jQuery 3.7.1** | Login form with password visibility toggle, "Remember me" email persistence, and credential verification against the registered demo account. | Rewritten in jQuery and extended to persist remembered emails in `localStorage` and verify login credentials against the user saved from `register.html`. | Yelzhan Baurzhanov |

---

## 2. Rubric Checklist & Code Locations

### Plain JavaScript (`js/main.js`, `js/home.js`, `js/order.js`)
- **Data in arrays & objects**: `DRINKS` in `js/main.js` (line 72), `locations` & `MILK_SURCHARGES` in `js/order.js` (lines 42, 108).
- **Loops building the page**: `drinks.forEach` in `js/home.js` (line 38), `cart.forEach` and `Object.keys(locations).forEach` in `js/order.js` (lines 198, 370).
- **Functions with parameters & return values (called from multiple places)**: `findDrink(drinkId)`, `getLowestPrice(drink)`, `formatPrice(amount)` in `js/main.js` (lines 123–135); `calculateUnitPrice()`, `calculateTotal()`, `getCartTotal()` in `js/order.js` (lines 274, 302, 360).
- **Conditions & Calculated Values**: Unit price with flavour (`+150 ₸`) and plant milk (`+200 ₸`) surcharges, multi-item cart grand total (`getCartTotal`), and address consistency check (`isAddressConsistent`) in `js/order.js`.
- **Delegated Event Handler (Plain JS)**: `totalText.addEventListener('click', ...)` catching dynamically created `button[data-remove-index]` cart removal buttons in `js/order.js` (line 428).

### jQuery (`js/feedback.js`, `js/faq.js`, `js/register.js`, `js/login.js`, `js/jquery-menu.js`, `js/jquery-booking.js`)
- **Selectors**: ID (`#feedback-form`, `#faq-list`, `#bookingForm`), Class (`.faq-item`, `.drink-card`), Element (`textarea`), Attribute (`input[name="fb-email"]`, `input[type="tel"]`), Filters (`:first`, `:last`, `:checked`, `:not()`, `:disabled`).
- **Traversal**: `.find()`, `.closest()`, `.parent()`, `.siblings()`, `.prevAll()`, `.each()`.
- **Method Chaining (3+ methods)**: `js/feedback.js` (lines 120–124, 211–214), `js/faq.js` (lines 79–82), `js/jquery-menu.js` (lines 222–224).
- **Delegated Event Handlers (jQuery)**:
  - `js/feedback.js` (line 206): `$reviewsContainer.on('click', '.helpful-btn', ...)`
  - `js/jquery-menu.js` (line 207): `finder.$results.on('click', '.toggle-sizes', ...)`
  - `js/jquery-booking.js` (line 367): `$form.on('input change', 'input, select, textarea', ...)`
- **Effects with Duration & Callbacks**:
  - `.slideToggle(300, callback)` in `js/feedback.js` (line 148) and `js/faq.js` (line 115)
  - `.slideToggle(250, callback)` in `js/jquery-menu.js` (line 211)
  - `.fadeIn()` / `.fadeOut()` with callbacks in `js/faq.js` (lines 87–91), `js/feedback.js` (line 404), and `js/jquery-common.js` (lines 19–39).

---

## 3. AI Log
- **Q:** How do I correctly build a live password checklist using regex?
- **AI Response:** Provided regex patterns (`/[A-Z]/`, `/.{8,}/`) and an `input` event listener method to test the string dynamically and swap Bootstrap `text-danger`/`text-success` classes.
- **Q:** What is the best way to avoid `innerHTML` for a summary block?
- **AI Response:** Explained how to use `document.createElement`, `className`, and `textContent` or `document.createTextNode` sequentially to safely construct the DOM tree and append strings.
- **Q:** How do I swap CSS classes instead of using `style.display`?
- **AI Response:** Advised using `element.classList.add('d-none')` and `element.classList.remove('d-none')` for Bootstrap-friendly visibility toggling.
- **Q:** In jQuery, what is the difference between `.text()` and `.html()`, and between `.attr()` and `.prop()` on a checkbox?
- **AI Response:** Explained that `.text()` escapes HTML entities and treats input as pure string text (preventing XSS), whereas `.html()` parses and renders HTML tags. For checkboxes, `.attr('checked')` reads the initial HTML attribute from the markup, whereas `.prop('checked')` reads or sets the live boolean state (`true`/`false`) of the DOM element as the user clicks it.
- **Q:** Why does event delegation (`$('#parent').on('click', '.child', fn)`) work for dynamically created elements while `$('.child').on('click', fn)` does not?
- **AI Response:** Explained that direct binding only attaches listeners to DOM nodes that exist at the moment the script runs. Delegated binding attaches one listener to a stable ancestor element and relies on event bubbling, checking `event.target` against the `.child` selector when a click bubbles up.
