'use strict';
// One DS development-baseline admission, inactive until an actual user-approved Git grant exists.
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const RECORD = 'docs/design-system/approvals/main-development-20261101.json';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const git = args => cp.execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
function decide(record, facts, purpose = 'development') {
  const errors = [];
  if (purpose !== 'development') errors.push('This grant cannot authorize release, preview, upload or deployment.');
  if (record.schema !== 1 || record.id !== 'DS-MAIN-DEVELOPMENT-20261101' ||
      record.purpose !== 'one-time-development-baseline-integration') errors.push('Unexpected grant identity or scope.');
  if (record.status !== 'approved' || !record.authorizationSource) errors.push('Explicit user approval is pending.');
  for (const key of ['authorizationBound', 'frozenSourceIsAncestor', 'productMatches', 'cloudMatches',
    'configMatches', 'approvedDSStateUnchanged', 'memoryExcluded', 'gateHashesMatch', 'protectedPass',
    'originalBackupRecoverable', 'mainPositionMatches',
    'dsPass', 'selftestsPass', 'businessPass', 'documentationPass', 'knownHistoricalProtectionFailure']) {
    if (facts[key] !== true) errors.push('Required evidence failed or missing: ' + key);
  }
  const budget = facts.budget || {};
  if (budget.exitCode !== 1 || budget.bytes !== record.budget.acceptedCandidateBytes ||
      budget.limitBytes !== record.budget.limitBytes ||
      budget.bytes - record.budget.baselineBytes > record.budget.maximumIncrementBytes) {
    errors.push('Budget result does not match this exact, bounded accepted debt.');
  }
  return { developmentAllowed: errors.length === 0, releaseAllowed: false, errors,
    rawBudget: 'FAIL', rawHistoricalProtection: 'FAIL',
    effectiveBudgetStatus: errors.length ? 'NOT_ACCEPTED' : 'ACCEPTED_DEBT_FOR_THIS_DEVELOPMENT_INTEGRATION_ONLY',
    currentProtectionStatus: facts.protectedPass === true ? 'PASS' : 'FAIL',
    historicalProtectionScope: 'Task-specific historical failure retained; not a current-main protection proof.' };
}
function collect(record, phase) {
  const head = git(['rev-parse', 'HEAD']), main = git(['rev-parse', 'refs/heads/main']);
  let target = '', authorizationBound = false;
  try {
    target = git(['rev-parse', record.authorizationRef]);
    const evidenceOnlyAfter = phase === 'after' &&
      cp.spawnSync('git', ['merge-base', '--is-ancestor', target, head], { cwd: ROOT }).status === 0 &&
      git(['diff', '--name-only', target, head]).split('\n').filter(Boolean)
        .every(file => file.startsWith('docs/design-system/evidence/closeout-20261101/'));
    authorizationBound = (target === head || evidenceOnlyAfter) &&
      git(['show', target + ':' + RECORD]) === fs.readFileSync(path.join(ROOT, RECORD), 'utf8').trim() &&
      git(['show', target + ':scripts/validate-ds-main-admission.js']) === fs.readFileSync(__filename, 'utf8').trim();
  } catch (_) { /* Missing or unbound references must reject admission. */ }
  const sameTree = (name, expected) => git(['rev-parse', 'HEAD:' + name]) === expected;
  const cleanProduct = cp.spawnSync('git', ['diff', '--quiet', 'HEAD', '--', 'miniprogram', 'cloudfunctions', 'project.config.json'],
    { cwd: ROOT }).status === 0 &&
    git(['ls-files', '--others', '--exclude-standard', '--', 'miniprogram', 'cloudfunctions', 'project.config.json']) === '';
  const memoryExcluded = record.excludedMemoryFiles.every(file =>
    git(['rev-parse', 'HEAD:' + file]) === git(['rev-parse', record.baseMain + ':' + file]));
  const beforePath = path.join(ROOT, record.protectionSnapshot);
  if (sha(fs.readFileSync(beforePath)) !== record.protectionSnapshotSHA256) throw new Error('Original task snapshot changed.');
  const backupPath = path.join(ROOT, record.originalBackupReceipt);
  if (sha(fs.readFileSync(backupPath)) !== record.originalBackupReceiptSHA256) throw new Error('Original backup receipt changed.');
  const backup = JSON.parse(fs.readFileSync(backupPath));
  const originalBackupRecoverable = backup.head === record.baseMain &&
    [backup.sourceBackup, backup.verifiedRestore].every(directory =>
      sha(fs.readFileSync(path.join(directory, 'original-index.bin'))) === backup.originalIndexSHA256 &&
      backup.files.every(file => sha(fs.readFileSync(path.join(directory, file.path))) === file.sha256)) &&
    backup.files.filter(file => file.kind === 'important-ignored-local-config').every(file =>
      sha(fs.readFileSync(path.join(backup.main, file.path))) === file.sha256);
  const protectedRows = JSON.parse(fs.readFileSync(beforePath));
  const protectedResults = protectedRows.map(before => {
    const run = args => cp.execFileSync('git', args, { cwd: before.root, encoding: 'utf8' });
    const isMain = before.root === '/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029';
    const expectedHead = phase === 'after' && isMain ? target : before.head;
    const failures = [];
    if (run(['rev-parse', 'HEAD']).trim() !== expectedHead) failures.push('HEAD');
    if (run(['status', '--porcelain=v1', '-uall', '-z']) !== before.status) failures.push('status');
    for (const [file, original] of Object.entries(before.files)) {
      const expected = phase === 'after' && isMain ? record.expectedMainMergedFiles[file] || original : original;
      if (sha(fs.readFileSync(path.join(before.root, file))) !== expected) failures.push(file);
    }
    if (run(['diff', '--cached', '--name-only']).trim()) failures.push('unexpected staged work');
    for (const marker of ['MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD', 'rebase-merge', 'rebase-apply']) {
      const location = run(['rev-parse', '--git-path', marker]).trim();
      if (fs.existsSync(path.resolve(before.root, location))) failures.push(marker);
    }
    return { root: before.root, files: Object.keys(before.files).length, passed: failures.length === 0, failures };
  });
  const checks = {};
  function run(label, command, args) {
    const result = cp.spawnSync(command, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    const value = { command: [command, ...args], exitCode: result.status, stdout: result.stdout || '', stderr: result.stderr || '' };
    checks[label] = value; return value;
  }
  const budget = run('budget', process.execPath, ['scripts/check-main-package-size.js']);
  const budgetJSON = JSON.parse(budget.stdout);
  const protection = run('historicalProtection', process.execPath, ['scripts/validate-learning-bank-isolation.js']);
  const docs = run('documentation', 'python3', ['scripts/check-documentation-consistency.py']);
  const ds = run('designSystem', process.execPath, ['scripts/validate-design-system.js']);
  const tests = run('validatorSelftests', process.execPath, ['scripts/test-design-system-validator.js']);
  const guard = 'docs/design-system/evidence/closeout-20261101/admission/deny-network.cjs.txt';
  const business = ['validate-learning-bank-practice-buffer.js', 'validate-learning-bank-common-buffer.js',
    'validate-learning-bank-guide-buffer.js', 'validate-public-learning-page-runtime.js'].map(file => {
    const result = run(file, process.execPath, ['--require', path.join(ROOT, guard), 'scripts/' + file]);
    return result.exitCode === 0 && JSON.parse(result.stdout).passed === true &&
      result.stderr.trim().endsWith('{"networkGuard":true,"attempts":0}');
  });
  return { authorizationBound,
    frozenSourceIsAncestor: cp.spawnSync('git', ['merge-base', '--is-ancestor', record.frozenSource, 'HEAD'], { cwd: ROOT }).status === 0,
    productMatches: cleanProduct && sameTree('miniprogram', record.frozenProductTree),
    cloudMatches: sameTree('cloudfunctions', record.frozenCloudTree),
    configMatches: sameTree('project.config.json', record.frozenProjectConfigBlob),
    approvedDSStateUnchanged: Object.entries(record.frozenDSStateBlobs).every(([file, blob]) =>
      sameTree(file, blob) && git(['diff', 'HEAD', '--', file]) === ''),
    memoryExcluded, gateHashesMatch: Object.entries(record.unchangedGateHashes).every(([file, digest]) =>
      sha(fs.readFileSync(path.join(ROOT, file))) === digest),
    originalBackupRecoverable,
    protectedPass: protectedResults.every(row => row.passed),
    mainPositionMatches: phase === 'before' ? main === record.baseMain : phase === 'after' && main === target,
    dsPass: ds.exitCode === 0, selftestsPass: tests.exitCode === 0 && JSON.parse(tests.stdout).passed === 52,
    businessPass: business.every(Boolean), documentationPass: docs.exitCode === 0 && JSON.parse(docs.stdout).valid === true,
    knownHistoricalProtectionFailure: protection.exitCode === 1 &&
      protection.stderr.includes('Protected HEAD changed: /Users/jmac/WeChatProjects/miniprogram-1') &&
      protection.stderr.includes('d5a5c49400c2aef8bf583556a283cb4ad04f45f3') &&
      protection.stderr.includes('90b56f784c865c3d24b1a05c17ce7edf71d28897'),
    budget: { exitCode: budget.exitCode, bytes: budgetJSON.mainPackageBytes, limitBytes: budgetJSON.limitMiB * 1024 * 1024 },
    protectedResults, checks };
}
function main() {
  const phase = process.argv.includes('--after') ? 'after' : 'before';
  const purpose = process.argv.includes('--release') ? 'release' : 'development';
  try {
    if (process.argv.slice(2).some(arg => !['--after', '--release'].includes(arg))) throw new Error('Unknown admission scope/argument.');
    const record = JSON.parse(fs.readFileSync(path.join(ROOT, RECORD)));
    if (record.status !== 'approved' || purpose !== 'development') throw new Error('No active development-only user grant for this operation.');
    const facts = collect(record, phase), result = decide(record, facts, purpose);
    console.log(JSON.stringify({ grant: record.id, phase, ...result, facts }, null, 2));
    return result.developmentAllowed ? 0 : 1;
  } catch (error) {
    console.log(JSON.stringify({ developmentAllowed: false, releaseAllowed: false, errors: [error.message] }, null, 2));
    return 1;
  }
}
module.exports = { decide, collect };
if (require.main === module) process.exitCode = main();
