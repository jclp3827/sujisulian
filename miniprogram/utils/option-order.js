// Display order is separate from the source option identity used for grading.
function shuffledOrder(ids, random = Math.random) {
  const result = ids.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const sample = Number(random());
    const target = Math.floor(Math.max(0, Math.min(.999999999, Number.isFinite(sample) ? sample : 0)) * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}
function validOrder(order, ids) {
  return Array.isArray(order) && order.length === ids.length && new Set(order).size === ids.length && order.every(id => ids.includes(id));
}
module.exports = { shuffledOrder, validOrder };
