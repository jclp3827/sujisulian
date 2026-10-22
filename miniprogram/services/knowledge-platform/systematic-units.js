const curriculum = require('../../models/politics-systematic-units-runtime');
const { projectTextRuns } = require('./reading-text');
const { getRolloutStage } = require('./rollout');
const KIND = 'systematic-units-v2';
const LESSON_DISPLAY_TITLES = Object.freeze({
  'FOUND-01': '坚持和发展中国特色社会主义',
  'FOUND-02': '新时代判断与基本国情',
  'FOUND-03': '马克思主义基本原理的“两个结合”',
  'TEN-01': '领导力量、总任务与社会主要矛盾',
  'TEN-02': '总体布局、改革与法治',
  'TEN-03': '经济制度、发展理念与发展格局',
  'TEN-04': '强军、外交与党的建设',
  'SYS-01': '新时代思想的科学体系',
  'SYS-02': '十四个坚持：前七项',
  'SYS-03': '十四个坚持：后七项',
  'SYS-04': '六个必须坚持：立场、自立与创新',
  'SYS-05': '六个必须坚持：问题、系统与天下',
  'MOD-01': '中国式现代化的目标与阶段',
  'MOD-02': '中国式现代化的五个中国特色',
  'MOD-03': '本质要求与重大原则',
  'LEADERSHIP-01': '党的领导与领导制度',
  'LEADERSHIP-02': '人民立场与群众路线',
  'LEADERSHIP-03': '共同富裕、发展与分配',
  'DEV-01': '新发展阶段与高质量发展',
  'DEV-02': '新发展理念',
  'DEV-03': '新发展格局',
  'DEV-04': '基本经济制度',
  'DEV-05': '政府与市场',
  'DEV-06': '乡村振兴的目标与要求',
  'DEV-07': '区域战略与新型城镇化',
  'LIVELIHOOD-01': '就业与收入分配',
  'LIVELIHOOD-02': '社会保障与健康建设',
  'SUPPORT-01': '教育的基础性支撑',
  'SUPPORT-02': '科技创新、研究与人才',
  'DEMOCRACY-01': '人民当家作主的制度体系',
  'DEMOCRACY-02': '全过程人民民主',
  'DEMOCRACY-03': '统一战线中的一致性与多样性',
  'REFORMLAW-01': '改革、发展与稳定',
  'REFORMLAW-02': '法治道路与法治体系',
  'REFORMLAW-03': '依法治国、依法执政与依法行政',
  'CULTUREECO-01': '文化传承与创新',
  'CULTUREECO-02': '文化强国与人民立场',
  'CULTUREECO-03': '生态保护与发展方式',
  'CULTUREECO-04': '生态目标与保护体系',
  'PARTY-01': '党的建设总要求',
  'PARTY-02': '组织、作风与纪律建设',
  'PARTY-03': '反腐败与自我革命',
  'SECURITY-01': '总体国家安全观',
  'SECURITY-02': '风险防范与公共安全',
  'SECURITY-03': '强军目标、原则与阶段',
  'UNITYFOREIGN-01': '“一国”与“两制”',
  'UNITYFOREIGN-02': '推进祖国统一的方略',
  'UNITYFOREIGN-03': '外交关系与人类命运共同体',
  'BASICS-01': '马克思主义的组成与理论来源',
  'BASICS-02': '哲学基本问题的两组分歧',
  'BASICS-03': '物质、运动与静止',
  'BASICS-04': '物质决定意识与意识的能动作用',
  'DIALECTICS-01': '普遍联系与具体联系',
  'DIALECTICS-02': '矛盾的对立与统一',
  'DIALECTICS-03': '主要矛盾与矛盾主要方面',
  'DIALECTICS-04': '内因与外因',
  'DIALECTICS-05': '量变、度与质变',
  'DIALECTICS-06': '辩证否定与扬弃',
  'COGNITION-01': '实践与认识',
  'COGNITION-02': '认识的两次飞跃',
  'COGNITION-03': '真理的客观性、绝对性与相对性',
  'HISTORY-01': '社会存在与社会意识',
  'HISTORY-02': '生产力与生产关系',
  'HISTORY-03': '经济基础与上层建筑',
  'HISTORY-04': '人民群众与历史人物',
  'VALUE-01': '商品的使用价值与价值',
  'VALUE-02': '具体劳动与抽象劳动',
  'VALUE-03': '社会必要劳动时间与商品价值量',
  'MONEY-01': '货币的本质与基本职能',
  'MONEY-02': '贮藏、支付与世界货币',
  'CAPITAL-01': '绝对剩余价值与相对剩余价值',
  'CAPITAL-02': '不变资本、可变资本与资本构成',
});
const CURATED_LEARNING_LINKS = Object.freeze({
  'FOUND-01': {
    position: '这一篇先从贯穿全部内容的主题开始，后面的具体观点都要放回这个主题理解。',
    reason: '先抓住总主题，下一节才能判断这个主题进入了怎样的时代条件。',
  },
  'FOUND-02': {
    position: '上一节明确了贯穿的主题和四个自信；这一节说明这一主题面对怎样的时代条件。',
    reason: '看清新时代的变化与不变，下一节再理解理论怎样扎根中国具体实际与中华优秀传统文化。',
  },
  'FOUND-03': {
    position: '上一节说明了新时代的变化与边界；这一节继续看理论怎样同中国实际和中华优秀传统文化结合。',
    nextTitle: '十个明确',
    reason: '总主题、时代条件和理论怎样扎根已经连起来；下一主题进入这一思想的主体内容。',
  },
  'TEN-01': {
    position: '前一主题已经明确总主题、时代条件和两个结合；现在进入这一思想的主体内容“十个明确”。',
    reason: '前三条先回答谁领导、向哪里去、面对什么主要矛盾；下一节再看事业怎样布局，以及改革和法治分别达到什么目标。',
  },
  'TEN-02': {
    position: '前三条先说明领导力量、总任务和社会主要矛盾；这一节接着看事业布局及改革、法治的两个总目标。',
    reason: '布局、改革和法治讲清后，下一节单独拆开内容较多的第七条，看经济发展怎样展开。',
  },
  'TEN-03': {
    position: '前六条搭起领导、任务、矛盾、布局、改革和法治的基本结构；这一节单独看内容较多的第七条。',
    reason: '第七条补上经济发展的内部结构；下一节用强军、外交和党的建设收束并回看十条。',
  },
  'TEN-04': {
    position: '前七条已经说明从领导力量到经济发展的主要内容；最后三条补上强军、外交和党的建设，并整体回看十条。',
    nextTitle: '十四个坚持',
    reason: '十条已经形成整体轮廓；下一主题转向“十四个坚持”，理解落实这一思想的基本方略。',
  },
});
const EXPLANATION_REVIEWED_IDS = Object.freeze(curriculum.lessons.map(lesson => lesson.id));
const isUnitPlan = plan => plan?.type === 'systematic' && plan.experienceKind === KIND;
const lessonFor = id => curriculum.lessons.find(lesson => lesson.id === id);
const displayTitleForLesson = lesson => LESSON_DISPLAY_TITLES[lesson?.id] || lesson?.title || '';
const displayTitleForLessonId = id => displayTitleForLesson(lessonFor(id));
const isCompatibleCurriculumVersion = version => version === curriculum.curriculumVersion
  || (curriculum.progressCompatibleVersions || []).includes(version);
