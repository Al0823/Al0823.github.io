  (function loadNav() {
    const navContainer = document.getElementById("navList");
    if (!navContainer) return;


    fetch(window.vars.DBVAR + "nav.json")
      .then(response => {
        if (!response.ok) throw new Error("Nav JSON not found");
        return response.json();
      })
      .then(data => {
        navContainer.innerHTML = buildNavHTML(data);
      })
      .catch(err => {
        console.error("Failed to load nav.json:", err);
        navContainer.innerHTML = '<a href="' + window.vars.PATHVAR + 'index.html">Homepage</a>';
      });


    function buildNavHTML(items) {
      let html = "<ul>";
      items.forEach(item => {
        html += `<li><a href="${item.url}">${item.title}</a>`;
        if (item.children) {
          html += "<ul>";
          item.children.forEach(child => {
            html += `<li><a href="${child.url}">${child.title}</a></li>`;
          });
          html += "</ul>";
        }
        html += "</li>";
      });
      html += "</ul>";
      return html;
    }
  })();