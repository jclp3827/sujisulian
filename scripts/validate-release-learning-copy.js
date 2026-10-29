#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

const root = path.resolve(__dirname, '../miniprogram');
const homeFile = path.join(root, 'pages/common-sense/index.js');
const homeSource = fs.readFileSync(homeFile, 'utf8');

for (const envVersion of ['develop', 'trial', 'release']) {
  let definition;
  const urls = [];
  vm.runInNewContext(homeSource, {
    require: createRequire(homeFile),
    Page(value) { definition = value; },
    wx: {
      getAccountInfoSync() { return { miniProgram: { envVersion } }; },
      navigateTo({ url }) { urls.push(url); },
    },
  }, { filename: homeFile });
  for (const mode of ['qa', 'guide', 'confusion', 'exam']) {
    definition.handleFeature({ currentTarget: { dataset: { mode } } });
    assert.equal(urls.pop(), `/subpackages/common-sense/learning/index?mode=${mode}`);
  }
}

const learningView = fs.readFileSync(path.join(root, 'subpackages/common-sense/learning/index.wxml'), 'utf8');
const practiceView = fs.readFileSync(path.join(root, 'subpackages/note/practice/index.wxml'), 'utf8');
assert.doesNotMatch(learningView, /内容试读|本批学习材料待审核/);
assert.doesNotMatch(practiceView, /本批练习内容持续校订|原文段和选项沿用笔记，作答说明已补充/);
assert.match(learningView, /wx:if="\{\{guidePreview\}\}"/);

console.log(JSON.stringify({ passed: true, environments: 3, ordinaryEntries: 4, editorialBanners: 0 }));
