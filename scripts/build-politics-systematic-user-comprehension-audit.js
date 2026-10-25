#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const AUDIT_DATE = '2026-10-23';
const AUDIT_ID = 'POL-SYS-UC1';
const SOURCE_PATH = 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json';
const SERVICE_PATH = 'miniprogram/services/knowledge-platform/systematic-units.js';
const WXML_PATH = 'miniprogram/subpackages/politics/route/units.wxml';
const AI_REVIEW_PATH = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc1-ai-review-20261023.json';
const DEFAULT_OUTPUT = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc1-inventory-20261023.json';

const absolute = relativePath => path.isAbsolute(relativePath) ? relativePath : path.join(ROOT, relativePath);
const read = relativePath => fs.readFileSync(absolute(relativePath));
const readJson = relativePath => JSON.parse(read(relativePath));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const unique = values => [...new Set(values)];
const countBy = (values, key) => values.reduce((result, value) => {
  const name = typeof key === 'function' ? key(value) : value[key];
  result[name] = (result[name] || 0) + 1;
  return result;
}, {});

const SLICE_NAMES = Object.freeze({
  S1: '语境锚点', S2: '标题语义', S3: '来源层泄漏', S4: '抽象未翻译',
  S5: '问题任务', S6: '答案可用性', S7: '模块职责', S8: '事实与边界',
});

const SOURCE_LIMITED_IDS = new Set(['SYS-01', 'SYS-05', 'BASICS-01', 'CAPITAL-01', 'CAPITAL-02']);
const META_TITLE = /(先(?:看|读|把|知道|保留)|再(?:看|读|把)|接着(?:看|读)|回到|放回|补上|读完整|完整结构|材料怎样用|分别读|怎样用|保留正式名称)/;
const SOURCE_LAYER = /(原文|正文|当前材料|现有材料|本篇材料|这份材料)/;
const BARE_REFERENCE = /(?:第[一二三四五六七八九十\d]+(?:至|到|、)?[一二三四五六七八九十\d]*[条项目]|前[七九十]项|后[七九十]项|另外[一二三四五六七八九十两\d]+(?:个|项)|前面(?:两|三|四|五|六|七|八|九|十|\d+)项|其余(?:几|[一二三四五六七八九十两\d]+)项)/;
const ABSTRACT_TERMS = /(角度|职责|结构|层次|位置|整体|分层理解)/;
const NEGATIVE_QUESTION = /(为什么(?:不能|还要|不是|不)|为何(?:不能|还要|不是|不))/;
const FABRICATED_SCENARIO = /(一份提纲|有人认为|某地|某部门|某材料|一段材料|下列材料|材料中|假如|如果有人)/;
const VAGUE_ANSWER_START = /^(它们|这里|这(?:些|一)|正文|原文|材料|两者|三者|四者)/;

function outputPath() {
  const flag = process.argv.find(argument => argument.startsWith('--out='));
  return flag ? flag.slice('--out='.length) : DEFAULT_OUTPUT;
}

function sourceUnitIds(parts) {
  return unique(parts.flatMap(part => part.sourceBlockIds || []).map(id => id.split(':')[1]));
}

