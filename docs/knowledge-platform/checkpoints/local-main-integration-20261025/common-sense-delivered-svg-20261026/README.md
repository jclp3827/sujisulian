# 常识判断首页交付 SVG 接入 checkpoint（2026-10-26）

六处虚线占位已替换为交付 SVG。最终尺寸依据用户后续明确的要求：**目录卡和四张学习卡分别对齐政治理论样板的对应规格**。因此沿用样板的响应式图形列、44–48px 圆形底座和 80% 学习图形缩放，替代资产接入初始建议中的固定 48px / 30–34px 规格。常识文案、入口顺序和业务状态保持。

## 版本、保护与恢复

- 工作树：`/Users/jmac/WeChatProjects/miniprogram-ui-main-baseline-20261025`；分支：`codex/ui-main-baseline-20261025`。
- 原 HEAD：`07f6317a8489f3d9393bf1c4d318f567c29843b4`；main：`d5032323cdf4d61edfec6f93ee4e7c181c165c50`，均保持。
- 修改前独立快照：`ec16a0b21469a4d42b247f4f2e7270d8332365e4`，引用 `refs/codex/checkpoints/common-sense-svg-before-20261026`。完整保全接手时常识 WXML/WXSS、笔记 WXML/WXSS及回归脚本五份未提交文件。
- 最终独立快照：`refs/codex/checkpoints/common-sense-svg-candidate-20261026`；以修改前快照为父提交，只加入本批资源、局部适配和证据。
- 两份快照通过临时 Git 索引写入专用引用；**没有改变工作分支 HEAD 或现有暂存区**。笔记、政治及政治六 SVG 的受保护字节与接手时相同；未合并、推送或发布。

恢复时，在不存在的新路径从上述引用建立新的隔离工作树；不要覆盖当前未提交成果。`git rev-parse refs/codex/checkpoints/common-sense-svg-candidate-20261026` 可读取最终提交身份。对本批的精确审查范围是两个专用引用之间的差异。

同目录外部证据目录另保存 Git bundle 与回执：`/Users/jmac/.codex/visualizations/2026/10/26/01a17784-1c4a-77c2-85e5-8b47ece523b5/common-sense-delivered-svg/`。bundle 以前述原 HEAD 为已有依赖，不冒称可独立克隆整个仓库。

## 本批修改文件

| 路径 | 修改 |
|---|---|
| `miniprogram/pages/common-sense/index.wxml` | 六处占位改为本地 image / aspectFit；事件、文案、数量绑定和页面顺序保持 |
| `miniprogram/pages/common-sense/index.wxss` | 每日背景图、目录外框及学习图形的局部容器/比例/光学中心适配；尺寸规则对齐政治样板 |
| `miniprogram/images/common-sense-home/delivered-v1/*.svg` | 六份原始 SVG，逐字节复制 |
| `scripts/validate-module-home-interactions.js` | 只增加六条精确资源路径的保护名单；既有断言保留 |
| 本目录及总 README 的索引 | 截图、测量、日志、SHA-256、原始交付说明、恢复与只读校验 |

[本批产品差异](product.patch)、[源码 SHA-256](source-files.json)、[接手状态](baseline.json)。常识 JS/JSON、按领域查阅的四个按钮及其原始模板字节保持；政治、笔记、训练、真正首页、照片、五 TAB、知识内容、题目、判分、历史、进度、收藏、路由、持久化和会话规则没有本批代码变更。

## 六枚资产与加载方式

| 入口 | 文件 | 最终外部展示方式 |
|---|---|---|
| 每日常识 | `daily-common-sense.svg` | 右侧大型绝对定位背景，16% 不透明度、z-index 0；文字与按钮在前景，不占流式排版空间 |
| 全部知识 | `all-knowledge.svg` | 与政治相同的 52×52px image 外框、相同光学校准；可见主体约 41×40px |
| 一问一答 | `one-question-one-answer.svg` | 浅蓝圆底，按政治第一学习卡的可见最大边等比校准 |
| 知识导读 | `knowledge-guide.svg` | 冷蓝圆底，按政治第二学习卡等比校准 |
| 易混辨析 | `concept-comparison.svg` | 浅紫圆底；SVG 与政治同语义图标逐字节相同，外部缩放相同 |
| 考前急救 | `exam-rescue.svg` | 浅橙圆底，按政治第四学习卡的可见最大边等比校准 |

原包 SHA-256：`7b235119cce5e5314e23623e0fb70a88ca521b0a27ff1fdbcc71f43bdb387322`。[资产来源与静态审查](asset-provenance.json)、[原包 README](asset-README.md)、[原包附带说明](asset-CODEX-INSTRUCTIONS.md)保留。附带文字作为交付材料存档，最终施工权限和规格以用户请求及后续明确指令为准。

六图均为 128×128 viewBox，仅含 svg/path/rect/circle 基础图元，没有外链、字体、脚本或嵌入图片。目录及辨析图与受保护政治原件相同。全部 SVG 原始路径、颜色、比例和文件字节保持；圆形底色仅在 WXSS 容器。采用项目已有的本地 SVG + image / aspectFit 方式，当前 IDE 两种屏宽均实际显示，未生成运行时 PNG。该证据不等于物理 iOS/Android 兼容验收；[运行时信息](matched-runtime-info.json)另存。

## 同屏样板几何验证

政治页仅被读取和截图，源码未改。两个屏宽分别采集政治样板和常识候选，并用同一组字段比对。下表为本次 IDE 运行时实测，源码继续使用样板的响应式规则，没有硬编码卡片高度。

