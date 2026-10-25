#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const AUDIT_DATE = '2026-10-21';
const USER_TASKS_PATH = 'docs/knowledge-platform/implementations/politics-learning-content-b6-user-effectiveness-tasks-20261021.md';

function absolute(relativePath) { return path.join(ROOT, relativePath); }
function readJson(relativePath) { return JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8')); }
function sha256(relativePath) { return crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex'); }

const VALIDATORS = [
  { id: 'b1-objectives', layer: 'source-and-projection', script: 'scripts/validate-politics-learning-objectives-v1.js' },
  { id: 'b2-confusion', layer: 'teaching', script: 'scripts/validate-politics-confusion-bank-v1.js' },
  { id: 'b3-recall', layer: 'teaching', script: 'scripts/validate-politics-recall-bank-v1.js' },
  { id: 'systematic-content', layer: 'source-and-teaching', script: 'scripts/validate-politics-systematic-content.js' },
  { id: 'b4-systematic-review', layer: 'teaching', script: 'scripts/validate-politics-systematic-review-v1.js' },
  { id: 'b5-cross-mode', layer: 'teaching', script: 'scripts/validate-politics-cross-mode-convergence-v1.js' },
  { id: 'learning-state-machine', layer: 'interaction', script: 'scripts/validate-knowledge-platform-learning.js' },
  { id: 'quick-interaction', layer: 'interaction', script: 'scripts/validate-politics-quick-reading.js' },
  { id: 'systematic-interaction', layer: 'interaction', script: 'scripts/validate-politics-systematic-units.js' },
  { id: 'ui-tokens', layer: 'interaction', script: 'scripts/validate-ui-tokens.js' },
  { id: 'politics-vertical-gates', layer: 'interaction', script: 'scripts/validate-politics-s55-r4.js' },
  { id: 'candidate-boundaries', layer: 'interaction-and-release-boundary', script: 'scripts/validate-knowledge-platform-candidate.js' },
];

function runValidator(record) {
  const result = spawnSync(process.execPath, [absolute(record.script)], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return {
    ...record,
    scriptSha256: sha256(record.script),
    exitCode: result.status,
    passed: result.status === 0,
    failure: result.status === 0 ? null : String(result.stderr || result.stdout || 'unknown validator failure').slice(0, 2000),
  };
}

function main() {
  const b0 = readJson('docs/knowledge-platform/implementations/evidence/politics-learning-content-b0-baseline-20261021.json');
  const b1 = readJson('docs/knowledge-platform/implementations/evidence/politics-learning-content-b1-objective-matrix-20261021.json');
  const b2 = readJson('docs/knowledge-platform/implementations/evidence/politics-learning-content-b2-confusion-bank-20261021.json');
  const b3 = readJson('docs/knowledge-platform/implementations/evidence/politics-learning-content-b3-recall-bank-20261021.json');
  const b4 = readJson('docs/knowledge-platform/implementations/evidence/politics-learning-content-b4-systematic-review-20261021.json');
  const b5 = readJson('docs/knowledge-platform/implementations/evidence/politics-learning-content-b5-cross-mode-convergence-20261021.json');
  const confusion = readJson('docs/knowledge-pilot/sources/politics/politics-confusion-bank-v1.json');
  const recall = readJson('docs/knowledge-pilot/sources/politics/politics-recall-bank-v1.json');
  const convergence = readJson('docs/knowledge-pilot/sources/politics/politics-cross-mode-convergence-v1.json');
  const sourcePackage = require(absolute('miniprogram/models/politics-p3-v2-runtime.js'));
  const { buildCanonicalPackage } = require(absolute('miniprogram/services/knowledge-platform/politics-adapter.js'));
  const knowledgePackage = buildCanonicalPackage(sourcePackage);
  const validatorRuns = VALIDATORS.map(runValidator);
  const failedValidators = validatorRuns.filter((run) => !run.passed).map((run) => run.id);

  const sourceCorrect = {
    status: b0.status.startsWith('passed') && b1.status.startsWith('passed') && b4.status.startsWith('passed') && b5.status.startsWith('passed') ? 'passed-current-scope' : 'blocked',
    evidenceIds: [b0.auditId, b1.auditId, b4.auditId, b5.auditId],
    facts: {
      formalUnits: 37,
      objectives: 97,
      systematicLessons: 72,
      quickSections: 6,
      knownScopeGaps: convergence.boundaryAudit.knownScopeGaps.map((gap) => gap.id),
    },
    boundary: 'Pass applies to the current 37 formal units only and does not claim complete political theory or exam coverage.',
  };

  const teachingCorrect = {
    status: b2.status.startsWith('passed') && b3.status.startsWith('passed') && b4.status.startsWith('passed') && b5.status.startsWith('passed') ? 'passed-candidate-only' : 'blocked',
    evidenceIds: [b2.auditId, b3.auditId, b4.auditId, b5.auditId],
    facts: {
      quickOrientationObjectives: b5.counts.quickOrientationObjectives,
      systematicObjectives: b4.counts.objectives,
      systematicLessonsAccepted: b4.counts.accepted,
      systematicLessonsRevised: b4.counts.revised,
      systematicLessonsScopeLimited: b4.counts.scopeLimited,
      candidateRecallCards: b3.counts.candidateCards,
      directlyAuditedRecallObjectives: b3.counts.objectiveCoverage,
      candidateConfusionItems: b2.counts.totalReviewedItems,
      directlyAuditedConfusionObjectives: b5.counts.reviewedConfusionObjectives,
    },
    boundary: 'Candidate recall and confusion banks are editorial artifacts; they are not consumed by the current mini-program runtime.',
  };

  const interactionUsable = {
    status: failedValidators.length ? 'blocked' : 'automated-passed-current-runtime',
    validatorCount: validatorRuns.length,
    failedValidators,
    currentRuntime: {
      recallCards: knowledgePackage.recallItems.length,
      confusionPairs: knowledgePackage.contrastPairs.length,
      candidateRecallCardsIntegrated: false,
      candidateConfusionItemsIntegrated: false,
    },
    verifiedBehaviors: [
      'quick-next-skip-finish-save-resume-and-systematic-continuation',
      'systematic-topic-entry-continuous-progression-skip-exit-resume-and-source-return',
      'current-runtime-recall-reveal-self-rating-remedy-and-storage-failure',
      'current-runtime-confusion-initial-check-evidence-variant-check-and-state-restore',
      'shared-button-and-spacing-token-contracts',
    ],
    simulator: 'not-rerun-in-b6; existing local interaction evidence remains historical and is not promoted to this run',
    realDevice: 'not-run-by-user-direction',
    boundary: 'Automated interaction results validate the current runtime mechanics. Candidate B2/B3 content requires a later integration batch before live interaction can be claimed for those candidates.',
  };

  const userEffective = {
    status: 'pending-external-user-validation',
    evidencePath: USER_TASKS_PATH,
    evidenceSha256: fs.existsSync(absolute(USER_TASKS_PATH)) ? sha256(USER_TASKS_PATH) : null,
    requiredOutcomes: [
      'first-use-quick-overview-reconstructs-two-main-lines-and-current-scope',
      'systematic-learning-user-explains-goal-link-and-boundary-after-one-small-unit',
      'recall-retest-restores-target-without-answer-visible',
      'confusion-variant-distinguishes-both-sides-on-the-declared-dimension',
    ],
    boundary: 'No automated gate, editor review, simulator run, or author self-check can substitute for observed user understanding and retention.',
  };

  const artifact = {
    schemaVersion: 1,
    auditId: 'POL-LCQ-V1-B6',
    auditDate: AUDIT_DATE,
    status: failedValidators.length ? 'blocked' : 'candidate-handoff-ready-user-effect-pending',
    scope: 'B6 verification and handoff for the current quick overview, systematic curriculum, and review-only recall/confusion candidate banks.',
    authority: {
      runtimePackageVersion: sourcePackage.packageVersion,
      curriculumVersion: b4.authority.curriculumVersion,
      crossModeArtifactId: convergence.id,
      crossModeArtifactSha256: sha256('docs/knowledge-pilot/sources/politics/politics-cross-mode-convergence-v1.json'),
      recallArtifactId: recall.id,
      recallArtifactSha256: sha256('docs/knowledge-pilot/sources/politics/politics-recall-bank-v1.json'),
      confusionArtifactId: confusion.id,
      confusionArtifactSha256: sha256('docs/knowledge-pilot/sources/politics/politics-confusion-bank-v1.json'),
    },
    layers: { sourceCorrect, teachingCorrect, interactionUsable, userEffective },
    validatorRuns,
    handoff: {
      completed: failedValidators.length === 0,
      deliverables: [
        'politics-learning-objectives-v1',
        'politics-confusion-bank-v1',
        'politics-recall-bank-v1',
        'politics-systematic-review-v1',
        'politics-cross-mode-convergence-v1',
        USER_TASKS_PATH,
      ],
      runtimeIntegrationDecisionRequiredLater: true,
      userEffectEvidenceRequiredLater: true,
      releaseAuthorizationRequiredLater: true,
    },
    release: {
      eligible: false,
      blockers: [
        'B2 and B3 candidate banks are not integrated into runtime.',
        'User effectiveness tasks have not been observed.',
        'Submission, upload, release, and mainline merge require separate authorization.',
      ],
    },
    passedAutomatedAndEditorialScope: failedValidators.length === 0
      && sourceCorrect.status.startsWith('passed')
      && teachingCorrect.status.startsWith('passed')
      && interactionUsable.status.startsWith('automated-passed'),
  };

  const outputFlag = process.argv.find((argument) => argument.startsWith('--out='));
  const output = `${JSON.stringify(artifact, null, 2)}\n`;
  if (outputFlag) {
    const target = outputFlag.slice('--out='.length);
    fs.mkdirSync(path.dirname(absolute(target)), { recursive: true });
    fs.writeFileSync(absolute(target), output);
    process.stdout.write(`${JSON.stringify({ status: artifact.status, output: target, validatorCount: validatorRuns.length, failedValidators, layers: Object.fromEntries(Object.entries(artifact.layers).map(([key, value]) => [key, value.status])) })}\n`);
  } else process.stdout.write(output);

  if (failedValidators.length) process.exitCode = 1;
}

main();
