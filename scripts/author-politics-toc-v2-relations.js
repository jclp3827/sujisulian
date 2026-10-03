#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const knowledgeDir = path.join(repo, "docs/knowledge-pilot/knowledge/politics-v2");
const ledgerPath = path.join(repo, "docs/knowledge-pilot/political-relations-v2-20260828.json");
const checkOnly = process.argv.includes("--check-only");

const relations = [
  ["politics-toc-v2-u002", "prerequisites", "politics-toc-v2-u001", "理解‘两个结合’的理论创新意义，需先明确习近平新时代中国特色社会主义思想的核心要义。"],
  ["politics-toc-v2-u003", "prerequisites", "politics-toc-v2-u002", "科学体系建立在马克思主义基本原理同中国具体实际、中华优秀传统文化相结合的理论基础上。"],
  ["politics-toc-v2-u004", "prerequisites", "politics-toc-v2-u003", "中国式现代化是这一思想科学体系在新时代目标任务和实践部署中的集中展开。"],

  ["politics-toc-v2-u007", "related", "politics-toc-v2-u004", "高质量发展是现代化建设的首要任务，也是中国式现代化的本质要求之一。"],
  ["politics-toc-v2-u008", "related", "politics-toc-v2-u004", "全过程人民民主是中国式现代化的本质要求之一。"],
  ["politics-toc-v2-u009", "related", "politics-toc-v2-u004", "文化强国建设与中国式现代化物质文明和精神文明相协调的特色相连。"],
  ["politics-toc-v2-u010", "related", "politics-toc-v2-u006", "保障和改善民生是坚持以人民为中心、增进民生福祉的具体展开。"],
  ["politics-toc-v2-u011", "related", "politics-toc-v2-u004", "生态文明建设对应中国式现代化人与自然和谐共生的特色。"],
  ["politics-toc-v2-u011", "related", "politics-toc-v2-u007", "绿色低碳化是高质量发展的关键环节，绿色也是其普遍形态。"],
  ["politics-toc-v2-u012", "related", "politics-toc-v2-u007", "进一步全面深化改革以经济体制改革为牵引；高质量发展中的市场经济体制需要处理好政府和市场的关系。"],
  ["politics-toc-v2-u013", "related", "politics-toc-v2-u008", "全过程人民民主需要法治体系和制度程序保障人民依法参与国家治理。"],
  ["politics-toc-v2-u013", "related", "politics-toc-v2-u012", "全面深化改革与全面依法治国共同推进国家治理体系和治理能力现代化。"],
  ["politics-toc-v2-u014", "related", "politics-toc-v2-u005", "坚持党的全面领导与推进全面从严治党分别回答领导地位和自身建设保障问题。"],
  ["politics-toc-v2-u015", "related", "politics-toc-v2-u007", "教育、科技、人才为现代化建设提供支撑，创新是高质量发展的第一动力。"],
  ["politics-toc-v2-u017", "related", "politics-toc-v2-u016", "国防和军队建设是总体国家安全体系的重要支撑。"],
  ["politics-toc-v2-u018", "related", "politics-toc-v2-u016", "推进祖国统一必须维护国家主权、安全和发展利益。"],
  ["politics-toc-v2-u019", "related", "politics-toc-v2-u016", "构建人类命运共同体以普遍安全为目标，与总体国家安全观的国际安全维度相连。"],

  ["politics-toc-v2-u021", "prerequisites", "politics-toc-v2-u020", "区分哲学基本派别前，先认识马克思主义哲学在马克思主义理论体系中的位置。"],
  ["politics-toc-v2-u022", "prerequisites", "politics-toc-v2-u021", "物质和意识关系是唯物主义与唯心主义分歧在本体论上的具体展开。"],
  ["politics-toc-v2-u023", "prerequisites", "politics-toc-v2-u022", "理解联系和发展的唯物辩证法，需要坚持物质第一性和客观世界可认识的基本立场。"],
  ["politics-toc-v2-u024", "prerequisites", "politics-toc-v2-u023", "对立统一规律是唯物辩证法总特征进一步展开的核心规律。"],
  ["politics-toc-v2-u025", "prerequisites", "politics-toc-v2-u023", "量变质变规律以联系和发展的辩证观点为理解基础。"],
  ["politics-toc-v2-u026", "prerequisites", "politics-toc-v2-u023", "否定之否定规律说明事物发展的方向和道路，需先理解辩证发展的总特征。"],
  ["politics-toc-v2-u027", "prerequisites", "politics-toc-v2-u022", "理解实践与认识的关系，可先把握物质决定意识、意识具有能动反作用的关系。"],
  ["politics-toc-v2-u028", "prerequisites", "politics-toc-v2-u027", "认识的辩证过程是实践基础上认识运动的具体展开。"],
  ["politics-toc-v2-u029", "prerequisites", "politics-toc-v2-u028", "真理需要接受实践检验，先理解认识在实践基础上的发展过程。"],
  ["politics-toc-v2-u030", "prerequisites", "politics-toc-v2-u020", "历史唯物主义中的社会存在和社会意识关系属于马克思主义哲学的基本内容。"],
  ["politics-toc-v2-u031", "prerequisites", "politics-toc-v2-u030", "社会基本矛盾及其运动规律以社会存在决定社会意识的历史唯物主义立场为基础。"],
  ["politics-toc-v2-u032", "prerequisites", "politics-toc-v2-u031", "人民群众的历史作用需要放在社会基本矛盾和社会发展规律中理解。"],

  ["politics-toc-v2-u025", "contrasts", "politics-toc-v2-u024", "对立统一规律回答发展动力，量变质变规律回答发展状态和形式，二者考查角度不同。"],
  ["politics-toc-v2-u026", "contrasts", "politics-toc-v2-u024", "对立统一规律揭示发展动力，否定之否定规律揭示发展方向和道路，不能互换。"],
  ["politics-toc-v2-u026", "contrasts", "politics-toc-v2-u025", "量变质变规律侧重状态变化，否定之否定规律侧重过程的前进性和曲折性。"],
  ["politics-toc-v2-u030", "contrasts", "politics-toc-v2-u022", "物质与意识讨论一般哲学关系，社会存在与社会意识讨论社会历史领域的对应关系。"],

  ["politics-toc-v2-u033", "prerequisites", "politics-toc-v2-u020", "商品理论是马克思主义政治经济学分析资本主义生产关系的逻辑起点。"],
  ["politics-toc-v2-u034", "prerequisites", "politics-toc-v2-u033", "劳动二重性用于说明商品使用价值和价值二因素的劳动基础。"],
  ["politics-toc-v2-u035", "prerequisites", "politics-toc-v2-u034", "商品价值量由社会必要劳动时间决定，需先区分具体劳动和抽象劳动。"],
  ["politics-toc-v2-u036", "prerequisites", "politics-toc-v2-u035", "货币的价值尺度职能用于衡量商品价值量，先理解商品价值及其价值量。"],
  ["politics-toc-v2-u037", "prerequisites", "politics-toc-v2-u035", "剩余价值是超过劳动力价值的价值，理解前需先掌握商品价值及价值量的概念。"],
  ["politics-toc-v2-u034", "contrasts", "politics-toc-v2-u033", "商品二因素是商品属性，劳动二重性是生产商品劳动的两重规定，二者对应但不能混称。"],
];

