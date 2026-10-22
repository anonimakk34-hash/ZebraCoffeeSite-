'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('#register-form') || document.querySelector('form');
  if (!registerForm) return;

  const passwordInput = registerForm.querySelector('#password');
  const confirmInput = registerForm.querySelector('#confirm-password') || registerForm.querySelector('#confirmPassword');

  // 1. Create Accessible Show/Hide Buttons
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

  // 2. Create Live Checklist DOM
  const checklistContainer = document.createElement('div');
  checklistContainer.className = 'password-checklist small mt-2 mb-3 p-3 bg-light border rounded';
  checklistContainer.innerHTML = `
    <p class="mb-2 fw-bold">Password must contain:</p>
    <ul class="list-unstyled mb-0">
      <li id="req-length" class="text-danger">✗ At least 8 characters</li>
      <li id="req-upper" class="text-danger">✗ At least one uppercase letter</li>
      <li id="req-lower" class="text-danger">✗ At least one lowercase letter</li>
      <li id="req-number" class="text-danger">✗ At least one digit</li>
      <li id="req-special" class="text-danger">✗ At least one special character</li>
    </ul>
  `;
  
  if (passwordInput) {
    // Insert checklist right after the password field's container or the toggle button
    passwordInput.nextElementSibling.insertAdjacentElement('afterend', checklistContainer);
  }

  // 3. Live Validation Logic
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

  // 4. Form Submit Handler
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof window.hideMessage === 'function') window.hideMessage();

    const password = passwordInput?.value ?? '';
    const confirmPassword = confirmInput?.value ?? '';

    // Verify all regex requirements
    const isValid = Object.values(requirements).every(regex => regex.test(password));

    if (!isValid) {
      if (typeof window.showMessage === 'function') {
        window.showMessage('Please ensure your password meets all checklist requirements.', 'danger');
      }
      return;
    }

    if (password !== confirmPassword) {
      if (typeof window.showMessage === 'function') {
        window.showMessage('Passwords do not match. Please try again.', 'danger');
      }
      return;
    }

    // Explicit Front-end Demonstration Message (No Data Saved)
    if (typeof window.showMessage === 'function') {
      window.showMessage('Front-end demonstration only. No real account was created, and no data was saved or sent to any server.', 'success');
    }
    
    registerForm.reset();
    
    // Reset live checklist UI
    passwordInput.dispatchEvent(new Event('input'));
  });
});