const assert=require('assert/strict');const batch=require('../docs/knowledge-platform/content/common-sense-guide-expansion-batch-26');const c=Object.fromEntries(batch.groups[0].cards.map(c=>[c.id,c.explanation]));
// Illustrative examples distinguish mechanisms, transactions and accounting scopes.
const taxRate=.2;assert.equal(100*taxRate-80*taxRate,4);assert.match(c['automatic-stabilizers'],/既有制度/);assert.match(c['discretionary-policy'],/新的政策决定/);
const debtIssue=100,repayment=100,newSpending=0;assert.equal(debtIssue-repayment,newSpending);assert.match(c['debt-volume-direction'],/到期债务接续/);
const initialCash=0,borrowedCash=100,liability=100;assert.equal(initialCash+borrowedCash-liability,0);assert.match(c['income-financing'],/不等于一般公共预算/);assert.match(c['public-debt-liability'],/依约还本付息/);
assert.match(c['government-purchase'],/支付时是否取得直接对价/);assert.match(c['cash-transfer'],/发放环节/);assert.match(c['function-economic-classification'],/不能只因.*卫生保健/);
assert.match(c['transfer-and-gdp'],/不能.*重复计入/);assert.match(c['purchase-and-final-consumption'],/资本形成和中间消耗/);
assert.match(c['tax-characteristics'],/固定性不排斥依法调整/);assert.match(c['debt-use'],/可能用途/);assert.match(c['expansion-conditions'],/不把衰退等同于通缩/);assert.match(c['contraction-conditions'],/供给冲击/);
console.log(JSON.stringify({ok:true,domainBoundaryCases:8,illustrativeNumericCases:3,independentFactReview:false,actualUserStudy:false}));
