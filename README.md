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

## Three user journeys

Each journey follows one visitor from the first page to the end of the task. They cover the account, feedback and information pages of the site.

### Journey 1: Find the opening hours and the quietest time to visit

**Start:** the visitor opens `index.html` and wants to know when Zebra Coffee is open and when it is least busy.

**Steps**
1. In the navbar, click **FAQ** (`faq.html`).
2. The first question, "What are your opening hours?", is already open. The visitor reads the answer: every day, 08:00 to 21:00.
3. The visitor clicks "How long will I wait for my order?" and reads that the wait depends on the time of day.
4. The visitor looks at the **Expected Wait Times** table next to the questions.

**End:** the visitor knows the shop is open 08:00 to 21:00 and that 08:00 to 11:00 is the quietest time, with an expected wait of 5 minutes.

### Journey 2: Leave feedback after a visit

**Start:** the visitor has just visited the shop and opens `index.html`.

**Steps**
1. In the navbar, click **Feedback** (`feedback.html`).
2. Fill in the required fields: full name, email address, date of visit, rating (1 to 5), order type (dine-in or takeaway) and additional comments.
3. Optionally choose a favorite drink, enter a phone number, and tick "I would recommend Zebra Coffee to a friend".
4. Click **Submit Feedback**.
5. If a required field is missing or invalid, a message appears in the red box under the form (`feedback-error`) and the visitor corrects it.

**End:** a confirmation appears in the green box under the form (`feedback-result`): "Thank you for your feedback!"

### Journey 3: Create an account and log in

**Start:** a new visitor opens `index.html` and wants an account.

**Steps**
1. In the navbar, click **Register** (`register.html`).
2. Fill in full name, email address, password and password confirmation, and tick "I agree to the Terms & Conditions". The phone number is optional.
3. Click **Register**.
4. If the passwords do not match or a field is missing, the red box (`register-error`) explains the problem and the visitor fixes it.
5. After a successful registration the green box (`register-result`) says the account was created. The visitor clicks **Log in here** under the form, which opens `login.html`.
6. Enter the same email and password, optionally tick "Remember me", and click **Log In**.

**End:** a welcome message appears in the green box (`login-result`) on the login page.
