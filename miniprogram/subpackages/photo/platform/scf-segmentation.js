const { call } = require('./files');
const { bytes } = require('../core/bytes');
const { sha256 } = require('../core/sha256');
const { inspectJpeg } = require('../core/jpeg');

const ENDPOINT = 'https://1317757209-fgwojo6bub.ap-guangzhou.tencentscf.com';
const MAX_BASE64 = 2 * 1024 * 1024;
const MAX_RESULT = 8 * 1024 * 1024;
const RETRYABLE_CONFIGURATION = ['UNAUTHORIZED', 'API_TOKEN_NOT_CONFIGURED', 'SCF_ROLE_CREDENTIALS_MISSING', 'INVALID_REGION'];

function failure(message, code, requestId) {
  return Object.assign(new Error(message), { code, requestId: requestId || '' });
}

function assertTestEnvironment(wxApi) {
  let env;
  try { env = wxApi.getAccountInfoSync().miniProgram.envVersion; } catch (_) {}
  if (!['develop', 'trial'].includes(env)) throw failure('人像分割联调仅在开发版或体验版可用', 'TEST_ONLY');
}

function inspectResult(value, expected) {
  const data = bytes(value);
  if (data.length < 33 || data.length > MAX_RESULT ||
      ![137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => data[i] === v) ||
      String.fromCharCode(...data.subarray(12, 16)) !== 'IHDR') {
    throw failure('返回的文件不是有效 PNG，请查看本次请求编号', 'INVALID_RESULT');
  }
  const number = at => data[at] * 0x1000000 + data[at + 1] * 0x10000 + data[at + 2] * 0x100 + data[at + 3];
  const width = number(16), height = number(20);
  if (width !== expected.width || height !== expected.height) throw failure('人物结果尺寸不匹配，已停止使用', 'RESULT_DIMENSIONS_MISMATCH');
  return { width, height, sha256: sha256(data) };
}

