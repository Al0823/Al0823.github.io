/*async function loadNav() {
  const response = await fetch('/static-wiki/data/nav.xml');
  const text = await response.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");

  const items = Array.from(xml.getElementsByTagName("item"));

  // Simulated variables (replace with real auth logic)
  const admin = getAdminLevel();
  const user = getUser();
  const studentCookie = getCookie("Student");

  const filtered = items
    .map(item => ({
      title: item.getElementsByTagName("title")[0].textContent,
      path: item.getElementsByTagName("pathname")[0].textContent,
      admin: parseInt(item.getElementsByTagName("admin")[0].textContent),
      status: parseInt(item.getElementsByTagName("status")[0].textContent),
      sort: parseInt(item.getElementsByTagName("sortorder")[0].textContent)
    }))
    .filter(i => i.status === 1)
    .sort((a, b) => a.sort - b.sort);

  const nav = document.getElementById("mainNav");
  const currentPath = window.location.pathname;

  filtered.forEach(item => {

    if (item.admin === 2) {
      if (!user) {
        addLink(nav, item, currentPath);
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
}

function getAdminLevel() {
  return 0; // replace with real logic
}

function getUser() {
  return null;
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

loadNav();*/

async function loadNav() {
  try {
    console.log("Loading nav.xml...");

    const response = await fetch("/static-wiki/data/nav.xml");

    if (!response.ok) {
      throw new Error("HTTP error: " + response.status);
    }

    const text = await response.text();
    console.log("XML loaded:", text);

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");

    const items = xml.getElementsByTagName("item");

    console.log("Items found:", items.length);

    const nav = document.getElementById("mainNav");

    if (!nav) {
      throw new Error("Nav container #mainNav not found");
    }

    for (let i = 0; i < items.length; i++) {
      const title = items[i].getElementsByTagName("title")[0]?.textContent;
      const path = items[i].getElementsByTagName("pathname")[0]?.textContent;

      console.log("Adding:", title, path);

      const a = document.createElement("a");
      a.href = path;
      a.textContent = title;

      nav.appendChild(a);
      nav.appendChild(document.createElement("br"));
    }

  } catch (err) {
    console.error("NAV ERROR:", err);
  }
}

loadNav();