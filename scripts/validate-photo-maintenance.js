#!/usr/bin/env node
// Timer authority and closed entry with injected context; no cloud invocation.
const assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const { createRequire } = require("node:module");
const { maintenanceMode, TRIGGER } = require("../cloudfunctions/photoAi/maintenance-authority");
async function main() {
  const timer = { Type: "Timer", TriggerName: TRIGGER }, context = { SOURCE: "wx_trigger" };
  assert.equal(maintenanceMode(timer, context, {}), "disabled");
  assert.equal(maintenanceMode(timer, context, { PHOTO_MAINTENANCE_ENABLED: "true" }), "timer");
  for (const bad of [{ SOURCE: "wx_client" }, { SOURCE: "wx_http" }, { SOURCE: "wx_unknown" }, { ...context, OPENID: "alice" }, { ...context, FROM_OPENID: "alice" }]) {
    assert.throws(() => maintenanceMode(timer, bad, {}), /untrusted/);
  }
  assert.throws(() => maintenanceMode({ ...timer, TriggerName: "unrelated" }, context, {}), /untrusted/);
  assert.equal(maintenanceMode({ action: "status" }, {}, {}), null);
  const secret = "local-test-only-" + "x".repeat(32);
  assert.equal(maintenanceMode({ action: "maintenance", maintenanceToken: secret }, {}, { PHOTO_MAINTENANCE_SECRET: secret }), "manual");
  for (const value of ["", "x", "中".repeat(secret.length)]) assert.throws(() => maintenanceMode({ action: "maintenance", maintenanceToken: value }, {}, { PHOTO_MAINTENANCE_SECRET: secret }), /not-authorized/);

  const entry = path.resolve(__dirname, "../cloudfunctions/photoAi/index.js"), realRequire = createRequire(entry), mod = { exports: {} };
  vm.runInNewContext(fs.readFileSync(entry, "utf8"), { module: mod, exports: mod.exports, process: { env: {} }, Buffer,
    require(name) {
      if (name === "wx-server-sdk") return { init() {}, DYNAMIC_CURRENT_ENV: "test", getWXContext: () => context };
      if (name === "@cloudbase/node-sdk") return { init() { throw new Error("disabled-timer-must-not-open-database"); } };
      if (name === "./providers") return { createProvider() { throw new Error("disabled-timer-must-not-open-storage"); } };
      return realRequire(name);
    } });
  assert.equal((await mod.exports.main(timer)).reason, "maintenance-disabled");
  console.log(JSON.stringify({ passed: true, scope: "local-timer-authority-and-closed-entry", realTimer: false, cloudWrites: false,
    verified: ["trusted-named-timer-only", "client-and-http-forgery-rejected", "constant-time-manual-token", "default-disabled-no-database-or-provider"] }));
}
main().catch(e => { console.error(e); process.exitCode = 1; });
