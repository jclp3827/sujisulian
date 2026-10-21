#!/usr/bin/env node
// Actual pinned SDK serialization with a local transport, NOT a cloud DB test.
const assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const { createRequire } = require("node:module");
const server = path.resolve(__dirname, "../cloudfunctions/photoAi");
const sdkRequire = createRequire(path.join(path.resolve(process.env.PHOTO_SDK_ROOT || server), "package.json"));
const { Db } = sdkRequire("@cloudbase/database");
const { EJSON } = sdkRequire("bson");
assert.equal(sdkRequire("@cloudbase/node-sdk/package.json").version, require(path.join(server, "package.json")).dependencies["@cloudbase/node-sdk"]);
const disk = new Map(), writes = [], listReplies = [], listQueries = [], recentQueries = []; let transaction = 0, errorOn = null;
Db.reqClass = class {
  async send(action, p = {}) {
    if (errorOn === action) return { code: "TEST_DATABASE_FAILURE" };
    if (action === "database.startTransaction") return { transactionId: "local-" + ++transaction };
    if (["database.commitTransaction", "database.abortTransaction"].includes(action)) return {};
    const query = EJSON.parse(p.query);
    if (action === "database.getDocument" && typeof query._id !== "string") {
      if (p.limit === 1) {
        assert.equal(query.payment, "paid"); assert.equal(query.refund, "none"); assert.ok(query.owner);
        assert.match(p.order, /createdAt/); recentQueries.push(query);
        return { data: { list: (listReplies.shift() || []).map(item => EJSON.stringify(item)) } };
      }
      assert.equal(p.limit, 100); assert.match(p.order, /_id/);
      listQueries.push(query); return { data: { list: (listReplies.shift() || []).map(item => EJSON.stringify(item)) } };
    }
    const id = query._id, key = p.collectionName + "/" + id;
    if (action === "database.getDocument") return { data: { list: disk.has(key) ? [EJSON.stringify(disk.get(key))] : [] } };
    assert.equal(action, "database.modifyDocument");
    const doc = EJSON.parse(p.data); assert.ok(!("data" in doc), "wx SDK wrapper would nest all document fields");
    writes.push({ collection: p.collectionName, doc }); disk.set(key, doc);
    return { data: { updated: 1, upsert_id: id } };
  }
};
const entry = path.join(server, "index.js"), testModule = { exports: {} }, realRequire = createRequire(entry);
vm.runInNewContext(fs.readFileSync(entry, "utf8"), { module: testModule, exports: testModule.exports, process: { env: {} }, Buffer,
  require(name) { if (name === "wx-server-sdk") return { init() {}, DYNAMIC_CURRENT_ENV: "local" }; if (name === "@cloudbase/node-sdk") return {}; return realRequire(name); } });
async function main() {
  const store = testModule.exports.repository(new Db({}));
  const order = await store.change("local-order", previous => { assert.equal(previous, null); return { id: "local-order", owner: "alice", payment: "unpaid" }; });
  assert.equal(order.payment, "unpaid"); assert.equal((await store.get(order.id)).owner, "alice");
  await store.change(order.id, current => ({ ...current, payment: "paid" }));
  assert.equal((await store.get(order.id)).payment, "paid");
  await store.reserveCall(order.id, 1);
  await assert.rejects(store.reserveCall(order.id, 1), /daily-budget/);
  const budget = writes.find(w => w.collection === "photo_ai_daily_budget").doc;
  assert.equal(budget.count, 1); assert.equal(budget.lastOrder, order.id);
  errorOn = "database.getDocument";
  await assert.rejects(store.get(order.id), /database-operation/);
  await assert.rejects(store.change(order.id, current => current), /database-operation/);
  errorOn = null;
  listReplies.push([{ ...order, payment: "paid" }], []);
  assert.equal((await store.recent("alice")).owner, "alice");
  assert.equal(await store.recent("bob"), null);
  assert.deepEqual(recentQueries.map(q => q.owner), ["alice", "bob"]);
  const batch = Array.from({ length: 100 }, (_, i) => ({ _id: "P" + String(i).padStart(30, "0"), id: "P" + String(i).padStart(30, "0") }));
  listReplies.push(batch, [{ _id: "P" + "9".repeat(30), id: "P" + "9".repeat(30) }], [], batch);
  assert.equal((await store.pending()).length, 100);
  await store.advanceMaintenance(batch[99].id);
  assert.equal((await store.pending()).length, 1);
  assert.match(JSON.stringify(listQueries[1]), /\$gt/); assert.ok(JSON.stringify(listQueries[1]).includes(batch[99].id));
  await store.advanceMaintenance("P" + "9".repeat(30));
  assert.equal((await store.pending()).length, 0);
  assert.equal(disk.get("photo_ai_daily_budget/maintenance-cursor").afterId, null);
  assert.equal((await store.pending()).length, 100);
  assert.ok(!JSON.stringify(listQueries[3]).includes("$gt"));
  errorOn = "database.modifyDocument";
  await assert.rejects(store.change(order.id, current => current), /database-operation/);
  console.log(JSON.stringify({ passed: true, sdkVersion: "3.18.3", actualSdkSerialization: true, cloudDatabaseTested: false,
    verified: ["flat-order-document", "flat-durable-budget", "read-errors-do-not-look-missing", "write-errors-reject-transition", "bounded-id-cursor-advances-and-wraps", "owner-scoped-paid-recovery-limit-one"] }));
}
main().catch(e => { console.error(e); process.exitCode = 1; });
