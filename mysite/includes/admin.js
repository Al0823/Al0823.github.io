document.addEventListener("DOMContentLoaded", () => {

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Load admin navbar if enabled
  if (isAdmin) {
    fetch("/includes/adminnavbar.html")
      .then(res => res.text())
      .then(html => {
        document.getElementById("adminNav").innerHTML = html;
      });
  }

});

function enableAdmin() {
  localStorage.setItem("isAdmin", "true");
  location.reload();
}

function disableAdmin() {
  localStorage.removeItem("isAdmin");
  location.reload();
}
