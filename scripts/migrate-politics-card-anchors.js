#!/usr/bin/env node

const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const sourceDir = path.join(repo, "docs/knowledge-pilot/knowledge/politics-v2");
const migrationPath = path.join(repo, "docs/knowledge-pilot/political-block-id-migrations-20260829.json");
const apply = process.argv.includes("--apply");
const recordContentHashes = process.argv.includes("--record-content-hashes");

function blockText(block) {
  return block.text || (block.items || []).join("\n");
}

function legacyBlocks(markdown, namespace) {
  const blocks = [];
  const lines = markdown.split("\n");
  let paragraph = [];
  let list = null;
  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: "paragraph", text: paragraph.join("\n") });
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    blocks.push(list);
    list = null;
  };
  for (const line of lines) {
    const heading = line.match(/^###\s+(.+)$/);
    const listItem = line.match(/^(-|\d+\.)\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: heading[1] });
    } else if (listItem) {
      flushParagraph();
      const ordered = listItem[1] !== "-";
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { type: "list", ordered, items: [] };
      }
      list.items.push(listItem[2]);
    } else if (!line.trim()) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  const occurrences = new Map();
  return blocks.map((block) => {
    const digest = crypto.createHash("sha1")
      .update(`${block.type}\n${blockText(block)}`)
      .digest("hex")
      .slice(0, 8);
    const key = `${block.type}-${digest}`;
    const occurrence = (occurrences.get(key) || 0) + 1;
    occurrences.set(key, occurrence);
    return {
      ...block,
      id: `${namespace}-${key}${occurrence > 1 ? `-${occurrence}` : ""}`,
    };
  });
}

function section(source, heading) {
  const startMarker = `## ${heading}`;
  const lines = source.split("\n");
  const headingIndex = lines.findIndex((line) => line === startMarker);
  if (headingIndex < 0) throw new Error(`缺少 ${startMarker}`);
  let end = lines.length;
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index])) {
      end = index;
      break;
    }
  }
  return { lines, headingIndex, start: headingIndex + 1, end };
}

function chunkStarts(lines, start, end) {
  const starts = [];
  for (let index = start; index < end;) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    starts.push(index);
    if (/^###\s+/.test(line)) {
      index += 1;
      continue;
    }
    const listItem = line.match(/^(-|\d+\.)\s+(.+)$/);
    if (listItem) {
      const ordered = listItem[1] !== "-";
      index += 1;
      while (index < end) {
        const next = lines[index].match(/^(-|\d+\.)\s+(.+)$/);
        if (!next || (next[1] !== "-") !== ordered) break;
        index += 1;
      }
      continue;
    }
    index += 1;
    while (
      index < end &&
      lines[index].trim() &&
      !/^###\s+/.test(lines[index]) &&
      !/^(-|\d+\.)\s+/.test(lines[index])
    ) index += 1;
  }
  return starts;
}

function insertAnchors(source) {
  const lines = source.split("\n");
  const starts = [];
  for (const heading of ["完整内容", "易混与边界"]) {
    const range = section(source, heading);
    starts.push(...chunkStarts(lines, range.start, range.end));
  }
  const anchorsByLine = new Map(starts.map((lineIndex, index) => [
    lineIndex,
    `<!-- kp:block-id=b${String(index + 1).padStart(3, "0")} -->`,
  ]));
  const output = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (anchorsByLine.has(index)) output.push(anchorsByLine.get(index));
    output.push(lines[index]);
  }
  const endFrontmatter = output.indexOf("---", 1);
  if (endFrontmatter < 0) throw new Error("frontmatter未闭合");
  output.splice(endFrontmatter, 0, "card_schema: 1");
  return { source: output.join("\n"), blockCount: starts.length };
}

function pointId(source) {
  const match = source.match(/^id:\s*(\S+)$/m);
  if (!match) throw new Error("缺少id");
  return match[1];
}

function currentBlockIds(source) {
  return [...source.matchAll(/^<!--\s*kp:block-id=([^\s]+)\s*-->$/gm)].map((match) => match[1]);
}

