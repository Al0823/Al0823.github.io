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
    "vars.DEBUGVAR",
    "vars.WEBSITETITLE",
    "localStorage.site-language",
    "localStorage.site-theme",
    "document.documentElement.className",
    "screen.width",
    "screen.height"
  ];

  function getValue(path) {
    if (path.startsWith("localStorage.")) {
      const val = localStorage.getItem(path.slice("localStorage.".length));
      return val !== null ? val : "(not set)";
    }
    if (path === "document.documentElement.className") {
      return document.documentElement.className || "(none)";
    }
    try {
      const val = path.split(".").reduce((obj, key) => {
        if (obj === undefined || obj === null) return undefined;
        return obj[key];
      }, window);
      return val !== undefined && val !== null ? val : "(not set)";
    } catch (e) {
      return "(error: " + e.message + ")";
    }
  }

  jsDebugDiv.innerHTML = debugVarNames
    .map((name, i) => `${i}&nbsp;&nbsp;<b>${name}</b> = ${getValue(name)}`)
    .join("<br><br><hr><br>");

  function getAllCSSVars() {
    const found = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText === ":root") {
            for (const prop of rule.style) {
              if (prop.startsWith("--")) found.push(prop);
            }
          }
        }
      } catch (e) {
      }
    }
    return found;
  }

  const allVars = getAllCSSVars();
  cssDebugDiv.innerHTML = allVars.length
    ? allVars.map((name, i) => {
        const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return `${i}&nbsp;&nbsp;<b>${name}</b> = ${value}`;
      }).join("<br><br><hr><br>")
    : "(no CSS custom properties found on :root)";
}

window.runDebug = runDebug;