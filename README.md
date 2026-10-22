# Zebra Coffee Site

This repository contains the front-end code for the Zebra Coffee website.

## Functionality Plan
| Page | Visitor Goal | Planned Function | Expected Result | Responsible Student |
|---|---|---|---|---|
| FAQ | Search for answers easily | Live search filter on accordion items | Filtered list showing matched items with count | Student A |
| Feedback | Leave a review and see recent ones | Form validation with 4 fields, comparison, character count, live array rendering | Correct review submission, success summary, updated review list | Student B |
| Login | Access account | Secure front-end validation of email and password | Explicit demonstration message on success | Student A |
| Register | Create account | Live password checklist, confirmation match, toggle visibility | Explicit demonstration message on success without storing data | Student B |
| Menu | Browse coffee selection | Render menu items from array | Dynamic list of available items | Student A |
| Order | Build an order | Cart logic, subtotal, quantity updates | Working cart UI inside modal | Student B |

## JavaScript Checklist
- `js/main.js`: 
  - Array of objects (`DRINKS`) - line 12
  - Functions with parameters/returns (`createEl`, `findDrink`, `formatPrice`) - lines 40, 44, 48, 52
  - DOM manipulation (`showMessage`, `hideMessage`) - lines 89, 98
- `js/faq.js`:
  - Loops/traversal (`forEach`) - line 46, 64
  - Search/filter functionality - line 43
  - Event Listeners (`input`, `click`) - line 60, 61, 67
- `js/feedback.js`:
  - DOM Creation (`document.createElement`) - line 21, 33, 62, 85, 114
  - Array Rendering (`displayReviews`) - line 56
  - Form Validation (4 fields + comparison) - line 140
  - No `innerHTML` for user data - line 215
- `js/login.js`:
  - DOM Modification (`setAttribute`, `textContent`) - line 17
  - Event listeners (`submit`, `click`) - line 15, 25
- `js/register.js`:
  - Regex validation (`requirements`) - line 61
  - Logic operators (`every`, `!==`) - line 84, 94

## AI Log
- **Q:** How do I correctly build a live password checklist using regex?
- **AI Response:** Provided regex patterns (`/[A-Z]/`, `/.{8,}/`) and an `input` event listener method to test the string dynamically and swap Bootstrap text-danger/text-success classes.
- **Q:** What is the best way to avoid innerHTML for a summary block?
- **AI Response:** Explained how to use `document.createElement`, `className`, and `textContent` or `document.createTextNode` sequentially to safely construct the DOM tree and append strings.
- **Q:** How do I swap CSS classes instead of using style.display?
- **AI Response:** Advised using `element.classList.add('d-none')` and `element.classList.remove('d-none')` for Bootstrap-friendly visibility toggling.
