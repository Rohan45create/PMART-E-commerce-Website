document.addEventListener('DOMContentLoaded', () => {
  initializeFavoriteSystem();
  if (window.location.pathname.includes('favorite.html')) {
      loadFavoriteItems();
  }
});

// Unified favorite system
function initializeFavoriteSystem() {
    // Event delegation for all favorite buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-favorite, .remove-favorite');
        if (!btn) return;

        e.preventDefault();
        const productId = btn.dataset.productId;
        
        if (btn.classList.contains('remove-favorite')) {
            handleFavoriteRemoval(productId);
        } else {
            const isFavorite = btn.dataset.isFavorite === 'true';
            toggleFavorite(productId, !isFavorite);
        }
    });

    if (window.location.pathname.includes('favorite.html')) {
        loadFavoriteItems();
    } else {
        updateFavoriteButtonStates();
    }
}

// Improved toggle function
function toggleFavorite(productId, shouldAdd) {
  const endpoint = shouldAdd ? '../add_to_favorite.php' : '../remove_from_favorite.php';
  
  // Optimistic UI update
  const buttons = document.querySelectorAll(`[data-product-id="${productId}"]`);
  buttons.forEach(btn => updateButtonAppearance(btn, shouldAdd));

  fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `product_id=${productId}`
  })
  .then(response => response.json())
  .then(data => {
      if (!data.success) {
          // Revert UI on failure
          buttons.forEach(btn => updateButtonAppearance(btn, !shouldAdd));
          alert(data.message || 'Operation failed');
      }
      if (window.location.pathname.includes('favorite.html')) {
          loadFavoriteItems();
      }
  })
  .catch(error => {
      console.error('Error:', error);
      buttons.forEach(btn => updateButtonAppearance(btn, !shouldAdd));
  });
}

// Universal button appearance updater
function updateButtonAppearance(button, isFavorite) {
  const isRemoveBtn = button.classList.contains('remove-favorite');
  
  if (isRemoveBtn) {
      // Handle remove buttons in favorites list
      button.style.display = isFavorite ? 'flex' : 'none';
      return;
  }

  // Update standard favorite buttons
  button.dataset.isFavorite = isFavorite;
  const checkbox = button.querySelector('input[type="checkbox"]');
  const svg = button.querySelector('svg');
  
  if (checkbox) checkbox.checked = isFavorite;
  if (svg) {
      svg.classList.toggle('!text-red-500', isFavorite);
      svg.classList.toggle('!fill-red-500', isFavorite);
      svg.classList.toggle('text-gray-400', !isFavorite);
  }
}

// Load favorite items with proper data
async function loadFavoriteItems() {
    try {
        const response = await fetch('../fetch_favorite.php');
        const data = await response.json();
      const container = document.querySelector('.favorite-products');
      
      if (!data.success || !Array.isArray(data.favorites)) {
          throw new Error('Invalid favorite data');
      }

      container.innerHTML = data.favorites.map(item => `
          <div class="cart-item rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
              <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                  <img src="${item.product_image}" class="w-32 h-32 object-cover">

                  <div class="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <a href="../product_details/product_details.php?product_id=${item.product_id}" 
                         class="text-base font-medium text-gray-900 hover:underline">
                          ${item.product_name}
                      </a>

                      <div class="flex items-center gap-4">
                          <p class="text-base font-bold text-gray-900">
                              ₹${parseFloat(item.selling_price).toFixed(2)}
                          </p>

                          <button type="button" 
                                  class="add-to-cart inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline">
                              <span class="material-symbols-outlined">add_shopping_cart</span>
                              Add to Cart
                          </button>

                          <button type="button" 
                                  data-product-id="${item.product_id}" 
                                  onclick="handleFavoriteRemoval('${item.product_id}')"
                                  class="remove-favorite inline-flex items-center text-sm font-medium text-red-600 hover:underline">
                              <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" 
                                   width="24" height="24" fill="none" viewBox="0 0 24 24">
                                  <path stroke="currentColor" stroke-linecap="round" 
                                        stroke-linejoin="round" stroke-width="2" 
                                        d="M6 18 17.94 6M18 18 6.06 6"/>
                              </svg>
                              Remove
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      `).join('');

  } catch (error) {
      console.error('Error loading favorites:', error);
  }
}

// Separate removal handler for favorite page
window.handleFavoriteRemoval = async (productId) => {
    try {
        await fetch('../favorite_page/remove_from_favorite.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `product_id=${productId}`
        });
        loadFavoriteItems();
    } catch (error) {
        console.error('Removal error:', error);
        alert('Failed to remove favorite');
    }
};

// Initial favorite states
function updateFavoriteButtonStates() {
  fetch('../fetch_favorite.php')
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          const favoriteIds = data.favorites.map(item => item.product_id.toString());
          document.querySelectorAll('[data-product-id]').forEach(btn => {
              const productId = btn.dataset.productId;
              const isFavorite = favoriteIds.includes(productId);
              updateButtonAppearance(btn, isFavorite);
          });
      }
  })
  .catch(console.error);
}