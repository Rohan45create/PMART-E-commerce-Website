fetch("assets/header.html")
    .then(response => {
        if (!response.ok) throw new Error("Failed to load header");
        return response.text();
    })
    .then(data => {
        document.getElementById("header").innerHTML = data; // Insert HTML completely

        // Wait for DOM update
        setTimeout(() => {
            const hamburgerIcon = document.querySelector("#hamburgerIcon");
            const mobileDropdown = document.querySelector("#mobileDropdown");

            if (hamburgerIcon && mobileDropdown) {
                hamburgerIcon.addEventListener("click", () => {
                    mobileDropdown.classList.toggle("show");
                });
            } else {
                console.error("Elements not found after loading header.");
            }
        }, 100); // Small delay to ensure insertion
    })
    .catch(error => console.error("Error loading header:", error));


fetch('../assets/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-container').innerHTML = data;
    });

fetch('../assets/bottom-nav.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('bottom-navigation').innerHTML = data;
    });