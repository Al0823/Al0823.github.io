export function readChunks(reader) {
  const chunks = {};

  while (reader.offset < reader.buffer.byteLength) {
    const name = reader.str(4);
    const size = reader.u32();
    const start = reader.offset;

    chunks[name] = {
      start,
      size,
      end: start + size
    };

    reader.seek(start + size);
  }

  return chunks;
}