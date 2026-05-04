    /*window.vars.WEBSITETITLE = "A.t.A. Tech Wiki";
    function updatePageTitle() {
      const pageTitle = typeof PAGETITLE !== "undefined" ? PAGETITLE : "";
      const fullTitle = window.vars.WEBSITETITLE + (pageTitle ? " - " + pageTitle : "");

      document.title = fullTitle;

      const titleEl = document.getElementById("pageTitle");
      if (titleEl) titleEl.textContent = fullTitle;
    }


if (window.vars && window.vars.CSSVAR) {
      const mainLink = document.getElementById("mainStylesheet");
      mainLink.href = window.vars.CSSVAR + "style.css?v=1.2";
    }
			*/

document.addEventListener("DOMContentLoaded", () => {
  if (!window.vars) {
    console.error("window.vars not loaded");
    return;
  }

  window.vars.WEBSITETITLE = "A.t.A. Tech Wiki";

  function updatePageTitle() {
    const pageTitle = typeof PAGETITLE !== "undefined" ? PAGETITLE : "";
    const fullTitle = window.vars.WEBSITETITLE + (pageTitle ? " - " + pageTitle : "");

    document.title = fullTitle;

    const titleEl = document.getElementById("pageTitle");
    if (titleEl) titleEl.textContent = fullTitle;
  }

  window.updatePageTitle = updatePageTitle;

  if (window.vars.CSSVAR) {
    const mainLink = document.getElementById("mainStylesheet");
    if (mainLink) {
      mainLink.href = window.vars.CSSVAR + "style.css?v=1.2";
    }
  }
});