const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const https = require('node:https');
const { createBudgetedRequest, NETWORK_BUDGET_MS } = require('../cloudfunctions/photoAi/request-budget');
const { request } = require('../cloudfunctions/photoAi/providers');

(async () => {
  let time = 1000;
  const calls = [];
  const send = createBudgetedRequest(async (url, options, body) => {
    calls.push({ url, options, body });
    time += 20000;
    return { status: 200 };
  }, () => time);
  const body = Buffer.from('one chargeable attempt');
  await send('https://example.invalid', { method: 'POST' }, body);
  await send('https://example.invalid', { timeout: 30000 });
  await send('https://example.invalid');
  assert.deepEqual(calls.map(c => c.options.timeout), [20000, 25000, 5000]);
  assert.equal(calls[0].body, body);
  assert.equal(calls[0].options.method, 'POST');
  await assert.rejects(send('https://example.invalid'), /upstream-outcome-unknown/);
  assert.equal(calls.length, 3, 'exhausted budget must not start another request');
  assert.equal(NETWORK_BUDGET_MS, 45000);

  // A peer continuously sends bytes without triggering a socket idle timeout.
  // The absolute deadline must still abort exactly once, with no retry.
  const original = https.request;
  let attempts = 0, destroyed = 0, interval;
  https.request = (url, options, callback) => {
    attempts++;
    const req = new EventEmitter();
    req.write = () => {};
    req.destroy = error => { destroyed++; clearInterval(interval); req.emit('error', error); };
    req.end = () => {
      const res = new EventEmitter();
      res.statusCode = 200; res.headers = {};
      callback(res);
      interval = setInterval(() => res.emit('data', Buffer.from('x')), 2);
    };
    return req;
  };
  try {
    await assert.rejects(request('https://example.invalid', { timeout: 25 }), /upstream-outcome-unknown/);
    assert.equal(attempts, 1); assert.equal(destroyed, 1);
  } finally { https.request = original; clearInterval(interval); }
  console.log(JSON.stringify({ passed: true, sharedNetworkBudgetMs: NETWORK_BUDGET_MS,
    exhaustedBudgetStartsNoRequest: true, continuousResponseAborted: true,
    retries: 0, networkAccess: false, realPayment: false, realAi: false }));
})().catch(error => { console.error(error); process.exitCode = 1; });
