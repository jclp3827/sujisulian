const {approvalDigest}=require('./notes-learning-compiler');
function reviewReport(source,pack){
 const kinds={basic:'基础快练',method:'方法判断',application:'完整题应用'},names={'data-analysis':'资料分析',verbal:'言语理解',quantity:'数量关系',logic:'判断推理',graphic:'图形推理'};
 const activeIds=new Set(Object.values(pack.entryPlans).flatMap(e=>e.resourceIds)), activeQuestions=pack.questions.filter(q=>activeIds.has(q.id));
 const lines=['# 笔记学习链路内容审核单','',`日期：${pack.reviewDate || '2026-10-21'}。候选版本：${pack.version}。全部保持 review；本文件不是批准记录。`,'',
 '原笔记正文未改。基础快练检测单项知识记忆；方法判断支持直接辨析及小任务试用；完整题应用承接原笔记例题。原考试标签未核实，不作为已核准真题。正式准入需要来源、目标、知识原子、辨析关系和题目对应版本的人工审核。','',
 '| 科目 | 基础快练 | 方法判断 | 完整题应用 | 活动计算配方 |','|---|---:|---:|---:|---:|'];
 for(const [id,name] of Object.entries(names))lines.push(`| ${name} | ${['basic','method','application'].map(k=>activeQuestions.filter(q=>q.subjectId===id&&q.exerciseKinds.includes(k)).length).join(' | ')} | ${pack.recipes.filter(r=>r.subjectId===id&&activeIds.has(r.id)).length} |`);
 lines.push('',`活动候选${activeQuestions.length}道；历史与隔离题目记录${pack.questions.length-activeQuestions.length}道，历史数值配方${pack.recipes.length}个均不入笔记入口。全部review，正式批准资源0。`, '', '图形文字知识与辨析须经当前V4审核后独立试用；两张立体拼合原题图虽含选项，但已圈出C/D答案并有推导，继续作为讲解材料，独立完整应用暂停。图片能力夹具验证不替代真实资源审核。','',
 '审核需逐项确认：目标和前置条件准确；题干和材料完整；答案唯一且解析正确；干扰项理由充分；原题身份和改编边界清楚；图片和选项绑定完整；回源位置准确。','');
 for(const target of pack.targets){lines.push(`## 目标 ${target.id}`,'',target.statement,`结论：${target.conclusion}`,`前提：${target.conditions.join('；')}`,`边界：${target.excludes.join('；')}`,'');}
 for(const atom of pack.knowledgeAtoms||[])lines.push(`## 知识 ${atom.id}`,'',atom.statement,`前提：${atom.conditions.join('；')}`,`误区：${atom.misconceptions.join('；')}`,`来源：${atom.refs.map(r=>[r.subjectId,r.pointId,r.tabId].join('/')).join('；')}`,'人工结论：待审核。','');
 for(const group of pack.comparisonGroups||[])lines.push(`## 辨析 ${group.id}`,'',`知识：${group.knowledgeAtomIds.join('、')}`,`关键区别：${group.difference}`,`条件：${group.conditions.join('；')}`,`误区：${group.misconceptions.join('；')}`,'人工结论：待审核。','');
 for(const q of pack.questions){
  const authored=source.questions.find(x=>x.id===q.id);
  lines.push(`## ${q.id}`,'',`科目：${names[q.subjectId]}。方式：${q.exerciseKinds.map(k=>kinds[k]).join('、')}。revision=${q.revision}，status=${q.status}。`,
   `入口：${activeIds.has(q.id)?'活动候选':'历史保留，不入本轮入口'}；任务：${q.assessment?.taskType||'旧契约历史记录'}。`,
   `身份：${q.sourceKind}${q.declaredOriginalSource?'；原笔记声明“'+q.declaredOriginalSource+'”（未核实）':''}。`,
   `目标：${q.primaryTargetIds.join('、')}。题族：${q.familyId}。暴露组：${q.exposureGroupId}。`,'',q.prompt,'');
  q.options.forEach(v=>lines.push(`- ${v.key}. ${v.text}`));
  lines.push('',`参考答案：${q.answer}`,`解析：${q.explanation}`);
  if(pack.semanticPolicy)lines.push(q.semanticAdmission?`V4语义接受：${q.semanticAdmission.receiptId}；规则${q.semanticAdmission.ruleVersion}。仍不代表正式批准。`:'V4语义：当前无有效接受证明；存档不代表准入。');
  if(q.signal)lines.push(`识别信号：${q.signal}`,`适用边界：${q.boundary}`);
  Object.entries(q.distractorReasons).forEach(([k,v])=>lines.push(`干扰项 ${k}：${v}`));
  q.refs.forEach(ref=>lines.push(`来源：${ref.subjectId}/${ref.pointId}/${ref.tabId}；SHA-256 ${ref.expectedSha256}`));
  if(q.originTask)lines.push(`原任务核验：${JSON.stringify(q.originTask)}`);
  if(q.originAdaptation)lines.push(`展示补全：${JSON.stringify(q.originAdaptation)}`);
  if(q.origin)lines.push(`原例题记录：${q.origin.sourceExampleRecordId}；原块 SHA-256 ${q.origin.expectedBlockSha256}`);
  lines.push(`当前编写记录摘要：${approvalDigest(authored)}`,'','人工结论：待审核。','');
 }
 for(const recipe of pack.recipes)lines.push(`## 配方 ${recipe.id}`,'',`生成器：${recipe.sectionId}/${recipe.generatorId}；版本：${recipe.generatorVersion}。`,`目标：${recipe.primaryTargetIds.join('、')}。`,`来源：${recipe.refs.map(r=>[r.subjectId,r.pointId,r.tabId].join('/')).join('；')}`,'历史配方保留供追溯，已退出笔记所有练习入口。计算技能继续由原训练模块承接。','人工结论：待审核。','');
 return lines.join('\n');
}
module.exports={reviewReport};
