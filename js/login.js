const loginForm = document.getElementById("login-form");
if (loginForm) {
    const errorBox = document.getElementById("login-error");
    const resultBox = document.getElementById("login-result");
 
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        hideMessage(errorBox);
        hideMessage(resultBox);
 
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;
        const saved = localStorage.getItem("zebraUser");
 
        if (!saved) {
            showMessage(errorBox, "No account found. Please register first.");
            return;
        }
 
        const user = JSON.parse(saved);
        if (user.email === email && user.password === password) {
            showMessage(resultBox, "Welcome back, " + user.name + "!");
            loginForm.reset();
        } else {
            showMessage(errorBox, "Incorrect email or password.");
        }
    });
}