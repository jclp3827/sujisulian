#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { build, AI_REVIEW_PATH, SOURCE_PATH } = require('./build-politics-systematic-user-comprehension-audit');

const ROOT = path.resolve(__dirname, '..');
const absolute = relativePath => path.join(ROOT, relativePath);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const unique = values => [...new Set(values)];

const USER_RISK = `TEN-01 TEN-02 TEN-03 TEN-04 VALUE-01 VALUE-02 VALUE-03 DEV-01 DEV-02 DEV-03 DEV-04 DEV-05 DEV-06 DEV-07 FOUND-01 FOUND-02 FOUND-03 MOD-01 MOD-02 MOD-03 SYS-01 SYS-02 SYS-03 SYS-04 SYS-05 LEADERSHIP-01 LEADERSHIP-03 LIVELIHOOD-01 LIVELIHOOD-02 SUPPORT-01 DEMOCRACY-01 REFORMLAW-02 CULTUREECO-01 CULTUREECO-02 CULTUREECO-04 PARTY-03 SECURITY-02 SECURITY-03 UNITYFOREIGN-02 UNITYFOREIGN-03 BASICS-01 BASICS-04 DIALECTICS-03 DIALECTICS-05 DIALECTICS-06 COGNITION-02 HISTORY-02 CAPITAL-02`.split(' ');
const USER_HOLD = ['CAPITAL-01'];
const ASSESSMENT_HOLD = `TEN-04 DEV-06 FOUND-02 FOUND-03 MOD-01 SYS-01 UNITYFOREIGN-02 UNITYFOREIGN-03 BASICS-01 DIALECTICS-01 DIALECTICS-03 DIALECTICS-05 COGNITION-02 HISTORY-02 CAPITAL-01 CAPITAL-02`.split(' ');
const ASSESSMENT_PASS = `VALUE-03 MOD-02 LEADERSHIP-02 LIVELIHOOD-01 DEMOCRACY-02 REFORMLAW-01 PARTY-02 SECURITY-01 SECURITY-02 UNITYFOREIGN-01 BASICS-02 BASICS-03 DIALECTICS-04 COGNITION-01 COGNITION-03 HISTORY-01 HISTORY-04 MONEY-01 MONEY-02`.split(' ');
const SUBJECT_RISK = `TEN-02 TEN-03 TEN-04 DEV-06 DEV-07 FOUND-01 SYS-01 SYS-02 SYS-03 SYS-05 REFORMLAW-03 CULTUREECO-03 CULTUREECO-04 SECURITY-02 SECURITY-03 BASICS-01 DIALECTICS-04 DIALECTICS-05 DIALECTICS-06 COGNITION-03 HISTORY-01 HISTORY-03 HISTORY-04 CAPITAL-01 CAPITAL-02`.split(' ');
const SUBJECT_HOLD = `DEMOCRACY-03 CULTUREECO-02 PARTY-02 COGNITION-01`.split(' ');

const ASSESSMENT_OVERRIDES = {
  'TEN-02': ['TEN-02/core-question', 'S1'], 'TEN-03': ['TEN-03/section-01-label', 'S2'],
  'TEN-04': ['TEN-04/self-test-prompt', 'S5'], 'DEV-06': ['DEV-06/self-test-answer', 'S6'],
  'FOUND-02': ['FOUND-02/section-04-label', 'S7'], 'FOUND-03': ['FOUND-03/self-test-prompt', 'S7'],
  'MOD-01': ['MOD-01/self-test-prompt', 'S7'], 'SYS-01': ['SYS-01/section-03-label', 'S4'],
  'UNITYFOREIGN-02': ['UNITYFOREIGN-02/recap-text', 'S8'], 'UNITYFOREIGN-03': ['UNITYFOREIGN-03/self-test-answer', 'S4'],
  'BASICS-01': ['BASICS-01/boundary-text', 'S8'], 'DIALECTICS-01': ['DIALECTICS-01/core-question', 'S4'],
  'DIALECTICS-03': ['DIALECTICS-03/section-03-label', 'S7'], 'DIALECTICS-05': ['DIALECTICS-05/section-03-label', 'S7'],
  'COGNITION-02': ['COGNITION-02/self-test-prompt', 'S7'], 'HISTORY-02': ['HISTORY-02/self-test-prompt', 'S7'],
  'CAPITAL-01': ['CAPITAL-01/boundary-text', 'S8'], 'CAPITAL-02': ['CAPITAL-02/boundary-text', 'S8'],
};

