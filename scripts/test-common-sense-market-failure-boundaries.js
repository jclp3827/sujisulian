const assert=require('assert/strict');
const body=require('../miniprogram/subpackages/common-sense/models/note-common-sense');
const batch=require('../docs/knowledge-platform/content/common-sense-guide-expansion-batch-24');
const cards=Object.fromEntries(batch.groups.flatMap(g=>g.cards).map(c=>[c.id,c.explanation]));
// A negative production externality can imply excessive output even when total benefits exceed total social costs.
const privateQ=25,socialQ=20,totalBenefit=q=>50*q-q*q/2,totalSocialCost=q=>q*q/2+10*q;
assert.ok(privateQ>socialQ);assert.ok(totalBenefit(privateQ)>totalSocialCost(privateQ));
assert.equal(50-socialQ,socialQ+10);assert.equal(50-privateQ,privateQ);
assert.match(cards['private-social-margin'],/每增加一单位.*额外成本或收益/);assert.match(cards['private-social-margin'],/不能只看社会总收益/);
// Positive external benefits do not imply that the private activity has negative accounting profit.
const privatePositiveQ=30,socialPositiveQ=35;assert.ok(privatePositiveQ<socialPositiveQ);assert.ok((60-privatePositiveQ)*privatePositiveQ-privatePositiveQ**2/2>0);
assert.match(cards['positive-underproduction'],/不要求行为者自身已经亏损/);
// Consumption rivalry and exclusion are independent dimensions, as are funding and production.
assert.match(cards['non-rivalry'],/与能否.*收费是不同问题/);assert.match(cards['non-excludability'],/排除.*未付费者/);assert.match(cards['finance-production'],/企业或社会组织/);assert.match(cards['finance-production'],/两个问题/);
// Both parties missing the same information is not evidence that one has more information.
assert.match(cards['imperfect-versus-asymmetric'],/双方都不了解.*不足以证明/);assert.match(cards['adverse-selection'],/可能表现/);assert.match(cards['moral-hazard'],/不能只因合同后出现损失/);
assert.match(cards['conditional-tax-subsidy'],/结合.*条件/);assert.match(cards['competition-law-boundary'],/不直接等于已经违法/);
const point=body.points.find(p=>p.id==='market-failure-factors');assert.equal(point.tabs.length,5);assert.equal(point.readingMeta.focus.length,5);
console.log(JSON.stringify({ok:true,domainBoundaryCases:7,mathematicalCounterexamples:2,actualUserTest:false,independentExpertReview:false}));
