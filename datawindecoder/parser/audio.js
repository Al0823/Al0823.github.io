export function parseAudio(reader, chunk) {
  reader.seek(chunk.start);

  const count = reader.u32();
  const audio = [];

  for (let i = 0; i < count; i++) {
    const id = reader.u32();
    const size = reader.u32();

    const data = new Uint8Array(reader.buffer, reader.offset, size);
    reader.seek(reader.offset + size);

    audio.push({ id, data });
  }

  return audio;
}