const SUBJECT_OVERRIDES = {
  'TEN-02': ['TEN-02/section-01-text', 'S8', '来源分别列出布局与两个总目标，没有把三条定义为正式层次结构。', '删除“组织层次”判断，并明确这是连续阅读安排。'],
  'TEN-03': ['TEN-03/recap-text', 'S8', '来源支持各知识对象，不支持把教学整理写成正式“多层结构”。', '逐对象映射，并标明这是学习整理方式。'],
  'TEN-04': ['TEN-04/section-04-text', 'S8', '来源支持十条内容，不规定“1—3、4—6、7、8—10”为正式四段。', '保留学习分段身份，标题补足父级知识名。'],
  'FOUND-01': ['FOUND-01/section-03-text', 'S8', '当前对象谈四个方面对应，但最小来源集缺少直接支持该关系的来源块。', '补足直接来源，并把“一一对应”收窄为围绕相同对象理解。'],
  'DEV-06': ['DEV-06/recap-text', 'S8', '总结绑定了区域协调和城镇化等无关来源，不能证明五项结构。', '清除无关来源，并明确五项是正式定位还是教学整理。'],
  'DEV-07': ['DEV-07/recap-text', 'S8', '“落实条件”这一统一命名没有被当前绑定来源直接支持。', '按来源逐项陈述，不新增上位分类。'],
  'SYS-02': ['SYS-02/section-01-label', 'S8', '十四个坚持来源没有规定前后七项内部的二级分类。', '明确阅读分段身份，优先使用正式知识名称。'],
  'SYS-03': ['SYS-03/section-01-label', 'S8', '十四个坚持来源没有规定前后七项内部的二级分类。', '明确阅读分段身份，优先使用正式知识名称。'],
  'DEMOCRACY-03': ['DEMOCRACY-03/recap-text', 'S8', '来源没有把统一战线定义为人民当家作主的第三层。', '删除“三个层次”，改为依次学习三个主题。'],
  'CULTUREECO-02': ['CULTUREECO-02/self-test-answer', 'S8', '答案混入生态来源且部分职责措辞缺少直接支持。', '收窄到文化来源直接支持的定位并清除无关来源。'],
  'PARTY-02': ['PARTY-02/self-test-answer', 'S8', '答案带入无关反腐来源，“示范和责任”“缺一不可”也未由绑定块直接给出。', '使用来源原定位作答并清除无关来源。'],
  'COGNITION-01': ['COGNITION-01/self-test-answer', 'S8', '答案缺少支持“不要求人人亲历”的直接来源块。', '补入直接来源或把答案收窄到现有绑定。'],
  'CULTUREECO-03': ['CULTUREECO-03/self-test-answer', 'S8', '“源头预防、系统治理”等扩展词未由当前最小来源集直接给出。', '改用来源原词。'],
  'SECURITY-02': ['SECURITY-02/self-test-answer', 'S8', '答案混入强军来源且含未明确支持的扩展词。', '移除无关来源并直接回答两类风险治理要求。'],
  'HISTORY-04': ['HISTORY-04/recap-text', 'S8', '“社会结构、发展动力、历史主体三个层次”是合理教学概括，不是来源正式分类。', '标明本主题按三类问题依次学习。'],
  'CAPITAL-01': ['CAPITAL-01/boundary-text', 'S8', '劳动力价值及必要劳动时间的完整前置机制仍缺来源。', '保持来源限缩，禁止用模型补源。'],
  'CAPITAL-02': ['CAPITAL-02/boundary-text', 'S8', '资本分类解释仍依赖上一节尚未补足的前置机制。', '与CAPITAL-01共同保持来源限缩。'],
};

function fallbackFinding(roleId, lessonId, inventory, state) {
  const object = inventory.objects.find(item => item.lessonId === lessonId && item.staticSignals.length)
    || inventory.objects.find(item => item.lessonId === lessonId && item.kind === 'core-question');
  const issue = object.issueIds.map(id => inventory.issues.find(item => item.issueId === id))[0];
  return {
    objectId: object.objectId, slice: issue?.slice || (roleId === 'ai-subject-expert' ? 'S8' : 'S4'),
    severity: state === 'hold' ? 'L1' : issue?.severity || 'L2', code: issue?.signalCode || `${issue?.slice || 'S4'}-semantic-review`,
    userFailure: issue?.userFailure || (roleId === 'ai-subject-expert'
      ? '当前对象仍需确认最小充分来源集和教学归纳边界。' : '当前对象需要依赖作者上下文，不能直接支持快速理解。'),
    proposedAction: issue?.proposedAction || (roleId === 'ai-subject-expert'
      ? '逐句核对直接来源，删除无关绑定并收窄越界归纳。' : '补足对象、含义和关系后再复核。'),
  };
}

function makeRole({ roleId, lens, riskIds, holdIds, inventory, overrides = {}, reportedCounts, sharedRun = null }) {
  const risk = new Set(riskIds), hold = new Set(holdIds);
  const lessonAssessments = inventory.lessons.map(lesson => ({ lessonId: lesson.lessonId,
    state: hold.has(lesson.lessonId) ? 'hold' : risk.has(lesson.lessonId) ? 'risk' : 'screened-no-additional-signal' }));
  const findings = lessonAssessments.filter(item => item.state !== 'screened-no-additional-signal').map(item => {
    const override = overrides[item.lessonId];
    if (!override) return fallbackFinding(roleId, item.lessonId, inventory, item.state);
    const [objectId, slice, userFailure, proposedAction] = override;
    return { objectId, slice, severity: item.state === 'hold' ? 'L1' : 'L2', code: `curated-${slice.toLowerCase()}-review`,
      userFailure: userFailure || '当前对象不能在不依赖作者上下文的情况下形成明确、单一的学习任务。',
      proposedAction: proposedAction || '按用户对象、含义、关系的顺序重写并复核。' };
  });
  const normalizedCounts = lessonAssessments.reduce((counts, item) => {
    counts[item.state] = (counts[item.state] || 0) + 1; return counts;
  }, {});
  return { roleId, lens, execution: 'independent-read-only-review', sharedRun, lessonAssessments, findings,
    counts: normalizedCounts, reportedCounts,
    stateNote: 'screened-no-additional-signal表示该角色本轮没有提出L1/L2问题，不等于通过或真人验收。' };
}

