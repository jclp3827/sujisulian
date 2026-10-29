#!/usr/bin/env node
const assert = require("node:assert/strict");
const { createController } = require("../miniprogram/subpackages/photo/process/controller");

async function check(destination, ai) {
  let shares = 0, authorizations = 0;
  const page = createController({}, {}, Date);
  page.setData = values => Object.assign(page.data, values);
  page._alive = true; page._revision = 1;
  page._processor = { profile: { id: "test", exportFileName: "报名照片.jpg" } };
  page._candidate = { revision: 1, generated: { profileId: "test" }, record: { path: "photo.jpg" }, zipRecord: { path: "photo.zip" }, aiResult: ai ? { id: "paid" } : null };
  page._files = { share(record, name, current) { assert(current()); shares++; assert.equal(record.path, destination === "zip" ? "photo.zip" : "photo.jpg"); return Promise.resolve(); } };
  page._preview = { authorizeExport: async () => { authorizations++; return true; }, hasEntitlement: () => true,
    summary: () => ({ remaining: 3, paid: !!ai, paymentPending: false }), evidence: () => [] };
  page.data.allowed = true; page.data.contentConfirmed = true; page.data.canShare = true; page.data.stage = "result";
  await (destination === "zip" ? page.openZipGuide() : page.openJpgGuide());
  assert.equal(shares, 0, "opening the guide must not send a file");
  assert.equal(page.data.exportGuideOpen, true);
  const pending = page.confirmExportGuide();
  assert.equal(shares, 1, "confirm button must invoke sharing before yielding");
  await pending;
  assert.equal(authorizations, ai ? 1 : 0, "AI entitlement is checked before the confirmation tap");
  assert.equal(page.data.exportGuideOpen, false);
  assert.equal(page._candidate.sent, true);
}

async function main() {
  await check("zip", false);
  await check("file", false);
  await check("zip", true);
  let shares = 0, authorizations = 0, purchases = 0;
  const page = createController({}, {}, Date);
  page.setData = values => Object.assign(page.data, values);
  page._alive = true; page._revision = 1;
  page._processor = { profile: { id: "test" } };
  page._candidate = { revision: 1, generated: { profileId: "test" }, record: { path: "photo.jpg" }, zipRecord: { path: "photo.zip" }, aiResult: { id: "locked" } };
  page._files = { share() { shares++; return Promise.resolve(); } };
  page._preview = { authorizeExport: async () => ++authorizations > 1, hasEntitlement: () => purchases === 1,
    summary: () => ({ remaining: 3, paid: purchases === 1, paymentPending: false }), evidence: () => [] };
  page.purchaseAi = async () => { purchases++; return true; };
  Object.assign(page.data, { allowed: true, contentConfirmed: true, canShare: true, stage: "result" });
  await page.openZipGuide();
  assert.equal(purchases, 1);
  assert.equal(authorizations, 2);
  assert.equal(shares, 0, "purchase must not send automatically");
  const pending = page.confirmExportGuide();
  assert.equal(shares, 1, "paid result is sent only on the next explicit tap");
  await pending;
  console.log(JSON.stringify({ passed: true, freeZip: true, freeJpg: true, aiZip: true, purchaseThenExplicitShare: true, shareSynchronousOnConfirm: true }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
