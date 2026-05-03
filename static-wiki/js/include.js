// include.js

async function loadInclude(id, file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const { INCVAR, DBVAR, DEBUGVAR } = window.vars;

  // Load structural includes
  await loadInclude("header", INCVAR + "header.html");
  await loadInclude("nav",    INCVAR + "nav.html");
  await loadInclude("footer", INCVAR + "footer.html");

  // Now that nav.html is in the DOM, populate it
  // nav.js must be loaded before include.js (add it to <head> or top of <body>)
  if (typeof window.loadNav === "function") {
    await window.loadNav();
  } else {
    console.error("loadNav() not found — make sure nav.js is loaded before include.js");
  }

  // Footer date/time
  const footerEl = document.getElementById("footerText");
  if (footerEl) {
    const now = new Date();
    footerEl.textContent =
      "Copyright " +
      now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) +
      " - " +
      now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  // Debug include
  if (DEBUGVAR) {
    const debugArea = document.getElementById("debugArea");
    if (debugArea) {
      await loadInclude("debugArea", INCVAR + "debug.html");
    }
  }

  // Page title
  if (typeof updatePageTitle === "function") updatePageTitle();

  // Signal that all includes are in the DOM (theme.js uses this to bind #themeSelect)
  document.dispatchEvent(new Event("includesLoaded"));
});