const isCompatiblePackageVersion = version => version === curriculum.knowledgePackageVersion
  || (curriculum.compatibleKnowledgePackageVersions || []).includes(version);
const planIdFor = (groupId, version) => `route:politics:systematic:${groupId}:${version}`;
const isPilotAvailable = pkg => getRolloutStage('politics') === 'candidate' && curriculum.candidateOnly
  && curriculum.reviewState === 'draft' && curriculum.knowledgePackageVersion === pkg.packageVersion;

function planFor(pkg, options = {}) {
  if (options.type !== 'systematic' || options.experienceKind !== KIND || !isPilotAvailable(pkg)
      || curriculum.knowledgePackageVersion !== pkg.packageVersion
      || (options.curriculumVersion && !isCompatibleCurriculumVersion(options.curriculumVersion))) return null;
  const group = curriculum.groups.find(group => group.id === options.groupId);
  if (!group) return null;
  const lessons = group.lessonIds.map(lessonFor);
  if (lessons.some(lesson => !lesson)) return null;
  const firstPointId = lessons[0].primaryUnitIds?.[0] || lessons[0].parts[0].sourceBlockIds[0].split(':')[1];
  const first = pkg.knowledgeUnits.find(unit => unit.id === firstPointId);
  if (!first) return null;
  return {
    id: planIdFor(group.id, curriculum.curriculumVersion),
    definitionId: KIND, experienceKind: KIND, curriculumId: curriculum.id, curriculumVersion: curriculum.curriculumVersion,
    moduleId: 'politics', type: 'systematic', label: '系统学习', packageVersion: pkg.packageVersion,
    groupId: group.id, scopeId: first.navigationNodeId, scopeTitle: group.title, scopePathText: group.title,
    recommendationReason: '一次理解一个小目标，按主题内顺序继续', capabilityLevel: 'candidate', stageGroups: [],
    steps: lessons.map(lesson => ({ stepId: `systematic-unit:${lesson.id}`, lessonId: lesson.id, title: displayTitleForLesson(lesson),
      pointId: lesson.primaryUnitIds?.[0] || lesson.parts[0].sourceBlockIds[0].split(':')[1], stage: 'reading', required: true })),
    options: { type: 'systematic', experienceKind: KIND, groupId: group.id, curriculumVersion: curriculum.curriculumVersion },
  };
}

