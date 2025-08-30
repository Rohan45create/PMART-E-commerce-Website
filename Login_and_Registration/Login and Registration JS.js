let loginForm = document.querySelector(".form-login");
let registerForm = document.querySelector(".form-register");
let showRegister = document.querySelector("#show-register");
let showLogin = document.querySelector("#show-login");
let buttonLogin = document.querySelector("#button-login");
let buttonRegister = document.querySelector("#button-register");
let invalidEmail = document.getElementById("invalid-email");
let invalidRegEmail = document.getElementById("invalid-regemail");
let spanName = document.getElementById("span-name");
let spanMobile = document.getElementById("span-mobile");
let spanPassword = document.getElementById("span-password");

showRegister.addEventListener("click", () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
});

showLogin.addEventListener("click", () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
});

// Login form validation
buttonLogin.addEventListener('click', function (event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (email === '' || password === '') {
        alert('Please fill in all fields');
    } else if (!validateEmail(email)) {
        invalidEmail.innerText = "Enter a valid email";
    } else {
        let formData = new FormData();
    formData.append('login', email);
    formData.append('password', password);

    fetch('login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('userData', JSON.stringify(data.user)); // Store user data
            window.location.href = "../Home Page/index.html"; // Redirect
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
    }
});

// Registration form validation
registerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    let valid = true;

    if (username === '' || email === '' || password === '') {
        alert('Please fill in all fields');
        valid = false;
    }
    if (!validateEmail(email)) {
        invalidRegEmail.innerText = "Enter a valid email";
        valid = false;
    } else {
        invalidRegEmail.innerText = "";
    }
    if (username.length < 2) {
        spanName.innerText = "Enter a valid name (minimum 2 letters)";
        valid = false;
    } else {
        spanName.innerText = "";
    }
    if (!validatePassword(password)) {
        spanPassword.innerText = "Password must be 8-15 characters, include at least 1 lowercase, 1 uppercase, 1 digit, and 1 special character";
        valid = false;
    } else {
        spanPassword.innerText = "";
    }

    if (valid) {

        let fullName = document.getElementById("register-name").value;
        let email = document.getElementById("register-email").value;
        let mobile = document.getElementById("register-mobile").value;
        let password = document.getElementById("register-password").value;

        if (fullName === '' || email === '' || mobile === '' || password === '') {
            alert('Please fill in all fields');
            return;
        }

        let formData = new FormData();
        formData.append("full_name", fullName);
        formData.append("email", email);
        formData.append("mobile", mobile);
        formData.append("password", password);

        fetch("register.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                if (data.trim() === "success") {
                    alert("Registration successful! Redirecting to login...");
                    window.location.href = "Login and Registration HTML.html"; // Redirect to login
                } else {
                    alert(data); // Show any errors
                }
            })
            .catch(error => console.error("Error:", error));
        alert('Registration successful');
        window.location.href = "../Home Page/index.html"; // Redirect after registration
    }
});

// Email validation function
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Password validation function
function validatePassword(password) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,15}$/.test(password);
}