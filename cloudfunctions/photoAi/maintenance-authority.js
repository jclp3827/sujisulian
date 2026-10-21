const crypto = require("node:crypto");
const TRIGGER = "photoAiMaintenance";

function maintenanceMode(event, context, env) {
  if (event.Type === "Timer") {
    if (context.SOURCE !== "wx_trigger" || context.OPENID || context.FROM_OPENID || event.TriggerName !== TRIGGER) throw new Error("untrusted-maintenance-trigger");
    return env.PHOTO_MAINTENANCE_ENABLED === "true" ? "timer" : "disabled";
  }
  if (event.action !== "maintenance") return null;
  const expected = Buffer.from(env.PHOTO_MAINTENANCE_SECRET || ""), actual = Buffer.from(String(event.maintenanceToken || ""));
  if (expected.length < 32 || actual.length > 1024 || expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) throw new Error("maintenance-not-authorized");
  return "manual";
}
module.exports = { maintenanceMode, TRIGGER };
