// content.js — API client for the Cloudflare Worker
// Requires window.vars.APIVAR to be set in vars.js

// ── Core fetch ────────────────────────────────────────────────────────────────

function apiBase() {
  return (window.vars?.APIVAR ?? "").replace(/\/$/, "");
}

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("authToken");
  const headers = { "Content-Type": "application/json", ...(options.headers ?? {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(apiBase() + path, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

async function login(uname, pword) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ uname, pword }),
  });
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("authUser",  JSON.stringify(data.user));
  return data.user;
}

async function signup(fname, lname, email, uname, pword) {
  const data = await apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ fname, lname, email, uname, pword }),
  });
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("authUser",  JSON.stringify(data.user));
  return data.user;
}

function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
}

function getUser() {
  try { return JSON.parse(localStorage.getItem("authUser")); } catch { return null; }
}

function isLoggedIn()  { return !!getUser(); }
function isAdmin()     { return getUser()?.ADMIN === "1"; }

// ── Public pages ──────────────────────────────────────────────────────────────

async function loadPageList(containerId, searchQuery = "") {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "Loading...";
  try {
    const url   = searchQuery ? `/pages?search=${encodeURIComponent(searchQuery)}` : "/pages";
    const pages = await apiFetch(url);
    if (pages.length === 0) {
      container.innerHTML = searchQuery
        ? `<p>No results for "<b>${esc(searchQuery)}</b>".</p>`
        : "<p>No pages found.</p>";
      return;
    }
    const heading = searchQuery
      ? `<p><b>${pages.length}</b> result(s) for "<b>${esc(searchQuery)}</b>"</p>` : "";
    container.innerHTML = heading + pages
      .map(p => `<a href="${window.vars.PATHVAR}content/pagedetail.html?sku=${p.SKU}">${esc(p.TITLE)}</a><br><br>`)
      .join("");
  } catch (err) {
    container.innerHTML = `<p class="error">Failed to load pages: ${esc(err.message)}</p>`;
  }
}

async function loadPageDetail(sku) {
  const articleEl  = document.getElementById("pageContent");
  const commentsEl = document.getElementById("commentsList");
  if (!articleEl) return;
  try {
    const page = await apiFetch(`/pages/${sku}`);
    document.title = page.TITLE;
    articleEl.innerHTML = `<h2>${esc(page.TITLE)}</h2>` + page.BODYCOPY;
    if (commentsEl) await loadComments(sku, commentsEl);
  } catch (err) {
    articleEl.innerHTML = `<p class="error">Failed to load page: ${esc(err.message)}</p>`;
  }
}

// ── Comments ──────────────────────────────────────────────────────────────────

async function loadComments(pageSku, container) {
  container.innerHTML = "Loading comments...";
  try {
    const comments = await apiFetch(`/comments/${pageSku}`);
    if (comments.length === 0) { container.innerHTML = "<p>No comments yet.</p>"; return; }
    container.innerHTML = comments.map(c => `
      <div class="comment">
        <b>${esc(c.AUTHOR)}</b>
        <span class="comment-date"> — ${esc(c.CREATEDATE)} ${esc(c.CREATETIME)}</span>
        <p>${esc(c.COMMENT)}</p>
        <hr>
      </div>`).join("");
  } catch (err) {
    container.innerHTML = `<p class="error">Failed to load comments: ${esc(err.message)}</p>`;
  }
}

async function submitComment(pageSku, comment) {
  if (!isLoggedIn()) throw new Error("You must be logged in to comment");
  return apiFetch("/comments", { method: "POST", body: JSON.stringify({ pageSku, comment }) });
}

// ── Pub (own-content) pages ───────────────────────────────────────────────────

async function pubGetPages()            { return apiFetch("/pub/pages"); }
async function pubAddPage(title, bodycopy) {
  return apiFetch("/pub/pages", { method: "POST", body: JSON.stringify({ title, bodycopy }) });
}
async function pubEditPage(sku, title, bodycopy) {
  return apiFetch(`/pub/pages/${sku}`, { method: "PUT", body: JSON.stringify({ title, bodycopy }) });
}
async function pubDeletePage(sku) {
  return apiFetch(`/pub/pages/${sku}`, { method: "DELETE" });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

async function adminGetMembers()     { return apiFetch("/admin/members"); }
async function adminAddMember(data)  { return apiFetch("/admin/members",      { method: "POST",   body: JSON.stringify(data) }); }
async function adminEditMember(sku, data) { return apiFetch(`/admin/members/${sku}`, { method: "PUT", body: JSON.stringify(data) }); }
async function adminDeleteMember(sku)    { return apiFetch(`/admin/members/${sku}`, { method: "DELETE" }); }

async function adminGetPages()       { return apiFetch("/admin/pages"); }
async function adminAddPage(data)    { return apiFetch("/admin/pages",         { method: "POST",   body: JSON.stringify(data) }); }
async function adminEditPage(sku, data)  { return apiFetch(`/admin/pages/${sku}`,  { method: "PUT",    body: JSON.stringify(data) }); }
async function adminDeletePage(sku)      { return apiFetch(`/admin/pages/${sku}`,  { method: "DELETE" }); }

// ── Utility ───────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function getSkuFromUrl() {
  return new URLSearchParams(window.location.search).get("sku");
}

// Guard: redirect to login if not logged in (call on protected pages)
function requireLogin(redirectPath) {
  if (!isLoggedIn()) {
    window.location.href = redirectPath ?? `${window.vars.PATHVAR}login/index.html`;
  }
}

// Guard: redirect to home if not admin
function requireAdmin() {
  if (!isAdmin()) {
    window.location.href = window.vars.PATHVAR + "index.html";
  }
}

window.login          = login;
window.signup         = signup;
window.logout         = logout;
window.getUser        = getUser;
window.isLoggedIn     = isLoggedIn;
window.isAdmin        = isAdmin;
window.requireLogin   = requireLogin;
window.requireAdmin   = requireAdmin;
window.loadPageList   = loadPageList;
window.loadPageDetail = loadPageDetail;
window.loadComments   = loadComments;
window.submitComment  = submitComment;
window.pubGetPages    = pubGetPages;
window.pubAddPage     = pubAddPage;
window.pubEditPage    = pubEditPage;
window.pubDeletePage  = pubDeletePage;
window.adminGetMembers   = adminGetMembers;
window.adminAddMember    = adminAddMember;
window.adminEditMember   = adminEditMember;
window.adminDeleteMember = adminDeleteMember;
window.adminGetPages     = adminGetPages;
window.adminAddPage      = adminAddPage;
window.adminEditPage     = adminEditPage;
window.adminDeletePage   = adminDeletePage;
window.getSkuFromUrl     = getSkuFromUrl;
window.esc               = esc;