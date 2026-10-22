#!/usr/bin/env python3
"""Read/operate an already connected LOCAL developer-tools window.

Run with the existing wechat-devtools-mcp Python environment and an isolated
automation port. Uses only the two common-sense storage keys and restores them.
Does not open projects, upload, subscribe, send notifications or accept device UX.
"""
import argparse
import asyncio
import json
import time
from wechat_devtools_mcp.tools.automator import wechat_automator
from wechat_devtools_mcp.models.schemas import WechatAutomatorInput

HOME = "pages/common-sense/index"
LEARNING = "subpackages/common-sense/learning/index"
DETAIL = "subpackages/common-sense/detail/index"
TOPICS = "subpackages/common-sense/topics/index"
SEARCH = "subpackages/common-sense/search/index"
CURRENT = "getCurrentPages().slice(-1)[0]"

async def run(port):
    checks = []
    layouts = []
    restored = False
    async def evaluate(code):
        try:
            raw = await wechat_automator(WechatAutomatorInput(
                action="evaluate", auto_port=port, expression=code))
        except Exception as exc:
            raise RuntimeError(str(exc) + " | expression: " + code[:180]) from exc
        response = json.loads(raw)
        if not response.get("success"):
            raise RuntimeError(response.get("message", "Automator failed") + " | expression: " + code[:180])
        return response["data"]["result"]

    async def statement(code):
        return await evaluate("(function(){" + code + "})()")

    async def wait_page(path):
        started = time.monotonic()
        while time.monotonic() - started < 12:
            state = await statement("const p=" + CURRENT + ";return {path:p.route,ready:Object.keys(p.data).length>2};")
            if state["path"] == path and state["ready"]:
                await asyncio.sleep(0.2)
                return
            await asyncio.sleep(0.15)
        raise RuntimeError("Page did not become ready: " + path)

    async def home():
        await evaluate("wx.switchTab({url:'/" + HOME + "'})")
        await wait_page(HOME)

    async def go(path, query=""):
        await evaluate("wx.navigateTo({url:" + json.dumps("/" + path + query) + "})")
        await wait_page(path)

    async def back(path):
        await evaluate("wx.navigateBack()")
        await wait_page(path)

    async def tap(selector):
        started = time.monotonic()
        while time.monotonic() - started < 3:
            response = json.loads(await wechat_automator(WechatAutomatorInput(
                action="tap", auto_port=port, selector=selector)))
            if response.get("success"):
                return
            if "未找到元素" not in response.get("message", ""):
                break
            await asyncio.sleep(0.15)
        raise RuntimeError("Could not tap " + selector + ": " + response.get("message", ""))

    async def check(name, condition):
        started = time.monotonic()
        while time.monotonic() - started < 3:
            if await statement("const p=" + CURRENT + ";return Boolean(" + condition + ");"):
                checks.append(name)
                return
            await asyncio.sleep(0.15)
        observed = await statement("const p=" + CURRENT + ";return {route:p.route,activeTab:p.data.activeTab,mode:p.data.mode,index:p.data.index,total:p.data.total,questionCount:p.data.questionCount,groupCount:p.data.groups&&p.data.groups.length,cardId:p.data.card&&p.data.card.id,ids:p.session&&p.session.ids,phase:p.data.phase,reading:p.data.reading,selfTest:p.data.selfTest,revealed:p.data.revealed,groupId:p.session&&p.session.groupId,themeId:p.session&&p.session.themeId,mnemonicId:p.session&&p.session.mnemonicId,parentKey:p.session&&p.session.parentKey,options:p.options};")
        raise AssertionError(name + ": " + json.dumps(observed, ensure_ascii=False))

    event = lambda data: json.dumps({"currentTarget": {"dataset": data}}, ensure_ascii=False)
    async def footer(label):
        await check(label + "底栏高度已用于内容留白", "p.data.footerHeight>0")
        started = time.monotonic()
        while True:
            raw = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".learning-actions", style_prop="position")))
            if not raw.get("success"):
                raise AssertionError(label + "无法读取底栏尺寸")
            bar = raw["data"]["element"]
            geometry = await statement("const p=" + CURRENT + ";return {windowHeight:wx.getWindowInfo().windowHeight,padding:p.data.footerHeight};")
            if geometry["padding"] >= bar["size"]["height"] + 19 or time.monotonic() - started >= 3:
                break
            await asyncio.sleep(0.15)
        geometry["bar"] = bar
        if bar.get("style", {}).get("position") != "fixed" or abs(bar["offset"]["top"] + bar["size"]["height"] - geometry["windowHeight"]) > 2 or geometry["padding"] < bar["size"]["height"] + 19:
            raise AssertionError(label + "底栏位置或留白错误: " + json.dumps(geometry))
        layouts.append({"state": label, **geometry})
        checks.append(label + "操作固定底部且留白覆盖底栏")
    environment = await evaluate("wx.getAccountInfoSync().miniProgram.envVersion")
    if environment != "develop":
        raise RuntimeError("Only a local develop environment is supported")
    await statement("const keys=['common-sense-learning-v1','common-sense-topic-position-v1'];"
                    "const present=wx.getStorageInfoSync().keys;"
                    "getApp()._csTestBackup=keys.map(key=>({key,existed:present.includes(key),value:wx.getStorageSync(key)}));"
                    "keys.forEach(key=>wx.removeStorageSync(key));return true;")
    try:
        await home()
        await check("首页查阅入口与四学习卡分开", "p.data.features.length===4 && !p.data.features.some(f=>f.id==='topics') && p.data.features.some(f=>f.id==='confusion')")
        await tap(".home-topic-entry")
        await wait_page(TOPICS)
        await check("独立主题汇总行真实点击直达完整目录", "p.data.count===170 && p.data.parts.length===4")
        await home()
        await tap("#learning-entry-qa")
        await wait_page(LEARNING)
        await check("一问一答点击即见首题", "p.data.mode==='qa' && p.data.active && p.data.index===1 && p.data.total===5 && !!p.data.card")
        await check("首题正确答案按展示顺序映射", "p.data.card.options[p.data.card.displayAnswer].text==='李白' && p.data.card.options[p.data.card.displayAnswer].index===p.data.card.answer")
        await statement("const p=" + CURRENT + ";getApp()._csQ0BOptionSeed=p.session.optionSeed;"
                        "getApp()._csQ0BOptionOrder=JSON.stringify(p.data.card.options.map(v=>v.index));return true;")
        await footer("问答未揭晓")
        await check("独立学习页候选覆盖", "p.data.questionCount===606 && p.data.mnemonicCount===129 && p.data.groups.length===133")
        await tap(".learning-header .text-action")
        await check("问答设置读取入口范围和边界", "p.data.settingsOpen && p.content.entryPlans.modes.qa.questionIds.length===606 && p.data.coverageSummary.includes('606') && p.data.entryDescription.includes('已开放主题') && p.data.entryExcludes.length===2")
        rendered = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".settings-panel")))
        if not rendered.get("success") or "每组题数" not in json.dumps(rendered, ensure_ascii=False) or "当前学习范围" in json.dumps(rendered, ensure_ascii=False):
            raise AssertionError("问答设置只展示范围数量")
        checks.append("问答简化设置实际渲染范围和题数")
        await footer("设置保存")
        for selector in ["#scope-all", "#scope-law"]:
            raw = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=selector)))
            el = raw["data"]["element"]
            if el["offset"]["left"] < 0 or el["offset"]["left"] + el["size"]["width"] > 390 or el["size"]["width"] > 80:
                raise AssertionError("设置范围按钮超出屏幕: " + json.dumps(el))
        checks.append("设置首尾范围按钮均在卡片内且不会被全局按钮宽度撑开")
        raw = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".save-settings")))
        if raw["data"]["element"]["size"]["width"] < 340:
            raise AssertionError("底部保存按钮未铺满可用宽度")
        checks.append("底部保存按钮铺满操作栏")
        await tap(".learning-header .text-action")
        await statement("const p=" + CURRENT + ";p.handleStart();p.handleChoice(" + event({"index": 0}) + ");return true;")
        await check("答错后显示解释", "p.data.revealed && p.data.feedback.includes('选错')")
        await check("答错后理由对应实际所选干扰项", "p.data.selectedOptionText==='杜甫' && p.data.correctAnswerText==='李白' && p.data.distractorReason==='诗圣对应杜甫。'")
        rendered = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".distractor-feedback")))
        if not rendered.get("success") or "诗圣对应杜甫" not in json.dumps(rendered, ensure_ascii=False):
            raise AssertionError("所选干扰项理由未实际渲染")
        checks.append("所选干扰项理由实际渲染")
        await statement("const p=" + CURRENT + ";p.handleSource(" + event({"point": "pre-qin-poetry", "tab": "li-bai"}) + ");return true;")
        await wait_page(DETAIL)
        await check("原文精准页签且直接提供完整导读", "p.data.activeTab==='li-bai' && p.data.readingMeta.focus.length>0 && !p.handleGuideToggle")
        rendered = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".note-reading-brief")))
        if not rendered.get("success"):
            raise AssertionError("完整导读未直接渲染")
        checks.append("完整导读无需展开直接渲染")
        await back(LEARNING)
        await check("原文返回保留当前卡、选择与逐项理由", "p.data.card.id==='poet-immortal' && p.data.revealed && p.data.selectedOptionText==='杜甫' && p.data.distractorReason==='诗圣对应杜甫。'")
        await check("原文返回保留选项种子与展示顺序", "p.session.optionSeed===getApp()._csQ0BOptionSeed && JSON.stringify(p.data.card.options.map(v=>v.index))===getApp()._csQ0BOptionOrder")
        await statement("const p=" + CURRENT + ";p.handleNext(" + event({}) + ");return true;")
        await check("学习记录已保存", "!p.data.error && wx.getStorageSync('common-sense-learning-v1').summary.index===2")
        await back(HOME)
        await check("首页不再展示继续上次入口", "!p.data.continueSummary && !p.handleContinue")
        await tap("#learning-entry-qa")
        await wait_page(LEARNING)
        await check("退出后恢复学习", "p.data.index===2 && p.data.card.id==='poet-sage'")
        await home()
        await go(LEARNING, "?mode=exam&variant=review")
        await statement("const p=" + CURRENT + ";p.handleStart();return true;")
        await check("考前回顾接入错题", "p.data.card.id==='poet-immortal' && p.data.total===1")
        await home()
        await go(LEARNING, "?mode=mnemonic&scope=science-technology")
        await check("口诀直达单条阅读与逐句释义", "p.data.reading && p.data.unit==='条' && p.data.expandedId==='sound-memory' && p.data.mnemonic.phrases.length===3 && p.data.mnemonic.excludes.length===2")
        await check("Q2 声音记忆材料升级为结构口诀", "p.data.mnemonic.id==='sound-memory' && p.data.mnemonic.revision===3 && p.data.mnemonic.formLabel==='结构口诀' && p.data.mnemonic.text==='调高低，看频率；响强弱，看振幅；辨来源，看音色。'")
        await footer("口诀阅读与自测")
        await tap(".learning-header .text-action")
        await check("口诀设置明确只覆盖本条目标", "p.data.settingsOpen && p.data.entryDescription.includes('每条口诀') && p.data.entryExcludes.some(v=>v.includes('整节'))")
        await tap(".learning-header .text-action")
        await statement("const p=" + CURRENT + ";p.handleMnemonicTest(" + event({"id": "sound-memory"}) + ");return true;")
        await check("口诀进入独立自测组", "p.data.total===4 && p.data.card.id==='sound-pitch'")
        await check("Q2 声音题使用频率变化情境", "p.data.card.revision===2 && p.data.card.prompt.includes('每秒200次') && p.data.card.options.every(v=>v.text.length===4)")
        await footer("口诀自测及返回")
        await home()
        await go(TOPICS, "?partId=humanities-history")
        await statement("const p=" + CURRENT + ";p.handleChapter(" + event({"id": "humanities-history-1"}) + ");return true;")
        await check("主题汇总同屏篇章切换", "p.data.count===170 && p.data.parts.length===4 && p.data.chapterId==='humanities-history-1'")
        await statement("const p=" + CURRENT + ";const poetry=p.data.sections[0].points.find(v=>v.id==='pre-qin-poetry');"
                        "p.handleTab({currentTarget:{dataset:{id:poetry.id}},detail:{value:poetry.tabs.findIndex(t=>t.id==='bai-juyi')}});return true;")
        await wait_page(DETAIL)
        await check("目录选择具体页签", "p.data.activeTab==='bai-juyi'")
        await home()
        await go(SEARCH, "?moduleId=common-sense")
        await statement("const p=" + CURRENT + ";p._doSearch('白居易');const found=p.data.results.find(r=>r.id==='pre-qin-poetry');"
                        "p.handleResultTap({currentTarget:{dataset:{pointId:found.id,moduleId:'common-sense',tabId:found.matchTabId}}});return true;")
        await wait_page(DETAIL)
        await check("搜索直达白居易页签", "p.data.activeTab==='bai-juyi'")
        await home()
        await go(LEARNING, "?mode=exam&scope=law&variant=review")
        await check("当前领域无个人回顾时呈现空态", "p.data.questionCount===12 && p.data.reviewCount===0")
        await footer("空范围入口")
        await home()
        await go(LEARNING, "?mode=qa&scope=law&groupId=minor-capacity")
        await check("法律主题选择与辨析形式", "p.data.groups.length===4 && p.data.groups.find(g=>g.id==='minor-capacity').form==='辨析题'")
        await statement("const p=" + CURRENT + ";p.handleChoice(" + event({"index": 0}) + ");return true;")
        await check("主题独立成组并保留法律依据", "p.data.total===3 && p.data.card.id==='capacity-under-eight' && p.data.card.verificationLabel.includes('2026-10-22')")
        await check("Q2 行为能力题面与法定类别已更新", "p.data.card.prompt.includes('7周岁') && p.data.card.options.some(v=>v.text==='完全民事行为能力人') && p.data.card.revision===2")
        await home()
        await tap("#learning-entry-qa")
        await wait_page(LEARNING)
        await check("首页续学保留主题身份", "p.session.groupId==='minor-capacity' && p.data.revealed && p.data.card.id==='capacity-under-eight'")
        await home()
        await go(LEARNING, "?mode=exam&scope=law&groupId=inheritance-order")
        await check("考前精选可选独立主题", "p.session.groupId==='inheritance-order' && p.data.total===3 && p.data.card.id==='inherit-first'")
        await check("Q2 继承题改为法律类别辨认", "p.data.card.prompt.includes('配偶、子女、父母') && p.data.card.options.some(v=>v.text==='继承人以外酌情分得遗产的人') && p.data.card.revision===2")
        await tap(".learning-header .text-action")
        await check("考前入口明确精选与个人回顾边界", "p.data.settingsOpen && p.data.entryExcludes.some(v=>v.includes('不代表高频')) && p.data.entryDescription.includes('个人待回顾')")
        rendered = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".settings-panel")))
        if not rendered.get("success") or "主题" in json.dumps(rendered, ensure_ascii=False):
            raise AssertionError("考前设置仍包含主题选择")
        checks.append("考前设置仅提供范围数量，入口边界仍保存在编排资料")
        await home()
        await go(LEARNING, "?mode=mnemonic&scope=law")
        await check("法律口诀保留范围与核验标签", "p.data.reading && p.data.mnemonics.length===2 && p.data.expandedId==='inheritance-order-memory' && p.data.mnemonic.verificationLabel.includes('第1127条') && p.data.mnemonic.verificationLabel.includes('2026-10-22')")
        await check("法定继承仅标为速记提纲", "p.data.mnemonic.id==='inheritance-order-memory' && p.data.mnemonic.formLabel==='速记提纲' && p.data.mnemonic.revision===3")
        rendered = json.loads(await wechat_automator(WechatAutomatorInput(
            action="element_info", auto_port=port, selector=".verification")))
        if not rendered.get("success") or "民法典" not in json.dumps(rendered, ensure_ascii=False):
            raise AssertionError("法律口诀核验依据实际渲染")
        checks.append("法律口诀核验依据实际渲染")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.start('qa','law','selected','','civil-principles-compare',5,'',true));return true;")
        await check("Q2 民法原则按主题刷新为三题", "p.session.groupId==='civil-principles-compare' && p.data.total===3 && p.data.card.id==='civil-equality'")
        await check("Q2 民法原则使用情境辨析和当前核验", "p.data.card.revision===2 && p.data.card.prompt.includes('行政级别') && p.data.card.verificationLabel.includes('2026-10-22')")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.start('qa','law','selected','','constitution-chapters',5,'',true));return true;")
        await check("Q2 宪法章序题无编辑式正文措辞", "p.session.groupId==='constitution-chapters' && p.data.total===3 && p.data.card.revision===2 && !p.data.card.prompt.includes('正文')")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.startReading('law','q2-law-2','constitution-chapters-memory',1,true));return true;")
        await check("Q2 宪法结构口诀可直接阅读", "p.data.reading && p.data.mnemonic.id==='constitution-chapters-memory' && p.data.mnemonic.title==='宪法四章顺序' && p.data.mnemonic.formLabel==='结构口诀'")
        await check("Q2 宪法口诀可按顺序双向还原", "p.data.mnemonic.text==='一总二权义，三机构，四旗歌徽都。' && p.data.mnemonic.revision===3 && p.data.mnemonic.verificationLabel.includes('2026-10-22')")
        await home()
        await go(LEARNING, "?mode=daily")
        await statement("const p=" + CURRENT + ";p.handleStart();getApp()._csDailyIds=JSON.stringify(p.session.ids);"
                        "for(let i=0;i<5 && !p.data.completed;i++)p.handleNext({currentTarget:{dataset:{}}});"
                        "p.handleMenu();p.handleStart();return true;")
        await check("每日同日完成后不生成新组", "p.data.completed && JSON.stringify(p.session.ids)===getApp()._csDailyIds")
        await home()
        await tap("#learning-entry-daily")
        await wait_page(LEARNING)
        await check("每日入口直接恢复同日完成态", "p.data.mode==='daily' && p.data.completed")
        await home()
        await tap("#learning-entry-exam")
        await wait_page(LEARNING)
        await check("考前急救点击即见精选题", "p.data.mode==='exam' && p.data.active && !!p.data.card")
        await home()
        await tap("#learning-entry-confusion")
        await wait_page(LEARNING)
        await check("易混入口独立开学且范围明确", "p.data.mode==='confusion' && p.data.groups.length===4 && p.data.questionCount===12 && p.data.total===3 && p.session.themeId==='minor-capacity'")
        await statement("const p=" + CURRENT + ";p.handleChoice(" + event({"index": 0}) + ");return true;")
        rendered = json.loads(await wechat_automator(WechatAutomatorInput(
            action="element_info", auto_port=port, selector=".explanation")))
        if not rendered.get("success"):
            raise AssertionError("易混答后解释实际渲染")
        checks.append("易混答后解释实际渲染")
        await home()
        await check("易混退出后首页无续学提示", "!p.data.continueSummary")
        await tap("#learning-entry-confusion")
        await wait_page(LEARNING)
        await check("普通易混入口保留已选答案", "p.data.revealed && p.data.index===1 && p.data.card.id==='capacity-under-eight'")
        await statement("const p=" + CURRENT + ";p.handleNext({currentTarget:{dataset:{}}});return true;")
        await check("初判后进入对照且不泄露后题", "p.data.isComparison && p.data.phaseLabel==='差异对照' && !p.data.card && p.data.comparison.rows.length===3")
        await footer("易混差异对照")
        rendered = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".comparison-card")))
        if not rendered.get("success") or "主要生活来源" not in json.dumps(rendered, ensure_ascii=False):
            raise AssertionError("年龄与生活来源条件实际渲染")
        checks.append("年龄与生活来源条件实际渲染")
        await statement("const p=" + CURRENT + ";getApp()._csB3Records=Object.keys(p.engine.state.records).length;return true;")
        await home()
        await check("差异对照退出后首页无续学提示", "!p.data.continueSummary")
        await tap("#learning-entry-confusion")
        await wait_page(LEARNING)
        await check("首页精确恢复对照而非下一题", "p.data.isComparison && !p.data.card && p.session.index===1")
        await tap(".comparison-card .source-link")
        await wait_page(DETAIL)
        await check("对照来源定位行为能力页签", "p.data.activeTab==='behavior-capacity'")
        await back(LEARNING)
        await check("原文返回保留差异对照阶段", "p.data.isComparison && p.data.flowStep===2")
        await tap(".comparison-next")
        await check("看完对照才出现复辨题", "p.data.phase==='recheck' && p.data.card.id==='capacity-eight-plus' && !p.data.revealed && Object.keys(p.engine.state.records).length===getApp()._csB3Records")
        await statement("const p=" + CURRENT + ";p.handleChoice(" + event({"index": 1}) + ");return true;")
        await home()
        await tap("#learning-entry-confusion")
        await wait_page(LEARNING)
        await check("普通易混入口续上复辨题与答案", "p.data.phase==='recheck' && p.data.card.id==='capacity-eight-plus' && p.data.revealed")
        await statement("const p=" + CURRENT + ";p.handleNext({currentTarget:{dataset:{}}});p.handleNext({currentTarget:{dataset:{}}});return true;")
        await check("三题完成并结束三阶段", "p.data.completed && p.data.progressPercent===100 && p.data.phase==='done'")
        await footer("完成后下一组")
        await tap(".next-group")
        await check("完成一组后可轮换另一辨析主题", "p.session.themeId==='civil-principles-compare' && p.data.total===3 && !p.data.completed")
        await statement("const p=" + CURRENT + ";p.handleChoice(" + event({"index": 2}) + ");p.handleNext({currentTarget:{dataset:{}}});return true;")
        await check("民法原则对照具有三项范围与边界", "p.data.isComparison && p.data.comparison.rows.length===3 && p.data.comparison.rows[1].distinction.includes('公序良俗') && p.data.comparison.excludes.length===2")
        await tap(".comparison-next")
        await check("民法原则已进入复辨后才作答", "p.data.phase==='recheck' && p.data.card.id==='civil-voluntary' && !p.data.revealed")
        await statement("const p=" + CURRENT + ";p.handleChoice(" + event({"index": 0}) + ");p.handleNext({currentTarget:{dataset:{}}});p.handleChoice(" + event({"index": 1}) + ");p.handleNext({currentTarget:{dataset:{}}});return true;")
        await check("第二主题可完成初判对照与两题复辨", "p.data.completed && p.data.phase==='done' && p.data.result.correct===3")
        for scope, group, first_id, second_id, tab, label in [
            ("science-technology", "sound-features", "sound-pitch-timbre-scenario", "sound-loudness-condition", "sound-characteristics", "声音三特性"),
            ("humanities-history", "history-genres", "history-three-books-contrast", "history-hanshu-genre", "historiography-works", "史书体例范围"),
        ]:
            await home()
            await go(LEARNING, "?mode=confusion&scope=" + scope + "&groupId=" + group)
            await check(label + "直接进入初判且限定本组", "p.data.phase==='judge' && p.data.card.id===" + json.dumps(first_id) + " && p.data.total===3 && p.session.ids.length===3 && p.data.groups.length===1")
            await statement("const p=" + CURRENT + ";p.handleChoice({currentTarget:{dataset:{index:p.data.card.answer}}});p.handleNext({currentTarget:{dataset:{}}});return true;")
            await check(label + "对照范围完整且无借用法律核验", "p.data.isComparison && !p.data.card && p.data.comparison.rows.length===3 && p.data.comparison.excludes.length===2 && !p.data.comparison.verificationLabel")
            rendered = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".comparison-card")))
            if not rendered.get("success") or "依据：" in json.dumps(rendered, ensure_ascii=False):
                raise AssertionError(label + "存在空依据行或未渲染")
            checks.append(label + "非法律对照实际渲染且无空依据行")
            await home()
            await tap("#learning-entry-confusion")
            await wait_page(LEARNING)
            await check(label + "首页续学恢复对照阶段", "p.data.isComparison && (p.session.groupId||p.session.themeId)===" + json.dumps(group))
            await tap(".comparison-card .source-link")
            await wait_page(DETAIL)
            await check(label + "来源定位正确页签", "p.data.activeTab===" + json.dumps(tab))
            await back(LEARNING)
            await check(label + "原文返回保留对照", "p.data.isComparison && p.data.flowStep===2")
            await tap(".comparison-next")
            await check(label + "继续后出现不同复辨题", "p.data.phase==='recheck' && p.data.card.id===" + json.dumps(second_id) + " && !p.data.revealed")
            await statement("const p=" + CURRENT + ";for(let i=0;i<2;i++){p.handleChoice({currentTarget:{dataset:{index:p.data.card.answer}}});p.handleNext({currentTarget:{dataset:{}}});}return true;")
            await check(label + "两题复辨结束且三题全对", "p.data.completed && p.data.phase==='done' && p.data.result.correct===3")
        await home()
        await go(LEARNING, "?mode=confusion&scope=economics")
        await check("易混空领域不借用其他题", "p.data.questionCount===0 && p.data.groups.length===0 && !p.data.active && !!p.data.notice")
        await home()
        await go(LEARNING, "?mode=qa&scope=economics")
        await tap(".option")
        await statement("const p=" + CURRENT + ";getApp()._csB2Key=p.session.key;getApp()._csB2Card=p.data.card.id;return true;")
        await tap(".learning-header .text-action")
        await check("学习设置在会话内展开", "p.data.settingsOpen && p.data.active && p.data.revealed")
        await tap("#scope-law")
        await tap("#count-15")
        await tap(".save-settings")
        await check("保存设置立即按新范围和题数刷新题库", "!p.data.settingsOpen && p.data.scope==='law' && p.data.count===15 && p.data.total===12 && !p.data.revealed && p.session.key!==getApp()._csB2Key && p.data.card.id!==getApp()._csB2Card")
        await home()
        await tap("#learning-entry-qa")
        await wait_page(LEARNING)
        await check("普通问答入口恢复刷新后的题库", "p.data.scope==='law' && p.data.count===15 && p.data.total===12 && !p.data.revealed")
        rendered = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".session-meta-row")))
        if not rendered.get("success") or "12" not in json.dumps(rendered, ensure_ascii=False):
            raise AssertionError("题数与训练式进度实际渲染")
        checks.append("题数与训练式进度实际渲染")
        await home()
        await tap("#learning-entry-mnemonic")
        await wait_page(LEARNING)
        await check("口诀普通入口直接进入单条阅读", "p.data.reading && !!p.data.mnemonic && p.data.unit==='条'")
        await statement("const p=" + CURRENT + ";getApp()._csB2Mnemonic=p.data.mnemonic.id;getApp()._csB2ReadIndex=p.data.index;return true;")
        await tap(".mnemonic-card .text-action")
        await check("口诀释义可收起且边界仍保留", "!p.data.expandedId && p.data.mnemonic.excludes.length>0")
        await tap(".learning-actions .mnemonic-test")
        await check("单条口诀直接进入对应自测", "p.data.selfTest && p.data.unit==='道' && !!p.session.parentKey && p.session.mnemonicId===getApp()._csB2Mnemonic")
        await statement("const p=" + CURRENT + ";p.handleChoice({currentTarget:{dataset:{index:p.data.card.answer}}});return true;")
        await check("自测选择已保存后再离开", "p.data.revealed && !!p.session.answers[p.data.card.id]")
        await home()
        await check("自测退出后首页无续学提示", "!p.data.continueSummary")
        await tap("#learning-entry-mnemonic")
        await wait_page(LEARNING)
        await check("首页继续可恢复自测答案及父口诀身份", "p.data.selfTest && p.data.revealed && p.session.mnemonicId===getApp()._csB2Mnemonic")
        await tap(".return-reading")
        await check("自测返回原口诀与收起状态", "p.data.reading && p.data.mnemonic.id===getApp()._csB2Mnemonic && p.data.index===getApp()._csB2ReadIndex && !p.data.expandedId")
        await tap(".mnemonic-card .text-action")
        await check("口诀释义展开后可查来源", "!!p.data.expandedId && p.data.mnemonic.phrases.some(v=>v.refs.length>0)")
        await tap(".source-link")
        await wait_page(DETAIL)
        await back(LEARNING)
        await check("口诀查看原文返回仍在原条目", "p.data.reading && p.data.mnemonic.id===getApp()._csB2Mnemonic && !!p.data.expandedId")
        await statement("const p=" + CURRENT + ";getApp()._csB2RecordCount=Object.keys(p.engine.state.records).length;p.handleNext({currentTarget:{dataset:{again:'yes'}}});return true;")
        await check("口诀再看仅保存阅读记录", "p.engine.state.readingRecords[getApp()._csB2Mnemonic].again && Object.keys(p.engine.state.records).length===getApp()._csB2RecordCount")
        await home()
        await check("口诀退出后首页无续学提示", "!p.data.continueSummary")
        await go(LEARNING, "?mode=qa&scope=all")
        await statement("const p=" + CURRENT + ";p.content.entryPlans=JSON.parse(JSON.stringify(p.content.entryPlans));p.content.entryPlans.modes.qa.groupIds=['sound-features'];p.begin();return true;")
        await check("真实页面选题随入口配置收缩为声音五题", "p.data.groups.length===1 && p.data.groups[0].id==='sound-features' && p.data.questionCount===5 && p.data.total===5 && p.session.ids.every(id=>id.startsWith('sound-'))")
        await home()
        await go(LEARNING, "?mode=daily")
        await check("临时改变问答配置不影响每日主题范围", "p.data.groups.length===15 && p.data.questionCount===47 && p.content.entryPlans.modes.daily.maxItems===5")
        await home()
        await go(LEARNING, "?mode=mnemonic&scope=all")
        await tap(".learning-header .text-action")
        await check("口诀设置提供一三五条选项", "p.data.settingsOpen && p.data.readingCountOptions.join(',')==='1,3,5'")
        await tap("#reading-count-1")
        await tap(".save-settings")
        await check("保存条数立即刷新为单条口诀", "!p.data.settingsOpen && p.data.reading && p.data.total===1 && p.session.readingCount===1")
        await footer("单条口诀底栏")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.startReading('science-technology','q0b-label-check','light-phenomena-memory',1));return true;")
        await check("降级记忆材料使用速记提纲标签", "p.data.reading && p.data.mnemonic.id==='light-phenomena-memory' && p.data.mnemonic.formLabel==='速记提纲'")
        await check("Q2 光现象保持对照提纲边界", "p.data.mnemonic.revision===3 && p.data.mnemonic.title==='三类光现象对照' && p.data.mnemonic.text==='影子看直线，倒影看反射，折筷看折射。'")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.start('qa','science-technology','selected','','light-phenomena',5,'',true));return true;")
        await check("Q2 光现象三题可独立成组", "p.session.groupId==='light-phenomena' && p.data.total===3 && p.data.card.id==='light-shadow' && p.data.card.revision===2")
        await check("Q2 影子题使用生活情境且无编辑语言", "p.data.card.prompt.includes('不透明纸板') && !p.data.card.explanation.includes('正文')")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.startReading('science-technology','q2-science-light','light-phenomena-memory',1,true));return true;")
        rendered = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".mnemonic-card")))
        if not rendered.get("success") or "速记提纲" not in json.dumps(rendered, ensure_ascii=False):
            raise AssertionError("速记提纲标签未实际渲染")
        checks.append("速记提纲标签实际渲染")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.startReading('science-technology','q2-science-heat','heat-mechanisms-memory',1,true));return true;")
        await check("Q2 传热记忆资源升级为结构口诀", "p.data.reading && p.data.mnemonic.id==='heat-mechanisms-memory' && p.data.mnemonic.revision===3 && p.data.mnemonic.formLabel==='结构口诀' && p.data.mnemonic.text.includes('热量搬家看路线')")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.start('qa','science-technology','selected','','heat-mechanisms',5,'',true));return true;")
        await check("Q2 传热三题使用具体机制情境", "p.session.groupId==='heat-mechanisms' && p.data.total===3 && p.data.card.id==='heat-conduction' && p.data.card.revision===2 && p.data.card.prompt.includes('金属勺')")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.startReading('science-technology','q2-science-substance','substance-classification-memory',1,true));return true;")
        await check("Q2 物质分类形成两步结构口诀", "p.data.reading && p.data.mnemonic.id==='substance-classification-memory' && p.data.mnemonic.revision===3 && p.data.mnemonic.formLabel==='结构口诀' && p.data.mnemonic.text.includes('先数物质') && p.data.mnemonic.text.includes('纯里数元素')")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.start('qa','science-technology','selected','','substance-classification',5,'',true));return true;")
        await check("Q2 物质分类三题执行两层判断", "p.session.groupId==='substance-classification' && p.data.total===3 && p.data.card.id==='substance-pure' && p.data.card.revision===2 && p.data.card.prompt.includes('蒸馏水')")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.startReading('science-technology','q2-science-si-base','si-base-units-memory',1,true));return true;")
        await check("Q2 七个基本单位保留为速记提纲", "p.data.reading && p.data.mnemonic.id==='si-base-units-memory' && p.data.mnemonic.revision===3 && p.data.mnemonic.formLabel==='速记提纲' && p.data.mnemonic.title==='七个基本单位顺序表'")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.start('qa','science-technology','selected','','si-base-units',5,'',true));return true;")
        await check("Q2 基本单位五题可独立学习", "p.session.groupId==='si-base-units' && p.data.total===5 && p.data.card.id==='si-base-count' && p.data.card.revision===2")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.startReading('science-technology','q2-science-si-derived','si-named-derived-memory',1,true));return true;")
        await check("Q2 具名导出单位保留为对照提纲", "p.data.reading && p.data.mnemonic.id==='si-named-derived-memory' && p.data.mnemonic.revision===2 && p.data.mnemonic.formLabel==='速记提纲' && p.data.mnemonic.title==='八个具名导出单位对照'")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.start('qa','science-technology','selected','','si-named-derived-units',5,'',true));return true;")
        await check("Q2 具名导出单位五题可独立学习", "p.session.groupId==='si-named-derived-units' && p.data.total===5 && p.data.card.id==='si-derived-frequency-force' && p.data.card.revision===2")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.startReading('science-technology','q2-science-light-basics','light-basics-memory',1,true));return true;")
        await check("Q2 光学基础升级为方向结构口诀", "p.data.reading && p.data.mnemonic.id==='light-basics-memory' && p.data.mnemonic.revision===2 && p.data.mnemonic.formLabel==='结构口诀' && p.data.mnemonic.text.includes('光年量长途') && p.data.mnemonic.text.includes('波越短、频越高')")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.start('qa','science-technology','selected','','optics-light-basics',5,'',true));return true;")
        await check("Q2 光学基础五题使用情境判断", "p.session.groupId==='optics-light-basics' && p.data.total===5 && p.data.card.id==='light-electromagnetic-core' && p.data.card.revision===2 && p.data.card.prompt.includes('真空')")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.startReading('science-technology','q2-science-infrared-ultraviolet','infrared-ultraviolet-memory',1,true));return true;")
        await check("Q2 红外紫外形成两端对照口诀", "p.data.reading && p.data.mnemonic.id==='infrared-ultraviolet-memory' && p.data.mnemonic.revision===2 && p.data.mnemonic.formLabel==='结构口诀' && p.data.mnemonic.text.includes('红外在红外') && p.data.mnemonic.text.includes('紫外在紫外')")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.start('qa','science-technology','selected','','optics-infrared-ultraviolet',5,'',true));return true;")
        await check("Q2 红外紫外五题可独立学习", "p.session.groupId==='optics-infrared-ultraviolet' && p.data.total===5 && p.data.card.id==='infrared-wavelength-core' && p.data.card.revision===2 && p.data.card.prompt.includes('红端之外')")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.start('qa','humanities-history','selected','','q1-modern-treaty-contrast',5));return true;")
        await check("Q1 条约试点按主题进入三题学习组", "p.session.groupId==='q1-modern-treaty-contrast' && p.data.total===3 && p.data.card.id==='q1-treaty-quick-recall'")
        await statement("const p=" + CURRENT + ";const wrong=p.data.card.options.find(v=>v.index!==p.data.card.answer).index;p.handleChoice({currentTarget:{dataset:{index:wrong}}});return true;")
        await check("Q1 条约错项显示逐项理由", "p.data.revealed && p.data.distractorReason.length>0 && p.data.correctAnswerText==='《南京条约》'")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.start('qa','economics','selected','','q1-market-failure',5));return true;")
        await check("Q1 市场失灵试点按主题进入三题学习组", "p.session.groupId==='q1-market-failure' && p.data.total===3 && p.data.card.id==='q1-market-quick-recall'")
        await statement("const p=" + CURRENT + ";p.acceptSession(p.engine.startReading('humanities-history','q1-devtools','q1-modern-treaty-contrast-memory',1));return true;")
        await check("Q1 条约记忆资源使用结构口诀标签", "p.data.reading && p.data.mnemonic.id==='q1-modern-treaty-contrast-memory' && p.data.mnemonic.formLabel==='结构口诀' && p.data.mnemonic.phrases.length===3")
        rendered = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".mnemonic-card")))
        if not rendered.get("success") or "结构口诀" not in json.dumps(rendered, ensure_ascii=False):
            raise AssertionError("Q1 结构口诀标签未实际渲染")
        checks.append("Q1 结构口诀标签实际渲染")
        await home()
        rendered = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".shortcut-title")))
        if not rendered.get("success") or "按领域查阅" not in json.dumps(rendered, ensure_ascii=False):
            raise AssertionError("领域快捷入口缺少标题")
        checks.append("首页领域快捷入口具有按领域查阅标题")
        rendered = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".home-topic-entry")))
        if not rendered.get("success") or "全部常识" not in json.dumps(rendered, ensure_ascii=False):
            raise AssertionError("全部知识入口名称未更新")
        checks.append("首页全部常识名称清晰")
        await tap(".home-topic-entry")
        await wait_page(TOPICS)
        rendered = json.loads(await wechat_automator(WechatAutomatorInput(action="element_info", auto_port=port, selector=".heading")))
        if not rendered.get("success") or "全部常识" not in json.dumps(rendered, ensure_ascii=False):
            raise AssertionError("目录页面标题不一致")
        checks.append("全部常识目录标题一致")
    finally:
        restored = await statement("(getApp()._csTestBackup||[]).forEach(v=>v.existed?wx.setStorageSync(v.key,v.value):wx.removeStorageSync(v.key));"
                                   "delete getApp()._csTestBackup;delete getApp()._csDailyIds;delete getApp()._csB3Records;Object.keys(getApp()).filter(k=>k.startsWith('_csB2')||k.startsWith('_csQ0B')).forEach(k=>delete getApp()[k]);return true;")
        await home()
    return {"passed": True, "checks": checks, "layouts": layouts, "environment": environment,
            "automationPort": port, "storageRestored": restored, "deviceUXAccepted": False,
            "uploaded": False, "notificationsSent": False}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=9421)
    args = parser.parse_args()
    try:
        print(json.dumps(asyncio.run(run(args.port)), ensure_ascii=False, indent=2))
    except Exception as exc:
        print(json.dumps({"passed": False, "error": str(exc)}, ensure_ascii=False))
        raise SystemExit(1)
