#!/usr/bin/env node
// Build the existing single SCF locally. Node built-ins only: no npm install.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
function assemble(target) {
  target = path.resolve(target);
  if (fs.existsSync(target)) throw new Error('Build target must be a new directory');
  fs.mkdirSync(path.join(target, 'shared'), { recursive: true });
  const files = [];
  function copy(source, destination) {
    const data = fs.readFileSync(path.join(root, source)); fs.writeFileSync(path.join(target, destination), data);
    files.push({ source, path: destination, sha256: crypto.createHash('sha256').update(data).digest('hex') });
  }
  for (const name of ['index.js', 'purchase.js', 'preview.js']) copy('scf/photo-segment/' + name, name);
  for (const name of ['wechat-identity.js', 'virtual-payment.js', 'providers.js', 'request-budget.js']) copy('cloudfunctions/photoAi/' + name, 'shared/' + name);
  copy('scf/photo-orders/notify.js', 'shared/notify.js');
  const manifest = { entry: 'index.main_handler', runtime: 'Nodejs18.15', dependencies: [], existingFunction: 'photo-segment-scf', networkUsed: false, deployed: false, files };
  fs.writeFileSync(path.join(target, 'source-manifest.json'), JSON.stringify(manifest, null, 2) + '\n'); return manifest;
}
if (require.main === module) console.log(JSON.stringify(assemble(process.argv[2])));
module.exports = { assemble };
