// parseWorker.js - Web Worker for parsing data.win files
// This runs in a separate thread to prevent UI freezing

self.onmessage = function(e) {
  const { buffer, filename, filesize } = e.data;
  try {
    const parsedData = parseDataWin(new DataView(buffer), filename, filesize);
    self.postMessage({ success: true, parsedData });
  } catch (err) {
    self.postMessage({ success: false, error: err.message });
  }
};

// ─── Parsing functions (copied from main script) ─────────────────────────────

function parseDataWin(dv, filename, filesize) {
  const dec = new TextDecoder();
  const readStr = (offset) => {
    let len = dv.getUint32(offset, true); offset += 4;
    return dec.decode(new Uint8Array(dv.buffer, offset, len));
  };
  const readFourCC = (offset) => dec.decode(new Uint8Array(dv.buffer, offset, 4));

  const magic = readFourCC(0);
  if (magic !== 'FORM') throw new Error(`Not a valid data.win — expected FORM, got "${magic}"`);

  const totalLen = dv.getUint32(4, true);
  const chunks = {};
  const chunkOrder = [];
  let pos = 8;

  while (pos < dv.byteLength - 8) {
    const name = readFourCC(pos);
    const size = dv.getUint32(pos + 4, true);
    if (size === 0 || pos + 8 + size > dv.byteLength) break;
    const data = new DataView(dv.buffer, pos + 8, size);
    chunks[name] = { offset: pos, size, data, raw: new Uint8Array(dv.buffer, pos + 8, size) };
    chunkOrder.push(name);
    pos += 8 + size;
    // align to 4 bytes
    if (pos % 4 !== 0) pos += 4 - (pos % 4);
  }

  const parsed = {};
  for (const name of chunkOrder) {
    try {
      parsed[name] = parseChunk(name, chunks[name].data, dv.buffer);
    } catch (e) {
      console.warn(`Failed to parse ${name}:`, e);
    }
  }

  return { filename, filesize, magic, totalLen, chunks, chunkOrder, parsed };
}

function parseChunk(name, dv, buffer) {
  switch (name) {
    case 'GEN8': return parseGEN8(dv);
    case 'STRG': return parseSTRG(dv);
    case 'SPRT': return parseSPRT(dv);
    case 'SOND': return parseSOND(dv);
    case 'ROOM': return parseROOM(dv);
    case 'OBJT': return parseOBJT(dv);
    case 'SCPT': return parseSCPT(dv);
    case 'TXTR': return parseTXTR(dv, buffer);
    case 'AUDO': return parseAUDO(dv, buffer);
    case 'FONT': return parseFONT(dv);
    case 'BGND': return parseBGND(dv);
    default: return null;
  }
}

// Include all parse functions here...
// (I'll copy them from the main file)

function parseGEN8(dv) {
  const dec = new TextDecoder();
  let pos = 0;
  const version = dv.getUint32(pos, true); pos += 4;
  const debug = dv.getUint32(pos, true); pos += 4;
  const roomWidth = dv.getUint32(pos, true); pos += 4;
  const roomHeight = dv.getUint32(pos, true); pos += 4;
  const fps = dv.getUint32(pos, true); pos += 4;
  return { version, debug, roomWidth, roomHeight, fps };
}

function parseSTRG(dv) {
  const count = dv.getUint32(0, true);
  const strings = [];
  let pos = 4;
  for (let i = 0; i < count; i++) {
    const offset = dv.getUint32(pos, true); pos += 4;
    strings.push(offset);
  }
  return { count, strings };
}

function parseSPRT(dv) {
  const count = dv.getUint32(0, true);
  const sprites = [];
  let pos = 4;
  for (let i = 0; i < count; i++) {
    const name = dv.getUint32(pos, true); pos += 4;
    const x = dv.getUint32(pos, true); pos += 4;
    const y = dv.getUint32(pos, true); pos += 4;
    const w = dv.getUint32(pos, true); pos += 4;
    const h = dv.getUint32(pos, true); pos += 4;
    const bboxLeft = dv.getUint32(pos, true); pos += 4;
    const bboxRight = dv.getUint32(pos, true); pos += 4;
    const bboxTop = dv.getUint32(pos, true); pos += 4;
    const bboxBottom = dv.getUint32(pos, true); pos += 4;
    sprites.push({ name, x, y, w, h, bboxLeft, bboxRight, bboxTop, bboxBottom });
  }
  return { count, sprites };
}

function parseSOND(dv) {
  const count = dv.getUint32(0, true);
  const sounds = [];
  let pos = 4;
  for (let i = 0; i < count; i++) {
    const name = dv.getUint32(pos, true); pos += 4;
    const flags = dv.getUint32(pos, true); pos += 4;
    const type = dv.getUint32(pos, true); pos += 4;
    const file = dv.getUint32(pos, true); pos += 4;
    const volume = dv.getFloat32(pos, true); pos += 4;
    const pitch = dv.getFloat32(pos, true); pos += 4;
    sounds.push({ name, flags, type, file, volume, pitch });
  }
  return { count, sounds };
}

