const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const outJSON = 'docs/knowledge-platform/implementations/evidence/ME-COVERAGE-CLOSEOUT-02-audit.json';
const outMD = 'docs/knowledge-platform/implementations/evidence/ME-COVERAGE-CLOSEOUT-02-audit.md';
const modules = ['note-data-analysis', 'note-quantity', 'note-logic', 'note-verbal', 'note-graphic'];
const sha = value => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const strings = (value, out = []) => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach(item => strings(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach(item => strings(item, out));
  return out;
};
const riskRules = [
  {id: 'absolute-claim', pattern: /必然|一定|一律|永远|绝对|无论|凡是|只要/},
  {id: 'unbounded-approximation', pattern: /误差可忽略|直接套|直接判/},
  {id: 'negation-shortcut', pattern: /任意词前加|任何一个词前加/}
];
const records = [];
for (const moduleDir of modules) {
  const dir = path.join(root, 'miniprogram/models', moduleDir, 'points');
  for (const file of fs.readdirSync(dir).filter(name => name.endsWith('.json')).sort()) {
    const sourcePath = path.relative(root, path.join(dir, file));
    const points = JSON.parse(fs.readFileSync(path.join(root, sourcePath)));
    points.forEach((point, pointIndex) => {
      const tabIndex = (point.tabs || []).findIndex(tab => tab.id === 'knowledge');
      if (tabIndex < 0) return;
      const tab = point.tabs[tabIndex];
      const risks = [];
      (tab.blocks || []).forEach((block, blockIndex) => {
        const text = strings(block).join(' | ');
        for (const rule of riskRules) if (rule.pattern.test(text)) risks.push({ruleId: rule.id, blockIndex, blockSHA256: sha(block)});
      });
      records.push({
        moduleId: moduleDir.replace('note-', ''),
        pointId: point.id,
        title: point.title,
        sourcePath,
        pointIndex,
        tabIndex,
        tabSHA256: sha(tab),
        blockCount: (tab.blocks || []).length,
        blockSHA256s: (tab.blocks || []).map(sha),
        mechanicalRiskHits: risks
      });
    });
  }
}

const findings = [
  {
    findingId: 'CLOSEOUT02-DA-ASSUMPTION-ERROR-BOUNDARY',
    moduleId: 'data-analysis', pointId: 'assumption-allocation', severity: 'source-overclaim',
    disposition: 'correct-in-dedicated-source-batch-no-current-card-binding',
    finding: '“误差可忽略”缺少选项间距与精度边界；估算只能在误差不足以改变选项判断时停止。'
  },
  {
    findingId: 'CLOSEOUT02-QU-CONCENTRATION-CONSERVATION',
    moduleId: 'quantity', pointId: 'concentration-cross', severity: 'source-overclaim',
    disposition: 'correct-in-card-compatible-source-batch',
    finding: '加水或蒸发纯水可保持原溶质不变；混合其他溶液会带入溶质，应按总溶质守恒列式。'
  },
  {
    findingId: 'CLOSEOUT02-QU-CONCENTRATION-WEIGHT',
    moduleId: 'quantity', pointId: 'concentration-cross', severity: 'source-overclaim',
    disposition: 'correct-in-card-compatible-source-batch',
    finding: '并非任意 A=B/C 都可十字相乘；须满足同一比例指标且整体分子、分母可按部分加总，十字结果对应承担权重的分母量。'
  },
  {
    findingId: 'CLOSEOUT02-QU-COW-GRASS-LINEARITY',
    moduleId: 'quantity', pointId: 'cow-eating-grass', severity: 'missing-condition',
    disposition: 'correct-in-card-revision-batch',
    finding: '挖沙、排水、清淤等只有在初始存量可确定且单位时间新增与单机消耗近似恒定时才能转为牛吃草模型。'
  },
  {
    findingId: 'CLOSEOUT02-LO-NEGATION-SCOPE',
    moduleId: 'logic', pointId: 'logic-relations', severity: 'source-overclaim',
    disposition: 'correct-in-card-compatible-source-batch',
    finding: '命题否定必须作用于完整逻辑结构，不能用“任意词前加不”代替。'
  }
];
for (const finding of findings) if (!records.some(row => row.moduleId === finding.moduleId && row.pointId === finding.pointId)) throw new Error('finding points to missing knowledge record: ' + finding.findingId);
const byModule = Object.fromEntries([...new Set(records.map(row => row.moduleId))].map(moduleId => [moduleId, {
  points: records.filter(row => row.moduleId === moduleId).length,
  blocks: records.filter(row => row.moduleId === moduleId).reduce((sum, row) => sum + row.blockCount, 0)
}]));
const report = {
  schemaVersion: 1,
  batchId: 'ME-COVERAGE-CLOSEOUT-02',
  date: '2026-10-24',
  scope: 'Full mechanical inventory of every current knowledge tab plus exact expert triage of high-confidence source-boundary findings. No source, card, question, UI, schema, storage or scoring change.',
  productBoundary: 'A mechanical keyword screen is coverage evidence, not content acceptance. Records without a hit are not certified correct; every correction still needs exact source review and an independent decision.',
  counts: {
    sourceFiles: new Set(records.map(row => row.sourcePath)).size,
    knowledgePoints: records.length,
    knowledgeBlocks: records.reduce((sum, row) => sum + row.blockCount, 0),
    pointsWithMechanicalRiskHits: records.filter(row => row.mechanicalRiskHits.length).length,
    exactFindings: findings.length,
    affectedPoints: new Set(findings.map(row => row.moduleId + '/' + row.pointId)).size
  },
  byModule,
  riskRules: riskRules.map(rule => rule.id),
  exactFindings: findings,
  records,
  gates: {
    sourceChanged: false,
    cardsChanged: false,
    questionsChanged: false,
    sharedUIChanged: false,
    storageOrScoringChanged: false,
    formalEnablementCreated: false,
    nextBatch: 'ME-COVERAGE-CORRECT-02A'
  }
};
if (report.counts.sourceFiles !== 40 || report.counts.knowledgePoints !== 162 || report.counts.knowledgeBlocks !== 686) throw new Error('knowledge inventory count drift: ' + JSON.stringify(report.counts));
const json = JSON.stringify(report, null, 2) + '\n';
const md = `# ME-COVERAGE-CLOSEOUT-02 全量知识页审计\n\n- 覆盖：${report.counts.sourceFiles} 个源文件、${report.counts.knowledgePoints} 个知识点、${report.counts.knowledgeBlocks} 个知识块。\n- 精确问题：${report.counts.exactFindings} 项，涉及 ${report.counts.affectedPoints} 个知识点。\n- 边界：关键词扫描只证明已遍历，不代表未命中内容已经通过专家验收。\n- 变更：本批不修改正文、卡片、完整题、公共 UI、存储、判分或正式准入。\n\n## 后续批次\n\n1. ME-COVERAGE-CORRECT-02A：修正未绑定当前记忆卡的估算误差边界。\n2. ME-COVERAGE-CORRECT-02B：以兼容方式修正浓度守恒、类浓度适用条件和命题否定边界。\n3. ME-COVERAGE-CORRECT-02C：对牛吃草卡片做带修订号的条件补全，保留旧学习记录。\n`;
const checkOnly = process.argv.includes('--check-only');
for (const [rel, content] of [[outJSON, json], [outMD, md]]) {
  const file = path.join(root, rel);
  if (checkOnly) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) throw new Error('stale audit artifact: ' + rel);
  } else {
    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, content);
  }
}
console.log(JSON.stringify({passed:true, checkOnly, ...report.counts, byModule}, null, 2));