| 屏宽 | 目录卡：政治 / 常识 | 学习卡：政治 / 常识 | 圆底：政治 / 常识 | 标题左边界：政治 / 常识 |
|---|---|---|---|---|
| 375px | 66.789 / 66.789px | 四张均 62 / 62px | 四枚均 44 / 44px | 五处均 83 / 83px |
| 390px | 66.789 / 66.789px | 四张均 62 / 62px | 四枚均 44 / 44px | 五处均 83 / 83px |

目录外框、文字起点、图形列、右侧箭头位置逐项匹配；四枚学习图形按原始可见范围等比校准，可见最大边与对应政治图形之差小于 0.05 逻辑 px。图形本身长宽比保持，不拉伸。

[375px 参考匹配](matched-narrow-reference-match.json)、[390px 参考匹配](matched-standard-reference-match.json)、[375px 政治量测](politics-reference-narrow-grid.json)、[390px 政治量测](politics-reference-standard-grid.json)。每日常识卡在 375px 修改前后均为 114.789px，原渐变、按钮位置、「最多 5 道」及真实动作保持；目录仍为独立浅绿重点卡，「进入」与箭头保留，小节数仍绑定 `titlePointCount`。

## 截图证据

| 场景 | 原始上屏 / 底屏 | 完整内容拼接 | 核心卡局部 | 四张学习卡局部 |
|---|---|---|---|---|
| 修改前 375px | [上屏](before-narrow.png) / [底屏](before-narrow-bottom.png) | [完整内容](before-narrow-full-content-stitched.png) | [核心卡](before-narrow-core.png) | [学习卡](before-narrow-learning.png) |
| 最终 375px | [上屏](matched-narrow.png) / [底屏](matched-narrow-bottom.png) | [完整内容](matched-narrow-full-content-stitched.png) | [核心卡](matched-narrow-core.png) | [学习卡](matched-narrow-learning.png) |
| 最终 390px | [上屏](matched-standard.png) / [底屏](matched-standard-bottom.png) | [完整内容](matched-standard-full-content-stitched.png) | [核心卡](matched-standard-core.png) | [学习卡](matched-standard-learning.png) |

375px 修改前后是相同设备设置：375×812 屏幕、375×721 窗口、DPR 3；官方原始上屏 PNG 均为 **698×1512**，完整内容拼接均为 **698×1716**。390px 为用户切换后的另一组实际标准屏，原始 PNG 为 696×1504。没有用系统信息 mock 冒充真实屏宽。

`full-content-stitched` 明确是两张官方原始截图的无缩放像素拼接：顶部、固定 TAB 各保留一次，省略空白底部 padding，完整展示所有实际内容。局部图为原像素裁切，保留源 ICC 色彩配置，没有重绘、重采样、调色或锐化。[拼接与裁切坐标](visual-derivatives.json)可追溯到原图。375px 首屏下方需要正常滚动；底屏实图包含完整第四学习卡和四个领域入口，没有通过缩字号或截断文本强塞首屏。

执行端实际查看了最终两种屏宽的图形和局部：六图可识别，目录完整，四枚小图清楚；按钮文字及箭头未被背景图遮挡；滚动后学习卡和领域入口完整可见。政治对照原图：[375px](politics-reference-narrow.png)、[390px](politics-reference-standard.png)。这些都是当前开发者工具模拟器证据，最终视觉接受仍由用户确认。

## 回归、交互与数据边界

| 命令 | 结果 | 原始日志 |
|---|---|---|
| `node scripts/validate-module-home-interactions.js` | 25 项通过 | [入口与搜索](matched-interaction.txt) |
| `node scripts/validate-common-sense-learning.js` | 57 项通过 | [常识学习](matched-common-learning.txt) |
| `python3 scripts/validate-integrated-template-compile.py` | 92 项离线 WCC/WCSC 通过 | [离线编译](matched-offline-compile.txt) |

每日、全部知识、四学习方式及搜索共七个入口均实际点击核对原导航 URL；[目标回执](matched-nav-hook-targets.json)。这七次采用临时导航拦截，避免进入学习页改变记录，接口[已恢复](matched-nav-hook-restored.json)；不将其说成七个目标页完整往返。随后真实打开[常识搜索页](matched-search.png)并原生返回；最终 `grep -i error` 输出为空。四个领域入口由原模板字节保护及既有 develop/trial 路由回归覆盖。

首页业务 data 与修改前相同，比较时仅排除平台 `__webviewId__`。本次最终导航验收前后全部缓存指纹一致。较早过程原始截图到最终验收前，`common-sense-learning-v1` 与 `notesDirectory:v1:position` 两键指纹发生变化，未审计触发者；当前缓存予以保全，没有回写或重置，也不声称整个会话全存储不变。[状态指纹记录](state-fingerprints.json)不包含原始缓存内容。

[验证汇总](validation.json)区分了静态/控制器回归、离线编译、模拟器真实显示、导航目标核对与实际搜索往返。本轮没有新增真机证据，没有将刷新触发成功当作 IDE 整包编译通过，也没有改变旧政治全树封印。

## 只读校验

最终引用创建后，从仓库任意位置运行本目录 `verify.py`。它校验本目录文件 SHA-256、冻结提交中的产品与保护文件字节，以及候选相对恢复点的精确修改范围。不会修改文件、缓存、Git 索引或引用。

本轮停止在独立 checkpoint 与用户视觉确认处，不自行推广其他模块或合并 main。