function parseROOM(dv) {
  const count = dv.getUint32(0, true);
  const rooms = [];
  let pos = 4;
  for (let i = 0; i < count; i++) {
    const name = dv.getUint32(pos, true); pos += 4;
    const caption = dv.getUint32(pos, true); pos += 4;
    const width = dv.getUint32(pos, true); pos += 4;
    const height = dv.getUint32(pos, true); pos += 4;
    rooms.push({ name, caption, width, height });
  }
  return { count, rooms };
}

function parseOBJT(dv) {
  const count = dv.getUint32(0, true);
  const objects = [];
  let pos = 4;
  for (let i = 0; i < count; i++) {
    const name = dv.getUint32(pos, true); pos += 4;
    const sprite = dv.getUint32(pos, true); pos += 4;
    const solid = dv.getUint32(pos, true); pos += 4;
    const visible = dv.getUint32(pos, true); pos += 4;
    objects.push({ name, sprite, solid, visible });
  }
  return { count, objects };
}

function parseSCPT(dv) {
  const count = dv.getUint32(0, true);
  const scripts = [];
  let pos = 4;
  for (let i = 0; i < count; i++) {
    const name = dv.getUint32(pos, true); pos += 4;
    const code = dv.getUint32(pos, true); pos += 4;
    scripts.push({ name, code });
  }
  return { count, scripts };
}

function parseTXTR(dv, buffer) {
  const count = dv.getUint32(0, true);
  const textures = [];
  const fullDv = new DataView(buffer);

  const detectImageAt = (ptr) => {
    if (ptr < 0 || ptr + 8 > buffer.byteLength) return null;
    const bytes = new Uint8Array(buffer, ptr, Math.min(32, buffer.byteLength - ptr));
    const isPng = bytes[0]===0x89 && bytes[1]===0x50 && bytes[2]===0x4e && bytes[3]===0x47 &&
                  bytes[4]===0x0d && bytes[5]===0x0a && bytes[6]===0x1a && bytes[7]===0x0a;
    if (isPng) {
      let pos = ptr + 8;
      let pngLen = 0;
      const maxEnd = Math.min(ptr + 32 * 1024 * 1024, buffer.byteLength);
      while (pos + 12 <= maxEnd) {
        const chunkLen = fullDv.getUint32(pos, false);
        const type = String.fromCharCode(...new Uint8Array(buffer, pos + 4, 4));
        pos += 12 + chunkLen;
        if (type === 'IEND') { pngLen = pos - ptr; break; }
        if (chunkLen > 16 * 1024 * 1024) break;
      }
      if (!pngLen && pos > ptr + 8) pngLen = pos - ptr;
      if (!pngLen) pngLen = Math.min(8 * 1024 * 1024, buffer.byteLength - ptr);
      return { type: 'PNG', mime: 'image/png', ext: '.png', len: pngLen };
    }

    const isJpeg = bytes[0]===0xff && bytes[1]===0xd8 && bytes[2]===0xff;
    if (isJpeg) {
      let pos = ptr + 2;
      const maxEnd = Math.min(ptr + 32 * 1024 * 1024, buffer.byteLength);
      while (pos + 1 < maxEnd) {
        if (buffer[pos] === 0xff && buffer[pos+1] === 0xd9) {
          return { type: 'JPEG', mime: 'image/jpeg', ext: '.jpg', len: pos + 2 - ptr };
        }
        pos++;
      }
      return { type: 'JPEG', mime: 'image/jpeg', ext: '.jpg', len: Math.min(8 * 1024 * 1024, buffer.byteLength - ptr) };
    }

    const isGif = bytes[0]===0x47 && bytes[1]===0x49 && bytes[2]===0x46 && bytes[3]===0x38 &&
                  (bytes[4]===0x39 || bytes[4]===0x37) && bytes[5]===0x61;
    if (isGif) {
      let pos = ptr + 6;
      const maxEnd = Math.min(ptr + 32 * 1024 * 1024, buffer.byteLength);
      while (pos < maxEnd) {
        if (buffer[pos] === 0x3b) return { type: 'GIF', mime: 'image/gif', ext: '.gif', len: pos + 1 - ptr };
        pos++;
      }
      return { type: 'GIF', mime: 'image/gif', ext: '.gif', len: Math.min(8 * 1024 * 1024, buffer.byteLength - ptr) };
    }

    const isBmp = bytes[0]===0x42 && bytes[1]===0x4d;
    if (isBmp && ptr + 6 <= buffer.byteLength) {
      const size = fullDv.getUint32(ptr + 2, true);
      if (size > 0 && ptr + size <= buffer.byteLength) return { type: 'BMP', mime: 'image/bmp', ext: '.bmp', len: size };
    }

    const isWebp = bytes[0]===0x52 && bytes[1]===0x49 && bytes[2]===0x46 && bytes[3]===0x46 &&
                   bytes[8]===0x57 && bytes[9]===0x45 && bytes[10]===0x42 && bytes[11]===0x50;
    if (isWebp && ptr + 12 <= buffer.byteLength) {
      const size = fullDv.getUint32(ptr + 4, true);
      if (size > 0 && ptr + 8 + size <= buffer.byteLength) return { type: 'WEBP', mime: 'image/webp', ext: '.webp', len: size + 8 };
      return { type: 'WEBP', mime: 'image/webp', ext: '.webp', len: Math.min(8 * 1024 * 1024, buffer.byteLength - ptr) };
    }

    return null;
  };

  const scanForImage = (base, maxScan = 512) => {
    const start = Math.max(0, Math.min(buffer.byteLength - 16, base));
    const end = Math.min(buffer.byteLength - 16, start + maxScan);
    for (let p = start; p <= end; p++) {
      if (detectImageAt(p)) return p;
    }
    return -1;
  };

  for (let i = 0; i < count && i < 2048; i++) {
    const ptrOff = 4 + i * 4;
    if (ptrOff + 4 > dv.byteLength) break;
    try {
      const absPtr = dv.getUint32(ptrOff, true);
      if (absPtr + 8 > buffer.byteLength) { textures.push({ scaled: 0, dataPtr: -1, dataPtrMode: 'INVALID_ENTRY', rawDataPtr: 0, imageInfo: null, imageData: null }); continue; }

      const scaled = fullDv.getUint32(absPtr, true);
      const rawDataPtr = fullDv.getUint32(absPtr + 4, true);
      const candidates = [
        rawDataPtr,
        rawDataPtr + 4,
        rawDataPtr + 8,
        absPtr + rawDataPtr,
        absPtr + rawDataPtr + 4,
        absPtr + rawDataPtr + 8,
        absPtr + 4,
        absPtr + 8
      ];

      let dataPtr = -1;
      let imageInfo = null;
      let pointerMode = 'UNKNOWN';

      for (const candidate of candidates) {
        if (candidate < 0 || candidate >= buffer.byteLength) continue;
        const info = detectImageAt(candidate);
        if (info) {
          dataPtr = candidate;
          imageInfo = info;
          pointerMode = 'FOUND_DIRECT';
          break;
        }
      }

      if (!imageInfo) {
        const scanBases = [rawDataPtr, rawDataPtr + 4, rawDataPtr + 8, absPtr, absPtr + rawDataPtr, absPtr + 4 + rawDataPtr];
        for (const base of scanBases) {
          if (base < 0 || base >= buffer.byteLength) continue;
          const found = scanForImage(base, 1024);
          if (found >= 0) {
            const info = detectImageAt(found);
            if (info) {
              dataPtr = found;
              imageInfo = info;
              pointerMode = 'FOUND_SCAN';
              break;
            }
          }
        }
      }

      let imageData = null;
      if (imageInfo && dataPtr >= 0 && dataPtr + imageInfo.len <= buffer.byteLength) {
        imageData = new Uint8Array(buffer, dataPtr, imageInfo.len);
      }

      textures.push({ scaled, dataPtr, dataPtrMode: pointerMode, rawDataPtr, imageInfo, imageData });
    } catch (e) {
      textures.push({ scaled: 0, dataPtr: -1, dataPtrMode: 'ERROR', rawDataPtr: 0, imageInfo: null, imageData: null });
    }
  }

  return { count, textures };
}

