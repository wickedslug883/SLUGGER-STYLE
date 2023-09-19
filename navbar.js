document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navList = document.querySelector(".nav-list");
    const navLinks = document.querySelectorAll(".nav-list li a");
  
    menuToggle.addEventListener("click", () => {
      navList.classList.toggle("active");
    });
  
    // Initialize active box
    const activeBox = document.createElement("div");
    activeBox.classList.add("active-box");
    navLinks[0].classList.add("active");
    navLinks[0].appendChild(activeBox);
  
    // Listen for click events on nav links
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        // Remove the active class and active-box from the previously active link
        document.querySelector(".nav-list li a.active").classList.remove("active");
        const previousActiveBox = document.querySelector(".active-box");
        if (previousActiveBox) {
          previousActiveBox.remove();
        }
  
        // Add the active class and active-box to the clicked link
        this.classList.add("active");
        this.appendChild(activeBox.cloneNode());
      });
    });
  });
  