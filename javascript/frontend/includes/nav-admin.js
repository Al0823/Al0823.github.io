(async function() {

  async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return await res.json();
  }

  async function handleAction(SKU, action) {
    const url = action === 'create' ? '/api/create' : '/api/toggle';

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ SKU: Number(SKU) })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Action failed');
      return;
    }

    location.reload();
  }

  // LOAD DATA
  let navData = [];
  let pagesData = [];

  try {
    navData = await loadJSON('../../data/nav.json');
    pagesData = await loadJSON('../../data/pages.json');
  } catch (e) {
    document.getElementById('nav-admin').innerHTML =
      `<p style="color:red;">JSON failed to load</p>`;
    console.error(e);
    return;
  }

  const container = document.getElementById('nav-admin');
  container.innerHTML = '';

  // Normalize pages data ONCE
  const pageMap = {};
  pagesData.forEach(p => {
    const key = Number(p.R_NAV);
    pageMap[key] = {
      STATUS: Number(p.STATUS) // force numeric
    };
  });

  console.log('Page Map:', pageMap);

  // GROUP BY WEEK
  const weeks = {};
  navData.forEach(item => {
    const week = item.WEEK;
    if (!weeks[week]) weeks[week] = [];
    weeks[week].push(item);
  });

  const sortedWeeks = Object.keys(weeks)
    .sort((a, b) => new Date(a) - new Date(b));

  sortedWeeks.forEach(week => {
    const h3 = document.createElement('h3');
    h3.textContent = week;
    container.appendChild(h3);

    weeks[week]
      .sort((a, b) => a.SORTORDER - b.SORTORDER)
      .forEach(item => {

        const sku = Number(item.SKU);
        const page = pageMap[sku];

        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = `${item.TITLE} `;

        const btn = document.createElement('a');

        if (page) {
          // EXISTING RECORD
          if (page.STATUS === 1) {
            btn.textContent = 'Disable';
            btn.className = 'enabled';
          } else {
            btn.textContent = 'Enable';
            btn.className = 'disabled';
          }

          btn.onclick = () => handleAction(sku, 'toggle');

        } else {
          // NO RECORD
          btn.textContent = 'Create';
          btn.onclick = () => handleAction(sku, 'create');
        }

        div.appendChild(btn);
        container.appendChild(div);
      });
  });

})();
