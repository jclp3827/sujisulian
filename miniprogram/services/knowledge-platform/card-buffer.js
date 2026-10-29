const { byteLength, failure } = require('./card-batch-adapter');

const DEFAULTS = Object.freeze({ maxCards: 8, maxBytes: 48 * 1024, ahead: 4, behind: 1,
  refillAt: 2, maxConcurrent: 2 });

function createCardBuffer({ fetch, onItems, onEvict = () => {}, limits = {} }) {
  const config = { ...DEFAULTS, ...limits };
  if (typeof fetch !== 'function' || typeof onItems !== 'function' ||
    ['maxCards', 'maxBytes', 'maxConcurrent'].some((key) => !Number.isInteger(config[key]) || config[key] < 1) ||
    ['ahead', 'behind', 'refillAt'].some((key) => !Number.isInteger(config[key]) || config[key] < 0))
    throw failure('BAD_BUFFER', '卡片缓冲配置无效');

  let context = null, ids = [], index = 0, key = '', generation = 0, usedBytes = 0;
  let active = 0, warming = false;
  const cache = new Map(), pending = new Map(), tasks = [];

  function drop(id) {
    const entry = cache.get(id);
    if (!entry) return;
    cache.delete(id); usedBytes -= entry.bytes; onEvict([id]);
  }
  function clear() {
    generation += 1;
    while (tasks.length) tasks.shift().reject(failure('STALE_REQUEST', '学习轮次已切换'));
    pending.clear(); warming = false;
    [...cache.keys()].forEach(drop);
  }
  function configure(next) {
    if (!next?.roundId || !next.version || !next.mode || !Array.isArray(next.ids) ||
      new Set(next.ids).size !== next.ids.length ||
      !Number.isInteger(next.index) || next.index < 0 || next.index > next.ids.length)
      throw failure('BAD_QUEUE', '学习队列无效');
    const nextKey = JSON.stringify([next.roundId, next.version, next.mode, next.scope || {}]);
    if (nextKey !== key) {
      clear(); key = nextKey; ids = next.ids.slice();
      context = { roundId: next.roundId, version: next.version, mode: next.mode, scope: next.scope || {} };
    } else if (ids.length !== next.ids.length || ids.some((id, i) => id !== next.ids[i])) {
      throw failure('QUEUE_CHANGED', '学习队列已改变，请重新进入');
    }
    index = next.index;
  }
  function distance(id) {
    const place = ids.indexOf(id);
    return place < 0 ? Infinity : Math.abs(place - index);
  }
  function makeRoom(bytes, pinnedId) {
    while (cache.size >= config.maxCards || usedBytes + bytes > config.maxBytes) {
      const candidates = [...cache.keys()].filter((id) => id !== pinnedId)
        .sort((a, b) => distance(b) - distance(a));
      if (!candidates.length) return false;
      drop(candidates[0]);
    }
    return true;
  }
  function insert(items, taskGeneration) {
    if (taskGeneration !== generation) throw failure('STALE_REQUEST', '学习轮次已切换');
    for (const item of items) {
      const bytes = byteLength(item);
      if (bytes > config.maxBytes) throw failure('ITEM_TOO_LARGE', '单张卡片超出缓冲上限，请稍后重试');
      if (cache.has(item.id)) drop(item.id);
      if (!makeRoom(bytes, ids[index])) {
        if (item.id === ids[index]) throw failure('BUFFER_FULL', '卡片缓冲暂时已满，请重试');
        continue;
      }
      onItems([item]);
      cache.set(item.id, { item, bytes }); usedBytes += bytes;
    }
  }
  function pump() {
    while (active < config.maxConcurrent && tasks.length) {
      const task = tasks.shift(); active += 1;
      Promise.resolve().then(() => fetch(task.ids, task.context)).then((items) => {
        if (!Array.isArray(items) || items.length !== task.ids.length ||
          items.some((item, i) => item?.id !== task.ids[i]))
          throw failure('INCOMPLETE_BATCH', '卡片批次不完整，请重试');
        insert(items, task.generation);
        task.resolve(items);
      }).catch(task.reject).then(() => {
        active -= 1;
        task.ids.forEach((id) => { if (pending.get(id) === task.promise) pending.delete(id); });
        pump();
      });
    }
  }
  function load(requestIds, priority = false) {
    const missing = requestIds.filter((id) => !cache.has(id) && !pending.has(id));
    if (missing.length) {
      let resolve, reject;
      const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
      const task = { ids: missing, context: { ...context }, generation, promise, resolve, reject };
      missing.forEach((id) => pending.set(id, promise));
      if (priority) tasks.unshift(task); else tasks.push(task);
      pump();
    }
    return Promise.all(requestIds.map((id) => pending.get(id) || Promise.resolve(cache.get(id)?.item)))
      .then(() => requestIds.map((id) => cache.get(id)?.item));
  }
  async function get(id) {
    if (!context || ids[index] !== id) throw failure('BAD_POSITION', '卡片位置已改变');
    if (cache.has(id)) return cache.get(id).item;
    await load([id], true);
    const item = cache.get(id)?.item;
    if (!item) throw failure('BUFFER_MISS', '卡片未完整载入，请重试');
    return item;
  }
  function seed(items) {
    if (!context || !Array.isArray(items) || items.some((item) => !item || !ids.includes(item.id)) ||
      new Set(items.map((item) => item.id)).size !== items.length)
      throw failure('BAD_SEED', '预取卡片与学习轮次不一致');
    insert(items, generation);
  }
  function prefetch() {
    if (!context || warming || index >= ids.length) return Promise.resolve();
    const from = Math.max(0, index - config.behind);
    const to = Math.min(ids.length, index + 1 + config.ahead);
    const future = ids.slice(index + 1, to).filter((id) => !cache.has(id) && !pending.has(id));
    const behind = ids.slice(from, index).filter((id) => !cache.has(id) && !pending.has(id));
    const readyAhead = ids.slice(index + 1, to).filter((id) => cache.has(id)).length;
    if (readyAhead > config.refillAt && !behind.length) return Promise.resolve();
    const wanted = future.concat(behind).slice(0, 5);
    if (!wanted.length) return Promise.resolve();
    warming = true;
    return load(wanted).then(() => undefined).finally(() => { warming = false; });
  }
  function stats() { return { cards: cache.size, bytes: usedBytes, pending: pending.size,
    active, maxCards: config.maxCards, maxBytes: config.maxBytes }; }
  function close() { clear(); context = null; ids = []; key = ''; }
  return { configure, get, seed, prefetch, stats, close };
}

module.exports = { createCardBuffer, DEFAULTS };
