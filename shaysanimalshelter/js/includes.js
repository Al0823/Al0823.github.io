(function () {

  var win = window;
  var doc = document;

  function loadInclude(targetId, url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {

        var el = doc.getElementById(targetId);
        if (!el) {
          if (callback) callback();
          return;
        }

        if (xhr.status === 200) {
          el.innerHTML = xhr.responseText;

          var scripts = el.getElementsByTagName("script");

          for (var i = 0; i < scripts.length; i++) {
            var oldScript = scripts[i];
            var newScript = doc.createElement("script");

            if (oldScript.text) {
              newScript.text = oldScript.text;
            }

            doc.body.appendChild(newScript);
          }
        }

        if (callback) callback();
      }
    };

    xhr.send(null);
  }

  function loadIncludes() {

    if (!win.vars || !win.vars.INCVAR) return;

    var base = win.vars.INCVAR;
    var siteTitle = win.vars.WEBSITETITLE;

    var includes = [
      ["header", base + "header.html"],
      ["nav", base + "nav.html"],
      ["footer", base + "footer.html"]
    ];

    var i = 0;

    function next() {
      if (i >= includes.length) {
        return;
      }

      var item = includes[i];
      i++;

      loadInclude(item[0], item[1], next);
    }

    next();

    if (window.PAGETITLE) {
      document.title = siteTitle + " - " + window.PAGETITLE;
    } else {
      document.title = siteTitle;
    }
  }

  if (document.readyState === "loading") {
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", loadIncludes);
    } else {
      window.onload = loadIncludes;
    }
  } else {
    loadIncludes();
  }

})();