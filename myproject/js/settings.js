(function () {
  const storageKey = "site-theme";

  function applyTheme(theme) {
    document.documentElement.classList.remove("theme-light", "theme-dark");
    if (theme === "light") {
      document.documentElement.classList.add("theme-light");
    } else if (theme === "dark") {
      document.documentElement.classList.add("theme-dark");
    }
   
  }

  
  const savedTheme = localStorage.getItem(storageKey);

  if (savedTheme) {
   
    applyTheme(savedTheme);
  } else {
    
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyTheme("dark");
    } else {
      applyTheme("original"); 
    }
  }


  const select = document.getElementById("themeSelect");
  if (select) {
   
    select.value = savedTheme || "original";


    select.addEventListener("change", function () {
      const theme = this.value;
      localStorage.setItem(storageKey, theme); 
      applyTheme(theme);
    });
  }
})();