function parseAUDO(dv, buffer) {
  const count = dv.getUint32(0, true);
  const audios = [];
  let pos = 4;
  for (let i = 0; i < count && i < 2048; i++) {
    const len = dv.getUint32(pos, true); pos += 4;
    if (len > 0 && pos + len <= dv.byteLength) {
      const data = new Uint8Array(dv.buffer, pos, len);
      audios.push({ len, data });
      pos += len;
    } else {
      audios.push({ len, data: null });
    }
  }
  return { count, audios };
}

function parseFONT(dv) {
  const count = dv.getUint32(0, true);
  const fonts = [];
  let pos = 4;
  for (let i = 0; i < count; i++) {
    const name = dv.getUint32(pos, true); pos += 4;
    const size = dv.getUint32(pos, true); pos += 4;
    const bold = dv.getUint32(pos, true); pos += 4;
    const italic = dv.getUint32(pos, true); pos += 4;
    fonts.push({ name, size, bold, italic });
  }
  return { count, fonts };
}

function parseBGND(dv) {
  const count = dv.getUint32(0, true);
  const backgrounds = [];
  let pos = 4;
  for (let i = 0; i < count; i++) {
    const name = dv.getUint32(pos, true); pos += 4;
    const texture = dv.getUint32(pos, true); pos += 4;
    backgrounds.push({ name, texture });
  }
  return { count, backgrounds };
}

// Utility functions
function fmt(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / (1024 * 1024)).toFixed(1) + ' MB';
}

function detectAudioFormat(data) {
  if (!data || data.length < 12) return 'unknown';
  const header = String.fromCharCode(...data.slice(0, 12));
  if (header.startsWith('RIFF') && header.includes('WAVE')) return 'WAV';
  if (header.startsWith('OggS')) return 'OGG';
  if (data[0] === 0xFF && (data[1] & 0xE0) === 0xE0) return 'MP3';
  return 'unknown';
}