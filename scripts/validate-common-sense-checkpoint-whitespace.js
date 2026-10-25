#!/usr/bin/env node
// Exact exceptions for this development checkpoint; raw Git whitespace failure stays visible.
const fs = require('fs');
const cp = require('child_process');
const crypto = require('crypto');
const assert = require('assert/strict');
const reportPath = 'docs/knowledge-platform/implementations/common-sense-checkpoint-2026-10-25-whitespace.json';
const report = JSON.parse(fs.readFileSync(reportPath));
const args = process.argv.slice(2);
assert.ok(args.length === 0 || (args.length === 2 && args[0] === '--commit'), 'Use no arguments for staged files, or --commit <commit>');
const gitArgs = args.length ? ['diff', `${args[1]}^`, args[1], '--check'] : ['diff', '--cached', '--check'];
const raw = cp.spawnSync('git', gitArgs, { encoding: 'utf8' });
assert.equal(raw.status, 2, 'The retained raw Git whitespace failure must remain visible');
assert.equal(raw.stderr, '');
const actual = raw.stdout.split('\n').flatMap(line => {
  if (!line || line.startsWith('+')) return [];
  const m = line.match(/^(.+):(\d+): (trailing whitespace\.|new blank line at EOF\.)$/);
  assert.ok(m, `Unrecognized whitespace diagnostic: ${line}`);
  return [{ path: m[1], line: Number(m[2]), issue: m[3] }];
});
const key = row => `${row.path}:${row.line}:${row.issue}`;
const retained = report.rows.filter(row => row.decision === 'preserve-exception');
assert.equal(report.rows.length, 60);
assert.equal(report.correctedFindings, 3);
assert.equal(new Set(retained.map(key)).size, 57);
assert.deepEqual(actual.map(key).sort(), retained.map(key).sort(), 'Unclassified or missing exception: stop');
for (const row of retained) {
  const bytes = fs.readFileSync(row.path).toString('utf8').split(/(?<=\n)/)[row.line - 1];
  assert.equal(Buffer.from(bytes).toString('base64'), row.beforeLineBase64, row.path);
  assert.ok(row.reason);
}
for (const file of report.fileHashes) {
  const data = fs.readFileSync(file.path);
  const hash = value => crypto.createHash('sha256').update(value).digest('hex');
  assert.equal(hash(data), file.afterSha256, file.path);
  assert.equal(hash(file.changed ? Buffer.concat([data, Buffer.from('\n')]) : data), file.beforeSha256, file.path);
}
console.log(JSON.stringify({ passedWithExplicitExceptions: true, rawGitCheckPassed: false,
  rawExitCode: raw.status, rawFindings: actual.length, retainedExceptions: retained.length,
  correctedFindings: 3, unclassifiedFindings: 0, reviewedFiles: 24, globalChecksDisabled: false }));
