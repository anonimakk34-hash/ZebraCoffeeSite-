# Zebra Coffee Site

This repository contains the front-end code for the Zebra Coffee website.

## Functionality Plan
| Page | Visitor Goal | Planned Function | Expected Result | Responsible Student |
|---|---|---|---|---|
| FAQ | Search for answers easily | Live search filter on accordion items | Filtered list showing matched items with count | Yelzhan Baurzhanov |
| Feedback | Leave a review and see recent ones | Form validation with 4 fields, comparison, character count, live array rendering | Correct review submission, success summary, updated review list | Yelzhan Baurzhanov |
| Login | Access account | Secure front-end validation of email and password | Explicit demonstration message on success | Yelzhan Baurzhanov |
| Register | Create account | Live password checklist, confirmation match, toggle visibility | Explicit demonstration message on success without storing data | Yelzhan Baurzhanov |
| Menu | Browse coffee selection | Render menu items from array | Dynamic list of available items | Nurzhan |
| Order | Build an order | Cart logic, subtotal, quantity updates | Working cart UI inside modal | Nurzhan |

## JavaScript Checklist
- `js/main.js`: 
  - Array of objects (`DRINKS`) - line 79
  - Functions with parameters/returns (`findDrink`, `formatPrice`, `createEl`) - lines 130, 140, 146
  - DOM manipulation (`showMessage`, `hideMessage`) - lines 26, 38
- `js/faq.js`:
  - Loops/traversal (`forEach`) - lines 46, 74
  - Search/filter functionality - line 67
  - Event Listeners (`input`, `click`) - lines 67, 68, 75
- `js/feedback.js`:
  - DOM Creation (`document.createElement`) - lines 58, 74, 186
  - Array Rendering (`displayReviews`) - line 43
  - Form Validation (4 fields + comparison) - lines 154-163
  - No `innerHTML` for user data (`replaceChildren()`) - lines 44, 181
- `js/login.js`:
  - DOM Modification (`setAttribute`, `textContent`) - lines 14, 12, 18, 19
  - Event listeners (`submit`, `click`) - lines 25, 16
- `js/register.js`:
  - Regex validation (`requirements`) - lines 63-69
  - Logic operators (`every`, `!==`) - lines 94, 101

## AI Log
- **Q:** How do I correctly build a live password checklist using regex?
- **AI Response:** Provided regex patterns (`/[A-Z]/`, `/.{8,}/`) and an `input` event listener method to test the string dynamically and swap Bootstrap text-danger/text-success classes.
- **Q:** What is the best way to avoid innerHTML for a summary block?
- **AI Response:** Explained how to use `document.createElement`, `className`, and `textContent` or `document.createTextNode` sequentially to safely construct the DOM tree and append strings.
- **Q:** How do I swap CSS classes instead of using style.display?
- **AI Response:** Advised using `element.classList.add('d-none')` and `element.classList.remove('d-none')` for Bootstrap-friendly visibility toggling.