function factualBody(source) {
  const parts = source.split(/^---$/m);
  assert.ok(parts.length >= 3, "frontmatter未闭合");
  const lines = parts.slice(2).join("---").split("\n");
  const output = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (/^<!--\s*kp:block-id=/.test(lines[index])) continue;
    if (/^> \[![a-z]+\]$/.test(lines[index])) {
      while (index + 1 < lines.length && /^> /.test(lines[index + 1])) {
        output.push(lines[++index].slice(2));
      }
      continue;
    }
    output.push(lines[index]);
  }
  return output.join("\n");
}

function factualBodyHash(source) {
  return crypto.createHash("sha256").update(factualBody(source)).digest("hex");
}

const files = fs.readdirSync(sourceDir).filter((name) => name.endsWith(".md")).sort();
assert.strictEqual(files.length, 37, "必须处理37篇政治正式Markdown");
const records = [];
let totalBlocks = 0;

for (const fileName of files) {
  const filePath = path.join(sourceDir, fileName);
  const source = fs.readFileSync(filePath, "utf8");
  const id = pointId(source);
  if (/^card_schema:\s*1$/m.test(source)) {
    const ids = currentBlockIds(source);
    assert.ok(ids.length > 0, `${fileName}: 已迁移文件没有块ID`);
    assert.strictEqual(new Set(ids).size, ids.length, `${fileName}: 块ID重复`);
    totalBlocks += ids.length;
    continue;
  }
  if (!apply) throw new Error(`${fileName}: 尚未迁移；使用 --apply`);
  const content = section(source, "完整内容");
  const confusion = section(source, "易混与边界");
  const contentText = content.lines.slice(content.start, content.end).join("\n").trim();
  const confusionText = confusion.lines.slice(confusion.start, confusion.end).join("\n").trim();
  const oldBlocks = [
    ...legacyBlocks(contentText, "content"),
    ...legacyBlocks(confusionText, "confusion"),
  ];
  const migrated = insertAnchors(source);
  assert.strictEqual(migrated.blockCount, oldBlocks.length, `${fileName}: 新旧块数不一致`);
  const newIds = currentBlockIds(migrated.source);
  assert.strictEqual(newIds.length, oldBlocks.length, `${fileName}: 锚点数不一致`);
  records.push(...oldBlocks.map((block, index) => ({
    pointId: id,
    fromBlockIds: [block.id],
    toBlockIds: [newIds[index]],
    primaryTargetId: newIds[index],
    disposition: "rename",
    reason: "CB2稳定块ID基线迁移",
  })));
  fs.writeFileSync(filePath, migrated.source);
  totalBlocks += migrated.blockCount;
}

if (apply) {
  assert.strictEqual(records.length, totalBlocks, "首次迁移必须覆盖全部块");
  fs.writeFileSync(migrationPath, `${JSON.stringify({
    schema_version: 1,
    module_id: "politics",
    generated_at: "2026-08-29",
    point_count: files.length,
    migration_count: records.length,
    migrations: records,
  }, null, 2)}\n`);
} else {
  const ledger = JSON.parse(fs.readFileSync(migrationPath, "utf8"));
  assert.strictEqual(ledger.point_count, files.length);
  assert.strictEqual(ledger.migration_count, totalBlocks);
  assert.strictEqual(ledger.migrations.length, totalBlocks);
  for (const migration of ledger.migrations) {
    assert.ok(currentBlockIds(fs.readFileSync(
      path.join(sourceDir, files.find((name) => pointId(fs.readFileSync(path.join(sourceDir, name), "utf8")) === migration.pointId)),
      "utf8",
    )).includes(migration.primaryTargetId), `${migration.pointId}: 迁移目标不存在`);
  }
  const contentHashes = Object.fromEntries(files.map((fileName) => [
    pointId(fs.readFileSync(path.join(sourceDir, fileName), "utf8")),
    factualBodyHash(fs.readFileSync(path.join(sourceDir, fileName), "utf8")),
  ]));
  if (recordContentHashes) {
    ledger.content_hashes = contentHashes;
    fs.writeFileSync(migrationPath, `${JSON.stringify(ledger, null, 2)}\n`);
  } else {
    assert.deepStrictEqual(ledger.content_hashes, contentHashes, "正式正文发生非卡片标记变化");
  }
}

console.log(`politics card anchor migration ${apply ? "applied" : "validated"}: ${files.length} points, ${totalBlocks} blocks`);
