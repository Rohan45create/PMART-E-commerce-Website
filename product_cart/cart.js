document.addEventListener('DOMContentLoaded', () => {
    updateOrderSummary();
    attachAddToCartHandlers();
    loadCartItems();
});

function attachAddToCartHandlers() {
    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", function () {
            let productId = this.getAttribute("data-product-id");
            
            fetch("../add_to_cart.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `product_id=${productId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Product added to cart successfully!");
                    loadCartItems();
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(error => console.error("Error adding to cart:", error));
        });
    });
}

async function loadCartItems() {
    try {
        const response = await fetch('../fetch_cart.php');
        const data = await response.json();
        const cartContainer = document.querySelector('.cart-products');
        const checkoutSection = document.querySelector('.checkout');
        
        if (!Array.isArray(data.cart)) {
            console.error("Invalid cart data:", data);
            return;
        }
        
        cartContainer.innerHTML = '';
        let subtotal = 0, subactual = 0;
        
        data.cart.forEach(item => {
            const totalPrice = (item.selling_price || 0) * (item.quantity || 0);
            subtotal += totalPrice;
            const actualPrice = (item.actual_price || 0) * (item.quantity || 0);
            subactual += actualPrice;
            
            cartContainer.insertAdjacentHTML('beforeend', getCartItemHTML(item, totalPrice));
        });
        
        updateCheckoutSummary(checkoutSection, subtotal, subactual);
        attachCartEventListeners();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

function getCartItemHTML(item, totalPrice) {
    return `
    <div class="cart-item rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
          <img src="${item.product_image}" class="w-32 h-32 object-cover">

          <label for="counter-input" class="sr-only">Choose quantity:</label>
          <div class="flex items-center justify-between md:order-3 md:justify-end">
            <div class="flex items-center">
              <button type="button" id="decrement-button" data-input-counter-decrement="counter-input" data-product-id="${item.product_id}" class="quantity-down inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100">
                <svg class="h-2.5 w-2.5 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
                </svg>
              </button>
              <input type="text" data-input-counter class="quantity-input w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0" placeholder="" value="${item.quantity}" min="1" required />
              <button type="button" id="increment-button" data-input-counter-decrement="counter-input" data-product-id="${item.product_id}" class="quantity-up inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100">
                <svg class="h-2.5 w-2.5 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                </svg>
              </button>
            </div>
            <div class="text-end md:order-4 md:w-32">
              <p class="text-base font-bold text-gray-900">₹${totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <div class="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
            <a href="../product_details/product_details.php?product_id=${item.product_id}" class="text-base font-medium text-gray-900 hover:underline">${item.product_name}</a>

            <div class="flex items-center gap-4">
              <button type="button" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline" data-product-id=${item.product_id} data-is-favorite="false">
                <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                </svg>
                Add to Favorites
              </button>

              <button type="button" data-product-id="${item.product_id}" class="remove-item inline-flex items-center text-sm font-medium text-red-600 hover:underline">
                <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>`;
}

function updateCheckoutSummary(section, subtotal, subactual) {
    section.querySelector('[data-subtotal]').textContent = `₹${subtotal.toFixed(2)}`;
    section.querySelector('[data-total]').textContent = `₹${subtotal.toFixed(2)}`;
    section.querySelector('[data-savings]').textContent = `-₹${(subactual - subtotal).toFixed(2)}`;
}

function attachCartEventListeners() {
    document.querySelector(".cart-products").addEventListener("click", function (event) {
        const target = event.target;
        const productId = target.dataset.productId;
        
        if (target.classList.contains("remove-item")) {
            removeFromCart(target.dataset.productId);
        } else if (target.classList.contains("quantity-up")) {
            updateCartQuantity(productId, 1);
        } else if (target.classList.contains("quantity-down")) {
            updateCartQuantity(productId, -1);
        }
    });
}

function removeFromCart(productId) {
    // Add proper path to PHP file
    fetch('remove_from_cart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `product_id=${productId}`
    })
    .then(response => response.text())
    .then(text => {
        try {
            const data = JSON.parse(text);
            if (data.success) {
                loadCartItems();  // Remove location.reload()
                updateOrderSummary();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (e) {
            console.error("Failed to parse:", text);
            alert("Server response error - check console");
        }
    })
    .catch(error => console.error('Fetch error:', error));
}

function updateCartQuantity(productId, change) {
    // Get the quantity input field
    const input = document.querySelector(`[data-product-id="${productId}"] + input[data-input-counter]`);
    let quantity = parseInt(input.value) || 1;
    
    // Calculate new quantity with bounds check
    quantity = Math.max(1, quantity + change);
    
    fetch("update_cart.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `product_id=${productId}&quantity=${quantity}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            input.value = quantity; // Update UI immediately
            loadCartItems(); // Refresh totals
        }
    })
    .catch(error => console.error("Error:", error));
}

function updateOrderSummary() {
    fetch('get_cart_summary.php') // Fetch updated cart summary from the server
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelector(".checkout dl:nth-child(1) dd").textContent = `₹${data.original_price.toFixed(2)}`;
                document.querySelector(".checkout dl:nth-child(2) dd").textContent = `-₹${data.savings.toFixed(2)}`;
                document.querySelector(".checkout dl:nth-child(4) dd").textContent = `₹${data.total_price.toFixed(2)}`;
            }
        })
        .catch(error => console.error('Error updating order summary:', error));
}

document.getElementById('proceed-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    window.location.href = '../order_summary/order_summary.html'; // Redirect to checkout page
});
