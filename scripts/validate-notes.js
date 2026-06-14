const { noteModules, getNoteCategories, getNotePoints, getNoteContent } = require("../miniprogram/models/note-catalog");
const { homeSections, getTrainingItem } = require("../miniprogram/models/train-catalog");
const { generateQuestionSet } = require("../miniprogram/services/train-generator/index");
const fs = require("fs");
const path = require("path");

const miniprogramRoot = path.resolve(__dirname, "../miniprogram");
const assetManifestFiles = [
  "graphic-assets-manifest.json",
  "data-analysis-assets-manifest.json",
];
const cloudAssetPrefixes = ["graphic/", "data-analysis/"];
const cloudAssetManifest = new Set();

assetManifestFiles.forEach((fileName) => {
  const manifestPath = path.resolve(__dirname, fileName);
  if (!fs.existsSync(manifestPath)) return;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  (manifest.assets || []).forEach((asset) => cloudAssetManifest.add(asset.path));
});

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

function forEachDense(owner, value, callback) {
  if (!Array.isArray(value)) {
    problems.push(`${owner}: must be an array`);
    return;
  }
  for (let index = 0; index < value.length; index += 1) {
    if (!(index in value)) {
      problems.push(`${owner}/${index + 1}: array must not contain empty slots`);
      continue;
    }
    if (value[index] === undefined || value[index] === null) {
      problems.push(`${owner}/${index + 1}: array item must not be empty`);
      continue;
    }
    callback(value[index], index);
  }
}

function isRemoteOrCloudSrc(src) {
  return /^https?:\/\//.test(src) || src.startsWith("cloud://");
}

function validateImageSrc(owner, src) {
  if (!src) return;
  if (typeof src !== "string") {
    problems.push(`${owner}: image src must be a string`);
    return;
  }
  if (isRemoteOrCloudSrc(src)) return;
  if (src.includes("tmp_pdf/") || src.includes("candidates/")) {
    problems.push(`${owner}: formal content must not reference candidate image ${src}`);
    return;
  }

  if (cloudAssetPrefixes.some((prefix) => src.startsWith(prefix))) {
    if (!cloudAssetManifest.has(src)) {
      problems.push(`${owner}: cloud note asset is not listed in scripts/*-assets-manifest.json ${src}`);
    }
    const sourcePath = path.resolve(__dirname, "../assets-source", src);
    if (!fs.existsSync(sourcePath)) {
      warnings.push(`${owner}: cloud note source image is not present locally ${sourcePath}`);
    }
    return;
  }

  const normalized = src.startsWith("/") ? src.slice(1) : src;
  if (normalized.startsWith("./") || normalized.startsWith("../")) return;

  const localPath = path.join(miniprogramRoot, normalized);
  if (!fs.existsSync(localPath)) {
    problems.push(`${owner}: local image does not exist ${src}`);
  }
}

