const registerForm = document.getElementById("register-form");
if (registerForm) {
    const errorBox = document.getElementById("register-error");
    const resultBox = document.getElementById("register-result");
 
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        hideMessage(errorBox);
        hideMessage(resultBox);
 
        const name = document.getElementById("register-name").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const password = document.getElementById("register-password").value;
        const confirm = document.getElementById("register-password-confirm").value;
 
        if (name.length < 2) {
            showMessage(errorBox, "Please enter your full name.");
        } else if (password.length < 6) {
            showMessage(errorBox, "Password must be at least 6 characters.");
        } else if (password !== confirm) {
            showMessage(errorBox, "Passwords do not match.");
        } else {
            // No server, so save the user in the browser
            localStorage.setItem("zebraUser", JSON.stringify({ name: name, email: email, password: password }));
            showMessage(resultBox, "Welcome, " + name + "! Your account has been created. You can log in now.");
            registerForm.reset();
        }
    });
}