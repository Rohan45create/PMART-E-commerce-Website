document.addEventListener("DOMContentLoaded", function () {
    function handleSearch() {
        const searchInput = this.closest(".search").querySelector(".search-input");
        const searchQuery = searchInput.value.trim();

        if (searchQuery === "") {
            alert("Please enter a search term.");
            return;
        }

        // Store the search term in sessionStorage to persist it
        sessionStorage.setItem("searchQuery", searchQuery);

        if (window.location.pathname.includes("product_listing.html")) {
            fetchAndDisplayResults(); // Directly update results without reloading
        } else {
            window.location.href = "../product_listing/product_listing.html?q=" + encodeURIComponent(searchQuery);
        }
    }

    // Attach event listeners to search inputs and icons
    document.querySelectorAll(".search-icon").forEach(icon => {
        icon.addEventListener("click", handleSearch);
    });

    document.querySelectorAll(".search-input").forEach(input => {
        input.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                handleSearch.call(this);
            }
        });
    });
});