function validateQuestion(sectionId, itemId, question, index) {
  const owner = `training/${sectionId}/${itemId}/question-${index + 1}`;
  requireField(owner, "id", question && question.id);
  requireField(owner, "index", question && question.index);
  requireField(owner, "prompt", question && question.prompt);
  requireField(owner, "answer", question && question.answer);

  if (question && question.answerMode === "compare") {
    if (!question.compare || !question.compare.left || !question.compare.right) {
      problems.push(`${owner}: compare question requires compare.left and compare.right`);
    }
    if (!["gt", "lt"].includes(question.answer)) {
      problems.push(`${owner}: compare answer must be gt or lt`);
    }
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
    if (block.image !== undefined) {
      if (!block.image || typeof block.image !== "object") {
        problems.push(`${owner}: example image must be an object`);
      } else {
        validateImageSrc(`${owner}/image`, block.image.src);
      }
    }
    if (block.options !== undefined) {
      if (!Array.isArray(block.options) || block.options.length === 0) {
        problems.push(`${owner}: example options must be a non-empty array when present`);
      } else {
        forEachDense(`${owner}/options`, block.options, (opt, optIndex) => {
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
    validateImageSrc(owner, block.src);
  }
  if (block.type === "mind-map") {
    requireField(owner, "label", block.label);
    requireField(owner, "title", block.title);
    if (!Array.isArray(block.nodes) || !block.nodes.length) {
      problems.push(`${owner}: mind-map nodes must be a non-empty array`);
    } else {
      validateMindMapNodes(`${owner}/nodes`, block.nodes, 1);
    }
  }
}

function validateMindMapNodes(owner, nodes, depth) {
  if (depth > 3) {
    problems.push(`${owner}: mind-map depth must not exceed 3`);
    return;
  }

  forEachDense(owner, nodes, (node, index) => {
    const nodeOwner = `${owner}/${index + 1}`;
    requireField(nodeOwner, "title", node && node.title);
    if (node.points !== undefined && !Array.isArray(node.points)) {
      problems.push(`${nodeOwner}: points must be an array`);
    }
    if (node.image !== undefined) {
      if (!node.image || typeof node.image !== "object") {
        problems.push(`${nodeOwner}: image must be an object`);
      } else {
        validateImageSrc(nodeOwner, node.image.src);
      }
    }
    if (node.children !== undefined) {
      if (!Array.isArray(node.children)) {
        problems.push(`${nodeOwner}: children must be an array`);
      } else {
        validateMindMapNodes(`${nodeOwner}/children`, node.children, depth + 1);
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

  forEachDense(`${owner}/tabs`, point.tabs || [], (tab, tabIndex) => {
    const tabOwner = `${owner}/tab-${tabIndex + 1}`;
    requireField(tabOwner, "id", tab.id);
    requireField(tabOwner, "title", tab.title);
    if (!Array.isArray(tab.blocks) || !tab.blocks.length) {
      warnings.push(`${tabOwner}: blocks is empty`);
      return;
    }
    forEachDense(`${tabOwner}/blocks`, tab.blocks, (block, blockIndex) => validateBlock(moduleId, point, tab, block, blockIndex));
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
  const content = getNoteContent(moduleId);
  const categories = getNoteCategories(moduleId);
  const points = getNotePoints(moduleId);

  if (content?.loadError) {
    problems.push(`${moduleId}: module failed to load: ${content.loadError}`);
  }

  if (moduleInfo.status !== "ready") return { moduleId, categories: 0, points: 0 };

  if (!categories.length) problems.push(`${moduleId}: ready module has no categories`);
  if (!points.length) problems.push(`${moduleId}: ready module has no points`);

  const categoryIds = new Set();
  forEachDense(`${moduleId}/categories`, categories, (category) => {
    const owner = `${moduleId}/category/${category.id || "unknown-category"}`;
    ["id", "title", "subtitle", "status"].forEach((field) => requireField(owner, field, category[field]));
    if (categoryIds.has(category.id)) problems.push(`${owner}: duplicate category id`);
    categoryIds.add(category.id);
  });

  const pointIds = new Set();
  forEachDense(`${moduleId}/points`, points, (point) => validatePoint(moduleId, categoryIds, pointIds, point));

  forEachDense(`${moduleId}/categories`, categories, (category) => {
    forEachDense(`${moduleId}/category/${category.id}/pointIds`, category.pointIds || [], (pointId) => {
      if (!pointIds.has(pointId)) problems.push(`${moduleId}/category/${category.id}: pointIds includes missing ${pointId}`);
    });
  });

  return { moduleId, categories: categories.length, points: points.length };
}

const summary = noteModules.map(validateModule);

function validateTrainingGenerators() {
  homeSections.forEach((section) => {
    if (section.available === false || section.flow === "cognition") return;
    (section.groups || []).forEach((group) => {
      (group.items || []).forEach((item) => {
        if (item.available === false) return;
        const owner = `training/${section.id}/${item.id}`;
        const trainingItem = getTrainingItem(section.id, item.id);
        if (!trainingItem) {
          problems.push(`${owner}: catalog item cannot be resolved`);
          return;
        }
        const questions = generateQuestionSet(section.id, item.id, 3);
        if (!Array.isArray(questions) || questions.length !== 3) {
          problems.push(`${owner}: generator must return requested question count`);
          return;
        }
        questions.forEach((question, index) => validateQuestion(section.id, item.id, question, index));
      });
    });
  });
}

validateTrainingGenerators();

console.log(JSON.stringify({ summary, problems, warnings }, null, 2));

if (problems.length) {
  process.exit(1);
}
