#!/usr/bin/env node
// Local protocol, validation and no-storage checks. No Tencent API is called.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { createBdaProvider, authorization, validateResultUrl, MAX_BASE64_BYTES } = require("../cloudfunctions/photoAi/bda-provider");

function jpeg(width, height) {
  return Buffer.from([0xff, 0xd8, 0xff, 0xc0, 0x00, 0x0a, 0x08, height >> 8, height & 255, width >> 8, width & 255, 0x01, 0x01, 0x11, 0x00, 0xff, 0xd9]);
}
function png(width, height) {
  const body = Buffer.alloc(33);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(body);
  body.writeUInt32BE(width, 16); body.writeUInt32BE(height, 20);
  return body;
}

async function main() {
  const input = jpeg(600, 840), inputHash = crypto.createHash("sha256").update(input).digest("hex");
  const output = png(600, 840), seen = [];
  const env = { PHOTO_BDA_SECRET_ID: "test-secret-id", PHOTO_BDA_SECRET_KEY: "test-secret-key", PHOTO_BDA_REGION: "ap-guangzhou" };
  const dependencies = {
    now: () => 1700000000000,
    jpeg: { decode() { return { width: 600, height: 840 }; } },
    PNG: { sync: { read() { return { data: Uint8Array.from([1, 2, 3, 0, 4, 5, 6, 255]) }; } } },
    async request(url, options, body) {
      seen.push({ url, options, body });
      if (url === "https://bda.tencentcloudapi.com/") {
        assert.equal(options.method, "POST");
        assert.equal(options.headers["X-TC-Action"], "SegmentPortraitPic");
        assert.equal(options.headers["X-TC-Version"], "2020-03-24");
        assert.equal(options.headers["X-TC-Region"], env.PHOTO_BDA_REGION);
        assert.match(options.headers.Authorization, /^TC3-HMAC-SHA256 Credential=test-secret-id\//);
        const payload = JSON.parse(body);
        assert.equal(payload.Image, input.toString("base64"));
        assert.equal(payload.RspImgType, "url");
        assert.equal(payload.Scene, "GEN");
        assert.equal(payload.Url, undefined);
        return { status: 200, body: Buffer.from(JSON.stringify({ Response: { HasForeground: true,
          ResultImageUrl: "https://temporary.cos.ap-guangzhou.myqcloud.com/result.png?short-lived=1", RequestId: "request-id" } })) };
      }
      assert.equal(url, "https://temporary.cos.ap-guangzhou.myqcloud.com/result.png?short-lived=1");
      return { status: 200, body: output };
    }
  };
  const provider = createBdaProvider(env, dependencies);
  assert.equal(provider.transport, "inline");
  const order = { inputBytes: input.length, inputHash, inputWidth: 600, inputHeight: 840 };
  const prepared = await provider.prepareInput(order, { imageBase64: input.toString("base64") });
  const result = await provider.process(order, prepared);
  assert.equal(result.sha256, crypto.createHash("sha256").update(output).digest("hex"));
  assert.equal(result.width, 600); assert.equal(result.height, 840);
  assert.equal(result.downloadExpiresAt, 1700000000000 + 29 * 60 * 1000);
  assert.equal((await provider.resultPermission({ result })).url, result.downloadUrl);
  assert.deepEqual(await provider.cleanup({ result }, true), { inputDeleted: true, resultDeleted: true, resultReferenceDeleted: true });
  assert.equal(seen.length, 2);
  assert.ok(!JSON.stringify(result).includes(input.toString("base64")));
  assert.ok(!JSON.stringify(result).includes(env.PHOTO_BDA_SECRET_KEY));

  await assert.rejects(provider.prepareInput({ ...order, inputHash: "0".repeat(64) }, { imageBase64: input.toString("base64") }), /identity/);
  await assert.rejects(provider.prepareInput(order, { imageBase64: "A".repeat(MAX_BASE64_BYTES + 4) }), /size/);
  assert.throws(() => validateResultUrl("http://temporary.cos.ap-guangzhou.myqcloud.com/result.png"), /invalid/);
  assert.throws(() => validateResultUrl("https://example.com/result.png"), /unexpected/);

  const noForeground = createBdaProvider(env, { ...dependencies, async request(url) {
    assert.equal(url, "https://bda.tencentcloudapi.com/");
    return { status: 200, body: Buffer.from(JSON.stringify({ Response: { HasForeground: false, RequestId: "request-id" } })) };
  } });
  await assert.rejects(noForeground.process(order, prepared), error => error.definiteFailure && /foreground/.test(error.message));

  const signed = authorization("id", "key", "ap-guangzhou", 1700000000, "{}");
  assert.match(signed, /^TC3-HMAC-SHA256 Credential=id\/2023-11-14\/bda\/tc3_request, SignedHeaders=content-type;host, Signature=[a-f0-9]{64}$/);
  console.log(JSON.stringify({ passed: true, realBda: false, cloudChanged: false, photoPersistedByServer: false,
    verified: ["tc3-signature-shape", "base64-only-input", "url-output", "same-dimensions", "transparent-png", "short-lived-reference", "no-cos-write", "no-automatic-retry"] }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
