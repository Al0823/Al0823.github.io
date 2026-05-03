(function () {
  const storageKey = "site-theme";

  function applyTheme(theme) {
    document.documentElement.classList.remove("theme-light", "theme-dark", "theme-original");
    if (theme === "light" || theme === "dark" || theme === "original") {
      document.documentElement.classList.add("theme-" + theme);
    }
  }

  // Run immediately (before paint) to avoid flash
  const savedTheme = localStorage.getItem(storageKey);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "original");
  }

  // Wire up the selector once the DOM is ready
  function bindSelector() {
    const select = document.getElementById("themeSelect");
    if (!select) return;
    const current = localStorage.getItem(storageKey) || "original";
    select.value = current;
    select.addEventListener("change", function () {
      localStorage.setItem(storageKey, this.value);
      applyTheme(this.value);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindSelector);
  } else {
    bindSelector();
  }

  // Re-bind after includes are injected (include.js fires this event)
  document.addEventListener("includesLoaded", bindSelector);

  window.applyTheme = applyTheme;
})();