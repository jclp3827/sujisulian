const gwy = require("./gwy");
const henan = require("./henan-retained");
const sichuan = require("./sichuan");

const profiles = Object.freeze([gwy, henan, sichuan]);
// Only user-facing destinations belong here. Historical profiles remain internal.
const regions = Object.freeze([
  Object.freeze({ label: "国考", profileId: gwy.id }),
  Object.freeze({ label: "四川", profileId: sichuan.id }),
]);

function getProfile(id) {
  const profile = profiles.find((value) => value.id === id);
  if (!profile) throw new Error("未找到照片处理配置，请返回照片首页重新选择");
  return profile;
}

module.exports = { profiles, regions, getProfile, defaultProfileId: gwy.id };
