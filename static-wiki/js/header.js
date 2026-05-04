    window.vars.WEBSITETITLE = "A.t.A. Tech Wiki";
    function updatePageTitle() {
      const pageTitle = typeof PAGETITLE !== "undefined" ? PAGETITLE : "";
      const fullTitle = window.vars.WEBSITETITLE + (pageTitle ? " - " + pageTitle : "");

      document.title = fullTitle;

      const titleEl = document.getElementById("pageTitle");
      if (titleEl) titleEl.textContent = fullTitle;
    }

    if (window.vars.CSSVAR) {
      const mainLink = document.getElementById("mainStylesheet");
      mainLink.href = /*window.vars.CSSVAR +*/ "/css/style.css?v=1.2";
    }