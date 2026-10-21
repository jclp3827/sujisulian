const crypto = require("node:crypto");
const fail = () => { throw new Error("unverified-wechat-notification"); };
const digest = values => crypto.createHash("sha1").update(values.sort().join("")).digest("hex");
function verify(env, query, encrypted, now) {
  const token = env.PHOTO_PUSH_TOKEN || "";
  if (token.length < 32 || !/^\d{10}$/.test(query.timestamp || "") || Math.abs(now() / 1000 - Number(query.timestamp)) > 300 ||
      typeof query.nonce !== "string" || query.nonce.length > 128) fail();
  const expected = digest([token, query.timestamp, query.nonce, ...(encrypted ? [encrypted] : [])]);
  const actual = encrypted ? query.msg_signature : query.signature;
  if (!/^[a-f0-9]{40}$/.test(actual || "") || !crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) fail();
}
function key(env) {
  if (!/^[A-Za-z0-9+/]{43}$/.test(env.PHOTO_PUSH_AES_KEY || "")) fail();
  return Buffer.from(env.PHOTO_PUSH_AES_KEY + "=", "base64");
}
function decrypt(env, value) {
  if (typeof value !== "string" || value.length > 65536 || value.length % 4) fail();
  const data = Buffer.from(value, "base64"), aes = key(env);
  if (!data.length || data.length % 16 || data.toString("base64") !== value) fail();
  const decipher = crypto.createDecipheriv("aes-256-cbc", aes, aes.subarray(0, 16));
  decipher.setAutoPadding(false);
  const raw = Buffer.concat([decipher.update(data), decipher.final()]), pad = raw[raw.length - 1];
  if (pad < 1 || pad > 32 || raw.subarray(-pad).some(b => b !== pad)) fail();
  const message = raw.subarray(0, raw.length - pad);
  if (message.length < 20) fail();
  const size = message.readUInt32BE(16);
  if (size > message.length - 20 || message.subarray(20 + size).toString("utf8") !== env.PHOTO_APP_ID) fail();
  return message.subarray(20, 20 + size).toString("utf8");
}
function encrypt(env, value, now = Date.now) {
  const body = Buffer.from(value), size = Buffer.alloc(4); size.writeUInt32BE(body.length);
  const raw = Buffer.concat([crypto.randomBytes(16), size, body, Buffer.from(env.PHOTO_APP_ID)]);
  const pad = 32 - raw.length % 32, aes = key(env);
  const cipher = crypto.createCipheriv("aes-256-cbc", aes, aes.subarray(0, 16)); cipher.setAutoPadding(false);
  const encrypted = Buffer.concat([cipher.update(Buffer.concat([raw, Buffer.alloc(pad, pad)])), cipher.final()]).toString("base64");
  const timestamp = String(Math.floor(now() / 1000)), nonce = crypto.randomBytes(12).toString("hex");
  return { encrypt: encrypted, msgsignature: digest([env.PHOTO_PUSH_TOKEN, timestamp, nonce, encrypted]), timestamp, nonce };
}
function decodeNotification(env, query, outer, now = Date.now) {
  const encrypted = outer.Encrypt || outer.encrypt;
  if (typeof encrypted !== "string" || !encrypted) fail();
  verify(env, query, encrypted, now);
  // Deployment must select JSON + safe mode in the existing MP message push.
  return JSON.parse(decrypt(env, encrypted));
}
function handshake(env, query, now = Date.now) {
  if (typeof query.echostr !== "string" || query.echostr.length > 8192) fail();
  verify(env, query, query.msg_signature ? query.echostr : null, now);
  return query.msg_signature ? decrypt(env, query.echostr) : query.echostr;
}
module.exports = { decodeNotification, handshake, encrypt };
