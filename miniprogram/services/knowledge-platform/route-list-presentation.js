// Display-only route-list copy. Curriculum names, scopes and learning events remain authoritative.
const copy = Object.freeze({
  foundation:['核心要义、新时代与“两个结合”','理解新时代思想的核心主题、时代条件和“两个结合”。'],
  ten:['十个明确','了解十个明确的主要内容及各条关注的问题。'],
  framework:['科学体系：方略与方法','理解主要理论表述、基本方略、重大成就及世界观和方法论。'],
  modernization:['中国式现代化','理解现代化目标、五个中国特色、本质要求和重大原则。'],
  leadership:['党的领导与人民立场','理解党的领导、人民立场、共同富裕与收入分配。'],
  development:['高质量发展','理解发展阶段、发展理念、发展格局及高质量发展的主要支撑。'],
  livelihood:['民生：就业、分配与保障','理解就业、收入分配、社会保障与人民健康的联系。'],
  support:['教育、科技与人才','理解教育、科技、人才对发展的支撑作用。'],
  democracy:['全过程人民民主','理解政治制度、全过程人民民主和统一战线。'],
  reformlaw:['改革与法治','理解改革目标、法治道路与依法治国的基本要求。'],
  cultureeco:['文化与生态文明','了解文化建设与生态文明建设各自的目标和要求。'],
  party:['党的建设与自我革命','理解党的建设总要求及其与自我革命的联系。'],
  security:['总体安全与国防','理解总体国家安全观、强军目标与国防建设。'],
  unityforeign:['统一与对外关系','理解国家统一、外交关系和人类命运共同体。'],
  basics:['基本立场与物质意识','认识马克思主义的组成、物质与意识及科学社会主义基础。'],
  dialectics:['联系、发展与矛盾','理解联系、发展和矛盾分析的基本观点与方法。'],
  cognition:['实践、认识与真理','理解实践与认识的关系、认识的两次飞跃和真理属性。'],
  history:['社会与历史','理解社会基本矛盾、社会意识与人民群众的历史作用。'],
  value:['商品、劳动与价值量','理解商品二因素、劳动二重性和商品价值量。'],
  money:['货币：本质与职能','理解货币的本质及五种职能各自的作用。'],
  capital:['剩余价值：定义与条件','理解剩余价值的产生、生产方法以及资本分类与构成。'],
});
function presentGroup(group) {
  const entry=copy[group.id];
  return {...group,displayTitle:entry?.[0] || group.title,displayDescription:entry?.[1] || '',
    displayProgress:group.completed ? `已读完 · ${group.count}节` : group.read ? `已读${group.read}/${group.count}节` : `共${group.count}节`};
}
function continuationLabel(card,route,groupId) {
  if (!card) return '';
  if (route.read === route.count) return '本篇已读完，可回看';
  const prefix=card.action==='进入下一主题'?'接着学习':card.action==='查看当前主题'?'回看主题':'继续学习';
  return `${prefix} · ${copy[groupId]?.[0] || card.groupTitle}`;
}
module.exports={copy,presentGroup,continuationLabel};
