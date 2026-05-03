(function () {
  // ===== LANGUAGE SETTINGS =====
  const langSelect = document.getElementById("languageSelect");
  const langStorageKey = "site-language";

  function setGoogleTranslateCookie(lang) {
    document.cookie = "googtrans=/en/" + lang + ";path=/";
  }

  if (langSelect) {
    const savedLang = localStorage.getItem(langStorageKey);

    if (savedLang) {
      langSelect.value = savedLang;
    }

    setGoogleTranslateCookie(langSelect.value);

    langSelect.addEventListener("change", function () {
      const lang = this.value;
      localStorage.setItem(langStorageKey, lang);
      setGoogleTranslateCookie(lang);
      alert("Language saved! Refresh the page or navigate to apply site-wide.");
    });
  }

  // ===== THEME SETTINGS =====
  const themeSelect = document.getElementById("themeSelect");
  const themeStorageKey = "site-theme";

  function applyTheme(theme) {
    const root = document.documentElement;

    // always reset first
    root.classList.remove("theme-light", "theme-dark");

    if (theme === "light") {
      root.classList.add("theme-light");
    }

    if (theme === "dark") {
      root.classList.add("theme-dark");
    }

    // "original" = no class applied
  }

  function getInitialTheme() {
    const saved = localStorage.getItem(themeStorageKey);

    if (saved) return saved;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "original";
  }

  const initialTheme = getInitialTheme();

  applyTheme(initialTheme);

  if (themeSelect) {
    themeSelect.value = initialTheme;

    themeSelect.addEventListener("change", function () {
      const theme = this.value;
      localStorage.setItem(themeStorageKey, theme);
      applyTheme(theme);
    });
  }
})();