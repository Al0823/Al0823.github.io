const BACKEND_URL = ''; // same origin
const NAV_JSON = '/javascript/frontend/data/nav.json';
const PAGES_JSON = '/javascript/frontend/data/pages.json';

const navAdminDiv = document.getElementById('nav-admin');

let navData = [];
let pagesData = [];

// Utility: group by week
function groupByWeek(items) {
  const weeks = {};
  items.forEach(item => {
    if (!weeks[item.WEEK]) weeks[item.WEEK] = [];
    weeks[item.WEEK].push(item);
  });
  return weeks;
}

// Fetch JSON data
async function fetchData() {
  try {
    const [navResp, pagesResp] = await Promise.all([
      fetch(NAV_JSON),
      fetch(PAGES_JSON)
    ]);
    navData = await navResp.json();
    pagesData = await pagesResp.json();
    renderAdmin();
  } catch (err) {
    navAdminDiv.innerHTML = `<p style="color:red;">Failed to load data: ${err}</p>`;
    console.error(err);
  }
}

// Render admin table
function renderAdmin() {
  navAdminDiv.innerHTML = '';
  
  // Sort by date
  navData.sort((a,b) => new Date(a.WEEK) - new Date(b.WEEK));
  const weeks = groupByWeek(navData);

  for (const week of Object.keys(weeks)) {
    const weekHeader = document.createElement('h3');
    weekHeader.textContent = `Week of ${week}`;
    navAdminDiv.appendChild(weekHeader);

    // Sort by SORTORDER
    weeks[week].sort((a,b) => a.SORTORDER - b.SORTORDER);

    weeks[week].forEach(item => {
      const lessonDiv = document.createElement('div');
      lessonDiv.className = 'item';
      lessonDiv.textContent = item.TITLE;

      // Check if lesson exists in pagesData
      const pageRecord = pagesData.find(p => p.R_NAV === item.SKU);

      const btn = document.createElement('a');
      btn.href = '#';

      if (!pageRecord) {
        btn.textContent = 'Create';
        btn.className = 'enabled';
        btn.onclick = () => createLesson(item.SKU);
      } else {
        btn.textContent = pageRecord.STATUS === 1 ? 'Disable' : 'Enable';
        btn.className = pageRecord.STATUS === 1 ? 'disabled' : 'enabled';
        btn.onclick = () => toggleLesson(item.SKU, pageRecord.STATUS);
      }

      lessonDiv.appendChild(btn);
      navAdminDiv.appendChild(lessonDiv);
    });
  }
}

// Create lesson
async function createLesson(sku) {
  try {
    const res = await fetch(`${BACKEND_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku })
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchData();
  } catch (err) {
    alert('Failed to create lesson: ' + err);
    console.error(err);
  }
}

// Toggle Enable/Disable
async function toggleLesson(sku, currentStatus) {
  try {
    const res = await fetch(`${BACKEND_URL}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, status: currentStatus === 1 ? 0 : 1 })
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchData();
  } catch (err) {
    alert('Failed to update lesson: ' + err);
    console.error(err);
  }
}

// Download updated pages.json
document.getElementById('download-json').onclick = () => {
  const blob = new Blob([JSON.stringify(pagesData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pages.json';
  a.click();
  URL.revokeObjectURL(url);
};

// Initial load
fetchData();
