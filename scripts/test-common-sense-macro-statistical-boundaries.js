const assert=require('assert/strict');const batch=require('../docs/knowledge-platform/content/common-sense-guide-expansion-batch-25');const c=Object.fromEntries(batch.groups.flatMap(g=>g.cards).map(c=>[c.id,c.explanation]));
// Illustrative values are counterexamples, not reported economic data.
const employed=90,unemployed=10,nonLabor=100;assert.equal(unemployed/(employed+unemployed),.1);assert.notEqual(unemployed/(employed+unemployed+nonLabor),.1);assert.match(c['unemployment-denominator'],/包含已经就业的人/);
const previousPrice=100,currentPrice=110,previousReal=100,currentReal=100;assert.ok(currentPrice*currentReal>previousPrice*previousReal);assert.equal(currentReal,previousReal);assert.match(c['real-output-growth'],/名义GDP增加可能只是价格上涨/);
assert.ok((102/100-1)>0);assert.ok((102/104-1)<0);assert.match(c['cpi-comparison'],/同比上涨、环比下降可以同时出现/);assert.match(c['slower-inflation'],/仍在上涨但速度放缓/);
assert.match(c['production-boundary'],/自有住房服务/);assert.match(c['production-boundary'],/无酬家务服务通常不纳入/);assert.match(c['resident-units'],/外国投资者/);assert.match(c['gni-gnp-income'],/初次分配收入净额/);
const exportsNet=120,netPrimaryIncome=-200,financialNet=-80;const currentAccount=exportsNet+netPrimaryIncome;assert.equal(currentAccount-financialNet,0);assert.notEqual(currentAccount,0);assert.match(c['exports-not-current-account'],/还包含跨境初次收入/);assert.match(c['book-vs-economic-balance'],/不意味着经济上不存在对外失衡/);
assert.ok(102/110<100/100);assert.match(c['nominal-real-income'],/比较其收入增幅/);assert.ok(100/120<100/100);assert.equal(120/120,100/100);assert.match(c['unexpected-inflation-debt'],/未充分指数化/);assert.match(c['unexpected-inflation-debt'],/高于订约预期/);
console.log(JSON.stringify({ok:true,domainBoundaryCases:8,illustrativeNumericCounterexamples:5,actualUserStudy:false,independentFactReview:false}));
