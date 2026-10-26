# 核心卡片按钮居中与目录淡化（待用户视觉确认）

基线8dc58871aa9c3fe1c8ee5eca6eb948ba5ee85761；修改前恢复引用 refs/codex/checkpoints/politics-core-centered-before-20261026。本轮候选引用 refs/codex/checkpoints/politics-core-centered-candidate-20261026。

仅改政治首页index.wxml/index.wxss：每日标题、说明和可选真实当前位置放左侧；原动态主按钮放右侧，以flex align-items:center相对整个卡片垂直居中。卡片采用现有padding token按内容自然撑高，不锁屏幕坐标、不缩小字号。真实有进度时高度121.09375→104.2890625px，无进度合法ready展示时79.09375px。目录原图外部opacity=.45，原颜色/路径不动，箭头旁增加两字“进入”，整卡点击保持，目录高度75.7421875px不变。四学习卡及其他模块未改。

[修改前整页](before.png) · [当前整页](after-progress.png) · [每日局部](after-progress-daily.png) · [目录局部](after-progress-directory.png) · [无进度每日局部](after-no-progress-daily.png)。均来自428px当前微信开发者工具；局部为对应原始截图的精确像素裁切，未重绘或缩放。执行端已实际查看，按钮居中，文字不挤压，进入提示与目录图/箭头分离。无进度状态沿用前批服务产生的合法ready展示投影，只临时setData，完成后refreshDecision已恢复真实active、1/4项、继续练习，未修改业务或用户记录。

25项现有交互回归、政治首页/每日12场景回归、92项离线WCC/WCSC编译通过；实际IDE刷新后的当前构建截图已确认。几何检查通过：两种状态按钮与卡片中心线误差小于0.5px、文案与按钮不重叠、目录和四学习卡高度不变。SVG原件和政治首页JS与基线逐字节相同。只验证当前428px模拟器；320px沿用用户不测要求，未新增真机或其他屏宽证据，不宣称最终视觉验收。

未改main、共享组件、四张学习卡、底部TAB、其他模块或业务规则；未合并、推送或发布。等待用户视觉确认。本目录manifest保存产品、原SVG、保护文件与证据哈希，verify.py提供只读核验。恢复时先比较分支和并发修改，勿直接reset/clean覆盖后续成果。
