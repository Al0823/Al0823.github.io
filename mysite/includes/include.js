

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
  // Load header and nav first
  await loadInclude("header", window.vars.INCVAR + "header.html");
  await loadInclude("nav", window.vars.INCVAR + "nav.html");
  await loadInclude("footer", window.vars.INCVAR + "footer.html");

  // Populate footer date/time
  const footerEl = document.getElementById("footerText");
  if (footerEl) {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    footerEl.textContent = "Copyright " + dateStr + " - " + timeStr;
  }

  // Load debug section if DEBUGVAR is true
  if (window.vars?.DEBUGVAR) {
    const debugArea = document.getElementById("debugArea");
    if (debugArea) {
      await loadInclude("debugArea", window.vars.INCVAR + "debug.html");
    }
  }
});
