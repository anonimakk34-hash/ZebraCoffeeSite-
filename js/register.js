'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('#register-form') || document.querySelector('form');
    if (!registerForm) return;

    const passwordInput = registerForm.querySelector('#password');
    const confirmInput = registerForm.querySelector('#confirm-password') || registerForm.querySelector('#confirmPassword');

    const createToggleBtn = (inputEl) => {
        if (!inputEl) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Show';
        btn.className = 'btn btn-sm btn-outline-secondary mt-1 mb-2';
        btn.setAttribute('aria-label', 'Toggle password visibility');
        
        btn.addEventListener('click', () => {
            const type = inputEl.getAttribute('type') === 'password' ? 'text' : 'password';
            inputEl.setAttribute('type', type);
            btn.textContent = type === 'password' ? 'Show' : 'Hide';
        });
        
        inputEl.insertAdjacentElement('afterend', btn);
    };

    createToggleBtn(passwordInput);
    createToggleBtn(confirmInput);

    const checklistContainer = document.createElement('div');
    checklistContainer.className = 'password-checklist small mt-2 mb-3 p-3 bg-light border rounded';
    
    const checklistTitle = document.createElement('p');
    checklistTitle.className = 'mb-2 fw-bold';
    checklistTitle.textContent = 'Password must contain:';
    checklistContainer.appendChild(checklistTitle);

    const ul = document.createElement('ul');
    ul.className = 'list-unstyled mb-0';
    
    const reqs = [
        { id: 'req-length', text: '✗ At least 8 characters' },
        { id: 'req-upper', text: '✗ At least one uppercase letter' },
        { id: 'req-lower', text: '✗ At least one lowercase letter' },
        { id: 'req-number', text: '✗ At least one digit' },
        { id: 'req-special', text: '✗ At least one special character' }
    ];

    reqs.forEach(req => {
        const li = document.createElement('li');
        li.id = req.id;
        li.className = 'text-danger';
        li.textContent = req.text;
        ul.appendChild(li);
    });

    checklistContainer.appendChild(ul);
    
    if (passwordInput) {
        passwordInput.nextElementSibling.insertAdjacentElement('afterend', checklistContainer);
    }

    const requirements = {
        length: /.{8,}/,
        upper: /[A-Z]/,
        lower: /[a-z]/,
        number: /[0-9]/,
        special: /[^A-Za-z0-9]/
    };

    passwordInput?.addEventListener('input', (e) => {
        const val = e.target.value;
        for (const [key, regex] of Object.entries(requirements)) {
            const el = document.getElementById(`req-${key}`);
            if (!el) continue;
            
            if (regex.test(val)) {
                el.classList.replace('text-danger', 'text-success');
                el.textContent = el.textContent.replace('✗', '✓');
            } else {
                el.classList.replace('text-success', 'text-danger');
                el.textContent = el.textContent.replace('✓', '✗');
            }
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideMessage();

        const password = passwordInput?.value ?? '';
        const confirmPassword = confirmInput?.value ?? '';

        const isValid = Object.values(requirements).every(regex => regex.test(password));

        if (!isValid) {
            showMessage('Please ensure your password meets all checklist requirements.', 'danger');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Passwords do not match. Please try again.', 'danger');
            return;
        }

        showMessage('Front-end demonstration only. No real account was created, and no data was saved or sent to any server.', 'success');
        
        registerForm.reset();
        if (passwordInput) passwordInput.dispatchEvent(new Event('input'));
    });
});
