const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// ===== PATH SETUP =====
const ROOT = path.resolve(__dirname, '..'); // /javascript
const FRONTEND = path.join(ROOT, 'frontend');
const DATA = path.join(FRONTEND, 'data');
const TEMPLATES = path.join(FRONTEND, 'jsadmin', 'templates');
const PAGES = path.join(FRONTEND, 'jsadmin', 'pages');

// Serve frontend
app.use(express.static(FRONTEND));

// ===== HELPERS =====
function loadJSON(file) {
  const full = path.join(DATA, file);
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

function saveJSON(file, data) {
  const full = path.join(DATA, file);
  fs.writeFileSync(full, JSON.stringify(data, null, 2));
}

// Ensure folders exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ===== TOGGLE ENABLE/DISABLE =====
app.post('/api/toggle', (req, res) => {
  try {
    const { SKU } = req.body;
    const pages = loadJSON('pages.json');

    const page = pages.find(p => Number(p.R_NAV) === Number(SKU));
    if (!page) return res.status(404).json({ error: 'Page not found' });

    page.STATUS = page.STATUS === 1 ? 0 : 1;
    saveJSON('pages.json', pages);

    res.json({ success: true, status: page.STATUS });
  } catch (err) {
    console.error('Toggle error:', err);
    res.status(500).json({ error: 'Toggle failed' });
  }
});

// ===== CREATE LESSON =====
app.post('/api/create', (req, res) => {
  try {
    const { SKU } = req.body;
    const pages = loadJSON('pages.json');

    if (pages.some(p => Number(p.R_NAV) === Number(SKU))) {
      return res.status(400).json({ error: 'Already exists' });
    }

    ensureDir(PAGES);

    const template = path.join(TEMPLATES, 'lessontemplate.html');
    const newFile = path.join(PAGES, `lesson${SKU}.html`);

    if (!fs.existsSync(template)) {
      return res.status(500).json({
        error: `Template missing: ${template}`
      });
    }

    fs.copyFileSync(template, newFile);

    pages.push({
      SKU: Number(SKU),
      R_NAV: Number(SKU),
      STATUS: 1
    });

    saveJSON('pages.json', pages);

    res.json({ success: true, file: `lesson${SKU}.html` });

  } catch (err) {
    console.error('CREATE ERROR:', err);
    res.status(500).json({
      error: 'Failed to create',
      details: err.message
    });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
  console.log('Templates:', TEMPLATES);
  console.log('Pages:', PAGES);
});
