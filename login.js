
/* =========================================
   ANKMARK STUDIO ERP — LOGIN SYSTEM
========================================= */

// Login password for this basic client-side version
const STUDIO_PASSWORD = "Ankmark2404";

// Change this if your dashboard file has a different name
const DASHBOARD_PAGE = "dashboard.html";

const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("togglePassword");
const loginError = document.getElementById("loginError");

// Show or hide the password
togglePasswordButton.addEventListener("click", function () {
    const isPasswordHidden = passwordInput.type === "password";

    passwordInput.type = isPasswordHidden ? "text" : "password";

    togglePasswordButton.textContent = isPasswordHidden
        ? "Hide"
        : "Show";

    togglePasswordButton.setAttribute(
        "aria-label",
        isPasswordHidden ? "Hide password" : "Show password"
    );
});

// Check the entered password
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const enteredPassword = passwordInput.value;

    if (enteredPassword === STUDIO_PASSWORD) {
        loginError.hidden = true;

        // Open the existing ERP dashboard
        window.location.href = DASHBOARD_PAGE;
    } else {
        loginError.textContent =
            "Incorrect password. Please try again.";

        loginError.hidden = false;
        passwordInput.value = "";
        passwordInput.focus();
    }
});

// Hide the error while the user tries again
passwordInput.addEventListener("input", function () {
    loginError.hidden = true;
});