function parseFrontmatter(source, fileName) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${fileName}: frontmatter 不合法`);
  const values = {};
  for (const line of match[1].split("\n")) {
    const property = line.match(/^([a-z_]+):\s*(.*)$/);
    if (property && property[2] && property[2] !== "[]") values[property[1]] = property[2].replace(/^['"]|['"]$/g, "");
  }
  return { frontmatter: match[1], body: match[2], values };
}

function yamlList(key, values) {
  if (!values.length) return `${key}: []`;
  return [`${key}:`, ...values.map((value) => `  - ${JSON.stringify(value)}`)].join("\n");
}

function replaceList(frontmatter, key, values) {
  const pattern = new RegExp(`^${key}:(?:\\s*\\[\\])?(?:\\n  - .+)*`, "m");
  if (!pattern.test(frontmatter)) throw new Error(`frontmatter 缺少 ${key}`);
  return frontmatter.replace(pattern, yamlList(key, values));
}

function replaceScalar(frontmatter, key, value, afterKey) {
  const pattern = new RegExp(`^${key}:.*$`, "m");
  if (pattern.test(frontmatter)) return frontmatter.replace(pattern, `${key}: ${value}`);
  const anchor = new RegExp(`^${afterKey}:.*$`, "m");
  if (!anchor.test(frontmatter)) throw new Error(`frontmatter 缺少插入锚点 ${afterKey}`);
  return frontmatter.replace(anchor, (line) => `${line}\n${key}: ${value}`);
}

const notes = new Map();
for (const fileName of fs.readdirSync(knowledgeDir).filter((name) => name.endsWith(".md")).sort()) {
  const source = fs.readFileSync(path.join(knowledgeDir, fileName), "utf8");
  const parsed = parseFrontmatter(source, fileName);
  notes.set(parsed.values.id, { fileName, source, ...parsed });
}

const relationTypes = new Set(["prerequisites", "contrasts", "related"]);
const seen = new Set();
for (const [sourceId, type, targetId, why] of relations) {
  if (!notes.has(sourceId) || !notes.has(targetId)) throw new Error(`关系目标不存在：${sourceId} -> ${targetId}`);
  if (!relationTypes.has(type)) throw new Error(`关系类型不合法：${type}`);
  if (sourceId === targetId) throw new Error(`关系不能指向自身：${sourceId}`);
  const key = `${sourceId}|${type}|${targetId}`;
  if (seen.has(key)) throw new Error(`关系重复：${key}`);
  if (!why || why.length < 12) throw new Error(`关系理由过短：${key}`);
  seen.add(key);
}

const changed = [];
for (const [id, note] of notes) {
  if (["approved", "published"].includes(note.values.status)) continue;
  let frontmatter = note.frontmatter;
  for (const type of relationTypes) {
    const links = relations
      .filter(([sourceId, relationType]) => sourceId === id && relationType === type)
      .map(([, , targetId]) => `[[${notes.get(targetId).values.title}]]`);
    frontmatter = replaceList(frontmatter, type, links);
  }
  const reasons = relations
    .filter(([sourceId]) => sourceId === id)
    .map(([, type, targetId, why]) => `${type}|${targetId}|${why}`);
  if (/^relation_reasons:/m.test(frontmatter)) frontmatter = replaceList(frontmatter, "relation_reasons", reasons);
  else frontmatter = frontmatter.replace(/^related:(?:\s*\[\])?(?:\n  - .+)*/m, (block) => `${block}\n${yamlList("relation_reasons", reasons)}`);
  frontmatter = replaceScalar(frontmatter, "relation_state", "authored_pending_final", "review_state");
  const next = `---\n${frontmatter}\n---\n${note.body}`;
  if (next !== note.source) {
    changed.push(note.fileName);
    if (!checkOnly) fs.writeFileSync(path.join(knowledgeDir, note.fileName), next);
  }
}

const ledger = {
  batch: "politics-toc-v2-relations-20260828",
  generated_at: "2026-08-28",
  status: "authored-pending-final-review",
  source: "docs/knowledge-pilot/knowledge/politics-v2",
  point_count: notes.size,
  relation_count: relations.length,
  counts: Object.fromEntries([...relationTypes].map((type) => [type, relations.filter((item) => item[1] === type).length])),
  rules: [
    "目录父子关系只进入 directory，不重复写为知识语义关系。",
    "prerequisites 表示理解依赖并必须保持无环。",
    "contrasts 只用于确有易混边界的知识对。",
    "related 只保留能解释学习联系的高价值连接。",
    "所有关系仍随 Markdown 保持 review，不改变发布资格。",
  ],
  relations: relations.map(([source_id, type, target_id, why], index) => ({
    id: `politics-rel-v2-${String(index + 1).padStart(3, "0")}`,
    source_id,
    type,
    target_id,
    why,
    review_state: "authored_pending_final",
  })),
};
const ledgerSource = `${JSON.stringify(ledger, null, 2)}\n`;
const ledgerChanged = !fs.existsSync(ledgerPath) || fs.readFileSync(ledgerPath, "utf8") !== ledgerSource;
if (!checkOnly && ledgerChanged) fs.writeFileSync(ledgerPath, ledgerSource);

console.log(`政治 V2 关系：${relations.length} 条；Markdown 变化 ${changed.length} 篇；关系账本${ledgerChanged ? "待更新" : "未变化"}`);
if (checkOnly && (changed.length || ledgerChanged)) process.exitCode = 2;
