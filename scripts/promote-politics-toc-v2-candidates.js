#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const sourceDir = path.join(repo, "docs/knowledge-pilot/sources/politics/02-toc-audit-v2");
const knowledgeDir = path.join(repo, "docs/knowledge-pilot/knowledge/politics-v2");
const auditPath = path.join(repo, "docs/knowledge-pilot/political-toc-audit-20260827-v2.json");
const legacyDir = path.join(repo, "docs/knowledge-pilot/knowledge/politics");
const force = process.argv.includes("--force");
const checkOnly = process.argv.includes("--check-only");

const sectionEditorial = {
  "第一节 党的全面领导": {
    summary: "党的全面领导是中国特色社会主义最本质的特征和制度的最大优势，党中央集中统一领导是党的领导的最高原则。",
    confusion: "党领导一切不等于包揽一切；党的领导制度居于统领地位，不能与具体国家机关职能混同。",
    prompt: "怎样概括党的全面领导的根本地位和最高原则？",
    answer: "中国共产党领导是中国特色社会主义最本质的特征，是中国特色社会主义制度的最大优势；党中央集中统一领导是党的领导的最高原则。",
    pitfall: "不要把“党领导一切”理解为党直接取代国家机关处理所有具体事务。",
  },
  "第二节 以人民为中心": {
    summary: "坚持以人民为中心要求坚持人民至上、贯彻群众路线，并在高质量发展中扎实推进全体人民共同富裕。",
    confusion: "共同富裕不是少数人的富裕、整齐划一的平均主义，也不要求所有人和所有地区同时达到同一水平。",
    prompt: "坚持以人民为中心包含哪些核心要求？",
    answer: "坚持人民至上，坚持全心全意为人民服务和群众路线，把增进民生福祉作为发展的根本目的，扎实推进全体人民共同富裕。",
    pitfall: "不要把共同富裕等同于平均主义或同步富裕。",
  },
  "第三节 推动高质量发展": {
    summary: "推动高质量发展要把握新发展阶段、贯彻新发展理念、构建新发展格局，并以社会主义基本经济制度和现代化经济体系提供支撑。",
    confusion: "新发展阶段是历史方位，新发展理念回答发展思路，新发展格局是战略路径；三者以及基本经济制度不能相互替代。",
    prompt: "推动高质量发展的总体框架由哪些部分构成？",
    answer: "把握新发展阶段，贯彻创新、协调、绿色、开放、共享的新发展理念，构建以国内大循环为主体、国内国际双循环相互促进的新发展格局，坚持和完善基本经济制度并建设现代化经济体系。",
    pitfall: "“以国内大循环为主体”不等于封闭运行；“公有制为主体”也不等于“国有经济为主体”。",
  },
  "第四节 发展全过程人民民主": {
    summary: "全过程人民民主把党的领导、人民当家作主和依法治国有机统一起来，通过完整制度程序和参与实践保障人民当家作主。",
    confusion: "全过程人民民主不是只在选举时参与，也不能脱离党的领导和依法治国单独理解。",
    prompt: "发展全过程人民民主必须坚持哪三者有机统一？",
    answer: "坚持党的领导、人民当家作主、依法治国有机统一。",
    pitfall: "不要把人民民主缩减为单一选举环节。",
  },
  "第五节 建设社会主义文化强国": {
    summary: "建设社会主义文化强国要坚持马克思主义指导地位，坚定文化自信，培育社会主义核心价值观并推动中华优秀传统文化创造性转化、创新性发展。",
    confusion: "文化自信不是文化封闭，守正与创新、民族性与开放性需要统一。",
    prompt: "建设社会主义文化强国的基本着力点有哪些？",
    answer: "坚持马克思主义指导地位，坚定文化自信，建设具有强大凝聚力和引领力的社会主义意识形态，培育社会主义核心价值观，推动优秀传统文化创新发展。",
    pitfall: "不要把文化自信理解为排斥其他文明成果。",
  },
  "第六节 保障和改善民生": {
    summary: "保障和改善民生要坚持尽力而为、量力而行，围绕就业、收入分配、社会保障、健康等领域解决人民最关心最直接最现实的利益问题。",
    confusion: "改善民生既不能脱离发展条件作过度承诺，也不能以量力而行为由降低基本保障责任。",
    prompt: "保障和改善民生应把握什么原则？",
    answer: "坚持尽力而为、量力而行，采取更多惠民生、暖民心举措，着力解决人民群众急难愁盼问题。",
    pitfall: "“尽力而为”和“量力而行”必须结合理解。",
  },
  "第七节 社会主义生态文明": {
    summary: "生态文明建设坚持绿水青山就是金山银山，推动绿色发展，促进人与自然和谐共生，建设美丽中国。",
    confusion: "生态保护与经济发展不是简单对立关系，绿色发展强调在保护中发展、在发展中保护。",
    prompt: "社会主义生态文明建设的核心理念和目标是什么？",
    answer: "坚持绿水青山就是金山银山，推动绿色低碳发展，促进人与自然和谐共生，建设美丽中国。",
    pitfall: "不要把生态保护理解为停止发展。",
  },
  "第八节 全面深化改革": {
    summary: "全面深化改革以完善和发展中国特色社会主义制度、推进国家治理体系和治理能力现代化为总目标。",
    confusion: "改革不是改变中国特色社会主义制度的根本性质，而是推动制度更加成熟定型。",
    prompt: "全面深化改革的总目标是什么？",
    answer: "完善和发展中国特色社会主义制度，推进国家治理体系和治理能力现代化。",
    pitfall: "不要把改革方向表述为照搬其他国家制度模式。",
  },
  "第九节 全面依法治国": {
    summary: "全面依法治国是国家治理的一场深刻革命，要坚持党的领导、人民当家作主和依法治国有机统一，建设中国特色社会主义法治体系。",
    confusion: "依法治国、依法执政和依法行政主体与侧重点不同，但共同服务于法治国家、法治政府、法治社会一体建设。",
    prompt: "全面依法治国的总抓手是什么？",
    answer: "建设中国特色社会主义法治体系。",
    pitfall: "不要把依法治国仅理解为政府依法行政。",
  },
  "第十节 全面从严治党": {
    summary: "全面从严治党是新时代党的建设的鲜明主题，要以党的政治建设为统领，坚持严的主基调，推进自我革命。",
    confusion: "全面从严治党覆盖党的建设各方面和全过程，不只等同于反腐败。",
    prompt: "为什么不能把全面从严治党只理解为反腐败？",
    answer: "全面从严治党覆盖政治、思想、组织、作风、纪律和制度建设等各方面，反腐败是其中的重要内容而非全部。",
    pitfall: "不要缩小全面从严治党的范围。",
  },
  "第十一节 社会主义现代化建设的教育、科技、人才战略": {
    summary: "教育、科技、人才是全面建设社会主义现代化国家的基础性、战略性支撑，需要统筹推进教育强国、科技强国和人才强国建设。",
    confusion: "教育、科技、人才相互支撑，不能把三者割裂为互不相关的单项任务。",
    prompt: "教育、科技、人才在现代化建设中具有什么共同定位？",
    answer: "教育、科技、人才是全面建设社会主义现代化国家的基础性、战略性支撑。",
    pitfall: "注意三者需要一体部署、统筹推进。",
  },
  "第十二节 总体国家安全观": {
    summary: "总体国家安全观以人民安全为宗旨、政治安全为根本、经济安全为基础，统筹发展和安全以及各领域安全。",
    confusion: "总体国家安全不是单一军事或国土安全，而是覆盖多领域、强调系统统筹的安全体系。",
    prompt: "总体国家安全观的宗旨、根本和基础分别是什么？",
    answer: "以人民安全为宗旨，以政治安全为根本，以经济安全为基础。",
    pitfall: "不要把总体国家安全观缩减为传统安全。",
  },
  "第十三节 巩固国防和强大人民军队": {
    summary: "巩固国防和强大人民军队必须坚持党对人民军队的绝对领导，贯彻新时代党的强军思想，推进国防和军队现代化。",
    confusion: "党对人民军队的绝对领导是根本原则和制度，不能与一般行政领导关系混同。",
    prompt: "人民军队建设必须坚持的根本原则是什么？",
    answer: "坚持党对人民军队的绝对领导。",
    pitfall: "不要弱化“绝对领导”的完整表述。",
  },
  "第十四节 坚持“一国两制”和推进祖国完全统一": {
    summary: "“一国两制”首先要坚持一国原则，同时尊重两制差异，维护国家主权、安全、发展利益并推进祖国完全统一。",
    confusion: "“一国”是实行“两制”的前提和基础，“两制”从属和派生于“一国”，二者地位不能倒置。",
    prompt: "怎样理解“一国”和“两制”的关系？",
    answer: "“一国”是根本，是实行“两制”的前提和基础；“两制”从属和派生于“一国”，并统一于“一国”之内。",
    pitfall: "不要把“一国”和“两制”理解为并列且相互独立。",
  },
  "第十五节 中国特色大国外交": {
    summary: "中国特色大国外交服务民族复兴和人类进步，推动建设新型国际关系、构建人类命运共同体。",
    confusion: "独立自主的和平外交政策不等于孤立主义，和平发展也不等于放弃维护国家主权、安全和发展利益。",
    prompt: "新时代中国特色大国外交的重要目标是什么？",
    answer: "推动建设新型国际关系，推动构建人类命运共同体，为民族复兴创造有利外部条件并促进人类进步。",
    pitfall: "不要把和平发展误解为不维护国家核心利益。",
  },
};

