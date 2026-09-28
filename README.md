# 🦓 Zebra Coffee

A responsive multi-page coffee shop website built for the **Web Technologies** course. The project started as a pure HTML/CSS site and was rebuilt with **Bootstrap 5.3.3** while keeping the original Zebra Coffee theme and page structure.

## ☕ Project Overview

**Zebra Coffee** is a cozy coffee shop website concept for a cafe in Astana, Kazakhstan.

The website includes:

* Home page with information about the coffee shop
* Menu with coffee, cold drinks, matcha, and pricing
* Table booking form
* Customer feedback form
* FAQ page
* User registration page
* User login page

The current version focuses on **responsive design, Bootstrap grid/layout utilities, responsive navigation, forms, buttons, tables, cards, and reusable styling**.

## 🎯 Web Technologies Assignment 3

This version follows the Assignment 3 requirement:

> **Bootstrap builds, your CSS corrects.**

Bootstrap handles most of the layout, spacing, responsive behavior, navigation, buttons, and components. Custom CSS is used mainly for the Zebra Coffee visual identity and small project-specific corrections.

The assignment requires Bootstrap to handle page structure, columns, spacing, navigation, buttons, and responsive behavior.

### Bootstrap implementation

* **Bootstrap version:** 5.3.3
* Bootstrap is loaded from the official jsDelivr CDN
* Custom stylesheets are loaded after Bootstrap
* Bootstrap JavaScript is used for the responsive navbar toggler
* Responsive breakpoints use classes such as `col-12`, `col-md-8`, `col-lg-5`, `col-lg-7`, and `row-cols-md-3`
* Both `container` and `container-fluid` are used
* Bootstrap utility classes handle spacing, typography, alignment, colors, borders, shadows, flexbox, and display behavior

## 📄 Pages

| Page            | Description                                           |
| --------------- | ----------------------------------------------------- |
| `index.html`    | Home page and information about Zebra Coffee          |
| `menu.html`     | Drinks, prices, ordering information, and menu tables |
| `booking.html`  | Table reservation form                                |
| `feedback.html` | Customer feedback form                                |
| `faq.html`      | Frequently Asked Questions                            |
| `login.html`    | User login form                                       |
| `register.html` | New account registration form                         |

## 🎨 Styling

Custom CSS is separated into focused stylesheets:

```text
css/
├── auth.css       # Authentication-related styles
├── base.css       # Shared branding, colors, typography and navigation
├── nurzhan.css    # Home/menu and shared decorative styles
└── yelzhan.css    # FAQ and authentication-page styling
```

The custom styles preserve the Zebra Coffee visual identity with a warm cream/beige palette, dark brown/black accents, and decorative serif typography.

Bootstrap replaces much of the layout work previously handled by custom CSS. The assignment specifically requires removing duplicated layout, spacing, alignment, and button rules.

## 🧩 Bootstrap Features Used

Examples of Bootstrap features used in the project:

* **Containers:** `container`, `container-fluid`
* **Grid:** `row`, `col-12`, `col-md-6`, `col-lg-4`, `col-lg-7`, `col-lg-8`
* **Responsive navigation:** `navbar`, `navbar-expand-md`, `navbar-toggler`, `collapse`
* **Cards:** `card`, `card-body`, `shadow-sm`
* **Tables:** `table`, `table-striped`, `table-responsive`
* **Forms:** `form-control`, `form-select`, `form-check`
* **Buttons:** `btn-dark`, `btn-outline-dark`, `btn-secondary`, `btn-lg`, `btn-sm`
* **Typography:** `display-5`, `lead`, `text-muted`, `fw-semibold`, `fst-italic`
* **Spacing:** `p-4`, `py-5`, `mb-4`, `mt-5`, `g-4`
* **Layout utilities:** `d-flex`, `flex-column`, `justify-content-center`, `align-items-center`

## 🧱 Bootstrap Components

The project uses Bootstrap components that fit the coffee shop content:

* Cards for information and menu sections
* List groups for ordering steps
* Alerts for menu notices
* Responsive tables for prices
* Badges for quick menu statistics
* Responsive navbar with a mobile toggler

The assignment requires at least one Bootstrap component to be adapted to the project's own content.

## 📱 Responsive Design

The site is designed to adapt to:

* **Phone:** approximately 375px
* **Tablet:** approximately 768px
* **Desktop:** normal browser width

Responsive Bootstrap classes allow content to stack on smaller screens and expand into multiple columns on larger screens.

The navigation also collapses into a Bootstrap toggler on smaller screens.

The assignment specifically requires testing these widths and avoiding horizontal overflow on mobile screens.

## 👤 Team

### Yelzhan Baurzhanov

Responsible for:

* Login page
* Registration page
* Authentication-related styling
* `auth.css`
* `yelzhan.css`
* Responsive Bootstrap layout for authentication pages

### Nurzhan

Responsible for:

* Home page
* Menu page
* Related layout and styling work
* `nurzhan.css`

## 🚀 How to Run

The project uses local HTML files and does not require a backend or hosting server.

### Option 1: Open directly

Open `index.html` in a modern web browser.

### Option 2: VS Code

Open the project folder in Visual Studio Code and launch `index.html` with a browser or Live Server.

Because Bootstrap is loaded from a CDN, an internet connection is required for the Bootstrap stylesheet and JavaScript bundle.

## 📁 Repository Structure

```text
ZebraCoffeeSite-/
├── css/
│   ├── auth.css
│   ├── base.css
│   ├── nurzhan.css
│   └── yelzhan.css
├── images/
├── CSSChecklist.pdf
├── index.html
├── menu.html
├── booking.html
├── feedback.html
├── faq.html
├── login.html
├── register.html
└── README.md
```

## 📝 Assignment Notes

The assignment keeps the original site theme and page structure. Existing HTML is extended with Bootstrap classes rather than rebuilding the website from scratch.

The submission also requires:

* Three responsive screenshots
* One screenshot showing the collapsed mobile navigation
* Updated AI log
* Updated README
* W3C validation
* Required commit history

These requirements are specified in the assignment brief.

## 🛠 Technologies

* HTML5
* CSS3
* Bootstrap 5.3.3
* Responsive Web Design
* Bootstrap Grid System
* Bootstrap Components
* Bootstrap Utility Classes
* W3C HTML Validation

## 🔗 Repository

[Zebra Coffee on GitHub](https://github.com/anonimakk34-hash/ZebraCoffeeSite-)

