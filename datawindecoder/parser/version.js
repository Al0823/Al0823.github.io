export function detectVersion(view) {
  const magic = String.fromCharCode(
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3)
  );

  const version = view.getUint32(4, true);

  return { magic, version };
}