// content.js
// Firebase-powered replacement for Cloudflare Worker backend

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

/*FIREBASE CONFIG*/

const firebaseConfig = {
    apiKey: "AIzaSyAqxosKdaWmw5cuylu8lDSpEgvW0--2EPc",
    authDomain: "wiki-backend-50439.firebaseapp.com",
    projectId: "wiki-backend-50439",
    storageBucket: "wiki-backend-50439.firebasestorage.app",
    messagingSenderId: "218725553653",
    appId: "1:218725553653:web:9804f35c22d8815a997cbc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/*AUTH STATE SYNC*/

onAuthStateChanged(auth, async (firebaseUser) => {

  if (!firebaseUser) {
    localStorage.removeItem("authUser");
    return;
  }

  try {

    const userDoc = await getDoc(
      doc(db, "users", firebaseUser.uid)
    );

    if (userDoc.exists()) {

      const user = {
        uid: firebaseUser.uid,
        ...userDoc.data()
      };

      localStorage.setItem(
        "authUser",
        JSON.stringify(user)
      );
    }

  } catch (err) {
    console.error(err);
  }

});

/*AUTH*/

async function login(email, pword) {

  const cred =
    await signInWithEmailAndPassword(
      auth,
      email,
      pword
    );

  const userDoc =
    await getDoc(
      doc(db, "users", cred.user.uid)
    );

  const user = {
    uid: cred.user.uid,
    ...userDoc.data()
  };

  localStorage.setItem(
    "authUser",
    JSON.stringify(user)
  );

  return user;
}

async function signup(
  fname,
  lname,
  email,
  uname,
  pword
) {

  const cred =
    await createUserWithEmailAndPassword(
      auth,
      email,
      pword
    );

  const userData = {
    fname,
    lname,
    email,
    username: uname,
    ADMIN: "0",
    created: Date.now()
  };

  await setDoc(
    doc(db, "users", cred.user.uid),
    userData
  );

  const user = {
    uid: cred.user.uid,
    ...userData
  };

  localStorage.setItem(
    "authUser",
    JSON.stringify(user)
  );

  return user;
}

async function logout() {

  await signOut(auth);

  localStorage.removeItem("authUser");
}

function getUser() {

  try {
    return JSON.parse(
      localStorage.getItem("authUser")
    );
  } catch {
    return null;
  }
}

function isLoggedIn() {
return !!getUser();
}

function isAdmin() {

  const u = getUser();

  return !!(
    u &&
    u.ADMIN === "1"
  );
}

/*PUBLIC PAGES*/

async function loadPageList(
  containerId,
  searchQuery = ""
) {

  const container =
    document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = "Loading...";

  try {

    const snap =
      await getDocs(
        collection(db, "pages")
      );

    let pages = [];

    snap.forEach(docSnap => {

      pages.push({
        SKU: docSnap.id,
        ...docSnap.data()
      });

    });

    if (searchQuery) {

      const q =
        searchQuery.toLowerCase();

      pages = pages.filter(page =>
        (page.TITLE || "")
          .toLowerCase()
          .includes(q)
      );
    }

    if (!pages.length) {

      container.innerHTML =
        "<p>No pages found.</p>";

      return;
    }

    container.innerHTML =
      pages.map(page => {

        return `
          <a href="${window.vars.PATHVAR}content/pagedetail.html?sku=${page.SKU}">
            ${esc(page.TITLE)}
          </a>
          <br><br>
        `;

      }).join("");

  } catch (err) {

    container.innerHTML =
      `<p class="error">${esc(err.message)}</p>`;
  }
}

async function loadPageDetail(
  sku
) {

  const articleEl =
    document.getElementById(
      "pageContent"
    );

  const commentsEl =
    document.getElementById(
      "commentsList"
    );

  if (!articleEl) return;

  try {

    const pageDoc =
      await getDoc(
        doc(db, "pages", sku)
      );

    if (!pageDoc.exists()) {
      throw new Error(
        "Page not found"
      );
    }

    const page =
      pageDoc.data();

    document.title =
      page.TITLE;

    articleEl.innerHTML =
      `<h2>${esc(page.TITLE)}</h2>${page.BODYCOPY}`;

    if (commentsEl) {

      await loadComments(
        sku,
        commentsEl
      );
    }

  } catch (err) {

    articleEl.innerHTML =
      `<p class="error">${esc(err.message)}</p>`;
  }
}

/*COMMENTS*/

async function loadComments(
  pageSku,
  container
) {

  container.innerHTML =
    "Loading comments...";

  try {

    const q = query(
      collection(
        db,
        "comments"
      ),
      where(
        "pageSku",
        "==",
        pageSku
      )
    );

    const snap =
      await getDocs(q);

    if (snap.empty) {

      container.innerHTML =
        "<p>No comments yet.</p>";

      return;
    }

    let html = "";

    snap.forEach(docSnap => {

      const c =
        docSnap.data();

      html += `
        <div class="comment">
          <b>${esc(c.author)}</b>
          <span class="comment-date">
            —
            ${new Date(c.created).toLocaleString()}
          </span>
          <p>${esc(c.comment)}</p>
          <hr>
        </div>
      `;
    });

    container.innerHTML =
      html;

  } catch (err) {

    container.innerHTML =
      `<p class="error">${esc(err.message)}</p>`;
  }
}

async function submitComment(
  pageSku,
  comment
) {

  if (!auth.currentUser) {

    throw new Error(
      "You must be logged in"
    );
  }

  const user =
    getUser();

  await addDoc(
    collection(
      db,
      "comments"
    ),
    {
      pageSku,
      comment,
      uid:
        auth.currentUser.uid,
      author:
        user?.username ||
        auth.currentUser.email,
      created:
        Date.now()
    }
  );
}

/*PAGE MANAGEMENT*/

async function pubGetPages() {

  const snap =
    await getDocs(
      collection(db, "pages")
    );

  return snap.docs.map(d => ({
    SKU: d.id,
    ...d.data()
  }));
}

async function pubAddPage(
  title,
  bodycopy
) {



  return addDoc(
    collection(
      db,
      "pages"
    ),
    {
      TITLE: title,
      BODYCOPY: bodycopy,
      AUTHOR_UID:
        auth.currentUser.uid,
      CREATED:
        Date.now()
    }
  );
}

async function pubEditPage(
  sku,
  title,
  bodycopy
) {

  return updateDoc(
    doc(
      db,
      "pages",
      sku
    ),
    {
      TITLE: title,
      BODYCOPY: bodycopy
    }
  );
}

async function pubDeletePage(
  sku
) {

  return deleteDoc(
    doc(
      db,
      "pages",
      sku
    )
  );
}

/*ADMIN USERS*/

async function adminGetMembers() {

  const snap =
    await getDocs(
      collection(
        db,
        "users"
      )
    );

  return snap.docs.map(d => ({
    SKU: d.id,
    ...d.data()
  }));
}

async function adminAddMember(
  data
) {

  return addDoc(
    collection(
      db,
      "users"
    ),
    data
  );
}

async function adminEditMember(
  uid,
  data
) {

  return updateDoc(
    doc(
      db,
      "users",
      uid
    ),
    data
  );
}

async function adminDeleteMember(
  uid
) {

  return deleteDoc(
    doc(
      db,
      "users",
      uid
    )
  );
}

/*ADMIN PAGES*/

async function adminGetPages() {
  return pubGetPages();
}

async function adminAddPage(
  data
) {

  return addDoc(
    collection(
      db,
      "pages"
    ),
    data
  );
}

async function adminEditPage(
  sku,
  data
) {

  return updateDoc(
    doc(
      db,
      "pages",
      sku
    ),
    data
  );
}

async function adminDeletePage(
  sku
) {

  return deleteDoc(
    doc(
      db,
      "pages",
      sku
    )
  );
}

/*GUARDS*/

function requireLogin(
  redirectPath
) {

  if (!isLoggedIn()) {

    window.location.href =
      redirectPath ||
      (
        window.vars.PATHVAR +
        "login/index.html"
      );
  }
}

function requireAdmin() {

  if (!isAdmin()) {

    window.location.href =
      window.vars.PATHVAR +
      "index.html";
  }
}

/*UTILITY*/

function esc(str) {

  return String(str || "")
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    );
}

function getSkuFromUrl() {

  return new URLSearchParams(
    window.location.search
  ).get("sku");
}

/*EXPORTS*/

window.login = login;
window.signup = signup;
window.logout = logout;
window.getUser = getUser;
window.isLoggedIn = isLoggedIn;
window.isAdmin = isAdmin;

window.requireLogin = requireLogin;
window.requireAdmin = requireAdmin;

window.loadPageList = loadPageList;
window.loadPageDetail = loadPageDetail;

window.loadComments = loadComments;
window.submitComment = submitComment;

window.pubGetPages = pubGetPages;
window.pubAddPage = pubAddPage;
window.pubEditPage = pubEditPage;
window.pubDeletePage = pubDeletePage;

window.adminGetMembers = adminGetMembers;
window.adminAddMember = adminAddMember;
window.adminEditMember = adminEditMember;
window.adminDeleteMember = adminDeleteMember;

window.adminGetPages = adminGetPages;
window.adminAddPage = adminAddPage;
window.adminEditPage = adminEditPage;
window.adminDeletePage = adminDeletePage;

window.getSkuFromUrl = getSkuFromUrl;
window.esc = esc;
