const RECENT_RECORDS_KEY = "xingce_recent_records";
const RECENT_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_RECENT_RECORDS = 120;

function now() {
  return Date.now();
}

function makeRecordId(type = "record") {
  return `${type}_${now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function readRawRecords() {
  return wx.getStorageSync(RECENT_RECORDS_KEY) || [];
}

function writeRecords(records) {
  wx.setStorageSync(RECENT_RECORDS_KEY, records);
}

function isValidRecord(record, current = now()) {
  return record && record.createdAt && (current - record.createdAt) <= RECENT_TTL_MS;
}

function cleanupRecentRecords() {
  const current = now();
  const records = readRawRecords()
    .filter((record) => isValidRecord(record, current))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, MAX_RECENT_RECORDS);
  writeRecords(records);
  return records;
}

function addRecentRecord(record) {
  const createdAt = record.createdAt || now();
  const nextRecord = {
    ...record,
    id: record.id || makeRecordId(record.type),
    createdAt,
  };
  const records = [nextRecord, ...cleanupRecentRecords()]
    .filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, MAX_RECENT_RECORDS);
  writeRecords(records);
  return nextRecord;
}

function getRecentRecords() {
  return cleanupRecentRecords();
}

function toLocalDateKey(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function summarize(records) {
  return {
    totalCount: records.length,
    totalQuestionCount: records.reduce((sum, record) => sum + (Number(record.questionCount) || 0), 0),
    totalElapsedMs: records.reduce((sum, record) => sum + (Number(record.elapsedMs) || 0), 0),
    lastRecord: records[0] || null,
  };
}

function getTodaySummary() {
  const todayKey = toLocalDateKey(now());
  return summarize(getRecentRecords().filter((record) => toLocalDateKey(record.createdAt) === todayKey));
}

function getRecentSummary() {
  return summarize(getRecentRecords());
}

module.exports = {
  addRecentRecord,
  cleanupRecentRecords,
  getRecentRecords,
  getTodaySummary,
  getRecentSummary,
};
