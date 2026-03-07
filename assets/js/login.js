// login.js
const loginBtn = document.querySelector("button");
const usernameInput = document.querySelector("input[type='text']");
const passwordInput = document.querySelector("input[type='password']");
loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (username === "admin" && password === "admin123") {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "index.html"; 
    } else {
        alert("Invalid credentials!");
    }
});