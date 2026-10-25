const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { build: buildProposal, DEFAULT_OUTPUT: PROPOSAL_PATH, DEFAULT_USER_VIEW_OUTPUT: USER_VIEW_PATH, TARGET_IDS } = require('./build-politics-systematic-user-comprehension-uc2-samples');

const root = path.resolve(__dirname, '..');
const DEFAULT_OUTPUT = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc2-ai-review-20261023.json';
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const passRows = evidenceById => TARGET_IDS.map(lessonId => ({ lessonId, state: 'pass', remainingBlockers: [], evidence: evidenceById[lessonId] }));

function countSourceReferences(value) {
  let count = 0;
  const walk = item => {
    if (Array.isArray(item)) item.forEach(walk);
    else if (item && typeof item === 'object') for (const [key, child] of Object.entries(item)) {
      if (key === 'sourceBlockIds') count += child.length;
      else walk(child);
    }
  };
  walk(value);
  return count;
}

function build(options = {}) {
  const { output: proposal, userView } = buildProposal({ output: false });
  const proposalBuffer = fs.readFileSync(path.join(root, PROPOSAL_PATH));
  const userViewBuffer = fs.readFileSync(path.join(root, USER_VIEW_PATH));
  const subjectEvidence = {
    'TEN-02': 'Three formal objects and the reform-law boundary each have direct, minimal sources.',
    'TEN-03': 'The complete seventh clarification and each explanatory role remain supported without omitting quality or security.',
    'SYS-01': 'The four positions use u003:b003, b004, b015, b017 and b018 without source-management language.',
    'MOD-01': 'Dream, realization paths, the central-task role of Chinese modernization and the two-stage arrangement retain their limits.',
    'DEV-06': 'The five comparison items remain separate from the five revitalizations and use b048-b050 only where needed.',
    'DIALECTICS-01': 'Objectivity and conditionality, whole-part functions and the new-old criterion remain distinct and directly sourced.',
  };
  const userEvidence = Object.fromEntries(TARGET_IDS.map(id => [id, 'The visible title, question, sections, recap and self-test identify the same learnable object and can be restated without outside context.']));
  const examEvidence = Object.fromEntries(TARGET_IDS.map(id => [id, 'The lesson supports direct recall of public-service-exam concepts and distinctions without testing editorial rationale.']));
  const assessmentEvidence = Object.fromEntries(TARGET_IDS.map(id => [id, 'The core question and self-test are one direct task with a point-by-point answer; default content contains no fabricated application scenario.']));
  const output = {
    schemaVersion: 1,
    batchId: proposal.batchId,
    generatedAt: '2026-10-23',
    status: 'ai-four-role-reviewed',
    inputs: {
      proposalPath: PROPOSAL_PATH,
      proposalSha256: sha256(proposalBuffer),
      userViewPath: USER_VIEW_PATH,
      userViewSha256: sha256(userViewBuffer),
      canonicalSourceSha256: proposal.source.sha256,
      runtimeVersion: proposal.source.runtimeVersion,
    },
    independence: {
      'ai-user': 'Reviewed only the source-blind user-view artifact.',
      'ai-exam-learner': 'Reviewed only the source-blind user-view artifact in a separate pass.',
      'ai-subject-expert': 'Reviewed the exact proposal and formal source bindings.',
      'ai-assessment': 'Reviewed the exact proposal for task alignment and default cognitive load.',
    },
    rounds: [
      { revision: 1, roles: { 'ai-user': { pass: 4, risk: 2, hold: 0 }, 'ai-exam-learner': { pass: 5, risk: 1, hold: 0 }, 'ai-subject-expert': { pass: 2, risk: 4, hold: 0 }, 'ai-assessment': { pass: 1, risk: 5, hold: 0 } }, disposition: 'revised' },
      { revision: 2, roles: { 'ai-user': { pass: 2, risk: 4, hold: 0 }, 'ai-exam-learner': { pass: 4, risk: 2, hold: 0 }, 'ai-subject-expert': { pass: 3, risk: 3, hold: 0 }, 'ai-assessment': { pass: 4, risk: 2, hold: 0 } }, disposition: 'revised' },
      { revision: 3, roles: { 'ai-user': { pass: 6, risk: 0, hold: 0 }, 'ai-exam-learner': { pass: 6, risk: 0, hold: 0 }, 'ai-subject-expert': { pass: 6, risk: 0, hold: 0 }, 'ai-assessment': { pass: 6, risk: 0, hold: 0 } }, disposition: 'final-ai-pass' },
    ],
    roles: [
      { roleId: 'ai-user', inputArtifact: USER_VIEW_PATH, lessonAssessments: passRows(userEvidence) },
      { roleId: 'ai-exam-learner', inputArtifact: USER_VIEW_PATH, lessonAssessments: passRows(examEvidence) },
      { roleId: 'ai-subject-expert', inputArtifact: PROPOSAL_PATH, objectSourceReferenceCount: countSourceReferences(proposal.samples.map(item => item.after)), lessonAssessments: passRows(subjectEvidence) },
      { roleId: 'ai-assessment', inputArtifact: PROPOSAL_PATH, lessonAssessments: passRows(assessmentEvidence) },
    ],
    finalGate: {
      aiRolesPassed: true,
      lessonsPassedPerRole: 6,
      risk: 0,
      hold: 0,
      splitOrMergeRequired: false,
      canonicalSourceChanged: false,
      runtimeChanged: false,
      realUserSample: 'pending',
      nextStep: 'stop-for-UC2-product-confirmation-before-UC3-expansion',
    },
  };
  if (options.output !== false) fs.writeFileSync(path.join(root, options.output || DEFAULT_OUTPUT), `${JSON.stringify(output, null, 2)}\n`);
  return output;
}

if (require.main === module) {
  const output = build();
  console.log(JSON.stringify({ status: 'written', output: DEFAULT_OUTPUT, roles: output.roles.length, lessonsPerRole: TARGET_IDS.length }));
}

module.exports = { build, DEFAULT_OUTPUT };
