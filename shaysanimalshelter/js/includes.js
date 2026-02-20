// js/includes.js
(function() {
  const vars = window.vars;
  if (!vars) return;

  function loadInclude(id, file) {
    console.log("Loading include:", file); // debug
    fetch(vars.INCVAR + file)
      .then(res => {
        if (!res.ok) throw new Error(res.status + " " + res.statusText);
        return res.text();
      })
      .then(html => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
        else console.error("No element with id:", id);
      })
      .catch(err => console.error("Include load error:", file, err));
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadInclude("header", "header.html");
    loadInclude("nav", "nav.html");
    loadInclude("footer", "footer.html");
  });
})();