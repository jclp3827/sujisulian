#!/usr/bin/env python3
"""Validate the expansion-candidate guide in an existing local DevTools session."""
import argparse
import asyncio
import json
import time

from wechat_devtools_mcp.models.schemas import WechatAutomatorInput
from wechat_devtools_mcp.tools.automator import wechat_automator


LEARNING = "subpackages/common-sense/learning/index"
DETAIL = "subpackages/common-sense/detail/index"
CURRENT = "getCurrentPages().slice(-1)[0]"
PREVIEW_KEY = "common-sense-guide-v1:expansion-v1"
GOLDEN_KEY = "common-sense-guide-v1:golden-v1"
FORMAL_KEY = "common-sense-guide-v1"


async def run(port, project):
    checks = []

    started_raw = await wechat_automator(WechatAutomatorInput(
        action="start", auto_port=port, project_path=project
    ))
    started = json.loads(started_raw)
    if not started.get("success") or not started.get("data", {}).get("verified"):
        raise RuntimeError(started.get("message", "DevTools automation did not become ready"))

    async def evaluate(expression):
        raw = await wechat_automator(WechatAutomatorInput(
            action="evaluate", auto_port=port, expression=expression
        ))
        response = json.loads(raw)
        if not response.get("success"):
            raise RuntimeError(response.get("message", "DevTools automation failed"))
        return response["data"]["result"]

    async def statement(code):
        return await evaluate("(function(){" + code + "})()")

    async def wait_page(route):
        started = time.monotonic()
        while time.monotonic() - started < 12:
            state = await statement(
                "const p=" + CURRENT + ";return {route:p.route,ready:Object.keys(p.data).length>2};"
            )
            if state["route"] == route and state["ready"]:
                await asyncio.sleep(0.25)
                return
            await asyncio.sleep(0.15)
        raise RuntimeError("Page did not become ready: " + route)

    async def require(name, condition):
        value = await statement("const p=" + CURRENT + ";return Boolean(" + condition + ");")
        if not value:
            observed = await statement(
                "const p=" + CURRENT + ";return {route:p.route,guidePreview:p.data.guidePreview,"
                "candidatePreview:p.data.candidatePreview,groupId:p.data.guideGroup&&p.data.guideGroup.id,"
                "cardId:p.data.guideCard&&p.data.guideCard.id,index:p.data.index,total:p.data.total,"
                "completed:p.data.completed,notice:p.data.notice};"
            )
            raise AssertionError(name + ": " + json.dumps(observed, ensure_ascii=False))
        checks.append(name)

    async def element_text(selector):
        raw = await wechat_automator(WechatAutomatorInput(
            action="element_info", auto_port=port, selector=selector
        ))
        response = json.loads(raw)
        if not response.get("success"):
            raise AssertionError("Missing rendered element: " + selector)
        return json.dumps(response["data"], ensure_ascii=False)

    environment = await evaluate("wx.getAccountInfoSync().miniProgram.envVersion")
    if environment != "develop":
        raise RuntimeError("Expansion preview is intentionally available only in develop mode")

    keys = [PREVIEW_KEY, GOLDEN_KEY, FORMAL_KEY, "common-sense-learning-v1"]
    has_learning_page = await evaluate(
        "__wxConfig.pages.includes('subpackages/common-sense/learning/index')"
    )
    if not has_learning_page:
        raise RuntimeError("当前自动化会话不含目标学习页，禁止写入测试存储；请核对项目和端口。")
    backup = await statement(
        "const keys=" + json.dumps(keys) + ";const present=wx.getStorageInfoSync().keys;"
        "return keys.map(key=>({key,existed:present.includes(key),value:wx.getStorageSync(key)}));"
    )
    formal_before = await statement(
        "return JSON.stringify(wx.getStorageSync(" + json.dumps(FORMAL_KEY) + ")||null);"
    )
    golden_before = await statement(
        "return JSON.stringify(wx.getStorageSync(" + json.dumps(GOLDEN_KEY) + ")||null);"
    )
    await statement("wx.removeStorageSync(" + json.dumps(PREVIEW_KEY) + ");return true;")

    try:
        url = "/" + LEARNING + "?mode=guide&sample=expansion-v1&groupId=prehistoric-civilization&count=5"
        await evaluate("wx.reLaunch({url:" + json.dumps(url) + "})")
        await wait_page(LEARNING)

        await require(
            "扩库候选开发入口生效",
            "p.data.guidePreview===true && p.data.candidatePreview===true && p.data.title==='知识导读测试'",
        )
        await require(
            "候选总量与停止项准确",
            "p.guideContent.stats.cards===1682 && p.guideContent.stats.holds===0 && p.guideContent.groups.length===170",
        )
        await require(
            "只展示有候选内容的范围",
            "p.data.scopes.length===5 && p.data.scopes[0].id==='all' && p.data.scopes[1].id==='humanities-history' && p.data.scopes[2].id==='science-technology' && p.data.scopes[3].id==='economics' && p.data.scopes[4].id==='law'",
        )
        await require(
            "HOLD 内容不进入可学习题库",
            "p.guideContent.holds.every(h=>!p.guideContent.cardById[h.pointId+'::'+h.id])",
        )
        await require(
            "史前文明按五张开始学习",
            "p.data.guideGroup.id==='prehistoric-civilization' && p.data.total===5 && "
            "p.data.guideCard.id==='prehistoric-civilization::paleolithic-tools-and-fire'",
        )

        banner = await element_text(".preview-note")
        card = await element_text(".guide-card")
        actions = await element_text(".guide-assess-grid")
        if "1682 张候选卡" not in banner or "0 项 HOLD" not in banner or "旧石器时代的工具与用火" not in card:
            raise AssertionError("扩库候选标识或首卡未实际渲染")
        if not all(label in actions for label in ["记住了", "有点模糊", "没想起", "跳过"]):
            raise AssertionError("四档记忆标记未完整渲染")
        checks.extend(["扩库候选标识与知识卡实际渲染", "四档记忆标记实际渲染"])

        first_card = await statement("const p=" + CURRENT + ";return p.data.guideCard.id;")
        await statement(
            "const p=" + CURRENT + ";p.handleGuideAssess({currentTarget:{dataset:{result:'fuzzy'}}});return true;"
        )
        await require(
            "记忆标记推进当前组",
            "p.data.index===2 && p.guideSession.assessments[" + json.dumps(first_card) + "].status==='fuzzy'",
        )
        await require(
            "候选进度写入独立键",
            "!!wx.getStorageSync(" + json.dumps(PREVIEW_KEY) + ").summary",
        )
        formal_after = await statement(
            "return JSON.stringify(wx.getStorageSync(" + json.dumps(FORMAL_KEY) + ")||null);"
        )
        golden_after = await statement(
            "return JSON.stringify(wx.getStorageSync(" + json.dumps(GOLDEN_KEY) + ")||null);"
        )
        if formal_after != formal_before or golden_after != golden_before:
            raise AssertionError("Formal or golden guide progress changed during expansion validation")
        checks.append("正式导读与黄金样例进度保持不变")

        source = await statement(
            "const p=" + CURRENT + ";const c=p.data.guideCard;"
            "p.handleSource({currentTarget:{dataset:{point:c.pointId,tab:c.tabId}}});"
            "return {point:c.pointId,tab:c.tabId,id:c.id};"
        )
        await wait_page(DETAIL)
        await require(
            "查看原文定位到对应正文",
            "p.options.pointId===" + json.dumps(source["point"]) + " && p.data.activeTab===" + json.dumps(source["tab"]),
        )
        await evaluate("wx.navigateBack()")
        await wait_page(LEARNING)
        await require(
            "原文返回保留候选入口与当前进度",
            "p.data.candidatePreview===true && p.data.index===2 && p.data.guideCard.id===" + json.dumps(source["id"]),
        )
        await statement(
            "const p=" + CURRENT + ";p.handleMenu();"
            "p.handleCount({currentTarget:{dataset:{count:10}}});p.handleSaveSettings();return true;"
        )
        await require(
            "保存设置立即刷新候选卡组",
            "p.data.settingsOpen===false && p.data.count===10 && p.guideSession.count===10 && "
            "p.data.notice==='导读卡已按新设置刷新。'",
        )
        formal_after_settings = await statement(
            "return JSON.stringify(wx.getStorageSync(" + json.dumps(FORMAL_KEY) + ")||null);"
        )
        golden_after_settings = await statement(
            "return JSON.stringify(wx.getStorageSync(" + json.dumps(GOLDEN_KEY) + ")||null);"
        )
        if formal_after_settings != formal_before or golden_after_settings != golden_before:
            raise AssertionError("Guide settings refresh changed formal or golden progress")
        checks.append("候选设置刷新仍保持正式与黄金进度隔离")

        sports_url = "/" + LEARNING + "?mode=guide&sample=expansion-v1&groupId=sports&count=5"
        await evaluate("wx.reLaunch({url:" + json.dumps(sports_url) + "})")
        await wait_page(LEARNING)
        await require(
            "第10批体育常识首卡实际渲染",
            "p.data.guideGroup.id==='sports' && p.data.total===5 && "
            "p.data.guideCard.id==='sports::olympic-rings-meaning'",
        )
        sports_card = await element_text(".guide-card")
        if "奥运五环的整体含义" not in sports_card or "不与五大洲逐一对应" not in sports_card:
            raise AssertionError("第10批体育常识首卡内容未实际渲染")

        industry_url = "/" + LEARNING + "?mode=guide&sample=expansion-v1&groupId=industrial-revolutions&count=5"
        await evaluate("wx.reLaunch({url:" + json.dumps(industry_url) + "})")
        await wait_page(LEARNING)
        await require(
            "第11批三次工业革命首卡实际渲染",
            "p.data.guideGroup.id==='industrial-revolutions' && p.data.total===5 && "
            "p.data.guideCard.id==='industrial-revolutions::first-period-place'",
        )
        industry_card = await element_text(".guide-card")
        if "第一次工业革命的时间与范围" not in industry_card or "18世纪60年代" not in industry_card:
            raise AssertionError("第11批三次工业革命首卡内容未实际渲染")

        science_url = "/" + LEARNING + "?mode=guide&sample=expansion-v1&groupId=china-modern-science-awards&count=5"
        await evaluate("wx.reLaunch({url:" + json.dumps(science_url) + "})")
        await wait_page(LEARNING)
        await require(
            "第12批中国现代科技史首卡实际渲染",
            "p.data.guideGroup.id==='china-modern-science-awards' && p.data.total===5 && "
            "p.data.guideCard.id==='china-modern-science-awards::two-bombs-one-satellite-scope'",
        )
        science_card = await element_text(".guide-card")
        if "两弹一星的基本范围" not in science_card or "核弹、导弹和人造地球卫星" not in science_card:
            raise AssertionError("第12批中国现代科技史首卡内容未实际渲染")

        physics_url = "/" + LEARNING + "?mode=guide&sample=expansion-v1&groupId=physics&count=5"
        await evaluate("wx.reLaunch({url:" + json.dumps(physics_url) + "})")
        await wait_page(LEARNING)
        await require(
            "第13批经典力学黄金样例原位晋级",
            "p.data.guideGroup.id==='physics' && p.data.total===5 && "
            "p.data.guideCard.id==='physics::force-three-elements' && p.guideContent.groupById.physics.cardIds.length===23",
        )
        physics_card = await element_text(".guide-card")
        if "力的三要素" not in physics_card or "大小、方向和作用点" not in physics_card:
            raise AssertionError("第13批经典力学晋级首卡未实际渲染")

        chemistry_url = "/" + LEARNING + "?mode=guide&sample=expansion-v1&groupId=chemistry&count=5"
        await evaluate("wx.reLaunch({url:" + json.dumps(chemistry_url) + "})")
        await wait_page(LEARNING)
        await require(
            "第14批物质分类首卡实际渲染",
            "p.data.guideGroup.id==='chemistry' && p.data.total===5 && "
            "p.data.guideCard.id==='chemistry::classification-framework'",
        )
        chemistry_card = await element_text(".guide-card")
        if "物质分类的两级框架" not in chemistry_card or "纯净物和混合物" not in chemistry_card:
            raise AssertionError("第14批物质分类首卡内容未实际渲染")
        biology_url = "/" + LEARNING + "?mode=guide&sample=expansion-v1&groupId=biology-health&count=5"
        await evaluate("wx.reLaunch({url:" + json.dumps(biology_url) + "})")
        await wait_page(LEARNING)
        await require(
            "第15批生物知识首卡实际渲染",
            "p.data.guideGroup.id==='biology-health' && p.data.total===5 && "
            "p.data.guideCard.id==='biology-health::vegetative-organs' && "
            "p.guideContent.groupById['biology-health'].cardIds.length===26",
        )
        biology_card = await element_text(".guide-card")
        if "植物的营养器官" not in biology_card or "根、茎、叶" not in biology_card:
            raise AssertionError("第15批生物首卡内容未实际渲染")
        for group_id, expected_id, title in [
            ("optics", "light-electromagnetic-distance", "光与光年"),
            ("thermodynamics", "sublimation-deposition", "升华与凝华"),
            ("acoustics", "sound-medium", "声音为何不能通过真空"),
            ("physics-other", "ohm-law-conditions", "欧姆定律"),
            ("nonmetal-elements", "carbon-monoxide-concept-0", "一氧化碳（CO）"),
            ("metal-elements", "titanium-concept-0", "钛（Ti）"),
            ("acid-base-salt", "acids-concept-0", "盐酸（HCl）"),
            ("organic-compounds", "natural-gas-concept-0", "天然气"),
            ("chemistry-life", "welding-fume-principle", "焊接烟气"),
            ("human-body", "digestive-tract-glands", "消化道与消化腺"),
            ("biomimetics", "fly-mechanism", "苍蝇复眼与成像"),
            ("emergency-treatment", "first-aid-0", "烫伤"),
            ("pre-qin-poetry", "shijing-anthology", "《诗经》"),
            ("book-records", "shuowen-characters", "《说文解字》"),
            ("science-awards", "national-award-rule", "国家最高科学技术奖"),
            ("new-energy", "energy-classification-dimensions", "能源分类的三个维度"),
            ("land-revolution", "nanchang-1927", "南昌起义"),
            ("anti-japanese-liberation", "september-18-start", "九一八与抗战起点"),
            ("liberation-war", "chongqing-double-tenth", "重庆谈判与《双十协定》"),
            ("new-china-reform", "prc-foundation-1949", "中华人民共和国成立"),
            ("reform-opening-period", "third-plenum-1978-decision", "十一届三中全会"),
            ("revolution-and-may-fourth", "xingzhonghui-1894", "兴中会"),
            ("new-culture-may-fourth", "new-youth-volume-change", "《青年杂志》与《新青年》"),
            ("communist-revolution", "cpc-establishment-conditions", "中国共产党成立的条件"),
            ("national-revolution", "cpc-third-individual-cooperation", "中共三大与合作方式"),
            ("late-qing-invasions", "humen-and-invasion", "虎门销烟与侵华战争"),
            ("taiping-heavenly-kingdom", "jintian-founding-1851", "金田起义"),
            ("second-opium-war", "second-opium-pretexts", "第二次鸦片战争的借口"),
            ("self-strengthening-movement", "self-strengthening-purpose", "洋务运动与代表人物"),
            ("first-sino-japanese-war", "yellow-sea-deng", "黄海海战与邓世昌"),
            ("hundred-days-reform", "gongche-1895", "公车上书"),
            ("boxer-rebellion-eight-nation-alliance", "boxer-movement-and-limits", "义和团运动"),
            ("legendary-xia-shang", "xia-yu-qi", "夏朝与王位世袭"),
            ("qin-han", "qin-unification-government-fall", "秦朝：统一、建制与灭亡"),
            ("pre-industrial-world-science", "thales-ancient-research", "泰勒斯与古希腊自然研究"),
            ("administrative-law-overview", "law", "行政法：规范行政职权行使的法律"),
            ("administrative-license", "license", "行政许可：申请后依法审查准予特定活动"),
            ("administrative-penalty", "penalty", "行政处罚：对行政违法依法惩戒"),
            ("administrative-compulsion", "two-forms", "行政强制：暂时控制与促使履行不同"),
            ("administrative-reconsideration", "review", "行政复议：合法性和适当性复查"),
            ("administrative-litigation", "administrative-litigation-concept", "什么是行政诉讼"),
            ("civil-acts-agency-limitation", "declaration", "民事法律行为：以意思表示改变法律关系"),
            ("civil-rights", "freedom-dignity", "人身自由与人格尊严受民法保护"),
            ("civil-agency", "effect", "代理效果：权限内以被代理人名义实施"),
            ("civil-limitation", "time-defence", "时效届满：义务人可抗辩，法院不主动适用"),
            ("property-contract", "real-rights", "物权：特定物的直接支配权"),
            ("tort-liability", "tort", "侵权行为：侵害权益并依法承担责任"),
            ("criminal-law-effect", "territorial", "属地管辖：行为地或结果地在我国"),
            ("criminal-responsibility-capacity", "defence", "正当防卫：制止正在进行的不法侵害"),
            ("criminal-law-overview", "legality", "罪刑法定：犯罪与处罚须有法律依据"),
            ("criminal-law-general", "crime", "犯罪与一般违法：显著轻微情形的边界"),
            ("intentional-crime-forms", "preparation", "犯罪预备：尚未着手，因外因停止"),
            ("joint-crime", "joint-intent", "共同犯罪：共同故意，不只共同在场"),
            ("criminal-punishment", "punishment", "刑罚：审判机关依法适用的制裁"),
            ("common-crimes", "embezzlement", "贪污：职务便利与公共财物非法占有"),
            ("contract-formation", "formation", "要约承诺与合同成立"),
            ("contract-code-revisions", "electronic-form", "电子数据符合条件可视为书面形式"),
            ("contract-breach-liability", "breach", "违约责任：按条件选择承担方式"),
            ("personality-rights-part", "life-body-health", "生命、身体与健康分别保护什么"),
            ("invalid-marriage", "grounds", "无效婚姻的三类法定情形"),
            ("revocable-marriage", "coercion", "受胁迫结婚：向法院请求撤销"),
            ("divorce-rules", "agreement", "协议离婚：书面协议与本人申请"),
            ("inheritance-concept", "inheritance", "继承：死者个人合法财产的转移"),
            ("inheritance-methods", "first-order", "第一顺序：配偶、子女与父母"),
            ("tort-attribution", "fault", "过错责任：过错侵害权益并造成损害"),
            ("civil-subjects", "natural-person", "自然人：具有民事主体资格的人"),
            ("legal-person", "organization", "法人：依法独立承担权利义务的组织"),
            ("civil-act-effect", "valid", "有效行为的三个基本条件"),
            ("civil-agency-authority", "basis", "委托代理与法定代理的依据不同"),
            ("unauthorized-agency", "three-types", "无权代理的三种常见情形"),
            ("civil-limitation-types", "ordinary", "一般诉讼时效：三年与法定例外"),
            ("civil-property-rights", "equal-protection", "财产权利平等保护"),
            ("ownership-rights", "powers", "所有权：占有、使用、收益与处分"),
            ("usufruct-rights", "usufruct", "用益物权：依法利用他人财产"),
            ("security-rights", "security", "担保物权：以特定财产担保债权"),
            ("political-system", "state-government", "国体与政体回答不同问题"),
            ("economic-system", "public-ownership", "公有制为主体的经济制度"),
            ("state-institutions-overview", "different-organs", "国家机构不都属于行政机关"),
            ("state-organs", "npc-position", "全国人大：最高国家权力机关"),
            ("state-president-judiciary-supervision", "president-eligibility", "国家主席：任职资格与任期"),
            ("state-council", "council-position", "国务院：最高国家行政机关"),
            ("central-military-commission", "military-leadership", "中央军委领导全国武装力量"),
            ("judicial-system", "adjudication", "人民法院：国家审判机关"),
            ("national-supervisory-commission", "highest-supervision", "国家监委：最高监察机关"),
            ("citizen-constitutional-rights", "equality", "法律面前平等与合理差别"),
            ("civil-code-general-persons", "civil-scope", "民法调整哪些法律关系"),
            ("civil-basic-principles", "principle-1", "平等原则"),
            ("constitution-concept-features", "fundamental-law", "宪法：国家根本法"),
            ("constitution-basic-principles", "people-power", "人民主权：一切权力属于人民"),
            ("constitution-structure", "structure", "现行宪法：序言和正文"),
            ("constitution-history", "common-program", "共同纲领与四部宪法"),
            ("industrial-policy", "policy-object", "产业政策的对象"),
            ("income-distribution-policy", "distribution-policy", "收入政策关注水平与差距"),
            ("international-trade", "imports-exports", "国际贸易：货物和服务进出口"),
            ("exchange-rate-system", "exchange-price", "汇率是两种货币的价格"),
            ("exchange-rate-quotation", "direct-quote", "直接标价：固定外币单位"),
            ("exchange-rate-effects", "import-cost", "外币定价进口的本币成本"),
            ("imf", "core-functions", "IMF：监督、融资与能力建设"),
            ("world-bank", "bank-composition", "世界银行：IBRD与IDA"),
            ("wto", "trade-rules", "WTO：以成员协议为基础的贸易规则"),
            ("economic-effects", "ratchet", "棘轮效应：消费向下调整较难"),
            ("economic-terms", "nash", "纳什均衡：给定他人策略"),
            ("monetary-policy", "central-bank", "中央银行：制定执行货币政策"),
            ("fiscal-policy", "policy-instruments", "财政政策由谁用什么工具实施"),
            ("macro-control-goals-overview", "four-macro-goals", "宏观调控的四项主要目标"),
            ("economic-growth", "real-output-growth", "经济增长与名义金额增加不同"),
            ("full-employment", "survey-unemployment", "调查失业人口的三个条件"),
            ("stable-prices", "inflation-level", "通胀：一般价格水平持续上涨"),
            ("balance-of-payments", "bop-accounts", "国际收支记录哪些交易"),
            ("macro-control-measures", "economic-incentives", "宏观调控的经济手段"),
            ("market-failure-meaning", "allocation-efficiency", "市场失灵：资源配置效率受损"),
            ("market-failure-factors", "four-factors", "市场失灵的四类主要因素"),
            ("market-economy", "scarcity-allocation", "资源稀缺与资源配置"),
            ("planned-allocation", "planned-definition", "计划配置是什么"),
            ("market-allocation", "market-definition", "市场配置是什么"),
            ("market-definition-elements", "exchange-relations", "市场不只是交易场所"),
            ("enterprise-organization", "enterprise-definition", "企业的基本特征"),
            ("market-system-composition", "system-classification", "市场体系的基本分类"),
            ("market-economy-meaning", "market-oriented-economy", "市场经济的含义"),
            ("market-economy-laws", "socially-necessary-labor", "价值规律：社会必要劳动时间"),
            ("market-economy-features", "clear-property", "产权明确为什么重要"),
            ("socialist-market-economy", "market-government-role", "社会主义市场经济中的政府与市场"),
            ("supply-theory", "supply-definition", "供给的含义"),
            ("supply-demand-equilibrium", "equilibrium-price-quantity", "均衡价格与均衡数量"),
            ("supply-demand-law", "price-pressure", "供求失衡与价格压力"),
            ("microeconomics", "demand-definition", "需求：愿意且能够购买"),
            ("market-structure-overview", "four-market-structures", "四类市场结构"),
            ("perfect-competition-market", "price-taker", "完全竞争厂商为何接受价格"),
            ("monopolistic-competition-market", "differentiation", "垄断竞争：有差别的替代品"),
            ("oligopoly-market", "few-major-firms", "寡头垄断的含义"),
            ("monopoly-market", "monopoly-conditions", "完全垄断的识别条件"),
            ("communication-technology", "five-g-generation", "5G：第五代蜂窝移动通信"),
            ("information-tech", "hardware-software", "计算机系统：硬件与软件"),
            ("information-technology-applications", "big-data-challenge", "大数据：规模与处理挑战"),
            ("change-lunar-probes", "ce1-orbiter-image", "嫦娥一号：绕月与全月影像"),
            ("space-tech", "shenzhou-crewed", "神舟：载人天地往返"),
            ("current-main-energy", "fission-definition", "核裂变释放能量"),
            ("shenzhou-spacecraft", "sz5", "神舟五号：首次载人飞行"),
            ("satellite-launch-centers", "jiuquan", "酒泉卫星发射中心"),
            ("life-safety", "selection-criteria", "选择灭火器先看什么"),
            ("safety-common-sense", "pan-fire-cover", "油锅初起火灾的隔氧原理"),
            ("biotech-new-energy", "biotechnology-fields", "生物技术的四类代表工程"),
        ]:
            url = "/" + LEARNING + "?mode=guide&sample=expansion-v1&groupId=" + group_id + "&count=5"
            await evaluate("wx.reLaunch({url:" + json.dumps(url) + "})")
            await wait_page(LEARNING)
            await require(
                "新增知识组首卡渲染：" + group_id,
                "p.data.guideGroup.id===" + json.dumps(group_id) + " && p.data.guideCard.id===" + json.dumps(group_id + "::" + expected_id),
            )
            rendered = await element_text(".guide-card")
            if title not in rendered:
                raise AssertionError("新增知识组内容未实际渲染：" + group_id)
            if group_id == "change-lunar-probes":
                await statement(
                    "const p=" + CURRENT + ";const c=p.data.guideCard;"
                    "p.handleSource({currentTarget:{dataset:{point:c.pointId,tab:c.tabId}}});return true;"
                )
                await wait_page(DETAIL)
                await require(
                    "探月候选原文定位至纠正表格",
                    "p.options.pointId==='change-lunar-probes' && p.data.activeTab==='change-probes-table' && JSON.stringify(p.data).includes('2019')",
                )
                await evaluate("wx.navigateBack()")
                await wait_page(LEARNING)
                await require(
                    "探月原文返回保持候选卡与进度",
                    "p.data.guideCard.id==='change-lunar-probes::ce1-orbiter-image' && p.data.index===1 && p.data.candidatePreview===true",
                )

        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=guide&sample=expansion-v1&groupId=information-tech&count=10'})")
        await wait_page(LEARNING)
        await statement(
            "const p=" + CURRENT + ";for(let i=0;i<7;i++)p.handleGuideAssess({currentTarget:{dataset:{result:'skipped'}}});"
            "const c=p.data.guideCard;if(c.id!=='information-tech::decimal-binary-prefixes')throw new Error('容量卡位置不符');"
            "p.handleSource({currentTarget:{dataset:{point:c.pointId,tab:c.tabId}}});return true;"
        )
        await wait_page(DETAIL)
        await require(
            "容量单位卡原文定位与纠正表述一致",
            "p.options.pointId==='information-tech' && p.data.activeTab==='computer-concepts' && JSON.stringify(p.data).includes('1GiB=1024MiB')",
        )
        await evaluate("wx.navigateBack()")
        await wait_page(LEARNING)
        await require(
            "容量单位原文返回保持第八张卡",
            "p.data.guideCard.id==='information-tech::decimal-binary-prefixes' && p.data.index===8 && p.data.candidatePreview===true",
        )

        for point_id, required, forbidden in [
            ("optics", "现代印刷减色模型", "颜料的三原色是红、黄、蓝"),
            ("thermodynamics", "食盐烹调中不以升华解释", "樟脑丸消失、炒菜要最后放盐"),
            ("acoustics", "强次声暴露可能", "对人体有很强的伤害性"),
            ("physics-other", "温度等物理条件保持不变", "在同一电路中，通过某一导体"),
            ("nonmetal-elements", "平流层臭氧", "雷雨之后的空气使人感到特别舒服"),
            ("metal-elements", "铜锡", "纯铜加入锌与镍以外"),
            ("acid-base-salt", "混悬制剂", "即硫酸钡溶液"),
            ("organic-compounds", "笼状晶格", "全球储量足够人类使用1000年"),
            ("chemistry-life", "多酚", "唯一可微波加热"),
            ("human-body", "血友病主要涉及凝血因子缺陷", "是人体内唯一降低血糖"),
            ("biomimetics", "电磁雷达波", "抗荷服（宇航服）"),
            ("emergency-treatment", "5次背部拍击", "挤压出血，并于咬伤当天"),
            ("pre-qin-poetry", "应玚", "阮瑀、应旸、刘桢"),
            ("book-records", "姚广孝", "世界上第一部字典"),
            ("science-awards", "2001年获颁", "2019年对奖金进行调整"),
            ("new-energy", "液化石油气", "如焦炭、蒸汽、液化气"),
            ("land-revolution", "是在后来3月苟坝一带形成", "1935年初召开遵义会议，成立由毛泽东"),
            ("anti-japanese-liberation", "九一八事变，日本侵占中国东北", "整个中日战争中进行的规模最大、战斗最惨烈"),
            ("liberation-war", "4月20日夜", "1949年4月21日，中国人民解放军发起"),
            ("new-china-reform", "这是恢复中国代表权", "2025年是抗美援朝爆发75周年"),
            ("reform-opening-period", "区别于1949年七届二中全会", "十一三中经济改"),
            ("revolution-and-may-fourth", "1915年底蔡锷", "1914年，袁世凯签订二十一条"),
            ("new-culture-may-fourth", "第二卷起改名", "第二期改名《新青年》"),
            ("communist-revolution", "13名中国代表", "不属于党代表"),
            ("national-revolution", "汪精卫在武汉", "并在南京建立“国民政府”"),
            ("late-qing-invasions", "英国以中国禁烟为借口", "是鸦片战争爆发的导火索（直接原因）"),
            ("taiping-heavenly-kingdom", "平均分田等方案", "政策具有空想性，最后没有实现"),
            ("second-opium-war", "不是各国共同参加的一份多边条约", "结果：清政府又陆续与英法签订了"),
            ("self-strengthening-movement", "北洋、南洋、福建、广东", "80年代中期初步建成北洋、南洋、福建三支海军"),
            ("first-sino-japanese-war", "不是台湾与澎湖同时归还", "黄海制海权丧失。"),
            ("hundred-days-reform", "国立综合性大学", "中国近代第一所国立大学，中国近代国立高等教育的开端"),
            ("boxer-rebellion-eight-nation-alliance", "不把跨地区运动简化为一人", "义和团运动是赵三多在冠县"),
            ("legendary-xia-shang", "大宗小宗随宗族层级具有相对性", "王位和财产由嫡长子继承"),
            ("qin-han", "赵过推广代田法", "创造“耦犁”"),
            ("pre-industrial-world-science", "改进已有望远镜", "发明人类历史上第一台天文望远镜"),
            ("administrative-license", "不是所有日常活动都先被禁止", "实质上是一种禁止的解除"),
            ("administrative-penalty", "5个工作日", "告知后5日内申请"),
            ("administrative-compulsion", "强制执行由法律设定", "对相对人的人身、财产和行为采取强制性措施"),
            ("administrative-litigation", "机关应依职权主动履职", "应提供曾向被告提出申请的证据"),
            ("administrative-litigation", "此处实为行政起诉期限", "收到复议决定书之日起15日内。"),
            ("criminal-law-general", "罪行、严重后果、恶劣情节与最高检核准须同时核对", "犯故意杀人罪，或者故意伤害罪致人死亡"),
            ("criminal-responsibility-capacity", "两个过当条件须同时具备", "未明显超过必要限度并造成重大损害"),
            ("joint-crime", "较为固定的犯罪组织", "特殊共犯即犯罪集团"),
            ("criminal-punishment", "罚款须按法律依据识别", "罚款是行政处罚"),
            ("common-crimes", "或者多次抢夺", "乘人不备，公开夺取数额较大"),
            ("civil-agency", "民事代理概述", "完整还原代理适用边界"),
            ("contract-formation", "两类迟到的默认效果不同", "超过承诺期限到达的承诺通常为新要约"),
            ("inheritance-methods", "仍须依法判断遗嘱效力", "最后所立遗嘱效力最大"),
            ("tort-attribution", "不能只凭双方无过错", "仅在法律规定情形下依实际情况分担损失，并非一般归责原则"),
            ("civil-subjects", "不得以未经本人同意为由主张收养无效", "收养人与被收养人同意除外"),
            ("unauthorized-agency", "不知道行为人行为时没有代理权", "不知道或不应当知道"),
            ("ownership-rights", "继受取得以他人的既存权利为基础", "继承等可依法律规定直接取得"),
            ("constitution-basic-principles", "不意味着此前宪法序言没有规定", "生存发展权和依法治国分别于2004"),
            ("constitution-structure", "2004年以前始终只是代国歌", "之前都是代国歌"),
            ("industrial-policy", "开采专业及辅助性活动", "第三产业，指不生产物质产品"),
            ("income-distribution-policy", "经验警戒参考", "1943年美国经济学家"),
            ("international-trade", "统计范围", "贸易顺差（出超）＝出口额＞进口额。"),
            ("exchange-rate-system", "维持机制", "指由政府制定和公布，并只能在一定幅度内波动的汇率。"),
            ("exchange-rate-quotation", "观察者的本币", "也称为“外币汇率”"),
            ("exchange-rate-effects", "不能单推外流", "进口受抑"),
            ("imf", "能力建设", "监察货币汇率和各国贸易情况"),
            ("world-bank", "市场融资", "世界银行是国际复兴开发银行（IBRD）的通称"),
            ("wto", "成员共同商定", "负责管理世界经济和贸易秩序"),
            ("economic-effects", "技术及部分投入固定", "不可逆性"),
            ("economic-terms", "供给冲击", "长期无效"),
            ("monetary-policy", "未来改革意向不代表已经实施", "它统筹管理全国金融活动"),
            ("fiscal-policy", "相机抉择", "财政政策被称为“自动稳定器”"),
            ("economic-growth", "自有住房服务", "自给自足生产等非市场活动不计入GDP"),
            ("full-employment", "就业人口与失业人口之和", "自然失业率维持在5%左右"),
            ("stable-prices", "工业生产者出厂价格指数PPI", "CPI涨幅＜1%是通货紧缩"),
            ("balance-of-payments", "表内平衡不等于不存在外部失衡", "国际收支净额即净出口与净资本流出的差额为零"),
            ("market-failure-factors", "边际是每增加一单位活动", "信息不对称，又称信息不完全"),
            ("enterprise-organization", "1人以上200人以下发起人", "common-sense/partnership-liability.png"),
            ("market-definition-elements", "消费者购买商品或服务不以营利", "共同的特征是盈利性"),
            ("socialist-market-economy", "更好发挥政府作用", "能够实现效率与公平的经济体制"),
            ("supply-demand-equilibrium", "才构成约束", "最高限价一般低于市场的均衡价格"),
            ("microeconomics", "分母不是总收入", "即恩格尔定律。"),
            ("oligopoly-market", "联合定价不属于相互价格竞争", "并非打价格战"),
            ("communication-technology", "2019年6月6日", "是最新一代蜂窝移动通信技术"),
            ("information-tech", "1GiB=1024MiB", "1GB=1024MB（兆）"),
            ("information-technology-applications", "数据质量", "特点：容量大、类型多、速度快、精度准、价值高"),
            ("change-lunar-probes", "2026年8月23日", "2018年首次实现月背软着陆"),
            ("current-main-energy", "受控聚变研究", "聚变尚不受控"),
            ("life-safety", "ABC", "因为火苗内焰温度低"),
            ("safety-common-sense", "无反应且无正常呼吸", "对昏迷者进行人工呼吸"),
        ]:
            url = "/" + DETAIL + "?moduleId=common-sense&pointId=" + point_id
            await evaluate("wx.reLaunch({url:" + json.dumps(url) + "})")
            await wait_page(DETAIL)
            await require(
                "正文纠正已加载：" + point_id,
                "p.options.pointId===" + json.dumps(point_id) + " && JSON.stringify(p.data).includes(" + json.dumps(required) + ") && !JSON.stringify(p.data).includes(" + json.dumps(forbidden) + ")",
            )
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=qa&scope=economics&groupId=resource-allocation-market&count=5'})")
        await wait_page(LEARNING)
        await require(
            "关联旧题复核后恢复可用且数量正确",
            "p.content.questions.length===603 && p.content.questions.some(q=>q.id==='market-order-rules' && q.options[q.answer].includes('准入'))",
        )
        await require(
            "关联题解释已加载纠正后的百分比与信息定义",
            "p.content.questions.find(q=>q.id==='demand-price-elasticity').explanation.includes('百分比') && !p.content.questions.find(q=>q.id==='information-asymmetry-definition').explanation.includes('又称信息不完全')",
        )
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=guide&sample=expansion-v1&groupId=market-failure-factors&count=10'})")
        await wait_page(LEARNING)
        await statement(
            "const p=" + CURRENT + ";for(let i=0;i<6;i++)p.handleGuideAssess({currentTarget:{dataset:{result:'skipped'}}});"
            "const c=p.data.guideCard;if(c.id!=='market-failure-factors::private-social-margin')throw new Error('外部性卡位置不符');"
            "p.handleSource({currentTarget:{dataset:{point:c.pointId,tab:c.tabId}}});return true;"
        )
        await wait_page(DETAIL)
        await require(
            "第24批外部性原文定位到修正后的边际条件",
            "p.options.pointId==='market-failure-factors' && p.data.activeTab==='market-failure-externality' && JSON.stringify(p.data).includes('边际是每增加一单位活动')",
        )
        await evaluate("wx.navigateBack()")
        await wait_page(LEARNING)
        await require(
            "第24批原文返回保留第七张卡与候选身份",
            "p.data.guideCard.id==='market-failure-factors::private-social-margin' && p.data.index===7 && p.data.candidatePreview===true",
        )
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=qa&scope=economics&groupId=balance-of-payments-core&count=5'})")
        await wait_page(LEARNING)
        await require(
            "第25批宏观关联题的统计与账户条件已加载",
            "p.content.questions.length===603 && p.content.questions.find(q=>q.id==='unemployment-rate').options[0].includes('就业人口加失业人口') && p.content.questions.find(q=>q.id==='bop-balance').options[0].includes('不能')",
        )
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=qa&scope=economics&groupId=fiscal-policy-core&count=5'})")
        await wait_page(LEARNING)
        await require(
            "第26批财政关联题预算和政策条件已加载",
            "p.content.questions.length===603 && p.content.questions.find(q=>q.id==='fiscal-income-components').options[0].includes('不能') && p.content.questions.find(q=>q.id==='fiscal-policy-direction').explanation.includes('不能仅按发行量')",
        )
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=guide&sample=expansion-v1&groupId=fiscal-policy&count=10'})")
        await wait_page(LEARNING)
        await statement(
            "const p=" + CURRENT + ";for(let i=0;i<5;i++)p.handleGuideAssess({currentTarget:{dataset:{result:'skipped'}}});"
            "const c=p.data.guideCard;if(c.id!=='fiscal-policy::income-financing')throw new Error('财政口径卡位置不符');"
            "p.handleSource({currentTarget:{dataset:{point:c.pointId,tab:c.tabId}}});return true;"
        )
        await wait_page(DETAIL)
        await require(
            "第26批财政卡原文定位到收入融资边界",
            "p.options.pointId==='fiscal-policy' && p.data.activeTab==='fiscal-income' && JSON.stringify(p.data).includes('债务融资')",
        )
        await evaluate("wx.navigateBack()")
        await wait_page(LEARNING)
        await require(
            "第26批原文返回保留第六张卡和候选身份",
            "p.data.guideCard.id==='fiscal-policy::income-financing' && p.data.index===6 && p.data.candidatePreview===true",
        )
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=qa&scope=economics&groupId=monetary-policy-core&count=5'})")
        await wait_page(LEARNING)
        await require(
            "第27批货币关联题工具配合条件已加载",
            "p.content.questions.length===603 && p.content.questions.find(q=>q.id==='monetary-expansion').explanation.includes('不要求各工具每次同时调整') && p.content.questions.find(q=>q.id==='monetary-full').options[0].includes('不必每次同时同幅')",
        )
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=guide&sample=expansion-v1&groupId=monetary-policy&count=10'})")
        await wait_page(LEARNING)
        await statement(
            "const p=" + CURRENT + ";for(let i=0;i<8;i++)p.handleGuideAssess({currentTarget:{dataset:{result:'skipped'}}});"
            "const c=p.data.guideCard;if(c.id!=='monetary-policy::policy-definition')throw new Error('货币定义卡位置不符');"
            "p.handleSource({currentTarget:{dataset:{point:c.pointId,tab:c.tabId}}});return true;"
        )
        await wait_page(DETAIL)
        await require(
            "第27批货币定义卡原文定位到数量与利率渠道",
            "p.options.pointId==='monetary-policy' && p.data.activeTab==='monetary-definition' && JSON.stringify(p.data).includes('利率等金融条件')",
        )
        await evaluate("wx.navigateBack()")
        await wait_page(LEARNING)
        await require(
            "第27批原文返回保留第九张卡及候选身份",
            "p.data.guideCard.id==='monetary-policy::policy-definition' && p.data.index===9 && p.data.candidatePreview===true",
        )
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=qa&scope=economics&groupId=industrial-structure-core&count=5'})")
        await wait_page(LEARNING)
        await require("第28批产业分类例外已加载", "p.data.total>0 && p.content.questions.length===603 && p.content.questions.find(q=>q.id==='primary-industry').explanation.includes('辅助性活动') && p.content.questions.find(q=>q.id==='tertiary-industry').boundary.includes('经济价值')")
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=qa&scope=economics&groupId=exchange-rate-system-core&count=5'})")
        await wait_page(LEARNING)
        await require("第29批汇率制度与条件已加载", "p.data.total>0 && p.content.questions.length===603 && p.content.questions.find(q=>q.id==='fixed-rate-system').explanation.includes('平价或区间') && p.content.questions.find(q=>q.id==='rate-capital-effect').explanation.includes('不能')")
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=qa&scope=economics&groupId=economic-effects-behavior&count=5'})")
        await wait_page(LEARNING)
        await require("第31批经济模型条件已加载", "p.data.total>0 && p.content.questions.length===603 && p.content.questions.find(q=>q.id==='effect-scale').explanation.includes('长期') && p.content.questions.find(q=>q.id==='effect-substitution').explanation.includes('补偿')")
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=guide&sample=expansion-v1&groupId=income-distribution-policy&count=10'})")
        await wait_page(LEARNING)
        await statement("const p=" + CURRENT + ";for(let i=0;i<6;i++)p.handleGuideAssess({currentTarget:{dataset:{result:'skipped'}}});const c=p.data.guideCard;if(c.id!=='income-distribution-policy::gini-direction')throw new Error('候选位置错误');p.handleSource({currentTarget:{dataset:{point:c.pointId,tab:c.tabId}}});return true;")
        await wait_page(DETAIL)
        await require("第28批基尼原文定位正确", "p.options.pointId==='income-distribution-policy' && p.data.activeTab==='income-gini' && JSON.stringify(p.data).includes('经验警戒参考')")
        await evaluate("wx.navigateBack()")
        await wait_page(LEARNING)
        await require("第28批基尼原文返回保留卡片与候选身份", "p.data.guideCard.id==='income-distribution-policy::gini-direction' && p.data.index===7 && p.data.candidatePreview===true")
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=guide&sample=expansion-v1&groupId=exchange-rate-effects&count=5'})")
        await wait_page(LEARNING)
        await statement("const p=" + CURRENT + ";for(let i=0;i<0;i++)p.handleGuideAssess({currentTarget:{dataset:{result:'skipped'}}});const c=p.data.guideCard;if(c.id!=='exchange-rate-effects::import-cost')throw new Error('候选位置错误');p.handleSource({currentTarget:{dataset:{point:c.pointId,tab:c.tabId}}});return true;")
        await wait_page(DETAIL)
        await require("第29批汇率原文定位正确", "p.options.pointId==='exchange-rate-effects' && p.data.activeTab==='exchange-rate-effects' && JSON.stringify(p.data).includes('未对冲')")
        await evaluate("wx.navigateBack()")
        await wait_page(LEARNING)
        await require("第29批汇率原文返回保留卡片与候选身份", "p.data.guideCard.id==='exchange-rate-effects::import-cost' && p.data.index===1 && p.data.candidatePreview===true")
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=guide&sample=expansion-v1&groupId=economic-effects&count=5'})")
        await wait_page(LEARNING)
        await statement("const p=" + CURRENT + ";for(let i=0;i<3;i++)p.handleGuideAssess({currentTarget:{dataset:{result:'skipped'}}});const c=p.data.guideCard;if(c.id!=='economic-effects::marginal-versus-total')throw new Error('候选位置错误');p.handleSource({currentTarget:{dataset:{point:c.pointId,tab:c.tabId}}});return true;")
        await wait_page(DETAIL)
        await require("第31批边际原文定位正确", "p.options.pointId==='economic-effects' && p.data.activeTab==='effect-marginal' && JSON.stringify(p.data).includes('只要新增产出仍为正')")
        await evaluate("wx.navigateBack()")
        await wait_page(LEARNING)
        await require("第31批边际原文返回保留卡片与候选身份", "p.data.guideCard.id==='economic-effects::marginal-versus-total' && p.data.index===4 && p.data.candidatePreview===true")
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=qa&scope=law&groupId=constitution-chapters&count=5'})")
        await wait_page(LEARNING)
        await require("第32批既有宪法章序题仍有效", "p.data.total===3 && p.content.questions.length===603 && p.content.questions.some(q=>q.id==='constitution-second' && q.options[q.answer]==='第二章')")
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=guide&sample=expansion-v1&groupId=constitution-structure&count=5'})")
        await wait_page(LEARNING)
        await statement("const p=" + CURRENT + ";for(let i=0;i<2;i++)p.handleGuideAssess({currentTarget:{dataset:{result:'skipped'}}});const c=p.data.guideCard;if(c.id!=='constitution-structure::anthem')throw new Error('国歌卡位置错误');p.handleSource({currentTarget:{dataset:{point:c.pointId,tab:c.tabId}}});return true;")
        await wait_page(DETAIL)
        await require("第32批国歌卡原文定位正确", "p.options.pointId==='constitution-structure' && p.data.activeTab==='constitution-symbols' && JSON.stringify(p.data).includes('1982年全国人大')")
        await evaluate("wx.navigateBack()")
        await wait_page(LEARNING)
        await require("第32批原文返回保留第三张卡及候选身份", "p.data.guideCard.id==='constitution-structure::anthem' && p.data.index===3 && p.data.candidatePreview===true")
        await require("15张黄金卡在扩库包中均保留原ID", "[\"legendary-xia-shang::pre-qin-agriculture-and-bronze\",\"legendary-xia-shang::pre-qin-water-projects\",\"qin-han::qin-unification-government-fall\",\"qin-han::western-han-foundation-centralization\",\"physics::force-three-elements\",\"physics::newton-first-law-inertia\",\"physics::newton-second-law\",\"physics::newton-third-law\",\"physics::friction-force\",\"pre-industrial-world-science::archimedes-achievements\",\"pre-industrial-world-science::copernicus-heliocentrism\",\"pre-industrial-world-science::newton-classical-mechanics\",\"exchange-rate-effects::exchange-rate-trade-direction\",\"administrative-litigation::administrative-litigation-concept\",\"administrative-litigation::administrative-litigation-burden-of-proof\"].every(id=>Boolean(p.guideContent.cardById[id]))")
        await require("黄金举证卡原ID晋级并显示法定例外", "p.guideContent.cardById['administrative-litigation::administrative-litigation-burden-of-proof'].content.includes('原则上') && p.guideContent.cardById['administrative-litigation::administrative-litigation-burden-of-proof'].content.includes('除外')")
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=guide&sample=expansion-v1&groupId=exchange-rate-effects&count=10'})")
        await wait_page(LEARNING)
        await statement("const p=" + CURRENT + ";for(let i=0;i<8;i++)p.handleGuideAssess({currentTarget:{dataset:{result:'skipped'}}});return true;")
        await require("汇率黄金卡保留原ID并明确计价及数量条件", "p.data.total===9 && p.data.guideCard.id==='exchange-rate-effects::exchange-rate-trade-direction' && p.data.guideCard.content.includes('其他条件不变') && p.data.guideCard.content.includes('供求弹性')")
        await statement("const p=" + CURRENT + ";const c=p.data.guideCard;p.handleSource({currentTarget:{dataset:{point:c.pointId,tab:c.tabId}}});return true;")
        await wait_page(DETAIL)
        await require("汇率晋级卡定位到已修正原文", "p.options.pointId==='exchange-rate-effects' && p.data.activeTab==='exchange-rate-effects' && JSON.stringify(p.data).includes('未对冲')")
        await evaluate("wx.navigateBack()")
        await wait_page(LEARNING)
        await require("汇率晋级卡原文返回仍为原ID第九张", "p.data.guideCard.id==='exchange-rate-effects::exchange-rate-trade-direction' && p.data.index===9 && p.data.candidatePreview===true")
        await evaluate("wx.reLaunch({url:'/' + " + json.dumps(LEARNING) + " + '?mode=guide&sample=expansion-v1&groupId=constitution-basic-principles&count=5'})")
        await wait_page(LEARNING)
    finally:
        try:
            await evaluate("wx.reLaunch({url:'/pages/common-sense/index'})")
            await wait_page("pages/common-sense/index")
        finally:
            await statement(
                "const backup=" + json.dumps(backup, ensure_ascii=False) + ";"
                "backup.forEach(v=>v.existed?wx.setStorageSync(v.key,v.value):wx.removeStorageSync(v.key));"
                "const present=wx.getStorageInfoSync().keys;"
                "if(!backup.every(v=>v.existed?present.includes(v.key)&&JSON.stringify(wx.getStorageSync(v.key))===JSON.stringify(v.value):!present.includes(v.key)))throw new Error('测试存储恢复核对失败');return true;"
            )

    checks.append("退出测试学习页面后，四个存储键已按备份恢复并核对")
    return {
        "checks": checks,
        "count": len(checks),
        "activeRouteAfterRestore": "pages/common-sense/index",
        "route": "/" + LEARNING + "?mode=guide&sample=expansion-v1&groupId=constitution-basic-principles&count=5",
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, required=True)
    parser.add_argument("--project", required=True)
    args = parser.parse_args()
    print(json.dumps(asyncio.run(run(args.port, args.project)), ensure_ascii=False, indent=2))

