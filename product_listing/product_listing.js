const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const minInput = document.getElementById("minInput");
const maxInput = document.getElementById("maxInput");
const minValue = document.getElementById("minValue");
const maxValue = document.getElementById("maxValue");
const sliderTrack = document.getElementById("sliderTrack");
let allProducts = [];
let currentFilters = {};

// Add to top of product_listing.js
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('q');

// Modify fetchProducts function
async function fetchProducts() {
    try {
        const endpoint = searchQuery 
            ? `../search.php?q=${encodeURIComponent(searchQuery)}`
            : './fetch_products.php';

        const response = await fetch(endpoint);
        const products = await response.json();
        
        // Show search header if query exists
        if (searchQuery) {
            document.getElementById('search-header').innerHTML = `
                <h2 class="text-xl font-semibold mb-4">
                    Search results for: "${decodeURIComponent(searchQuery)}"
                </h2>
            `;
        }
        
        renderProducts(products);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Slider Functions
function updateSlider(source) {
    let minVal = parseInt(minPrice.value);
    let maxVal = parseInt(maxPrice.value);

    // Validate and clamp values
    minVal = Math.max(0, Math.min(minVal, 829917));
    maxVal = Math.max(0, Math.min(maxVal, 829917));

    // Handle crossover
    if (source === 'min' && minVal > maxVal) {
        maxVal = minVal;
        maxPrice.value = maxVal;
    }
    if (source === 'max' && maxVal < minVal) {
        minVal = maxVal;
        minPrice.value = minVal;
    }

    // Update displays
    minValue.textContent = minVal.toLocaleString('en-IN');
    maxValue.textContent = maxVal.toLocaleString('en-IN');
    minInput.value = minVal;
    maxInput.value = maxVal;

    // Update slider track
    const minPercent = (minVal / 829917) * 100;
    const maxPercent = (maxVal / 829917) * 100;
    sliderTrack.style.left = `${minPercent}%`;
    sliderTrack.style.width = `${maxPercent - minPercent}%`;
}

function syncInputs(source) {
    let minVal = parseInt(minInput.value.replace(/,/g, '')) || 0;
    let maxVal = parseInt(maxInput.value.replace(/,/g, '')) || 829917;

    minVal = Math.max(0, Math.min(minVal, 829917));
    maxVal = Math.max(0, Math.min(maxVal, 829917));

    if (minVal > maxVal) {
        [minVal, maxVal] = [maxVal, minVal];
        if (source === 'min') {
            maxInput.value = maxVal;
        } else {
            minInput.value = minVal;
        }
    }

    minPrice.value = minVal;
    maxPrice.value = maxVal;
    updateSlider(source);
}

// Event Listeners
minPrice.addEventListener("input", () => updateSlider('min'));
maxPrice.addEventListener("input", () => updateSlider('max'));
minInput.addEventListener("input", () => syncInputs('min'));
maxInput.addEventListener("input", () => syncInputs('max'));

// DOM Initialization
document.addEventListener("DOMContentLoaded", function () {
    initializeSliders();
    setupEventListeners();
    fetchProducts();
});

function initializeSliders() {
    maxPrice.value = 829917;
    maxInput.value = 829917;
    updateSlider('max');
}

function setupEventListeners() {
    const sidebar = document.getElementById("sidebar");
    const blackWin = document.querySelector(".black-windows");
    const closeBtn = document.querySelector(".close");
    const filterBtn = document.querySelector(".filter-btn");
    const applyBtn = document.getElementById("applyFilters");
    const clearBtn = document.getElementById("clearFilters");

    // Mobile filter toggle
    filterBtn.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        blackWin.classList.toggle("hidden");
    });

    // Apply filters
    applyBtn.addEventListener("click", applyFilters);

    // Clear filters
    clearBtn.addEventListener("click", clearFilters);

    // Close sidebar
    closeBtn.addEventListener("click", () => {
        sidebar.classList.add("hidden");
        blackWin.classList.add("hidden");
    });

    // Close on outside click
    document.addEventListener("click", (event) => {
        if (!sidebar.contains(event.target) && !filterBtn.contains(event.target)) {
            sidebar.classList.add("hidden");
            blackWin.classList.add("hidden");
        }
    });
}

