const DEFAULT_MAX_ITEMS = 5;
const DEFAULT_MAX_BYTES = 64 * 1024;

function byteLength(value) {
  const text = JSON.stringify(value);
  let bytes = 0;
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    if (code < 0x80) bytes += 1;
    else if (code < 0x800) bytes += 2;
    else if (code >= 0xd800 && code <= 0xdbff && index + 1 < text.length &&
      text.charCodeAt(index + 1) >= 0xdc00 && text.charCodeAt(index + 1) <= 0xdfff) { bytes += 4; index += 1; }
    else bytes += 3;
  }
  return bytes;
}

function failure(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function createCardBatchAdapter(request, { maxItems = DEFAULT_MAX_ITEMS,
  maxBytes = DEFAULT_MAX_BYTES, validateItem = () => true } = {}) {
  if (typeof request !== 'function' || !Number.isInteger(maxItems) || maxItems < 1 ||
    !Number.isInteger(maxBytes) || maxBytes < 1) throw failure('BAD_ADAPTER', '卡片取题配置无效');

  async function fetch(ids, context) {
    if (!context?.version || !Array.isArray(ids) || !ids.length ||
      ids.some((id) => typeof id !== 'string' || !id) || new Set(ids).size !== ids.length)
      throw failure('BAD_REQUEST', '卡片请求无效');
    const all = [];
    for (let start = 0; start < ids.length; start += maxItems) {
      const batch = ids.slice(start, start + maxItems);
      let offset = 0;
      while (offset < batch.length) {
        const remaining = batch.slice(offset);
        const response = await request(remaining, context);
        if (response?.version !== context.version) throw failure('VERSION_CHANGED', '卡片版本已更新，请重新进入');
        const items = response.items;
        if (!Array.isArray(items) || !Number.isInteger(response.nextOffset) ||
          !items.length || items.length > remaining.length ||
          response.nextOffset !== items.length ||
          items.some((item, index) => item?.id !== remaining[index] || !validateItem(item, context)))
          throw failure('INCOMPLETE_BATCH', '卡片批次不完整，请重试');
        for (const item of items) {
          if (byteLength(item) > maxBytes) throw failure('ITEM_TOO_LARGE', '单张卡片超出加载预算，请稍后重试');
        }
        if (items.reduce((total, item) => total + byteLength(item), 0) > maxBytes)
          throw failure('RESPONSE_TOO_LARGE', '卡片批次超出加载预算，请稍后重试');
        all.push(...items);
        offset += items.length;
      }
    }
    return all;
  }
  return { fetch };
}

module.exports = { createCardBatchAdapter, byteLength, failure };
