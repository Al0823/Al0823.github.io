(async function() {
  const navResponse = await fetch('../../data/nav.json');
  const navData = await navResponse.json();

  const pagesResponse = await fetch('../../data/pages.json');
  const pagesData = await pagesResponse.json();

  const adminDiv = document.getElementById('nav-admin');

  function render() {
    adminDiv.innerHTML = '';

    // Group nav items by WEEK
    const weeks = {};
    navData.forEach(item => {
      if (!weeks[item.WEEK]) weeks[item.WEEK] = [];
      weeks[item.WEEK].push(item);
    });

    // Sort weeks by date ascending
    Object.keys(weeks).sort((a, b) => new Date(a) - new Date(b)).forEach(week => {
      const weekHeader = document.createElement('h3');
      weekHeader.textContent = `Week: ${week}`;
      adminDiv.appendChild(weekHeader);

      // Sort items within the week
      weeks[week].sort((a, b) => a.SORTORDER - b.SORTORDER).forEach(item => {
    // Fix: cast SKU to number for matching
    const page = pagesData.find(p => p.R_NAV === Number(item.SKU));

    const div = document.createElement('div');
    div.className = 'item';

    if (page) {
        div.innerHTML = `
          <span>${item.TITLE}</span>
          <a class="${page.STATUS ? 'enabled' : 'disabled'}" data-sku="${item.SKU}" data-action="toggle">
            ${page.STATUS ? 'Disable' : 'Enable'}
          </a>
        `;
    } else {
        div.innerHTML = `
          <span>${item.TITLE}</span>
          <a data-sku="${item.SKU}" data-action="create">Create</a>
        `;
    }

    adminDiv.appendChild(div);
});
    });

    // Attach click listeners
    adminDiv.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', e => {
        const sku = parseInt(link.dataset.sku);
        const action = link.dataset.action;
        handleAction(sku, action);
      });
    });
  }

  function handleAction(sku, action) {
    const pageIndex = pagesData.findIndex(p => p.R_NAV === sku);

    if (action === 'toggle') {
      if (pageIndex >= 0) {
        pagesData[pageIndex].STATUS = pagesData[pageIndex].STATUS ? 0 : 1;
      }
    } else if (action === 'create') {
      if (pageIndex < 0) {
        pagesData.push({ SKU: sku, R_NAV: sku, STATUS: 1 });
      }
    }

    render(); // Refresh admin
  }

  // Download updated pages.json
  document.getElementById('download-json').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(pagesData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pages.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  render();
})();
