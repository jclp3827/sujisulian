#!/usr/bin/env node
// Experimental home projection. Keep this out of main until the PoC is reviewed.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
global.wx = { base64ToArrayBuffer(value) {
  const bytes = Buffer.from(value, 'base64');
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
} };
const full = require(path.join(root, 'miniprogram/services/knowledge-platform/politics-runtime')).knowledgePackage;
const bank = require(path.join(root, 'miniprogram/services/knowledge-platform/politics-practice-bank'));
const pick = (object, keys) => Object.fromEntries(keys.filter(key => Object.hasOwn(object, key)).map(key => [key, object[key]]));
const knowledgePackage = pick(full, ['schemaVersion', 'sourceSchemaVersion', 'packageVersion', 'moduleProfile', 'navigationNodes', 'relations', 'contrastPairs', 'quickPrimers', 'contentCoverage', 'buildTarget', 'recallRevisionCompatibility']);
knowledgePackage.knowledgeUnits = full.knowledgeUnits.map(unit => ({
  ...pick(unit, ['id', 'title', 'summary', 'contentVersion', 'navigationNodeId', 'navigationPathIds', 'order', 'relationIds', 'recallItemIds']),
  blocks: unit.blocks.map(block => ({ id: block.id })),
}));
knowledgePackage.recallItems = full.recallItems.map(item => pick(item, ['id', 'pointId', 'contentVersion']));
knowledgePackage.sourceReferences = full.sourceReferences.map(item => ({ id: item.id }));
knowledgePackage.knowledgeAtomRefs = full.knowledgeAtomRefs.map(item => pick(item, ['id', 'pointId', 'sourceBlockIds']));
knowledgePackage.indexes = pick(full.indexes, ['rootNavigationIds', 'relationIdsByPointId', 'recallItemIdsByPointId']);
knowledgePackage.idMigrations = [];
knowledgePackage.retiredRecallCards = [];
const practiceBank = pick(bank, ['schemaVersion', 'id', 'bankVersion', 'applicationBankVersion', 'recallBankVersion', 'curriculumVersion', 'sessionPolicy']);
practiceBank.items = bank.items.map(item => ({ ...pick(item, ['id', 'kind', 'contentVersion', 'scope', 'order', 'subtype']), options: (item.options || []).map(() => null) }));
for (const key of ['groups', 'applicationGroups', 'recallGroups']) {
  practiceBank[key] = bank[key].map(group => pick(group, ['id', 'kind', 'itemIds', 'contentVersion', 'scope', 'order', 'objectiveIds']));
}
practiceBank.applicationItems = practiceBank.items.filter(item => item.kind === 'application');
practiceBank.recallItems = practiceBank.items.filter(item => item.kind === 'recall');
const value = { knowledgePackage, practiceBank };
const json = JSON.stringify(value);
const payload = { codec: 'deflate-base64-v1', sourceSha256: crypto.createHash('sha256').update(json).digest('hex'), data: zlib.deflateSync(json, { level: 9 }).toString('base64') };
const output = `module.exports=${JSON.stringify(payload)};\n`;
const target = path.join(root, 'miniprogram/models/packed-politics-home-snapshot-poc.js');
if (process.argv.includes('--check')) {
  if (fs.readFileSync(target, 'utf8') !== output) throw new Error('Experimental home projection is stale');
} else fs.writeFileSync(target, output);
console.log(JSON.stringify({ sourceBytes: Buffer.byteLength(json), packedBytes: Buffer.byteLength(output), knowledgePackageVersion: full.packageVersion, practiceBankVersion: bank.bankVersion, check: process.argv.includes('--check') }));
