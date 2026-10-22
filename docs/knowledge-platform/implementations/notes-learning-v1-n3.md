# N3 基础快练实施记录

日期：2026-10-21。分支：`codex/notes-learning-exploration`。仅本地开发候选，未提交、合并、上传或发布。人工内容批准、320px与真机体验仍待完成。

基础入口已实际消费固定单选与两个原数值配方，默认5题、支持下一组改5/10/15题和科目专题。会话冻结实例、选择与解析，恢复不重新生成数值题；查笔记前先保存，原生返回恢复同一题、提交阶段与滚动位置。查阅后答对单列辅助完成。

改动：`practice/index.{js,wxml,wxss,json}`；`services/practice-runtime.js`、`practice-session.js`、`training-launch.js`；`detail/index.{js,wxml}`；`components/note-example/index.js`；`models/notes-entry.js`、学习内容源与生成包；`app.json`仅新增笔记分包页面声明。共3道基础固定候选与2个数值配方；同题族两道概念变式不在同组重复。

笔记的30处旧训练链接已统一解析，原先4处误走普通训练页的链接改进到对应专页；专项训练继续独立记结果。损坏存储须用户主动重建笔记记录，失败保存不跳走，不改其他模块记录。多页面引擎写入前读取最新状态，防止互相覆盖。

[N3阶段证据](evidence/notes-learning-v1-n3-validation.json)保留15项基础检查与10文件离线编译。最终[20项基础、16项页面回归](evidence/notes-learning-v1-n8-validation.json)包含完整往返、数值提交重开、设置下一组、空范围、保存失败和30处旧路由验证。测试曾有一次大量隔离上下文的Node进程退出139；改为缓存编译页面工厂后累计检查通过，未将该退出归因为产品故障。

演示：首页→基础快练→选择→对应笔记→返回基础快练→提交→下一题／完成→下一组。实际设备全路径待验。按持续推进授权进入N4。