function buildObjects(lesson, displayTitle, outcomeSummary) {
  const prefix = `${lesson.id}/`;
  const objects = [
    { objectId: prefix + 'display-title', kind: 'display-title', order: 1, visibleText: displayTitle, sourceBlockIds: [] },
    { objectId: prefix + 'outcome-summary', kind: 'outcome-summary', order: 2, visibleText: outcomeSummary, sourceBlockIds: [] },
  ];
  lesson.sections.forEach((section, index) => {
    const number = String(index + 1).padStart(2, '0');
    objects.push({ objectId: `${prefix}section-${number}-label`, kind: 'section-label', order: 10 + index * 2,
      visibleText: section.label, sourceBlockIds: section.sourceBlockIds || [] });
    objects.push({ objectId: `${prefix}section-${number}-text`, kind: 'section-text', order: 11 + index * 2,
      visibleText: section.text, sourceBlockIds: section.sourceBlockIds || [] });
  });
  if (lesson.boundary) objects.push(
    { objectId: prefix + 'boundary-label', kind: 'boundary-label', order: 80, visibleText: lesson.boundary.label, sourceBlockIds: lesson.boundary.sourceBlockIds || [] },
    { objectId: prefix + 'boundary-text', kind: 'boundary-text', order: 81, visibleText: lesson.boundary.text, sourceBlockIds: lesson.boundary.sourceBlockIds || [] },
  );
  objects.push(
    { objectId: prefix + 'recap-label', kind: 'recap-label', order: 90, visibleText: lesson.recap.label, sourceBlockIds: lesson.recap.sourceBlockIds || [] },
    { objectId: prefix + 'recap-text', kind: 'recap-text', order: 91, visibleText: lesson.recap.text, sourceBlockIds: lesson.recap.sourceBlockIds || [] },
    { objectId: prefix + 'self-test-prompt', kind: 'self-test-prompt', order: 100, visibleText: lesson.reflection.prompt, sourceBlockIds: lesson.reflection.sourceBlockIds || [] },
    { objectId: prefix + 'self-test-answer', kind: 'self-test-answer', order: 101, visibleText: lesson.reflection.answer, sourceBlockIds: lesson.reflection.sourceBlockIds || [] },
  );
  const parts = [...lesson.sections, ...(lesson.boundary ? [lesson.boundary] : []), lesson.recap];
  const units = sourceUnitIds(parts);
  objects.push({ objectId: prefix + 'source-primary-entry', kind: 'source-entry', order: 110,
    visibleText: '查看主要原文', sourceBlockIds: parts.flatMap(part => part.sourceBlockIds || []), sourceUnitIds: units.slice(0, 1) });
  if (units.length > 1) objects.push({ objectId: prefix + 'source-related-entry', kind: 'source-entry', order: 111,
    visibleText: `其他相关原文（${units.length - 1}）`, sourceBlockIds: parts.flatMap(part => part.sourceBlockIds || []), sourceUnitIds: units.slice(1) });
  return objects;
}

