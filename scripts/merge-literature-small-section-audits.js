const fs = require('fs');
const path = require('path');

const auditDir = path.resolve(__dirname, '../docs/common-sense-source-audit');
const groups = [
  { target: 'ancient-myth.json', files: ['ancient-myth.json', 'pre-qin-prose.json', 'qin-han-prose.json', 'tang-song-prose.json'], pointId: 'ancient-prose', title: '1.散文', headingId: 'cs-literature-prose-heading' },
  { target: 'pre-qin-poetry.json', files: ['pre-qin-poetry.json', 'han-wei-jin-poetry.json', 'tang-poetry.json', 'poetry-decline-lu-you.json'], pointId: 'pre-qin-poetry', title: '2.诗赋', headingId: 'cs-literature-poetry-fu-heading' },
  { target: 'ci-poetry.json', files: ['ci-poetry.json', 'yuan-qu.json', 'opera-legend.json'], pointId: 'poetry-ci-qu', title: '3.词曲', headingId: 'cs-literature-ci-qu-heading' },
];

groups.forEach((group) => {
  const existing = group.files.filter((file) => fs.existsSync(path.join(auditDir, file)));
  if (existing.length === 1 && existing[0] === group.target) return;
  const audits = group.files.map((file) => JSON.parse(fs.readFileSync(path.join(auditDir, file), 'utf8')));
  const pages = Array.from(new Set(audits.flatMap((audit) => audit.source.pages || []))).sort((a, b) => a - b);
  const excluded = audits.flatMap((audit) => audit.excludedRegions || []).filter((item, index, list) => list.findIndex((other) => JSON.stringify(other) === JSON.stringify(item)) === index);
  const merged = {
    schemaVersion: 1,
    pointId: group.pointId,
    officialPath: ['第一篇 文史常识', '第二章 文学常识', '一、中国古代文学', group.title],
    source: { ...audits[0].source, pages },
    knowledgePointIds: audits.flatMap((audit) => audit.knowledgePointIds || []),
    fillCompletions: audits.flatMap((audit) => audit.fillCompletions || []),
    excludedRegions: excluded,
    contentUnits: [
      { id: group.headingId, type: 'heading', page: pages[0], text: group.title },
      ...audits.flatMap((audit) => audit.contentUnits || []),
    ],
  };
  const anchored = audits.flatMap((audit) => audit.knowledgePoints || []);
  if (anchored.length) merged.knowledgePoints = anchored;
  fs.writeFileSync(path.join(auditDir, group.target), `${JSON.stringify(merged, null, 2)}\n`);
  group.files.slice(1).forEach((file) => fs.unlinkSync(path.join(auditDir, file)));
});
