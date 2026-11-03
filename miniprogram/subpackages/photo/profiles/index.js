const gwy = require("./gwy");
const henan = require("./henan-retained");
const sichuan = require("./sichuan");
const military = require('./military');
const neimenggu = require('./neimenggu');

const profiles = Object.freeze([gwy, henan, sichuan, neimenggu, military]);
// Only user-facing destinations belong here. Historical profiles remain internal.
const regions = Object.freeze([
  Object.freeze({ label: "国考", profileId: gwy.id }),
  Object.freeze({ label: "四川", profileId: sichuan.id }),
  // 内蒙古适配保留为内部候选，用户入口暂时隐藏。
  Object.freeze({ label: '军队文职', profileId: military.id }),
]);

function getProfile(id) {
  const profile = profiles.find((value) => value.id === id);
  if (!profile) throw new Error("未找到照片处理配置，请返回照片首页重新选择");
  return profile;
}

module.exports = { profiles, regions, getProfile, defaultProfileId: gwy.id };
