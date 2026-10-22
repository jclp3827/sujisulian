// Shared with the existing note detail cloud-image path; URLs alone do not prove an image loaded.
const CLOUD_IMG_PREFIX = 'https://636c-cloud1-d8gw5r2il0c0f198a-1317757209.tcb.qcloud.la/note-resources/';
const CLOUD_FILE_PREFIX = 'cloud://cloud1-d8gw5r2il0c0f198a.636c-cloud1-d8gw5r2il0c0f198a-1317757209/note-resources/';
const PREFIXES = ['graphic/', 'data-analysis/', 'quantity/', 'logic/', 'common-sense/'];
const cache = {};
function normalizeCloudNoteAsset(src) {
  let value = String(src || '').trim();
  if (value.startsWith(CLOUD_IMG_PREFIX)) value = value.slice(CLOUD_IMG_PREFIX.length);
  if (value.startsWith(CLOUD_FILE_PREFIX)) value = value.slice(CLOUD_FILE_PREFIX.length);
  return value.replace(/^\/+/, '').replace(/^note-resources\//, '');
}
function isCloudNoteAsset(src) { return PREFIXES.some((p) => normalizeCloudNoteAsset(src).startsWith(p)); }
function resolveNoteImage(api, src, refresh = false) {
  if (!src || !isCloudNoteAsset(src)) return Promise.resolve(src);
  const asset = normalizeCloudNoteAsset(src), fallback = CLOUD_IMG_PREFIX + asset;
  if (!refresh && cache[asset]) return Promise.resolve(cache[asset]);
  return Promise.resolve().then(() => api.cloud?.callFunction ? api.cloud.callFunction({ name: 'getImage', data: { path: asset } }) : null)
    .then((response) => { const url = response?.result?.code === 0 && response.result.url || fallback; cache[asset] = url; return url; })
    .catch(() => { cache[asset] = fallback; return fallback; });
}
module.exports = { normalizeCloudNoteAsset, isCloudNoteAsset, resolveNoteImage };
