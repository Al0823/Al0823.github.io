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

  await loadInclude("header", INCVAR + "header.html");
  await loadInclude("nav",    INCVAR + "nav.html");
  await loadInclude("footer", INCVAR + "footer.html");

  if (typeof window.loadNav === "function") {
    await window.loadNav();
  } else {
    console.error("loadNav() not found — make sure nav.js is loaded before include.js");
  }

  if (typeof window.setFooterText === "function") {
    window.setFooterText();
  }

  if (DEBUGVAR) {
    const debugArea = document.getElementById("debugArea");
    if (debugArea) {
      await loadInclude("debugArea", INCVAR + "debug.html");
    }
  }

  if (typeof updatePageTitle === "function") updatePageTitle();

  document.dispatchEvent(new Event("includesLoaded"));
});