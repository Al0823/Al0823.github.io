<script>
(function loadNav() {

  function init() {
    const navContainer = document.getElementById("navList");
    if (!navContainer) {
      setTimeout(init, 50);
      return;
    }

    fetch(window.vars.DBVAR + "nav.json")
      .then(response => {
        if (!response.ok) throw new Error("Nav JSON not found");
        return response.json();
      })
      .then(data => {
        // sort by sortOrder
        data.sort((a, b) => a.sortOrder - b.sortOrder);

        navContainer.innerHTML = buildNavHTML(data);
      })
      .catch(err => {
        console.error("Nav load failed:", err);
        navContainer.innerHTML =
          '<a href="' + window.vars.PATHVAR + 'index.html">Homepage</a>';
      });
  }

  function buildNavHTML(items) {
    let html = "<ul>";

    items.forEach(item => {
      if (item.status !== 1) return;

      html += `<li><a href="${window.vars.PATHVAR + item.url}">${item.title}</a></li>`;
    });

    html += "</ul>";
    return html;
  }

  init();

})();
</script>