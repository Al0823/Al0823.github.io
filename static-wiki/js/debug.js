function runDebug() {
  const jsDebugDiv  = document.getElementById("js-debug");
  const cssDebugDiv = document.getElementById("css-debug");
  if (!jsDebugDiv || !cssDebugDiv) return;

  const debugVarNames = [
    // ── vars.js ──────────────────────────────────────────────
    "vars.PATHVAR",
    "vars.INCVAR",
    "vars.DBVAR",
    "vars.JSVAR",
    "vars.CSSVAR",
    "vars.IMGVAR",
    "vars.wikiadminVAR",
    "vars.CONTENTVAR",
    "vars.APIVAR",
    "vars.DEBUGVAR",
    "vars.WEBSITETITLE",

    // ── Page context ──────────────────────────────────────────
    "PAGETITLE",
    "document.title",
    "document.documentElement.className",
    "window.location.href",
    "window.location.pathname",

    // ── Auth state (content.js / localStorage) ────────────────
    "localStorage.authToken",
    "localStorage.authUser",

    // ── Settings (theme.js / lang.js) ─────────────────────────
    "localStorage.site-theme",
    "localStorage.site-language",

    // ── Screen ────────────────────────────────────────────────
    "screen.width",
    "screen.height",
    "window.devicePixelRatio",
  ];

  function getValue(path) {
    // localStorage keys may contain hyphens so can't be dot-walked
    if (path.startsWith("localStorage.")) {
      const val = localStorage.getItem(path.slice("localStorage.".length));
      return val !== null ? truncate(val) : "(not set)";
    }
    // Special cases that live on objects not reachable cleanly via window
    if (path === "document.title")                      return document.title || "(not set)";
    if (path === "document.documentElement.className")  return document.documentElement.className || "(none)";
    if (path === "window.location.href")                return window.location.href;
    if (path === "window.location.pathname")            return window.location.pathname;
    if (path === "window.devicePixelRatio")             return window.devicePixelRatio;
    try {
      const val = path.split(".").reduce((obj, key) => {
        if (obj === null || obj === undefined) return undefined;
        return obj[key];
      }, window);
      return (val !== undefined && val !== null) ? truncate(String(val)) : "(not set)";
    } catch(e) {
      return "(error: " + e.message + ")";
    }
  }

  // Truncate long values (e.g. authToken) so they don't break layout
  function truncate(str) {
    return str.length > 80 ? str.slice(0, 80) + "…" : str;
  }

  jsDebugDiv.innerHTML = debugVarNames
    .map((name, i) => {
      const val      = getValue(name);
      const isMissing = val === "(not set)" || val === "(none)";
      const style    = isMissing ? "color:#999" : "";
      return `<span style="${style}">${i}&nbsp;&nbsp;<b>${name}</b> = ${val}</span>`;
    })
    .join("<br><hr>");

  // ── CSS custom properties ──────────────────────────────────

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
      } catch(e) {
        // Cross-origin sheet — skip
      }
    }
    return found;
  }

  const allVars = getAllCSSVars();
  cssDebugDiv.innerHTML = allVars.length
    ? allVars.map((name, i) => {
        const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return `${i}&nbsp;&nbsp;<b>${name}</b> = ${value}`;
      }).join("<br><hr>")
    : "(no CSS custom properties found on :root)";
}

window.runDebug = runDebug;