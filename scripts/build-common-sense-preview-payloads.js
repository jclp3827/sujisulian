#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const models = path.join(root, "miniprogram/subpackages/common-sense/models");
const names = ["learning-pack", "guide-expansion-candidate", "note-common-sense"];
const check = process.argv.includes("--check");
const sizes = {};

for (const name of names) {
  const source = path.join(models, `${name}.js`);
  delete require.cache[require.resolve(source)];
  const json = Buffer.from(JSON.stringify(require(source)), "utf8");
  const compressed = zlib.deflateSync(json, { level: 9 });
  const payload = {
    codec: "deflate-base64-v1",
    sourceSha256: crypto.createHash("sha256").update(json).digest("hex"),
    data: compressed.toString("base64"),
  };
  const output = `module.exports=${JSON.stringify(payload)};\n`;
  const target = path.join(models, `packed-${name}.js`);
  if (check) {
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== output) {
      throw new Error(`${name} 压缩包与正式数据不一致，请重新生成`);
    }
  } else fs.writeFileSync(target, output);
  sizes[name] = { sourceBytes: fs.statSync(source).size, packedBytes: Buffer.byteLength(output) };
}

console.log(JSON.stringify({ passed: true, check, sizes }));
