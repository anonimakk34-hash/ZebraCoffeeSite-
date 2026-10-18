'use strict';

/*
 * order.js: order form on order.html.
 * Flow: input/change -> updateTotal() (live price)
 *       submit -> validateOrder() -> errors next to the fields + focus on the
 *       first wrong field, or a demo summary (nothing is sent anywhere).
 * DRINKS, findDrink() and formatPrice() come from main.js.
 */

(() => {
    const form = document.querySelector('form');
    const drinkSelect = document.querySelector('#drink');
    const sizeSelect = document.querySelector('#size');
    const quantityInput = document.querySelector('#quantity');
    const flavourSelect = document.querySelector('#flavour');
    const confirmationInput = document.querySelector('#confirmation');
    const takeawayRadio = document.querySelector('#takeaway');
    const pickupRadio = document.querySelector('#pickup');
    const citySelect = document.querySelector('#city');
    const districtSelect = document.querySelector('#district');
    const streetSelect = document.querySelector('#street');
    const buildingSelect = document.querySelector('#building');
    const apartmentSelect = document.querySelector('#apartment');

    // Stop on pages that do not have the order form.
    if (
        form === null ||
        drinkSelect === null ||
        sizeSelect === null ||
        quantityInput === null ||
        flavourSelect === null ||
        confirmationInput === null ||
        takeawayRadio === null ||
        pickupRadio === null ||
        citySelect === null ||
        districtSelect === null ||
        streetSelect === null ||
        buildingSelect === null ||
        apartmentSelect === null
    ) {
        return;
    }

    // Demo addresses for the delivery form, not real delivery zones.
    const locations = {
        astana: {
            "Yesil District": {
                "Mangilik El Avenue": {
                    buildings: {
                        "12": ["101", "102", "103", "104"],
                        "25": ["201", "202", "203"],
                        "42": ["301", "302", "303"]
                    }
                },

                "Turan Avenue": {
                    buildings: {
                        "5": ["1", "2", "3"],
                        "18": ["45", "46", "47"],
                        "30": ["120", "121", "122"]
                    }
                }
            },

            "Almaty District": {
                "Tauelsizdik Avenue": {
                    buildings: {
                        "8": ["11", "12", "13"],
                        "21": ["51", "52", "53"]
                    }
                },

                "Bogenbai Batyr Avenue": {
                    buildings: {
                        "15": ["101", "102"],
                        "40": ["201", "202", "203"]
                    }
                }
            }
        },

        almaty: {
            "Medeu District": {
                "Dostyk Avenue": {
                    buildings: {
                        "10": ["1", "2", "3"],
                        "55": ["101", "102", "103"]
                    }
                },

                "Abai Avenue": {
                    buildings: {
                        "100": ["10", "11", "12"],
                        "120": ["20", "21", "22"]
                    }
                }
            }
        },

        shymkent: {
            "Karatau District": {
                "Zhibek Zholy Street": {
                    buildings: {
                        "7": ["1", "2", "3"],
                        "14": ["10", "11", "12"]
                    }
                }
            }
        }
    };

    // Extra charges per cup. These are DEMO rules for this assignment: the real
    // menu does not list them, so they must be described in the README.
    const FLAVOUR_SURCHARGE = 150;
    const PLANT_MILK_SURCHARGE = 200;
    const MILK_SURCHARGES = {
        regular: 0,
        oat: PLANT_MILK_SURCHARGE,
        almond: PLANT_MILK_SURCHARGE,
        none: 0
    };
    const MILK_NAMES = {
        regular: 'Regular milk',
        oat: 'Oat milk',
        almond: 'Almond milk',
        none: 'No milk'
    };

    form.noValidate = true;
    let orderSubmitted = false;

    // ---------- elements that do not exist in the frozen HTML ----------

    const totalPanel = document.createElement('section');
    totalPanel.className = 'border rounded-3 p-3 my-4';
    totalPanel.setAttribute('aria-live', 'polite');
    totalPanel.classList.add('bg-white');
    totalPanel.classList.add('card', 'p-3', 'rounded-3', 'shadow-sm');

    const totalHeading = document.createElement('h3');
    totalHeading.className = 'h5';
    totalHeading.textContent = 'Order total';

    const totalText = document.createElement('div');
    totalText.className = 'mb-1';
    totalText.textContent = 'Choose a drink and size to calculate the price.';

    const priceNote = document.createElement('p');
    priceNote.className = 'small text-muted mb-0';
    priceNote.textContent = `Demo estimate: a flavour adds ${FLAVOUR_SURCHARGE} ₸ and oat or almond milk adds ${PLANT_MILK_SURCHARGE} ₸ per cup.`;

    totalPanel.append(totalHeading, totalText, priceNote);

    const sidebar = document.querySelector('.col-12.col-lg-4');

    if (sidebar === null) {
        form.before(totalPanel);
    } else {
        const sidebarCards = sidebar.querySelectorAll('.card');

        if (sidebarCards.length > 1) {
            sidebarCards[1].before(totalPanel);
        } else {
            sidebar.prepend(totalPanel);
        }
    }

    const resultPanel = document.createElement('section');
    resultPanel.className = 'border rounded-3 p-3 my-4 hidden';
    resultPanel.setAttribute('aria-live', 'polite');
    resultPanel.setAttribute('aria-atomic', 'true');
    form.after(resultPanel);

    // ---------- helpers ----------

    function createTextElement(tagName, text, className) {
        const element = document.createElement(tagName);
        element.textContent = text;

        if (className !== '') {
            element.className = className;
        }

        return element;
    }

    // ---------- address selects (city -> district -> street -> building -> apartment) ----------

    // Replaces all options of a select with one placeholder option.
    function resetSelect(select, label) {
        const placeholder = document.createElement('option');

        placeholder.value = '';
        placeholder.textContent = label;
        select.replaceChildren(placeholder);
        clearFieldError(select);
    }

    function fillSelect(select, values) {
        values.forEach((value) => {
            const option = document.createElement('option');

            option.value = value;
            option.textContent = value;
            select.append(option);
        });
    }

    // Returns the street object for the current choices, or undefined.
    function getSelectedStreet() {
        return locations[citySelect.value]?.[districtSelect.value]?.[streetSelect.value];
    }

    // Cross-field rule: the apartment must really belong to the chosen building.
    function isAddressConsistent() {
        const street = getSelectedStreet();

        if (street === undefined) {
            return false;
        }

        const apartments = street.buildings[buildingSelect.value];
        return apartments !== undefined && apartments.includes(apartmentSelect.value);
    }

    function getDeliveryAddress() {
        return [
            citySelect.options[citySelect.selectedIndex].textContent,
            districtSelect.value,
            streetSelect.value,
            `Building ${buildingSelect.value}`,
            `Apartment ${apartmentSelect.value}`
        ].join(', ');
    }

    Object.keys(locations).forEach((city) => {
        const option = document.createElement('option');

        option.value = city;
        option.textContent = city.charAt(0).toUpperCase() + city.slice(1);

        citySelect.append(option);
    });

    citySelect.addEventListener('change', () => {
        resetSelect(districtSelect, 'Choose a district');
        resetSelect(streetSelect, 'Choose a street');
        resetSelect(buildingSelect, 'Choose a building');
        resetSelect(apartmentSelect, 'Choose an apartment');

        const districts = locations[citySelect.value];

        if (districts === undefined) {
            return;
        }

        fillSelect(districtSelect, Object.keys(districts));
    });

    districtSelect.addEventListener('change', () => {
        resetSelect(streetSelect, 'Choose a street');
        resetSelect(buildingSelect, 'Choose a building');
        resetSelect(apartmentSelect, 'Choose an apartment');

        const streets = locations[citySelect.value]?.[districtSelect.value];

        if (streets === undefined) {
            return;
        }

        fillSelect(streetSelect, Object.keys(streets));
    });

    streetSelect.addEventListener('change', () => {
        resetSelect(buildingSelect, 'Choose a building');
        resetSelect(apartmentSelect, 'Choose an apartment');

        const street = getSelectedStreet();

        if (street === undefined) {
            return;
        }

        fillSelect(buildingSelect, Object.keys(street.buildings));
    });

    buildingSelect.addEventListener('change', () => {
        resetSelect(apartmentSelect, 'Choose an apartment');

        const apartments = getSelectedStreet()?.buildings[buildingSelect.value];

        if (apartments === undefined) {
            return;
        }

        fillSelect(apartmentSelect, apartments);
    });

    // ---------- price ----------

    function updateSizeOptions() {
        const drink = findDrink(drinkSelect.value);
        const placeholder = document.createElement('option');

        placeholder.value = '';
        placeholder.textContent = 'Choose a size';
        placeholder.disabled = true;
        placeholder.selected = true;

        sizeSelect.replaceChildren(placeholder);

        if (drink === undefined) {
            sizeSelect.disabled = true;
            return;
        }

        drink.sizes.forEach((size) => {
            const option = document.createElement('option');

            option.value = size.value;
            option.textContent = `${size.value} ml — ${formatPrice(size.price)}`;

            sizeSelect.append(option);
        });

        sizeSelect.disabled = false;
    }

    // Price of ONE cup = base price of the size + flavour extra + milk extra.
    function calculateUnitPrice(drink, size, flavour, milk) {
        if (drink === undefined || size === '') {
            return 0;
        }

        const selectedSize = drink.sizes.find(
            (item) => item.value === size
        );

        if (selectedSize === undefined) {
            return 0;
        }

        let price = selectedSize.price;

        if (flavour !== 'none') {
            price += FLAVOUR_SURCHARGE;
        }

        const milkExtra = MILK_SURCHARGES[milk];

        if (milkExtra !== undefined) {
            price += milkExtra;
        }

        return price;
    }

    function calculateTotal(unitPrice, quantity) {
        return unitPrice * quantity;
    }

    function getSelectedMilk() {
        const selectedMilk = form.querySelector('input[name="milk"]:checked');
        return selectedMilk === null ? 'regular' : selectedMilk.value;
    }

    function updateTotal() {
        const drink = findDrink(drinkSelect.value);
        const quantity = Number(quantityInput.value);
        const milk = getSelectedMilk();
        const unitPrice = calculateUnitPrice(drink, sizeSelect.value, flavourSelect.value, milk);

        if (drink === undefined || sizeSelect.value === '' || quantity < 1 || quantity > 20 || Number.isInteger(quantity) === false) {
            totalText.textContent = 'Choose a drink and size, then enter a quantity from 1 to 20.';
            return 0;
        }

        const total = calculateTotal(unitPrice, quantity);
        const flavourName = flavourSelect.options[flavourSelect.selectedIndex]?.textContent || 'No flavour';

        const lines = [
            `Drink: ${drink.name}`,
            `Size: ${sizeSelect.value} ml`,
            `Flavour: ${flavourName}`,
            `Milk: ${MILK_NAMES[milk]}`,
            `Quantity: ${quantity}`,
            `Price per cup: ${formatPrice(unitPrice)}`,
            `Total: ${formatPrice(total)}`
        ];

        const list = document.createElement('ul');
        list.className = 'mb-0';
        lines.forEach((line) => {
            list.append(createTextElement('li', line, ''));
        });
        list.lastElementChild.classList.add('fw-bold');

        totalText.replaceChildren(list);
        return total;
    }

    // ---------- errors ----------

    function getFieldContainer(field) {
        return field.closest('.col-12, .col-6, .mb-3, .mb-4, .form-check') || field.parentElement;
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');

        const message = form.querySelector(`[data-error-for="${field.id}"]`);

        if (message !== null) {
            message.remove();
        }
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');

        const errorMessage = createTextElement('small', message, 'js-error-message text-danger d-block mt-1');
        errorMessage.dataset.errorFor = field.id;

        const container = getFieldContainer(field);

        // Some selects carry the .mb-3 class themselves: put the message after them.
        if (container === field) {
            field.after(errorMessage);
        } else {
            container.append(errorMessage);
        }
    }

    function clearAllErrors() {
        form.querySelectorAll('.js-error-message').forEach((message) => message.remove());
        form.querySelectorAll('.error').forEach((field) => {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
        });
    }

    // ---------- validation ----------

    function validateText(field, message, minimumLength = 1) {
        const value = field.value.trim();

        if (value.length < minimumLength) {
            showFieldError(field, message);
            return false;
        }

        clearFieldError(field);
        return true;
    }

    function getCustomerFields() {
        if (takeawayRadio.checked === true) {
            return {
                name: document.querySelector('#takeaway-name'),
                phone: document.querySelector('#takeaway-phone'),
                email: document.querySelector('#takeaway-email')
            };
        }

        return {
            name: document.querySelector('#pickup-name'),
            phone: null,
            email: null
        };
    }

    // Checks the visible customer block. Every wrong field goes into
    // invalidFields in page order, so the caller can focus the FIRST wrong one.
    function validateCustomer() {
        const customer = getCustomerFields();
        const invalidFields = [];

        if (validateText(customer.name, 'Please enter your full name.', 2) === false) {
            invalidFields.push(customer.name);
        }

        if (takeawayRadio.checked === true) {
            const phoneDigits = customer.phone.value.replace(/\D/g, '');

            if (phoneDigits.length < 10 || phoneDigits.length > 15) {
                showFieldError(customer.phone, 'Enter a phone number with 10–15 digits.');
                invalidFields.push(customer.phone);
            } else {
                clearFieldError(customer.phone);
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailPattern.test(customer.email.value.trim()) === false) {
                showFieldError(customer.email, 'Enter a valid email address.');
                invalidFields.push(customer.email);
            } else {
                clearFieldError(customer.email);
            }

            const addressFields = [
                [citySelect, 'Please choose a city.'],
                [districtSelect, 'Please choose a district.'],
                [streetSelect, 'Please choose a street.'],
                [buildingSelect, 'Please choose a building.'],
                [apartmentSelect, 'Please choose an apartment.']
            ];
            let addressIsComplete = true;

            addressFields.forEach(([field, message]) => {
                if (field.value === '') {
                    showFieldError(field, message);
                    invalidFields.push(field);
                    addressIsComplete = false;
                } else {
                    clearFieldError(field);
                }
            });

            if (addressIsComplete === true && isAddressConsistent() === false) {
                showFieldError(apartmentSelect, 'This apartment does not belong to the selected building.');
                invalidFields.push(apartmentSelect);
            }
        }

        return { isValid: invalidFields.length === 0, firstField: invalidFields[0] };
    }

    function validateOrder() {
        clearAllErrors();
        resultPanel.classList.add('hidden');
        resultPanel.replaceChildren();

        let isValid = true;
        let firstInvalidField = null;

        if (findDrink(drinkSelect.value) === undefined) {
            showFieldError(drinkSelect, 'Please choose a drink.');
            isValid = false;
            firstInvalidField = drinkSelect;
        }

        if (sizeSelect.value === '') {
            showFieldError(sizeSelect, 'Please choose a size.');
            isValid = false;

            if (firstInvalidField === null) {
                firstInvalidField = sizeSelect;
            }
        } else {
            clearFieldError(sizeSelect);
        }

        const quantity = Number(quantityInput.value);

        if (Number.isInteger(quantity) === false || quantity < 1 || quantity > 20) {
            showFieldError(quantityInput, 'Quantity must be a whole number from 1 to 20.');
            isValid = false;

            if (firstInvalidField === null) {
                firstInvalidField = quantityInput;
            }
        } else {
            clearFieldError(quantityInput);
        }

        const customerValidation = validateCustomer();

        if (customerValidation.isValid === false) {
            isValid = false;

            if (firstInvalidField === null) {
                firstInvalidField = customerValidation.firstField;
            }
        }

        if (confirmationInput.checked !== true) {
            showFieldError(confirmationInput, 'Please confirm that the information is correct.');
            isValid = false;

            if (firstInvalidField === null) {
                firstInvalidField = confirmationInput;
            }
        } else {
            clearFieldError(confirmationInput);
        }

        if (isValid === false) {
            if (firstInvalidField !== null) {
                firstInvalidField.focus();
            }

            resultPanel.classList.remove('hidden', 'success');
            resultPanel.replaceChildren(
                createTextElement('p', 'Please correct the highlighted fields and try again.', 'mb-0')
            );
            updateTotal();
            return;
        }

        const drink = findDrink(drinkSelect.value);
        const customer = getCustomerFields();
        const milk = getSelectedMilk();
        const quantityValue = Number(quantityInput.value);
        const unitPrice = calculateUnitPrice(drink, sizeSelect.value, flavourSelect.value, milk);
        const orderNumber = `ZB-${Math.floor(Math.random() * 9000) + 1000}`;

        const order = {
            orderNumber,
            drinkName: drink.name,
            size: sizeSelect.value,
            quantity: quantityValue,
            flavourName: flavourSelect.options[flavourSelect.selectedIndex].textContent,
            milkName: form.querySelector('input[name="milk"]:checked').labels[0].textContent.trim(),
            unitPrice,
            orderType: takeawayRadio.checked === true ? 'Takeaway' : 'Pick up at cafe',
            customerName: customer.name.value.trim(),
            address: takeawayRadio.checked === true ? getDeliveryAddress() : 'Pickup at cafe',
            total: calculateTotal(unitPrice, quantityValue),
            time: document.querySelector('#time').value,
            notes: document.querySelector('#notes').value.trim()
        };

        renderOrderSummary(order);
        orderSubmitted = true;
    }

    // ---------- success summary ----------

    function renderOrderSummary(order) {
        resultPanel.replaceChildren();
        resultPanel.classList.remove('hidden', 'error');
        resultPanel.classList.add('success');

        resultPanel.append(createTextElement('h3', 'Demo order summary', 'h4'));

        const summaryItems = [
            `Demo order number: ${order.orderNumber}`,
            `Drink: ${order.drinkName}, ${order.size} ml`,
            `Quantity: ${order.quantity}`,
            `Flavour: ${order.flavourName}`,
            `Milk: ${order.milkName}`,
            `Price per cup: ${formatPrice(order.unitPrice)}`,
            `Order type: ${order.orderType}`,
            `Customer: ${order.customerName}`,
            `Address: ${order.address}`,
            `Estimated total: ${formatPrice(order.total)}`
        ];

        if (order.time !== '') {
            summaryItems.push(`Preferred time: ${order.time === 'asap' ? 'As soon as possible' : order.time}`);
        }

        if (order.notes !== '') {
            summaryItems.push(`Special requests: ${order.notes}`);
        }

        const summaryList = document.createElement('ul');
        summaryItems.forEach((item) => {
            summaryList.append(createTextElement('li', item, 'mb-1'));
        });

        resultPanel.append(summaryList);
        resultPanel.append(
            createTextElement(
                'p',
                'This is a classroom demo only. The order has not been sent to Zebra Coffee and no real order or payment has been created.',
                'mb-0'
            )
        );
    }

    // ---------- events ----------

    [drinkSelect, sizeSelect, quantityInput, flavourSelect].forEach((field) => {
        field.addEventListener('change', () => {
            if (field === drinkSelect) {
                updateSizeOptions();
            }

            updateTotal();
        });

        field.addEventListener('input', () => {
            if (field === drinkSelect) {
                updateSizeOptions();
            }

            updateTotal();
        });
    });

    form.querySelectorAll('input[name="milk"]').forEach((field) => {
        field.addEventListener('change', updateTotal);
    });

    [takeawayRadio, pickupRadio].forEach((field) => {
        field.addEventListener('change', () => {
            clearAllErrors();
            resultPanel.classList.add('hidden');
        });
    });

    form.addEventListener('input', (event) => {
        orderSubmitted = false;

        if (event.target.matches('input, textarea, select')) {
            clearFieldError(event.target);
        }
    });

    form.addEventListener('change', (event) => {
        orderSubmitted = false;

        if (event.target.matches('input, textarea, select')) {
            clearFieldError(event.target);
        }
    });

    form.addEventListener('click', (event) => {
        if (event.target.closest('button[type="submit"]') !== null) {
            resultPanel.classList.add('hidden');
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        validateOrder();
    });

    form.addEventListener('reset', () => {
        orderSubmitted = false;

        // The browser clears the fields after the reset event, so wait one tick.
        window.setTimeout(() => {
            clearAllErrors();
            resultPanel.classList.add('hidden');
            resultPanel.replaceChildren();
            resetSelect(districtSelect, 'Choose a district');
            resetSelect(streetSelect, 'Choose a street');
            resetSelect(buildingSelect, 'Choose a building');
            resetSelect(apartmentSelect, 'Choose an apartment');
            updateSizeOptions();
            updateTotal();
        }, 0);
    });

    // Warn before leaving only when there is something unsent in the form.
    function hasUnsavedChanges() {
        return orderSubmitted === false && (
            drinkSelect.value !== '' ||
            sizeSelect.value !== '' ||
            quantityInput.value !== quantityInput.defaultValue ||
            confirmationInput.checked === true
        );
    }

    window.addEventListener('beforeunload', (event) => {
        if (hasUnsavedChanges()) {
            event.preventDefault();
            event.returnValue = '';
        }
    });

    // menu.html links here as order.html?drink=latte
    function applyDrinkFromUrl() {
        const requestedId = new URLSearchParams(window.location.search).get('drink');

        if (requestedId === null || findDrink(requestedId) === undefined) {
            return;
        }

        drinkSelect.value = requestedId;
        updateSizeOptions();
        updateTotal();
    }

    updateSizeOptions();
    updateTotal();
    applyDrinkFromUrl();
})();