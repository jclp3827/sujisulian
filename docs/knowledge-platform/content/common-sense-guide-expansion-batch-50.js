module.exports = {
  "schemaVersion": 1,
  "id": "common-sense-guide-expansion-batch-50",
  "title": "知识导读扩库第50批：行政诉讼的当事人、证据与期间",
  "status": "candidate",
  "purpose": "按独立理解目标与完整知识组建设，保留来源定位，区分概念、条件与实例。",
  "groups": [
    {
      "pointId": "administrative-litigation",
      "overview": "行政诉讼由法院审查行政争议，先明确被诉对象、原被告和法院管辖，再看举证、起诉与审理期间。复议维持、改变和不作为不同，起诉期限不与民事时效或法院审理期限混同。",
      "relation": "classification",
      "cards": [
        {
          "id": "administrative-litigation-concept",
          "title": "什么是行政诉讼",
          "explanation": "行政诉讼是公民、法人或其他组织认为行政机关或者依法授权组织作出的行政行为侵犯其合法权益，向人民法院起诉，由法院审查被诉行政行为并裁判解决行政争议的制度，又称“民告官”。",
          "productionMode": "reuse",
          "learningGoal": "理解行政诉讼的起诉主体、审查对象和解决方式。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-kp-1"
          ],
          "sourceEvidence": [
            "行政诉讼是公民、法人或其他组织认为行政行为侵犯其合法权益，依法向人民法院起诉，由法院审查被诉行政行为并裁判解决行政争议的制度。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "golden-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "accepted-by-user",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "plaintiff-successors",
          "title": "原告死亡、终止或受限自由的情形",
          "explanation": "公民死亡，其近亲属可以依法起诉；法人终止，由承受其权利的相应组织起诉。公民被限制人身自由时，近亲属依其委托以该公民名义起诉，与近亲属因死亡取得法定起诉资格，是不同情形。",
          "productionMode": "light-edit",
          "learningGoal": "区分原告死亡、终止或受限自由的情形的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-kp-2"
          ],
          "sourceEvidence": [
            "公民原告；公民本人；公民死亡的，其近亲属可以起诉；公民被限制人身自由的，其近亲属可以依其口头或书面委托，以该公民名义提起诉讼。。法人原告；法人本身；法人终止时，由承受其权利的法人或其他组织起诉。。一般被告；公民、法人或其他组织直接起诉的，作出行政行为的行政机关是被告；法律、法规、规章授权组织作出行政行为的，该组织是被告；受委托组织作出行政行为的，委托机关是被告。。复议维持；原行政机关和复议机关为共同被告。。复议改变；复议机关为被告。。复议不作为；起诉原行政行为的，作出原行政行为的机关是被告；起诉复议机关不作为的，复议机关是被告。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "defendant",
          "title": "一般被告：作出行为与承担责任的主体",
          "explanation": "直接起诉一般以作出行政行为的机关为被告，依法授权组织以自己名义作出行为的依法确定该组织，受托组织作出行为则以委托机关为被告。不能只看现场工作人员或印章位置，就省略授权、委托和名义责任。",
          "productionMode": "light-edit",
          "learningGoal": "区分一般被告：作出行为与承担责任的主体的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-kp-2"
          ],
          "sourceEvidence": [
            "公民原告；公民本人；公民死亡的，其近亲属可以起诉；公民被限制人身自由的，其近亲属可以依其口头或书面委托，以该公民名义提起诉讼。。法人原告；法人本身；法人终止时，由承受其权利的法人或其他组织起诉。。一般被告；公民、法人或其他组织直接起诉的，作出行政行为的行政机关是被告；法律、法规、规章授权组织作出行政行为的，该组织是被告；受委托组织作出行政行为的，委托机关是被告。。复议维持；原行政机关和复议机关为共同被告。。复议改变；复议机关为被告。。复议不作为；起诉原行政行为的，作出原行政行为的机关是被告；起诉复议机关不作为的，复议机关是被告。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "maintained",
          "title": "复议维持：原机关与复议机关共同被告",
          "explanation": "经复议决定维持原行政行为，原行政机关与复议机关依法作为共同被告。须先确认复议处理性质，不能因为收到复议机关的决定，就将作出原行为的机关排除，或把复议机关直接当作所有案件的单独被告。",
          "productionMode": "light-edit",
          "learningGoal": "区分复议维持：原机关与复议机关共同被告的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-kp-2"
          ],
          "sourceEvidence": [
            "公民原告；公民本人；公民死亡的，其近亲属可以起诉；公民被限制人身自由的，其近亲属可以依其口头或书面委托，以该公民名义提起诉讼。。法人原告；法人本身；法人终止时，由承受其权利的法人或其他组织起诉。。一般被告；公民、法人或其他组织直接起诉的，作出行政行为的行政机关是被告；法律、法规、规章授权组织作出行政行为的，该组织是被告；受委托组织作出行政行为的，委托机关是被告。。复议维持；原行政机关和复议机关为共同被告。。复议改变；复议机关为被告。。复议不作为；起诉原行政行为的，作出原行政行为的机关是被告；起诉复议机关不作为的，复议机关是被告。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "changed",
          "title": "复议改变：依法以复议机关为被告",
          "explanation": "复议机关改变原行政行为的，依法以复议机关为被告。改变与维持的法定被告规则不同，不能只因都经过复议，就不区分处理性质而全部列原机关和复议机关为共同被告。",
          "productionMode": "light-edit",
          "learningGoal": "区分复议改变：依法以复议机关为被告的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-kp-2"
          ],
          "sourceEvidence": [
            "公民原告；公民本人；公民死亡的，其近亲属可以起诉；公民被限制人身自由的，其近亲属可以依其口头或书面委托，以该公民名义提起诉讼。。法人原告；法人本身；法人终止时，由承受其权利的法人或其他组织起诉。。一般被告；公民、法人或其他组织直接起诉的，作出行政行为的行政机关是被告；法律、法规、规章授权组织作出行政行为的，该组织是被告；受委托组织作出行政行为的，委托机关是被告。。复议维持；原行政机关和复议机关为共同被告。。复议改变；复议机关为被告。。复议不作为；起诉原行政行为的，作出原行政行为的机关是被告；起诉复议机关不作为的，复议机关是被告。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "review-inaction",
          "title": "复议不作为：看起诉的是哪项行为",
          "explanation": "复议机关逾期不作决定，起诉原行政行为，依法以原机关为被告；起诉复议机关不作为，依法以复议机关为被告。被告随被诉对象区分，不能只因复议曾经介入就忽略本次诉讼请求指向。",
          "productionMode": "light-edit",
          "learningGoal": "区分复议不作为：看起诉的是哪项行为的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-kp-2"
          ],
          "sourceEvidence": [
            "公民原告；公民本人；公民死亡的，其近亲属可以起诉；公民被限制人身自由的，其近亲属可以依其口头或书面委托，以该公民名义提起诉讼。。法人原告；法人本身；法人终止时，由承受其权利的法人或其他组织起诉。。一般被告；公民、法人或其他组织直接起诉的，作出行政行为的行政机关是被告；法律、法规、规章授权组织作出行政行为的，该组织是被告；受委托组织作出行政行为的，委托机关是被告。。复议维持；原行政机关和复议机关为共同被告。。复议改变；复议机关为被告。。复议不作为；起诉原行政行为的，作出原行政行为的机关是被告；起诉复议机关不作为的，复议机关是被告。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "review-mediation",
          "title": "法院审查合法性，调解有法定例外",
          "explanation": "行政诉讼依法审查行政行为合法性，原则上不适用调解；行政赔偿、补偿及行政机关行使法定裁量权的案件可以调解。一般原则与法定例外同时存在，不能一概认为行政案件都能或都不能调解。",
          "productionMode": "light-edit",
          "learningGoal": "区分法院审查合法性，调解有法定例外的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-3-2"
          ],
          "sourceEvidence": [
            "选择复议：可先复议后起诉，也可不经复议直接起诉，但法律规定复议前置的除外。。人民法院审查行政行为合法性。。诉讼期间，行政行为原则上不停止执行。。行政案件原则上不适用调解；行政赔偿、补偿以及行政机关行使法定裁量权的案件可以调解。。被告负举证责任。。人民法院独立行使行政审判权，不受行政机关、社会团体和个人干涉。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "no-suspension",
          "title": "起诉原则上不停止行政行为执行",
          "explanation": "行政诉讼期间，行政行为原则上不停止执行，法律规定的停止执行情形另行判断。提出诉讼与法院已经裁定停止执行不同，不能仅因已递交起诉材料，就认为原行政决定当然不再需要依法履行。",
          "productionMode": "light-edit",
          "learningGoal": "区分起诉原则上不停止行政行为执行的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-3-2"
          ],
          "sourceEvidence": [
            "选择复议：可先复议后起诉，也可不经复议直接起诉，但法律规定复议前置的除外。。人民法院审查行政行为合法性。。诉讼期间，行政行为原则上不停止执行。。行政案件原则上不适用调解；行政赔偿、补偿以及行政机关行使法定裁量权的案件可以调解。。被告负举证责任。。人民法院独立行使行政审判权，不受行政机关、社会团体和个人干涉。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "scope",
          "title": "行政争议受案：处罚许可与履职等",
          "explanation": "行政处罚、许可、强制、自然资源权属、征收补偿、履职给付、经营权益与法定行政协议等争议，依法在行政诉讼受案范围内判断。须识别行政法律关系与具体权益，不是只要一方名字像政府，就把任意争议都改为行政诉讼。",
          "productionMode": "light-edit",
          "learningGoal": "区分行政争议受案：处罚许可与履职等的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-kp-4"
          ],
          "sourceEvidence": [
            "对行政处罚不服；对行政强制措施和行政强制执行不服；对行政许可决定不服。。对确认自然资源所有权或使用权决定不服；对征收、征用及其补偿决定不服。。行政机关不履行或拒绝履行保护人身权、财产权等法定职责。。认为行政机关侵犯经营自主权、农村土地承包经营权、农村土地经营权，或滥用行政权力排除限制竞争。。认为行政机关违法集资、摊派费用或违法要求履行其他义务；未依法支付抚恤金、最低生活保障或社会保险待遇。。认为行政机关不依法履行、未按约履行或违法变更解除政府特许经营、土地房屋征收补偿等协议。。认为行政机关侵犯其他人身权、财产权等合法权益。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "excluded",
          "title": "国家内部与普遍规则等排除事项",
          "explanation": "国防外交等国家行为、普遍适用的法规规章决定命令、机关内部奖惩任免，以及法律规定行政机关最终裁决的行为等，不属相应受案范围。排除事项须依法识别，不能只凭行政机关是否出面就认定都可独立起诉。",
          "productionMode": "light-edit",
          "learningGoal": "区分国家内部与普遍规则等排除事项的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-4-2"
          ],
          "sourceEvidence": [
            "国防、外交等国家行为。。行政法规、规章或行政机关制定发布的具有普遍约束力的决定、命令。。行政机关对其工作人员的奖惩、任免等决定。。法律规定由行政机关最终裁决的行政行为。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "levels",
          "title": "级别管辖：原行为与法定被告先确定",
          "explanation": "基层法院一般管辖一审行政案件，国务院部门、县级以上地方政府行政行为、海关处理等案件依法由中级法院管辖。复议机关作共同被告时，按原行政机关确定级别，不只看复议机关或参加诉讼的政府级别。",
          "productionMode": "light-edit",
          "learningGoal": "区分级别管辖：原行为与法定被告先确定的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-kp-5"
          ],
          "sourceEvidence": [
            "基层人民法院；基层人民法院一般管辖第一审行政案件，法律或司法解释特别规定的除外。复议机关作共同被告的案件，以作出原行政行为的机关确定级别管辖，不能只看复议机关级别。。中级人民法院；对国务院部门或县级以上地方政府作出的行政行为提起诉讼、海关处理、辖区重大复杂及法律规定的其他案件，依法由中级法院一审。先明确被诉行为和法定被告，复议机关共同被告案件按原机关确定级别，不能仅因县级政府参加诉讼就全部移至中级。。高级人民法院；本辖区重大、复杂的一审行政案件。。最高人民法院；全国范围内重大、复杂的一审行政案件。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "territory",
          "title": "地域管辖：原机关、复议与限制自由",
          "explanation": "一般由最初作出行政行为的机关所在地法院管辖，经复议案件依法也可向复议机关所在地起诉；限制人身自由案件有被告或原告所在地规则。不同连接条件依法判断，不表示原告可在任何方便的地方选择法院。",
          "productionMode": "light-edit",
          "learningGoal": "区分地域管辖：原机关、复议与限制自由的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-5-2"
          ],
          "sourceEvidence": [
            "一般地域管辖；最初作出行政行为的行政机关所在地法院。。限制人身自由；被告所在地或原告所在地法院。。复议案件；复议机关所在地或原行政机关所在地法院。。不动产案件；不动产所在地法院。。共同管辖；多个法院均有管辖权，原告可选择；向多个法院起诉，由最先立案的法院管辖。。移送管辖；受诉法院发现无管辖权，应移送有管辖权法院，受移送法院应受理。。指定管辖；有管辖权法院因特殊原因不能行使，或法院间争议协商不成，由上级或共同上级法院指定。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "real-estate",
          "title": "不动产与共同管辖：地点和先立案不同",
          "explanation": "因不动产提起行政诉讼，依法由不动产所在地法院管辖；多个法院都有管辖权，原告可选择，向多个法院起诉则由最先立案者管辖。地点专门规则与多法院均有权时的选择规则不同，不能只以谁先收到材料代替最先立案。",
          "productionMode": "light-edit",
          "learningGoal": "区分不动产与共同管辖：地点和先立案不同的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-5-2"
          ],
          "sourceEvidence": [
            "一般地域管辖；最初作出行政行为的行政机关所在地法院。。限制人身自由；被告所在地或原告所在地法院。。复议案件；复议机关所在地或原行政机关所在地法院。。不动产案件；不动产所在地法院。。共同管辖；多个法院均有管辖权，原告可选择；向多个法院起诉，由最先立案的法院管辖。。移送管辖；受诉法院发现无管辖权，应移送有管辖权法院，受移送法院应受理。。指定管辖；有管辖权法院因特殊原因不能行使，或法院间争议协商不成，由上级或共同上级法院指定。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "evidence",
          "title": "行政诉讼证据的法定种类",
          "explanation": "证据种类包括：书证、物证、视听资料、电子数据、证人证言、当事人陈述、鉴定意见、勘验笔录、现场笔录。",
          "productionMode": "reuse",
          "learningGoal": "区分行政诉讼证据的法定种类的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-kp-6"
          ],
          "sourceEvidence": [
            "证据种类包括：书证、物证、视听资料、电子数据、证人证言、当事人陈述、鉴定意见、勘验笔录、现场笔录。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "administrative-litigation-burden-of-proof",
          "title": "行政诉讼的举证责任",
          "explanation": "被告应提供事实和法律依据，证明行政行为合法，诉讼中不得自行向原告、第三人、证人收集证据。原告起诉不履行法定职责，原则上提供曾申请的证据；机关应依职权主动履职，或原告有正当理由不能提供的除外。损害等事项另按法定举证规则判断。",
          "productionMode": "synthesized",
          "learningGoal": "区分行政诉讼中被告的一般举证责任与原告的特定举证责任。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-6-2"
          ],
          "sourceEvidence": [
            "被告提供事实和法律依据证明行政行为合法。",
            "原告原则上证明曾申请履职；依职权主动履职或有正当理由不能提供的依法例外。"
          ],
          "verificationReferences": [
            "https://ipc.court.gov.cn/zh-cn/news/view-396.html",
            "https://ipc.court.gov.cn/zh-cn/news/view-397.html"
          ],
          "semanticRevision": 2,
          "review": {
            "admission": "golden-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "sampling-waived-source-correction",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "application-proof",
          "title": "不履职起诉：曾申请的证据有例外",
          "explanation": "起诉不履行法定职责，原告原则上提供曾向被告申请的证据；但机关应依职权主动履职，或原告有正当理由不能提供的，依法适用例外。不能将先申请证明机械扩展为所有主动履职事项的起诉前提。",
          "productionMode": "light-edit",
          "learningGoal": "区分不履职起诉：曾申请的证据有例外的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-6-2"
          ],
          "sourceEvidence": [
            "被告；提供事实依据和法律依据，证明行政行为合法；诉讼中被告及其代理人不得自行向原告、第三人和证人收集证据。。原告；起诉不履行法定职责，原告原则上提供曾提出申请的证据；机关应依职权主动履职，或原告有正当理由不能提供的，依法适用例外。行政赔偿补偿案件，原告对损害提供证据，因被告原因无法举证的，由被告承担相应举证责任。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "damage-proof",
          "title": "赔偿补偿：损害证据与被告原因例外",
          "explanation": "行政赔偿、补偿案件，原告应对行政行为造成的损害提供证据；因被告原因导致原告无法举证的，由被告承担相应举证责任。损害证明与被诉行为是否合法是不同事项，不能把一种举证规则直接替代另一种。",
          "productionMode": "light-edit",
          "learningGoal": "区分赔偿补偿：损害证据与被告原因例外的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-6-2"
          ],
          "sourceEvidence": [
            "被告；提供事实依据和法律依据，证明行政行为合法；诉讼中被告及其代理人不得自行向原告、第三人和证人收集证据。。原告；起诉不履行法定职责，原告原则上提供曾提出申请的证据；机关应依职权主动履职，或原告有正当理由不能提供的，依法适用例外。行政赔偿补偿案件，原告对损害提供证据，因被告原因无法举证的，由被告承担相应举证责任。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "filing",
          "title": "起诉条件：利害关系、请求与法定管辖",
          "explanation": "起诉须有相应利害关系、明确被告、具体诉讼请求和事实根据，并属于法院受案范围及受诉法院管辖。不同条件需要分别判断，不能只因对某项政策不满意，就省略具体行为、权益联系和法院权限。",
          "productionMode": "light-edit",
          "learningGoal": "区分起诉条件：利害关系、请求与法定管辖的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-kp-7"
          ],
          "sourceEvidence": [
            "行政诉讼分经行政复议后起诉和直接起诉两类。。起诉须满足：原告与行政行为有利害关系；有明确被告；有具体诉讼请求和事实根据；属于法院受案范围和受诉法院管辖。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "post-review-period",
          "title": "复议后起诉：一般十五日与起算事项",
          "explanation": "不服复议决定，一般自收到决定书之日起15日内起诉；复议逾期不决定，一般自法定期限届满起15日内，法律另有规定除外。收到决定与期限届满是不同起算事项，也须区分本次起诉原行为还是复议不作为。",
          "productionMode": "light-edit",
          "learningGoal": "区分复议后起诉：一般十五日与起算事项的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-7-2"
          ],
          "sourceEvidence": [
            "不服复议决定；此处实为行政起诉期限，不是民事诉讼时效。一般收到复议决定书之日起15日内起诉，法律另有规定的除外，不套用民事时效中断中止等规则。。复议机关逾期不决定；一般复议法定期限届满之日起15日内起诉，法律另有规定的除外；须区分起诉原行为还是起诉复议不作为，以及相关法定前置与救济规则。。直接起诉；知道或应当知道行政行为作出之日起6个月内。。最长受理期限；不动产案件自行政行为作出超过20年，其他案件超过5年，法院不予受理。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "direct-period",
          "title": "直接起诉：一般六个月，非民事诉讼时效",
          "explanation": "直接起诉一般从知道或应当知道行政行为作出之日起6个月内提出，法律另有规定的依其规定。这是行政起诉期限，不能将其等同民事诉讼时效，机械套用民事时效中断、中止等规则。",
          "productionMode": "light-edit",
          "learningGoal": "区分直接起诉：一般六个月，非民事诉讼时效的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-7-2"
          ],
          "sourceEvidence": [
            "不服复议决定；此处实为行政起诉期限，不是民事诉讼时效。一般收到复议决定书之日起15日内起诉，法律另有规定的除外，不套用民事时效中断中止等规则。。复议机关逾期不决定；一般复议法定期限届满之日起15日内起诉，法律另有规定的除外；须区分起诉原行为还是起诉复议不作为，以及相关法定前置与救济规则。。直接起诉；知道或应当知道行政行为作出之日起6个月内。。最长受理期限；不动产案件自行政行为作出超过20年，其他案件超过5年，法院不予受理。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "maximum-period",
          "title": "最长受理期限：从行为作出起算",
          "explanation": "因不动产起诉，自行政行为作出超过20年，其他案件超过5年，法院依法不予受理。最长期间从作出起算，与知道或应当知道行为的一般期限不同，不能只因最近得知，就忽略最长受理限制。",
          "productionMode": "light-edit",
          "learningGoal": "区分最长受理期限：从行为作出起算的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-7-2"
          ],
          "sourceEvidence": [
            "不服复议决定；此处实为行政起诉期限，不是民事诉讼时效。一般收到复议决定书之日起15日内起诉，法律另有规定的除外，不套用民事时效中断中止等规则。。复议机关逾期不决定；一般复议法定期限届满之日起15日内起诉，法律另有规定的除外；须区分起诉原行为还是起诉复议不作为，以及相关法定前置与救济规则。。直接起诉；知道或应当知道行政行为作出之日起6个月内。。最长受理期限；不动产案件自行政行为作出超过20年，其他案件超过5年，法院不予受理。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "recusal",
          "title": "回避：人员范围与决定主体不同",
          "explanation": "审判人员、书记员、翻译、鉴定勘验人员等符合利害关系等条件，依法回避。院长任审判长由审判委员会决定，审判人员由院长决定，其他人员由审判长决定，不能只因都属于回避就由同一主体决定。",
          "productionMode": "light-edit",
          "learningGoal": "区分回避：人员范围与决定主体不同的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-7-3"
          ],
          "sourceEvidence": [
            "回避人员；审判人员、书记员、翻译人员、鉴定人、勘验人以及院长。。回避缘由；与本案有利害关系或有其他关系。。回避决定；院长担任审判长由审判委员会决定；审判人员由院长决定；其他人员由审判长决定。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "first-trial",
          "title": "一审审限：一般六个月，简易四十五日",
          "explanation": "行政案件一审一般立案起6个月内判决，特殊情形可依法批准延长；简易程序由一名审判员独任，立案起45日内审结。这里是法院审理期间，不是当事人的起诉期限，程序类型和起算节点不能混用。",
          "productionMode": "light-edit",
          "learningGoal": "区分一审审限：一般六个月，简易四十五日的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-7-4"
          ],
          "sourceEvidence": [
            "一审；一审一般立案之日起6个月内作出判决，特殊情形依法批准延长；简易程序由一名审判员独任，立案之日起45日内审结。裁判依据法律法规、参照规章，不等于规章与法律法规属于同一效力层级。。二审；不服一审判决，送达日起15日内上诉；不服一审裁定为10日内。二审依法全面审查原判裁定和被诉行政行为，一般收到上诉状之日起3个月内作出终审判决，特殊延长依相应批准规则。。再审；对已生效判决、裁定认为确有错误，可向上一级法院申请再审，但原判决、裁定不停止执行。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "appeal",
          "title": "上诉与二审：十五、十日和三个月不同",
          "explanation": "不服一审判决，送达起15日内上诉；不服一审裁定为10日。二审一般收到上诉状起3个月内终审，特殊延长依法批准。上诉期限与法院二审审限的主体和起算节点不同，不能只按某个数字统一计算。",
          "productionMode": "light-edit",
          "learningGoal": "区分上诉与二审：十五、十日和三个月不同的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-7-4"
          ],
          "sourceEvidence": [
            "一审；一审一般立案之日起6个月内作出判决，特殊情形依法批准延长；简易程序由一名审判员独任，立案之日起45日内审结。裁判依据法律法规、参照规章，不等于规章与法律法规属于同一效力层级。。二审；不服一审判决，送达日起15日内上诉；不服一审裁定为10日内。二审依法全面审查原判裁定和被诉行政行为，一般收到上诉状之日起3个月内作出终审判决，特殊延长依相应批准规则。。再审；对已生效判决、裁定认为确有错误，可向上一级法院申请再审，但原判决、裁定不停止执行。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        },
        {
          "id": "retrial",
          "title": "申请再审：不自动停止生效裁判执行",
          "explanation": "对已生效判决、裁定认为确有错误，可以依法向上一级法院申请再审，但申请不自动停止原裁判执行。申请再审与法院已经决定再审或采取停止执行措施，是不同程序状态，不能只因递交申请就认为原判已经失效。",
          "productionMode": "light-edit",
          "learningGoal": "区分申请再审：不自动停止生效裁判执行的主体、依据与法定期间。",
          "sourceUnitIds": [
            "cs-scan-114-165-administrative-litigation-block-7-4"
          ],
          "sourceEvidence": [
            "一审；一审一般立案之日起6个月内作出判决，特殊情形依法批准延长；简易程序由一名审判员独任，立案之日起45日内审结。裁判依据法律法规、参照规章，不等于规章与法律法规属于同一效力层级。。二审；不服一审判决，送达日起15日内上诉；不服一审裁定为10日内。二审依法全面审查原判裁定和被诉行政行为，一般收到上诉状之日起3个月内作出终审判决，特殊延长依相应批准规则。。再审；对已生效判决、裁定认为确有错误，可向上一级法院申请再审，但原判决、裁定不停止执行。"
          ],
          "semanticRevision": 1,
          "review": {
            "admission": "expansion-candidate",
            "sourceFidelity": "self-reviewed",
            "noviceReadability": "stage-level-sampling-deferred",
            "independentFactReview": "pending-independent-review"
          }
        }
      ]
    }
  ],
  "exclusions": [
    {
      "pointId": "administrative-litigation",
      "id": "all-defendant-evidence",
      "title": "被告负举证所以原告无需任何证明",
      "reason": "原告在申请履职和损害等事项仍有举证并有法定例外，不能将合法性证明覆盖全部事实。",
      "requiredEvidence": "需要可直接定位的权威原文、明确适用条件及独立学习目标后，才重新评估该断言是否适合知识导读。",
      "sourceUnitIds": [
        "cs-scan-114-165-administrative-litigation-block-6-2"
      ]
    },
    {
      "pointId": "administrative-litigation",
      "id": "all-review-government-level",
      "title": "政府成为共同被告全部由中级法院受理",
      "reason": "复议共同被告按原行政机关确定级别，不能只看复议机关身份或政府名称。",
      "requiredEvidence": "需要可直接定位的权威原文、明确适用条件及独立学习目标后，才重新评估该断言是否适合知识导读。",
      "sourceUnitIds": [
        "cs-scan-114-165-administrative-litigation-kp-5"
      ]
    },
    {
      "pointId": "administrative-litigation",
      "id": "civil-time-rules",
      "title": "行政起诉期限直接套用民事时效规则",
      "reason": "原资料表题保留用于来源审计，正文与知识卡明确是行政起诉期限，不将两类期间法律效果混同。",
      "requiredEvidence": "需要可直接定位的权威原文、明确适用条件及独立学习目标后，才重新评估该断言是否适合知识导读。",
      "sourceUnitIds": [
        "cs-scan-114-165-administrative-litigation-block-7-2"
      ]
    }
  ],
  "promotion": {
    "strategy": "in-place-golden-promotion",
    "sourceSampleId": "common-sense-guide-golden-v1",
    "pointId": "administrative-litigation",
    "frozenCardIds": [
      "administrative-litigation-concept",
      "administrative-litigation-burden-of-proof"
    ]
  }
};
