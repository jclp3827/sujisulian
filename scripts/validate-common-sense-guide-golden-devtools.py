#!/usr/bin/env python3
"""Validate the knowledge-guide golden sample in an existing local DevTools session.

The check uses only the isolated golden-sample storage key, restores it on exit,
and verifies that the formal guide key is byte-for-byte unchanged.
"""
import argparse
import asyncio
import json
import time

from wechat_devtools_mcp.models.schemas import WechatAutomatorInput
from wechat_devtools_mcp.tools.automator import wechat_automator


LEARNING = "subpackages/common-sense/learning/index"
DETAIL = "subpackages/common-sense/detail/index"
CURRENT = "getCurrentPages().slice(-1)[0]"
GOLDEN_KEY = "common-sense-guide-v1:golden-v1"
FORMAL_KEY = "common-sense-guide-v1"


async def run(port):
    checks = []

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
                "const p=" + CURRENT + ";return {route:p.route,goldenSample:p.data.goldenSample,"
                "groupId:p.data.guideGroup&&p.data.guideGroup.id,cardId:p.data.guideCard&&p.data.guideCard.id,"
                "index:p.data.index,total:p.data.total,completed:p.data.completed,notice:p.data.notice};"
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
        raise RuntimeError("Golden sample is intentionally available only in develop mode")

    backup = await statement(
        "const keys=" + json.dumps([GOLDEN_KEY, FORMAL_KEY]) + ";"
        "const present=wx.getStorageInfoSync().keys;"
        "return keys.map(key=>({key,existed:present.includes(key),value:wx.getStorageSync(key)}));"
    )
    formal_before = await statement(
        "return JSON.stringify(wx.getStorageSync(" + json.dumps(FORMAL_KEY) + ")||null);"
    )
    await statement("wx.removeStorageSync(" + json.dumps(GOLDEN_KEY) + ");return true;")

    try:
        url = "/" + LEARNING + "?mode=guide&sample=golden-v1&groupId=physics&count=5"
        await evaluate("wx.reLaunch({url:" + json.dumps(url) + "})")
        await wait_page(LEARNING)

        await require("黄金样例开发入口生效", "p.data.goldenSample===true && p.data.title==='知识导读样例'")
        await require("物理样例按五张成组", "p.data.guideGroup.id==='physics' && p.data.total===5")
        await require(
            "候选与 HOLD 数量准确",
            "p.guideContent.stats.cards===15 && p.guideContent.stats.holds===3 && p.guideContent.groups.length===6",
        )
        await require(
            "HOLD 内容不进入可学习题库",
            "p.guideContent.holds.length===3 && !p.guideContent.cardById['physics::overweight-weightlessness'] && "
            "!p.guideContent.cardById['physics::high-speed-train-pressure'] && "
            "!p.guideContent.cardById['exchange-rate-effects::capital-flow']",
        )
        await require(
            "首卡保留稳定来源定位",
            "p.data.guideCard.id==='physics::force-three-elements' && p.data.guideCard.pointId==='physics' && p.data.guideCard.tabId.length>0",
        )

        banner = await element_text(".preview-note")
        card = await element_text(".guide-card")
        actions = await element_text(".guide-assess-grid")
        if "15 张候选卡" not in banner or "力的三要素" not in card:
            raise AssertionError("黄金样例标识或首卡未实际渲染")
        if not all(label in actions for label in ["记住了", "有点模糊", "没想起", "跳过"]):
            raise AssertionError("四档记忆标记未完整渲染")
        checks.extend(["黄金样例标识与知识卡实际渲染", "四档记忆标记实际渲染"])

        await statement(
            "const p=" + CURRENT + ";"
            "p.handleGuideAssess({currentTarget:{dataset:{result:'fuzzy'}}});return true;"
        )
        await require(
            "记忆标记推进当前组",
            "p.data.index===2 && p.guideSession.assessments['physics::force-three-elements'].status==='fuzzy'",
        )
        await require(
            "样例进度写入独立键",
            "!!wx.getStorageSync(" + json.dumps(GOLDEN_KEY) + ").summary",
        )
        formal_after = await statement(
            "return JSON.stringify(wx.getStorageSync(" + json.dumps(FORMAL_KEY) + ")||null);"
        )
        if formal_after != formal_before:
            raise AssertionError("Formal guide progress changed during golden-sample validation")
        checks.append("正式知识导读进度保持不变")

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
            "原文返回保留样例与当前进度",
            "p.data.goldenSample===true && p.data.index===2 && p.data.guideCard.id===" + json.dumps(source["id"]),
        )
    finally:
        await statement(
            "const backup=" + json.dumps(backup, ensure_ascii=False) + ";"
            "backup.forEach(v=>v.existed?wx.setStorageSync(v.key,v.value):wx.removeStorageSync(v.key));return true;"
        )

    return {"checks": checks, "count": len(checks), "route": "/" + LEARNING + "?mode=guide&sample=golden-v1&groupId=physics&count=5"}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, required=True)
    args = parser.parse_args()
    print(json.dumps(asyncio.run(run(args.port)), ensure_ascii=False, indent=2))
