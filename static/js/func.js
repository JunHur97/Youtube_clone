// public/js/func.js
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleDescription');
    const fullText = document.getElementById('fullDescription');
  
    if (toggleBtn && fullText) {
      toggleBtn.addEventListener('click', () => {
        fullText.classList.toggle('hidden');
        toggleBtn.textContent = fullText.classList.contains('hidden') ? 'SHOW MORE' : 'SHOW LESS';
      });
    }
  });
