// lang.js — Google Translate init + language persistence

const LANG_KEY = "site-language";

// Called by Google Translate API once its script loads
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: "en",
    includedLanguages: "en,es,fr,de,it,pt,zh-CN,ja,ko,ar,ru",
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, "google_translate_element");

  // Once the widget is ready, apply any saved language and bind the selector
  applySavedLanguage();
  bindLanguageSelector();
}

// Drives Google Translate's hidden internal <select> to switch language
function applyLanguage(langCode) {
  const gtSelect = document.querySelector(".goog-te-combo");
  if (!gtSelect) return;
  gtSelect.value = langCode;
  gtSelect.dispatchEvent(new Event("change"));
  if (langCode !== "en") {
    localStorage.setItem(LANG_KEY, langCode);
  } else {
    localStorage.removeItem(LANG_KEY);
  }
}

function applySavedLanguage() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && saved !== "en") {
    // Small delay to let the GT widget finish rendering its own DOM
    setTimeout(() => applyLanguage(saved), 500);
  }
}

function bindLanguageSelector() {
  const select = document.getElementById("languageSelect");
  if (!select) return;

  // Reflect saved value in the dropdown
  const saved = localStorage.getItem(LANG_KEY) || "en";
  select.value = saved;

  select.addEventListener("change", function () {
    applyLanguage(this.value);
  });
}

// Re-bind after includes are injected (in case languageSelect is inside an include)
document.addEventListener("includesLoaded", bindLanguageSelector);

window.applyLanguage = applyLanguage;