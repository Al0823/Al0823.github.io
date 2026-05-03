(function () {
  const storageKey = "site-theme";

  function applyTheme(theme) {
    document.documentElement.classList.remove("theme-light", "theme-dark", "theme-original");
    if (theme === "light" || theme === "dark" || theme === "original") {
      document.documentElement.classList.add("theme-" + theme);
    }
  }

  const savedTheme = localStorage.getItem(storageKey);
  applyTheme(savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "original"));

  function bindSelector() {
    const select = document.getElementById("themeSelect");
    if (!select) return;

    select.value = localStorage.getItem(storageKey) || "original";
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

  document.addEventListener("includesLoaded", bindSelector);

  window.applyTheme = applyTheme;
})();