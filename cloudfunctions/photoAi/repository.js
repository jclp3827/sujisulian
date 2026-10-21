function repository(db) {
  const collection = "photo_ai_orders";
  function verified(r) { if (!r || r.code) throw new Error("photo-database-operation-failed"); return r; }
  return {
    async get(id) { const r = verified(await db.collection(collection).doc(id).get()); return Array.isArray(r.data) ? r.data[0] || null : r.data || null; },
    async recent(owner) {
      const r = verified(await db.collection(collection).where({ owner, payment: "paid", refund: "none" }).orderBy("createdAt", "desc").limit(1).get());
      if (!Array.isArray(r.data)) throw new Error("invalid-database-list");
      return r.data[0] || null;
    },
    async change(id, action) {
      return db.runTransaction(async transaction => {
        const doc = transaction.collection(collection).doc(id), r = verified(await doc.get());
        const previous = Array.isArray(r.data) ? r.data[0] || null : r.data || null;
        const value = action(previous ? Object.assign({}, previous) : null);
        delete value._id;
        // @cloudbase/node-sdk takes the document directly (unlike wx SDK).
        verified(await doc.set(value)); return value;
      });
    },
    async reserveCall(id, limit) {
      if (!Number.isSafeInteger(limit) || limit < 1) throw Object.assign(new Error("budget-not-authorized"), { definiteFailure: true });
      const day = new Date().toISOString().slice(0, 10);
      await db.runTransaction(async tx => {
        const doc = tx.collection("photo_ai_daily_budget").doc(day), r = verified(await doc.get());
        const data = Array.isArray(r.data) ? r.data[0] : r.data;
        if (data && data.count >= limit) throw Object.assign(new Error("daily-budget-reached"), { definiteFailure: true });
        verified(await doc.set({ count: (data && data.count || 0) + 1, lastOrder: id }));
      });
    },
    async pending() {
      const state = verified(await db.collection("photo_ai_daily_budget").doc("maintenance-cursor").get());
      const cursor = Array.isArray(state.data) ? state.data[0] : state.data;
      const pending = db.command.or([
        { resultDeleted: db.command.neq(true) }, { refund: db.command.in(["requested", "retryable"]) }
      ]);
      const filter = cursor && cursor.afterId ? db.command.and([pending, { _id: db.command.gt(cursor.afterId) }]) : pending;
      const r = verified(await db.collection(collection).where(filter).orderBy("_id", "asc").limit(100).get());
      if (!Array.isArray(r.data)) throw new Error("invalid-database-list");
      if (!r.data.length && cursor && cursor.afterId) await this.advanceMaintenance(null);
      return r.data;
    },
    async advanceMaintenance(id) {
      verified(await db.collection("photo_ai_daily_budget").doc("maintenance-cursor").set({ afterId: id, checkedAt: Date.now() }));
    }
  };
}
module.exports = { repository };
