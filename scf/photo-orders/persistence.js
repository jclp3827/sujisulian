const { createMysqlRepository } = require("./shared/mysql-repository");
function mysqlOptions(env) {
  if (env.PHOTO_ORDER_STORE !== "mysql" || !["PHOTO_SQL_HOST", "PHOTO_SQL_DATABASE", "PHOTO_SQL_USER", "PHOTO_SQL_PASSWORD"].every(k => typeof env[k] === "string" && env[k].length > 0)) throw new Error("mysql-not-configured");
  const port = Number(env.PHOTO_SQL_PORT || 3306);
  if (!Number.isInteger(port) || port < 1 || port > 65535 || !/^[a-zA-Z0-9.-]+$/.test(env.PHOTO_SQL_HOST) || !/^[a-zA-Z][a-zA-Z0-9_]{0,63}$/.test(env.PHOTO_SQL_DATABASE)) throw new Error("mysql-configuration-invalid");
  const ssl = { rejectUnauthorized: true, verifyIdentity: true, minVersion: "TLSv1.2" };
  if (env.PHOTO_SQL_CA_PEM) ssl.ca = env.PHOTO_SQL_CA_PEM;
  return { host: env.PHOTO_SQL_HOST, port, database: env.PHOTO_SQL_DATABASE, user: env.PHOTO_SQL_USER, password: env.PHOTO_SQL_PASSWORD,
    ssl, multipleStatements: false, enableKeepAlive: false, charset: "utf8mb4", timezone: "Z", supportBigNumbers: true, bigNumberStrings: true, jsonStrings: true };
}
function persistenceConfigured(env) {
  if (env.PHOTO_DATABASE_ACCEPTED !== "true") return false;
  try { mysqlOptions(env); return true; } catch (_) { return false; }
}
function createPersistence(env, dependencies = {}) {
  if (!persistenceConfigured(env)) throw new Error("persistent-service-not-configured");
  if (dependencies.store) return dependencies.store;
  return createMysqlRepository(mysqlOptions(env), dependencies);
}
module.exports = { mysqlOptions, persistenceConfigured, createPersistence };
