// JavaScript for interactive star rating
const stars = document.querySelectorAll(".star");
let selectedRating = 0;

stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    selectedRating = index + 1; // Get the rating value (1 to 5)
    updateStarDisplay(selectedRating);
  });

  star.addEventListener("mouseover", () => {
    updateStarDisplay(index + 1); // Highlight stars on hover
  });

  star.addEventListener("mouseout", () => {
    updateStarDisplay(selectedRating); // Reset to selected rating
  });
});

function updateStarDisplay(rating) {
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("text-yellow-400"); // Highlight selected stars
      star.classList.remove("text-gray-400");
    } else {
      star.classList.add("text-gray-400"); // Reset unselected stars
      star.classList.remove("text-yellow-400");
    }
  });
}

function submitFeedback(e) {
  e.preventDefault();
  
  const form = document.getElementById('feedbackForm');
  const formData = {
    name: form.querySelector('input[type="text"]').value,
    email: form.querySelector('input[type="email"]').value,
    feedback: form.querySelector('textarea').value,
    rating: document.querySelector('.star.active')?.dataset.value || null
  };

  fetch('save_feedback.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(async response => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Invalid JSON response');
    }
  })
  .then(data => {
    if (data.success) {
      alert('Feedback submitted!');
      form.reset();
      document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
    } else {
      alert('Error: ' + (data.error || 'Unknown error'));
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to submit feedback. Please try again.');
  });
}

// Star rating interaction
// Update star initialization
document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('click', function() {
      const value = parseInt(this.dataset.value);
      document.querySelectorAll('.star').forEach((s, idx) => {
          s.classList.toggle('active', idx < value);
          s.classList.toggle('selected', idx < value);
      });
      document.getElementById('hiddenRating').value = value;
  });
});