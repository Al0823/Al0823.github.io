document.addEventListener("DOMContentLoaded", () => {

  const currentPath = window.location.pathname.replace(/^\/+/, "");

  const links = document.querySelectorAll(".navbar a");

  links.forEach(link => {
    const linkPath = link.getAttribute("data-path");

    if (currentPath === linkPath) {

      // Normal nav
      if (!link.closest(".dropdown-content")) {
        link.classList.add("activenav");
      }

      // Dropdown nav
      if (link.closest(".dropdown-content")) {
        link.classList.add("activenav_dropdown");

        // Also highlight dropdown button
        const dropdown = link.closest(".dropdown");
        dropdown.querySelector(".dropbtn")
                .classList.add("activenav");
      }
    }
  });

});