function parseFrontmatter(source, fileName) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${fileName}: frontmatter 不合法`);
  const values = {};
  let activeList = null;
  for (const line of match[1].split("\n")) {
    const item = line.match(/^\s{2}-\s+(.+)$/);
    if (item && activeList) {
      values[activeList].push(item[1].replace(/^['"]|['"]$/g, ""));
      continue;
    }
    const property = line.match(/^([a-z_]+):(?:\s*(.*))?$/);
    if (!property) continue;
    const [, key, raw = ""] = property;
    if (!raw || raw === "[]") {
      values[key] = [];
      activeList = key;
    } else {
      values[key] = raw.replace(/^['"]|['"]$/g, "");
      activeList = null;
    }
  }
  return { values, body: match[2] };
}

function yamlList(name, values) {
  if (!values.length) return `${name}: []`;
  return [`${name}:`, ...values.map((value) => `  - ${JSON.stringify(String(value))}`)].join("\n");
}

function getSection(body, heading, nextHeading) {
  const pattern = new RegExp(`## ${heading}\\n\\n([\\s\\S]*?)\\n## ${nextHeading}`);
  return (body.match(pattern) || [])[1] || "";
}

function joinWrappedLines(source) {
  const lines = source
    .replace(/【知识延伸】/g, "\n**知识延伸**\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const output = [];
  const startsBlock = (line) => /^(\*\*|[一二三四五六七八九十]+、|（[一二三四五六七八九十]+）|\d+\.|（\d+）|[①-⑳])/.test(line);
  for (const line of lines) {
    if (
      !output.length ||
      startsBlock(line) ||
      output[output.length - 1] === "**知识延伸**" ||
      /[。！？；：]$/.test(output[output.length - 1])
    ) output.push(line);
    else output[output.length - 1] += line;
  }
  return output.join("\n\n");
}

function extractTeachingSegments(body, fallbackTitle) {
  const full = getSection(body, "第二轮识别正文", "审计状态");
  const segments = [];
  let cursor = 0;
  while (true) {
    const fax = full.indexOf("【考场传真】", cursor);
    if (fax === -1) break;
    const marker = full.indexOf("【考点精析】", fax);
    if (marker === -1) break;
    const training = full.indexOf("【小黑母题特训】", marker);
    const titleLines = full
      .slice(cursor, fax)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    let title = titleLines.at(-1) || fallbackTitle;
    title = title.replace(/^知识点\s*\d+\s*/, "").trim();
    if (/^[A-D]\.|^\d+\.（/.test(title) || title.length > 60) title = fallbackTitle;
    const teaching = full.slice(marker + "【考点精析】".length, training === -1 ? full.length : training);
    segments.push({ title, content: joinWrappedLines(teaching) });
    if (training === -1) break;
    const nextFax = full.indexOf("【考场传真】", training);
    cursor = training + "【小黑母题特训】".length;
    if (nextFax === -1) break;
  }
  if (!segments.length) throw new Error(`${fallbackTitle}: 未找到【考点精析】内容`);
  return segments;
}

function loadLegacyEditorial() {
  const byTitle = new Map();
  for (const fileName of fs.readdirSync(legacyDir).filter((name) => name.endsWith(".md"))) {
    const parsed = parseFrontmatter(fs.readFileSync(path.join(legacyDir, fileName), "utf8"), fileName);
    const section = (heading, next) => getSection(parsed.body, heading, next).trim();
    const card = section("速记卡", "__never__") || parsed.body.split("## 速记卡\n\n")[1] || "";
    const subsection = (heading, next) => {
      const pattern = new RegExp(`### ${heading}\\n\\n([\\s\\S]*?)(?=\\n### ${next}|$)`);
      return (card.match(pattern) || [])[1]?.trim() || "";
    };
    byTitle.set(parsed.values.title, {
      summary: section("一句话理解", "完整内容"),
      confusion: section("易混与边界", "速记卡").replace(/^-\s*/, ""),
      prompt: subsection("提示", "答案"),
      answer: subsection("答案", "易错"),
      pitfall: subsection("易错", "__never__"),
    });
  }
  return byTitle;
}

function renderCandidate(unit, source, legacyEditorial) {
  const { values, body } = parseFrontmatter(source, path.basename(unit.file));
  const legacyMatch = [...legacyEditorial.entries()].find(([title]) =>
    title === unit.title || title.startsWith(unit.title) || unit.title.startsWith(title),
  );
  const editorial = legacyMatch?.[1] || sectionEditorial[unit.title];
  if (!editorial) throw new Error(`${unit.id}: 缺少编辑提要`);
  const segments = extractTeachingSegments(body, unit.title);
  const category = values.hierarchy_titles.at(-2) || "政治理论";
  const tag = values.hierarchy_titles.some((title) => title.includes("习近平新时代"))
    ? "习近平新时代中国特色社会主义思想"
    : "马克思主义基本原理";
  return [
    "---",
    `id: ${unit.id}`,
    `toc_node_id: ${values.toc_node_id}`,
    `title: ${unit.title}`,
    "module: politics",
    `category: ${category}`,
    `node_type: ${values.node_type}`,
    `parent_id: ${values.parent_id}`,
    `toc_order: ${values.toc_order}`,
    "status: review",
    "version: 1",
    "aliases: []",
    yamlList("tags", ["政治", tag]),
    yamlList("hierarchy_ids", values.hierarchy_ids),
    yamlList("hierarchy_titles", values.hierarchy_titles),
    yamlList("source_units", values.source_units),
    yamlList("source_pages", values.source_pages),
    yamlList("risk_pages", values.risk_pages),
    yamlList("risk_flags", values.risk_flags),
    "prerequisites: []",
    "contrasts: []",
    "related: []",
    "review_state: pending_final",
    "audit_state: content_processed_pending_final",
    "processed_at: 2026-08-28",
    `source_hash: ${JSON.stringify(values.source_hash)}`,
    "---",
    `# ${unit.title}`,
    "",
    "## 一句话理解",
    "",
    editorial.summary,
    "",
    "## 完整内容",
    "",
    segments.map((segment) => `### ${segment.title}\n\n${segment.content}`).join("\n\n"),
    "",
    "## 易混与边界",
    "",
    `- ${editorial.confusion}`,
    "",
    "## 速记卡",
    "",
    "### 提示",
    "",
    editorial.prompt,
    "",
    "### 答案",
    "",
    editorial.answer,
    "",
    "### 易错",
    "",
    editorial.pitfall,
    "",
  ].join("\n");
}

function preserveRelationMetadata(candidate, existing) {
  let next = candidate;
  for (const key of ["prerequisites", "contrasts", "related"]) {
    const block = existing.match(new RegExp(`^${key}:(?:\\s*\\[\\])?(?:\\n  - .+)*`, "m"))?.[0];
    if (block) next = next.replace(new RegExp(`^${key}:(?:\\s*\\[\\])?(?:\\n  - .+)*`, "m"), block);
  }
  const reasons = existing.match(/^relation_reasons:(?:\s*\[\])?(?:\n  - .+)*/m)?.[0];
  if (reasons && !/^relation_reasons:/m.test(next)) {
    next = next.replace(/^related:(?:\s*\[\])?(?:\n  - .+)*/m, (block) => `${block}\n${reasons}`);
  }
  const relationState = existing.match(/^relation_state:\s*(.+)$/m)?.[1];
  if (relationState && !/^relation_state:/m.test(next)) {
    next = next.replace(/^review_state:.*$/m, (line) => `${line}\nrelation_state: ${relationState}`);
  }
  return next;
}

const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));
const legacyEditorial = loadLegacyEditorial();
fs.mkdirSync(knowledgeDir, { recursive: true });
const results = { created: [], updated: [], unchanged: [], skippedApproved: [] };

