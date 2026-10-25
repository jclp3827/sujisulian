module.exports = {
  "schemaVersion": 1,
  "id": "common-sense-guide-expansion-batch-25",
  "title": "知识导读扩库第25批：宏观目标与统计基础",
  "status": "candidate",
  "purpose": "按独立理解目标与完整知识组建设，保留来源定位，区分概念、条件与实例。",
  "groups": [
    {
      "pointId": "macro-control-goals-overview",
      "overview": "宏观调控通常关注经济增长、就业、物价和国际收支等目标。不同目标可能相互联系，也可能在一定阶段存在权衡，需要结合经济条件理解，不能用单一指标代替整体运行状况。",
      "relation": "classification",
      "cards": [
        {
          "id": "four-macro-goals",
          "title": "宏观调控的四项主要目标",
          "explanation": "促进经济增长、增加就业、稳定物价和保持国际收支平衡，是宏观调控常见的四项主要目标。它们分别关注实际产出、劳动市场、一般价格和对外经济状况，不是对同一指标的重复描述。",
          "productionMode": "light-edit",
          "learningGoal": "说出四项宏观目标及其观察对象。",
          "sourceUnitIds": [
            "cs-23-30-p14-macro-goals-overview-list"
          ],
          "sourceEvidence": [
            "宏观调控的目标主要有促进经济增长、增加就业、稳定物价、保持国际收支平衡，其中，促进经济增长是宏观调控最主要的目标。（两增一稳保平衡）"
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
    },
    {
      "pointId": "economic-growth",
      "overview": "经济增长关注实际产出扩大，需求侧常以消费、投资和出口概括。GDP是常住单位的生产成果指标，GNI是常住单位初次收入指标；分析需要明确价格、时期、生产范围及进口扣除。",
      "relation": "classification",
      "cards": [
        {
          "id": "real-output-growth",
          "title": "经济增长与名义金额增加不同",
          "explanation": "经济增长关注实际产出的扩大，通常用剔除价格变动影响的实际GDP增长观察。名义GDP增加可能只是价格上涨，总量GDP增加也不等于人均GDP增加，还需要考虑人口变化。",
          "productionMode": "light-edit",
          "learningGoal": "区分实际增长、名义增加与人均增长。",
          "sourceUnitIds": [
            "cs-23-30-p14-p15-economic-growth-meaning-list"
          ],
          "sourceEvidence": [
            "经济增长指一定时期实际产出的扩大，通常用剔除价格变动影响的实际GDP增长来观察；名义GDP增加可能包含价格上涨因素，总量增长与人均增长还要结合人口变化区分。"
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
          "id": "three-demand-drivers",
          "title": "三驾马车：消费、投资和出口",
          "explanation": "消费、投资和出口常被概括为需求侧的“三驾马车”。消费和投资属于内需，出口联系外需；这一称谓不意味着三项在各时期贡献相同，也不意味着出口额就是GDP核算中的净出口。",
          "productionMode": "light-edit",
          "learningGoal": "说明三驾马车：消费、投资和出口的含义。",
          "sourceUnitIds": [
            "cs-23-30-p15-economic-growth-drivers-list"
          ],
          "sourceEvidence": [
            "“三驾马车”通常指消费、投资和出口，属于需求侧的常用概括，不表示各项贡献相同。。消费和投资属于内需，出口联系外需；支出法核算GDP时，使用最终消费支出、资本形成总额和货物服务净出口，净出口为出口减进口，不能把出口额直接当作净出口。"
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
          "id": "net-export-in-gdp",
          "title": "支出核算为何使用净出口",
          "explanation": "GDP支出核算包括最终消费支出、资本形成总额和货物服务净出口。净出口是出口减进口，扣除进口有助于排除消费、投资等支出中购买的境外产品，不能只把出口额直接加入核算。",
          "productionMode": "synthesized",
          "learningGoal": "说明出口额与净出口在核算中的区别。",
          "sourceUnitIds": [
            "cs-23-30-p15-economic-growth-drivers-list"
          ],
          "sourceEvidence": [
            "“三驾马车”通常指消费、投资和出口，属于需求侧的常用概括，不表示各项贡献相同。。消费和投资属于内需，出口联系外需；支出法核算GDP时，使用最终消费支出、资本形成总额和货物服务净出口，净出口为出口减进口，不能把出口额直接当作净出口。"
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
          "id": "gdp-production",
          "title": "GDP核算什么成果",
          "explanation": "GDP是一个国家或地区所有常住单位一定时期生产活动的最终产品和服务价值。它关注生产成果，既要明确核算时期，也要明确常住单位与生产范围，不按是否已经卖出商品来定义。",
          "productionMode": "light-edit",
          "learningGoal": "说明GDP核算什么成果的含义。",
          "sourceUnitIds": [
            "cs-23-30-p15-gdp-list"
          ],
          "sourceEvidence": [
            "GDP是一个国家或地区所有常住单位在一定时期内生产活动的全部最终产品的价值总和。常住单位依经济利益中心判断，不按所有者国籍简单划分。。GDP的核算要点：。GDP按相应价格口径计量生产成果，既有市场价格直接计量，也有按核算方法估算的非市场产出，不能仅由是否发生买卖判断。。GDP测度的是最终产品的价值，中间产品价值不计入GDP，否则会造成重复计算。。GDP是一定时期内（往往为一年）所生产而不是所售卖掉的最终产品价值。。GDP是计算期内生产的最终产品价值，因而是流量而不是存量。流量是一定时期内发生的变量，存量是一定时点上存在的变量。。纳入核算的生产包括规定范围内的自给性货物、自有住房服务及雇用有酬人员提供的家庭服务；住户无酬家务服务通常不纳入，不能排除全部自给性生产。。GDP按经济领土内常住单位的生产核算，不等于只计算本国国民生产，也不等于物理国境内任何单位均属于本国常住单位。"
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
          "id": "avoid-double-counting",
          "title": "GDP为什么不重复计算中间产品",
          "explanation": "中间产品的价值已经包含在最终产品价值中，核算同一生产链时再单独加入会重复计算。例如核算最终面包价值时，不再把制作面包消耗的面粉价值额外重复相加。",
          "productionMode": "light-edit",
          "learningGoal": "说明GDP为什么不重复计算中间产品的含义。",
          "sourceUnitIds": [
            "cs-23-30-p15-gdp-list"
          ],
          "sourceEvidence": [
            "GDP是一个国家或地区所有常住单位在一定时期内生产活动的全部最终产品的价值总和。常住单位依经济利益中心判断，不按所有者国籍简单划分。。GDP的核算要点：。GDP按相应价格口径计量生产成果，既有市场价格直接计量，也有按核算方法估算的非市场产出，不能仅由是否发生买卖判断。。GDP测度的是最终产品的价值，中间产品价值不计入GDP，否则会造成重复计算。。GDP是一定时期内（往往为一年）所生产而不是所售卖掉的最终产品价值。。GDP是计算期内生产的最终产品价值，因而是流量而不是存量。流量是一定时期内发生的变量，存量是一定时点上存在的变量。。纳入核算的生产包括规定范围内的自给性货物、自有住房服务及雇用有酬人员提供的家庭服务；住户无酬家务服务通常不纳入，不能排除全部自给性生产。。GDP按经济领土内常住单位的生产核算，不等于只计算本国国民生产，也不等于物理国境内任何单位均属于本国常住单位。"
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
          "id": "period-flow",
          "title": "GDP是时期流量",
          "explanation": "GDP是计算期内生产的最终产品价值，因而是流量而不是存量。流量是一定时期内发生的变量，存量是一定时点上存在的变量。",
          "productionMode": "reuse",
          "learningGoal": "区分GDP时期流量与时点存量。",
          "sourceUnitIds": [
            "cs-23-30-p15-gdp-list"
          ],
          "sourceEvidence": [
            "GDP是一个国家或地区所有常住单位在一定时期内生产活动的全部最终产品的价值总和。常住单位依经济利益中心判断，不按所有者国籍简单划分。。GDP的核算要点：。GDP按相应价格口径计量生产成果，既有市场价格直接计量，也有按核算方法估算的非市场产出，不能仅由是否发生买卖判断。。GDP测度的是最终产品的价值，中间产品价值不计入GDP，否则会造成重复计算。。GDP是一定时期内（往往为一年）所生产而不是所售卖掉的最终产品价值。。GDP是计算期内生产的最终产品价值，因而是流量而不是存量。流量是一定时期内发生的变量，存量是一定时点上存在的变量。。纳入核算的生产包括规定范围内的自给性货物、自有住房服务及雇用有酬人员提供的家庭服务；住户无酬家务服务通常不纳入，不能排除全部自给性生产。。GDP按经济领土内常住单位的生产核算，不等于只计算本国国民生产，也不等于物理国境内任何单位均属于本国常住单位。"
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
          "id": "production-boundary",
          "title": "自给性生产是否计入GDP",
          "explanation": "不能把全部非市场或自给性生产排除在GDP之外。规定范围内的自给性货物、自有住房服务以及雇用有酬人员提供的家庭服务可以计入；住户无酬家务服务通常不纳入，判断依据是核算生产边界。",
          "productionMode": "light-edit",
          "learningGoal": "说明自给性生产是否计入GDP的含义。",
          "sourceUnitIds": [
            "cs-23-30-p15-gdp-list"
          ],
          "sourceEvidence": [
            "GDP是一个国家或地区所有常住单位在一定时期内生产活动的全部最终产品的价值总和。常住单位依经济利益中心判断，不按所有者国籍简单划分。。GDP的核算要点：。GDP按相应价格口径计量生产成果，既有市场价格直接计量，也有按核算方法估算的非市场产出，不能仅由是否发生买卖判断。。GDP测度的是最终产品的价值，中间产品价值不计入GDP，否则会造成重复计算。。GDP是一定时期内（往往为一年）所生产而不是所售卖掉的最终产品价值。。GDP是计算期内生产的最终产品价值，因而是流量而不是存量。流量是一定时期内发生的变量，存量是一定时点上存在的变量。。纳入核算的生产包括规定范围内的自给性货物、自有住房服务及雇用有酬人员提供的家庭服务；住户无酬家务服务通常不纳入，不能排除全部自给性生产。。GDP按经济领土内常住单位的生产核算，不等于只计算本国国民生产，也不等于物理国境内任何单位均属于本国常住单位。"
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
          "id": "resident-units",
          "title": "GDP中的常住单位不按国籍判断",
          "explanation": "常住单位按其经济利益中心等核算条件判断。由外国投资者拥有、但属于我国常住单位的企业，其在核算范围内的生产可以计入我国GDP；不能简单把本国国民与常住单位画等号。",
          "productionMode": "light-edit",
          "learningGoal": "说明GDP中的常住单位不按国籍判断的含义。",
          "sourceUnitIds": [
            "cs-23-30-p15-gdp-list"
          ],
          "sourceEvidence": [
            "GDP是一个国家或地区所有常住单位在一定时期内生产活动的全部最终产品的价值总和。常住单位依经济利益中心判断，不按所有者国籍简单划分。。GDP的核算要点：。GDP按相应价格口径计量生产成果，既有市场价格直接计量，也有按核算方法估算的非市场产出，不能仅由是否发生买卖判断。。GDP测度的是最终产品的价值，中间产品价值不计入GDP，否则会造成重复计算。。GDP是一定时期内（往往为一年）所生产而不是所售卖掉的最终产品价值。。GDP是计算期内生产的最终产品价值，因而是流量而不是存量。流量是一定时期内发生的变量，存量是一定时点上存在的变量。。纳入核算的生产包括规定范围内的自给性货物、自有住房服务及雇用有酬人员提供的家庭服务；住户无酬家务服务通常不纳入，不能排除全部自给性生产。。GDP按经济领土内常住单位的生产核算，不等于只计算本国国民生产，也不等于物理国境内任何单位均属于本国常住单位。"
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
          "id": "gni-gnp-income",
          "title": "GNI原称GNP：观察初次收入",
          "explanation": "GNI原称GNP，反映一国常住单位一定时期初次收入分配的最终结果。它等于GDP加来自国外的初次分配收入净额；GDP关注生产，GNI关注收入，“国民”不能直接理解为公民国籍。",
          "productionMode": "light-edit",
          "learningGoal": "说明GNI原称GNP：观察初次收入的含义。",
          "sourceUnitIds": [
            "cs-23-30-p15-gnp-list"
          ],
          "sourceEvidence": [
            "国民总收入（GNI）原称国民生产总值（GNP），反映一国所有常住单位一定时期初次收入分配的最终结果；GNI等于GDP加来自国外的初次分配收入净额。。GDP侧重常住单位的生产成果，GNI侧重常住单位取得的初次收入；常住单位按经济利益中心判断，“国民”不能直接理解为公民国籍。"
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
    },
    {
      "pointId": "full-employment",
      "overview": "就业统计区分就业、失业与非劳动力。调查失业须同时满足无工作、近期求职和能够开始工作，失业率分母包括就业与失业人口；失业类型及充分就业还需要与理论模型的条件分开理解。",
      "relation": "classification",
      "cards": [
        {
          "id": "survey-unemployment",
          "title": "调查失业人口的三个条件",
          "explanation": "按我国劳动力调查口径，失业人口须在参考周没有工作、近期寻找过工作，且有合适工作能够立即开始。只有未工作或一般工作意愿，不一定满足统计失业条件，还须明确相应调查范围。",
          "productionMode": "light-edit",
          "learningGoal": "说出调查失业人口的三项同时成立条件。",
          "sourceUnitIds": [
            "cs-23-30-p15-full-employment-unemployment-meaning-list"
          ],
          "sourceEvidence": [
            "按我国劳动力调查口径，失业人口须在调查参考周没有工作、近期寻找过工作，且有合适工作能够立即开始；仅有工作意愿但没有求职或不能开始工作，不一定计为统计失业。。调查失业率以相应年龄及地区范围内的就业人口与失业人口之和为分母。劳动力不包括全部未就业人口，也不是只包括积极求职者。"
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
          "id": "unemployment-denominator",
          "title": "调查失业率的分子与分母",
          "explanation": "调查失业率是失业人口除以就业人口与失业人口之和。分母是同口径的劳动力人口，包含已经就业的人，不是全部居民，也不是只包括正在求职的人。",
          "productionMode": "light-edit",
          "learningGoal": "说明调查失业率的分子与分母的含义。",
          "sourceUnitIds": [
            "cs-23-30-p16-full-employment-concepts-list"
          ],
          "sourceEvidence": [
            "失业率：。调查失业率为失业人口除以就业人口与失业人口之和；分母为劳动力人口，不是总人口，也不是只包括求职者。。自然失业：。指由于经济中某些难以避免的原因所引起的失业，这种情况下劳动市场处于供求稳定状态。通常包括摩擦性失业和结构性失业两种。。自然失业率：。即自然失业人口与总劳动力人口的比率。。充分就业：。在常用理论模型中，充分就业是不存在周期性失业、实际失业率处于自然失业率附近的状态；摩擦性和结构性失业仍可能存在。自然失业率随结构及制度等条件变化，不采用跨地区跨时期统一的固定百分比。。补充：充分就业不代表失业率为0。"
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
          "id": "friction-structure",
          "title": "摩擦性与结构性失业如何区分",
          "explanation": "摩擦性失业源于劳动者正常流动与寻找岗位所需时间；结构性失业源于劳动力技能、职业或地区分布等与岗位需求不匹配。两者的区别在于正常匹配过程与较持续的结构错配。",
          "productionMode": "light-edit",
          "learningGoal": "说明摩擦性与结构性失业如何区分的含义。",
          "sourceUnitIds": [
            "cs-23-30-p15-p16-full-employment-unemployment-types-list"
          ],
          "sourceEvidence": [
            "按失业的原因：。摩擦性失业是指劳动者在正常流动过程中所产生的失业。。结构性失业是指在经济结构的变化过程中，由于劳动力的供给和对劳动力需求在职业、技能、产业、地区分布等方面的不一致所引起的失业。。季节性失业是指由于季节变化而产生的失业。。周期性失业是指在经济周期中的衰退或萧条阶段因需求下降而造成的失业。。按就业意愿：。自愿失业是经济理论中不愿接受现行工作条件或收入而未受雇的分类；是否计入统计失业，还须核对求职和能否开始工作等调查标准。。非自愿失业通常指愿意按现行工资条件就业却未找到工作，理论分类与统计调查口径不能直接互换。"
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
          "id": "seasonal-cyclical",
          "title": "季节性与周期性失业如何区分",
          "explanation": "季节性失业与季节变化带来的用工波动有关；周期性失业与经济衰退、总需求下降导致的用工减少有关。具体个案可能有多种原因，判断时应识别题干给出的主要机制。",
          "productionMode": "light-edit",
          "learningGoal": "说明季节性与周期性失业如何区分的含义。",
          "sourceUnitIds": [
            "cs-23-30-p15-p16-full-employment-unemployment-types-list"
          ],
          "sourceEvidence": [
            "按失业的原因：。摩擦性失业是指劳动者在正常流动过程中所产生的失业。。结构性失业是指在经济结构的变化过程中，由于劳动力的供给和对劳动力需求在职业、技能、产业、地区分布等方面的不一致所引起的失业。。季节性失业是指由于季节变化而产生的失业。。周期性失业是指在经济周期中的衰退或萧条阶段因需求下降而造成的失业。。按就业意愿：。自愿失业是经济理论中不愿接受现行工作条件或收入而未受雇的分类；是否计入统计失业，还须核对求职和能否开始工作等调查标准。。非自愿失业通常指愿意按现行工资条件就业却未找到工作，理论分类与统计调查口径不能直接互换。"
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
          "id": "full-employment-model",
          "title": "充分就业为何不等于零失业",
          "explanation": "在常用理论模型中，充分就业时周期性失业消失，实际失业率处于自然失业率附近，摩擦性和结构性失业仍可能存在。自然失业率会随经济结构和制度等条件变化，不是普遍固定百分比。",
          "productionMode": "light-edit",
          "learningGoal": "说明充分就业为何不等于零失业的含义。",
          "sourceUnitIds": [
            "cs-23-30-p16-full-employment-concepts-list"
          ],
          "sourceEvidence": [
            "失业率：。调查失业率为失业人口除以就业人口与失业人口之和；分母为劳动力人口，不是总人口，也不是只包括求职者。。自然失业：。指由于经济中某些难以避免的原因所引起的失业，这种情况下劳动市场处于供求稳定状态。通常包括摩擦性失业和结构性失业两种。。自然失业率：。即自然失业人口与总劳动力人口的比率。。充分就业：。在常用理论模型中，充分就业是不存在周期性失业、实际失业率处于自然失业率附近的状态；摩擦性和结构性失业仍可能存在。自然失业率随结构及制度等条件变化，不采用跨地区跨时期统一的固定百分比。。补充：充分就业不代表失业率为0。"
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
          "id": "theory-and-survey",
          "title": "理论失业分类与统计口径不同",
          "explanation": "自愿和非自愿失业是按接受工作条件等意愿区分的理论概念。现实中某人是否计入调查失业人口，还要核对求职和能否开始工作等标准，不能仅凭其自称愿意或不愿意就业直接归类。",
          "productionMode": "light-edit",
          "learningGoal": "说明理论失业分类与统计口径不同的含义。",
          "sourceUnitIds": [
            "cs-23-30-p15-p16-full-employment-unemployment-types-list"
          ],
          "sourceEvidence": [
            "按失业的原因：。摩擦性失业是指劳动者在正常流动过程中所产生的失业。。结构性失业是指在经济结构的变化过程中，由于劳动力的供给和对劳动力需求在职业、技能、产业、地区分布等方面的不一致所引起的失业。。季节性失业是指由于季节变化而产生的失业。。周期性失业是指在经济周期中的衰退或萧条阶段因需求下降而造成的失业。。按就业意愿：。自愿失业是经济理论中不愿接受现行工作条件或收入而未受雇的分类；是否计入统计失业，还须核对求职和能否开始工作等调查标准。。非自愿失业通常指愿意按现行工资条件就业却未找到工作，理论分类与统计调查口径不能直接互换。"
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
    },
    {
      "pointId": "stable-prices",
      "overview": "物价判断需要区分一般与个别、持续与短期、价格水平与变动率。通胀成因不止一种，消费、出厂、购进及批发价格指标对象不同；收入和债务影响还取决于调整、预期与合同条件。",
      "relation": "classification",
      "cards": [
        {
          "id": "inflation-level",
          "title": "通胀：一般价格水平持续上涨",
          "explanation": "通货膨胀指一般价格水平在一段时间内持续上涨，不是某种商品一次涨价。需求扩张、成本上升或供给冲击等都可能推动价格上涨，不能把所有情形都简化为货币超发这一单一直接原因。",
          "productionMode": "light-edit",
          "learningGoal": "区分通胀的价格表现与多种成因。",
          "sourceUnitIds": [
            "cs-23-30-p16-stable-prices-inflation-list"
          ],
          "sourceEvidence": [
            "通货膨胀是一定时期一般价格水平持续上涨的现象，不是某个商品一次涨价。。总需求扩张、生产成本上升或供给冲击等均可能推动价格上涨，货币条件也影响通胀；不能把所有时期和情形都简化为货币超发这一单一直接原因。"
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
          "id": "deflation-level",
          "title": "通缩：一般价格水平持续下降",
          "explanation": "通货紧缩指一般价格水平持续下降。某个商品促销不等于通缩，通胀率下降但仍为正也不等于通缩；判断时需要结合指标范围、比较期和持续时间。",
          "productionMode": "light-edit",
          "learningGoal": "说明通缩：一般价格水平持续下降的含义。",
          "sourceUnitIds": [
            "cs-23-30-p17-stable-prices-deflation-list"
          ],
          "sourceEvidence": [
            "通货紧缩是一般价格水平持续下降，不是某个商品促销或通胀率下降但仍为正。需求不足等可能形成通缩压力，判断还需结合价格指标、持续时间和经济条件，不能把简单供求总量口号当作完整定义。"
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
          "id": "slower-inflation",
          "title": "涨幅放缓不等于价格下降",
          "explanation": "价格水平和价格涨幅是不同概念。正的涨幅变小，表示价格仍在上涨但速度放缓；只有涨幅为负，才表示相应比较期价格水平下降，且单期下降仍不足以独立判断持续通缩。",
          "productionMode": "light-edit",
          "learningGoal": "说明涨幅放缓不等于价格下降的含义。",
          "sourceUnitIds": [
            "cs-23-30-p16-stable-prices-indicators-list"
          ],
          "sourceEvidence": [
            "衡量：。价格指数及其变动率需要明确对象、比较期和统计范围；价格水平上涨与涨幅扩大是不同判断。。消费价格指数（CPI）：。CPI反映居民消费商品与服务价格水平的变动，是观察消费价格的重要指标；同比与上年同期比较，环比与上期比较。。不以缺少统一依据的3%、5%、1%等固定阈值定义通胀或通缩；正涨幅变小通常表示价格仍涨但涨速放缓，不直接等于价格水平下降。。生产价格指数（PPI）：。我国发布的工业生产者出厂价格指数PPI，反映工业产品第一次出售时出厂价格总水平变化；工业生产者购进价格指数另反映原材料、燃料、动力等投入品购进价格。两者不可混为单一投入成本指标。。批发物价指数（WPI）：。通货膨胀测定指标的一种，是根据商品批发价格变动资料所编制，反映不同时期生产资料和消费品批发价格的变动趋势与幅度的相对数。"
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
          "id": "cpi-comparison",
          "title": "CPI及同比、环比的区别",
          "explanation": "CPI反映居民消费商品和服务价格水平变化。同比与上年同期比较，环比与上期比较；同一个月同比上涨、环比下降可以同时出现，因为两者的比较基期不同。",
          "productionMode": "light-edit",
          "learningGoal": "说明CPI及同比、环比的区别的含义。",
          "sourceUnitIds": [
            "cs-23-30-p16-stable-prices-indicators-list"
          ],
          "sourceEvidence": [
            "衡量：。价格指数及其变动率需要明确对象、比较期和统计范围；价格水平上涨与涨幅扩大是不同判断。。消费价格指数（CPI）：。CPI反映居民消费商品与服务价格水平的变动，是观察消费价格的重要指标；同比与上年同期比较，环比与上期比较。。不以缺少统一依据的3%、5%、1%等固定阈值定义通胀或通缩；正涨幅变小通常表示价格仍涨但涨速放缓，不直接等于价格水平下降。。生产价格指数（PPI）：。我国发布的工业生产者出厂价格指数PPI，反映工业产品第一次出售时出厂价格总水平变化；工业生产者购进价格指数另反映原材料、燃料、动力等投入品购进价格。两者不可混为单一投入成本指标。。批发物价指数（WPI）：。通货膨胀测定指标的一种，是根据商品批发价格变动资料所编制，反映不同时期生产资料和消费品批发价格的变动趋势与幅度的相对数。"
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
          "id": "ppi-purchase",
          "title": "PPI出厂价格与购进价格不同",
          "explanation": "我国通常所称PPI是工业生产者出厂价格指数，观察工业产品第一次出售时的出厂价格。购进价格指数另观察原材料、燃料和动力等投入品购进价格，不能把出厂PPI直接定义成全部投入成本。",
          "productionMode": "light-edit",
          "learningGoal": "说明PPI出厂价格与购进价格不同的含义。",
          "sourceUnitIds": [
            "cs-23-30-p16-stable-prices-indicators-list"
          ],
          "sourceEvidence": [
            "衡量：。价格指数及其变动率需要明确对象、比较期和统计范围；价格水平上涨与涨幅扩大是不同判断。。消费价格指数（CPI）：。CPI反映居民消费商品与服务价格水平的变动，是观察消费价格的重要指标；同比与上年同期比较，环比与上期比较。。不以缺少统一依据的3%、5%、1%等固定阈值定义通胀或通缩；正涨幅变小通常表示价格仍涨但涨速放缓，不直接等于价格水平下降。。生产价格指数（PPI）：。我国发布的工业生产者出厂价格指数PPI，反映工业产品第一次出售时出厂价格总水平变化；工业生产者购进价格指数另反映原材料、燃料、动力等投入品购进价格。两者不可混为单一投入成本指标。。批发物价指数（WPI）：。通货膨胀测定指标的一种，是根据商品批发价格变动资料所编制，反映不同时期生产资料和消费品批发价格的变动趋势与幅度的相对数。"
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
          "id": "wpi-wholesale",
          "title": "WPI观察什么价格",
          "explanation": "批发物价指数WPI依据商品批发价格资料编制，反映批发价格的变动趋势与幅度。它与居民消费价格指数的观察环节不同，不能因为都用于观察价格，就认为统计对象和结果相同。",
          "productionMode": "light-edit",
          "learningGoal": "说明WPI观察什么价格的含义。",
          "sourceUnitIds": [
            "cs-23-30-p16-stable-prices-indicators-list"
          ],
          "sourceEvidence": [
            "衡量：。价格指数及其变动率需要明确对象、比较期和统计范围；价格水平上涨与涨幅扩大是不同判断。。消费价格指数（CPI）：。CPI反映居民消费商品与服务价格水平的变动，是观察消费价格的重要指标；同比与上年同期比较，环比与上期比较。。不以缺少统一依据的3%、5%、1%等固定阈值定义通胀或通缩；正涨幅变小通常表示价格仍涨但涨速放缓，不直接等于价格水平下降。。生产价格指数（PPI）：。我国发布的工业生产者出厂价格指数PPI，反映工业产品第一次出售时出厂价格总水平变化；工业生产者购进价格指数另反映原材料、燃料、动力等投入品购进价格。两者不可混为单一投入成本指标。。批发物价指数（WPI）：。通货膨胀测定指标的一种，是根据商品批发价格变动资料所编制，反映不同时期生产资料和消费品批发价格的变动趋势与幅度的相对数。"
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
          "id": "nominal-real-income",
          "title": "名义收入与实际购买力",
          "explanation": "名义收入是以货币金额表示的收入，实际购买力还取决于价格。收入固定且没有随物价充分调整时，涨价会降低购买力；变动收入者是否获益，要比较其收入增幅与相关物价涨幅。",
          "productionMode": "light-edit",
          "learningGoal": "说明名义收入与实际购买力的含义。",
          "sourceUnitIds": [
            "cs-23-30-p17-stable-prices-redistribution-list"
          ],
          "sourceEvidence": [
            "名义收入固定且未随物价充分调整时，价格上涨会降低实际购买力。变动收入是否获益取决于收入增幅是否超过相关物价涨幅，不是所有变动收入者都会受益。。在固定名义债务、未充分指数化且通胀高于订约预期等条件下，偿还金额的实际价值下降，可能使债权人相对受损、债务人相对受益；合同调整和资产负债结构可能改变结果。"
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
          "id": "unexpected-inflation-debt",
          "title": "未预期通胀如何影响固定名义债务",
          "explanation": "在偿还额为固定名义金额、未充分指数化且通胀高于订约预期等条件下，偿还额的实际价值下降，债务人可能相对受益、债权人相对受损。利率、合同调整和资产负债结构可能改变结果。",
          "productionMode": "light-edit",
          "learningGoal": "说明未预期通胀如何影响固定名义债务的含义。",
          "sourceUnitIds": [
            "cs-23-30-p17-stable-prices-redistribution-list"
          ],
          "sourceEvidence": [
            "名义收入固定且未随物价充分调整时，价格上涨会降低实际购买力。变动收入是否获益取决于收入增幅是否超过相关物价涨幅，不是所有变动收入者都会受益。。在固定名义债务、未充分指数化且通胀高于订约预期等条件下，偿还金额的实际价值下降，可能使债权人相对受损、债务人相对受益；合同调整和资产负债结构可能改变结果。"
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
    },
    {
      "pointId": "balance-of-payments",
      "overview": "国际收支记录居民与非居民之间的经济交易，涵盖贸易、收入转移及资本金融等账户。复式记账的表内平衡不同于经济外部均衡，贸易和简化资产净额都不能代替完整账户分析。",
      "relation": "classification",
      "cards": [
        {
          "id": "bop-accounts",
          "title": "国际收支记录哪些交易",
          "explanation": "国际收支记录一定时期居民与非居民之间的经济交易，包括货物服务、初次收入与转移，以及资本和金融等交易。它不限于出口进口，也不能只按交易者公民国籍区分居民与非居民。",
          "productionMode": "light-edit",
          "learningGoal": "说明国际收支覆盖的交易与居民口径。",
          "sourceUnitIds": [
            "cs-23-30-p17-balance-of-payments-meaning-list"
          ],
          "sourceEvidence": [
            "国际收支记录一定时期居民与非居民之间的经济交易，含经常账户及资本金融等交易。复式记账使表内借贷对应，统计还设净误差与遗漏；表内平衡不等于不存在外部失衡，宏观目标不能简单定义为净出口与净资本流出差额为零。。货物与服务净出口为相应出口减进口；它不包括全部跨境初次收入和转移，因而不能代替完整经常账户。。在只考虑两类资产购买、忽略出售偿还等其他交易的简化例子中，净资本流出可按居民购买国外资产减非居民购买本国资产计算。该简化算式不替代完整金融账户，也不单独证明国际收支均衡。"
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
          "id": "book-vs-economic-balance",
          "title": "表内平衡不等于没有外部失衡",
          "explanation": "国际收支采用复式记账，交易在对应项目记录，统计上还设置净误差与遗漏处理数据差异。这种表内平衡不意味着经济上不存在对外失衡，宏观国际收支目标仍需结合完整账户及经济条件判断。",
          "productionMode": "light-edit",
          "learningGoal": "说明表内平衡不等于没有外部失衡的含义。",
          "sourceUnitIds": [
            "cs-23-30-p17-balance-of-payments-meaning-list"
          ],
          "sourceEvidence": [
            "国际收支记录一定时期居民与非居民之间的经济交易，含经常账户及资本金融等交易。复式记账使表内借贷对应，统计还设净误差与遗漏；表内平衡不等于不存在外部失衡，宏观目标不能简单定义为净出口与净资本流出差额为零。。货物与服务净出口为相应出口减进口；它不包括全部跨境初次收入和转移，因而不能代替完整经常账户。。在只考虑两类资产购买、忽略出售偿还等其他交易的简化例子中，净资本流出可按居民购买国外资产减非居民购买本国资产计算。该简化算式不替代完整金融账户，也不单独证明国际收支均衡。"
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
          "id": "exports-not-current-account",
          "title": "净出口不等于全部经常账户",
          "explanation": "货物与服务净出口等于相应出口减进口。经常账户还包含跨境初次收入和转移等项目，因此贸易顺差不自动等于经常账户顺差，不能用净出口代替全部经常账户。",
          "productionMode": "light-edit",
          "learningGoal": "说明净出口不等于全部经常账户的含义。",
          "sourceUnitIds": [
            "cs-23-30-p17-balance-of-payments-meaning-list"
          ],
          "sourceEvidence": [
            "国际收支记录一定时期居民与非居民之间的经济交易，含经常账户及资本金融等交易。复式记账使表内借贷对应，统计还设净误差与遗漏；表内平衡不等于不存在外部失衡，宏观目标不能简单定义为净出口与净资本流出差额为零。。货物与服务净出口为相应出口减进口；它不包括全部跨境初次收入和转移，因而不能代替完整经常账户。。在只考虑两类资产购买、忽略出售偿还等其他交易的简化例子中，净资本流出可按居民购买国外资产减非居民购买本国资产计算。该简化算式不替代完整金融账户，也不单独证明国际收支均衡。"
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
          "id": "limited-capital-formula",
          "title": "资产购买净流出算式的范围",
          "explanation": "仅考虑居民购买国外资产和非居民购买本国资产、忽略出售偿还等其他交易时，可用前者减后者计算简化净流出。这是限定例子的计算，不代表完整金融账户，也不单独证明国际收支均衡。",
          "productionMode": "light-edit",
          "learningGoal": "说明资产购买净流出算式的范围的含义。",
          "sourceUnitIds": [
            "cs-23-30-p17-balance-of-payments-meaning-list"
          ],
          "sourceEvidence": [
            "国际收支记录一定时期居民与非居民之间的经济交易，含经常账户及资本金融等交易。复式记账使表内借贷对应，统计还设净误差与遗漏；表内平衡不等于不存在外部失衡，宏观目标不能简单定义为净出口与净资本流出差额为零。。货物与服务净出口为相应出口减进口；它不包括全部跨境初次收入和转移，因而不能代替完整经常账户。。在只考虑两类资产购买、忽略出售偿还等其他交易的简化例子中，净资本流出可按居民购买国外资产减非居民购买本国资产计算。该简化算式不替代完整金融账户，也不单独证明国际收支均衡。"
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
    },
    {
      "pointId": "macro-control-measures",
      "overview": "宏观调控可运用经济、法律和行政等手段。分类重点在政策通过何种方式影响行为：经济利益引导、法定规则约束或直接行政要求，不能仅因政策由政府作出就全部归为行政手段。",
      "relation": "classification",
      "cards": [
        {
          "id": "economic-incentives",
          "title": "宏观调控的经济手段",
          "explanation": "经济手段通过财政、货币等政策影响成本、收益和资金条件，引导经济参与者调整行为。判断依据是利益和经济条件的调节方式，不能仅因实施主体是政府就把它归为行政命令。",
          "productionMode": "light-edit",
          "learningGoal": "区分经济利益引导与直接行政命令。",
          "sourceUnitIds": [
            "cs-23-30-p17-macro-control-measures-list"
          ],
          "sourceEvidence": [
            "经济手段：。财政政策和货币政策是国家在宏观调控中最常用的经济手段。国家还可以通过制定和实施经济发展战略和规划、收入分配政策、产业政策等，对经济活动参与者进行引导，以实现国民经济持续健康发展。。法律手段：。国家通过制定和运用经济法规等，影响和调节宏观经济，促进国民经济持续健康发展。。行政手段：。国家通过采取具有强制性的行政命令、指示等行政手段，影响和调节宏观经济，促进国民经济持续健康发展。主要包括行政命令、指示、规定、指标、禁止、整顿等。。手段的主辅关系：。宏观调控应该以经济手段和法律手段为主，辅之以必要的行政手段，形成科学的调控体系，充分发挥宏观调控手段的总体功能。"
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
          "id": "legal-measures",
          "title": "宏观调控的法律手段",
          "explanation": "法律手段通过制定和运用相关法律法规明确权利义务、约束经济行为。它强调法定规则的规范作用，与依靠价格、税收等利益变化引导行为的经济手段，观察角度不同。",
          "productionMode": "light-edit",
          "learningGoal": "说明宏观调控的法律手段的含义。",
          "sourceUnitIds": [
            "cs-23-30-p17-macro-control-measures-list"
          ],
          "sourceEvidence": [
            "经济手段：。财政政策和货币政策是国家在宏观调控中最常用的经济手段。国家还可以通过制定和实施经济发展战略和规划、收入分配政策、产业政策等，对经济活动参与者进行引导，以实现国民经济持续健康发展。。法律手段：。国家通过制定和运用经济法规等，影响和调节宏观经济，促进国民经济持续健康发展。。行政手段：。国家通过采取具有强制性的行政命令、指示等行政手段，影响和调节宏观经济，促进国民经济持续健康发展。主要包括行政命令、指示、规定、指标、禁止、整顿等。。手段的主辅关系：。宏观调控应该以经济手段和法律手段为主，辅之以必要的行政手段，形成科学的调控体系，充分发挥宏观调控手段的总体功能。"
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
          "id": "administrative-measures",
          "title": "宏观调控的行政手段",
          "explanation": "行政手段通过具有直接要求和约束性的命令、指示或相关行政措施影响经济活动。它与经济、法律手段可共同作用，分类应依据具体实施方式，而不是把所有政府行为都称为行政手段。",
          "productionMode": "light-edit",
          "learningGoal": "说明宏观调控的行政手段的含义。",
          "sourceUnitIds": [
            "cs-23-30-p17-macro-control-measures-list"
          ],
          "sourceEvidence": [
            "经济手段：。财政政策和货币政策是国家在宏观调控中最常用的经济手段。国家还可以通过制定和实施经济发展战略和规划、收入分配政策、产业政策等，对经济活动参与者进行引导，以实现国民经济持续健康发展。。法律手段：。国家通过制定和运用经济法规等，影响和调节宏观经济，促进国民经济持续健康发展。。行政手段：。国家通过采取具有强制性的行政命令、指示等行政手段，影响和调节宏观经济，促进国民经济持续健康发展。主要包括行政命令、指示、规定、指标、禁止、整顿等。。手段的主辅关系：。宏观调控应该以经济手段和法律手段为主，辅之以必要的行政手段，形成科学的调控体系，充分发挥宏观调控手段的总体功能。"
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
      "pointId": "economic-growth",
      "id": "all-self-production-excluded",
      "title": "全部自给性生产均不计GDP",
      "reason": "我国核算范围包括规定的自给性货物及自有住房服务，不能将全部非市场生产一概排除。",
      "requiredEvidence": "需要可直接定位的权威原文、明确适用条件及独立学习目标后，才重新评估该断言是否适合知识导读。",
      "sourceUnitIds": [
        "cs-23-30-p15-gdp-list"
      ]
    },
    {
      "pointId": "full-employment",
      "id": "universal-natural-rate",
      "title": "自然失业率固定为统一百分比",
      "reason": "自然失业率依模型、经济结构和制度等变化，不使用未经限定的普遍固定数值。",
      "requiredEvidence": "需要可直接定位的权威原文、明确适用条件及独立学习目标后，才重新评估该断言是否适合知识导读。",
      "sourceUnitIds": [
        "cs-23-30-p16-full-employment-concepts-list"
      ]
    },
    {
      "pointId": "stable-prices",
      "id": "fixed-cpi-threshold",
      "title": "固定CPI阈值定义通胀通缩",
      "reason": "价格方向、幅度、持续性和比较期须分别判断，删除低正涨幅直接判定通缩的错误规则。",
      "requiredEvidence": "需要可直接定位的权威原文、明确适用条件及独立学习目标后，才重新评估该断言是否适合知识导读。",
      "sourceUnitIds": [
        "cs-23-30-p16-stable-prices-indicators-list"
      ]
    },
    {
      "pointId": "balance-of-payments",
      "id": "two-net-balance-rule",
      "title": "两个简化净额相等即国际收支均衡",
      "reason": "部分贸易与资产净额不能替代完整账户，记账平衡也不等于经济上的外部均衡。",
      "requiredEvidence": "需要可直接定位的权威原文、明确适用条件及独立学习目标后，才重新评估该断言是否适合知识导读。",
      "sourceUnitIds": [
        "cs-23-30-p17-balance-of-payments-meaning-list"
      ]
    },
    {
      "pointId": "macro-control-goals-overview",
      "id": "universal-primary-ranking",
      "title": "脱离阶段给宏观目标固定排序",
      "reason": "不同目标可能存在权衡，不把未说明语境的目标高低排序纳入本批独立知识卡。",
      "requiredEvidence": "需要可直接定位的权威原文、明确适用条件及独立学习目标后，才重新评估该断言是否适合知识导读。",
      "sourceUnitIds": [
        "cs-23-30-p14-macro-goals-overview-list"
      ]
    }
  ]
};
