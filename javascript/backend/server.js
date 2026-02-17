const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Paths
const DATA_PATH = path.join(__dirname, '../frontend/data');
const TEMPLATES_PATH = path.join(__dirname, '../frontend/jsadmin/templates');
const PAGES_PATH = path.join(__dirname, '../frontend/jsadmin/pages');

// Helper to load JSON
function loadJSON(filename) {
  return JSON.parse(fs.readFileSync(path.join(DATA_PATH, filename)));
}

// Helper to save JSON
function saveJSON(filename, data) {
  fs.writeFileSync(path.join(DATA_PATH, filename), JSON.stringify(data, null, 2));
}

// Toggle status
app.post('/api/toggle', (req, res) => {
  const { SKU } = req.body;
  const pages = loadJSON('pages.json');
  const page = pages.find(p => Number(p.R_NAV) === Number(SKU));
  if (!page) return res.status(404).json({ error: 'Page not found' });

  page.STATUS = page.STATUS === 1 ? 0 : 1;
  saveJSON('pages.json', pages);
  res.json({ success: true, status: page.STATUS });
});

// Create lesson from template
app.post('/api/create', (req, res) => {
  const { SKU } = req.body;
  const pages = loadJSON('pages.json');

  // Skip if already exists
  if (pages.some(p => Number(p.R_NAV) === Number(SKU))) {
    return res.status(400).json({ error: 'Page already exists' });
  }

  // Copy template file
  const templateFile = path.join(TEMPLATES_PATH, 'lessontemplate.html');
  const newFile = path.join(PAGES_PATH, `lesson${SKU}.html`);

  try {
    fs.copyFileSync(templateFile, newFile);

    // Append new record in pages.json
    pages.push({
      SKU: Number(SKU),
      R_NAV: Number(SKU),
      STATUS: 1
    });
    saveJSON('pages.json', pages);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
