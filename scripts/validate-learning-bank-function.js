const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { main } = require('../cloudfunctions/learningBank');
const data = path.join(__dirname, '..', 'cloudfunctions', 'learningBank', 'data');
const manifest = require(path.join(data, 'manifest.json'));

async function validate() {
  const expectedCounts = { 'note-practice': 142, 'note-memory': 133,
    'common-question': 603, 'common-mnemonic': 128, 'common-guide': 1681 };
  for (const [bankName, bank] of Object.entries(manifest.banks)) {
    assert.equal(bank.count, expectedCounts[bankName], `${bankName} public admission drift`);
    assert.equal(bank.index.length, bank.count);
    const all = new Map();
    for (const index of bank.index) {
      const shard = JSON.parse(fs.readFileSync(path.join(data, bankName, `${index.file}.json`), 'utf8'));
      const item = shard.find((entry) => entry.id === index.id);
      assert.ok(item, `${bankName}/${index.id} missing from shard`);
      assert.equal(Buffer.byteLength(JSON.stringify(item)), index.bytes);
      all.set(item.id, item);
    }
    assert.equal(all.size, bank.count);
    if (bankName === 'common-guide') {
      const bootstrap = await main({ action: 'bootstrap', bank: bankName, mode: 'guide' });
      assert.equal(bootstrap.ok, true);
      assert.equal(bootstrap.content.cardSignatures.length, bank.count);
      assert.equal(bootstrap.content.groups.length, 170);
      assert.deepEqual(bootstrap.content.groups.flatMap((group) => group.cardIds), bank.index.map((item) => item.id));
      assert.ok(bootstrap.prefetched.length > 0 && bootstrap.prefetched.length <= 5);
    }
    if (bankName === 'common-question') {
      const bootstrap = await main({ action: 'bootstrap', bank: bankName, mode: 'qa' });
      assert.equal(bootstrap.ok, true);
      assert.equal(bootstrap.content.questions.length, bank.count);
      assert.equal(bootstrap.content.mnemonics.length, 128);
    }
    for (const mode of Object.keys(bank.modes)) {
      const catalog = await main({ action: 'catalog', bank: bankName, mode, offset: 0 });
      assert.equal(catalog.ok, true);
      assert.ok(catalog.items.length <= 100);
      assert.equal(catalog.total, bank.modes[mode].length);
      const started = await main({ action: 'start', bank: bankName, mode, count: 15 });
      assert.equal(started.ok, true, `${bankName}/${mode} start failed`);
      assert.ok(started.items.length > 0 && started.items.length <= 5);
      assert.ok(started.payloadBytes <= 64 * 1024);
      assert.deepEqual(started.items.map((item) => item.id), started.session.ids.slice(0, started.items.length));
      let offset = started.nextOffset;
      while (offset < started.session.ids.length) {
        const batch = await main({ action: 'batch', bank: bankName, mode,
          session: started.session, version: started.version, offset });
        assert.equal(batch.ok, true, `${bankName}/${mode} batch failed`);
        assert.ok(batch.items.length > 0 && batch.items.length <= 5);
        assert.ok(batch.payloadBytes <= 64 * 1024);
        batch.items.forEach((item, position) => {
          assert.deepEqual(item, all.get(started.session.ids[offset + position]));
        });
        offset = batch.nextOffset;
      }
      assert.equal(offset, started.session.ids.length);
      const bad = await main({ action: 'batch', bank: bankName, mode,
        session: started.session, version: 'old', offset: 0 });
      assert.equal(bad.code, 'VERSION_CHANGED');
      const hydrated = await main({ action: 'hydrate', bank: bankName, mode,
        version: started.version, ids: started.session.ids.slice(0, 2) });
      assert.equal(hydrated.ok, true);
      assert.deepEqual(hydrated.items.map((item) => item.id), started.session.ids.slice(0, 2));
      if (bankName === 'note-practice') {
        const resumed = await main({ action: 'resume', bank: bankName, mode,
          ids: started.session.ids, scope: {} });
        assert.equal(resumed.ok, true);
        assert.deepEqual(resumed.items.map((item) => item.id), started.session.ids.slice(0, resumed.items.length));
      }
    }
  }
  console.log('Learning bank: 5 public banks, all modes, 5-item batches and version checks passed');
}
validate().catch((error) => { console.error(error); process.exitCode = 1; });
