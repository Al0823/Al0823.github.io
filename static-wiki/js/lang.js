const LANG_KEY = "site-language";

function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: "en",
    includedLanguages: "en,es,fr,de,it,pt,zh-CN,ja,ko,ar,ru",
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, "google_translate_element");

  applySavedLanguage();

  bindLanguageSelector();
}

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
    setTimeout(() => applyLanguage(saved), 500);
  }
}

function bindLanguageSelector() {
  const select = document.getElementById("languageSelect");
  if (!select) return;

  const saved = localStorage.getItem(LANG_KEY) || "en";
  select.value = saved;

  select.addEventListener("change", function () {
    applyLanguage(this.value);
  });
}

document.addEventListener("includesLoaded", bindLanguageSelector);

window.applyLanguage = applyLanguage;