(function () {
  const win = window;
  const doc = document;

  function loadInclude(targetId, url, callback) {
    fetch(url)
      .then(res => res.text())
      .then(html => {
        const el = doc.getElementById(targetId);
        if (!el) return callback && callback();

        el.innerHTML = html;

        // Run scripts inside included HTML
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

  function loadIncludes() {
    if (!win.vars || !win.vars.INCVAR) return;

    const base = win.vars.INCVAR;

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
  }

  // slight delay ensures vars.js already loaded
  window.addEventListener("DOMContentLoaded", loadIncludes);
})();