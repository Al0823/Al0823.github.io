// nav.js
async function loadNav() {
  try {
    const response = await fetch(window.vars.DBVAR + "nav.xml");
    if (!response.ok) throw new Error("HTTP error: " + response.status);

    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");

    const items = Array.from(xml.getElementsByTagName("item"))
      .map(item => ({
        title:  item.getElementsByTagName("title")[0]?.textContent ?? "",
        path:   item.getElementsByTagName("pathname")[0]?.textContent ?? "",
        admin:  parseInt(item.getElementsByTagName("admin")[0]?.textContent ?? "0"),
        status: parseInt(item.getElementsByTagName("status")[0]?.textContent ?? "0"),
        sort:   parseInt(item.getElementsByTagName("sortorder")[0]?.textContent ?? "0"),
      }))
      .filter(i => i.status === 1)
      .sort((a, b) => a.sort - b.sort);

    const list = document.getElementById("mainNavList");
    if (!list) throw new Error("Nav list #mainNavList not found");

    const currentPath = window.location.pathname;
    const siteBase    = (window.vars?.PATHVAR ?? "/static-wiki/").replace(/\/?$/, "/");

    let user = null;
    try { user = JSON.parse(localStorage.getItem("authUser")); } catch {}
    const loggedIn = !!user;
    const admin    = user?.ADMIN === "1";

    function toAbsolute(path) {
      if (path.startsWith("/") || path.startsWith("http")) return path;
      return siteBase + path;
    }

    items.forEach(item => {
      if (item.admin === 2) {
        if (!loggedIn) {
          addCustomLink(list, item.title, toAbsolute(item.path), currentPath);
        } else {
          addCustomLink(list, "Logout", toAbsolute("login/index.html"), currentPath);
        }
        return;
      }
      if (item.admin === 0) {
        addCustomLink(list, item.title, toAbsolute(item.path), currentPath);
      }
    });

    if (loggedIn) {
      addCustomLink(list, "My Pages", siteBase + "content/pub/index.html", currentPath);
    }
    if (admin) {
      addCustomLink(list, "Admin", siteBase + "26wiki26/index.html", currentPath);
    }
    if (user?.SKU === "1" || getCookie("Student") === "2559" || getCookie("Student") === "1055") {
      addCustomLink(list, "DEV PAGE", "/dev/index.html", currentPath);
    }

  } catch (err) {
    console.error("NAV ERROR:", err);
  }
}

function addCustomLink(list, title, path, currentPath) {

  const li = document.createElement("li");
  const a  = document.createElement("a");

  a.href = path;
  a.textContent = title;

  if (title === "Logout") {

    a.addEventListener("click", async function(e) {

      e.preventDefault();

      try {

        await window.logout();

      } catch(err) {

        console.error("Logout failed:", err);

      }

      window.location.href =
        (window.vars?.PATHVAR ?? "/static-wiki/") +
        "index.html";

    });

  }

  if (
    path !== "#" &&
    currentPath.includes(path)
  ) {
    li.classList.add("activenav");
  }

  li.appendChild(a);
  list.appendChild(li);
}

function getCookie(name) {
  return document.cookie.split("; ").find(r => r.startsWith(name + "="))?.split("=")[1];
}

window.loadNav = loadNav;