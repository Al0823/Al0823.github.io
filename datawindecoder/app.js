import { Reader } from "/parser/core.js";
import { detectVersion } from "/parser/version.js";
import { readChunks } from "/parser/chunks.js";
import { exportJSON } from "/export/json.js";
import { exportZip } from "/export/zip.js";

let gameData = null;

document.getElementById("file").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const buffer = await file.arrayBuffer();

  const view = new DataView(buffer);
  const reader = new Reader(buffer);

  const version = detectVersion(view);
  const chunks = readChunks(reader);

  gameData = { version, chunks };

  // 🔽 SHOW SOMETHING ON SCREEN
  const output = document.getElementById("output");

  let text = "";
  text += "Version:\n" + JSON.stringify(version, null, 2) + "\n\n";
  text += "Chunks Found:\n";

  for (const name in chunks) {
    const c = chunks[name];
    text += `${name} → start: ${c.start}, size: ${c.size}\n`;
  }

  output.textContent = text;
});

document.getElementById("export-json").onclick = () => {
  exportJSON(gameData);
};

document.getElementById("export-zip").onclick = async () => {
  const files = [
    { name: "data.json", data: JSON.stringify(gameData, null, 2) }
  ];

  await exportZip(files);
};