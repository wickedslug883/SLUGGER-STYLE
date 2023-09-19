document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
  
    cards.forEach((card) => {
      if (card.querySelector('.card-back')) {
        card.addEventListener('click', function() {
          card.style.transform = card.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
        });
      }
    });
  });
  