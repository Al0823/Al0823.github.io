function runDebug() {
  const jsDebugDiv  = document.getElementById("js-debug");
  const cssDebugDiv = document.getElementById("css-debug");
  if (!jsDebugDiv || !cssDebugDiv) return;

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
    if (path.startsWith("localStorage.")) {
      return localStorage.getItem(path.slice("localStorage.".length)) ?? "null";
    }
    try {
      return path.split(".").reduce((obj, key) => obj?.[key], window) ?? "undefined";
    } catch {
      return "error";
    }
  }

  jsDebugDiv.innerHTML = debugVarNames
    .map((name, i) => `${i}, <b>${name}</b> = ${getValue(name)}`)
    .join("<br><br><hr><br>");

  function getAllCSSVars() {
    const vars = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText === ":root") {
            for (const prop of rule.style) {
              if (prop.startsWith("--")) vars.push(prop);
            }
          }
        }
      } catch (e) {}
    }
    return vars;
  }

  const allVars = getAllCSSVars();
  cssDebugDiv.innerHTML = allVars.length
    ? allVars
        .map((name, i) => {
          const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
          return `${i}, <b>${name}</b> = ${value}`;
        })
        .join("<br><br><hr><br>")
    : "(no CSS variables found)";
}

window.runDebug = runDebug;
runDebug();