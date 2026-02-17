// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

// Paths
const FRONTEND_DIR = path.join(__dirname, '../frontend');
const DATA_DIR = path.join(FRONTEND_DIR, 'data');
const TEMPLATES_DIR = path.join(FRONTEND_DIR, 'templates');
const PAGES_DIR = path.join(FRONTEND_DIR, 'jsadmin/pages');
const INCLUDES_DIR = path.join(FRONTEND_DIR, 'includes');

// Serve frontend static files
app.use('/data', express.static(DATA_DIR));
app.use('/templates', express.static(TEMPLATES_DIR));
app.use('/includes', express.static(INCLUDES_DIR));
app.use('/jsadmin/pages', express.static(PAGES_DIR));

// Utility functions
function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// CREATE lesson
app.post('/create', (req, res) => {
  try {
    const { sku } = req.body;
    if (!sku) return res.status(400).send('SKU missing');

    const pagesFile = path.join(DATA_DIR, 'pages.json');
    let pagesData = readJSON(pagesFile);

    if (pagesData.find(p => p.R_NAV === Number(sku))) {
      return res.status(400).send('Lesson already exists');
    }

    const templateFile = path.join(TEMPLATES_DIR, 'lessontemplate.html');
    const newLessonFile = path.join(PAGES_DIR, `lesson${sku}.html`);

    if (!fs.existsSync(templateFile)) return res.status(500).send('Template not found');

    fs.copyFileSync(templateFile, newLessonFile);

    const newRecord = { SKU: Number(sku), R_NAV: Number(sku), STATUS: 1 };
    pagesData.push(newRecord);
    writeJSON(pagesFile, pagesData);

    res.send('Lesson created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

// TOGGLE Enable/Disable
app.post('/toggle', (req, res) => {
  try {
    const { sku, status } = req.body;
    if (sku === undefined || status === undefined) return res.status(400).send('Missing data');

    const pagesFile = path.join(DATA_DIR, 'pages.json');
    let pagesData = readJSON(pagesFile);

    const page = pagesData.find(p => p.R_NAV === Number(sku));
    if (!page) return res.status(404).send('Lesson not found');

    page.STATUS = Number(status);
    writeJSON(pagesFile, pagesData);

    res.send('Status updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

// Fallback route for testing
app.get('/', (req, res) => {
  res.send('JS Wiki Backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
