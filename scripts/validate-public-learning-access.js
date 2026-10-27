#!/usr/bin/env node
const assert = require('node:assert/strict');

global.wx = {
  base64ToArrayBuffer(value) {
    const bytes = Buffer.from(value, 'base64');
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  },
};

const policy = require('../miniprogram/services/public-learning-content');
const noteBody = require('../miniprogram/subpackages/note/models/note-catalog');
const notePack = require('../miniprogram/subpackages/note/models/learning-pack-runtime');
const memoryPack = require('../miniprogram/subpackages/note/models/memory-pack-runtime');
const { createPractice } = require('../miniprogram/subpackages/note/services/practice-runtime');
const { availableContent: noteContent } = require('../miniprogram/subpackages/note/services/learning-content');
const { availableCards } = require('../miniprogram/subpackages/note/services/memory-content');
const { evaluateEnrollment } = require('../miniprogram/subpackages/note/services/memory-admission');
const commonBody = require('../miniprogram/subpackages/common-sense/models/note-common-sense-runtime');
const commonPack = require('../miniprogram/subpackages/common-sense/models/learning-pack-runtime');
const { availableContent: commonContent } = require('../miniprogram/subpackages/common-sense/services/learning-content');
const guideExpansion = require('../miniprogram/subpackages/common-sense/models/guide-expansion-candidate-runtime');
const { prepareExpansionContent } = require('../miniprogram/subpackages/common-sense/services/guide-preview-content');
const { createGoldenGuideContent } = require('../miniprogram/subpackages/common-sense/services/guide-content');

const releaseWx = {
  getAccountInfoSync() { return { miniProgram: { envVersion: 'release' } }; },
  getStorageSync() { return null; },
  setStorageSync() {},
};

assert.equal(policy.reviewedContentVisible, true);
const practice = createPractice(releaseWx);
const expectedNotes = noteContent(noteBody, notePack, true);
assert.equal(practice.development, false);
assert.deepEqual(practice.content.resources.map(item => item.id), expectedNotes.resources.map(item => item.id));
assert.ok(practice.content.resources.length > 0);

const publicCards = availableCards(noteBody, memoryPack, false, { publicReviewed: policy.reviewedContentVisible });
const developmentCards = availableCards(noteBody, memoryPack, true);
assert.deepEqual(publicCards.map(item => item.id), developmentCards.map(item => item.id));
assert.ok(publicCards.length > 0);
const enrollment = evaluateEnrollment(memoryPack.enrollment, noteBody);
assert.ok(enrollment.excluded.length > 0);
assert.ok(enrollment.excluded.every(item => !publicCards.some(card => card.id === item.cardId)));

const publicCommon = commonContent(commonBody, commonPack, false,
  { publicReviewed: policy.reviewedContentVisible });
const developmentCommon = commonContent(commonBody, commonPack, true);
for (const key of ['questions', 'mnemonics', 'comparisons', 'examTopics']) {
  assert.deepEqual(publicCommon[key].map(item => item.id), developmentCommon[key].map(item => item.id));
  assert.ok(publicCommon[key].length > 0);
}
assert.ok(commonPack.questions.some(item => item.status === 'blocked'));
assert.ok(publicCommon.questions.every(item => item.status !== 'blocked'));
assert.equal(policy.expandedCommonSenseGuideVisible, true);
const publicGuide = createGoldenGuideContent(commonBody, prepareExpansionContent(guideExpansion));
assert.equal(publicGuide.stats.groups, commonBody.points.length);
assert.equal(publicGuide.stats.holds, 1);
assert.equal(publicGuide.stats.cards, 1681);

console.log(JSON.stringify({ passed: true, release: {
  noteQuestions: practice.content.resources.length,
  memoryCards: publicCards.length,
  commonQuestions: publicCommon.questions.length,
  commonMnemonics: publicCommon.mnemonics.length,
  commonComparisons: publicCommon.comparisons.length,
  commonExamTopics: publicCommon.examTopics.length,
  commonGuideCards: publicGuide.stats.cards,
} }));