// Data Functions
async function fetchProducts() {
    try {
        const response = await fetch("./fetch_products.php");
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function applyFilters() {
    if (!allProducts.length) {
        console.error('No products loaded');
        return;
    }

    currentFilters = {
        minPrice: parseInt(minInput.value.replace(/,/g, '')) || 0,
        maxPrice: parseInt(maxInput.value.replace(/,/g, '')) || 829917,
        brands: getCheckedValues('#sidebar [data-filter="brands"] input[type="checkbox"]'),
        categories: getCheckedValues('#sidebar [data-filter="categories"] input[type="checkbox"]'),
        sortBy: document.querySelector('#sidebar select').value,
        discounts: getDiscountValues(),
        availability: document.querySelector('#sidebar input[name="availability"]:checked').value,
    };

    console.log('Active Filters:', currentFilters);

    let filteredProducts = allProducts.filter(product =>
        filterByPrice(product) &&
        filterByBrand(product) &&
        filterByCategory(product) &&
        filterByDiscount(product) &&
        filterByAvailability(product)
    );

    sortProducts(filteredProducts);
    renderProducts(filteredProducts);
    closeSidebar();
}

// Filter Functions
function getCheckedValues(selector) {
    return Array.from(document.querySelectorAll(selector))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => {
            const text = checkbox.closest('label').querySelector('span').textContent;
            return text.trim().toLowerCase();
        });
}

function getDiscountValues() {
    return Array.from(document.querySelectorAll('#sidebar [data-filter="discount"] input[type="checkbox"]'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => {
            const text = checkbox.nextElementSibling.textContent;
            return parseInt(text.match(/\d+/)[0]);
        });
}

function filterByPrice(product) {
    const price = parseFloat(product.selling_price);
    return price >= currentFilters.minPrice && price <= currentFilters.maxPrice;
}

function filterByBrand(product) {
    return currentFilters.brands.length === 0 ||
        currentFilters.brands.includes(product.product_brand.toLowerCase());
}

function filterByCategory(product) {
    return currentFilters.categories.length === 0 ||
        currentFilters.categories.includes(product.product_category.toLowerCase());
}

function filterByDiscount(product) {
    if (currentFilters.discounts.length === 0) return true;
    if (product.actual_price <= 0 || product.selling_price <= 0) return false;
    
    const actual = parseFloat(product.actual_price);
    const selling = parseFloat(product.selling_price);
    const discount = Math.round(((actual - selling) / actual * 100));
    
    return currentFilters.discounts.some(minDiscount => discount >= minDiscount);
}

function filterByAvailability(product) {
    if (currentFilters.availability === 'In Stock') {
        return parseInt(product.stock_quantity) > 0;
    }
    return true;
}

// Sorting Functions
function sortProducts(products) {
    switch (currentFilters.sortBy) {
        case 'High To Low':
            products.sort((a, b) => b.selling_price - a.selling_price);
            break;
        case 'Low To High':
            products.sort((a, b) => a.selling_price - b.selling_price);
            break;
        case 'Newest First':
            products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'Discount':
            products.sort((a, b) => {
                const discountA = calculateDiscount(a) || 0;
                const discountB = calculateDiscount(b) || 0;
                return discountB - discountA;
            });
            break;
    }
}

function calculateDiscount(product) {
    if (product.actual_price <= 0) return 0;
    return ((product.actual_price - product.selling_price) / product.actual_price) * 100;
}

// UI Functions
function renderProducts(products) {
    const productsContainer = document.querySelector(".products");
    productsContainer.innerHTML = products.length === 0 ? getNoProductsHTML() : products.map(createProductCard).join('');
}

function createProductCard(product) {
    const discount = product.actual_price > 0 ? 
        Math.round(((product.actual_price - product.selling_price) / product.actual_price * 100)) : 0;

    return `
        <a href="../product_details/product_details.php?product_id=${product.product_id}" class="product-link">
            <div class="product-card w-full max-w-sm sm:max-w-md md:max-w-lg bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl relative">
                ${getProductBadge(discount)}
                ${getWishlistButton()}
                ${getProductImage(product)}
                ${getProductInfo(product)}
            </div>
        </a>`;
}

function getProductBadge(discount) {
    return discount > 0 ? `
        <span class="dis-badge absolute top-2 left-2 text-sm bg-green-200 text-green-800 px-2 py-1 rounded-full z-10">
            ${discount}% OFF
        </span>` : '';
}

function getWishlistButton() {
    return `
        <label class="add-to-favorite absolute top-2 right-2 cursor-pointer">
            <input type="checkbox" class="hidden peer" />
            <svg class="w-7 h-7 text-gray-400 peer-checked:text-red-500 peer-checked:fill-red-500 transition duration-300"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        </label>`;
}

function getProductImage(product) {
    return `
        <img src="${product.product_image}" alt="${product.product_name}" 
             class="product-image w-full h-auto object-cover rounded-t-xl">`;
}

function getProductInfo(product) {
    return `
        <div class="product-info px-4 py-3 w-full text-left">
            ${getProductBrand(product)}
            ${getProductName(product)}
            ${getProductPricing(product)}
            ${getQuantityControls()}
            ${getAddToCartButton()}
        </div>`;
}

function getProductBrand(product) {
    return `<span class="product-brand text-gray-400 mr-3 uppercase text-xs">${product.product_brand}</span>`;
}

function getProductName(product) {
    return `<p class="product-name text-lg font-bold text-black truncate block capitalize text-left" 
              title="${product.product_name}">${product.product_name}</p>`;
}

function getProductPricing(product) {
    return `
        <div class="product-price flex items-center">
            <p class="selling-price text-lg font-semibold text-black cursor-auto my-3">₹${product.selling_price}</p>
            ${product.actual_price > product.selling_price ? 
                `<del><p class="actual-price text-sm text-gray-600 cursor-auto ml-2">₹${product.actual_price}</p></del>` : ''}
        </div>`;
}

function getQuantityControls() {
    return `
        <div class="quantity-container flex items-center space-x-2">
            <button type="button" class="decrement-button bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded p-3 h-11 focus:ring-2 focus:outline-none">-</button>
            <input type="text" class="quantity-input bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm w-12" value="1" readonly />
            <button type="button" class="increment-button bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded p-3 h-11 focus:ring-2 focus:outline-none">+</button>
        </div>`;
}

function getAddToCartButton() {
    return `
        <button class="add-to-cart cart-btn mt-4 w-full bg-black text-white py-2 rounded-xl shadow-lg hover:bg-gray-800 transition duration-300 cursor-pointer">
            <span class="material-symbols-outlined">shopping_cart</span> Add to Cart
        </button>`;
}

function getNoProductsHTML() {
    return `
        <div class="bg-white">
            <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div class="mx-auto max-w-screen-sm text-center">
                    <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">Not Found</h1>
                    <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">Product is not present on this site</p>
                    <p class="mb-4 text-lg font-light text-gray-500">Sorry, we can't find that page. You'll find lots to explore on the home page.</p>
                    <a href="../Home Page/index.html" class="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">Back to Homepage</a>
                </div>   
            </div>
        </div>`;
}

function clearFilters() {
    // Reset price range
    minPrice.value = 0;
    maxPrice.value = 829917;
    minInput.value = 0;
    maxInput.value = 829917;
    updateSlider('min');

    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset radio buttons
    document.querySelector('input[value="All"]').checked = true;

    // Reset dropdown
    document.querySelector('#sidebar select').selectedIndex = 0;

    // Re-apply filters
    applyFilters();
}

// Search and UI Helpers
function filterCheckboxes(input, type) {
    const searchTerm = input.value.toLowerCase();
    const container = input.closest(`[data-filter="${type}"]`);
    
    container.querySelectorAll(`.visible-${type}, .hidden-${type}`).forEach(section => {
        section.querySelectorAll('label').forEach(label => {
            const text = label.textContent.toLowerCase();
            label.style.display = text.includes(searchTerm) ? 'flex' : 'none';
        });
    });
}

function toggleShowMore(type) {
    const container = document.querySelector(`[data-filter="${type}"]`);
    const hiddenSection = container.querySelector(`.hidden-${type}`);
    const button = container.querySelector(`.show-more-${type}`);
    
    hiddenSection.classList.toggle('hidden');
    button.textContent = hiddenSection.classList.contains('hidden') ? 'Show more' : 'Show less';
}

function closeSidebar() {
    if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.add('hidden');
        document.querySelector('.black-windows').classList.add('hidden');
    }
}