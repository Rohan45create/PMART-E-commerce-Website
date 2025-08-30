document.addEventListener('DOMContentLoaded', function () {
    // Indian States and Cities Data
    const indiaLocations = {
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Chhatrapati Sambhajinagar"],
        "Delhi": ["New Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"],
        "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"],
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad"]
    };

    // DOM Elements
    const stateSelect = document.getElementById('select-state');
    const citySelect = document.getElementById('select-city');
    const paymentRadios = document.querySelectorAll("input[name='payment-method']");
    const cardForm = document.querySelector(".card-payment");
    const upiInput = document.querySelector(".upi-payment");
    const mainForm = document.querySelector('form');

    // Initialize Application
    initializeLocationSelectors();
    initializePaymentHandling();
    initializeOrderSummary();
    initializeConfirmationModal();

    // ========== INITIALIZATION FUNCTIONS ========== //

    function initializeLocationSelectors() {
        if (!stateSelect || !citySelect) {
            console.error('State or City select elements not found');
            return;
        }
        // Populate States
        Object.keys(indiaLocations).forEach(state => {
            stateSelect.add(new Option(state, state));
        });
        stateSelect.addEventListener('change', updateCities);
        stateSelect.dispatchEvent(new Event('change'));
    }

    function updateCities() {
        citySelect.innerHTML = '';
        indiaLocations[this.value].forEach(city => {
            citySelect.add(new Option(city, city));
        });
    }

    function initializePaymentHandling() {
        if (!paymentRadios.length || !cardForm || !upiInput) {
            console.error('Payment elements not found');
            return;
        }

        paymentRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                togglePaymentForm();
                toggleFieldRequirements();
            });
        });
        togglePaymentForm();
        toggleFieldRequirements();
    }

    function initializeOrderSummary() {
        try {
            fetch('../fetch_cart.php')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        updateOrderSummary(calculateTotals(data.cart));
                    }
                })
                .catch(error => console.error("Cart load error:", error));
        } catch (error) {
            console.error("Order summary init error:", error);
        }
    }


    function initializeConfirmationModal() {
        const modalHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden" id="confirmationModal">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <h3 class="text-2xl font-bold mb-4">Confirm Payment</h3>
                        <p class="text-gray-600 mb-6">Total Amount: ₹<span id="modalTotalAmount"></span></p>
                        <div class="flex justify-end gap-4">
                            <button id="cancelPayment" type="button" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button id="confirmPayment" type="button" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                Confirm Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        mainForm.addEventListener('submit', handleFormSubmit);
    }

    // ========== CORE FUNCTIONALITY ========== //

    function togglePaymentForm() {
        const method = document.querySelector("input[name='payment-method']:checked").id;
        const paymentSections = {
            'credit-card': cardForm,
            'paypal-2': upiInput,
            'pay-on-delivery': null
        };

        // Hide all payment sections first
        Object.values(paymentSections).forEach(section => {
            if (section) section.style.display = 'none';
        });

        // Show selected payment section
        if (paymentSections[method]) {
            paymentSections[method].style.display = 'block';
        }
    }

    function toggleFieldRequirements() {
        const method = document.querySelector("input[name='payment-method']:checked").id;
        const cardFields = cardForm.querySelectorAll('[required]');

        cardFields.forEach(field => {
            field.required = method === 'credit-card';
            field.closest('.card-payment').style.display = method === 'credit-card' ? 'block' : 'none';
        });

        if (upiInput) {
            upiInput.required = method === 'paypal-2';
            upiInput.style.display = method === 'paypal-2' ? 'block' : 'none';
        }
    }

    function calculateTotals(cartItems) {
        return cartItems.reduce((acc, item) => ({
            subtotal: acc.subtotal + (parseFloat(item.selling_price) * parseInt(item.quantity)),
            savings: acc.savings + (parseFloat(item.actual_price) - parseFloat(item.selling_price)) * parseInt(item.quantity)
        }), {
            subtotal: 0,
            savings: 0
        });
    }

    function updateOrderSummary({
        subtotal,
        savings
    }) {
        const format = value => value.toLocaleString('en-IN', {
            maximumFractionDigits: 2
        });

        // Use data attributes for element selection
        document.querySelector('[data-summary="subtotal"]').textContent = `₹${format(subtotal)}`;
        document.querySelector('[data-summary="savings"]').textContent = `-₹${format(savings)}`;
        document.querySelector('[data-summary="total"]').textContent = `₹${format(subtotal)}`;
    }


    async function handleFormSubmit(e) {
        e.preventDefault();

        if (!validateForm()) return;
        showConfirmationModal();
    }

    function validateForm() {
        let isValid = true;
        const visibleFields = Array.from(mainForm.elements).filter(el =>
            el.offsetParent !== null && el.required
        );

        visibleFields.forEach(field => {
            if (!field.checkValidity()) {
                field.reportValidity();
                isValid = false;
            }
        });

        return isValid;
    }

    function showConfirmationModal() {
        const modal = document.getElementById('confirmationModal');
        const totalElement = document.querySelector('[data-summary="total"]');

        if (!totalElement) {
            console.error("Error: Total element not found");
            return;
        }

        const totalAmount = totalElement.textContent;
        if (!totalAmount) {
            console.error("Error: Total amount not found");
            return;
        }

        document.getElementById('modalTotalAmount').textContent = totalAmount.replace('₹', '');
        modal.classList.remove('hidden');

        // Handle modal actions
        document.getElementById('cancelPayment').onclick = () => modal.classList.add('hidden');
        document.getElementById('confirmPayment').onclick = processOrder;
    }


    async function processOrder() {
        try {
            const [cartData, orderData] = await Promise.all([
                fetchCartData(),
                prepareOrderData(),
            ]);

            const result = await submitOrder(orderData);
            showSuccessMessage(result.order_id);
            clearCart(orderData.user_id);

        } catch (error) {
            handleError(error);
        }
    }

    async function fetchCartData() {
        const response = await fetch('../fetch_cart.php');
        const data = await response.json();
        if (!data.success || !data.cart.length) throw new Error('Your cart is empty');
        return data;
    }

    async function prepareOrderData() {
        const cartData = await fetchCartData();

        // Add null-safe element access
        const getElementValue = (id) => {
            const el = document.getElementById(id);
            if (!el) {
                console.error(`Element with ID ${id} not found`);
                return '';
            }
            return el.value;
        };

        return {
            user_id: cartData.cart[0].user_id,
            products: cartData.cart.map(item => ({
                product_id: item.product_id,
                quantity: parseInt(item.quantity),
                price: parseFloat(item.selling_price)
            })),
            delivery_address: {
                name: getElementValue('receiver_name'), // Changed from 'your_name'
                phone: '+91' + getElementValue('phone-input'),
                state: getElementValue('select-state'),
                city: getElementValue('select-city'),
                line1: getElementValue('address-line-1'),
                line2: getElementValue('address-line-2'),
                zip: getElementValue('zip-code')
            },
            payment_method: document.querySelector("input[name='payment-method']:checked") ?
                document.querySelector("input[name='payment-method']:checked").id :
                'unknown',
            totals: calculateTotals(cartData.cart),
            clear_cart: true

        };
    }
    async function submitOrder(orderData) {
        const response = await fetch('create_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Order failed');
        return result;
    }

    async function clearCart(userId) {
        await fetch('../clear_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId
            })
        });
    }

    function showSuccessMessage(orderId) {
        if (!mainForm) {
            console.error('Main form element not found');
            return;
        }

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 4);

        mainForm.innerHTML = `
            <div class="text-center py-16">
                <div class="inline-block bg-green-100 rounded-full p-4 mb-6">
                    <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Order Successful!</h2>
                <p class="text-gray-600 mb-2">Your payment has been processed.</p>
                <p class="text-gray-600">Expected delivery: ${deliveryDate.toLocaleDateString('en-IN', { 
                    weekday: 'long', day: 'numeric', month: 'long' 
                })}</p>
                <p class="mt-6 text-gray-600">Order ID: <span class="font-mono">${orderId}</span></p>
            </div>
        `;
    }

    function handleError(error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
        document.getElementById('confirmationModal').classList.add('hidden');
    }
});