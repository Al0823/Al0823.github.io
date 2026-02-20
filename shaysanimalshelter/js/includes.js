(function() {
  const vars = window.vars;
  if (!vars) return;

  function loadInclude(id, file) {
    fetch(vars.INCVAR + file)
      .then(res => res.text())
      .then(html => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
      })
      .catch(console.error);
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadInclude("header", "header.html");
    loadInclude("nav", "nav.html");
    loadInclude("footer", "footer.html");
  });
})();