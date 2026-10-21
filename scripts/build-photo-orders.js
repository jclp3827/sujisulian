#!/usr/bin/env node
// Local assembly only. Does not install dependencies, deploy or invoke a service.
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const root = path.resolve(__dirname, "..");
const shared = ["orders.js", "mysql-repository.js", "bda-provider.js", "virtual-payment.js", "wechat-identity.js",
  "configuration.js", "request-budget.js", "providers.js", "push.js", "maintenance-authority.js"];
function assemble(target) {
  target = path.resolve(target);
  if (fs.existsSync(target)) throw new Error("Build target must be a new directory");
  fs.mkdirSync(path.join(target, "shared"), { recursive: true });
  const files = [];
  function copy(source, destination) {
    const data = fs.readFileSync(path.join(root, source)); fs.writeFileSync(path.join(target, destination), data);
    files.push({ source, path: destination, sha256: crypto.createHash("sha256").update(data).digest("hex") });
  }
  for (const name of ["index.js", "notify.js", "persistence.js", "schema.sql"]) copy("scf/photo-orders/" + name, name);
  for (const name of shared) copy("cloudfunctions/photoAi/" + name, "shared/" + name);
  // Independent lock: no CloudBase/wx SDK or legacy COS dependency is needed.
  for (const name of ["package.json", "package-lock.json"]) copy("scf/photo-orders/" + name, name);
  const manifest = { entry: "index.main_handler", runtime: "Nodejs18.15", networkUsed: false, deployed: false, files };
  fs.writeFileSync(path.join(target, "source-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}
if (require.main === module) {
  if (process.argv.length !== 3) throw new Error("Usage: node scripts/build-photo-orders.js /new/local/directory");
  console.log(JSON.stringify(assemble(process.argv[2])));
}
module.exports = { assemble };
