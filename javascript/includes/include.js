async function loadInclude(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  loadInclude("header", window.vars.INCVAR + "header.html");
  loadInclude("nav", window.vars.INCVAR + "nav.html");
  loadInclude("footer", window.vars.INCVAR + "footer.html");
});