function main() {
  const inventory = build({ skipAi: true });
  const lessonIds = inventory.lessons.map(lesson => lesson.lessonId);
  const assessmentRisk = lessonIds.filter(id => !ASSESSMENT_PASS.includes(id) && !ASSESSMENT_HOLD.includes(id));
  const sourceBuffer = fs.readFileSync(absolute(SOURCE_PATH));
  const roles = [
    makeRole({ roleId: 'ai-user', lens: '只看当前屏幕，检查首次进入者能否识别对象、标题、关系和作答任务。',
      riskIds: USER_RISK, holdIds: USER_HOLD, inventory, reportedCounts: { risk: 48, hold: 1, screened: 23 }, sharedRun: 'uc1-ai-user-and-exam-learner' }),
    makeRole({ roleId: 'ai-exam-learner', lens: '检查内容是否帮助公考学习者快速理解、恢复和应用知识，而非学习编排规则。',
      riskIds: USER_RISK, holdIds: USER_HOLD, inventory, reportedCounts: { risk: 48, hold: 1, screened: 23 }, sharedRun: 'uc1-ai-user-and-exam-learner' }),
    makeRole({ roleId: 'ai-subject-expert', lens: '只用当前正式来源核对术语、范围、关系强度、教学分类和最小充分来源集。',
      riskIds: SUBJECT_RISK, holdIds: SUBJECT_HOLD, inventory, overrides: SUBJECT_OVERRIDES,
      reportedCounts: { risk: 25, hold: 4, screened: 43 } }),
    makeRole({ roleId: 'ai-assessment', lens: '检查标题层级、问题与答案对应、任务数量、模块职责和可评分性。',
      riskIds: assessmentRisk, holdIds: ASSESSMENT_HOLD, inventory, overrides: ASSESSMENT_OVERRIDES,
      reportedCounts: { risk: 37, hold: 16, screened: 19 } }),
  ];
  const artifact = {
    schemaVersion: 1, auditId: 'POL-SYS-UC1-AI-REVIEW', auditDate: '2026-10-23', status: 'supplementary-screening-complete',
    contentInputPath: SOURCE_PATH, contentInputSha256: sha256(sourceBuffer), lessonCount: lessonIds.length,
    promptContract: {
      rolesIndependentOfEditorialApproval: true, aiIsNotFormalSource: true, aiDoesNotApproveContent: true,
      userRolesDoNotUseSourceToRepairContext: true, subjectRoleMayOnlyUseBoundSources: true,
      note: '首次用户与公考学习者由同一次只读审查分别记录两个视角；学科和测评角色独立执行。' },
    roles,
    mechanismFindings: [{
      findingId: 'UC1-MECH-001', severity: 'L1', state: 'hold', slice: 'S8',
      title: '旧B4审查证据与当前72节版本漂移',
      evidence: { oldB4EvidenceCurriculumVersion: 'units-ca021565e839', currentCurriculumVersion: 'units-50de00939577',
        currentAuthorAndRuntimeLessonCount: 72, currentSourceBlocksPresent: 490,
        validationCommand: 'node scripts/validate-politics-systematic-review-v1.js', validationExitCode: 1,
        firstFailure: 'MOD-01旧题干断言不再成立' },
      impact: 'B4仍可作为历史来源/目标审查记录，但不能证明当前72节已经完成事实终审或用户理解终审。',
      requiredAction: '在UC2样板修订前更新当前版本的对象级来源审查；旧证据不得被覆盖或冒称当前通过。',
    }],
    synthesis: {
      userView: '48节risk、1节hold；问题扩散至20/21主题，来源层语言、编辑动作标题和复合自测最突出。',
      assessmentView: '37节risk、16节hold；情境题职责、抽象映射、小节粒度和题答对应需要分批修复。',
      subjectView: '25节risk、4节hold；4个对象存在直接来源或关系越界阻断，另有旧B4版本漂移。',
      caution: '不同角色状态不得投票合并为单一通过结论；任一学科hold优先阻断对应对象。',
    },
  };
  const target = absolute(AI_REVIEW_PATH);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(`built ${AI_REVIEW_PATH}: ${roles.length} roles x ${lessonIds.length} lessons; ${roles.reduce((n, role) => n + role.findings.length, 0)} findings`);
}

if (require.main === module) main();
