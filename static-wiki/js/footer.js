function setFooterText() {
  const el = document.getElementById("footerText");
  if (!el) return;
  const currentYear = new Date().getFullYear();
  el.textContent = `Copyright A.t.A. Projects, Websites, and Games 2025-${currentYear}`;
}
window.setFooterText = setFooterText;