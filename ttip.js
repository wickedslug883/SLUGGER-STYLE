document.addEventListener("DOMContentLoaded", () => {
    const tooltipTargets = document.querySelectorAll(".tooltip-target");
  
    tooltipTargets.forEach((target) => {
      target.addEventListener("mouseover", function() {
        this.nextElementSibling.style.visibility = "visible";
        this.nextElementSibling.style.opacity = "1";
      });
      
      target.addEventListener("mouseout", function() {
        this.nextElementSibling.style.visibility = "hidden";
        this.nextElementSibling.style.opacity = "0";
      });
  
      // Optional: show tooltip on focus and click
      target.addEventListener("focus", function() {
        this.nextElementSibling.style.visibility = "visible";
        this.nextElementSibling.style.opacity = "1";
      });
      target.addEventListener("blur", function() {
        this.nextElementSibling.style.visibility = "hidden";
        this.nextElementSibling.style.opacity = "0";
      });
    });
  });
  