(function navEngine() {

  function waitForReady(callback) {

    // wait for vars.js
    if (!window.vars || !window.vars.DBVAR || !window.vars.PATHVAR) {
      setTimeout(function() { waitForReady(callback); }, 50);
      return;
    }

    // wait for nav container
    var nav = document.getElementById("navList");
    if (!nav) {
      setTimeout(function() { waitForReady(callback); }, 50);
      return;
    }

    callback(nav);
  }

  function loadNav(navContainer) {
    fetch(window.vars.DBVAR + "nav.json")
      .then(function(res) {
        if (!res.ok) throw new Error("nav.json not found");
        return res.json();
      })
      .then(function(data) {

        // sort by sortOrder
        data.sort(function(a, b) {
          return a.sortOrder - b.sortOrder;
        });

        navContainer.innerHTML = buildNav(data);
      })
      .catch(function(err) {
        console.error("Nav error:", err);
        navContainer.innerHTML =
          '<a href="' + window.vars.PATHVAR + 'index.html">Homepage</a>';
      });
  }

  function buildNav(items) {
    var html = "<ul>";

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      // only active items
      if (item.status !== 1) continue;

      html += '<li><a href="' +
              window.vars.PATHVAR + item.url +
              '">' + item.title +
              '</a></li>';
    }

    html += "</ul>";
    return html;
  }

  // start engine
  waitForReady(loadNav);

})();