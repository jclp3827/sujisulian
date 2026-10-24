from fractions import Fraction as F
import json
from pathlib import Path
rates=[F(-3,4),F(-1,2),F(-1,10),F(0),F(1,10),F(1,3),F(1,2),F(1),F(2)]
tests=[]
for r in rates:
 for s in rates:
  combined=(1+r)*(1+s)-1
  assert combined==r+s+r*s
  assert (combined-r)/(1+r)==s
  quotient=(1+r)/(1+s)-1
  assert quotient==(r-s)/(1+s)
  tests.append({'r':str(r),'s':str(s),'combined':str(combined),'recovered':str((combined-r)/(1+r)),'quotient':str(quotient)})
for a in [F(5),F(20),F(60)]:
 for b in [F(100),F(250)]:
  for ra in rates:
   for rb in rates:
    a1,b1=a*(1+ra),b*(1+rb)
    share0,share1=a/b,a1/b1
    assert (a1/b1)*(1+rb)/(1+ra)==share0
    assert share1-share0==(a1/b1)*(ra-rb)/(1+ra)
    assert (share1-share0>0)==(ra>rb)
    assert a1-a==a1*ra/(1+ra)
# Strict proximity needs distinct component growth rates.
a,b=F(2),F(3);ra,rb=F(8,100),F(3,100);r=(a*ra+b*rb)/(a+b)
assert r==F(5,100) and abs(r-rb)<abs(r-ra)
a1,b1=a*(1+ra),b*(1+rb)
assert b1>a1
same=F(1,10);assert (a*same+b*same)/(a+b)==same
assert abs(same-same)==abs(same-same)==0
# Distribution and percentage-point conversion.
assert F(592)*F(97,100)==F(14356,25)
assert F(2,100)*100==2
out={'schemaVersion':1,'reviewerTaskId':'/root/da_exact_review','method':'exact rational arithmetic, not float tolerances','compoundReverseQuotientGrid':tests,'shareGrowthDirectionAmountCases':6*81,'mixedExample':{'baseWeights':['2/5','3/5'],'rates':['8%','3%'],'overall':'5%','largerBase':'B / 进口','largerCurrent':'B / 进口','strictProximityEqualRateCounterexample':'same rates -> both distances zero'},'multiplicationExampleExact':'574.24','unitConversion':'0.02 = 2 percentage points; not 0.02 percentage points','result':'pass'}
Path('/private/tmp/notes-da-review-20261023/independent/math-verification.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'result':out['result'],'compoundGrid':len(tests),'shareGrowthCases':out['shareGrowthDirectionAmountCases']}))
