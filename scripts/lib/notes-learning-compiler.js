const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { validateMethodQuestion } = require('./notes-learning-authoring');
const { prepareSemanticPolicy, applySemanticPolicy, sourceAllowed } = require('./notes-learning-semantic');
const { KINDS, fingerprint, sourceKey, findSource, taskCompatible } = require('../../miniprogram/subpackages/note/services/learning-content');
const { recipeSupported } = require('../../miniprogram/subpackages/note/services/learning-generator');
const SUBJECTS = ['data-analysis', 'quantity', 'logic', 'verbal', 'graphic'];
const sha = (v) => crypto.createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
function approvalDigest(item) { const value = { ...item }; delete value.status; delete value.approval; return sha(value); }
function loadBody(root) {
  return Object.fromEntries(SUBJECTS.map((id) => {
    const dir = path.join(root, 'miniprogram/models', `note-${id}`);
    const read = (p) => JSON.parse(fs.readFileSync(path.join(dir, p), 'utf8'));
    return [id, { module: read('meta.json'), categories: read('categories.json'),
      points: fs.readdirSync(path.join(dir, 'points')).filter((f) => f.endsWith('.json')).sort().flatMap((f) => read(`points/${f}`)) }];
  }));
}
function compile(source, body, options = {}) {
  const pack = JSON.parse(JSON.stringify(source));
  prepareSemanticPolicy(pack, options);
  const requireValue = (condition, reason) => { if (!condition) throw new Error(reason); };
  requireValue(pack.schemaVersion === 1 && typeof pack.version === 'string', '学习包版本无效');
  for (const key of ['targets', 'questions', 'recipes', 'sourceReviews', 'materials', 'knowledgeAtoms', 'comparisonGroups']) requireValue(Array.isArray(pack[key]), `缺少 ${key}`);
  const ids = new Set();
  const all = [...pack.targets, ...pack.questions, ...pack.recipes, ...pack.sourceReviews, ...pack.materials, ...pack.knowledgeAtoms, ...pack.comparisonGroups];
  for (const item of all) {
    requireValue(typeof item.id === 'string' && item.id && !ids.has(item.id), `重复或缺失 ID: ${item.id}`); ids.add(item.id);
    requireValue(Number.isInteger(item.revision) && item.revision > 0 && ['review', 'approved', 'blocked'].includes(item.status), `${item.id}: 版本或状态无效`);
    if (item.status === 'approved') requireValue(item.approval?.reviewer && /^\d{4}-\d{2}-\d{2}$/.test(item.approval.reviewedAt)
      && item.approval.digest === approvalDigest(item), `${item.id}: 缺少对应版本的人工审核记录`);
    item.reviewVerified = item.status === 'approved';
  }
  const reviews = new Map();
  for (const review of pack.sourceReviews) {
    requireValue(review.ref && !reviews.has(sourceKey(review.ref)), `${review.id}: 来源审核重复`);
    reviews.set(sourceKey(review.ref), review);
  }
  for (const item of all) {
    const refs = item.ref ? [item.ref] : item.refs;
    requireValue(Array.isArray(refs) && refs.length > 0, `${item.id}: 来源为空`);
    refs.forEach((ref) => {
      const { tab } = findSource(body, ref);
      requireValue(tab && ref.expectedSha256 === sha(tab), `${item.id}: 来源缺失或已变更`);
      requireValue(!(pack.blockedPointIds || []).includes(`${ref.subjectId}:${ref.pointId}`), `${item.id}: 来源待核，禁止派生`);
      requireValue(reviews.has(sourceKey(ref)), `${item.id}: 缺来源审核登记`);
      ref.fingerprint = fingerprint(tab);
    });
    if (item.ref) continue;
    requireValue(SUBJECTS.includes(item.subjectId) && body[item.subjectId].categories.some((c) => c.id === item.categoryId), `${item.id}: 科目或专题无效`);
    requireValue(refs.every((ref) => sourceAllowed(item, ref, pack, body)), `${item.id}: 来源跨科目`);
  }
  const targets = new Map(pack.targets.map((t) => [t.id, t]));
  for (const t of pack.targets) requireValue(t.statement && t.conclusion && t.conditions?.length && t.excludes?.length, `${t.id}: 目标或边界缺失`);
  const atoms = new Map(pack.knowledgeAtoms.map((a) => [a.id, a]));
  const strings = (value) => Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string' && item.trim());
  for (const atom of pack.knowledgeAtoms) {
    requireValue(atom.statement && strings(atom.conditions) && strings(atom.misconceptions), `${atom.id}: 知识结论、条件或误区缺失`);
    requireValue(atom.sourceAnchors?.length > 0, `${atom.id}: 缺来源块定位`);
    atom.sourceAnchors.forEach((anchor) => {
      const { tab } = findSource(body, anchor);
      requireValue(atom.refs.some((ref) => sourceKey(ref) === sourceKey(anchor)) && Number.isInteger(anchor.blockIndex)
        && anchor.blockIndex >= 0 && tab?.blocks?.[anchor.blockIndex]
        && sha(tab.blocks[anchor.blockIndex]) === anchor.expectedBlockSha256, `${atom.id}: 知识来源块缺失或变更`);
      anchor.fingerprint = fingerprint(tab.blocks[anchor.blockIndex]);
    });
  }
  const comparisons = new Map(pack.comparisonGroups.map((g) => [g.id, g]));
  for (const group of pack.comparisonGroups) {
    requireValue(group.knowledgeAtomIds?.length >= 2 && new Set(group.knowledgeAtomIds).size === group.knowledgeAtomIds.length
      && group.difference && strings(group.conditions) && strings(group.misconceptions), `${group.id}: 对照对象、差异或边界缺失`);
    for (const id of group.knowledgeAtomIds) {
      const atom = atoms.get(id);
      requireValue(atom && atom.subjectId === group.subjectId && atom.categoryId === group.categoryId
        && atom.refs.some((ref) => group.refs.some((r) => sourceKey(r) === sourceKey(ref))), `${group.id}: 对照知识不存在或来源不一致`);
    }
  }
  const resources = [...pack.questions, ...pack.recipes];
  for (const r of resources) {
    requireValue(r.primaryTargetIds?.length && new Set([...r.primaryTargetIds, ...(r.supportingTargetIds || [])]).size === r.primaryTargetIds.length + (r.supportingTargetIds || []).length, `${r.id}: 目标关系无效`);
    [...r.primaryTargetIds, ...(r.supportingTargetIds || [])].forEach((id) => {
      const target = targets.get(id); requireValue(target && target.subjectId === r.subjectId && target.categoryId === r.categoryId, `${r.id}: 目标不存在或跨专题`);
      requireValue(target.refs.some((t) => r.refs.some((ref) => sourceKey(ref) === sourceKey(t))), `${r.id}: 目标与来源不一致`);
    });
    requireValue(r.exerciseKinds?.length && new Set(r.exerciseKinds).size === r.exerciseKinds.length && r.exerciseKinds.every((k) => KINDS.includes(k)), `${r.id}: 练习方式无效`);
  }
  for (const q of pack.questions) {
    q.resourceType = 'question';
    if (q.origin) {
      const { tab } = findSource(body, q.origin);
      const matches = (tab?.blocks || []).filter((block) => block.type === 'example' && sha(block) === q.origin.expectedBlockSha256);
      requireValue(matches.length === 1 && q.refs.some((ref) => sourceKey(ref) === sourceKey(q.origin)), `${q.id}: 原例题定位变更或不唯一`);
      const original = matches[0];
      requireValue(typeof original.stem === 'string' && original.stem.trim(), `${q.id}: 原例题题干缺失，不能用展示说明代替`);
      q.prompt = original.stem; q.options = original.options; q.answer = original.answer; q.explanation = original.analysis;
      if (q.originAdaptation) {
        requireValue(q.originAdaptation.kind === 'neutral-display-completion' && q.originAdaptation.instruction
          && q.originAdaptation.reason, `${q.id}: 展示补全须显式登记说明与依据`);
        q.prompt = `${q.originAdaptation.instruction}\n${original.stem}`;
      }
      q.originalExampleFingerprint = fingerprint(original); q.declaredOriginalSource = original.source || null;
      q.answerSourceKeys = [sourceKey(q.origin)];
      if (original.image) { requireValue(original.image.src, `${q.id}: 原题图片缺失`); q.images = [{ id: `${q.id}-stem`, src: original.image.src, role: 'stem' }]; }
    }
    if (q.images) requireValue(q.images.length > 0 && new Set(q.images.map((i) => i.id)).size === q.images.length && q.images.every((image) => image.id && image.src && ['stem', 'option'].includes(image.role) && (image.role !== 'option' || q.options?.some((o) => o.key === image.optionKey))), `${q.id}: 图片或选项图引用不完整`);
    if (q.exerciseKinds.includes('method') && KINDS.some((kind) => pack.entryPlans?.[kind]?.resourceIds?.includes(q.id))) validateMethodQuestion(q);
    requireValue(q.prompt && q.explanation && q.familyId && q.exposureGroupId && ['authored', 'adapted', 'original', 'legacy-unverified'].includes(q.sourceKind), `${q.id}: 题目或来源身份缺失`);
    requireValue(q.answerMode === 'single-choice' && q.options?.length >= 2 && q.options.every((o) => o.key && o.text)
      && new Set(q.options.map((o) => o.key)).size === q.options.length && new Set(q.options.map((o) => o.text)).size === q.options.length
      && q.options.some((o) => o.key === q.answer), `${q.id}: 选项或答案无效`);
    requireValue(q.options.filter((o) => o.key !== q.answer).every((o) => q.distractorReasons?.[o.key]), `${q.id}: 缺少干扰项理由`);
    if (q.status === 'approved') requireValue(q.sourceKind !== 'legacy-unverified', `${q.id}: 题源尚未核实`);
  }
  for (const r of pack.recipes) { r.resourceType = 'recipe'; requireValue(recipeSupported(r), `${r.id}: 未知生成器或配方版本`); }
  const questionMap = new Map(pack.questions.map((q) => [q.id, q]));
  for (const m of pack.materials) {
    if (m.images) requireValue(Array.isArray(m.images) && m.images.length > 0 && new Set(m.images.map(i => i.id)).size === m.images.length && m.images.every(i => i.id && i.src && i.role === 'material'), `${m.id}: 材料图片无效`);
    requireValue(m.content && m.questionIds?.length && new Set(m.questionIds).size === m.questionIds.length, `${m.id}: 材料不完整`);
    requireValue(m.questionIds.every((id) => questionMap.get(id)?.materialId === m.id && questionMap.get(id)?.subjectId === m.subjectId && questionMap.get(id)?.categoryId === m.categoryId), `${m.id}: 材料题组引用错误`);
  }
  for (const q of pack.questions) if (q.materialId) requireValue(pack.materials.some((m) => m.id === q.materialId && m.questionIds.includes(q.id)), `${q.id}: 材料缺失`);
  const byResource = new Map(resources.map((r) => [r.id, r]));
  requireValue(pack.entryPlans && Object.keys(pack.entryPlans).length === 3, '入口计划必须为三类练习');
  for (const kind of KINDS) {
    const list = pack.entryPlans[kind]?.resourceIds; requireValue(Array.isArray(list) && new Set(list).size === list.length, `${kind}: 入口清单无效`);
    requireValue(list.every((id) => byResource.get(id)?.exerciseKinds.includes(kind)), `${kind}: 入口资源不存在或方式不符`);
    for (const id of list) {
      const resource = byResource.get(id);
      requireValue(taskCompatible(resource), `${id}: 入口检测目的不符；基础只回忆知识，方法辨析或小试用，应用承接完整原题`);
      for (const atomId of resource.assessment.knowledgeAtomIds) {
        const atom = atoms.get(atomId);
        requireValue(atom && atom.subjectId === resource.subjectId && atom.categoryId === resource.categoryId
          && atom.refs.some((ref) => resource.refs.some((r) => sourceKey(r) === sourceKey(ref))), `${id}: 检测知识不存在或来源不一致`);
      }
      if (resource.assessment.comparisonGroupId) {
        const group = comparisons.get(resource.assessment.comparisonGroupId);
        requireValue(group && group.subjectId === resource.subjectId && group.categoryId === resource.categoryId
          && resource.assessment.knowledgeAtomIds.every((atomId) => group.knowledgeAtomIds.includes(atomId))
          && group.refs.some((ref) => resource.refs.some((r) => sourceKey(r) === sourceKey(ref))), `${id}: 检测对照关系缺失或来源不一致`);
      }
    }
    for (const m of pack.materials) {
      const selected = m.questionIds.filter((id) => list.includes(id));
      requireValue(!selected.length || selected.length === m.questionIds.length, `${kind}: 材料题组不可截断`);
    }
  }
  for (const key of ['targets', 'questions', 'recipes', 'sourceReviews', 'materials', 'knowledgeAtoms', 'comparisonGroups']) pack[key].sort((a, b) => a.id.localeCompare(b.id));
  applySemanticPolicy(pack, body, options);
  pack.version = `${source.version}-${sha(pack).slice(0, 12)}`;
  return pack;
}
module.exports = { SUBJECTS, sha, approvalDigest, loadBody, compile };
