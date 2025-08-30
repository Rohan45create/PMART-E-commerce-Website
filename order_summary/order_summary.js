document.addEventListener('DOMContentLoaded', function() {
    // Fetch cart items and populate order summary
    fetch('../fetch_cart.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateProducts(data.cart);
                calculateTotals(data.cart);
            }
        })
        .catch(error => console.error('Error:', error));

    // Populate product cards
    function populateProducts(cartItems) {
        const tbody = document.querySelector('.summary-products');
        tbody.innerHTML = '';

        cartItems.forEach(item => {
            const totalPrice = parseFloat(item.selling_price) * parseInt(item.quantity);
            
            const tr = document.createElement('tr');
            tr.className = 'summary-products-card';
            tr.innerHTML = `
                <td class="py-4 whitespace-nowrap md:w-[384px]">
                    <div class="flex items-center gap-4">
                        <a href="#" class="flex aspect-square h-10 w-10 shrink-0 items-center">
                            <img class="h-auto max-h-full w-auto"
                                src="${item.product_image}"
                                alt="${item.product_name}" /> 
                            <img class="hidden h-auto max-h-full w-full"
                                src="${item.product_image}"
                                alt="${item.product_name}" />
                        </a>
                        <a href="../product_details/product_details.php?product_id=${item.product_id}" class="hover:underline truncate">${item.product_name}</a>
                    </div>
                </td>

                <td class="p-4 text-base font-normal text-gray-900">x${item.quantity}</td>

                <td class="p-4 text-right text-base font-bold text-gray-900">
                    ₹${totalPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Calculate and update order totals
    function calculateTotals(cartItems) {
        let originalTotal = 0;
        let subtotal = 0;
        let totalSavings = 0;

        cartItems.forEach(item => {
            const actual = parseFloat(item.actual_price);
            const selling = parseFloat(item.selling_price);
            const qty = parseInt(item.quantity);
            
            originalTotal += actual * qty;
            subtotal += selling * qty;
            totalSavings += (actual - selling) * qty;
        });

        const discountPercentage = originalTotal > 0 
        ? (totalSavings / originalTotal) * 100 
        : 0;

        // Update DOM elements
        updateTotal('Original price', originalTotal);
        updateTotal('Savings', totalSavings, true);
        updateTotal('Shipping', 0, false, true);
        updateTotal('Discount', discountPercentage, false, false, true);
        updateTotal('Total', subtotal);
    }

    // Helper function to update total values
    function updateTotal(label, value, isNegative = false, isShipping = false, isPercentage = false) {
        const dtElements = document.querySelectorAll('dt');
        const targetDt = Array.from(dtElements).find(dt => dt.textContent.trim() === label);
        
        if (targetDt) {
            const ddElement = targetDt.nextElementSibling;
            if (!ddElement) return; // Ensure ddElement exists before updating

            let formattedValue;
            
            if (isShipping) {
                formattedValue = value === 0 ? '₹0 (free)' : `₹${value.toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
            } else if (isPercentage) {
                formattedValue = `${value.toFixed(2)}%`;
                document.querySelector(".discount").innerText = formattedValue;
            } else {
                formattedValue = `₹${Math.abs(value).toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
                if (isNegative) formattedValue = `-${formattedValue}`;
            }
            
            ddElement.textContent = formattedValue;
        }
    }

    document.querySelector('.proceed-button').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        window.location.href = '../checkout/checkout.html'; // Redirect to checkout page
    });
});
