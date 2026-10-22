const semantic = require('./learning-semantic');
// Body JSON remains the authority. Knowledge and comparison records only bind reviewed tasks to that source.
const KINDS = ['basic', 'method', 'application'];
function fingerprint(value) {
  const text = JSON.stringify(value); let n = 2166136261;
  for (let i = 0; i < text.length; i += 1) { n ^= text.charCodeAt(i); n = Math.imul(n, 16777619); }
  return (n >>> 0).toString(16);
}
function sourceKey(ref) { return JSON.stringify([ref.subjectId, ref.pointId, ref.tabId]); }
function findSource(body, ref) {
  const point = body.getNotePoint ? body.getNotePoint(ref.subjectId, ref.pointId)
    : body[ref.subjectId]?.points.find((p) => p.id === ref.pointId);
  return { point, tab: point?.tabs.find((t) => t.id === ref.tabId) };
}
function sourceValid(body, ref) {
  const { tab } = findSource(body, ref);
  return Boolean(tab && ref.fingerprint && fingerprint(tab) === ref.fingerprint);
}
function isDevelopment(api) {
  try { return api.getAccountInfoSync().miniProgram.envVersion === 'develop'; } catch (_) { return false; }
}
function taskCompatible(resource) {
  if (resource?.resourceType !== 'question' || resource.exerciseKinds?.length !== 1) return false;
  const assessment = resource.assessment;
  if (!assessment || !Array.isArray(assessment.knowledgeAtomIds)
    || new Set(assessment.knowledgeAtomIds).size !== assessment.knowledgeAtomIds.length) return false;
  const kind = resource.exerciseKinds[0];
  if (kind === 'basic') return assessment.taskType === 'recall' && assessment.requiresCalculation === false
    && assessment.knowledgeAtomIds.length === 1 && !assessment.comparisonGroupId
    && resource.answerMode === 'single-choice';
  if (kind === 'method') return ['contrast', 'bounded-trial'].includes(assessment.taskType)
    && assessment.requiresCalculation === false && assessment.knowledgeAtomIds.length > 0
    && Boolean(assessment.comparisonGroupId) && resource.answerMode === 'single-choice'
    && (assessment.taskType !== 'bounded-trial' || Boolean(assessment.decisionPoint));
  return kind === 'application' && assessment.taskType === 'complete-application'
    && Boolean(resource.origin && resource.originalExampleFingerprint && resource.originTask?.verified === true
      && resource.originTask.statement && resource.originTask.evidence)
    && resource.answerMode === 'single-choice';
}
function availableContent(body, pack, development = false, options = {}) {
  const legacyFixture = options.legacyFixture === true;
  let heads = new Map();
  try { heads = semantic.reviewHeads(pack.semanticReviews || []); } catch (_) { /* Conflicting proof cannot admit resources. */ }
  const semanticContext = semantic.createContext(pack,body);
  const policyValid = legacyFixture || semanticContext.policyValid;
  const allowed = (item) => item && (item.status === 'approved' && item.reviewVerified === true || development && item.status === 'review');
  const reviews = new Map((pack.sourceReviews || []).filter(allowed).map((r) => [sourceKey(r.ref), r]));
  const referencesValid = (item) => item.refs?.length > 0 && item.refs.every((ref) => {
    const review = reviews.get(sourceKey(ref));
    return !pack.blockedPointIds?.includes(`${ref.subjectId}:${ref.pointId}`) && sourceValid(body, ref)
      && review && review.ref.fingerprint === ref.fingerprint
      && (legacyFixture || semantic.sourceAllowed(item, ref, pack, body, development));
  });
  const targets = (pack.targets || []).filter((t) => allowed(t) && referencesValid(t));
  const targetIds = new Set(targets.map((t) => t.id));
  const strings = (value) => Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string' && item.trim());
  const sameSource = (a, b) => a.subjectId === b.subjectId && a.categoryId === b.categoryId
    && a.refs.some((ref) => b.refs.some((r) => sourceKey(r) === sourceKey(ref)));
  const knowledgeAtoms = (pack.knowledgeAtoms || []).filter((a) => allowed(a) && referencesValid(a)
    && a.statement && strings(a.conditions) && strings(a.misconceptions) && a.sourceAnchors?.length > 0
    && a.sourceAnchors.every((anchor) => {
      const { tab } = findSource(body, anchor);
      return a.refs.some((ref) => sourceKey(ref) === sourceKey(anchor)) && anchor.fingerprint
        && tab?.blocks?.[anchor.blockIndex] && fingerprint(tab.blocks[anchor.blockIndex]) === anchor.fingerprint;
    }));
  const atomsById = new Map(knowledgeAtoms.map((a) => [a.id, a]));
  const comparisonGroups = (pack.comparisonGroups || []).filter((g) => allowed(g) && referencesValid(g)
    && g.difference && strings(g.conditions) && strings(g.misconceptions)
    && g.knowledgeAtomIds?.length >= 2 && new Set(g.knowledgeAtomIds).size === g.knowledgeAtomIds.length
    && g.knowledgeAtomIds.every((id) => atomsById.has(id) && sameSource(atomsById.get(id), g)));
  const comparisonsById = new Map(comparisonGroups.map((g) => [g.id, g]));
  const selectedIds = new Set(KINDS.flatMap((kind) => pack.entryPlans?.[kind]?.resourceIds || []));
  const resources = (pack.questions || []).filter((r) => policyValid && selectedIds.has(r.id) && allowed(r) && referencesValid(r)
    && taskCompatible(r) && r.primaryTargetIds?.length
    && [...r.primaryTargetIds, ...(r.supportingTargetIds || [])].every((id) => targetIds.has(id))
    && r.assessment.knowledgeAtomIds.every((id) => atomsById.has(id) && sameSource(atomsById.get(id), r))
    && (!r.assessment.comparisonGroupId || comparisonsById.has(r.assessment.comparisonGroupId)
      && sameSource(comparisonsById.get(r.assessment.comparisonGroupId), r)
      && r.assessment.knowledgeAtomIds.every((id) => comparisonsById.get(r.assessment.comparisonGroupId).knowledgeAtomIds.includes(id)))
    && (legacyFixture || semantic.semanticAdmission(r, pack, body, heads, semanticContext))
    && (!r.origin || r.refs.some((ref) => sourceKey(ref) === sourceKey(r.origin))
      && (findSource(body, r.origin).tab?.blocks || []).filter((block) => block.type === 'example'
        && fingerprint(block) === r.originalExampleFingerprint).length === 1)).map((r) => {
    const atoms = r.assessment.knowledgeAtomIds.map((id) => atomsById.get(id));
    const group = comparisonsById.get(r.assessment.comparisonGroupId);
    const comparison = group ? { ...group, knowledge: group.knowledgeAtomIds.map((id) => {
      const atom = atomsById.get(id); return { id, label: atom.label || atom.title || atom.id, statement: atom.statement };
    }) } : null;
    const admission = legacyFixture ? null : semantic.semanticAdmission(r, pack, body, heads, semanticContext);
    const resolvedTargets = [...r.primaryTargetIds, ...(r.supportingTargetIds || [])].map(id => targets.find(t => t.id === id));
    const resource = { ...r, knowledgeAtoms: atoms, ...(comparison ? { comparison } : {}),
      ...(admission ? { semanticAdmission: admission, resolvedTargets } : {}),
      assessmentFingerprint: fingerprint({ assessment: r.assessment, knowledgeAtoms: atoms,
        comparison: group ? { ...comparison, knowledgeAtoms: group.knowledgeAtomIds.map((id) => atomsById.get(id)) } : null }) };
    if (admission) resource.semanticRuntimeSignature = semantic.runtimeSignature(resource);
    return resource;
  });
  const materials = (pack.materials || []).filter((m) => allowed(m) && referencesValid(m)
    && m.questionIds.every((id) => resources.some((r) => r.id === id && r.materialId === m.id)));
  const materialIds = new Set(materials.map((m) => m.id));
  return { schemaVersion: 1, version: pack.version, targets, knowledgeAtoms, comparisonGroups, materials,
    resources: resources.filter((r) => !r.materialId || materialIds.has(r.materialId)), entryPlans: pack.entryPlans || {}, development };
}
function inScope(resource, scope = {}) {
  const mode=scope.scopeMode||(scope.pointId?'exact-source-point':'primary-module-topic');
  if(!['exact-source-point','primary-module-topic'].includes(mode))return false;
  const sourceMatches=()=>resource.refs.some(ref=>ref.pointId===scope.pointId
    && (!scope.sourceSubjectId&&!scope.subjectId||ref.subjectId===(scope.sourceSubjectId||scope.subjectId))
    && (!scope.sourceTabId||ref.tabId===scope.sourceTabId));
  if(mode==='exact-source-point')return Boolean(scope.pointId&&sourceMatches());
  return (!scope.subjectId||scope.subjectId==='all'||resource.subjectId===scope.subjectId)
    && (!scope.categoryId||scope.categoryId==='all'||resource.categoryId===scope.categoryId)
    && (!scope.pointId||sourceMatches());
}
function entryResources(content, kind, scope = {}) {
  if (!KINDS.includes(kind)) return [];
  const ids = content.entryPlans[kind]?.resourceIds;
  if (!Array.isArray(ids)) return [];
  const byId = new Map(content.resources.map((r) => [r.id, r]));
  return [...new Set(ids)].map((id) => byId.get(id)).filter((r) => r && taskCompatible(r) && r.exerciseKinds.includes(kind) && inScope(r, scope));
}
module.exports = { KINDS, fingerprint, sourceKey, findSource, sourceValid, isDevelopment, taskCompatible, availableContent, entryResources, inScope };
