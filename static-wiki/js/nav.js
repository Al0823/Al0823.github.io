async function loadNav() {
  try {
    const response = await fetch(window.vars.DBVAR + "nav.xml");

    if (!response.ok) {
      throw new Error("HTTP error: " + response.status);
    }

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

    const nav = document.getElementById("mainNav");
    if (!nav) throw new Error("Nav container #mainNav not found");

    const currentPath = window.location.pathname;
    const admin = getAdminLevel();
    const user  = getUser();
    const studentCookie = getCookie("Student");

    items.forEach(item => {
      if (item.admin === 2) {
        // Login/logout toggle
        if (!user) {
          addCustomLink(nav, item.title, item.path, currentPath);
        } else {
          addCustomLink(nav, "Logout", item.path + "?action=logout", currentPath);
        }
        return;
      }

      if (item.admin === 0) {
        addLink(nav, item, currentPath);
      }
    });

    if (admin === 1) {
      addCustomLink(nav, "Admin Panel", "admin/index.html", currentPath);
    }

    if (studentCookie === "2559" || studentCookie === "1055") {
      addCustomLink(nav, "DEV PAGE", "/dev/index.html", currentPath);
    }

  } catch (err) {
    console.error("NAV ERROR:", err);
  }
}

function addLink(nav, item, currentPath) {
  addCustomLink(nav, item.title, item.path, currentPath);
}

function addCustomLink(nav, title, path, currentPath) {
  const a = document.createElement("a");
  a.href = path;
  a.textContent = title;
  if (currentPath.includes(path)) {
    a.classList.add("activenav");
  }
  nav.appendChild(a);
nav.appendChild(document.createElement("br"));
}

function getAdminLevel() {
  return 0; // replace with real logic
}

function getUser() {
  return null; // replace with real logic
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

// Exposed so include.js can call it after nav.html is in the DOM
window.loadNav = loadNav;
