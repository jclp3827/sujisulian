# 常识学习入口内容编排矩阵

入口配置是学习内容的显式清单，不代表内容人工批准或考频统计。

## 入口范围与准入数量

| 入口 | 声明问答 | 声明口诀 | 声明对照 | 开发可用问答 | 正式可用问答 |
|---|---:|---:|---:|---:|---:|
| 一问一答 | 603 | 0 | 0 | 603 | 0 |
| 每日常识 | 47 | 0 | 0 | 47 | 0 |
| 常识口诀 | 589 | 128 | 0 | 589 | 0 |
| 易混辨析 | 12 | 0 | 4 | 12 | 0 |
| 考前急救 · 精选回看 | 49 | 0 | 0 | 49 | 0 |
| 考前急救 · 个人待回顾 | 49 | 0 | 0 | 49 | 0 |

开发可用不代表正式可发布。JSON 同时列出口诀/对照的开发和正式数量。个人回顾这一行是可选范围，实际仍须有本人再看记录。

### 一问一答

已开放主题中的明确学习目标，可按领域或主题练习。

- 不代表全书全部考点。
- 未编入本入口的新增主题不会自动出现。

编排方法：least-recent-question

领域问答：文史常识 339；科技常识 64；经济常识 188；法律常识 12

### 每日常识

从本批已编排主题中安排到期回顾与一组新知。

- 不因当天完成而无限追加新题。
- 不以当日题数推定完整领域覆盖或掌握程度。

编排方法：due-review-then-new-theme；总预算 5，到期回顾最多 2

领域问答：文史常识 10；科技常识 13；经济常识 12；法律常识 12

### 常识口诀

每条口诀只覆盖自己的目标清单，逐句理解后可做对应自测。

- 不默认覆盖整节或整章。
- 不适合口诀的目标保留对照学习，不硬凑记法。

编排方法：least-recent-reading；每组最多 5 条

领域问答：文史常识 338；科技常识 63；经济常识 182；法律常识 6

### 易混辨析

只学习已编排完整初判、差异对照和复辨的主题。

- 不把所有问答自动归为易混。
- 只按各对照卡声明的条件与范围比较。

编排方法：rotate-comparison

领域问答：文史常识 3；科技常识 3；经济常识 0；法律常识 6

### 考前急救 · 精选回看

精选回看只从两个已声明急救专题组题；个人待回顾只选本人答错、揭晓或标记再看的内容。

- 精选不代表高频、押题或完整考前范围。
- 个人待回顾为空时不自动换成精选。

编排方法：curated-or-personal-review

领域问答：文史常识 11；科技常识 14；经济常识 12；法律常识 12

### 考前急救 · 个人待回顾

精选回看只从两个已声明急救专题组题；个人待回顾只选本人答错、揭晓或标记再看的内容。

- 精选不代表高频、押题或完整考前范围。
- 个人待回顾为空时不自动换成精选。

编排方法：curated-or-personal-review

领域问答：文史常识 11；科技常识 14；经济常识 12；法律常识 12

## 主题与入口复用

| 主题 | 目标 | 入口 | 口诀决定 |
|---|---|---|---|
| 李杜称号辨析 | poet-immortal、poet-sage、poet-history、poet-titles-cross、poet-sage-history-object | qa、daily、mnemonic、exam:selected、exam:review | 只覆盖本组已声明目标。 |
| 声音的三种特性 | sound-pitch、sound-loudness、sound-timbre、sound-pitch-timbre-scenario、sound-loudness-condition | qa、daily、mnemonic、confusion、exam:selected、exam:review | 三句采用相同句式把题目维度与对应量成对编码，可逐句反解；具备结构记忆价值，但尚无用户记忆试验证据。 |
| 汇率标价先看基准 | fx-direct、fx-indirect、fx-context、fx-direct-scenario、fx-indirect-scenario | qa、daily、mnemonic、exam:selected、exam:review | 可先确定本外币，再判断固定基准；固定外币对应直接、固定本币对应间接，步骤可从题目情境反向还原。 |
| 道、墨、法怎么配 | school-lao、school-mo、school-fa | qa、daily、mnemonic、exam:selected、exam:review | 本组声明目标已有逐句记忆线索，未声明覆盖整个正文。 |
| 三部史书分体例 | history-shiji、history-tongjian、history-hanshu、history-hanshu-genre、history-three-books-contrast | qa、daily、mnemonic、confusion、exam:selected、exam:review | 本组声明目标已有逐句记忆线索，未声明覆盖整个正文。 |
| 影子、倒影与折筷 | light-shadow、light-reflection、light-refraction | qa、daily、mnemonic、exam:selected、exam:review | 三项内容主要是现象名与机制名的直接对应，缺少独立联想机制；保留为三现象速记提纲，不包装成口诀。 |
| 传热三种方式 | heat-conduction、heat-convection、heat-radiation | qa、daily、mnemonic、exam:selected、exam:review | 用“热量搬家”形成统一画面，再以挨着递、流体搬、电磁送三条路线反解传导、对流、辐射；具备结构和联想价值，但尚无用户记忆试验证据。 |
| 先分物质，再看元素 | substance-pure、substance-simple、substance-compound | qa、daily、mnemonic、exam:selected、exam:review | 按“先数物质、再数元素”的决策顺序，用一种/多种的对偶压缩完整分类树；能够双向还原，但尚无用户记忆试验证据。 |
| 需求和供给先分角色 | demand-conditions、supply-conditions、demand-wish | qa、daily、mnemonic、exam:selected、exam:review | 可先锁定时期与价格，再按消费者购买或生产者出售分流，最后核对意愿和能力，形成稳定判断链。 |
| 宏观目标四项对照 | macro-growth、macro-jobs-prices、macro-balance | qa、daily、mnemonic、exam:selected、exam:review | 可用两增、一稳、一平衡的分组恢复四项目标，并单独标记增长最主要与国际收支边界。 |
| 财政与货币政策辨析 | policy-fiscal、policy-monetary、policy-bond-purchase | qa、daily、mnemonic、exam:selected、exam:review | 可先按政府与央行分流，再按预算税收或货币工具识别，最后用买债投放、卖债回笼判断基础方向。 |
| 未成年人行为能力三例 | capacity-under-eight、capacity-eight-plus、capacity-labor | qa、daily、confusion、exam:selected、exam:review | 判断依赖年龄、辨认能力、主要生活来源及行为效力边界；数字压缩会丢失决定性条件，采用三例辨析。 |
| 法定继承顺序与例外 | inherit-first、inherit-second、inherit-inlaw | qa、daily、mnemonic、exam:selected、exam:review | 现有内容按两顺序和特别规则分组，便于快速回看，但主要仍是法律原词压缩，尚无记忆增益试验证据，不标为正式口诀。 |
| 平等、自愿、公平怎么分 | civil-equality、civil-voluntary、civil-fairness | qa、daily、confusion、exam:selected、exam:review | 原则判断依赖具体法律含义和案件条件，关键词口诀容易诱发机械套用；继续使用情境题与易混对照。 |
| 宪法四章顺序 | constitution-first、constitution-second、constitution-fourth | qa、daily、mnemonic、exam:selected、exam:review | 章序和章名具有稳定的一至四顺序，可用短句双向还原；已具结构记忆价值，但尚无用户记忆试验证据。 |
| 四书五经六经怎么分 | classics-four-books-set、classics-five-exclusion、classics-six-addition、classics-five-name、classics-cross-check | qa、mnemonic | 只覆盖本组已声明目标。 |
| 七个国际单位制基本单位 | si-base-count、si-length-mass-time、si-current-temperature、si-amount-luminous、si-base-full-contrast | qa、mnemonic | “米千秒、安开摩坎”仍主要依靠名称首字压缩，缺少稳定的自然联想和独立还原线索；保留有序速记提纲，不包装成口诀。 |
| 八个具名导出单位 | si-derived-frequency-force、si-derived-pressure-energy、si-derived-power-charge、si-derived-voltage-resistance、si-derived-full-contrast | qa、mnemonic | 八组内容本质是物理量与单位的成对清单，强造谐音容易增加歧义；保留四组对照提纲，不包装成口诀。 |
| 四类市场结构怎么分 | market-structure-category-set、market-perfect-competition-core、market-monopolistic-competition-core、market-oligopoly-core、market-monopoly-core | qa、mnemonic | 可按厂商数量、产品差别、进入条件和相互依存形成递减结构，口诀能够反向恢复四类条件。 |
| 三级价格歧视怎么分 | price-discrimination-definition、price-discrimination-first-degree、price-discrimination-second-degree、price-discrimination-third-degree、price-discrimination-three-levels | qa、mnemonic | 可先保留同质不同价的定义前提，再用一逐、二量、三人群稳定区分三级。 |
| 市场失灵的四类因素 | market-failure-factor-monopoly、market-failure-factor-externality、market-failure-factor-public-goods、market-failure-factor-information、market-failure-four-factors-full | qa、mnemonic | 四项之间只有并列清单关系；首字压缩不能帮助还原机制，改为完整术语提纲并诚实标注适用范围。 |
| 垄断为何导致市场失灵 | market-failure-monopoly-definition、market-failure-monopoly-chain、market-failure-monopoly-remedy、market-failure-monopoly-full | qa、mnemonic | 控制供给、调节产量、影响价格到市场失灵具备稳定因果顺序，并可自然接续两项治理示例。 |
| 正负外部性与治理 | market-failure-externality-definition、market-failure-externality-types、market-failure-negative-externality、market-failure-positive-externality、market-failure-externality-full | qa、mnemonic | 先核无关第三方，再按得利或受损区分正负，最后配对补贴或征税，具备稳定判断顺序。 |
| 公共物品为何供给不足 | public-goods-features、public-private-goods-contrast、pure-quasi-public-goods、public-goods-free-rider-remedy、public-goods-full | qa、mnemonic | 两项属性、纯准分类、搭便车、市场供给不足和政府提供可以形成可逆的因果与分类结构。 |
| 信息不对称的两类风险 | information-asymmetry-definition、adverse-selection-before、moral-hazard-after、information-asymmetry-remedy、information-asymmetry-full | qa、mnemonic | 可按交易信息差、交易前逆向选择、交易后道德风险和信息治理形成可逆判断链。 |
| 什么是市场失灵 | market-failure-meaning-direct、market-failure-meaning-scenario | qa | 单一定义本身短且必须完整保留资源有效配置条件，直接理解优于另造口诀。 |
| GDP 与 GNP 核算边界 | gdp-definition-core、gdp-final-intermediate、gdp-flow-produced、gdp-gnp-territory-national、gdp-gnp-full | qa、mnemonic | 五项核算边界与 GDP/GNP 对照适合有限清单回看，但缺少自然记忆钩子，应标为速记提纲。 |
| 三驾马车与内外需 | growth-three-carriages、growth-internal-external-demand、growth-three-carriages-full | qa、mnemonic | 可用‘投资消费在内、出口在外’的空间关系同时还原三项名单和内外需分类。 |
| 失业类型与充分就业 | unemployment-definition、unemployment-types、unemployment-rate、full-employment-not-zero、full-employment-full | qa、mnemonic | 三条件、四原因、比率分母和充分就业边界可按稳定判断顺序及线索对位还原。 |
| 通胀、通缩与价格指数 | inflation-definition、price-indices、inflation-redistribution、deflation-definition、stable-prices-full | qa、mnemonic | 通胀通缩可按价格方向和总供求对照，三类指数可按生活、投入、批发对象映射。 |
| 国际收支三步计算 | bop-balance、net-exports、net-capital-outflow、bop-full | qa、mnemonic | 两个相减公式和差零关系可以按先算两净、再看差零的稳定步骤双向还原。 |
| 宏观调控三类手段 | macro-economic-measure、macro-legal-measure、macro-administrative-measure、macro-measure-priority、macro-measures-full | qa、mnemonic | 政策规划、经济法规、强制命令三类线索和主辅关系可建立一一映射。 |
| 财政政策收入支出与方向 | fiscal-definition、fiscal-income-components、fiscal-spending-types、fiscal-policy-direction、fiscal-policy-full | qa、mnemonic | 主体工具、收入清单、支出交易边界和扩张紧缩方向可按稳定判断顺序还原。 |
| 货币政策工具与方向 | monetary-definition、monetary-tools、monetary-expansion、monetary-contraction、monetary-full | qa、mnemonic | 央行主体、三率同向和债券买卖反向可构成清晰的方向映射。 |
| 三次产业怎么分 | industrial-policy-definition、primary-industry、secondary-industry、tertiary-industry、industrial-structure-full | qa、mnemonic | 政府干预对象以及自然力、加工、流通服务三步判断链可按活动关系还原。 |
| 三次分配怎么分 | income-policy-overview、initial-distribution、redistribution、third-distribution、income-distribution-full | qa、mnemonic | 收入政策关注对象和初分生产、再分政府、三分志愿的主体方式关系清晰。 |
| 顺差逆差看出口 | trade-composition、trade-surplus、trade-deficit、international-trade-full | qa、mnemonic | 进出口构成与出口减进口的正负方向可形成完整比较关系。 |
| 汇率制度先看谁决定 | exchange-rate-meaning、fixed-rate-system、floating-rate-system、managed-floating-system、exchange-rate-system-full | qa、mnemonic | 两币兑换、政府定限幅、市场供求定和我国有管理浮动构成递进判断链。 |
| 本币升贬的条件链 | rate-direction-pair、rate-import-effect、rate-export-effect、rate-capital-effect、rate-effects-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 四类效应辨线索 | effect-ratchet、effect-matthew、effect-marginal、effect-scale、economic-effects-behavior-full | qa、mnemonic | 四类效应可按消费调整、优势差距、新增产出和平均成本四个观察对象完整还原。 |
| 替代收入与挤出 | effect-substitution、effect-income、effect-crowding-out、economic-effects-price-full | qa、mnemonic | 替代、收入和挤出可按换品、购买力和发债利率投资三条作用路径还原。 |
| 选择与成本四概念 | term-nash、term-marginal-utility、term-opportunity-cost、term-sunk-cost、economic-terms-choice-full | qa、mnemonic | 四个概念可按单改收益、新增效用、最佳放弃项和不可回收支出完整还原。 |
| 黑天鹅与灰犀牛 | term-black-swan、term-gray-rhino、economic-terms-risk-full | qa、mnemonic | 黑天鹅与灰犀牛可用难预测罕见和大概率有迹被忽视形成稳定对照。 |
| 曲线与持币三概念 | term-laffer、term-liquidity、term-phillips、economic-terms-curve-full | qa、mnemonic | 三项概念可用拐点、持币代价和短长期时间轴形成有节奏的复述句。 |
| 资源为什么要配置 | resource-allocation-problem、resource-allocation-methods、planned-allocation-definition、planned-allocation-mechanism、resource-allocation-plan-full | qa、mnemonic | 资源约束、两种方式和计划事前调节可形成从问题到方式再到机制的完整链路。 |
| 市场如何配置资源 | market-allocation-meaning、market-mechanisms、market-defects、resource-allocation-market-full | qa、mnemonic | 市场四机制与逐利、信息、时点三个局限原因可形成对应判断。 |
| 市场不只是一处场地 | market-definition、market-four-elements、market-element-roles、market-order-rules、market-definition-elements-full | qa、mnemonic | 市场交换关系可按主体、客体、行为、秩序四问还原，秩序再对应法竞交三类规则。 |
| 企业与组织形式 | enterprise-definition、enterprise-three-forms、enterprise-legal-status、company-two-forms、enterprise-organization-full | qa、mnemonic | 先用经营责任识别企业，再按独资合伙公司分层记忆非法人和法人身份。 |
| 市场体系看分类层级 | market-system-overview、commodity-market、factor-market、market-system-pillars、market-system-full | qa、mnemonic | 两大分类、内部范围和三大支柱可形成完整分类树。 |
| 市场经济三规律 | market-economy-meaning、value-law、competition-law、supply-demand-law、market-economy-laws-full | qa、mnemonic | 以资源配置为入口，再按决定依据、竞争对象和有效需求还原三规律。 |
| 产权主体活动三特征 | market-feature-property、market-feature-equality、market-feature-competition、market-features-foundation-full | qa、mnemonic | 用押韵短句把产权、主体、活动三个对象与判断动作绑定。 |
| 行为体系政府三特征 | market-feature-legality、market-feature-openness、market-feature-limited-government、market-features-order-full | qa、mnemonic | 用守法、开门、守边三个动作绑定行为、体系和政府对象。 |
| 有效市场与有为政府 | socialist-market-meaning、socialist-market-framework、socialist-market-framework-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 需求供给先分主体 | demand-meaning、demand-price-elasticity、supply-meaning、supply-factors、demand-supply-basic-full | qa、mnemonic | 以买家厂家分主体，再用愿且能、量随价和五类供给因素形成判断流程。 |
| 均衡价格与限价 | equilibrium-meaning、equilibrium-price-quantity、equilibrium-price-limits、supply-demand-equilibrium-full | qa、mnemonic | 以相等状态为起点，依次区分价量维度和两类限价位置。 |
| 供求方向与买卖方 | supply-demand-direction、buyer-market、seller-market、supply-demand-market-full | qa、mnemonic | 用需多供少与供多需少两幅对称画面绑定价格方向和交易地位。 |
| 两增一稳保平衡 | macro-goals-list-c523、macro-primary-goal-c523、macro-goals-full-c523 |  | 只覆盖本组已声明目标。 |
| 元谋、北京、山顶洞 | prehistoric-yuanmou、prehistoric-peking-fire、prehistoric-caveman-tech、prehistoric-old-stone-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 五种新石器文化 | prehistoric-hemudu、prehistoric-hongshan-yangshao、prehistoric-dawenkou-longshan、prehistoric-new-stone-region、prehistoric-new-stone-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 炎黄与阪泉涿鹿 | prehistoric-yanhuang、prehistoric-banquan、prehistoric-zhuolu、prehistoric-legend-battles-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 禅让与大禹治水 | prehistoric-abdication、prehistoric-dayu-water、prehistoric-abdication-water-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 启、二里头与鸣条 | xia-qi-hereditary、xia-erlitou、xia-mingtiao、xia-dynasty-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 商汤、迁殷与牧野 | shang-tang-founded、shang-pangeng-yin、shang-muye、shang-dynasty-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 西周建立与灭亡 | western-zhou-founding、western-zhou-hezun、western-zhou-fall、western-zhou-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 春秋战国骨架 | transition-pingwang-east、transition-warring-seven、transition-shangyang、transition-divider、transition-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 西周四制与初税亩 | pre-qin-four-systems、pre-qin-zongfa、pre-qin-tax-mu、pre-qin-institutions-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 铁牛、青铜与三水利 | pre-qin-iron-ox、pre-qin-houmuwu-ding、pre-qin-water-pairs、pre-qin-dujiangyan、pre-qin-economy-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 秦朝建立制度与秦末 | qin-founding、qin-governance、qin-unification、qin-fall-wars、qin-dynasty-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 西汉建立治世与转折 | western-han-founding、wenjing-rule、hanwu-measures、western-han-late、western-han-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 东汉建立中兴与末年 | eastern-han-founding、guangwu-revival、yellow-turban、eastern-han-sequence、eastern-han-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 秦汉农业手工业与水利 | qin-han-agriculture、qin-han-water-blast、qin-han-paper、lingqu、qin-han-economy-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 三国战役与鼎立政权 | guandu-battle、red-cliffs-battle、yiling-battle、three-kingdoms-regimes、three-kingdoms-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 西晋东晋更替 | western-jin-founding、western-jin-fall、eastern-jin-founding、two-jin-sequence、two-jin-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 南北朝政权与孝文改革 | feishui-battle、southern-dynasties、northern-dynasties、xiaowen-reform、northern-southern-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 魏晋南北朝经济线索 | jiangnan-development、period-ceramics、caowei-textile、wu-shu-textile、three-kingdoms-economy-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 五代十国起止与范围 | five-dynasties-start、five-dynasties-sequence、ten-kingdoms、five-dynasties-end、five-dynasties-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 契丹到辽的四节点 | khitan-identity、liao-founding、liao-rename、liao-fall、liao-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 北宋建国改革与灭亡 | northern-song-founding、chanyuan-treaty、northern-song-reforms、northern-song-fall、northern-song-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 西夏建立战争与灭亡 | western-xia-identity、western-xia-founding、song-xia-wars、western-xia-fall、western-xia-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 金朝建立区域与灭亡 | jin-founding、jin-region、jin-capital-name、jin-fall、jin-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 南宋建立和议与灭亡 | southern-song-founding、shaoxing-treaty、jiading-treaty、southern-song-fall、southern-song-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 元朝建立制度与灭亡 | yuan-founding-timeline、yuan-fall、yuan-province-system、yuan-frontier-institutions、yuan-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 宋元社会经济主线 | song-agriculture、song-kilns、song-yuan-industry、song-yuan-commerce、song-yuan-economy-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 明朝建国盛衰与制度 | ming-founding、ming-yongle、ming-mid-events、ming-fall-institutions、ming-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 清朝建立治理与制度 | qing-founding、qing-taiwan、nerchinsk-treaty、qing-reign-institutions、qing-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 明清社会经济三线 | ming-qing-crops、qing-ceramics、ming-capitalism-sprout、ming-qing-economy-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 鸦片战争前后关键节点 | humen-opium、sanyuanli-resistance、nanjing-treaty、open-eyes-world、opium-war-opening-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 太平天国时间与纲领 | taiping-founding、taiping-turn-failure、heavenly-land-system、senior-words、taiping-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 第二次鸦片战争主线 | second-opium-causes、second-opium-treaties、yuanmingyuan、aihun-russia、second-opium-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 洋务运动人物与事业 | self-strengthening-faction、self-strengthening-thought、self-strengthening-industry、self-strengthening-support-outcome、self-strengthening-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 甲午战役与马关条约 | sino-japanese-battles、sino-japanese-sea-control、shimonoseki-treaty、triple-intervention、sino-japanese-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 戊戌变法四节点 | gongche-memorial、hundred-days-reform、imperial-university、six-martyrs、hundred-days-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 义和团到辛丑条约 | boxer-rebellion、eight-nation-alliance、boxer-protocol-terms、boxer-protocol-impact、boxer-alliance-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 辛亥革命组织与思想 | xingzhonghui-core、tongmenghui-core、tongmenghui-platform、three-principles-core、xinhai-organizations-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 辛亥革命进程与影响 | wuchang-uprising-core、republic-result-timeline、second-protection-core、xinhai-impact-boundary、xinhai-process-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 新文化运动兴起与主张 | new-culture-origin、new-culture-propositions、new-culture-chen-cai、new-culture-hu-li、new-culture-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 五四运动力量与意义 | may-fourth-trigger、may-fourth-forces、may-fourth-nature、may-fourth-significance、may-fourth-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 建党基础与中共一大 | cpc-foundations、cpc-first-time-place、cpc-first-delegates、cpc-first-content、cpc-first-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 中共二大与革命纲领 | cpc-second-time-place、cpc-second-high-program、cpc-second-low-program、cpc-second-significance、cpc-second-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 国共合作形成与群众运动 | cpc-third-core、kmt-first-core、cpc-fourth-core、may30-strike-core、national-cooperation-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 北伐与第一次合作破裂 | northern-expedition-core、cooperation-coups、cooperation-break-core、cpc-fifth-core、national-end-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 土地革命早期起义与转折 | nanchang-uprising-core、august-seventh-core、autumn-harvest-core、jinggangshan-core、land-uprisings-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 建军原则与革命根据地 | sanwan-core、gutian-core、cpc-sixth-core、central-soviet-core、land-building-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 红军长征起止与路线 | long-march-start、long-march-finish、long-march-route-water、long-march-route-late、long-march-process-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 遵义会议与长征诗作 | zunyi-team、zunyi-significance、long-march-poem-dates、long-march-poem-lines、zunyi-poems-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 抗战起点与全国抗战 | september-18-core、december-9-core、july-7-core、nanjing-massacre-core、anti-outbreak-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 抗日民族统一战线形成 | wayaobao-core、xian-incident-core、luochuan-core、united-front-formal、anti-front-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 全民族抗战代表性会战 | shanghai-battle-core、pingxingguan-core、taierzhuang-core、wuhan-battle-core、resistance-battles-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 抗战后期、胜利与党内建设 | hundred-regiments-core、war-victory-core、yanan-rectification-core、cpc-seventh-core、anti-later-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 重庆谈判与战略反攻 | chongqing-purpose、double-tenth-core、counteroffensive-actors、counteroffensive-route、liberation-turn-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 战略决战与南京解放 | three-campaigns-core、huaihai-feature、seventh-second-plenum-core、yangtze-campaign-core、liberation-decision-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 新中国成立与政权巩固 | prc-founding-core、land-reform-law-core、land-reform-completion-core、korean-war-line-core、new-china-consolidation-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 和平共处与国际关系 | peaceful-proposal-core、peaceful-content-core、un-seat-core、china-us-nodes-core、new-china-diplomacy-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 一五计划与一化三改 | first-plan-years-core、plan-planning-name-core、one-industrialization-core、three-transformations-core、industrialization-plan-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 1954年宪法与三大改造 | constitution-1954-date-core、constitution-1954-status-core、transformation-completion-core、transformation-significance-core、constitution-transformation-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 十一届三中全会 | third-plenum-time-core、third-plenum-decision-core、third-plenum-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 香港与澳门回归 | hong-kong-return-core、macao-return-core、hong-kong-macao-order-core、hong-kong-macao-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 字书与文学理论之最 | shuowen-author-core、shuowen-status-core、wenxin-author-core、wenxin-status-core、book-lexicon-theory-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 类书与丛书之最 | yongle-author-core、yongle-status-core、siku-author-status-core、siku-four-parts-core、book-collections-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 五礼辨析 | five-rites-jia-ji-core、five-rites-bin-jun-core、five-rites-xiong-core、jia-ji-detail-core、five-rites-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 婚礼六礼 | marriage-nacai-wenming-core、marriage-naji-nazheng-core、marriage-qingqi-qinying-core、marriage-order-core、marriage-six-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 太牢与少牢 | grand-sacrifice-animals-core、grand-sacrifice-context-core、lesser-sacrifice-animals-core、lesser-sacrifice-context-core、grand-lesser-sacrifice-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 丧礼等级称谓 | funeral-emperor-lord-core、funeral-official-scholar-core、funeral-commoner-core、funeral-rank-order-core、funeral-rank-full | qa、mnemonic | 只覆盖本组已声明目标。 |
| 光与可见光基础 | light-electromagnetic-core、light-year-core、visible-light-core、visible-order-core、light-basics-full | qa、mnemonic | “光年量长途”用路程意象解除年=时间的干扰，“红到紫，波短频高”提供单向变化锚点；四句均能反向还原目标。 |
| 红外线与紫外线 | infrared-wavelength-core、infrared-applications-core、ultraviolet-wavelength-core、ultraviolet-applications-core、infrared-ultraviolet-full | qa、mnemonic | “红外在红外、紫外在紫外”用可见光两端建立空间锚点，再以长/短、用途和臭氧形成平行对照，能反向还原而非仅抽取首字。 |
| 直线传播与反射 | light-straight-condition-core、light-straight-examples-core、light-reflection-definition-core、specular-diffuse-core、propagation-reflection-full | qa、mnemonic | 用“同匀—直线、遇界—返回、光滑—排队、粗糙—散开”的连续画面形成可逆结构，并保留影子、小孔、日月食和准直的现象锚点。 |
| 折射、全反射与散射 | light-refraction-definition-core、lens-mirror-functions-core、total-reflection-core、light-scattering-core、refraction-scattering-full | qa、mnemonic | 折射定义、四类器件、全反射条件和散射现象属于四种不同关系，强行压成一句会增加错配；保留按条件与应用分栏的速记提纲。 |
| 海市蜃楼 | mirage-alias-core、mirage-cause-core、mirage-image-core、mirage-locations-core、mirage-full | qa、mnemonic | 别称、成因、像和常见地点是四类异质信息，缺少自然可逆的单一画面；保留四栏核对提纲，避免关键词拼接。 |
| 彩虹与霓 | rainbow-cause-core、rainbow-order-core、secondary-rainbow-core、rainbow-sun-position-core、rainbow-secondary-full | qa、mnemonic | 以阳光进入雨滴为起点，串联主虹与副虹的反射、内外、明暗、色序及太阳相反方位，可从画面反向还原判断条件。 |
| 光与颜料三原色 | light-primary-colors-core、pigment-primary-colors-core、light-color-mixing-core、pigment-color-mixing-core、primary-colors-full | qa、mnemonic | 两套原色与六组混色结果属于并列映射，缺少自然且可逆的语义画面；保留三栏对照，避免制造生硬谐音。 |
| 物体颜色 | transparent-color-core、opaque-color-core、white-black-opaque-core、red-clothes-core、object-colors-full | qa、mnemonic | 可以先按透明性分流，再用透过或反射判断，并用白黑与红衣实例反向核对，具备稳定决策顺序。 |
| 近代史条约辨析 | q1-treaty-quick-recall、q1-treaty-boundary、q1-treaty-material | qa、mnemonic | 三个条约与高辨识度条款存在稳定顺序，可用三段结构锚点反解。 |
| 市场失灵快速辨析 | q1-market-quick-recall、q1-market-boundary、q1-market-application | qa | 四类因素沿用既有速记提纲；机制判断不再强造新口诀。 |

## 逐目标范围与来源

### poet-immortal · review

目标：区分李白的诗仙称号

边界：此题只辨人物称号，不涉及全部作品和生平。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：pre-qin-poetry/li-bai (cs-10-15-p2-p3-li-bai-list)；pre-qin-poetry/du-fu (cs-10-15-p3-du-fu-list)

### poet-sage · review

目标：区分杜甫的诗圣称号

边界：人物称号与诗歌评价要分开记。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：pre-qin-poetry/du-fu (cs-10-15-p3-du-fu-list)；pre-qin-poetry/li-bai (cs-10-15-p2-p3-li-bai-list)

### poet-history · review

目标：区分诗史评价的对象

边界：不能把“诗史”当成官职或字号。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：pre-qin-poetry/du-fu (cs-10-15-p3-du-fu-list)

### sound-pitch · review

目标：由振动频率变化判断音调变化

边界：本题只判断频率与音调的基础对应关系，不讨论振幅、传播距离等其他条件。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：acoustics/sound-characteristics (cs-16-22-p13-sound-characteristics-list)

### sound-loudness · review

目标：在其他条件相同时由振幅变化判断响度

边界：实际听到的响度还会受距离等因素影响，本题已限定这些条件不变。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：acoustics/sound-characteristics (cs-16-22-p13-sound-characteristics-list)

### sound-timbre · review

目标：在音调和响度相同时识别音色的辨声作用

边界：音色用于辨认声音特点，不表示不同乐器在任何情况下音调和响度都相同。

入口：qa、daily、mnemonic、confusion、exam:selected、exam:review

来源：acoustics/sound-characteristics (cs-16-22-p13-sound-characteristics-list)

### fx-direct · review

目标：由固定外币基准判断直接标价法

边界：判断依赖本币观察口径与固定基准，不凭数值大小或交易时点判断。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：exchange-rate-quotation/exchange-rate-quotation (cs-23-30-p22-exchange-rate-quotation-list)

### fx-indirect · review

目标：由固定本币基准判断间接标价法

边界：判断依赖本币观察口径与固定基准，不讨论汇率升降或实际行情。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：exchange-rate-quotation/exchange-rate-quotation (cs-23-30-p22-exchange-rate-quotation-list)

### fx-context · review

目标：识别判断标价法前必须明确本币观察口径

边界：货币在等号哪一边以及数值大小，都不能替代本币身份信息。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：exchange-rate-quotation/exchange-rate-quotation (cs-23-30-p22-exchange-rate-quotation-list)

### school-lao · review

目标：老子与道家对应

边界：本题不涉及道教宗教史，也不穷举道家代表人物。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：traditional-thought-ritual/hundred-schools (cs-10-15-p12-p13-hundred-schools-list)

### school-mo · review

目标：兼爱非攻与墨子对应

边界：这两个词只是墨家部分主张，不能当作完整思想体系。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：traditional-thought-ritual/hundred-schools (cs-10-15-p12-p13-hundred-schools-list)

### school-fa · review

目标：法术势与法家对应

边界：这里辨认古代学派，不把古代法家直接等同于现代法治。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：traditional-thought-ritual/hundred-schools (cs-10-15-p12-p13-hundred-schools-list)

### history-shiji · review

目标：史记为纪传体通史

边界：纪传或编年是叙述体例；通史或断代史是记述范围。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：fiction-history-modern-literature/historiography-works (cs-10-15-p9-historiography-table)

### history-tongjian · review

目标：资治通鉴为编年体通史

边界：本题不借作者信息提示答案，也不扩展到具体记载年代和成书经过。

入口：qa、daily、mnemonic、confusion、exam:selected、exam:review

来源：fiction-history-modern-literature/historiography-works (cs-10-15-p9-historiography-table)

### history-hanshu · review

目标：汉书为纪传体断代史

边界：这里只比较体例与范围，不代替作者、朝代和篇目学习。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：fiction-history-modern-literature/historiography-works (cs-10-15-p9-historiography-table)

### light-shadow · review

目标：由遮挡形成影子的情境识别直线传播

边界：本题限定通常的同种均匀介质情境，不把直线传播表述扩大到所有传播条件。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：optics/light-propagation (cs-16-22-p11-p12-light-propagation-list)

### light-reflection · review

目标：由平静水面倒影识别光的反射

边界：倒影与从空气观察水底物体产生的视位置变化不是同一种现象。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：optics/light-propagation (cs-16-22-p11-p12-light-propagation-list)

### light-refraction · review

目标：由水中筷子看似偏折识别光的折射

边界：这是跨介质传播产生的视觉现象，不表示筷子实际弯曲或折断。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：optics/light-propagation (cs-16-22-p11-p12-light-propagation-list)

### heat-conduction · review

目标：由金属内部相邻部分传热识别热传导

边界：实际场景可能同时存在多种传热方式，本题只判断勺柄变热这一主要过程。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：thermodynamics/heat-transfer (cs-16-22-p13-heat-transfer-table)

### heat-convection · review

目标：由冷热流体循环运动识别热对流

边界：对流要求流体发生宏观运动；锅体内部的传导不是本题所问的水中主要过程。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：thermodynamics/heat-transfer (cs-16-22-p13-heat-transfer-table)

### heat-radiation · review

目标：由真空仍能传热识别热辐射

边界：热辐射不要求两物体直接接触，也不要求存在流体介质。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：thermodynamics/heat-transfer (cs-16-22-p13-heat-transfer-table)

### substance-pure · review

目标：按物质种类区分纯净物与混合物

边界：本层分类看物质种类，不以所含元素种类多少直接判断纯净或混合。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：chemistry/pure-substance (cs-16-22-p16-pure-substance-list)；chemistry/mixture (cs-16-22-p16-mixture-list)

### substance-simple · review

目标：在纯净物内由同种元素组成识别单质

边界：单质可以是金属或非金属；只含一种元素但混有多种物质时仍不是单质。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：chemistry/simple-substance (cs-16-22-p16-simple-substance-list)

### substance-compound · review

目标：在纯净物内由多种元素组成识别化合物

边界：本题只判断纯净物内部的单质与化合物，不继续区分有机物和无机物。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：chemistry/compound (cs-16-22-p16-compound-list)

### demand-conditions · review

目标：在一定时期和价格条件下识别需求的双重条件

边界：还须结合一定时期与价格条件，不能把单纯愿望或生产者出售行为算作需求。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：microeconomics/demand-meaning (cs-23-30-p8-demand-meaning-list)

### supply-conditions · review

目标：在一定时期和价格条件下识别供给的主体和双重条件

边界：已经生产但不愿或不能出售，不直接构成定义中的供给。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：supply-theory/supply-meaning (cs-23-30-p10-supply-meaning-list)

### demand-wish · review

目标：运用需求双重条件排除只有购买愿望的情形

边界：本题只判断经济学概念，不评价个人消费选择或信用状况。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：microeconomics/demand-meaning (cs-23-30-p8-demand-meaning-list)

### macro-growth · review

目标：识别宏观调控四项目标中的最主要目标

边界：最主要不等于唯一目标，也不表示其他目标在任何时期都可以忽略。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：macro-control-goals-overview/macro-goals-overview (cs-23-30-p14-macro-goals-overview-list)

### macro-jobs-prices · review

目标：用两增一稳分组还原增长、就业和物价三项目标

边界：这是四项目标的分组线索，不代表某个时期的具体政策组合。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：macro-control-goals-overview/macro-goals-overview (cs-23-30-p14-macro-goals-overview-list)

### macro-balance · review

目标：区分宏观目标中的国际收支平衡与财政收支平衡

边界：本题只辨目标名称，不判断现实中的国际收支状态或财政预算状况。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：macro-control-goals-overview/macro-goals-overview (cs-23-30-p14-macro-goals-overview-list)

### policy-fiscal · review

目标：由政府预算和税收工具识别财政政策

边界：这里只按主体和工具辨别政策类别，不推断一次措施的全部经济效果。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：fiscal-policy/fiscal-definition (cs-23-30-p17-fiscal-policy-definition-list)

### policy-monetary · review

目标：由中央银行和货币供应量工具识别货币政策

边界：政策类别由主体和工具识别，本题不判断具体调整幅度及现实传导效果。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：monetary-policy/monetary-definition (cs-23-30-p20-monetary-policy-definition-list)

### policy-bond-purchase · review

目标：由央行买入债券和投放货币判断基础扩张方向

边界：这是教材中的基础方向判断，不据此概括某次操作的完整背景和最终效果。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：monetary-policy/monetary-application (cs-23-30-p20-monetary-policy-application-table)

### capacity-under-eight · review

目标：根据八周岁年龄界限判断无民事行为能力

边界：这里只判断民事行为能力；自然人的民事权利能力始于出生，二者不能混同。

入口：qa、daily、confusion、exam:selected、exam:review

来源：civil-subjects/behavior-capacity (cs-31-37-p6-p7-natural-person-behavior-capacity-table)；civil-subjects/rights-capacity (cs-31-37-p5-natural-person-rights-capacity-table)

### capacity-eight-plus · review

目标：根据年龄、辨认能力和劳动收入例外判断限制民事行为能力

边界：限制民事行为能力不等于所有行为都无效；题干也未满足十六周岁以上且以劳动收入为主要生活来源的例外。

入口：qa、daily、confusion、exam:selected、exam:review

来源：civil-subjects/behavior-capacity (cs-31-37-p6-p7-natural-person-behavior-capacity-table)

### capacity-labor · review

目标：在情境中识别十六周岁以上未成年人的劳动收入例外

边界：“视为完全民事行为能力人”不等于年龄上成为成年人；偶尔取得收入也不等于以劳动收入为主要生活来源。

入口：qa、daily、confusion、exam:selected、exam:review

来源：civil-subjects/behavior-capacity (cs-31-37-p6-p7-natural-person-behavior-capacity-table)

### inherit-first · review

目标：完整识别法定继承第一顺序的三类继承人

边界：这是法定继承的一般顺序；子女、父母的法定范围及遗嘱、遗赠扶养协议等另行判断。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：inheritance-methods/statutory-inheritance (cs-31-37-p21-p22-statutory-inheritance-table)

### inherit-second · review

目标：完整识别法定继承第二顺序的三类继承人

边界：本题只判断一般顺序，不据此计算具体份额，也不展开代位继承。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：inheritance-methods/statutory-inheritance (cs-31-37-p21-p22-statutory-inheritance-table)

### inherit-inlaw · review

目标：依据丧偶和尽主要赡养义务两个条件判断姻亲的特别顺序

边界：必须同时保留丧偶和尽主要赡养义务两个条件，不能泛化为所有儿媳、女婿都属于第一顺序。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：inheritance-methods/statutory-inheritance (cs-31-37-p21-p22-statutory-inheritance-table)

### civil-equality · review

目标：在民事关系中识别主体法律地位平等

边界：本题只辨认民事主体法律地位；平等原则不等于双方经济实力、权利义务内容必须完全相同。

入口：qa、daily、confusion、exam:selected、exam:review

来源：civil-basic-principles/civil-principle-1 (cs-31-37-p4-civil-principle-kp-1)

### civil-voluntary · review

目标：在合法边界内识别意思自治所体现的自愿原则

边界：自愿原则受法律和公序良俗约束，不能据此排除强制性规定。

入口：qa、daily、confusion、exam:selected、exam:review

来源：civil-basic-principles/civil-principle-2 (cs-31-37-p4-civil-principle-kp-2)；civil-basic-principles/civil-principle-5 (cs-31-37-p4-civil-principle-kp-5)

### civil-fairness · review

目标：根据权利义务和风险的合理安排识别公平原则

边界：复杂案件可能同时涉及多项原则；本题只根据题干给出的直接判断线索作答。

入口：qa、daily、confusion、exam:selected、exam:review

来源：civil-basic-principles/civil-principle-3 (cs-31-37-p4-civil-principle-kp-3)

### constitution-first · review

目标：根据现行宪法目录识别序言之后的第一章

边界：序言单列在各章之前，不计作第一章。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：constitution-structure/constitution-structure (cs-23-30-p25-constitution-structure-list)

### constitution-second · review

目标：根据现行宪法目录定位公民基本权利和义务

边界：本题只定位章节，不代替具体权利义务条文学习。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：constitution-structure/constitution-structure (cs-23-30-p25-constitution-structure-list)

### constitution-fourth · review

目标：完整识别现行宪法第四章章名的四项内容

边界：国家机构位于第三章；不能从第四章章名中删去国歌或国徽。

入口：qa、daily、mnemonic、exam:selected、exam:review

来源：constitution-structure/constitution-structure (cs-23-30-p25-constitution-structure-list)

### sound-pitch-timbre-scenario · review

目标：在同一情境中区分音调、响度与音色

边界：提高频率不能直接推出响度增大，音色也不会因此消失。

入口：qa、confusion、exam:selected、exam:review

来源：acoustics/sound-characteristics (cs-16-22-p13-sound-characteristics-list)

### sound-loudness-condition · review

目标：用控制变量识别振幅与响度关系的比较条件

边界：同时改变距离或只改变频率，不能单独检验振幅对响度的影响。

入口：qa、daily、mnemonic、confusion、exam:selected、exam:review

来源：acoustics/sound-characteristics (cs-16-22-p13-sound-characteristics-list)

### history-hanshu-genre · review

目标：直接判断汉书的叙述体例

边界：纪传体回答怎样叙述，断代史回答记述范围，二者不是互斥选项。

入口：qa、daily、mnemonic、confusion、exam:selected、exam:review

来源：fiction-history-modern-literature/historiography-works (cs-10-15-p9-historiography-table)

### history-three-books-contrast · review

目标：对照三部史书的体例与范围

边界：本题只对照三部史书的两个分类维度，不检测作者、篇目、记载年代或成书经过。

入口：qa、confusion、exam:selected、exam:review

来源：fiction-history-modern-literature/historiography-works (cs-10-15-p9-historiography-table)

### poet-titles-cross · review

目标：在同一组选项中区分李白与杜甫的称号

边界：本题只对照李白与杜甫的本批称号，不扩展到二人的全部文学评价。

入口：qa、mnemonic

来源：pre-qin-poetry/li-bai (cs-10-15-p2-p3-li-bai-list)；pre-qin-poetry/du-fu (cs-10-15-p3-du-fu-list)

### poet-sage-history-object · review

目标：区分诗圣称人和诗史评诗

边界：本题不讨论具体作品及“诗史”评价形成的文学史过程。

入口：qa、mnemonic

来源：pre-qin-poetry/du-fu (cs-10-15-p3-du-fu-list)

### fx-direct-scenario · review

目标：在明确本外币身份的报价中运用直接标价规则

边界：甲币、乙币只是角色代号；结论不代表真实货币行情。

入口：qa、mnemonic

来源：exchange-rate-quotation/exchange-rate-quotation (cs-23-30-p22-exchange-rate-quotation-list)

### fx-indirect-scenario · review

目标：在明确本外币身份的报价中运用间接标价规则

边界：标价法由本外币身份和固定基准决定，与报价发生在何时无关。

入口：qa、mnemonic

来源：exchange-rate-quotation/exchange-rate-quotation (cs-23-30-p22-exchange-rate-quotation-list)

### classics-four-books-set · review

目标：识别四书完整集合

边界：本题只判断四书集合，不考查作者和篇章内容。

入口：qa、mnemonic

来源：ancient-prose/four-books (cs-1-9-p24-four-books-list)；ancient-prose/five-classics (cs-1-9-p24-five-classics-list)

### classics-five-exclusion · review

目标：从五经中排除《乐》

边界：本题只比较正文中的五经和六经集合，不讨论《乐》的流传情况。

入口：qa、mnemonic

来源：ancient-prose/five-classics (cs-1-9-p24-five-classics-list)；ancient-prose/six-classics (cs-1-9-p24-six-classics-list)

### classics-six-addition · review

目标：比较五经与六经的集合差异

边界：本题不扩展经学史和版本问题。

入口：qa、mnemonic

来源：ancient-prose/five-classics (cs-1-9-p24-five-classics-list)；ancient-prose/six-classics (cs-1-9-p24-six-classics-list)

### classics-five-name · review

目标：由典籍集合判断合称

边界：本题只依据正文中的集合名称作答。

入口：qa、mnemonic

来源：ancient-prose/four-books (cs-1-9-p24-four-books-list)；ancient-prose/five-classics (cs-1-9-p24-five-classics-list)；ancient-prose/six-classics (cs-1-9-p24-six-classics-list)

### classics-cross-check · review

目标：同时辨认四书与五经六经差异

边界：本题只检查三组典籍的集合关系。

入口：qa、mnemonic

来源：ancient-prose/four-books (cs-1-9-p24-four-books-list)；ancient-prose/five-classics (cs-1-9-p24-five-classics-list)；ancient-prose/six-classics (cs-1-9-p24-six-classics-list)

### si-base-count · review

目标：识别国际单位制七个基本单位的数量

边界：这里只问基本单位数量，不把赫兹、牛顿、瓦特等导出单位计入。

入口：qa、mnemonic

来源：physics-other/international-units (cs-16-22-p15-international-units-heading-list)；physics-other/international-units (cs-16-22-p15-si-base-units-table)

### si-length-mass-time · review

目标：把长度、质量、时间与基本单位名称及符号对应

边界：本题识别单位符号，不进行单位换算。

入口：qa、mnemonic

来源：physics-other/international-units (cs-16-22-p15-si-base-units-table)

### si-current-temperature · review

目标：把电流、热力学温度与安培、开尔文对应

边界：不把电压单位伏特当作电流单位，也不讨论摄氏温度与开尔文温度换算。

入口：qa、mnemonic

来源：physics-other/international-units (cs-16-22-p15-si-base-units-table)；physics-other/international-units (cs-16-22-p15-si-derived-units-list)

### si-amount-luminous · review

目标：把物质的量、发光强度与摩尔、坎德拉对应

边界：本题只识别两个基本单位，不扩展流明、勒克斯等光学单位。

入口：qa、mnemonic

来源：physics-other/international-units (cs-16-22-p15-si-base-units-table)；physics-other/international-units (cs-16-22-p15-si-derived-units-list)

### si-base-full-contrast · review

目标：完整复辨七个基本单位并排除导出单位

边界：伏特属于导出单位；质量基本单位是千克，热力学温度基本单位是开尔文。

入口：qa、mnemonic

来源：physics-other/international-units (cs-16-22-p15-international-units-heading-list)；physics-other/international-units (cs-16-22-p15-si-base-units-table)；physics-other/international-units (cs-16-22-p15-si-derived-units-list)

### si-derived-frequency-force · review

目标：把频率、力与赫兹、牛顿对应

边界：本题只识别物理量、单位名称和符号，不考查定义式。

入口：qa、mnemonic

来源：physics-other/international-units (cs-16-22-p15-si-derived-units-list)

### si-derived-pressure-energy · review

目标：把压强、能量与帕斯卡、焦耳对应

边界：本题不进行压强或能量计算。

入口：qa、mnemonic

来源：physics-other/international-units (cs-16-22-p15-si-derived-units-list)

### si-derived-power-charge · review

目标：把功率、电量与瓦特、库仑对应

边界：安培对应电流，是基本单位；本题不推导电学公式。

入口：qa、mnemonic

来源：physics-other/international-units (cs-16-22-p15-si-derived-units-list)

### si-derived-voltage-resistance · review

目标：把电压、电阻与伏特、欧姆对应

边界：本题只识别单位对应，不进行欧姆定律计算。

入口：qa、mnemonic

来源：physics-other/international-units (cs-16-22-p15-si-derived-units-list)

### si-derived-full-contrast · review

目标：综合复辨八个具名导出单位

边界：综合题只复核本主题列出的八个具名导出单位。

入口：qa、mnemonic

来源：physics-other/international-units (cs-16-22-p15-si-derived-units-list)

### market-structure-category-set · review

目标：识别按厂商数量和竞争条件划分的四类市场结构

边界：分类名称只能先建立总框架；识别具体结构还要继续核对厂商数量、产品差别、进入条件和相互依存。

入口：qa、mnemonic

来源：market-structure-overview/market-structure-classification (cs-23-30-p11-market-structure-overview-list)；perfect-competition-market/perfect-competition-conditions (cs-23-30-p11-perfect-competition-conditions-list)；monopolistic-competition-market/monopolistic-conditions (cs-23-30-p11-monopolistic-competition-conditions-list)；oligopoly-market/oligopoly-meaning (cs-23-30-p12-oligopoly-meaning-list)；oligopoly-market/oligopoly-conditions (cs-23-30-p12-oligopoly-conditions-list)；monopoly-market/monopoly-meaning (cs-23-30-p12-monopoly-meaning-list)；monopoly-market/monopoly-conditions (cs-23-30-p12-monopoly-conditions-list)

### market-perfect-competition-core · review

目标：由众多参与者、产品同质和自由进入等条件识别完全竞争

边界：现实市场通常只是接近这些条件，不能因某个农产品案例就断言其完全满足全部条件。

入口：qa、mnemonic

来源：market-structure-overview/market-structure-classification (cs-23-30-p11-market-structure-overview-list)；perfect-competition-market/perfect-competition-conditions (cs-23-30-p11-perfect-competition-conditions-list)

### market-monopolistic-competition-core · review

目标：由企业众多、产品有差别且容易进入识别垄断竞争

边界：本题按市场存在条件判断，不把广告、包装等具体竞争手段当成唯一依据。

入口：qa、mnemonic

来源：market-structure-overview/market-structure-classification (cs-23-30-p11-market-structure-overview-list)；monopolistic-competition-market/monopolistic-conditions (cs-23-30-p11-monopolistic-competition-conditions-list)

### market-oligopoly-core · review

目标：由少数厂商、进入较难和决策相互依存识别寡头垄断

边界：寡头产品可以同质，也可以有差别，不能仅凭产品差别排除寡头垄断。

入口：qa、mnemonic

来源：market-structure-overview/market-structure-classification (cs-23-30-p11-market-structure-overview-list)；oligopoly-market/oligopoly-meaning (cs-23-30-p12-oligopoly-meaning-list)；oligopoly-market/oligopoly-conditions (cs-23-30-p12-oligopoly-conditions-list)

### market-monopoly-core · review

目标：由唯一卖者、无近似替代品和进入障碍识别完全垄断

边界：唯一卖者与少数卖者含义不同；价格歧视是另一主题，不能用来替代市场结构判断。

入口：qa、mnemonic

来源：market-structure-overview/market-structure-classification (cs-23-30-p11-market-structure-overview-list)；monopoly-market/monopoly-meaning (cs-23-30-p12-monopoly-meaning-list)；monopoly-market/monopoly-conditions (cs-23-30-p12-monopoly-conditions-list)

### price-discrimination-definition · review

目标：保留同等级同质量前提识别价格歧视

边界：质量、成本或服务内容不同造成的价差不能直接套用该定义；本题也不评价具体行为是否合法。

入口：qa、mnemonic

来源：monopoly-market/monopoly-price-discrimination (cs-23-30-p12-monopoly-price-discrimination-list)

### price-discrimination-first-degree · review

目标：由逐单位按最高支付意愿定价识别一级价格歧视

边界：这里只识别分级标准，不讨论实现这种定价所需的信息条件及福利结果。

入口：qa、mnemonic

来源：monopoly-market/monopoly-price-discrimination (cs-23-30-p12-monopoly-price-discrimination-list)

### price-discrimination-second-degree · review

目标：由消费数量段差别定价识别二级价格歧视

边界：判断依据是数量段，不是逐单位探知个人最高支付意愿，也不是按市场或人群划分。

入口：qa、mnemonic

来源：monopoly-market/monopoly-price-discrimination (cs-23-30-p12-monopoly-price-discrimination-list)

### price-discrimination-third-degree · review

目标：由不同市场或消费群差别定价识别三级价格歧视

边界：市场或人群必须能被区分；本题不判断现实分组是否合理、合法或能够持续。

入口：qa、mnemonic

来源：monopoly-market/monopoly-price-discrimination (cs-23-30-p12-monopoly-price-discrimination-list)

### price-discrimination-three-levels · review

目标：综合还原一逐二量三人群的三级分法

边界：三级划分须先保留同等级同质量而对不同接受者定价的定义前提。

入口：qa、mnemonic

来源：monopoly-market/monopoly-price-discrimination (cs-23-30-p12-monopoly-price-discrimination-list)

### market-failure-factor-monopoly · review

目标：由一个或少数大企业控制生产销售识别垄断因素

边界：这里先完成四因素分类；垄断的作用链和治理方式在独立主题中继续学习。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-overview (cs-23-30-p13-market-failure-factors-overview-list)；market-failure-factors/market-failure-monopoly (cs-23-30-p13-market-failure-monopoly-list)

### market-failure-factor-externality · review

目标：由经济活动影响无关第三方识别外部性因素

边界：第三方是未直接参与该交易，不是与经济活动毫无联系；仅有一般影响或正常价格变化不足以认定外部性。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-overview (cs-23-30-p13-market-failure-factors-overview-list)；market-failure-factors/market-failure-externality (cs-23-30-p13-market-failure-externality-list)

### market-failure-factor-public-goods · review

目标：由非竞争性和非排他性识别公共物品因素

边界：本题只定位因素名称，不展开纯公共物品、准公共物品、搭便车和政府供给。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-overview (cs-23-30-p13-market-failure-factors-overview-list)；market-failure-factors/market-failure-public-goods (cs-23-30-p14-market-failure-public-goods-list)

### market-failure-factor-information · review

目标：由交易者掌握信息不同识别信息不对称因素

边界：本题只做因素分类，不展开逆向选择、道德风险和信息调控。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-overview (cs-23-30-p13-market-failure-factors-overview-list)；market-failure-factors/market-failure-information (cs-23-30-p14-market-failure-information-asymmetry-list)

### market-failure-four-factors-full · review

目标：完整复辨市场失灵四类因素

边界：完整名单只建立入口框架，不能替代四类因素各自条件和作用机制的学习。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-overview (cs-23-30-p13-market-failure-factors-overview-list)

### market-failure-monopoly-definition · review

目标：识别垄断所要求的独占或联合控制条件

边界：企业规模较大或商品价格较高，都不能单独替代生产和销售的控制条件。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-monopoly (cs-23-30-p13-market-failure-monopoly-list)

### market-failure-monopoly-chain · review

目标：还原垄断控制供给到市场机制失灵的作用链

边界：链路起点是对供给的控制，不能看到高价就跳过控制供给和调节产量两个环节。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-monopoly (cs-23-30-p13-market-failure-monopoly-list)

### market-failure-monopoly-remedy · review

目标：识别限制垄断的两项治理示例

边界：区分市场结构分析与违法行为认定，本题不裁定具体案件。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-monopoly (cs-23-30-p13-market-failure-monopoly-list)

### market-failure-monopoly-full · review

目标：综合判断垄断条件、作用链和治理示例

边界：规模大或价格上涨都不是充分条件，应回到生产销售控制及完整作用链判断。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-monopoly (cs-23-30-p13-market-failure-monopoly-list)

### market-failure-externality-definition · review

目标：由经济活动影响无关第三方识别外部性

边界：不把充分内部化的成本收益或正常价格变化直接判作外部性。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-externality (cs-23-30-p13-market-failure-externality-list)

### market-failure-externality-types · review

目标：按无关第三方获得利益或承担成本区分正负外部性

边界：正负依据第三方实际获得的利益或承担的成本判断，不依据行为者的主观动机。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-externality (cs-23-30-p13-market-failure-externality-list)

### market-failure-negative-externality · review

目标：由未补偿第三方成本识别负外部性及征税方向

边界：本题只识别治理方向，不计算税额，也不判断现实案件中的责任和程序。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-externality (cs-23-30-p13-market-failure-externality-list)

### market-failure-positive-externality · review

目标：由第三方受益而行为者未获收益识别正外部性及补贴方向

边界：本题只识别治理方向，不计算补贴额，也不把所有社会受益情形都直接归入正外部性。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-externality (cs-23-30-p13-market-failure-externality-list)

### market-failure-externality-full · review

目标：综合复辨第三方条件、正负分类与治理方向

边界：先核对未直接参与交易的第三方及未内部化的成本收益；征税和补贴不是各类情形的强制固定答案。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-externality (cs-23-30-p13-market-failure-externality-list)

### public-goods-features · review

目标：识别严格意义公共物品的非竞争性和非排他性

边界：两项特征需要同时保留；不能仅凭物品名称或公共机构提供就直接判断。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-public-goods (cs-23-30-p14-market-failure-public-goods-list)

### public-private-goods-contrast · review

目标：对照严格公共物品与私人物品的两项属性

边界：这里采用严格公共物品与私人物品的基本对照，不扩展公共资源、俱乐部物品等其他类型。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-public-goods (cs-23-30-p14-market-failure-public-goods-list)

### pure-quasi-public-goods · review

目标：由两项特征是否完整区分纯公共物品与准公共物品

边界：本题只识别分类规则，不判断存在争议的具体物品应归入哪一类。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-public-goods (cs-23-30-p14-market-failure-public-goods-list)

### public-goods-free-rider-remedy · review

目标：还原公共物品搭便车、市场供给不足到政府提供的链路

边界：不能把供给不足说成绝无供给，也不能把政府承担责任说成必须亲自完成全部生产。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-public-goods (cs-23-30-p14-market-failure-public-goods-list)

### public-goods-full · review

目标：综合判断公共物品属性、分类和供给不足机制

边界：综合判断仍须区分纯公共物品和准公共物品，不据名称裁定具体物品归类。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-public-goods (cs-23-30-p14-market-failure-public-goods-list)

### information-asymmetry-definition · review

目标：由交易参与者掌握的信息不同识别信息不对称

边界：定义限于交易语境，不把一般知识差异或价格变化直接称为信息不对称。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-information (cs-23-30-p14-market-failure-information-asymmetry-list)

### adverse-selection-before · review

目标：由交易前信息差和差品挤出好品识别逆向选择

边界：结合交易前隐藏质量或类型的条件判断，不仅凭发生时间判断，也不认为所有市场都会出现优质商品退出。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-information (cs-23-30-p14-market-failure-information-asymmetry-list)

### moral-hazard-after · review

目标：由交易后隐藏行为利己损他识别道德风险

边界：不能把所有交易后损失都称为道德风险，还需存在信息不对称和相应行为条件。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-information (cs-23-30-p14-market-failure-information-asymmetry-list)

### information-asymmetry-remedy · review

目标：识别材料列举的信息调控治理方向

边界：这里只识别治理方向，不展开具体披露制度、监管程序和责任规则。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-information (cs-23-30-p14-market-failure-information-asymmetry-list)

### information-asymmetry-full · review

目标：综合区分逆向选择与道德风险的阶段和机制

边界：事前和事后是通常阶段，还必须结合各自的信息条件和行为机制判断。

入口：qa、mnemonic

来源：market-failure-factors/market-failure-information (cs-23-30-p14-market-failure-information-asymmetry-list)

### market-failure-meaning-direct · review

目标：识别市场失灵的资源配置定义

边界：价格正常调整或个别企业利润变化本身不等于市场失灵。

入口：qa

来源：market-failure-meaning/market-failure-meaning (cs-23-30-p12-market-failure-meaning-list)

### market-failure-meaning-scenario · review

目标：由市场机制无法有效配置资源识别市场失灵

边界：本题只识别定义，不据此判断具体由垄断、外部性、公共物品还是信息不对称造成。

入口：qa

来源：market-failure-meaning/market-failure-meaning (cs-23-30-p12-market-failure-meaning-list)

### gdp-definition-core · review

目标：识别 GDP 定义的地域、时期、生产、最终产品和市场价值要素

边界：不按公民国籍或是否直接发生买卖简单判断GDP生产范围。

入口：qa、mnemonic

来源：economic-growth/economic-growth-gdp (cs-23-30-p15-gdp-list)

### gdp-final-intermediate · review

目标：由避免重复计算理解 GDP 只计最终产品

边界：这里说明最终产品口径，不展开增加值核算、存货处理等复杂案例。

入口：qa、mnemonic

来源：economic-growth/economic-growth-gdp (cs-23-30-p15-gdp-list)

### gdp-flow-produced · review

目标：识别 GDP 的时期流量和生产口径

边界：本题只检验时期、生产和流量口径，不处理具体存货核算方法。

入口：qa、mnemonic

来源：economic-growth/economic-growth-gdp (cs-23-30-p15-gdp-list)

### gdp-gnp-territory-national · review

目标：区分 GDP 地域口径与 GNP 国民口径

边界：常住单位按经济利益中心判断，不单凭生产者或所有者国籍判断。

入口：qa、mnemonic

来源：economic-growth/economic-growth-gdp (cs-23-30-p15-gdp-list)；economic-growth/economic-growth-gnp (cs-23-30-p15-gnp-list)

### gdp-gnp-full · review

目标：综合复辨 GDP 核算边界和 GNP 对照

边界：中间产品不重复计入，自给性货物、自有住房服务等按核算边界处理。

入口：qa、mnemonic

来源：economic-growth/economic-growth-gdp (cs-23-30-p15-gdp-list)；economic-growth/economic-growth-gnp (cs-23-30-p15-gnp-list)

### growth-three-carriages · review

目标：识别拉动经济增长的三驾马车

边界：该称谓不表示三项在各时期贡献相同，也不用于判断现实排序。

入口：qa、mnemonic

来源：economic-growth/economic-growth-drivers (cs-23-30-p15-economic-growth-drivers-list)

### growth-internal-external-demand · review

目标：区分三驾马车中的内需与外需

边界：本题只识别材料中的分类，不展开净出口核算和需求贡献率。

入口：qa、mnemonic

来源：economic-growth/economic-growth-drivers (cs-23-30-p15-economic-growth-drivers-list)

### growth-three-carriages-full · review

目标：综合复辨三驾马车名单与内外需对应

边界：不据这一基础分类推断某一时期的实际贡献大小。

入口：qa、mnemonic

来源：economic-growth/economic-growth-drivers (cs-23-30-p15-economic-growth-drivers-list)

### unemployment-definition · review

目标：识别失业主体的能力、意愿和无工作三项条件

边界：区分就业、失业和非劳动力，不把全部未就业者都计入失业。

入口：qa、mnemonic

来源：full-employment/unemployment-meaning (cs-23-30-p15-full-employment-unemployment-meaning-list)

### unemployment-types · review

目标：按主要原因区分摩擦性、结构性、季节性和周期性失业

边界：复杂现实个案可能有多重原因，本题按题干给出的主要原因判断。

入口：qa、mnemonic

来源：full-employment/unemployment-types (cs-23-30-p15-p16-full-employment-unemployment-types-list)

### unemployment-rate · review

目标：识别失业率的分子与劳动力人口分母

边界：分子分母须采用一致的年龄、地区和调查口径。

入口：qa、mnemonic

来源：full-employment/employment-measure (cs-23-30-p15-full-employment-measure-list)；full-employment/unemployment-concepts (cs-23-30-p16-full-employment-concepts-list)

### full-employment-not-zero · review

目标：理解充分就业不等于零失业

边界：不把自然失业率视作固定百分比，也不由此推断所有其他资源均被充分利用。

入口：qa、mnemonic

来源：full-employment/unemployment-concepts (cs-23-30-p16-full-employment-concepts-list)

### full-employment-full · review

目标：综合复辨失业定义、类型、比率和充分就业边界

边界：不采用固定自然失业率，也不对复杂个案作唯一失业类型裁定。

入口：qa、mnemonic

来源：full-employment/unemployment-meaning (cs-23-30-p15-full-employment-unemployment-meaning-list)；full-employment/unemployment-types (cs-23-30-p15-p16-full-employment-unemployment-types-list)；full-employment/employment-measure (cs-23-30-p15-full-employment-measure-list)；full-employment/unemployment-concepts (cs-23-30-p16-full-employment-concepts-list)

### inflation-definition · review

目标：由持续普遍上涨和总需求大于总供给识别通货膨胀

边界：个别商品一次涨价不足以构成定义，也不使用固定 CPI 阈值判断。

入口：qa、mnemonic

来源：stable-prices/stable-prices-inflation (cs-23-30-p16-stable-prices-inflation-list)

### price-indices · review

目标：区分 CPI、PPI 和 WPI 的基本统计对象

边界：本题只区分基本对象，不使用某一时点指数值或固定阈值。

入口：qa、mnemonic

来源：stable-prices/stable-prices-indicators (cs-23-30-p16-stable-prices-indicators-list)

### inflation-redistribution · review

目标：识别通胀再分配的一般方向

边界：通胀若已被利率、指数化或其他条款充分补偿，或资产负债结构不同，结果可能改变。

入口：qa

来源：stable-prices/stable-prices-redistribution (cs-23-30-p17-stable-prices-redistribution-list)

### deflation-definition · review

目标：由一般物价持续下降和总供给大于总需求识别通货紧缩

边界：个别商品短期降价不等于通货紧缩。

入口：qa、mnemonic

来源：stable-prices/stable-prices-deflation (cs-23-30-p17-stable-prices-deflation-list)

### stable-prices-full · review

目标：综合复辨通胀通缩、指数对象和再分配方向

边界：不使用固定指数阈值，也不据一般方向裁定具体合同结果。

入口：qa、mnemonic

来源：stable-prices/stable-prices-inflation (cs-23-30-p16-stable-prices-inflation-list)；stable-prices/stable-prices-indicators (cs-23-30-p16-stable-prices-indicators-list)；stable-prices/stable-prices-redistribution (cs-23-30-p17-stable-prices-redistribution-list)；stable-prices/stable-prices-deflation (cs-23-30-p17-stable-prices-deflation-list)

### bop-balance · review

目标：由净出口与净资本流出的差额识别国际收支平衡

边界：纠正旧题将简化恒等关系当作完整国际收支均衡定义的错误；保留题目ID并递增语义修订。

入口：qa、mnemonic

来源：balance-of-payments/balance-of-payments-meaning (cs-23-30-p17-balance-of-payments-meaning-list)

### net-exports · review

目标：按出口减进口计算净出口

边界：保持出口减进口的方向，不据此推断汇率或经济增长。

入口：qa、mnemonic

来源：balance-of-payments/balance-of-payments-meaning (cs-23-30-p17-balance-of-payments-meaning-list)

### net-capital-outflow · review

目标：按本国居民买外国资产减外国人买本国资产计算净资本流出

边界：资产交易可涉及购入、出售及偿还等其他方向，本题明确排除这些交易后才使用简化算式。

入口：qa、mnemonic

来源：balance-of-payments/balance-of-payments-meaning (cs-23-30-p17-balance-of-payments-meaning-list)

### bop-full · review

目标：综合复辨净出口、净资本流出及平衡关系

边界：不以净出口与简化净流出的差额为零作为完整国际收支均衡的充分条件。

入口：qa、mnemonic

来源：balance-of-payments/balance-of-payments-meaning (cs-23-30-p17-balance-of-payments-meaning-list)

### macro-economic-measure · review

目标：由财政货币政策和规划引导识别经济手段

边界：本题只识别手段类别，不评价具体政策效果。

入口：qa、mnemonic

来源：macro-control-measures/macro-control-measures (cs-23-30-p17-macro-control-measures-list)

### macro-legal-measure · review

目标：由制定运用经济法规识别法律手段

边界：法规是法律手段线索；本题不讨论具体立法程序。

入口：qa、mnemonic

来源：macro-control-measures/macro-control-measures (cs-23-30-p17-macro-control-measures-list)

### macro-administrative-measure · review

目标：由强制命令指示禁止整顿识别行政手段

边界：识别手段类别不等于判断某项具体行政行为是否合法。

入口：qa、mnemonic

来源：macro-control-measures/macro-control-measures (cs-23-30-p17-macro-control-measures-list)

### macro-measure-priority · review

目标：识别经济法律手段为主和必要行政手段为辅的关系

边界：行政手段是必要补充，并非被排除；主辅关系也不表示具体政策永远采用同一比例。

入口：qa、mnemonic

来源：macro-control-measures/macro-control-measures (cs-23-30-p17-macro-control-measures-list)

### macro-measures-full · review

目标：综合复辨三类手段的线索和主辅关系

边界：本题不评价具体政策效果，也不判断具体行政行为合法性。

入口：qa、mnemonic

来源：macro-control-measures/macro-control-measures (cs-23-30-p17-macro-control-measures-list)

### fiscal-definition · review

目标：由政府主体和预算税收工具识别财政政策

边界：本题识别政策类别，不把央行货币供应量工具混入财政政策。

入口：qa、mnemonic

来源：fiscal-policy/fiscal-definition (cs-23-30-p17-fiscal-policy-definition-list)

### fiscal-income-components · review

目标：区分财政广义筹资与一般公共预算本级收入口径

边界：不因宽口径清单包含债就断言所有教材分类均错误，也不把债务融资混同非偿还性收入。

入口：qa、mnemonic

来源：fiscal-policy/fiscal-income (cs-23-30-p18-fiscal-policy-income-list)

### fiscal-spending-types · review

目标：按有无相应商品劳务交换区分政府购买和转移支付

边界：领取后的消费用途不改变这笔财政支出在支付环节的分类。

入口：qa、mnemonic

来源：fiscal-policy/fiscal-spending (cs-23-30-p18-fiscal-policy-spending-list)

### fiscal-policy-direction · review

目标：在需求不足等条件下识别财政税支的基础扩张方向

边界：不把衰退等同通缩，不从工具方向直接保证政策成效或固定乘数。

入口：qa、mnemonic

来源：fiscal-policy/fiscal-application (cs-23-30-p19-fiscal-policy-application-table)

### fiscal-policy-full · review

目标：综合复辨财政政策主体工具收入支出与方向

边界：按税支和资金用途等分析取向，不以发债量、领域名称或固定经济状态标签直接下结论。

入口：qa、mnemonic

来源：fiscal-policy/fiscal-definition (cs-23-30-p17-fiscal-policy-definition-list)；fiscal-policy/fiscal-income (cs-23-30-p18-fiscal-policy-income-list)；fiscal-policy/fiscal-spending (cs-23-30-p18-fiscal-policy-spending-list)；fiscal-policy/fiscal-application (cs-23-30-p19-fiscal-policy-application-table)

### monetary-definition · review

目标：由中央银行与流动性利率工具识别货币政策

边界：识别主体与工具；目标、传导及效果要分别判断。

入口：qa、mnemonic

来源：monetary-policy/monetary-definition (cs-23-30-p20-monetary-policy-definition-list)

### monetary-tools · review

目标：由央行买卖有价证券识别公开市场业务

边界：本题只识别工具，不扩展当前货币政策操作框架。

入口：qa、mnemonic

来源：monetary-policy/monetary-tools (cs-23-30-p20-monetary-policy-tools-list)

### monetary-expansion · review

目标：在其他条件不变时判断支持流动性的工具方向

边界：准备金率是比例而非借款利率，衰退与通缩不能等同。

入口：qa、mnemonic

来源：monetary-policy/monetary-application (cs-23-30-p20-monetary-policy-application-table)

### monetary-contraction · review

目标：在其他条件不变时判断收紧方向及政策条件

边界：本题比较工具的局部机制，不据此认定某次现实整体政策立场。

入口：qa、mnemonic

来源：monetary-policy/monetary-application (cs-23-30-p20-monetary-policy-application-table)

### monetary-full · review

目标：综合复辨货币政策主体工具和扩张紧缩方向

边界：结合经济条件、交易类型与其他对冲，不把三率同向比较当作普遍强制规律。

入口：qa、mnemonic

来源：monetary-policy/monetary-definition (cs-23-30-p20-monetary-policy-definition-list)；monetary-policy/monetary-tools (cs-23-30-p20-monetary-policy-tools-list)；monetary-policy/monetary-application (cs-23-30-p20-monetary-policy-application-table)

### industrial-policy-definition · review

目标：由政府主体和干预产业形成发展识别产业政策

边界：本题识别定义，不评价具体产业政策效果。

入口：qa、mnemonic

来源：industrial-policy/industrial-definition (cs-23-30-p20-industrial-policy-definition-list)

### primary-industry · review

目标：由利用自然力和农林牧渔识别第一产业

边界：按行业活动及统计规定判断，不能只看是否服务农业或涉及自然资源。

入口：qa、mnemonic

来源：industrial-policy/industrial-structure (cs-23-30-p20-industrial-policy-structure-list)

### secondary-industry · review

目标：由对原料加工和制造建筑等识别第二产业

边界：不只按是否加工或是否涉及工业认定产业类别。

入口：qa、mnemonic

来源：industrial-policy/industrial-structure (cs-23-30-p20-industrial-policy-structure-list)

### tertiary-industry · review

目标：由流通服务和不生产物质产品识别第三产业

边界：服务业也创造经济价值，不按简单物质/非物质二分替代统计分类。

入口：qa、mnemonic

来源：industrial-policy/industrial-structure (cs-23-30-p20-industrial-policy-structure-list)

### industrial-structure-full · review

目标：综合复辨产业政策定义和三次产业判断链

边界：不处理统计分类调整、边界行业争议或具体政策成效。

入口：qa、mnemonic

来源：industrial-policy/industrial-definition (cs-23-30-p20-industrial-policy-definition-list)；industrial-policy/industrial-structure (cs-23-30-p20-industrial-policy-structure-list)

### income-policy-overview · review

目标：识别收入分配政策的关注对象和常用手段

边界：本题只识别材料列举的基本手段，不评价具体标准。

入口：qa、mnemonic

来源：income-distribution-policy/income-policy-overview (cs-23-30-p21-income-distribution-overview-list)

### initial-distribution · review

目标：由生产部门自主和市场形成要素价格识别初次分配

边界：与政府税收社保调节、自愿慈善公益区分，核算口径须明确。

入口：qa、mnemonic

来源：income-distribution-policy/income-distribution-stages (cs-23-30-p21-income-distribution-stages-list)

### redistribution · review

目标：由政府调节初次所得和重公平识别再分配

边界：本题识别主体和阶段，不扩展具体税制。

入口：qa、mnemonic

来源：income-distribution-policy/income-distribution-stages (cs-23-30-p21-income-distribution-stages-list)

### third-distribution · review

目标：由志愿捐赠和慈善公益识别第三次分配

边界：强制税收不属于第三次分配。

入口：qa、mnemonic

来源：income-distribution-policy/income-distribution-stages (cs-23-30-p21-income-distribution-stages-list)

### income-distribution-full · review

目标：综合复辨收入政策和三次分配的主体方式

边界：不扩展具体税制、固定比例或来源可疑的基尼系数阈值。

入口：qa、mnemonic

来源：income-distribution-policy/income-policy-overview (cs-23-30-p21-income-distribution-overview-list)；income-distribution-policy/income-distribution-stages (cs-23-30-p21-income-distribution-stages-list)

### trade-composition · review

目标：由跨越国境的商品和服务交换识别进出口贸易构成

边界：本题识别进出口基本构成，不展开服务贸易统计口径。

入口：qa、mnemonic

来源：international-trade/international-trade-meaning (cs-23-30-p22-international-trade-meaning-list)

### trade-surplus · review

目标：由出口额大于进口额识别顺差和出超

边界：本题只判断差额方向和名称，不评价顺差的利弊。

入口：qa、mnemonic

来源：international-trade/international-trade-balance (cs-23-30-p22-international-trade-balance-list)

### trade-deficit · review

目标：由出口额小于进口额识别逆差和入超

边界：本题只判断差额方向和名称，不评价逆差的利弊。

入口：qa、mnemonic

来源：international-trade/international-trade-balance (cs-23-30-p22-international-trade-balance-list)

### international-trade-full · review

目标：综合复辨进出口构成和顺逆差方向

边界：不依据顺逆差名称直接判断一国经济状况。

入口：qa、mnemonic

来源：international-trade/international-trade-meaning (cs-23-30-p22-international-trade-meaning-list)；international-trade/international-trade-balance (cs-23-30-p22-international-trade-balance-list)

### exchange-rate-meaning · review

目标：由两种货币兑换关系识别汇率含义

边界：本题识别概念，不涉及实时汇率数值。

入口：qa、mnemonic

来源：exchange-rate-system/exchange-rate-meaning (cs-23-30-p22-exchange-rate-meaning-list)

### fixed-rate-system · review

目标：由政府制定公布和限幅波动识别固定汇率制

边界：按制度机制和相应时点判断，不仅凭单次干预或中间价公告分类。

入口：qa、mnemonic

来源：exchange-rate-system/exchange-rate-systems (cs-23-30-p22-exchange-rate-systems-list)

### floating-rate-system · review

目标：由市场供求决定并可在必要时干预识别浮动汇率制

边界：浮动不等于管理部门在任何情形下都不干预。

入口：qa、mnemonic

来源：exchange-rate-system/exchange-rate-systems (cs-23-30-p22-exchange-rate-systems-list)

### managed-floating-system · review

目标：识别我国现行人民币汇率制度的完整表述

边界：本题只识别制度基本表述，不解释实时汇率变化或具体调控操作。

入口：qa、mnemonic

来源：exchange-rate-system/exchange-rate-systems (cs-23-30-p22-exchange-rate-systems-list)

### exchange-rate-system-full · review

目标：综合复辨汇率含义及固定浮动制度线索

边界：浮动汇率允许必要管理；本题不涉及实时汇率和政策效果。

入口：qa、mnemonic

来源：exchange-rate-system/exchange-rate-meaning (cs-23-30-p22-exchange-rate-meaning-list)；exchange-rate-system/exchange-rate-systems (cs-23-30-p22-exchange-rate-systems-list)

### rate-direction-pair · review

目标：固定标价口径后识别本币升贬值

边界：必须先固定标价对象和观察口径，不能只看到数字升降就判断本币升贬。

入口：qa、mnemonic

来源：exchange-rate-effects/exchange-rate-effects (cs-23-30-p22-exchange-rate-effects-table)

### rate-import-effect · review

目标：由外币计价成本识别本币贬值对进口的基础影响

边界：这是其他条件不变时的直接换算效应；实际进口量还受需求、合同、替代品和时滞影响。

入口：qa、mnemonic

来源：exchange-rate-effects/exchange-rate-effects (cs-23-30-p22-exchange-rate-effects-table)

### rate-export-effect · review

目标：识别本币贬值对出口价格竞争力的条件性影响

边界：出口数量和贸易余额仍受需求弹性、定价方式、进口投入、关税和时滞等因素影响。

入口：qa、mnemonic

来源：exchange-rate-effects/exchange-rate-effects (cs-23-30-p22-exchange-rate-effects-table)

### rate-capital-effect · review

目标：识别汇率与跨境资本流动之间不存在单因素必然关系

边界：题目否定单因素必然推断，不否认汇率预期可能影响资本流动。

入口：qa、mnemonic

来源：exchange-rate-effects/exchange-rate-effects (cs-23-30-p22-exchange-rate-effects-table)

### rate-effects-full · review

目标：综合复辨标价口径、进口成本、出口竞争力和资本流动边界

边界：基础方向用于概念判断，不替代对具体国家、时期、商品和资本项目的实证分析。

入口：qa、mnemonic

来源：exchange-rate-effects/exchange-rate-effects (cs-23-30-p22-exchange-rate-effects-table)

### effect-ratchet · review

目标：由消费水平向下调整困难识别棘轮效应

边界：该效应描述消费习惯的调整特点，不表示消费行为不可改变。

入口：qa、mnemonic

来源：economic-effects/effect-ratchet (cs-23-30-p23-ratchet-effect-list)

### effect-matthew · review

目标：由既有优势累积和强弱差距扩大识别马太效应

边界：本题只识别累积优势机制，不评价具体平台或群体。

入口：qa、mnemonic

来源：economic-effects/effect-matthew (cs-23-30-p23-matthew-effect-list)

### effect-marginal · review

目标：由新增投入带来的新增产出减少识别边际产出递减

边界：边际产出下降不等于总产出立即下降，且结论以超过适宜投入水平为条件。

入口：qa、mnemonic

来源：economic-effects/effect-marginal (cs-23-30-p23-marginal-effect-list)

### effect-scale · review

目标：由产量扩大和平均成本下降识别规模效应

边界：平均成本下降有适用范围，不表示产量扩大后成本会持续下降。

入口：qa、mnemonic

来源：economic-effects/effect-scale (cs-23-30-p23-scale-effect-list)

### economic-effects-behavior-full · review

目标：综合复辨棘轮马太边际和规模四种机制

边界：边际与规模都可能出现“下降”，须区分新增产出与平均成本这两个观察对象。

入口：qa、mnemonic

来源：economic-effects/effect-ratchet (cs-23-30-p23-ratchet-effect-list)；economic-effects/effect-matthew (cs-23-30-p23-matthew-effect-list)；economic-effects/effect-marginal (cs-23-30-p23-marginal-effect-list)；economic-effects/effect-scale (cs-23-30-p23-scale-effect-list)

### effect-substitution · review

目标：由相对价格变化后转向替代品识别替代效应

边界：本题不讨论收入变化造成的购买力效应。

入口：qa、mnemonic

来源：economic-effects/effect-substitution (cs-23-30-p23-substitution-effect-list)

### effect-income · review

目标：由价格变化改变实际购买力识别收入效应

边界：没有出现转向相对便宜替代品的线索时，不据此判断替代效应。

入口：qa、mnemonic

来源：economic-effects/effect-income (cs-23-30-p23-income-effect-list)

### effect-crowding-out · review

目标：由政府发债推升利率并压低私人投资识别挤出效应

边界：该链路以其他条件不变等假设为前提，不直接判断具体财政政策的净效果。

入口：qa、mnemonic

来源：economic-effects/effect-crowding-out (cs-23-30-p23-p24-crowding-out-effect-list)

### economic-effects-price-full · review

目标：综合复辨替代收入和挤出三种作用路径

边界：结果词相近不能替代对作用起点和传导路径的判断。

入口：qa、mnemonic

来源：economic-effects/effect-substitution (cs-23-30-p23-substitution-effect-list)；economic-effects/effect-income (cs-23-30-p23-income-effect-list)；economic-effects/effect-crowding-out (cs-23-30-p23-p24-crowding-out-effect-list)

### term-nash · review

目标：由无人能通过单独改变策略获益识别纳什均衡

边界：本题只识别均衡条件，不计算具体博弈的均衡解。

入口：qa、mnemonic

来源：economic-terms/term-nash (cs-23-30-p24-nash-equilibrium-list)

### term-marginal-utility · review

目标：由连续消费时每新增单位效用增量下降识别边际效用递减

边界：边际效用下降不等于总效用立即下降。

入口：qa、mnemonic

来源：economic-terms/term-marginal-utility (cs-23-30-p24-diminishing-marginal-utility-list)

### term-opportunity-cost · review

目标：由作出选择时放弃的最佳替代方案价值识别机会成本

边界：比较对象是被放弃方案中的最佳一项，不是所有放弃项价值相加。

入口：qa、mnemonic

来源：economic-terms/term-opportunity-cost (cs-23-30-p24-opportunity-cost-list)

### term-sunk-cost · review

目标：由已经支付且无法收回识别沉没成本

边界：识别沉没成本不等于替当事人决定是否参加演出。

入口：qa、mnemonic

来源：economic-terms/term-sunk-cost (cs-23-30-p24-sunk-cost-list)

### economic-terms-choice-full · review

目标：综合复辨纳什边际效用机会成本和沉没成本

边界：不得把增量与总量、最佳放弃项与所有备选项相互混淆。

入口：qa、mnemonic

来源：economic-terms/term-nash (cs-23-30-p24-nash-equilibrium-list)；economic-terms/term-marginal-utility (cs-23-30-p24-diminishing-marginal-utility-list)；economic-terms/term-opportunity-cost (cs-23-30-p24-opportunity-cost-list)；economic-terms/term-sunk-cost (cs-23-30-p24-sunk-cost-list)

### term-black-swan · review

目标：由难预测罕见且影响重大识别黑天鹅事件

边界：不能仅凭影响重大就认定黑天鹅，还需同时观察难预测和不寻常。

入口：qa、mnemonic

来源：economic-terms/term-black-swan (cs-23-30-p24-black-swan-list)

### term-gray-rhino · review

目标：由大概率有迹象却被忽视识别灰犀牛事件

边界：有预警信号并不表示危机一定发生，本题只作风险类型识别。

入口：qa、mnemonic

来源：economic-terms/term-gray-rhino (cs-23-30-p24-gray-rhino-list)

### term-laffer · review

目标：识别税率与税收收入的非单调关系

边界：曲线不提供通用的具体峰值，也不能据此断言某次减税会自行弥补收入。

入口：qa、mnemonic

来源：economic-terms/term-laffer (cs-23-30-p24-laffer-curve-list)

### term-liquidity · review

目标：由使用灵活性和利息机会成本识别流动偏好

边界：流动偏好是持币动机，不等同于利率降至下限后的流动性陷阱。

入口：qa、mnemonic

来源：economic-terms/term-liquidity (cs-23-30-p24-liquidity-preference-list)

### term-phillips · review

目标：识别菲利普斯曲线的短期条件与长期边界

边界：长期菲利普斯曲线通常被描述为垂直，不能把短期关系当作长期稳定替代。

入口：qa、mnemonic

来源：economic-terms/term-phillips (cs-23-30-p24-phillips-curve-list)

### economic-terms-risk-full · review

目标：综合对照黑天鹅与灰犀牛的可预见性和概率线索

边界：现实事件可能存在争议，本题按概念核心特征判断。

入口：qa、mnemonic

来源：economic-terms/term-black-swan (cs-23-30-p24-black-swan-list)；economic-terms/term-gray-rhino (cs-23-30-p24-gray-rhino-list)

### economic-terms-curve-full · review

目标：综合复辨拉弗流动偏好和菲利普斯边界

边界：三个概念的变量、动机和适用时间不能互换，也不用于直接预测现实数值。

入口：qa、mnemonic

来源：economic-terms/term-laffer (cs-23-30-p24-laffer-curve-list)；economic-terms/term-liquidity (cs-23-30-p24-liquidity-preference-list)；economic-terms/term-phillips (cs-23-30-p24-phillips-curve-list)

### resource-allocation-problem · review

目标：由资源相对有限和需要多样识别资源配置问题

边界：需要可以不断发展，不等于每一种具体需求都没有边界。

入口：qa、mnemonic

来源：market-economy/resource-allocation-overview (cs-23-30-p2-resource-allocation-overview-list)

### resource-allocation-methods · review

目标：识别计划配置与市场配置两种主要方式

边界：两种方式可以共同存在，不应理解为彼此排斥。

入口：qa、mnemonic

来源：market-economy/resource-allocation-overview (cs-23-30-p2-resource-allocation-overview-list)

### planned-allocation-definition · review

目标：由政府计划部门依据社会需要和可能配置资源识别计划配置

边界：本题识别主体、依据和机制，不评价具体计划成效。

入口：qa、mnemonic

来源：planned-allocation/planned-definition (cs-23-30-p2-planned-allocation-definition-list)

### planned-allocation-mechanism · review

目标：由计划指标经济杠杆政策和事前调节识别计划机制

边界：不把材料中的个别历史举例当作恒定判断规则。

入口：qa、mnemonic

来源：planned-allocation/planned-mechanism (cs-23-30-p2-planned-mechanism-list)

### resource-allocation-plan-full · review

目标：综合复辨资源配置原因方式与计划机制

边界：本题不评价某一配置方式在具体领域的优劣。

入口：qa、mnemonic

来源：market-economy/resource-allocation-overview (cs-23-30-p2-resource-allocation-overview-list)；planned-allocation/planned-definition (cs-23-30-p2-planned-allocation-definition-list)；planned-allocation/planned-mechanism (cs-23-30-p2-planned-mechanism-list)

### market-allocation-meaning · review

目标：由价格、供求和竞争等分散决策识别市场配置

边界：区分市场配置方式与调节可能滞后的局限，不考比喻的著作出处。

入口：qa、mnemonic

来源：market-allocation/market-meaning (cs-23-30-p3-market-allocation-meaning-list)

### market-mechanisms · review

目标：识别供求价格竞争风险构成的市场机制

边界：题目要求识别核心机制，不要求复述各机制全部定义。

入口：qa、mnemonic

来源：market-allocation/market-mechanism (cs-23-30-p3-market-mechanism-list)

### market-defects · review

目标：区分逐利不当行为、信息不足与生产调整时间差

边界：逐利动机、信息不足与调整时间差是不同判断线索；三者可能同时出现，盲目性不直接等于滞后性的原因。

入口：qa、mnemonic

来源：market-allocation/market-defects (cs-23-30-p3-p4-market-defects-list)

### resource-allocation-market-full · review

目标：综合复辨市场配置机制及自发盲目滞后局限

边界：市场调节三类局限与市场失灵的外部性、公共物品等因素属于不同归纳层次。

入口：qa、mnemonic

来源：market-allocation/market-meaning (cs-23-30-p3-market-allocation-meaning-list)；market-allocation/market-mechanism (cs-23-30-p3-market-mechanism-list)；market-allocation/market-defects (cs-23-30-p3-p4-market-defects-list)

### market-definition · review

目标：由商品服务交换关系总和识别市场且不拘固定场所

边界：本题识别市场基础含义，不讨论具体平台监管。

入口：qa、mnemonic

来源：market-definition-elements/market-definition (cs-23-30-p4-market-meaning-list)

### market-four-elements · review

目标：识别市场主体客体行为和秩序四要素

边界：四要素用于分析市场构成，不代表市场体系的分类层级。

入口：qa、mnemonic

来源：market-definition-elements/market-elements (cs-23-30-p4-market-elements-list)

### market-element-roles · review

目标：能把参与者商品服务交易活动和规则分别归入四要素

边界：同一主体可能兼具不同身份，题目按所述交易角色判断。

入口：qa、mnemonic

来源：market-definition-elements/market-elements (cs-23-30-p4-market-elements-list)

### market-order-rules · review

目标：识别市场准入、竞争和交易规则

边界：本题识别规则类型，不展开具体法律条文。

入口：qa、mnemonic

来源：market-definition-elements/market-elements (cs-23-30-p4-market-elements-list)

### market-definition-elements-full · review

目标：综合复辨市场含义四要素和秩序规则

边界：市场四要素与市场体系两大分类属于不同分析层次。

入口：qa、mnemonic

来源：market-definition-elements/market-definition (cs-23-30-p4-market-meaning-list)；market-definition-elements/market-elements (cs-23-30-p4-market-elements-list)

### enterprise-definition · review

目标：由经营目的要素投入和责任核算识别企业

边界：经济学概括不代替具体市场主体的法定设立条件。

入口：qa、mnemonic

来源：enterprise-organization/enterprise-meaning (cs-23-30-p4-enterprise-meaning-list)

### enterprise-three-forms · review

目标：识别基础经济学中的三类企业组织形式

边界：这是学习分类，不穷尽现行登记制度中的市场主体类型。

入口：qa、mnemonic

来源：enterprise-organization/enterprise-forms (cs-23-30-p4-p5-enterprise-forms-list)

### enterprise-legal-status · review

目标：区分非法人组织与营利法人

边界：本题只辨主体资格，不展开普通合伙、有限合伙及个别责任规则。

入口：qa、mnemonic

来源：enterprise-organization/enterprise-forms (cs-23-30-p4-p5-enterprise-forms-list)

### company-two-forms · review

目标：识别现行公司法中的两类公司

边界：本题不考股东人数、出资期限、股份转让等动态法律细节。

入口：qa、mnemonic

来源：enterprise-organization/enterprise-forms (cs-23-30-p4-p5-enterprise-forms-list)

### enterprise-organization-full · review

目标：综合复辨企业经济特征组织形式与法律身份

边界：经济学分类与法律主体身份相关但层次不同，不能直接互换。

入口：qa、mnemonic

来源：enterprise-organization/enterprise-meaning (cs-23-30-p4-enterprise-meaning-list)；enterprise-organization/enterprise-forms (cs-23-30-p4-p5-enterprise-forms-list)

### market-system-overview · review

目标：识别商品市场和生产要素市场两大分类

边界：两大分类不要与市场体系三大支柱混淆。

入口：qa、mnemonic

来源：market-system-composition/market-system-overview (cs-23-30-p6-market-system-overview-list)

### commodity-market · review

目标：识别消费品市场和生产资料市场构成商品市场

边界：资本、劳动力、技术和信息属于生产要素市场范围。

入口：qa、mnemonic

来源：market-system-composition/commodity-market (cs-23-30-p6-commodity-market-list)

### factor-market · review

目标：完整识别资本劳动力技术信息房地产五类要素市场

边界：三大支柱不是生产要素市场的完整清单。

入口：qa、mnemonic

来源：market-system-composition/factor-market (cs-23-30-p6-factor-market-list)

### market-system-pillars · review

目标：识别商品资本劳动力市场三大支柱

边界：三大支柱不等于两大分类，也不等于全部要素市场。

入口：qa、mnemonic

来源：market-system-composition/market-pillars (cs-23-30-p6-market-pillars-list)

### market-system-full · review

目标：综合复辨两大分类内部范围和三大支柱

边界：分类、子类和支柱是不同层级，不能相互替换。

入口：qa、mnemonic

来源：market-system-composition/market-system-overview (cs-23-30-p6-market-system-overview-list)；market-system-composition/commodity-market (cs-23-30-p6-commodity-market-list)；market-system-composition/factor-market (cs-23-30-p6-factor-market-list)；market-system-composition/market-pillars (cs-23-30-p6-market-pillars-list)

### market-economy-meaning · review

目标：由资源协调方式识别市场经济

边界：市场配置资源并不排除必要的宏观调控和规则约束。

入口：qa、mnemonic

来源：market-economy-meaning/market-economy-definition (cs-23-30-p6-market-economy-meaning-list)

### value-law · review

目标：区分社会必要劳动时间与个别劳动时间

边界：本题考查价值决定依据，不展开市场价格围绕价值波动的全部机制。

入口：qa、mnemonic

来源：market-economy-laws/value-law (cs-23-30-p6-value-law-list)

### competition-law · review

目标：由主体争取经济利益识别竞争规律

边界：竞争规律说明竞争关系，不代表具体竞争行为都符合法律规范。

入口：qa、mnemonic

来源：market-economy-laws/competition-law (cs-23-30-p6-competition-law-list)

### supply-demand-law · review

目标：识别有效需求与价格调节的供求关系

边界：供求趋向平衡是动态过程，现实价格还受成本、预期等因素影响。

入口：qa、mnemonic

来源：market-economy-laws/supply-demand-law (cs-23-30-p6-p7-supply-demand-law-list)

### market-economy-laws-full · review

目标：综合区分市场经济含义与三条基本规律

边界：三条规律在市场运行中相互联系，题目只检验基础概念与识别线索。

入口：qa、mnemonic

来源：market-economy-meaning/market-economy-definition (cs-23-30-p6-market-economy-meaning-list)；market-economy-laws/value-law (cs-23-30-p6-value-law-list)；market-economy-laws/competition-law (cs-23-30-p6-competition-law-list)；market-economy-laws/supply-demand-law (cs-23-30-p6-p7-supply-demand-law-list)

### market-feature-property · review

目标：由权属边界识别产权确定性

边界：本题识别权属边界，不评价某一具体企业制度安排。

入口：qa、mnemonic

来源：market-economy-features/market-feature-1 (cs-23-30-p7-market-feature-property-list)

### market-feature-equality · review

目标：由自愿协商识别主体平等性

边界：主体平等指市场地位和交易自主，不表示经营能力或结果相同。

入口：qa、mnemonic

来源：market-economy-features/market-feature-2 (cs-23-30-p7-market-feature-equality-list)

### market-feature-competition · review

目标：由优胜劣汰识别活动竞争性

边界：竞争应在法律和市场秩序规则内进行。

入口：qa、mnemonic

来源：market-economy-features/market-feature-3 (cs-23-30-p7-market-feature-competition-list)

### market-features-foundation-full · review

目标：综合复辨产权主体和活动三个对象

边界：三个对象不能互换；平等不等于结果一致，竞争也须受规则约束。

入口：qa、mnemonic

来源：market-economy-features/market-feature-1 (cs-23-30-p7-market-feature-property-list)；market-economy-features/market-feature-2 (cs-23-30-p7-market-feature-equality-list)；market-economy-features/market-feature-3 (cs-23-30-p7-market-feature-competition-list)

### market-feature-legality · review

目标：由规则约束与违法制裁识别行为法制性

边界：法制性约束交易和竞争行为，不等于政府代替市场作经营决策。

入口：qa、mnemonic

来源：market-economy-features/market-feature-4 (cs-23-30-p7-market-feature-legality-list)

### market-feature-openness · review

目标：由要素和商品跨区域流动识别体系开放性

边界：开放运行仍须遵守准入、交易和监管规则。

入口：qa、mnemonic

来源：market-economy-features/market-feature-5 (cs-23-30-p7-market-feature-openness-list)

### market-feature-limited-government · review

目标：由维护秩序权利识别政府作用边界

边界：作用有限不等于政府缺位，也不等于排除宏观调控。

入口：qa、mnemonic

来源：market-economy-features/market-feature-6 (cs-23-30-p7-market-feature-limited-government-list)

### market-features-order-full · review

目标：综合复辨行为体系与政府三个对象

边界：法制、开放和政府边界是不同对象，不能相互替换。

入口：qa、mnemonic

来源：market-economy-features/market-feature-4 (cs-23-30-p7-market-feature-legality-list)；market-economy-features/market-feature-5 (cs-23-30-p7-market-feature-openness-list)；market-economy-features/market-feature-6 (cs-23-30-p7-market-feature-limited-government-list)

### socialist-market-meaning · review

目标：识别有效市场与有为政府的统一关系

边界：市场起决定性作用不等于市场起全部作用，更好发挥政府作用也不等于更多直接配置资源。

入口：qa、mnemonic

来源：socialist-market-economy/socialist-market-meaning (cs-23-30-p7-socialist-market-meaning-list)

### socialist-market-framework · review

目标：识别新时代社会主义市场经济体制的治理目标

边界：这是治理框架识别题，不展开具体年度政策和部门措施。

入口：qa、mnemonic

来源：socialist-market-economy/socialist-market-framework (cs-23-30-p7-socialist-market-framework-list)

### socialist-market-framework-full · review

目标：综合复辨市场作用、政府作用和治理目标

边界：常识模块负责经济机制辨析；理论沿革、制度论述和会议文件体系由政治理论模块承载。

入口：qa、mnemonic

来源：socialist-market-economy/socialist-market-meaning (cs-23-30-p7-socialist-market-meaning-list)；socialist-market-economy/socialist-market-framework (cs-23-30-p7-socialist-market-framework-list)

### demand-meaning · review

目标：由消费者愿买且能买识别需求

边界：本题只识别需求定义，不使用仍在待核的需求因素分类。

入口：qa、mnemonic

来源：microeconomics/demand-meaning (cs-23-30-p8-demand-meaning-list)

### demand-price-elasticity · review

目标：以需求量与价格的百分比变化识别需求价格弹性

边界：比较百分比而非绝对销量；保持其他相关条件不变，不把本题推广为所有商品的固定弹性。

入口：qa、mnemonic

来源：microeconomics/demand-price-elasticity (cs-23-30-p9-demand-price-elasticity-list)

### supply-meaning · review

目标：由生产者愿卖且能供识别供给

边界：生产计划或出售意愿本身不等于已具备供给能力。

入口：qa、mnemonic

来源：supply-theory/supply-meaning (cs-23-30-p10-supply-meaning-list)

### supply-factors · review

目标：识别本品价格成本相关品政策预期对供给的影响

边界：这是一般方向判断；现实供给还受本品价格、相关品价格、政策和预期等影响。

入口：qa、mnemonic

来源：supply-theory/supply-factors (cs-23-30-p10-supply-factors-list)

### demand-supply-basic-full · review

目标：综合复辨需求供给主体条件弹性和影响因素

边界：本组不纳入待核需求因素分类，也不预测具体商品的供给数量。

入口：qa、mnemonic

来源：microeconomics/demand-meaning (cs-23-30-p8-demand-meaning-list)；microeconomics/demand-price-elasticity (cs-23-30-p9-demand-price-elasticity-list)；supply-theory/supply-meaning (cs-23-30-p10-supply-meaning-list)；supply-theory/supply-factors (cs-23-30-p10-supply-factors-list)

### equilibrium-meaning · review

目标：由供给量等于需求量识别市场均衡

边界：均衡是分析状态，不表示市场价格此后不再变化。

入口：qa、mnemonic

来源：supply-demand-equilibrium/equilibrium-meaning (cs-23-30-p10-equilibrium-meaning-list)

### equilibrium-price-quantity · review

目标：区分均衡价格与均衡数量

边界：价格和数量是两个不同维度，不能互换。

入口：qa、mnemonic

来源：supply-demand-equilibrium/equilibrium-price-quantity (cs-23-30-p10-equilibrium-price-quantity-list)

### equilibrium-price-limits · review

目标：识别有约束力的最高最低限价位置

边界：本题只辨识位置与约束方向，不推断短缺、过剩等具体政策后果。

入口：qa、mnemonic

来源：supply-demand-equilibrium/equilibrium-application (cs-23-30-p10-equilibrium-application-list)

### supply-demand-equilibrium-full · review

目标：综合复辨均衡状态价格数量和限价位置

边界：题目不扩展价格管制的福利和数量效果。

入口：qa、mnemonic

来源：supply-demand-equilibrium/equilibrium-meaning (cs-23-30-p10-equilibrium-meaning-list)；supply-demand-equilibrium/equilibrium-price-quantity (cs-23-30-p10-equilibrium-price-quantity-list)；supply-demand-equilibrium/equilibrium-application (cs-23-30-p10-equilibrium-application-list)

### supply-demand-direction · review

目标：根据供求相对大小判断价格变化方向

边界：这是一般方向判断，不预测具体幅度和持续时间。

入口：qa、mnemonic

来源：supply-demand-law/supply-demand-law (cs-23-30-p11-supply-demand-law-list)

### buyer-market · review

目标：由供给大于需求识别买方市场

边界：买方市场描述供求相对关系，不表示每位买方都能决定价格。

入口：qa、mnemonic

来源：supply-demand-law/buyer-seller-market (cs-23-30-p11-buyer-seller-market-list)

### seller-market · review

目标：由需求大于供给识别卖方市场

边界：卖方市场不表示卖方可以违反交易规则。

入口：qa、mnemonic

来源：supply-demand-law/buyer-seller-market (cs-23-30-p11-buyer-seller-market-list)

### supply-demand-market-full · review

目标：综合复辨供求方向与买卖方市场

边界：对应关系用于一般分析，不直接预测某一商品的实际价格。

入口：qa、mnemonic

来源：supply-demand-law/supply-demand-law (cs-23-30-p11-supply-demand-law-list)；supply-demand-law/buyer-seller-market (cs-23-30-p11-buyer-seller-market-list)

### macro-goals-list-c523 · blocked

目标：识别宏观调控四目标

边界：本题不涉及实现目标的政策工具。

入口：

来源：macro-control-goals-overview/macro-goals-overview (cs-23-30-p14-macro-goals-overview-list)

### macro-primary-goal-c523 · blocked

目标：识别最主要目标

边界：其他目标仍属于四项目标。

入口：

来源：macro-control-goals-overview/macro-goals-overview (cs-23-30-p14-macro-goals-overview-list)

### macro-goals-full-c523 · blocked

目标：综合复辨宏观调控目标

边界：不据此判断具体政策选择。

入口：

来源：macro-control-goals-overview/macro-goals-overview (cs-23-30-p14-macro-goals-overview-list)

### prehistoric-yuanmou · review

目标：识别元谋人

边界：只按正文表格识别。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-1 (cs-1-9-p1-old-stone-table)

### prehistoric-peking-fire · review

目标：识别北京人用火

边界：山顶洞人对应人工取火。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-1 (cs-1-9-p1-old-stone-table)

### prehistoric-caveman-tech · review

目标：识别山顶洞人技术

边界：不扩展绝对年代结论。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-1 (cs-1-9-p1-old-stone-table)

### prehistoric-old-stone-full · review

目标：综合复辨旧石器线索

边界：新石器文化成果不混入本组。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-1 (cs-1-9-p1-old-stone-table)

### prehistoric-hemudu · review

目标：识别河姆渡文化

边界：不使用绝对排名表述。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-2 (cs-1-9-p1-p2-new-stone-table)

### prehistoric-hongshan-yangshao · review

目标：区分红山与仰韶

边界：只做正文成果配对。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-2 (cs-1-9-p1-p2-new-stone-table)

### prehistoric-dawenkou-longshan · review

目标：区分大汶口与龙山

边界：不推断先后关系。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-2 (cs-1-9-p1-p2-new-stone-table)

### prehistoric-new-stone-region · review

目标：区分南北地域

边界：不覆盖全部文化分布。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-2 (cs-1-9-p1-p2-new-stone-table)

### prehistoric-new-stone-full · review

目标：综合复辨新石器文化

边界：不加入绝对最早等需独立核验的断言。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-2 (cs-1-9-p1-p2-new-stone-table)

### prehistoric-yanhuang · review

目标：识别炎黄含义

边界：按正文传说时代口径识别。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-3 (cs-1-9-p2-flame-yellow-yao-shun-yu-list)

### prehistoric-banquan · review

目标：识别阪泉之战

边界：涿鹿之战对应炎黄联合对蚩尤。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-3 (cs-1-9-p2-flame-yellow-yao-shun-yu-list)

### prehistoric-zhuolu · review

目标：识别涿鹿之战

边界：不要和阪泉之战混淆。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-3 (cs-1-9-p2-flame-yellow-yao-shun-yu-list)

### prehistoric-legend-battles-full · review

目标：综合复辨炎黄两战

边界：不使用正文补充的指南车故事出题。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-3 (cs-1-9-p2-flame-yellow-yao-shun-yu-list)

### prehistoric-abdication · review

目标：识别禅让制

边界：禅让制不等同世袭制。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-3 (cs-1-9-p2-flame-yellow-yao-shun-yu-list)

### prehistoric-dayu-water · review

目标：识别大禹治水

边界：三过家门而不入用于连接其长期治水。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-3 (cs-1-9-p2-flame-yellow-yao-shun-yu-list)

### prehistoric-abdication-water-full · review

目标：综合复辨禅让治水

边界：不扩展未列出的工程细节。

入口：qa、mnemonic

来源：prehistoric-civilization/prehistoric-3 (cs-1-9-p2-flame-yellow-yao-shun-yu-list)

### xia-qi-hereditary · review

目标：识别启与世袭制

边界：只识别正文朝代线索。

入口：qa、mnemonic

来源：legendary-xia-shang/dynasties (cs-1-9-p2-xia-list)

### xia-erlitou · review

目标：识别二里头文化

边界：不能仅凭地域和年代相近，就把全部遗存直接等同于史籍夏王朝。

入口：qa、mnemonic

来源：legendary-xia-shang/dynasties (cs-1-9-p2-xia-list)

### xia-mingtiao · review

目标：识别鸣条之战

边界：牧野之战对应商周更替。

入口：qa、mnemonic

来源：legendary-xia-shang/dynasties (cs-1-9-p2-xia-list)

### xia-dynasty-full · review

目标：综合复辨夏朝线索

边界：不包含少康等补充内容。

入口：qa、mnemonic

来源：legendary-xia-shang/dynasties (cs-1-9-p2-xia-list)

### shang-tang-founded · review

目标：识别商汤建商

边界：不以辅佐人物作为本题考点。

入口：qa、mnemonic

来源：legendary-xia-shang/dynasties (cs-1-9-p2-p3-shang-list)

### shang-pangeng-yin · review

目标：识别盘庚迁殷

边界：迁都后的发展涉及多种因素，不把稳定简单归结为迁都一项。

入口：qa、mnemonic

来源：legendary-xia-shang/dynasties (cs-1-9-p2-p3-shang-list)

### shang-muye · review

目标：识别牧野之战

边界：本题识别战役与朝代更替，不以传说细节作为判断条件。

入口：qa、mnemonic

来源：legendary-xia-shang/dynasties (cs-1-9-p2-p3-shang-list)

### shang-dynasty-full · review

目标：综合复辨商朝线索

边界：不加入武丁等补充线索。

入口：qa、mnemonic

来源：legendary-xia-shang/dynasties (cs-1-9-p2-p3-shang-list)

### western-zhou-founding · review

目标：识别西周建立

边界：镐京是西周都城；洛邑也曾是西周经营东方的重要据点，不能把它只与东周相联系。

入口：qa、mnemonic

来源：legendary-xia-shang/dynasties (cs-1-9-p3-western-zhou-list)

### western-zhou-hezun · review

目标：识别何尊铭文

边界：铭文中的“中国”有其当时的地域和政治含义，不等同于现代国家疆域。

入口：qa、mnemonic

来源：legendary-xia-shang/dynasties (cs-1-9-p3-western-zhou-list)

### western-zhou-fall · review

目标：识别西周灭亡

边界：不考故事化补充。

入口：qa、mnemonic

来源：legendary-xia-shang/dynasties (cs-1-9-p3-western-zhou-list)

### western-zhou-full · review

目标：综合复辨西周节点

边界：不加入人物逸事。

入口：qa、mnemonic

来源：legendary-xia-shang/dynasties (cs-1-9-p3-western-zhou-list)

### transition-pingwang-east · review

目标：识别平王东迁

边界：不考具体护卫诸侯。

入口：qa、mnemonic

来源：legendary-xia-shang/transition (cs-1-9-p3-spring-autumn-warring-states-list)

### transition-warring-seven · review

目标：识别战国七雄

边界：本题只检验集合。

入口：qa、mnemonic

来源：legendary-xia-shang/transition (cs-1-9-p3-spring-autumn-warring-states-list)

### transition-shangyang · review

目标：识别商鞅变法

边界：推行县制不等于商鞅首次发明县这一地方组织。

入口：qa、mnemonic

来源：legendary-xia-shang/transition (cs-1-9-p3-spring-autumn-warring-states-list)

### transition-divider · review

目标：识别春秋战国分水岭

边界：它们是不同国家发生的政治变化，不是同一事件，也不能合并成同一年。

入口：qa、mnemonic

来源：legendary-xia-shang/transition (cs-1-9-p3-spring-autumn-warring-states-list)

### transition-full · review

目标：综合复辨春秋战国骨架

边界：三家分晋与田氏代齐不是同年同一事件，商鞅也不是县制的最初创立者。

入口：qa、mnemonic

来源：legendary-xia-shang/transition (cs-1-9-p3-spring-autumn-warring-states-list)

### pre-qin-four-systems · review

目标：识别西周四制

边界：本题只检验制度集合。

入口：qa、mnemonic

来源：legendary-xia-shang/pre-qin-institutions (cs-1-9-p3-p4-pre-qin-institutions-list)

### pre-qin-zongfa · review

目标：理解宗法血缘与相对层级

边界：同一支系对下可以是大宗，对上又是小宗，不能把全体嫡子、庶子各归成一个固定集团。

入口：qa、mnemonic

来源：legendary-xia-shang/pre-qin-institutions (cs-1-9-p3-p4-pre-qin-institutions-list)

### pre-qin-tax-mu · review

目标：识别初税亩

边界：不使用补充标签出题。

入口：qa、mnemonic

来源：legendary-xia-shang/pre-qin-institutions (cs-1-9-p3-p4-pre-qin-institutions-list)

### pre-qin-institutions-full · review

目标：综合复辨先秦制度

边界：大宗、小宗是相对层级，不直接等于全体嫡子和全体庶子。

入口：qa、mnemonic

来源：legendary-xia-shang/pre-qin-institutions (cs-1-9-p3-p4-pre-qin-institutions-list)

### pre-qin-iron-ox · review

目标：识别农业进步

边界：不推断具体产量。

入口：qa、mnemonic

来源：legendary-xia-shang/pre-qin-economy (cs-1-9-p4-pre-qin-economy-list)

### pre-qin-houmuwu-ding · review

目标：识别后母戊鼎

边界：不使用最大最重排名出题。

入口：qa、mnemonic

来源：legendary-xia-shang/pre-qin-economy (cs-1-9-p4-pre-qin-economy-list)

### pre-qin-water-pairs · review

目标：区分芍陂郑国渠

边界：不加入工程年代排序。

入口：qa、mnemonic

来源：legendary-xia-shang/pre-qin-economy (cs-1-9-p4-pre-qin-economy-list)

### pre-qin-dujiangyan · review

目标：识别李冰都江堰

边界：不使用世界最古老等绝对排名。

入口：qa、mnemonic

来源：legendary-xia-shang/pre-qin-economy (cs-1-9-p4-pre-qin-economy-list)

### pre-qin-economy-full · review

目标：综合复辨先秦经济

边界：不以未限定的世界排名或不分季节的都江堰固定分水比例命题。

入口：qa、mnemonic

来源：legendary-xia-shang/pre-qin-economy (cs-1-9-p4-pre-qin-economy-list)

### qin-founding · review

目标：识别秦朝建立

边界：不使用国家性质标签判断。

入口：qa、mnemonic

来源：qin-han/qin (cs-1-9-p4-qin-list)

### qin-governance · review

目标：识别秦朝政治制度

边界：后世制度不混入。

入口：qa、mnemonic

来源：qin-han/qin (cs-1-9-p4-qin-list)

### qin-unification · review

目标：识别秦朝统一措施

边界：本题不评价政策效果。

入口：qa、mnemonic

来源：qin-han/qin (cs-1-9-p4-qin-list)

### qin-fall-wars · review

目标：区分秦末三条线

边界：典故和绝对排名不进入本题。

入口：qa、mnemonic

来源：qin-han/qin (cs-1-9-p4-qin-list)

### qin-dynasty-full · review

目标：综合复辨秦朝骨架

边界：楚汉之争发生在秦亡以后，不把它写成秦朝统治期间的战争。

入口：qa、mnemonic

来源：qin-han/qin (cs-1-9-p4-qin-list)

### western-han-founding · review

目标：识别西汉建立

边界：本题只识别建立线索。

入口：qa、mnemonic

来源：qin-han/western-han (cs-1-9-p4-p5-western-han-list)

### wenjing-rule · review

目标：识别文景之治

边界：不跨朝代混用治世名称。

入口：qa、mnemonic

来源：qin-han/western-han (cs-1-9-p4-p5-western-han-list)

### hanwu-measures · review

目标：识别汉武帝人物措施

边界：河西四郡等补充内容不纳入。

入口：qa、mnemonic

来源：qin-han/western-han (cs-1-9-p4-p5-western-han-list)

### western-han-late · review

目标：区分西汉后期节点

边界：不使用疆域归属评价出题。

入口：qa、mnemonic

来源：qin-han/western-han (cs-1-9-p4-p5-western-han-list)

### western-han-full · review

目标：综合复辨西汉骨架

边界：不加入绝对疆域判断。

入口：qa、mnemonic

来源：qin-han/western-han (cs-1-9-p4-p5-western-han-list)

### eastern-han-founding · review

目标：识别东汉建立

边界：本题只识别建立者和都城。

入口：qa、mnemonic

来源：qin-han/eastern-han (cs-1-9-p5-eastern-han-list)

### guangwu-revival · review

目标：识别光武中兴

边界：不把其他朝代治世名称混入。

入口：qa、mnemonic

来源：qin-han/eastern-han (cs-1-9-p5-eastern-han-list)

### yellow-turban · review

目标：识别黄巾起义

边界：不考起义口号原文。

入口：qa、mnemonic

来源：qin-han/eastern-han (cs-1-9-p5-eastern-han-list)

### eastern-han-sequence · review

目标：排列东汉主线

边界：不加入昆阳之战等补充细节。

入口：qa、mnemonic

来源：qin-han/eastern-han (cs-1-9-p5-eastern-han-list)

### eastern-han-full · review

目标：综合复辨东汉骨架

边界：不加入口号和典故。

入口：qa、mnemonic

来源：qin-han/eastern-han (cs-1-9-p5-eastern-han-list)

### qin-han-agriculture · review

目标：识别秦汉农业技术

边界：推广耦犁不等于首次发明牛耕，也不把后来翻车的发展全部归于一人。

入口：qa、mnemonic

来源：qin-han/qin-han-economy (cs-1-9-p5-qin-han-economy-list)

### qin-han-water-blast · review

目标：识别水排用途

边界：不要把水排与灌溉用翻车混淆。

入口：qa、mnemonic

来源：qin-han/qin-han-economy (cs-1-9-p5-qin-han-economy-list)

### qin-han-paper · review

目标：区分造纸节点

边界：不将改进表述为首次发明。

入口：qa、mnemonic

来源：qin-han/qin-han-economy (cs-1-9-p5-qin-han-economy-list)

### lingqu · review

目标：识别灵渠人物

边界：不把先秦其他水利工程人物混入。

入口：qa、mnemonic

来源：qin-han/qin-han-economy (cs-1-9-p5-qin-han-economy-list)

### qin-han-economy-full · review

目标：综合复辨秦汉经济技术

边界：区分技术的推广、改进和制造，不统称某人首次发明。

入口：qa、mnemonic

来源：qin-han/qin-han-economy (cs-1-9-p5-qin-han-economy-list)

### guandu-battle · review

目标：识别官渡之战

边界：不借典故判断战役。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/three-kingdoms (cs-1-9-p5-p6-three-kingdoms-list)

### red-cliffs-battle · review

目标：识别赤壁之战

边界：不考草船借箭等故事。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/three-kingdoms (cs-1-9-p5-p6-three-kingdoms-list)

### yiling-battle · review

目标：识别夷陵之战

边界：不考火烧连营的叙事细节。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/three-kingdoms (cs-1-9-p5-p6-three-kingdoms-list)

### three-kingdoms-regimes · review

目标：区分魏蜀吴政权

边界：不把参与前期战争的人物直接当作建国者。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/three-kingdoms (cs-1-9-p5-p6-three-kingdoms-list)

### three-kingdoms-full · review

目标：综合复辨三国主线

边界：不加入典故和夸张数字。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/three-kingdoms (cs-1-9-p5-p6-three-kingdoms-list)

### western-jin-founding · review

目标：识别西晋建立

边界：不考宫廷政变细节。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/two-jin (cs-1-9-p6-two-jin-list)

### western-jin-fall · review

目标：识别西晋灭亡

边界：317年对应东晋建立。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/two-jin (cs-1-9-p6-two-jin-list)

### eastern-jin-founding · review

目标：识别东晋建立

边界：刘裕建立的是南朝宋。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/two-jin (cs-1-9-p6-two-jin-list)

### two-jin-sequence · review

目标：排列两晋节点

边界：不以西晋统一持续年数作判断。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/two-jin (cs-1-9-p6-two-jin-list)

### two-jin-full · review

目标：综合复辨两晋骨架

边界：不加入八王之乱和典故。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/two-jin (cs-1-9-p6-two-jin-list)

### feishui-battle · review

目标：识别淝水之战

边界：不借相关典故判断。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/northern-southern (cs-1-9-p6-five-hu-northern-southern-list)

### southern-dynasties · review

目标：识别南朝政权

边界：不把北朝政权混入。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/northern-southern (cs-1-9-p6-five-hu-northern-southern-list)

### northern-dynasties · review

目标：识别北朝演变

边界：南朝和三国政权不混入。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/northern-southern (cs-1-9-p6-five-hu-northern-southern-list)

### xiaowen-reform · review

目标：识别孝文帝改革

边界：不把其他朝代制度混入。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/northern-southern (cs-1-9-p6-five-hu-northern-southern-list)

### northern-southern-full · review

目标：综合复辨南北朝骨架

边界：不加入战役典故。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/northern-southern (cs-1-9-p6-five-hu-northern-southern-list)

### jiangnan-development · review

目标：识别江南开发

边界：不能把“奠定基础”改成“已经完成”。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/three-kingdoms-economy (cs-1-9-p6-three-kingdoms-northern-southern-economy-list)

### period-ceramics · review

目标：识别瓷器发展

边界：不延伸工艺年代排名。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/three-kingdoms-economy (cs-1-9-p6-three-kingdoms-northern-southern-economy-list)

### caowei-textile · review

目标：识别曹魏纺织

边界：不据此推断其他地区没有纺织业。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/three-kingdoms-economy (cs-1-9-p6-three-kingdoms-northern-southern-economy-list)

### wu-shu-textile · review

目标：区分吴蜀纺织

边界：不扩展未列出的产地与流通范围。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/three-kingdoms-economy (cs-1-9-p6-three-kingdoms-northern-southern-economy-list)

### three-kingdoms-economy-full · review

目标：综合复辨时期经济

边界：不把趋势表述成已经完成。

入口：qa、mnemonic

来源：three-kingdoms-sui-tang/three-kingdoms-economy (cs-1-9-p6-three-kingdoms-northern-southern-economy-list)

### five-dynasties-start · review

目标：识别五代起点

边界：不考相关人物典故。

入口：qa、mnemonic

来源：five-dynasties-yuan/five-dynasties (cs-1-9-p9-five-dynasties-list)

### five-dynasties-sequence · review

目标：识别五代顺序

边界：不把并行政权混入五代序列。

入口：qa、mnemonic

来源：five-dynasties-yuan/five-dynasties (cs-1-9-p9-five-dynasties-list)

### ten-kingdoms · review

目标：识别十国范围

边界：与黄河流域的五代更替区分。

入口：qa、mnemonic

来源：five-dynasties-yuan/five-dynasties (cs-1-9-p9-five-dynasties-list)

### five-dynasties-end · review

目标：识别时期结束

边界：不借烛影斧声等传说判断。

入口：qa、mnemonic

来源：five-dynasties-yuan/five-dynasties (cs-1-9-p9-five-dynasties-list)

### five-dynasties-full · review

目标：综合复辨五代十国

边界：不加入王位继承传说。

入口：qa、mnemonic

来源：five-dynasties-yuan/five-dynasties (cs-1-9-p9-five-dynasties-list)

### khitan-identity · review

目标：识别契丹背景

边界：本题只识别辽的建立主线。

入口：qa、mnemonic

来源：five-dynasties-yuan/liao (cs-1-9-p9-liao-list)

### liao-founding · review

目标：识别辽政权建立

边界：947年才改国号为辽。

入口：qa、mnemonic

来源：five-dynasties-yuan/liao (cs-1-9-p9-liao-list)

### liao-rename · review

目标：识别改号辽

边界：916年是建立契丹国，1125年是辽灭亡。

入口：qa、mnemonic

来源：five-dynasties-yuan/liao (cs-1-9-p9-liao-list)

### liao-fall · review

目标：识别辽灭亡

边界：不扩展辽金战争过程。

入口：qa、mnemonic

来源：five-dynasties-yuan/liao (cs-1-9-p9-liao-list)

### liao-full · review

目标：综合复辨辽主线

边界：不扩展未列入正文的制度。

入口：qa、mnemonic

来源：five-dynasties-yuan/liao (cs-1-9-p9-liao-list)

### northern-song-founding · review

目标：识别北宋建立

边界：不以陈桥兵变的轶事细节作判断。

入口：qa、mnemonic

来源：five-dynasties-yuan/northern-song (cs-1-9-p9-p10-northern-song-list)

### chanyuan-treaty · review

目标：识别澶渊之盟

边界：不考岁币具体数额。

入口：qa、mnemonic

来源：five-dynasties-yuan/northern-song (cs-1-9-p9-p10-northern-song-list)

### northern-song-reforms · review

目标：区分北宋两次改革

边界：具体各法不在本题覆盖范围。

入口：qa、mnemonic

来源：five-dynasties-yuan/northern-song (cs-1-9-p9-p10-northern-song-list)

### northern-song-fall · review

目标：识别北宋灭亡

边界：不考被俘人数等细节。

入口：qa、mnemonic

来源：five-dynasties-yuan/northern-song (cs-1-9-p9-p10-northern-song-list)

### northern-song-full · review

目标：综合复辨北宋主线

边界：中央集权细分机构另作专题。

入口：qa、mnemonic

来源：five-dynasties-yuan/northern-song (cs-1-9-p9-p10-northern-song-list)

### western-xia-identity · review

目标：识别西夏背景

边界：本题不延伸民族迁徙史。

入口：qa、mnemonic

来源：five-dynasties-yuan/western-xia (cs-1-9-p10-western-xia-list)

### western-xia-founding · review

目标：识别西夏建立

边界：阿保机对应辽，阿骨打对应金。

入口：qa、mnemonic

来源：five-dynasties-yuan/western-xia (cs-1-9-p10-western-xia-list)

### song-xia-wars · review

目标：识别宋夏关系

边界：不扩展具体战役和条约。

入口：qa、mnemonic

来源：five-dynasties-yuan/western-xia (cs-1-9-p10-western-xia-list)

### western-xia-fall · review

目标：识别西夏灭亡

边界：不扩展战争过程。

入口：qa、mnemonic

来源：five-dynasties-yuan/western-xia (cs-1-9-p10-western-xia-list)

### western-xia-full · review

目标：综合复辨西夏主线

边界：不扩展正文未列制度。

入口：qa、mnemonic

来源：five-dynasties-yuan/western-xia (cs-1-9-p10-western-xia-list)

### jin-founding · review

目标：识别金朝建立

边界：阿保机对应辽，元昊对应西夏。

入口：qa、mnemonic

来源：five-dynasties-yuan/jin (cs-1-9-p10-jin-list)

### jin-region · review

目标：识别金朝区域

边界：只按本页正文的主要区域判断。

入口：qa、mnemonic

来源：five-dynasties-yuan/jin (cs-1-9-p10-jin-list)

### jin-capital-name · review

目标：识别金朝都城国号

边界：不考会宁府现代行政区全称。

入口：qa、mnemonic

来源：five-dynasties-yuan/jin (cs-1-9-p10-jin-list)

### jin-fall · review

目标：识别金朝灭亡

边界：不扩展战争过程。

入口：qa、mnemonic

来源：five-dynasties-yuan/jin (cs-1-9-p10-jin-list)

### jin-full · review

目标：综合复辨金朝主线

边界：不扩展正文未列制度。

入口：qa、mnemonic

来源：five-dynasties-yuan/jin (cs-1-9-p10-jin-list)

### southern-song-founding · review

目标：识别南宋建立与都城

边界：应天是称帝地点，临安是后来都城。

入口：qa、mnemonic

来源：five-dynasties-yuan/southern-song (cs-1-9-p10-southern-song-list)

### shaoxing-treaty · review

目标：识别绍兴和议

边界：不考银绢具体数额。

入口：qa、mnemonic

来源：five-dynasties-yuan/southern-song (cs-1-9-p10-southern-song-list)

### jiading-treaty · review

目标：识别嘉定和议

边界：不考伯侄称谓、赔款和银绢数额。

入口：qa、mnemonic

来源：five-dynasties-yuan/southern-song (cs-1-9-p10-southern-song-list)

### southern-song-fall · review

目标：识别南宋灭亡

边界：人物事迹不作为本题判断条件。

入口：qa、mnemonic

来源：five-dynasties-yuan/southern-song (cs-1-9-p10-southern-song-list)

### southern-song-full · review

目标：综合复辨南宋主线

边界：不记和议中的具体银绢数额。

入口：qa、mnemonic

来源：five-dynasties-yuan/southern-song (cs-1-9-p10-southern-song-list)

### yuan-founding-timeline · review

目标：区分蒙古统一与元朝建立

边界：蒙古政权建立与元朝国号建立是两个节点。

入口：qa、mnemonic

来源：five-dynasties-yuan/yuan (cs-1-9-p11-yuan-list)

### yuan-fall · review

目标：识别元朝灭亡

边界：不扩展北伐过程。

入口：qa、mnemonic

来源：five-dynasties-yuan/yuan (cs-1-9-p11-yuan-list)

### yuan-province-system · review

目标：识别行省制度

边界：不把边疆专门机构混入一般行政层级。

入口：qa、mnemonic

来源：five-dynasties-yuan/yuan (cs-1-9-p11-yuan-list)

### yuan-frontier-institutions · review

目标：区分元朝边疆机构

边界：只按正文所列机构职责判断。

入口：qa、mnemonic

来源：five-dynasties-yuan/yuan (cs-1-9-p11-yuan-list)

### yuan-full · review

目标：综合复辨元朝主线

边界：不考等级排序和疆域最大评价。

入口：qa、mnemonic

来源：five-dynasties-yuan/yuan (cs-1-9-p11-yuan-list)

### song-agriculture · review

目标：识别宋代农业

边界：不扩展作物传播的全部过程。

入口：qa、mnemonic

来源：five-dynasties-yuan/five-dynasties-yuan-economy (cs-1-9-p11-five-dynasties-yuan-economy-list)

### song-kilns · review

目标：识别宋代名窑

边界：不要求背诵全部胎釉鉴别词。

入口：qa、mnemonic

来源：five-dynasties-yuan/five-dynasties-yuan-economy (cs-1-9-p11-five-dynasties-yuan-economy-list)

### song-yuan-industry · review

目标：识别宋元手工业

边界：不扩展技术传播路线。

入口：qa、mnemonic

来源：five-dynasties-yuan/five-dynasties-yuan-economy (cs-1-9-p11-five-dynasties-yuan-economy-list)

### song-yuan-commerce · review

目标：识别宋元商业

边界：不把交子的世界最早口径作为唯一判断条件。

入口：qa、mnemonic

来源：five-dynasties-yuan/five-dynasties-yuan-economy (cs-1-9-p11-five-dynasties-yuan-economy-list)

### song-yuan-economy-full · review

目标：综合复辨宋元经济

边界：造船地点及瓷器细部仍以正文为准。

入口：qa、mnemonic

来源：five-dynasties-yuan/five-dynasties-yuan-economy (cs-1-9-p11-five-dynasties-yuan-economy-list)

### ming-founding · review

目标：识别明朝建立

边界：月饼传信属于传说，不作判断依据。

入口：qa、mnemonic

来源：ming-qing/ming (cs-1-9-p11-p13-ming-list)

### ming-yongle · review

目标：识别永乐活动

边界：不考航海规模和每次线路。

入口：qa、mnemonic

来源：ming-qing/ming (cs-1-9-p11-p13-ming-list)

### ming-mid-events · review

目标：区分土木之变与抗倭

边界：不考兵器与作战阵法。

入口：qa、mnemonic

来源：ming-qing/ming (cs-1-9-p11-p13-ming-list)

### ming-fall-institutions · review

目标：识别明亡与制度

边界：三司全称和后续政权更替另作专题。

入口：qa、mnemonic

来源：ming-qing/ming (cs-1-9-p11-p13-ming-list)

### ming-full · review

目标：综合复辨明朝主线

边界：制度细项以直接题和正文为准。

入口：qa、mnemonic

来源：ming-qing/ming (cs-1-9-p11-p13-ming-list)

### qing-founding · review

目标：识别清朝建立节点

边界：不把后金建立直接等同于入关。

入口：qa、mnemonic

来源：ming-qing/qing (cs-1-9-p13-qing-list)

### qing-taiwan · review

目标：区分台湾两节点

边界：不扩展具体海战过程。

入口：qa、mnemonic

来源：ming-qing/qing (cs-1-9-p13-qing-list)

### nerchinsk-treaty · review

目标：识别尼布楚条约

边界：不考边界逐段原文。

入口：qa、mnemonic

来源：ming-qing/qing (cs-1-9-p13-qing-list)

### qing-reign-institutions · review

目标：识别康乾时期与制度

边界：理藩院职责仍在解析和口诀中保留。

入口：qa、mnemonic

来源：ming-qing/qing (cs-1-9-p13-qing-list)

### qing-full · review

目标：综合复辨清朝主线

边界：具体战争过程和制度层级仍以正文为准。

入口：qa、mnemonic

来源：ming-qing/qing (cs-1-9-p13-qing-list)

### ming-qing-crops · review

目标：识别明清农业

边界：花生、烟草及蔬菜也有引入，但本题问主要粮食作物。

入口：qa、mnemonic

来源：ming-qing/ming-qing-economy (cs-1-9-p13-ming-qing-economy-list)

### qing-ceramics · review

目标：识别清代制瓷

边界：不考全部瓷种工艺差异。

入口：qa、mnemonic

来源：ming-qing/ming-qing-economy (cs-1-9-p13-ming-qing-economy-list)

### ming-capitalism-sprout · review

目标：识别资本主义萌芽

边界：只按正文纺织业表述判断。

入口：qa、mnemonic

来源：ming-qing/ming-qing-economy (cs-1-9-p13-ming-qing-economy-list)

### ming-qing-economy-full · review

目标：综合复辨明清经济

边界：不扩展全部经济作物和瓷器工艺。

入口：qa、mnemonic

来源：ming-qing/ming-qing-economy (cs-1-9-p13-ming-qing-economy-list)

### humen-opium · review

目标：识别虎门销烟

边界：区分侵略者的出兵借口与维护鸦片贸易利益、打开中国市场的目的。

入口：qa、mnemonic

来源：late-qing-invasions/humen-opium-destruction (cs-1-9-p14-humen-opium-destruction-list)

### sanyuanli-resistance · review

目标：识别三元里抗英

边界：地方抗争不等于清政府组织的海军远征，也不等于整场战争已经获胜。

入口：qa、mnemonic

来源：late-qing-invasions/sanyuanli-resistance (cs-1-9-p14-sanyuanli-resistance-list)

### nanjing-treaty · review

目标：识别南京条约

边界：赔款数额不作为本题核心。

入口：qa、mnemonic

来源：late-qing-invasions/treaty-of-nanjing (cs-1-9-p14-treaty-of-nanjing-list)

### open-eyes-world · review

目标：区分睁眼看世界人物

边界：不考著作覆盖国家的具体数量。

入口：qa、mnemonic

来源：late-qing-invasions/open-eyes-to-world (cs-1-9-p14-open-eyes-to-world-list)

### opium-war-opening-full · review

目标：综合复辨近代开端

边界：条约具体赔款数额不在本组口诀范围。

入口：qa、mnemonic

来源：late-qing-invasions/humen-opium-destruction (cs-1-9-p14-humen-opium-destruction-list)；late-qing-invasions/sanyuanli-resistance (cs-1-9-p14-sanyuanli-resistance-list)；late-qing-invasions/treaty-of-nanjing (cs-1-9-p14-treaty-of-nanjing-list)；late-qing-invasions/open-eyes-to-world (cs-1-9-p14-open-eyes-to-world-list)

### taiping-founding · review

目标：识别太平天国建立

边界：地点、人物和年份须同时对应。

入口：qa、mnemonic

来源：taiping-heavenly-kingdom/jintian-uprising (cs-1-9-p14-jintian-uprising-list)

### taiping-turn-failure · review

目标：区分转折与失败

边界：不以全部人物遭遇替代两个关键节点。

入口：qa、mnemonic

来源：taiping-heavenly-kingdom/tianjing-incident (cs-1-9-p14-tianjing-incident-list)；taiping-heavenly-kingdom/taiping-failure (cs-1-9-p14-taiping-failure-list)

### heavenly-land-system · review

目标：识别天朝田亩制度

边界：不能把纲领提出直接等同于已经完成全国土地分配。

入口：qa、mnemonic

来源：taiping-heavenly-kingdom/heavenly-land-system (cs-1-9-p14-heavenly-land-system-list)

### senior-words · review

目标：识别资政新篇

边界：不要求背诵正文列举的全部设施。

入口：qa、mnemonic

来源：taiping-heavenly-kingdom/senior-words (cs-1-9-p14-senior-words-list)

### taiping-full · review

目标：综合复辨太平天国

边界：提出纲领与真正实施属于不同判断。

入口：qa、mnemonic

来源：taiping-heavenly-kingdom/jintian-uprising (cs-1-9-p14-jintian-uprising-list)；taiping-heavenly-kingdom/tianjing-incident (cs-1-9-p14-tianjing-incident-list)；taiping-heavenly-kingdom/taiping-failure (cs-1-9-p14-taiping-failure-list)；taiping-heavenly-kingdom/heavenly-land-system (cs-1-9-p14-heavenly-land-system-list)；taiping-heavenly-kingdom/senior-words (cs-1-9-p14-senior-words-list)

### second-opium-causes · review

目标：区分战争借口

边界：虎门销烟和三元里抗英属于第一次鸦片战争前后。

入口：qa、mnemonic

来源：second-opium-war/second-opium-war-causes (cs-1-9-p14-second-opium-war-causes-list)

### second-opium-treaties · review

目标：区分两项条约

边界：同名条约是与各国分别签署的双边文本，不是一份共同签署的多边条约。

入口：qa、mnemonic

来源：second-opium-war/second-opium-war-results (cs-1-9-p14-second-opium-war-results-list)

### yuanmingyuan · review

目标：识别圆明园事件

边界：八国联军侵华发生在更晚时期。

入口：qa、mnemonic

来源：second-opium-war/yuanmingyuan-aihun (cs-1-9-p14-yuanmingyuan-aihun-list)

### aihun-russia · review

目标：识别瑷珲条约

边界：不把沙俄通过不同条约侵占的全部土地都归到《瑷珲条约》。

入口：qa、mnemonic

来源：second-opium-war/yuanmingyuan-aihun (cs-1-9-p14-yuanmingyuan-aihun-list)

### second-opium-full · review

目标：综合复辨第二次鸦片战争

边界：不把第一次鸦片战争和八国联军侵华事件混入本组。

入口：qa、mnemonic

来源：second-opium-war/second-opium-war-causes (cs-1-9-p14-second-opium-war-causes-list)；second-opium-war/second-opium-war-results (cs-1-9-p14-second-opium-war-results-list)；second-opium-war/yuanmingyuan-aihun (cs-1-9-p14-yuanmingyuan-aihun-list)

### self-strengthening-faction · review

目标：区分洋务派人物

边界：不把维新派或战争将领混入洋务派。

入口：qa、mnemonic

来源：self-strengthening-movement/self-strengthening-faction (cs-1-9-p15-self-strengthening-faction-list)

### self-strengthening-thought · review

目标：识别洋务口号

边界：不将思想探索简化为某人独自创立所有洋务政策。

入口：qa、mnemonic

来源：self-strengthening-movement/self-strengthening-thought (cs-1-9-p15-self-strengthening-thought-list)

### self-strengthening-industry · review

目标：区分洋务企业

边界：本题选择高辨识度代表，不要求一次背全十家企业。

入口：qa、mnemonic

来源：self-strengthening-movement/self-strengthening-industry (cs-1-9-p15-self-strengthening-industry-table)

### self-strengthening-support-outcome · review

目标：识别海军教育与结局

边界：建设计划、分期简列和实际形成的舰队范围不同。

入口：qa、mnemonic

来源：self-strengthening-movement/modern-navy (cs-1-9-p15-modern-navy-list)；self-strengthening-movement/new-school (cs-1-9-p15-new-school-list)；self-strengthening-movement/self-strengthening-outcome (cs-1-9-p15-self-strengthening-outcome-list)

### self-strengthening-full · review

目标：综合复辨洋务运动

边界：企业细项以直接题和正文表格为准。

入口：qa、mnemonic

来源：self-strengthening-movement/self-strengthening-faction (cs-1-9-p15-self-strengthening-faction-list)；self-strengthening-movement/self-strengthening-thought (cs-1-9-p15-self-strengthening-thought-list)；self-strengthening-movement/self-strengthening-industry (cs-1-9-p15-self-strengthening-industry-table)；self-strengthening-movement/modern-navy (cs-1-9-p15-modern-navy-list)；self-strengthening-movement/new-school (cs-1-9-p15-new-school-list)；self-strengthening-movement/self-strengthening-outcome (cs-1-9-p15-self-strengthening-outcome-list)

### sino-japanese-battles · review

目标：区分甲午战役人物

边界：分别注意致远舰管带与北洋海军提督身份。

入口：qa、mnemonic

来源：first-sino-japanese-war/first-sino-japanese-war-battles (cs-1-9-p15-first-sino-japanese-war-battles-list)

### sino-japanese-sea-control · review

目标：区分黄海与威海卫战役阶段

边界：区分战役发生与后来败亡，不将战后战略变化压成同一时点。

入口：qa、mnemonic

来源：first-sino-japanese-war/first-sino-japanese-war-battles (cs-1-9-p15-first-sino-japanese-war-battles-list)

### shimonoseki-treaty · review

目标：识别马关条约

边界：第二项对应《南京条约》，第三项对应《辛丑条约》。

入口：qa、mnemonic

来源：first-sino-japanese-war/treaty-of-shimonoseki (cs-1-9-p15-treaty-of-shimonoseki-list)

### triple-intervention · review

目标：识别三国干涉还辽

边界：原条约确实列有辽东；后来还辽不等于台湾、澎湖也同时归还。

入口：qa、mnemonic

来源：first-sino-japanese-war/treaty-of-shimonoseki (cs-1-9-p15-treaty-of-shimonoseki-list)

### sino-japanese-full · review

目标：综合复辨甲午战争

边界：不把其他侵华战争的条约混入本组。

入口：qa、mnemonic

来源：first-sino-japanese-war/first-sino-japanese-war-battles (cs-1-9-p15-first-sino-japanese-war-battles-list)；first-sino-japanese-war/treaty-of-shimonoseki (cs-1-9-p15-treaty-of-shimonoseki-list)

### gongche-memorial · review

目标：识别公车上书

边界：公车词源不影响本题事件判断。

入口：qa、mnemonic

来源：hundred-days-reform/gongche-memorial (cs-1-9-p15-p16-gongche-memorial-list)

### hundred-days-reform · review

目标：识别百日维新

边界：人物、年份和文件要同时对应。

入口：qa、mnemonic

来源：hundred-days-reform/hundred-days-reform (cs-1-9-p16-hundred-days-reform-list)

### imperial-university · review

目标：识别京师大学堂

边界：大学的性质、创办时间与后来机构合并分别判断，不用缺少类型限定的首校排名。

入口：qa、mnemonic

来源：hundred-days-reform/imperial-university (cs-1-9-p16-imperial-university-list)

### six-martyrs · review

目标：识别戊戌六君子

边界：本题不要求背全六人名单。

入口：qa、mnemonic

来源：hundred-days-reform/six-martyrs (cs-1-9-p16-six-martyrs-list)

### hundred-days-full · review

目标：综合复辨戊戌变法

边界：具体变法政令不在本组范围。

入口：qa、mnemonic

来源：hundred-days-reform/gongche-memorial (cs-1-9-p15-p16-gongche-memorial-list)；hundred-days-reform/hundred-days-reform (cs-1-9-p16-hundred-days-reform-list)；hundred-days-reform/imperial-university (cs-1-9-p16-imperial-university-list)；hundred-days-reform/six-martyrs (cs-1-9-p16-six-martyrs-list)

### boxer-rebellion · review

目标：识别义和团运动

边界：不把跨地区运动简化为一个人在一次事件中独自建立全部组织。

入口：qa、mnemonic

来源：boxer-rebellion-eight-nation-alliance/boxer-rebellion (cs-1-9-p16-boxer-rebellion-list)

### eight-nation-alliance · review

目标：识别八国联军

边界：11国是《辛丑条约》签约国范围。

入口：qa、mnemonic

来源：boxer-rebellion-eight-nation-alliance/eight-nation-alliance (cs-1-9-p16-eight-nation-alliance-list)

### boxer-protocol-terms · review

目标：识别辛丑条约内容

边界：另两项分别对应《南京条约》和《马关条约》。

入口：qa、mnemonic

来源：boxer-rebellion-eight-nation-alliance/boxer-protocol (cs-1-9-p16-boxer-protocol-list)

### boxer-protocol-impact · review

目标：识别辛丑条约影响

边界：《南京条约》对应开始沦为。

入口：qa、mnemonic

来源：boxer-rebellion-eight-nation-alliance/boxer-protocol (cs-1-9-p16-boxer-protocol-list)

### boxer-alliance-full · review

目标：综合复辨义和团与八国联军

边界：赔款分期利息不进入本组口诀。

入口：qa、mnemonic

来源：boxer-rebellion-eight-nation-alliance/boxer-rebellion (cs-1-9-p16-boxer-rebellion-list)；boxer-rebellion-eight-nation-alliance/eight-nation-alliance (cs-1-9-p16-eight-nation-alliance-list)；boxer-rebellion-eight-nation-alliance/boxer-protocol (cs-1-9-p16-boxer-protocol-list)

### xingzhonghui-core · review

目标：识别兴中会

边界：同盟会是第一个资产阶级革命政党。

入口：qa、mnemonic

来源：revolution-and-may-fourth/xingzhonghui (cs-1-9-p16-xingzhonghui-list)

### tongmenghui-core · review

目标：识别同盟会

边界：兴中会是革命团体。

入口：qa、mnemonic

来源：revolution-and-may-fourth/tongmenghui (cs-1-9-p16-tongmenghui-list)

### tongmenghui-platform · review

目标：识别同盟会纲领

边界：不要与新文化运动主张或洋务口号混淆。

入口：qa、mnemonic

来源：revolution-and-may-fourth/tongmenghui-platform (cs-1-9-p16-tongmenghui-platform-list)

### three-principles-core · review

目标：识别三民主义

边界：三项名称和核心需同时正确。

入口：qa、mnemonic

来源：revolution-and-may-fourth/three-principles (cs-1-9-p16-three-principles-list)

### xinhai-organizations-full · review

目标：综合复辨革命组织与思想

边界：完整人物名单不在本组。

入口：qa、mnemonic

来源：revolution-and-may-fourth/xingzhonghui (cs-1-9-p16-xingzhonghui-list)；revolution-and-may-fourth/tongmenghui (cs-1-9-p16-tongmenghui-list)；revolution-and-may-fourth/tongmenghui-platform (cs-1-9-p16-tongmenghui-platform-list)；revolution-and-may-fourth/three-principles (cs-1-9-p16-three-principles-list)

### wuchang-uprising-core · review

目标：识别武昌起义

边界：次日湖北军政府成立。

入口：qa、mnemonic

来源：revolution-and-may-fourth/wuchang-uprising (cs-1-9-p16-wuchang-uprising-list)

### republic-result-timeline · review

目标：识别民国成立与结果

边界：胜利果实随后落入袁世凯手中。

入口：qa、mnemonic

来源：revolution-and-may-fourth/republic-of-china (cs-1-9-p17-republic-of-china-list)；revolution-and-may-fourth/xinhai-result (cs-1-9-p17-xinhai-result-list)

### second-protection-core · review

目标：区分二次革命与护国运动

边界：二十一条和称帝发生在1915年相关阶段，不能写成1914年。

入口：qa、mnemonic

来源：revolution-and-may-fourth/second-revolution (cs-1-9-p16-second-revolution-list)；revolution-and-may-fourth/national-protection (cs-1-9-p16-p17-national-protection-list)

### xinhai-impact-boundary · review

目标：区分影响与局限

边界：影响与局限需要同时把握。

入口：qa、mnemonic

来源：revolution-and-may-fourth/xinhai-result (cs-1-9-p17-xinhai-result-list)；revolution-and-may-fourth/xinhai-influence (cs-1-9-p17-xinhai-influence-list)

### xinhai-process-full · review

目标：综合复辨辛亥革命进程

边界：战争过程与过密日期不进入本组。

入口：qa、mnemonic

来源：revolution-and-may-fourth/wuchang-uprising (cs-1-9-p16-wuchang-uprising-list)；revolution-and-may-fourth/republic-of-china (cs-1-9-p17-republic-of-china-list)；revolution-and-may-fourth/xinhai-result (cs-1-9-p17-xinhai-result-list)；revolution-and-may-fourth/second-revolution (cs-1-9-p16-second-revolution-list)；revolution-and-may-fourth/national-protection (cs-1-9-p16-p17-national-protection-list)；revolution-and-may-fourth/xinhai-influence (cs-1-9-p17-xinhai-influence-list)

### new-culture-origin · review

目标：识别新文化运动兴起

边界：卷与期是不同出版单位，不能混用。

入口：qa、mnemonic

来源：new-culture-may-fourth/new-culture-movement (cs-1-9-p17-new-culture-movement-list)

### new-culture-propositions · review

目标：识别三组主张

边界：对应反对愚昧专制、旧道德和旧文学。

入口：qa、mnemonic

来源：new-culture-may-fourth/new-culture-movement (cs-1-9-p17-new-culture-movement-list)

### new-culture-chen-cai · review

目标：对应陈独秀与蔡元培

边界：批判旧礼教不直接等于否定所有传统知识，人物贡献应落在具体活动。

入口：qa、mnemonic

来源：new-culture-may-fourth/new-culture-movement (cs-1-9-p17-new-culture-movement-list)

### new-culture-hu-li · review

目标：对应胡适与李大钊

边界：人物称号不替代具体文章、观点与活动。

入口：qa、mnemonic

来源：new-culture-may-fourth/new-culture-movement (cs-1-9-p17-new-culture-movement-list)

### new-culture-full · review

目标：综合复辨新文化运动

边界：完整文章清单不在本组。

入口：qa、mnemonic

来源：new-culture-may-fourth/new-culture-movement (cs-1-9-p17-new-culture-movement-list)

### may-fourth-trigger · review

目标：识别五四导火索

边界：其他两项分属不同历史事件。

入口：qa、mnemonic

来源：new-culture-may-fourth/may-fourth-movement (cs-1-9-p17-may-fourth-movement-list)

### may-fourth-forces · review

目标：区分先锋与主力

边界：顺序不能倒置。

入口：qa、mnemonic

来源：new-culture-may-fourth/may-fourth-movement (cs-1-9-p17-may-fourth-movement-list)

### may-fourth-nature · review

目标：识别性质与力量变化

边界：不等于此前从未有工人参与抗争。

入口：qa、mnemonic

来源：new-culture-may-fourth/may-fourth-movement (cs-1-9-p17-may-fourth-movement-list)

### may-fourth-significance · review

目标：识别历史意义

边界：不表述为完成全部革命任务。

入口：qa、mnemonic

来源：new-culture-may-fourth/may-fourth-movement (cs-1-9-p17-may-fourth-movement-list)

### may-fourth-full · review

目标：综合复辨五四运动

边界：口号和人物名单保留在正文。

入口：qa、mnemonic

来源：new-culture-may-fourth/may-fourth-movement (cs-1-9-p17-may-fourth-movement-list)

### cpc-foundations · review

目标：识别成立基础

边界：不要把其他历史组织和事件拼入。

入口：qa、mnemonic

来源：communist-revolution/cpc-foundations (cs-1-9-p17-p18-cpc-foundations-list)

### cpc-first-time-place · review

目标：识别一大时地与标志

边界：二大制定纲领，国民党一大标志第一次合作。

入口：qa、mnemonic

来源：communist-revolution/cpc-first-congress (cs-1-9-p18-cpc-first-congress-list)

### cpc-first-delegates · review

目标：识别一大代表边界

边界：地方组织推举12人与另有委派1人的讨论须说明统计对象，不直接断言一大只有12名代表。

入口：qa、mnemonic

来源：communist-revolution/cpc-first-congress (cs-1-9-p18-cpc-first-congress-list)；communist-revolution/cpc-first-congress (cs-1-9-p18-cpc-first-congress-delegates-table)

### cpc-first-content · review

目标：识别一大主要内容

边界：另两项分别对应国民党一大和中共二大。

入口：qa、mnemonic

来源：communist-revolution/cpc-first-congress (cs-1-9-p18-cpc-first-congress-content-list)

### cpc-first-full · review

目标：综合复辨成立基础与一大

边界：完整名单和五项细目留在正文。

入口：qa、mnemonic

来源：communist-revolution/cpc-foundations (cs-1-9-p17-p18-cpc-foundations-list)；communist-revolution/cpc-first-congress (cs-1-9-p18-cpc-first-congress-list)；communist-revolution/cpc-first-congress (cs-1-9-p18-cpc-first-congress-delegates-table)；communist-revolution/cpc-first-congress (cs-1-9-p18-cpc-first-congress-content-list)

### cpc-second-time-place · review

目标：识别二大时地

边界：另两项对应一大地点线索和三大。

入口：qa、mnemonic

来源：communist-revolution/cpc-second-congress (cs-1-9-p18-cpc-second-congress-list)

### cpc-second-high-program · review

目标：识别最高纲领

边界：反帝反封建是最低纲领。

入口：qa、mnemonic

来源：communist-revolution/cpc-second-congress (cs-1-9-p18-cpc-second-congress-list)

### cpc-second-low-program · review

目标：识别最低纲领

边界：区别当时阶段任务与最高纲领的长远目标。

入口：qa、mnemonic

来源：communist-revolution/cpc-second-congress (cs-1-9-p18-cpc-second-congress-list)

### cpc-second-significance · review

目标：识别二大历史地位

边界：另两项对应辛亥思想和国民党一大。

入口：qa、mnemonic

来源：communist-revolution/cpc-second-congress (cs-1-9-p18-cpc-second-congress-list)

### cpc-second-full · review

目标：综合复辨二大纲领

边界：本组不扩展后续会议。

入口：qa、mnemonic

来源：communist-revolution/cpc-second-congress (cs-1-9-p18-cpc-second-congress-list)

### cpc-third-core · review

目标：识别中共三大

边界：整体并入或拒绝合作都不符合正文。

入口：qa、mnemonic

来源：national-revolution/cpc-third-congress (cs-1-9-p18-cpc-third-congress-list)

### kmt-first-core · review

目标：识别国民党一大

边界：另两项混入中共二大和合作破裂。

入口：qa、mnemonic

来源：national-revolution/kmt-first-congress (cs-1-9-p19-kmt-first-congress-list)

### cpc-fourth-core · review

目标：识别中共四大

边界：另两项对应二大与国民党一大。

入口：qa、mnemonic

来源：national-revolution/cpc-fourth-congress (cs-1-9-p19-cpc-fourth-congress-list)

### may30-strike-core · review

目标：识别五卅与省港罢工

边界：不以缺少比较范围的世界最长或影响最大代替地点、参与者和诉求。

入口：qa、mnemonic

来源：national-revolution/may-thirtieth-movement (cs-1-9-p19-may-thirtieth-movement-list)；national-revolution/canton-hong-kong-strike (cs-1-9-p19-canton-hong-kong-strike-list)

### national-cooperation-full · review

目标：综合复辨合作形成与群众运动

边界：完整代表与镇压过程留在正文。

入口：qa、mnemonic

来源：national-revolution/cpc-third-congress (cs-1-9-p18-cpc-third-congress-list)；national-revolution/kmt-first-congress (cs-1-9-p19-kmt-first-congress-list)；national-revolution/cpc-fourth-congress (cs-1-9-p19-cpc-fourth-congress-list)；national-revolution/may-thirtieth-movement (cs-1-9-p19-may-thirtieth-movement-list)；national-revolution/canton-hong-kong-strike (cs-1-9-p19-canton-hong-kong-strike-list)

### northern-expedition-core · review

目标：识别北伐

边界：不要与其他时期人物混淆。

入口：qa、mnemonic

来源：national-revolution/northern-expedition (cs-1-9-p19-northern-expedition-list)

### cooperation-coups · review

目标：识别合作破裂政变

边界：另两项属于其他历史阶段。

入口：qa、mnemonic

来源：national-revolution/first-cooperation-break (cs-1-9-p19-first-cooperation-break-list)

### cooperation-break-core · review

目标：识别合作破裂结果

边界：区分1927年4月与7月的不同阶段。

入口：qa、mnemonic

来源：national-revolution/first-cooperation-break (cs-1-9-p19-first-cooperation-break-list)

### cpc-fifth-core · review

目标：识别中共五大

边界：另两项混入二大与国民党一大。

入口：qa、mnemonic

来源：national-revolution/cpc-fifth-congress (cs-1-9-p19-cpc-fifth-congress-list)

### national-end-full · review

目标：综合复辨北伐与合作破裂

边界：战争过程不在本组。

入口：qa、mnemonic

来源：national-revolution/northern-expedition (cs-1-9-p19-northern-expedition-list)；national-revolution/first-cooperation-break (cs-1-9-p19-first-cooperation-break-list)；national-revolution/cpc-fifth-congress (cs-1-9-p19-cpc-fifth-congress-list)

### nanchang-uprising-core · review

目标：识别南昌起义

边界：另两项对应中共二大、国民党一大。

入口：qa、mnemonic

来源：land-revolution/nanchang-uprising (cs-1-9-p19-nanchang-uprising-list)

### august-seventh-core · review

目标：识别八七会议

边界：毛泽东提出枪杆子中取得政权。

入口：qa、mnemonic

来源：land-revolution/august-seventh-meeting (cs-1-9-p19-august-seventh-meeting-list)

### autumn-harvest-core · review

目标：识别秋收起义

边界：第一枪对应南昌起义，最大根据地对应中央苏区。

入口：qa、mnemonic

来源：land-revolution/autumn-harvest-uprising (cs-1-9-p19-autumn-harvest-uprising-list)

### jinggangshan-core · review

目标：识别井冈山根据地

边界：中央苏区是全国最大革命根据地。

入口：qa、mnemonic

来源：land-revolution/jinggangshan-base (cs-1-9-p19-jinggangshan-base-list)

### land-uprisings-full · review

目标：综合复辨土地革命早期节点

边界：战斗过程不在本组。

入口：qa、mnemonic

来源：land-revolution/nanchang-uprising (cs-1-9-p19-nanchang-uprising-list)；land-revolution/august-seventh-meeting (cs-1-9-p19-august-seventh-meeting-list)；land-revolution/autumn-harvest-uprising (cs-1-9-p19-autumn-harvest-uprising-list)；land-revolution/jinggangshan-base (cs-1-9-p19-jinggangshan-base-list)

### sanwan-core · review

目标：识别三湾改编

边界：支部建在连上、官兵平等是主要内容。

入口：qa、mnemonic

来源：land-revolution/sanwan-reorganization (cs-1-9-p19-sanwan-reorganization-list)

### gutian-core · review

目标：识别古田会议

边界：另两项对应中共三大和八七会议。

入口：qa、mnemonic

来源：land-revolution/gutian-meeting (cs-1-9-p19-gutian-meeting-list)

### cpc-sixth-core · review

目标：识别中共六大

边界：另两项混入中共五大和中央苏区。

入口：qa、mnemonic

来源：land-revolution/cpc-sixth-congress (cs-1-9-p19-cpc-sixth-congress-list)

### central-soviet-core · review

目标：识别中央苏区

边界：根据地发展不等于在某一天完成的单一建制事件，不以无限定规模排名代替地域和政权事实。

入口：qa、mnemonic

来源：land-revolution/central-soviet (cs-1-9-p20-central-soviet-list)

### land-building-full · review

目标：综合复辨建军与根据地

边界：过密组织数字留在正文。

入口：qa、mnemonic

来源：land-revolution/sanwan-reorganization (cs-1-9-p19-sanwan-reorganization-list)；land-revolution/gutian-meeting (cs-1-9-p19-gutian-meeting-list)；land-revolution/cpc-sixth-congress (cs-1-9-p19-cpc-sixth-congress-list)；land-revolution/central-soviet (cs-1-9-p20-central-soviet-list)

### long-march-start · review

目标：识别长征起点

边界：限定中央红军，不把各支红军不同起点、时间和行程合成同一条路线。

入口：qa、mnemonic

来源：land-revolution/red-army-long-march (cs-1-9-p20-red-army-long-march-list)

### long-march-finish · review

目标：识别长征结束

边界：遵义会议是长征中的转折节点。

入口：qa、mnemonic

来源：land-revolution/red-army-long-march (cs-1-9-p20-red-army-long-march-list)

### long-march-route-water · review

目标：识别渡河路线

边界：限定中央红军，不要求每支红军均经历完全相同的路线。

入口：qa、mnemonic

来源：land-revolution/red-army-long-march (cs-1-9-p20-red-army-long-march-list)

### long-march-route-late · review

目标：识别后段路线

边界：不把会宁与将台堡无条件归入同一现今省份。

入口：qa、mnemonic

来源：land-revolution/red-army-long-march (cs-1-9-p20-red-army-long-march-list)

### long-march-process-full · review

目标：综合复辨长征进程

边界：完整战役过程留在正文。

入口：qa、mnemonic

来源：land-revolution/red-army-long-march (cs-1-9-p20-red-army-long-march-list)

### zunyi-team · review

目标：识别遵义领导小组

边界：遵义会议调整、会后分工与苟坝形成新三人团分属不同阶段。

入口：qa、mnemonic

来源：land-revolution/zunyi-meeting (cs-1-9-p20-zunyi-meeting-list)

### zunyi-significance · review

目标：识别遵义会议意义

边界：另两项对应中共一大和国民党一大。

入口：qa、mnemonic

来源：land-revolution/zunyi-meeting (cs-1-9-p20-zunyi-meeting-list)

### long-march-poem-dates · review

目标：识别诗作时间

边界：时间仅按正文识别。

入口：qa、mnemonic

来源：land-revolution/long-march-poems (cs-1-9-p20-p21-long-march-poems-list)

### long-march-poem-lines · review

目标：匹配代表诗句

边界：另两项作品错配。

入口：qa、mnemonic

来源：land-revolution/long-march-poems (cs-1-9-p20-p21-long-march-poems-list)

### zunyi-poems-full · review

目标：综合复辨遵义与诗作

边界：不要求背诵全文。

入口：qa、mnemonic

来源：land-revolution/zunyi-meeting (cs-1-9-p20-zunyi-meeting-list)；land-revolution/long-march-poems (cs-1-9-p20-p21-long-march-poems-list)

### september-18-core · review

目标：识别抗战起点

边界：七七事变对应全国抗战开始。

入口：qa、mnemonic

来源：anti-japanese-liberation/anti-japanese-outbreak (cs-1-9-p21-anti-japanese-war-outbreak-list)

### december-9-core · review

目标：识别一二九运动

边界：背景、时间和主体需同时对应。

入口：qa、mnemonic

来源：anti-japanese-liberation/anti-japanese-outbreak (cs-1-9-p21-anti-japanese-war-outbreak-list)

### july-7-core · review

目标：识别全面抗战开始

边界：九一八是抗战起点，西安事变促成战线初步形成。

入口：qa、mnemonic

来源：anti-japanese-liberation/anti-japanese-outbreak (cs-1-9-p21-anti-japanese-war-outbreak-list)

### nanjing-massacre-core · review

目标：识别南京大屠杀

边界：不以伤亡数字作为本题考点。

入口：qa、mnemonic

来源：anti-japanese-liberation/anti-japanese-outbreak (cs-1-9-p21-anti-japanese-war-outbreak-list)

### anti-outbreak-full · review

目标：综合复辨抗战爆发节点

边界：完整口号与伤亡细节留在正文。

入口：qa、mnemonic

来源：anti-japanese-liberation/anti-japanese-outbreak (cs-1-9-p21-anti-japanese-war-outbreak-list)

### wayaobao-core · review

目标：识别瓦窑堡会议

边界：洛川会议制定全面抗战路线。

入口：qa、mnemonic

来源：anti-japanese-liberation/anti-japanese-united-front (cs-1-9-p21-anti-japanese-united-front-list)

### xian-incident-core · review

目标：识别西安事变意义

边界：正式形成在1937年9月。

入口：qa、mnemonic

来源：anti-japanese-liberation/anti-japanese-united-front (cs-1-9-p21-anti-japanese-united-front-list)

### luochuan-core · review

目标：识别洛川会议

边界：另两项对应八七会议和国民党一大。

入口：qa、mnemonic

来源：anti-japanese-liberation/anti-japanese-united-front (cs-1-9-p21-anti-japanese-united-front-list)

### united-front-formal · review

目标：识别战线正式形成

边界：西安事变是初步形成，瓦窑堡是确定方针。

入口：qa、mnemonic

来源：anti-japanese-liberation/anti-japanese-united-front (cs-1-9-p21-anti-japanese-united-front-list)

### anti-front-full · review

目标：综合复辨统一战线形成

边界：皖南事变另留正文。

入口：qa、mnemonic

来源：anti-japanese-liberation/anti-japanese-united-front (cs-1-9-p21-anti-japanese-united-front-list)

### shanghai-battle-core · review

目标：识别淞沪会战

边界：不用未限定范围的规模最大或最惨烈替代具体地点和历史作用。

入口：qa、mnemonic

来源：anti-japanese-liberation/nationwide-resistance (cs-1-9-p21-p22-nationwide-resistance-list)

### pingxingguan-core · review

目标：识别平型关大捷

边界：不能把此前所有抗日斗争都解释为从未取得胜利。

入口：qa、mnemonic

来源：anti-japanese-liberation/nationwide-resistance (cs-1-9-p21-p22-nationwide-resistance-list)

### taierzhuang-core · review

目标：识别台儿庄战役

边界：会战整体与其中一场战斗不同，不以缺少时间范围的最大胜利作结论。

入口：qa、mnemonic

来源：anti-japanese-liberation/nationwide-resistance (cs-1-9-p21-p22-nationwide-resistance-list)

### wuhan-battle-core · review

目标：识别战略相持阶段

边界：其他会战的正文地位不同。

入口：qa、mnemonic

来源：anti-japanese-liberation/nationwide-resistance (cs-1-9-p21-p22-nationwide-resistance-list)

### resistance-battles-full · review

目标：综合复辨抗战会战

边界：战役过程与兵力数字留在正文。

入口：qa、mnemonic

来源：anti-japanese-liberation/nationwide-resistance (cs-1-9-p21-p22-nationwide-resistance-list)

### hundred-regiments-core · review

目标：识别百团大战

边界：不用未限定比较范围的最大最长最丰富排名作为识别依据。

入口：qa、mnemonic

来源：anti-japanese-liberation/nationwide-resistance (cs-1-9-p21-p22-nationwide-resistance-list)

### war-victory-core · review

目标：识别抗战胜利时间线

边界：台湾于10月25日回归。

入口：qa、mnemonic

来源：anti-japanese-liberation/nationwide-resistance (cs-1-9-p21-p22-nationwide-resistance-list)

### yanan-rectification-core · review

目标：识别延安整风

边界：不混入遵义或国民党线索。

入口：qa、mnemonic

来源：anti-japanese-liberation/nationwide-resistance (cs-1-9-p21-p22-nationwide-resistance-list)

### cpc-seventh-core · review

目标：识别中共七大

边界：另两项对应中共二大和八七会议。

入口：qa、mnemonic

来源：anti-japanese-liberation/nationwide-resistance (cs-1-9-p21-p22-nationwide-resistance-list)

### anti-later-full · review

目标：综合复辨抗战后期

边界：详细受降及历史决议清单留在正文。

入口：qa、mnemonic

来源：anti-japanese-liberation/nationwide-resistance (cs-1-9-p21-p22-nationwide-resistance-list)

### chongqing-purpose · review

目标：识别重庆谈判目的

边界：另两项属于更早历史阶段。

入口：qa、mnemonic

来源：liberation-war/chongqing-negotiations (cs-1-9-p22-chongqing-negotiations-list)

### double-tenth-core · review

目标：识别双十协定

边界：名称、日期与场景需对应。

入口：qa、mnemonic

来源：liberation-war/chongqing-negotiations (cs-1-9-p22-chongqing-negotiations-list)

### counteroffensive-actors · review

目标：识别战略反攻人物

边界：另两组对应其他历史情境。

入口：qa、mnemonic

来源：liberation-war/strategic-counteroffensive (cs-1-9-p22-strategic-counteroffensive-list)

### counteroffensive-route · review

目标：识别战略反攻路线

边界：另两项对应长征与渡江战役。

入口：qa、mnemonic

来源：liberation-war/strategic-counteroffensive (cs-1-9-p22-strategic-counteroffensive-list)

### liberation-turn-full · review

目标：综合复辨谈判与反攻

边界：谈判天数不进入口诀。

入口：qa、mnemonic

来源：liberation-war/chongqing-negotiations (cs-1-9-p22-chongqing-negotiations-list)；liberation-war/strategic-counteroffensive (cs-1-9-p22-strategic-counteroffensive-list)

### three-campaigns-core · review

目标：识别三大战役

边界：不要与抗战会战或起义混淆。

入口：qa、mnemonic

来源：liberation-war/three-campaigns (cs-1-9-p22-three-campaigns-list)

### huaihai-feature · review

目标：识别淮海战役特点

边界：本题不要求兵力数字。

入口：qa、mnemonic

来源：liberation-war/three-campaigns (cs-1-9-p22-three-campaigns-list)

### seventh-second-plenum-core · review

目标：识别七届二中全会

边界：另两项对应中共七大、遵义会议。

入口：qa、mnemonic

来源：liberation-war/seventh-central-second-plenum (cs-1-9-p23-seventh-central-second-plenum-list)

### yangtze-campaign-core · review

目标：识别渡江战役

边界：南京解放不等于大陆所有地区在同一天全部解放。

入口：qa、mnemonic

来源：liberation-war/yangtze-crossing-campaign (cs-1-9-p23-yangtze-crossing-campaign-list)

### liberation-decision-full · review

目标：综合复辨决战与转折

边界：战役过程与兵力数字留在正文。

入口：qa、mnemonic

来源：liberation-war/three-campaigns (cs-1-9-p22-three-campaigns-list)；liberation-war/seventh-central-second-plenum (cs-1-9-p23-seventh-central-second-plenum-list)；liberation-war/yangtze-crossing-campaign (cs-1-9-p23-yangtze-crossing-campaign-list)

### prc-founding-core · review

目标：识别新中国成立

边界：社会主义制度基本建立对应1956年底三大改造完成。

入口：qa、mnemonic

来源：new-china-reform/prc-founding (cs-1-9-p23-prc-founding-list)

### land-reform-law-core · review

目标：识别土地改革法律与制度

边界：不要把后续宪法、外交或集体化线索混入。

入口：qa、mnemonic

来源：new-china-reform/land-reform (cs-1-9-p23-land-reform-list)

### land-reform-completion-core · review

目标：识别土地改革完成节点

边界：“基本完成”不能改写为无例外的全部完成。

入口：qa、mnemonic

来源：new-china-reform/land-reform (cs-1-9-p23-land-reform-list)

### korean-war-line-core · review

目标：识别抗美援朝时间线

边界：源文周年提示具有时效性，不作为本题目标。

入口：qa、mnemonic

来源：new-china-reform/korean-war (cs-1-9-p23-korean-war-list)

### new-china-consolidation-full · review

目标：综合复辨成立与巩固

边界：本题不扩展土地改革过程或战争战役。

入口：qa、mnemonic

来源：new-china-reform/prc-founding (cs-1-9-p23-prc-founding-list)；new-china-reform/land-reform (cs-1-9-p23-land-reform-list)；new-china-reform/korean-war (cs-1-9-p23-korean-war-list)

### peaceful-proposal-core · review

目标：识别五项原则首次提出

边界：1955年万隆会议是发展为十项原则的节点。

入口：qa、mnemonic

来源：new-china-reform/peaceful-coexistence (cs-1-9-p23-peaceful-coexistence-list)

### peaceful-content-core · review

目标：识别五项原则内容

边界：万隆会议的发展不改变本题对五项内容的辨认。

入口：qa、mnemonic

来源：new-china-reform/peaceful-coexistence (cs-1-9-p23-peaceful-coexistence-list)

### un-seat-core · review

目标：识别联合国合法席位恢复

边界：尼克松访华和正式建交是中美关系节点。

入口：qa、mnemonic

来源：new-china-reform/un-seat-restoration (cs-1-9-p24-un-seat-restoration-list)

### china-us-nodes-core · review

目标：区分中美关系节点

边界：访问和建交不能合并为同一事件。

入口：qa、mnemonic

来源：new-china-reform/china-us-relations (cs-1-9-p24-china-us-relations-list)

### new-china-diplomacy-full · review

目标：综合复辨外交节点

边界：国际关系评价和谈判过程留在正文外。

入口：qa、mnemonic

来源：new-china-reform/peaceful-coexistence (cs-1-9-p23-peaceful-coexistence-list)；new-china-reform/un-seat-restoration (cs-1-9-p24-un-seat-restoration-list)；new-china-reform/china-us-relations (cs-1-9-p24-china-us-relations-list)

### first-plan-years-core · review

目标：识别一五计划年份

边界：本题不考正文未列出的项目名单。

入口：qa、mnemonic

来源：new-china-reform/first-five-year-plan (cs-1-9-p24-first-five-year-plan-list)

### plan-planning-name-core · review

目标：区分计划与规划名称

边界：名称变更不等于五年安排从此才出现。

入口：qa、mnemonic

来源：new-china-reform/first-five-year-plan (cs-1-9-p24-first-five-year-plan-list)

### one-industrialization-core · review

目标：识别一化

边界：不要用其他现代化表述替代正文概念。

入口：qa、mnemonic

来源：new-china-reform/socialist-transformation (cs-1-9-p24-socialist-transformation-list)

### three-transformations-core · review

目标：识别三改对象

边界：本题只辨对象，不展开改造形式。

入口：qa、mnemonic

来源：new-china-reform/socialist-transformation (cs-1-9-p24-socialist-transformation-list)

### industrialization-plan-full · review

目标：综合复辨一五与一化三改

边界：项目清单和改造过程不在本组。

入口：qa、mnemonic

来源：new-china-reform/first-five-year-plan (cs-1-9-p24-first-five-year-plan-list)；new-china-reform/socialist-transformation (cs-1-9-p24-socialist-transformation-list)

### constitution-1954-date-core · review

目标：识别1954年宪法时间

边界：1949年和1956年对应其他现代史节点。

入口：qa、mnemonic

来源：new-china-reform/constitution-1954 (cs-1-9-p24-constitution-1954-list)

### constitution-1954-status-core · review

目标：识别1954年宪法定位

边界：“新中国第一部”不能扩大为中国历史第一部。

入口：qa、mnemonic

来源：new-china-reform/constitution-1954 (cs-1-9-p24-constitution-1954-list)

### transformation-completion-core · review

目标：识别三大改造完成时间

边界：基本完成不等于所有建设任务和全部工业化已完成。

入口：qa、mnemonic

来源：new-china-reform/socialist-transformation (cs-1-9-p24-socialist-transformation-list)

### transformation-significance-core · review

目标：识别三大改造意义

边界：新中国成立和十一届三中全会对应另两个选项。

入口：qa、mnemonic

来源：new-china-reform/socialist-transformation (cs-1-9-p24-socialist-transformation-list)

### constitution-transformation-full · review

目标：综合复辨宪法与改造

边界：宪法条文和改造形式留在正文。

入口：qa、mnemonic

来源：new-china-reform/constitution-1954 (cs-1-9-p24-constitution-1954-list)；new-china-reform/socialist-transformation (cs-1-9-p24-socialist-transformation-list)

### third-plenum-time-core · review

目标：识别十一届三中全会时间地点

边界：不扩展会议完整议程。

入口：qa、mnemonic

来源：reform-opening-period/eleventh-central-third-plenum (cs-1-9-p24-eleventh-central-third-plenum-list)

### third-plenum-decision-core · review

目标：识别十一届三中全会决策

边界：另两项属于不同历史节点。

入口：qa、mnemonic

来源：reform-opening-period/eleventh-central-third-plenum (cs-1-9-p24-eleventh-central-third-plenum-list)

### third-plenum-full · review

目标：综合复辨十一届三中全会

边界：改革开放具体政策不在本组。

入口：qa、mnemonic

来源：reform-opening-period/eleventh-central-third-plenum (cs-1-9-p24-eleventh-central-third-plenum-list)

### hong-kong-return-core · review

目标：识别香港回归

边界：1999年日期对应澳门。

入口：qa、mnemonic

来源：reform-opening-period/hong-kong-macau-return (cs-1-9-p24-hong-kong-macau-return-list)

### macao-return-core · review

目标：识别澳门回归

边界：1997年日期对应香港。

入口：qa、mnemonic

来源：reform-opening-period/hong-kong-macau-return (cs-1-9-p24-hong-kong-macau-return-list)

### hong-kong-macao-order-core · review

目标：区分港澳回归顺序

边界：记忆时把对象和年份成对保留。

入口：qa、mnemonic

来源：reform-opening-period/hong-kong-macau-return (cs-1-9-p24-hong-kong-macau-return-list)

### hong-kong-macao-full · review

目标：综合复辨港澳回归

边界：谈判与制度安排不在本组。

入口：qa、mnemonic

来源：reform-opening-period/hong-kong-macau-return (cs-1-9-p24-hong-kong-macau-return-list)

### shuowen-author-core · review

目标：识别说文作者

边界：不要把作者与另外两部书错配。

入口：qa、mnemonic

来源：book-records/book-records-table (cs-10-15-p9-p10-book-records-table)

### shuowen-status-core · review

目标：识别说文地位

边界：正文另补《尔雅》为第一部词典，不能混同。

入口：qa、mnemonic

来源：book-records/book-records-table (cs-10-15-p9-p10-book-records-table)

### wenxin-author-core · review

目标：识别文心作者

边界：作者与时代成对记忆。

入口：qa、mnemonic

来源：book-records/book-records-table (cs-10-15-p9-p10-book-records-table)

### wenxin-status-core · review

目标：识别文心地位

边界：字书和丛书的地位不同。

入口：qa、mnemonic

来源：book-records/book-records-table (cs-10-15-p9-p10-book-records-table)

### book-lexicon-theory-full · review

目标：综合复辨字书与理论著作

边界：作品内容和版本史不在本组。

入口：qa、mnemonic

来源：book-records/book-records-table (cs-10-15-p9-p10-book-records-table)

### yongle-author-core · review

目标：识别永乐大典编者

边界：区分明代类书纂修与清代四库全书编修。

入口：qa、mnemonic

来源：book-records/book-records-table (cs-10-15-p9-p10-book-records-table)

### yongle-status-core · review

目标：识别永乐大典地位

边界：区分类书与丛书体例，不以没有比较范围的最大直接辨认。

入口：qa、mnemonic

来源：book-records/book-records-table (cs-10-15-p9-p10-book-records-table)

### siku-author-status-core · review

目标：识别四库主编与地位

边界：另两项对应其他书。

入口：qa、mnemonic

来源：book-records/book-records-table (cs-10-15-p9-p10-book-records-table)

### siku-four-parts-core · review

目标：识别四库四部

边界：本题只辨分部名称。

入口：qa、mnemonic

来源：book-records/book-records-table (cs-10-15-p9-p10-book-records-table)

### book-collections-full · review

目标：综合复辨类书与丛书

边界：编纂过程和具体收录范围留在正文。

入口：qa、mnemonic

来源：book-records/book-records-table (cs-10-15-p9-p10-book-records-table)

### five-rites-jia-ji-core · review

目标：区分吉礼嘉礼

边界：吉礼、嘉礼的补充范围见原文。

入口：qa、mnemonic

来源：ritual-system/five-rites (cs-10-15-p13-five-rites-list)；ritual-system/auspicious-rite (cs-10-15-p13-auspicious-rite-list)；ritual-system/festive-rite (cs-10-15-p13-festive-rite-list)

### five-rites-bin-jun-core · review

目标：区分宾礼军礼

边界：按事项和礼名成对记忆。

入口：qa、mnemonic

来源：ritual-system/five-rites (cs-10-15-p13-five-rites-list)

### five-rites-xiong-core · review

目标：识别凶礼

边界：本题不展开丧礼等级称谓。

入口：qa、mnemonic

来源：ritual-system/five-rites (cs-10-15-p13-five-rites-list)

### jia-ji-detail-core · review

目标：辨析吉礼嘉礼范围

边界：本题只按正文分类。

入口：qa、mnemonic

来源：ritual-system/auspicious-rite (cs-10-15-p13-auspicious-rite-list)；ritual-system/festive-rite (cs-10-15-p13-festive-rite-list)

### five-rites-full · review

目标：综合复辨五礼

边界：礼仪演变和地区差异不在本组。

入口：qa、mnemonic

来源：ritual-system/five-rites (cs-10-15-p13-five-rites-list)；ritual-system/auspicious-rite (cs-10-15-p13-auspicious-rite-list)；ritual-system/festive-rite (cs-10-15-p13-festive-rite-list)

### marriage-nacai-wenming-core · review

目标：识别纳采问名

边界：另两项对应后续步骤。

入口：qa、mnemonic

来源：ritual-system/six-marriage-rites (cs-10-15-p13-six-marriage-rites-list)

### marriage-naji-nazheng-core · review

目标：识别纳吉纳征

边界：不要仅凭现代字面理解。

入口：qa、mnemonic

来源：ritual-system/six-marriage-rites (cs-10-15-p13-six-marriage-rites-list)

### marriage-qingqi-qinying-core · review

目标：识别请期亲迎

边界：两项位于六礼末段。

入口：qa、mnemonic

来源：ritual-system/six-marriage-rites (cs-10-15-p13-six-marriage-rites-list)

### marriage-order-core · review

目标：识别六礼顺序

边界：顺序题不扩展具体仪式。

入口：qa、mnemonic

来源：ritual-system/six-marriage-rites (cs-10-15-p13-six-marriage-rites-list)

### marriage-six-full · review

目标：综合复辨婚礼六礼

边界：地区习俗差异不在本组。

入口：qa、mnemonic

来源：ritual-system/six-marriage-rites (cs-10-15-p13-six-marriage-rites-list)

### grand-sacrifice-animals-core · review

目标：识别太牢组合

边界：正文中的豕即猪。

入口：qa、mnemonic

来源：ritual-system/grand-lesser-sacrifice (cs-10-15-p13-grand-lesser-sacrifice-list)

### grand-sacrifice-context-core · review

目标：识别太牢情境

边界：本题不扩展祭祀程序。

入口：qa、mnemonic

来源：ritual-system/grand-lesser-sacrifice (cs-10-15-p13-grand-lesser-sacrifice-list)

### lesser-sacrifice-animals-core · review

目标：识别少牢组合

边界：太牢才是三牲全备。

入口：qa、mnemonic

来源：ritual-system/grand-lesser-sacrifice (cs-10-15-p13-grand-lesser-sacrifice-list)

### lesser-sacrifice-context-core · review

目标：识别少牢情境

边界：不要只凭牲畜数量判断全部历史情境。

入口：qa、mnemonic

来源：ritual-system/grand-lesser-sacrifice (cs-10-15-p13-grand-lesser-sacrifice-list)

### grand-lesser-sacrifice-full · review

目标：综合复辨太牢少牢

边界：祭祀程序和历史变迁不在本组。

入口：qa、mnemonic

来源：ritual-system/grand-lesser-sacrifice (cs-10-15-p13-grand-lesser-sacrifice-list)

### funeral-emperor-lord-core · review

目标：区分天子诸侯称谓

边界：按身份层级成对记忆。

入口：qa、mnemonic

来源：ritual-system/funeral-rite (cs-10-15-p13-funeral-rite-list)

### funeral-official-scholar-core · review

目标：区分大夫士称谓

边界：不要与天子、诸侯称谓混淆。

入口：qa、mnemonic

来源：ritual-system/funeral-rite (cs-10-15-p13-funeral-rite-list)

### funeral-commoner-core · review

目标：识别庶人称谓

边界：本题只按正文等级称谓。

入口：qa、mnemonic

来源：ritual-system/funeral-rite (cs-10-15-p13-funeral-rite-list)

### funeral-rank-order-core · review

目标：识别完整身份次序

边界：顺序与身份必须同时匹配。

入口：qa、mnemonic

来源：ritual-system/funeral-rite (cs-10-15-p13-funeral-rite-list)

### funeral-rank-full · review

目标：综合复辨丧礼称谓

边界：正文未列称谓不在本组。

入口：qa、mnemonic

来源：ritual-system/funeral-rite (cs-10-15-p13-funeral-rite-list)

### light-electromagnetic-core · review

目标：识别光的电磁波属性

边界：本题按基础光学识别光的属性，不展开波粒二象性。

入口：qa、mnemonic

来源：optics/light-nature (cs-16-22-p10-p11-light-nature-list)

### light-year-core · review

目标：在天文距离情境中识别光年的物理量

边界：“年”出现在定义中，不改变光年属于长度单位。

入口：qa、mnemonic

来源：optics/light-nature (cs-16-22-p10-p11-light-nature-list)

### visible-light-core · review

目标：从电磁波中识别人眼可直接感知的可见光

边界：这里只按普通人眼的可见范围判断，不讨论仪器探测。

入口：qa、mnemonic

来源：optics/light-nature (cs-16-22-p10-p11-light-nature-list)

### visible-order-core · review

目标：判断可见光由红到紫时波长与频率的变化

边界：本题只判断相对变化方向，不要求计算具体数值。

入口：qa、mnemonic

来源：optics/light-nature (cs-16-22-p10-p11-light-nature-list)

### light-basics-full · review

目标：综合运用光的属性、光年、可见范围和红紫方向

边界：综合题不涉及光年换算和完整电磁波谱。

入口：qa、mnemonic

来源：optics/light-nature (cs-16-22-p10-p11-light-nature-list)

### infrared-wavelength-core · review

目标：利用光谱位置识别红外线的波长与可见性

边界：本题只比较波长和可见性，不扩展完整电磁波谱。

入口：qa、mnemonic

来源：optics/light-nature (cs-16-22-p10-p11-light-nature-list)

### infrared-applications-core · review

目标：从设备用途识别红外线应用

边界：本题识别典型应用，不讨论设备操作或医学用途。

入口：qa、mnemonic

来源：optics/light-nature (cs-16-22-p10-p11-light-nature-list)

### ultraviolet-wavelength-core · review

目标：利用光谱位置识别紫外线的波长、可见性和臭氧吸收

边界：本题不讨论紫外暴露剂量和防护建议。

入口：qa、mnemonic

来源：optics/light-nature (cs-16-22-p10-p11-light-nature-list)

### ultraviolet-applications-core · review

目标：从生活用途识别紫外线应用

边界：本题只识别验钞和杀菌两类典型用途。

入口：qa、mnemonic

来源：optics/light-nature (cs-16-22-p10-p11-light-nature-list)

### infrared-ultraviolet-full · review

目标：综合区分红外线与紫外线的波长、可见性和用途

边界：综合题不讨论精确波段、剂量和医学安全。

入口：qa、mnemonic

来源：optics/light-nature (cs-16-22-p10-p11-light-nature-list)

### light-straight-condition-core · review

目标：在给定介质条件下判断光能否按直线传播

边界：结论不能扩大为光在任意不均匀介质或跨介质界面时都沿直线传播。

入口：qa、mnemonic

来源：optics/light-propagation (cs-16-22-p11-p12-light-propagation-list)

### light-straight-examples-core · review

目标：从遮挡和准直情境识别光的直线传播

边界：本题只识别主要机制；不展开日月食轨道或小孔成像的定量关系。

入口：qa、mnemonic

来源：optics/light-propagation (cs-16-22-p11-p12-light-propagation-list)

### light-reflection-definition-core · review

目标：由返回原介质识别光的反射

边界：若光进入另一透明介质并在交界处改变方向，应按折射判断。

入口：qa、mnemonic

来源：optics/light-propagation (cs-16-22-p11-p12-light-propagation-list)

### specular-diffuse-core · review

目标：根据表面和反射方向区分镜面反射与漫反射

边界：漫反射仍遵循反射规律；区别在于表面微观方向不同造成反射光分散。

入口：qa、mnemonic

来源：optics/light-propagation (cs-16-22-p11-p12-light-propagation-list)

### propagation-reflection-full · review

目标：综合区分直线传播、反射定义和两类反射

边界：综合题只辨认主要机制和条件，不作光路角度计算。

入口：qa、mnemonic

来源：optics/light-propagation (cs-16-22-p11-p12-light-propagation-list)

### light-refraction-definition-core · review

目标：由跨透明介质改变方向识别折射

边界：题干强调光进入另一介质；若返回原介质，应按反射判断。

入口：qa、mnemonic

来源：optics/light-propagation (cs-16-22-p11-p12-light-propagation-list)

### lens-mirror-functions-core · review

目标：在生活器件中区分透镜与面镜的基础作用

边界：这里只识别基础光学作用和常见用途，不讨论具体成像公式。

入口：qa、mnemonic

来源：optics/light-propagation (cs-16-22-p11-p12-light-propagation-list)

### total-reflection-core · review

目标：利用介质方向和临界角条件判断全反射

边界：本题不计算临界角，只判断介质方向和角度条件是否同时具备。

入口：qa、mnemonic

来源：optics/light-propagation (cs-16-22-p11-p12-light-propagation-list)

### light-scattering-core · review

目标：从可见光束情境识别散射

边界：本题仅识别散射机制，不讨论粒径与波长的定量关系。

入口：qa、mnemonic

来源：optics/light-propagation (cs-16-22-p11-p12-light-propagation-list)

### refraction-scattering-full · review

目标：综合区分折射、全反射和散射的条件与现象

边界：本题只判断主要机制，不表示相关场景不存在次要反射或折射。

入口：qa、mnemonic

来源：optics/light-propagation (cs-16-22-p11-p12-light-propagation-list)

### mirage-alias-core · review

目标：由大气折射形成的远景识别蜃景名称

边界：名称识别不等于说明具体大气分层和光路。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-life-optical-phenomena-list)

### mirage-cause-core · review

目标：从空气层密度差异识别蜃景的光学机制

边界：这里只判断主要光学机制，不计算空气折射率或绘制光路。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-life-optical-phenomena-list)

### mirage-image-core · review

目标：依据影像位置与物体位置的差异判断蜃景像的性质

边界：看见影像不表示物体实际位于影像所在位置。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-life-optical-phenomena-list)

### mirage-locations-core · review

目标：由环境特征识别蜃景常见地点

边界：地点只是常见环境线索，不能替代当时大气条件的判断。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-life-optical-phenomena-list)

### mirage-full · review

目标：综合判断蜃景的名称、机制、像和常见环境

边界：综合判断不延伸到具体气象预测或定量光路。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-life-optical-phenomena-list)

### rainbow-cause-core · review

目标：从阳光与雨滴情境识别彩虹形成过程

边界：这里只识别主要过程，不计算各色光的偏折角。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-life-optical-phenomena-list)

### rainbow-order-core · review

目标：依据主虹内外方向判断色序

边界：副虹色序与主虹相反，不能直接套用主虹顺序。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-life-optical-phenomena-list)

### secondary-rainbow-core · review

目标：根据位置、明暗和色序识别副虹

边界：不展开水滴内部的完整光路或能量损失计算。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-life-optical-phenomena-list)

### rainbow-sun-position-core · review

目标：利用太阳与虹相反方位判断观察方向

边界：这里只判断基本相对方位，不推断彩虹出现的持续时间。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-life-optical-phenomena-list)

### rainbow-secondary-full · review

目标：综合区分主虹、副虹及太阳方位

边界：综合辨析不涉及波长、折射角或亮度的定量计算。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-life-optical-phenomena-list)

### light-primary-colors-core · review

目标：从舞台灯光合成情境识别色光三原色

边界：这里只按基础色光模型识别，不扩展到专业色彩空间。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-life-optical-phenomena-list)；optics/life-optics (cs-16-22-p12-light-primary-colors-image)

### pigment-primary-colors-core · review

目标：从绘画调色情境识别颜料三原色

边界：本题依据基础颜料模型，不讨论印刷或工业色彩体系。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-life-optical-phenomena-list)；optics/life-optics (cs-16-22-p12-pigment-primary-colors-image)

### light-color-mixing-core · review

目标：依据灯光重叠结果判断色光叠加关系

边界：这里只判断所列基础色光叠加结果，不推导亮度或光谱。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-light-primary-colors-image)

### pigment-color-mixing-core · review

目标：依据颜料调配结果判断颜料混合关系

边界：这里只识别所列基础颜料混合结果，不讨论实际颜料纯度差异。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-pigment-primary-colors-image)

### primary-colors-full · review

目标：综合区分两套三原色及两色与三色结果

边界：综合辨析仍限于基础模型，不延伸到显示器、印刷或光谱参数。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-life-optical-phenomena-list)；optics/life-optics (cs-16-22-p12-light-primary-colors-image)；optics/life-optics (cs-16-22-p12-pigment-primary-colors-image)

### transparent-color-core · review

目标：从彩色透明片观察情境判断颜色来源

边界：题干讨论透明物体，不套用不透明物体的反射规则。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-object-color-list)

### opaque-color-core · review

目标：从彩色纸片观察情境判断不透明物体颜色来源

边界：题干讨论不透明物体，不套用透明物体的透过规则。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-object-color-list)

### white-black-opaque-core · review

目标：比较白色与黑色不透明物体对单色光的作用

边界：结论限定于所学基础模型，不讨论材料表面的实际反射率。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-object-color-list)

### red-clothes-core · review

目标：用不透明物体反射规则解释红色衣服

边界：本题不讨论光源缺少红光时的综合色彩变化。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-object-color-list)

### object-colors-full · review

目标：综合运用透过、反射和白黑物体规则

边界：归纳仅覆盖基础规则和所列不透明物体情境。

入口：qa、mnemonic

来源：optics/life-optics (cs-16-22-p12-object-color-list)

### q1-treaty-quick-recall · review

目标：用高辨识度条款识别《南京条约》

边界：判断时抓条款组合，不用签约年份单独猜测。

入口：qa、mnemonic

来源：late-qing-invasions/treaty-of-nanjing (cs-1-9-p14-treaty-of-nanjing-list)；first-sino-japanese-war/treaty-of-shimonoseki (cs-1-9-p15-treaty-of-shimonoseki-list)；boxer-rebellion-eight-nation-alliance/boxer-protocol (cs-1-9-p16-boxer-protocol-list)

### q1-treaty-boundary · review

目标：区分《马关条约》与《辛丑条约》的条款边界

边界：本题只比较可直接区分条约的条款，不展开条约影响。

入口：qa、mnemonic

来源：late-qing-invasions/treaty-of-nanjing (cs-1-9-p14-treaty-of-nanjing-list)；first-sino-japanese-war/treaty-of-shimonoseki (cs-1-9-p15-treaty-of-shimonoseki-list)；boxer-rebellion-eight-nation-alliance/boxer-protocol (cs-1-9-p16-boxer-protocol-list)

### q1-treaty-material · review

目标：在短材料中按条款顺序识别三项条约

边界：材料使用高辨识度条款的缩写，作答时应还原完整名称。

入口：qa、mnemonic

来源：late-qing-invasions/treaty-of-nanjing (cs-1-9-p14-treaty-of-nanjing-list)；first-sino-japanese-war/treaty-of-shimonoseki (cs-1-9-p15-treaty-of-shimonoseki-list)；boxer-rebellion-eight-nation-alliance/boxer-protocol (cs-1-9-p16-boxer-protocol-list)

### q1-market-quick-recall · review

目标：完整识别市场失灵四类因素

边界：本题只检查四类名称，具体机制由后续辨析题检验。

入口：qa

来源：market-failure-factors/market-failure-overview (cs-23-30-p13-market-failure-factors-overview-list)

### q1-market-boundary · review

目标：区分负外部性与信息不对称

边界：信息差、公共物品和外部性都可能造成市场失灵，但判断条件不同。

入口：qa

来源：market-failure-factors/market-failure-overview (cs-23-30-p13-market-failure-factors-overview-list)；market-failure-factors/market-failure-externality (cs-23-30-p13-market-failure-externality-list)；market-failure-factors/market-failure-information (cs-23-30-p14-market-failure-information-asymmetry-list)

### q1-market-application · review

目标：在两个短情境中区分负外部性与逆向选择

边界：逆向选择发生在交易前；道德风险通常关注交易后的隐蔽行动。

入口：qa

来源：market-failure-factors/market-failure-overview (cs-23-30-p13-market-failure-factors-overview-list)；market-failure-factors/market-failure-externality (cs-23-30-p13-market-failure-externality-list)；market-failure-factors/market-failure-information (cs-23-30-p14-market-failure-information-asymmetry-list)

## 口诀记法与覆盖范围

### poet-memory · review

记法：对照记忆

覆盖：李白的诗仙称号、杜甫的诗圣称号，以及诗史评价杜甫诗歌。

不覆盖：人物全部字号、生平；作品清单、名句与文学史

- 李白诗仙：诗仙对应李白。；目标 poet-immortal、poet-titles-cross；来源 pre-qin-poetry/li-bai
- 杜甫诗圣：诗圣对应杜甫。；目标 poet-sage；来源 pre-qin-poetry/du-fu
- 诗史评诗，称号记人：诗史评价杜甫的诗歌；诗圣是杜甫的人物称号。；目标 poet-history、poet-sage-history-object；来源 pre-qin-poetry/du-fu

### sound-memory · review

记法：平行对应

覆盖：声音三种特性的基本对应关系，以及响度比较所需的其他条件相同。

不覆盖：传播速度、超声与次声；把振幅视为实际听到响度的唯一因素

- 调高低，看频率：音调描述声音高低，对应发声体振动频率。；目标 sound-pitch；来源 acoustics/sound-characteristics
- 响强弱，看振幅：其他条件相同时，响度描述声音强弱，对应发声体振幅。；目标 sound-loudness、sound-loudness-condition；来源 acoustics/sound-characteristics
- 辨来源，看音色：辨认不同人或发声体的声音特点和来源，主要看音色。；目标 sound-timbre；来源 acoustics/sound-characteristics

### fx-memory · review

记法：先确定本外币身份，再按固定基准分流

覆盖：两种标价法固定的货币基准，以及判断前需要的本币观察口径。

不覆盖：汇率涨跌和货币升贬值的推导；贸易、资本流动与实时汇率

- 固定外币是直接：一定单位外币作为基准，用本币表示外币价格。；目标 fx-direct、fx-direct-scenario；来源 exchange-rate-quotation/exchange-rate-quotation
- 固定本币是间接：一定单位本币作为基准，用外币表示本币价格。；目标 fx-indirect、fx-indirect-scenario；来源 exchange-rate-quotation/exchange-rate-quotation
- 先认本外，再看固定：先确认观察口径中的本币和外币，再判断固定的是哪一方。；目标 fx-context；来源 exchange-rate-quotation/exchange-rate-quotation

### schools-pairing-memory · review

记法：对照记忆

覆盖：老子与道家、墨家兼爱非攻、法家法术势三组对应。

不覆盖：百家所有代表人物；思想的完整内涵与历史演变

- 老子道：老子对应道家。；目标 school-lao；来源 traditional-thought-ritual/hundred-schools
- 墨兼非攻：墨家主张兼爱、非攻。；目标 school-mo；来源 traditional-thought-ritual/hundred-schools
- 法家法术势：法家部分记住法、术、势的组合。；目标 school-fa；来源 traditional-thought-ritual/hundred-schools

### history-genres-memory · review

记法：分类归纳

覆盖：《史记》《资治通鉴》《汉书》的叙述体例与记述范围。

不覆盖：其他史书的作者和地位；全书篇目、具体历史事件与成书经过

- 史记纪传通：《史记》：叙述体例是纪传体，记述范围是通史。；目标 history-shiji；来源 fiction-history-modern-literature/historiography-works
- 通鉴编年通：《资治通鉴》：叙述体例是编年体，记述范围是通史。；目标 history-tongjian；来源 fiction-history-modern-literature/historiography-works
- 汉书纪传断：《汉书》：叙述体例是纪传体，记述范围是断代史。；目标 history-hanshu、history-hanshu-genre；来源 fiction-history-modern-literature/historiography-works

### light-phenomena-memory · review

记法：对照提纲

覆盖：影子、平静水面倒影、水中筷子看似弯折三个现象。

不覆盖：透镜成像公式；散射、全反射与复杂复合现象

- 影子看直线：同种均匀介质中，不透明物体遮挡光线形成影子。；目标 light-shadow；来源 optics/light-propagation
- 倒影看反射：平静水面倒影主要由光的反射形成。；目标 light-reflection；来源 optics/light-propagation
- 折筷看折射：水中筷子看似偏折，主要由光跨水和空气传播时发生折射形成。；目标 light-refraction；来源 optics/light-propagation

### heat-mechanisms-memory · review

记法：情境联想＋平行对应

覆盖：传导、对流、辐射三种传热方式的主要机制和辨认线索。

不覆盖：复杂场景中多种方式的定量占比；物态变化与保温装置的完整分析

- 挨着递是传导：材料内部相邻部分或直接接触物体之间由高温向低温传递热量。；目标 heat-conduction；来源 thermodynamics/heat-transfer
- 流体搬是对流：液体或气体通过整体运动和掺混传递热量。；目标 heat-convection；来源 thermodynamics/heat-transfer
- 电磁送是辐射：热量以电磁辐射形式传递，不要求直接接触或存在流体。；目标 heat-radiation；来源 thermodynamics/heat-transfer

### substance-classification-memory · review

记法：两步决策＋对偶压缩

覆盖：纯净物/混合物与单质/化合物的两层分类顺序和完整条件。

不覆盖：有机物与无机物的分类；同素异形体和具体混合物的复杂判断

- 先数物质：一种纯，多种混：只含一种物质的是纯净物；含两种或多种物质的是混合物。；目标 substance-pure；来源 chemistry/pure-substance、chemistry/mixture
- 纯里数元素：一种单：在纯净物内部，只由同种元素组成的是单质。；目标 substance-simple；来源 chemistry/simple-substance
- 纯里数元素：多种化：在纯净物内部，由两种或两种以上元素组成的是化合物。；目标 substance-compound；来源 chemistry/compound

### demand-supply-roles-memory · review

记法：先锁时期价格，再分买卖角色，最后核对意愿和能力

覆盖：需求和供给的意愿/能力条件与买卖角色。

不覆盖：需求供给曲线移动；价格弹性、均衡与特殊商品

- 消费者愿买且能买，才是需求：需求不能只有愿望，还需购买能力。；目标 demand-conditions、demand-wish；来源 microeconomics/demand-meaning、microeconomics/demand-meaning
- 生产者愿卖且能卖，才是供给：需求从消费者购买看，供给从生产者出售看。；目标 supply-conditions；来源 supply-theory/supply-meaning

### macro-four-goals-memory · review

记法：先用两增一稳一平衡恢复四项目标，再核对增长主次和国际收支边界

覆盖：经济增长、增加就业、稳定物价、国际收支平衡四个目标名称。

不覆盖：目标之间的权衡和定量指标；具体年份政策及财政预算平衡

- 增长最主要：促进经济增长。；目标 macro-growth；来源 macro-control-goals-overview/macro-goals-overview
- 增长就业两项增，物价一稳：增加就业与稳定物价。；目标 macro-jobs-prices；来源 macro-control-goals-overview/macro-goals-overview
- 保国际收支平衡：平衡所指为国际收支。；目标 macro-balance；来源 macro-control-goals-overview/macro-goals-overview

### fiscal-monetary-memory · review

记法：先分政府与央行，再认预算税收或货币工具，最后用买放卖收判断基础方向

覆盖：财政与货币工具识别和现券买卖基础方向。

不覆盖：现实货币政策框架全貌；具体政策判断、投资建议与传导效果

- 财归政府：预算税收：国家预算、税收属于财政手段。；目标 policy-fiscal；来源 fiscal-policy/fiscal-definition
- 币归央行：流动性与利率：央行影响流动性、利率和货币信贷条件，不仅是数量调节。；目标 policy-monetary；来源 monetary-policy/monetary-definition
- 现券买放、卖收：其他条件不变时，央行现券买入投放基础货币，卖出回笼；整体效果还要看其他操作。；目标 policy-bond-purchase；来源 monetary-policy/monetary-application

### inheritance-order-memory · review

记法：对照记忆

覆盖：法定继承一般两顺序及丧偶儿媳/女婿的特定例外。

不覆盖：遗嘱、遗赠扶养协议及代位继承；亲属定义、丧失继承权与遗产份额

- 一顺配、子、父：配偶、子女、父母。；目标 inherit-first；来源 inheritance-methods/statutory-inheritance
- 二顺兄弟姐妹、祖与外祖：兄弟姐妹、祖父母、外祖父母。；目标 inherit-second；来源 inheritance-methods/statutory-inheritance
- 丧偶姻亲尽主要赡养，也作一顺：完整条件见释义，不泛化所有姻亲。；目标 inherit-inlaw；来源 inheritance-methods/statutory-inheritance

### constitution-chapters-memory · review

记法：顺序串联

覆盖：现行宪法第一至四章的顺序与第四章四项内容。

不覆盖：各章具体条文；修宪历史、国家机构职权与国家标志设计史

- 一总：第一章总纲；序言单列在各章之前。；目标 constitution-first；来源 constitution-structure/constitution-structure
- 二权义，三机构：第二章公民的基本权利和义务，第三章国家机构。；目标 constitution-second；来源 constitution-structure/constitution-structure
- 四旗歌徽都：第四章国旗、国歌、国徽、首都。；目标 constitution-fourth；来源 constitution-structure/constitution-structure

### classics-collections-memory · review

记法：分组加差异记忆

覆盖：四书和五经的正文集合，以及六经相对五经增加《乐》的关系。

不覆盖：典籍作者、成书年代和篇章内容；《乐》的流传、版本与经学史

- 四书论中大孟：四书是《论语》《中庸》《大学》《孟子》。；目标 classics-four-books-set、classics-cross-check；来源 ancient-prose/four-books
- 五经诗书礼易春秋：五经是《诗》《书》《礼》《易》《春秋》。；目标 classics-five-exclusion、classics-five-name；来源 ancient-prose/five-classics
- 六经添乐：六经在五经集合上增加《乐》。；目标 classics-six-addition；来源 ancient-prose/five-classics、ancient-prose/six-classics

### si-base-units-memory · review

记法：物理量分组对照

覆盖：七个国际单位制基本单位的名称、常用符号和瓦特的导出单位边界。

不覆盖：单位换算和公式计算；除瓦特外的全部导出单位清单

- 米千秒：长度—米（m），质量—千克（kg），时间—秒（s）。；目标 si-length-mass-time；来源 physics-other/international-units
- 安开摩坎：电流—安培（A），热力学温度—开尔文（K），物质的量—摩尔（mol），发光强度—坎德拉（cd）。；目标 si-current-temperature、si-amount-luminous；来源 physics-other/international-units
- 七基，瓦特是导出：基本单位共有七个；瓦特是功率的导出单位，不属于七个基本单位。；目标 si-base-count、si-base-full-contrast；来源 physics-other/international-units、physics-other/international-units、physics-other/international-units

### si-named-derived-memory · review

记法：四组对照

覆盖：频率、力、压强、能量、功率、电量、电压、电阻及其单位名称和符号。

不覆盖：单位命名人物的生平与发现；单位定义式、换算和计算；正文未列出的其他导出单位

- 赫频牛力：频率—赫兹（Hz），力—牛顿（N）。；目标 si-derived-frequency-force、si-derived-full-contrast；来源 physics-other/international-units
- 帕压焦能：压强—帕斯卡（Pa），能量—焦耳（J）。；目标 si-derived-pressure-energy、si-derived-full-contrast；来源 physics-other/international-units
- 瓦功库电量：功率—瓦特（W），电量—库仑（C）。；目标 si-derived-power-charge、si-derived-full-contrast；来源 physics-other/international-units
- 伏压欧电阻：电压—伏特（V），电阻—欧姆（Ω）。；目标 si-derived-voltage-resistance、si-derived-full-contrast；来源 physics-other/international-units

### market-structure-four-types-memory · review

记法：先看厂商数量，再看产品差别和进入条件；少数厂商追加相互依存，独家追加近似替代品边界

覆盖：四类市场结构，以及各类用于快速识别的正文核心条件。

不覆盖：非价格竞争和价格竞争手段；三级价格歧视；市场结构的数学模型和现实行业的绝对归类

- 完竞、垄竞、寡头、完全垄断：正文列出的四类市场结构。；目标 market-structure-category-set；来源 market-structure-overview/market-structure-classification
- 多同自由全，完全竞：完全竞争有无数买卖者、商品同质、资源完全流动、信息完全。；目标 market-perfect-competition-core；来源 perfect-competition-market/perfect-competition-conditions
- 多而有差易进退，垄断竞：垄断竞争有大量企业、差别化但可替代的同种产品，进入退出较容易。；目标 market-monopolistic-competition-core；来源 monopolistic-competition-market/monopolistic-conditions
- 少数互相看，寡头：寡头垄断厂商极少、进入较难，厂商决策相互依存。；目标 market-oligopoly-core；来源 oligopoly-market/oligopoly-meaning、oligopoly-market/oligopoly-conditions
- 独家无近替、进入难，完全垄断：完全垄断只有一个卖者，产品无十分近似替代品，并存在进入障碍。；目标 market-monopoly-core；来源 monopoly-market/monopoly-meaning、monopoly-market/monopoly-conditions

### price-discrimination-levels-memory · review

记法：先核同等级同质量和不同接受者的定义前提，再按逐单位、数量段、市场人群三级映射

覆盖：价格歧视定义，以及一级、二级、三级的正文区分标准。

不覆盖：实施价格歧视的经济条件和福利分析；现实定价的合法性、成本差异与监管判断

- 同质不同价：相同等级、相同质量的商品或服务，对不同接受者实行不同价格。；目标 price-discrimination-definition、price-discrimination-three-levels；来源 monopoly-market/monopoly-price-discrimination
- 一逐：逐单位看最高支付意愿：每一单位产品按消费者愿意支付的最高价格出售。；目标 price-discrimination-first-degree、price-discrimination-three-levels；来源 monopoly-market/monopoly-price-discrimination
- 二量：看消费数量段：对不同消费数量段规定不同价格。；目标 price-discrimination-second-degree、price-discrimination-three-levels；来源 monopoly-market/monopoly-price-discrimination
- 三人群：看市场或消费群：对不同市场或不同消费群收取不同价格。；目标 price-discrimination-third-degree、price-discrimination-three-levels；来源 monopoly-market/monopoly-price-discrimination

### market-failure-four-factors-memory · review

记法：两组完整术语对照：垄断与外部性，公共物品与信息不对称

覆盖：导致市场失灵的四类因素名称：垄断、外部性、公共物品、信息不对称。

不覆盖：四类因素导致市场失灵的具体机制；正负外部性、公共物品特征、逆向选择和道德风险

- 垄断：垄断。；目标 market-failure-factor-monopoly、market-failure-four-factors-full；来源 market-failure-factors/market-failure-overview
- 外部性：外部性。；目标 market-failure-factor-externality、market-failure-four-factors-full；来源 market-failure-factors/market-failure-overview
- 公共物品：公共物品。；目标 market-failure-factor-public-goods、market-failure-four-factors-full；来源 market-failure-factors/market-failure-overview
- 信息不对称：信息不对称。；目标 market-failure-factor-information、market-failure-four-factors-full；来源 market-failure-factors/market-failure-overview

### market-failure-monopoly-memory · review

记法：先还原控制供给到影响价格的作用链，再接限制价格和反垄断立法两项治理示例

覆盖：市场势力的效率影响及依法维护公平竞争。

不覆盖：垄断福利计算；具体案件和现行法适用

- 限产提价可能损效率：市场势力可能使产量偏离有效竞争水平，不是所有价格变化都证明失灵。；目标 market-failure-monopoly-definition、market-failure-monopoly-chain、market-failure-monopoly-full；来源 market-failure-factors/market-failure-monopoly
- 依法维护公平竞争：依法制止排除限制竞争的行为，特定自然垄断环节可依法监管。；目标 market-failure-monopoly-remedy、market-failure-monopoly-full；来源 market-failure-factors/market-failure-monopoly

### market-failure-externality-memory · review

记法：先核对无关第三方，再判断其得利或受损，最后配对补贴或征税方向

覆盖：第三方利益与成本、负外部性征税、正外部性补贴。

不覆盖：最优税率和补贴额；未影响无关第三方的交易内成本收益

- 交易外部的成本与收益：未获补偿外部成本为负，未充分付费外部收益为正。；目标 market-failure-externality-definition、market-failure-externality-types、market-failure-externality-full；来源 market-failure-factors/market-failure-externality
- 税补方向依条件：税收可使行为者考虑外部成本，补贴可增强外部收益活动激励，具体工具须按条件选择。；目标 market-failure-negative-externality、market-failure-positive-externality、market-failure-externality-full；来源 market-failure-factors/market-failure-externality

### public-goods-mechanism-memory · review

记法：先对照两项属性，再区分纯与准，最后沿搭便车、市场供给不足还原主要供给方向

覆盖：公共与私人物品、纯与准公共物品、搭便车和正文供给方式。

不覆盖：具体物品分类争议；政府供给融资与效率

- 不挤占，难排除：非竞争性与非排他性分别描述消费数量关系和排除未付费者的难易。；目标 public-goods-features、public-private-goods-contrast、public-goods-full；来源 market-failure-factors/market-failure-public-goods
- 纯与准，按条件区分：纯公共物品兼具两项特征，准公共物品至少一项表现不充分，需明确使用条件。；目标 pure-quasi-public-goods、public-goods-full；来源 market-failure-factors/market-failure-public-goods
- 搭便车影响筹资，筹资生产可分：非排他性可能削弱筹资激励；政府筹资或购买服务时，可以由其他主体具体生产提供。；目标 public-goods-free-rider-remedy、public-goods-full；来源 market-failure-factors/market-failure-public-goods

### information-asymmetry-memory · review

记法：先核对交易信息差，再按交易前后与行为机制区分两类风险，最后接信息治理方向

覆盖：信息不对称定义、逆向选择、道德风险和正文解决方向。

不覆盖：具体披露制度；不具备信息不对称条件的普通事前事后行为

- 信息缺少与信息差分开：不完全是缺必要信息，不对称是交易双方相关信息有差异。；目标 information-asymmetry-definition、information-asymmetry-full；来源 market-failure-factors/market-failure-information
- 事前隐藏类型，事后隐藏行为：逆向选择通常涉及事前难辨质量类型，道德风险通常涉及事后难观察行为。；目标 adverse-selection-before、moral-hazard-after、information-asymmetry-full；来源 market-failure-factors/market-failure-information
- 披露认证信誉合同：这些安排及依法监管可缓解信息差，但不保证消除全部风险。；目标 information-asymmetry-remedy、information-asymmetry-full；来源 market-failure-factors/market-failure-information

### gdp-gnp-boundaries-memory · review

记法：五项定义边界—流量生产—地域国民三栏对照

覆盖：GDP 的地域、时期、最终产品、市场价值、流量生产口径及与 GNP 的区别。

不覆盖：名义与实际 GDP；增加值、存货及境外要素收入计算

- 常住单位、时期生产、最终价值：按核算范围计量常住单位一定时期的最终生产成果，也可包括规定范围非市场产出。；目标 gdp-definition-core、gdp-final-intermediate、gdp-gnp-full；来源 economic-growth/economic-growth-gdp
- 时期流量看生产：GDP 是一定时期内生产的流量，不以当期售出为必要条件。；目标 gdp-flow-produced、gdp-gnp-full；来源 economic-growth/economic-growth-gdp
- GDP生产，GNI收入：GNI原称GNP，关注常住单位初次收入，国民不能直接解释为国籍。；目标 gdp-gnp-territory-national、gdp-gnp-full；来源 economic-growth/economic-growth-gdp、economic-growth/economic-growth-gnp

### growth-three-carriages-memory · review

记法：先还原三项名单，再用内外空间关系映射内需和外需

覆盖：投资、消费、出口及内需外需对应。

不覆盖：现实贡献率；净出口核算

- 投资、消费、出口，三驾拉增长：投资、消费、出口。；目标 growth-three-carriages、growth-three-carriages-full；来源 economic-growth/economic-growth-drivers
- 投资消费在内，出口在外：投资和消费合称内需，出口称为外需。；目标 growth-internal-external-demand、growth-three-carriages-full；来源 economic-growth/economic-growth-drivers

### full-employment-memory · review

记法：先核对失业三条件，再按主要原因对位四类型，最后核对比率分母和充分就业边界

覆盖：失业定义、四种原因型失业、失业率分母和充分就业边界。

不覆盖：固定自然失业率数值；复杂现实个案唯一归类

- 无工作、近期求职、能开始：在相应调查范围同时满足无工作、求职与可开始工作的条件。；目标 unemployment-definition、full-employment-full；来源 full-employment/unemployment-meaning、full-employment/unemployment-types、full-employment/unemployment-concepts
- 流动摩擦、错配结构、季节随季、衰退周期：正常流动、结构错配、季节变化、周期衰退分别对应四类失业。；目标 unemployment-types、full-employment-full；来源 full-employment/unemployment-types
- 失业除以就业加失业：分母为同口径就业与失业人口之和。；目标 unemployment-rate、full-employment-full；来源 full-employment/employment-measure、full-employment/unemployment-concepts
- 充分就业仍可有自然失业：常用理论模型中摩擦和结构性失业仍可存在，不采用统一固定自然失业率。；目标 full-employment-not-zero、full-employment-full；来源 full-employment/unemployment-concepts

### stable-prices-memory · review

记法：先按普涨普降与总供求方向对照通胀通缩，再按生活、投入、批发映射三类指数

覆盖：通胀通缩基本定义和三类价格指数对象。

不覆盖：固定 CPI 阈值；具体合同的通胀再分配结果

- 一般价格持续上涨：通胀成因可涉及需求、成本或供给冲击等，不限于单一原因。；目标 inflation-definition、stable-prices-full；来源 stable-prices/stable-prices-inflation
- 一般价格持续下降：通缩不是正通胀率放缓，也不是某商品短期降价。；目标 deflation-definition、stable-prices-full；来源 stable-prices/stable-prices-deflation
- 消费、出厂、购进、批发分开：CPI看消费，PPI通常指出厂价格，购进价格另有指标，WPI看批发。；目标 price-indices、stable-prices-full；来源 stable-prices/stable-prices-indicators

### balance-of-payments-memory · review

记法：先分清两个净额各自的相减方向，再以二者差额是否为零判断平衡

覆盖：净出口、净资本流出和平衡关系。

不覆盖：国际收支账户全表；汇率变化推导

- 净出口：出口减进口：出口减进口。；目标 net-exports、bop-full；来源 balance-of-payments/balance-of-payments-meaning
- 限定交易再算资产净流出：仅含两类资产购买时，可用居民购买国外资产减非居民购买本国资产。；目标 net-capital-outflow、bop-full；来源 balance-of-payments/balance-of-payments-meaning
- 表内平衡与外部均衡分开：部分净额相等或复式记账借贷相等，不能直接证明不存在经济外部失衡。；目标 bop-balance、bop-full；来源 balance-of-payments/balance-of-payments-meaning

### macro-control-measures-memory · review

记法：用政策规划、经济法规、强制命令三类线索一一映射，再核对经济法律为主和必要行政为辅

覆盖：经济、法律、行政手段及主辅关系。

不覆盖：具体政策效果；具体行政行为合法性

- 政策规划看经济：财政货币政策、战略规划、分配和产业政策等属于经济手段。；目标 macro-economic-measure、macro-measures-full；来源 macro-control-measures/macro-control-measures
- 经济法规看法律：制定和运用经济法规属于法律手段。；目标 macro-legal-measure、macro-measures-full；来源 macro-control-measures/macro-control-measures
- 强制命令看行政：强制性行政命令、指示等属于行政手段。；目标 macro-administrative-measure、macro-measures-full；来源 macro-control-measures/macro-control-measures
- 经济法律为主，必要行政为辅：经济、法律手段为主，辅以必要行政手段。；目标 macro-measure-priority、macro-measures-full；来源 macro-control-measures/macro-control-measures

### fiscal-policy-core-memory · review

记法：先认政府预算税收，再还原收入清单和支出交易边界，最后按经济状态判断工具方向

覆盖：财政工具、预算融资、交易分类和政策适用条件。

不覆盖：财政乘数；现实政策组合

- 预算税收认财政：政府运用预算、税收等财政手段调节总供求。；目标 fiscal-definition、fiscal-policy-full；来源 fiscal-policy/fiscal-definition
- 收入融资分口径：税收非税、债务融资及资金调入等须按相应预算口径分开。；目标 fiscal-income-components、fiscal-policy-full；来源 fiscal-policy/fiscal-income
- 有货有劳是购买，无对应交易是转移：有商品劳务交换是政府购买；没有相应交换是转移支付。；目标 fiscal-spending-types、fiscal-policy-full；来源 fiscal-policy/fiscal-spending
- 税支用途看取向：减税增支可支持需求，但实际方向需结合传导与资金用途，不能只看发债量。；目标 fiscal-policy-direction、fiscal-policy-full；来源 fiscal-policy/fiscal-application

### monetary-policy-core-memory · review

记法：区分工具对象与交易方向，再结合经济情境及传导条件判断。

覆盖：货币政策主体、数量价格工具及有条件的方向判断。

不覆盖：现实政策立场；具体传导效果

- 央行影响流动性与利率：中央银行影响流动性、货币信贷和利率等金融条件。；目标 monetary-definition、monetary-full；来源 monetary-policy/monetary-definition
- 比例与价格分清，现券买放卖收，工具配合看条件：其他条件不变时比较工具方向，不要求所有工具每次同时同幅变化。；目标 monetary-tools、monetary-expansion、monetary-contraction、monetary-full；来源 monetary-policy/monetary-tools、monetary-policy/monetary-application

### industrial-structure-memory · review

记法：先认产业政策的政府主体与干预对象，再按自然力、加工、流通服务判断三次产业

覆盖：三次产业正文基本范围。

不覆盖：统计分类调整；边界行业争议

- 一产农林牧渔，专业辅助另分：农林牧渔专业及辅助性活动不属于第一产业。；目标 primary-industry、industrial-structure-full；来源 industrial-policy/industrial-structure
- 二产工业建筑，辅助修理有例外：采矿制造等按规定范围判断，专业辅助及指定修理活动另列第三产业。；目标 secondary-industry、industrial-structure-full；来源 industrial-policy/industrial-structure
- 三产其余行业，包含规定辅助修理：服务业为第一第二产业以外的其他行业，也创造价值。；目标 tertiary-industry、industrial-structure-full；来源 industrial-policy/industrial-structure
- 产业政策：政府为经济社会目标干预产业形成发展：产业政策的定义边界。；目标 industrial-policy-definition、industrial-structure-full；来源 industrial-policy/industrial-definition、industrial-policy/industrial-structure

### income-distribution-core-memory · review

记法：先识别收入政策关注对象和常用手段，再按生产部门、政府、志愿公益区分三次分配

覆盖：初次、再分配、第三次分配的主体和方式。

不覆盖：基尼系数来源和固定阈值；具体税制

- 初次按要素贡献：根据要素贡献形成收入，市场在资源配置中发挥决定性作用。；目标 initial-distribution、income-distribution-full；来源 income-distribution-policy/income-distribution-stages
- 收入政策调水平差距；再分政府调公平：政府调节初次分配所得，着重社会公平。；目标 income-policy-overview、redistribution、income-distribution-full；来源 income-distribution-policy/income-policy-overview、income-distribution-policy/income-distribution-stages
- 三分志愿做公益：志愿捐赠等慈善公益方式。；目标 third-distribution、income-distribution-full；来源 income-distribution-policy/income-distribution-stages

### international-trade-core-memory · review

记法：先确认进出口构成，再用出口额减进口额的正负方向判断差额名称

覆盖：国际贸易构成和顺逆差方向。

不覆盖：顺逆差利弊；资本账户

- 进加出，成贸易：国际贸易由进口和出口贸易组成。；目标 trade-composition、international-trade-full；来源 international-trade/international-trade-meaning
- 出口减进口为正：顺差出超：出口额大于进口额。；目标 trade-surplus、international-trade-full；来源 international-trade/international-trade-balance
- 出口减进口为负：逆差入超：出口额小于进口额。；目标 trade-deficit、international-trade-full；来源 international-trade/international-trade-balance

### exchange-rate-system-memory · review

记法：先辨两币兑换，再按政府制定限幅或市场供求形成区分制度，最后保留我国制度的三个要点

覆盖：汇率含义、固定和浮动汇率制的识别边界。

不覆盖：现实汇率形成机制；实时汇率

- 汇率看两币兑换：汇率是一种货币表示另一种货币的价格或兑换比率。；目标 exchange-rate-meaning、exchange-rate-system-full；来源 exchange-rate-system/exchange-rate-meaning
- 固定盯住维持平价或区间：承诺维持机制是关键，不是每笔报价永远不变或政府公布就算固定。；目标 fixed-rate-system、exchange-rate-system-full；来源 exchange-rate-system/exchange-rate-systems
- 浮动看供求定，可管理：浮动汇率由市场供求决定，必要时可以干预；我国正文表述为有管理浮动。；目标 floating-rate-system、managed-floating-system、exchange-rate-system-full；来源 exchange-rate-system/exchange-rate-systems

### exchange-rate-effects-memory · review

记法：先固定标价口径，再沿进口成本、出口竞争力和资本多因素边界还原

覆盖：正文对本币升贬值与进出口、资本流动的基础方向。

不覆盖：不固定标价口径的数字判断；实际进出口数量和贸易余额预测；由单一汇率变化推断资本流向

- 外币一单位，本币数增是本币贬：固定同一报价方向判断本币相对升贬，不能脱离本外币观察口径。；目标 rate-direction-pair、rate-effects-full；来源 exchange-rate-effects/exchange-rate-effects
- 进口外币价不变，本币成本升：外币合同价不变且未对冲时，本币贬值通常提高本币支付成本，数量变化另看弹性和时滞。；目标 rate-import-effect、rate-effects-full；来源 exchange-rate-effects/exchange-rate-effects
- 本币价稳，出口竞争可能添：本币价格稳定时，本币贬值可能降低折算外币价格，不保证出口数量或差额立即改善。；目标 rate-export-effect、rate-effects-full；来源 exchange-rate-effects/exchange-rate-effects
- 资本别单推，还看利差、前景、预期、风险、管制：资本流向还受利差、前景、预期、风险和管制影响，不能由汇率单独决定。；目标 rate-capital-effect、rate-effects-full；来源 exchange-rate-effects/exchange-rate-effects

### economic-effects-behavior-memory · review

记法：先看现象属于消费调整或优势累积，再区分新增产出与平均成本两个数量观察对象

覆盖：棘轮、马太、边际和规模效应。

不覆盖：适用范围外推；总产出必然下降

- 棘轮难下调：消费习惯难向下调整。；目标 effect-ratchet、economic-effects-behavior-full；来源 economic-effects/effect-ratchet
- 马太差距拉：强者更强、弱者更弱。；目标 effect-matthew、economic-effects-behavior-full；来源 economic-effects/effect-matthew
- 边际看新增：固定技术和部分投入时观察新增产出；边际递减不等于总产出下降。；目标 effect-marginal、economic-effects-behavior-full；来源 economic-effects/effect-marginal
- 规模看均本：长期各项投入可调整时，规模扩大使平均成本在一定范围下降。；目标 effect-scale、economic-effects-behavior-full；来源 economic-effects/effect-scale

### economic-effects-price-memory · review

记法：依次识别相对价格与换品、实际购买力、政府融资经利率到私人投资三条作用路径

覆盖：替代、收入和挤出效应。

不覆盖：现实政策净效果；具体需求弹性

- 换品是替代：按分析方法补偿购买力等后，分离相对价格变化引起的选择变化。；目标 effect-substitution、economic-effects-price-full；来源 economic-effects/effect-substitution
- 力变是收入：价格变化通过实际收入影响需求。；目标 effect-income、economic-effects-price-full；来源 economic-effects/effect-income
- 发债推息压投资是挤出：其他资金条件不变时，政府融资可能经利率抑制私人投资，程度依政策配合。；目标 effect-crowding-out、economic-effects-price-full；来源 economic-effects/effect-crowding-out

### economic-terms-choice-memory · review

记法：用单方策略、效用增量、最佳替代、既有不可回收支出四个判断对象逐一还原

覆盖：纳什均衡、边际效用递减、机会成本、沉没成本

不覆盖：具体博弈解；总效用走势

- 纳什：单改不增益：给定其他参与者策略后，单独改变自身策略不能增加收益，不保证总收益最大。；目标 term-nash、economic-terms-choice-full；来源 economic-terms/term-nash
- 边效：每新增量降：一定时间内连续增加消费时，每新增单位带来的效用增量递减；目标 term-marginal-utility、economic-terms-choice-full；来源 economic-terms/term-marginal-utility
- 机会：放弃最佳项：作出选择时放弃的其他机会中的最大收益或最大价值；目标 term-opportunity-cost、economic-terms-choice-full；来源 economic-terms/term-opportunity-cost
- 沉没：已付收不回：已经付出且不可收回的成本；目标 term-sunk-cost、economic-terms-choice-full；来源 economic-terms/term-sunk-cost

### economic-terms-risk-memory · review

记法：对照可预见性、发生概率和事前迹象，三项联合判断风险类型

覆盖：黑天鹅、灰犀牛

不覆盖：具体事件风险结论

- 黑天鹅：难料、罕见、冲击大：非常难预测且不寻常，并可能造成重大连锁影响；目标 term-black-swan、economic-terms-risk-full；来源 economic-terms/term-black-swan
- 灰犀牛：概率高、有迹象、被忽视：大概率、爆发前已有迹象但被忽视的危机；目标 term-gray-rhino、economic-terms-risk-full；来源 economic-terms/term-gray-rhino

### economic-terms-curve-memory · review

记法：用拐点、持币代价和短长期时间轴分别定位三项概念

覆盖：拉弗曲线、流动偏好、菲利普斯曲线

不覆盖：具体最优税率；长期通胀失业关系

- 税率过顶，税收会落：税率在限度内提高可增税收，超过限度继续提高反而可能使税收减少；目标 term-laffer、economic-terms-curve-full；来源 economic-terms/term-laffer
- 灵活持币，舍点利息：为保持货币使用灵活性，宁可牺牲利息而持有不生息货币；目标 term-liquidity、economic-terms-curve-full；来源 economic-terms/term-liquidity
- 菲线短期反着走，长期别作铁规律：预期等给定时短期可能反向，不能当作长期稳定交换或固定因果保证。；目标 term-phillips、economic-terms-curve-full；来源 economic-terms/term-phillips

### resource-allocation-plan-memory · review

记法：从资源约束进入两种配置方式，再按主体、工具和调节时点识别计划机制

覆盖：资源配置中心问题、两种方式和计划机制。

不覆盖：看得见的手出处；计划要素具体举例

- 资源有限，需要取舍：有效配置资源用于处理两者矛盾。；目标 resource-allocation-problem、resource-allocation-plan-full；来源 market-economy/resource-allocation-overview
- 配置两路：计划加市场：现代经济主要有计划配置和市场配置。；目标 resource-allocation-methods、resource-allocation-plan-full；来源 market-economy/resource-allocation-overview
- 计划由政府依需要条件来安排：政府计划部门通过计划机制配置资源。；目标 planned-allocation-definition、resource-allocation-plan-full；来源 planned-allocation/planned-definition
- 指标杠杆政策，事前调节：计划指标、经济杠杆和经济政策相互作用，属于事前调节。；目标 planned-allocation-mechanism、resource-allocation-plan-full；来源 planned-allocation/planned-mechanism

### resource-allocation-market-memory · review

记法：先认市场信号与四机制，再按逐利、信息和调整时点区分三类局限

覆盖：市场配置含义、四机制和三缺点。

不覆盖：看不见的手出处；市场失灵四因素

- 市场信号，分散决策：市场配置依靠分散主体对价格、供求和竞争等信号作决策。；目标 market-allocation-meaning、resource-allocation-market-full；来源 market-allocation/market-meaning
- 供价竞险四机制：供求、价格、竞争、风险相互作用。；目标 market-mechanisms、resource-allocation-market-full；来源 market-allocation/market-mechanism
- 逐利自发，信息盲目，时差滞后：分别核对逐利动机、信息不足和信号传递生产调整的时间差。；目标 market-defects、resource-allocation-market-full；来源 market-allocation/market-defects

### market-definition-elements-memory · review

记法：先用交换关系识别市场，再用谁、什么、怎样、何规四问定位要素

覆盖：市场定义、四要素角色和三类规则。

不覆盖：具体监管法律；市场机制长段定义

- 市场是交换关系，不拘场所：市场是交换关系总和，不以固定场所为必要条件。；目标 market-definition、market-definition-elements-full；来源 market-definition-elements/market-definition
- 谁来是主体，换什么是客体，怎么换是行为，按何规是秩序：四项构成要素及基本角色。；目标 market-four-elements、market-element-roles、market-definition-elements-full；来源 market-definition-elements/market-elements
- 准入、竞争、交易规则：三类规则分别规范市场进入、竞争方式和交易行为。；目标 market-order-rules、market-definition-elements-full；来源 market-definition-elements/market-elements

### enterprise-organization-memory · review

记法：先认企业经营责任，再沿独资合伙公司分类到主体资格和公司类型

覆盖：企业定义、三类形式、法人资格和两类公司。

不覆盖：股东人数；股份转让与设立程序；特殊合伙责任

- 用要素做商品，自主经营自担盈亏：企业以盈利为目的、运用要素提供商品服务并自主经营、自负盈亏、独立核算。；目标 enterprise-definition、enterprise-organization-full；来源 enterprise-organization/enterprise-meaning
- 独资合伙非法人，公司成法人：三类组织形式，正文中前两类不是法人、公司制是企业法人。；目标 enterprise-three-forms、enterprise-legal-status、enterprise-organization-full；来源 enterprise-organization/enterprise-forms
- 公司两兄弟：有限、股份：公司制两种主要形式。；目标 company-two-forms、enterprise-organization-full；来源 enterprise-organization/enterprise-forms

### market-system-core-memory · review

记法：先搭两大分类，再展开两类商品和五类要素，最后单列三大支柱

覆盖：两大类、两类商品、五类要素和三大支柱。

不覆盖：兼具特征的知识链接；具体市场监管制度

- 两大类：商品、要素：两大类是商品市场和生产要素市场。；目标 market-system-overview、market-system-full；来源 market-system-composition/market-system-overview
- 商品分消费品、生产资料：商品市场含消费品和生产资料市场。；目标 commodity-market、market-system-full；来源 market-system-composition/commodity-market
- 要素含资本、劳动力、技术、信息、房地产：要素市场含资本、劳动力、技术、信息、房地产。；目标 factor-market、market-system-full；来源 market-system-composition/factor-market
- 三柱：商品、资本、劳动力：三大支柱是商品、资本、劳动力市场。；目标 market-system-pillars、market-system-full；来源 market-system-composition/market-pillars

### market-economy-laws-memory · review

记法：先认资源配置方式，再用决定依据、竞争对象和有效需求区分三规律

覆盖：市场经济含义、价值、竞争和供求规律。

不覆盖：价格形成全部机制；具体竞争手段

- 市场配资源：由市场进行资源调配。；目标 market-economy-meaning、market-economy-laws-full；来源 market-economy-meaning/market-economy-definition
- 价值看社时，交换按价值：社会必要劳动时间决定价值并以价值量为基础等价交换。；目标 value-law、market-economy-laws-full；来源 market-economy-laws/value-law
- 主体争利益：市场主体争夺经济利益具有必然性。；目标 competition-law、market-economy-laws-full；来源 market-economy-laws/competition-law
- 供求问付得起，价格来调节：市场供给与有支付能力需求内在联系并趋向平衡。；目标 supply-demand-law、market-economy-laws-full；来源 market-economy-laws/supply-demand-law

### market-features-foundation-memory · review

记法：用明、平、凭本领的押韵动作绑定产权、主体和活动三个对象

覆盖：产权确定、主体平等、活动竞争

不覆盖：具体制度评价

- 权要明：最终所有权与法人财产权划分明确；目标 market-feature-property、market-features-foundation-full；来源 market-economy-features/market-feature-1
- 人要平：主体地位平等、自愿交易并共同议定条件；目标 market-feature-equality、market-features-foundation-full；来源 market-economy-features/market-feature-2
- 市场竞争凭本领：市场主体自由竞争并生存发展或淘汰；目标 market-feature-competition、market-features-foundation-full；来源 market-economy-features/market-feature-3

### market-features-order-memory · review

记法：用守法、开门、守边三个动作绑定行为、体系和政府对象

覆盖：行为法制、体系开放、政府有限

不覆盖：具体制度评价

- 行为守法：市场主体按规则行事，违反者受法规制裁；目标 market-feature-legality、market-features-order-full；来源 market-economy-features/market-feature-4
- 市场开门：行业地区开放、要素流动、统一市场并连接世界市场；目标 market-feature-openness、market-features-order-full；来源 market-economy-features/market-feature-5
- 政府守边：政府保障有序运行、促进竞争、维护主体权利；目标 market-feature-limited-government、market-features-order-full；来源 market-economy-features/market-feature-6

### socialist-market-framework-memory · review

记法：先记市场与政府关系，再用有效、活力、有度还原治理目标

覆盖：市场决定性作用、更好发挥政府作用；市场机制有效、微观主体有活力、宏观调控有度。

不覆盖：理论沿革；具体年度政策；旧五层框架的机械背诵

- 市场决定，政府更好：充分发挥市场在资源配置中的决定性作用，更好发挥政府作用。；目标 socialist-market-meaning、socialist-market-framework-full；来源 socialist-market-economy/socialist-market-meaning
- 机制有效，主体有活力，宏调有度：推动市场机制有效、微观主体有活力、宏观调控有度。；目标 socialist-market-framework、socialist-market-framework-full；来源 socialist-market-economy/socialist-market-framework

### demand-supply-basic-memory · review

记法：先分消费者和生产者，再查愿且能条件、量价反应和供给因素

覆盖：需求、供给的双重条件；需求价格弹性的百分比口径；成本等供给因素。

不覆盖：待核需求因素与恩格尔阈值；具体政策后果

- 需求问买家：愿不愿、能不能：愿意与能够缺一不可。；目标 demand-meaning、demand-supply-basic-full；来源 microeconomics/demand-meaning
- 弹性比较量价百分比：需求价格弹性比较需求量与价格的百分比变化，通常用绝对值比较。；目标 demand-price-elasticity、demand-supply-basic-full；来源 microeconomics/demand-price-elasticity
- 供给问厂家：愿不愿卖、能不能供：主体是生产者，愿意与能够缺一不可。；目标 supply-meaning、demand-supply-basic-full；来源 supply-theory/supply-meaning
- 供给再看本价、成本、相关价、政策、预期：本品价格通常与供给量同向，成本上升通常压低供给。；目标 supply-factors、demand-supply-basic-full；来源 supply-theory/supply-factors

### supply-demand-equilibrium-memory · review

记法：从相等状态出发，先分价格数量，再用压低托高判断限价位置

覆盖：均衡强调供需相等状态。；前者是供需量相等时价格，后者是该价格下相等的数量。；最高与最低限价的位置和目的方向相反。

不覆盖：待核需求因素与恩格尔阈值；具体政策后果

- 供需相等定均衡：均衡强调供需相等状态。；目标 equilibrium-meaning、supply-demand-equilibrium-full；来源 supply-demand-equilibrium/equilibrium-meaning
- 价是点位，量是数量：前者是供需量相等时价格，后者是该价格下相等的数量。；目标 equilibrium-price-quantity、supply-demand-equilibrium-full；来源 supply-demand-equilibrium/equilibrium-price-quantity
- 限高压在均衡下，限低托在均衡上：最高与最低限价的位置和目的方向相反。；目标 equilibrium-price-limits、supply-demand-equilibrium-full；来源 supply-demand-equilibrium/equilibrium-application

### supply-demand-market-memory · review

记法：用两幅对称供求画面同时还原价格方向与交易地位

覆盖：需求大于供给时价格上升，需求小于供给时价格下降。；供给大于需求、价格趋降，买方有利。；供给小于需求、价格趋涨，卖方有利。

不覆盖：具体商品价格预测；具体宏观政策工具

- 需多供少，价往上走：需求大于供给时价格上升，需求小于供给时价格下降。；目标 supply-demand-direction、supply-demand-market-full；来源 supply-demand-law/supply-demand-law
- 供多需少，买方好挑：供给大于需求、价格趋降，买方有利。；目标 buyer-market、supply-demand-market-full；来源 supply-demand-law/buyer-seller-market
- 需多供少，卖方有利：供给小于需求、价格趋涨，卖方有利。；目标 seller-market、supply-demand-market-full；来源 supply-demand-law/buyer-seller-market

### macro-control-goals-memory · blocked

记法：方向与角色串联

覆盖：促进经济增长、增加就业、稳定物价、保持国际收支平衡。；促进经济增长是最主要目标。

不覆盖：具体商品价格预测；具体宏观政策工具

- 两增一稳保平衡：促进经济增长、增加就业、稳定物价、保持国际收支平衡。；目标 macro-goals-list-c523、macro-goals-full-c523；来源 macro-control-goals-overview/macro-goals-overview
- 增长是主要目标：促进经济增长是最主要目标。；目标 macro-primary-goal-c523、macro-goals-full-c523；来源 macro-control-goals-overview/macro-goals-overview

### prehistoric-old-stone-memory · review

记法：人物或文化与特征配对

覆盖：元谋人在云南元谋发现，正文记载其会制造工具并知道用火。；北京人会使用天然火并保存火种。；山顶洞人在打制石器基础上掌握磨光钻孔，制作骨针并会人工取火。

不覆盖：绝对最早排名；未列考古争议

- 元谋工具知用火：元谋人在云南元谋发现，正文记载其会制造工具并知道用火。；目标 prehistoric-yuanmou、prehistoric-old-stone-full；来源 prehistoric-civilization/prehistoric-1
- 北京天然存火种：北京人会使用天然火并保存火种。；目标 prehistoric-peking-fire、prehistoric-old-stone-full；来源 prehistoric-civilization/prehistoric-1
- 山顶磨钻骨针人工火：山顶洞人在打制石器基础上掌握磨光钻孔，制作骨针并会人工取火。；目标 prehistoric-caveman-tech、prehistoric-old-stone-full；来源 prehistoric-civilization/prehistoric-1

### prehistoric-new-stone-memory · review

记法：人物或文化与特征配对

覆盖：河姆渡文化位于长江流域下游以南，水稻种植工具抓骨耜。；红山抓玉猪龙，仰韶抓黄河中游、粟黍和半坡遗址。；大汶口抓黑白陶与养蚕缫丝，龙山又称黑陶文化。；河姆渡在长江流域下游以南，仰韶在黄河中游。

不覆盖：绝对最早排名；未列考古争议

- 河姆渡水稻骨耜：河姆渡文化位于长江流域下游以南，水稻种植工具抓骨耜。；目标 prehistoric-hemudu、prehistoric-new-stone-full；来源 prehistoric-civilization/prehistoric-2
- 红山玉龙，仰韶粟半坡：红山抓玉猪龙，仰韶抓黄河中游、粟黍和半坡遗址。；目标 prehistoric-hongshan-yangshao、prehistoric-new-stone-full；来源 prehistoric-civilization/prehistoric-2
- 大汶口丝，龙山黑陶：大汶口抓黑白陶与养蚕缫丝，龙山又称黑陶文化。；目标 prehistoric-dawenkou-longshan、prehistoric-new-stone-full；来源 prehistoric-civilization/prehistoric-2
- 河姆渡长江，仰韶黄河：河姆渡在长江流域下游以南，仰韶在黄河中游。；目标 prehistoric-new-stone-region、prehistoric-new-stone-full；来源 prehistoric-civilization/prehistoric-2

### prehistoric-battles-memory · review

记法：人物、战事与制度线索串联

覆盖：炎指炎帝，黄指黄帝，正文称二者为人文始祖。；阪泉之战后部落融合，正文据此连接华夏族。；炎帝、黄帝部落联合与蚩尤部落战于涿鹿。

不覆盖：考古年代断言；指南车等补充故事

- 炎帝黄帝称炎黄：炎指炎帝，黄指黄帝，正文称二者为人文始祖。；目标 prehistoric-yanhuang、prehistoric-legend-battles-full；来源 prehistoric-civilization/prehistoric-3
- 阪泉黄帝胜炎帝：阪泉之战后部落融合，正文据此连接华夏族。；目标 prehistoric-banquan、prehistoric-legend-battles-full；来源 prehistoric-civilization/prehistoric-3
- 涿鹿炎黄对蚩尤：炎帝、黄帝部落联合与蚩尤部落战于涿鹿。；目标 prehistoric-zhuolu、prehistoric-legend-battles-full；来源 prehistoric-civilization/prehistoric-3

### prehistoric-abdication-water-memory · review

记法：人物、战事与制度线索串联

覆盖：各部落首领推选部落联盟首领称禅让制。；大禹吸取鲧的失败教训，改用疏导并长期治水。

不覆盖：考古年代断言；指南车等补充故事

- 首领推选叫禅让：各部落首领推选部落联盟首领称禅让制。；目标 prehistoric-abdication、prehistoric-abdication-water-full；来源 prehistoric-civilization/prehistoric-3
- 大禹改疏三过不入：大禹吸取鲧的失败教训，改用疏导并长期治水。；目标 prehistoric-dayu-water、prehistoric-abdication-water-full；来源 prehistoric-civilization/prehistoric-3

### xia-dynasty-memory · review

记法：建立、转折与灭亡时间线

覆盖：启继承王位标志正文所述公天下转为家天下。；河南偃师二里头遗址的地域和年代与史籍夏朝记载相符。；鸣条之战连接商汤伐夏与夏朝灭亡。

不覆盖：具体年代争议；人物逸事

- 启继位，世袭替禅让：启继承王位标志正文所述公天下转为家天下。；目标 xia-qi-hereditary、xia-dynasty-full；来源 legendary-xia-shang/dynasties
- 偃师二里头连夏：二里头遗址是探索夏文化的重要实物材料，考古文化与史籍王朝的对应仍需研究。；目标 xia-erlitou、xia-dynasty-full；来源 legendary-xia-shang/dynasties
- 鸣条商汤灭夏：鸣条之战连接商汤伐夏与夏朝灭亡。；目标 xia-mingtiao、xia-dynasty-full；来源 legendary-xia-shang/dynasties

### shang-dynasty-memory · review

记法：建立、转折与灭亡时间线

覆盖：商汤建商，正文记载初都亳城。；盘庚把都城迁到殷，商朝此后稳定。；牧野之战中商军倒戈，周武王攻入朝歌，商亡。

不覆盖：具体年代争议；人物逸事

- 商汤建商：商汤建商，正文记载初都亳城。；目标 shang-tang-founded、shang-dynasty-full；来源 legendary-xia-shang/dynasties
- 盘庚迁殷：盘庚把都城迁到殷，商朝此后进入较稳定的发展阶段。；目标 shang-pangeng-yin、shang-dynasty-full；来源 legendary-xia-shang/dynasties
- 牧野武王伐纣商亡：牧野之战与周武王伐商、商朝灭亡相联系，不依赖传说细节判断。；目标 shang-muye、shang-dynasty-full；来源 legendary-xia-shang/dynasties

### western-zhou-memory · review

记法：朝代节点与集合串联

覆盖：周武王建立周朝，定都镐京，史称西周。；正文把何尊底部铭文概括为宅兹中国。；犬戎攻周、周幽王被杀，正文记为西周灭亡。

不覆盖：故事化补充；具体战役典故

- 武王镐京建西周：周武王建立周朝，定都镐京，史称西周。；目标 western-zhou-founding、western-zhou-full；来源 legendary-xia-shang/dynasties
- 何尊宅兹中国：何尊器内铭文有“宅兹中国”，其中“中国”按当时历史语境理解。；目标 western-zhou-hezun、western-zhou-full；来源 legendary-xia-shang/dynasties
- 犬戎攻周西周亡：犬戎攻周、周幽王被杀，正文记为西周灭亡。；目标 western-zhou-fall、western-zhou-full；来源 legendary-xia-shang/dynasties

### spring-warring-memory · review

记法：朝代节点与集合串联

覆盖：平王迁都洛邑，开始东周历史。；齐楚燕韩赵魏秦合称战国七雄。；废井田开阡陌、奖励军功、建立县制、奖励耕织。；正文把三家分晋、田氏代齐列为春秋战国分水岭。

不覆盖：故事化补充；具体战役典故

- 平王洛邑启东周：平王迁都洛邑，开始东周历史。；目标 transition-pingwang-east、transition-full；来源 legendary-xia-shang/transition
- 齐楚燕韩赵魏秦：齐楚燕韩赵魏秦合称战国七雄。；目标 transition-warring-seven、transition-full；来源 legendary-xia-shang/transition
- 商鞅在秦推县、奖军功耕织：商鞅在秦推行县制、奖励军功和耕织，推动土地制度改革；并非首次创立县。；目标 transition-shangyang、transition-full；来源 legendary-xia-shang/transition
- 三家分晋田氏代齐：三家分晋与田氏代齐反映春秋战国之际的政治格局变化，是不同国家的事件，不能合为同一年。；目标 transition-divider、transition-full；来源 legendary-xia-shang/transition

### pre-qin-institutions-memory · review

记法：制度集合与人物事物配对

覆盖：分封制、宗法制、井田制、礼乐制合称正文所列西周四大制度。；宗法制以血缘为纽带，以嫡长子继承为核心；大宗和小宗是相对层级，不能直接等同于所有嫡子与所有庶子。；初税亩是鲁国实行的按亩征税田赋制度。

不覆盖：绝对排名；故事化补充

- 分宗井礼四制度：分封制、宗法制、井田制、礼乐制合称正文所列西周四大制度。；目标 pre-qin-four-systems、pre-qin-institutions-full；来源 legendary-xia-shang/pre-qin-institutions
- 宗法血缘分层，以嫡长子继承为核心：宗法制以血缘为纽带，以嫡长子继承为核心；大宗和小宗是相对层级，不能直接等同于所有嫡子与所有庶子。；目标 pre-qin-zongfa、pre-qin-institutions-full；来源 legendary-xia-shang/pre-qin-institutions
- 鲁国按亩称初税亩：初税亩是鲁国实行的按亩征税田赋制度。；目标 pre-qin-tax-mu、pre-qin-institutions-full；来源 legendary-xia-shang/pre-qin-institutions

### pre-qin-economy-memory · review

记法：制度集合与人物事物配对

覆盖：春秋战国时期开始使用并逐渐推广铁农具和牛耕。；后母戊鼎出土于河南安阳，是商周青铜文化代表作。；孙叔敖修芍陂，郑国为秦国设计郑国渠。；战国秦国蜀守李冰修都江堰。

不覆盖：绝对排名；故事化补充

- 春秋战国铁牛推：春秋战国时期开始使用并逐渐推广铁农具和牛耕。；目标 pre-qin-iron-ox、pre-qin-economy-full；来源 legendary-xia-shang/pre-qin-economy
- 安阳后母戊鼎：后母戊鼎出土于河南安阳，是商周青铜文化代表作。；目标 pre-qin-houmuwu-ding、pre-qin-economy-full；来源 legendary-xia-shang/pre-qin-economy
- 孙芍陂、郑国渠：孙叔敖修芍陂，郑国为秦国设计郑国渠。；目标 pre-qin-water-pairs、pre-qin-economy-full；来源 legendary-xia-shang/pre-qin-economy
- 蜀守李冰都江堰：战国秦国蜀守李冰修都江堰。；目标 pre-qin-dujiangyan、pre-qin-economy-full；来源 legendary-xia-shang/pre-qin-economy

### qin-dynasty-memory · review

记法：建立、制度与转折节点串联

覆盖：秦王嬴政灭六国后建立秦朝，定都咸阳。；皇帝制度、三公九卿制和郡县制构成正文政治制度骨架。；经济文化统一抓度量衡、圆形方孔钱和小篆。；陈胜吴广起义于大泽乡；项羽对应巨鹿；秦亡后刘邦项羽进行楚汉战争。

不覆盖：故事化典故；绝对排名与疆域评价

- 嬴政建秦都咸阳：秦王嬴政灭六国后建立秦朝，定都咸阳。；目标 qin-founding、qin-dynasty-full；来源 qin-han/qin
- 皇帝三公郡县：皇帝制度、三公九卿制和郡县制构成正文政治制度骨架。；目标 qin-governance、qin-dynasty-full；来源 qin-han/qin
- 度量衡钱文同：经济文化统一抓度量衡、圆形方孔钱和小篆。；目标 qin-unification、qin-dynasty-full；来源 qin-han/qin
- 陈吴起、项羽巨鹿、刘项楚汉：陈胜吴广起义于大泽乡；项羽对应巨鹿；秦亡后刘邦项羽进行楚汉战争。；目标 qin-fall-wars、qin-dynasty-full；来源 qin-han/qin

### western-han-memory · review

记法：建立、制度与转折节点串联

覆盖：刘邦称帝，定都长安，史称西汉。；文帝、景帝实行无为而治，正文称文景之治。；董仲舒与儒术、卫青霍去病与匈奴、张骞与西域丝路、主父偃与推恩令。；汉宣帝时期始设西域都护；王莽废西汉末帝后建立新朝。

不覆盖：故事化典故；绝对排名与疆域评价

- 刘邦长安建西汉：刘邦称帝，定都长安，史称西汉。；目标 western-han-founding、western-han-full；来源 qin-han/western-han
- 文景休养生息：文帝、景帝继续休养生息、减轻赋役，促进经济恢复发展，形成文景之治。；目标 wenjing-rule、western-han-full；来源 qin-han/western-han
- 董儒卫霍匈张丝主推恩：董仲舒与儒术、卫青霍去病与匈奴、张骞与西域丝路、主父偃与推恩令。；目标 hanwu-measures、western-han-full；来源 qin-han/western-han
- 宣帝都护王莽新：汉宣帝时期始设西域都护；王莽废西汉末帝后建立新朝。；目标 western-han-late、western-han-full；来源 qin-han/western-han

### eastern-han-memory · review

记法：人物、事件与技术配对串联

覆盖：公元25年刘秀即皇帝位，后定都洛阳，史称东汉。；刘秀称帝后采取安抚的统治方法，社会繁荣，史称光武中兴。；东汉末年张角号召百姓起义，起义者头扎黄巾，史称黄巾起义。；主线顺序为刘秀建立东汉、光武中兴、张角发动黄巾起义。

不覆盖：补充典故与宣传性评价；未列入正文的技术细节

- 刘秀洛阳建东汉：公元25年刘秀即皇帝位，后定都洛阳，史称东汉。；目标 eastern-han-founding、eastern-han-full；来源 qin-han/eastern-han
- 恢复生产光武兴：刘秀建立东汉后调整政策、缓和矛盾，恢复生产和社会秩序，出现光武中兴。；目标 guangwu-revival、eastern-han-full；来源 qin-han/eastern-han
- 张角黄巾东汉末：东汉末年张角号召百姓起义，起义者头扎黄巾，史称黄巾起义。；目标 yellow-turban、eastern-han-full；来源 qin-han/eastern-han
- 建立中兴到黄巾：主线顺序为刘秀建立东汉、光武中兴、张角发动黄巾起义。；目标 eastern-han-sequence、eastern-han-full；来源 qin-han/eastern-han

### qin-han-economy-memory · review

记法：人物、事件与技术配对串联

覆盖：赵过推广牛耕并创造耦犁；毕岚造龙骨水车，又叫翻车；代田法是汉代耕作技术突破。；东汉杜诗发明水排，利用水力鼓风冶铁。；西汉时期已有麻纸，东汉蔡伦进一步改进造纸术。；秦统一后，史禄主持开凿灵渠。

不覆盖：补充典故与宣传性评价；未列入正文的技术细节

- 赵耦毕翻代田法：赵过推广代田法及耦犁等配套技术；东汉末毕岚有制造翻车的记载，不将长期发展等同于某人首次发明。；目标 qin-han-agriculture、qin-han-economy-full；来源 qin-han/qin-han-economy
- 杜诗水排助冶铁：东汉杜诗发明水排，利用水力鼓风冶铁。；目标 qin-han-water-blast、qin-han-economy-full；来源 qin-han/qin-han-economy
- 西汉麻纸蔡伦改：西汉时期已有麻纸，东汉蔡伦进一步改进造纸术。；目标 qin-han-paper、qin-han-economy-full；来源 qin-han/qin-han-economy
- 史禄灵渠秦统一：秦统一后，史禄主持开凿灵渠。；目标 lingqu、qin-han-economy-full；来源 qin-han/qin-han-economy

### three-kingdoms-memory · review

记法：战役作用与政权时间线串联

覆盖：200年官渡之战中曹操大败袁绍，为曹操统一北方奠定基础。；208年孙权、刘备联军在赤壁击败曹军，为三国鼎立局面的形成奠定基础。；221年刘备攻打东吴，东吴陆逊在夷陵之战中击败刘备。；220年曹丕建曹魏都洛阳；221年刘备建蜀汉都成都；229年孙权建东吴都建业。

不覆盖：补充典故与故事化细节；未纳入本组的南北朝内容

- 官渡曹操北方基：200年官渡之战中曹操大败袁绍，为曹操统一北方奠定基础。；目标 guandu-battle、three-kingdoms-full；来源 three-kingdoms-sui-tang/three-kingdoms
- 赤壁孙刘鼎立基：208年孙权、刘备联军在赤壁击败曹军，为三国鼎立局面的形成奠定基础。；目标 red-cliffs-battle、three-kingdoms-full；来源 three-kingdoms-sui-tang/three-kingdoms
- 夷陵陆逊胜刘备：221年刘备攻打东吴，东吴陆逊在夷陵之战中击败刘备。；目标 yiling-battle、three-kingdoms-full；来源 three-kingdoms-sui-tang/three-kingdoms
- 丕魏洛、备蜀成、权吴建：220年曹丕建曹魏都洛阳；221年刘备建蜀汉都成都；229年孙权建东吴都建业。；目标 three-kingdoms-regimes、three-kingdoms-full；来源 three-kingdoms-sui-tang/three-kingdoms

### two-jin-memory · review

记法：战役作用与政权时间线串联

覆盖：265年司马炎夺取魏政权，建立西晋，定都洛阳。；316年匈奴兵攻占长安，西晋灭亡。；317年司马睿在建康重建晋室，史称东晋。；两晋主线依次为265年西晋建立、316年西晋灭亡、317年东晋建立。

不覆盖：补充典故与故事化细节；未纳入本组的南北朝内容

- 二六五炎洛阳晋：265年司马炎夺取魏政权，建立西晋，定都洛阳。；目标 western-jin-founding、two-jin-full；来源 three-kingdoms-sui-tang/two-jin
- 三一六西晋亡：316年匈奴兵攻占长安，西晋灭亡。；目标 western-jin-fall、two-jin-full；来源 three-kingdoms-sui-tang/two-jin
- 三一七睿建康东：317年司马睿在建康重建晋室，史称东晋。；目标 eastern-jin-founding、two-jin-full；来源 three-kingdoms-sui-tang/two-jin
- 西建西亡东再建：两晋主线依次为265年西晋建立、316年西晋灭亡、317年东晋建立。；目标 two-jin-sequence、two-jin-full；来源 three-kingdoms-sui-tang/two-jin

### northern-southern-memory · review

记法：政权演变与产业配对串联

覆盖：383年前秦苻坚讨伐东晋，东晋在谢安等领导下击败前秦，此役确立南北长期对峙局面。；420年刘裕建立宋；南朝依次为宋、齐、梁、陈，均定都建康。；386年拓跋珪建立北魏；北魏分为东魏和西魏，后分别被北齐和北周取代。；孝文帝改革包括均田令、494年迁都洛阳及改汉服、说汉话、采汉姓、通婚等。

不覆盖：补充典故与超出正文的评价；未纳入本组的三国两晋节点

- 苻坚南下谢安胜：383年前秦苻坚讨伐东晋，东晋在谢安等领导下击败前秦，此役确立南北长期对峙局面。；目标 feishui-battle、northern-southern-full；来源 three-kingdoms-sui-tang/northern-southern
- 宋齐梁陈都建康：420年刘裕建立宋；南朝依次为宋、齐、梁、陈，均定都建康。；目标 southern-dynasties、northern-southern-full；来源 three-kingdoms-sui-tang/northern-southern
- 北魏分东西，齐周后来替：386年拓跋珪建立北魏；北魏分为东魏和西魏，后分别被北齐和北周取代。；目标 northern-dynasties、northern-southern-full；来源 three-kingdoms-sui-tang/northern-southern
- 均田迁洛改汉俗：孝文帝改革包括均田令、494年迁都洛阳及改汉服、说汉话、采汉姓、通婚等。；目标 xiaowen-reform、northern-southern-full；来源 three-kingdoms-sui-tang/northern-southern

### three-kingdoms-economy-memory · review

记法：政权演变与产业配对串联

覆盖：江南农业开发由江东扩至长江流域并波及岭南、闽江流域，推动南北经济趋向平衡，为经济重心南移奠基。；南北所烧青瓷各具特色，北朝可以烧出成熟白瓷。；曹魏在纺织业中心襄邑、洛阳等地设置专门制造机构。；吴国八辈之蚕的缫丝质量很高，蜀锦行销吴、魏。

不覆盖：补充典故与超出正文的评价；未纳入本组的三国两晋节点

- 江南扩展趋平衡：江南农业开发由江东扩至长江流域并波及岭南、闽江流域，推动南北经济趋向平衡，为经济重心南移奠基。；目标 jiangnan-development、three-kingdoms-economy-full；来源 three-kingdoms-sui-tang/three-kingdoms-economy
- 南北青瓷北白瓷：南北所烧青瓷各具特色，北朝可以烧出成熟白瓷。；目标 period-ceramics、three-kingdoms-economy-full；来源 three-kingdoms-sui-tang/three-kingdoms-economy
- 曹魏襄邑洛阳织：曹魏在纺织业中心襄邑、洛阳等地设置专门制造机构。；目标 caowei-textile、three-kingdoms-economy-full；来源 three-kingdoms-sui-tang/three-kingdoms-economy
- 吴蚕丝好蜀锦销：吴国八辈之蚕的缫丝质量很高，蜀锦行销吴、魏。；目标 wu-shu-textile、three-kingdoms-economy-full；来源 three-kingdoms-sui-tang/three-kingdoms-economy

### five-dynasties-memory · review

记法：年份、人物和政权顺序串联

覆盖：907年朱全忠（朱温）废唐建立后梁，五代更替由此开始。；黄河流域的五代依次为后梁、后唐、后晋、后汉、后周。；十国是南方各地及北方山西出现的十个割据政权，存在交替并存。；979年北宋赵光义灭北汉，五代十国时期结束。

不覆盖：补充典故与存在多种说法的叙事；未纳入本组的宋夏金元内容

- 九零七朱温后梁起：907年朱全忠（朱温）废唐建立后梁，五代更替由此开始。；目标 five-dynasties-start、five-dynasties-full；来源 five-dynasties-yuan/five-dynasties
- 梁唐晋汉周五代：黄河流域的五代依次为后梁、后唐、后晋、后汉、后周。；目标 five-dynasties-sequence、five-dynasties-full；来源 five-dynasties-yuan/five-dynasties
- 南方山西十国并：十国是南方各地及北方山西出现的十个割据政权，存在交替并存。；目标 ten-kingdoms、five-dynasties-full；来源 five-dynasties-yuan/five-dynasties
- 九七九北汉亡期止：979年北宋赵光义灭北汉，五代十国时期结束。；目标 five-dynasties-end、five-dynasties-full；来源 five-dynasties-yuan/five-dynasties

### liao-memory · review

记法：年份、人物和政权顺序串联

覆盖：契丹是我国北方古老的少数民族，耶律阿保机统一契丹各部。；916年耶律阿保机称帝，建立契丹国。；947年契丹改国号为辽。；1125年辽被金国灭亡。

不覆盖：补充典故与存在多种说法的叙事；未纳入本组的宋夏金元内容

- 阿保机统一契丹：契丹是我国北方古老的少数民族，耶律阿保机统一契丹各部。；目标 khitan-identity、liao-full；来源 five-dynasties-yuan/liao
- 九一六契丹国建：916年耶律阿保机称帝，建立契丹国。；目标 liao-founding、liao-full；来源 five-dynasties-yuan/liao
- 九四七改号辽：947年契丹改国号为辽。；目标 liao-rename、liao-full；来源 five-dynasties-yuan/liao
- 一一二五金灭辽：1125年辽被金国灭亡。；目标 liao-fall、liao-full；来源 five-dynasties-yuan/liao

### northern-song-memory · review

记法：年份、人物、改革与政权关系串联

覆盖：960年赵匡胤建立宋朝，定都东京（今开封），史称北宋。；1004年宋真宗时期宋辽签订澶渊之盟，标志宋辽战争结束。；宋仁宗庆历年间，范仲淹、欧阳修等推行庆历新政，涉及官员考核、厚农桑、减徭役等。；宋神宗任用王安石，1069年开始变法，以富国强兵、改变积贫积弱为目的。；1127年金军攻破东京，俘虏宋徽宗、宋钦宗，北宋灭亡。

不覆盖：轶事细节与超出本组的制度展开；未纳入本组的金、南宋和元内容

- 九六零匡胤东京宋：960年赵匡胤建立宋朝，定都东京（今开封），史称北宋。；目标 northern-song-founding、northern-song-full；来源 five-dynasties-yuan/northern-song
- 一零零四宋辽盟：1004年宋真宗时期宋辽签订澶渊之盟，标志宋辽战争结束。；目标 chanyuan-treaty、northern-song-full；来源 five-dynasties-yuan/northern-song
- 仁宗范欧庆历新：宋仁宗庆历年间，范仲淹、欧阳修等推行庆历新政，涉及官员考核、厚农桑、减徭役等。；目标 northern-song-reforms、northern-song-full；来源 five-dynasties-yuan/northern-song
- 神宗安石六九变：宋神宗任用王安石，1069年开始变法，以富国强兵、改变积贫积弱为目的。；目标 northern-song-reforms、northern-song-full；来源 five-dynasties-yuan/northern-song
- 一一二七靖康亡：1127年金军攻破东京，俘虏宋徽宗、宋钦宗，北宋灭亡。；目标 northern-song-fall、northern-song-full；来源 five-dynasties-yuan/northern-song

### western-xia-memory · review

记法：年份、人物、改革与政权关系串联

覆盖：西夏由党项族建立，主要活动于宁夏、甘肃和陕西西北一带。；1038年元昊称大夏国皇帝，西夏政权建立。；西夏建立后与北宋多次发生战争。；1227年蒙古灭西夏。

不覆盖：轶事细节与超出本组的制度展开；未纳入本组的金、南宋和元内容

- 党项西北建西夏：西夏由党项族建立，主要活动于宁夏、甘肃和陕西西北一带。；目标 western-xia-identity、western-xia-full；来源 five-dynasties-yuan/western-xia
- 一零三八元昊帝：1038年元昊称大夏国皇帝，西夏政权建立。；目标 western-xia-founding、western-xia-full；来源 five-dynasties-yuan/western-xia
- 西夏北宋多交战：西夏建立后与北宋多次发生战争。；目标 song-xia-wars、western-xia-full；来源 five-dynasties-yuan/western-xia
- 一二二七蒙古灭：1227年蒙古灭西夏。；目标 western-xia-fall、western-xia-full；来源 five-dynasties-yuan/western-xia

### jin-memory · review

记法：民族、人物、年份、地点与政权关系串联

覆盖：金朝由女真族建立；完颜阿骨打统一女真诸部后，于1115年建立大金。；金朝是统治中国东北和华北地区的封建王朝。；完颜阿骨打于会宁府建都立国，国号大金。；1234年，金朝在南宋和蒙古南北夹击之下灭亡。

不覆盖：和议银绢数额、战争过程和人物轶事；未纳入本组的北宋、西夏、元朝制度内容

- 女真阿骨打一一一五金：金朝由女真族建立；完颜阿骨打统一女真诸部后，于1115年建立大金。；目标 jin-founding、jin-full；来源 five-dynasties-yuan/jin
- 东北华北是金域：金朝是统治中国东北和华北地区的封建王朝。；目标 jin-region、jin-full；来源 five-dynasties-yuan/jin
- 会宁建都号大金：完颜阿骨打于会宁府建都立国，国号大金。；目标 jin-capital-name、jin-full；来源 five-dynasties-yuan/jin
- 一二三四宋蒙夹：1234年，金朝在南宋和蒙古南北夹击之下灭亡。；目标 jin-fall、jin-full；来源 five-dynasties-yuan/jin

### southern-song-memory · review

记法：民族、人物、年份、地点与政权关系串联

覆盖：1127年赵构在应天称帝，史称南宋。；南宋建立后定都临安，即今杭州。；1141年宋高宗与金签订绍兴和约，宋金南北对峙局面最后确立。；1208年南宋与金签订嘉定和约。；1276年蒙古军攻入临安；1279年崖山海战后南宋覆灭。

不覆盖：和议银绢数额、战争过程和人物轶事；未纳入本组的北宋、西夏、元朝制度内容

- 一一二七赵构应天立：1127年赵构在应天称帝，史称南宋。；目标 southern-song-founding、southern-song-full；来源 five-dynasties-yuan/southern-song
- 后来临安作宋都：南宋建立后定都临安，即今杭州。；目标 southern-song-founding、southern-song-full；来源 five-dynasties-yuan/southern-song
- 一一四一绍兴议：1141年宋高宗与金签订绍兴和约，宋金南北对峙局面最后确立。；目标 shaoxing-treaty、southern-song-full；来源 five-dynasties-yuan/southern-song
- 一二零八嘉定议：1208年南宋与金签订嘉定和约。；目标 jiading-treaty、southern-song-full；来源 five-dynasties-yuan/southern-song
- 临安七六崖山七九亡：1276年蒙古军攻入临安；1279年崖山海战后南宋覆灭。；目标 southern-song-fall、southern-song-full；来源 five-dynasties-yuan/southern-song

### yuan-memory · review

记法：年份、人物、制度、地区与产业线索串联

覆盖：1206年铁木真统一蒙古各部，建立蒙古政权，被尊称为成吉思汗。；1271年忽必烈建立大元，定都大都。；1368年朱元璋北伐军攻占元大都，元朝灭亡。；元朝中央设中书省总理全国政务，地方设行中书省；我国省级行政区设立始于元朝。；元政府设置澎湖巡检司，负责管辖澎湖和台湾。；元朝设置宣政院，管理全国佛教事务和西藏地区行政事务。

不覆盖：疆域最大评价、等级排序和过细工艺词；未纳入本组的政治轶事与产业全史

- 一二零六铁木真蒙古统：1206年铁木真统一蒙古各部，建立蒙古政权，被尊称为成吉思汗。；目标 yuan-founding-timeline、yuan-full；来源 five-dynasties-yuan/yuan
- 一二七一忽必烈大都元：1271年忽必烈建立大元，定都大都。；目标 yuan-founding-timeline、yuan-full；来源 five-dynasties-yuan/yuan
- 一三六八大都破元亡：1368年朱元璋北伐军攻占元大都，元朝灭亡。；目标 yuan-fall、yuan-full；来源 five-dynasties-yuan/yuan
- 中央中书地方行省：元朝中央设中书省总理全国政务，地方设行中书省；我国省级行政区设立始于元朝。；目标 yuan-province-system、yuan-full；来源 five-dynasties-yuan/yuan
- 澎湖巡检管澎台：元政府设置澎湖巡检司，负责管辖澎湖和台湾。；目标 yuan-frontier-institutions、yuan-full；来源 five-dynasties-yuan/yuan
- 宣政佛教兼西藏：元朝设置宣政院，管理全国佛教事务和西藏地区行政事务。；目标 yuan-frontier-institutions、yuan-full；来源 five-dynasties-yuan/yuan

### song-yuan-economy-memory · review

记法：年份、人物、制度、地区与产业线索串联

覆盖：宋代有“苏湖熟，天下足”；从越南引入占城稻，水稻跃居粮食产量首位。；宋代五大名窑为汝、官、哥、钧、定；哥窑见金丝铁线，钧窑见蚯蚓走泥纹，定窑以白瓷为代表。；元成宗时期黄道婆带来棉纺织技术和工具，使松江棉纺织品声名远扬。；宋代造船业水平先进，主要集中在东南沿海，广州、泉州、明州等地发达。；北宋交子是中国最早由政府正式发行的纸币；宋代坊市和经营时间限制被打破；元代泉州是重要对外贸易港口。

不覆盖：疆域最大评价、等级排序和过细工艺词；未纳入本组的政治轶事与产业全史

- 苏湖粮仓占城稻：宋代有“苏湖熟，天下足”；从越南引入占城稻，水稻跃居粮食产量首位。；目标 song-agriculture、song-yuan-economy-full；来源 five-dynasties-yuan/five-dynasties-yuan-economy
- 汝官哥钧定，哥线钧纹定白瓷：宋代五大名窑为汝、官、哥、钧、定；哥窑见金丝铁线，钧窑见蚯蚓走泥纹，定窑以白瓷为代表。；目标 song-kilns、song-yuan-economy-full；来源 five-dynasties-yuan/five-dynasties-yuan-economy
- 黄道婆松江棉纺：元成宗时期黄道婆带来棉纺织技术和工具，使松江棉纺织品声名远扬。；目标 song-yuan-industry、song-yuan-economy-full；来源 five-dynasties-yuan/five-dynasties-yuan-economy
- 宋船东南广泉明：宋代造船业水平先进，主要集中在东南沿海，广州、泉州、明州等地发达。；目标 song-yuan-industry、song-yuan-economy-full；来源 five-dynasties-yuan/five-dynasties-yuan-economy
- 交子破坊时，元泉州外贸：北宋交子是中国最早由政府正式发行的纸币；宋代坊市和经营时间限制被打破；元代泉州是重要对外贸易港口。；目标 song-yuan-commerce、song-yuan-economy-full；来源 five-dynasties-yuan/five-dynasties-yuan-economy

### ming-memory · review

记法：年份、人物、事件与制度线索串联

覆盖：1368年朱元璋建立明朝，建元洪武，建都应天府。；明成祖朱棣迁都北京，组织编写《永乐大典》，派郑和七下西洋。；1449年土木之变中明英宗被俘，是明朝由盛转衰的转折点。；明朝中期戚继光训练戚家军抗倭，1561年在浙东台州九战九捷。；1644年李自成农民军攻入北京，推翻明朝。；明太祖废丞相、设锦衣卫；明成祖形成内阁并设东厂；张居正推行一条鞭法；明代以八股文取士。

不覆盖：传说、兵器细节、战争过程和冗长制度全称；未纳入本组的明清社会经济

- 一三六八朱元璋洪武应天：1368年朱元璋建立明朝，建元洪武，建都应天府。；目标 ming-founding、ming-full；来源 ming-qing/ming
- 朱棣北京大典郑和航：明成祖朱棣迁都北京，组织编写《永乐大典》，派郑和七下西洋。；目标 ming-yongle、ming-full；来源 ming-qing/ming
- 一四四九土木转衰：1449年土木之变中明英宗被俘，是明朝由盛转衰的转折点。；目标 ming-mid-events、ming-full；来源 ming-qing/ming
- 戚家台州九战捷：明朝中期戚继光训练戚家军抗倭，1561年在浙东台州九战九捷。；目标 ming-mid-events、ming-full；来源 ming-qing/ming
- 一六四四自成入京明亡：1644年李自成农民军攻入北京，推翻明朝。；目标 ming-fall-institutions、ming-full；来源 ming-qing/ming
- 太祖废相锦衣，成祖内阁东厂，张居正一条鞭：明太祖废丞相、设锦衣卫；明成祖形成内阁并设东厂；张居正推行一条鞭法；明代以八股文取士。；目标 ming-fall-institutions、ming-full；来源 ming-qing/ming

### qing-memory · review

记法：年份、人物、事件与制度线索串联

覆盖：1616年努尔哈赤建后金；1636年皇太极改国号为清；1644年清军入关并迁都北京。；1661年郑成功击败荷兰殖民者；1684年清政府正式设台湾府。；1689年中俄经平等协商签订《尼布楚条约》，从法律上肯定相关地区属于中国。；康熙、雍正、乾隆时期经济繁荣、国力强盛，史称康乾盛世。；八旗制度源于努尔哈赤；雍正设军机处并推行摊丁入亩；理藩院管理蒙古、回部及西藏等事务。

不覆盖：传说、兵器细节、战争过程和冗长制度全称；未纳入本组的明清社会经济

- 一六一六后金，三六改清，四四入关：1616年努尔哈赤建后金；1636年皇太极改国号为清；1644年清军入关并迁都北京。；目标 qing-founding、qing-full；来源 ming-qing/qing
- 六一成功复台，八四清设台湾府：1661年郑成功击败荷兰殖民者；1684年清政府正式设台湾府。；目标 qing-taiwan、qing-full；来源 ming-qing/qing
- 一六八九尼布楚：1689年中俄经平等协商签订《尼布楚条约》，从法律上肯定相关地区属于中国。；目标 nerchinsk-treaty、qing-full；来源 ming-qing/qing
- 康雍乾三朝盛：康熙、雍正、乾隆时期经济繁荣、国力强盛，史称康乾盛世。；目标 qing-reign-institutions、qing-full；来源 ming-qing/qing
- 努尔哈赤八旗，雍正军机摊丁，理藩管边疆：八旗制度源于努尔哈赤；雍正设军机处并推行摊丁入亩；理藩院管理蒙古、回部及西藏等事务。；目标 qing-reign-institutions、qing-full；来源 ming-qing/qing

### ming-qing-economy-memory · review

记法：时期、人物、事件、条约与产业线索串联

覆盖：明中后期从海外引入原产美洲的玉米、甘薯，并引入花生、烟草及南瓜、番茄、辣椒等。；清代景德镇仍是全国制瓷业最大中心，粉彩和珐琅彩尤为精美。；明中后期纺织业出现以商品生产为目的的机户，雇佣工人为其劳动，被视为资本主义萌芽。

不覆盖：赔款数额、完整作物名单和瓷器工艺细节；未纳入本组的战争过程和后续运动

- 明中后美洲玉米甘薯：明中后期从海外引入原产美洲的玉米、甘薯，并引入花生、烟草及南瓜、番茄、辣椒等。；目标 ming-qing-crops、ming-qing-economy-full；来源 ming-qing/ming-qing-economy
- 清瓷景德镇，粉彩珐琅精：清代景德镇仍是全国制瓷业最大中心，粉彩和珐琅彩尤为精美。；目标 qing-ceramics、ming-qing-economy-full；来源 ming-qing/ming-qing-economy
- 机户商品雇工萌芽：明中后期纺织业出现以商品生产为目的的机户，雇佣工人为其劳动，被视为资本主义萌芽。；目标 ming-capitalism-sprout、ming-qing-economy-full；来源 ming-qing/ming-qing-economy

### opium-war-opening-memory · review

记法：时期、人物、事件、条约与产业线索串联

覆盖：1839年林则徐在广州虎门销毁鸦片，是鸦片战争爆发的导火索和直接原因。；1841年广州三元里百姓抗英，是近代史上第一次民众大规模自发抵抗外来侵略的战斗。；1842年中英签订近代史上第一个不平等条约《南京条约》，中国开始沦为半殖民地半封建社会。；《南京条约》割让香港岛、开放广州厦门福州宁波上海、规定协定关税；五口可用“福广上下宁”辅助记忆。；林则徐组织编写《四洲志》，被称为开眼看世界第一人；魏源编《海国图志》，提出师夷长技以制夷。

不覆盖：赔款数额、完整作物名单和瓷器工艺细节；未纳入本组的战争过程和后续运动

- 一八三九林则徐虎门销烟：1839年林则徐在广东虎门主持销毁鸦片；英国以中国禁烟为借口发动战争，目的在于维护鸦片贸易利益、打开中国市场。；目标 humen-opium、opium-war-opening-full；来源 late-qing-invasions/humen-opium-destruction
- 一八四一三元里民众抗英：1841年广州三元里及附近乡民自发组织抗击英军，是民众保卫家园、抵抗外来侵略的代表性斗争。；目标 sanyuanli-resistance、opium-war-opening-full；来源 late-qing-invasions/sanyuanli-resistance
- 一八四二南京首个不平等：1842年中英签订近代史上第一个不平等条约《南京条约》，中国开始沦为半殖民地半封建社会。；目标 nanjing-treaty、opium-war-opening-full；来源 late-qing-invasions/treaty-of-nanjing
- 割港岛、协关税，五口福广上下宁：《南京条约》割让香港岛、开放广州厦门福州宁波上海、规定协定关税；五口可用“福广上下宁”辅助记忆。；目标 nanjing-treaty、opium-war-opening-full；来源 late-qing-invasions/treaty-of-nanjing
- 林四洲开眼，魏海国师夷：林则徐组织编写《四洲志》，被称为开眼看世界第一人；魏源编《海国图志》，提出师夷长技以制夷。；目标 open-eyes-world、opium-war-opening-full；来源 late-qing-invasions/open-eyes-to-world

### taiping-memory · review

记法：年份、人物、事件、纲领与条约线索串联

覆盖：1851年洪秀全在广西金田起义并建号太平天国；1853年攻克南京，改名天京并定都。；1856年天京事变严重削弱领导和军事力量，是太平天国由盛而衰的分水岭。；1864年洪秀全病故，随后天京被湘军攻破，太平天国运动失败。；《天朝田亩制度》强调平均主义，但具有空想性，最终没有实现。；洪仁玕提出《资政新篇》，主张学习西方，是近代中国最早提出的发展资本主义近代化纲领。

不覆盖：赔款、领土面积和人物遭遇等过密数字；未纳入本组的后续晚清运动

- 五一金田建号，五三南京改天京：1851年洪秀全在广西金田起义并建号太平天国；1853年攻克南京，改名天京并定都。；目标 taiping-founding、taiping-full；来源 taiping-heavenly-kingdom/jintian-uprising
- 五六天京事变转衰：1856年天京事变严重削弱领导和军事力量，是太平天国由盛而衰的分水岭。；目标 taiping-turn-failure、taiping-full；来源 taiping-heavenly-kingdom/tianjing-incident
- 六四洪亡天京破：1864年洪秀全病故，随后天京被湘军攻破，太平天国运动失败。；目标 taiping-turn-failure、taiping-full；来源 taiping-heavenly-kingdom/taiping-failure
- 田亩求平均，空想未实行：《天朝田亩制度》提出平均分配土地等理想，相关方案带有空想性，在战争环境等条件下未真正实行。；目标 heavenly-land-system、taiping-full；来源 taiping-heavenly-kingdom/heavenly-land-system
- 洪仁玕资政新篇学西方：洪仁玕提出《资政新篇》，主张学习西方，发展工商业和铁路银行等；主张不等于全面实施。；目标 senior-words、taiping-full；来源 taiping-heavenly-kingdom/senior-words

### second-opium-memory · review

记法：年份、人物、事件、纲领与条约线索串联

覆盖：第二次鸦片战争中，英国借口亚罗号事件，法国借口马神甫事件，趁太平天国运动发动侵华战争。；清政府陆续签订《天津条约》（英法俄美）和《北京条约》（英法俄）。；1860年10月英法联军抢劫、焚烧圆明园。；1858年中俄签订《瑷珲条约》；正文同时指出沙俄是近代侵占中国领土面积最多的国家。

不覆盖：赔款、领土面积和人物遭遇等过密数字；未纳入本组的后续晚清运动

- 英借亚罗，法借马神甫：第二次鸦片战争中，英国借口亚罗号事件，法国借口马神甫事件，趁太平天国运动发动侵华战争。；目标 second-opium-causes、second-opium-full；来源 second-opium-war/second-opium-war-causes
- 天津英法俄美，北京英法俄：1858年分别与俄美英法签订《天津条约》，1860年分别与英法俄签订《北京条约》；同名文本是不同双边条约。；目标 second-opium-treaties、second-opium-full；来源 second-opium-war/second-opium-war-results
- 六零英法烧圆明：1860年10月英法联军抢劫、焚烧圆明园。；目标 yuanmingyuan、second-opium-full；来源 second-opium-war/yuanmingyuan-aihun
- 五八中俄瑷珲涉及黑龙江北：1858年中俄《瑷珲条约》涉及黑龙江以北、外兴安岭以南的中国领土，不包括沙俄经其他条约侵占的全部土地。；目标 aihun-russia、second-opium-full；来源 second-opium-war/yuanmingyuan-aihun

### self-strengthening-memory · review

记法：人物、口号、企业、战役与条约线索串联

覆盖：洋务派中央以奕䜣为代表，地方以曾国藩、李鸿章、左宗棠、张之洞为代表。；洋务运动前期以自强为旗号、后期以求富为旗号；正文把中学为体、西学为用与冯桂芬对应。；安庆内军械所是曾国藩在安徽创办的第一个近代军工厂，江南制造总局由李鸿章在上海创办且规模最大；轮船招商局属民用工业，汉阳铁厂由张之洞创办。；19世纪80年代中期初步建成北洋、南洋、福建三支海军，其中北洋舰队实力最强。；洋务运动的新式学堂代表是京师同文馆。；甲午中日战争中北洋海军全军覆没，标志洋务运动宣告破产。

不覆盖：完整企业名单、赔款和赎辽费数字；正文未展开的战争过程与评价

- 中央奕䜣，地方曾李左张：洋务派中央以奕䜣为代表，地方以曾国藩、李鸿章、左宗棠、张之洞为代表。；目标 self-strengthening-faction、self-strengthening-full；来源 self-strengthening-movement/self-strengthening-faction
- 前自强、后求富，中体西用冯桂芬：洋务派维护原有统治秩序并学习西方技术；前期侧重自强，后来以求富兴办民用企业，两者不互相排斥。；目标 self-strengthening-thought、self-strengthening-full；来源 self-strengthening-movement/self-strengthening-thought
- 曾安庆、李江南轮船、张汉阳：曾国藩联系安庆内军械所，李鸿章联系江南制造总局及轮船招商局，张之洞联系汉阳铁厂；分别区分军械制造与民用企业，不用无限定规模排名。；目标 self-strengthening-industry、self-strengthening-full；来源 self-strengthening-movement/self-strengthening-industry
- 海军北洋南洋福建广东：晚清逐步形成北洋、南洋、福建、广东等舰队，建设计划与实际形成范围不同；北洋海军在甲午威海卫之战覆灭。；目标 self-strengthening-support-outcome、self-strengthening-full；来源 self-strengthening-movement/modern-navy
- 新式学堂同文馆：洋务运动的新式学堂代表是京师同文馆。；目标 self-strengthening-support-outcome、self-strengthening-full；来源 self-strengthening-movement/new-school
- 甲午失败，富强目标未达成：甲午战争北洋覆灭表明洋务运动未能达到富强与有效抵御外侮的目标，不等于工业、技术和教育建设没有历史作用。；目标 self-strengthening-support-outcome、self-strengthening-full；来源 self-strengthening-movement/self-strengthening-outcome

### sino-japanese-memory · review

记法：人物、口号、企业、战役与条约线索串联

覆盖：黄海海战中致远舰管带邓世昌牺牲；威海卫之战中北洋海军提督丁汝昌牺牲。；黄海海战结束后，北洋水师退守威海卫，黄海制海权丧失。；1895年《马关条约》规定割辽东半岛、台湾、澎湖列岛，赔白银2亿两，开放沙市、重庆、苏州、杭州，并允许日本在口岸设厂。；俄、法、德三国干涉还辽，日本最终将辽东半岛归还清政府。

不覆盖：完整企业名单、赔款和赎辽费数字；正文未展开的战争过程与评价

- 黄海邓世昌，威海丁汝昌：黄海海战中致远舰管带邓世昌牺牲；威海卫之战中北洋海军提督丁汝昌牺牲。；目标 sino-japanese-battles、sino-japanese-full；来源 first-sino-japanese-war/first-sino-japanese-war-battles
- 黄海非当日全军覆灭：黄海海战与后来威海卫之战不同，不能把黄海海战当天直接写成北洋舰队已全部覆灭。；目标 sino-japanese-sea-control、sino-japanese-full；来源 first-sino-japanese-war/first-sino-japanese-war-battles
- 马关割辽台澎，开沙重苏杭，口岸可设厂：1895年《马关条约》规定割辽东半岛、台湾、澎湖列岛，赔白银2亿两，开放沙市、重庆、苏州、杭州，并允许日本在口岸设厂。；目标 shimonoseki-treaty、sino-japanese-full；来源 first-sino-japanese-war/treaty-of-shimonoseki
- 俄法德干涉还辽：俄德法干涉迫使日本放弃辽东半岛，清政府另付赎辽费；原条约列辽东，后来还辽不包括台湾、澎湖。；目标 triple-intervention、sino-japanese-full；来源 first-sino-japanese-war/treaty-of-shimonoseki

### hundred-days-memory · review

记法：年份、人物、事件与条约线索串联

覆盖：1895年康有为、梁启超等组织公车上书，揭开戊戌变法序幕。；1898年光绪帝颁布《定国是诏》开始变法，新政持续103天，故称百日维新。；京师大学堂是中国近代第一所国立大学，也是近代国立高等教育的开端。；戊戌六君子包括谭嗣同等六人；我自横刀向天笑等句出自谭嗣同《狱中题壁》。

不覆盖：完整人物和国家名单、赔款利息数字；正文未展开的政治争议

- 九五公车康梁揭幕：1895年康有为、梁启超等组织公车上书，揭开戊戌变法序幕。；目标 gongche-memorial、hundred-days-full；来源 hundred-days-reform/gongche-memorial
- 九八光绪定国是，百日一零三：1898年光绪帝颁布《定国是诏》开始变法，新政持续103天，故称百日维新。；目标 hundred-days-reform、hundred-days-full；来源 hundred-days-reform/hundred-days-reform
- 京师大学堂为北大前身：京师大学堂创办于1898年维新时期，是北京大学前身，与京师同文馆不同；后者后来并入不等于最初同一机构。；目标 imperial-university、hundred-days-full；来源 hundred-days-reform/imperial-university
- 六君子谭嗣同狱中题壁：戊戌六君子包括谭嗣同等六人；我自横刀向天笑等句出自谭嗣同《狱中题壁》。；目标 six-martyrs、hundred-days-full；来源 hundred-days-reform/six-martyrs

### boxer-alliance-memory · review

记法：年份、人物、事件与条约线索串联

覆盖：义和团是19世纪末以扶清灭洋为口号的农民运动，正文把发动者与赵三多对应。；1900年英、法、德、奥、意、日、俄、美八国以保护使馆为名联合出兵镇压义和团。；1901年清政府与11国签订《辛丑条约》，涉及巨额赔款、东交民巷使馆界及允许列强驻兵。；《辛丑条约》使中国完全陷入半殖民地半封建社会的深渊。

不覆盖：完整人物和国家名单、赔款利息数字；正文未展开的政治争议

- 义和团农民扶清灭洋：义和团在山东、直隶等地的民间结社与抗争中发展，以扶清灭洋为相关口号，具有反侵略诉求及笼统排外等局限。；目标 boxer-rebellion、boxer-alliance-full；来源 boxer-rebellion-eight-nation-alliance/boxer-rebellion
- 一九零零英法德奥意日俄美：1900年英、法、德、奥、意、日、俄、美八国以保护使馆为名联合出兵镇压义和团。；目标 eight-nation-alliance、boxer-alliance-full；来源 boxer-rebellion-eight-nation-alliance/eight-nation-alliance
- 辛丑赔款使馆界，列强驻兵：1901年清政府与11国签订《辛丑条约》，涉及巨额赔款、东交民巷使馆界及允许列强驻兵。；目标 boxer-protocol-terms、boxer-alliance-full；来源 boxer-rebellion-eight-nation-alliance/boxer-protocol
- 辛丑完全陷入：《辛丑条约》使中国完全陷入半殖民地半封建社会的深渊。；目标 boxer-protocol-impact、boxer-alliance-full；来源 boxer-rebellion-eight-nation-alliance/boxer-protocol

### xinhai-organizations-memory · review

记法：用年份、组织、事件和影响边界串联

覆盖：1894年孙中山在檀香山成立兴中会，是中国第一个资产阶级革命团体。；1905年中国同盟会在东京成立，是中国第一个资产阶级革命政党。；同盟会纲领为驱除鞑虏、恢复中华、创立民国、平均地权。；三民主义包括民族、民权、民生，其中民权主义是核心。

不覆盖：完整人物名单、战争过程和过密日期；正文未展开的史学争议

- 九四檀香山兴中团体：1894年孙中山在檀香山成立兴中会，是中国第一个资产阶级革命团体。；目标 xingzhonghui-core、xinhai-organizations-full；来源 revolution-and-may-fourth/xingzhonghui
- 零五东京同盟政党：中国同盟会1905年在东京成立，是全国性的资产阶级革命政党，与此前革命团体不同。；目标 tongmenghui-core、xinhai-organizations-full；来源 revolution-and-may-fourth/tongmenghui
- 驱恢创平四纲领：同盟会纲领为驱除鞑虏、恢复中华、创立民国、平均地权。；目标 tongmenghui-platform、xinhai-organizations-full；来源 revolution-and-may-fourth/tongmenghui-platform
- 民族民权民生，民权为核：三民主义包括民族、民权、民生，其中民权主义是核心。；目标 three-principles-core、xinhai-organizations-full；来源 revolution-and-may-fourth/three-principles

### xinhai-process-memory · review

记法：用年份、组织、事件和影响边界串联

覆盖：1911年10月10日武昌起义打响第一枪，次日湖北军政府成立。；1912年1月1日中华民国在南京成立，孙中山任临时大总统；2月清帝退位，3月袁世凯就任临时大总统。；1913年二次革命讨袁失败；袁世凯复辟帝制后爆发护国运动，并于1916年被迫取消帝制。；辛亥革命推翻清王朝、结束封建君主专制并传播民主共和观念，但未完成反帝反封建任务，社会性质未根本改变。

不覆盖：完整人物名单、战争过程和过密日期；正文未展开的史学争议

- 双十武昌第一枪：1911年10月10日武昌起义打响第一枪，次日湖北军政府成立。；目标 wuchang-uprising-core、xinhai-process-full；来源 revolution-and-may-fourth/wuchang-uprising
- 一二一月民国立，二月退位三月袁：1912年1月1日中华民国在南京成立，孙中山任临时大总统；2月清帝退位，3月袁世凯就任临时大总统。；目标 republic-result-timeline、xinhai-process-full；来源 revolution-and-may-fourth/republic-of-china
- 一三二次讨袁败，复辟护国一六停：1913年二次革命讨袁失败；1915年底护国运动反对袁世凯称帝，1916年袁取消帝制，两个阶段不能合并。；目标 second-protection-core、xinhai-process-full；来源 revolution-and-may-fourth/second-revolution
- 倒清止帝制，共和入人心；任务未完性质未改：辛亥革命推翻清王朝、结束封建君主专制并传播民主共和观念，但未完成反帝反封建任务，社会性质未根本改变。；目标 xinhai-impact-boundary、xinhai-process-full；来源 revolution-and-may-fourth/xinhai-influence

### new-culture-memory · review

记法：用时间、人物、主张、力量和意义串联

覆盖：1915年陈独秀在上海创办《青年杂志》，第二卷起改名《新青年》，不是第二期；刊物与北大分别是思想阵地和活动基地。；新文化运动提倡科学与民主、新道德、新文学，分别反对愚昧与专制、旧道德、旧文学。；陈独秀创办刊物、倡导民主科学并批判旧礼教，蔡元培在北大倡导思想自由、兼容并包。；胡适发表《文学改良刍议》并提倡白话文，李大钊是中国传播马克思主义的先驱。

不覆盖：完整文章、口号和人物名单；正文未展开的思想史争议

- 一五独秀青年刊，新青阵地北大站：1915年陈独秀在上海创办《青年杂志》，第二卷起改名《新青年》，不是第二期；刊物与北大分别是思想阵地和活动基地。；目标 new-culture-origin、new-culture-full；来源 new-culture-may-fourth/new-culture-movement
- 科学民主，新德新文：新文化运动提倡科学与民主、新道德、新文学，分别反对愚昧与专制、旧道德、旧文学。；目标 new-culture-propositions、new-culture-full；来源 new-culture-may-fourth/new-culture-movement
- 陈办刊倡民主，蔡自由兼容：陈独秀创办刊物、倡导民主科学并批判旧礼教，蔡元培在北大倡导思想自由、兼容并包。；目标 new-culture-chen-cai、new-culture-full；来源 new-culture-may-fourth/new-culture-movement
- 胡适白话，李大钊传马克思：胡适发表《文学改良刍议》并提倡白话文，李大钊是中国传播马克思主义的先驱。；目标 new-culture-hu-li、new-culture-full；来源 new-culture-may-fourth/new-culture-movement

### may-fourth-memory · review

记法：用时间、人物、主张、力量和意义串联

覆盖：1919年巴黎和会上中国外交失败是五四运动的导火索。；青年学生发挥先锋作用，工人阶级在运动后期发挥主力军作用。；五四运动是彻底反帝反封建的爱国运动，中国工人阶级开始登上政治舞台。；五四运动促进马克思主义传播，是中国新民主主义革命的开端。

不覆盖：完整文章、口号和人物名单；正文未展开的思想史争议

- 一九巴黎外交败：1919年巴黎和会上中国外交失败是五四运动的导火索。；目标 may-fourth-trigger、may-fourth-full；来源 new-culture-may-fourth/may-fourth-movement
- 学生先锋，工人后主：青年学生发挥先锋作用，工人阶级在运动后期发挥主力军作用。；目标 may-fourth-forces、may-fourth-full；来源 new-culture-may-fourth/may-fourth-movement
- 彻底反帝反封建，工人登台：五四运动是彻底反帝反封建的爱国运动，工人阶级以独立政治力量登上历史舞台，不等于此前从未有工人抗争。；目标 may-fourth-nature、may-fourth-full；来源 new-culture-may-fourth/may-fourth-movement
- 传播马克思，新民主开端：五四运动促进马克思主义传播，是中国新民主主义革命的开端。；目标 may-fourth-significance、may-fourth-full；来源 new-culture-may-fourth/may-fourth-movement

### cpc-first-memory · review

记法：用基础、会议、代表边界和纲领层级串联

覆盖：组织基础是各地共产党早期组织，思想基础是马克思主义传播，阶级基础是工人阶级壮大，外部因素是共产国际帮助。；中共一大于1921年7月23日在上海召开，后转移至浙江嘉兴南湖；大会召开标志中国共产党成立。；毛泽东、李达、李汉俊、张国焘、董必武等出席；陈独秀、李大钊未出席，包惠僧受陈独秀派遣出席但不属于正式党代表。；一大确定中国共产党名称和无产阶级政党性质，提出奋斗目标、组织工人阶级的基本任务及统一组织纪律。

不覆盖：完整代表名单与会议细目；正文未展开的党史争议

- 组织思想阶级外助四基础：组织基础是各地共产党早期组织，思想基础是马克思主义传播，阶级基础是工人阶级壮大，外部因素是共产国际帮助。；目标 cpc-foundations、cpc-first-full；来源 communist-revolution/cpc-foundations
- 二一上海转南湖，一大立党：中共一大于1921年7月23日在上海召开，后转移至浙江嘉兴南湖；大会召开标志中国共产党成立。；目标 cpc-first-time-place、cpc-first-full；来源 communist-revolution/cpc-first-congress
- 陈李未到，十三含包：现行正式党史记中共一大13名中国代表，其中含受陈独秀派遣的包惠僧；陈独秀、李大钊本人未出席。；目标 cpc-first-delegates、cpc-first-full；来源 communist-revolution/cpc-first-congress
- 定名定性，目标任务统一纪律：一大确定中国共产党名称和无产阶级政党性质，提出奋斗目标、组织工人阶级的基本任务及统一组织纪律。；目标 cpc-first-content、cpc-first-full；来源 communist-revolution/cpc-first-congress

### cpc-second-memory · review

记法：用基础、会议、代表边界和纲领层级串联

覆盖：中共二大于1922年7月在上海召开。；中共二大的最高纲领是实现共产主义。；中共二大的最低纲领是反帝反封建。；中共二大在中国近代史上第一次明确提出彻底反帝反封建的民主革命纲领。

不覆盖：完整代表名单与会议细目；正文未展开的党史争议

- 二二上海二大：中共二大于1922年7月在上海召开。；目标 cpc-second-time-place、cpc-second-full；来源 communist-revolution/cpc-second-congress
- 最高共产主义：中共二大的最高纲领是实现共产主义。；目标 cpc-second-high-program、cpc-second-full；来源 communist-revolution/cpc-second-congress
- 最低反帝反封：最低纲领针对当时民主革命任务，要求打倒军阀、摆脱帝国主义压迫、实现民族独立并建立民主共和国。；目标 cpc-second-low-program、cpc-second-full；来源 communist-revolution/cpc-second-congress
- 首次明确彻底民主革命纲领：中共二大在中国近代史上第一次明确提出彻底反帝反封建的民主革命纲领。；目标 cpc-second-significance、cpc-second-full；来源 communist-revolution/cpc-second-congress

### national-cooperation-memory · review

记法：用会议、政策、运动、战争和破裂节点串联

覆盖：1923年中共三大在广州召开，决定共产党员以个人身份加入国民党实现合作，同时保持政治、思想和组织独立。；1924年国民党一大确立联俄、联共、扶助农工三大政策，发展新三民主义，标志第一次国共合作正式形成。；1925年中共四大在上海召开，提出无产阶级领导权和农民同盟军问题，并规定党员3人以上可成立党支部。；1925年五卅运动以工人阶级为主力掀起反帝爱国运动高潮，其中省港大罢工影响最大且持续1年零4个月。

不覆盖：完整人物名单和战争镇压过程；正文未展开的党史争议

- 三大个人入党合作，三独立：1923年中共三大在广州召开，决定共产党员以个人身份加入国民党实现合作，同时保持政治、思想和组织独立。；目标 cpc-third-core、national-cooperation-full；来源 national-revolution/cpc-third-congress
- 国一联俄联共扶农工，合作成：1924年国民党一大确立联俄、联共、扶助农工三大政策，发展新三民主义，标志第一次国共合作正式形成。；目标 kmt-first-core、national-cooperation-full；来源 national-revolution/kmt-first-congress
- 四大领导工农忙，三人成支部：1925年上海中共四大提出无产阶级领导权和工农联盟问题，规定以支部为基本组织；三人以上等历史表述不直接替代全部现行成立程序。；目标 cpc-fourth-core、national-cooperation-full；来源 national-revolution/cpc-fourth-congress
- 五卅反帝，省港工人长期罢工：五卅运动引发反帝爱国高潮，广州和香港工人在1925年至1926年开展持续一年多的省港大罢工。；目标 may30-strike-core、national-cooperation-full；来源 national-revolution/may-thirtieth-movement

### national-end-memory · review

记法：用会议、政策、运动、战争和破裂节点串联

覆盖：1926年国民政府出师北伐，主要对象为吴佩孚、孙传芳和张作霖。；蒋介石、汪精卫先后发动四一二和七一五反革命政变。；政变后南京国民政府建立，第一次国共合作全面破裂。；1927年中共五大在武汉召开，讨论土地革命和革命发展方向，并批评陈独秀报告中的错误。

不覆盖：完整人物名单和战争镇压过程；正文未展开的党史争议

- 二六北伐吴孙张：1926年国民政府出师北伐，主要对象为吴佩孚、孙传芳和张作霖。；目标 northern-expedition-core、national-end-full；来源 national-revolution/northern-expedition
- 四一二七一五政变：蒋介石、汪精卫先后发动四一二和七一五反革命政变。；目标 cooperation-coups、national-end-full；来源 national-revolution/first-cooperation-break
- 南京建政、武汉政变，合作全面破裂：1927年四一二政变后蒋介石在南京建政，随后汪精卫在武汉发动七一五政变，第一次国共合作全面破裂。；目标 cooperation-break-core、national-end-full；来源 national-revolution/first-cooperation-break
- 二七武汉五大，土地方向批陈误：1927年中共五大在武汉召开，讨论土地革命和革命发展方向，并批评陈独秀报告中的错误。；目标 cpc-fifth-core、national-end-full；来源 national-revolution/cpc-fifth-congress

### land-uprisings-memory · review

记法：用时间、第一项、建军节点和根据地地位串联

覆盖：1927年8月1日南昌起义打响武装反抗国民党的第一枪，是党独立领导革命战争、创建人民军队和武装夺取政权的开端。；1927年8月7日汉口八七会议确定土地革命和武装反抗国民党的总方针，毛泽东提出政权由枪杆子中取得。；1927年9月毛泽东领导湘赣边界秋收起义，党第一次在武装斗争中公开打出工农革命军旗号。；1927年10月毛泽东创建井冈山革命根据地，是第一个农村革命根据地。

不覆盖：完整战斗过程和组织数字；正文未展开的党史争议

- 八一南昌第一枪：1927年8月1日南昌起义打响武装反抗国民党的第一枪，是党独立领导革命战争、创建人民军队和武装夺取政权的开端。；目标 nanchang-uprising-core、land-uprisings-full；来源 land-revolution/nanchang-uprising
- 八七汉口定土革武装：1927年8月7日汉口八七会议确定土地革命和武装反抗国民党的总方针，毛泽东提出政权由枪杆子中取得。；目标 august-seventh-core、land-uprisings-full；来源 land-revolution/august-seventh-meeting
- 九月秋收举工农旗：1927年9月毛泽东领导湘赣边界秋收起义，党第一次在武装斗争中公开打出工农革命军旗号。；目标 autumn-harvest-core、land-uprisings-full；来源 land-revolution/autumn-harvest-uprising
- 十月井冈首农村：1927年10月毛泽东创建井冈山革命根据地，是第一个农村革命根据地。；目标 jinggangshan-core、land-uprisings-full；来源 land-revolution/jinggangshan-base

### land-building-memory · review

记法：用时间、第一项、建军节点和根据地地位串联

覆盖：三湾改编从政治和组织上保证党对军队绝对领导，主要内容包括支部建在连上、官兵平等。；1929年福建上杭古田会议确立人民军队建设基本原则，提出建设无产阶级领导的新型人民军队。；1928年中共六大在莫斯科举行，讨论社会与革命性质、形势与任务，强调群众工作、积蓄力量。；1931年以赣南、闽西为基础建立全国最大的中央革命根据地；同年瑞金成立中华苏维埃共和国临时中央政府。

不覆盖：完整战斗过程和组织数字；正文未展开的党史争议

- 三湾支部连上党领军：三湾改编从政治和组织上保证党对军队绝对领导，主要内容包括支部建在连上、官兵平等。；目标 sanwan-core、land-building-full；来源 land-revolution/sanwan-reorganization
- 古田确立建军原则：1929年福建上杭古田会议确立人民军队建设基本原则，提出建设无产阶级领导的新型人民军队。；目标 gutian-core、land-building-full；来源 land-revolution/gutian-meeting
- 六大莫斯科群众积力量：1928年中共六大在莫斯科举行，讨论社会与革命性质、形势与任务，强调群众工作、积蓄力量。；目标 cpc-sixth-core、land-building-full；来源 land-revolution/cpc-sixth-congress
- 赣南闽西苏区发展，瑞金成立临时中央政府：中央苏区以赣南、闽西等根据地为基础逐步形成；1931年11月瑞金成立临时中央政府，地域发展与政权成立不同。；目标 central-soviet-core、land-building-full；来源 land-revolution/central-soviet

### long-march-process-memory · review

记法：用年份、路线动词、会议意义和作品线索串联

覆盖：第五次反围剿失败后被迫长征；1934年10月中央红军从江西瑞金等地出发。；1936年10月红军三大主力会师，宣告二万五千里长征胜利结束。；路线关键动作为四渡赤水、巧渡金沙江、强渡大渡河、飞夺泸定桥。；后段经过雪山草地，到达陕北吴起镇，最终在甘肃会宁、将台堡会师。

不覆盖：完整战役过程和诗词全文；正文未展开的党史争议

- 反围剿败，三四江西启程：第五次反围剿失败后被迫长征；1934年10月中央红军从江西瑞金等地出发。；目标 long-march-start、long-march-process-full；来源 land-revolution/red-army-long-march
- 三六三军会师长征成：1936年10月红军三大主力会师，标志长征胜利结束；二万五千里是中央红军代表性行程概括，各支行程不同。；目标 long-march-finish、long-march-process-full；来源 land-revolution/red-army-long-march
- 四赤巧金强大飞泸：四渡赤水、巧渡金沙江、强渡大渡河、飞夺泸定桥属于中央红军的关键作战行动，不是所有红军共同的同一路线。；目标 long-march-route-water、long-march-process-full；来源 land-revolution/red-army-long-march
- 三五中央到陕北，三六主力会师：中央红军1935年到达陕北，1936年三大主力在会宁、将台堡等地会师，不能合成一支部队同年行程。；目标 long-march-route-late、long-march-process-full；来源 land-revolution/red-army-long-march

### zunyi-poems-memory · review

记法：用年份、路线动词、会议意义和作品线索串联

覆盖：1935年初遵义会议成立毛泽东、周恩来、王稼祥三人军事领导小组。；遵义会议是党史上生死攸关的转折点，标志党从幼年走向成熟。；《忆秦娥·娄山关》作于1935年2月；《七律·长征》《清平乐·六盘山》作于1935年10月。；红军不怕远征难对应《七律·长征》；雄关漫道真如铁对应《忆秦娥·娄山关》；不到长城非好汉对应《清平乐·六盘山》。

不覆盖：完整战役过程和诗词全文；正文未展开的党史争议

- 一月遵义、三月苟坝毛周王：1935年1月遵义会议调整领导与指挥；毛泽东、周恩来、王稼祥新三人军事指挥小组在后来3月苟坝一带形成。；目标 zunyi-team、zunyi-poems-full；来源 land-revolution/zunyi-meeting
- 生死转折，由幼成熟：遵义会议是党史上生死攸关的转折点，标志党从幼年走向成熟。；目标 zunyi-significance、zunyi-poems-full；来源 land-revolution/zunyi-meeting
- 娄山二月，七律六盘十月：《忆秦娥·娄山关》作于1935年2月；《七律·长征》《清平乐·六盘山》作于1935年10月。；目标 long-march-poem-dates、zunyi-poems-full；来源 land-revolution/long-march-poems
- 远征七律，雄关娄山，不到长城六盘：红军不怕远征难对应《七律·长征》；雄关漫道真如铁对应《忆秦娥·娄山关》；不到长城非好汉对应《清平乐·六盘山》。；目标 long-march-poem-lines、zunyi-poems-full；来源 land-revolution/long-march-poems

### anti-outbreak-memory · review

记法：用起点、运动、路线和战线阶段串联

覆盖：1931年9月18日九一八事变是日本武力征服中国的开端，也是中国抗日战争的起点。；华北事变后，1935年12月9日北平学生在中国共产党领导下开展抗日救亡运动。；1937年7月7日卢沟桥事变爆发，全国抗日战争由此开始。；1937年12月日军攻占南京并制造大屠杀；南京大屠杀死难者国家公祭日为12月13日。

不覆盖：完整口号、伤亡细节和战争争议

- 九一八抗战起点：1931年9月18日九一八事变后日本侵占中国东北，中国人民抗日战争开始；不能把日本此前所有侵华行为都排除在历史之外。；目标 september-18-core、anti-outbreak-full；来源 anti-japanese-liberation/anti-japanese-outbreak
- 华北危，一二九北平学生救亡：华北事变后，1935年12月9日北平学生在中国共产党领导下开展抗日救亡运动。；目标 december-9-core、anti-outbreak-full；来源 anti-japanese-liberation/anti-japanese-outbreak
- 七七卢沟全面抗战：1937年7月7日卢沟桥事变爆发，全国抗日战争由此开始。；目标 july-7-core、anti-outbreak-full；来源 anti-japanese-liberation/anti-japanese-outbreak
- 南京十二月，公祭十三日：1937年12月日军攻占南京并制造大屠杀；南京大屠杀死难者国家公祭日为12月13日。；目标 nanjing-massacre-core、anti-outbreak-full；来源 anti-japanese-liberation/anti-japanese-outbreak

### anti-front-memory · review

记法：用起点、运动、路线和战线阶段串联

覆盖：1935年底瓦窑堡会议确定建立抗日民族统一战线的方针。；1936年12月12日西安事变和平解决，标志十年内战基本结束、抗日民族统一战线初步形成。；1937年8月洛川会议通过抗日救国十大纲领，制定全面抗战路线。；1937年9月国共合作宣言发表及蒋介石谈话标志统一战线正式形成、第二次合作开始；红军改编为八路军，游击队改编为新四军。

不覆盖：完整口号、伤亡细节和战争争议

- 瓦窑堡定战线方针：1935年底瓦窑堡会议确定建立抗日民族统一战线的方针。；目标 wayaobao-core、anti-front-full；来源 anti-japanese-liberation/anti-japanese-united-front
- 双十二和平，内战止战线初：1936年12月12日发生的西安事变后来和平解决，推动十年内战基本结束，抗日民族统一战线初步形成；发生日不等于和平解决日。；目标 xian-incident-core、anti-front-full；来源 anti-japanese-liberation/anti-japanese-united-front
- 洛川全面抗战线：1937年8月洛川会议通过抗日救国十大纲领，制定全面抗战路线。；目标 luochuan-core、anti-front-full；来源 anti-japanese-liberation/anti-japanese-united-front
- 九月宣言谈话，战线正式二次合作：1937年9月国共合作宣言发表及蒋介石谈话标志统一战线正式形成、第二次合作开始；红军改编为八路军，游击队改编为新四军。；目标 united-front-formal、anti-front-full；来源 anti-japanese-liberation/anti-japanese-united-front

### resistance-battles-memory · review

记法：用战役地位、人物和时间线串联

覆盖：淞沪会战是整个中日战争中规模最大、战斗最惨烈的战役，粉碎日本三个月灭亡中国的计划。；林彪率一一五师取得平型关大捷，是抗战以来首次大捷，打破日军不可战胜神话。；徐州会战中李宗仁指挥台儿庄战役，是抗战以来取得的最大胜利。；武汉会战结束后，中国抗日战争进入战略相持阶段。

不覆盖：完整战役过程、过密数字和决议清单

- 淞沪抗击速战：1937年淞沪会战在上海地区抗击日军，打破日军速战速决企图，是战略防御阶段的重要会战。；目标 shanghai-battle-core、resistance-battles-full；来源 anti-japanese-liberation/nationwide-resistance
- 平型打破神话：1937年八路军一一五师取得平型关大捷，打破日军不可战胜神话，不能推断此前所有抗日斗争从无胜利。；目标 pingxingguan-core、resistance-battles-full；来源 anti-japanese-liberation/nationwide-resistance
- 台儿庄李宗仁：1938年徐州会战期间，李宗仁指挥中国军队取得台儿庄重大胜利，区别于会战整体。；目标 taierzhuang-core、resistance-battles-full；来源 anti-japanese-liberation/nationwide-resistance
- 武汉会后战略持：武汉会战结束后，中国抗日战争进入战略相持阶段。；目标 wuhan-battle-core、resistance-battles-full；来源 anti-japanese-liberation/nationwide-resistance

### anti-later-memory · review

记法：用战役地位、人物和时间线串联

覆盖：1940年下半年彭德怀指挥百团大战，是抗战时期中国共产党独立发动的规模最大、持续时间最长、战果最丰富的战役。；1945年8月15日日本宣布无条件投降，9月2日签署投降书，9月3日为抗战胜利纪念日，10月25日台湾回归。；延安整风是党史首次大规模整风；1942年正式开始，1945年六届七中全会通过《关于若干历史问题的决议》后结束。；1945年中共七大在延安举行，毛泽东作《论联合政府》，确立毛泽东思想为党的指导思想。

不覆盖：完整战役过程、过密数字和决议清单

- 四零彭总百团党独立：1940年下半年彭德怀指挥八路军在华北发动百团大战，打击日军交通线与据点，是敌后战场重要作战。；目标 hundred-regiments-core、anti-later-full；来源 anti-japanese-liberation/nationwide-resistance
- 八一五投降，九二签字九三纪念：1945年8月15日日本宣布无条件投降，9月2日签署投降书，9月3日为抗战胜利纪念日，10月25日台湾回归。；目标 war-victory-core、anti-later-full；来源 anti-japanese-liberation/nationwide-resistance
- 四二整风，四五决议收束：延安整风是党史首次大规模整风；1942年正式开始，1945年六届七中全会通过《关于若干历史问题的决议》后结束。；目标 yanan-rectification-core、anti-later-full；来源 anti-japanese-liberation/nationwide-resistance
- 四五延安七大立毛思想：1945年中共七大在延安举行，毛泽东作《论联合政府》，确立毛泽东思想为党的指导思想。；目标 cpc-seventh-core、anti-later-full；来源 anti-japanese-liberation/nationwide-resistance

### liberation-turn-memory · review

记法：用年份、人物、文件和战役节点串联

覆盖：1945年抗战胜利后，为避免内战、争取和平，毛泽东、周恩来、王若飞等赴重庆谈判。；1945年10月10日国共签订《政府与中共代表会谈纪要》，即《双十协定》。；1947年6月底，刘伯承、邓小平率晋冀鲁豫解放军主力展开战略反攻。；刘邓大军渡过黄河、千里跃进大别山。

不覆盖：完整战役过程和过密数字；正文未展开的战史争议

- 四五重庆谈和平：1945年抗战胜利后，为避免内战、争取和平，毛泽东、周恩来、王若飞等赴重庆谈判。；目标 chongqing-purpose、liberation-turn-full；来源 liberation-war/chongqing-negotiations
- 十月十日双十纪要：1945年10月10日国共签订《政府与中共代表会谈纪要》，即《双十协定》。；目标 double-tenth-core、liberation-turn-full；来源 liberation-war/chongqing-negotiations
- 四七刘邓反攻：1947年6月底，刘伯承、邓小平率晋冀鲁豫解放军主力展开战略反攻。；目标 counteroffensive-actors、liberation-turn-full；来源 liberation-war/strategic-counteroffensive
- 渡黄河跃大别山：刘邓大军渡过黄河、千里跃进大别山。；目标 counteroffensive-route、liberation-turn-full；来源 liberation-war/strategic-counteroffensive

### liberation-decision-memory · review

记法：用年份、人物、文件和战役节点串联

覆盖：1948年9月至1949年1月，辽沈、淮海、平津三大战役展开。；淮海战役被称为小推车推出来的胜利，并具有牺牲重、歼敌多、政治影响大、样式复杂等特点。；1949年3月七届二中全会在西柏坡召开，决定工作重心由乡村转向城市并提出两个务必。；1949年4月21日渡江战役发起，4月23日南京解放，国民政府覆灭。

不覆盖：完整战役过程和过密数字；正文未展开的战史争议

- 辽淮平三大战役：1948年9月至1949年1月，辽沈、淮海、平津三大战役展开。；目标 three-campaigns-core、liberation-decision-full；来源 liberation-war/three-campaigns
- 淮海小推车：淮海战役被称为小推车推出来的胜利，并具有牺牲重、歼敌多、政治影响大、样式复杂等特点。；目标 huaihai-feature、liberation-decision-full；来源 liberation-war/three-campaigns
- 西柏坡重心进城两个务必：1949年3月七届二中全会在西柏坡召开，决定工作重心由乡村转向城市并提出两个务必。；目标 seventh-second-plenum-core、liberation-decision-full；来源 liberation-war/seventh-central-second-plenum
- 四二零夜渡江，四二三南京：1949年4月20日夜开始发起渡江作战，4月23日解放南京，各地解放仍有后续进程。；目标 yangtze-campaign-core、liberation-decision-full；来源 liberation-war/yangtze-crossing-campaign

### new-china-consolidation-memory · review

记法：用年份、文件、人物和事件结果串联

覆盖：1949年10月1日中华人民共和国成立，标志我国新民主主义革命的基本胜利。；1950年6月公布《中华人民共和国土地改革法》，实行农民的土地所有制。；到1952年底，除部分少数民族地区外，全国大陆基本完成土地改革。；1950年10月彭德怀率志愿军赴朝，1953年7月《朝鲜停战协定》签字。

不覆盖：政策过程、战争细节和国际关系评价

- 四九十一起新中国：1949年10月1日中华人民共和国成立，标志我国新民主主义革命的基本胜利。；目标 prc-founding-core、new-china-consolidation-full；来源 new-china-reform/prc-founding
- 五零土改法，农民土地有：1950年6月公布《中华人民共和国土地改革法》，实行农民的土地所有制。；目标 land-reform-law-core、new-china-consolidation-full；来源 new-china-reform/land-reform
- 五二年底大陆基本成：到1952年底，除部分少数民族地区外，全国大陆基本完成土地改革。；目标 land-reform-completion-core、new-china-consolidation-full；来源 new-china-reform/land-reform
- 五零十月彭赴朝，五三七月停战签：1950年10月彭德怀率志愿军赴朝，1953年7月《朝鲜停战协定》签字。；目标 korean-war-line-core、new-china-consolidation-full；来源 new-china-reform/korean-war

### new-china-diplomacy-memory · review

记法：用年份、文件、人物和事件结果串联

覆盖：1953年12月周恩来接见印度代表团时首次提出和平共处五项原则。；五项原则包括互相尊重主权和领土完整、互不侵犯、互不干涉内政、平等互利、和平共处；1955年万隆会议发展为十项原则。；1971年10月25日，第26届联合国大会恢复中华人民共和国在联合国的一切合法权利，包括安理会常任理事国席位。；1972年2月尼克松访华，1979年1月中美正式建交。

不覆盖：政策过程、战争细节和国际关系评价

- 五三周总见印度，首次提五项：1953年12月周恩来接见印度代表团时首次提出和平共处五项原则。；目标 peaceful-proposal-core、new-china-diplomacy-full；来源 new-china-reform/peaceful-coexistence
- 尊主权、互不犯、不干政、平互利、和共处：五项原则包括互相尊重主权和领土完整、互不侵犯、互不干涉内政、平等互利、和平共处；1955年万隆会议发展为十项原则。；目标 peaceful-content-core、new-china-diplomacy-full；来源 new-china-reform/peaceful-coexistence
- 七一二六大会复席位：1971年10月25日，第26届联合国大会恢复中华人民共和国在联合国的一切合法权利，包括安理会常任理事国席位。；目标 un-seat-core、new-china-diplomacy-full；来源 new-china-reform/un-seat-restoration
- 七二访华，七九建交：1972年2月尼克松访华，1979年1月中美正式建交。；目标 china-us-nodes-core、new-china-diplomacy-full；来源 new-china-reform/china-us-relations

### industrialization-plan-memory · review

记法：用年份、名称、对象与制度意义串联

覆盖：第一个五年计划为1953年至1957年。；从十一五时期开始，五年计划改称五年规划。；一化指社会主义工业化。；三改指对农业、手工业和资本主义工商业的社会主义改造。

不覆盖：项目名单、宪法条文和改造过程

- 一五五三到五七：第一个五年计划为1953年至1957年。；目标 first-plan-years-core、industrialization-plan-full；来源 new-china-reform/first-five-year-plan
- 十一五起计划改规划：从十一五时期开始，五年计划改称五年规划。；目标 plan-planning-name-core、industrialization-plan-full；来源 new-china-reform/first-five-year-plan
- 一化是工业化：一化指社会主义工业化。；目标 one-industrialization-core、industrialization-plan-full；来源 new-china-reform/socialist-transformation
- 三改农、手、资本工商业：三改指对农业、手工业和资本主义工商业的社会主义改造。；目标 three-transformations-core、industrialization-plan-full；来源 new-china-reform/socialist-transformation

### constitution-transformation-memory · review

记法：用年份、名称、对象与制度意义串联

覆盖：《中华人民共和国宪法》于1954年9月通过。；1954年宪法是新中国第一部宪法，属于社会主义类型宪法。；三大改造于1956年底完成。；三大改造完成标志着社会主义制度在我国基本上建立起来。

不覆盖：项目名单、宪法条文和改造过程

- 五四九月宪法过：《中华人民共和国宪法》于1954年9月通过。；目标 constitution-1954-date-core、constitution-transformation-full；来源 new-china-reform/constitution-1954
- 新中国第一部、社会主义类型：1954年宪法是新中国第一部宪法，属于社会主义类型宪法。；目标 constitution-1954-status-core、constitution-transformation-full；来源 new-china-reform/constitution-1954
- 五六年底三改成：到1956年底，对农业、手工业和资本主义工商业的社会主义改造基本完成，不等于全部工业化目标完成。；目标 transformation-completion-core、constitution-transformation-full；来源 new-china-reform/socialist-transformation
- 制度基本建起来：三大改造完成标志着社会主义制度在我国基本上建立起来。；目标 transformation-significance-core、constitution-transformation-full；来源 new-china-reform/socialist-transformation

### third-plenum-memory · review

记法：用日期、地点和事件结果成对记忆

覆盖：1978年12月，十一届三中全会在北京举行。；会议作出把党和国家工作中心转移到经济建设上来、实行改革开放的历史性决策。

不覆盖：会议议程、政策过程和回归谈判

- 七八十二月北京会：1978年12月，十一届三中全会在北京举行。；目标 third-plenum-time-core、third-plenum-full；来源 reform-opening-period/eleventh-central-third-plenum
- 中心转经济，决策改革开：会议作出把党和国家工作中心转移到经济建设上来、实行改革开放的历史性决策。；目标 third-plenum-decision-core、third-plenum-full；来源 reform-opening-period/eleventh-central-third-plenum

### hong-kong-macao-memory · review

记法：用日期、地点和事件结果成对记忆

覆盖：香港于1997年7月1日回归。；澳门于1999年12月20日回归。；香港先于澳门回归，时间分别为1997年和1999年。

不覆盖：会议议程、政策过程和回归谈判

- 九七七一香港归：香港于1997年7月1日回归。；目标 hong-kong-return-core、hong-kong-macao-full；来源 reform-opening-period/hong-kong-macau-return
- 九九十二二十澳门归：澳门于1999年12月20日回归。；目标 macao-return-core、hong-kong-macao-full；来源 reform-opening-period/hong-kong-macau-return
- 九七香港先，九九澳门后：香港先于澳门回归，时间分别为1997年和1999年。；目标 hong-kong-macao-order-core、hong-kong-macao-full；来源 reform-opening-period/hong-kong-macau-return

### book-lexicon-theory-memory · review

记法：把书名、作者时代与教材地位成组记忆

覆盖：《说文解字》由东汉许慎撰写。；《说文解字》是我国第一部系统分析汉字字形、考究字源的字书，也是第一部按部首编排的汉语字典。；《文心雕龙》由南朝刘勰创作。；《文心雕龙》是中国文学理论批评史上第一部有严密体系的文学理论专著。

不覆盖：作品全文、编纂过程和版本学争议

- 东汉许慎说文：《说文解字》由东汉许慎撰写。；目标 shuowen-author-core、book-lexicon-theory-full；来源 book-records/book-records-table
- 析字源、按部首：《说文解字》系统分析汉字字形、考究字源，按部首编排，是研究汉字的重要字书。；目标 shuowen-status-core、book-lexicon-theory-full；来源 book-records/book-records-table
- 南朝刘勰文心：《文心雕龙》由南朝刘勰创作。；目标 wenxin-author-core、book-lexicon-theory-full；来源 book-records/book-records-table
- 文学理论严体系：《文心雕龙》为刘勰系统讨论文学创作与批评的理论专著，不是解释汉字的字典。；目标 wenxin-status-core、book-lexicon-theory-full；来源 book-records/book-records-table

### book-collections-memory · review

记法：把书名、作者时代与教材地位成组记忆

覆盖：《永乐大典》由明代解缙总纂修。；《永乐大典》是我国最大的一部类书。；《四库全书》由清代纪昀等主编，是我国最大的一部丛书。；《四库全书》分经、史、子、集四部。

不覆盖：作品全文、编纂过程和版本学争议

- 明代姚广孝解缙等纂永乐：明代姚广孝、解缙等主持纂修《永乐大典》，修纂具有多个阶段，不是一人独作。；目标 yongle-author-core、book-collections-full；来源 book-records/book-records-table
- 永乐分类纂辑文献：《永乐大典》是分类纂辑文献资料、便于征引查找的大型类书，区别于汇集多部典籍的丛书。；目标 yongle-status-core、book-collections-full；来源 book-records/book-records-table
- 清代纪昀等纂四库丛书：清代纪昀等参与纂修《四库全书》，它是按经史子集分类的大型丛书，体例不同于类书。；目标 siku-author-status-core、book-collections-full；来源 book-records/book-records-table
- 经史子集四部分：《四库全书》分经、史、子、集四部。；目标 siku-four-parts-core、book-collections-full；来源 book-records/book-records-table

### five-rites-memory · review

记法：按礼名与事项、步骤与含义成组记忆

覆盖：祭祀之事为吉礼；冠婚之事为嘉礼。；宾客之事为宾礼；军旅之事为军礼。；丧葬之事为凶礼。；吉礼主要祭祀天神、地祇、人鬼；嘉礼用于和合人际，冠礼、笄礼、婚礼等属于嘉礼。

不覆盖：礼仪演变、地区差异和未列仪节

- 祭祀吉，冠婚嘉：祭祀之事为吉礼；冠婚之事为嘉礼。；目标 five-rites-jia-ji-core、five-rites-full；来源 ritual-system/festive-rite
- 宾客宾，军旅军：宾客之事为宾礼；军旅之事为军礼。；目标 five-rites-bin-jun-core、five-rites-full；来源 ritual-system/five-rites
- 丧葬凶：丧葬之事为凶礼。；目标 five-rites-xiong-core、five-rites-full；来源 ritual-system/five-rites
- 吉祭天地鬼，嘉合冠笄婚：吉礼主要祭祀天神、地祇、人鬼；嘉礼用于和合人际，冠礼、笄礼、婚礼等属于嘉礼。；目标 jia-ji-detail-core、five-rites-full；来源 ritual-system/festive-rite

### six-marriage-rites-memory · review

记法：按礼名与事项、步骤与含义成组记忆

覆盖：纳采是媒人提亲；问名是问女方出生年月和姓名。；纳吉指占卜；纳征指送聘礼。；请期是男方择定婚期；亲迎是迎娶。；六礼顺序为纳采、问名、纳吉、纳征、请期、亲迎。

不覆盖：礼仪演变、地区差异和未列仪节

- 采提亲，名生姓：纳采是媒人提亲；问名是问女方出生年月和姓名。；目标 marriage-nacai-wenming-core、marriage-six-full；来源 ritual-system/six-marriage-rites
- 吉占卜，征聘礼：纳吉指占卜；纳征指送聘礼。；目标 marriage-naji-nazheng-core、marriage-six-full；来源 ritual-system/six-marriage-rites
- 期择日，迎迎娶：请期是男方择定婚期；亲迎是迎娶。；目标 marriage-qingqi-qinying-core、marriage-six-full；来源 ritual-system/six-marriage-rites
- 采名吉征期迎：六礼顺序为纳采、问名、纳吉、纳征、请期、亲迎。；目标 marriage-order-core、marriage-six-full；来源 ritual-system/six-marriage-rites

### grand-lesser-sacrifice-memory · review

记法：按主体、组合与身份层级成组记忆

覆盖：牛、羊、豕三牲全备称太牢。；正文以古代帝王祭祀社稷说明太牢。；少牢用羊、豕，不含牛。；正文以古代诸侯、卿大夫祭祀宗庙说明少牢。

不覆盖：礼仪演变、祭祀程序和未列称谓

- 太牢牛羊豕全备：牛、羊、豕三牲全备称太牢。；目标 grand-sacrifice-animals-core、grand-lesser-sacrifice-full；来源 ritual-system/grand-lesser-sacrifice
- 帝王社稷用太牢：正文以古代帝王祭祀社稷说明太牢。；目标 grand-sacrifice-context-core、grand-lesser-sacrifice-full；来源 ritual-system/grand-lesser-sacrifice
- 少牢羊豕不含牛：少牢用羊、豕，不含牛。；目标 lesser-sacrifice-animals-core、grand-lesser-sacrifice-full；来源 ritual-system/grand-lesser-sacrifice
- 诸侯卿大夫宗庙少牢：正文以古代诸侯、卿大夫祭祀宗庙说明少牢。；目标 lesser-sacrifice-context-core、grand-lesser-sacrifice-full；来源 ritual-system/grand-lesser-sacrifice

### funeral-rank-memory · review

记法：按主体、组合与身份层级成组记忆

覆盖：天子死曰崩，诸侯曰薨。；大夫曰卒，士曰不禄。；庶人曰死。；天子崩、诸侯薨、大夫卒、士不禄、庶人死。

不覆盖：礼仪演变、祭祀程序和未列称谓

- 天子崩、诸侯薨：天子死曰崩，诸侯曰薨。；目标 funeral-emperor-lord-core、funeral-rank-full；来源 ritual-system/funeral-rite
- 大夫卒、士不禄：大夫曰卒，士曰不禄。；目标 funeral-official-scholar-core、funeral-rank-full；来源 ritual-system/funeral-rite
- 庶人死：庶人曰死。；目标 funeral-commoner-core、funeral-rank-full；来源 ritual-system/funeral-rite
- 崩薨卒不禄死：天子崩、诸侯薨、大夫卒、士不禄、庶人死。；目标 funeral-rank-order-core、funeral-rank-full；来源 ritual-system/funeral-rite

### light-basics-memory · review

记法：长途意象＋方向对照

覆盖：光是一种电磁波。；光年是长度单位，指光在宇宙真空中沿直线传播一年经过的距离。；可见光是电磁波谱中人眼可以感知的部分。；红橙黄绿青蓝紫按波长递减排列，频率递增。

不覆盖：完整频谱、精密计算和医学安全建议

- 光是电磁波：光是一种电磁波。；目标 light-electromagnetic-core、light-basics-full；来源 optics/light-nature
- 光年量长途：光年是长度单位，指光在宇宙真空中沿直线传播一年经过的距离。；目标 light-year-core、light-basics-full；来源 optics/light-nature
- 人眼见七色：可见光是电磁波谱中人眼可以感知的部分。；目标 visible-light-core、light-basics-full；来源 optics/light-nature
- 红到紫：波越短、频越高：红橙黄绿青蓝紫按波长递减排列，频率递增。；目标 visible-order-core、light-basics-full；来源 optics/light-nature

### infrared-ultraviolet-memory · review

记法：光谱位置＋双边对照

覆盖：红外线波长比可见光长，人眼不能看到。；红外探测、遥控、热成像和加热干燥属于正文所列红外应用。；紫外线波长比可见光短，人眼不能看到；太阳紫外线会被臭氧吸收。；杀菌、验钞和促进人体合成维生素D属于正文所列紫外应用。

不覆盖：完整频谱、精密计算和医学安全建议

- 红外在红外：长波不见：红外线波长比可见光长，人眼不能看到。；目标 infrared-wavelength-core、infrared-ultraviolet-full；来源 optics/light-nature
- 红外探测、遥控、热成像和加热：红外探测、遥控、热成像和加热干燥属于正文所列红外应用。；目标 infrared-applications-core、infrared-ultraviolet-full；来源 optics/light-nature
- 紫外在紫外：短波不见，臭氧拦：紫外线波长比可见光短，人眼不能看到；太阳紫外线会被臭氧吸收。；目标 ultraviolet-wavelength-core、infrared-ultraviolet-full；来源 optics/light-nature
- 紫外杀菌、验钞、维D：杀菌、验钞和促进人体合成维生素D属于正文所列紫外应用。；目标 ultraviolet-applications-core、infrared-ultraviolet-full；来源 optics/light-nature

### propagation-reflection-memory · review

记法：连续画面＋表面对照

覆盖：光在同种均匀介质中沿直线传播。；影子、小孔成像、日食、月食和激光准直属于正文所列直线传播现象。；光在两种物质分界面改变传播方向，又返回原来物质。；光滑面使平行入射光仍平行反射；粗糙面使光向各方向反射。

不覆盖：光路作图、角度计算和仪器结构推导

- 同种均匀，光走直线：光在同种均匀介质中沿直线传播。；目标 light-straight-condition-core、propagation-reflection-full；来源 optics/light-propagation
- 影子小孔、日月食，激光准直一线穿：影子、小孔成像、日食、月食和激光准直属于正文所列直线传播现象。；目标 light-straight-examples-core、propagation-reflection-full；来源 optics/light-propagation
- 遇到界面，返回原边：光在两种物质分界面改变传播方向，又返回原来物质。；目标 light-reflection-definition-core、propagation-reflection-full；来源 optics/light-propagation
- 光滑排队返，粗糙散开来：光滑面使平行入射光仍平行反射；粗糙面使光向各方向反射。；目标 specular-diffuse-core、propagation-reflection-full；来源 optics/light-propagation

### refraction-scattering-memory · review

记法：条件—器件—应用四栏对照

覆盖：光从一种透明介质斜射入另一种透明介质，在交界处改变传播方向。；凸透镜会聚、凹透镜发散；凸面镜常作后视镜，凹面镜常作反光罩。；光从较高折射率介质进入较低折射率介质且入射角超过临界角时发生全反射，光纤利用该现象。；光通过不均匀介质时部分光偏离原方向；蓝天、雾中朦胧和丁达尔现象属于正文示例。

不覆盖：光路作图、角度计算和仪器结构推导

- 折射：斜入另一透明介质，在界面改变方向：光从一种透明介质斜射入另一种透明介质，在交界处改变传播方向。；目标 light-refraction-definition-core、refraction-scattering-full；来源 optics/light-propagation
- 器件：凸透会聚、凹透发散；凸面后视、凹面反光：凸透镜会聚、凹透镜发散；凸面镜常作后视镜，凹面镜常作反光罩。；目标 lens-mirror-functions-core、refraction-scattering-full；来源 optics/light-propagation
- 全反射：高折到低折，入射角超过临界角；光纤应用：光从较高折射率介质进入较低折射率介质且入射角超过临界角时发生全反射，光纤利用该现象。；目标 total-reflection-core、refraction-scattering-full；来源 optics/light-propagation
- 散射：不均匀介质使光偏离；蓝天、雾和丁达尔：光通过不均匀介质时部分光偏离原方向；蓝天、雾中朦胧和丁达尔现象属于正文示例。；目标 light-scattering-core、refraction-scattering-full；来源 optics/light-propagation

### mirage-memory · review

记法：名称—成因—像—环境四栏对照

覆盖：海市蜃楼又称蜃景。；海市蜃楼由光的折射和全反射形成。；地球上物体反射的光经大气折射形成虚像。；平静海面、大江江面、湖面、雪原、沙漠或戈壁是正文所列常见地点。

不覆盖：光路作图、大气分层计算和气象预测

- 名称：海市蜃楼又称蜃景：海市蜃楼又称蜃景。；目标 mirage-alias-core、mirage-full；来源 optics/life-optics
- 成因：空气分层中折射，特定条件伴随全反射：蜃景主要由温度、密度不同的空气层使光连续折射形成，不应无条件归为全反射。；目标 mirage-cause-core、mirage-full；来源 optics/life-optics
- 像：物体反射光经大气折射形成虚像：地球上物体反射的光经大气折射形成虚像。；目标 mirage-image-core、mirage-full；来源 optics/life-optics
- 环境：水面、雪原、沙漠或戈壁较常见：平静海面、大江江面、湖面、雪原、沙漠或戈壁是正文所列常见地点。；目标 mirage-locations-core、mirage-full；来源 optics/life-optics

### rainbow-secondary-memory · review

记法：雨滴画面＋内外明暗对照＋相反方位

覆盖：阳光照射雨点，经折射和反射形成拱形七彩光谱。；主虹由外到内为红、橙、黄、绿、蓝、靛、紫。；副虹又称霓，较暗，位于主虹外侧，由阳光在水滴中两次反射形成，色序与主虹相反。；雨后太阳在东则彩虹在西，太阳在西则彩虹在东。

不覆盖：光路作图、大气分层计算和气象预测

- 日光进雨滴，折射反射成虹：阳光照射雨点，经折射和反射形成拱形七彩光谱。；目标 rainbow-cause-core、rainbow-secondary-full；来源 optics/life-optics
- 主虹外红内紫：主虹由外到内为红、橙、黄、绿、蓝、靛、紫。；目标 rainbow-order-core、rainbow-secondary-full；来源 optics/life-optics
- 霓在虹外更暗，两次反射、颜色倒：副虹又称霓，较暗，位于主虹外侧，由阳光在水滴中两次反射形成，色序与主虹相反。；目标 secondary-rainbow-core、rainbow-secondary-full；来源 optics/life-optics
- 太阳在背，虹在对面：雨后太阳在东则彩虹在西，太阳在西则彩虹在东。；目标 rainbow-sun-position-core、rainbow-secondary-full；来源 optics/life-optics

### primary-colors-memory · review

记法：原色集合—两色结果—三色结果三栏对照

覆盖：色光、传统绘画与现代印刷是不同模型，混合结果不得跨模型套用。

不覆盖：色彩空间、印刷模型和定量光谱分析

- 色光原色：红、绿、蓝：光的三原色是红、绿、蓝。；目标 light-primary-colors-core、primary-colors-full；来源 optics/life-optics、optics/life-optics
- 传统绘画教学：红黄蓝：传统绘画入门常用红黄蓝原色模型，现代印刷减色模型常用青品红黄，两者须说明语境。；目标 pigment-primary-colors-core、primary-colors-full；来源 optics/life-optics、optics/life-optics
- 色光叠加：红绿黄、红蓝品、绿蓝青，三色白：红绿光叠加为黄，红蓝为品红，绿蓝为青，红绿蓝叠加为白。；目标 light-color-mixing-core、primary-colors-full；来源 optics/life-optics、optics/life-optics
- 传统颜料混合趋向深暗色：传统红黄蓝模型中红黄可调橙，红蓝可调紫，黄蓝可调绿；多色颜料混合趋向深暗色，实际结果受种类和比例影响。；目标 pigment-color-mixing-core、primary-colors-full；来源 optics/life-optics、optics/life-optics

### object-colors-memory · review

记法：先分透明性，再按透过或反射判断，最后核对白黑与红衣

覆盖：物体外观与材料和入射光共同有关，现实白黑物体不严格全反全吸。

不覆盖：色彩空间、印刷模型和定量光谱分析

- 透明先看透过光：透明物体的颜色由透过它的色光颜色决定。；目标 transparent-color-core、object-colors-full；来源 optics/life-optics
- 不透明改看反射光：不透明物体的颜色由它反射的色光颜色决定。；目标 opaque-color-core、object-colors-full；来源 optics/life-optics
- 白反射较强，黑吸收较强：白色物体对多种可见色光反射较强，黑色物体吸收较强，不表示现实反射或吸收严格为全部。；目标 white-black-opaque-core、object-colors-full；来源 optics/life-optics
- 白光下红衣主要反红：白光下红衣主要反射入射光中的红光，缺少红光的照明下可能显暗，颜色还依赖照明。；目标 red-clothes-core、object-colors-full；来源 optics/life-optics

### q1-modern-treaty-contrast-memory · review

记法：条约首字与高辨识度条款顺序压缩

覆盖：《南京条约》的香港岛、五口、协定关税；《马关条约》的辽台澎与设厂；《辛丑条约》的使馆界与驻兵。

不覆盖：赔款具体数额、签约国家列表和三国干涉还辽后续；三个条约的全部历史影响

- 南港五关税：《南京条约》：割香港岛、开放五口、协定关税。；目标 q1-treaty-quick-recall、q1-treaty-material；来源 late-qing-invasions/treaty-of-nanjing
- 马辽台澎厂：《马关条约》：割辽东半岛、台湾、澎湖列岛，允许在口岸设厂。；目标 q1-treaty-boundary、q1-treaty-material；来源 first-sino-japanese-war/treaty-of-shimonoseki
- 辛馆驻兵：《辛丑条约》：划使馆界、允许驻兵。；目标 q1-treaty-boundary、q1-treaty-material；来源 boxer-rebellion-eight-nation-alliance/boxer-protocol

## 对照覆盖范围

- minor-capacity-comparison（review）：只比较本组三题中的年龄、辨认能力和主要生活来源条件。 不覆盖：不覆盖所有自然人的民事行为能力认定情形。；不据此直接判断某个合同或其他具体行为的效力。；目标 capacity-under-eight、capacity-eight-plus、capacity-labor
- civil-principles-comparison（review）：只对照三项原则的直接表述及本组声明的边界。 不覆盖：不覆盖民法全部基本原则。；不把复杂案例仅凭单个关键词归为某一原则。；目标 civil-equality、civil-voluntary、civil-fairness
- sound-features-comparison（review）：只比较声音三特性的基本对应关系，以及本组三题中的判断条件。 不覆盖：不覆盖传播速度、超声与次声。；不把振幅当成实际听到响度的唯一影响因素，不推导复杂听感。；目标 sound-pitch-timbre-scenario、sound-loudness-condition、sound-timbre
- history-genres-comparison（review）：只对照《史记》《资治通鉴》《汉书》的叙述体例与记述范围，不扩展本组三题的学习目标。 不覆盖：不覆盖作者生平、成书经过、具体篇目和记载年代。；不覆盖国别体、纪事本末体等全部史书体例。；目标 history-three-books-contrast、history-hanshu-genre、history-tongjian

## 精选急救专题

### 声音三特性基础补缺 · review

任务：在一组题内分清音调、响度和音色，并识别响度判断所需的比较条件。

纳入理由：三项概念在同一正文页签并列，适合集中区分。；已有直接题、情境变式和条件题，可形成完整的判断与补缺链路。

覆盖：声音三特性的基础对应关系，以及距离等其他条件相同时振幅与响度的比较。

不覆盖：不覆盖传播速度、超声与次声。；不推导复杂听感，也不把本专题称为高频押题。

完成边界：完成本组只表示已处理本专题 5 道题；答错、揭晓或标记内容进入个人待回顾。

题目：sound-pitch-timbre-scenario、sound-loudness-condition、sound-pitch、sound-loudness、sound-timbre

### 三部史书分类补缺 · review

任务：把叙述体例与记述范围分开判断，再完成《史记》《资治通鉴》《汉书》的配对。

纳入理由：两组分类词回答不同问题，集中对照可减少把它们当成互斥类别。；已有整组对照题和单书直接题，可从综合判断回到具体缺口。

覆盖：三部史书的纪传体或编年体，以及通史或断代史两个分类维度。

不覆盖：不覆盖作者生平、具体篇目、记载年代与成书经过。；不扩展到全部史书体例，也不把本专题称为高频押题。

完成边界：完成本组只表示已处理本专题 5 道题；答错、揭晓或标记内容进入个人待回顾。

题目：history-three-books-contrast、history-hanshu-genre、history-shiji、history-tongjian、history-hanshu


## 尚未编排与全库缺口

主题汇总独立提供 170 小节 / 581 页签。

完整正文可查，但尚未穷举全库原子目标。下一批逐主题扩编，不按入口凑数。

本包未分配入口：问答 0，口诀 0，对照 0。新增内容需显式选择入口。

已停用并保留兼容身份：问答 3，口诀 1。

- microeconomics/demand-factors：轻奢品与收入反向变化的分类表述待核，暂不由本页签派生学习卡。 补充经济学定义依据，并与劣等品、口红效应分别核对。
- microeconomics/demand-income-elasticity：固定恩格尔系数阈值的机构归属与当前适用性待核。 核对统计机构的原始资料；不直接生成联合国固定分档的问答或口诀。
- thermodynamics/phase-change：升华示例中的炒菜最后放盐与机制对应关系待核。 核对教材或科学教育机构解释；暂不选该页签派生卡。
