#!/usr/bin/env node
const assert = require('node:assert/strict');
const { createUsageStore } = require('../scf/photo-segment/usage-store');

function memoryDatabase() {
  const data = new Map(); let queue = Promise.resolve(), unavailable = false;
  return {
    fail(value) { unavailable = value; },
    collection(name) { return { doc(id) { return { async get() {
      if (unavailable) throw Error('database-operation');
      const key = name + '/' + id;
      return { data: data.has(key) ? JSON.parse(JSON.stringify(data.get(key))) : null };
    } }; } }; },
    runTransaction(action) {
      const result = queue.then(async () => {
        if (unavailable) throw Error('database-operation');
        const draft = new Map(data);
        const tx = { collection(name) { return { doc(id) { const key = name + '/' + id; return {
          async get() { return { data: draft.has(key) ? JSON.parse(JSON.stringify(draft.get(key))) : null }; },
          async set(value) { draft.set(key, JSON.parse(JSON.stringify(value))); return { updated: 1 }; }
        }; } }; } };
        const value = await action(tx);
        for (const [key, item] of draft) data.set(key, item);
        return value;
      });
      queue = result.catch(() => {});
      return result;
    }
  };
}
const owner = 'sha256:' + 'a'.repeat(64), digest = 'b'.repeat(64), id = 'P' + 'c'.repeat(30);
const input = (kind, slot, limit = 20) => ({ kind, orderId: kind === 'paid' ? id : null, slot, inputHash: digest, dailyLimit: limit });
(async () => {
  const db = memoryDatabase(), clock = () => Date.UTC(2026, 9, 27), first = createUsageStore(db, clock);
  assert.equal((await first.account(owner, 'base')).trialUsed, 0);
  await first.reserve(owner, 'base', input('trial', 0));
  assert.equal(await first.remainingToday(20), 19);
  const cold = createUsageStore(db, clock);
  await assert.rejects(cold.reserve(owner, 'base', input('trial', 0)), /NO_USES/);
  await Promise.all([first.reserve(owner, 'base', input('trial', 1)), first.reserve(owner, 'base', input('trial', 2))]);
  assert.equal((await cold.account(owner, 'base')).trialUsed, 3);
  await assert.rejects(first.reserve(owner, 'base', input('trial', 2)), /NO_USES/);
  await cold.rememberOrder(owner, 'base', { id, ticket: 'signed-order', startBefore: clock() + 100000, currentResultId: null });
  assert.equal((await first.account(owner, 'base')).order.payment, 'pending');
  await first.markPayment(owner, 'base', id, 'paid');
  assert.equal((await cold.account(owner, 'base')).order.payment, 'paid');
  await first.reserve(owner, 'base', input('paid', 0));
  await assert.rejects(cold.reserve(owner, 'base', input('paid', 0)), /NO_USES/);
  assert.equal((await cold.account(owner, 'base')).order.used, 1);
  await first.reserve(owner, 'base', input('paid', 1));
  await first.reserve(owner, 'base', input('paid', 2));
  await assert.rejects(cold.reserve(owner, 'base', input('paid', 2)), /NO_USES/);
  await first.markPayment(owner, 'base', id, 'refunded');
  await assert.rejects(cold.reserve(owner, 'base', input('paid', 3)), /LEDGER_INVALID/);
  assert.equal((await cold.account(owner, 'round-2')).trialUsed, 0);
  db.fail(true);
  await assert.rejects(first.reserve(owner, 'round-2', input('trial', 0)), /database-operation/);
  db.fail(false);
  assert.equal((await first.account(owner, 'round-2')).trialUsed, 0);
  await assert.rejects(first.reserve(owner, 'round-2', input('trial', 0, 6)), /DAILY_BUDGET_EXHAUSTED/);
  assert.equal(await first.remainingToday(6), 0);
  assert.equal((await first.account(owner, 'round-2')).trialUsed, 0);
  assert.equal(await first.remainingToday(null), null);
  await first.reserve(owner, 'round-2', input('trial', 0, null));
  assert.equal((await first.account(owner, 'round-2')).trialUsed, 1);
  console.log(JSON.stringify({ passed: true, checks: ['cold-instance-replay-denied', 'three-trial-limit', 'durable-paid-entitlement',
    'paid-slot-replay-denied', 'refund-denied', 'controlled-revision-reset', 'database-fail-closed', 'daily-budget-atomic'] }));
})().catch(error => { console.error(error); process.exitCode = 1; });
