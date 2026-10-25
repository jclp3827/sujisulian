# N6 范围、混编和跨入口联调

日期：2026-10-21。分支：`codex/notes-learning-exploration`。仅本地开发候选，未提交、合并、上传或发布。人工内容批准、320px与真机体验仍待完成。

详情增加“练本知识点／练本专题”，每种方式只有显式入口清单中存在有效资源才显示。选题交集同时受方式、科目、专题和知识点约束，不把其他方式混入。保存设置只影响下一组，原有活动实例不重排。

改动：`detail/index.js/wxml`范围入口；`services/practice-session.js`去重、题族、材料与轮换；`practice/index.js/wxml`内容呈现和恢复；`validate-notes-learning.js`、`validate-notes-learning-pages.js`相应行为测试。

固定题同题族同组只取一题，新组按已出现组数优先轮换，跳过也不会使首个变式永久占位；数值配方实例按实际题干去重。共用材料先确认再整组纳入，6题材料遇5题目标不会永久延后；材料题不会因同题干去重而被拆散。材料在已练过后让未练的小题获得轮换机会。

[最终20项基础与16项页面检查](evidence/notes-learning-v1-n8-validation.json)通过，包含同一资源跨显式获准入口共用身份、只撤一个入口不影响其他组、材料独立版本失效、精确范围直达、三个方式会话隔离。[50份原始JSON与其他模块保护核验](evidence/notes-learning-v1-n8-preservation.json)通过。自动结果不替代云图与真机体验。按持续推进授权进入N7的已定义子批。
