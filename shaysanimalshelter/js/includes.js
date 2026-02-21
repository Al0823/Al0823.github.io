(function () {
  const win = window;
  const doc = document;

  // --- Load a single include ---
  function loadInclude(targetId, url, callback) {
    fetch(url)
      .then(res => res.text())
      .then(html => {
        const el = doc.getElementById(targetId);
        if (!el) return callback && callback();

        el.innerHTML = html;

        // Run any scripts inside the included HTML
        el.querySelectorAll("script").forEach(oldScript => {
          const newScript = doc.createElement("script");
          newScript.textContent = oldScript.textContent;
          doc.body.appendChild(newScript);
          oldScript.remove();
        });

        callback && callback();
      })
      .catch(() => callback && callback());
  }

  // --- Load all includes in order ---
  function loadIncludes() {
    if (!win.vars || !win.vars.INCVAR) return;

    const base = win.vars.INCVAR;
    const siteTitle = win.vars.WEBSITETITLE;

    const includes = [
      ["header", base + "header.html"],
      ["nav", base + "nav.html"],
      ["footer", base + "footer.html"]
    ];

    let i = 0;
    function next() {
      if (i >= includes.length) return;
      const [id, url] = includes[i++];
      loadInclude(id, url, next);
    }

    next();

    // --- Set page title dynamically: WEBSITETITLE - PAGETITLE ---
    if (window.PAGETITLE) {
      document.title = siteTitle + " - " + window.PAGETITLE;
    } else {
      document.title = siteTitle;
    }
  }

  // --- Start loading after DOM is ready ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadIncludes);
  } else {
    loadIncludes();
  }
})();