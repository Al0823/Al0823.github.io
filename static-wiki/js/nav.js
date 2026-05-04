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
    const admin = getAdminLevel();
    const user  = getUser();
    const studentCookie = getCookie("Student");

    // Base path for the site root — ensures nav links work from any subfolder.
    // PATHVAR should be an absolute path like "/static-wiki/" in vars.js.
    const siteBase = (window.vars?.PATHVAR ?? "/static-wiki/").replace(/\/?$/, "/");

    function toAbsolute(path) {
      if (path.startsWith("/") || path.startsWith("http")) return path;
      return siteBase + path;
    }

    items.forEach(item => {
      if (item.admin === 2) {
        if (!user) {
          addCustomLink(list, item.title, toAbsolute(item.path), currentPath);
        } else {
          addCustomLink(list, "Logout", toAbsolute(item.path) + "?action=logout", currentPath);
        }
        return;
      }
      if (item.admin === 0) {
        addCustomLink(list, item.title, toAbsolute(item.path), currentPath);
      }
    });

    if (admin === 1) {
      addCustomLink(list, "Admin Panel", siteBase + "26wiki26/index.html", currentPath);
    }

    if (studentCookie === "2559" || studentCookie === "1055") {
      addCustomLink(list, "DEV PAGE", "/dev/index.html", currentPath);
    }

  } catch (err) {
    console.error("NAV ERROR:", err);
  }
}

function addCustomLink(list, title, path, currentPath) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = path;
  a.textContent = title;
  if (currentPath.includes(path)) {
    li.classList.add("activenav");
  }
  li.appendChild(a);
  list.appendChild(li);
}

function getAdminLevel() { return 0; }
function getUser()       { return null; }

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

window.loadNav = loadNav;