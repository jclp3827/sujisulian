const fs = require("fs");
const path = require("path");
const commonSense = require("../miniprogram/models/note-common-sense/index");

const auditDirectory = path.resolve(__dirname, "../docs/common-sense-source-audit");

const definitions = {
  "intentional-crime-forms": {
    officialPath: ["第四篇 法律常识", "第三章 刑法", "第二节 刑法总则", "三、故意犯罪形态"],
    tabPages: [138, 139],
  },
  "joint-crime": {
    officialPath: ["第四篇 法律常识", "第三章 刑法", "第二节 刑法总则", "四、共同犯罪"],
    tabPages: [139, 139, 140],
  },
  "criminal-punishment": {
    officialPath: ["第四篇 法律常识", "第三章 刑法", "第三节 刑罚", "刑罚"],
    tabPages: [140, 144],
  },
  "common-crimes": {
    officialPath: ["第四篇 法律常识", "第三章 刑法", "第四节 常见罪名", "常见罪名"],
    tabPages: [145, 146, 146, 147, 147, 148],
  },
  "administrative-law-overview": {
    officialPath: ["第四篇 法律常识", "第四章 行政执法", "第一节 行政法概述", "行政法概述"],
    tabPages: [150, 150, 151, 151, 151],
  },
  "administrative-license": {
    officialPath: ["第四篇 法律常识", "第四章 行政执法", "第二节 行政许可", "行政许可"],
    tabPages: [152, 152, 152],
  },
  "administrative-penalty": {
    officialPath: ["第四篇 法律常识", "第四章 行政执法", "第三节 行政处罚", "行政处罚"],
    tabPages: [153, 153, 155],
  },
  "administrative-compulsion": {
    officialPath: ["第四篇 法律常识", "第四章 行政执法", "第四节 行政强制", "行政强制"],
    tabPages: [156, 156, 157],
  },
  "administrative-reconsideration": {
    officialPath: ["第四篇 法律常识", "第四章 行政执法", "第五节 行政复议", "行政复议"],
    tabPages: [157, 157, 158, 158, 158, 159, 160, 160],
  },
  "administrative-litigation": {
    officialPath: ["第四篇 法律常识", "第四章 行政执法", "第六节 行政诉讼", "行政诉讼"],
    tabPages: [160, 160, 161, 161, 162, 162, 163],
  },
};

function auditUnit(block, page) {
  const unit = {
    id: block.sourceUnitIds[0],
    type: block.type,
    page,
    label: block.label,
  };
  if (block.type === "list") {
    unit.items = block.items || [];
    if (block.displayItems) unit.displayItems = block.displayItems;
    if (block.subsections) unit.subsections = block.subsections;
  }
  if (block.type === "table") {
    unit.columns = block.columns || [];
    unit.rows = block.rows || [];
    if (block.headerMergedCells) unit.headerMergedCells = block.headerMergedCells;
    if (block.mergedCells) unit.mergedCells = block.mergedCells;
  }
  return unit;
}

Object.entries(definitions).forEach(([pointId, definition]) => {
  const point = commonSense.points.find((item) => item.id === pointId);
  if (!point) throw new Error(`Missing point: ${pointId}`);
  const contentUnits = [
    {
      id: point.sourceUnitIds[0],
      type: "heading",
      page: point.sourceSections[0],
      text: point.title,
    },
  ];
  const knowledgePointIds = [];
  point.tabs.forEach((tab, tabIndex) => {
    tab.blocks.forEach((block, blockIndex) => {
      contentUnits.push(auditUnit(block, definition.tabPages[tabIndex] || point.sourceSections[0]));
      if (blockIndex === 0) knowledgePointIds.push(block.sourceUnitIds[0]);
    });
  });
  const audit = {
    schemaVersion: 1,
    pointId,
    officialPath: definition.officialPath,
    source: {
      images: "常识判断-背诵/扫描文件",
      pages: point.sourceSections,
      mode: "macos-vision-ocr-and-page-image-visual-review",
    },
    knowledgePointIds,
    fillCompletions: [],
    excludedRegions: point.sourceSections.map((page) => ({
      page,
      type: "header-logo-qr-follow-prompt-and-page-number",
      reason: "非教材正文",
    })),
    contentUnits,
  };
  fs.writeFileSync(path.join(auditDirectory, `${pointId}.json`), `${JSON.stringify(audit)}\n`);
});

console.log(`Generated ${Object.keys(definitions).length} scan source audits.`);
