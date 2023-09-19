document.addEventListener("DOMContentLoaded", () => {
    const tooltipTarget = document.querySelector(".ttip2");
    const tooltipPages = Array.from(document.querySelectorAll(".ttippage"));
    
    let currentPage = 0;
    
    tooltipTarget.addEventListener("click", function() {
      // Hide the current page and reset the 'active' class
      tooltipPages[currentPage].classList.remove("active");
      
      // Move to the next page
      currentPage = (currentPage + 1) % tooltipPages.length;
      
      // Show the new current page and add the 'active' class
      tooltipPages[currentPage].classList.add("active");
    });
    
    tooltipTarget.addEventListener("mouseover", function() {
      this.nextElementSibling.style.visibility = "visible";
      this.nextElementSibling.style.opacity = "1";
    });
    
    tooltipTarget.addEventListener("mouseout", function() {
      this.nextElementSibling.style.visibility = "hidden";
      this.nextElementSibling.style.opacity = "0";
    });
  });
  