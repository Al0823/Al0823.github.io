// nav-admin.js
// Load nav.json and pages.json, then render the admin UI

let navData = [];
let pagesData = [];

// Helper to fetch JSON
async function loadJSON(url) {
  const res = await fetch(url);
  return await res.json();
}

// Initialize
async function initAdmin() {
  navData = await loadJSON('/data/nav.json');
  pagesData = await loadJSON('/data/pages.json');
  render();
}

// Render the admin UI
function render() {
  const container = document.getElementById('nav-admin');
  container.innerHTML = '';

  // Group nav items by WEEK
  const weeks = {};
  navData.forEach(item => {
    if (!weeks[item.WEEK]) weeks[item.WEEK] = [];
    weeks[item.WEEK].push(item);
  });

  Object.keys(weeks).sort().forEach(week => {
    const h3 = document.createElement('h3');
    h3.textContent = week;
    container.appendChild(h3);

    weeks[week].sort((a, b) => a.SORTORDER - b.SORTORDER).forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';
      div.textContent = `${item.TITLE} `;

      const page = pagesData.find(p => p.R_NAV === Number(item.SKU));

      if (page) {
        // If record exists, show Enable/Disable based on STATUS
        const btn = document.createElement('a');
        btn.textContent = page.STATUS ? 'Disable' : 'Enable';
        btn.className = page.STATUS ? 'enabled' : 'disabled';
        btn.onclick = () => handleAction(Number(item.SKU), 'toggle');
        div.appendChild(btn);
      } else {
        // If record does NOT exist, show Create
        const btn = document.createElement('a');
        btn.textContent = 'Create';
        btn.onclick = () => handleAction(Number(item.SKU), 'create');
        div.appendChild(btn);
      }

      container.appendChild(div);
    });
  });
}

// Handle button clicks
async function handleAction(sku, action) {
  const pageIndex = pagesData.findIndex(p => p.R_NAV === sku);

  if (action === 'toggle') {
    if (pageIndex >= 0) {
      pagesData[pageIndex].STATUS = pagesData[pageIndex].STATUS ? 0 : 1;
    }
    render();
  } else if (action === 'create') {
    try {
      const res = await fetch('/api/create-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku })
      });
      const result = await res.json();
      if (result.success) {
        pagesData.push({ SKU: Number(sku), R_NAV: Number(sku), STATUS: 1 });
        alert(`Created ${result.lessonFile}`);
        render();
      } else {
        alert('Failed to create lesson');
      }
    } catch (e) {
      console.error(e);
      alert('Error creating lesson');
    }
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

// Start
initAdmin();
