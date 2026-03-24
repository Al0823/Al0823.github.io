export class Reader {
  constructor(buffer) {
    this.buffer = buffer;
    this.view = new DataView(buffer);
    this.offset = 0;
  }

  seek(offset) {
    this.offset = offset;
  }

  u8() {
    return this.view.getUint8(this.offset++);
  }

  u32() {
    const val = this.view.getUint32(this.offset, true);
    this.offset += 4;
    return val;
  }

  str(len) {
    let out = "";
    for (let i = 0; i < len; i++) {
      out += String.fromCharCode(this.u8());
    }
    return out;
  }
}