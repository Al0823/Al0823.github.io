
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

async function loginWithMembers(uname, pword) {
  const res = await fetch("members.xml");
  const text = await res.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");

  const members = xml.getElementsByTagName("member");

  for (let i = 0; i < members.length; i++) {
    const m = members[i];

    const u = m.getElementsByTagName("UNAME")[0].textContent;
    const p = m.getElementsByTagName("PWORD")[0].textContent;
    const status = m.getElementsByTagName("STATUS")[0].textContent;
    const admin = m.getElementsByTagName("ADMIN")[0].textContent;
    const fname = m.getElementsByTagName("FNAME")[0].textContent;

    if (uname === u && pword === p && status === "1") {

      // Set session cookies
      setCookie("loggedIn", "true", 1);
      setCookie("user", uname, 1);
      setCookie("fname", fname, 1);

      if (admin === "1") {
        setCookie("role", "admin", 1);
      } else {
        setCookie("role", "user", 1);
      }

      return true;
    }
  }

  return false;
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