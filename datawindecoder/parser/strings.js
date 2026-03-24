export function parseStrings(reader, chunk) {
  reader.seek(chunk.start);

  const count = reader.u32();
  const strings = [];

  for (let i = 0; i < count; i++) {
    const len = reader.u32();
    strings.push(reader.str(len));
  }

  return strings;
}