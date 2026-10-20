const curriculum = require('../../models/politics-systematic-units-runtime');
const { projectTextRuns } = require('./reading-text');
const { getRolloutStage } = require('./rollout');
const KIND = 'systematic-units-v2';
const isUnitPlan = plan => plan?.type === 'systematic' && plan.experienceKind === KIND;
const lessonFor = id => curriculum.lessons.find(lesson => lesson.id === id);
const isPilotAvailable = pkg => getRolloutStage('politics') === 'candidate' && curriculum.candidateOnly
  && curriculum.reviewState === 'draft' && curriculum.knowledgePackageVersion === pkg.packageVersion;

function planFor(pkg, options = {}) {
  if (options.type !== 'systematic' || options.experienceKind !== KIND || !isPilotAvailable(pkg)
      || curriculum.knowledgePackageVersion !== pkg.packageVersion
      || (options.curriculumVersion && options.curriculumVersion !== curriculum.curriculumVersion)) return null;
  const group = curriculum.groups.find(group => group.id === options.groupId);
  if (!group) return null;
  const lessons = group.lessonIds.map(lessonFor);
  if (lessons.some(lesson => !lesson)) return null;
  const firstPointId = lessons[0].parts[0].sourceBlockIds[0].split(':')[1];
  const first = pkg.knowledgeUnits.find(unit => unit.id === firstPointId);
  if (!first) return null;
  return {
    id: `route:politics:systematic:${group.id}:${curriculum.curriculumVersion}`,
    definitionId: KIND, experienceKind: KIND, curriculumId: curriculum.id, curriculumVersion: curriculum.curriculumVersion,
    moduleId: 'politics', type: 'systematic', label: '系统学习', packageVersion: pkg.packageVersion,
    groupId: group.id, scopeId: first.navigationNodeId, scopeTitle: group.title, scopePathText: group.title,
    recommendationReason: '一次理解一个小目标，按本组内容顺序继续', capabilityLevel: 'candidate', stageGroups: [],
    steps: lessons.map(lesson => ({ stepId: `systematic-unit:${lesson.id}`, lessonId: lesson.id, title: lesson.title,
      pointId: lesson.parts[0].sourceBlockIds[0].split(':')[1], stage: 'reading', required: true })),
    options: { type: 'systematic', experienceKind: KIND, groupId: group.id, curriculumVersion: curriculum.curriculumVersion },
  };
}

function normalize(plan, raw, create) {
  if (!raw) return create(plan);
  const expired = reason => ({ ...raw, status: 'expired', expiredReason: reason });
  if (raw.planId !== plan.id || raw.packageVersion !== plan.packageVersion || raw.curriculumVersion !== plan.curriculumVersion) return expired('content-updated');
  if (!Number.isInteger(raw.currentIndex) || !plan.steps[raw.currentIndex]) return expired('saved-position-unavailable');
  const allowed = new Set(plan.steps.map(step => step.stepId));
  if (!Array.isArray(raw.completedStepIds) || !Array.isArray(raw.skippedStepIds)
      || [...raw.completedStepIds, ...raw.skippedStepIds].some(id => !allowed.has(id))
      || raw.completedStepIds.some(id => raw.skippedStepIds.includes(id))) return expired('invalid-progress');
  const session = JSON.parse(JSON.stringify(raw));
  session.currentStepId = plan.steps[session.currentIndex].stepId;
  session.unitAnchors ||= {};
  session.unitReferences ||= {};
  if (session.status === 'completed' && !plan.steps.every(step => session.completedStepIds.includes(step.stepId) || session.skippedStepIds.includes(step.stepId))) return expired('invalid-progress');
  return session;
}

