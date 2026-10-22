#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { readInputs } = require('./build-politics-question-catalogue');
const { baselinePath } = require('./build-politics-question-management');
const { snapshot, impact } = require('./lib/politics-question-management');
function main(args = process.argv.slice(2)) {
  if (args.length > 1 || args.some(arg => !/^--baseline=.+$/.test(arg))) throw Error('Use --baseline=previous-management-snapshot.json or no arguments');
  const file = args[0] ? path.resolve(args[0].slice('--baseline='.length)) : baselinePath;
  const report = impact(JSON.parse(fs.readFileSync(file, 'utf8')), snapshot(readInputs()));
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== 'unchanged') process.exitCode = 1;
  return report;
}
if (require.main === module) main();
module.exports = { main };
