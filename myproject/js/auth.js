
// ---------------- COOKIE HELPERS ----------------
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function clearAuth() {
  document.cookie = "loggedIn=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
  document.cookie = "user=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
}

// ---------------- LOAD ADMINS FROM XML ----------------
async function loadAdmins() {
  const res = await fetch("admins.xml");
  const text = await res.text();

  const parser = new DOMParser();
  return parser.parseFromString(text, "text/xml");
}

// ---------------- LOGIN ----------------
document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const username = document.getElementById("loginUser").value;
  const password = document.getElementById("loginPass").value;

  const xml = await loadAdmins();
  const admins = xml.getElementsByTagName("admin");

  let success = false;

  for (let i = 0; i < admins.length; i++) {
    const u = admins[i].getElementsByTagName("username")[0].textContent;
    const p = admins[i].getElementsByTagName("password")[0].textContent;

    if (username === u && password === p) {
      success = true;
      break;
    }
  }

  if (success) {
    setCookie("loggedIn", "true", 1);
    setCookie("user", username, 1);
    setCookie("role", "admin", 1);

    window.location.href = "{PATHVAR}index.html"; // your main wiki page
  } else {
    alert("Invalid login");
  }
});

// ---------------- SIGNUP (LOCAL ONLY DEMO) ----------------
document.getElementById("signupForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const user = {
    fname: document.getElementById("fname").value,
    lname: document.getElementById("lname").value,
    email: document.getElementById("email").value,
    username: document.getElementById("signupUser").value,
    password: document.getElementById("signupPass").value
  };

  // Stored locally (not persistent globally)
  localStorage.setItem("user_" + user.username, JSON.stringify(user));

  alert("Signup saved locally (demo only)");
});

// ---------------- LOGOUT ----------------
function logout() {
  clearAuth();
  window.location.href = "index.html";
}