// Internal, manual test transport. It never creates/confirms a payment order.
// Tokens and signed result URLs stay in this page's memory, never in storage.
function createScfSegmentation(wxApi) {
  const attempts = new Map();
  const tasks = new Set();
  let disposed = false;
  function ensureActive() {
    assertTestEnvironment(wxApi);
    if (disposed) throw failure('页面已关闭，请重新进入', 'PAGE_CLOSED');
  }
  function request(method, options) {
    return new Promise((resolve, reject) => {
      let task;
      task = wxApi[method](Object.assign({}, options, {
        success: resolve, fail: reject,
        complete() { if (task) tasks.delete(task); }
      }));
      if (task && typeof task.abort === 'function') tasks.add(task);
    });
  }
  function prepare(record) {
    if (!record || !record.path || !record.sha256 || !Number.isSafeInteger(record.bytes) ||
        record.bytes < 1 || 4 * Math.ceil(record.bytes / 3) > MAX_BASE64) {
      throw failure('工作图超过本次联调大小限制，请选择更小的照片', 'IMAGE_TOO_LARGE');
    }
    const fs = wxApi.getFileSystemManager();
    const stat = fs.statSync(record.path);
    if (!stat || !stat.isFile() || stat.size !== record.bytes) throw failure('工作图已改变，请重新选择照片', 'INPUT_CHANGED');
    const data = bytes(fs.readFileSync(record.path));
    const info = inspectJpeg(data, { includeTail: false });
    if (data.length !== record.bytes || sha256(data) !== record.sha256 || info.width !== record.width || info.height !== record.height) {
      throw failure('工作图已改变，请重新选择照片', 'INPUT_CHANGED');
    }
    if (info.hasExif || info.width > 1000 || info.height > 1000 || info.width < 1 || info.height < 1) {
      throw failure('请先完成照片标准化再联调', 'INVALID_WORK_IMAGE');
    }
    return wxApi.arrayBufferToBase64(new Uint8Array(data).buffer);
  }

  async function download(attempt, files, onPhase) {
    ensureActive();
    if (Date.now() >= attempt.expiresAt) throw failure('本次结果地址已过期，不会自动重新分割', 'RESULT_EXPIRED', attempt.requestId);
    onPhase('正在下载人物结果');
    let path;
    try {
      const result = await request('downloadFile', { url: attempt.url, timeout: 30000 });
      path = result.tempFilePath;
      ensureActive();
      if (result.statusCode !== 200 || !path) throw failure('结果下载未完成，再次点击只会重试下载', 'DOWNLOAD_FAILED', attempt.requestId);
      const data = await files.read(path, MAX_RESULT);
      ensureActive();
      const info = inspectResult(data, attempt);
      const record = await files.writeVerified(data, 'png');
      if (disposed) { await files.remove(record.path); ensureActive(); }
      return { record, width: info.width, height: info.height, requestId: attempt.requestId };
    } catch (error) {
      if (error.code) throw error;
      throw failure('结果下载未完成，再次点击只会重试下载；请检查 downloadFile 合法域名', 'DOWNLOAD_FAILED', attempt.requestId);
    } finally {
      if (path) try { await call(wxApi.getFileSystemManager(), 'unlink', { filePath: path }); } catch (_) {}
    }
  }

  async function segment(record, token, files, onPhase = () => {}) {
    ensureActive();
    const imageBase64 = prepare(record);
    let attempt = attempts.get(record && record.sha256);
    if (attempt && attempt.state === 'ready') return download(attempt, files, onPhase);
    if (attempt) throw failure('本次调用尚未确认结果，不会自动重新分割；请先查看请求记录', 'OUTCOME_UNKNOWN', attempt.requestId);
    if (typeof token !== 'string' || token.length < 32 || token.length > 512) throw failure('请先设置本次联调口令', 'TOKEN_REQUIRED');
    attempt = { state: 'sending', width: record.width, height: record.height, requestId: '' };
    attempts.set(record.sha256, attempt);
    onPhase('正在分割人像');
    let response;
    try {
      response = await request('request', {
        url: ENDPOINT, method: 'POST', timeout: 45000,
        header: { 'content-type': 'application/json', 'x-photo-token': token },
        data: { imageBase64 }
      });
      ensureActive();
    } catch (_) {
      attempt.state = 'unknown';
      throw failure('请求结果尚未确认，不会自动重新分割；请检查 SCF 日志', 'OUTCOME_UNKNOWN');
    }
    let data = response.data;
    try { if (typeof data === 'string') data = JSON.parse(data); } catch (_) { data = null; }
    if (data && typeof data.requestId === 'string') attempt.requestId = data.requestId.slice(0, 128);
    if (response.statusCode !== 200 || !data || data.ok !== true ||
        typeof data.resultImageUrl !== 'string' || !/^https:\/\/[a-z0-9.-]+\.myqcloud\.com\//i.test(data.resultImageUrl) ||
        !attempt.requestId || data.hasForeground === false) {
      const code = data && typeof data.error === 'string' && /^[A-Za-z0-9_.-]{1,100}$/.test(data.error) ? data.error : 'SCF_RESPONSE_INVALID';
      attempt.state = 'unknown';
      if (RETRYABLE_CONFIGURATION.includes(code)) attempts.delete(record.sha256);
      throw failure('人像分割未完成（' + code + '）', code, attempt.requestId);
    }
    // Save the result reference before download: download failure must not rerun AI.
    Object.assign(attempt, { state: 'ready', url: data.resultImageUrl,
      expiresAt: Date.now() + 29 * 60 * 1000 });
    return download(attempt, files, onPhase);
  }
  function dispose() {
    disposed = true;
    for (const task of tasks) try { task.abort(); } catch (_) {}
    tasks.clear(); attempts.clear();
  }
  return { segment, dispose };
}

module.exports = { createScfSegmentation, inspectResult, ENDPOINT };