function staticSignals(object, lesson) {
  const text = object.visibleText;
  const signals = [];
  const isLabel = object.kind.endsWith('-label') || object.kind === 'display-title';
  const isQuestion = object.kind === 'self-test-prompt';
  if (BARE_REFERENCE.test(text)) signals.push({ code: 'bare-reference', slice: 'S1', severity: 'L2',
    userFailure: '对象只用编号、前后项或相对位置指代，用户需要回到页面外猜测它属于哪组正式知识。', proposedAction: '补出所属知识组和知识名称；编号只保留为辅助定位。' });
  if (isLabel && META_TITLE.test(text)) signals.push({ code: 'editorial-heading', slice: 'S2', severity: 'L2',
    userFailure: '标题表达阅读或编辑动作，没有告诉用户这一段具体讲什么知识。', proposedAction: '改成知识对象或结论；没有独立知识价值时删除标题。' });
  if (SOURCE_LAYER.test(text)) signals.push({ code: 'source-layer-wording', slice: 'S3', severity: object.kind === 'self-test-answer' ? 'L1' : 'L2',
    userFailure: '用户看到“原文、正文、材料”等来源层词语，却不知道它具体指向哪个知识对象。', proposedAction: '直接写出知识对象；来源身份由查阅入口承担。' });
  if (ABSTRACT_TERMS.test(text) && !/[：:；;]/.test(text) && text.length < 30) signals.push({ code: 'untranslated-abstraction', slice: 'S4', severity: 'L2',
    userFailure: '表达使用“角度、职责、结构、层次”等抽象词，却没有立即说明各项分别回答什么。', proposedAction: '补出逐项映射，或改成可直接复述的具体关系。' });
  if (isQuestion) {
    const questionCount = (text.match(/[？?]/g) || []).length;
    if (questionCount > 1) signals.push({ code: 'multiple-question-marks', slice: 'S5', severity: 'L1',
      userFailure: '一道自测同时提出多个问句，用户无法快速确定唯一作答任务。', proposedAction: '保留一个本节小目标，其他问题拆开或放回解释。' });
    if ([...text].length > 35) signals.push({ code: 'long-question', slice: 'S5', severity: 'L2',
      userFailure: '题干过长，作答前需要先拆解问题结构。', proposedAction: '缩为一个独立可读的知识问题。' });
    if (NEGATIVE_QUESTION.test(text)) signals.push({ code: 'negative-editorial-question', slice: 'S5', severity: 'L2',
      userFailure: '反向设问让用户解释编排或纠错理由，而不是直接回忆本节知识。', proposedAction: '改为直接询问对象、含义或关系。' });
  }
  if (object.kind === 'self-test-answer' && VAGUE_ANSWER_START.test(text)) signals.push({ code: 'vague-answer-subject', slice: 'S6', severity: 'L1',
    userFailure: '答案从无前置主语的指代词开始，脱离题干无法确认它在回答什么。', proposedAction: '先写出完整知识对象，再直接给出含义或关系。' });
  if ((object.kind === 'self-test-prompt' || object.kind === 'self-test-answer') && FABRICATED_SCENARIO.test(text)) signals.push({ code: 'scenario-in-systematic-test', slice: 'S7', severity: 'L2',
    userFailure: '系统学习自测要求处理产品编写的情境，偏离本节直接理解与轻量复述。', proposedAction: '改为直接理解题，或经来源和评分点审核后迁移到理解应用题。' });
  if (SOURCE_LIMITED_IDS.has(lesson.id) && object.kind === 'boundary-text') signals.push({ code: 'source-limited-boundary-review', slice: 'S8', severity: 'L2',
    userFailure: '本节已有来源限缩，边界必须由学科审核确认没有把缺失内容写成已完整讲授。', proposedAction: '保持限缩并由学科专家逐项核对；来源不足时继续hold。' });
  return signals;
}

function issueId(lessonId, objectId, slice, code) {
  return `UC1-${slice}-${sha256(`${lessonId}|${objectId}|${code}`).slice(0, 10).toUpperCase()}`;
}

function normalizeAiReview(review, objectIds, lessonIds, sourceHash) {
  if (!review) return null;
  if (review.contentInputSha256 !== sourceHash) throw new Error('AI review source hash does not match current author source');
  const expectedRoles = ['ai-user', 'ai-exam-learner', 'ai-subject-expert', 'ai-assessment'];
  const roles = new Map(review.roles.map(role => [role.roleId, role]));
  for (const roleId of expectedRoles) {
    const role = roles.get(roleId);
    if (!role) throw new Error(`missing AI role ${roleId}`);
    if (role.lessonAssessments.length !== lessonIds.size) throw new Error(`${roleId} does not cover all lessons`);
    if (new Set(role.lessonAssessments.map(item => item.lessonId)).size !== lessonIds.size) throw new Error(`${roleId} duplicate lesson assessment`);
    for (const item of role.lessonAssessments) {
      if (!lessonIds.has(item.lessonId)) throw new Error(`${roleId} unknown lesson ${item.lessonId}`);
      if (!['risk', 'screened-no-additional-signal', 'hold'].includes(item.state)) throw new Error(`${roleId} invalid state`);
    }
    for (const finding of role.findings) {
      if (!objectIds.has(finding.objectId)) throw new Error(`${roleId} unknown object ${finding.objectId}`);
      if (!SLICE_NAMES[finding.slice] || !['L1', 'L2', 'L3'].includes(finding.severity)) throw new Error(`${roleId} invalid finding classification`);
    }
  }
  return review;
}

