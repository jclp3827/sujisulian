const semantic = require('./learning-semantic');
const sourceCompatibility = require('../models/learning-source-compatibility');
const { KINDS, fingerprint, entryResources, sourceKey } = require('./learning-content');
const STORAGE_KEY = 'notesPractice:v1:state';
const clone = (value) => JSON.parse(JSON.stringify(value));
function failure(code, message) { const error = new Error(message); error.code = code; return error; }
function emptyState() { return { schemaVersion: 1, sessions: {}, active: {}, preferences: {}, exposures: {}, returnTokens: {}, attempts: {} }; }
function createEngine(content, storage, clock = () => Date.now(), makeId = () => `${clock().toString(36)}-${Math.random().toString(36).slice(2, 11)}`) {
  let state;
  try { state = storage.getStorageSync(STORAGE_KEY) || emptyState(); }
  catch (_) { throw failure('STORAGE', '暂时无法读取练习记录，请重试'); }
  if (state.schemaVersion !== 1 || ['sessions', 'active', 'preferences', 'exposures', 'returnTokens', 'attempts'].some((key) => !state[key] || typeof state[key] !== 'object' || Array.isArray(state[key])))
    throw failure('CORRUPT', '本地练习记录无法识别，请先重建笔记练习记录');
  state = clone(state);
  const resources = new Map(content.resources.map((r) => [r.id, r]));
  function resourceMatches(item, resource) {
    if (!resource) return false;
    if (resource.semanticAdmission) {
      const currentSignature=semantic.runtimeSignature(resource),prior=sourceCompatibility.entries?.[resource.id];
      const equivalent=sourceCompatibility.schemaVersion===1&&sourceCompatibility.migrationId==='NOTE-G0-SOURCE-01'&&prior?.currentRuntimeSignature===currentSignature;
      if (item.semanticSignatureVersion === semantic.SIGNATURE_VERSION)
        return item.semanticRuntimeSignature === currentSignature
          || !!(equivalent&&item.semanticRuntimeSignature===prior.previousRuntimeSignature);
      return (resource.legacyCompatibility?.currentSemanticSignature === resource.semanticAdmission.signature
        && item.resourceSignature === resource.legacyCompatibility.resourceSignature)
        || !!(equivalent&&prior.legacyResourceSignature&&item.resourceSignature===prior.legacyResourceSignature);
    }
    if (item.resourceSignature === fingerprint(resource)) return true;
    // Existing original applications keep their frozen result when only policy metadata was added.
    if (item.assessment || !item.origin || resource.assessment?.taskType !== 'complete-application') return false;
    const legacy = { ...resource };
    for (const key of ['assessment', 'knowledgeAtoms', 'comparison', 'assessmentFingerprint', 'originTask']) delete legacy[key];
    return item.resourceSignature === fingerprint(legacy);
  }
  function latest() {
    let value;
    try { value = storage.getStorageSync(STORAGE_KEY) || emptyState(); } catch (_) { throw failure('STORAGE', '暂时无法读取练习记录，请重试'); }
    if (value.schemaVersion !== 1 || ['sessions', 'active', 'preferences', 'exposures', 'returnTokens', 'attempts'].some((k) => !value[k] || typeof value[k] !== 'object' || Array.isArray(value[k])))
      throw failure('CORRUPT', '本地练习记录无法识别，请先重建笔记练习记录');
    return clone(value);
  }
  function transact(fn) {
    const next = latest(); const result = fn(next);
    try { storage.setStorageSync(STORAGE_KEY, next); }
    catch (_) { throw failure('STORAGE', '本次记录暂未保存，请重试'); }
    state = next; return clone(result === undefined ? null : result);
  }
  function valid(s) {
    try {
      const enrolled = new Set(entryResources(content, s.kind, s.scope).map((r) => r.id));
      return s.answers && typeof s.answers === 'object' && !Array.isArray(s.answers) && KINDS.includes(s.kind) && Array.isArray(s.items) && s.items.length > 0 && Number.isInteger(s.index) && s.index >= 0 && s.index <= s.items.length
        && s.items.every((item) => enrolled.has(item.resourceId) && resourceMatches(item, resources.get(item.resourceId)) && item.instanceId && item.refs?.length && (!item.materialId || item.materialSignature === fingerprint(content.materials.find((m) => m.id === item.materialId))));
    } catch (_) { return false; }
  }
  function requireSession(next, id, unfinished = true) {
    const s = next.sessions[id];
    if (!s || !valid(s)) throw failure('EXPIRED', '这组练习的内容已更新，请重新开始');
    if (unfinished && s.index >= s.items.length) throw failure('COMPLETE', '这组练习已完成');
    return s;
  }
  function getSession(id) { state = latest(); const s = state.sessions[id]; return s && valid(s) ? clone(s) : null; }
  function resume(kind, scope) {
    state = latest();
    const s = state.sessions[state.active[kind]];
    return s && valid(s) && s.index < s.items.length && (!scope || fingerprint(s.scope) === fingerprint(scope)) ? clone(s) : null;
  }
  function start(options = {}) {
    state = latest();
    const kind = options.kind;
    if (!KINDS.includes(kind)) throw failure('KIND', '练习方式不存在');
    const preference = state.preferences[kind] || {};
    const scope = clone(options.scope || preference.scope || { subjectId: 'all', categoryId: 'all', pointId: '' });
    const count = options.count || preference.count || 5;
    if (![5, 10, 15].includes(count)) throw failure('COUNT', '请选择5、10或15道');
    const active = state.sessions[state.active[kind]];
    if (!options.fresh && active && !valid(active) && (!options.scope || fingerprint(active.scope) === fingerprint(options.scope)))
      return { session: null, expired: true, reason: '原题组内容已变更，请重新开始' };
    const previous = !options.fresh && resume(kind, options.scope);
    if (previous) return { session: previous, resumed: true };
    const eligible = entryResources(content, kind, scope);
    if (!eligible.length) return { session: null, empty: true, reason: '当前范围暂没有可用练习，可以先查阅全部笔记' };
    const id = `notes-session-${makeId()}`;
    if (state.sessions[id]) throw failure('IDENTITY', '练习身份冲突，请重试');
    const items = [], seen = new Set(), families = new Set(), handledMaterials = new Set();
    const ordered = eligible.slice().sort((a, b) => (state.attempts[a.id]?.presentedGroups || 0) - (state.attempts[b.id]?.presentedGroups || 0) || (state.attempts[a.id]?.lastAt || 0) - (state.attempts[b.id]?.lastAt || 0));
    function append(resource) {
      const snapshot = resource;
      const signature = fingerprint({ prompt: snapshot.prompt, options: snapshot.options || [], contextLines: snapshot.contextLines || [], images: snapshot.images || [], materialId: resource.materialId || null, materialQuestionId: resource.materialId ? resource.id : null });
      if (seen.has(signature)) return;
      seen.add(signature);
      const instanceId = `${id}:item:${items.length + 1}`;
      items.push({ ...clone(snapshot), ...(resource.semanticAdmission ? { semanticSignatureVersion: semantic.SIGNATURE_VERSION, semanticRuntimeSignature: semantic.runtimeSignature(resource) } : {}), instanceId, resourceId: resource.id, revision: resource.revision,
        resourceSignature: fingerprint(resource), subjectId: resource.subjectId, categoryId: resource.categoryId, refs: clone(resource.refs),
        exerciseKinds: resource.exerciseKinds, sourceKind: resource.sourceKind || 'generated',
        exposureGroupId: resource.exposureGroupId,
        familyId: resource.familyId,
        answerSourceKeys: resource.answerSourceKeys || [], materialId: resource.materialId || null,
        materialSignature: resource.materialId ? fingerprint(content.materials.find((m) => m.id === resource.materialId)) : null,
        material: resource.materialId ? clone(content.materials.find((m) => m.id === resource.materialId)) : null });
    }
    // An oversized material must remain reachable even if smaller resources precede it.
    let oversized = content.materials.find((m) => m.questionIds.length > count && m.questionIds.every((id) => eligible.some((q) => q.id === id)));
    if (oversized && (state.attempts[oversized.questionIds[0]]?.presentedGroups || 0) > Math.min(...eligible.map((r) => state.attempts[r.id]?.presentedGroups || 0))) oversized = null;
    if (oversized && !options.allowOversize) return { session: null, oversized: oversized.questionIds.length, scope, count };
    if (oversized) {
      oversized.questionIds.forEach((id) => append(eligible.find((q) => q.id === id)));
      handledMaterials.add(oversized.id);
    }
    for (const r of ordered) {
      if (items.length >= count) break;
      if (r.resourceType !== 'question') continue;
      if (r.materialId) {
        if (handledMaterials.has(r.materialId)) continue;
        handledMaterials.add(r.materialId);
        const material = content.materials.find((m) => m.id === r.materialId);
        const group = material.questionIds.map((qid) => eligible.find((q) => q.id === qid));
        if (group.some((q) => !q)) continue;
        if (group.length > count && !items.length && !options.allowOversize) return { session: null, oversized: group.length, scope, count };
        if (items.length && items.length + group.length > count) continue;
        group.forEach((q) => append(q)); continue;
      }
      if (families.has(r.familyId)) continue;
      families.add(r.familyId); append(r);
    }
    if (!items.length) return { session: null, empty: true, reason: '当前范围暂没有完整可用的题组' };
    return transact((next) => {
      const s = { id, kind, scope, requestedCount: count, items, index: 0, answers: {}, createdAt: clock(), updatedAt: clock() };
      [...new Set(items.map((item) => item.resourceId))].forEach((resourceId) => {
        const previous = next.attempts[resourceId] || {};
        next.attempts[resourceId] = { ...previous, presentedGroups: (previous.presentedGroups || 0) + 1 };
      });
      next.sessions[id] = s; next.active[kind] = id; return { session: s, resumed: false };
    });
  }
  function answerRecord(s) { const item = s.items[s.index]; return s.answers[item.instanceId] ||= { value: '', position: 0 }; }
  function selection(id, value) { return transact((next) => { const s = requireSession(next, id); const a = answerRecord(s);
    if (!a.outcome) a.value = String(value); s.updatedAt = clock(); return s; }); }
  function submit(id) { return transact((next) => {
    const s = requireSession(next, id), item = s.items[s.index], a = answerRecord(s);
    if (a.outcome) return s;
    if ((item.images?.length || item.material?.images?.length) && !a.imagesReady) throw failure('IMAGE', '图片尚未完整加载，请重试图片后再作答');
    if (!String(a.value).trim()) throw failure('ANSWER', '请先作答');
    const correct = item.answerMode === 'single-choice' && String(item.answer) === String(a.value);
    a.answerExposed = !!(a.answerExposed || next.exposures[item.exposureGroupId]);
    a.outcome = correct ? a.consultedBeforeSubmit || a.answerExposed ? 'assisted' : 'correct' : 'wrong';
    a.correct = correct; a.submittedAt = clock();
    next.attempts[item.resourceId] = { ...next.attempts[item.resourceId], count: (next.attempts[item.resourceId]?.count || 0) + 1, lastAt: clock(), revision: item.revision };
    s.updatedAt = clock(); return s;
  }); }
  function setImageReady(id, instanceId, ready) { return transact((next) => {
    const s = requireSession(next, id); if (s.items[s.index].instanceId !== instanceId) return s;
    answerRecord(s).imagesReady = ready === true; return s;
  }); }
  function mark(id, outcome) { return transact((next) => { const s = requireSession(next, id), a = answerRecord(s), item = s.items[s.index];
    if (!a.outcome) { a.outcome = outcome; if (outcome === 'revealed') { a.answerExposed = true; next.exposures[item.exposureGroupId] = { at: clock(), via: 'reveal' }; } }
    s.updatedAt = clock(); return s; }); }
  function advance(id) { return transact((next) => { const s = requireSession(next, id);
    if (!answerRecord(s).outcome) throw failure('ANSWER', '请先提交、揭晓或跳过');
    s.index += 1; s.updatedAt = clock(); return s; }); }
  function savePosition(id, position) { return transact((next) => { const s = requireSession(next, id); answerRecord(s).position = Math.max(0, Number(position) || 0); return s; }); }
  function openSource(id, refIndex = 0, position = 0) { return transact((next) => {
    const s = requireSession(next, id), item = s.items[s.index], a = answerRecord(s), ref = item.refs[refIndex];
    if (!ref) throw failure('SOURCE', '笔记来源不存在');
    if (!a.outcome) a.consultedBeforeSubmit = true;
    a.position = Math.max(0, Number(position) || 0);
    const token = `notes-return-${makeId()}`;
    next.returnTokens[token] = { sessionId: id, instanceId: item.instanceId, expiresAt: clock() + 48 * 60 * 60 * 1000 };
    return { token, ref };
  }); }
  function openComparison(id) { return transact((next) => {
    const s = requireSession(next, id), item = s.items[s.index], a = answerRecord(s);
    if (!item.comparison) throw failure('COMPARISON', '这道题暂没有独立的辨析对照，可查阅对应笔记');
    if (!a.outcome) a.consultedBeforeSubmit = true;
    a.comparisonRead = true; s.updatedAt = clock(); return s;
  }); }
  function returnTarget(token) {
    state = latest();
    const context = state.returnTokens[token]; if (!context || context.expiresAt < clock()) return null;
    const s = getSession(context.sessionId);
    return s && s.items[s.index]?.instanceId === context.instanceId ? { sessionId: s.id, kind: s.kind } : null;
  }
  function noteViewed(token, ref) { if (!returnTarget(token)) return false; return transact((next) => {
    const context = next.returnTokens[token], s = requireSession(next, context.sessionId), a = answerRecord(s);
    const groups = content.resources.filter((r) => r.answerSourceKeys?.includes(sourceKey(ref))).map((r) => r.exposureGroupId);
    groups.forEach((id) => { next.exposures[id] = { at: clock(), via: 'note' }; });
    if (!a.outcome && groups.includes(s.items[s.index].exposureGroupId)) a.answerExposed = true;
    return true;
  }); }
  function recordExposures(groups) { return transact((next) => {
    groups.forEach((id) => { next.exposures[id] = { at: clock(), via: 'example-reveal' }; }); return true;
  }); }
  function result(id) { const s = getSession(id); if (!s) return null;
    const counts = { correct: 0, assisted: 0, wrong: 0, revealed: 0, skipped: 0 };
    Object.values(s.answers).forEach((a) => { if (a.outcome in counts) counts[a.outcome] += 1; });
    return { ...counts, total: s.items.length, completed: s.index === s.items.length };
  }
  function setPreferences(kind, scope, count) {
    if (!KINDS.includes(kind) || ![5, 10, 15].includes(count)) throw failure('SETTINGS', '练习设置无效');
    return transact((next) => { next.preferences[kind] = { scope: clone(scope), count }; return next.preferences[kind]; });
  }
  return { start, resume, getSession, selection, submit, reveal: (id) => mark(id, 'revealed'), skip: (id) => mark(id, 'skipped'),
    advance, savePosition, setImageReady, openSource, openComparison, noteViewed, returnTarget, recordExposures, result, setPreferences, preferences: (kind) => clone(state.preferences[kind] || {}) };
}
module.exports = { STORAGE_KEY, createEngine };
