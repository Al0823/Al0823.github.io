// nav-admin.js
(async function() {
  // Utility to load JSON
  async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return await res.json();
  }

  // Action handler for Create / Enable / Disable
  async function handleAction(SKU, action) {
    try {
      let res;
      if (action === 'toggle') {
        res = await fetch('/api/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ SKU })
        });
      } else if (action === 'create') {
        res = await fetch('/api/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ SKU })
        });
      }
      const data = await res.json();
      if (res.ok) {
        location.reload(); // reload admin UI to show updates
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (e) {
      console.error(e);
      alert('Action failed: ' + e.message);
    }
  }

  // Load nav and pages data
  let navData = [];
  let pagesData = [];
  try {
    navData = await loadJSON('../../data/nav.json');
    pagesData = await loadJSON('../../data/pages.json');
  } catch (e) {
    console.error(e);
    const container = document.getElementById('nav-admin');
    container.innerHTML = `<p style="color:red;">Error loading JSON data. Check paths and server.</p>`;
    return;
  }

  const container = document.getElementById('nav-admin');
  container.innerHTML = '';

  // Group nav items by WEEK
  const weeks = {};
  navData.forEach(item => {
    if (!weeks[item.WEEK]) weeks[item.WEEK] = [];
    weeks[item.WEEK].push(item);
  });

  // Sort weeks chronologically
  const sortedWeeks = Object.keys(weeks).sort((a, b) => new Date(a) - new Date(b));

  sortedWeeks.forEach(week => {
    // Week header
    const h3 = document.createElement('h3');
    h3.textContent = week;
    container.appendChild(h3);

    // Sort lessons within week
    weeks[week].sort((a, b) => a.SORTORDER - b.SORTORDER).forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';
      div.textContent = `${item.TITLE} `;

      // Find page record
      const page = pagesData.find(p => Number(p.R_NAV) === Number(item.SKU));

      if (page) {
        const btn = document.createElement('a');
        const status = Number(page.STATUS);

        if (status === 1) {
          btn.textContent = 'Disable';
          btn.className = 'enabled';
        } else {
          btn.textContent = 'Enable';
          btn.className = 'disabled';
        }

        btn.onclick = () => handleAction(Number(item.SKU), 'toggle');
        div.appendChild(btn);
      } else {
        const btn = document.createElement('a');
        btn.textContent = 'Create';
        btn.onclick = () => handleAction(Number(item.SKU), 'create');
        div.appendChild(btn);
      }

      container.appendChild(div);
    });
  });

})();
