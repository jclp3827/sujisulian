const { noteModules, getNoteCategories, getNotePoints } = require("../miniprogram/models/note-catalog");
const { getTrainingItem } = require("../miniprogram/models/train-catalog");

const allowedBlockTypes = new Set([
  "formula",
  "steps",
  "list",
  "signal",
  "rule",
  "compare",
  "table",
  "tip",
  "example",
  "practice",
  "image-note",
  "mind-map",
]);

const problems = [];
const warnings = [];

function requireField(owner, field, value) {
  if (value === undefined || value === null || value === "") {
    problems.push(`${owner}: missing ${field}`);
  }
}

function validateBlock(moduleId, point, tab, block, blockIndex) {
  const owner = `${moduleId}/${point.id}/${tab.id}/block-${blockIndex + 1}`;
  requireField(owner, "type", block.type);

  if (!allowedBlockTypes.has(block.type)) {
    problems.push(`${owner}: unsupported block type ${block.type}`);
    return;
  }

  if (["formula", "list", "steps", "table", "compare", "example"].includes(block.type)) {
    requireField(owner, "label", block.label);
  }

  if (["signal", "rule", "tip"].includes(block.type)) {
    requireField(owner, "title", block.title);
  }

  if (block.type === "formula") {
    requireField(owner, "content", block.content);
    if (block.nodes !== undefined && !Array.isArray(block.nodes)) {
      problems.push(`${owner}: formula nodes must be an array`);
    }
  }
  if (["steps", "list", "signal", "rule"].includes(block.type) && !Array.isArray(block.items)) {
    problems.push(`${owner}: items must be an array`);
  }
  if (block.type === "tip" && !["success", "warning"].includes(block.variant)) {
    problems.push(`${owner}: tip variant must be success or warning`);
  }
  if (block.type === "example") {
    requireField(owner, "stem", block.stem);
    requireField(owner, "analysis", block.analysis);
    if (block.options !== undefined) {
      if (!Array.isArray(block.options) || block.options.length === 0) {
        problems.push(`${owner}: example options must be a non-empty array when present`);
      } else {
        block.options.forEach((opt, optIndex) => {
          if (!opt || typeof opt.key !== "string" || !opt.key) {
            problems.push(`${owner}: option ${optIndex + 1} missing key`);
          }
          if (typeof opt.text !== "string" || !opt.text) {
            problems.push(`${owner}: option ${optIndex + 1} missing text`);
          }
        });
        if (block.answer) {
          const keys = block.options.map((opt) => opt.key);
          if (!keys.includes(block.answer)) {
            problems.push(`${owner}: answer ${block.answer} not in options ${keys.join("/")}`);
          }
        }
      }
    }
  }
  if (block.type === "practice" && !point.relatedTraining) {
    warnings.push(`${owner}: practice block without relatedTraining`);
  }
  if (block.type === "compare") {
    if (!block.left || !block.right) {
      problems.push(`${owner}: compare block requires left and right`);
    } else {
      requireField(`${owner}/left`, "title", block.left.title);
      requireField(`${owner}/right`, "title", block.right.title);
    }
  }
  if (block.type === "table") {
    if (!Array.isArray(block.columns) || !block.columns.length) problems.push(`${owner}: table columns must be a non-empty array`);
    if (!Array.isArray(block.rows) || !block.rows.length) problems.push(`${owner}: table rows must be a non-empty array`);
  }
  if (block.type === "image-note") {
    requireField(owner, "label", block.label);
    requireField(owner, "title", block.title);
    if (block.src && typeof block.src !== "string") {
      problems.push(`${owner}: image-note src must be a string`);
    }
  }
  if (block.type === "mind-map") {
    requireField(owner, "label", block.label);
    requireField(owner, "title", block.title);
    if (!Array.isArray(block.nodes) || !block.nodes.length) {
      problems.push(`${owner}: mind-map nodes must be a non-empty array`);
    } else {
      validateMindMapNodes(`${owner}/nodes`, block.nodes);
    }
  }
}

