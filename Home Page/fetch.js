function fetchProducts(category) {
    fetch(`index.php?category=${category}`)
      .then(response => response.json())
      .then(data => {
        let productContainer = document.querySelector(".products");
        productContainer.innerHTML = ""; // Clear existing products
  
        if (data.error) {
          productContainer.innerHTML = `<p class="text-red-500">${data.error}</p>`;
          return;
        }
  
        data.forEach(product => {
          let productHTML = `
          <a href="../product_details/product_details.php?product_id=${product.product_id}" class="product-link">
            <div class="product-card w-full max-w-sm sm:max-w-md md:max-w-lg bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl relative">
                <span class="dis-badge absolute top-2 left-2 text-sm bg-green-200 text-green-800 px-2 py-1 rounded-full z-10">
                    ${Math.round(((product.actual_price - product.selling_price) / product.actual_price) * 100)}% OFF
                </span>
                <!-- Like Button -->
                
                  <label class="add-to-favorite absolute top-2 right-2 cursor-pointer " data-product-id="${product.product_id}" 
                   data-is-favorite="false"> 
                    <input type="checkbox" class="hidden peer" />
                    <svg class="w-7 h-7 text-gray-400 peer-checked:text-red-500 peer-checked:fill-red-500 transition duration-300" 
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
                      <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </label>
                
  
                <img src="${product.product_image}" alt="${product.product_name}" class="product-image w-full h-auto object-cover rounded-t-xl" />
  
                <div class="product-info px-4 py-3 w-full text-left">
                    <span class="product-brand text-gray-400 mr-3 uppercase text-xs">${product.product_brand}</span>
                    <p class="product-name text-lg font-bold text-black truncate block capitalize text-left" title="${product.product_name}">${product.product_name}</p>
                    <div class="product-price flex items-center">
                        <p class="selling-price text-lg font-semibold text-black cursor-auto my-3">₹${product.selling_price}</p>
                        <del><p class="actual-price text-sm text-gray-600 cursor-auto ml-2">₹${product.actual_price}</p></del>
                    </div>
          
                    <div class="quantity-container flex items-center space-x-2">
                        <button type="button" class="decrement-button bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded p-3 h-11 focus:ring-2 focus:outline-none">-</button>
                        <input type="text" class="quantity-input bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm w-12" value="1" readonly />
                        <button type="button" class="increment-button bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded p-3 h-11 focus:ring-2 focus:outline-none">+</button>
                    </div>
  
                    <button class="add-to-cart mt-4 w-full bg-black text-white py-2 rounded-xl shadow-lg hover:bg-gray-800 transition duration-300 cursor-pointer" data-product-id="<?= $product['id'] ?>">
                        <span class="material-symbols-outlined">shopping_cart</span> Add to Cart
                    </button>
                </div>
            </div>
          `;
  
          productContainer.innerHTML += productHTML;
        });
      })
      .catch(error => console.error("Error fetching products:", error));
}

document.querySelectorAll(".add-to-favorite").forEach(label => {
  label.addEventListener("click", function () {
      const checkbox = this.querySelector("input[type='checkbox']");
      checkbox.checked = !checkbox.checked; // Toggle checkbox state
  });
});

// fetch items
document.addEventListener("DOMContentLoaded", function () {
    fetchProducts("shoes"); // Load default category (shoes) on page load
  
    document.querySelectorAll(".filters button").forEach(button => {
      button.addEventListener("click", function () {
        let category = this.value;
        fetchProducts(category);
      });
    });
  });