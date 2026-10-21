const NETWORK_BUDGET_MS = 45000;
function createBudgetedRequest(request, now = Date.now) {
  const deadline = now() + NETWORK_BUDGET_MS;
  return async function(url, options = {}, body) {
    const remaining = deadline - now();
    if (remaining <= 0) throw new Error("upstream-outcome-unknown");
    const timeout = Math.min(options.timeout || 20000, remaining);
    return request(url, Object.assign({}, options, { timeout }), body);
  };
}
module.exports = { createBudgetedRequest, NETWORK_BUDGET_MS };