function validateMindMapNodes(owner, nodes) {
  nodes.forEach((node, index) => {
    const nodeOwner = `${owner}/${index + 1}`;
    requireField(nodeOwner, "title", node && node.title);
    if (node.points !== undefined && !Array.isArray(node.points)) {
      problems.push(`${nodeOwner}: points must be an array`);
    }
    if (node.image !== undefined) {
      if (!node.image || typeof node.image !== "object") {
        problems.push(`${nodeOwner}: image must be an object`);
      } else if (node.image.src !== undefined && typeof node.image.src !== "string") {
        problems.push(`${nodeOwner}: image src must be a string`);
      }
    }
    if (node.children !== undefined) {
      if (!Array.isArray(node.children)) {
        problems.push(`${nodeOwner}: children must be an array`);
      } else {
        validateMindMapNodes(`${nodeOwner}/children`, node.children);
      }
    }
  });
}

function validatePoint(moduleId, categoryIds, pointIds, point) {
  const owner = `${moduleId}/${point.id || "unknown-point"}`;
  ["id", "categoryId", "type", "title", "summary", "preview"].forEach((field) => requireField(owner, field, point[field]));

  if (pointIds.has(point.id)) problems.push(`${owner}: duplicate point id`);
  pointIds.add(point.id);

  if (!categoryIds.has(point.categoryId)) problems.push(`${owner}: category ${point.categoryId} does not exist`);

  if (!Array.isArray(point.tabs) || !point.tabs.length) {
    problems.push(`${owner}: tabs must be a non-empty array`);
  }

  (point.tabs || []).forEach((tab, tabIndex) => {
    const tabOwner = `${owner}/tab-${tabIndex + 1}`;
    requireField(tabOwner, "id", tab.id);
    requireField(tabOwner, "title", tab.title);
    if (!Array.isArray(tab.blocks) || !tab.blocks.length) {
      warnings.push(`${tabOwner}: blocks is empty`);
    }
    (tab.blocks || []).forEach((block, blockIndex) => validateBlock(moduleId, point, tab, block, blockIndex));
  });

  if (point.relatedTraining) {
    const { sectionId, itemId, title } = point.relatedTraining;
    requireField(`${owner}/relatedTraining`, "sectionId", sectionId);
    requireField(`${owner}/relatedTraining`, "itemId", itemId);
    requireField(`${owner}/relatedTraining`, "title", title);
    if (sectionId && itemId && !getTrainingItem(sectionId, itemId)) {
      problems.push(`${owner}: related training ${sectionId}/${itemId} does not exist`);
    }
  }
}

function validateModule(moduleInfo) {
  const moduleId = moduleInfo.id;
  const categories = getNoteCategories(moduleId);
  const points = getNotePoints(moduleId);

  if (moduleInfo.status !== "ready") return { moduleId, categories: 0, points: 0 };

  if (!categories.length) problems.push(`${moduleId}: ready module has no categories`);
  if (!points.length) problems.push(`${moduleId}: ready module has no points`);

  const categoryIds = new Set();
  categories.forEach((category) => {
    const owner = `${moduleId}/category/${category.id || "unknown-category"}`;
    ["id", "title", "subtitle", "status"].forEach((field) => requireField(owner, field, category[field]));
    if (categoryIds.has(category.id)) problems.push(`${owner}: duplicate category id`);
    categoryIds.add(category.id);
  });

  const pointIds = new Set();
  points.forEach((point) => validatePoint(moduleId, categoryIds, pointIds, point));

  categories.forEach((category) => {
    (category.pointIds || []).forEach((pointId) => {
      if (!pointIds.has(pointId)) problems.push(`${moduleId}/category/${category.id}: pointIds includes missing ${pointId}`);
    });
  });

  return { moduleId, categories: categories.length, points: points.length };
}

const summary = noteModules.map(validateModule);

console.log(JSON.stringify({ summary, problems, warnings }, null, 2));

if (problems.length) {
  process.exit(1);
}
