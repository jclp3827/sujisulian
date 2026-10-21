function configuration(env, owner) {
  const aiProvider = env.PHOTO_AI_PROVIDER || "bda";
  const paymentCredentials = ["PHOTO_APP_ID", "PHOTO_APP_SECRET", "PHOTO_VIRTUAL_OFFER_ID", "PHOTO_VIRTUAL_APP_KEY", "PHOTO_VIRTUAL_PRODUCT_ID",
    "PHOTO_MAINTENANCE_SECRET"].every(k => typeof env[k] === "string" && env[k].length > 0);
  const aiCredentials = aiProvider === "bda"
    ? ["PHOTO_BDA_REGION", "PHOTO_BDA_SECRET_ID", "PHOTO_BDA_SECRET_KEY"].every(k => typeof env[k] === "string" && env[k].length > 0)
    : aiProvider === "cos-legacy" && ["PHOTO_COS_BUCKET", "PHOTO_COS_REGION", "PHOTO_COS_SECRET_ID", "PHOTO_COS_SECRET_KEY"].every(k => typeof env[k] === "string" && env[k].length > 0);
  const credentials = paymentCredentials && aiCredentials;
  const qualified = env.PHOTO_PAYMENT_CHANNEL === "personal-virtual" && ["PHOTO_CHANNEL_ELIGIBILITY_VERIFIED", "PHOTO_PRODUCT_100_FEN_VERIFIED",
    "PHOTO_PRIVACY_ACCEPTED", "PHOTO_BUDGET_AUTHORIZED"].every(k => env[k] === "true");
  const dailyCallLimit = Number(env.PHOTO_MAX_AI_CALLS_PER_DAY || 0);
  const processingEnabled = credentials && env.PHOTO_PAYMENT_CHANNEL === "personal-virtual" && env.PHOTO_BUDGET_AUTHORIZED === "true" &&
    dailyCallLimit > 0 && Number.isSafeInteger(dailyCallLimit) && env.PHOTO_PROCESSING_ENABLED === "true";
  const productionAccepted = ["PHOTO_CALLBACK_ACCEPTED", "PHOTO_REAL_FLOW_ACCEPTED", "PHOTO_FREE_RELEASE_ACCEPTED"].every(k => env[k] === "true");
  // A separately authorized, server-owned payer allowlist permits the FIRST
  // real acceptance transaction without falsely setting acceptance to passed.
  const testOnly = !!owner && env.PHOTO_TEST_PAYMENT_AUTHORIZED === "true" && env.PHOTO_CALLBACK_CONFIGURED === "true" &&
    String(env.PHOTO_TEST_PAYER_OPENIDS || "").split(",").map(s => s.trim()).filter(Boolean).includes(owner);
  return { appId: env.PHOTO_APP_ID, merchantId: env.PHOTO_VIRTUAL_OFFER_ID, aiProvider, dailyCallLimit, processingEnabled,
    iosEnabled: env.PHOTO_IOS_IAP_ACCEPTED === "true" || (testOnly && env.PHOTO_IOS_IAP_CONFIGURED === "true"), testOnly: testOnly && !productionAccepted,
    newOrdersEnabled: processingEnabled && qualified && (productionAccepted || testOnly) && env.PHOTO_NEW_ORDERS_ENABLED === "true",
    retentionMs: 24 * 3600000, unknownWaitMs: 15 * 60000 };
}
module.exports = { configuration };
