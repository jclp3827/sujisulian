const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createProcessor } = require('../miniprogram/subpackages/photo/core/process');
const { regions } = require('../miniprogram/subpackages/photo/profiles');
const fixture = path.join(__dirname, 'fixtures/photo-profile-baseline.json');
function pixels(kind, width, height) {
  const data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const face = ((x-width/2)/(width*.3))**2+((y-height*.42)/(height*.3))**2 < 1;
    const rgb = kind === 'solid' ? [255,255,255] : kind === 'gradient' ? [x%256,y%256,(x+y)%256] : kind === 'portrait' ? (face ? [210,165,135] : y > height*.7 ? [30,25,25] : [240,242,246]) : [(x*31+y*17)%256,(x*7+y*43)%256,(x*53+y*11)%256];
    data.set([...rgb,255], i);
  }
  return data;
}
const actual = {};
for (const profileId of Object.keys(JSON.parse(fs.readFileSync(fixture)).hashes)) {
  const p = createProcessor(profileId);
  actual[profileId] = {};
  for (const kind of ['solid','gradient','portrait','detail']) actual[profileId][kind] = p.createCandidate(pixels(kind,p.profile.width,p.profile.height),true).sha256;
}
if (process.argv.includes('--record')) {
  if (fs.existsSync(fixture)) throw Error('Baseline already exists');
  fs.writeFileSync(fixture,JSON.stringify({baseline:'32c4d6deef01c869954959481e43e0480e5afb12',hashes:actual},null,2)+'\n');
} else assert.deepEqual(actual,JSON.parse(fs.readFileSync(fixture)).hashes);
console.log(JSON.stringify({passed:true,profiles:2,exactOutputHashes:8}));
module.exports = { pixels };
