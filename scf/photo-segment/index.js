'use strict';

const crypto = require('node:crypto');
const https = require('node:https');

const HOST = 'bda.tencentcloudapi.com';
const MAX_BASE64 = 2 * 1024 * 1024;
const MAX_BODY = MAX_BASE64 + 4096;
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const hmac = (key, data, encoding) => crypto.createHmac('sha256', key).update(data).digest(encoding);

function reply(statusCode, data) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    body: JSON.stringify(data)
  };
}

function parse(event) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) throw new Error('INVALID_REQUEST');
  if (!Object.prototype.hasOwnProperty.call(event, 'body')) return event;
  let body = event.body;
  if (typeof body === 'string') {
    if (Buffer.byteLength(body) > MAX_BODY * 2) throw new Error('IMAGE_TOO_LARGE');
    if (event.isBase64Encoded === true) body = Buffer.from(body, 'base64').toString('utf8');
    if (Buffer.byteLength(body) > MAX_BODY) throw new Error('IMAGE_TOO_LARGE');
    body = JSON.parse(body);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('INVALID_REQUEST');
  return body;
}

function authenticate(event, payload) {
  const expected = process.env.PHOTO_API_TOKEN;
  if (!expected || expected.length < 32) throw new Error('API_TOKEN_NOT_CONFIGURED');
  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
  // HTTP requests use a header. Direct console tests use the event token field.
  const supplied = event.httpMethod ? headers['x-photo-token'] : payload.token;
  if (typeof supplied !== 'string' || supplied.length > 512) return false;
  const a = Buffer.from(expected), b = Buffer.from(supplied);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function credentials(context) {
  // Take one complete credential set; never combine values from different sets.
  const keys = ['TENCENTCLOUD_SECRETID', 'TENCENTCLOUD_SECRETKEY', 'TENCENTCLOUD_SESSIONTOKEN'];
  for (const source of [context, process.env]) {
    if (source && keys.every(key => typeof source[key] === 'string' && source[key])) {
      return keys.map(key => source[key]);
    }
  }
  throw new Error('SCF_ROLE_CREDENTIALS_MISSING');
}

function dimensions(data) {
  if (data.length >= 24 && data.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) {
    return [data.readUInt32BE(16), data.readUInt32BE(20)];
  }
  if (data.length >= 4 && data[0] === 0xff && data[1] === 0xd8) {
    let at = 2;
    while (at + 4 <= data.length) {
      if (data[at++] !== 0xff) break;
      while (at < data.length && data[at] === 0xff) at++;
      const marker = data[at++];
      if (marker === 0xda || marker === 0xd9) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (at + 2 > data.length) break;
      const size = data.readUInt16BE(at);
      if (size < 2 || at + size > data.length) break;
      if ([0xc0, 0xc1, 0xc2].includes(marker) && size >= 8) {
        return [data.readUInt16BE(at + 5), data.readUInt16BE(at + 3)];
      }
      at += size;
    }
  }
  throw new Error('UNSUPPORTED_IMAGE');
}

function imageInput(value) {
  if (typeof value !== 'string' || !value) throw new Error('IMAGE_REQUIRED');
  if (value.length > MAX_BASE64 + 128) throw new Error('IMAGE_TOO_LARGE');
  const image = value.replace(/^data:image\/(?:jpeg|png);base64,/, '');
  if (image.length > MAX_BASE64) throw new Error('IMAGE_TOO_LARGE');
  if (image.length % 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(image)) throw new Error('INVALID_BASE64');
  const data = Buffer.from(image, 'base64');
  if (!data.length || data.toString('base64') !== image) throw new Error('INVALID_BASE64');
  const [width, height] = dimensions(data);
  if (!width || !height || width >= 2000 || height >= 2000) throw new Error('INVALID_IMAGE_DIMENSIONS');
  return image;
}

function callBda(payload, context) {
  const [secretId, secretKey, token] = credentials(context);
  const region = process.env.BDA_REGION || 'ap-guangzhou';
  if (!['ap-guangzhou', 'ap-beijing', 'ap-shanghai'].includes(region)) throw new Error('INVALID_REGION');
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
  const contentType = 'application/json; charset=utf-8';
  const canonical = ['POST', '/', '', `content-type:${contentType}\nhost:${HOST}\n`, 'content-type;host', hash(payload)].join('\n');
  const scope = `${date}/bda/tc3_request`;
  const signingKey = hmac(hmac(hmac('TC3' + secretKey, date), 'bda'), 'tc3_request');
  const signature = hmac(signingKey, ['TC3-HMAC-SHA256', timestamp, scope, hash(canonical)].join('\n'), 'hex');
  const authorization = `TC3-HMAC-SHA256 Credential=${secretId}/${scope}, SignedHeaders=content-type;host, Signature=${signature}`;

  return new Promise((resolve, reject) => {
    let timer;
    const fail = error => { clearTimeout(timer); reject(error); };
    const req = https.request({
      hostname: HOST, path: '/', method: 'POST', timeout: 15000,
      headers: {
        Authorization: authorization, 'Content-Type': contentType,
        'Content-Length': Buffer.byteLength(payload), Host: HOST,
        'X-TC-Action': 'SegmentPortraitPic', 'X-TC-Version': '2020-03-24',
        'X-TC-Region': region, 'X-TC-Timestamp': String(timestamp), 'X-TC-Token': token
      }
    }, res => {
      const chunks = [];
      let size = 0;
      res.on('data', chunk => {
        size += chunk.length;
        if (size > 256 * 1024) res.destroy(new Error('BDA_RESPONSE_TOO_LARGE'));
        else chunks.push(chunk);
      });
      res.on('error', fail);
      res.on('end', () => {
        clearTimeout(timer);
        try {
          if (res.statusCode !== 200) throw new Error('BDA_HTTP_ERROR');
          const data = JSON.parse(Buffer.concat(chunks).toString('utf8')).Response;
          if (!data || !data.RequestId) throw new Error('BDA_INVALID_RESPONSE');
          resolve(data);
        } catch (error) { reject(error); }
      });
    });
    timer = setTimeout(() => req.destroy(new Error('BDA_TIMEOUT')), 15000);
    req.on('timeout', () => req.destroy(new Error('BDA_TIMEOUT')));
    req.on('error', fail);
    req.end(payload);
  });
}

let purchaseHandler;
exports.main_handler = async (event = {}, context = {}) => {
  try {
    const notify = event.path === '/notify' || event.rawPath === '/notify';
    if (event.httpMethod && event.httpMethod.toUpperCase() !== 'POST' && !notify) return reply(405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
    const input = notify && event.httpMethod === 'GET' ? {} : parse(event);
    if (notify || input.action) {
      if (!purchaseHandler) purchaseHandler = require('./purchase').createPurchaseHandler({
        segment: (image, ctx) => callBda(JSON.stringify({ Image: image, RspImgType: 'url', Scene: 'GEN' }), ctx),
        validateImage: imageInput, dimensions, checkRole: credentials,
        usageStoreFactory: ctx => {
          if (!/^cloud[0-9a-z-]{8,60}$/.test(process.env.PHOTO_CLOUDBASE_ENV || '')) throw new Error('LEDGER_UNAVAILABLE');
          const [secretId, secretKey, sessionToken] = credentials(ctx);
          const cloudbase = require('@cloudbase/node-sdk');
          const db = cloudbase.init({ env: process.env.PHOTO_CLOUDBASE_ENV,
            secretId, secretKey, sessionToken, timeout: 8000 }).database();
          return require('./usage-store').createUsageStore(db);
        }
      });
      return purchaseHandler(event, input, context);
    }
    if (!authenticate(event, input)) return reply(401, { ok: false, error: 'UNAUTHORIZED' });
    const image = imageInput(input.imageBase64);
    const data = await callBda(JSON.stringify({ Image: image, RspImgType: 'url', Scene: 'GEN' }), context);
    if (data.Error) {
      return reply(502, { ok: false, error: data.Error.Code, message: data.Error.Message, requestId: data.RequestId });
    }
    if (data.HasForeground === false) return reply(422, { ok: false, error: 'NO_FOREGROUND', requestId: data.RequestId });
    if (typeof data.ResultImageUrl !== 'string' || !data.ResultImageUrl.startsWith('https://')) {
      return reply(502, { ok: false, error: 'BDA_RESULT_URL_MISSING', requestId: data.RequestId });
    }
    return reply(200, { ok: true, resultImageUrl: data.ResultImageUrl, hasForeground: data.HasForeground, requestId: data.RequestId, expiresInSeconds: 1800 });
  } catch (error) {
    const code = error instanceof SyntaxError ? 'INVALID_JSON' : error.message;
    const known = ['API_TOKEN_NOT_CONFIGURED', 'SCF_ROLE_CREDENTIALS_MISSING', 'INVALID_REGION', 'BDA_RESPONSE_TOO_LARGE', 'BDA_HTTP_ERROR', 'BDA_INVALID_RESPONSE', 'BDA_TIMEOUT'];
    const badInput = ['INVALID_REQUEST', 'IMAGE_TOO_LARGE', 'IMAGE_REQUIRED', 'INVALID_BASE64', 'UNSUPPORTED_IMAGE', 'INVALID_IMAGE_DIMENSIONS', 'INVALID_JSON'];
    return reply(badInput.includes(code) ? (code === 'IMAGE_TOO_LARGE' ? 413 : 400) : 500, {
      ok: false, error: known.includes(code) || badInput.includes(code) ? code : 'INTERNAL_ERROR'
    });
  }
};
