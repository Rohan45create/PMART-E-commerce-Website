document.querySelectorAll('.size-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.classList.remove('bg-black', 'text-white');
      btn.classList.add('border-gray-400');
    });
    button.classList.add('bg-black', 'text-white');
  });
});

document.querySelectorAll('.quantity-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    let input = e.target.parentNode.querySelector('input');
    let value = parseInt(input.value);
    if (e.target.innerText === '-' && value > 1) {
      input.value = value - 1;
    } else if (e.target.innerText === '+') {
      input.value = value + 1;
    }
  });
});

console.log(typeof handleBuyNow);
window.onload = function() {
  window.handleBuyNow = function(productId) {
      fetch('clear_cart_for_direct_order.php')
          .then(() => {
              return fetch('../add_to_cart.php', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ product_id: productId, quantity: 1 })
              });
          })
          .then(() => {
              window.location.href = '../order_summary/order_summary.html';
          })
          .catch(error => console.error('Error:', error));
  };
};

