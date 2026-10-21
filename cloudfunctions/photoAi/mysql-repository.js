const crypto = require("node:crypto");
const MAX_ORDER_BYTES = 65536;
const ownerKey = owner => crypto.createHash("sha256").update(owner).digest("hex");
const orderId = id => { if (!/^P[a-f0-9]{30}$/.test(id || "")) throw new Error("invalid-order"); };

// The order authority is still orders.js. This adapter implements its existing
// get/change/reserveCall/recent/maintenance contract with InnoDB transactions.
function createMysqlRepository(options, dependencies = {}) {
  const connect = dependencies.connect || (config => require("mysql2/promise").createConnection(config));
  const now = dependencies.now || Date.now;
  const deadline = dependencies.deadline || now() + 45000;
  async function using(action) {
    const remaining = Math.min(10000, deadline - now());
    if (remaining <= 0) throw new Error("order-database-time-budget-exhausted");
    let connection, expired = false, timer;
    const work = (async () => {
      connection = await connect(Object.assign({}, options, { connectTimeout: Math.min(5000, remaining) }));
      if (expired) { connection.destroy(); throw new Error("order-database-timeout"); }
      const execute = async (sql, parameters = []) => {
        if (expired || now() >= deadline) throw new Error("order-database-timeout");
        const settings = { sql, timeout: Math.min(5000, deadline - now()) };
        const [rows] = sql === "START TRANSACTION" || sql === "COMMIT"
          ? await connection.query(settings) : await connection.execute(settings, parameters);
        return rows;
      };
      return action(execute);
    })();
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        expired = true; if (connection) connection.destroy();
        reject(new Error("order-database-timeout"));
      }, remaining);
    });
    try { return await Promise.race([work, timeout]); }
    finally {
      clearTimeout(timer);
      // No idle connection/pool that keeps a Serverless DB awake. Closing also
      // rolls back an unfinished transaction. A lost COMMIT is never replayed.
      if (connection) connection.destroy();
    }
  }
  async function transaction(action) {
    return using(async execute => {
      await execute("START TRANSACTION");
      const result = await action(execute);
      await execute("COMMIT");
      return result;
    });
  }
  function decode(row) {
    if (!row || row.payload === null) return null;
    const value = typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload;
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid-order-document");
    return value;
  }
  return {
    async get(id) {
      orderId(id);
      return using(async execute => decode((await execute("SELECT payload FROM photo_ai_orders WHERE id = ?", [id]))[0]));
    },
    async change(id, action) {
      orderId(id);
      return transaction(async execute => {
        // Lock creation and updates on the same primary key, including the
        // initially missing row. Placeholder never commits if action fails.
        await execute("INSERT INTO photo_ai_orders (id, payload) VALUES (?, NULL) ON DUPLICATE KEY UPDATE id = id", [id]);
        const rows = await execute("SELECT payload FROM photo_ai_orders WHERE id = ? FOR UPDATE", [id]);
        if (rows.length !== 1) throw new Error("missing-order-lock");
        const value = action(decode(rows[0]));
        if (!value || typeof value.then === "function" || value.id !== id || typeof value.owner !== "string" || !value.owner ||
            !Number.isSafeInteger(value.createdAt) || value.createdAt < 0) throw new Error("invalid-order-transition");
        const payload = JSON.stringify(value);
        if (Buffer.byteLength(payload) > MAX_ORDER_BYTES) throw new Error("order-document-too-large");
        await execute("UPDATE photo_ai_orders SET payload = ?, owner_hash = ?, created_at = ?, payment = ?, refund = ?, result_deleted = ? WHERE id = ?",
          [payload, ownerKey(value.owner), value.createdAt, value.payment, value.refund, value.resultDeleted === true ? 1 : 0, id]);
        return value;
      });
    },
    async reserveCall(id, limit) {
      orderId(id);
      if (!Number.isSafeInteger(limit) || limit < 1) throw Object.assign(new Error("budget-not-authorized"), { definiteFailure: true });
      const day = new Date(now()).toISOString().slice(0, 10); // Preserve existing UTC budget day.
      return transaction(async execute => {
        await execute("INSERT INTO photo_ai_daily_budget (id, call_count) VALUES (?, 0) ON DUPLICATE KEY UPDATE id = id", [day]);
        const rows = await execute("SELECT call_count FROM photo_ai_daily_budget WHERE id = ? FOR UPDATE", [day]);
        const count = Number(rows[0] && rows[0].call_count);
        if (!Number.isSafeInteger(count) || count < 0) throw new Error("invalid-budget-record");
        if (count >= limit) throw Object.assign(new Error("daily-budget-reached"), { definiteFailure: true });
        await execute("UPDATE photo_ai_daily_budget SET call_count = ?, last_order = ? WHERE id = ?", [count + 1, id, day]);
      });
    },
    async recent(owner) {
      if (typeof owner !== "string" || !owner) throw new Error("invalid-owner");
      return using(async execute => decode((await execute("SELECT payload FROM photo_ai_orders WHERE owner_hash = ? AND payment = 'paid' AND refund = 'none' ORDER BY created_at DESC, id DESC LIMIT 1", [ownerKey(owner)]))[0]));
    },
    async pending() {
      const result = await using(async execute => {
        const cursor = await execute("SELECT after_id FROM photo_ai_daily_budget WHERE id = ?", ["maintenance-cursor"]);
        const afterId = cursor[0] && cursor[0].after_id || "";
        if (afterId) orderId(afterId);
        const rows = await execute("SELECT payload FROM photo_ai_orders WHERE (result_deleted = 0 OR refund IN ('requested', 'retryable')) AND id > ? ORDER BY id ASC LIMIT 100", [afterId]);
        return { rows, afterId };
      });
      if (!result.rows.length && result.afterId) await this.advanceMaintenance(null);
      return result.rows.map(row => {
        const value = decode(row); if (!value) throw new Error("invalid-pending-order"); return value;
      });
    },
    async advanceMaintenance(id) {
      if (id !== null) orderId(id);
      return using(execute => execute("INSERT INTO photo_ai_daily_budget (id, after_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE after_id = VALUES(after_id)", ["maintenance-cursor", id]));
    }
  };
}
module.exports = { createMysqlRepository, MAX_ORDER_BYTES };
