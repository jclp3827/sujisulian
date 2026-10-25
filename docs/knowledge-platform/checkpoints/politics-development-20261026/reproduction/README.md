# 隔离回归复现

在隔离副本编译运行候选前端，保持 `getApp().globalData.readingUiValidationProject` 为 `reading-reuse-20261025-9440`，连接端口 9440。应用源码与 checkpoint 相同，唯一额外内容是 app.js 的验证标识。不要在用户项目注入夹具。

创建 `/tmp/politics-checkpoint-reproduction-output/` 与 `/tmp/politics-checkpoint-audit/runtime/`；依次使用本目录 run-sdk.py 调用 runtime-check.js、route-list-check.js、reader-flow-check.js。runner 的桥接工具绝对路径属于本机已安装依赖，不是产品依赖；换机器需配置对应已安装桥接工具。三个脚本自带所需夹具，finally 恢复隔离项目原存储。禁止并发运行。原始本轮收据在 ../runtime，不需要修改旧证据或重新生成题库。
