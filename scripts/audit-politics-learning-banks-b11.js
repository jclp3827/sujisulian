#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const AUDIT_DATE = '2026-10-21';
const MAINTENANCE_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-bank-maintenance-v1.json';
const absolute = (relativePath) => path.join(ROOT, relativePath);
const readJson = (relativePath) => JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
const sha256 = (relativePath) => crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex');

const VALIDATORS = [
  'scripts/validate-politics-learning-bank-maintenance-v1.js',
  'scripts/validate-politics-learning-bank-expansion-v1.js',
  'scripts/validate-politics-learning-banks-runtime-v1.js',
  'scripts/validate-politics-confusion-bank-v1.js',
  'scripts/validate-politics-recall-bank-v1.js',
  'scripts/validate-politics-systematic-review-v1.js',
  'scripts/validate-knowledge-platform-learning.js',
  'scripts/validate-politics-quick-reading.js',
  'scripts/validate-politics-systematic-units.js',
  'scripts/validate-politics-systematic-content.js',
  'scripts/validate-ui-tokens.js',
  'scripts/validate-politics-s55ab.js',
  'scripts/validate-politics-s55-r4.js',
  'scripts/validate-knowledge-platform-candidate.js',
  'scripts/validate-politics-learning-banks-b10.js',
];

function runValidator(script) {
  const result = spawnSync(process.execPath, [absolute(script)], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return {
    script,
    scriptSha256: sha256(script),
    exitCode: result.status,
    passed: result.status === 0,
    failure: result.status === 0 ? null : String(result.stderr || result.stdout || 'unknown failure').slice(0, 1600),
  };
}

function main() {
  const maintenance = readJson(MAINTENANCE_PATH);
  const runtimeBanks = require(absolute('miniprogram/models/politics-learning-banks-runtime.js'));
  const curriculum = require(absolute('miniprogram/models/politics-systematic-units-runtime.js'));
  const { knowledgePackage } = require(absolute('miniprogram/services/knowledge-platform/politics-runtime.js'));
  const validatorRuns = VALIDATORS.map(runValidator);
  const failedValidators = validatorRuns.filter((run) => !run.passed).map((run) => run.script);

  const artifact = {
    schemaVersion: 1,
    auditId: 'POL-LCQ-V1-B11',
    auditDate: AUDIT_DATE,
    status: failedValidators.length ? 'blocked' : 'maintenance-batch-integrated-automated-passed-user-effect-pending',
    scope: 'One explicitly requested bounded maintenance batch of error-correction recall cards within the existing 37-unit formal source scope.',
    authority: {
      maintenanceArtifactId: maintenance.id,
      maintenanceArtifactSha256: sha256(MAINTENANCE_PATH),
      bankVersion: runtimeBanks.bankVersion,
      runtimePackageVersion: knowledgePackage.packageVersion,
      curriculumVersion: curriculum.curriculumVersion,
      generatedRuntimeSha256: sha256('miniprogram/models/politics-learning-banks-runtime.js'),
    },
    maintenanceBatch: {
      cycle: maintenance.cycle,
      trigger: maintenance.trigger,
      recallCardsBefore: maintenance.validation.baseRuntimeRecallCards,
      addedErrorCorrectionCards: maintenance.recallCards.length,
      runtimeRecallCards: runtimeBanks.recallCards.length,
      runtimeConfusionItems: runtimeBanks.confusionItems.length,
      directlyProjectedObjectives: maintenance.validation.directlyProjectedObjectivesAfterPromotion,
      reviewedHeldWithinSignals: maintenance.disposition.reviewedHeldWithinSignals,
      acceptedAsDistinctErrorCorrection: maintenance.disposition.acceptedAsDistinctErrorCorrection,
      remainingWithoutDistinctNewTask: maintenance.disposition.remainingWithoutDistinctNewTask,
      selectedSignalIds: maintenance.recallCards.map((card) => card.sourceSignalId),
    },
    runtime: {
      examSessionSize: runtimeBanks.sessionPolicy.exam.sessionSize,
      confusionItemsPerSession: runtimeBanks.sessionPolicy.confusion.itemCountPerSession,
      relationCount: knowledgePackage.relations.length,
      contrastRelationCount: knowledgePackage.relations.filter((item) => item.type === 'contrast').length,
      systematicProgressCompatibleFromB10: curriculum.progressCompatibleVersions.includes('units-5c825f31114a')
        && curriculum.compatibleKnowledgePackageVersions.includes('kp1-a6-runtime-77a15fc82abc-lb-e8df016ff9df'),
      diagnosticsClear: knowledgePackage.diagnostics.errors.length === 0,
    },
    exitDecision: maintenance.exitDecision,
    verification: {
      validatorCount: validatorRuns.length,
      failedValidators,
      validatorRuns,
      simulator: {
        exam: 'opened-current-worktree; default scope remains a 4-card round with 20 eligible cards and a next round',
        totalRuntimeCardsVerifiedStatically: 102,
        consoleErrors: [],
      },
      realDevice: 'not-run-by-user-direction',
      userEffect: 'pending-external-user-validation',
    },
    release: {
      eligible: false,
      blockers: [
        'External user-effect validation remains pending.',
        'Submission, upload, release, commit, push, and mainline merge are outside this maintenance batch.',
      ],
    },
  };

  const output = `${JSON.stringify(artifact, null, 2)}\n`;
  const outputFlag = process.argv.find((argument) => argument.startsWith('--out='));
  if (outputFlag) {
    const target = outputFlag.slice('--out='.length);
    fs.mkdirSync(path.dirname(absolute(target)), { recursive: true });
    fs.writeFileSync(absolute(target), output);
    process.stdout.write(`${JSON.stringify({ status: artifact.status, output: target, failedValidators })}\n`);
  } else process.stdout.write(output);
  if (failedValidators.length) process.exitCode = 1;
}

main();
