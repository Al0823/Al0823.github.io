export function parseSprites(reader, chunk) {
  reader.seek(chunk.start);

  const count = reader.u32();
  const sprites = [];

  for (let i = 0; i < count; i++) {
    const nameId = reader.u32();
    const width = reader.u32();
    const height = reader.u32();

    sprites.push({ nameId, width, height });
  }

  return sprites;
}