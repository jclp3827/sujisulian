'use strict';
// S4-HEAT-01: isolated question candidate, never imported by the ordinary public source.
const clone=value=>JSON.parse(JSON.stringify(value));
const GROUP='heat-mechanisms';
const sources=[
 {id:'nasa-thermal-control',title:'NASA Small Spacecraft Technology: Thermal Control',url:'https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/',locator:'7.2.1: vacuum, conduction and radiation; no gas convection',checkedAt:'2026-10-29',supports:'外部处于真空不等于连续固体内部的传导路径消失。'},
 {id:'ashrae-heat-transfer-2025',title:'ASHRAE Handbook 2025, Chapter 4: Heat Transfer',url:'https://handbook.ashrae.org/Handbooks/F25/SI/f25_ch04/f25_ch04_si.aspx',locator:'Section 1 Conduction, Convection, Radiation; forced convection by fan/pump/wind',checkedAt:'2026-10-29',supports:'传导、辐射与流体宏观运动传热按指定路径区分；风机驱动的气流也能传递热量。'},
 {id:'doe-heat-flow',title:'US Department of Energy: Heat Flow',url:'https://bsesc.energy.gov/energy-basics/heat-flow',locator:'How: conduction, convection and radiation',checkedAt:'2026-10-29',supports:'传导与温差和物质接触相关；对流涉及空气运动；太阳辐射可跨空间传能。'}
];
const rows=[
 {id:'s4-heat-continuous-rod-vacuum',revision:1,
 objective:'根据实际传热路径判断连续固体内部传导，不把装置外部真空误当成杆内无介质',
 prompt:'一根连续金属杆连接高温端与低温端，杆的中段位于真空腔内，杆本身没有断开或整体移动。只判断热量沿金属杆由高温端传向低温端这条路径，应选哪项？',
 options:['热对流：热量由杆内物质的整体循环带走','热传导：热量沿仍然连续的金属杆传递','热辐射：热量沿没有物质介质的路径传递'],answer:1,
 explanation:'题目指定的传热路径仍在连续金属内部，热量由高温部分传向低温部分，属于热传导。杆周围是真空，并不使杆内的固体介质消失；题目也没有流体整体循环的条件。',
 boundary:'只判断沿杆的指定路径；不否认装置还可能发生辐射，不判断各种方式的传热占比或速率。',
 primaryTargetIds:['q0b-target-heat-conduction'],supportingTargetIds:['q0b-target-heat-convection','q0b-target-heat-radiation'],cognitiveLevel:'condition',
 distractorReasons:{0:'连续金属杆没有整体循环运动，且指定路径不依靠流体宏观运动。',2:'把杆周围的真空误套到杆内路径；该路径仍有连续金属介质，不是跨无介质空间的辐射。'},sourceIds:['nasa-thermal-control','ashrae-heat-transfer-2025']},
 {id:'s4-heat-radiation-forced-air',revision:1,
 objective:'在同一对照题中分别识别真空中的太阳辐射和风机驱动气流的宏观传热',
 prompt:'两条指定传热路径分别是：①太阳能跨越近似真空的太空到达物体；②风机带动空气从较热区域流向较冷区域，并由流动空气传递热量。①和②依次属于什么？',
 options:['①热传导；②热对流','①热辐射；②热传导','①热辐射；②热对流'],answer:2,
 explanation:'①以电磁辐射跨空间传递能量，属于热辐射。②依靠空气的宏观流动传递热量，属于热对流；流动由风机驱动，也不改变这一机制。不能仅因空气参与，就忽略题目明确给出的整体流动。',
 boundary:'只识别指定的能量传递路径；不计算太阳辐射强度或风机功率，也不比较自然对流与强制对流的传热效率。',
 primaryTargetIds:['q0b-target-heat-radiation','q0b-target-heat-convection'],supportingTargetIds:['q0b-target-heat-conduction'],cognitiveLevel:'application',
 distractorReasons:{0:'太阳能跨越的太空近似真空，没有连续物质可完成指定的接触传导路径。',1:'第二条路径已明确空气整体流动并搬运热量，不能把它改判为只有相邻部分传递的传导。'},sourceIds:['ashrae-heat-transfer-2025','doe-heat-flow']}
];
function apply(source){
 const pack=clone(source),group=pack.groups.find(g=>g.id===GROUP);
 if(!group||group.questionIds.length!==3||rows.some(q=>pack.questions.some(x=>x.id===q.id)))throw Error('S4 source group identity changed');
 const template=pack.questions.find(q=>q.id==='heat-conduction');
 for(const row of rows){
  const {primaryTargetIds,supportingTargetIds,cognitiveLevel,distractorReasons,sourceIds,...question}=row;
  pack.questions.push({...clone(template),...clone(question),status:'review',refs:clone(template.refs),
   supplementalSources:sourceIds.map(id=>clone(sources.find(s=>s.id===id))),candidateBatch:'S4-HEAT-01'});
  const relation={questionId:row.id,primaryTargetIds:clone(primaryTargetIds),supportingTargetIds:clone(supportingTargetIds),checkPurpose:'s4-condition-transfer'};
  pack.targetRelations.questionTargets.push(relation);
  pack.questionSpecifications.push({...clone(relation),cognitiveLevel,distractorReasons:clone(distractorReasons)});
  group.questionIds.push(row.id);pack.entryPlans.modes.qa.questionIds.push(row.id);
 }
 for(const decision of pack.variationDecisions.filter(x=>x.targetId.startsWith('q0b-target-heat-'))){
  const matched=rows.filter(q=>[...q.primaryTargetIds,...q.supportingTargetIds].includes(decision.targetId));
  decision.variationQuestionIds=[...new Set([...decision.variationQuestionIds,...matched.map(x=>x.id)])];
  decision.processDifference+=' S4补充：区分装置环境与实际路径，并识别风机驱动流动，不以“真空”或“空气”等单词直接猜机制。';
 }
 const previous=pack.version;pack.version=previous+'-s4-heat-01';
 pack.sessionMigrations=pack.sessionMigrations.map(m=>m.toPackVersion===previous?{...m,toPackVersion:pack.version}:m);
 return pack;
}
module.exports={schemaVersion:1,batchId:'S4-HEAT-01',status:'candidate-review',groupId:GROUP,sourceDate:'2026-10-29',sources,rows,apply,
 humanReview:'pending',formalContentApproval:false,publicAuthorization:false,
 scopeReason:'一个完整问答知识组：原3题/3目标保留，新增2个必要条件变式，正好达到既有每组最多5题合同。导读20—40卡规则不适用于问答；不为数量转做导读或重复编造。',
 reuseDecision:'先核对既有未公开候选：3道blocked宏观题和1张来源HOLD足球导读不具备复用条件；改为复用已明确的传热目标、正文源单元与原三题，增补原题缺少的路径辨别。'};
