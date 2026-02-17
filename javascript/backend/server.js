// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

// ------------------- Paths -------------------
// Folder containing lesson templates
const TEMPLATES = path.join(__dirname, '../frontend/templates');
console.log('Templates:', TEMPLATES);

// Data files
const NAV_JSON = path.join(__dirname, '../frontend/data/nav.json');
const PAGES_JSON = path.join(__dirname, '../frontend/data/pages.json');

// GitHub environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

if (!GITHUB_TOKEN || !GITHUB_REPO) {
  console.warn('⚠️ GitHub token or repo not set in environment variables!');
}

// ------------------- Helper Functions -------------------

async function pushFileToGitHub(filePath, commitMessage) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');

  const content = fs.readFileSync(filePath, 'utf-8');
  const encoded = Buffer.from(content).toString('base64');

  try {
    // Check if file exists in repo
    let sha;
    try {
      const resp = await axios.get(`https://api.github.com/repos/${GITHUB_REPO}/contents/${relativePath}?ref=${GITHUB_BRANCH}`, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
      });
      sha = resp.data.sha;
    } catch (err) {
      // File does not exist, will create
    }

    await axios.put(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${relativePath}`,
      {
        message: commitMessage,
        content: encoded,
        branch: GITHUB_BRANCH,
        sha: sha
      },
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );

    console.log('✅ Pushed file to GitHub:', relativePath);
  } catch (err) {
    console.error('❌ GitHub push failed for', relativePath, err.message);
    throw err;
  }
}

// ------------------- Routes -------------------

// Create a lesson
app.post('/create', async (req, res) => {
  const { sku } = req.body;
  if (!sku) return res.status(400).json({ error: 'Missing SKU' });

  try {
    const lessonFile = path.join(__dirname, `../frontend/jsadmin/pages/lesson${sku}.html`);
    const templateFile = path.join(TEMPLATES, 'lessontemplate.html');

    // Copy template
    fs.copyFileSync(templateFile, lessonFile);

    // Update pages.json
    const pages = JSON.parse(fs.readFileSync(PAGES_JSON, 'utf-8'));
    const exists = pages.find(p => p.SKU === Number(sku));
    if (!exists) {
      pages.push({ SKU: Number(sku), R_NAV: Number(sku), STATUS: 1 });
    }
    fs.writeFileSync(PAGES_JSON, JSON.stringify(pages, null, 2));

    // Push lesson + pages.json to GitHub
    await pushFileToGitHub(lessonFile, `Create lesson ${sku}`);
    await pushFileToGitHub(PAGES_JSON, `Update pages.json after creating lesson ${sku}`);

    res.json({ success: true, message: `Lesson ${sku} created` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create lesson' });
  }
});

// Enable / disable a lesson
app.post('/toggle', async (req, res) => {
  const { sku, action } = req.body;
  if (!sku || !action) return res.status(400).json({ error: 'Missing SKU or action' });

  try {
    const pages = JSON.parse(fs.readFileSync(PAGES_JSON, 'utf-8'));
    const record = pages.find(p => p.SKU === Number(sku));
    if (!record) return res.status(404).json({ error: 'Lesson not found' });

    record.STATUS = action === 'enable' ? 1 : 0;

    fs.writeFileSync(PAGES_JSON, JSON.stringify(pages, null, 2));

    await pushFileToGitHub(PAGES_JSON, `Set lesson ${sku} to ${action}`);

    res.json({ success: true, message: `Lesson ${sku} ${action}d` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to toggle lesson' });
  }
});

// ------------------- Start Server -------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
