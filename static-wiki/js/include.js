/*async function loadInclude(id, file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Failed to load script: " + src));
    document.head.appendChild(s);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const { INCVAR, DBVAR, JSVAR, DEBUGVAR } = window.vars;

  await loadInclude("header", INCVAR + "header.html");
  await loadInclude("nav",    INCVAR + "nav.html");
  await loadInclude("footer", INCVAR + "footer.html");

  if (typeof window.loadNav === "function") {
    await window.loadNav();
  } else {
    console.error("loadNav() not found — make sure nav.js is loaded before include.js");
  }

  if (typeof window.setFooterText !== "function") {
    await loadScript(JSVAR + "footer.js");
  }
  window.setFooterText();

  if (typeof window.googleTranslateElementInit === "function") {
    await loadScript("//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit");
  }

  if (DEBUGVAR) {
    const debugArea = document.getElementById("debugInclude");
    if (debugArea) {
      await loadInclude("debugInclude", INCVAR + "debug.html");
      if (typeof window.runDebug !== "function") {
        await loadScript(JSVAR + "debug.js");
      }
      window.runDebug();
    }
  }

  if (typeof updatePageTitle === "function") updatePageTitle();

  document.dispatchEvent(new Event("includesLoaded"));
});
*/
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

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Failed to load script: " + src));
    document.head.appendChild(s);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  /*const { INCVAR, DBVAR, JSVAR, DEBUGVAR } = window.vars;*/

if (!window.vars) {
  console.error("window.vars is not defined. Check vars.js load order.");
  return;
}

const { INCVAR, DBVAR, JSVAR, DEBUGVAR } = window.vars;

  await loadInclude("header", INCVAR + "header.html");
  await loadInclude("nav",    INCVAR + "nav.html");
  await loadInclude("footer", INCVAR + "footer.html");

  if (typeof window.loadNav === "function") {
    await window.loadNav();
  } else {
    console.error("loadNav() not found — make sure nav.js is loaded before include.js");
  }

  if (typeof window.setFooterText !== "function") {
    await loadScript(JSVAR + "footer.js");
  }
  window.setFooterText();

  if (typeof window.googleTranslateElementInit === "function") {
    await loadScript("//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit");
  }

  if (DEBUGVAR) {
    const debugArea = document.getElementById("debugInclude");
    if (debugArea) {
      await loadInclude("debugInclude", INCVAR + "debug.html");
      await loadScript(JSVAR + "debug.js");
      window.runDebug();
    }
  }

		  function updatePageTitle() {
    const pageTitle = typeof PAGETITLE !== "undefined" ? PAGETITLE : "";
    const fullTitle = window.vars.WEBSITETITLE + (pageTitle ? " - " + pageTitle : "");

    document.title = fullTitle;

    const titleEl = document.getElementById("pageTitle");
    if (titleEl) titleEl.textContent = fullTitle;
  }

  window.updatePageTitle = updatePageTitle;
  if (typeof updatePageTitle === "function") updatePageTitle();

  document.dispatchEvent(new Event("includesLoaded"));
});