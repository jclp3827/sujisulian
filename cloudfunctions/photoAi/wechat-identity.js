// One-use wx.login codes go only to WeChat. Never accept caller-supplied OpenID
// or persist session_key. The caller shares this session with payment signing.
async function exchangeLogin(env, request, code) {
  if (typeof code !== "string" || code.length < 1 || code.length > 256) throw new Error("wechat-login-required");
  if (!env.PHOTO_APP_ID || !env.PHOTO_APP_SECRET) throw new Error("wechat-identity-not-configured");
  const query = new URLSearchParams({ appid: env.PHOTO_APP_ID, secret: env.PHOTO_APP_SECRET, js_code: code, grant_type: "authorization_code" });
  const response = await request("https://api.weixin.qq.com/sns/jscode2session?" + query, { method: "GET" });
  if (response.status !== 200 || response.body.length > 16384) throw new Error("wechat-login-unavailable");
  let session;
  try { session = JSON.parse(response.body.toString("utf8")); } catch (_) { throw new Error("wechat-login-unavailable"); }
  if (session.errcode || typeof session.openid !== "string" || !session.openid ||
      typeof session.session_key !== "string" || !session.session_key) throw new Error("wechat-login-rejected");
  return { openid: session.openid, session_key: session.session_key };
}
module.exports = { exchangeLogin };
