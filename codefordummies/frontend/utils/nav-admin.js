// nav-admin.js

const NAV_JSON = "/data/nav.json";      // Served via Render or static folder
const PAGES_JSON = "/data/pages.json";
const TEMPLATES_PATH = "/templates/lessontemplate.html"; // Path to lesson template
const BACKEND_URL = "https://al0823-github-io.onrender.com"; // Your Render backend URL

document.addEventListener('DOMContentLoaded', async () => {
  const navContainer = document.getElementById('nav-admin');
  if (!navContainer) return console.error('Nav container not found');

  try {
    // Load JSON files
    const [navRes, pagesRes] = await Promise.all([
      fetch(NAV_JSON),
      fetch(PAGES_JSON)
    ]);

    const navData = await navRes.json();
    const pagesData = await pagesRes.json();

    console.log('navData', navData);
    console.log('pagesData', pagesData);

    // Group nav items by week
    const weeks = [...new Set(navData.map(n => n.WEEK))]
      .sort((a, b) => new Date(a) - new Date(b));

    weeks.forEach(week => {
      const weekDiv = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.textContent = `Week: ${week}`;
      weekDiv.appendChild(h3);

      // Sort items by SORTORDER within the week
      const items = navData
        .filter(n => n.WEEK === week)
        .sort((a, b) => a.SORTORDER - b.SORTORDER);

      items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.textContent = item.TITLE;

        // Find page record
        const pageRecord = pagesData.find(p => Number(p.R_NAV) === Number(item.SKU));

        const btn = document.createElement('button');

        if (!pageRecord) {
          // Lesson does not exist
          btn.textContent = 'Create';
          btn.className = 'create';
          btn.onclick = () => createLesson(item.SKU);
        } else {
          // Lesson exists: STATUS 1 = enabled, 0 = disabled
          btn.textContent = pageRecord.STATUS === 1 ? 'Disable' : 'Enable';
          btn.className = pageRecord.STATUS === 1 ? 'enabled' : 'disabled';
          btn.onclick = () => toggleStatus(item.SKU, pageRecord.STATUS);
        }

        itemDiv.appendChild(btn);
        weekDiv.appendChild(itemDiv);
      });

      navContainer.appendChild(weekDiv);
    });
  } catch (err) {
    console.error('Error loading nav admin:', err);
  }
});

// CREATE lesson
async function createLesson(sku) {
  try {
    const res = await fetch(`${BACKEND_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku })
    });

    if (!res.ok) throw new Error(await res.text());
    alert(`Lesson ${sku} created successfully!`);
    location.reload(); // reload to show new button state
  } catch (err) {
    console.error('Failed to create lesson:', err);
    alert('Failed to create lesson. Check console.');
  }
}

// TOGGLE status (enable/disable)
async function toggleStatus(sku, currentStatus) {
  const newStatus = currentStatus === 1 ? 0 : 1;
  try {
    const res = await fetch(`${BACKEND_URL}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, status: newStatus })
    });

    if (!res.ok) throw new Error(await res.text());
    alert(`Lesson ${sku} status updated!`);
    location.reload();
  } catch (err) {
    console.error('Failed to toggle status:', err);
    alert('Failed to update status. Check console.');
  }
}
