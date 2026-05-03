document.addEventListener("DOMContentLoaded", () => {

  const jsDebugDiv = document.getElementById("js-debug");
  const cssDebugDiv = document.getElementById("css-debug");

const debugVarNames = [
 "vars.PATHVAR",
  "vars.CSSVAR",
  "vars.INCVAR",
  "vars.DBVAR",
  "vars.JSVAR",
"vars.UTILVAR",
"vars.SECRETVAR",
"vars.ASSETSVAR",
  "vars.DEBUGVAR",
  "vars.WEBSITETITLE",
"localStorage.site-language",
  "localStorage.site-theme",
  "document.documentElement.classList.value",
  "screen.width",
  "screen.height"
];

function getValue(path) {
  // Handle localStorage specially
  if (path.startsWith("localStorage.")) {
    const key = path.split(".")[1];
    return localStorage.getItem(key);
  }

  return path.split(".").reduce((obj, key) => obj?.[key], window);
}

function updateJSDebug() {
  jsDebugDiv.innerHTML = debugVarNames
    .map((name, i) => {
      let value;

      try {
        value = getValue(name);
      } catch {
        value = "undefined";
      }

      return `${i}, <b>${name}</b> = ${value}`;
    })
    .join("<br><br><hr><br>");
}

  updateJSDebug();

  function getAllCSSVars() {
    const vars = [];

    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText === ":root") {
            for (const prop of rule.style) {
              if (prop.startsWith("--")) {
                vars.push(prop);
              }
            }
          }
        }
      } catch (e) {}
    }

    return vars;
  }

  const allVars = getAllCSSVars();

  cssDebugDiv.innerHTML = allVars
    .map((name, i) => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
      return `${i}, <b>${name}</b> = ${value}`;
    })
    .join("<br><br><hr><br>");

});