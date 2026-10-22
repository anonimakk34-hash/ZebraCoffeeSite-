'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login-form') || document.querySelector('form');
  if (!loginForm) return;

  const passwordInput = loginForm.querySelector('#password');

  // Create Accessible Show/Hide Button
  if (passwordInput) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Show';
    btn.className = 'btn btn-sm btn-outline-secondary mt-1 mb-3';
    btn.setAttribute('aria-label', 'Toggle password visibility');
    
    btn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      btn.textContent = type === 'password' ? 'Show' : 'Hide';
    });
    
    passwordInput.insertAdjacentElement('afterend', btn);
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof window.hideMessage === 'function') window.hideMessage();

    const email = loginForm.querySelector('#email')?.value.trim() ?? '';
    const password = passwordInput?.value ?? '';

    if (!email || !password) {
      if (typeof window.showMessage === 'function') {
        window.showMessage('Please enter both email and password.', 'danger');
      }
      return;
    }

    // Explicit Front-end Demonstration Message
    if (typeof window.showMessage === 'function') {
      window.showMessage('Front-end demonstration only. You are not authenticated, and no login data was verified or sent.', 'success');
    }
    
    loginForm.reset();
  });
});