for (const unit of audit.units) {
  const sourcePath = path.join(repo, unit.file);
  const source = fs.readFileSync(sourcePath, "utf8");
  const targetName = path.basename(unit.file).replace(/^toc-v2-/, "");
  const targetPath = path.join(knowledgeDir, targetName);
  let candidate = renderCandidate(unit, source, legacyEditorial);
  if (!fs.existsSync(targetPath)) {
    if (!checkOnly) fs.writeFileSync(targetPath, candidate);
    results.created.push(targetName);
  } else {
    const existing = fs.readFileSync(targetPath, "utf8");
    const existingStatus = (existing.match(/^status:\s*(.+)$/m) || [])[1];
    if (["approved", "published"].includes(existingStatus)) {
      results.skippedApproved.push(targetName);
      continue;
    }
    candidate = preserveRelationMetadata(candidate, existing);
    if (existing === candidate) results.unchanged.push(targetName);
    else if (!force) throw new Error(`${targetName}: 已有 V2 候选发生差异；确认后使用 --force 更新`);
    else {
      if (!checkOnly) fs.writeFileSync(targetPath, candidate);
      results.updated.push(targetName);
    }
  }
}

console.log(`政治 V2 候选：新增 ${results.created.length}，更新 ${results.updated.length}，已批准跳过 ${results.skippedApproved.length}，未变化 ${results.unchanged.length}`);
if (checkOnly && results.created.length) process.exitCode = 2;