function normalize(plan, raw, create) {
  if (!raw) return create(plan);
  const expired = reason => ({ ...raw, status: 'expired', expiredReason: reason });
  if (!isCompatiblePackageVersion(raw.packageVersion) || !isCompatibleCurriculumVersion(raw.curriculumVersion)
      || raw.planId !== planIdFor(plan.groupId, raw.curriculumVersion)) return expired('content-updated');
  if (!Number.isInteger(raw.currentIndex) || !plan.steps[raw.currentIndex]) return expired('saved-position-unavailable');
  const allowed = new Set(plan.steps.map(step => step.stepId));
  if (!Array.isArray(raw.completedStepIds) || !Array.isArray(raw.skippedStepIds)
      || [...raw.completedStepIds, ...raw.skippedStepIds].some(id => !allowed.has(id))
      || raw.completedStepIds.some(id => raw.skippedStepIds.includes(id))) return expired('invalid-progress');
  const session = JSON.parse(JSON.stringify(raw));
  session.planId = plan.id;
  session.curriculumVersion = plan.curriculumVersion;
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

function explanationLinkFor(lesson) {
  const group = curriculum.groups.find(item => item.id === lesson.groupId);
  const route = (curriculum.routes || []).find(item => item.groupIds.includes(group.id));
  const lessonIndex = group.lessonIds.indexOf(lesson.id);
  const groupIndex = route.groupIds.indexOf(group.id);
  const previousLesson = lessonFor(group.lessonIds[lessonIndex - 1]);
  const nextLesson = lessonFor(group.lessonIds[lessonIndex + 1]);
  const previousGroup = curriculum.groups.find(item => item.id === route.groupIds[groupIndex - 1]);
  const nextGroup = curriculum.groups.find(item => item.id === route.groupIds[groupIndex + 1]);
  const copy = CURATED_LEARNING_LINKS[lesson.id];
  const position = copy?.position || (previousLesson
    ? `上一节回答“${previousLesson.question}”；这一节继续回答“${lesson.question}”。`
    : previousGroup
      ? `上一主题“${previousGroup.title}”已经收束；现在进入“${group.title}”，先回答“${lesson.question}”。`
      : `“${group.title}”是本篇起点，先回答“${lesson.question}”。`);
  const reason = copy?.reason || (nextLesson
    ? `本节与下一节共同完成“${group.title}”主题；接下来进入“${nextLesson.title}”。`
    : group.connectionToNext);
  const [nextLabel, ...nextTitleParts] = lesson.transition.split('：');
  return {
    position,
    transition: lesson.transition,
    nextLabel,
    nextTitle: nextTitleParts.join('：'),
    reason,
    routeConclusion: !nextLesson && !nextGroup ? route.conclusion : null,
  };
}

function project(pkg, plan, session) {
  const step = plan.steps[session.currentIndex];
  if (!step || session.status === 'expired') return null;
  const lesson = lessonFor(step.lessonId);
  const done = session.completedStepIds.includes(step.stepId), skipped = session.skippedStepIds.includes(step.stepId);
  const next = plan.steps[session.currentIndex + 1];
  const learningLink = explanationLinkFor(lesson);
  const sources = [...new Set(lesson.parts.flatMap(part => part.sourceBlockIds))].map(id => ({ id, pointId: id.split(':')[1] }));
  const units = [...new Set([...(lesson.primaryUnitIds || []), ...sources.map(source => source.pointId)])].map(id => ({ id, title: pkg.knowledgeUnits.find(unit => unit.id === id)?.title || '', blockId: sources.find(source => source.pointId === id).id }));
  return {
    id: lesson.id, title: displayTitleForLesson(lesson), question: lesson.question, objectives: lesson.objectives,
    outcomeSummary: lesson.objectives.join('；'),
    scopeLimit: lesson.scopeLimit, groupTitle: plan.scopeTitle, position: session.currentIndex + 1, total: plan.steps.length,
    stepId: step.stepId, curriculumVersion: plan.curriculumVersion,
    closeout: done || skipped, done, skipped, ended: session.status === 'completed',
    remaining: plan.steps.filter(step => !session.completedStepIds.includes(step.stepId)).length,
    nextTitle: next?.title || '',
    parts: lesson.parts.map(part => ({ ...part,
      label: part.kind === 'recap' ? (lesson.nextLessonId ? '本节结论' : '本主题小结') : part.label,
      runs: projectTextRuns({ text: part.text }, part.text, { emphasis: part.emphasis || [] }, 'text') })),
    learningLink,
    routeConclusion: learningLink.routeConclusion,
    reflection: lesson.reflection, referenceVisible: Boolean(session.unitReferences?.[lesson.id]), sources: units,
    primarySource: units[0] || null, relatedSources: units.slice(1),
    anchor: session.unitAnchors?.[lesson.id] || null,
  };
}

function routeForGroup(groupId) {
  return (curriculum.routes || []).find(route => route.groupIds.includes(groupId)) || null;
}

function recordForPlan(plan, records = []) {
  const exact = records.find(record => record?.session?.planId === plan.id);
  if (exact) return exact;
  return records.filter(record => record?.planOptions?.experienceKind === KIND
      && record.planOptions.groupId === plan.groupId
      && isCompatibleCurriculumVersion(record.session?.curriculumVersion)
      && record.session?.planId === planIdFor(plan.groupId, record.session.curriculumVersion))
    .sort((a, b) => (b.session.updatedAt || 0) - (a.session.updatedAt || 0))[0] || null;
}

function groupProgress(pkg, group, records = []) {
  const plan = planFor(pkg, {type:'systematic',experienceKind:KIND,groupId:group.id});
  const record = plan && recordForPlan(plan, records);
  const session = record ? normalize(plan, record.session) : null;
  const read = session && session.status !== 'expired'
    ? new Set(session.completedStepIds).size : 0;
  return { read, count:group.lessonIds.length, session:session?.status === 'expired' ? null : session };
}

function nextGroupFor(pkg, plan, records = []) {
  const route = routeForGroup(plan.groupId);
  if (!route) return null;
  const index = route.groupIds.indexOf(plan.groupId);
  return route.groupIds.slice(index + 1).map(id => curriculum.groups.find(group => group.id === id))
    .find(group => groupProgress(pkg, group, records).read < group.lessonIds.length) || null;
}

function routeCards(pkg, records = []) {
  return (curriculum.routes || []).map(route => {
    const groups = route.groupIds.map(id => {
      const group = curriculum.groups.find(group => group.id === id);
      const progress = groupProgress(pkg,group,records);
      return {...group,count:progress.count,read:progress.read,hasProgress:Boolean(progress.session),
        status:progress.read === progress.count ? '已读完' : progress.session ? '进度已保留' : '未开始'};
    });
    const first = groups.find(group => group.read < group.count) || groups[groups.length - 1];
    return {...route,groups,read:groups.reduce((n,group)=>n+group.read,0),count:groups.reduce((n,group)=>n+group.count,0),
      recommendedGroupId:first?.id || null};
  });
}

function resumeAction(plan, session, pkg, record) {
  const step = plan.steps[session.currentIndex];
  const hasEnded = session.completedStepIds.includes(step?.stepId) || session.skippedStepIds.includes(step?.stepId);
  const next = hasEnded ? plan.steps[session.currentIndex + 1] : null;
  const allRead = plan.steps.every(step => session.completedStepIds.includes(step.stepId));
  const records = record ? [record,...(Array.isArray(record.savedSystematicRecords) ? record.savedSystematicRecords : [])] : [];
  const group = pkg && session.status === 'completed' && allRead ? nextGroupFor(pkg,plan,records) : null;
  if (group) return {title:displayTitleForLessonId(group.lessonIds[0]),groupTitle:group.title,label:'接着了解',
    url:`/subpackages/politics/route/units?nextGroup=${encodeURIComponent(group.id)}&fromPlan=${encodeURIComponent(plan.id)}`};
  return { title: next?.title || step?.title, label: next ? '接着了解' : hasEnded ? '回看主题' : '继续学习',
    url: `/subpackages/politics/route/units?${next ? `continueFrom=${encodeURIComponent(step.lessonId)}` : 'resume=1'}` };
}

module.exports = { KIND, EXPLANATION_REVIEWED_IDS, curriculum, isPilotAvailable, isUnitPlan, isCompatibleCurriculumVersion,
  planFor, normalize, apply, project, resumeAction, routeForGroup, recordForPlan, groupProgress, nextGroupFor, routeCards,
  displayTitleForLessonId };
