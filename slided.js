document.addEventListener("DOMContentLoaded", function() {
    const slideInElements = document.querySelectorAll('.slide-in');
  
    const checkSlideIn = () => {
      slideInElements.forEach(el => {
        const slideInAt = (window.scrollY + window.innerHeight) - el.clientHeight / 2;
        const isHalfShown = slideInAt > el.offsetTop;
        if (isHalfShown) {
          el.classList.add('slide-in-active');
        }
      });
    };
  
    window.addEventListener('scroll', checkSlideIn);
  });
  