document.addEventListener("DOMContentLoaded", function() {
  console.log("Home Page script is working!");
  // Your script logic here
});


document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent the default anchor behavior
    // Remove the 'active' class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    // Add the 'active' class to the clicked link
    this.classList.add('active');
  });
});

// Get all the buttons in the filter bar
const filterButtons = document.querySelectorAll('.filters button');

// Add click event listener to each button
filterButtons.forEach(button => {
  button.addEventListener('click', function () {
    // Remove the 'active' class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));

    // Add the 'active' class to the clicked button
    this.classList.add('active');
  });
});


// Select all the heart icons
// Event delegation for all favorite buttons




// Select all label elements
const labels = document.querySelectorAll('.label');

// Function to handle label click
labels.forEach(label => {
  label.addEventListener('click', function () {
    // Remove 'active' class from all labels
    labels.forEach(l => l.classList.remove('active'));
    // Add 'active' class to the clicked label
    this.classList.add('active');
  });
});

// Same header and footer
// Select the hamburger icon and dropdown menu
// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const mobileDropdown = document.querySelector(".mobile-dropdown");
  const backArrow = document.getElementById("back-arrow");

  // Open mobile menu
  hamburgerIcon.addEventListener("click", () => {
    mobileDropdown.classList.add("show");
  });

  // Close mobile menu
  backArrow.addEventListener("click", () => {
    mobileDropdown.classList.remove("show");
  });
});

const redirectPage = document.querySelectorAll(".redirect-all-cat");

redirectPage.forEach(page => {
  page.addEventListener("click", () => {
    window.location.href = "../product_listing/product_listing.html";
  });
});








// for product quantity 
document.addEventListener("click", function (event) {
  let target = event.target;

  if (target.classList.contains("increment-button")) {
    let input = target.closest(".quantity-container").querySelector(".quantity-input");
    if (input) {
      let value = parseInt(input.value, 10) || 1;
      input.value = value + 1;
    }
  }

  if (target.classList.contains("decrement-button")) {
    let input = target.closest(".quantity-container").querySelector(".quantity-input");
    if (input) {
      let value = parseInt(input.value, 10) || 1;
      if (value > 1) {
        input.value = value - 1;
      }
    }
  }
});