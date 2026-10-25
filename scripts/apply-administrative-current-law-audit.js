#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const commonSense = require("../miniprogram/models/note-common-sense/index");

const repositoryRoot = path.resolve(__dirname, "..");
const sourceAuditDirectory = path.join(repositoryRoot, "docs/common-sense-source-audit");
const sourceAuditFiles = fs.readdirSync(sourceAuditDirectory).filter((file) => file.endsWith(".json"));

function applyReview(relativeReviewPath = "docs/common-sense-current-law-audit/administrative-enforcement.json") {
  const reviewPath = path.resolve(repositoryRoot, relativeReviewPath);
  const review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
  const reviewedPointIds = [...new Set(review.knowledgePoints.map((item) => item.pointId))];

  for (const pointId of reviewedPointIds) {
    const point = commonSense.points.find((item) => item.id === pointId);
    if (!point) throw new Error(`现行法审计引用了不存在的知识卡：${pointId}`);
    const sourceAuditFile = sourceAuditFiles.find((file) => JSON.parse(fs.readFileSync(path.join(sourceAuditDirectory, file), "utf8")).pointId === pointId);
    if (!sourceAuditFile) throw new Error(`找不到 ${pointId} 的源文审计文件`);
    const sourceAuditPath = path.join(sourceAuditDirectory, sourceAuditFile);
    const sourceAudit = JSON.parse(fs.readFileSync(sourceAuditPath, "utf8"));
    const blocks = point.tabs.flatMap((tab) => tab.blocks || []);

    for (const unit of sourceAudit.contentUnits) {
      if (!["list", "table"].includes(unit.type)) continue;
      const mappedBlocks = blocks.filter((item) => (item.sourceUnitIds || []).includes(unit.id));
      if (!mappedBlocks.length) throw new Error(`${pointId} 的源文单元未映射到展示块：${unit.id}`);
      if (unit.type === "list") unit.displayItems = mappedBlocks[0].items;
      if (unit.type === "table" && mappedBlocks.length === 1) unit.displayRows = mappedBlocks[0].rows;
      if (unit.type === "table" && mappedBlocks.length > 1) {
        const anchors = (sourceAudit.knowledgePoints || []).filter((item) => item.sourceUnitId === unit.id).sort((left, right) => left.row - right.row);
        if (anchors.length !== mappedBlocks.length) throw new Error(`${pointId} 的拆分页签数量与源文知识点锚点不一致：${unit.id}`);
        unit.displayRows = anchors.map((anchor) => {
          const fragment = mappedBlocks.find((block) => (block.sourceUnitIds || []).includes(anchor.id));
          if (!fragment || fragment.rows?.length !== 1) throw new Error(`${pointId} 的知识点页签未保留单行表格：${anchor.id}`);
          return fragment.rows[0];
        });
      }
    }

    sourceAudit.currentLawReview = {
      checkedAt: review.checkedAt,
      auditFile: path.relative(repositoryRoot, reviewPath),
      knowledgePointCount: review.knowledgePoints.filter((item) => item.pointId === pointId).length,
      rule: "items/rows 保留图片源文；displayItems/displayRows 保存经现行法校对后的正式展示内容。"
    };
    fs.writeFileSync(sourceAuditPath, `${JSON.stringify(sourceAudit, null, 2)}\n`);
  }

  console.log(`已同步 ${reviewedPointIds.length} 张知识卡的源文/现行法双层审计：${review.scope}`);
}

if (require.main === module) applyReview(process.argv[2]);
module.exports = { applyReview };
