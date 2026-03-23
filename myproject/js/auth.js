
// ---------------- COOKIE HELPERS ----------------
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function clearAuth() {
  document.cookie = "loggedIn=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
  document.cookie = "user=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
  document.cookie = "role=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
}

// ---------------- LOGIN STATE ----------------
function isLoggedIn() {
  return getCookie("loggedIn") === "true";
}

function getRole() {
  return getCookie("role"); // "admin" or "user"
}

function getUser() {
  return getCookie("user");
}

// ---------------- UI CONTROL ----------------
function initAuthUI() {
  const status = document.getElementById("authStatus");

  if (!status) return;

  if (!isLoggedIn()) {
    status.textContent = "Not logged in";
  } else {
    const role = getRole();
    const user = getUser();

    if (role === "admin") {
      status.textContent = "Logged in as ADMIN: " + user;
    } else {
      status.textContent = "Logged in as USER: " + user;
    }
  }
}

// ---------------- LOGIN ----------------
async function login(username, password) {
  const res = await fetch("admins.xml");
  const text = await res.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");

  const admins = xml.getElementsByTagName("admin");

  for (let i = 0; i < admins.length; i++) {
    const u = admins[i].getElementsByTagName("username")[0].textContent;
    const p = admins[i].getElementsByTagName("password")[0].textContent;

    if (username === u && password === p) {
      setCookie("loggedIn", "true", 1);
      setCookie("user", username, 1);
      setCookie("role", "admin", 1);
      return "admin";
    }
  }

  // fallback = standard user
  const storedUser = localStorage.getItem("user_" + username);

  if (storedUser) {
    const data = JSON.parse(storedUser);

    if (data.password === password) {
      setCookie("loggedIn", "true", 1);
      setCookie("user", username, 1);
      setCookie("role", "user", 1);
      return "user";
    }
  }

  return null;
}

// ---------------- LOGOUT ----------------
function logout() {
  clearAuth();
  window.location.href = "index.html";
}

// ---------------- PROTECTION SYSTEM ----------------
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "index.html";
  }
}

function requireAdmin() {
  if (!isLoggedIn() || getRole() !== "admin") {
    window.location.href = "index.html";
  }
}