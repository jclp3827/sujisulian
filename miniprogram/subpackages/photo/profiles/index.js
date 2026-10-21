const gwy = require("./gwy");
const henan = require("./henan-retained");

const profiles = Object.freeze([gwy, henan]);

function getProfile(id) {
  const profile = profiles.find((value) => value.id === id);
  if (!profile) throw new Error("未找到照片处理配置，请返回照片首页重新选择");
  return profile;
}

module.exports = { profiles, getProfile, defaultProfileId: gwy.id };
