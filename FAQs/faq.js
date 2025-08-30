// Toggle Section (General, Orders, etc.)
function toggleSection(button) {
    const content = button.nextElementSibling;
    content.classList.toggle('hidden');
    const icon = button.querySelector('.material-symbols-outlined');
    icon.textContent = content.classList.contains('hidden') ? 'expand_more' : 'expand_less';
  }

  // Toggle Answer (Individual Question)
  function toggleAnswer(button) {
    const answer = button.nextElementSibling;
    answer.classList.toggle('hidden');
    const icon = button.querySelector('.material-symbols-outlined');
    icon.textContent = answer.classList.contains('hidden') ? 'expand_more' : 'expand_less';
  }