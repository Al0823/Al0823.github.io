// nav-admin.js
const BACKEND_URL = 'https://your-backend-service.onrender.com'; // <-- replace with your Render URL
const NAV_JSON = '/javascript/frontend/data/nav.json';
const PAGES_JSON = '/javascript/frontend/data/pages.json';
const ADMIN_DIV = document.getElementById('nav-admin');

async function loadData() {
  try {
    const [navResp, pagesResp] = await Promise.all([
      fetch(NAV_JSON),
      fetch(PAGES_JSON)
    ]);

    const nav = await navResp.json();
    const pages = await pagesResp.json();

    // Group nav items by WEEK
    const weeks = {};
    nav.forEach(item => {
      if (!weeks[item.WEEK]) weeks[item.WEEK] = [];
      weeks[item.WEEK].push(item);
    });

    // Sort weeks chronologically
    const sortedWeeks = Object.keys(weeks).sort((a, b) => new Date(a) - new Date(b));

    // Clear admin div
    ADMIN_DIV.innerHTML = '';

    sortedWeeks.forEach(week => {
      const weekDiv = document.createElement('div');
      weekDiv.innerHTML = `<h3>${week}</h3>`;

      // Sort items by SORTORDER
      weeks[week].sort((a, b) => a.SORTORDER - b.SORTORDER);

      weeks[week].forEach(item => {
        const page = pages.find(p => p.SKU === Number(item.SKU));
        let buttonLabel, buttonClass;

        if (!page) {
          buttonLabel = 'Create';
          buttonClass = '';
        } else if (page.STATUS === 1) {
          buttonLabel = 'Disable';
          buttonClass = 'disabled';
        } else {
          buttonLabel = 'Enable';
          buttonClass = 'enabled';
        }

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.innerHTML = `
          <strong>${item.TITLE}</strong>
          <button class="${buttonClass}" data-sku="${item.SKU}" data-action="${buttonLabel.toLowerCase()}">${buttonLabel}</button>
        `;
        weekDiv.appendChild(itemDiv);
      });

      ADMIN_DIV.appendChild(weekDiv);
    });

    // Attach button events
    ADMIN_DIV.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sku = btn.getAttribute('data-sku');
        const action = btn.getAttribute('data-action');

        btn.disabled = true;
        btn.textContent = 'Processing...';

        try {
          const endpoint = action === 'create'
            ? `${BACKEND_URL}/create`
            : `${BACKEND_URL}/toggle`;

          const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sku, action })
          });

          const data = await resp.json();

          if (data.success) {
            await loadData(); // Reload admin after change
          } else {
            alert('Error: ' + data.message);
            btn.disabled = false;
            btn.textContent = action.charAt(0).toUpperCase() + action.slice(1);
          }
        } catch (err) {
          console.error(err);
          alert('Request failed. Make sure the backend is running and accessible.');
          btn.disabled = false;
          btn.textContent = action.charAt(0).toUpperCase() + action.slice(1);
        }
      });
    });

  } catch (err) {
    console.error('Failed to load data:', err);
    ADMIN_DIV.innerHTML = '<p style="color:red;">Failed to load admin data. Check console.</p>';
  }
}

// Initial load
loadData();
