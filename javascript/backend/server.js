// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const simpleGit = require('simple-git');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

// Paths
const FRONTEND_DIR = path.join(__dirname, '../frontend');
const PAGES_JSON = path.join(FRONTEND_DIR, 'data/pages.json');
const NAV_JSON = path.join(FRONTEND_DIR, 'data/nav.json');
const TEMPLATE_DIR = path.join(FRONTEND_DIR, 'templates');
const LESSONS_DIR = path.join(FRONTEND_DIR, 'jsadmin/pages'); // new lessons go here

// Git setup
const git = simpleGit(FRONTEND_DIR);

// Serve frontend static files
app.use('/jsadmin/pages', express.static(path.join(FRONTEND_DIR, 'jsadmin/pages')));
app.use('/javascript/frontend', express.static(FRONTEND_DIR));

// Helper to read JSON
function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Helper to write JSON
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// API: Toggle STATUS
app.post('/toggle', (req, res) => {
  const { sku, action } = req.body;
  const pages = readJSON(PAGES_JSON);
  const page = pages.find(p => p.SKU === Number(sku));

  if (!page) return res.json({ success: false, message: 'Page not found' });

  if (action === 'enable') page.STATUS = 1;
  else if (action === 'disable') page.STATUS = 0;
  else return res.json({ success: false, message: 'Invalid action' });

  writeJSON(PAGES_JSON, pages);

  // Commit changes
  git.add('data/pages.json')
    .then(() => git.commit(`Update STATUS for SKU ${sku}`))
    .then(() => git.push())
    .then(() => res.json({ success: true }))
    .catch(err => res.json({ success: false, message: err.message }));
});

// API: Create new lesson
app.post('/create', (req, res) => {
  const { sku } = req.body;
  const nav = readJSON(NAV_JSON);
  const pages = readJSON(PAGES_JSON);
  const item = nav.find(n => n.SKU === Number(sku));
  if (!item) return res.json({ success: false, message: 'Nav item not found' });

  const templatePath = path.join(TEMPLATE_DIR, 'lessontemplate.html');
  const newLessonPath = path.join(LESSONS_DIR, `lesson${sku}.html`);

  if (!fs.existsSync(templatePath)) return res.json({ success: false, message: 'Template missing' });

  fs.copyFileSync(templatePath, newLessonPath);

  // Add to pages.json
  pages.push({ SKU: Number(sku), R_NAV: Number(sku), STATUS: 1 });
  writeJSON(PAGES_JSON, pages);

  // Commit new lesson and pages.json
  git.add([newLessonPath, 'data/pages.json'])
    .then(() => git.commit(`Create lesson ${sku}`))
    .then(() => git.push())
    .then(() => res.json({ success: true }))
    .catch(err => res.json({ success: false, message: err.message }));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