function apply(plan, session, event) {
  if (session.status === 'expired') return session;
  const step = plan.steps[session.currentIndex];
  // A bound expected step prevents delayed/double actions from advancing another unit.
  if (!step || event.stepId !== step.stepId || event.curriculumVersion !== plan.curriculumVersion) return session;
  const next = { ...session, updatedAt: event.at ?? session.updatedAt };
  if (event.type === 'COMPLETE_SYSTEMATIC_REVISIT') {
    if (!plan.steps.some(step => step.stepId === event.targetStepId) || !session.skippedStepIds.includes(event.targetStepId)) return session;
    return { ...next, skippedStepIds: session.skippedStepIds.filter(id => id !== event.targetStepId),
      completedStepIds: [...session.completedStepIds, event.targetStepId] };
  }
  const handled = session.completedStepIds.includes(step.stepId) || session.skippedStepIds.includes(step.stepId);
  if (event.type === 'COMPLETE_SYSTEMATIC_UNIT' || event.type === 'SKIP_SYSTEMATIC_UNIT') {
    if (handled || session.status !== 'active') return session;
    const key = event.type === 'COMPLETE_SYSTEMATIC_UNIT' ? 'completedStepIds' : 'skippedStepIds';
    next[key] = [...session[key], step.stepId];
    if (session.currentIndex === plan.steps.length - 1) next.status = 'completed';
    return next;
  }
  if (event.type === 'CONTINUE_SYSTEMATIC_UNIT') {
    if (!handled || session.status !== 'active' || !plan.steps[session.currentIndex + 1]) return session;
    next.currentIndex = session.currentIndex + 1;
    next.currentStepId = plan.steps[next.currentIndex].stepId;
    return next;
  }
  if (event.type === 'SAVE_UNIT_ANCHOR') {
    const lesson = lessonFor(step.lessonId);
    if (event.anchor && !lesson.parts.some(part => part.id === event.anchor.partId)) return session;
    const anchor = event.anchor ? { partId: event.anchor.partId, offset: Math.max(0, Math.min(1000, Number(event.anchor.offset) || 0)) } : null;
    return { ...next, unitAnchors: { ...session.unitAnchors, [step.lessonId]: anchor } };
  }
  if (event.type === 'TOGGLE_UNIT_REFERENCE') return { ...next, unitReferences: { ...session.unitReferences, [step.lessonId]: !session.unitReferences[step.lessonId] } };
  return session;
}

function project(pkg, plan, session) {
  const step = plan.steps[session.currentIndex];
  if (!step || session.status === 'expired') return null;
  const lesson = lessonFor(step.lessonId);
  const done = session.completedStepIds.includes(step.stepId), skipped = session.skippedStepIds.includes(step.stepId);
  const next = plan.steps[session.currentIndex + 1];
  const sources = [...new Set(lesson.parts.flatMap(part => part.sourceBlockIds))].map(id => ({ id, pointId: id.split(':')[1] }));
  const units = [...new Set(sources.map(source => source.pointId))].map(id => ({ id, title: pkg.knowledgeUnits.find(unit => unit.id === id)?.title || '', blockId: sources.find(source => source.pointId === id).id }));
  return {
    id: lesson.id, title: lesson.title, question: lesson.question, objectives: lesson.objectives,
    scopeLimit: lesson.scopeLimit, groupTitle: plan.scopeTitle, position: session.currentIndex + 1, total: plan.steps.length,
    stepId: step.stepId, curriculumVersion: plan.curriculumVersion,
    closeout: done || skipped, done, skipped, ended: session.status === 'completed',
    remaining: plan.steps.filter(step => !session.completedStepIds.includes(step.stepId)).length,
    nextTitle: next?.title || '',
    parts: lesson.parts.map(part => ({ ...part, runs: projectTextRuns({ text: part.text }, part.text, { emphasis: part.emphasis || [] }, 'text') })),
    reflection: lesson.reflection, referenceVisible: Boolean(session.unitReferences?.[lesson.id]), sources: units,
    anchor: session.unitAnchors?.[lesson.id] || null,
  };
}

function resumeAction(plan, session) {
  const step = plan.steps[session.currentIndex];
  const hasEnded = session.completedStepIds.includes(step?.stepId) || session.skippedStepIds.includes(step?.stepId);
  const next = hasEnded ? plan.steps[session.currentIndex + 1] : null;
  return { title: next?.title || step?.title, label: next ? '接着了解' : hasEnded ? '回看本组' : '继续学习',
    url: `/subpackages/politics/route/units?${next ? `continueFrom=${encodeURIComponent(step.lessonId)}` : 'resume=1'}` };
}

module.exports = { KIND, curriculum, isPilotAvailable, isUnitPlan, planFor, normalize, apply, project, resumeAction };
