import JSZip from "jszip";

export async function exportZip(files) {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.name, file.data);
  }

  const blob = await zip.generateAsync({ type: "blob" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "decoded.zip";
  a.click();
}