const WRONG_BOOK_KEY = "xingce_wrong_book_records";
const WRONG_BOOK_REVIEW_KEY = "xingce_wrong_book_review_plans";
const WRONG_BOOK_REVIEW_TTL_MS = 90 * 60 * 1000;

function now() {
  return Date.now();
}

function readStorage() {
  return wx.getStorageSync(WRONG_BOOK_KEY) || [];
}

function writeStorage(records) {
  wx.setStorageSync(WRONG_BOOK_KEY, records);
}

function getRecordKey(sectionId, itemId, questionId) {
  return `${sectionId || ""}|${itemId || ""}|${questionId || ""}`;
}

function normalizeRecord(record = {}, fallback) {
  const nextRecord = { ...record };
  if (!nextRecord.id && fallback.questionId) {
    nextRecord.id = getRecordKey(
      fallback.sectionId,
      fallback.itemId,
      fallback.questionId
    );
  }
  return nextRecord;
}

function normalizeRawQuestion(rawQuestion = null) {
  if (!rawQuestion || typeof rawQuestion !== "object") return null;
  try {
    return JSON.parse(JSON.stringify(rawQuestion));
  } catch (error) {
    return null;
  }
}

function getWrongBookRecords() {
  return readStorage().filter((record) => record && record.id && record.sectionId && record.itemId && record.questionId);
}

function saveWrongBookRecords(records) {
  const sanitized = records
    .filter((record) => record && record.id && record.sectionId && record.itemId && record.questionId)
    .sort((a, b) => (b.lastWrongAt || 0) - (a.lastWrongAt || 0));
  writeStorage(sanitized);
  return sanitized;
}

function syncWrongBookFromRecords(payload = {}) {
  const {
    sectionId,
    itemId,
    itemTitle = "",
    records = [],
  } = payload;
  const currentByKey = getWrongBookRecords().reduce((acc, record) => {
    if (record && record.id) {
      acc[record.id] = record;
    }
    return acc;
  }, {});

  records.forEach((record) => {
    const questionId = record?.id || record?.questionId;
    if (!questionId) return;
    const key = getRecordKey(sectionId, itemId, questionId);

    const nowAt = now();
    const normalized = normalizeRecord(record, {
      sectionId,
      itemId,
      questionId,
      id: key,
    });
    const isCorrect = Boolean(normalized.isCorrect);

    if (isCorrect) {
      if (currentByKey[key]) delete currentByKey[key];
      return;
    }

    const existing = currentByKey[key] || null;
    currentByKey[key] = {
      ...existing,
      id: key,
      sectionId,
      itemId,
      questionId,
      itemTitle,
      prompt: normalized.prompt || "",
      promptFormula: normalized.promptFormula || null,
      answerMode: normalized.answerMode || null,
      compare: normalized.compare || null,
      correctAnswer: normalized.correctAnswer || "-",
      userAnswer: normalized.userAnswer || "-",
      firstWrongAt: existing?.firstWrongAt || nowAt,
      lastWrongAt: nowAt,
      wrongCount: Number(existing?.wrongCount || 0) + 1,
      rawQuestion: normalizeRawQuestion(normalized.rawQuestion),
    };
  });

  return saveWrongBookRecords(Object.values(currentByKey));
}

function removeWrongBookRecord(recordId) {
  const next = getWrongBookRecords().filter((record) => record.id !== recordId);
  writeStorage(next);
  return next;
}

function clearWrongBook() {
  writeStorage([]);
  return [];
}

function nowToken() {
  return `${now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readReviewPlans() {
  const plans = wx.getStorageSync(WRONG_BOOK_REVIEW_KEY);
  if (!plans || typeof plans !== "object") return {};
  return plans;
}

function writeReviewPlans(plans) {
  wx.setStorageSync(WRONG_BOOK_REVIEW_KEY, plans);
  return plans;
}

function cleanupExpiredReviewPlans(plans = {}) {
  const current = now();
  const nextPlans = {};
  Object.keys(plans || {}).forEach((token) => {
    const plan = plans[token];
    if (!plan || plan.expiresAt <= current) return;
    nextPlans[token] = plan;
  });
  return nextPlans;
}

function startWrongBookReview(recordIds = [], startRecordId = "") {
  const ids = Array.isArray(recordIds) ? recordIds.filter(Boolean) : [];
  if (!ids.length || !startRecordId) return null;

  const plan = {
    createdAt: now(),
    expiresAt: now() + WRONG_BOOK_REVIEW_TTL_MS,
    recordIds: ids,
    startRecordId,
  };

  const plans = cleanupExpiredReviewPlans(readReviewPlans());
  const token = nowToken();
  plans[token] = plan;
  writeReviewPlans(plans);
  return token;
}

function getWrongBookReviewPlan(token) {
  if (!token) return null;
  const plans = cleanupExpiredReviewPlans(readReviewPlans());
  writeReviewPlans(plans);
  return plans[token] || null;
}

function getNextWrongBookRecordId(token, currentRecordId) {
  const plan = getWrongBookReviewPlan(token);
  if (!plan || !Array.isArray(plan.recordIds) || !currentRecordId) return null;

  const recordIds = plan.recordIds;
  const existsById = new Set(getWrongBookRecords().map((record) => record.id));
  const validIds = recordIds.filter((id) => existsById.has(id));
  if (!validIds.length) return null;

  let startIndex = recordIds.indexOf(currentRecordId);
  if (startIndex === -1) {
    const startRecordId = plan.startRecordId;
    startIndex = startRecordId ? recordIds.indexOf(startRecordId) : -1;
  }
  if (startIndex === -1) {
    return validIds[0] || null;
  }

  for (let i = startIndex + 1; i < recordIds.length; i += 1) {
    const candidate = recordIds[i];
    if (existsById.has(candidate)) {
      return candidate;
    }
  }
  return null;
}

function clearWrongBookReviewPlan(token) {
  if (!token) return;
  const plans = cleanupExpiredReviewPlans(readReviewPlans());
  if (!plans[token]) return;
  delete plans[token];
  writeReviewPlans(plans);
}

module.exports = {
  getWrongBookRecords,
  syncWrongBookFromRecords,
  removeWrongBookRecord,
  clearWrongBook,
  startWrongBookReview,
  getNextWrongBookRecordId,
  getWrongBookReviewPlan,
  clearWrongBookReviewPlan,
};
