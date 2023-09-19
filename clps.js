// Collapsible/Accordion
document.addEventListener("DOMContentLoaded", function() {
    let coll = document.querySelector('.collapsible');
    coll.addEventListener('click', function() {
      this.classList.toggle('active');
      let content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  });