function build(options = {}) {
  const samplesBuffer = read(SOURCE_PATH);
  const samples = JSON.parse(samplesBuffer);
  delete require.cache[require.resolve(absolute(SERVICE_PATH))];
  const service = require(absolute(SERVICE_PATH));
  const groupById = new Map(samples.groups.map(group => [group.id, group]));
  const routeByGroupId = new Map(samples.routes.flatMap(route => route.groupIds.map(groupId => [groupId, route])));
  const objects = [];
  const lessons = [];
  for (const lesson of samples.lessons) {
    const displayTitle = service.displayTitleForLessonId(lesson.id);
    const outcomeSummary = lesson.objectives.map(service.formatOutcomeObjective).join('；');
    const lessonObjects = buildObjects(lesson, displayTitle, outcomeSummary).map(object => ({ ...object, lessonId: lesson.id,
      groupId: lesson.groupId, routeId: routeByGroupId.get(lesson.groupId)?.id || null }));
    objects.push(...lessonObjects);
    lessons.push({ lessonId: lesson.id, routeId: routeByGroupId.get(lesson.groupId)?.id || null,
      groupId: lesson.groupId, groupTitle: groupById.get(lesson.groupId)?.title || '', displayTitle,
      objectIds: lessonObjects.map(object => object.objectId) });
  }
  const objectIds = new Set(objects.map(object => object.objectId));
  const lessonIds = new Set(lessons.map(lesson => lesson.lessonId));
  const sourceHash = sha256(samplesBuffer);
  const aiReview = !options.skipAi && fs.existsSync(absolute(AI_REVIEW_PATH)) ? readJson(AI_REVIEW_PATH) : null;
  const normalizedReview = normalizeAiReview(aiReview, objectIds, lessonIds, sourceHash);
  const roleById = new Map((normalizedReview?.roles || []).map(role => [role.roleId, role]));
  const findingsByObject = new Map();
  for (const role of normalizedReview?.roles || []) {
    for (const finding of role.findings) {
      if (!findingsByObject.has(finding.objectId)) findingsByObject.set(finding.objectId, []);
      findingsByObject.get(finding.objectId).push({ ...finding, roleId: role.roleId });
    }
  }

  const issues = [];
  for (const object of objects) {
    const lesson = samples.lessons.find(item => item.id === object.lessonId);
    const signals = staticSignals(object, lesson);
    const aiFindings = findingsByObject.get(object.objectId) || [];
    const merged = new Map();
    for (const signal of signals) merged.set(`${signal.slice}|${signal.code}`, { ...signal, origins: ['static'] });
    for (const finding of aiFindings) {
      const key = `${finding.slice}|${finding.code}`;
      if (!merged.has(key)) merged.set(key, { code: finding.code, slice: finding.slice, severity: finding.severity,
        userFailure: finding.userFailure, proposedAction: finding.proposedAction, origins: [finding.roleId] });
      else {
        const current = merged.get(key);
        current.origins.push(finding.roleId);
        if (finding.severity === 'L1') current.severity = 'L1';
      }
    }
    const reviewStates = {};
    for (const roleId of ['ai-user', 'ai-exam-learner', 'ai-subject-expert', 'ai-assessment']) {
      const role = roleById.get(roleId);
      const assessment = role?.lessonAssessments.find(item => item.lessonId === object.lessonId);
      reviewStates[roleId] = !role ? 'pending' : aiFindings.some(item => item.roleId === roleId) ? 'risk' : assessment.state;
    }
    object.issueIds = [];
    object.staticSignals = signals.map(signal => signal.code);
    object.reviewStates = reviewStates;
    for (const signal of merged.values()) {
      const id = issueId(object.lessonId, object.objectId, signal.slice, signal.code);
      object.issueIds.push(id);
      issues.push({ issueId: id, lessonId: object.lessonId, objectId: object.objectId,
        visibleText: object.visibleText, slice: signal.slice, sliceName: SLICE_NAMES[signal.slice], severity: signal.severity,
        signalCode: signal.code, origins: unique(signal.origins), userFailure: signal.userFailure,
        sourceStatus: SOURCE_LIMITED_IDS.has(object.lessonId) ? 'source-limited' : 'formal-source-bound-or-derived-display',
        proposedAction: signal.proposedAction, before: object.visibleText, after: null, affectedModes: ['systematic-learning'],
        reviewStates: { ...reviewStates, editor: 'pending', 'real-user-sample': 'pending' }, state: 'identified' });
    }
    object.auditState = object.issueIds.length ? 'identified-risk' : normalizedReview ? 'screened-no-current-signal' : 'ai-review-pending';
  }

  const seedMappings = [
    ['seed-01', ['TEN-02/self-test-prompt'], '用户不知道“第4至6条”属于哪组内容。'],
    ['seed-02', ['TEN-03/section-01-label'], '编辑动作“先保留完整结构”不表达知识。'],
    ['seed-03', ['TEN-04/section-01-label', 'TEN-04/section-02-label', 'TEN-04/section-03-label'], '三个编号标题都失去“十个明确”的父语境。'],
    ['seed-04', ['TEN-04/self-test-prompt'], '复合题同时追问三条重点和保留编排的原因。'],
    ['seed-05', ['SYS-01/section-03-label'], '“另外两个角度”缺少独立对象。'],
    ['seed-06', ['SYS-01/section-04-label'], '“材料怎样用”是编写动作。'],
    ['seed-07', ['SYS-02/boundary-label'], '“保留正式名称”是审稿规则。'],
    ['seed-08', ['MOD-01/boundary-text'], '“原文中的目标表述”暴露来源层且对象不明。'],
    ['seed-09', ['MOD-01/self-test-prompt'], '虚构提纲纠错不符合系统学习轻量自测。'],
    ['seed-10', ['MOD-03/section-02-label'], '“再把九项要求读完整”是编辑动作。'],
    ['seed-11', ['LEADERSHIP-03/section-01-label'], '“先把共同富裕读完整”是编辑动作。'],
    ['seed-12', ['DEV-02/self-test-prompt'], '题干用编排理由询问五个理念为何合看。'],
    ['seed-13', ['DEV-03/self-test-prompt'], '反向问题依赖页面内缩略表述。'],
    ['seed-14', ['DEV-05/self-test-answer'], '答案以“正文”替代明确知识对象。'],
    ['seed-15', ['DEV-06/self-test-prompt'], '“分层理解”是作者抽象，不能直接成为用户任务。'],
  ].map(([seedId, mappedObjectIds, userComment]) => {
    for (const objectId of mappedObjectIds) if (!objectIds.has(objectId)) throw new Error(`seed mapping references unknown object ${objectId}`);
    const mappedObjects = mappedObjectIds.map(id => objects.find(item => item.objectId === id));
    return { seedId, objectIds: mappedObjectIds, lessonIds: unique(mappedObjects.map(object => object.lessonId)), userComment,
      issueIds: mappedObjects.flatMap(object => object.issueIds),
      mappingState: mappedObjects.every(object => object.issueIds.length) ? 'mapped-to-inventory' : 'manual-review-required' };
  });
  const seededObjectIds = new Set(seedMappings.flatMap(seed => seed.objectIds));
  for (const issue of issues) {
    issue.state = issue.origins.some(origin => origin !== 'static') || seededObjectIds.has(issue.objectId) ? 'identified' : 'machine-candidate';
  }
  for (const object of objects) {
    const objectIssues = object.issueIds.map(id => issues.find(issue => issue.issueId === id));
    object.auditState = objectIssues.some(issue => issue.state === 'identified') ? 'identified-risk'
      : objectIssues.length ? 'machine-candidate' : normalizedReview ? 'screened-no-current-signal' : 'ai-review-pending';
  }
  for (const lesson of lessons) {
    lesson.issueIds = lesson.objectIds.flatMap(id => objects.find(object => object.objectId === id).issueIds);
    const lessonObjects = lesson.objectIds.map(id => objects.find(object => object.objectId === id));
    lesson.auditState = lessonObjects.some(object => object.auditState === 'identified-risk') ? 'identified-risk'
      : lessonObjects.some(object => object.auditState === 'machine-candidate') ? 'machine-candidate'
        : normalizedReview ? 'screened-no-current-signal' : 'ai-review-pending';
    lesson.sliceCounts = countBy(lesson.issueIds.map(id => issues.find(issue => issue.issueId === id)), 'slice');
  }

  const artifact = {
    schemaVersion: 1, auditId: AUDIT_ID, auditDate: AUDIT_DATE, status: 'uc1-inventory-complete-uc2-not-started',
    scope: '政治系统学习当前2条路线、21个主题、72节的实际用户可见教学对象；不修改教学内容或运行行为。',
    contractPath: 'docs/knowledge-platform/implementations/politics-systematic-user-comprehension-governance-20261023.md',
    authority: { sourcePath: SOURCE_PATH, sourceSha256: sourceHash, servicePath: SERVICE_PATH,
      serviceSha256: sha256(read(SERVICE_PATH)), wxmlPath: WXML_PATH, wxmlSha256: sha256(read(WXML_PATH)),
      aiReviewPath: normalizedReview ? AI_REVIEW_PATH : null, aiReviewSha256: normalizedReview ? sha256(read(AI_REVIEW_PATH)) : null,
      sourcePackageVersion: samples.sourcePackageVersion, curriculumId: samples.id },
    objectModel: { included: ['display-title', 'outcome-summary', 'section-label', 'section-text',
      'boundary-label', 'boundary-text', 'recap-label', 'recap-text', 'self-test-prompt', 'self-test-answer', 'source-entry'],
      excludedBecauseNotRendered: ['scopeLimit', 'transition', 'learningLink'],
      note: '目标在页面合并为一条“读完能理解”；来源入口按每节实际主要/相关入口登记。' },
    counts: { routes: samples.routes.length, groups: samples.groups.length, lessons: lessons.length,
      sections: samples.lessons.reduce((sum, lesson) => sum + lesson.sections.length, 0), objects: objects.length,
      issues: issues.length, identifiedIssues: issues.filter(issue => issue.state === 'identified').length,
      machineCandidates: issues.filter(issue => issue.state === 'machine-candidate').length,
      lessonsWithRisk: lessons.filter(lesson => lesson.auditState === 'identified-risk').length,
      slices: countBy(issues, 'slice'), severities: countBy(issues, 'severity'), objectStates: countBy(objects, 'auditState'),
      seedMappings: seedMappings.length, sourceLimitedLessons: SOURCE_LIMITED_IDS.size },
    reviewSemantics: {
      'identified-risk': '静态规则或AI角色已指出具体失败；只表示问题已识别，尚未完成编辑定性或修复。',
      'machine-candidate': '机器规则召回了待人工定性的候选；不能直接视为问题或通过。',
      'screened-no-current-signal': '静态规则和本轮AI角色未提出具体风险；不是通过、验收或用户可理解结论。',
      'ai-review-pending': '静态盘点完成，AI四角色尚未完整写入证据。',
    },
    lessons, objects, issues, seedMappings, mechanismIssues: normalizedReview?.mechanismFindings || [],
    nextBatch: 'UC2-sample-calibration',
    stopGate: { allLessonsInventoried: lessons.length === 72, allObjectsHaveState: objects.every(object => object.auditState),
      noPassedOrAcceptedState: !JSON.stringify({ lessons, objects, issues }).match(/(?:\"passed\"|\"accepted\")/),
      aiFourRolesComplete: Boolean(normalizedReview), teachingContentChanged: false, runtimeChanged: false },
  };
  return artifact;
}

function main() {
  const artifact = build();
  const target = absolute(outputPath());
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(`built ${path.relative(ROOT, target)}: ${artifact.counts.lessons} lessons, ${artifact.counts.objects} objects, ${artifact.counts.identifiedIssues} identified issues, ${artifact.counts.machineCandidates} machine candidates`);
}

if (require.main === module) main();
module.exports = { build, DEFAULT_OUTPUT, AI_REVIEW_PATH, SOURCE_PATH };
