const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const PAGES_JSON = path.join(__dirname, '../../frontend/data/pages.json');
const TEMPLATE_HTML = path.join(__dirname, '../../frontend/jsadmin/pages/lessontemplate.html');
const LESSONS_DIR = path.join(__dirname, '../../frontend/jsadmin/pages/');

app.post('/api/create-lesson', (req, res) => {
  const { sku } = req.body;
  if (!sku) return res.status(400).json({ error: 'SKU required' });

  const lessonFile = path.join(LESSONS_DIR, `lesson${sku}.html`);

  fs.copyFile(TEMPLATE_HTML, lessonFile, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to copy template' });

    fs.readFile(PAGES_JSON, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Failed to read pages.json' });

      let pages = JSON.parse(data);
      const exists = pages.find(p => p.R_NAV === Number(sku));
      if (!exists) {
        pages.push({ SKU: Number(sku), R_NAV: Number(sku), STATUS: 1 });
      }

      fs.writeFile(PAGES_JSON, JSON.stringify(pages, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Failed to write pages.json' });

        res.json({ success: true, lessonFile: `lesson${sku}.html` });
      });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
