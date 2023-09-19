document.addEventListener("DOMContentLoaded", function() {
    let currentIndex = 0;
    let startX = 0;
    let mouseDownX = 0;
    let isDragging = false;
  
    const carouselTrack = document.querySelector('.carotrack2');
    const carouselItems = Array.from(carouselTrack.children);
  
    const updateSelectedClass = () => {
        carouselItems.forEach((item, index) => {
          item.classList.remove('selected');
        });
        carouselItems[(currentIndex + 1) % carouselItems.length].classList.add('selected');
      };
    
      const setCarouselTransform = (index) => {
        currentIndex = (index + carouselItems.length) % carouselItems.length;
        const offset = -(carouselItems[0].clientWidth * currentIndex);
        carouselTrack.style.transform = `translateX(${offset}px)`;
        updateSelectedClass();
      };
  
    const onTouchStart = (e) => {
        startX = e.touches[0].clientX;
      };
    
      const onTouchMove = (e) => {
        const currentX = e.touches[0].clientX;
        const dx = currentX - startX;
    
      
        if (dx > 50) {
          currentIndex--;
          setCarouselTransform(currentIndex);
          carouselTrack.removeEventListener('touchmove', onTouchMove);
        } else if (dx < -50) {
          currentIndex++;
          setCarouselTransform(currentIndex);
          carouselTrack.removeEventListener('touchmove', onTouchMove);
        }
      };
    
      const onMouseDown = (e) => {
          e.preventDefault();
          isDragging = true;
          mouseDownX = e.clientX;
          carouselTrack.style.cursor = 'grabbing';
        };
        
      const onMouseMove = (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const dx = currentX - mouseDownX;
    
        if (dx > 50) {
          currentIndex--;
          setCarouselTransform(currentIndex);
          isDragging = false;
        } else if (dx < -50) {
          currentIndex++;
          setCarouselTransform(currentIndex);
          isDragging = false;
        }
      };
    
      const onMouseUp = () => {
          isDragging = false;
          carouselTrack.style.cursor = 'default';
        };
        carouselTrack.addEventListener('touchstart', onTouchStart);
        carouselTrack.addEventListener('touchmove', onTouchMove);
      
        carouselTrack.addEventListener('mousedown', onMouseDown);
        carouselTrack.addEventListener('mousemove', onMouseMove);
        carouselTrack.addEventListener('mouseup', onMouseUp);
        carouselTrack.addEventListener('mouseleave', onMouseUp);
    setCarouselTransform(currentIndex);
  });
  