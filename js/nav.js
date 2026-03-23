(function navEngine() {

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function isLoggedIn() {
    return getCookie("loggedIn") === "true";
  }

  function getRole() {
    return getCookie("role");
  }

  function logout() {
    document.cookie = "loggedIn=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    document.cookie = "user=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    document.cookie = "role=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    window.location.href = window.vars.PATHVAR + "index.html";
  }

  function waitForReady(callback) {

    if (!window.vars || !window.vars.DBVAR || !window.vars.PATHVAR) {
      setTimeout(function() { waitForReady(callback); }, 50);
      return;
    }

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

      if (item.status !== 1) continue;

      html += '<li><a href="' +
              window.vars.PATHVAR + item.url +
              '">' + item.title +
              '</a></li>';
    }

    html += "</ul>";


    var loggedIn = isLoggedIn();
    var role = getRole();
    var user = getCookie("user");

    html += "<div class='auth-nav'>";

    if (loggedIn) {
      html += "<span>" + user + " (" + role + ")</span> | ";
      html += "<a href='#' onclick='(function(){ " + logout.toString() + " })()'>Logout</a>";


      if (role === "admin") {
        html += " | <a href='" + window.vars.DEVVAR + "index.html'>Admin</a>";
      }
} else {
html += "<a href='" + window.vars.PATHVAR + "index.html'>Login</a>";
}
html += "</div>";
return html;
}
waitForReady(loadNav);
})();