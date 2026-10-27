'use strict';

// Only metadata is kept here. The work image and BDA result never enter this database.
const ACCOUNTS = 'photo_preview_accounts';
const BUDGET = 'photo_preview_daily_budget';
const ORDERS = 'photo_preview_orders';

function document(result) {
  if (!result || result.code) throw new Error('LEDGER_UNAVAILABLE');
  return Array.isArray(result.data) ? result.data[0] || null : result.data || null;
}
function written(result) {
  if (!result || result.code) throw new Error('LEDGER_UNAVAILABLE');
}
function validCount(value) { return Number.isSafeInteger(value) && value >= 0 && value <= 3; }
function normalize(value, revision) {
  const account = value || { trialRevision: revision, trialUsed: 0, order: null };
  if (!validCount(account.trialUsed)) throw new Error('LEDGER_INVALID');
  if (account.trialRevision !== revision) {
    account.trialRevision = revision;
    account.trialUsed = 0;
  }
  if (account.order && (!/^P[a-f0-9]{30}$/.test(account.order.id || '') || !validCount(account.order.used))) throw new Error('LEDGER_INVALID');
  return account;
}

function createUsageStore(db, now = Date.now) {
  if (!db || typeof db.runTransaction !== 'function') throw new Error('LEDGER_UNAVAILABLE');
  async function transact(ownerBinding, revision, action) {
    if (!/^sha256:[a-f0-9]{64}$/.test(ownerBinding || '')) throw new Error('LEDGER_INVALID');
    return db.runTransaction(async transaction => {
      const ref = transaction.collection(ACCOUNTS).doc(ownerBinding.slice(7));
      const original = document(await ref.get());
      const account = normalize(original && { ...original }, revision);
      const value = await action(account, transaction);
      delete account._id;
      written(await ref.set(account));
      return value;
    });
  }
  return {
    async listOrders(ownerBinding, revision) {
      if (!/^sha256:[a-f0-9]{64}$/.test(ownerBinding || '')) throw new Error('LEDGER_INVALID');
      // Backfill the one current order from ledgers created before order history.
      // A legacy credit is a replacement entitlement, not a new cash payment.
      await transact(ownerBinding, revision, async (account, transaction) => {
        const order = account.order;
        if (!order || order.source === 'legacy-credit') return;
        const ref = transaction.collection(ORDERS).doc(order.id);
        if (document(await ref.get())) return;
        written(await ref.set({ ownerBinding, id: order.id, product: 'AI 换背景 · 3 次',
          amountFen: 100, payment: order.payment, createdAt: order.startBefore - 30 * 60000,
          paidAt: null, deliveredAt: null }));
      });
      const result = await db.collection(ORDERS).where({ ownerBinding }).orderBy('createdAt', 'desc').limit(100).get();
      if (!result || result.code || !Array.isArray(result.data)) throw new Error('LEDGER_UNAVAILABLE');
      return result.data.map(order => ({ product: order.product, amountFen: order.amountFen,
        payment: order.payment, createdAt: order.createdAt, paidAt: order.paidAt || null,
        deliveredAt: order.deliveredAt || null }));
    },
    async grantLegacyCredit(ownerBinding, revision, order) {
      if (!order || !/^P[a-f0-9]{30}$/.test(order.id || '') || typeof order.ticket !== 'string') throw new Error('LEDGER_INVALID');
      return transact(ownerBinding, revision, account => {
        if (account.legacyCreditGranted === true) return account.order && { ...account.order };
        if (account.order) throw new Error('ORDER_IN_PROGRESS');
        account.trialUsed = 3;
        account.order = { id: order.id, ticket: order.ticket, currentResultId: null,
          startBefore: order.startBefore, used: 0, payment: 'paid', source: 'legacy-credit' };
        account.legacyCreditGranted = true;
        return { ...account.order };
      });
    },
    async remainingToday(dailyLimit) {
      if (dailyLimit === null) return null;
      if (!Number.isSafeInteger(dailyLimit) || dailyLimit < 1) throw new Error('LEDGER_INVALID');
      const day = new Date(now()).toISOString().slice(0, 10);
      const budget = document(await db.collection(BUDGET).doc(day).get());
      if (budget && (!Number.isSafeInteger(budget.count) || budget.count < 0)) throw new Error('LEDGER_INVALID');
      return Math.max(0, dailyLimit - (budget && budget.count || 0));
    },
    async account(ownerBinding, revision) {
      return transact(ownerBinding, revision, account => ({ trialUsed: account.trialUsed, order: account.order && { ...account.order } }));
    },
    async rememberOrder(ownerBinding, revision, order) {
      return transact(ownerBinding, revision, async (account, transaction) => {
        const old = account.order;
        if (old && old.id !== order.id && (old.payment === 'paid' && old.used < 3 || old.payment === 'pending')) throw new Error('ORDER_IN_PROGRESS');
        const ref = transaction.collection(ORDERS).doc(order.id);
        const recorded = document(await ref.get());
        if (recorded && recorded.ownerBinding !== ownerBinding) throw new Error('ORDER_NOT_IN_LEDGER');
        account.order = { id: order.id, ticket: order.ticket, currentResultId: order.currentResultId || null,
          startBefore: order.startBefore, used: 0, payment: 'pending' };
        if (!recorded) written(await ref.set({ ownerBinding, id: order.id, product: 'AI 换背景 · 3 次',
          amountFen: 100, payment: 'pending', createdAt: now(), paidAt: null, deliveredAt: null }));
        return { ...account.order };
      });
    },
    async markPayment(ownerBinding, revision, orderId, payment, orderStatus) {
      if (!['paid', 'pending', 'closed', 'refunded'].includes(payment)) throw new Error('LEDGER_INVALID');
      return transact(ownerBinding, revision, async (account, transaction) => {
        if (!account.order || account.order.id !== orderId) throw new Error('ORDER_NOT_IN_LEDGER');
        if (account.order.payment === 'paid' && payment === 'pending') throw new Error('PAYMENT_STATE_REGRESSED');
        account.order.payment = payment;
        if (payment === 'paid') account.trialUsed = 3; // Unused free uses do not stack with a purchased group.
        if (account.order.source !== 'legacy-credit') {
          const ref = transaction.collection(ORDERS).doc(orderId);
          const recorded = document(await ref.get()) || { ownerBinding, id: orderId, product: 'AI 换背景 · 3 次',
            amountFen: 100, createdAt: account.order.startBefore - 30 * 60000 };
          if (recorded.ownerBinding !== ownerBinding) throw new Error('ORDER_NOT_IN_LEDGER');
          recorded.payment = payment;
          if (payment === 'paid' && !recorded.paidAt) recorded.paidAt = now();
          if (payment === 'paid' && orderStatus === 4 && !recorded.deliveredAt) recorded.deliveredAt = now();
          written(await ref.set(recorded));
        }
        return { ...account.order };
      });
    },
    async reserve(ownerBinding, revision, request) {
      const { kind, orderId, slot, inputHash, dailyLimit } = request;
      if (!['trial', 'paid'].includes(kind) || !Number.isSafeInteger(slot) || slot < 0 || slot >= 3 ||
        !/^[a-f0-9]{64}$/.test(inputHash || '') || dailyLimit !== null && (!Number.isSafeInteger(dailyLimit) || dailyLimit < 1)) throw new Error('LEDGER_INVALID');
      return transact(ownerBinding, revision, async (account, transaction) => {
        if (kind === 'trial') {
          if (slot !== account.trialUsed) throw new Error('NO_USES');
          account.trialUsed++;
        } else {
          if (!account.order || account.order.id !== orderId || account.order.payment !== 'paid' || slot !== account.order.used) throw new Error('NO_USES');
          account.order.used++;
        }
        const day = new Date(now()).toISOString().slice(0, 10);
        const ref = transaction.collection(BUDGET).doc(day);
        const budget = document(await ref.get());
        if (budget && (!Number.isSafeInteger(budget.count) || budget.count < 0)) throw new Error('LEDGER_INVALID');
        if (dailyLimit !== null && (budget && budget.count || 0) >= dailyLimit) throw new Error('DAILY_BUDGET_EXHAUSTED');
        written(await ref.set({ count: (budget && budget.count || 0) + 1, updatedAt: now() }));
        // The transaction commits before BDA. Unknown provider outcomes retain the claim.
        return { remaining: kind === 'trial' ? 3 - account.trialUsed : 3 - account.order.used };
      });
    }
  };
}

module.exports = { createUsageStore, ACCOUNTS, BUDGET, ORDERS };
