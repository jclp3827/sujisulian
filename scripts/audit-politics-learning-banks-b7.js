#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const AUDIT_DATE = '2026-10-21';

function absolute(relativePath) { return path.join(ROOT, relativePath); }
function readJson(relativePath) { return JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8')); }
function sha256(relativePath) { return crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex'); }

const VALIDATORS = [
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
];

function runValidator(script) {
  const result = spawnSync(process.execPath, [absolute(script)], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return {
    script,
    exitCode: result.status,
    passed: result.status === 0,
    failure: result.status === 0 ? null : String(result.stderr || result.stdout || 'unknown failure').slice(0, 1600),
  };
}

function main() {
  const objectives = readJson('docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json');
  const recall = readJson('docs/knowledge-pilot/sources/politics/politics-recall-bank-v1.json');
  const confusion = readJson('docs/knowledge-pilot/sources/politics/politics-confusion-bank-v1.json');
  const sourcePackage = require(absolute('miniprogram/models/politics-p3-v2-runtime.js'));
  const runtimeBanks = require(absolute('miniprogram/models/politics-learning-banks-runtime.js'));
  const curriculum = require(absolute('miniprogram/models/politics-systematic-units-runtime.js'));
  const { knowledgePackage } = require(absolute('miniprogram/services/knowledge-platform/politics-runtime.js'));

  const coveredObjectiveIds = new Set(recall.cards.flatMap((card) => [card.primaryObjectiveId, ...(card.supportingObjectiveIds || [])]));
  const uncovered = objectives.objectives.filter((objective) => !coveredObjectiveIds.has(objective.objectiveId));
  const directNextRecall = uncovered.filter((objective) => objective.sourceGranularity === 'single-objective-lesson');
  const sharedSourceRecall = uncovered.filter((objective) => objective.sourceGranularity === 'shared-by-two-authored-objectives');
  const ledgerCounts = confusion.validation.ledgerCounts.byDisposition;
  const validatorRuns = VALIDATORS.map(runValidator);
  const failedValidators = validatorRuns.filter((run) => !run.passed).map((run) => run.script);

  const artifact = {
    schemaVersion: 1,
    auditId: 'POL-LCQ-V1-B7',
    auditDate: AUDIT_DATE,
    status: failedValidators.length ? 'blocked' : 'runtime-integrated-automated-passed-user-effect-pending',
    scope: 'Formal runtime integration of the B2 confusion bank and B3 recall bank within the current 37-unit political knowledge scope.',
    authority: {
      sourcePackageVersion: sourcePackage.packageVersion,
      bankVersion: runtimeBanks.bankVersion,
      runtimePackageVersion: knowledgePackage.packageVersion,
      curriculumVersion: curriculum.curriculumVersion,
      recallArtifactSha256: sha256('docs/knowledge-pilot/sources/politics/politics-recall-bank-v1.json'),
      confusionArtifactSha256: sha256('docs/knowledge-pilot/sources/politics/politics-confusion-bank-v1.json'),
      generatedRuntimeSha256: sha256('miniprogram/models/politics-learning-banks-runtime.js'),
    },
    runtimeIntegration: {
      recallCards: knowledgePackage.recallItems.length,
      confusionItems: knowledgePackage.contrastPairs.length,
      relationCount: knowledgePackage.relations.length,
      examSessionSize: knowledgePackage.moduleProfile.routeDefaults.exam.sessionSize,
      confusionItemsPerSession: runtimeBanks.sessionPolicy.confusion.itemCountPerSession,
      initialAndReverseVariantRequired: runtimeBanks.sessionPolicy.confusion.requireInitialAndReverseVariant,
      generatedBankStatus: runtimeBanks.status,
      allRuntimeDiagnosticsClear: knowledgePackage.diagnostics.errors.length === 0,
      oldExamProgressPolicy: 'expire-on-package-version-change',
      oldSystematicProgressPolicy: 'migrate-by-compatible-package-and-curriculum-version',
    },
    expansionAssessment: {
      recommended: true,
      mode: 'bounded-editorial-mining',
      recall: {
        totalObjectives: objectives.objectives.length,
        directlyProjectedObjectives: coveredObjectiveIds.size,
        unprojectedObjectives: uncovered.length,
        nextHighConfidenceObjectiveCount: directNextRecall.length,
        sharedSourceObjectiveCountRequiringIndividualReview: sharedSourceRecall.length,
        nextHighConfidenceObjectiveIds: directNextRecall.map((objective) => objective.objectiveId),
        suggestedBatchSize: '8-12 cards',
      },
      confusion: {
        currentItems: confusion.items.length,
        heldRelatedSignals: ledgerCounts['held-related-needs-dimension'],
        heldWithinUnitSignals: ledgerCounts['held-within-unit-distinction'],
        suggestedBatchSize: '3-6 pairs',
        requiredGate: 'two formal sides, one comparison dimension, two-sided evidence, initial check, reverse variant, and unique scoring',
      },
      productBoundary: 'The bank may grow while the user session remains four recall cards or one confusion pair; bank size must not increase one-session reading or action load.',
      exitMechanism: {
        enterMaintenanceWhenAny: [
          'Every eligible signal has an accepted, held, or rejected editorial disposition.',
          'Two consecutive mining batches each produce fewer than three high-value accepted items or the combined acceptance rate falls below ten percent.',
          'Most new proposals repeat an existing prompt, answer, boundary, or comparison dimension without creating a distinct retrieval task.',
          'Remaining proposals require facts or scoring context outside the current formal sources.',
          'Small-sample user checks show no improvement in recall recovery or confusion correction after two content batches.',
        ],
        reopenOnlyFor: [
          'new formal source coverage',
          'syllabus or authoritative wording change',
          'repeated user error with a source-supported missing task',
          'correction of an existing item',
        ],
      },
    },
    verification: {
      validatorCount: validatorRuns.length,
      failedValidators,
      validatorRuns,
      realDevice: 'not-run-by-user-direction',
      userEffect: 'pending-external-user-validation',
    },
    release: {
      eligible: false,
      blockers: [
        'The newly integrated banks have not completed external user-effect validation.',
        'Submission, upload, release, and mainline merge are outside this batch authorization.',
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
