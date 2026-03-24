const OPCODES = {
  0x01: "push",
  0x02: "pop",
  0x03: "add",
  0x04: "sub",
  0x05: "mul",
  0x06: "div",
  0x07: "jmp",
  0x08: "jmp_if"
};

export function decompile(bytecode) {
  let pc = 0;
  const output = [];

  while (pc < bytecode.length) {
    const op = bytecode[pc++];
    const name = OPCODES[op] || "unknown";

    output.push(name + " ; pc=" + pc);
  }

  return output.join("\n");
}